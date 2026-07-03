import { RemedyGrade } from "../../engine/canonicalTypes";
import {
  ClinicalRepertorizationResult,
  ClinicalScoringStrategyId,
  RemedyRanking,
} from "../../repertorization/clinicalRepertorization";

export interface BenchmarkCaseRemedy {
  remedyId: string;
  remedyName?: string;
  grade: RemedyGrade;
  sourceGrade?: number;
  isEliminating?: boolean;
}

export interface BenchmarkCaseRubric {
  id: string;
  title: string;
  rubricWeight?: number;
  symptomImportance?: number;
  remedies: BenchmarkCaseRemedy[];
  metadata?: Record<string, unknown>;
}

export interface ExpectedTopRemedy {
  remedyId: string;
  minRank?: number;
  maxRank: number;
  minimumScore?: number;
}

export interface BenchmarkReference {
  source: string;
  note?: string;
  url?: string;
}

export interface ClinicalBenchmarkCase {
  id: string;
  caseName: string;
  selectedRubrics: BenchmarkCaseRubric[];
  rubricWeights?: Record<string, number>;
  expectedTopRemedies: ExpectedTopRemedy[];
  expectedRankingTolerance: number;
  clinicalNotes: string;
  references: BenchmarkReference[];
  strategyId?: ClinicalScoringStrategyId;
  exclusions?: {
    remedyIds?: string[];
    rubricIds?: string[];
    reason?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface BenchmarkExpectationResult {
  remedyId: string;
  expectedRange: [number, number];
  actualRank: number | null;
  passed: boolean;
  score?: number;
}

export interface ExplainabilityVerificationResult {
  remedyId: string;
  hasWhySelected: boolean;
  hasContributingRubrics: boolean;
  hasContributingGrades: boolean;
  hasWeighting: boolean;
  hasConfidence: boolean;
  passed: boolean;
}

export interface ClinicalBenchmarkCaseResult {
  caseId: string;
  caseName: string;
  strategyId: ClinicalScoringStrategyId;
  passed: boolean;
  executionMs: number;
  rankings: RemedyRanking[];
  expectationResults: BenchmarkExpectationResult[];
  explainabilityResults: ExplainabilityVerificationResult[];
  result: ClinicalRepertorizationResult;
}

export interface ClinicalBenchmarkRunResult {
  runId: string;
  generatedAt: string;
  caseResults: ClinicalBenchmarkCaseResult[];
  passed: boolean;
  summary: {
    totalCases: number;
    passedCases: number;
    failedCases: number;
    averageExecutionMs: number;
  };
}

export interface RegressionDifference {
  caseId: string;
  remedyId: string;
  previousRank: number | null;
  currentRank: number | null;
  previousScore?: number;
  currentScore?: number;
  rankChanged: boolean;
  scoreDelta: number;
}

export interface RegressionComparisonResult {
  previousRunId: string;
  currentRunId: string;
  passed: boolean;
  differences: RegressionDifference[];
}

export interface ValidationPerformanceCaseResult {
  rubricCount: number;
  executionMs: number;
  memoryDeltaBytes: number;
  rankingStable: boolean;
  topRemedyId?: string;
}

export interface ValidationPerformanceReport {
  generatedAt: string;
  strategyId: ClinicalScoringStrategyId;
  cases: ValidationPerformanceCaseResult[];
}
