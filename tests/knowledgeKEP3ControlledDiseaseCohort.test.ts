import assert from "assert";
import fs from "fs";
import path from "path";
import {
  buildKEP3ControlledDiseasePackage,
  computeM5EvaluationMetrics,
  generateM5AuthorizationPacket,
  M5_OFFLINE_EVALUATION_CASES,
} from "../src/features/knowledge/expansion/kep3ControlledDiseaseCohortPackage";

export function runKnowledgeKEP3ControlledDiseaseCohortTest(): void {
  const pkg = buildKEP3ControlledDiseasePackage();

  assert.strictEqual(pkg.programId, "KEP-3");
  assert.strictEqual(pkg.milestoneId, "M5");
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.entities.length, 5);
  assert.strictEqual(pkg.relationshipProposals.length, 25);

  for (const prop of pkg.relationshipProposals) {
    assert.strictEqual(prop.status, "draft");
    assert.strictEqual(prop.publicationEligible, false);
    assert.strictEqual(prop.ragEligible, false);
  }

  const cases = M5_OFFLINE_EVALUATION_CASES;
  assert.strictEqual(cases.length, 50);

  const metrics = computeM5EvaluationMetrics(cases);

  assert.strictEqual(metrics.caseCount, 50);
  assert.strictEqual(metrics.minimumCasesPerEntity, 10);
  assert.strictEqual(metrics.recallAt5, 1.0);
  assert.strictEqual(metrics.meanReciprocalRank, 1.0);
  assert.strictEqual(metrics.citationPrecision, 1.0);
  assert.strictEqual(metrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(metrics.emergencyEscalationFailureCount, 0);
  assert.strictEqual(metrics.abstentionFailureCount, 0);
  assert.strictEqual(metrics.withdrawnContentLeakageCount, 0);
  assert.strictEqual(metrics.passedCaseCount, 50);
  assert.strictEqual(metrics.failedCaseCount, 0);

  const packageSha256 = generateM5AuthorizationPacket();
  assert.ok(packageSha256, "Package SHA-256 must be generated");

  console.log(
    "✅ Milestone M5 KEP-3 Controlled Disease Cohort passed: 5 target disease entities upgraded to v1.1.0 (Allergic Rhinitis, Hypertension, Diabetes Mellitus, Hypothyroidism, Anemia), 25 governed draft graph proposals, 50 offline evaluation cases passed (100% pass rate), emergency safety red flags verified, authorization packet generated."
  );
}

if (require.main === module) {
  runKnowledgeKEP3ControlledDiseaseCohortTest();
}
