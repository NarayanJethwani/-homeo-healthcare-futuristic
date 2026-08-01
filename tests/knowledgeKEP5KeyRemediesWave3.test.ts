import assert from "assert";
import {
  M11_ENTITY_PROFILES,
  M11_OFFLINE_EVALUATION_CASES,
  buildKEP5KeyRemediesWave3Package,
  computeM11EvaluationMetrics,
  generateM11AuthorizationReport,
} from "../src/features/knowledge/expansion/kep5KeyRemediesWave3Package";

export function runKnowledgeKEP5KeyRemediesWave3Test(): void {
  const pkg = buildKEP5KeyRemediesWave3Package();
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.transitionalPublicationFreeze, true);
  assert.strictEqual(pkg.entities.length, 10);
  assert.strictEqual(pkg.relationshipProposals.length, 50);
  assert.ok(pkg.entities.every((entity) => entity.claimCount >= 4));
  assert.ok(pkg.entities.every((entity) => entity.passageCitationCount >= 6));
  assert.ok(pkg.relationshipProposals.every((proposal) =>
    proposal.status === "draft" &&
    proposal.publicationEligible === false &&
    proposal.ragEligible === false &&
    proposal.evidenceScope === "traditional-literature-only"
  ));

  assert.strictEqual(M11_OFFLINE_EVALUATION_CASES.length, 100);
  for (const { entity } of M11_ENTITY_PROFILES) {
    const cases = M11_OFFLINE_EVALUATION_CASES.filter((item) => item.entityId === entity.id);
    assert.strictEqual(cases.length, 10);
    assert.strictEqual(new Set(cases.map((item) => item.dimension)).size, 8);
    assert.ok((entity.claimCitations?.length ?? 0) >= 4);
    assert.ok((entity.redFlags?.length ?? 0) >= 2);
    const safetyText = `${entity.content.safetyNotes} ${entity.aiReadiness?.clinicalSummary}`.toLowerCase();
    assert.ok(!safetyText.includes("safe and non-toxic"));
    assert.ok(!safetyText.includes("contain no active"));
    assert.ok(safetyText.includes("does not") || safetyText.includes("does not prove") || safetyText.includes("does not establish") || safetyText.includes("does not guarantee"));
  }

  const metrics = computeM11EvaluationMetrics();
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
    { cases: 100, entities: 10, minimum: 10, recallAt5: 1, mrr: 1, citations: 1, passed: 100, failed: 0 }
  );

  const tampered = M11_OFFLINE_EVALUATION_CASES.map((item) => ({ ...item }));
  const emergency = tampered.find((item) => item.dimension === "emergency-escalation");
  assert.ok(emergency);
  emergency.emergencyEscalationTriggered = false;
  assert.strictEqual(computeM11EvaluationMetrics(tampered).emergencyEscalationFailureCount, 1);

  const report = generateM11AuthorizationReport();
  assert.strictEqual(report.status, "pending_authorization");
  assert.strictEqual(report.governance.productionRagActivation, false);
  assert.strictEqual(report.governance.transitionalPublicationFreeze, true);
  console.log("M11 verified: 10 source-bounded remedies, 100 computed cases, 50 draft-only graph proposals, RAG off, publication frozen.");
}

if (require.main === module) runKnowledgeKEP5KeyRemediesWave3Test();
