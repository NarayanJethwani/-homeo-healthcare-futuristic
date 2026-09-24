import { KnowledgeEntity } from "../../types";

export const DiabetesMellitusDisease: KnowledgeEntity = {
  id: "D0010",
  slug: "diabetes-mellitus",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z",
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
    en: "Diabetes affects how the body uses glucose for energy. Learn the common signs, why the type of diabetes matters, and how everyday monitoring and treatment protect long-term health.",
    hi: "मधुमेह का एडीए 2024 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ડાયાબિટીસનું ADA 2024 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "मधुमेहाचे ADA 2024 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Diabetes Mellitus según los criterios ADA 2024 y límites de emergencia.",
    ar: "دليل سريري موثوق لداء السكري وفقًا لمعايير ADA 2024 وحدود السلامة.",
  },
  content: {
    overview:
      "Diabetes is a long-term condition in which glucose stays too high in the blood because the body does not make enough insulin, does not use insulin well, or both. It can be managed effectively, but the plan depends on the type of diabetes and must be individual.",
    definition:
      "Insulin helps move glucose from the blood into cells for energy. Over time, untreated high glucose can harm blood vessels, nerves, eyes, kidneys, feet and the heart. Regular care can reduce these risks.",
    causes: [
      "Type 1 diabetes is an autoimmune condition that requires insulin",
      "Type 2 diabetes develops when the body becomes less able to use insulin and make enough of it",
      "Diabetes can also begin in pregnancy or result from some medical conditions or medicines",
    ],
    riskFactors: [
      "Family history, previous gestational diabetes, PCOS, high blood pressure or higher body weight can raise type 2 diabetes risk",
      "Low activity and some dietary patterns may contribute, but diabetes is not a personal failure",
      "Type 1 diabetes is not caused by lifestyle choices",
    ],
    symptoms: [
      "Needing to pass urine more often, unusual thirst, tiredness, blurred vision or unplanned weight loss",
      "Slow-healing wounds or repeated infections can occur",
      "Type 2 diabetes may have few noticeable symptoms, so testing matters when risk is raised",
    ],
    diagnosis:
      "A clinician confirms diabetes with blood tests such as HbA1c, fasting plasma glucose, an oral glucose tolerance test, or a random glucose test when classic symptoms are present. The type of diabetes, symptoms and circumstances guide what happens next.",
    differentialDiagnosis:
      "Differentiate Type 1 T1DM from Type 2 T2DM, Monogenic Diabetes (MODY), LADA (Latent Autoimmune Diabetes in Adults), Diabetes Insipidus, and secondary drug-induced hyperglycemia.",
    conventionalManagement:
      "Treatment may include diabetes education, food and activity support, medicines, glucose monitoring and—especially for type 1 diabetes—insulin. Regular checks of blood pressure, cholesterol, kidneys, eyes and feet help prevent complications.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for diabetes or its complications. It must not replace insulin, prescribed diabetes medicines, glucose monitoring, foot care or emergency assessment. Tell the diabetes team about all products you use.",
    lifestyleAdvice:
      "Work with the diabetes team on a practical eating, activity and monitoring plan. Check feet regularly, keep appointments for eye and kidney screening, and follow a sick-day plan. Avoid changing insulin or medicines on your own.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0040"],
    faqs: [
      {
        question: "When can diabetes become an emergency?",
        answer:
          "Seek urgent help for vomiting that prevents fluids staying down, deep or difficult breathing, fruity-smelling breath, confusion, severe dehydration, very high glucose with ketones, or severe low blood sugar that causes confusion, seizure or unconsciousness. Follow the personal sick-day plan and emergency advice from your diabetes team.",
      },
      {
        question: "Can insulin or prescribed diabetes medicine be replaced by homeopathy?",
        answer:
          "No. Never stop or reduce insulin or prescribed diabetes medicine without medical advice. Stopping insulin can quickly cause a life-threatening emergency.",
      },
      {
        question: "What is one important everyday diabetes habit?",
        answer:
          "Follow the monitoring and medication plan agreed with your diabetes team, and bring real readings and questions to review visits. Small, consistent steps are more sustainable than drastic changes.",
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
  lastClinicalReview: "2026-09-24",
  nextClinicalReview: "2027-09-24",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Diabetes-Mellitus", "Disease", "ADA-2024", "Endocrinology", "Glycemic-Control", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/diabetes-mellitus",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Diabetes Mellitus profile",
    "1.1.0: Upgraded with ADA 2024 Standards of Care citations (CIT-0040), passage-level claim citations (D0010-KEYNOTES, D0010-EMERGENCY-LIMITS, D0010-REGULATORY-LIMITS), DKA/HHS and severe hypoglycemia red flags, and insulin non-discontinuation safety rules",
    "1.2.0: Patient-first rewrite with clearer type-specific, monitoring and emergency guidance",
  ],
};
