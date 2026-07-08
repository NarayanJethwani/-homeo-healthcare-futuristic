import { KnowledgeEntity } from "../../types";

export const NoseBleedingSymptom: KnowledgeEntity = {
  id: "S0062",
  slug: "nose-bleeding",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Nose Bleeding",
    hi: "Nose Bleeding",
    gu: "Nose Bleeding",
    mr: "Nose Bleeding",
    es: "Nose Bleeding",
    ar: "Nose Bleeding"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Nose Bleeding.",
    hi: "Nose Bleeding के लक्षण की नैदानिक समझ.",
    gu: "Nose Bleeding ના લક્ષણ ની સમજણ.",
    mr: "Nose Bleeding चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Nose Bleeding.",
    ar: "التعريف السريري والأهمية لـ Nose Bleeding."
  },
  content: {
  "definition": "Nose bleeding: A general physical symptom reflecting altered systemic vitality, sleep disruption, or thermal deregulation.",
  "clinicalMeaning": "Represents a functional warning sign indicating that systemic auto-regulation is strained or compromised.",
  "commonCauses": [
    "Post-viral fatigue states",
    "Chronic physical or psychological stress",
    "Sleep deprivation or metabolic imbalances",
    "Subclinical systemic congestion"
  ],
  "differentialDiagnosis": "Must be differentiated from primary thyroid disease, severe anemia, fibromyalgia, and major depressive disorder.",
  "redFlags": [
    "Sudden profound unexplained weight loss",
    "Unremitting high fever unresponsive to standard care",
    "Sudden localized numbness or severe weakness"
  ],
  "lifestyleAdvice": "Prioritize consistent sleep timing, consume a balanced whole-foods diet, practice mild relaxation exercises, and stay hydrated.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What is a constitutional remedy in homeopathy?",
      "answer": "A constitutional remedy is a deep-acting medicine selected to match a patient's overall physical, mental, and emotional makeup, rather than just treating a single local symptom."
    },
    {
      "question": "Why does the homeopath ask so many detailed questions?",
      "answer": "To find the individualized remedy, the homeopath must understand all unique characteristics—such as sleep patterns, thermal sensitivities, food cravings, and emotional triggers."
    },
    {
      "question": "How should homeopathic remedies be stored?",
      "answer": "Remedies should be stored in a cool, dry place, away from direct sunlight, strong odors (like camphor, perfumes), and electronic devices to maintain their potency."
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
  tags: ["Nose Bleeding", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/nose-bleeding",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Nose Bleeding symptom profile"]
};
