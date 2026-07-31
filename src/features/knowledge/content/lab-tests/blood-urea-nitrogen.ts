import { KnowledgeEntity } from "../../types";

export const BloodUreaNitrogenLabTest: KnowledgeEntity = {
  id: "L0018",
  slug: "blood-urea-nitrogen",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Blood Urea Nitrogen (BUN)",
    hi: "ब्लड यूरिया नाइट्रोजन (BUN)",
    gu: "બ્લડ યુરિયા નાઇટ્રોજન (BUN)",
    mr: "ब्लड युरिया नायट्रोजन (BUN)",
    es: "Nitrógeno Ureico en Sangre (BUN)",
    ar: "نيتروجين يوريا الدم (BUN)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and BUN/Creatinine ratio evaluation under KDIGO 2024 standards.",
    hi: "BUN लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "BUN ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "BUN चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y evaluación del nitrógeno ureico sérico según KDIGO 2024.",
    ar: "التفسير السريري والنطاق المرجعي لليوريا في الدم."
  },
  content: {
    overview: "Blood Urea Nitrogen (BUN): Biochemical measurement of nitrogen in the form of urea, the primary waste product of hepatic protein catabolism, cleared by glomerular filtration and variable passive renal tubular reabsorption dependent on hydration state.",
    normalRange: "Adults: 7 - 20 mg/dL (2.5 - 7.1 mmol/L); BUN/Creatinine Ratio: 10:1 to 20:1.",
    highValues: [
      "Prerenal Azotemia (BUN/Creatinine >20:1): Dehydration, Gastrointestinal Hemorrhage, High Protein Diet",
      "Intrinsic Renal Failure (BUN/Creatinine 10:1 to 15:1): Glomerulonephritis, Acute Tubular Necrosis",
      "Postrenal Azotemia (BUN/Creatinine >20:1): Urinary Tract Obstruction"
    ],
    lowValues: [
      "Severe Hepatic Failure (Impaired Urea Synthesis)",
      "Malnutrition, Protein Starvation, or Syndrome of Inappropriate ADH (SIADH)",
      "Normal Pregnancy (Plasma Volume Expansion and Increased eGFR)"
    ],
    clinicalInterpretation: "Elevated BUN >80-100 mg/dL accompanied by uremic flap (asterixis), pericardial friction rub, or lethargy indicates Uremic Syndrome demanding urgent hemodialysis.",
    references: [
      "CIT-0069",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0018-001",
        passage: "BUN to Serum Creatinine ratio exceeding 20:1 strongly indicates prerenal azotemia due to volume depletion, congestive heart failure, or upper GI bleeding.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0018-002",
        passage: "Severe upper gastrointestinal bleeding causes disproportionate BUN elevation due to bacterial digestion and absorption of blood proteins.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0018-003",
        passage: "BUN levels >100 mg/dL accompanied by confusion and pericarditis represent severe uremia requiring emergency dialysis.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0018-004",
        passage: "Homeopathic supportive care does not replace emergency rehydration, blood transfusion, or renal replacement therapy in acute azotemia.",
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
  tags: ["Blood Urea Nitrogen", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/blood-urea-nitrogen",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Blood Urea Nitrogen test guidelines"]
};
