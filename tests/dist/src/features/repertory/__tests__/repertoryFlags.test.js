"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const repertoryFlags_1 = require("../flags/repertoryFlags");
const disabled = (0, repertoryFlags_1.getRepertoryFeatureFlags)({});
assert_1.default.deepStrictEqual(disabled, {
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
    compareModeEnabled: false,
    liveModeEnabled: false,
    feedbackEnabled: false,
});
const enabled = (0, repertoryFlags_1.getRepertoryFeatureFlags)({
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
    NEXT_PUBLIC_REPERTORY_V2_COMPARE_MODE: "true",
    NEXT_PUBLIC_REPERTORY_V2_LIVE_MODE: "true",
    REPERTORY_V2_FEEDBACK_ENABLED: "true",
});
assert_1.default.strictEqual(enabled.uiEnabled, true);
assert_1.default.strictEqual(enabled.apiEnabled, true);
assert_1.default.strictEqual(enabled.readFromFirestore, true);
assert_1.default.strictEqual(enabled.writeEnabled, true);
assert_1.default.strictEqual(enabled.showScoreBreakdown, true);
assert_1.default.strictEqual(enabled.aiMappingReview, true);
assert_1.default.strictEqual(enabled.useIndexedSearch, true);
assert_1.default.strictEqual(enabled.useClinicalSearchEngine, true);
assert_1.default.strictEqual(enabled.useRubricIntelligence, true);
assert_1.default.strictEqual(enabled.useClinicalRepertorizationEngine, true);
assert_1.default.strictEqual(enabled.useClinicalValidationFramework, true);
assert_1.default.strictEqual(enabled.useClinicalSearchShadowMode, true);
assert_1.default.strictEqual(enabled.compareModeEnabled, true);
assert_1.default.strictEqual(enabled.liveModeEnabled, true);
assert_1.default.strictEqual(enabled.feedbackEnabled, true);
console.log("repertoryFlags.test.ts passed");
