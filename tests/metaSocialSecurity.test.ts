import "./setupEnv";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { createAdminSessionCookie, ADMIN_SESSION_COOKIE } from "../src/lib/adminSession";
import { redactSensitiveString, sanitizeMetaError, META_GRAPH_API_VERSION } from "../src/lib/meta/client";
import { getSanitizedConnectionStatus, saveMetaConnection, disconnectMetaConnection } from "../src/lib/meta/storage";
import { GET as authHandler, META_OAUTH_COOKIE } from "../src/app/api/admin/social/auth/route";
import { GET as statusHandler } from "../src/app/api/admin/social/status/route";
import { POST as disconnectHandler } from "../src/app/api/admin/social/disconnect/route";
import { GET as callbackHandler } from "../src/app/api/admin/social/callback/route";

async function run() {
  process.env.ADMIN_SESSION_SECRET = "test-admin-session-secret-32-chars-long";
  process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
  process.env.META_APP_ID = "123456789012345";
  process.env.META_APP_SECRET = "mock-meta-app-secret-abcdef";
  process.env.META_REDIRECT_URI = "http://localhost:3000/api/admin/social/callback";

  console.log("--- Starting Meta Social Security & Integration Tests ---");

  // 1. Clinical Isolation Boundary: Verify no meta files query or mention 'patients' collection
  const metaDir = path.resolve(__dirname, "../src/lib/meta");
  const metaFiles = fs.readdirSync(metaDir);
  for (const file of metaFiles) {
    const content = fs.readFileSync(path.join(metaDir, file), "utf-8");
    assert.ok(
      !content.includes('collection("patients")') && !content.includes("collection('patients')"),
      `Isolation Violation: ${file} must not reference the patients collection.`
    );
  }
  console.log("[PASS] 1. Clinical Isolation Boundary: Zero references to 'patients' collection in Meta library.");

  // 2. Secret & Token Redaction Verification
  const leakedUrl = "https://graph.facebook.com/v21.0/oauth/access_token?client_id=123&client_secret=SECRET999&code=AUTHCODE777&access_token=EAAB123456789";
  const redacted = redactSensitiveString(leakedUrl);
  assert.ok(!redacted.includes("SECRET999"), "App Secret must be redacted");
  assert.ok(!redacted.includes("AUTHCODE777"), "Auth Code must be redacted");
  assert.ok(!redacted.includes("EAAB123456789"), "Access Token must be redacted");
  assert.ok(redacted.includes("[REDACTED]"), "Must contain [REDACTED] markers");

  const sanitizedErr = sanitizeMetaError(new Error(`Failed with access_token=EAABsecret and client_secret=verysecret`));
  assert.ok(!sanitizedErr.message.includes("EAABsecret"), "Token must not appear in sanitized error");
  assert.ok(!sanitizedErr.message.includes("verysecret"), "Secret must not appear in sanitized error");
  console.log("[PASS] 2. Sensitive Data Redaction: Access tokens, app secrets, and codes are scrubbed.");

  // 3. Graph API Version is configurable and explicit
  assert.ok(typeof META_GRAPH_API_VERSION === "string" && META_GRAPH_API_VERSION.startsWith("v"), "Graph API version must be defined");
  console.log(`[PASS] 3. Graph API version configured: ${META_GRAPH_API_VERSION}`);

  // 4. Token-Free Sanitized Status Verification
  await saveMetaConnection({
    status: "connected",
    appId: "123456789012345",
    userAccessToken: "SECRET_USER_TOKEN_12345",
    userAccessTokenExpiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
    pageId: "61559659413532",
    pageName: "Homeo.Healthcare",
    pageAccessToken: "SECRET_PAGE_TOKEN_67890",
    instagramAccountId: "17841400000000000",
    instagramUsername: "drpooja_homeo.healthcare",
    scopes: ["pages_show_list", "pages_manage_posts", "instagram_basic", "instagram_content_publish"],
    connectedAt: new Date().toISOString(),
    connectedBy: { uid: "admin-uid-1", email: "admin@homeo.healthcare", role: "super-admin" },
    updatedAt: new Date().toISOString(),
  });

  const sanitizedStatus = await getSanitizedConnectionStatus();
  assert.equal(sanitizedStatus.connected, true);
  assert.equal(sanitizedStatus.status, "connected");
  assert.equal(sanitizedStatus.pageId, "61559659413532");
  assert.equal(sanitizedStatus.pageName, "Homeo.Healthcare");
  assert.equal(sanitizedStatus.instagramAccountId, "17841400000000000");
  assert.equal(sanitizedStatus.instagramUsername, "drpooja_homeo.healthcare");
  // Check that NO secret token property exists on the sanitized status object
  assert.equal((sanitizedStatus as any).userAccessToken, undefined);
  assert.equal((sanitizedStatus as any).pageAccessToken, undefined);
  assert.equal((sanitizedStatus as any).appSecret, undefined);
  console.log("[PASS] 4. Sanitized Status: No tokens or secrets exist in sanitized connection response.");

  // 5. Auth API Route Protection
  const adminCookie = await createAdminSessionCookie({
    uid: "admin-1",
    email: "admin@homeo.healthcare",
    role: "super-admin",
    exp: Math.floor(Date.now() / 1000) + 3600,
  });

  const doctorCookie = await createAdminSessionCookie({
    uid: "doc-1",
    email: "doctor@homeo.healthcare",
    role: "read-only-admin",
    exp: Math.floor(Date.now() / 1000) + 3600,
  });

  // Anonymous request to /api/admin/social/auth -> 401
  const anonAuthReq = new NextRequest("http://localhost:3000/api/admin/social/auth");
  const anonAuthRes = await authHandler(anonAuthReq);
  assert.equal(anonAuthRes.status, 401, "Anonymous auth request must return 401");

  // Doctor request to /api/admin/social/auth -> 401 (doctor/read-only-admin cannot access social)
  const docAuthReq = new NextRequest("http://localhost:3000/api/admin/social/auth", {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${doctorCookie}` },
  });
  const docAuthRes = await authHandler(docAuthReq);
  assert.equal(docAuthRes.status, 401, "Doctor/read-only request to social auth must be rejected");

  // Super-admin request to /api/admin/social/auth (JSON mode) -> 200 with OAuth URL & Cookie
  const adminAuthReq = new NextRequest("http://localhost:3000/api/admin/social/auth", {
    headers: {
      cookie: `${ADMIN_SESSION_COOKIE}=${adminCookie}`,
      accept: "application/json",
    },
  });
  const adminAuthRes = await authHandler(adminAuthReq);
  assert.equal(adminAuthRes.status, 200);
  const adminAuthBody = await adminAuthRes.json();
  assert.equal(adminAuthBody.ok, true);
  assert.ok(adminAuthBody.url.includes("facebook.com"), "Must return Facebook OAuth dialog URL");
  assert.ok(adminAuthBody.url.includes("client_id=123456789012345"), "Must include client_id");
  assert.ok(adminAuthRes.cookies.get(META_OAUTH_COOKIE)?.value, "Must set CSRF state cookie");
  console.log("[PASS] 5. Auth API Security: Strict super-admin/admin role enforcement and CSRF generation.");

  // 6. Status API Route Protection
  const anonStatusReq = new NextRequest("http://localhost:3000/api/admin/social/status");
  const anonStatusRes = await statusHandler(anonStatusReq);
  assert.equal(anonStatusRes.status, 401);

  const adminStatusReq = new NextRequest("http://localhost:3000/api/admin/social/status", {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${adminCookie}` },
  });
  const adminStatusRes = await statusHandler(adminStatusReq);
  assert.equal(adminStatusRes.status, 200);
  const statusBody = await adminStatusRes.json();
  assert.equal(statusBody.ok, true);
  assert.equal(statusBody.data.pageId, "61559659413532");
  assert.equal(statusBody.data.userAccessToken, undefined, "Zero token leakage in API response");
  console.log("[PASS] 6. Status API Security: Verified sanitized data and role enforcement.");

  // 7. CSRF Verification in OAuth Callback
  const invalidCallbackReq = new NextRequest("http://localhost:3000/api/admin/social/callback?code=mock_code&state=forged_state");
  const invalidCallbackRes = await callbackHandler(invalidCallbackReq);
  assert.equal(invalidCallbackRes.status, 307);
  const errLocation = invalidCallbackRes.headers.get("location") || "";
  assert.ok(errLocation.includes("error="), "Tampered state must trigger error redirect");
  console.log("[PASS] 7. OAuth Callback CSRF Security: Forged state parameter safely rejected.");

  // 8. Disconnect API Route
  const adminDisconnectReq = new NextRequest("http://localhost:3000/api/admin/social/disconnect", {
    method: "POST",
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${adminCookie}` },
  });
  const adminDisconnectRes = await disconnectHandler(adminDisconnectReq);
  assert.equal(adminDisconnectRes.status, 200);
  const afterDisconnect = await getSanitizedConnectionStatus();
  assert.equal(afterDisconnect.connected, false);
  assert.equal(afterDisconnect.status, "disconnected");
  console.log("[PASS] 8. Disconnect API: Channel disconnection properly recorded.");

  console.log("\n>>> ALL META SOCIAL SECURITY & INTEGRATION TESTS PASSED! <<<");
}

run().catch((err) => {
  console.error("Meta Social Test Failed:", err);
  process.exit(1);
});
