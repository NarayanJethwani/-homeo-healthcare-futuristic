import { KnowledgeEntity } from "../../types";

export const LipidProfileLabTest: KnowledgeEntity = {
  id: "L0006",
  slug: "lipid-profile",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Lipid Profile",
    hi: "Lipid Profile",
    gu: "Lipid Profile",
    mr: "Lipid Profile",
    es: "Lipid Profile",
    ar: "Lipid Profile"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Lipid Profile lab results.",
    hi: "Lipid Profile प्रयोगशाला परीक्षण विवरण.",
    gu: "Lipid Profile લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Lipid Profile लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Lipid Profile.",
    ar: "الغرض السريري وتفسير نتائج اختبار Lipid Profile."
  },
  content: {
    overview: "Lipid Profile is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Lipid Profile must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Lipid Profile", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/lipid-profile",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Lipid Profile test guidelines"]
};
