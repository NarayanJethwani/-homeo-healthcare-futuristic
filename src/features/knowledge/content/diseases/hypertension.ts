import { KnowledgeEntity } from "../../types";

export const HypertensionDisease: KnowledgeEntity = {
  id: "D0009",
  slug: "hypertension",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Hypertension (High Blood Pressure)",
    hi: "उच्च रक्तचाप (Hypertension)",
    gu: "હાઇ બ્લડ પ્રેશર (Hypertension)",
    mr: "उच्च रक्तदाब (Hypertension)",
    es: "Hipertensión Arterial",
    ar: "ارتفاع ضغط الدم",
  },
  summary: {
    en: "An authoritative clinical profile of Systemic Arterial Hypertension covering ACC/AHA 2017 staging criteria, end-organ vascular risk, hypertensive crisis emergency red flags, and anti-hypertensive non-discontinuation rules.",
    hi: "उच्च रक्तचाप का एसीसी/एएचए 2017 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "હાઇ બ્લડ પ્રેશરનું ACC/AHA 2017 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "उच्च रक्तदाबाचे ACC/AHA 2017 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Hipertensión Arterial según los criterios ACC/AHA 2017 y límites de emergencia.",
    ar: "دليل سريري موثوق لارتفاع ضغط الدم الشرياني وفقًا لمعايير ACC/AHA 2017 وحدود السلامة.",
  },
  content: {
    overview:
      "Essential hypertension is defined as persistent elevation of systemic arterial blood pressure (systolic BP ≥130 mmHg or diastolic BP ≥80 mmHg) [D0009-KEYNOTES, CIT-0039]. Often asymptomatic, it is a primary risk factor for stroke, myocardial infarction, heart failure, and chronic kidney disease.",
    definition:
      "A chronic cardiovascular condition characterized by sustained elevated vascular resistance against left ventricular ejection, resulting in arterial wall remodeling and end-organ microvascular injury.",
    causes: [
      "Essential (primary) hypertension (90-95% of cases): Polygenic inheritance, renal sodium retention, sympathetic hyperactivity, and endothelial dysfunction [D0009-KEYNOTES, CIT-0039]",
      "Secondary hypertension (5-10% of cases): Chronic kidney disease, renovascular stenosis, primary aldosteronism, obstructive sleep apnea, or pheochromocytoma",
    ],
    riskFactors: [
      "Advanced age, family history of premature cardiovascular disease, and South Asian / African-American ethnicity",
      "High dietary sodium intake (>2,300 mg/day), low potassium intake, sedentary lifestyle, and obesity",
      "Excessive alcohol consumption, chronic psycho-emotional stress, and tobacco use",
    ],
    symptoms: [
      "Often asymptomatic ('silent killer') until end-organ complications manifest [D0009-KEYNOTES, CIT-0039]",
      "Occipital morning headache, dizziness, epistaxis, or exertional dyspnea in severe blood pressure elevations",
      "Hypertensive crisis symptoms: Severe headache, chest pain, dyspnea, neurological deficits, or visual alterations",
    ],
    diagnosis:
      "Diagnosed by multiple standardized resting blood pressure measurements across ≥2 clinical visits, out-of-office ambulatory BP monitoring (ABPM), baseline serum creatinine, eGFR, lipid profile, fasting glucose, urinalysis, and 12-lead ECG [CIT-0039].",
    differentialDiagnosis:
      "Differentiate essential hypertension from secondary renal, endocrine, or vascular causes, white-coat hypertension, and acute pain-induced hypertension.",
    conventionalManagement:
      "Therapy combines DASH dietary modifications, sodium restriction (<1,500 mg/day), aerobic exercise, and guideline-directed anti-hypertensive pharmacotherapy (ACE inhibitors/ARBs, CCBs, thiazide diuretics) [CIT-0039].",
    homeopathicApproach:
      "Homeopathic management serves as a supportive constitutional therapy to address anxiety, stress-induced vascular tone, and lifestyle factors alongside regular blood pressure monitoring.",
    lifestyleAdvice:
      "Adopt the DASH diet, restrict daily sodium intake, engage in 150 minutes/week of moderate aerobic activity, limit alcohol, and maintain daily home BP logs.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0039"],
    faqs: [
      {
        question: "What is a Hypertensive Emergency and what should be done?",
        answer:
          "A Hypertensive Emergency is defined as severe blood pressure elevation (systolic BP >180 mmHg or diastolic BP >120 mmHg) with acute target organ damage (acute stroke, chest pain/infarction, pulmonary edema, acute renal failure, or altered mental status) [D0009-EMERGENCY-LIMITS, CIT-0039]. It requires IMMEDIATE emergency medical transport to an intensive care unit for parenteral antihypertensive therapy.",
      },
      {
        question: "Can patients stop prescription antihypertensive medications when starting homeopathy?",
        answer:
          "NO. Prescription antihypertensive medications MUST NEVER be abruptly stopped or reduced without direct authorization from the prescribing cardiologist or physician [D0009-REGULATORY-LIMITS]. Abrupt withdrawal risks rebound hypertensive crisis or stroke.",
      },
      {
        question: "How does homeopathy integrate with blood pressure monitoring?",
        answer:
          "Homeopathy provides supportive constitutional care for stress and lifestyle risk factors while patients remain under strict blood pressure monitoring and medical follow-up [D0009-REGULATORY-LIMITS].",
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
    specialty: "Cardiology & Vascular Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Hypertension", "Disease", "ACC-AHA-2017", "Cardiovascular", "Blood-Pressure", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hypertension",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Hypertension profile",
    "1.1.0: Upgraded with ACC/AHA 2017 guideline citations (CIT-0039), passage-level claim citations (D0009-KEYNOTES, D0009-EMERGENCY-LIMITS, D0009-REGULATORY-LIMITS), hypertensive emergency red flags (>180/120 mmHg), and drug non-discontinuation boundaries",
  ],
};
