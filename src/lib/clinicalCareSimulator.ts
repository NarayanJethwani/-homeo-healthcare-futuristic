import {
  CARE_PLAN_CATALOG,
  CARE_LEVELS_DETAILS,
  calculateCarePlanTotal,
  calculateContinuityCareTotal,
  type CarePlanDurationUnit,
  type CarePlanFamily,
  type CarePlanId,
  type CareLevelKey,
} from "./pricingConfig";

export const CLINICAL_CARE_SIMULATOR_VERSION = "clinical-care-simulator-v3";

export type OrganBreadth = "one" | "two-three" | "four-five" | "six-plus" | "unsure";
export type PathologyDepth = "functional" | "established" | "structural" | "advanced";
export type CaseChronicity = "recent" | "months" | "one-five-years" | "over-five-years";
export type CareIntensity = "standard" | "closer" | "frequent" | "direct";
export type CoordinationLoad = "minimal" | "records" | "multi-clinician" | "extensive";
export type CaseStability = "stable" | "fluctuating" | "rapid-change" | "red-flag";
export type AccessConsideration = "none" | "senior" | "financial-hardship" | "custom";

export interface ClinicalCareAssessment {
  breadth: OrganBreadth;
  pathologyDepth: PathologyDepth;
  chronicity: CaseChronicity;
  intensity: CareIntensity;
  coordination: CoordinationLoad;
  stability: CaseStability;
  accessConsideration: AccessConsideration;
}

export interface ClinicalCareRecommendation {
  planId: CarePlanId;
  planFamily: CarePlanFamily;
  pathway: Extract<CareLevelKey, "mild" | "chronic_focused" | "moderate" | "focused" | "comprehensive">;
  title: string;
  weeklyFee: number;
  carePeriodFee: number;
  durationValue: number;
  durationUnit: CarePlanDurationUnit;
  suggestedDurationWeeks: number;
  allowedDurationsWeeks: readonly number[];
  followUpLabel: string;
  reasons: string[];
  cautions: string[];
  requiresPhysicianConfirmation: true;
  blockedBySafetyGate: boolean;
  workloadTriggers: number;
  version: string;
}

