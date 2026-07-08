import { KnowledgeEntity } from "../../types";

export const CRPLabTest: KnowledgeEntity = {
  id: "L0004",
  slug: "crp",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "CRP",
    hi: "CRP",
    gu: "CRP",
    mr: "CRP",
    es: "CRP",
    ar: "CRP"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of CRP lab results.",
    hi: "CRP प्रयोगशाला परीक्षण विवरण.",
    gu: "CRP લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "CRP लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio CRP.",
    ar: "الغرض السريري وتفسير نتائج اختبار CRP."
  },
  content: {
  "overview": "CRP: A general laboratory screening parameter or basic metabolic marker used to assess baseline physiological homeostasis and metabolic efficiency.",
  "normalRange": "ESR: < 20 mm/hr; Blood Glucose: 70-99 mg/dL; Serum Creatinine: 0.6-1.2 mg/dL.",
  "highValues": [
    "Systemic inflammatory baseline (high ESR)",
    "Metabolic intolerance or early diabetes (high glucose)",
    "Impaired kidney function (high creatinine)"
  ],
  "lowValues": [
    "Anemia or low muscle mass",
    "Hypoglycemia",
    "Nutritional deficiencies"
  ],
  "clinicalInterpretation": "CRP evaluation: Elevated inflammatory markers (ESR, CRP) suggest systemic activity needing further investigation. Blood glucose shifts require evaluation of insulin sensitivity and glycemic control.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What is a constitutional remedy in homeopathy?",
      "answer": "A constitutional remedy is a deep-acting medicine selected to match a patient's overall physical, mental, and emotional makeup, rather than just treating a single local symptom."
    },
    {
      "question": "Why does the homeopath ask so many detailed questions?",
      "answer": "To find the individualized remedy, the homeopath must understand all unique characteristics—such as sleep patterns, thermal sensitivities, food cravings, and emotional triggers."
    },
    {
      "question": "How should homeopathic remedies be stored?",
      "answer": "Remedies should be stored in a cool, dry place, away from direct sunlight, strong odors (like camphor, perfumes), and electronic devices to maintain their potency."
    }
  ]
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
  tags: ["CRP", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/crp",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of CRP test guidelines"]
};
