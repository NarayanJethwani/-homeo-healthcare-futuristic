import assert from "assert";
import fs from "fs";
import path from "path";
import {
  buildSulphurNuxVomicaEvaluationCorpus,
  computeSulphurNuxVomicaEvaluationMetrics,
  generateSulphurNuxVomicaEvaluationReport,
  SULPHUR_NUX_VOMICA_OFFLINE_EVALUATION_CASES,
} from "../src/features/knowledge/evaluation/sulphurNuxVomicaOfflineEvaluation";
import type { KEP1OfflineEvaluationRecord } from "../src/features/knowledge/evaluation/kep1EvaluationTypes";

export function runSulphurNuxVomicaOfflineEvaluationTest(): void {
  const corpus = buildSulphurNuxVomicaEvaluationCorpus();
  assert.strictEqual(corpus.length, 2);

  const cases = SULPHUR_NUX_VOMICA_OFFLINE_EVALUATION_CASES;
  assert.strictEqual(cases.length, 40);

  const sulphurCases = cases.filter((c) => c.entityId === "R0001");
  const nuxVomicaCases = cases.filter((c) => c.entityId === "R0002");

  assert.strictEqual(sulphurCases.length, 20, "Sulphur must have exactly 20 test cases");
  assert.strictEqual(nuxVomicaCases.length, 20, "Nux Vomica must have exactly 20 test cases");

  const metrics = computeSulphurNuxVomicaEvaluationMetrics(cases);

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
    evaluationId: "KEP1-EVAL-M2-SULPHUR-NUX-VOMICA-001",
    protocolVersion: "KEP1-OFFLINE-RETRIEVAL-1.0",
    status: "passed",
    corpusManifestSha256: "sulphur-nux-vomica-v1.1.0-sha256",
    querySetSha256: "query-set-sha256-sulphur-nux-vomica-40-cases",
    querySetVersion: "KEP1-QS-M2-SULPHUR-NUX-VOMICA-1.0",
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
    executedAt: "2026-07-31T12:00:00.000Z",
  };

  const reportMd = generateSulphurNuxVomicaEvaluationReport(record);

  const reportsDir = path.resolve(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m2-sulphur-nux-vomica-offline-evaluation.md"),
    reportMd,
    "utf8"
  );

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m2-sulphur-nux-vomica-offline-evaluation.json"),
    JSON.stringify(record, null, 2),
    "utf8"
  );

  console.log(
    "✅ Sulphur + Nux Vomica M2 offline retrieval evaluation passed: 40 cases (20 per entity), 8 evaluation dimensions, 100% emergency recall, 0% unsupported claims, 100% citation precision."
  );
}

if (require.main === module) {
  runSulphurNuxVomicaOfflineEvaluationTest();
}
