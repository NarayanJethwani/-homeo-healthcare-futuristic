import "./setupEnv";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";
import { createAdminSessionCookie, ADMIN_SESSION_COOKIE } from "../src/lib/adminSession";

async function run() {
  process.env.ADMIN_SESSION_SECRET = "test-admin-session-secret-32-chars-long";

  // 1. Anonymous request to /admin/dashboard redirects to login with next param
  const req1 = new NextRequest("https://www.homeo.healthcare/admin/dashboard");
  const res1 = await proxy(req1);
  assert.equal(res1.status, 307);
  const location1 = res1.headers.get("location") || "";
  assert.ok(location1.includes("/admin/login?next=%2Fadmin%2Fdashboard"), "Anonymous dashboard request must redirect to login");
  console.log("[Admin Proxy Test] PASS: Anonymous /admin/dashboard redirected to login.");

  // 2. Root /admin or /admin/ redirects to /admin/login
  const req2 = new NextRequest("https://www.homeo.healthcare/admin");
  const res2 = await proxy(req2);
  assert.equal(res2.status, 307);
  const location2 = res2.headers.get("location") || "";
  assert.ok(location2.includes("/admin/login"), "Root /admin must redirect to login");
  console.log("[Admin Proxy Test] PASS: Anonymous /admin redirected to login.");

  // 3. Anonymous /api/admin/users request returns 401 JSON
  const req3 = new NextRequest("https://www.homeo.healthcare/api/admin/users");
  const res3 = await proxy(req3);
  assert.equal(res3.status, 401);
  const body3 = await res3.json();
  assert.deepEqual(body3, {
    ok: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Authentication required."
    }
  });
  console.log("[Admin Proxy Test] PASS: Anonymous /api/admin/users returns HTTP 401.");

  // 4. Permitted public entrypoints (/admin/login, /api/admin/session) return 200 without session
  const req4a = new NextRequest("https://www.homeo.healthcare/admin/login");
  const res4a = await proxy(req4a);
  assert.equal(res4a.status, 200);

  const req4b = new NextRequest("https://www.homeo.healthcare/api/admin/session");
  const res4b = await proxy(req4b);
  assert.equal(res4b.status, 200);
  console.log("[Admin Proxy Test] PASS: Permitted entrypoints allowed without session.");

  // Routes which only share an entrypoint prefix must remain protected.
  const req4c = new NextRequest("https://www.homeo.healthcare/api/admin/session-debug");
  const res4c = await proxy(req4c);
  assert.equal(res4c.status, 401);
  console.log("[Admin Proxy Test] PASS: Public entrypoint exception is exact.");

  // 5. Valid signed session cookie allows access to /admin/dashboard
  const validCookie = await createAdminSessionCookie({
    uid: "admin-user-123",
    email: "doctor@homeo.healthcare",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 3600
  });

  const req5 = new NextRequest("https://www.homeo.healthcare/admin/dashboard", {
    headers: {
      cookie: `${ADMIN_SESSION_COOKIE}=${validCookie}`
    }
  });
  const res5 = await proxy(req5);
  assert.equal(res5.status, 200);
  assert.equal(res5.headers.get("Cache-Control"), "private, no-store, no-cache, must-revalidate");
  assert.equal(res5.headers.get("Pragma"), "no-cache");
  console.log("[Admin Proxy Test] PASS: Valid admin session cookie grants access.");

  // 6. Tampered cookie signature is rejected
  const tamperedCookie = validCookie.slice(0, -4) + "XXXX";
  const req6 = new NextRequest("https://www.homeo.healthcare/admin/dashboard", {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${tamperedCookie}` }
  });
  const res6 = await proxy(req6);
  assert.equal(res6.status, 307);

  const req6Api = new NextRequest("https://www.homeo.healthcare/api/admin/users", {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${tamperedCookie}` }
  });
  const res6Api = await proxy(req6Api);
  assert.equal(res6Api.status, 401);
  console.log("[Admin Proxy Test] PASS: Tampered session cookie rejected.");

  // 7. Expired session cookie is rejected
  const expiredCookie = await createAdminSessionCookie({
    uid: "admin-user-123",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) - 300
  });
  const req7 = new NextRequest("https://www.homeo.healthcare/admin/dashboard", {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${expiredCookie}` }
  });
  const res7 = await proxy(req7);
  assert.equal(res7.status, 307);

  const req7Api = new NextRequest("https://www.homeo.healthcare/api/admin/users", {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${expiredCookie}` }
  });
  const res7Api = await proxy(req7Api);
  assert.equal(res7Api.status, 401);
  console.log("[Admin Proxy Test] PASS: Expired session cookie rejected.");

  // 8. Fails closed in production mode if ADMIN_SESSION_SECRET is missing
  process.env.NODE_ENV = "production";
  delete process.env.ADMIN_SESSION_SECRET;

  const req8 = new NextRequest("https://www.homeo.healthcare/admin/dashboard", {
    headers: { cookie: `${ADMIN_SESSION_COOKIE}=${validCookie}` }
  });
  const res8 = await proxy(req8);
  assert.equal(res8.status, 307, "Missing secret in production must fail closed and redirect");
  console.log("[Admin Proxy Test] PASS: Missing ADMIN_SESSION_SECRET in production fails closed.");

  // 9. Verify dashboard source does not rely on localStorage as sole authorization boundary
  const dashboardSource = fs.readFileSync(
    path.join(process.cwd(), "src/app/admin/dashboard/page.tsx"),
    "utf8"
  );
  assert.ok(dashboardSource.includes("if (!session)"), "Dashboard component must enforce session loading gate");
  console.log("[Admin Proxy Test] PASS: Dashboard source verified to require session before rendering UI.");

  console.log("All Admin Proxy & Session Security tests passed successfully.");
}

run().catch((error) => {
  console.error("Admin Proxy Security Test Failure:", error);
  process.exit(1);
});
