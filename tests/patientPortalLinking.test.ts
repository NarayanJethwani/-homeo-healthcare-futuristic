import "./setupEnv";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST, GET } from "../src/app/api/admin/patient-portal-links/route";
import { createAdminSessionCookie, ADMIN_SESSION_COOKIE } from "../src/lib/adminSession";
import { getAdminDb, resetMockDb } from "../src/lib/firebaseAdmin";
import {
  approvePatientPortalLinkSchema,
  candidatePatientIdsForEmail,
  practitionerMayLinkPatient,
} from "../src/features/patient-portal-linking/patientPortalLinking";

async function requestWithSession(url: string, cookie: string, init?: { method?: string; body?: string }) {
  return new NextRequest(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      cookie: `${ADMIN_SESSION_COOKIE}=${cookie}`,
    },
  });
}

async function run() {
  resetMockDb();
  const db = getAdminDb();

  assert.equal(approvePatientPortalLinkSchema.safeParse({ portalUid: "portal_uid_123", patientId: "P-100001" }).success, true);
  assert.equal(approvePatientPortalLinkSchema.safeParse({ portalUid: "portal_uid_123", patientId: "P-100001", role: "admin" }).success, false);
  assert.deepEqual(candidatePatientIdsForEmail("PATIENT@EXAMPLE.COM", [
    { id: "P-100001", name: "Patient", email: "patient@example.com", assignedDoctor: "doctor-1" },
  ]), ["P-100001"]);
  assert.equal(practitionerMayLinkPatient("doctor-1", false, "doctor-1"), true);
  assert.equal(practitionerMayLinkPatient("doctor-2", false, "doctor-1"), false);

  await db.collection("users").doc("portal_uid_123").set({
    role: "patient",
    name: "Asha Patient",
    email: "asha@example.com",
    patientId: "",
    portalLinkStatus: "pending",
    createdAt: "2026-08-10T10:00:00.000Z",
  });
  await db.collection("patients").doc("P-100001").set({
    id: "P-100001",
    name: "Asha Patient",
    email: "asha@example.com",
    assignedDoctor: "doctor-1",
    createdAt: "2026-08-09T10:00:00.000Z",
  });
  await db.collection("patients").doc("P-200002").set({
    id: "P-200002",
    name: "Other Patient",
    email: "other@example.com",
    assignedDoctor: "doctor-2",
    createdAt: "2026-08-09T11:00:00.000Z",
  });

  const adminCookie = await createAdminSessionCookie({
    uid: "admin-1",
    email: "admin@homeo.healthcare",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const queueResponse = await GET(await requestWithSession("http://localhost/api/admin/patient-portal-links", adminCookie));
  assert.equal(queueResponse.status, 200);
  const queue = await queueResponse.json();
  assert.equal(queue.pending.length, 1);
  assert.deepEqual(queue.pending[0].candidatePatientIds, ["P-100001"]);

  const doctorCookie = await createAdminSessionCookie({
    uid: "doctor-1",
    email: "doctor@example.com",
    role: "doctor",
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const forbiddenResponse = await POST(await requestWithSession(
    "http://localhost/api/admin/patient-portal-links",
    doctorCookie,
    { method: "POST", body: JSON.stringify({ portalUid: "portal_uid_123", patientId: "P-200002" }) },
  ));
  assert.equal(forbiddenResponse.status, 403);

  const approvalResponse = await POST(await requestWithSession(
    "http://localhost/api/admin/patient-portal-links",
    doctorCookie,
    { method: "POST", body: JSON.stringify({ portalUid: "portal_uid_123", patientId: "P-100001" }) },
  ));
  assert.equal(approvalResponse.status, 200);

  const linkedUser = await db.collection("users").doc("portal_uid_123").get();
  assert.equal(linkedUser.data().patientId, "P-100001");
  assert.equal(linkedUser.data().portalLinkStatus, "approved");
  const linkRecord = await db.collection("patientPortalLinks").doc("portal_uid_123").get();
  assert.equal(linkRecord.data().status, "approved");
  assert.equal(linkRecord.data().schemaVersion, "patient-portal-link-v1");
  const auditEvents = await db.collection("patientPortalLinkAuditEvents").get();
  assert.equal(auditEvents.docs.length, 1);

  const afterApproval = await GET(await requestWithSession("http://localhost/api/admin/patient-portal-links", adminCookie));
  const afterApprovalBody = await afterApproval.json();
  assert.equal(afterApprovalBody.pending.length, 0);

  console.log("Patient portal linking workflow tests passed.");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
