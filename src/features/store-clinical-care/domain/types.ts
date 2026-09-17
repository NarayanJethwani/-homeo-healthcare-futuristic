/**
 * Domain types for isolated /store Clinical Care Page Upgrade.
 * All pricing math uses integer paise (1 INR = 100 paise).
 */

import {
  CARE_PLAN_CATALOG,
  calculateContinuityCareTotal,
  getContinuityDiscountPercentage,
} from "@/lib/pricingConfig";

export type ClinicalCareDurationWeeks = 1 | 2 | 4 | 8 | 12;
export type StoreClinicalCareTierId = "acute_mild" | "acute_wellness" | "subacute" | "membership_focused" | "membership_integrated" | "membership_comprehensive" | "focused" | "integrated" | "complex" | "advanced";

export interface ClinicalCareTierOption {
  id: StoreClinicalCareTierId;
  family: "acute" | "subacute" | "chronic" | "membership";
  periodValue: number;
  periodUnit: "day" | "week" | "month";
  name: string;
  weeklyRatePaise: number; // Legacy field name: price in paise for the displayed billing period
  weeklyRateINR: number; // Price in INR for the displayed billing period
  twoWeekRatePaise?: number; // Membership-only convenient 2-week payment option
  description: string;
  recommendedFor: string;
}

const planPaise = (planId: keyof typeof CARE_PLAN_CATALOG) => CARE_PLAN_CATALOG[planId].price * 100;

export const CLINICAL_CARE_TIER_OPTIONS: Record<StoreClinicalCareTierId, ClinicalCareTierOption> = {
  acute_mild: {
    id: "acute_mild",
    family: "acute",
    periodValue: 2,
    periodUnit: "day",
    name: "Mild Acute Care",
    weeklyRatePaise: planPaise("acute_mild_3d"),
    weeklyRateINR: CARE_PLAN_CATALOG.acute_mild_3d.price,
    description: "Two-day physician-reviewed support for one suitable mild, non-emergency acute concern.",
    recommendedFor: "A mild, recent concern after emergency warning signs have been excluded",
  },
  acute_wellness: {
    id: "acute_wellness",
    family: "acute",
    periodValue: 4,
    periodUnit: "day",
    name: "Acute Wellness Care",
    weeklyRatePaise: planPaise("acute_wellness_7d"),
    weeklyRateINR: CARE_PLAN_CATALOG.acute_wellness_7d.price,
    description: "Four-day physician-reviewed support for a suitable non-emergency acute concern.",
    recommendedFor: "Short-term support needing a longer review window",
  },
  subacute: {
    id: "subacute", family: "subacute", periodValue: 1, periodUnit: "week",
    name: "Subacute Care", weeklyRatePaise: 300000, weeklyRateINR: 3000,
    description: "Planned reassessment for a persisting or transitional non-emergency concern.",
    recommendedFor: "A suitable persisting concern after physician assessment",
  },
  membership_focused: {
    id: "membership_focused", family: "membership", periodValue: 1, periodUnit: "month",
    name: "Focused Membership", weeklyRatePaise: 500000, weeklyRateINR: 5000,
    twoWeekRatePaise: 300000,
    description: "For one person with one agreed concern suitable for lower-intensity follow-up.",
    recommendedFor: "Low-intensity follow-up or a physician-agreed step-down from active care",
  },
  membership_integrated: {
    id: "membership_integrated", family: "membership", periodValue: 1, periodUnit: "month",
    name: "Integrated Membership", weeklyRatePaise: 1000000, weeklyRateINR: 10000,
    twoWeekRatePaise: 600000,
    description: "For one person with two related mild, stable concerns suitable for monthly follow-up.",
    recommendedFor: "Related mild concerns that fit one longer scheduled consultation",
  },
  membership_comprehensive: {
    id: "membership_comprehensive", family: "membership", periodValue: 1, periodUnit: "month",
    name: "Comprehensive Membership", weeklyRatePaise: 2000000, weeklyRateINR: 20000,
    twoWeekRatePaise: 1200000,
    description: "For one person with multiple stable concerns requiring detailed ongoing review.",
    recommendedFor: "Multiple stable concerns that fit one detailed scheduled consultation",
  },
  focused: {
    id: "focused",
    family: "chronic",
    periodValue: 1,
    periodUnit: "week",
    name: "Focused Clinical Care",
    weeklyRatePaise: planPaise("chronic_focused_1w"),
    weeklyRateINR: CARE_PLAN_CATALOG.chronic_focused_1w.price,
    description: "Focused physician-led care for one defined, non-emergency concern with standard weekly follow-up.",
    recommendedFor: "A defined chronic concern within an agreed scope",
  },
  integrated: {
    id: "integrated",
    family: "chronic",
    periodValue: 1,
    periodUnit: "week",
    name: "Integrated Chronic Care",
    weeklyRatePaise: planPaise("chronic_integrated_1w"),
    weeklyRateINR: CARE_PLAN_CATALOG.chronic_integrated_1w.price,
    description: "Integrated physician-led care requiring closer planned review or records coordination.",
    recommendedFor: "Chronic care requiring closer review or records coordination",
  },
  complex: {
    id: "complex",
    family: "chronic",
    periodValue: 1,
    periodUnit: "week",
    name: "Complex Chronic Care",
    weeklyRatePaise: planPaise("chronic_complex_1w"),
    weeklyRateINR: CARE_PLAN_CATALOG.chronic_complex_1w.price,
    description: "Enhanced physician supervision for chronic care requiring frequent review or coordination.",
    recommendedFor: "Frequent planned review or multi-clinician coordination",
  },
  advanced: {
    id: "advanced",
    family: "chronic",
    periodValue: 1,
    periodUnit: "week",
    name: "Advanced Chronic Care",
    weeklyRatePaise: planPaise("chronic_advanced_1w"),
    weeklyRateINR: CARE_PLAN_CATALOG.chronic_advanced_1w.price,
    description: "Direct physician supervision and high-frequency review for high-workload chronic care.",
    recommendedFor: "Direct supervision or extensive care coordination after physician review",
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
  return calculateContinuityCareTotal(weeklyRatePaise, durationWeeks).total;
}

export function calculateListCarePeriodTotalPaise(
  weeklyRatePaise: number,
  durationWeeks: ClinicalCareDurationWeeks
): number {
  return weeklyRatePaise * durationWeeks;
}

export function getCarePeriodContinuityBenefit(durationWeeks: ClinicalCareDurationWeeks): number {
  return getContinuityDiscountPercentage(durationWeeks);
}

export function getTierCarePeriodLabel(tierId: string, durationWeeks: ClinicalCareDurationWeeks): string {
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierId as StoreClinicalCareTierId] || CLINICAL_CARE_TIER_OPTIONS.focused;
  if (tier.family === "membership") {
    return durationWeeks === 2 ? "2 weeks" : "1 calendar month";
  }
  if (tier.family !== "chronic") {
    return `${tier.periodValue} ${tier.periodValue === 1 ? tier.periodUnit : `${tier.periodUnit}s`}`;
  }
  return `${durationWeeks} ${durationWeeks === 1 ? "week" : "weeks"}`;
}

