import { KnowledgeEntity } from "../../types";

export const SerumSodiumLabTest: KnowledgeEntity = {
  id: "L0030",
  slug: "serum-sodium",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Serum Sodium",
    hi: "Serum Sodium",
    gu: "Serum Sodium",
    mr: "Serum Sodium",
    es: "Serum Sodium",
    ar: "Serum Sodium"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Serum Sodium lab results.",
    hi: "Serum Sodium प्रयोगशाला परीक्षण विवरण.",
    gu: "Serum Sodium લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Serum Sodium लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Serum Sodium.",
    ar: "الغرض السريري وتفسير نتائج اختبار Serum Sodium."
  },
  content: {
  "overview": "SERUM SODIUM: A renal panel, urinalysis parameter, or urine microalbumin index used to evaluate kidney filtration capacity, urinary tract health, or solute output.",
  "normalRange": "Varies by laboratory. Typically defined within reference intervals.",
  "highValues": [
    "Early glomerular filtration damage (high microalbumin)",
    "Active bacterial urinary tract infection (high WBC & positive culture)",
    "Hematuria indicating stones or trauma (high RBC)"
  ],
  "lowValues": [
    "Normal renal filtration state",
    "Absence of active infection"
  ],
  "clinicalInterpretation": "SERUM SODIUM evaluation: Elevated microalbuminuria (>30 mg/g) is a marker of early diabetic or hypertensive nephropathy. Positive nitrites and high WBC counts in urinalysis confirm UTI, needing culture confirmation.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What are the common causes of recurring burning urination?",
      "answer": "Common causes include urinary tract infections (UTIs), bladder irritation (from caffeine, spices), interstitial cystitis, or early signs of renal sand (gravel)."
    },
    {
      "question": "How does microalbuminuria reflect kidney health?",
      "answer": "Microalbuminuria is the presence of small amounts of albumin in the urine, indicating early glomerular capillary strain, typically associated with diabetes or hypertension."
    },
    {
      "question": "Can homeopathy support bladder control and urinary health?",
      "answer": "Yes. Homeopathic remedies help soothe bladder lining irritation, support detrusor muscle tone, and manage chronic urinary susceptibility under medical supervision."
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
  tags: ["Serum Sodium", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/serum-sodium",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Serum Sodium test guidelines"]
};
