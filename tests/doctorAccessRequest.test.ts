process.env.NODE_ENV = "test";
process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
process.env.GCLOUD_PROJECT = "mock-project-id";

import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { getAdminDb, resetMockDb } from "../src/lib/firebaseAdmin";
import { POST } from "../src/app/api/doctor-access-requests/route";
import {
  consumeDoctorAccessRateLimit,
  doctorAccessRequestSchema,
  resetDoctorAccessRateLimitsForTests,
} from "../src/features/doctor-access/doctorAccessRequest";

const validRequest = {
  fullName: "Dr. Meera Shah",
  email: "MEERA@example.com",
  phone: "+91 98765 43210",
  registrationCouncil: "Maharashtra Council of Homoeopathy",
  registrationNumber: "MCH-12345",
  qualification: "BHMS",
  speciality: "Chronic care",
  clinicName: "Meera Clinic",
  city: "Pune",
  state: "Maharashtra",
  consent: true,
  website: "",
};

async function run() {
  resetMockDb();
  resetDoctorAccessRateLimitsForTests();

  const parsed = doctorAccessRequestSchema.safeParse(validRequest);
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.email, "meera@example.com");

  assert.equal(doctorAccessRequestSchema.safeParse({ ...validRequest, consent: false }).success, false);
  assert.equal(doctorAccessRequestSchema.safeParse({ ...validRequest, role: "admin" }).success, false);
  assert.equal(doctorAccessRequestSchema.safeParse({ ...validRequest, website: "spam.example" }).success, false);

  assert.equal(consumeDoctorAccessRateLimit("rate-test", 1_000, 2, 1_000), true);
  assert.equal(consumeDoctorAccessRateLimit("rate-test", 1_100, 2, 1_000), true);
  assert.equal(consumeDoctorAccessRateLimit("rate-test", 1_200, 2, 1_000), false);
  assert.equal(consumeDoctorAccessRateLimit("rate-test", 2_100, 2, 1_000), true);

  const crossSite = await POST(new NextRequest("http://localhost/api/doctor-access-requests", {
    method: "POST",
    headers: { "content-type": "application/json", "sec-fetch-site": "cross-site", "x-real-ip": "10.0.0.1" },
    body: JSON.stringify(validRequest),
  }));
  assert.equal(crossSite.status, 403);

  const accepted = await POST(new NextRequest("http://localhost/api/doctor-access-requests", {
    method: "POST",
    headers: { "content-type": "application/json", "sec-fetch-site": "same-origin", "x-real-ip": "10.0.0.2" },
    body: JSON.stringify(validRequest),
  }));
  assert.equal(accepted.status, 202);
  const acceptedBody = await accepted.json();
  assert.equal(acceptedBody.success, true);
  assert.match(acceptedBody.message, /No clinical account has been activated/i);

  const stored = await getAdminDb().collection("doctorAccessRequests").get();
  assert.equal(stored.docs.length, 1);
  assert.equal(stored.docs[0].data().status, "pending-verification");
  assert.equal(stored.docs[0].data().role, undefined);
  assert.equal(stored.docs[0].data().emailNormalized, "meera@example.com");

  const duplicate = await POST(new NextRequest("http://localhost/api/doctor-access-requests", {
    method: "POST",
    headers: { "content-type": "application/json", "sec-fetch-site": "same-origin", "x-real-ip": "10.0.0.3" },
    body: JSON.stringify({ ...validRequest, phone: "+91 90000 00000" }),
  }));
  assert.equal(duplicate.status, 202);
  const afterDuplicate = await getAdminDb().collection("doctorAccessRequests").get();
  assert.equal(afterDuplicate.docs.length, 1, "an open request must be refreshed instead of duplicated");
  assert.equal(afterDuplicate.docs[0].data().status, "pending-verification");

  console.log("Doctor access request safety tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
