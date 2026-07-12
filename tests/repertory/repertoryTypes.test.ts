import assert from "assert";
import {
  RepertorySourceId,
  RepertoryEditionId,
  RepertoryChapterId,
  RubricConceptId,
  RubricRecordId
} from "../../src/features/repertory/types/repertoryTypes";

export function runTypesTests() {
  console.log("▶ Running Repertory Types Tests...");

  const sourceId = "kent" as RepertorySourceId;
  const editionId = "kent_1908" as RepertoryEditionId;
  const chapterId = "Mind" as RepertoryChapterId;
  const conceptId = "c_123" as RubricConceptId;
  const recordId = "r_456" as RubricRecordId;

  assert.strictEqual(sourceId, "kent");
  assert.strictEqual(editionId, "kent_1908");
  assert.strictEqual(chapterId, "Mind");
  assert.strictEqual(conceptId, "c_123");
  assert.strictEqual(recordId, "r_456");

  console.log("✅ Repertory Types Tests Passed");
}
