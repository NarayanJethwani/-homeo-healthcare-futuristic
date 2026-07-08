import { KnowledgeEntity } from "../../types";

export const KFTLabTest: KnowledgeEntity = {
  id: "L0013",
  slug: "kft",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "KFT",
    hi: "KFT",
    gu: "KFT",
    mr: "KFT",
    es: "KFT",
    ar: "KFT"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of KFT lab results.",
    hi: "KFT प्रयोगशाला परीक्षण विवरण.",
    gu: "KFT લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "KFT लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio KFT.",
    ar: "الغرض السريري وتفسير نتائج اختبار KFT."
  },
  content: {
    overview: "KFT is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of KFT must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["KFT", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/kft",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of KFT test guidelines"]
};
