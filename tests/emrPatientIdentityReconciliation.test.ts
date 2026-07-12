import assert from "assert";
import { reconcilePatientIdentitiesDryRun } from "../src/features/emr-identity/PatientIdentityReconciliationService";
import { buildPatientIdentityInventoryReport } from "../src/features/emr-identity/PatientIdentityInventoryService";
import { authorizePatientIdentityInventory } from "../src/features/emr-identity/PatientIdentityInventoryAccessPolicy";
import {
  LINKED_RECORD_METADATA_FIELDS,
  PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT,
  PATIENT_IDENTITY_METADATA_FIELDS,
  PORTAL_IDENTITY_METADATA_FIELDS,
} from "../src/features/emr-identity/PatientIdentityInventoryQueryPolicy";
import {
  createSyntheticReconciliationArtifact,
  verifySyntheticReconciliationArtifact,
} from "../scripts/emr-identity/generateSyntheticReconciliationArtifact";

const clean = reconcilePatientIdentitiesDryRun([{
  sourceSystem: "firestore-patients",
  sourcePatientId: "patient-1",
  organizationId: "org-1",
  uhid: "UHID-1",
  name: "Patient One",
  phone: "+91 99999 00001",
}], "2026-07-12T00:00:00.000Z");
assert.equal(clean.mode, "dry-run");
assert.equal(clean.writeCount, 0);
assert.equal(clean.eligibleExactMappings, 1);
assert.deepEqual(clean.issues, []);

const duplicates = reconcilePatientIdentitiesDryRun([
  {
    sourceSystem: "firestore-patients",
    sourcePatientId: "patient-1",
    organizationId: "org-1",
    uhid: "UHID-1",
    name: "Patient One",
    dateOfBirth: "1990-01-01",
  },
  {
    sourceSystem: "legacy-dashboard",
    sourcePatientId: "legacy-1",
    organizationId: "org-1",
    uhid: "uhid-1",
    name: "patient one",
    dateOfBirth: "1990-01-01",
  },
]);
assert.equal(duplicates.writeCount, 0);
assert.ok(duplicates.issues.some(issue => issue.code === "duplicate-uhid" && issue.severity === "blocking"));
assert.ok(duplicates.issues.some(issue => issue.code === "possible-demographic-duplicate" && issue.severity === "review"));
assert.equal(duplicates.eligibleExactMappings, 0);

const missingScope = reconcilePatientIdentitiesDryRun([{
  sourceSystem: "legacy-dashboard",
  sourcePatientId: "legacy-2",
  name: "Unscoped Patient",
}]);
assert.equal(missingScope.eligibleExactMappings, 0);
assert.ok(missingScope.issues.some(issue => issue.code === "missing-organization"));

const inventory = buildPatientIdentityInventoryReport({
  patients: [{
    sourceSystem: "firestore-patients",
    sourcePatientId: "patient-1",
    organizationId: "org-1",
  }],
  portalLinks: [
    { userId: "user-1", patientId: "patient-1" },
    { userId: "user-2", patientId: "missing-patient" },
  ],
  linkedRecords: [
    { collection: "invoices", recordId: "invoice-1", patientId: "patient-1" },
    { collection: "patient_attachments", recordId: "attachment-1", patientId: "missing-patient" },
    { collection: "reviewed_lab_results", recordId: "lab-1" },
  ],
  truncatedCollections: ["patients", "patients", "invoices"],
}, "2026-07-12T00:00:00.000Z");
assert.equal(inventory.writeCount, 0);
assert.equal(inventory.invalidPortalLinkCount, 1);
assert.equal(inventory.orphanedLinkedRecordCount, 2);
assert.deepEqual(inventory.linkedRecordCountsByCollection, {
  invoices: 1,
  patient_attachments: 1,
  reviewed_lab_results: 1,
});
assert.deepEqual(inventory.orphanedRecordCountsByCollection, {
  patient_attachments: 1,
  reviewed_lab_results: 1,
});
assert.deepEqual(inventory.truncatedCollections, ["invoices", "patients"]);

assert.ok(PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT > 0);
assert.deepEqual(PATIENT_IDENTITY_METADATA_FIELDS, [
  "organizationId",
  "clinicId",
  "uhid",
  "name",
  "dateOfBirth",
  "phone",
  "email",
]);
assert.deepEqual(PORTAL_IDENTITY_METADATA_FIELDS, ["patientId"]);
assert.deepEqual(LINKED_RECORD_METADATA_FIELDS, ["patientId"]);
for (const forbiddenField of [
  "complaint",
  "prescriptions",
  "clinicianNotes",
  "finalPrice",
  "receivedAmount",
  "remainingBalance",
  "attachments",
  "resultValue",
  "extractedValue",
]) {
  assert.equal(PATIENT_IDENTITY_METADATA_FIELDS.includes(forbiddenField as never), false);
  assert.equal(LINKED_RECORD_METADATA_FIELDS.includes(forbiddenField as never), false);
}

assert.deepEqual(authorizePatientIdentityInventory(false, null), {
  allowed: false,
  status: 404,
  code: "EMR_IDENTITY_INVENTORY_DISABLED",
});
assert.deepEqual(authorizePatientIdentityInventory(true, null), {
  allowed: false,
  status: 401,
  code: "AUTHENTICATION_REQUIRED",
});
assert.deepEqual(authorizePatientIdentityInventory(true, { uid: "doctor-1", role: "doctor" }), {
  allowed: false,
  status: 403,
  code: "ADMIN_ACCESS_REQUIRED",
});
assert.deepEqual(authorizePatientIdentityInventory(true, { uid: "admin-1", role: "admin" }), {
  allowed: true,
});

const syntheticDataset = {
  classification: "synthetic" as const,
  datasetId: "synthetic-test-v1",
  patients: [{
    sourceSystem: "fixture",
    sourcePatientId: "patient-1",
    organizationId: "org-1",
  }],
  portalLinks: [],
  linkedRecords: [],
};
const artifactA = createSyntheticReconciliationArtifact(syntheticDataset, {
  generatedAt: "2026-07-12T00:00:00.000Z",
  pageSize: 1,
});
const artifactB = createSyntheticReconciliationArtifact({
  linkedRecords: [],
  portalLinks: [],
  patients: syntheticDataset.patients,
  datasetId: "synthetic-test-v1",
  classification: "synthetic",
}, {
  generatedAt: "2026-07-12T00:00:00.000Z",
  pageSize: 1,
});
assert.equal(artifactA.artifactChecksum, artifactB.artifactChecksum);
assert.equal(artifactA.report.writeCount, 0);
assert.equal(artifactA.pageCounts.patients, 1);
assert.equal(verifySyntheticReconciliationArtifact(artifactA), true);
assert.equal(verifySyntheticReconciliationArtifact({
  ...artifactA,
  report: { ...artifactA.report, patientCount: 2 },
}), false);
assert.throws(() => createSyntheticReconciliationArtifact({
  ...syntheticDataset,
  classification: "production",
}, { generatedAt: "2026-07-12T00:00:00.000Z" }), /classification must be exactly 'synthetic'/);

console.log("EMR patient identity dry-run reconciliation tests passed");
