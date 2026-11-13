import { MetaGraphApiErrorBody, SanitizedMetaError } from "./types";

/**
 * Configurable Graph API version.
 * Defaults to 'v21.0', but can be overridden via META_GRAPH_API_VERSION env variable.
 */
export const META_GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v21.0";
export const META_GRAPH_BASE_URL = "https://graph.facebook.com";

/**
 * Custom error class for Meta Graph API interactions.
 * Guarantees no sensitive tokens or secrets leak into stack traces or logs.
 */
export class MetaGraphError extends Error {
  public code: number;
  public subcode?: number;
  public fbtraceId?: string;
  public userMessage?: string;
  public isRateLimit: boolean;
  public isAuthError: boolean;

  constructor(sanitized: SanitizedMetaError, fbtraceId?: string) {
    super(sanitized.message);
    this.name = "MetaGraphError";
    this.code = sanitized.code;
    this.subcode = sanitized.subcode;
    this.fbtraceId = fbtraceId;
    this.userMessage = sanitized.userMessage;
    this.isRateLimit = [4, 17, 32, 613].includes(sanitized.code);
    this.isAuthError = sanitized.code === 190 || sanitized.code === 102;
  }
}

/**
 * Redacts access tokens, app secrets, and authorization codes from arbitrary text/URLs.
 */
export function redactSensitiveString(text: string): string {
  if (!text) return "";
  return text
    .replace(/(access_token=)[^&]+/gi, "$1[REDACTED]")
    .replace(/(client_secret=)[^&]+/gi, "$1[REDACTED]")
    .replace(/(code=)[^&]+/gi, "$1[REDACTED]")
    .replace(/(appsecret_proof=)[^&]+/gi, "$1[REDACTED]");
}

/**
 * Sanitizes an incoming Graph API error body or exception into a safe structure.
 */
export function sanitizeMetaError(error: unknown): SanitizedMetaError {
  if (error instanceof MetaGraphError) {
    return {
      message: error.message,
      code: error.code,
      subcode: error.subcode,
      userMessage: error.userMessage,
    };
  }

  if (typeof error === "object" && error !== null) {
    const maybeBody = error as Partial<MetaGraphApiErrorBody>;
    if (maybeBody.error) {
      const err = maybeBody.error;
      let userMsg = err.error_user_msg || err.error_user_title;
      if (err.code === 190) {
        userMsg = "The Meta access token has expired or is invalid. Please reconnect in Admin.";
      } else if ([4, 17, 32, 613].includes(err.code)) {
        userMsg = "Meta API rate limit reached. Please wait a few minutes and try again.";
      }

      return {
        message: redactSensitiveString(err.message || "Meta API error occurred"),
        code: err.code || 500,
        subcode: err.error_subcode,
        userMessage: userMsg ? redactSensitiveString(userMsg) : undefined,
      };
    }
  }

  const rawMsg = error instanceof Error ? error.message : String(error);
  return {
    message: redactSensitiveString(rawMsg),
    code: 500,
    userMessage: "An unexpected Meta communication error occurred.",
  };
}

export interface MetaFetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  accessToken?: string;
  skipVersionPrefix?: boolean;
}

/**
 * Executes a typed request to Meta Graph API with automatic versioning,
 * parameter encoding, and security scrubbing.
 */
export async function metaGraphFetch<T>(
  endpoint: string,
  options: MetaFetchOptions = {}
): Promise<T> {
  const {
    params = {},
    accessToken,
    skipVersionPrefix = false,
    headers = {},
    ...customInit
  } = options;

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const pathPrefix = skipVersionPrefix ? "" : `${META_GRAPH_API_VERSION}/`;
  const url = new URL(`${META_GRAPH_BASE_URL}/${pathPrefix}${cleanEndpoint}`);

  // Query parameters
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.set(key, String(val));
    }
  });

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (accessToken) {
    requestHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      ...customInit,
      headers: requestHeaders,
    });
  } catch (netErr: unknown) {
    const sanitized = sanitizeMetaError(netErr);
    throw new MetaGraphError(sanitized);
  }

  let jsonBody: any = null;
  const text = await response.text();
  try {
    jsonBody = text ? JSON.parse(text) : {};
  } catch {
    jsonBody = { rawText: text };
  }

  if (!response.ok || (jsonBody && jsonBody.error)) {
    const sanitized = sanitizeMetaError(jsonBody);
    const traceId = jsonBody?.error?.fbtrace_id;
    throw new MetaGraphError(sanitized, traceId);
  }

  return jsonBody as T;
}
