import { 
  AIIntakeMappingResult, 
  ScoringResult, 
  RemedyDifferentiation, 
  ClinicalReasoningSummary 
} from "../types";

export type { 
  AIIntakeMappingResult, 
  ScoringResult, 
  RemedyDifferentiation, 
  ClinicalReasoningSummary 
};

export type ClinicalWorkspaceSectionId =
  | "intake"
  | "symptom_parser"
  | "rubric_explorer"
  | "clinical_workbench"
  | "clinical_intelligence"
  | "repertorization"
  | "remedy_intelligence"
  | "differential_analysis"
  | "case_validation"
  | "final_review";

export type ClinicalCapabilityId =
  | "text_intake"
  | "voice_intake"
  | "ocr_intake"
  | "symptom_extraction"
  | "rubric_search"
  | "semantic_search"
  | "rubric_hierarchy"
  | "repertorization"
  | "remedy_reasoning"
  | "differential_analysis"
  | "case_validation"
  | "knowledge_graph"
  | "materia_medica"
  | "follow_up_comparison"
  | "research_mode"
  | "teaching_mode"
  | "audit_mode";

export type ClinicalWorkflowStage =
  | "collect"
  | "understand"
  | "select"
  | "analyze"
  | "differentiate"
  | "validate"
  | "review";

export type ClinicalSourceKind =
  | "clinician"
  | "patient_narrative"
  | "uploaded_document"
  | "ocr"
  | "voice_transcript"
  | "repertory"
  | "materia_medica"
  | "verified_case"
  | "external_health_data";

export interface ClinicalWorkspaceSection {
  id: ClinicalWorkspaceSectionId;
  title: string;
  stage: ClinicalWorkflowStage;
  capabilityIds: ClinicalCapabilityId[];
  optional?: boolean;
}

