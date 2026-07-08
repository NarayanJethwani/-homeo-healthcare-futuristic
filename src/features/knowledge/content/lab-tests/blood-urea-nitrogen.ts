import { KnowledgeEntity } from "../../types";

export const BloodUreaNitrogenLabTest: KnowledgeEntity = {
  id: "L0018",
  slug: "blood-urea-nitrogen",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Blood Urea Nitrogen",
    hi: "Blood Urea Nitrogen",
    gu: "Blood Urea Nitrogen",
    mr: "Blood Urea Nitrogen",
    es: "Blood Urea Nitrogen",
    ar: "Blood Urea Nitrogen"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Blood Urea Nitrogen lab results.",
    hi: "Blood Urea Nitrogen प्रयोगशाला परीक्षण विवरण.",
    gu: "Blood Urea Nitrogen લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Blood Urea Nitrogen लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Blood Urea Nitrogen.",
    ar: "الغرض السريري وتفسير نتائج اختبار Blood Urea Nitrogen."
  },
  content: {
    overview: "Blood Urea Nitrogen is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Blood Urea Nitrogen must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Blood Urea Nitrogen", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/blood-urea-nitrogen",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Blood Urea Nitrogen test guidelines"]
};
