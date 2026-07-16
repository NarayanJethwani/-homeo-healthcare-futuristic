import { NextRequest, NextResponse } from "next/server";

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimitOptions = {
  maxRequests: number;
  windowMs: number;
  now?: number;
};

export type ValidatedRepertorizationPayload = {
  patientId: string;
  selectedRubrics: Array<{
    rubricId: string;
    severity?: number;
    frequency?: "constant" | "frequent" | "occasional";
    impact?: "mild" | "moderate" | "severe";
  }>;
};

export const MAX_REPERTORIZATION_BODY_BYTES = 64 * 1024;
export const MAX_REPERTORIZATION_RUBRICS = 50;

const rateLimitWindows = new Map<string, number[]>();
const MAX_RATE_LIMIT_KEYS = 2_000;
const SAFE_IDENTIFIER = /^[\p{L}\p{N}._:-]+$/u;
const ALLOWED_FREQUENCIES = new Set(["constant", "frequent", "occasional"]);
const ALLOWED_IMPACTS = new Set(["mild", "moderate", "severe"]);

function boundedString(value: unknown, maximum: number): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= maximum &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

export function consumeRepertoryRateLimit(
  scope: string,
  subject: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = options.now ?? Date.now();
  const key = `${scope}:${subject}`;
  const previous = rateLimitWindows.get(key) || [];
  const active = previous.filter((timestamp) => now - timestamp < options.windowMs);

  if (active.length >= options.maxRequests) {
    const oldest = active[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((options.windowMs - (now - oldest)) / 1000)),
    };
  }

  active.push(now);
  rateLimitWindows.set(key, active);

  if (rateLimitWindows.size > MAX_RATE_LIMIT_KEYS) {
    for (const [candidateKey, timestamps] of rateLimitWindows) {
      if (timestamps.every((timestamp) => now - timestamp >= options.windowMs)) {
        rateLimitWindows.delete(candidateKey);
      }
      if (rateLimitWindows.size <= MAX_RATE_LIMIT_KEYS) break;
    }

    // Serverless instances can receive many active identities in the same
    // window. Keep the fallback limiter strictly bounded even when none of
    // the entries has expired yet; production-wide enforcement belongs at
    // the edge, while this guard protects the process from unbounded growth.
    while (rateLimitWindows.size > MAX_RATE_LIMIT_KEYS) {
      const oldestKey = rateLimitWindows.keys().next().value as string | undefined;
      if (!oldestKey) break;
      rateLimitWindows.delete(oldestKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many repertory requests. Please wait and try again.",
      },
    },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

export function validateRepertorySearchParams(searchParams: URLSearchParams):
  | {
      valid: true;
      value: {
        q: string;
        category: string;
        organSystem: string;
        miasm: string;
        remedy: string;
        sourceId: string;
        page: number;
        pageSize: number;
      };
    }
  | { valid: false; message: string } {
  const q = (searchParams.get("q") || "").trim();
  if (q.length > 160) return { valid: false, message: "Search query is too long." };
  if (q.split(/\s+/).filter((token) => token.length > 2).length > 5) {
    return { valid: false, message: "Search query exceeds five searchable terms." };
  }

  const readFilter = (name: string): string | null => {
    const value = searchParams.get(name) || "All";
    return value.length <= 80 && !/[\u0000-\u001f\u007f]/.test(value) ? value : null;
  };

  const category = readFilter("category");
  const organSystem = readFilter("organSystem");
  const miasm = readFilter("miasm");
  const remedy = readFilter("remedy");
  const sourceId = readFilter("sourceId");
  if ([category, organSystem, miasm, remedy, sourceId].some((value) => value === null)) {
    return { valid: false, message: "A search filter is invalid or too long." };
  }

  const pageRaw = searchParams.get("page") || "1";
  const pageSizeRaw = searchParams.get("pageSize") || "50";
  if (!/^\d+$/.test(pageRaw) || !/^\d+$/.test(pageSizeRaw)) {
    return { valid: false, message: "Pagination values must be positive integers." };
  }
  const page = Number(pageRaw);
  const pageSize = Number(pageSizeRaw);
  if (!Number.isSafeInteger(page) || page < 1 || page > 10_000) {
    return { valid: false, message: "Page is outside the supported range." };
  }
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 50) {
    return { valid: false, message: "Page size must be between 1 and 50." };
  }

  return {
    valid: true,
    value: {
      q: q.toLowerCase(),
      category: category!,
      organSystem: organSystem!,
      miasm: miasm!,
      remedy: remedy!,
      sourceId: sourceId!,
      page,
      pageSize,
    },
  };
}

