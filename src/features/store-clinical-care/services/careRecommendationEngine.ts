import {
  CLINICAL_CARE_TIER_OPTIONS,
  EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT,
  calculateTierCarePeriodTotalPaise,
  calculateTierListCarePeriodTotalPaise,
  getTierCarePeriodLabel,
  getTierContinuityBenefit,
  formatINRFromPaise,
  getClinicPaymentConfiguration,
  type ClinicalCareDurationWeeks,
  type PreliminaryCareRecommendation,
  type ItemizedPharmacyBreakdown,
  type GovernedConcession,
  type OfficialClinicalQuotation,
  type StoreClinicalCareTierId,
} from "../domain/types";

export interface PreliminaryRecommendationInput {
  selectedOrganSystems?: string[];
  durationText?: string;
  severityRating?: number; // 1-10
  priorTreatmentFailures?: boolean;
  age?: number | string;
  careFamily?: "acute" | "chronic" | "unsure";
  supportIntensity?: "standard" | "closer" | "frequent" | "direct" | "unsure";
  safetyStatus?: "clear" | "unsure" | "red-flag";
}

/**
 * Patient-facing administrative guide. Diagnosis, organ count, severity, age,
 * and treatment history never increase the fee automatically.
 */
export function calculatePreliminaryCareRecommendation(
  input: PreliminaryRecommendationInput
): PreliminaryCareRecommendation {
  const organCount = (input.selectedOrganSystems || []).length;
  const blockedBySafetyGate = input.safetyStatus === "red-flag" || input.safetyStatus === "unsure";
  const inferredAcute = input.careFamily === "acute" || (input.careFamily === undefined && /recent|less than 1 month|acute/i.test(input.durationText || ""));
  const intensity = input.supportIntensity || "standard";
  let tierId: StoreClinicalCareTierId;
  if (inferredAcute) tierId = intensity === "standard" ? "acute_mild" : "acute_wellness";
  else if (intensity === "direct") tierId = "advanced";
  else if (intensity === "frequent") tierId = "complex";
  else if (intensity === "closer") tierId = "integrated";
  else tierId = "focused";

  const rationale = blockedBySafetyGate
    ? "Please seek urgent clinical assessment before choosing or requesting a care plan."
    : inferredAcute
      ? "A short non-emergency care period may be a suitable starting point after physician review."
      : `${intensity === "standard" || intensity === "unsure" ? "Standard" : intensity} planned follow-up selected; the physician confirms the final scope.`;
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierId] || CLINICAL_CARE_TIER_OPTIONS.focused;

  return {
    suggestedTierId: tierId,
    suggestedTierName: tier.name,
    selectedOrganCount: organCount,
    rationale,
    blockedBySafetyGate,
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
  const tierKey = input.tierId && input.tierId in CLINICAL_CARE_TIER_OPTIONS ? input.tierId as keyof typeof CLINICAL_CARE_TIER_OPTIONS : "integrated";
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierKey];

  const listProfessionalFeePaise = calculateTierListCarePeriodTotalPaise(tier.id, input.durationWeeks);
  const professionalFeePaise = calculateTierCarePeriodTotalPaise(tier.id, input.durationWeeks);
  const continuityDiscountPercent = getTierContinuityBenefit(tier.id, input.durationWeeks);
  const continuityDiscountPaise = listProfessionalFeePaise - professionalFeePaise;
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
    listProfessionalFeePaise,
    continuityDiscountPercent,
    continuityDiscountPaise,
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
 * Builds the official formatted WhatsApp message and wa.me URL for clinician quotation sending.
 */
export function buildWhatsAppQuotationPayload(quotation: OfficialClinicalQuotation): {
  messageText: string;
  whatsappUrl: string;
} {
  const { upiId, bankDetails } = getClinicPaymentConfiguration();
  const bd = quotation.breakdown;
  const carePeriodLabel = getTierCarePeriodLabel(quotation.tierId, quotation.durationWeeks);

  const lines: string[] = [
    "*Homeo Healthcare*",
    "",
    `Dear ${quotation.patientName},`,
    "",
    "Dr. Jethwani has completed your Clinical Care Recommendation.",
    "",
    "Recommended Plan:",
    `• ${quotation.tierName}`,
    `• ${carePeriodLabel}`,
    "",
    `Professional Care Fee:\n${formatINRFromPaise(bd.listProfessionalFeePaise)}`,
  ];

  if (bd.continuityDiscountPaise > 0) {
    lines.push(`Continuity Care Benefit (${bd.continuityDiscountPercent}%):\n-${formatINRFromPaise(bd.continuityDiscountPaise)}`);
    lines.push(`Professional Care Fee After Benefit:\n${formatINRFromPaise(bd.professionalFeePaise)}`);
  }

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

/**
 * Builds patient assessment WhatsApp review payload directly to Dr. Jethwani (8446056789).
 */
export function buildPatientWhatsAppReviewLink(data: {
  patientName: string;
  phone?: string;
  submissionId?: string;
  selectedTierName: string;
  preferredDurationWeeks: number;
  carePeriodLabel?: string;
  totalEstimatedAmountFormatted: string;
  mainHealthArea: string;
  concernDescription?: string;
}): { whatsappUrl: string; messageText: string } {
  const targetDoctorPhone = "918446056789"; // Integrated Doctor Assistance WhatsApp
  const lines: string[] = [
    "*Homeo Healthcare — Patient Physician Review Request*",
    "",
    `Dear Dr. Jethwani,`,
    "",
    `I am submitting my clinical care details for your physician review and guidance:`,
    "",
    `• *Patient Name*: ${data.patientName}`,
    data.phone ? `• *Contact Phone*: ${data.phone}` : "",
    data.submissionId ? `• *Assessment Ref*: ${data.submissionId}` : "",
    `• *Primary Health Area*: ${data.mainHealthArea}`,
    `• *Selected Care Tier*: ${data.selectedTierName}`,
    `• *Planned Care Period*: ${data.carePeriodLabel || `${data.preferredDurationWeeks} Weeks`}`,
    `• *Estimated Total Fee*: ${data.totalEstimatedAmountFormatted}`,
  ].filter(Boolean);

  if (data.concernDescription) {
    lines.push(`• *Health Concern Details*: ${data.concernDescription.slice(0, 300)}`);
  }

  lines.push("");
  lines.push("Please assist with my clinical case review and treatment guidance.");

  const messageText = lines.join("\n");
  const whatsappUrl = `https://wa.me/${targetDoctorPhone}?text=${encodeURIComponent(messageText)}`;

  return {
    whatsappUrl,
    messageText,
  };
}
