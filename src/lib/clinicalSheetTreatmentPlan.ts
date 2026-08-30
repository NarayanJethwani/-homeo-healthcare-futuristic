import {
  buildGoogleSheetsCarePeriodWeeksFormula,
  buildGoogleSheetsCareRateFormula,
  buildGoogleSheetsContinuityBenefitFormula,
  getCareLevelDisplayNameWithIcon,
} from "./pricingConfig";

export interface ClinicalSheetPlanBreakdown {
  weeklyCareFee?: number;
  listCareTotal?: number;
  continuityDiscountTotal?: number;
  caseSpecificSupportTotal?: number;
  assessmentAddonsTotal?: number;
  concessionTotal?: number;
  pharmacyTotal?: number;
}

export interface ClinicalSheetTreatmentPlanData {
  patientId: string;
  patientName: string;
  careLevel?: string;
  billingCycle?: string;
  durationValue?: number;
  conditionsCount?: number;
  concessionApplied?: string;
  overridePrice?: number;
  medicineAddons?: number;
  receivedAmount?: number;
  finalPrice?: number;
  planConfirmed: boolean;
  confirmedDate?: string;
  breakdown?: ClinicalSheetPlanBreakdown;
}

function withoutLeadingEquals(formula: string): string {
  return formula.startsWith("=") ? formula.slice(1) : formula;
}

function whenPlanSelected(formula: string): string {
  return `=IF(A4="","",${withoutLeadingEquals(formula)})`;
}

function normalizeBillingCycle(value?: string): "Weekly" | "Monthly" {
  return value?.toLowerCase().trim() === "monthly" ? "Monthly" : "Weekly";
}

function normalizeConcession(value?: string): string {
  const normalized = value?.toLowerCase().trim() || "";
  if (normalized.includes("senior")) return "Senior 15%";
  if (normalized.includes("socio") || normalized.includes("compassionate")) return "Socio-Economic 30%";
  if (normalized.includes("override") || normalized.includes("special")) return "Special Clinical Concession";
  if (normalized.includes("documented") || normalized.includes("manual")) return "Documented Manual Concession";
  return "None";
}

