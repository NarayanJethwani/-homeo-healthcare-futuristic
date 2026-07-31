import { KnowledgeEntity } from "../../types";

export const DiabetesMellitusDisease: KnowledgeEntity = {
  id: "D0010",
  slug: "diabetes-mellitus",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Diabetes Mellitus",
    hi: "मधुमेह (Diabetes Mellitus)",
    gu: "ડાયાબિટીસ મેલીટસ (Diabetes Mellitus)",
    mr: "मधुमेह (Diabetes Mellitus)",
    es: "Diabetes Mellitus",
    ar: "داء السكري",
  },
  summary: {
    en: "An authoritative clinical profile of Diabetes Mellitus covering ADA 2024 diagnostic criteria (HbA1c ≥6.5%), microvascular and macrovascular complications, DKA/HHS and severe hypoglycemia emergency red flags, and insulin non-discontinuation boundaries.",
    hi: "मधुमेह का एडीए 2024 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ડાયાબિટીસનું ADA 2024 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "मधुमेहाचे ADA 2024 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Diabetes Mellitus según los criterios ADA 2024 y límites de emergencia.",
    ar: "دليل سريري موثوق لداء السكري وفقًا لمعايير ADA 2024 وحدود السلامة.",
  },
  content: {
    overview:
      "Diabetes mellitus is a metabolic disorder characterized by chronic hyperglycemia resulting from defects in insulin secretion, insulin action, or both [D0010-KEYNOTES, CIT-0040]. It is diagnosed by fasting plasma glucose ≥126 mg/dL, 2-hour OGTT ≥200 mg/dL, or HbA1c ≥6.5%.",
    definition:
      "A chronic metabolic disease of impaired carbohydrate, fat, and protein metabolism leading to systemic microvascular (retinopathy, nephropathy, neuropathy) and macrovascular (coronary artery disease, peripheral arterial disease, stroke) damage.",
    causes: [
      "Type 1 Diabetes Mellitus: Autoimmune destruction of pancreatic beta cells causing absolute insulin deficiency [D0010-KEYNOTES, CIT-0040]",
      "Type 2 Diabetes Mellitus: Progressive insulin resistance combined with compensatory beta-cell dysfunction",
      "Gestational Diabetes Mellitus and secondary forms (pancreatitis, Cushing syndrome, drug-induced)",
    ],
    riskFactors: [
      "Overweight/obesity (BMI ≥25 kg/m² or ≥23 kg/m² in Asian populations) and abdominal visceral adiposity",
      "Physical inactivity, high glycemic diet, and first-degree relative with Type 2 Diabetes",
      "History of gestational diabetes, polycystic ovary syndrome (PCOS), or hypertension (≥130/80 mmHg)",
    ],
    symptoms: [
      "Classic triad: Polyuria (frequent urination), polydipsia (excessive thirst), and polyphagia (excessive hunger) with unmanaged weight loss [D0010-KEYNOTES, CIT-0040]",
      "Fatigue, blurred vision, slow-healing cutaneous wounds, and recurrent genitourinary fungal infections",
      "Peripheral distal symmetric paresthesias ('glove and stocking' numbness and tingling)",
    ],
    diagnosis:
      "Diagnosed via venous plasma fasting blood glucose ≥126 mg/dL (7.0 mmol/L), HbA1c ≥6.5% (48 mmol/mol), or random plasma glucose ≥200 mg/dL (11.1 mmol/L) with classic hyperglycemic symptoms, confirmed by repeat testing [CIT-0040].",
    differentialDiagnosis:
      "Differentiate Type 1 T1DM from Type 2 T2DM, Monogenic Diabetes (MODY), LADA (Latent Autoimmune Diabetes in Adults), Diabetes Insipidus, and secondary drug-induced hyperglycemia.",
    conventionalManagement:
      "Therapy involves medical nutrition therapy, physical activity, glucose self-monitoring, metformin as first-line pharmacotherapy, SGLT2 inhibitors / GLP-1 receptor agonists for cardiorenal protection, and basal-bolus insulin regimens [CIT-0040].",
    homeopathicApproach:
      "Homeopathic care serves as a complementary lifestyle and constitutional approach to improve metabolic wellness, reduce neuropathic discomforts, and support vitality under continuous blood glucose monitoring.",
    lifestyleAdvice:
      "Adhere to a low glycemic index diet, engage in 150 minutes/week of moderate aerobic exercise, perform daily foot self-inspections, and keep glucose logbooks.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0040"],
    faqs: [
      {
        question: "What are Diabetic Ketoacidosis (DKA) and Hyperosmolar Hyperglycemic State (HHS), and how are they managed?",
        answer:
          "DKA and HHS are life-threatening acute metabolic emergencies [D0010-EMERGENCY-LIMITS, CIT-0040]. DKA presents with blood glucose >250 mg/dL, arterial pH <7.30, serum ketones, Kussmaul breathing, and fruity acetone breath odor. HHS presents with blood glucose >600 mg/dL and severe dehydration. Both require IMMEDIATE emergency medical transport for IV fluid resuscitation, continuous insulin infusion, and electrolyte monitoring.",
      },
      {
        question: "Can insulin or oral diabetes medications be replaced with homeopathic remedies?",
        answer:
          "NO. Insulin in Type 1 Diabetes and prescribed hypoglycemic medications in Type 2 Diabetes MUST NEVER be discontinued or reduced without direct medical supervision [D0010-REGULATORY-LIMITS]. Abrupt insulin cessation causes fatal DKA.",
      },
      {
        question: "How does homeopathy integrate with standard diabetes care?",
        answer:
          "Homeopathy acts as a supportive constitutional modality for overall vitality and symptom relief while glycemic control is strictly managed with standard medical care and regular HbA1c testing [D0010-REGULATORY-LIMITS].",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Endocrinology & Metabolic Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Diabetes-Mellitus", "Disease", "ADA-2024", "Endocrinology", "Glycemic-Control", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/diabetes-mellitus",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Diabetes Mellitus profile",
    "1.1.0: Upgraded with ADA 2024 Standards of Care citations (CIT-0040), passage-level claim citations (D0010-KEYNOTES, D0010-EMERGENCY-LIMITS, D0010-REGULATORY-LIMITS), DKA/HHS and severe hypoglycemia red flags, and insulin non-discontinuation safety rules",
  ],
};
