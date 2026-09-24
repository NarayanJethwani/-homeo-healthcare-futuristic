import { KnowledgeEntity } from "../../types";

export const ExcessiveSweatingSymptom: KnowledgeEntity = {
  id: "S0055",
  slug: "excessive-sweating",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Excessive Sweating",
    hi: "Excessive Sweating",
    gu: "Excessive Sweating",
    mr: "Excessive Sweating",
    es: "Excessive Sweating",
    ar: "Excessive Sweating"
  },
  summary: {
    en: "Excessive sweating is sweating more than the body needs for cooling. It can be localised or widespread, and persistent symptoms can be assessed and treated.",
    hi: "Excessive Sweating के लक्षण की नैदानिक समझ.",
    gu: "Excessive Sweating ના લક્ષણ ની સમજણ.",
    mr: "Excessive Sweating चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Excessive Sweating.",
    ar: "التعريف السريري والأهمية لـ Excessive Sweating."
  },
  content: {
  "definition": "Excessive sweating, also called hyperhidrosis, is sweating when the body does not need to cool down. It may affect the underarms, hands, feet, face, or the whole body.",
  "clinicalMeaning": "It may happen without an obvious cause or be linked to medicines or another health condition. It is treatable, and the pattern helps decide whether further assessment is needed.",
  "commonCauses": [
    "Primary hyperhidrosis, which can affect localised areas without another known condition",
    "Heat, anxiety, alcohol, spicy foods, or medicines that increase sweating",
    "Menopause, infection, low blood sugar, thyroid disease, or another condition needing review",
    "A skin or footwear environment that traps moisture and causes discomfort or irritation"
  ],
  "differentialDiagnosis": "A clinician may ask where and when sweating happens, whether it occurs at night, your medicines, family history, and any fever, weight, thyroid, or glucose symptoms. Treatment depends on whether an underlying cause is present.",
  "redFlags": [
    "Seek urgent help for sudden sweating with chest pain, severe breathlessness, fainting, new confusion, or one-sided weakness.",
    "Arrange prompt medical advice for sweating with fever, unexplained weight loss, regular night sweats, or a major change after starting a medicine.",
    "Book a review if it lasts at least 6 months, happens at least weekly, affects daily life, or self-care has not helped."
  ],
  "lifestyleAdvice": "Wear loose, breathable clothing; change moisture-absorbing socks when needed; rotate footwear; and identify personal triggers such as alcohol or spicy food. A pharmacist can advise on stronger antiperspirants and skin-friendly products. Do not stop prescribed medicines without clinical advice.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What is hyperhidrosis?",
      "answer": "Hyperhidrosis means sweating more than the body needs for cooling. It may be localised to areas such as the hands, feet, face, or underarms, or affect the whole body."
    },
    {
      "question": "Can a pharmacist help?",
      "answer": "Yes. A pharmacist can advise on stronger antiperspirants, sweat shields, foot powders, and gentle skin products, and tell you when medical review is appropriate."
    },
    {
      "question": "When should excessive sweating be checked?",
      "answer": "Arrange a review if it lasts, affects daily life, happens at night, is new after a medicine change, or comes with fever, weight loss, chest pain, or fainting."
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
  tags: ["Excessive Sweating", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/excessive-sweating",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Excessive Sweating symptom profile"]
};