export function buildClinicalSheetTreatmentPlanValues(data: ClinicalSheetTreatmentPlanData) {
  const hasPlan = data.planConfirmed && Boolean(data.careLevel?.trim());
  const careLevel = hasPlan ? getCareLevelDisplayNameWithIcon(data.careLevel || "") : "";
  const billingCycle = hasPlan ? normalizeBillingCycle(data.billingCycle) : "";
  const durationValue = hasPlan ? Math.max(1, Number(data.durationValue) || 1) : "";
  const conditionsCount = hasPlan ? Math.max(1, Number(data.conditionsCount) || 1) : "";
  const concession = hasPlan ? normalizeConcession(data.concessionApplied) : "";
  const overridePrice = hasPlan ? Number(data.overridePrice) || 0 : "";
  const medicineAddons = hasPlan ? Number(data.medicineAddons) || 0 : "";
  const breakdown = data.breakdown;

  const weeklyCareRate = hasPlan && breakdown?.weeklyCareFee !== undefined
    ? breakdown.weeklyCareFee
    : whenPlanSelected(buildGoogleSheetsCareRateFormula());
  const continuityBenefit = hasPlan && breakdown?.continuityDiscountTotal !== undefined
    ? breakdown.continuityDiscountTotal
    : whenPlanSelected(buildGoogleSheetsContinuityBenefitFormula());
  const listCareTotal = hasPlan && breakdown?.listCareTotal !== undefined
    ? breakdown.listCareTotal
    : whenPlanSelected(`=B8*${buildGoogleSheetsCarePeriodWeeksFormula()}`);
  const scopeReview = hasPlan && breakdown?.caseSpecificSupportTotal !== undefined ? breakdown.caseSpecificSupportTotal : "";
  const assessmentAddons = hasPlan && breakdown?.assessmentAddonsTotal !== undefined ? breakdown.assessmentAddonsTotal : "";
  const concessionAmount = hasPlan && breakdown?.concessionTotal !== undefined
    ? breakdown.concessionTotal
    : whenPlanSelected(`=IF(ISNUMBER(SEARCH("Senior", E4)), (B10-B9)*0.15, IF(ISNUMBER(SEARCH("Socio", E4)), (B10-B9)*0.30, IF(OR(ISNUMBER(SEARCH("Override", E4)), ISNUMBER(SEARCH("Special", E4))), MAX(0, (B10-B9)-F4), 0)))`);
  const pharmacyTotal = hasPlan && breakdown?.pharmacyTotal !== undefined ? breakdown.pharmacyTotal : whenPlanSelected("=G4");
  const totalProgramCost = hasPlan && data.finalPrice !== undefined ? Number(data.finalPrice) : whenPlanSelected("=B10-B9+B11+B12-B13+B14");
  const amountReceived = hasPlan && data.receivedAmount !== undefined ? Number(data.receivedAmount) : "";

  const plannerRow = [careLevel, billingCycle, durationValue, conditionsCount, concession, overridePrice, medicineAddons];
  const breakdownRows = [
    ["Weekly Care Rate", weeklyCareRate, "Weekly rate from the synchronized care pathway"],
    ["Continuity Care Benefit", continuityBenefit, "0% / 5% / 10% / 15% / 20% benefit for 1 / 2 / 4 / 8 / 12 weeks"],
    ["List Care Period Total", listCareTotal, "Weekly rate multiplied by the confirmed care period"],
    ["Physician Scope Review", scopeReview, "Doctor-entered case-specific support; never added automatically"],
    ["Assessment Add-ons", assessmentAddons, "Doctor-entered records review or acute support"],
    ["Clinical Concession Amount", concessionAmount, "Approved concession after the continuity benefit"],
    ["Medicine Add-ons", pharmacyTotal, "Medicine charges synchronized with the confirmed plan"],
    ["Total Program Cost", totalProgramCost, "Confirmed portal total, or sheet calculation after doctor entry"],
  ];
  const balanceRow = ["Balance Due", whenPlanSelected("=B15-B16"), "Outstanding dues for this treatment plan"];
  const summaryRow = [
    "WhatsApp Care Summary",
    whenPlanSelected(`="Dear " & 'Case Taking'!B4 & ", thank you for consulting Homeo Healthcare. Your physician-confirmed care pathway is: " & A4 & " for " & C4 & " " & IF(B4="Weekly", IF(C4=1, "week", "weeks"), IF(C4=1, "month", "months")) & ". Continuity care benefit: ₹" & TEXT(B9, "#,##0") & IF(E4="None", "", " [" & E4 & "]") & ". Agreed Total: ₹" & TEXT(B15, "#,##0") & ". Balance Due: ₹" & TEXT(B17, "#,##0") & ". Clinic Branch: Homeo Healthcare."`),
  ];
  const financeRow = hasPlan
    ? [
        data.confirmedDate || new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
        `${careLevel} - Confirmed Treatment Plan`,
        `Tx-Plan-${data.patientId}`,
        "='Treatment Planner'!B15",
        "='Treatment Planner'!B16",
        '=IF(D9="","",D9-E9)',
        amountReceived && Number(amountReceived) > 0 ? "Recorded in Portal" : "",
        `=IF(D9="","",IF(F9<=0, "PAID", IF(E9>0, "PARTIALLY PAID", "UNPAID")))`,
      ]
    : ["", "", "", "", "", "", "", ""];

  return {
    hasPlan,
    plannerRow,
    breakdownRows,
    amountReceived,
    balanceRow,
    summaryRow,
    financeRow,
    financeSummary: {
      billed: '=IF(COUNTA(A9:A100)=0,"",SUM(D9:D100))',
      received: '=IF(COUNTA(A9:A100)=0,"",SUM(E9:E100))',
      balance: '=IF(OR(A4="",C4=""),"",A4-C4)',
    },
  };
}
