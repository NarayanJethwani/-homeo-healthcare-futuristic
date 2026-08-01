import { KnowledgeEntity } from "../../types";

export const HbA1cLabTest: KnowledgeEntity = {
  id: "L0005",
  slug: "hba1c",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Glycated Hemoglobin (HbA1c / A1C)",
    hi: "ग्लाइकेटेड हीमोग्लोबिन (HbA1c / A1C)",
    gu: "ગ્લાયકેટેડ હિમોગ્લોબિન (HbA1c / A1C)",
    mr: "ग्लाइकेटेड हिमोग्लोबिन (HbA1c / A1C)",
    es: "Hemoglobina Glicada (HbA1c / A1C)",
    ar: "الهيموجلوبين السكري (HbA1c)"
  },
  summary: {
    en: "Clinical interpretation, ADA diagnostic criteria, 3-month average glycemic index, and prediabetes thresholds for Glycated Hemoglobin (HbA1c).",
    hi: "HbA1c परीक्षण की नैदानिक समझ, 3 महीने का औसत रक्त शर्करा स्तर और नैदानिक सीमाएँ.",
    gu: "HbA1c લેબોરેટરી ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "HbA1c लॅब टेस्टची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y criterios diagnósticos de la hemoglobina glicada según la ADA.",
    ar: "التفسير السريري والنطاق المرجعي للهيموجلوبين السكري."
  },
  content: {
    overview: "Glycated Hemoglobin (HbA1c / A1C): Quantitative measure of non-enzymatic glycation of the N-terminal valine residue of the hemoglobin beta chain, reflecting mean circulating blood glucose over the preceding 2 to 3 months (erythrocyte lifespan).",
    normalRange: "Normal Non-Diabetic: <5.7% (<39 mmol/mol); Prediabetes Threshold: 5.7%–6.4% (39–47 mmol/mol); Diabetes Mellitus Diagnostic Threshold: ≥6.5% (≥48 mmol/mol) confirmed on repeat testing; Target Glycemic Control in Diabetes: <7.0% (<53 mmol/mol).",
    highValues: [
      "Uncontrolled Type 1 or Type 2 Diabetes Mellitus (HbA1c >9.0% indicates severe chronic hyperglycemia)",
      "Prediabetes / Impaired Glucose Tolerance",
      "False Elevations: Iron Deficiency Anemia, Asplenia, Alcoholism, Hemoglobinopathies (HbS, HbC in certain assays)"
    ],
    lowValues: [
      "False Lows / Underestimation: Hemolytic Anemia, Acute Hemorrhage, Recent Blood Transfusion, Pregnancy (high RBC turnover)",
      "Recurrent Severe Hypoglycemia in treated diabetes"
    ],
    clinicalInterpretation: "HbA1c ≥6.5% confirms Diabetes Mellitus; HbA1c >9.0% warrants intensification of antihyperglycemic pharmacotherapy to prevent microvascular (retinopathy, nephropathy, neuropathy) and macrovascular complications.",
    references: [
      "CIT-0070",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0005-001",
        passage: "ADA 2026 guidelines specify an HbA1c threshold of ≥6.5% (48 mmol/mol) as a diagnostic criterion for Diabetes Mellitus.",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0005-002",
        passage: "HbA1c levels between 5.7% and 6.4% identify prediabetes, signaling high risk for future vascular disease and progression to clinical diabetes.",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0005-003",
        passage: "Conditions that alter red blood cell turnover (e.g., hemolytic anemia, pregnancy, recent transfusion) cause invalid HbA1c readings, requiring fructosamine or continuous glucose monitoring (CGM).",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0005-004",
        passage: "Homeopathic supportive management does not eliminate the necessity for routine HbA1c monitoring every 3 to 6 months in diagnosed diabetic patients.",
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
  tags: ["HbA1c", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/hba1c",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of HbA1c test guidelines"]
};
