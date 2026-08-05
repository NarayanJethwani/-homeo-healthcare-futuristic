/**
 * Governed Clinical Red-Flag Safety Engine
 * Isolated safety subsystem for high-risk triage and emergency escalation boundaries.
 */

import { SafetyAssessment, SafetyTrigger } from "../types/repertory-intelligence.types";

export const RED_FLAG_RULES: Array<{
  id: string;
  category: "cardiovascular" | "respiratory" | "neurological" | "anaphylactic" | "psychiatric_crisis";
  severity: "urgent" | "emergency";
  keywords: string[];
  description: string;
  recommendedAction: string;
}> = [
  {
    id: "rf_cardio_chest_pain",
    category: "cardiovascular",
    severity: "emergency",
    keywords: ["chest pain", "angina", "crushing pain", "radiating to arm", "radiating to jaw"],
    description: "Crushing or radiating chest pain suggestive of acute coronary syndrome.",
    recommendedAction: "Activate immediate emergency transfer protocol (EMS). Perform 12-lead ECG.",
  },
  {
    id: "rf_resp_severe_dyspnea",
    category: "respiratory",
    severity: "emergency",
    keywords: ["severe dyspnea", "stridor", "cyanosis", "unable to speak in full sentences", "respiratory distress"],
    description: "Severe respiratory distress with potential airway or gas-exchange compromise.",
    recommendedAction: "Administer high-flow supplemental O2. Evaluate for immediate hospital transfer.",
  },
  {
    id: "rf_neuro_stroke",
    category: "neurological",
    severity: "emergency",
    keywords: ["facial droop", "sudden weakness", "slurred speech", "hemiparesis", "sudden vision loss"],
    description: "Acute focal neurological deficit suggestive of cerebrovascular accident (stroke).",
    recommendedAction: "Trigger acute stroke protocol. Immediate emergency transport to stroke-capable center.",
  },
  {
    id: "rf_anaphylaxis",
    category: "anaphylactic",
    severity: "emergency",
    keywords: ["anaphylaxis", "angioedema", "laryngeal edema", "wheezing after sting", "hives with hypotension"],
    description: "Severe systemic allergic response with airway or hemodynamic involvement.",
    recommendedAction: "Administer intramuscular epinephrine (0.3mg 1:1000). Seek emergency transport.",
  },
];

export function evaluateClinicalSafety(symptoms: string[]): SafetyAssessment {
  const triggered: SafetyTrigger[] = [];
  const joinedText = symptoms.join(" ").toLowerCase();

  for (const rule of RED_FLAG_RULES) {
    for (const kw of rule.keywords) {
      if (joinedText.includes(kw)) {
        triggered.push({
          ruleId: rule.id,
          category: rule.category,
          severity: rule.severity,
          triggerKeyword: kw,
          description: rule.description,
          recommendedAction: rule.recommendedAction,
        });
        break;
      }
    }
  }

  if (triggered.length === 0) {
    return {
      status: "clear",
      ruleVersion: "clinical-redflag-v1.0",
      triggeredRules: [],
    };
  }

  const hasEmergency = triggered.some((t) => t.severity === "emergency");

  return {
    status: hasEmergency ? "emergency" : "urgent",
    ruleVersion: "clinical-redflag-v1.0",
    triggeredRules: triggered,
  };
}
