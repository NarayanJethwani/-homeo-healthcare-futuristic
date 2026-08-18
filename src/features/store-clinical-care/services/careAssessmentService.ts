import { randomUUID } from "crypto";
import { CARE_PLAN_CATALOG } from "@/lib/pricingConfig";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  ALLOWED_CARE_DURATIONS,
  calculateTierCarePeriodTotalPaise,
  getTierCarePeriodLabel,
  formatINRFromPaise,
  type PatientIntakeData,
  type ClinicalCareDurationWeeks,
  type SanitizedAssessmentResponseDTO,
} from "../domain/types";
import { calculatePreliminaryCareRecommendation } from "./careRecommendationEngine";

export interface CareAssessmentValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePatientIntake(data: Partial<PatientIntakeData>): CareAssessmentValidationResult {
  const errors: string[] = [];

  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.push("Patient name is required (minimum 2 characters).");
  }

  if (!data.phone || data.phone.trim().length < 8) {
    errors.push("A valid contact phone number is required.");
  }

  if (!data.mainHealthArea || data.mainHealthArea.trim().length === 0) {
    errors.push("Please specify your primary area of health concern.");
  }

  if (!data.concernDescription || data.concernDescription.trim().length < 10) {
    errors.push("Please provide a brief description of your main concern (minimum 10 characters).");
  }

  const selectedTier = data.selectedTierId && data.selectedTierId in CLINICAL_CARE_TIER_OPTIONS
    ? CLINICAL_CARE_TIER_OPTIONS[data.selectedTierId as keyof typeof CLINICAL_CARE_TIER_OPTIONS]
    : undefined;
  if (selectedTier?.family !== "acute" && (!data.preferredDurationWeeks || !ALLOWED_CARE_DURATIONS.includes(data.preferredDurationWeeks as ClinicalCareDurationWeeks))) {
    errors.push("Please select a valid care duration (1, 2, 4, 8, or 12 weeks).");
  }

  if (!data.emergencyAcknowledged) {
    errors.push("Please acknowledge the emergency guidance notice before proceeding.");
  }

  if (!data.accuracyConfirmed) {
    errors.push("Please confirm that the information provided is accurate to the best of your knowledge.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Processes a patient intake submission and returns a strictly sanitized DTO.
 * Computes a preliminary advisory recommendation (with zero AI jargon exposed).
 */
export function processCareAssessmentSubmission(
  data: Partial<PatientIntakeData>
): { success: true; data: SanitizedAssessmentResponseDTO } | { success: false; error: string; errors?: string[] } {
  const validation = validatePatientIntake(data);
  if (!validation.valid) {
    return {
      success: false,
      error: "Validation Error: Intake form contains incomplete or invalid fields.",
      errors: validation.errors,
    };
  }

  const requestedTier = data.selectedTierId && data.selectedTierId in CLINICAL_CARE_TIER_OPTIONS
    ? CLINICAL_CARE_TIER_OPTIONS[data.selectedTierId as keyof typeof CLINICAL_CARE_TIER_OPTIONS]
    : CLINICAL_CARE_TIER_OPTIONS.focused;
  const preliminaryRecommendation = calculatePreliminaryCareRecommendation({
    careFamily: requestedTier.family,
    supportIntensity: requestedTier.id === "advanced" ? "direct" : requestedTier.id === "complex" ? "frequent" : requestedTier.id === "integrated" || requestedTier.id === "acute_wellness" ? "closer" : "standard",
    safetyStatus: "clear",
  });

  const tierKey = data.selectedTierId && data.selectedTierId in CLINICAL_CARE_TIER_OPTIONS
    ? data.selectedTierId
    : preliminaryRecommendation.suggestedTierId;

  const tier = CLINICAL_CARE_TIER_OPTIONS[tierKey as keyof typeof CLINICAL_CARE_TIER_OPTIONS] || CLINICAL_CARE_TIER_OPTIONS.focused;
  const durationWeeks = (data.preferredDurationWeeks || 4) as ClinicalCareDurationWeeks;

  const totalPaise = calculateTierCarePeriodTotalPaise(tier.id, durationWeeks);
  const totalFormatted = formatINRFromPaise(totalPaise);
  const carePeriodLabel = getTierCarePeriodLabel(tier.id, durationWeeks);
  const plan = CARE_PLAN_CATALOG[tier.carePlanId];

  const submissionId = `CAS-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;

  const sanitizedDTO: SanitizedAssessmentResponseDTO = {
    success: true,
    submissionId,
    submittedAt: new Date().toISOString(),
    patientName: data.patientName!.trim(),
    mainHealthArea: data.mainHealthArea!.trim(),
    preferredDurationWeeks: durationWeeks,
    carePeriodLabel,
    carePeriodValue: tier.family === "acute" ? plan.durationValue : durationWeeks,
    carePeriodUnit: tier.family === "acute" ? "day" : "week",
    totalEstimatedAmountPaise: totalPaise,
    totalEstimatedAmountFormatted: totalFormatted,
    preliminaryRecommendation,
    status: "submitted_for_physician_review",
    message: "Thank you. Your clinical assessment has been submitted for physician review. Your treating physician will review your submission and prepare your official Clinical Care Quotation.",
  };

  return {
    success: true,
    data: sanitizedDTO,
  };
}
