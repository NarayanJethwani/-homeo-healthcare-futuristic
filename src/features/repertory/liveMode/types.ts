import { ClinicalRepertorizationResult, RemedyRanking } from "../repertorization/clinicalRepertorization";

export type ClinicalEngineMode = "v1" | "compare" | "v2-live";

export interface V2LiveFilters {
  category?: string;
  organSystem?: string;
  miasm?: string;
  remedy?: string;
}

export interface V2RubricSnapshot {
  id: string;
  title: string;
  source?: string;
  category?: string;
  organSystem?: string;
  breadcrumb?: string;
  score?: number;
  matchedFields?: string[];
  synonymMatchCount?: number;
  hierarchyMatchCount?: number;
}

export interface V2RankingSnapshot {
  remedyId: string;
  remedyName?: string;
  rank: number;
  totalScore: number;
  weightedScore: number;
  normalizedScore: number;
  confidenceScore: number;
  matchedRubricCount: number;
  missingRubricIds: string[];
  whyRanked: string[];
  contributions: Array<{
    rubricId: string;
    rubricTitle: string;
    grade: number;
    rubricWeight: number;
    symptomImportance: number;
    strategyContribution: number;
    percentageContribution: number;
  }>;
}

export interface V2SearchRun {
  count: number;
  latencyMs: number;
  topRubrics: V2RubricSnapshot[];
  synonymMatches: Array<{
    rubricId: string;
    matchCount: number;
  }>;
}

export interface V2RepertorizationRun {
  latencyMs: number;
  selectedRubricCount: number;
  rankings: V2RankingSnapshot[];
  warnings: string[];
  result: ClinicalRepertorizationResult;
}

export interface V1SearchRun {
  count: number;
  latencyMs: number;
  topRubrics: V2RubricSnapshot[];
  rankings: Array<Pick<RemedyRanking, "remedyId" | "totalScore" | "matchedRubricCount">>;
}

export interface V2ComparisonResult {
  success: true;
  mode: "compare";
  query: string;
  filters: V2LiveFilters;
  safetyNotice: string;
  v1: V1SearchRun;
  v2: V2SearchRun & {
    repertorization: V2RepertorizationRun;
  };
  comparison: {
    commonRubrics: V2RubricSnapshot[];
    v1OnlyRubrics: V2RubricSnapshot[];
    v2OnlyRubrics: V2RubricSnapshot[];
    rankingDifferences: Array<{
      rubricId: string;
      title?: string;
      v1Rank: number | null;
      v2Rank: number | null;
      rankDelta: number | null;
    }>;
    scoreDifferences: Array<{
      remedyId: string;
      v1Score?: number;
      v2Score?: number;
      delta?: number;
    }>;
    clinicalExplanation: string[];
  };
}

export interface V2LiveResult {
  success: true;
  mode: "v2-live";
  query: string;
  filters: V2LiveFilters;
  safetyNotice: string;
  search: V2SearchRun;
  repertorization: V2RepertorizationRun;
  clinicalExplanation: string[];
}

export type V2ClinicalFeedbackDecision =
  | "v2_better"
  | "v1_better"
  | "both_acceptable"
  | "v2_missed_important_rubric"
  | "v2_found_useful_rubric"
  | "needs_correction"
  | "clinical_note";

export interface V2ClinicalFeedbackPayload {
  mode: "compare" | "v2-live";
  decision: V2ClinicalFeedbackDecision;
  note?: string;
  query: string;
  filters?: V2LiveFilters;
  v1TopRubricIds?: string[];
  v2TopRubricIds?: string[];
  v2TopRemedyIds?: string[];
  comparisonSummary?: Record<string, unknown>;
}

export const CLINICAL_REVIEW_REQUIRED_NOTICE = "Clinical review required — do not auto-prescribe";
