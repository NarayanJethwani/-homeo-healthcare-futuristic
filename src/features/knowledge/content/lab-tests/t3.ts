import { KnowledgeEntity } from "../../types";

export const T3LabTest: KnowledgeEntity = {
  id: "L0010",
  slug: "t3",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "T3",
    hi: "T3",
    gu: "T3",
    mr: "T3",
    es: "T3",
    ar: "T3"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of T3 lab results.",
    hi: "T3 प्रयोगशाला परीक्षण विवरण.",
    gu: "T3 લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "T3 लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio T3.",
    ar: "الغرض السريري وتفسير نتائج اختبار T3."
  },
  content: {
    overview: "T3 is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of T3 must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["T3", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/t3",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of T3 test guidelines"]
};
