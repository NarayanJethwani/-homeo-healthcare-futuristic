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
 * Generates clinical care recommendation details based on current planner selections.
 * 
 * Rules are designed to be conservative:
 * - Acute & Wellness Care = low complexity, short duration, acute/wellness cases
 * - Standard Chronic Care = single chronic condition, moderate follow-up
 * - Deep Systemic Care = deeper chronic/systemic cases
 * - Advanced Pathological Care = pathology-heavy or organ-involved cases
 * - Multisystem Integrative Care = multiple active conditions or complex constitutional cases
 * - Acute Critical Care = acute high-intensity support, but must show physician review disclaimer
 * 
 * Does not diagnose, prescribe remedies, promise cure, or claim guaranteed results.
 */
export function getTreatmentRecommendation(
  selectedPlan: string,
  conditionCount: number,
  duration: number,
  billingFrequency: "weekly" | "monthly",
  selectedComplexity?: string
): RecommendationResult {
  let recommendedProgram = "Standard Chronic Care";
  let complexity: "Routine" | "Standard" | "Enhanced" | "Advanced" | "Comprehensive" | "Intensive" = "Standard";
  let confidence: "Moderate" | "High" = "High";
  let followUpFrequency: "Weekly" | "Bi-weekly" | "Monthly" = "Bi-weekly";
  let reasons: string[] = [];
  let patientExplanation = "";
  const disclaimer = "This recommendation supports treatment planning and is confirmed after consultation with the physician.";

  // Mapping plan identifiers to friendly names
  const planNames: Record<string, string> = {
    mild: "Acute & Wellness Care",
    moderate: "Standard Chronic Care",
    focused: "Deep Systemic Care",
    organ: "Advanced Pathological Care",
    comprehensive: "Multisystem Integrative Care",
    acute_critical: "Acute Critical Care",
  };

  // Determine conservative clinical guidance details based on selected care level / plan
  switch (selectedPlan) {
    case "mild":
      recommendedProgram = planNames.mild;
      complexity = "Routine";
      followUpFrequency = billingFrequency === "weekly" ? "Bi-weekly" : "Monthly";
      reasons = [
        "Low complexity general constitutional profile",
        "Short care duration suitability",
        "Acute symptoms or general wellness concern"
      ];
      patientExplanation = "Based on your selected clinical profile, this acute & wellness program provides standard constitutional tracking, lower complexity case monitoring, and seasonal acute support.";
      
      // Safety/conservative checks for mismatch
      if (conditionCount > 1) {
        confidence = "Moderate";
        reasons.push("Multiple active conditions identified");
        patientExplanation = "Based on your selected clinical profile, this care level is optimized for general wellness, but multi-concern treatment typically requires Standard Chronic Care coordination.";
      }
      break;

    case "moderate":
      recommendedProgram = planNames.moderate;
      complexity = "Standard";
      followUpFrequency = "Bi-weekly";
      reasons = [
        "Single chronic condition profile mapping",
        "Moderate therapeutic tracking needs",
        "Active monitoring with bi-weekly updates"
      ];
      patientExplanation = "Based on your selected clinical profile, this care program provides the recommended follow-up frequency, constitutional treatment planning, and monitoring intensity for long-term management.";
      
      if (conditionCount > 2) {
        confidence = "Moderate";
        reasons.push("Multiple chronic conditions require deeper systemic evaluation");
        patientExplanation = "Based on your selected clinical profile, this standard program supports single chronic complaints, but multiple active conditions warrant deeper systemic or integrative tracking.";
      }
      break;

    case "focused":
      recommendedProgram = planNames.focused;
      complexity = "Enhanced";
      followUpFrequency = "Bi-weekly";
      reasons = [
        "Deeper systemic or chronic constitutional concern",
        "Requires active clinical response monitoring",
        "Customized high-potency constitutional remedy needs"
      ];
      patientExplanation = "Based on your selected clinical profile, this program delivers targeted constitutional planning, active response tracking, and deeper therapeutic monitoring for systemic chronic conditions.";
      
      if (conditionCount > 3) {
        confidence = "Moderate";
        reasons.push("Complex multi-system profiles benefit from direct integrative supervision");
      }
      break;

    case "organ":
      recommendedProgram = planNames.organ;
      complexity = "Advanced";
      followUpFrequency = "Bi-weekly";
      reasons = [
        "Organ-involved chronic pathology",
        "Requires biomarker reviews and lab diagnostics",
        "Higher complexity systemic profile"
      ];
      patientExplanation = "Based on your selected clinical profile, this program provides organ-level pathological tracking, diagnostics/lab report audits, and intensive constitutional planning for chronic systemic imbalances.";
      break;

    case "comprehensive":
      recommendedProgram = planNames.comprehensive;
      complexity = "Comprehensive";
      followUpFrequency = "Weekly";
      reasons = [
        "Multiple active co-morbidities (3+ conditions)",
        "Advanced chronic multi-system pathology",
        "Requires direct clinical supervision and weekly monitoring"
      ];
      patientExplanation = "Based on your selected clinical profile, this integrative program provides multi-system pathology coordination, weekly tracking, and intensive clinical monitoring under direct physician supervision.";
      break;

    case "acute_critical":
      recommendedProgram = planNames.acute_critical;
      complexity = "Intensive";
      followUpFrequency = "Weekly";
      reasons = [
        "High-intensity acute flare or crisis support",
        "Requires daily clinical reviews and frequent titration",
        "Urgent physician study required"
      ];
      patientExplanation = "Based on your selected clinical profile, this acute program provides high-intensity daily clinical tracking, priority physician study, and rapid remedy titration for acute flares.";
      break;

    default:
      recommendedProgram = planNames.moderate;
      complexity = "Standard";
      followUpFrequency = "Bi-weekly";
      reasons = ["General clinical chronic monitoring"];
      patientExplanation = "Based on your selected clinical profile, standard chronic care planning is recommended to begin constitutional mapping and symptom monitoring.";
      break;
  }

  // Double check manual override of complexity if provided
  if (selectedComplexity) {
    if (selectedComplexity === "Low" || selectedComplexity === "Routine") complexity = "Routine";
    else if (selectedComplexity === "Moderate" || selectedComplexity === "Standard") complexity = "Standard";
    else if (selectedComplexity === "Moderate–High" || selectedComplexity === "Enhanced") complexity = "Enhanced";
    else if (selectedComplexity === "High" || selectedComplexity === "Advanced") complexity = "Advanced";
    else if (selectedComplexity === "Comprehensive") complexity = "Comprehensive";
    else if (selectedComplexity === "Intensive") complexity = "Intensive";
  }

  return {
    recommendedProgram,
    complexity,
    confidence,
    followUpFrequency,
    reasons,
    patientExplanation,
    disclaimer
  };
}
