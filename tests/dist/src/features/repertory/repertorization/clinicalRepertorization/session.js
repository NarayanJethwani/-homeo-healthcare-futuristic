"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClinicalRepertorizationSession = createClinicalRepertorizationSession;
exports.cloneSessionWithStrategy = cloneSessionWithStrategy;
function boundedWeight(value, fallback) {
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric))
        return fallback;
    return Math.max(0, numeric);
}
function selectedRubric(rubric, input, selectedAt) {
    return {
        rubric,
        rubricWeight: boundedWeight(input.rubricWeights?.[rubric.id], rubric.searchWeight || 1),
        symptomImportance: boundedWeight(input.symptomImportance?.[rubric.id], 1),
        selectedAt,
    };
}
function createClinicalRepertorizationSession(input) {
    const createdAt = input.createdAt || new Date().toISOString();
    return {
        id: input.id,
        selectedRubrics: input.rubrics.map((rubric) => selectedRubric(rubric, input, createdAt)),
        strategyId: input.strategyId || "weighted_grades",
        exclusions: {
            remedyIds: Array.from(new Set(input.exclusions?.remedyIds || [])),
            rubricIds: Array.from(new Set(input.exclusions?.rubricIds || [])),
            reason: input.exclusions?.reason,
        },
        metadata: input.metadata || {},
        createdAt,
        updatedAt: createdAt,
    };
}
function cloneSessionWithStrategy(session, strategyId) {
    return {
        ...session,
        strategyId,
        updatedAt: new Date().toISOString(),
    };
}
