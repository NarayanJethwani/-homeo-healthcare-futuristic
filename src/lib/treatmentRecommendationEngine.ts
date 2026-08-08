import { CARE_LEVELS_DETAILS, toPublicCarePathway } from "./pricingConfig";

export interface RecommendationResult {
  recommendedProgram: string;
  complexity: "Routine" | "Standard" | "Enhanced" | "Advanced" | "Comprehensive" | "Intensive";
  confidence: "Moderate" | "High";
  followUpFrequency: "Weekly" | "Bi-weekly" | "Monthly";
  reasons: string[];
  patientExplanation: string;
  disclaimer: string;
}

/**
 * Provides patient-friendly pathway guidance. It never calculates a charge from
 * symptom or condition count; a physician confirms suitability and scope.
 */
export function getTreatmentRecommendation(
  selectedPlan: string,
  conditionCount: number,
  _duration: number,
  _billingFrequency: "weekly" | "monthly",
  selectedComplexity?: string,
): RecommendationResult {
  const pathway = toPublicCarePathway(selectedPlan);
  const detail = CARE_LEVELS_DETAILS[pathway];
  const hasComplexProfile = conditionCount >= 3 || selectedComplexity === "High" || selectedComplexity === "Comprehensive";

  if (pathway === "mild") {
    return {
      recommendedProgram: detail.title,
      complexity: "Routine",
      confidence: conditionCount > 1 ? "Moderate" : "High",
      followUpFrequency: "Weekly",
      reasons: ["New or short-term symptoms", "One acute episode", "Short care duration"],
      patientExplanation: conditionCount > 1
        ? "Focused Clinical Care includes single primary health concern or localized follow-up. Integrated Clinical Care manages multiple related health conditions requiring constitutional care."
        : detail.scopeMessage,
      disclaimer: "A physician confirms pathway suitability before treatment begins.",
    };
  }

  if (pathway === "focused" || hasComplexProfile) {
    const advanced = CARE_LEVELS_DETAILS.focused;
    return {
      recommendedProgram: advanced.title,
      complexity: "Advanced",
      confidence: "Moderate",
      followUpFrequency: "Weekly",
      reasons: ["Complex or long-standing history", "Possible multi-system involvement", "Closer physician monitoring may be appropriate"],
      patientExplanation: advanced.scopeMessage,
      disclaimer: "Final care scope and price are confirmed after physician assessment and before treatment begins.",
    };
  }

  return {
    recommendedProgram: detail.title,
    complexity: "Standard",
    confidence: "High",
    followUpFrequency: "Bi-weekly",
    reasons: ["Chronic or recurring symptoms", "Constitutional case-taking", "Related symptoms considered together"],
    patientExplanation: detail.scopeMessage,
    disclaimer: "A physician confirms pathway suitability before treatment begins.",
  };
}
