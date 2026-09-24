import { KnowledgeEntity } from "../../types";

export const ExcessiveThirstSymptom: KnowledgeEntity = {
  id: "S0027",
  slug: "excessive-thirst",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Excessive Thirst",
    hi: "Excessive Thirst",
    gu: "Excessive Thirst",
    mr: "Excessive Thirst",
    es: "Excessive Thirst",
    ar: "Excessive Thirst"
  },
  summary: {
    en: "Feeling thirsty after exercise is usual; being constantly thirsty despite drinking is not and deserves attention.",
    hi: "Excessive Thirst के लक्षण की नैदानिक समझ.",
    gu: "Excessive Thirst ના લક્ષણ ની સમજણ.",
    mr: "Excessive Thirst चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Excessive Thirst.",
    ar: "التعريف السريري والأهمية لـ Excessive Thirst."
  },
  content: {
  "definition": "Excessive thirst means feeling persistently thirsty or needing to drink much more than usual, even when you have had fluids. It is sometimes called polydipsia.",
  "clinicalMeaning": "It is often a response to fluid loss or dry mouth. If it continues for several days, occurs with frequent urination, or comes with weight loss or blurred vision, a clinician can look for causes such as diabetes, medicines, or another health condition.",
  "commonCauses": [
    "Fluid loss from heat, exercise, fever, vomiting, diarrhoea, or not drinking enough",
    "Alcohol, caffeine, or very salty or spicy foods",
    "Pregnancy or medicines that can cause a dry mouth or increased urination",
    "Diabetes or, less commonly, another condition affecting fluid balance"
  ],
  "differentialDiagnosis": "Notice whether this is thirst, a dry mouth, or both. A clinician may ask about how much you drink, how often you pass urine, recent illness, medicines, pregnancy, and symptoms such as tiredness, weight change, or blurred vision. Do not try to diagnose diabetes from thirst alone.",
  "redFlags": [
    "Get urgent help for confusion, fainting, severe dizziness, or signs of severe dehydration such as very little dark urine",
    "Seek urgent assessment if you cannot keep fluids down, or thirst comes with chest pain or severe breathlessness",
    "Arrange a GP review if drinking more has not helped after a few days, or you are also urinating often, losing weight, or noticing blurred vision"
  ],
  "lifestyleAdvice": "Sip water regularly and replace fluids after heat or illness. Limit alcohol and excess caffeine while you work out the cause. Keep a short note of drinks, urine frequency, symptoms, and medicines to make a clinical review more useful. Avoid forcing very large amounts of water unless a clinician has advised it.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "When is thirst a reason to see a doctor?",
      "answer": "Book a review if you are constantly thirsty for several days despite drinking, especially with frequent urination, unintentional weight loss, tiredness, or blurred vision."
    },
    {
      "question": "Can dry mouth feel like thirst?",
      "answer": "Yes. Dry mouth can make you want to drink even when your body is not short of fluid. Medicines, mouth breathing, and some health conditions can contribute."
    },
    {
      "question": "Should I cut down on fluids if I am urinating often?",
      "answer": "No. Do not restrict fluids to manage a new pattern of frequent urination. Keep hydrated and arrange a clinical assessment if it continues."
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
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Excessive Thirst", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/excessive-thirst",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Excessive Thirst symptom profile"]
};
