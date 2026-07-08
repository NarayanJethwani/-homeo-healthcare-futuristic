import { KnowledgeEntity } from "../../types";

export const MuscleStiffnessSymptom: KnowledgeEntity = {
  id: "S0053",
  slug: "muscle-stiffness",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Muscle Stiffness",
    hi: "Muscle Stiffness",
    gu: "Muscle Stiffness",
    mr: "Muscle Stiffness",
    es: "Muscle Stiffness",
    ar: "Muscle Stiffness"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Muscle Stiffness.",
    hi: "Muscle Stiffness के लक्षण की नैदानिक समझ.",
    gu: "Muscle Stiffness ના લક્ષણ ની સમજણ.",
    mr: "Muscle Stiffness चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Muscle Stiffness.",
    ar: "التعريف السريري والأهمية لـ Muscle Stiffness."
  },
  content: {
  "definition": "Muscle stiffness: A localized pain, sensory alteration, or mobility limitation originating from nerves, muscles, joints, or tendons.",
  "clinicalMeaning": "Replects nociceptive pathway stimulation, localized tissue injury, or nerve root compression resulting in altered sensation.",
  "commonCauses": [
    "Mechanical strain or postural imbalance",
    "Peripheral nerve compression (e.g., sciatica, carpal tunnel)",
    "Osteoarthritis or joint degeneration",
    "Neurogenic inflammation"
  ],
  "differentialDiagnosis": "Differentiate from systemic autoimmune joint disease, peripheral vascular disease, and referred visceral pain.",
  "redFlags": [
    "Loss of bladder or bowel control (Cauda Equina Syndrome)",
    "Sudden onset of limb weakness or foot drop",
    "Severe joint swelling with high fever indicating septic arthritis"
  ],
  "lifestyleAdvice": "Implement regular stretching, adjust desk ergonomics, engage in low-impact walking, and stay hydrated to maintain joint lubrication.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What causes muscle stiffness in the morning?",
      "answer": "Morning stiffness is often caused by localized inflammation, muscle inactivity during sleep, or structural degenerative joint changes that temporarily reduce synovial fluid circulation."
    },
    {
      "question": "How does stress affect nerve and muscle pain?",
      "answer": "Stress increases muscle tension and heightens pain sensitivity (central sensitization) by releasing stress hormones that lower the pain threshold."
    },
    {
      "question": "What is the homeopathic approach to physical injury?",
      "answer": "Homeopathy uses remedies like Arnica Montana to manage acute swelling and bruising, and Rhus Tox or Bryonia for joint stiffness and pain, tailored to whether movement improves or worsens the symptoms."
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
  tags: ["Muscle Stiffness", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/muscle-stiffness",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Muscle Stiffness symptom profile"]
};
