import assert from "assert";
import {
  buildKEP4SymptomsLabsPackage,
  computeM7EvaluationMetrics,
  generateM7AuthorizationPacket,
  M7_OFFLINE_EVALUATION_CASES,
} from "../src/features/knowledge/expansion/kep4SymptomsLabsPackage";

export function runKnowledgeKEP4SymptomsLabsTest(): void {
  const pkg = buildKEP4SymptomsLabsPackage();

  assert.strictEqual(pkg.programId, "KEP-4");
  assert.strictEqual(pkg.milestoneId, "M7");
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.entities.length, 18);
  assert.strictEqual(pkg.relationshipProposals.length, 90);

  for (const prop of pkg.relationshipProposals) {
    assert.strictEqual(prop.status, "draft");
    assert.strictEqual(prop.publicationEligible, false);
    assert.strictEqual(prop.ragEligible, false);
  }

  const cases = M7_OFFLINE_EVALUATION_CASES;
  assert.strictEqual(cases.length, 180);

  const metrics = computeM7EvaluationMetrics(cases);

  assert.strictEqual(metrics.caseCount, 180);
  assert.strictEqual(metrics.minimumCasesPerEntity, 10);
  assert.strictEqual(metrics.recallAt5, 1.0);
  assert.strictEqual(metrics.meanReciprocalRank, 1.0);
  assert.strictEqual(metrics.citationPrecision, 1.0);
  assert.strictEqual(metrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(metrics.emergencyEscalationFailureCount, 0);
  assert.strictEqual(metrics.abstentionFailureCount, 0);
  assert.strictEqual(metrics.withdrawnContentLeakageCount, 0);
  assert.strictEqual(metrics.passedCaseCount, 180);
  assert.strictEqual(metrics.failedCaseCount, 0);

  const packageSha256 = generateM7AuthorizationPacket();
  assert.ok(packageSha256, "Package SHA-256 must be generated");

  console.log(
    "✅ Milestone M7 KEP-4 High-Risk Symptoms & Laboratory Tests passed: 18 target entities (10 high-risk symptoms & 8 lab tests), 90 governed draft graph proposals, 180 offline evaluation cases passed (100% pass rate), emergency triage & lab interpretation boundaries verified, authorization packet generated."
  );
}

if (require.main === module) {
  runKnowledgeKEP4SymptomsLabsTest();
}
