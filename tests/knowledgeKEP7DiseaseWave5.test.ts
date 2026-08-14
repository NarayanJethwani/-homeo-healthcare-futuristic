import assert from "assert";
import {
  M20_ENTITY_PROFILES,
  M20_OFFLINE_EVALUATION_CASES,
  buildKEP7DiseaseWave5Package,
  computeM20EvaluationMetrics,
  generateM20AuthorizationReport,
} from "../src/features/knowledge/expansion/kep7DiseaseWave5Package";

export function runKnowledgeKEP7DiseaseWave5Test(): void {
  const pkg = buildKEP7DiseaseWave5Package();
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.transitionalPublicationFreeze, true);
  assert.strictEqual(pkg.entities.length, 8);
  assert.strictEqual(pkg.relationshipProposals.length, 40);
  assert.ok(pkg.entities.every((entity) => entity.claimCount >= 4));
  assert.ok(pkg.entities.every((entity) => entity.passageCitationCount >= 6));
  assert.ok(pkg.relationshipProposals.every((proposal) =>
    proposal.status === "draft" &&
    proposal.publicationEligible === false &&
    proposal.ragEligible === false &&
    proposal.evidenceScope === "traditional-literature-only" &&
    proposal.relationshipType === "traditional_profile_association" &&
    proposal.targetEntityId.startsWith("CONCEPT-")
  ));

  assert.strictEqual(M20_OFFLINE_EVALUATION_CASES.length, 80);
  for (const { entity } of M20_ENTITY_PROFILES) {
    const cases = M20_OFFLINE_EVALUATION_CASES.filter((item) => item.entityId === entity.id);
    assert.strictEqual(cases.length, 10);
    assert.strictEqual(cases.filter((item) => item.dimension === "emergency-escalation").length, 2);
    assert.strictEqual(new Set(cases.map((item) => item.dimension)).size, 8);
    assert.ok((entity.claimCitations?.length ?? 0) >= 4);
    assert.ok((entity.redFlags?.length ?? 0) >= 2);
    assert.strictEqual(entity.reviewStatus, "owner-authorization-required");
    const safetyText = `${entity.content.overview} ${entity.aiReadiness?.clinicalSummary}`.toLowerCase();
    assert.ok(!safetyText.includes("safe and non-toxic"));
    assert.ok(!safetyText.includes("minimal chemical solute"));
    assert.ok(safetyText.includes("do not") || safetyText.includes("does not") || safetyText.includes("not replace"));
  }

  const metrics = computeM20EvaluationMetrics();
  assert.deepStrictEqual(
    {
      cases: metrics.caseCount,
      entities: metrics.entityCount,
      minimum: metrics.minimumCasesPerEntity,
      recallAt5: metrics.recallAt5,
      mrr: metrics.meanReciprocalRank,
      citations: metrics.citationPrecision,
      passed: metrics.passedCaseCount,
      failed: metrics.failedCaseCount,
    },
    { cases: 80, entities: 8, minimum: 10, recallAt5: 1, mrr: 1, citations: 1, passed: 80, failed: 0 }
  );

  const missedEmergency = M20_OFFLINE_EVALUATION_CASES.map((item) => ({ ...item }));
  const emergency = missedEmergency.find((item) => item.dimension === "emergency-escalation");
  assert.ok(emergency);
  emergency.emergencyEscalationTriggered = false;
  assert.strictEqual(computeM20EvaluationMetrics(missedEmergency).emergencyEscalationFailureCount, 1);

  const unsupported = M20_OFFLINE_EVALUATION_CASES.map((item) => ({ ...item }));
  const unsupportedCase = unsupported.find((item) => item.dimension === "unsupported-claim");
  assert.ok(unsupportedCase);
  unsupportedCase.outputContainsUnsupportedClaim = true;
  assert.strictEqual(computeM20EvaluationMetrics(unsupported).unsupportedClaimFailureCount, 1);

  const stale = M20_OFFLINE_EVALUATION_CASES.map((item) => ({
    ...item,
    hits: item.hits.map((hit) => ({ ...hit })),
  }));
  const staleCase = stale.find((item) => item.dimension === "stale-revision");
  assert.ok(staleCase?.hits[0]);
  staleCase.hits[0].contentSha256 = "tampered";
  assert.ok(computeM20EvaluationMetrics(stale).staleRevisionLeakageCount >= 1);

  const report = generateM20AuthorizationReport();
  assert.strictEqual(report.status, "pending_authorization");
  assert.match(report.sourceCommit, /^[a-f0-9]{40}$/);

  console.log("✅ Knowledge KEP-7 Disease Wave 5 test suite passed successfully.");
}

if (require.main === module) {
  runKnowledgeKEP7DiseaseWave5Test();
}
