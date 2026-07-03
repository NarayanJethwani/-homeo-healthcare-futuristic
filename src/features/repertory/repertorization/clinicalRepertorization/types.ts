import { CanonicalRubric, CanonicalRubricRemedy, RemedyGrade } from "../../engine/canonicalTypes";

export type ClinicalScoringStrategyId =
  | "kent_style"
  | "sum_of_grades"
  | "weighted_grades"
  | "weighted_symptom_importance"
  | "frequency_normalized"
  | string;

export interface SelectedClinicalRubric {
  rubric: CanonicalRubric;
  rubricWeight: number;
  symptomImportance: number;
  selectedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ClinicalRepertorizationExclusions {
  remedyIds: string[];
  rubricIds: string[];
  reason?: string;
}

export interface ClinicalRepertorizationSession {
  id: string;
  selectedRubrics: SelectedClinicalRubric[];
  strategyId: ClinicalScoringStrategyId;
  exclusions: ClinicalRepertorizationExclusions;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ScoringContext {
  session: ClinicalRepertorizationSession;
  remedyFrequencyById: Map<string, number>;
  maxPossibleGrade: RemedyGrade;
}

export interface ScoringInput {
  selectedRubric: SelectedClinicalRubric;
  rubricRemedy: CanonicalRubricRemedy;
  context: ScoringContext;
}

export interface ScoringStrategy {
  id: ClinicalScoringStrategyId;
  label: string;
  description: string;
  score(input: ScoringInput): number;
}

export interface RubricContribution {
  rubricId: string;
  rubricTitle: string;
  remedyId: string;
  remedyName?: string;
  grade: RemedyGrade;
  sourceGrade?: number;
  rubricWeight: number;
  symptomImportance: number;
  gradeContribution: number;
  weightContribution: number;
  strategyContribution: number;
  percentageContribution: number;
}

export interface RemedyRanking {
  remedyId: string;
  remedyName?: string;
  totalScore: number;
  weightedScore: number;
  normalizedScore: number;
  confidenceScore: number;
  matchedRubricCount: number;
  missingRubricIds: string[];
  contributions: RubricContribution[];
  whyRanked: string[];
}

export interface ClinicalRepertorizationResult {
  sessionId: string;
  strategyId: ClinicalScoringStrategyId;
  generatedAt: string;
  rankings: RemedyRanking[];
  selectedRubricCount: number;
  excludedRemedyIds: string[];
  excludedRubricIds: string[];
  metadata: Record<string, unknown>;
}

export interface RemedyComparison {
  remedyIds: string[];
  sharedRubricIds: string[];
  uniqueRubricIdsByRemedy: Record<string, string[]>;
  strongestRubricsByRemedy: Record<string, RubricContribution[]>;
  weakestRubricsByRemedy: Record<string, RubricContribution[]>;
  clinicalDifferences: string[];
}

export interface SerializedClinicalSession {
  version: 1;
  session: ClinicalRepertorizationSession;
}

export interface RepertorizationBenchmarkCase {
  rubricCount: number;
  executionMs: number;
  memoryDeltaBytes: number;
  rankingStable: boolean;
  topRemedyId?: string;
}

export interface RepertorizationBenchmarkResult {
  strategyId: ClinicalScoringStrategyId;
  cases: RepertorizationBenchmarkCase[];
  generatedAt: string;
}
