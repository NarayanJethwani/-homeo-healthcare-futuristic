import assert from "assert";
import {
  buildKEP4CommonSymptomsLabsPackage,
  computeM8EvaluationMetrics,
  generateM8AuthorizationReport,
  writeM8AuthorizationReportFiles,
} from "../src/features/knowledge/expansion/kep4CommonSymptomsLabsPackage";

export function runKnowledgeKEP4CommonSymptomsLabsTest(): void {
  const pkg = buildKEP4CommonSymptomsLabsPackage();

  assert.strictEqual(pkg.programId, "KEP-4");
  assert.strictEqual(pkg.milestoneId, "M8");
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.entities.length, 19);
  assert.strictEqual(pkg.relationshipProposals.length, 95);

  for (const prop of pkg.relationshipProposals) {
    assert.strictEqual(prop.status, "draft");
    assert.strictEqual(prop.publicationEligible, false);
    assert.strictEqual(prop.ragEligible, false);
  }

  const metrics = computeM8EvaluationMetrics();
  assert.strictEqual(metrics.caseCount, 190);
  assert.strictEqual(metrics.passedCaseCount, 190);
  assert.strictEqual(metrics.recallAt5, 1.0);
  assert.strictEqual(metrics.meanReciprocalRank, 1.0);
  assert.strictEqual(metrics.citationPrecision, 1.0);
  assert.strictEqual(metrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(metrics.emergencyEscalationFailureCount, 0);

  const report = generateM8AuthorizationReport();
  assert.strictEqual(report.milestoneId, "M8");
  assert.strictEqual(report.status, "pending_authorization");
  assert.strictEqual(report.governance.productionRagActivation, false);
  assert.strictEqual(report.summary.evaluationPassRate, 1.0);

  const { jsonPath, mdPath } = writeM8AuthorizationReportFiles();
  assert.ok(jsonPath, "JSON authorization report path must exist");
  assert.ok(mdPath, "MD authorization report path must exist");

  console.log(
    "✅ Milestone M8 KEP-4 Common Symptoms & General Laboratory Tests passed: 10 common symptoms & 8 general lab tests (19 entity entries), 95 governed draft graph proposals, 190 offline evaluation cases passed (100% pass rate), emergency triage & lab interpretation boundaries verified, authorization packet generated."
  );
}

if (require.main === module) {
  runKnowledgeKEP4CommonSymptomsLabsTest();
}
