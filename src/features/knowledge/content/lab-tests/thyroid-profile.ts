import { KnowledgeEntity } from "../../types";

export const ThyroidProfileLabTest: KnowledgeEntity = {
  id: "L0022",
  slug: "thyroid-profile",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Thyroid Profile",
    hi: "Thyroid Profile",
    gu: "Thyroid Profile",
    mr: "Thyroid Profile",
    es: "Thyroid Profile",
    ar: "Thyroid Profile"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Thyroid Profile lab results.",
    hi: "Thyroid Profile प्रयोगशाला परीक्षण विवरण.",
    gu: "Thyroid Profile લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Thyroid Profile लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Thyroid Profile.",
    ar: "الغرض السريري وتفسير نتائج اختبار Thyroid Profile."
  },
  content: {
    overview: "Thyroid Profile is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Thyroid Profile must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Thyroid Profile", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/thyroid-profile",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Thyroid Profile test guidelines"]
};
