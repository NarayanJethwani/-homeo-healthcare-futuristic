import { KnowledgeEntity } from "../../types";

export const RestlessLegsSymptom: KnowledgeEntity = {
  id: "S0065",
  slug: "restless-legs",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Restless Legs",
    hi: "Restless Legs",
    gu: "Restless Legs",
    mr: "Restless Legs",
    es: "Restless Legs",
    ar: "Restless Legs"
  },
  summary: {
    en: "Restless legs is an urge to move the legs with uncomfortable sensations, usually worse at rest and in the evening. It can disrupt sleep and deserves review when persistent.",
    hi: "Restless Legs के लक्षण की नैदानिक समझ.",
    gu: "Restless Legs ના લક્ષણ ની સમજણ.",
    mr: "Restless Legs चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Restless Legs.",
    ar: "التعريف السريري والأهمية لـ Restless Legs."
  },
  content: {
  "definition": "Restless legs syndrome is a strong urge to move the legs, often with tingling, throbbing, itching, or an uncomfortable crawling feeling. It is usually worse when resting and is relieved, at least briefly, by movement.",
  "clinicalMeaning": "Symptoms often appear in the evening or at night and may affect sleep. Restless legs can run in families or be linked to low iron, pregnancy, kidney disease, or some medicines.",
  "commonCauses": [
    "No clear cause, sometimes with a family pattern",
    "Low iron or iron-deficiency anaemia",
    "Pregnancy, kidney disease, or another long-term health condition",
    "Some medicines, caffeine, nicotine, or alcohol, which can worsen symptoms for some people"
  ],
  "differentialDiagnosis": "Leg cramps, peripheral neuropathy, sciatica, and medication effects can feel similar but are managed differently. A clinician may review medicines and arrange tests such as iron studies when appropriate.",
  "redFlags": [
    "Seek emergency care for sudden leg weakness, loss of bladder or bowel control, numbness around the genitals or buttocks, or a cold, pale, painful leg.",
    "Arrange prompt advice for one-sided swollen, hot, or red calf pain, especially with breathlessness or chest pain.",
    "Book a review if symptoms repeatedly disturb sleep, affect mental health, or do not improve with practical changes."
  ],
  "lifestyleAdvice": "Regular daytime movement, a steady sleep schedule, a warm bath or heat pad before bed, gentle stretching or walking during symptoms, and avoiding caffeine, nicotine, and alcohol late in the day may help. Do not start iron supplements unless a clinician has advised them.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What does restless legs feel like?",
      "answer": "It is an uncomfortable urge to move, often with tingling, itching, throbbing, or a crawling sensation. It is usually worse at rest and improves temporarily when you move."
    },
    {
      "question": "Could low iron be involved?",
      "answer": "Low iron is one recognised contributor. A clinician can decide whether testing is appropriate and whether iron treatment is safe for you."
    },
    {
      "question": "When should I ask for help?",
      "answer": "Ask for medical advice if it repeatedly affects sleep or daytime functioning, is worsening, or simple measures have not helped."
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
  tags: ["Restless Legs", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/restless-legs",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Restless Legs symptom profile"]
};