export function calculateTierCarePeriodTotalPaise(tierId: string, durationWeeks: ClinicalCareDurationWeeks): number {
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierId as StoreClinicalCareTierId] || CLINICAL_CARE_TIER_OPTIONS.focused;
  if (tier.family === "membership") return durationWeeks === 2 ? (tier.twoWeekRatePaise || tier.weeklyRatePaise) : tier.weeklyRatePaise;
  return tier.family !== "chronic" ? tier.weeklyRatePaise : calculateCarePeriodTotalPaise(tier.weeklyRatePaise, durationWeeks);
}

export function calculateTierListCarePeriodTotalPaise(tierId: string, durationWeeks: ClinicalCareDurationWeeks): number {
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierId as StoreClinicalCareTierId] || CLINICAL_CARE_TIER_OPTIONS.focused;
  if (tier.family === "membership") return durationWeeks === 2 ? (tier.twoWeekRatePaise || tier.weeklyRatePaise) : tier.weeklyRatePaise;
  return tier.family !== "chronic" ? tier.weeklyRatePaise : calculateListCarePeriodTotalPaise(tier.weeklyRatePaise, durationWeeks);
}

export function getTierContinuityBenefit(tierId: string, durationWeeks: ClinicalCareDurationWeeks): number {
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierId as StoreClinicalCareTierId] || CLINICAL_CARE_TIER_OPTIONS.focused;
  return tier.family !== "chronic" ? 0 : getCarePeriodContinuityBenefit(durationWeeks);
}

export function formatINRFromPaise(paise: number): string {
  const inr = Math.round(paise / 100);
  return `₹${inr.toLocaleString("en-IN")}`;
}

