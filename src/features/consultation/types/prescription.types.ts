/**
 * Domain Types for Phase 5 Digital Prescription, Canonical Document Generation & Guarded Completion
 */

export type ConsultationOutcome =
  | "prescription_issued"
  | "no_prescription"
  | "follow_up_required"
  | "referred";

export type PotencyScale = "centesimal" | "decimal" | "lm" | "q" | "custom";

export interface Potency {
  scale: PotencyScale;
  value: string; // e.g. "30C", "200C", "1M", "6X", "0/3"
  displayLabel: string;
}

export interface PrescriptionDraft {
  id?: string;
  consultationId: string;
  patientId: string;
  selectedRemedyId?: string;
  selectedRemedyName?: string;
  sourceAnalysisSnapshotHash?: string;
  repertoryVersion?: string;
  scoringAlgorithmVersion?: string;
  scoringConfigurationVersion?: string;
  analysisGeneratedAt?: string;
  potency?: Potency;
  dose?: string;
  repetition?: string;
  duration?: string;
  route?: string;
  instructions?: string;
  dietaryAdvice?: string;
  followUpInstructions?: string;
  pharmacyNotes?: string;
  revision: number;
}

export interface PrescriptionRevision {
  version: number;
  prescriptionId: string;
  supersedesPrescriptionId?: string;
  amendmentReason?: string;
  finalizedAt?: string;
  finalizedBy?: string;
}

export type PharmacyDispatchStatus =
  | "not_requested"
  | "queued"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled";

export interface PharmacyDispatchState {
  status: PharmacyDispatchStatus;
  requestedAt?: string;
  dispatchedAt?: string;
  providerName: string;
  trackingNumber?: string;
  errorMessage?: string;
}

export interface CompletionReadiness {
  ready: boolean;
  outcomeSelected: boolean;
  clinicalValidationErrors: string[];
  prescriptionValidationErrors: string[];
  staleRevision: boolean;
  staleRemedyAnalysis: boolean;
  saveInProgress: boolean;
  completionInProgress: boolean;
}
