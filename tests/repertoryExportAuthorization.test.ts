/* eslint-disable @typescript-eslint/no-require-imports */
process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
process.env.NODE_ENV = "test";
process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "mock-project-id";
process.env.REPERTORY_DOCTOR_PILOT_ENABLED = "true";
process.env.REPERTORY_DOCTOR_PILOT_UIDS = "doctor-authorized,doctor-unauthorized,doctor-expired,doctor-suspended";

import assert from "assert";
import { NextRequest } from "next/server";
import { AdminRole } from "../src/lib/security/rbac";

// Dynamic require to prevent TS import hoisting from running before env initialization
const { authorizeRepertoryExportRequest } = require("../src/features/repertory/access/RepertoryRequestAuthorization");
const { createAdminSessionCookie } = require("../src/lib/adminSession");
const { memoryPractitionerAccounts } = require("../src/features/admin-users/practitionerRepository");

// Seed memory database
const now = new Date();
const expTime = Math.floor(now.getTime() / 1000) + 3600;

const authorizedPractitioner = {
  id: "doc-auth",
  uid: "doctor-authorized",
  email: "auth@example.com",
  role: "read-only-admin" as AdminRole,
  status: "active" as const,
  organizationId: "org-1",
  clinicId: "clinic-1",
  repertoryCapabilities: ["search" as const, "repertorize" as const, "export-json" as const],
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
};

const unauthorizedPractitioner = {
  id: "doc-unauth",
  uid: "doctor-unauthorized",
  email: "unauth@example.com",
  role: "read-only-admin" as AdminRole,
  status: "active" as const,
  organizationId: "org-1",
  clinicId: "clinic-1",
  repertoryCapabilities: ["search" as const, "repertorize" as const], // missing export-json
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
};

const expiredPractitioner = {
  id: "doc-expired",
  uid: "doctor-expired",
  email: "expired@example.com",
  role: "read-only-admin" as AdminRole,
  status: "expired" as const,
  organizationId: "org-1",
  clinicId: "clinic-1",
  repertoryCapabilities: ["search" as const, "repertorize" as const, "export-json" as const],
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
};

const suspendedPractitioner = {
  id: "doc-suspended",
  uid: "doctor-suspended",
  email: "suspended@example.com",
  role: "read-only-admin" as AdminRole,
  status: "suspended" as const,
  organizationId: "org-1",
  clinicId: "clinic-1",
  repertoryCapabilities: ["search" as const, "repertorize" as const, "export-json" as const],
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
};

memoryPractitionerAccounts.push(
  authorizedPractitioner,
  unauthorizedPractitioner,
  expiredPractitioner,
  suspendedPractitioner
);

function makeRequest(cookieValue?: string): NextRequest {
  const headers = new Headers();
  if (cookieValue) {
    headers.set("cookie", `hh_admin_session_v3=${cookieValue}`);
  }
  return new NextRequest("http://localhost:3000/api/repertory/export", {
    headers,
    method: "POST",
  });
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e: any) {
    console.error(`  ✗ ${name}: ${e.message}`);
    failed++;
  }
}

(async () => {
  console.log("\nRepertory Export Authorization Tests\n");

  await test("doctor with export-json capability is authorized", async () => {
    const cookie = await createAdminSessionCookie({
      uid: "doctor-authorized",
      email: "auth@example.com",
      role: "doctor" as any,
      name: "Dr. Authorized",
      exp: expTime,
    });
    const req = makeRequest(cookie);
    const result = await authorizeRepertoryExportRequest(req);
    assert.equal(result.authorized, true);
  });

  await test("doctor without export-json capability is denied with 403", async () => {
    const cookie = await createAdminSessionCookie({
      uid: "doctor-unauthorized",
      email: "unauth@example.com",
      role: "doctor" as any,
      name: "Dr. Unauthorized",
      exp: expTime,
    });
    const req = makeRequest(cookie);
    const result = await authorizeRepertoryExportRequest(req);
    assert.equal(result.authorized, false);
    assert.equal((result as any).response.status, 403);
  });

  await test("expired doctor with capability is denied with 403", async () => {
    const cookie = await createAdminSessionCookie({
      uid: "doctor-expired",
      email: "expired@example.com",
      role: "doctor" as any,
      name: "Dr. Expired",
      exp: expTime,
    });
    const req = makeRequest(cookie);
    const result = await authorizeRepertoryExportRequest(req);
    assert.equal(result.authorized, false);
    assert.equal((result as any).response.status, 403);
  });

  await test("suspended doctor with capability is denied with 403", async () => {
    const cookie = await createAdminSessionCookie({
      uid: "doctor-suspended",
      email: "suspended@example.com",
      role: "doctor" as any,
      name: "Dr. Suspended",
      exp: expTime,
    });
    const req = makeRequest(cookie);
    const result = await authorizeRepertoryExportRequest(req);
    assert.equal(result.authorized, false);
    assert.equal((result as any).response.status, 403);
  });

  await test("super-admin without a qualifying doctor entitlement is denied with 403", async () => {
    const cookie = await createAdminSessionCookie({
      uid: "super-admin-uid",
      email: "admin@homeo.healthcare",
      role: "super-admin",
      name: "Super Admin",
      exp: expTime,
    });
    const req = makeRequest(cookie);
    const result = await authorizeRepertoryExportRequest(req);
    assert.equal(result.authorized, false);
    assert.equal((result as any).response.status, 403);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
