import { KnowledgeEntity } from "../../types";

export const CompleteUrineAnalysisLabTest: KnowledgeEntity = {
  id: "L0025",
  slug: "complete-urine-analysis",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Complete Urine Analysis",
    hi: "Complete Urine Analysis",
    gu: "Complete Urine Analysis",
    mr: "Complete Urine Analysis",
    es: "Complete Urine Analysis",
    ar: "Complete Urine Analysis"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Complete Urine Analysis lab results.",
    hi: "Complete Urine Analysis प्रयोगशाला परीक्षण विवरण.",
    gu: "Complete Urine Analysis લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Complete Urine Analysis लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Complete Urine Analysis.",
    ar: "الغرض السريري وتفسير نتائج اختبار Complete Urine Analysis."
  },
  content: {
    overview: "Complete Urine Analysis is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Complete Urine Analysis must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Complete Urine Analysis", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/complete-urine-analysis",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Complete Urine Analysis test guidelines"]
};
