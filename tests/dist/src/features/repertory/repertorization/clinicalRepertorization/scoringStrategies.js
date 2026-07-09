"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILT_IN_SCORING_STRATEGIES = exports.frequencyNormalizedStrategy = exports.weightedSymptomImportanceStrategy = exports.weightedGradesStrategy = exports.sumOfGradesStrategy = exports.kentStyleStrategy = void 0;
exports.createScoringStrategyRegistry = createScoringStrategyRegistry;
exports.getScoringStrategy = getScoringStrategy;
const canonicalTypes_1 = require("../../engine/canonicalTypes");
function grade(input) {
    return (0, canonicalTypes_1.getRemedyGradeWeight)(input.rubricRemedy.grade);
}
function rubricWeight(input) {
    return input.selectedRubric.rubricWeight || 1;
}
function symptomImportance(input) {
    return input.selectedRubric.symptomImportance || 1;
}
exports.kentStyleStrategy = {
    id: "kent_style",
    label: "Kent style",
    description: "Balances rubric coverage and remedy grade strength.",
    score: (input) => (grade(input) * 2) + 1,
};
exports.sumOfGradesStrategy = {
    id: "sum_of_grades",
    label: "Sum of grades",
    description: "Adds remedy grades across selected rubrics.",
    score: (input) => grade(input),
};
exports.weightedGradesStrategy = {
    id: "weighted_grades",
    label: "Weighted grades",
    description: "Multiplies remedy grade by rubric weight.",
    score: (input) => grade(input) * rubricWeight(input),
};
exports.weightedSymptomImportanceStrategy = {
    id: "weighted_symptom_importance",
    label: "Weighted symptom importance",
    description: "Multiplies grade by rubric weight and symptom importance.",
    score: (input) => grade(input) * rubricWeight(input) * symptomImportance(input),
};
exports.frequencyNormalizedStrategy = {
    id: "frequency_normalized",
    label: "Frequency normalized",
    description: "Reduces dominance from remedies appearing too frequently across selected rubrics.",
    score: (input) => {
        const frequency = input.context.remedyFrequencyById.get(input.rubricRemedy.remedyId) || 1;
        return (grade(input) * rubricWeight(input) * symptomImportance(input)) / Math.sqrt(frequency);
    },
};
exports.BUILT_IN_SCORING_STRATEGIES = [
    exports.kentStyleStrategy,
    exports.sumOfGradesStrategy,
    exports.weightedGradesStrategy,
    exports.weightedSymptomImportanceStrategy,
    exports.frequencyNormalizedStrategy,
];
function createScoringStrategyRegistry(customStrategies = []) {
    const registry = new Map();
    [...exports.BUILT_IN_SCORING_STRATEGIES, ...customStrategies].forEach((strategy) => {
        registry.set(strategy.id, strategy);
    });
    return registry;
}
function getScoringStrategy(strategyId, customStrategies = []) {
    const strategy = createScoringStrategyRegistry(customStrategies).get(strategyId);
    if (!strategy)
        throw new Error(`Unknown clinical scoring strategy: ${strategyId}`);
    return strategy;
}
