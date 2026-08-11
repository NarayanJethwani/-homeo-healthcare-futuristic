import {
  CARE_LEVELS_DETAILS,
  calculateContinuityCareTotal,
  type CareLevelKey,
} from "./pricingConfig";

export const CLINICAL_CARE_SIMULATOR_VERSION = "clinical-care-simulator-v1";

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
  pathway: Extract<CareLevelKey, "mild" | "moderate" | "focused" | "comprehensive">;
  title: string;
  weeklyFee: number;
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

const ADVANCED_BREADTH = new Set<OrganBreadth>(["four-five", "six-plus"]);
const ADVANCED_DEPTH = new Set<PathologyDepth>(["structural", "advanced"]);
const LONG_CHRONICITY = new Set<CaseChronicity>(["one-five-years", "over-five-years"]);
const ENHANCED_INTENSITY = new Set<CareIntensity>(["closer", "frequent", "direct"]);
const COORDINATION_BURDEN = new Set<CoordinationLoad>(["records", "multi-clinician", "extensive"]);

function durationFor(pathway: ClinicalCareRecommendation["pathway"], assessment: ClinicalCareAssessment) {
  if (pathway === "mild") return assessment.stability === "fluctuating" ? 2 : 1;
  if (pathway === "comprehensive") return 2;
  if (assessment.chronicity === "over-five-years") return 12;
  if (assessment.chronicity === "one-five-years") return 8;
  return 4;
}

function followUpFor(intensity: CareIntensity) {
  if (intensity === "direct") return "Direct physician supervision and high-frequency review";
  if (intensity === "frequent") return "Frequent physician review";
  if (intensity === "closer") return "Closer planned follow-up";
  return "Standard scheduled follow-up";
}

export function recommendClinicalCare(assessment: ClinicalCareAssessment): ClinicalCareRecommendation {
  const blockedBySafetyGate = assessment.stability === "red-flag";
  const advancedTriggers = [
    ADVANCED_BREADTH.has(assessment.breadth),
    ADVANCED_DEPTH.has(assessment.pathologyDepth),
    LONG_CHRONICITY.has(assessment.chronicity),
    ENHANCED_INTENSITY.has(assessment.intensity),
    COORDINATION_BURDEN.has(assessment.coordination),
  ].filter(Boolean).length;

  const completeTrigger = assessment.intensity === "direct" || (
    assessment.intensity === "frequent" &&
    (assessment.pathologyDepth === "advanced" || assessment.coordination === "extensive")
  );
  const acuteTrigger = assessment.chronicity === "recent" &&
    assessment.pathologyDepth === "functional" &&
    assessment.intensity === "standard" &&
    assessment.coordination === "minimal" &&
    !ADVANCED_BREADTH.has(assessment.breadth);

  let pathway: ClinicalCareRecommendation["pathway"] = "moderate";
  if (acuteTrigger) pathway = "mild";
  else if (completeTrigger) pathway = "comprehensive";
  else if (advancedTriggers >= 2) pathway = "focused";

  const detail = CARE_LEVELS_DETAILS[pathway];
  const reasons: string[] = [];
  if (acuteTrigger) reasons.push("Recent, stable presentation with standard follow-up needs");
  if (ADVANCED_BREADTH.has(assessment.breadth)) reasons.push("Broad multi-system involvement informs workload review");
  if (ADVANCED_DEPTH.has(assessment.pathologyDepth)) reasons.push("Established structural or advanced pathology requires deeper review");
  if (LONG_CHRONICITY.has(assessment.chronicity)) reasons.push("Long-standing case history supports a longer review period");
  if (ENHANCED_INTENSITY.has(assessment.intensity)) reasons.push(followUpFor(assessment.intensity));
  if (COORDINATION_BURDEN.has(assessment.coordination)) reasons.push("Records or care-coordination workload is clinically relevant");
  if (reasons.length === 0) reasons.push("Chronic or recurring presentation suited to constitutional assessment");

  const cautions = [
    "Organ-system count is an assessment indicator and never changes the fee automatically.",
    "Pathology influences the recommendation only through actual review, monitoring, or coordination needs.",
  ];
  if (assessment.accessConsideration !== "none") {
    cautions.push("Age or financial circumstances may support a documented concession, never a surcharge or reduced clinical scope.");
  }
  if (blockedBySafetyGate) {
    cautions.unshift("Safety gate: address urgent assessment, referral, or emergency care before confirming a plan or fee.");
  }

  return {
    pathway,
    title: detail.title,
    weeklyFee: detail.weeklyPrice,
    suggestedDurationWeeks: durationFor(pathway, assessment),
    allowedDurationsWeeks: detail.durations,
    followUpLabel: followUpFor(assessment.intensity),
    reasons,
    cautions,
    requiresPhysicianConfirmation: true,
    blockedBySafetyGate,
    workloadTriggers: advancedTriggers,
    version: CLINICAL_CARE_SIMULATOR_VERSION,
  };
}

export function applyPhysicianPathwayOverride(
  recommendation: ClinicalCareRecommendation,
  pathway: ClinicalCareRecommendation["pathway"],
): ClinicalCareRecommendation {
  const detail = CARE_LEVELS_DETAILS[pathway];
  const suggestedDurationWeeks = detail.durations.includes(recommendation.suggestedDurationWeeks)
    ? recommendation.suggestedDurationWeeks
    : detail.durations[0];

  return {
    ...recommendation,
    pathway,
    title: detail.title,
    weeklyFee: detail.weeklyPrice,
    suggestedDurationWeeks,
    allowedDurationsWeeks: detail.durations,
    reasons: [
      `Physician manually selected ${detail.title} after clinical review`,
      ...recommendation.reasons,
    ],
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
  const continuity = calculateContinuityCareTotal(recommendation.weeklyFee, input.durationWeeks);
  const baseCareTotal = continuity.total;
  const subtotal = baseCareTotal + caseSpecificSupportTotal + pharmacyTotal;
  const concessionTotal = Math.min(subtotal, Math.max(0, Number(input.concessionAmount || 0)));

  return {
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
