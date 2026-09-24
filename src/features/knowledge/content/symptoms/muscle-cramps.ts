import { KnowledgeEntity } from "../../types";

export const MuscleCrampsSymptom: KnowledgeEntity = {
  id: "S0030",
  slug: "muscle-cramps",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Muscle Cramps",
    hi: "Muscle Cramps",
    gu: "Muscle Cramps",
    mr: "Muscle Cramps",
    es: "Muscle Cramps",
    ar: "Muscle Cramps"
  },
  summary: {
    en: "Muscle cramps are sudden painful tightening of a muscle, commonly in the calf or foot. Most settle quickly, but frequent cramps or cramps with swelling or numbness need review.",
    hi: "Muscle Cramps के लक्षण की नैदानिक समझ.",
    gu: "Muscle Cramps ના લક્ષણ ની સમજણ.",
    mr: "Muscle Cramps चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Muscle Cramps.",
    ar: "التعريف السريري والأهمية لـ Muscle Cramps."
  },
  content: {
  "definition": "A muscle cramp is a sudden, involuntary, painful tightening of a muscle that may make movement difficult for a few seconds to several minutes.",
  "clinicalMeaning": "Cramps are common and often harmless. Dehydration, exercise, pregnancy, ageing, medicines, and health conditions can contribute, especially when cramps recur.",
  "commonCauses": [
    "Exercise or muscle strain, especially in hot weather",
    "Dehydration, pregnancy, ageing, or prolonged resting positions",
    "Some medicines, including diuretics or statins",
    "Less commonly, a circulation, nerve, liver, kidney, or metabolic condition"
  ],
  "differentialDiagnosis": "A clinician may review the location, duration, exercise, hydration, medicines, swelling, numbness, weakness, and relevant health conditions.",
  "redFlags": [
    "Seek urgent help for a swollen, hot, red, or tender leg, or a cramp with chest pain or breathlessness.",
    "Arrange a review for cramps lasting more than 10 minutes, repeatedly disturbing sleep, or accompanied by numbness, swelling, weakness, or a change in walking.",
    "Sudden severe limb pain after injury or with a tight swollen muscle needs emergency assessment."
  ],
  "lifestyleAdvice": "During a cramp, gently stretch and massage the muscle; standing and placing weight on the affected leg may help. Regular calf stretches and adequate fluids can reduce recurrence. Do not start quinine or supplements without clinical advice.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What should I do during a cramp?",
      "answer": "Gently stretch and massage the muscle. Most cramps settle without treatment, although soreness may remain for a day."
    },
    {
      "question": "When should cramps be checked?",
      "answer": "Seek advice for frequent cramps, cramps lasting more than 10 minutes, sleep disruption, or cramps with swelling, numbness, or weakness."
    },
    {
      "question": "Can medicines cause cramps?",
      "answer": "Some medicines can contribute. Speak to the prescriber or pharmacist rather than stopping prescribed medicine yourself."
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
  tags: ["Muscle Cramps", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/muscle-cramps",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Muscle Cramps symptom profile"]
};
