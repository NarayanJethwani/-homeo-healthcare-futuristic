import {
  metaGraphFetch,
  META_GRAPH_API_VERSION,
  META_GRAPH_BASE_URL,
  redactSensitiveString,
} from "./client";
import {
  MetaAccountsResponse,
  MetaConnectionRecord,
  MetaDebugTokenResponse,
  MetaInstagramAccountDetails,
  MetaOAuthTokenResponse,
  MetaPageAccountItem,
} from "./types";

export const TARGET_FACEBOOK_PAGE_ID = "61559659413532";
export const TARGET_FACEBOOK_PAGE_NAME = "Homeo.Healthcare";
export const META_OAUTH_COOKIE = "meta_oauth_state";

export const DEFAULT_META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "instagram_basic",
  "instagram_content_publish",
];

export interface MetaAppCredentials {
  appId: string;
  appSecret: string;
  redirectUri: string;
}

/**
 * Validates and retrieves server-side Meta app credentials.
 */
export function getMetaAppCredentials(): MetaAppCredentials {
  const appId = (process.env.META_APP_ID || "").trim();
  const appSecret = (process.env.META_APP_SECRET || "").trim();
  const redirectUri = (process.env.META_REDIRECT_URI || "").trim();

  if (!appId || !appSecret) {
    throw new Error(
      "Meta App configuration missing: META_APP_ID and META_APP_SECRET must be set in environment."
    );
  }

  if (!redirectUri) {
    throw new Error(
      "Meta App configuration missing: META_REDIRECT_URI must be set in environment."
    );
  }

  return { appId, appSecret, redirectUri };
}

/**
 * Generates the user-facing OAuth authorization dialog URL.
 */
export function getMetaOAuthLoginUrl(csrfState: string): string {
  const { appId, redirectUri } = getMetaAppCredentials();
  const scopeParam = DEFAULT_META_SCOPES.join(",");

  const url = new URL(`https://www.facebook.com/${META_GRAPH_API_VERSION}/dialog/oauth`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", csrfState);
  url.searchParams.set("scope", scopeParam);
  url.searchParams.set("response_type", "code");

  return url.toString();
}

/**
 * Exchanges authorization code for short-lived user access token.
 */
export async function exchangeCodeForUserToken(code: string): Promise<MetaOAuthTokenResponse> {
  const { appId, appSecret, redirectUri } = getMetaAppCredentials();

  return metaGraphFetch<MetaOAuthTokenResponse>("oauth/access_token", {
    method: "GET",
    params: {
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    },
  });
}

/**
 * Exchanges short-lived user token for a 60-day long-lived user token.
 */
export async function exchangeForLongLivedUserToken(
  shortLivedToken: string
): Promise<MetaOAuthTokenResponse> {
  const { appId, appSecret } = getMetaAppCredentials();

  return metaGraphFetch<MetaOAuthTokenResponse>("oauth/access_token", {
    method: "GET",
    params: {
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortLivedToken,
    },
  });
}

/**
 * Inspects a token to determine expiration and validity.
 */
export async function inspectToken(inputToken: string): Promise<MetaDebugTokenResponse> {
  const { appId, appSecret } = getMetaAppCredentials();
  const appAccessToken = `${appId}|${appSecret}`;

  return metaGraphFetch<MetaDebugTokenResponse>("debug_token", {
    method: "GET",
    params: {
      input_token: inputToken,
      access_token: appAccessToken,
    },
  });
}

/**
 * Retrieves the user's managed Facebook Pages and discovers linked Instagram accounts.
 */
export async function fetchManagedPages(
  userAccessToken: string
): Promise<MetaAccountsResponse> {
  return metaGraphFetch<MetaAccountsResponse>("me/accounts", {
    method: "GET",
    accessToken: userAccessToken,
    params: {
      fields: "id,name,access_token,category,tasks,instagram_business_account{id,username}",
      limit: 50,
    },
  });
}

/**
 * Fetches additional profile details for a connected Instagram account.
 */
export async function fetchInstagramDetails(
  instagramAccountId: string,
  pageAccessToken: string
): Promise<MetaInstagramAccountDetails | null> {
  try {
    return await metaGraphFetch<MetaInstagramAccountDetails>(instagramAccountId, {
      method: "GET",
      accessToken: pageAccessToken,
      params: {
        fields: "id,username,name,profile_picture_url",
      },
    });
  } catch {
    return null;
  }
}

/**
 * Completes the full OAuth code exchange flow:
 * 1. Code -> Short token
 * 2. Short token -> Long-lived token
 * 3. Inspects token expiration
 * 4. Finds Target Homeo Healthcare Page or best match
 * 5. Discovers linked Instagram Business account
 * 6. Returns secure internal connection record
 */
export async function resolveMetaConnection(
  code: string,
  adminUser: { uid: string; email?: string; name?: string; role?: string }
): Promise<MetaConnectionRecord> {
  const { appId } = getMetaAppCredentials();

  // 1. Short-lived token
  const shortTokenResp = await exchangeCodeForUserToken(code);
  const shortToken = shortTokenResp.access_token;

  // 2. Long-lived token
  const longTokenResp = await exchangeForLongLivedUserToken(shortToken);
  const userAccessToken = longTokenResp.access_token;

  // 3. Inspect expiration
  let expiresAt = Math.floor(Date.now() / 1000) + (longTokenResp.expires_in || 60 * 86400);
  try {
    const debugInfo = await inspectToken(userAccessToken);
    if (debugInfo.data?.expires_at) {
      expiresAt = debugInfo.data.expires_at;
    }
  } catch {
    // Keep fallback estimate
  }

  // 4. Fetch managed pages
  const pagesResp = await fetchManagedPages(userAccessToken);
  const pages = pagesResp.data || [];

  if (pages.length === 0) {
    throw new Error(
      "No Facebook Pages found for this account. Ensure you have admin access to Homeo.Healthcare."
    );
  }

  // Priority match: TARGET_FACEBOOK_PAGE_ID ('61559659413532') or TARGET_FACEBOOK_PAGE_NAME ('Homeo.Healthcare')
  let selectedPage = pages.find(
    (p) =>
      p.id === TARGET_FACEBOOK_PAGE_ID ||
      p.name.toLowerCase().includes("homeo")
  );

  if (!selectedPage) {
    selectedPage = pages[0];
  }

  let instagramAccountId: string | undefined = selectedPage.instagram_business_account?.id;
  let instagramUsername: string | undefined = selectedPage.instagram_business_account?.username;

  // If username wasn't returned in the nested field, query it directly using the page access token
  if (instagramAccountId && !instagramUsername) {
    const igDetails = await fetchInstagramDetails(instagramAccountId, selectedPage.access_token);
    if (igDetails?.username) {
      instagramUsername = igDetails.username;
    }
  }

  const now = new Date().toISOString();

  return {
    status: "connected",
    appId,
    userAccessToken,
    userAccessTokenExpiresAt: expiresAt,
    pageId: selectedPage.id,
    pageName: selectedPage.name,
    pageAccessToken: selectedPage.access_token,
    instagramAccountId,
    instagramUsername,
    scopes: DEFAULT_META_SCOPES,
    connectedAt: now,
    connectedBy: {
      uid: adminUser.uid,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    },
    updatedAt: now,
  };
}
