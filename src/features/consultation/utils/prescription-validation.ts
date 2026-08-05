import { z } from "zod";
import {
  ConsultationOutcome,
  PrescriptionDraft,
  CompletionReadiness,
  PotencyScale,
} from "../types/prescription.types";
import { StructuredClinicalNotes } from "../types/clinical-notes.types";

export const PotencySchema = z.object({
  scale: z.enum(["centesimal", "decimal", "lm", "q", "custom"]),
  value: z.string().min(1, "Potency value is required"),
  displayLabel: z.string().min(1),
});

export const PrescriptionDraftSchema = z.object({
  consultationId: z.string().min(1),
  patientId: z.string().min(1),
  selectedRemedyId: z.string().optional(),
  selectedRemedyName: z.string().optional(),
  sourceAnalysisSnapshotHash: z.string().optional(),
  potency: PotencySchema.optional(),
  dose: z.string().optional(),
  repetition: z.string().optional(),
  duration: z.string().optional(),
  route: z.string().optional(),
  instructions: z.string().optional(),
  dietaryAdvice: z.string().optional(),
  followUpInstructions: z.string().optional(),
  pharmacyNotes: z.string().optional(),
  revision: z.number().min(1),
});

export interface PureValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePrescriptionDraft(
  draft: Partial<PrescriptionDraft>,
  outcome: ConsultationOutcome | ""
): PureValidationResult {
  const errors: string[] = [];

  if (outcome !== "prescription_issued") {
    // Validation not required for non-prescription outcomes
    return { valid: true, errors: [] };
  }

  if (!draft.selectedRemedyName || !draft.selectedRemedyName.trim()) {
    errors.push("Selected remedy is required when outcome is 'Prescription Issued'.");
  }

  if (!draft.potency || !draft.potency.value || !draft.potency.value.trim()) {
    errors.push("Potency value (e.g. 30C, 200C, 6X) is required.");
  }

  if (!draft.dose || !draft.dose.trim()) {
    errors.push("Dose (e.g. 4 pills, 5 drops) is required.");
  }

  if (!draft.repetition || !draft.repetition.trim()) {
    errors.push("Repetition (e.g. Twice daily, Once at bedtime) is required.");
  }

  if (!draft.instructions || !draft.instructions.trim()) {
    errors.push("Prescription instructions are required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function evaluateGuardedCompletionReadiness(options: {
  notes: StructuredClinicalNotes;
  outcome: ConsultationOutcome | "";
  prescriptionDraft: Partial<PrescriptionDraft>;
  isAnalysisStale?: boolean;
  isRevisionStale?: boolean;
  isSaving?: boolean;
  isCompleting?: boolean;
}): CompletionReadiness {
  const clinicalValidationErrors: string[] = [];
  const prescriptionValidationErrors: string[] = [];

  // 1. Clinical Notes Validation
  if (!options.notes.chiefComplaints || options.notes.chiefComplaints.length === 0) {
    clinicalValidationErrors.push("At least one Chief Complaint must be recorded.");
  }

  if (!options.notes.historyOfPresentIllness || !options.notes.historyOfPresentIllness.trim()) {
    clinicalValidationErrors.push("History of Present Illness (HPI) narrative is required.");
  }

  // 2. Outcome Selection
  const outcomeSelected = Boolean(options.outcome);
  if (!outcomeSelected) {
    clinicalValidationErrors.push("Consultation Outcome must be selected.");
  }

  // 3. Outcome-dependent Prescription Validation
  if (options.outcome === "prescription_issued") {
    const rxValid = validatePrescriptionDraft(options.prescriptionDraft, options.outcome);
    prescriptionValidationErrors.push(...rxValid.errors);
  }

  const ready =
    clinicalValidationErrors.length === 0 &&
    prescriptionValidationErrors.length === 0 &&
    !options.isAnalysisStale &&
    !options.isRevisionStale &&
    !options.isSaving &&
    !options.isCompleting;

  return {
    ready,
    outcomeSelected,
    clinicalValidationErrors,
    prescriptionValidationErrors,
    staleRevision: Boolean(options.isRevisionStale),
    staleRemedyAnalysis: Boolean(options.isAnalysisStale),
    saveInProgress: Boolean(options.isSaving),
    completionInProgress: Boolean(options.isCompleting),
  };
}