export interface PharmacyQuoteItem {
  id: string;
  type: string;
  details: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ClinicalCareQuoteInput {
  recommendation: ClinicalCareRecommendation;
  durationWeeks: number;
  caseSpecificSupportAmount?: number;
  pharmacyItems?: PharmacyQuoteItem[];
  concessionAmount?: number;
}

export interface ClinicalCareQuote {
  planId: CarePlanId;
  planFamily: CarePlanFamily;
  durationValue: number;
  durationUnit: CarePlanDurationUnit;
  weeklyCareFee: number;
  durationWeeks: number;
  listCareTotal: number;
  continuityDiscountPercent: number;
  continuityDiscountTotal: number;
  baseCareTotal: number;
  caseSpecificSupportTotal: number;
  pharmacyTotal: number;
  subtotal: number;
  concessionTotal: number;
  finalTotal: number;
}

function planIdFor(assessment: ClinicalCareAssessment): CarePlanId {
  if (assessment.chronicity === "recent") {
    return assessment.intensity === "standard" && assessment.coordination === "minimal"
      ? "acute_mild_3d"
      : "acute_wellness_7d";
  }
  if (assessment.intensity === "direct" || assessment.coordination === "extensive") return "chronic_advanced_1w";
  if (assessment.intensity === "frequent" || assessment.coordination === "multi-clinician") return "chronic_complex_1w";
  if (assessment.intensity === "closer" || assessment.coordination === "records") return "chronic_integrated_1w";
  return "chronic_focused_1w";
}

function followUpFor(intensity: CareIntensity) {
  if (intensity === "direct") return "Direct physician supervision and high-frequency review";
  if (intensity === "frequent") return "Frequent physician review";
  if (intensity === "closer") return "Closer planned follow-up";
  return "Standard scheduled follow-up";
}

export function recommendClinicalCare(assessment: ClinicalCareAssessment): ClinicalCareRecommendation {
  const blockedBySafetyGate = assessment.stability === "red-flag" || assessment.stability === "rapid-change";
  // Case duration selects the acute or chronic family; only explicitly selected
  // delivery workload influences the tier within that family.
  const planId = planIdFor(assessment);
  const plan = CARE_PLAN_CATALOG[planId];
  const pathway = plan.legacyCareLevelKey as ClinicalCareRecommendation["pathway"];

  const workloadTriggers = [
    assessment.intensity !== "standard",
    assessment.coordination !== "minimal",
  ].filter(Boolean).length;

  const reasons: string[] = [];
  if (assessment.intensity !== "standard") reasons.push(followUpFor(assessment.intensity));
  if (assessment.coordination !== "minimal") reasons.push("Documented records or care-coordination workload");
  if (reasons.length === 0) reasons.push(assessment.chronicity === "recent"
    ? "Standard short-term review with minimal coordination; physician confirmation is required"
    : "Focused chronic care with standard follow-up and minimal coordination");

  const cautions = [
    "Diagnosis, organ-system count, pathology depth, and age never change the fee automatically.",
    "The physician must confirm clinical suitability separately from the administrative quotation.",
  ];
  if (assessment.accessConsideration !== "none") {
    cautions.push("Age or financial circumstances may support a documented concession, never a surcharge or reduced clinical scope.");
  }
  if (blockedBySafetyGate) {
    cautions.unshift("Safety gate: address urgent assessment, referral, or emergency care before confirming a plan or fee.");
  }

  return {
    planId,
    planFamily: plan.family,
    pathway,
    title: plan.title,
    weeklyFee: plan.price,
    carePeriodFee: plan.price,
    durationValue: plan.durationValue,
    durationUnit: plan.durationUnit,
    suggestedDurationWeeks: plan.family === "chronic" ? CARE_LEVELS_DETAILS[pathway].defaultDurationWeeks : 1,
    allowedDurationsWeeks: plan.family === "chronic" ? CARE_LEVELS_DETAILS[pathway].durations : [1],
    followUpLabel: followUpFor(assessment.intensity),
    reasons,
    cautions,
    requiresPhysicianConfirmation: true,
    blockedBySafetyGate,
    workloadTriggers,
    version: CLINICAL_CARE_SIMULATOR_VERSION,
  };
}

export function applyPhysicianPathwayOverride(
  recommendation: ClinicalCareRecommendation,
  pathway: ClinicalCareRecommendation["pathway"],
): ClinicalCareRecommendation {
  const planByPathway: Record<ClinicalCareRecommendation["pathway"], CarePlanId> = {
    mild: "acute_wellness_7d",
    chronic_focused: "chronic_focused_1w",
    moderate: "chronic_integrated_1w",
    focused: "chronic_complex_1w",
    comprehensive: "chronic_advanced_1w",
  };
  return applyPhysicianPlanOverride(recommendation, planByPathway[pathway]);
}

export function applyPhysicianPlanOverride(
  recommendation: ClinicalCareRecommendation,
  planId: CarePlanId,
): ClinicalCareRecommendation {
  const plan = CARE_PLAN_CATALOG[planId];
  const pathway = plan.legacyCareLevelKey as ClinicalCareRecommendation["pathway"];
  const allowedDurationsWeeks = plan.family === "chronic" ? CARE_LEVELS_DETAILS[pathway].durations : [1];
  const suggestedDurationWeeks = allowedDurationsWeeks.includes(recommendation.suggestedDurationWeeks)
    ? recommendation.suggestedDurationWeeks
    : 1;
  return {
    ...recommendation,
    planId,
    planFamily: plan.family,
    pathway,
    title: plan.title,
    weeklyFee: plan.price,
    carePeriodFee: plan.price,
    durationValue: plan.durationValue,
    durationUnit: plan.durationUnit,
    suggestedDurationWeeks,
    allowedDurationsWeeks,
    reasons: [`Physician manually selected ${plan.title} after clinical review`, ...recommendation.reasons],
  };
}

export function buildClinicalCareQuote(input: ClinicalCareQuoteInput): ClinicalCareQuote {
  const { recommendation } = input;
  if (recommendation.blockedBySafetyGate) {
    throw new Error("A quotation cannot be confirmed while the clinical safety gate is active.");
  }
  if (!recommendation.allowedDurationsWeeks.includes(input.durationWeeks)) {
    throw new Error(`Unsupported duration for ${recommendation.title}: ${input.durationWeeks} weeks`);
  }

  const caseSpecificSupportTotal = Math.max(0, Number(input.caseSpecificSupportAmount || 0));
  const pharmacyTotal = (input.pharmacyItems || []).reduce((sum, item) => sum + Math.max(0, Number(item.amount || 0)), 0);
  const continuity = recommendation.planFamily === "acute"
    ? calculateCarePlanTotal(recommendation.planId)
    : calculateContinuityCareTotal(recommendation.weeklyFee, input.durationWeeks);
  const baseCareTotal = continuity.total;
  const subtotal = baseCareTotal + caseSpecificSupportTotal + pharmacyTotal;
  const concessionTotal = Math.min(subtotal, Math.max(0, Number(input.concessionAmount || 0)));

  return {
    planId: recommendation.planId,
    planFamily: recommendation.planFamily,
    durationValue: recommendation.planFamily === "acute" ? recommendation.durationValue : input.durationWeeks,
    durationUnit: recommendation.durationUnit,
    weeklyCareFee: recommendation.weeklyFee,
    durationWeeks: input.durationWeeks,
    listCareTotal: continuity.listTotal,
    continuityDiscountPercent: continuity.discountPercent,
    continuityDiscountTotal: continuity.discountAmount,
    baseCareTotal,
    caseSpecificSupportTotal,
    pharmacyTotal,
    subtotal,
    concessionTotal,
    finalTotal: subtotal - concessionTotal,
  };
}
