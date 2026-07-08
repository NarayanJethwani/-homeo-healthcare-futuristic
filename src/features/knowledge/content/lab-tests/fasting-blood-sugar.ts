import { KnowledgeEntity } from "../../types";

export const FastingBloodSugarLabTest: KnowledgeEntity = {
  id: "L0015",
  slug: "fasting-blood-sugar",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Fasting Blood Sugar",
    hi: "Fasting Blood Sugar",
    gu: "Fasting Blood Sugar",
    mr: "Fasting Blood Sugar",
    es: "Fasting Blood Sugar",
    ar: "Fasting Blood Sugar"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Fasting Blood Sugar lab results.",
    hi: "Fasting Blood Sugar प्रयोगशाला परीक्षण विवरण.",
    gu: "Fasting Blood Sugar લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Fasting Blood Sugar लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Fasting Blood Sugar.",
    ar: "الغرض السريري وتفسير نتائج اختبار Fasting Blood Sugar."
  },
  content: {
    overview: "Fasting Blood Sugar is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Fasting Blood Sugar must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
    references: ["CIT-0001", "CIT-0004"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Pathology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Fasting Blood Sugar", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/fasting-blood-sugar",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Fasting Blood Sugar test guidelines"]
};
