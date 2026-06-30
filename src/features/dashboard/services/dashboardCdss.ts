import { CdssRecommendation } from "../types";
import { CdssDomainModel, enforceCdssAdvisory } from "../domain/cdss";

/**
 * Service to retrieve CDSS clinical suggestions from patient list data
 */
export function getCdssRecommendations(patients: any[]): CdssDomainModel[] {
  const recommendations: CdssRecommendation[] = [];

  patients.forEach((pat) => {
    const compl = pat.complaint?.toLowerCase() || "";
    const pId = pat.id;

    if (compl.includes("gerd") || compl.includes("acid")) {
      recommendations.push({
        id: `cdss-gerd-${pId}`,
        patientId: pId,
        patientName: pat.name,
        recommendation: "Review potential Barrett's esophagus markers; possible remedy consideration includes Iris Versicolor 30C drainage layer.",
        confidence: 94,
        evidence: "Burning retrosternal discomfort; aggravation from acid food; hot thermal axis pattern.",
        remedyLayer: "Iris Versicolor 30C / Nux Vomica 200C",
        nextInvestigation: "Endoscopy Referral / Gastric pH Study",
        supportingReports: ["Gastric Analysis Report", "Thermal Scan Grid"],
      });
    } else if (compl.includes("eczema") || compl.includes("itching") || compl.includes("skin")) {
      recommendations.push({
        id: `cdss-eczema-${pId}`,
        patientId: pId,
        patientName: pat.name,
        recommendation: "Potential skin-lung suppression pattern noted; constitutional review suggested for possible Sulphur 30C layer.",
        confidence: 89,
        evidence: "History of suppressive topical steroids; concurrent asthma symptoms; psora miasm dominance.",
        remedyLayer: "Sulphur 30C / Sac Lac (Placebo)",
        nextInvestigation: "IgE Allergy Panel / Pulmonary Function Test",
        supportingReports: ["Immunoglobulin Profile", "Intake Log"],
      });
    }
  });

  // Fallbacks if no matching cases
  if (recommendations.length === 0) {
    recommendations.push({
      id: "cdss-default-1",
      patientId: "mock-meera",
      patientName: "Meera Jethwani",
      recommendation: "High TSH Axis overload pattern; recommended clinical correlation with Thyroidinum 30C organ support.",
      confidence: 95,
      evidence: "TSH: 8.4 uIU/mL (High); Deficient Vit D3; Sluggish metabolism thermal axis.",
      remedyLayer: "Thyroidinum 30C / Calcarea Carb 200C",
      nextInvestigation: "Free T3 / Free T4 Blood Panel",
      supportingReports: ["TSH Axis Lab", "Metabolic Log"],
    });
    recommendations.push({
      id: "cdss-default-2",
      patientId: "mock-rahul",
      patientName: "Rahul Sharma",
      recommendation: "Suppressive skin therapy (topical steroids) has pushed pathology to respiratory axis (asthma). Evaluate Sulphur 30C antipsoric layer.",
      confidence: 91,
      evidence: "Eczema vanished post-steroid; asthma started 6 months later. Hering's law: inside-out progression.",
      remedyLayer: "Sulphur 30C / Sac Lac",
      nextInvestigation: "Spirometry / IgE Blood Count",
      supportingReports: ["Pulmonary Intake Chart", "Historical Miasms Log"],
    });
  }

  // Enforce the legal CDSS advisory disclaimers on every entry
  return recommendations.map(enforceCdssAdvisory);
}
