import assert from "assert";
import { getRepertoryFeatureFlags } from "../flags/repertoryFlags";

const disabled = getRepertoryFeatureFlags({});

assert.deepStrictEqual(disabled, {
  uiEnabled: false,
  apiEnabled: false,
  readFromFirestore: false,
  writeEnabled: false,
  showScoreBreakdown: false,
  aiMappingReview: false,
  useIndexedSearch: false,
  useClinicalSearchEngine: false,
  useRubricIntelligence: false,
  useClinicalRepertorizationEngine: false,
  useClinicalValidationFramework: false,
  useClinicalSearchShadowMode: false,
});

const enabled = getRepertoryFeatureFlags({
  NEXT_PUBLIC_REPERTORY_V2_ENABLED: "true",
  REPERTORY_V2_API_ENABLED: "1",
  REPERTORY_V2_READ_FROM_FIRESTORE: "true",
  REPERTORY_V2_WRITE_ENABLED: "true",
  REPERTORY_V2_SHOW_SCORE_BREAKDOWN: "true",
  REPERTORY_V2_AI_MAPPING_REVIEW: "true",
  REPERTORY_V2_USE_INDEXED_SEARCH: "true",
  REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE: "true",
  REPERTORY_V2_USE_RUBRIC_INTELLIGENCE: "true",
  REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE: "true",
  REPERTORY_V2_USE_CLINICAL_VALIDATION_FRAMEWORK: "true",
  REPERTORY_V2_SEARCH_SHADOW_MODE: "true",
});

assert.strictEqual(enabled.uiEnabled, true);
assert.strictEqual(enabled.apiEnabled, true);
assert.strictEqual(enabled.readFromFirestore, true);
assert.strictEqual(enabled.writeEnabled, true);
assert.strictEqual(enabled.showScoreBreakdown, true);
assert.strictEqual(enabled.aiMappingReview, true);
assert.strictEqual(enabled.useIndexedSearch, true);
assert.strictEqual(enabled.useClinicalSearchEngine, true);
assert.strictEqual(enabled.useRubricIntelligence, true);
assert.strictEqual(enabled.useClinicalRepertorizationEngine, true);
assert.strictEqual(enabled.useClinicalValidationFramework, true);
assert.strictEqual(enabled.useClinicalSearchShadowMode, true);

console.log("repertoryFlags.test.ts passed");
