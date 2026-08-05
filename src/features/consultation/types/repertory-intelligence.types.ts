/**
 * Domain Types for Phase 4 Clinical Decision Support, Repertory Search & Explainable Remedy Ranking
 */

export interface RepertoryScoringConfiguration {
  algorithmVersion: string;
  scoringConfigurationVersion: string;
  gradeWeights: Record<number, number>; // Grade 1 = 1, Grade 2 = 2, Grade 3 = 3, Grade 4 = 4
  characteristicMultiplier: number; // Default 1.5
  thermalAlignmentWeight: number; // Default 0.15 (+15%)
  miasmaticAlignmentWeight: number; // Default 0.15 (+15%)
  tieBreakStrategy: "symptom_coverage" | "grade_sum" | "alphabetical";
}

export const DEFAULT_SCORING_CONFIGURATION: RepertoryScoringConfiguration = {
  algorithmVersion: "v1.0.0-deterministic",
  scoringConfigurationVersion: "config-v1.0-default",
  gradeWeights: { 1: 1, 2: 2, 3: 3, 4: 4 },
  characteristicMultiplier: 1.5,
  thermalAlignmentWeight: 0.15,
  miasmaticAlignmentWeight: 0.15,
  tieBreakStrategy: "symptom_coverage",
};

export interface SelectedRubric {
  rubricId: string;
  sourceId: string;
  rubricPath: string[]; // e.g. ["MIND", "ANXIETY", "health, about"]
  weight: number; // User custom weight (default 1.0)
  characteristic: boolean; // Flagged as characteristic symptom
  excluded: boolean; // Temporarily excluded from scoring
  pinned: boolean; // Pinned by clinician
  addedAt: string;
  addedBy: string;
}

export interface RepertoryProvenance {
  sourceId: string;
  sourceTitle: string;
  editionId?: string;
  editionLabel?: string;
  author?: string;
  chapterId?: string;
  rubricId: string;
  rubricPath: string[];
  remedyGrade: number;
  repertoryVersion: string;
  retrievedAt: string;
}

export interface RemedyScoreBreakdown {
  rubricScore: number;
  characteristicAdjustment: number;
  thermalAdjustment: number;
  miasmaticAdjustment: number;
  matchedRubricCount: number;
  totalSelectedRubrics: number;
  finalScore: number;
}

export interface RemedyAnalysisMetadata {
  algorithmVersion: string;
  scoringConfigurationVersion: string;
  repertoryVersion: string;
  inputSnapshotHash: string;
  generatedAt: string;
  requestSequence: number;
  isStale: boolean;
}

export interface RankedRemedyResult {
  remedyId: string;
  remedyName: string;
  scoreBreakdown: RemedyScoreBreakdown;
  provenanceList: RepertoryProvenance[];
  keynoteExcerpt?: string;
  metadata: RemedyAnalysisMetadata;
}

export interface SafetyTrigger {
  ruleId: string;
  category: "cardiovascular" | "respiratory" | "neurological" | "anaphylactic" | "psychiatric_crisis";
  severity: "urgent" | "emergency";
  triggerKeyword: string;
  description: string;
  recommendedAction: string;
}

export interface SafetyAssessment {
  status: "clear" | "warning" | "urgent" | "emergency" | "unavailable";
  ruleVersion: string;
  triggeredRules: SafetyTrigger[];
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  clinicianDisposition?: "emergency_transfer" | "urgent_referral" | "monitored_clinic_care";
}

export interface MateriaMedicaKeynote {
  remedyId: string;
  remedyName: string;
  sourceTitle: string;
  author: string;
  keynoteText: string;
  thermalAffinity?: string;
  miasmaticAffinity?: string;
  citation: string;
}

export interface MateriaMedicaComparison {
  keynotes: MateriaMedicaKeynote[];
  aiNarrativeSummary?: {
    summaryText: string;
    modelName: string;
    generatedAt: string;
    isStale: boolean;
  };
}
