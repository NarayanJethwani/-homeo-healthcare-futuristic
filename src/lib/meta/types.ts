export type SocialPlatform = "facebook" | "instagram";

export type MetaConnectionState = "connected" | "disconnected" | "expired" | "unconfigured" | "error";

/**
 * Public/Sanitized connection status sent to admin frontend.
 * NEVER includes tokens, app secrets, or sensitive hashes.
 */
export interface MetaConnectionStatus {
  connected: boolean;
  status: MetaConnectionState;
  reconnectRequired: boolean;
  pageId?: string;
  pageName?: string;
  instagramAccountId?: string;
  instagramUsername?: string;
  tokenExpiresAt?: string;
  scopes?: string[];
  lastCheckedAt?: string;
  errorMessage?: string;
}

/**
 * Server-only secure record stored in Firestore at system_settings/meta_connection.
 * Never exposed to client SDK or API response payloads.
 */
export interface MetaConnectionRecord {
  status: "connected" | "disconnected" | "expired";
  appId: string;
  userAccessToken: string;
  userAccessTokenExpiresAt: number; // Unix timestamp in seconds
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  instagramAccountId?: string;
  instagramUsername?: string;
  scopes: string[];
  connectedAt: string;
  connectedBy: {
    uid: string;
    email?: string;
    name?: string;
    role?: string;
  };
  updatedAt: string;
}

/**
 * Cryptographic state payload for OAuth CSRF protection.
 */
export interface MetaOAuthState {
  csrfToken: string;
  adminUid: string;
  createdAt: number;
  returnTo?: string;
}

/**
 * Meta Graph API Token Responses
 */
export interface MetaOAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number; // seconds
}

export interface MetaDebugTokenResponse {
  data: {
    app_id: string;
    type: string;
    application: string;
    data_access_expires_at: number;
    expires_at: number;
    is_valid: boolean;
    scopes: string[];
    user_id: string;
  };
}

export interface MetaPageAccountItem {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  tasks?: string[];
  instagram_business_account?: {
    id: string;
    username?: string;
  };
}

export interface MetaAccountsResponse {
  data: MetaPageAccountItem[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface MetaInstagramAccountDetails {
  id: string;
  username?: string;
  name?: string;
  profile_picture_url?: string;
}

/**
 * Graph API Error structure
 */
export interface MetaGraphApiErrorBody {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    error_user_title?: string;
    error_user_msg?: string;
    fbtrace_id?: string;
  };
}

/**
 * Sanitized error for logging and client responses.
 */
export interface SanitizedMetaError {
  message: string;
  code: number;
  subcode?: number;
  userMessage?: string;
}

/**
 * Publishing Request & Results
 */
export interface PublishPostRequest {
  caption: string;
  platforms: SocialPlatform[];
  mediaUrl?: string;
}

export interface PlatformPublishResult {
  success: boolean;
  postId?: string;
  mediaId?: string;
  error?: string;
}

export interface PublishPostResponse {
  success: boolean;
  overallStatus: "success" | "partial" | "failed";
  facebook?: PlatformPublishResult;
  instagram?: PlatformPublishResult;
  recordId?: string;
}

/**
 * Audit record stored in Firestore collection 'social_posts'.
 * Isolated from clinical/patient data.
 */
export interface SocialPostRecord {
  id: string;
  caption: string;
  platforms: SocialPlatform[];
  mediaUrl?: string;
  status: "success" | "partial" | "failed";
  facebookResult?: PlatformPublishResult;
  instagramResult?: PlatformPublishResult;
  publishedBy: {
    uid: string;
    email?: string;
    name?: string;
  };
  createdAt: string;
}
