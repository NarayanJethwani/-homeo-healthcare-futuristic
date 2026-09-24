import { KnowledgeEntity } from "../../types";

export const WheezingSymptom: KnowledgeEntity = {
  id: "S0069",
  slug: "wheezing",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Wheezing",
    hi: "Wheezing",
    gu: "Wheezing",
    mr: "Wheezing",
    es: "Wheezing",
    ar: "Wheezing"
  },
  summary: {
    en: "Wheezing is a high-pitched whistling sound when breathing, usually from narrowed airways. New or worsening wheeze should be assessed, and severe breathing difficulty is an emergency.",
    hi: "Wheezing के लक्षण की नैदानिक समझ.",
    gu: "Wheezing ના લક્ષણ ની સમજણ.",
    mr: "Wheezing चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Wheezing.",
    ar: "التعريف السريري والأهمية لـ Wheezing."
  },
  content: {
  "definition": "Wheezing is a high-pitched, musical whistling sound heard when breathing, often more noticeable when breathing out. It can occur with coughing, chest tightness, or breathlessness.",
  "clinicalMeaning": "It commonly occurs when airways narrow, for example with asthma, infection, allergy, smoking-related lung disease, or an inhaled foreign object. It is not a diagnosis by itself.",
  "commonCauses": [
    "Asthma or another airway sensitivity",
    "A cold, flu, COVID-19, or chest infection",
    "Allergy or exposure to smoke, pollution, cold air, or another trigger",
    "COPD or another lung condition, especially in people who smoke or used to smoke"
  ],
  "differentialDiagnosis": "A clinician may listen to the chest and assess oxygen levels, asthma history, allergy, infection, smoking, and medicines. Sudden wheeze after choking may indicate an inhaled object.",
  "redFlags": [
    "Call emergency services for severe difficulty breathing, blue or grey lips, inability to speak full sentences, confusion, collapse, or a suddenly silent chest during an asthma attack.",
    "Use your personal asthma action plan and reliever inhaler if prescribed; call emergency services if symptoms worsen or do not improve as directed in the plan.",
    "Arrange a clinical review for new wheeze, wheeze waking you at night, or needing a reliever inhaler more often."
  ],
  "lifestyleAdvice": "Avoid smoke, vaping, and known triggers. Keep prescribed inhalers available and use them exactly as your asthma action plan says. Do not borrow another person’s inhaler or rely on home measures for active breathing difficulty.",
  "references": [
    "CIT-0020",
    "CIT-0021",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "Is wheezing always asthma?",
      "answer": "No. Asthma is a common cause, but infection, allergy, COPD, smoke exposure, and other conditions can cause wheeze. New wheeze should be assessed."
    },
    {
      "question": "What should I do during an asthma attack?",
      "answer": "Sit upright and follow your written asthma action plan. Use your prescribed reliever inhaler as directed and call emergency services if symptoms worsen or do not improve."
    },
    {
      "question": "When is wheezing an emergency?",
      "answer": "Severe breathing difficulty, blue or grey lips, inability to speak, confusion, collapse, or no improvement with the prescribed asthma plan needs emergency help."
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
  tags: ["Wheezing", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/wheezing",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Wheezing symptom profile"]
};
