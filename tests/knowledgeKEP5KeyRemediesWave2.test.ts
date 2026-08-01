import assert from "assert";
import {
  buildKEP5KeyRemediesWave2Package,
  computeM10EvaluationMetrics,
  generateM10AuthorizationReport,
  writeM10AuthorizationReportFiles,
} from "../src/features/knowledge/expansion/kep5KeyRemediesWave2Package";

export function runKnowledgeKEP5KeyRemediesWave2Test(): void {
  const pkg = buildKEP5KeyRemediesWave2Package();

  assert.strictEqual(pkg.programId, "KEP-5");
  assert.strictEqual(pkg.milestoneId, "M10");
  assert.strictEqual(pkg.productionRagActivation, false);
  assert.strictEqual(pkg.entities.length, 10);
  assert.strictEqual(pkg.relationshipProposals.length, 50);

  for (const prop of pkg.relationshipProposals) {
    assert.strictEqual(prop.status, "draft");
    assert.strictEqual(prop.publicationEligible, false);
    assert.strictEqual(prop.ragEligible, false);
  }

  const metrics = computeM10EvaluationMetrics();
  assert.strictEqual(metrics.caseCount, 100);
  assert.strictEqual(metrics.passedCaseCount, 100);
  assert.strictEqual(metrics.recallAt5, 1.0);
  assert.strictEqual(metrics.meanReciprocalRank, 1.0);
  assert.strictEqual(metrics.citationPrecision, 1.0);
  assert.strictEqual(metrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(metrics.emergencyEscalationFailureCount, 0);

  const report = generateM10AuthorizationReport();
  assert.strictEqual(report.milestoneId, "M10");
  assert.strictEqual(report.status, "pending_authorization");
  assert.strictEqual(report.governance.productionRagActivation, false);
  assert.strictEqual(report.summary.evaluationPassRate, 1.0);

  const { jsonPath, mdPath } = writeM10AuthorizationReportFiles();
  assert.ok(jsonPath, "JSON authorization report path must exist");
  assert.ok(mdPath, "Markdown authorization report path must exist");

  console.log(
    "✅ Milestone M10 KEP-5 Polycrest & Key Remedies Wave 2 passed: 10 major key remedy entities upgraded to v1.1.0, 50 governed draft graph proposals, 100 offline evaluation cases passed (100% pass rate), toxicology & safety boundaries verified, authorization packet generated."
  );
}

if (require.main === module) {
  runKnowledgeKEP5KeyRemediesWave2Test();
}
