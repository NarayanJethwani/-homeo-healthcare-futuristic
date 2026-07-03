import { getRemedyGradeWeight } from "../../engine/canonicalTypes";
import { ScoringInput, ScoringStrategy } from "./types";

function grade(input: ScoringInput): number {
  return getRemedyGradeWeight(input.rubricRemedy.grade);
}

function rubricWeight(input: ScoringInput): number {
  return input.selectedRubric.rubricWeight || 1;
}

function symptomImportance(input: ScoringInput): number {
  return input.selectedRubric.symptomImportance || 1;
}

export const kentStyleStrategy: ScoringStrategy = {
  id: "kent_style",
  label: "Kent style",
  description: "Balances rubric coverage and remedy grade strength.",
  score: (input) => (grade(input) * 2) + 1,
};

export const sumOfGradesStrategy: ScoringStrategy = {
  id: "sum_of_grades",
  label: "Sum of grades",
  description: "Adds remedy grades across selected rubrics.",
  score: (input) => grade(input),
};

export const weightedGradesStrategy: ScoringStrategy = {
  id: "weighted_grades",
  label: "Weighted grades",
  description: "Multiplies remedy grade by rubric weight.",
  score: (input) => grade(input) * rubricWeight(input),
};

export const weightedSymptomImportanceStrategy: ScoringStrategy = {
  id: "weighted_symptom_importance",
  label: "Weighted symptom importance",
  description: "Multiplies grade by rubric weight and symptom importance.",
  score: (input) => grade(input) * rubricWeight(input) * symptomImportance(input),
};

export const frequencyNormalizedStrategy: ScoringStrategy = {
  id: "frequency_normalized",
  label: "Frequency normalized",
  description: "Reduces dominance from remedies appearing too frequently across selected rubrics.",
  score: (input) => {
    const frequency = input.context.remedyFrequencyById.get(input.rubricRemedy.remedyId) || 1;
    return (grade(input) * rubricWeight(input) * symptomImportance(input)) / Math.sqrt(frequency);
  },
};

export const BUILT_IN_SCORING_STRATEGIES: ScoringStrategy[] = [
  kentStyleStrategy,
  sumOfGradesStrategy,
  weightedGradesStrategy,
  weightedSymptomImportanceStrategy,
  frequencyNormalizedStrategy,
];

export function createScoringStrategyRegistry(customStrategies: ScoringStrategy[] = []): Map<string, ScoringStrategy> {
  const registry = new Map<string, ScoringStrategy>();

  [...BUILT_IN_SCORING_STRATEGIES, ...customStrategies].forEach((strategy) => {
    registry.set(strategy.id, strategy);
  });

  return registry;
}

export function getScoringStrategy(strategyId: string, customStrategies: ScoringStrategy[] = []): ScoringStrategy {
  const strategy = createScoringStrategyRegistry(customStrategies).get(strategyId);
  if (!strategy) throw new Error(`Unknown clinical scoring strategy: ${strategyId}`);
  return strategy;
}
