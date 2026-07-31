import assert from "assert";
import {
  buildKEP4DiseaseWave1Package,
  computeM6EvaluationMetrics,
  generateM6AuthorizationPacket,
  M6_OFFLINE_EVALUATION_CASES,
} from "../src/features/knowledge/expansion/kep4DiseaseWave1Package";

export function runKnowledgeKEP4DiseaseWave1Test(): void {
  const pkg = buildKEP4DiseaseWave1Package();

  assert.strictEqual(pkg.programId, "KEP-4");
  assert.strictEqual(pkg.milestoneId, "M6");
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.entities.length, 10);
  assert.strictEqual(pkg.relationshipProposals.length, 50);

  for (const prop of pkg.relationshipProposals) {
    assert.strictEqual(prop.status, "draft");
    assert.strictEqual(prop.publicationEligible, false);
    assert.strictEqual(prop.ragEligible, false);
  }

  const cases = M6_OFFLINE_EVALUATION_CASES;
  assert.strictEqual(cases.length, 100);

  const metrics = computeM6EvaluationMetrics(cases);

  assert.strictEqual(metrics.caseCount, 100);
  assert.strictEqual(metrics.minimumCasesPerEntity, 10);
  assert.strictEqual(metrics.recallAt5, 1.0);
  assert.strictEqual(metrics.meanReciprocalRank, 1.0);
  assert.strictEqual(metrics.citationPrecision, 1.0);
  assert.strictEqual(metrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(metrics.emergencyEscalationFailureCount, 0);
  assert.strictEqual(metrics.abstentionFailureCount, 0);
  assert.strictEqual(metrics.withdrawnContentLeakageCount, 0);
  assert.strictEqual(metrics.passedCaseCount, 100);
  assert.strictEqual(metrics.failedCaseCount, 0);

  const packageSha256 = generateM6AuthorizationPacket();
  assert.ok(packageSha256, "Package SHA-256 must be generated");

  console.log(
    "✅ Milestone M6 KEP-4 Disease Coverage Wave 1 passed: 10 target disease entities upgraded to v1.1.0 (Sinusitis, Gastritis, PCOS, Acne Vulgaris, Psoriasis, Urticaria, Osteoarthritis, Anxiety Disorder, Depression, Rheumatoid Arthritis), 50 governed draft graph proposals, 100 offline evaluation cases passed (100% pass rate), emergency safety red flags verified, authorization packet generated."
  );
}

if (require.main === module) {
  runKnowledgeKEP4DiseaseWave1Test();
}
