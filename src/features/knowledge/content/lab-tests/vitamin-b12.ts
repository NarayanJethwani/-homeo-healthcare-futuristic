import { KnowledgeEntity } from "../../types";

export const VitaminB12LabTest: KnowledgeEntity = {
  id: "L0008",
  slug: "vitamin-b12",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Vitamin B12",
    hi: "Vitamin B12",
    gu: "Vitamin B12",
    mr: "Vitamin B12",
    es: "Vitamin B12",
    ar: "Vitamin B12"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Vitamin B12 lab results.",
    hi: "Vitamin B12 प्रयोगशाला परीक्षण विवरण.",
    gu: "Vitamin B12 લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Vitamin B12 लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Vitamin B12.",
    ar: "الغرض السريري وتفسير نتائج اختبار Vitamin B12."
  },
  content: {
    overview: "Vitamin B12 is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Vitamin B12 must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Vitamin B12", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/vitamin-b12",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Vitamin B12 test guidelines"]
};
