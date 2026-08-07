import {
  CLINICAL_CARE_TIER_OPTIONS,
  EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT,
  calculateCarePeriodTotalPaise,
  formatINRFromPaise,
  getClinicPaymentConfiguration,
  type ClinicalCareDurationWeeks,
  type PreliminaryCareRecommendation,
  type ItemizedPharmacyBreakdown,
  type GovernedConcession,
  type OfficialClinicalQuotation,
  type PaymentWorkflowMetadata,
} from "../domain/types";

export interface PreliminaryRecommendationInput {
  selectedOrganSystems?: string[];
  durationText?: string;
  severityRating?: number; // 1-10
  priorTreatmentFailures?: boolean;
  age?: number | string;
}

/**
 * Multi-factor advisory recommendation engine.
 * Calculates an advisory pathway recommendation based on organ count, chronicity, severity, and prior treatment history.
 * PURELY ADVISORY — the treating physician retains full clinical authority to confirm or modify.
 */
export function calculatePreliminaryCareRecommendation(
  input: PreliminaryRecommendationInput
): PreliminaryCareRecommendation {
  const organs = input.selectedOrganSystems || [];
  const organCount = organs.length;

  // Base tier mapping from organ system count
  let tierId: "focused" | "integrated" | "complex" | "advanced" = "focused";
  let baseScore = 1;

  if (organCount <= 1) {
    tierId = "focused";
    baseScore = 1;
  } else if (organCount === 2) {
    tierId = "integrated";
    baseScore = 2;
  } else if (organCount >= 3 && organCount <= 4) {
    tierId = "complex";
    baseScore = 3;
  } else {
    tierId = "advanced";
    baseScore = 4;
  }

  // Weighting factors: Chronicity & Severity
  let weightAddition = 0;
  const durationLower = (input.durationText || "").toLowerCase();
  if (durationLower.includes("3 year") || durationLower.includes("5 year") || durationLower.includes("chronic") || durationLower.includes("long-standing")) {
    weightAddition += 1;
  }

  if (input.severityRating && input.severityRating >= 7) {
    weightAddition += 1;
  }

  if (input.priorTreatmentFailures) {
    weightAddition += 1;
  }

  const complexityScore = baseScore + weightAddition;

  // Advisory rationale synthesis
  const rationaleParts: string[] = [];
  if (organCount > 0) {
    rationaleParts.push(`Reported ${organCount} primary organ system ${organCount === 1 ? "area" : "areas"} (${organs.join(", ")})`);
  } else {
    rationaleParts.push("Single primary health concern");
  }

  if (weightAddition > 0) {
    rationaleParts.push(`Layered clinical complexity indicators (chronicity / severity weighting +${weightAddition})`);
  }

  const rationale = rationaleParts.join("; ") + ".";
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierId] || CLINICAL_CARE_TIER_OPTIONS.focused;

  return {
    suggestedTierId: tierId,
    suggestedTierName: tier.name,
    selectedOrganCount: organCount,
    complexityScore,
    rationale,
    disclaimer: EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT,
  };
}

export interface QuotationCalculationInput {
  tierId: string;
  durationWeeks: ClinicalCareDurationWeeks;
  specialBrandedMedicinesPaise?: number;
  courierFeePaise?: number;
  medicalCertificateFeePaise?: number;
  diagnosticCoordinationFeePaise?: number;
  seniorCitizenEligible?: boolean;
  seniorCitizenApprovedBy?: string;
  seniorCitizenReason?: string;
  socioEconomicPercent?: number; // 0, 10, 20, 30
  socioEconomicApprovedBy?: string;
  socioEconomicReason?: string;
  clinicalNotes?: string;
}

/**
 * Calculates itemized pharmacy and professional care fee breakdown using integer paise.
 */
