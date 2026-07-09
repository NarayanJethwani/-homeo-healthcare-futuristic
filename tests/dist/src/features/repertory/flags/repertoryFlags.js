"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repertoryFeatureFlags = void 0;
exports.getRepertoryFeatureFlags = getRepertoryFeatureFlags;
function isEnabled(value) {
    return value === "true" || value === "1";
}
function getRepertoryFeatureFlags(env = process.env) {
    return {
        uiEnabled: isEnabled(env.NEXT_PUBLIC_REPERTORY_V2_ENABLED),
        apiEnabled: isEnabled(env.REPERTORY_V2_API_ENABLED),
        readFromFirestore: isEnabled(env.REPERTORY_V2_READ_FROM_FIRESTORE),
        writeEnabled: isEnabled(env.REPERTORY_V2_WRITE_ENABLED),
        showScoreBreakdown: isEnabled(env.REPERTORY_V2_SHOW_SCORE_BREAKDOWN),
        aiMappingReview: isEnabled(env.REPERTORY_V2_AI_MAPPING_REVIEW),
        useIndexedSearch: isEnabled(env.REPERTORY_V2_USE_INDEXED_SEARCH),
        useClinicalSearchEngine: isEnabled(env.REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE),
        useRubricIntelligence: isEnabled(env.REPERTORY_V2_USE_RUBRIC_INTELLIGENCE),
        useClinicalRepertorizationEngine: isEnabled(env.REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE),
        useClinicalValidationFramework: isEnabled(env.REPERTORY_V2_USE_CLINICAL_VALIDATION_FRAMEWORK),
        useClinicalSearchShadowMode: isEnabled(env.REPERTORY_V2_SEARCH_SHADOW_MODE),
        compareModeEnabled: isEnabled(env.NEXT_PUBLIC_REPERTORY_V2_COMPARE_MODE) || isEnabled(env.REPERTORY_V2_COMPARE_MODE),
        liveModeEnabled: isEnabled(env.NEXT_PUBLIC_REPERTORY_V2_LIVE_MODE) || isEnabled(env.REPERTORY_V2_LIVE_MODE),
        feedbackEnabled: isEnabled(env.REPERTORY_V2_FEEDBACK_ENABLED),
    };
}
exports.repertoryFeatureFlags = getRepertoryFeatureFlags();
