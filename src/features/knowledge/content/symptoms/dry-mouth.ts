import { KnowledgeEntity } from "../../types";

export const DryMouthSymptom: KnowledgeEntity = {
  id: "S0056",
  slug: "dry-mouth",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Dry Mouth",
    hi: "Dry Mouth",
    gu: "Dry Mouth",
    mr: "Dry Mouth",
    es: "Dry Mouth",
    ar: "Dry Mouth"
  },
  summary: {
    en: "Dry mouth is a lack of saliva or a dry feeling in the mouth. It is often manageable, but persistent symptoms can affect teeth, eating, and taste.",
    hi: "Dry Mouth के लक्षण की नैदानिक समझ.",
    gu: "Dry Mouth ના લક્ષણ ની સમજણ.",
    mr: "Dry Mouth चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Dry Mouth.",
    ar: "التعريف السريري والأهمية لـ Dry Mouth."
  },
  content: {
  "definition": "Dry mouth, also called xerostomia, is a dry or sticky mouth caused by reduced saliva or a change in saliva.",
  "clinicalMeaning": "Saliva protects teeth and helps with speech, eating, swallowing, and taste. Persistent dryness can cause discomfort, tooth decay, thrush, and difficulty eating.",
  "commonCauses": [
    "Dehydration, anxiety, or breathing through the mouth at night",
    "Medicines, including some antidepressants, antihistamines, and water tablets",
    "Cancer treatment, oral thrush, or a blocked nose",
    "Conditions such as diabetes or Sjögren's syndrome"
  ],
  "differentialDiagnosis": "A clinician or dentist may review medicines, hydration, mouth breathing, dry eyes, urinary symptoms, mouth changes, and dental health to identify a cause.",
  "redFlags": [
    "Arrange a review if dryness makes talking or eating difficult, persists after several weeks, or comes with dry eyes, frequent urination, mouth pain, swelling, bleeding, or white patches.",
    "Seek urgent help for inability to swallow fluids, severe dehydration, confusion, or severe allergic swelling of the mouth or throat.",
    "Do not stop a prescribed medicine without advice, even if you think it is causing dryness."
  ],
  "lifestyleAdvice": "Sip water regularly, use sugar-free gum or sweets if suitable, protect lips, brush twice daily with fluoride toothpaste, and use alcohol-free mouthwash. A pharmacist can advise on gels, sprays, or lozenges that keep the mouth moist.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Can a medicine cause dry mouth?",
      "answer": "Yes. Many medicines can contribute. Ask the prescriber or pharmacist for advice rather than stopping it yourself."
    },
    {
      "question": "Why does dry mouth matter for teeth?",
      "answer": "Saliva helps protect teeth. Persistent dryness increases the risk of tooth decay and oral infections, so dental care is important."
    },
    {
      "question": "When should I seek advice?",
      "answer": "Seek advice if it persists, affects eating or speaking, or is associated with dry eyes, mouth pain, swelling, bleeding, white patches, or increased urination."
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
  tags: ["Dry Mouth", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/dry-mouth",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Dry Mouth symptom profile"]
};
