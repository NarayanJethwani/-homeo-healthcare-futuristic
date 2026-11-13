import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  MetaConnectionRecord,
  MetaConnectionStatus,
  SocialPostRecord,
} from "./types";

export const META_SETTINGS_COLLECTION = "system_settings";
export const META_CONNECTION_DOC_ID = "meta_connection";
export const SOCIAL_POSTS_COLLECTION = "social_posts";

/**
 * Saves the secure Meta connection record in system_settings/meta_connection.
 * Server-only Firebase Admin access.
 */
export async function saveMetaConnection(record: MetaConnectionRecord): Promise<void> {
  const db = getAdminDb();
  await db
    .collection(META_SETTINGS_COLLECTION)
    .doc(META_CONNECTION_DOC_ID)
    .set(record, { merge: true });
}

/**
 * Retrieves the raw Meta connection record (contains access tokens; server-side only).
 */
export async function getMetaConnection(): Promise<MetaConnectionRecord | null> {
  const db = getAdminDb();
  const snapshot = await db
    .collection(META_SETTINGS_COLLECTION)
    .doc(META_CONNECTION_DOC_ID)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as MetaConnectionRecord;
}

/**
 * Disconnects the Meta connection by updating the record status.
 */
export async function disconnectMetaConnection(): Promise<void> {
  const db = getAdminDb();
  await db
    .collection(META_SETTINGS_COLLECTION)
    .doc(META_CONNECTION_DOC_ID)
    .set(
      {
        status: "disconnected",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
}

/**
 * Produces a sanitized, token-free status representation safe to send to the admin client.
 */
export async function getSanitizedConnectionStatus(): Promise<MetaConnectionStatus> {
  const hasAppId = !!process.env.META_APP_ID;
  const hasAppSecret = !!process.env.META_APP_SECRET;

  if (!hasAppId || !hasAppSecret) {
    return {
      connected: false,
      status: "unconfigured",
      reconnectRequired: false,
      errorMessage: "Meta App ID or App Secret is not configured in the server environment.",
    };
  }

  try {
    const record = await getMetaConnection();

    if (!record || record.status === "disconnected") {
      return {
        connected: false,
        status: "disconnected",
        reconnectRequired: false,
      };
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const isExpired = record.userAccessTokenExpiresAt <= nowSeconds;
    // Reconnect recommended if expires in less than 7 days
    const reconnectRequired =
      isExpired || record.userAccessTokenExpiresAt - nowSeconds < 7 * 86400;

    let expiresAtIso: string | undefined;
    if (record.userAccessTokenExpiresAt) {
      expiresAtIso = new Date(record.userAccessTokenExpiresAt * 1000).toISOString();
    }

    return {
      connected: !isExpired && record.status === "connected",
      status: isExpired ? "expired" : record.status,
      reconnectRequired,
      pageId: record.pageId,
      pageName: record.pageName,
      instagramAccountId: record.instagramAccountId,
      instagramUsername: record.instagramUsername,
      tokenExpiresAt: expiresAtIso,
      scopes: record.scopes,
      lastCheckedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      status: "error",
      reconnectRequired: false,
      errorMessage: errorMsg,
    };
  }
}

/**
 * Saves a social publishing log entry into the social_posts collection.
 * Completely isolated from patients or clinical records.
 */
export async function saveSocialPostRecord(record: SocialPostRecord): Promise<void> {
  const db = getAdminDb();
  await db.collection(SOCIAL_POSTS_COLLECTION).doc(record.id).set(record);
}

/**
 * Retrieves recent social posts history for the admin dashboard.
 */
export async function getRecentSocialPosts(limitCount = 20): Promise<SocialPostRecord[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(SOCIAL_POSTS_COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc: any) => doc.data() as SocialPostRecord);
  } catch {
    return [];
  }
}