export interface ClinicalWorkspaceState {
  workspaceId: string;
  patientId?: string;
  clinicianId?: string;
  activeSectionId: ClinicalWorkspaceSectionId;
  enabledCapabilities: ClinicalCapabilityId[];
  safetyNotice: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalIntakeInput {
  rawNarrative?: string;
  voiceTranscript?: string;
  ocrText?: string;
  uploadedDocumentIds?: string[];
  sourceKind?: ClinicalSourceKind;
}

export interface ClinicalRubricCandidate {
  id: string;
  title: string;
  source?: string;
  sourceBadge?: string;
  rubricPath?: string;
  category?: string;
  clinicalSystem?: string;
  confidence?: number;
  score?: number;
  matchedFields?: string[];
  explanation?: string;
  provenance?: Record<string, unknown>;
}

export interface ClinicalWorkbenchRubric {
  rubricId: string;
  title?: string;
  source?: string;
  weight?: number;
  impact?: "severe" | "moderate" | "mild";
  severity?: number;
  frequency?: "constant" | "frequent" | "occasional";
  intensity?: number;
  confidence?: number;
  importance?: number;
  groupId?: string;
  priority?: number;
  notes?: string;
}

export interface ClinicalRemedyRanking {
  remedyId: string;
  remedyName?: string;
  rank: number;
  score: number;
  weightedScore?: number;
  normalizedScore?: number;
  confidence?: number;
  coverage?: number;
  contributingRubricIds: string[];
  missingRubricIds: string[];
  explanation: string[];
  provenance?: Record<string, unknown>;
}

export interface ClinicalDifferentialItem {
  remedyId: string;
  comparedWithRemedyId: string;
  sharedEvidence: string[];
  uniqueEvidence: string[];
  weakEvidence: string[];
  missingConfirmations: string[];
  explanation: string;
}

export interface ClinicalValidationFinding {
  severity: "info" | "warning" | "critical";
  category:
    | "missing_information"
    | "contradiction"
    | "weak_evidence"
    | "overweighting"
    | "safety"
    | "source_quality";
  message: string;
  relatedRubricIds?: string[];
  relatedRemedyIds?: string[];
}

export interface ClinicalRepertoryRequest {
  query?: string;
  intake?: ClinicalIntakeInput;
  selectedRubrics?: ClinicalWorkbenchRubric[];
  filters?: Record<string, unknown>;
  requestedCapabilities?: ClinicalCapabilityId[];
  metadata?: Record<string, unknown>;
}

export interface ClinicalRepertoryResult {
  success: boolean;
  runId: string;
  safetyNotice: string;
  query?: string;
  rubricCandidates: ClinicalRubricCandidate[];
  selectedRubrics: ClinicalWorkbenchRubric[];
  remedyRankings: ClinicalRemedyRanking[];
  differentialAnalysis: ClinicalDifferentialItem[];
  validationFindings: ClinicalValidationFinding[];
  clinicalWarnings: string[];
  missingInformation: string[];
  sourceAttribution: string[];
  confidenceAssessment?: {
    score: number;
    explanation: string;
  };
  engineTrace: {
    selectedCapabilities: ClinicalCapabilityId[];
    internalProviders: string[];
    latencyMs: number;
  };
  scoringResult?: ScoringResult;
  differentiations?: RemedyDifferentiation[];
  reasoningSummary?: ClinicalReasoningSummary;
}

export interface ClinicalSearchProvider {
  id: string;
  capabilityIds: ClinicalCapabilityId[];
  search(input: ClinicalRepertoryRequest): Promise<ClinicalRubricCandidate[]> | ClinicalRubricCandidate[];
}

export interface ClinicalRepertorizationProvider {
  id: string;
  capabilityIds: ClinicalCapabilityId[];
  repertorize(input: {
    request: ClinicalRepertoryRequest;
    rubricCandidates: ClinicalRubricCandidate[];
  }): Promise<ClinicalRemedyRanking[]> | ClinicalRemedyRanking[];
}

export interface ClinicalReasoningProvider {
  id: string;
  capabilityIds: ClinicalCapabilityId[];
  reason(input: {
    request: ClinicalRepertoryRequest;
    rubricCandidates: ClinicalRubricCandidate[];
    remedyRankings: ClinicalRemedyRanking[];
  }):
    | Promise<{
        differentialAnalysis?: ClinicalDifferentialItem[];
        validationFindings?: ClinicalValidationFinding[];
        clinicalWarnings?: string[];
        missingInformation?: string[];
        sourceAttribution?: string[];
        confidenceAssessment?: ClinicalRepertoryResult["confidenceAssessment"];
      }>
    | {
        differentialAnalysis?: ClinicalDifferentialItem[];
        validationFindings?: ClinicalValidationFinding[];
        clinicalWarnings?: string[];
        missingInformation?: string[];
        sourceAttribution?: string[];
        confidenceAssessment?: ClinicalRepertoryResult["confidenceAssessment"];
      };
}

export interface ClinicalRepertoryServiceProviders {
  searchProviders?: ClinicalSearchProvider[];
  repertorizationProviders?: ClinicalRepertorizationProvider[];
  reasoningProviders?: ClinicalReasoningProvider[];
}

import { VisitTimelineEntry, LongitudinalCaseSummary } from './longitudinalTypes';

export interface ClinicalRepertoryService {
  analyzeCase(request: ClinicalRepertoryRequest): Promise<ClinicalRepertoryResult>;
  runClinicalAnalysis(request: ClinicalRepertoryRequest): Promise<ClinicalRepertoryResult>;
  searchRubrics(query: string, filters?: Record<string, any>): Promise<ClinicalRubricCandidate[]>;
  parseAIIntakeText(intakeText: string): Promise<AIIntakeMappingResult>;
  getLongitudinalSummary(patientId: string, timeline: VisitTimelineEntry[]): Promise<LongitudinalCaseSummary>;
}

export const CLINICAL_WORKSPACE_SAFETY_NOTICE = "Clinical review required — do not auto-prescribe";
