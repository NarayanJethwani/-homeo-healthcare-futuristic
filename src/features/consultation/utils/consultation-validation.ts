/**
 * Pure Validation Functions for Consultation Completion Readiness
 */

import { CompletionReadiness, ConsultationOutcome } from "../domain/consultation.types";
import { StructuredClinicalNotes } from "../types/clinical-notes.types";

export interface PrescriptionDetails {
  remedyName?: string;
  potency?: string;
  dosage?: string;
  instructions?: string;
}

export function evaluateCompletionReadiness(
  outcome: ConsultationOutcome | undefined,
  notes: StructuredClinicalNotes | undefined,
  prescription?: PrescriptionDetails,
  options: { staleRevision?: boolean; saveInProgress?: boolean; completionInProgress?: boolean } = {}
): CompletionReadiness {
  const clinicalValidationErrors: string[] = [];
  const prescriptionValidationErrors: string[] = [];

  const outcomeSelected = Boolean(outcome);

  if (!outcomeSelected) {
    clinicalValidationErrors.push("Consultation outcome must be selected before completion.");
  }

  if (!notes || notes.chiefComplaints.length === 0) {
    clinicalValidationErrors.push("At least one Chief Complaint must be recorded.");
  }

  if (!notes || !notes.historyOfPresentIllness || notes.historyOfPresentIllness.trim().length < 10) {
    clinicalValidationErrors.push("History of Present Illness (HPI) must be documented (at least 10 characters).");
  }

  if (outcome === "prescription_issued") {
    if (!prescription || !prescription.remedyName || prescription.remedyName.trim() === "") {
      prescriptionValidationErrors.push("Prescription remedy name is required when outcome is 'prescription_issued'.");
    }
    if (!prescription || !prescription.potency || prescription.potency.trim() === "") {
      prescriptionValidationErrors.push("Prescription potency scale/grade is required when outcome is 'prescription_issued'.");
    }
  }

  const ready =
    outcomeSelected &&
    clinicalValidationErrors.length === 0 &&
    prescriptionValidationErrors.length === 0 &&
    !options.staleRevision &&
    !options.saveInProgress &&
    !options.completionInProgress;

  return {
    ready,
    outcomeSelected,
    clinicalValidationErrors,
    prescriptionValidationErrors,
    staleRevision: Boolean(options.staleRevision),
    saveInProgress: Boolean(options.saveInProgress),
    completionInProgress: Boolean(options.completionInProgress),
  };
}
