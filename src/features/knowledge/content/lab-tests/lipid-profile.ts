import { KnowledgeEntity } from "../../types";

export const LipidProfileLabTest: KnowledgeEntity = {
  id: "L0006",
  slug: "lipid-profile",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Lipid Profile (Lipid Panel)",
    hi: "लिपिड प्रोफाइल (Lipid Profile)",
    gu: "લિપિડ પ્રોફાઇલ (Lipid Profile)",
    mr: "लिपिड प्रोफाईल (Lipid Profile)",
    es: "Perfil Lipídico / Panel de Lípidos (Lipid Profile)",
    ar: "فحص الدهون (Lipid Profile)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and atherosclerotic risk stratification for Lipid Profile under NLA 2022 standards.",
    hi: "लिपिड प्रोफाइल लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "લિપિડ પ્રોફાઇલ ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "लिपिड प्रोफाईल चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y estratificación de riesgo cardiovascular del perfil lipídico.",
    ar: "التفسير السريري والنطاق المرجعي لفحص الدهون."
  },
  content: {
    overview: "Lipid Profile: A comprehensive serum biochemical panel measuring Total Cholesterol, High-Density Lipoprotein Cholesterol (HDL-C), Low-Density Lipoprotein Cholesterol (LDL-C), Very Low-Density Lipoprotein Cholesterol (VLDL-C), and Triglycerides to evaluate atherosclerotic cardiovascular disease (ASCVD) risk.",
    normalRange: "Total Cholesterol: <200 mg/dL; LDL-C: <100 mg/dL; HDL-C: >40 mg/dL (men), >50 mg/dL (women); Triglycerides: <150 mg/dL.",
    highValues: [
      "Elevated Total Cholesterol and LDL-C: Increased atherogenic plaque formation and CAD risk",
      "Severe Hypertriglyceridemia (>500-1000 mg/dL): High risk for Acute Pancreatitis",
      "Familial Hypercholesterolemia or Metabolic Syndrome"
    ],
    lowValues: [
      "Low HDL-C (<40 mg/dL): Independent risk factor for coronary artery disease",
      "Hypobetalipoproteinemia or severe malabsorption",
      "Hyperthyroidism or chronic hepatic insufficiency"
    ],
    clinicalInterpretation: "Lipid Profile interpretation requires integrating LDL-C levels with 10-year ASCVD risk estimators (AHA/ACC risk score); extreme triglyceride elevations (>500 mg/dL) mandate immediate triglyceride-lowering therapy to prevent acute pancreatitis.",
    references: [
      "CIT-0067",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0006-001",
        passage: "Low-Density Lipoprotein Cholesterol (LDL-C) serves as the primary therapeutic target for reducing atherogenic cardiovascular risk.",
        citationIds: ["CIT-0067"]
      },
      {
        claimId: "CLM-L0006-002",
        passage: "Severe hypertriglyceridemia exceeding 500 mg/dL requires prompt medical management to prevent acute hypertriglyceridemic pancreatitis.",
        citationIds: ["CIT-0067"]
      },
      {
        claimId: "CLM-L0006-003",
        passage: "Fasting lipid panels should be performed after a 9 to 12 hour fast for accurate triglyceride and VLDL-C calculation.",
        citationIds: ["CIT-0067"]
      },
      {
        claimId: "CLM-L0006-004",
        passage: "Homeopathic dietary support does not substitute for lipid-lowering medical therapy in familial hypercholesterolemia or high-risk ASCVD.",
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
  tags: ["Lipid Profile", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/lipid-profile",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Lipid Profile test guidelines"]
};
