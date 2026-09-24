import { KnowledgeEntity } from "../../types";

export const TasteLossSymptom: KnowledgeEntity = {
  id: "S0068",
  slug: "taste-loss",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Taste Loss",
    hi: "Taste Loss",
    gu: "Taste Loss",
    mr: "Taste Loss",
    es: "Taste Loss",
    ar: "Taste Loss"
  },
  summary: {
    en: "Taste loss or change often happens when smell is reduced by a cold, allergy, or sinus problem. Persistent changes should be assessed and need safety precautions at home.",
    hi: "Taste Loss के लक्षण की नैदानिक समझ.",
    gu: "Taste Loss ના લક્ષણ ની સમજણ.",
    mr: "Taste Loss चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Taste Loss.",
    ar: "التعريف السريري والأهمية لـ Taste Loss."
  },
  content: {
  "definition": "Taste loss is a reduced or altered ability to taste food. Because smell contributes strongly to flavour, a change in smell often makes food seem tasteless.",
  "clinicalMeaning": "It commonly follows a cold, flu, COVID-19, allergy, or sinus problem and often improves. Persistent or unexplained change should be assessed.",
  "commonCauses": [
    "A cold, flu, COVID-19, allergy, sinusitis, or nasal polyps",
    "A medicine effect, smoking, mouth or dental problems, or dry mouth",
    "Head injury or ageing",
    "Rarely, a neurological condition needing assessment"
  ],
  "differentialDiagnosis": "A clinician may assess the nose, mouth, smell, medicines, recent illness, head injury, and neurological symptoms. Most reported taste loss is partly due to reduced smell.",
  "redFlags": [
    "Seek emergency help for a sudden change with facial droop, weakness or numbness, speech difficulty, severe headache, seizure, or new confusion.",
    "Arrange a review if taste or smell does not begin to return within a few weeks, follows a head injury, or comes with persistent nasal blockage, bleeding, or unexplained weight loss.",
    "Use extra safety around gas, fire, smoke alarms, and spoiled food if smell is reduced."
  ],
  "lifestyleAdvice": "Keep good mouth and dental hygiene, avoid smoking, and treat a cold or allergy with pharmacist advice. Saline nasal rinsing may help when allergy or infection affects smell. Use dates and labels rather than smell alone to judge food safety.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Why does food taste bland when I have a cold?",
      "answer": "Flavour depends greatly on smell. Congestion or reduced smell during a cold can make food seem less tasty."
    },
    {
      "question": "Will taste loss improve?",
      "answer": "It often improves within weeks or months after the underlying cause settles, but persistent change should be discussed with a clinician."
    },
    {
      "question": "What safety steps are useful?",
      "answer": "Check smoke and gas alarms, use dates and labels for food safety, and ask others to check for spoilage if your smell is reduced."
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
  tags: ["Taste Loss", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/taste-loss",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Taste Loss symptom profile"]
};
