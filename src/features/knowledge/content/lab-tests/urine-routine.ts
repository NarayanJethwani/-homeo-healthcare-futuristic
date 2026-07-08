import { KnowledgeEntity } from "../../types";

export const UrineRoutineLabTest: KnowledgeEntity = {
  id: "L0014",
  slug: "urine-routine",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Urine Routine",
    hi: "Urine Routine",
    gu: "Urine Routine",
    mr: "Urine Routine",
    es: "Urine Routine",
    ar: "Urine Routine"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Urine Routine lab results.",
    hi: "Urine Routine प्रयोगशाला परीक्षण विवरण.",
    gu: "Urine Routine લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Urine Routine लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Urine Routine.",
    ar: "الغرض السريري وتفسير نتائج اختبار Urine Routine."
  },
  content: {
    overview: "Urine Routine is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Urine Routine must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Urine Routine", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/urine-routine",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Urine Routine test guidelines"]
};
