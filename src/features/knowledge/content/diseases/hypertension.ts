import { KnowledgeEntity } from "../../types";

export const HypertensionDisease: KnowledgeEntity = {
  id: "D0009",
  slug: "hypertension",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z",
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
    en: "High blood pressure usually has no warning symptoms. Learn how accurate readings, everyday habits and prescribed treatment work together to protect the heart, brain and kidneys.",
    hi: "उच्च रक्तचाप का एसीसी/एएचए 2017 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "હાઇ બ્લડ પ્રેશરનું ACC/AHA 2017 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "उच्च रक्तदाबाचे ACC/AHA 2017 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Hipertensión Arterial según los criterios ACC/AHA 2017 y límites de emergencia.",
    ar: "دليل سريري موثوق لارتفاع ضغط الدم الشرياني وفقًا لمعايير ACC/AHA 2017 وحدود السلامة.",
  },
  content: {
    overview:
      "Hypertension means blood pressure stays higher than is healthy over time. It often causes no symptoms, so regular measurements are essential. Left untreated, it raises the risk of heart disease, stroke and kidney disease, but treatment can lower that risk.",
    definition:
      "Blood pressure is the force of blood against artery walls. A diagnosis of hypertension is based on repeated accurate readings, not on one high reading or on symptoms such as a headache alone.",
    causes: [
      "Most high blood pressure has several contributors rather than one single cause",
      "Family history, age, body weight, sleep, alcohol, smoking, diet and activity can all contribute",
      "Kidney disease, some hormone conditions, sleep apnoea or medicines can sometimes be important causes",
    ],
    riskFactors: [
      "Family history, increasing age, diabetes, kidney disease or sleep apnoea",
      "High-salt processed foods, excess alcohol, smoking, low activity or higher body weight",
      "Medicines or supplements that can raise blood pressure; ask a clinician before stopping anything prescribed",
    ],
    symptoms: [
      "Usually no symptoms at all",
      "A reading that is repeatedly high on a validated home monitor or at a clinic",
      "Severe headache, chest pain, breathlessness, weakness, speech difficulty or vision change with a very high reading are emergency warning signs—not routine hypertension symptoms",
    ],
    diagnosis:
      "Diagnosis uses repeated, correctly taken measurements. A clinician may ask for home or 24-hour monitoring and check for related risks or causes with blood and urine tests, an ECG, and a review of medicines and lifestyle.",
    differentialDiagnosis:
      "Differentiate essential hypertension from secondary renal, endocrine, or vascular causes, white-coat hypertension, and acute pain-induced hypertension.",
    conventionalManagement:
      "Treatment is personalised. It may include a heart-healthy lower-salt eating pattern, activity, weight management, less alcohol, stopping smoking and prescribed blood-pressure medicine. Many people need both everyday changes and medicine.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for hypertension. It must not replace home monitoring, prescribed blood-pressure medicine or emergency assessment. Do not change prescribed doses without the prescriber’s advice.",
    lifestyleAdvice:
      "Use a validated upper-arm monitor if your clinician recommends home checks. Sit quietly first, use the right cuff size, record readings rather than reacting to one number, and bring the log to appointments. Build gradual activity, more minimally processed foods and good sleep into a sustainable routine.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0039"],
    faqs: [
      {
        question: "When is a high blood-pressure reading an emergency?",
        answer:
          "A reading above 180/120 mm Hg needs medical attention. Recheck after five minutes if you have no symptoms and call your clinician if it stays that high. Call emergency services immediately for chest pain, breathlessness, weakness or numbness, trouble speaking, vision changes, severe headache, or severe back or abdominal pain.",
      },
      {
        question: "Can I stop blood-pressure medicine if readings improve?",
        answer:
          "No. Improved readings may mean the treatment plan is working. Only the prescribing clinician should decide whether a dose can change.",
      },
      {
        question: "Does high blood pressure cause headaches?",
        answer:
          "Usually it does not cause symptoms. Do not use a headache to judge blood pressure; measure it correctly. A severe headache with a very high reading or neurological symptoms needs urgent care.",
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
  lastClinicalReview: "2026-09-24",
  nextClinicalReview: "2027-09-24",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Hypertension", "Disease", "ACC-AHA-2017", "Cardiovascular", "Blood-Pressure", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hypertension",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Hypertension profile",
    "1.1.0: Upgraded with ACC/AHA 2017 guideline citations (CIT-0039), passage-level claim citations (D0009-KEYNOTES, D0009-EMERGENCY-LIMITS, D0009-REGULATORY-LIMITS), hypertensive emergency red flags (>180/120 mmHg), and drug non-discontinuation boundaries",
    "1.2.0: Patient-first rewrite with clearer measurement, emergency and medicine boundaries",
  ],
};
