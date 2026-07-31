import { KnowledgeEntity } from "../../types";

export const PostprandialBloodSugarLabTest: KnowledgeEntity = {
  id: "L0016",
  slug: "postprandial-blood-sugar",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Postprandial Blood Sugar (PPBS)",
    hi: "भोजन के बाद रक्त शर्करा (PPBS)",
    gu: "જમ્યા પછીની બ્લડ શુગર (PPBS)",
    mr: "जेवणानंतरची रक्त शर्करा (PPBS)",
    es: "Glucosa Postprandial (PPBS)",
    ar: "سكر الدم بعد الأكل (PPBS)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and glycemic control evaluation for Postprandial Blood Sugar (PPBS) under ADA 2024 standards.",
    hi: "PPBS रक्त शर्करा परीक्षण की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "PPBS ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "PPBS चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y control glucémico postprandial según ADA 2024.",
    ar: "التفسير السريري والنطاق المرجعي لسكر الدم بعد الأكل."
  },
  content: {
    overview: "Postprandial Blood Sugar (PPBS): Measurement of venous plasma glucose concentration exactly 2 hours after the start of a standardized meal (or 75g oral glucose load) to evaluate post-meal glycemic spikes and first-phase insulin response.",
    normalRange: "Normal: <140 mg/dL (7.8 mmol/L); Impaired Glucose Tolerance (Prediabetes): 140 - 199 mg/dL; Diabetes Mellitus: >=200 mg/dL (11.1 mmol/L).",
    highValues: [
      "Diabetes Mellitus (Type 1 or Type 2) or Impaired Glucose Tolerance",
      "Gestational Diabetes Mellitus (GDM) or Cushing's Syndrome",
      "Diabetic Ketoacidosis (DKA) or Hyperosmolar Hyperglycemic State (HHS)"
    ],
    lowValues: [
      "Reactive Hypoglycemia (Postprandial Hyperinsulinemia)",
      "Exogenous Insulin or Sulfonylurea Overdose",
      "Adrenal Insufficiency or Post-Gastric Bypass Dumping Syndrome"
    ],
    clinicalInterpretation: "PPBS >= 200 mg/dL with classic symptoms (polyuria, polydipsia) confirms Diabetes Mellitus per ADA 2024 criteria; acute glucose elevation >300 mg/dL with ketonuria or altered sensorium demands emergency DKA / HHS evaluation.",
    references: [
      "CIT-0070",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0016-001",
        passage: "A 2-hour postprandial venous plasma glucose level of 200 mg/dL or greater confirms the diagnostic criteria for Diabetes Mellitus.",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0016-002",
        passage: "Target 2-hour postprandial blood glucose for non-pregnant diabetic adults is less than 180 mg/dL according to ADA standards.",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0016-003",
        passage: "Blood glucose >300 mg/dL accompanied by arterial acidosis (pH <7.30), Kussmaul breathing, and urine ketones indicates Diabetic Ketoacidosis (DKA).",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0016-004",
        passage: "Homeopathic supportive management does not replace insulin therapy or emergency IV fluid resuscitation in DKA or severe hyperglycemic crisis.",
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
  tags: ["Postprandial Blood Sugar", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/postprandial-blood-sugar",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Postprandial Blood Sugar test guidelines"]
};
