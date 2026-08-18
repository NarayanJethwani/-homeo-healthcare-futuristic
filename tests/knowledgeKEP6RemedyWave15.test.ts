import assert from "assert";
import {
  M28_ENTITY_PROFILES,
  M28_OFFLINE_EVALUATION_CASES,
  buildKEP6RemedyWave15Package,
  computeM28EvaluationMetrics,
  generateM28AuthorizationReport,
} from "../src/features/knowledge/expansion/kep6RemedyWave15Package";

export function runKnowledgeKEP6RemedyWave15Test(): void {
  const pkg = buildKEP6RemedyWave15Package();
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.transitionalPublicationFreeze, true);
  assert.strictEqual(pkg.entities.length, 7);
  assert.strictEqual(pkg.relationshipProposals.length, 35);
  assert.ok(pkg.entities.every((entity) => entity.claimCount >= 4));
  assert.ok(pkg.entities.every((entity) => entity.passageCitationCount >= 3));
  assert.ok(pkg.relationshipProposals.every((proposal) =>
    proposal.status === "draft" &&
    proposal.publicationEligible === false &&
    proposal.ragEligible === false &&
    proposal.evidenceScope === "traditional-literature-only" &&
    proposal.relationshipType === "traditional_profile_association" &&
    proposal.targetEntityId.startsWith("CONCEPT-")
  ));

  assert.strictEqual(M28_OFFLINE_EVALUATION_CASES.length, 70);
  for (const { entity } of M28_ENTITY_PROFILES) {
    assert.strictEqual(entity.versionInfo.version, "1.1.0");
    assert.strictEqual(entity.editorialStatus, "published");
    const cases = M28_OFFLINE_EVALUATION_CASES.filter((item) => item.entityId === entity.id);
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

  const metrics = computeM28EvaluationMetrics();
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
    { cases: 70, entities: 7, minimum: 10, recallAt5: 1, mrr: 1, citations: 1, passed: 70, failed: 0 }
  );

  const missedEmergency = M28_OFFLINE_EVALUATION_CASES.map((item) => ({ ...item }));
  const emergency = missedEmergency.find((item) => item.dimension === "emergency-escalation");
  assert.ok(emergency);
  emergency.emergencyEscalationTriggered = false;
  assert.strictEqual(computeM28EvaluationMetrics(missedEmergency).emergencyEscalationFailureCount, 1);

  const unsupported = M28_OFFLINE_EVALUATION_CASES.map((item) => ({ ...item }));
  const unsupportedCase = unsupported.find((item) => item.dimension === "unsupported-claim");
  assert.ok(unsupportedCase);
  unsupportedCase.outputContainsUnsupportedClaim = true;
  assert.strictEqual(computeM28EvaluationMetrics(unsupported).unsupportedClaimFailureCount, 1);

  const stale = M28_OFFLINE_EVALUATION_CASES.map((item) => ({
    ...item,
    hits: item.hits.map((hit) => ({ ...hit })),
  }));
  const staleCase = stale.find((item) => item.dimension === "stale-revision");
  assert.ok(staleCase?.hits[0]);
  staleCase.hits[0].contentSha256 = "tampered";
  assert.ok(computeM28EvaluationMetrics(stale).staleRevisionLeakageCount >= 1);

  const report = generateM28AuthorizationReport();
  assert.strictEqual(report.status, "pending_authorization");
  assert.match(report.sourceCommit, /^[a-f0-9]{40}$/);
  assert.strictEqual(report.summary.wavePromotionCandidate, true);
  assert.strictEqual(report.summary.wavePromotionAchieved, false);
  console.log("M28 verified: 7 source-bound remedies (100% remedy coverage closure), 70 computed cases with 14 emergency controls, 35 draft-only proposals, RAG off, publication frozen.");
}

if (require.main === module) runKnowledgeKEP6RemedyWave15Test();