export function calculateItemizedPharmacyQuotation(
  input: QuotationCalculationInput
): ItemizedPharmacyBreakdown {
  const tierKey = input.tierId && CLINICAL_CARE_TIER_OPTIONS[input.tierId] ? input.tierId : "integrated";
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierKey];

  const professionalFeePaise = calculateCarePeriodTotalPaise(tier.weeklyRatePaise, input.durationWeeks);
  const brandedPaise = Math.max(0, Math.round(input.specialBrandedMedicinesPaise || 0));
  const courierPaise = Math.max(0, Math.round(input.courierFeePaise || 0));
  const certPaise = Math.max(0, Math.round(input.medicalCertificateFeePaise || 0));
  const diagPaise = Math.max(0, Math.round(input.diagnosticCoordinationFeePaise || 0));

  const concessions: GovernedConcession[] = [];
  let totalConcessionsPaise = 0;

  // Senior Citizen Concession (10% of Professional Care Fee)
  if (input.seniorCitizenEligible && input.seniorCitizenApprovedBy && input.seniorCitizenReason) {
    const scPaise = Math.round(professionalFeePaise * 0.1);
    concessions.push({
      type: "senior_citizen",
      percentage: 10,
      amountPaise: scPaise,
      approvedBy: input.seniorCitizenApprovedBy.trim(),
      approvedDate: new Date().toISOString(),
      reason: input.seniorCitizenReason.trim(),
      clinicalNotes: input.clinicalNotes,
    });
    totalConcessionsPaise += scPaise;
  }

  // Governed Socio-Economic Concession (0-30% of Professional Care Fee)
  if (
    input.socioEconomicPercent &&
    input.socioEconomicPercent > 0 &&
    input.socioEconomicApprovedBy &&
    input.socioEconomicReason
  ) {
    const pct = Math.min(30, Math.max(0, input.socioEconomicPercent));
    const sePaise = Math.round(professionalFeePaise * (pct / 100));
    concessions.push({
      type: "socio_economic",
      percentage: pct,
      amountPaise: sePaise,
      approvedBy: input.socioEconomicApprovedBy.trim(),
      approvedDate: new Date().toISOString(),
      reason: input.socioEconomicReason.trim(),
      clinicalNotes: input.clinicalNotes,
    });
    totalConcessionsPaise += sePaise;
  }

  const netProfessionalFeePaise = Math.max(0, professionalFeePaise - totalConcessionsPaise);
  const finalTotalPaise = netProfessionalFeePaise + brandedPaise + courierPaise + certPaise + diagPaise;

  return {
    professionalFeePaise,
    routineMedicinesIncluded: true,
    specialBrandedMedicinesPaise: brandedPaise,
    courierFeePaise: courierPaise,
    medicalCertificateFeePaise: certPaise,
    diagnosticCoordinationFeePaise: diagPaise,
    concessions,
    totalConcessionsPaise,
    finalTotalPaise,
    finalTotalFormatted: formatINRFromPaise(finalTotalPaise),
  };
}

/**
 * Builds the official formatted WhatsApp message and wa.me URL for care coordination.
 * Uses environment configuration for payment coordinates.
 */
export function buildWhatsAppQuotationPayload(quotation: OfficialClinicalQuotation): {
  messageText: string;
  whatsappUrl: string;
} {
  const { upiId, bankDetails } = getClinicPaymentConfiguration();
  const bd = quotation.breakdown;

  const lines: string[] = [
    "*Homeo Healthcare*",
    "",
    `Dear ${quotation.patientName},`,
    "",
    "Dr. Jethwani has completed your Clinical Care Recommendation.",
    "",
    "Recommended Plan:",
    `• ${quotation.tierName}`,
    `• ${quotation.durationWeeks} Weeks`,
    "",
    `Professional Care Fee:\n${formatINRFromPaise(bd.professionalFeePaise)}`,
  ];

  if (bd.concessions.length > 0) {
    for (const c of bd.concessions) {
      const label = c.type === "senior_citizen" ? "Senior Citizen Support (10%)" : `Socio-Economic Support (${c.percentage}%)`;
      lines.push(`${label}:\n-${formatINRFromPaise(c.amountPaise)}`);
    }
  }

  lines.push("Routine Homeopathic Medicines:\nIncluded");

  if (bd.specialBrandedMedicinesPaise > 0) {
    lines.push(`Special Branded Medicines:\n${formatINRFromPaise(bd.specialBrandedMedicinesPaise)}`);
  }

  if (bd.courierFeePaise > 0) {
    lines.push(`Courier & Dispatch:\n${formatINRFromPaise(bd.courierFeePaise)}`);
  }

  lines.push("");
  lines.push(`Total Amount:\n${bd.finalTotalFormatted}`);
  lines.push("");
  lines.push("Please complete payment using the UPI ID below or bank transfer:");
  lines.push(`• UPI ID: ${quotation.paymentWorkflow.clinicUpiId || upiId}`);
  lines.push(`• Bank Details: ${quotation.paymentWorkflow.clinicBankDetails || bankDetails}`);
  lines.push("");
  lines.push("After payment, kindly reply with your UTR / transaction reference or screenshot.");
  lines.push("");
  lines.push("Once verified, your medicines and treatment schedule will begin.");
  lines.push("");
  lines.push("Regards,");
  lines.push("Homeo Healthcare Clinic");

  const messageText = lines.join("\n");
  const cleanPhone = (quotation.phone || "").replace(/\D/g, "");
  const targetPhone = cleanPhone.length >= 10 ? (cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`) : "";

  const whatsappUrl = targetPhone
    ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`
    : `https://wa.me/?text=${encodeURIComponent(messageText)}`;

  return {
    messageText,
    whatsappUrl,
  };
}
