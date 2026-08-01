import assert from "assert";
import {
  M12_ENTITY_PROFILES,
  M12_OFFLINE_EVALUATION_CASES,
  buildKEP5KeyRemediesWave4Package,
  computeM12EvaluationMetrics,
  generateM12AuthorizationReport,
} from "../src/features/knowledge/expansion/kep5KeyRemediesWave4Package";

export function runKnowledgeKEP5KeyRemediesWave4Test(): void {
  const pkg = buildKEP5KeyRemediesWave4Package();
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
    proposal.evidenceScope === "traditional-literature-only" &&
    proposal.relationshipType === "traditional_profile_association" &&
    proposal.targetEntityId.startsWith("CONCEPT-")
  ));

  assert.strictEqual(M12_OFFLINE_EVALUATION_CASES.length, 100);
  for (const { entity } of M12_ENTITY_PROFILES) {
    const cases = M12_OFFLINE_EVALUATION_CASES.filter((item) => item.entityId === entity.id);
    assert.strictEqual(cases.length, 10);
    assert.strictEqual(cases.filter((item) => item.dimension === "emergency-escalation").length, 2);
    assert.strictEqual(new Set(cases.map((item) => item.dimension)).size, 8);
    assert.ok((entity.claimCitations?.length ?? 0) >= 4);
    assert.ok((entity.redFlags?.length ?? 0) >= 2);
    assert.strictEqual(entity.reviewStatus, "owner-authorization-required");
    const safetyText = `${entity.content.safetyNotes} ${entity.aiReadiness?.clinicalSummary}`.toLowerCase();
    assert.ok(!safetyText.includes("safe and non-toxic"));
    assert.ok(!safetyText.includes("minimal chemical solute"));
    assert.ok(safetyText.includes("does not") || safetyText.includes("does not guarantee"));
  }

  const metrics = computeM12EvaluationMetrics();
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

  const missedEmergency = M12_OFFLINE_EVALUATION_CASES.map((item) => ({ ...item }));
  const emergency = missedEmergency.find((item) => item.dimension === "emergency-escalation");
  assert.ok(emergency);
  emergency.emergencyEscalationTriggered = false;
  assert.strictEqual(computeM12EvaluationMetrics(missedEmergency).emergencyEscalationFailureCount, 1);

  const unsupported = M12_OFFLINE_EVALUATION_CASES.map((item) => ({ ...item }));
  const unsupportedCase = unsupported.find((item) => item.dimension === "unsupported-claim");
  assert.ok(unsupportedCase);
  unsupportedCase.outputContainsUnsupportedClaim = true;
  assert.strictEqual(computeM12EvaluationMetrics(unsupported).unsupportedClaimFailureCount, 1);

  const stale = M12_OFFLINE_EVALUATION_CASES.map((item) => ({
    ...item,
    hits: item.hits.map((hit) => ({ ...hit })),
  }));
  const staleCase = stale.find((item) => item.dimension === "stale-revision");
  assert.ok(staleCase?.hits[0]);
  staleCase.hits[0].contentSha256 = "tampered";
  assert.ok(computeM12EvaluationMetrics(stale).staleRevisionLeakageCount >= 1);

  const report = generateM12AuthorizationReport();
  assert.strictEqual(report.status, "pending_authorization");
  assert.strictEqual(report.summary.programCompletionCandidate, true);
  assert.strictEqual(report.summary.programCompletionAchieved, false);
  console.log("M12 verified: 10 source-bound remedies, 100 computed cases with 20 emergency controls, 50 draft-only proposals, RAG off, publication frozen.");
}

if (require.main === module) runKnowledgeKEP5KeyRemediesWave4Test();
