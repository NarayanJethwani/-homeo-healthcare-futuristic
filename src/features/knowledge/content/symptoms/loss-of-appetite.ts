import { KnowledgeEntity } from "../../types";

export const LossofAppetiteSymptom: KnowledgeEntity = {
  id: "S0026",
  slug: "loss-of-appetite",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Loss of Appetite",
    hi: "Loss of Appetite",
    gu: "Loss of Appetite",
    mr: "Loss of Appetite",
    es: "Loss of Appetite",
    ar: "Loss of Appetite"
  },
  summary: {
    en: "Loss of appetite means eating less because you do not feel hungry or food is unappealing. It can be temporary, but persistent low appetite or unintentional weight loss needs assessment.",
    hi: "Loss of Appetite के लक्षण की नैदानिक समझ.",
    gu: "Loss of Appetite ના લક્ષણ ની સમજણ.",
    mr: "Loss of Appetite चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Loss of Appetite.",
    ar: "التعريف السريري والأهمية لـ Loss of Appetite."
  },
  content: {
  "definition": "Loss of appetite is a reduced desire to eat. It may be brief during illness or stress, but it can affect nutrition and energy if it lasts.",
  "clinicalMeaning": "It can be caused by infection, pain, nausea, medicines, stress, low mood, digestive disease, or another health condition. The duration, weight change, and other symptoms guide assessment.",
  "commonCauses": [
    "A short-term infection, nausea, pain, or recovery from illness or surgery",
    "Stress, anxiety, low mood, grief, or an eating disorder",
    "Medicines, alcohol or other substances, or changes in taste and smell",
    "Digestive, hormonal, heart, kidney, liver, or other health conditions"
  ],
  "differentialDiagnosis": "A clinician may ask about weight, nausea, bowel changes, pain, mood, medicines, mouth or swallowing problems, and recent illness. Tests are guided by the story and examination.",
  "redFlags": [
    "Arrange prompt advice for unintentional weight loss, persistent low appetite, dehydration, repeated vomiting, blood in vomit or stool, or a new lump or persistent pain.",
    "Seek urgent help for severe abdominal pain, chest pain, severe breathlessness, confusion, or inability to keep fluids down.",
    "Seek support urgently if appetite loss is linked with thoughts of harming yourself or an eating pattern that feels out of control."
  ],
  "lifestyleAdvice": "If you are otherwise well, try small frequent meals or snacks, nourishing drinks, and fluids between meals. Choose familiar foods and eat at the times you feel most able. Do not rely on supplements or appetite stimulants without professional advice when weight is falling.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "When is low appetite concerning?",
      "answer": "It should be checked if it persists, causes weight loss, limits fluids, or comes with vomiting, pain, bowel changes, fever, or a significant change in mood."
    },
    {
      "question": "What can I eat if I do not feel hungry?",
      "answer": "Small frequent meals, snacks, and nourishing drinks can be easier than large meals. A dietitian can give tailored help if weight loss or illness is involved."
    },
    {
      "question": "Could stress affect appetite?",
      "answer": "Yes. Stress, anxiety, grief, and low mood can all change appetite. It is important to seek support if this is persistent or affecting nutrition or safety."
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
  tags: ["Loss of Appetite", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/loss-of-appetite",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Loss of Appetite symptom profile"]
};
