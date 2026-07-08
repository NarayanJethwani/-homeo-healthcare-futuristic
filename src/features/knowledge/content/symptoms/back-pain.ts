import { KnowledgeEntity } from "../../types";

export const BackPainSymptom: KnowledgeEntity = {
  id: "S0013",
  slug: "back-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Back Pain",
    hi: "Back Pain",
    gu: "Back Pain",
    mr: "Back Pain",
    es: "Back Pain",
    ar: "Back Pain"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Back Pain.",
    hi: "Back Pain के लक्षण की नैदानिक समझ.",
    gu: "Back Pain ના લક્ષણ ની સમજણ.",
    mr: "Back Pain चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Back Pain.",
    ar: "التعريف السريري والأهمية لـ Back Pain."
  },
  content: {
    definition: "Back Pain represents a functional or sensory manifestation indicating systemic reaction or localized pathological change.",
    clinicalMeaning: "In clinical practice, monitoring Back Pain helps evaluate disease progress and individual metabolic response.",
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
  tags: ["Back Pain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/back-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Back Pain symptom profile"]
};
