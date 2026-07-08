import { KnowledgeEntity } from "../../types";

export const VitaminDLabTest: KnowledgeEntity = {
  id: "L0007",
  slug: "vitamin-d",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Vitamin D",
    hi: "Vitamin D",
    gu: "Vitamin D",
    mr: "Vitamin D",
    es: "Vitamin D",
    ar: "Vitamin D"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Vitamin D lab results.",
    hi: "Vitamin D प्रयोगशाला परीक्षण विवरण.",
    gu: "Vitamin D લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Vitamin D लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Vitamin D.",
    ar: "الغرض السريري وتفسير نتائج اختبار Vitamin D."
  },
  content: {
    overview: "Vitamin D is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Vitamin D must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Vitamin D", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/vitamin-d",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Vitamin D test guidelines"]
};
