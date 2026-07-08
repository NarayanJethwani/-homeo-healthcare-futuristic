import { KnowledgeEntity } from "../../types";

export const SerumCreatinineLabTest: KnowledgeEntity = {
  id: "L0017",
  slug: "serum-creatinine",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Serum Creatinine",
    hi: "Serum Creatinine",
    gu: "Serum Creatinine",
    mr: "Serum Creatinine",
    es: "Serum Creatinine",
    ar: "Serum Creatinine"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Serum Creatinine lab results.",
    hi: "Serum Creatinine प्रयोगशाला परीक्षण विवरण.",
    gu: "Serum Creatinine લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Serum Creatinine लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Serum Creatinine.",
    ar: "الغرض السريري وتفسير نتائج اختبار Serum Creatinine."
  },
  content: {
    overview: "Serum Creatinine is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Serum Creatinine must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Serum Creatinine", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/serum-creatinine",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Serum Creatinine test guidelines"]
};
