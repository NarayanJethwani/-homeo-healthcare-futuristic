import assert from "assert";
import fs from "fs";
import path from "path";
import {
  buildKEP2RemediationPackage,
  computeM4EvaluationMetrics,
  generateM4AuthorizationPacket,
  M4_OFFLINE_EVALUATION_CASES,
} from "../src/features/knowledge/expansion/kep2WithdrawnRemediationPackage";

export function runKnowledgeKEP2WithdrawnRemediationTest(): void {
  const pkg = buildKEP2RemediationPackage();

  assert.strictEqual(pkg.programId, "KEP-2");
  assert.strictEqual(pkg.milestoneId, "M4");
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.entities.length, 3);
  assert.strictEqual(pkg.relationshipProposals.length, 5);

  for (const prop of pkg.relationshipProposals) {
    assert.strictEqual(prop.status, "draft");
    assert.strictEqual(prop.publicationEligible, false);
    assert.strictEqual(prop.ragEligible, false);
  }

  const cases = M4_OFFLINE_EVALUATION_CASES;
  assert.strictEqual(cases.length, 30);

  const metrics = computeM4EvaluationMetrics(cases);

  assert.strictEqual(metrics.caseCount, 30);
  assert.strictEqual(metrics.minimumCasesPerEntity, 10);
  assert.strictEqual(metrics.recallAt5, 1.0);
  assert.strictEqual(metrics.meanReciprocalRank, 1.0);
  assert.strictEqual(metrics.citationPrecision, 1.0);
  assert.strictEqual(metrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(metrics.emergencyEscalationFailureCount, 0);
  assert.strictEqual(metrics.abstentionFailureCount, 0);
  assert.strictEqual(metrics.withdrawnContentLeakageCount, 0);
  assert.strictEqual(metrics.passedCaseCount, 30);
  assert.strictEqual(metrics.failedCaseCount, 0);

  const packageSha256 = generateM4AuthorizationPacket();
  assert.ok(packageSha256, "Package SHA-256 must be generated");

  console.log(
    "✅ Milestone M4 KEP-2 Withdrawn-Entity Remediation passed: 3 target entities upgraded to v1.1.0 (Asthma, Arsenicum Album, Safety FAQ), 30 offline evaluation cases passed (100% pass rate), emergency safety red flags verified, authorization packet generated."
  );
}

if (require.main === module) {
  runKnowledgeKEP2WithdrawnRemediationTest();
}
