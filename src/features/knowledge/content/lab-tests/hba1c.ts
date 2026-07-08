import { KnowledgeEntity } from "../../types";

export const HbA1cLabTest: KnowledgeEntity = {
  id: "L0005",
  slug: "hba1c",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "HbA1c",
    hi: "HbA1c",
    gu: "HbA1c",
    mr: "HbA1c",
    es: "HbA1c",
    ar: "HbA1c"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of HbA1c lab results.",
    hi: "HbA1c प्रयोगशाला परीक्षण विवरण.",
    gu: "HbA1c લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "HbA1c लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio HbA1c.",
    ar: "الغرض السريري وتفسير نتائج اختبار HbA1c."
  },
  content: {
    overview: "HbA1c is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of HbA1c must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["HbA1c", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/hba1c",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of HbA1c test guidelines"]
};