export function validateRepertorizationPayload(value: unknown):
  | { valid: true; value: ValidatedRepertorizationPayload }
  | { valid: false; message: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { valid: false, message: "Request body must be an object." };
  }

  const body = value as Record<string, unknown>;
  const unexpectedBodyKeys = Object.keys(body).filter(
    (key) => key !== "patientId" && key !== "selectedRubrics"
  );
  if (unexpectedBodyKeys.length > 0) {
    return { valid: false, message: "Request body contains unsupported fields." };
  }
  const patientId = body.patientId === undefined ? "unassigned" : body.patientId;
  if (!boundedString(patientId, 128) || !SAFE_IDENTIFIER.test(patientId)) {
    return { valid: false, message: "Patient identifier is invalid." };
  }

  if (!Array.isArray(body.selectedRubrics) || body.selectedRubrics.length === 0) {
    return { valid: false, message: "At least one rubric is required." };
  }
  if (body.selectedRubrics.length > MAX_REPERTORIZATION_RUBRICS) {
    return { valid: false, message: `A maximum of ${MAX_REPERTORIZATION_RUBRICS} rubrics is supported.` };
  }

  const selectedRubrics: ValidatedRepertorizationPayload["selectedRubrics"] = [];
  for (const entry of body.selectedRubrics) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return { valid: false, message: "Each selected rubric must be an object." };
    }
    const rubric = entry as Record<string, unknown>;
    const unexpectedRubricKeys = Object.keys(rubric).filter(
      (key) => !["rubricId", "severity", "frequency", "impact"].includes(key)
    );
    if (unexpectedRubricKeys.length > 0) {
      return { valid: false, message: "A selected rubric contains unsupported fields." };
    }
    if (!boundedString(rubric.rubricId, 160) || !SAFE_IDENTIFIER.test(rubric.rubricId)) {
      return { valid: false, message: "A rubric identifier is invalid." };
    }
    if (
      rubric.severity !== undefined &&
      (typeof rubric.severity !== "number" || !Number.isFinite(rubric.severity) || rubric.severity < 0 || rubric.severity > 10)
    ) {
      return { valid: false, message: "Rubric severity must be between 0 and 10." };
    }
    if (
      rubric.frequency !== undefined &&
      (!boundedString(rubric.frequency, 40) || !ALLOWED_FREQUENCIES.has(rubric.frequency))
    ) {
      return { valid: false, message: "Rubric frequency is invalid." };
    }
    if (
      rubric.impact !== undefined &&
      (!boundedString(rubric.impact, 40) || !ALLOWED_IMPACTS.has(rubric.impact))
    ) {
      return { valid: false, message: "Rubric impact is invalid." };
    }
    selectedRubrics.push({
      rubricId: rubric.rubricId,
      severity: rubric.severity as number | undefined,
      frequency: rubric.frequency as ValidatedRepertorizationPayload["selectedRubrics"][number]["frequency"],
      impact: rubric.impact as ValidatedRepertorizationPayload["selectedRubrics"][number]["impact"],
    });
  }

  return { valid: true, value: { patientId, selectedRubrics } };
}

export function resetRepertoryRateLimitsForTests(): void {
  rateLimitWindows.clear();
}

export async function readAndBoundRequestBody(
  request: NextRequest,
  limitBytes: number
): Promise<string> {
  if (!request.body) {
    return "";
  }

  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    reader = request.body.getReader();
  } catch (e) {
    throw new Error("STREAM_READ_FAILED");
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        totalBytes += value.length;
        if (totalBytes > limitBytes) {
          await reader.cancel().catch(() => {});
          throw new Error("PAYLOAD_TOO_LARGE");
        }
        chunks.push(value);
      }
    }
  } catch (error: any) {
    if (error.message === "PAYLOAD_TOO_LARGE") {
      throw error;
    }
    throw new Error("STREAM_READ_FAILED");
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(combined);
}
