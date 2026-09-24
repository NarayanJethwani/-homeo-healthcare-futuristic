import { KnowledgeEntity } from "../../types";

export const MouthUlcersSymptom: KnowledgeEntity = {
  id: "S0042",
  slug: "mouth-ulcers",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Mouth Ulcers",
    hi: "Mouth Ulcers",
    gu: "Mouth Ulcers",
    mr: "Mouth Ulcers",
    es: "Mouth Ulcers",
    ar: "Mouth Ulcers"
  },
  summary: {
    en: "Mouth ulcers are painful sores inside the mouth that usually heal within one to two weeks. An ulcer lasting more than three weeks must be checked.",
    hi: "Mouth Ulcers के लक्षण की नैदानिक समझ.",
    gu: "Mouth Ulcers ના લક્ષણ ની સમજણ.",
    mr: "Mouth Ulcers चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Mouth Ulcers.",
    ar: "التعريف السريري والأهمية لـ Mouth Ulcers."
  },
  content: {
  "definition": "Mouth ulcers are small painful sores inside the mouth, often on the cheeks, lips, tongue, or gums. They are different from cold sores, which usually occur on or around the lips.",
  "clinicalMeaning": "Most are harmless and settle on their own. Recurrent, unusually large, infected, or long-lasting ulcers need assessment to check for an underlying cause.",
  "commonCauses": [
    "Minor injury from biting the cheek, a sharp tooth, braces, or a hard toothbrush",
    "Stress, hormonal changes, or certain foods and toothpaste ingredients",
    "Nutritional deficiency, a medicine effect, or another health condition",
    "Less commonly, infection or an inflammatory condition"
  ],
  "differentialDiagnosis": "A dentist or clinician may check for local irritation, dental problems, nutritional issues, medicines, recurrent ulcers elsewhere, or signs of oral cancer when an ulcer does not heal.",
  "redFlags": [
    "See a dentist or GP for an ulcer lasting more than three weeks, one that is bigger or different from usual, near the back of the throat, bleeding, or becoming increasingly painful or red.",
    "Seek prompt advice for fever, facial swelling, inability to drink, severe pain, or ulcers with skin or genital sores or painful swollen joints.",
    "A new lump or persistent red or white patch in the mouth also needs assessment."
  ],
  "lifestyleAdvice": "Use a soft toothbrush, choose cool drinks and softer foods, avoid spicy, salty, acidic, or rough foods while sore, and keep up regular dental checks. A pharmacist can advise on pain-relief gels, mouthwashes, and salt-water rinses.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "How long should a mouth ulcer last?",
      "answer": "Most clear within one or two weeks. An ulcer lasting more than three weeks needs dental or medical assessment."
    },
    {
      "question": "Can a pharmacist help?",
      "answer": "Yes. A pharmacist can advise on pain relief, antimicrobial mouthwash, or a saline rinse suitable for mouth ulcers."
    },
    {
      "question": "Are mouth ulcers contagious?",
      "answer": "Typical mouth ulcers inside the mouth are not contagious. Cold sores around the lips are a different condition."
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
  tags: ["Mouth Ulcers", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/mouth-ulcers",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Mouth Ulcers symptom profile"]
};
