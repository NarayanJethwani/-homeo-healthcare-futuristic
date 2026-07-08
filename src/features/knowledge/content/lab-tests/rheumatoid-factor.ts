import { KnowledgeEntity } from "../../types";

export const RheumatoidFactorLabTest: KnowledgeEntity = {
  id: "L0023",
  slug: "rheumatoid-factor",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Rheumatoid Factor",
    hi: "Rheumatoid Factor",
    gu: "Rheumatoid Factor",
    mr: "Rheumatoid Factor",
    es: "Rheumatoid Factor",
    ar: "Rheumatoid Factor"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Rheumatoid Factor lab results.",
    hi: "Rheumatoid Factor प्रयोगशाला परीक्षण विवरण.",
    gu: "Rheumatoid Factor લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Rheumatoid Factor लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Rheumatoid Factor.",
    ar: "الغرض السريري وتفسير نتائج اختبار Rheumatoid Factor."
  },
  content: {
    overview: "Rheumatoid Factor is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Rheumatoid Factor must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Rheumatoid Factor", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/rheumatoid-factor",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Rheumatoid Factor test guidelines"]
};
