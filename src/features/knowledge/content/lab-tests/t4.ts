import { KnowledgeEntity } from "../../types";

export const T4LabTest: KnowledgeEntity = {
  id: "L0011",
  slug: "t4",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "T4",
    hi: "T4",
    gu: "T4",
    mr: "T4",
    es: "T4",
    ar: "T4"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of T4 lab results.",
    hi: "T4 प्रयोगशाला परीक्षण विवरण.",
    gu: "T4 લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "T4 लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio T4.",
    ar: "الغرض السريري وتفسير نتائج اختبار T4."
  },
  content: {
    overview: "T4 is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of T4 must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["T4", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/t4",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of T4 test guidelines"]
};
