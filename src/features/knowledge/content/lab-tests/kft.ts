import { KnowledgeEntity } from "../../types";

export const KFTLabTest: KnowledgeEntity = {
  id: "L0013",
  slug: "kft",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Kidney Function Test (KFT / RFT)",
    hi: "गुर्दा कार्य परीक्षण (KFT / RFT)",
    gu: "કિડની ફંક્શન ટેસ્ટ (KFT / RFT)",
    mr: "मूत्रपिंड कार्य चाचणी (KFT / RFT)",
    es: "Prueba de Función Renal (KFT / RFT)",
    ar: "فحص وظائف الكلى (KFT)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, eGFR staging, and renal status evaluation for Kidney Function Test (KFT) under KDIGO 2024 standards.",
    hi: "KFT गुर्दा परीक्षण की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "KFT કિડની ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "KFT चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y evaluación de función renal según KDIGO 2024.",
    ar: "التفسير السريري والنطاق المرجعي لفحص وظائف الكلى."
  },
  content: {
    overview: "Kidney Function Test (KFT / Renal Function Test): A biochemical blood and urine panel including Serum Creatinine, Blood Urea Nitrogen (BUN), eGFR, Serum Electrolytes, and Uric Acid to assess glomerular filtration, tubular reabsorption, and nitrogenous waste excretion.",
    normalRange: "Serum Creatinine: 0.6 - 1.2 mg/dL; BUN: 7 - 20 mg/dL; eGFR: >90 mL/min/1.73m2; BUN/Creatinine Ratio: 10:1 to 20:1.",
    highValues: [
      "Acute Kidney Injury (AKI) or Chronic Kidney Disease (CKD Stages 1-5)",
      "Prerenal Azotemia (Dehydration, Severe Heart Failure, Volume Depletion)",
      "Postrenal Obstruction (Prostatic Hypertrophy, Nephrolithiasis, Tumor)"
    ],
    lowValues: [
      "Low Serum Creatinine: Severe muscle atrophy, malnutrition, or advanced liver disease",
      "Low BUN: Severe hepatic failure or protein restriction",
      "Increased eGFR (Glomerular Hyperfiltration in Early Diabetes)"
    ],
    clinicalInterpretation: "KFT evaluation requires calculating eGFR using CKD-EPI 2021 equations; acute creatinine elevation (>0.3 mg/dL within 48 hours or >1.5-fold baseline) confirms AKI requiring urgent nephrology triage and etiology identification.",
    references: [
      "CIT-0069",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0013-001",
        passage: "Acute elevation in Serum Creatinine by 0.3 mg/dL or more within 48 hours defines Acute Kidney Injury (AKI) per KDIGO criteria.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0013-002",
        passage: "Persistent eGFR below 60 mL/min/1.73m2 for more than 3 months establishes Chronic Kidney Disease (CKD).",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0013-003",
        passage: "AKI accompanied by severe hyperkalemia (>6.5 mEq/L) or uremic pericarditis demands emergency hemodialysis consultation.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0013-004",
        passage: "Homeopathic supportive care does not replace renal replacement therapy (dialysis) or emergency management of acute uremic encephalopathy.",
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
  tags: ["KFT", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/kft",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of KFT test guidelines"]
};
