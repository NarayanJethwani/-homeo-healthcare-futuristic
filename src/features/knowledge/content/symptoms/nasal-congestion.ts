import { KnowledgeEntity } from "../../types";

export const NasalCongestionSymptom: KnowledgeEntity = {
  id: "S0037",
  slug: "nasal-congestion",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Nasal Congestion",
    hi: "Nasal Congestion",
    gu: "Nasal Congestion",
    mr: "Nasal Congestion",
    es: "Nasal Congestion",
    ar: "Nasal Congestion"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Nasal Congestion.",
    hi: "Nasal Congestion के लक्षण की नैदानिक समझ.",
    gu: "Nasal Congestion ના લક્ષણ ની સમજણ.",
    mr: "Nasal Congestion चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Nasal Congestion.",
    ar: "التعريف السريري والأهمية لـ Nasal Congestion."
  },
  content: {
    definition: "Nasal Congestion represents a functional or sensory manifestation indicating systemic reaction or localized pathological change.",
    clinicalMeaning: "In clinical practice, monitoring Nasal Congestion helps evaluate disease progress and individual metabolic response.",
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
  tags: ["Nasal Congestion", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/nasal-congestion",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Nasal Congestion symptom profile"]
};
