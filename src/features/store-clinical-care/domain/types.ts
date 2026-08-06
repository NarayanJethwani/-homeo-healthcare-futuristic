/**
 * Domain types for isolated /store Clinical Care Page Upgrade.
 * All pricing math uses integer paise (1 INR = 100 paise).
 */

export type ClinicalCareDurationWeeks = 1 | 2 | 4 | 8 | 12;

export interface ClinicalCareTierOption {
  id: string;
  name: string; // Patient-facing name only (e.g. "Focused Clinical Care")
  weeklyRatePaise: number; // Integer paise per week
  weeklyRateINR: number; // Reference weekly INR
  description: string;
  recommendedFor: string;
}

export const CLINICAL_CARE_TIER_OPTIONS: Record<string, ClinicalCareTierOption> = {
  focused: {
    id: "focused",
    name: "Focused Clinical Care",
    weeklyRatePaise: 300000,
    weeklyRateINR: 3000,
    description: "Coordinated physician care for specific, localized, or early-stage health concerns.",
    recommendedFor: "Single primary health concern or focused follow-up care",
  },
  integrated: {
    id: "integrated",
    name: "Integrated Clinical Care",
    weeklyRatePaise: 600000,
    weeklyRateINR: 6000,
    description: "Comprehensive care managing multiple interrelated systems and constitutional balance.",
    recommendedFor: "Multiple related health conditions requiring constitutional synthesis",
  },
  complex: {
    id: "complex",
    name: "Complex Clinical Care",
    weeklyRatePaise: 900000,
    weeklyRateINR: 9000,
    description: "Intensive physician supervision for long-standing, multi-layered pathological conditions.",
    recommendedFor: "Chronic, long-standing, or multi-systemic pathological concerns",
  },
  advanced: {
    id: "advanced",
    name: "Advanced Physician Care",
    weeklyRatePaise: 1200000,
    weeklyRateINR: 12000,
    description: "Close clinical oversight, frequent reviews, and specialized treatment planning.",
    recommendedFor: "High-complexity cases requiring frequent physician monitoring and adjustment",
  },
};

export const ALLOWED_CARE_DURATIONS: ClinicalCareDurationWeeks[] = [1, 2, 4, 8, 12];

export function calculateCarePeriodTotalPaise(
  weeklyRatePaise: number,
  durationWeeks: ClinicalCareDurationWeeks
): number {
  if (!Number.isInteger(weeklyRatePaise) || weeklyRatePaise < 0) {
    throw new Error("Weekly rate must be a non-negative integer in paise");
  }
  return weeklyRatePaise * durationWeeks;
}

export function formatINRFromPaise(paise: number): string {
  const inr = Math.round(paise / 100);
  return `₹${inr.toLocaleString("en-IN")}`;
}

export const EMERGENCY_GUIDANCE_NOTICE =
  "This service is not intended for medical emergencies. Seek immediate emergency care for severe breathing difficulty, chest pain, unconsciousness, stroke symptoms, severe bleeding, or other urgent symptoms.";

export const CLINICAL_CARE_FEE_EXPLANATION =
  "The Clinical Care Fee reflects the professional time, treatment planning, clinical supervision, follow-up, and continuity of care expected during the agreed care period. It is not determined by diagnosis alone.";

export const INCLUDED_SERVICES_LIST = [
  "Physician assessment and treatment planning",
  "Constitutional prescribing",
  "Follow-up reviews during the agreed care period",
  "Progress monitoring",
  "Prescription adjustments where clinically appropriate",
  "Routine homeopathic medicines prescribed and dispensed by Homeo Healthcare",
];

export const ADDITIONAL_PRODUCTS_DISCLOSURE =
  "Selected branded, proprietary, external-use, or specialised products may be charged separately only when clinically required and discussed with you before supply.";

export type PatientJourneyStep =
  | "welcome"
  | "main_health_area"
  | "concern_description"
  | "related_health_areas"
  | "history_duration"
  | "investigations_records"
  | "review_safety"
  | "submission_complete";

export interface PatientIntakeData {
  patientName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  city: string;
  mainHealthArea: string;
  concernDescription: string;
  relatedHealthAreas: string[];
  durationText: string;
  previousTreatments: string;
  recordsSummary: string;
  preferredDurationWeeks: ClinicalCareDurationWeeks;
  selectedTierId: string;
  emergencyAcknowledged: boolean;
  accuracyConfirmed: boolean;
}

export interface SanitizedAssessmentResponseDTO {
  success: boolean;
  submissionId: string;
  submittedAt: string;
  patientName: string;
  mainHealthArea: string;
  preferredDurationWeeks: number;
  totalEstimatedAmountPaise: number;
  totalEstimatedAmountFormatted: string;
  status: "submitted_for_physician_review";
  message: string;
}
