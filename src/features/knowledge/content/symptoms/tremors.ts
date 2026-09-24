import { KnowledgeEntity } from "../../types";

export const TremorsSymptom: KnowledgeEntity = {
  id: "S0049",
  slug: "tremors",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Tremors",
    hi: "Tremors",
    gu: "Tremors",
    mr: "Tremors",
    es: "Tremors",
    ar: "Tremors"
  },
  summary: {
    en: "A tremor is involuntary shaking of part of the body. A mild tremor is common, but worsening or life-affecting tremor should be assessed.",
    hi: "Tremors के लक्षण की नैदानिक समझ.",
    gu: "Tremors ના લક્ષણ ની સમજણ.",
    mr: "Tremors चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Tremors.",
    ar: "التعريف السريري والأهمية لـ Tremors."
  },
  content: {
  "definition": "A tremor is shaking or trembling that you cannot fully control, often affecting the hands but sometimes the head, voice, or another body part.",
  "clinicalMeaning": "A slight tremor can be normal. Stress, tiredness, caffeine, alcohol, smoking, medicines, and health conditions can make tremor more noticeable.",
  "commonCauses": [
    "Stress, tiredness, anxiety, caffeine, alcohol, nicotine, or temperature extremes",
    "A family tendency to essential tremor",
    "Some medicines or an overactive thyroid",
    "A neurological condition that needs assessment"
  ],
  "differentialDiagnosis": "A clinician may assess when the tremor happens, medicines, alcohol intake, family history, and other neurological symptoms to identify the likely type and cause.",
  "redFlags": [
    "Call emergency services for sudden shaking with one-sided weakness or numbness, facial droop, speech difficulty, confusion, seizure, severe headache, or loss of consciousness.",
    "Seek urgent advice for a new tremor after head injury, poisoning, or a rapid medicine change, or with severe chest pain or breathlessness.",
    "Book a review if tremor is worsening or affecting eating, writing, work, walking, or daily life."
  ],
  "lifestyleAdvice": "Note patterns with sleep, caffeine, alcohol, stress, medicines, and tasks. Reduce known triggers if safe, but speak to a clinician before changing prescribed medicine or alcohol use abruptly.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Is a slight tremor normal?",
      "answer": "A small tremor can be normal and may be more noticeable when tired, stressed, cold, or after caffeine."
    },
    {
      "question": "When should tremor be checked?",
      "answer": "See a clinician if it is worsening, new, or affecting daily activities."
    },
    {
      "question": "When is shaking an emergency?",
      "answer": "Sudden shaking with stroke signs, seizure, loss of consciousness, severe headache, or new severe illness needs emergency help."
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
  tags: ["Tremors", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/tremors",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Tremors symptom profile"]
};
