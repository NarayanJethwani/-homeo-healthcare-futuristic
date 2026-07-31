import assert from "assert";
import fs from "fs";
import path from "path";
import {
  buildM3GoNoGoRecord,
  generateFlagshipM3GoNoGoReport,
} from "../src/features/knowledge/evaluation/flagshipM3GoNoGoEngine";

export function runKnowledgeFlagshipM3GoNoGoTest(): void {
  const record = buildM3GoNoGoRecord();

  assert.strictEqual(record.status, "go");
  assert.strictEqual(record.milestoneId, "M3");
  assert.strictEqual(record.productionRagActivation, false);
  assert.strictEqual(record.flagshipEntities.length, 8);

  for (const entity of record.flagshipEntities) {
    assert.strictEqual(
      entity.independentClinicalCheckPerformed,
      true,
      `Clinical check must be performed for ${entity.entityId}`
    );
    assert.ok(entity.contentSha256, `SHA-256 hash must exist for ${entity.entityId}`);
  }

  assert.strictEqual(record.aggregatedMetrics.caseCount, 160);
  assert.strictEqual(record.aggregatedMetrics.passedCaseCount, 160);
  assert.strictEqual(record.aggregatedMetrics.failedCaseCount, 0);
  assert.strictEqual(record.aggregatedMetrics.unsupportedClaimFailureCount, 0);
  assert.strictEqual(record.aggregatedMetrics.emergencyEscalationFailureCount, 0);
  assert.strictEqual(record.aggregatedMetrics.abstentionFailureCount, 0);
  assert.strictEqual(record.aggregatedMetrics.withdrawnContentLeakageCount, 0);

  assert.strictEqual(record.canaryRollbackExercise.canaryPublicationAuthorized, true);
  assert.strictEqual(record.canaryRollbackExercise.canaryRagAuthorized, false);
  assert.strictEqual(record.canaryRollbackExercise.publicationRagSeparated, true);
  assert.strictEqual(record.canaryRollbackExercise.simulatedRollbackExecuted, true);
  assert.strictEqual(record.canaryRollbackExercise.residualDraftLeakageDetected, false);
  assert.strictEqual(record.canaryRollbackExercise.rollbackStateRestored, true);

  const reportMd = generateFlagshipM3GoNoGoReport(record);

  const reportsDir = path.resolve(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m3-flagship-go-no-go.md"),
    reportMd,
    "utf8"
  );

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m3-flagship-go-no-go.json"),
    JSON.stringify(record, null, 2),
    "utf8"
  );

  console.log(
    "✅ Milestone M3 Flagship Review & Go/No-Go Decision passed: 8 flagship entities v1.1.0 risk-lane checked, 160 offline evaluation cases aggregated (100% pass rate), canary/rollback exercise verified, reports generated."
  );
}

if (require.main === module) {
  runKnowledgeFlagshipM3GoNoGoTest();
}
