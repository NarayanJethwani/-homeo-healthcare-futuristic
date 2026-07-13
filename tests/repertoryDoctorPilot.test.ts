import assert from "assert";
import {
  isDoctorAllowedInRepertoryPilot,
  isDoctorPilotRole,
  parseRepertoryDoctorPilotConfig,
  repertoryPermissionToDoctorCapability,
} from "../src/features/repertory/access/RepertoryDoctorPilotPolicy";
import { authorizeRepertoryOperation } from "../src/features/repertory/access/RepertoryAccessBoundary";

const doctorUid = "doctorPilotUid_123";

function run() {
  const disabled = parseRepertoryDoctorPilotConfig({
    REPERTORY_DOCTOR_PILOT_ENABLED: "false",
    REPERTORY_DOCTOR_PILOT_UIDS: doctorUid,
  });
  assert.equal(disabled.enabled, false);
  assert.equal(isDoctorAllowedInRepertoryPilot(disabled, doctorUid, "doctor"), false);

  const missingAllowList = parseRepertoryDoctorPilotConfig({
    REPERTORY_DOCTOR_PILOT_ENABLED: "true",
    REPERTORY_DOCTOR_PILOT_UIDS: "",
  });
  assert.equal(missingAllowList.enabled, false);

  const enabled = parseRepertoryDoctorPilotConfig({
    REPERTORY_DOCTOR_PILOT_ENABLED: "true",
    REPERTORY_DOCTOR_PILOT_UIDS: ` invalid uid, ${doctorUid},second_doctor_456 `,
  });
  assert.equal(enabled.enabled, true);
  assert.deepEqual([...enabled.allowedUids], [doctorUid, "second_doctor_456"]);
  assert.equal(isDoctorAllowedInRepertoryPilot(enabled, doctorUid, "doctor"), true);
  assert.equal(isDoctorAllowedInRepertoryPilot(enabled, doctorUid, "read-only-admin"), true);
  assert.equal(isDoctorAllowedInRepertoryPilot(enabled, doctorUid, "super-admin"), false);
  assert.equal(isDoctorAllowedInRepertoryPilot(enabled, "unlisted_doctor", "doctor"), false);
  assert.equal(isDoctorPilotRole("Doctor"), true);

  assert.equal(repertoryPermissionToDoctorCapability("repertory.search"), "search");
  assert.equal(repertoryPermissionToDoctorCapability("repertory.repertorize"), "repertorize");
  assert.equal(repertoryPermissionToDoctorCapability("repertory.audit.read"), null);

  const entitlement = {
    organizationId: "org-1",
    clinicId: "clinic-1",
    doctorId: doctorUid,
    status: "active" as const,
    capabilities: ["search"] as const,
  };
  assert.equal(authorizeRepertoryOperation(entitlement, {
    organizationId: "org-1",
    clinicId: "clinic-1",
    doctorId: doctorUid,
    capability: "search",
  }).allowed, true);
  assert.equal(authorizeRepertoryOperation(entitlement, {
    organizationId: "org-1",
    clinicId: "clinic-1",
    doctorId: doctorUid,
    capability: "repertorize",
  }).allowed, false);

  console.log("Repertory doctor pilot policy tests passed.");
}

run();
