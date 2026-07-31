import { KnowledgeEntity } from "../../types";

export const FastingBloodSugarLabTest: KnowledgeEntity = {
  id: "L0015",
  slug: "fasting-blood-sugar",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Fasting Blood Sugar (FBS / FPG)",
    hi: "फास्टिंग ब्लड शुगर (FBS / FPG)",
    gu: "ફાસ્ટિંગ બ્લડ સુગર (FBS / FPG)",
    mr: "फास्टिंग ब्लड शुगर (FBS / FPG)",
    es: "Glucosa en Ayunas (Glicemia en Ayunas / FBS)",
    ar: "سكر الدم الصائم (FBS)"
  },
  summary: {
    en: "Clinical interpretation, ADA diagnostic thresholds, prediabetes identification, and diabetic crisis evaluation for Fasting Plasma Glucose (FPG / FBS).",
    hi: "फास्टिंग ब्लड शुगर (FBS) परीक्षण की नैदानिक समझ और मधुमेह नैदानिक सीमाएँ.",
    gu: "ફાસ્ટિંગ બ્લડ સુગર લેબોરેટરી ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "फास्टિંગ ब्लड शुगर लॅब टेस्टची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y umbrales diagnósticos de la glucosa en ayunas según la ADA.",
    ar: "التفسير السريري والنطاق المرجعي لسكر الدم الصائم."
  },
  content: {
    overview: "Fasting Blood Sugar (Fasting Plasma Glucose / FPG): Quantitative measurement of blood venous plasma glucose concentration following a minimum 8-hour overnight caloric fast, serving as a primary diagnostic tool for diabetes mellitus and impaired fasting glucose.",
    normalRange: "Normal: 70–99 mg/dL (3.9–5.5 mmol/L); Impaired Fasting Glucose (Prediabetes): 100–125 mg/dL (5.6–6.9 mmol/L); Diabetes Mellitus Diagnostic Threshold: ≥126 mg/dL (≥7.0 mmol/L) confirmed on repeat testing.",
    highValues: [
      "Type 1 and Type 2 Diabetes Mellitus, Gestational Diabetes Mellitus",
      "Diabetic Ketoacidosis (DKA), Hyperosmolar Hyperglycemic State (HHS - glucose >600 mg/dL)",
      "Cushing's Syndrome, Acromegaly, Acute Pancreatitis, Stress Hyperglycemia (Sepsis, Trauma, Steroid Therapy)"
    ],
    lowValues: [
      "Level 1 Hypoglycemia (54-70 mg/dL), Level 2 Severe Hypoglycemia (<54 mg/dL)",
      "Exogenous Insulin or Sulfonylurea Overdose, Insulinoma, Severe Hepatic Failure, Adrenal Insufficiency"
    ],
    clinicalInterpretation: "Fasting glucose ≥126 mg/dL on two separate occasions confirms Diabetes Mellitus; extreme hyperglycemia (>300 mg/dL) with Kussmaul breathing or altered mental status demands emergency DKA/HHS management.",
    references: [
      "CIT-0070",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0004-001",
        passage: "ADA guidelines define Fasting Plasma Glucose (FPG) ≥126 mg/dL (7.0 mmol/L) after an 8-hour fast as a diagnostic criterion for Diabetes Mellitus.",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0004-002",
        passage: "Fasting glucose levels between 100 and 125 mg/dL represent Impaired Fasting Glucose (IFG), placing individuals at high risk for future type 2 diabetes development.",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0004-003",
        passage: "Severe hypoglycemia (FBS <54 mg/dL) causes neuroglycopenia, requiring immediate fast-acting oral glucose or parenteral dextrose/glucagon.",
        citationIds: ["CIT-0070"]
      },
      {
        claimId: "CLM-L0004-004",
        passage: "Homeopathic dietary and constitutional care (e.g., Syzygium Jambolanum, Gymnema) does not replace emergency insulin therapy in DKA or severe symptomatic hyperglycemia.",
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
  tags: ["Fasting Blood Sugar", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/fasting-blood-sugar",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Fasting Blood Sugar test guidelines"]
};
