import { KnowledgeEntity } from "../../types";

export const AbdominalPainSymptom: KnowledgeEntity = {
  id: "S0012",
  slug: "abdominal-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Abdominal Pain",
    hi: "Abdominal Pain",
    gu: "Abdominal Pain",
    mr: "Abdominal Pain",
    es: "Abdominal Pain",
    ar: "Abdominal Pain"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Abdominal Pain.",
    hi: "Abdominal Pain के लक्षण की नैदानिक समझ.",
    gu: "Abdominal Pain ના લક્ષણ ની સમજણ.",
    mr: "Abdominal Pain चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Abdominal Pain.",
    ar: "التعريف السريري والأهمية لـ Abdominal Pain."
  },
  content: {
    definition: "Abdominal Pain represents a functional or sensory manifestation indicating systemic reaction or localized pathological change.",
    clinicalMeaning: "In clinical practice, monitoring Abdominal Pain helps evaluate disease progress and individual metabolic response.",
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
  tags: ["Abdominal Pain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/abdominal-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Abdominal Pain symptom profile"]
};
