import { KnowledgeEntity } from "../../types";

export const AntiCCPLabTest: KnowledgeEntity = {
  id: "L0024",
  slug: "anti-ccp",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Anti-CCP",
    hi: "Anti-CCP",
    gu: "Anti-CCP",
    mr: "Anti-CCP",
    es: "Anti-CCP",
    ar: "Anti-CCP"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Anti-CCP lab results.",
    hi: "Anti-CCP प्रयोगशाला परीक्षण विवरण.",
    gu: "Anti-CCP લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Anti-CCP लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Anti-CCP.",
    ar: "الغرض السريري وتفسير نتائج اختبار Anti-CCP."
  },
  content: {
    overview: "Anti-CCP is a routine clinical investigation used to identify physiological fluctuations, metabolic disorders, or system inflammation.",
    normalRange: "Varies by laboratory. Typically defined within reference intervals.",
    highValues: [
      "Indicates systemic reaction, infection, or metabolic hyper-activity.",
      "Requires medical correlation with active clinical symptoms."
    ],
    lowValues: [
      "Indicates deficiency, metabolic hypo-activity, or sluggish organ function.",
      "Requires clinician evaluation of baseline patient data."
    ],
    clinicalInterpretation: "Results of Anti-CCP must be interpreted in conjunction with patient symptoms and constitutional profiles rather than in isolation.",
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
  tags: ["Anti-CCP", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/anti-ccp",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Anti-CCP test guidelines"]
};
