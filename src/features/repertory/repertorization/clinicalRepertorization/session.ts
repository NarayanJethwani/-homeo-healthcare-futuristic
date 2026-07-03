import { CanonicalRubric } from "../../engine/canonicalTypes";
import {
  ClinicalRepertorizationExclusions,
  ClinicalRepertorizationSession,
  ClinicalScoringStrategyId,
  SelectedClinicalRubric,
} from "./types";

export interface CreateClinicalSessionInput {
  id: string;
  rubrics: CanonicalRubric[];
  strategyId?: ClinicalScoringStrategyId;
  rubricWeights?: Record<string, number>;
  symptomImportance?: Record<string, number>;
  exclusions?: Partial<ClinicalRepertorizationExclusions>;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

function boundedWeight(value: unknown, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, numeric);
}

function selectedRubric(
  rubric: CanonicalRubric,
  input: CreateClinicalSessionInput,
  selectedAt: string,
): SelectedClinicalRubric {
  return {
    rubric,
    rubricWeight: boundedWeight(input.rubricWeights?.[rubric.id], rubric.searchWeight || 1),
    symptomImportance: boundedWeight(input.symptomImportance?.[rubric.id], 1),
    selectedAt,
  };
}

export function createClinicalRepertorizationSession(input: CreateClinicalSessionInput): ClinicalRepertorizationSession {
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

export function cloneSessionWithStrategy(
  session: ClinicalRepertorizationSession,
  strategyId: ClinicalScoringStrategyId,
): ClinicalRepertorizationSession {
  return {
    ...session,
    strategyId,
    updatedAt: new Date().toISOString(),
  };
}
