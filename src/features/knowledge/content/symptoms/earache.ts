import { KnowledgeEntity } from "../../types";

export const EaracheSymptom: KnowledgeEntity = {
  id: "S0040",
  slug: "earache",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Earache",
    hi: "Earache",
    gu: "Earache",
    mr: "Earache",
    es: "Earache",
    ar: "Earache"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Earache.",
    hi: "Earache के लक्षण की नैदानिक समझ.",
    gu: "Earache ના લક્ષણ ની સમજણ.",
    mr: "Earache चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Earache.",
    ar: "التعريف السريري والأهمية لـ Earache."
  },
  content: {
    definition: "Earache represents a functional or sensory manifestation indicating systemic reaction or localized pathological change.",
    clinicalMeaning: "In clinical practice, monitoring Earache helps evaluate disease progress and individual metabolic response.",
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
  tags: ["Earache", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/earache",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Earache symptom profile"]
};
