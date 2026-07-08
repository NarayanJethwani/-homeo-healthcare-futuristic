import { KnowledgeEntity } from "../../types";

export const WeightGainSymptom: KnowledgeEntity = {
  id: "S0020",
  slug: "weight-gain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Weight Gain",
    hi: "Weight Gain",
    gu: "Weight Gain",
    mr: "Weight Gain",
    es: "Weight Gain",
    ar: "Weight Gain"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Weight Gain.",
    hi: "Weight Gain के लक्षण की नैदानिक समझ.",
    gu: "Weight Gain ના લક્ષણ ની સમજણ.",
    mr: "Weight Gain चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Weight Gain.",
    ar: "التعريف السريري والأهمية لـ Weight Gain."
  },
  content: {
    definition: "Weight Gain represents a functional or sensory manifestation indicating systemic reaction or localized pathological change.",
    clinicalMeaning: "In clinical practice, monitoring Weight Gain helps evaluate disease progress and individual metabolic response.",
    commonCauses: [
      "Functional systemic stress",
      "Fatigue or lifestyle imbalance",
      "Underlying organic pathology"
    ],
    differentialDiagnosis: "Must be distinguished based on onset, intensity, duration, and triggering modalities.",
    redFlags: [
      "Persistent occurrence lasting more than 7 days",
      "Associated high-grade fever or neurological deficit",
      "Unresponsiveness to standard hydration or rest"
    ],
    lifestyleAdvice: "Ensure adequate rest, hydration, stress management, and light nutrition.",
    references: ["CIT-0001", "CIT-0003"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Weight Gain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/weight-gain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Weight Gain symptom profile"]
};
