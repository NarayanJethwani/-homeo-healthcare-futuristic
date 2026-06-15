export interface Question {
  id: string;
  label: string;
  type: "select" | "range";
  options?: string[];
  min?: number;
  max?: number;
  labelMin?: string;
  labelMax?: string;
}

export interface AssessmentProfile {
  id: string;
  name: string;
  category: string;
  gradient: string;
  textClass: string;
  badgeBg: string;
  description: string;
  questions: Question[];
  symptomsList: string[];
}

export interface MiasmaticProfile {
  psora: number;
  sycosis: number;
  syphilis: number;
}

export interface SystemScores {
  endocrine: number;
  cardiovascular: number;
  digestive: number;
  respiratory: number;
  skin: number;
  neurological: number;
  immune: number;
  mentalHealth: number;
}

export interface ConstitutionalProfile {
  thermal: string;
  appetite: string;
  sleep: string;
  temperament: string;
  modality: string;
  remedyMatch: string;
  systemDominance: string;
  adaptivePattern: string;
}

export interface HealthDigitalTwin {
  overallScore: number;
  systemScores: SystemScores;
  completedAssessments: Record<string, {
    date: string;
    score: number;
    answers: Record<string, any>;
    symptoms: string[];
  }>;
  organLoad: Record<string, number>;
  riskLevel: Record<string, { level: "Low" | "Moderate" | "High"; pct: number }>;
  constitutional?: ConstitutionalProfile;
  activeRulesFlags: string[];
  priorityGoals: string[];
}

export interface IntelligenceReport {
  healthScore: number;
  riskClass: "Low Risk" | "Moderate Risk" | "High Risk";
  priorityAreas: string[];
  miasmaticProfile: MiasmaticProfile;
  organLoad: number;
  contributingFactors: {
    lifestyle: string;
    nutrition: string;
    stress: string;
    sleep: string;
    genetics: string;
  };
  suggestedLabs: string[];
  recommendations: {
    diet: string;
    exercise: string;
    sleep: string;
    stress: string;
    preventive: string;
  };
  homeopathicInsights?: string;
}