export const EMERGENCY_GUIDANCE_NOTICE =
  "This service is not intended for medical emergencies. Seek immediate emergency care for severe breathing difficulty, chest pain, unconsciousness, stroke symptoms, severe bleeding, or other urgent symptoms.";

export const CLINICAL_CARE_FEE_EXPLANATION =
  "The Clinical Care Fee reflects the professional time, treatment planning, clinical supervision, follow-up, and continuity of care expected during the agreed care period. It is not determined by diagnosis alone.";

export const EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT =
  "This recommendation is an initial advisory assessment. Your treating physician will review your complete clinical information and may confirm or modify the recommended care pathway based on professional clinical judgment.";

export const INCLUDED_SERVICES_LIST = [
  "Physician assessment and treatment planning",
  "Constitutional prescribing",
  "Scheduled reviews within your selected plan allowance",
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
  selectedOrganSystems?: string[];
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

export interface PreliminaryCareRecommendation {
  suggestedTierId: StoreClinicalCareTierId;
  suggestedTierName: string;
  selectedOrganCount: number;
  rationale: string;
  blockedBySafetyGate?: boolean;
  disclaimer: string; // EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT
}

export interface GovernedConcession {
  type: "senior_citizen" | "socio_economic" | "special_concession";
  percentage: number; // e.g. 10 for 10%
  amountPaise: number;
  approvedBy: string; // Mandatory audit field (e.g. "Dr. N. Jethwani")
  approvedDate: string; // Mandatory ISO timestamp
  reason: string; // Mandatory audit reason
  clinicalNotes?: string;
}

export interface ItemizedPharmacyBreakdown {
  listProfessionalFeePaise: number;
  continuityDiscountPercent: number;
  continuityDiscountPaise: number;
  professionalFeePaise: number;
  routineMedicinesIncluded: true;
  specialBrandedMedicinesPaise: number;
  courierFeePaise: number;
  medicalCertificateFeePaise: number;
  diagnosticCoordinationFeePaise: number;
  concessions: GovernedConcession[];
  totalConcessionsPaise: number;
  finalTotalPaise: number;
  finalTotalFormatted: string;
}

export type PaymentProviderKind = "manual" | "razorpay";
export type PaymentWorkflowStatus = "pending_physician_review" | "quotation_sent" | "patient_accepted" | "payment_verified" | "care_activated";

export interface PaymentWorkflowMetadata {
  paymentProvider: PaymentProviderKind; // Provider-agnostic field for v1.1 Razorpay upgrade
  paymentMethod?: "upi" | "bank_transfer" | "cash" | "gateway";
  paymentReference?: string;
  paymentStatus: PaymentWorkflowStatus;
  clinicUpiId: string; // Loaded dynamically from process.env.NEXT_PUBLIC_CLINIC_UPI_ID
  clinicBankDetails: string; // Loaded dynamically from process.env.NEXT_PUBLIC_CLINIC_BANK_DETAILS
}

export interface OfficialClinicalQuotation {
  quotationId: string;
  submissionId: string;
  patientName: string;
  phone: string;
  tierId: string;
  tierName: string;
  durationWeeks: ClinicalCareDurationWeeks;
  breakdown: ItemizedPharmacyBreakdown;
  paymentWorkflow: PaymentWorkflowMetadata;
  createdAt: string;
}

export interface SanitizedAssessmentResponseDTO {
  success: boolean;
  submissionId: string;
  submittedAt: string;
  patientName: string;
  mainHealthArea: string;
  preferredDurationWeeks: number;
  carePeriodLabel: string;
  carePeriodValue: number;
  carePeriodUnit: "day" | "week" | "month";
  totalEstimatedAmountPaise: number;
  totalEstimatedAmountFormatted: string;
  preliminaryRecommendation: PreliminaryCareRecommendation;
  status: "submitted_for_physician_review";
  message: string;
}

/**
 * Gets payment coordinates from environment variables safely with robust fallback defaults.
 */
export function getClinicPaymentConfiguration(): { upiId: string; bankDetails: string } {
  return {
    upiId: process.env.NEXT_PUBLIC_CLINIC_UPI_ID || "8446056789@hdfc",
    bankDetails: process.env.NEXT_PUBLIC_CLINIC_BANK_DETAILS || "HDFC Bank | A/C 50200012345678 | IFSC HDFC0001234",
  };
}
