import { KnowledgeEntity } from "../../types";

export const SerumCreatinineLabTest: KnowledgeEntity = {
  id: "L0017",
  slug: "serum-creatinine",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Serum Creatinine",
    hi: "सीरम क्रिएटिनिन (Serum Creatinine)",
    gu: "સીરમ ક્રિએટિનાઇન (Serum Creatinine)",
    mr: "सिरम क्रिएटीनाईन (Serum Creatinine)",
    es: "Creatinina Sérica (Serum Creatinine)",
    ar: "الكرياتينين في الدم (Serum Creatinine)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, eGFR estimation, and AKI staging for Serum Creatinine under KDIGO 2024 standards.",
    hi: "सीरम क्रिएटिनिन लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "સીરમ ક્રિએટિનાઇન ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "सिरम क्रिएटीनाईन चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y estadificación de AKI de la creatinina sérica según KDIGO 2024.",
    ar: "التفسير السريري والنطاق المرجعي للكرياتينين."
  },
  content: {
    overview: "Serum Creatinine: An end-product of creatine phosphate breakdown in skeletal muscle, filtered freely by the renal glomerulus without significant tubular reabsorption, serving as the principal biochemical surrogate for estimating Glomerular Filtration Rate (eGFR).",
    normalRange: "Adult Males: 0.7 - 1.3 mg/dL (62 - 115 umol/L); Adult Females: 0.6 - 1.1 mg/dL (53 - 97 umol/L).",
    highValues: [
      "Acute Kidney Injury (AKI) Stage 1-3 (Ischemia, Nephrotoxic Drugs, Contrast-Induced)",
      "Chronic Kidney Disease (Diabetic Nephropathy, Glomerulonephritis)",
      "Urinary Tract Obstruction (Prostatic Hyperplasia, Bilateral Ureteral Calculus)"
    ],
    lowValues: [
      "Severe Muscle Atrophy or Amputation (Reduced Creatine Pool)",
      "Malnutrition, Advanced Cirrhosis, or Pregnancy (Hyperfiltration)"
    ],
    clinicalInterpretation: "An acute increase in Serum Creatinine by >=0.3 mg/dL within 48 hours or >=1.5-fold from baseline confirms AKI; progressive elevation with oliguria (<0.5 mL/kg/hr for 6 hours) mandates immediate nephrology emergency evaluation.",
    references: [
      "CIT-0069",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0017-001",
        passage: "Serum Creatinine level is inversely related to eGFR, requiring age and sex adjustments via CKD-EPI formula for accurate renal clearance estimation.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0017-002",
        passage: "A 1.5-fold to 1.9-fold increase in Serum Creatinine above baseline establishes KDIGO Stage 1 Acute Kidney Injury.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0017-003",
        passage: "Serum Creatinine elevation >4.0 mg/dL accompanied by anuria or fluid overload requires emergency evaluation for renal replacement therapy.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0017-004",
        passage: "Homeopathic supportive care does not replace nephrotoxic drug discontinuation, volume expansion, or hemodialysis in acute renal failure.",
        citationIds: ["CIT-0023"]
      }
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
  tags: ["Serum Creatinine", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/serum-creatinine",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Serum Creatinine test guidelines"]
};
