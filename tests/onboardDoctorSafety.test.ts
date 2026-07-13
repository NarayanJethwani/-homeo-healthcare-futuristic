import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { createAdminSessionCookie, ADMIN_SESSION_COOKIE } from "../src/lib/adminSession";
import { getAdminAuth } from "../src/lib/firebaseAdmin";
import { POST } from "../src/app/api/onboard-doctor/route";
import { computeDoctorPlanValidUntil, onboardDoctorSchema } from "../src/features/doctor-onboarding/onboardingValidation";

async function run() {
  process.env.ADMIN_SESSION_SECRET = "doctor-onboarding-test-secret";

  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
  assert.equal(packageJson.dependencies["firebase-admin"], "13.6.0");
  assert.ok(getAdminAuth(), "Firebase Auth must load without a CommonJS/ESM crash");

  assert.equal(computeDoctorPlanValidUntil("trial", new Date("2026-07-13T00:00:00.000Z")), "2026-07-27");
  assert.equal(computeDoctorPlanValidUntil("branch", new Date("2026-07-13T00:00:00.000Z")), "2099-12-31");

  assert.equal(onboardDoctorSchema.safeParse({
    name: "Dr Pilot",
    email: "PILOT@EXAMPLE.COM",
    plan: "trial",
  }).success, true);
  assert.equal(onboardDoctorSchema.safeParse({
    name: "Dr Pilot",
    email: "pilot@example.com",
    plan: "trial",
    adminUid: "caller-controlled-admin",
  }).success, false, "caller-controlled administrator IDs must be rejected");

  const unauthenticated = await POST(new NextRequest("http://localhost/api/onboard-doctor", {
    method: "POST",
    body: JSON.stringify({ name: "Dr Pilot", email: "pilot@example.com" }),
    headers: { "content-type": "application/json" },
  }));
  assert.equal(unauthenticated.status, 401);

  const doctorCookie = await createAdminSessionCookie({
    uid: "doctor-uid",
    email: "doctor@example.com",
    role: "doctor",
    exp: Math.floor(Date.now() / 1000) + 60,
  });
  const forbidden = await POST(new NextRequest("http://localhost/api/onboard-doctor", {
    method: "POST",
    body: JSON.stringify({ name: "Dr Pilot", email: "pilot@example.com" }),
    headers: {
      "content-type": "application/json",
      cookie: `${ADMIN_SESSION_COOKIE}=${doctorCookie}`,
    },
  }));
  assert.equal(forbidden.status, 401);

  const adminCookie = await createAdminSessionCookie({
    uid: "admin-uid",
    email: "admin@homeo.healthcare",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60,
  });
  const invalidInput = await POST(new NextRequest("http://localhost/api/onboard-doctor", {
    method: "POST",
    body: JSON.stringify({ name: "x", email: "not-an-email" }),
    headers: {
      "content-type": "application/json",
      cookie: `${ADMIN_SESSION_COOKIE}=${adminCookie}`,
    },
  }));
  assert.equal(invalidInput.status, 400);

  const routeSource = fs.readFileSync(
    path.join(process.cwd(), "src/app/api/onboard-doctor/route.ts"),
    "utf8",
  );
  assert.equal(routeSource.includes('console.log("Password reset link'), false);
  assert.equal(routeSource.includes("adminUid"), false);

  const uiSource = fs.readFileSync(
    path.join(process.cwd(), "src/components/ManageDoctorsPanel.tsx"),
    "utf8",
  );
  assert.equal(uiSource.includes("Login email sent"), false);
  assert.equal(uiSource.includes("Copy password-setup link"), true);

  console.log("Doctor onboarding safety tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
