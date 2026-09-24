import { KnowledgeEntity } from "../../types";

export const PalpitationsSymptom: KnowledgeEntity = {
  id: "S0021",
  slug: "palpitations",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Palpitations",
    hi: "Palpitations",
    gu: "Palpitations",
    mr: "Palpitations",
    es: "Palpitations",
    ar: "Palpitations"
  },
  summary: {
    en: "Palpitations are a noticeable heartbeat—fast, fluttering, pounding, or irregular. They are often harmless but require urgent care with chest pain, breathlessness, or fainting.",
    hi: "Palpitations के लक्षण की नैदानिक समझ.",
    gu: "Palpitations ના લક્ષણ ની સમજણ.",
    mr: "Palpitations चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Palpitations.",
    ar: "التعريف السريري والأهمية لـ Palpitations."
  },
  content: {
  "definition": "Palpitations are the sensation of noticing your heartbeat. It may feel fast, hard, fluttering, skipping, pounding, or irregular in the chest, neck, or throat.",
  "clinicalMeaning": "They are common and can be triggered by stress or stimulants, but recurrent or prolonged episodes may need an ECG or other assessment to look for a heart rhythm or other medical cause.",
  "commonCauses": [
    "Stress, anxiety, panic, lack of sleep, fever, dehydration, or strenuous activity",
    "Caffeine, nicotine, alcohol, recreational drugs, and some medicines",
    "Hormonal changes, low iron, or an overactive thyroid",
    "A heart rhythm problem or other heart condition"
  ],
  "differentialDiagnosis": "A clinician may ask about the pattern, triggers, medicines, family history, and associated symptoms, then examine you and arrange an ECG or blood tests when indicated.",
  "redFlags": [
    "Call emergency services if palpitations do not settle or occur with chest pain, shortness of breath, feeling faint, or fainting.",
    "Seek urgent assessment if there is a new irregular heartbeat with severe dizziness, new weakness, or you feel very unwell.",
    "Book a clinical review if they keep returning, happen more often, last more than a few minutes, or you have a heart condition or family history of heart problems."
  ],
  "lifestyleAdvice": "If you feel otherwise well, note the time, duration, pulse if you can check it safely, triggers, medicines, and accompanying symptoms. Avoid known triggers such as excess caffeine, smoking, alcohol, or recreational drugs, but do not use lifestyle changes to delay urgent assessment.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What do palpitations feel like?",
      "answer": "They can feel like racing, fluttering, pounding, skipping, or an irregular heartbeat. The sensation can be felt in the chest, neck, or throat."
    },
    {
      "question": "Can caffeine cause palpitations?",
      "answer": "Caffeine and other stimulants can trigger palpitations in some people. However, recurring or concerning palpitations still need appropriate clinical assessment."
    },
    {
      "question": "When are palpitations an emergency?",
      "answer": "Call emergency services if they do not go away or happen with chest pain, shortness of breath, faintness, or fainting."
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
  tags: ["Palpitations", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/palpitations",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Palpitations symptom profile"]
};
