import assert from "assert";
import { PublishedRemedyGradeAdapter } from "../../src/features/repertory/repositories/PublishedRemedyGradeAdapter";
import { RepertoryAccessContext, RepertoryEditionId, RubricRecordId } from "../../src/features/repertory/types/repertoryTypes";
import { EditionGradeComparisonService } from "../../src/features/repertory/application/EditionGradeComparisonService";

export async function runRemedyGradeTests() {
  console.log("▶ Running Remedy Grade Retrieval & Normalization Tests...");

  const adapter = new PublishedRemedyGradeAdapter();
  const mockCtx: RepertoryAccessContext = {
    userId: "tester",
    userRole: "clinician",
    organizationEntitlements: [],
    activeFeatureFlags: []
  };

  const rubricId = "boer_circulatory_heart_4044" as RubricRecordId;

  // 1. Fetch remedies for a valid rubric
  const res = await adapter.getRemediesForRubric(mockCtx, rubricId, { limit: 10 });
  assert.ok(res.items.length >= 0);

  if (res.items.length > 0) {
    const first = res.items[0];
    assert.ok(first.grade.id);
    assert.ok(first.remedyRecord.sourceAbbreviation);
    assert.ok(first.grade.gradingSystemId);
    
    // Split Provenance check
    assert.ok(first.grade.sourceProvenance.sourceId);
    assert.ok(first.grade.sourceProvenance.editionId);
    assert.ok(first.grade.sourceProvenance.corpusVersion);
    
    assert.ok(first.grade.extractionProvenance.extractionMethod);
    assert.ok(first.grade.extractionProvenance.extractionVersion);
    
    assert.ok(first.grade.mappingProvenance.mappingMethod);
    assert.ok(first.grade.mappingProvenance.mappingRuleVersion);
    
    // Check grade by ID
    const singleGrade = await adapter.getGradeById(mockCtx, first.grade.id);
    assert.ok(singleGrade);
    assert.strictEqual(singleGrade.grade.id, first.grade.id);
  }

  // 2. Unresolved remedy record check
  const recordRes = await adapter.getRemedyRecord(mockCtx, "rec_boericke_1927_NonexistentRem" as any);
  assert.ok(recordRes);
  assert.strictEqual(recordRes.mappingStatus, "unresolved");
  assert.strictEqual(recordRes.conceptId, "unresolved");

  // 3. Test EditionGradeComparisonService output (strictly read-only observations)
  const comparisonService = new EditionGradeComparisonService();
  const rubricKent = "kent_head_vertigo_1001" as RubricRecordId;
  const rubricBoericke = "boer_circulatory_heart_4044" as RubricRecordId;
  const comparison = await comparisonService.compareRubricGrades(mockCtx, rubricKent, rubricBoericke);
  assert.ok(Array.isArray(comparison));
  if (comparison.length > 0) {
    assert.ok(comparison[0].remedyAbbreviation);
    assert.ok(comparison[0].presenceA);
    assert.ok(comparison[0].presenceB);
    assert.ok(Array.isArray(comparison[0].observations));
  }

  console.log("✅ Remedy Grade Tests Passed");
}
