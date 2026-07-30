import assert from "assert";
import { CITATIONS } from "../src/features/knowledge/content/citations";
import {
  buildPriorityDiseaseEvidenceManifest,
  PRIORITY_DISEASE_DOSSIERS,
  PRIORITY_DISEASE_SOURCES,
} from "../src/features/knowledge/expansion/priorityDiseaseEvidence";

export function runKnowledgePriorityDiseaseEvidenceTests(): void {
  const manifest = buildPriorityDiseaseEvidenceManifest();
  const citationIds = new Set(CITATIONS.map((citation) => citation.id));
  const sourceById = new Map(
    PRIORITY_DISEASE_SOURCES.map((source) => [source.id, source])
  );
  const entityIds = manifest.dossiers.map((dossier) => dossier.entityId);

  assert.strictEqual(manifest.status, "sources-registered-review-blocked");
  assert.strictEqual(manifest.selectionBasis.liveTrafficTelemetryUsed, false);
  assert.strictEqual(manifest.selectionBasis.mockAnalyticsExcluded, true);
  assert.strictEqual(
    manifest.invariants.mockAnalyticsCannotConferPriorityOrAuthority,
    true
  );
  assert.strictEqual(manifest.summary.dossierCount, 5);
  assert.strictEqual(manifest.summary.sourceCount, 13);
  assert.strictEqual(manifest.summary.claimEvidencePlanCount, 15);
  assert.strictEqual(
    manifest.summary.stagingEligibleClaimEvidencePlanCount,
    15
  );
  assert.deepStrictEqual(entityIds, [
    "D0005",
    "D0009",
    "D0010",
    "D0011",
    "D0051",
  ]);
  assert.ok(!entityIds.includes("D0007"));
  assert.deepStrictEqual(manifest.exclusions, [
    {
      entityId: "D0007",
      reason: "active-safety-withdrawal",
      requiredPath: "withdrawn-safety-remediation",
    },
  ]);

  for (const source of manifest.sources) {
    assert.strictEqual(source.usePolicy, "citation-only");
    assert.strictEqual(source.licence.permitsExtraction, false);
    assert.strictEqual(source.licence.permitsDerivedData, false);
    assert.strictEqual(source.licence.permitsPublicDisplay, false);
    assert.ok(citationIds.has(source.citationId));
  }

  for (const dossier of PRIORITY_DISEASE_DOSSIERS) {
    assert.strictEqual(dossier.stateBoundaries.contentState, "planning-only");
    assert.strictEqual(dossier.stateBoundaries.evidenceState, "unapproved");
    assert.strictEqual(dossier.stateBoundaries.clinicalReviewState, "unassigned");
    assert.strictEqual(dossier.stateBoundaries.publicationState, "unchanged");
    assert.strictEqual(dossier.stateBoundaries.ragState, "inactive");
    assert.ok(dossier.sourceIds.every((sourceId) => sourceById.has(sourceId)));
    assert.ok(
      dossier.assignments.every(
        (assignment) =>
          assignment.status === "unassigned" &&
          assignment.contributorId === null
      )
    );
    for (const plan of dossier.claimEvidencePlans) {
      assert.strictEqual(plan.stagingEvaluation.eligibleForStaging, true);
      assert.deepStrictEqual(plan.stagingEvaluation.errors, []);
      assert.strictEqual(plan.stateBoundaries.clinicalApprovalState, "unapproved");
      assert.strictEqual(plan.stateBoundaries.publicationState, "unchanged");
      assert.strictEqual(plan.stateBoundaries.ragState, "inactive");
      assert.ok(
        plan.citationIds.every((citationId) =>
          dossier.sourceIds.some(
            (sourceId) => sourceById.get(sourceId)?.citationId === citationId
          )
        )
      );
    }
  }

  console.log(
    "✅ Priority disease evidence preparation cohort, source registration, withdrawal exclusion, and zero-authority boundaries verified."
  );
}

if (require.main === module) {
  runKnowledgePriorityDiseaseEvidenceTests();
}
