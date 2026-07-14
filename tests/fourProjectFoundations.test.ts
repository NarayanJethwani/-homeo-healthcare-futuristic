import assert from "assert";
import { buildKnowledgeSourceVersionReadModel } from "../src/features/knowledge/read-models/sourceVersionReadModel";
import { adjustScanZoom, rotateScan } from "../src/features/materia-medica/services/scanViewport";
import { DEFAULT_SCAN_VIEWPORT } from "../src/features/materia-medica/reader/scanTypes";
import { canAccessDoctorRepertory } from "../src/features/repertory/access/DoctorEntitlementService";
import { buildClinicianExport } from "../src/features/repertory/import-export/versionedCliniciansExport";
import { buildClinicalWorkspaceReference } from "../src/features/clinical-os/application/ClinicalKnowledgeReferenceService";
import { buildSourceDiscrepancyQueue } from "../src/features/knowledge/read-models/sourceDiscrepancyQueue";
import { authorizeRepertoryOperation } from "../src/features/repertory/access/RepertoryAccessBoundary";
import { buildClinicalWorkspaceReferences } from "../src/features/clinical-os/application/ClinicalKnowledgeReferenceCollectionService";

const eligible = buildKnowledgeSourceVersionReadModel({
  sourceVersionId: "source-v1",
  rightsApproved: true,
  editorialApproved: true,
  citationComplete: true,
  graphValidationPassed: true,
});
assert.equal(eligible.searchEligible, true);
assert.equal(eligible.graphEligible, true);

const expired = buildKnowledgeSourceVersionReadModel({
  sourceVersionId: "source-v2",
  rightsApproved: true,
  editorialApproved: true,
  reviewExpiresAt: "2025-01-01T00:00:00.000Z",
  citationComplete: true,
  graphValidationPassed: true,
}, new Date("2026-01-01T00:00:00.000Z"));
assert.equal(expired.searchEligible, false);
assert.ok(expired.exclusionReasons.includes("review-expired"));
assert.deepEqual(buildSourceDiscrepancyQueue([eligible, expired]), [{
  sourceVersionId: "source-v2",
  severity: "blocking",
  reasons: ["review-expired"],
}]);

assert.equal(adjustScanZoom(DEFAULT_SCAN_VIEWPORT, 10).zoom, 4);
assert.equal(adjustScanZoom(DEFAULT_SCAN_VIEWPORT, -10).zoom, 0.5);
assert.equal(rotateScan(DEFAULT_SCAN_VIEWPORT).rotation, 90);

const entitlement = {
  organizationId: "org-1",
  clinicId: "clinic-1",
  doctorId: "doctor-1",
  status: "active" as const,
  capabilities: ["search", "export-json"] as const,
};
const access = { organizationId: "org-1", clinicId: "clinic-1", doctorId: "doctor-1" };
assert.equal(canAccessDoctorRepertory(entitlement, { ...access, capability: "search" }), true);
assert.equal(canAccessDoctorRepertory(entitlement, { ...access, clinicId: "clinic-2", capability: "search" }), false);
assert.deepEqual(authorizeRepertoryOperation(entitlement, { ...access, capability: "search" }), { allowed: true });
assert.deepEqual(authorizeRepertoryOperation(null, { ...access, capability: "search" }), {
  allowed: false,
  status: 403,
  code: "REPERTORY_ENTITLEMENT_REQUIRED",
});
assert.equal(buildClinicianExport(entitlement, {
  corpusVersion: "v1.2.0",
  selectedRubricIds: ["rubric-1"],
  resultRemedyIds: ["remedy-1"],
}, "session-1", new Date()).schemaVersion, 1);

assert.deepEqual(buildClinicalWorkspaceReference({
  referenceId: "ref-1",
  sourceVersionId: "source-v1",
  title: "Verified reference",
  citation: "Source, edition, page 1",
  route: "/admin/knowledge/reference/ref-1",
  editorialApproved: true,
}), {
  referenceId: "ref-1",
  title: "Verified reference",
  citation: "Source, edition, page 1",
  route: "/admin/knowledge/reference/ref-1",
  readOnly: true,
});
assert.equal(buildClinicalWorkspaceReference({
  referenceId: "ref-2",
  sourceVersionId: "source-v2",
  title: "Unsafe route",
  citation: "Citation",
  route: "https://example.com",
  editorialApproved: true,
}), null);

assert.equal(buildClinicalWorkspaceReferences([
  {
    referenceId: "ref-z",
    sourceVersionId: "source-z",
    title: "Zulu",
    citation: "Citation Z",
    route: "/admin/knowledge/reference/z",
    editorialApproved: true,
  },
  {
    referenceId: "ref-a",
    sourceVersionId: "source-a",
    title: "Alpha",
    citation: "Citation A",
    route: "/admin/knowledge/reference/a",
    editorialApproved: true,
  },
]).map(reference => reference.title).join(","), "Alpha,Zulu");

console.log("Cross-project additive foundation tests passed");
