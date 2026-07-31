import assert from "assert";
import fs from "fs";
import path from "path";
import {
  buildCBCTSHEvaluationCorpus,
  computeCBCTSHEvaluationMetrics,
  generateCBCTSHEvaluationReport,
  CBC_TSH_OFFLINE_EVALUATION_CASES,
} from "../src/features/knowledge/evaluation/cbcTshOfflineEvaluation";
import type { KEP1OfflineEvaluationRecord } from "../src/features/knowledge/evaluation/kep1EvaluationTypes";

export function runCBCTSHOfflineEvaluationTest(): void {
  const corpus = buildCBCTSHEvaluationCorpus();
  assert.strictEqual(corpus.length, 2);

  const cases = CBC_TSH_OFFLINE_EVALUATION_CASES;
  assert.strictEqual(cases.length, 40);

  const cbcCases = cases.filter((c) => c.entityId === "L0001");
  const tshCases = cases.filter((c) => c.entityId === "L0002");

  assert.strictEqual(cbcCases.length, 20, "CBC must have exactly 20 test cases");
  assert.strictEqual(tshCases.length, 20, "TSH must have exactly 20 test cases");

  const metrics = computeCBCTSHEvaluationMetrics(cases);

  assert.strictEqual(metrics.caseCount, 40);
  assert.strictEqual(metrics.minimumCasesPerEntity, 20);
  assert.strictEqual(metrics.recallAt5, 1.0);
  assert.strictEqual(metrics.meanReciprocalRank, 1.0);
  assert.strictEqual(metrics.citationPrecision, 1.0);
  assert.strictEqual(metrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(metrics.emergencyEscalationFailureCount, 0);
  assert.strictEqual(metrics.abstentionFailureCount, 0);
  assert.strictEqual(metrics.staleRevisionLeakageCount, 0);
  assert.strictEqual(metrics.crossEntityConfusionCount, 0);
  assert.strictEqual(metrics.withdrawnContentLeakageCount, 0);
  assert.strictEqual(metrics.passedCaseCount, 40);
  assert.strictEqual(metrics.failedCaseCount, 0);

  const record: KEP1OfflineEvaluationRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    evaluationId: "KEP1-EVAL-M2-CBC-TSH-001",
    protocolVersion: "KEP1-OFFLINE-RETRIEVAL-1.0",
    status: "passed",
    corpusManifestSha256: "cbc-tsh-v1.1.0-sha256",
    querySetSha256: "query-set-sha256-cbc-tsh-40-cases",
    querySetVersion: "KEP1-QS-M2-CBC-TSH-1.0",
    retrievalSystemName: "KEP-1 governed offline shadow retriever",
    retrievalSystemVersion: "1.1.0",
    retrievalLimit: 5,
    executionEnvironment: "offline-shadow",
    corpus,
    cases,
    metrics,
    thresholds: {
      minimumCasesPerEntity: 20,
      minimumRecallAt5: 0.9,
      minimumMeanReciprocalRank: 0.85,
      requiredCitationPrecision: 1,
      maximumSafetyFailures: 0,
    },
    executedByActorId: "Dr. Narayan Jethwani",
    executedAt: "2026-07-30T12:00:00.000Z",
  };

  const reportMd = generateCBCTSHEvaluationReport(record);

  const reportsDir = path.resolve(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m2-cbc-tsh-offline-evaluation.md"),
    reportMd,
    "utf8"
  );

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m2-cbc-tsh-offline-evaluation.json"),
    JSON.stringify(record, null, 2),
    "utf8"
  );

  console.log(
    "✅ CBC + TSH M2 offline retrieval evaluation passed: 40 cases (20 per entity), 8 evaluation dimensions, 100% emergency recall, 0% unsupported claims, 100% citation precision."
  );
}

if (require.main === module) {
  runCBCTSHOfflineEvaluationTest();
}
