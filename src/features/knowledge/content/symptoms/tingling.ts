import { KnowledgeEntity } from "../../types";

export const TinglingSymptom: KnowledgeEntity = {
  id: "S0032",
  slug: "tingling",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Tingling",
    hi: "Tingling",
    gu: "Tingling",
    mr: "Tingling",
    es: "Tingling",
    ar: "Tingling"
  },
  summary: {
    en: "Tingling is a pins-and-needles feeling, often from temporary nerve pressure. Persistent, painful, or one-sided tingling needs assessment.",
    hi: "Tingling के लक्षण की नैदानिक समझ.",
    gu: "Tingling ના લક્ષણ ની સમજણ.",
    mr: "Tingling चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Tingling.",
    ar: "التعريف السريري والأهمية لـ Tingling."
  },
  content: {
  "definition": "Tingling is a prickling, buzzing, or pins-and-needles sensation, usually in the hands, feet, arms, or legs.",
  "clinicalMeaning": "It often follows pressure on a nerve and settles when position changes, but persistent or progressive tingling can indicate a nerve, spine, metabolic, or circulation problem.",
  "commonCauses": [
    "Temporary pressure on a nerve or poor posture",
    "Nerve compression in the neck, back, or wrist",
    "Diabetes, vitamin deficiency, alcohol use, medicines, or peripheral neuropathy",
    "Anxiety-related rapid breathing or, less commonly, a neurological condition"
  ],
  "differentialDiagnosis": "A clinician considers whether tingling is one-sided or both sides, comes with numbness or weakness, and relates to movement, neck or back pain, diabetes, medicines, or other symptoms.",
  "redFlags": [
    "Call emergency services for sudden tingling or numbness on one side with face droop, arm weakness, speech difficulty, confusion, severe headache, or vision change.",
    "Seek urgent help for tingling with weakness, loss of bladder or bowel control, a cold or pale limb, or after serious injury.",
    "Book a review for persistent, spreading, recurrent, or painful tingling."
  ],
  "lifestyleAdvice": "Change position, avoid leaning on limbs for long periods, pace repetitive tasks, and note the trigger, location, and duration. Do not ignore a new one-sided or progressive pattern.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Why do I get pins and needles?",
      "answer": "Often a position temporarily compresses a nerve or reduces blood flow. It should ease after moving; persistent symptoms need assessment."
    },
    {
      "question": "When is tingling urgent?",
      "answer": "Sudden one-sided symptoms with FAST stroke signs, or tingling with weakness, bladder or bowel changes, injury, or a cold limb, needs urgent help."
    },
    {
      "question": "Could diabetes cause tingling?",
      "answer": "Yes. Diabetes can affect nerves, often starting gradually in the feet. A clinician can assess this and other possible causes."
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
  tags: ["Tingling", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/tingling",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Tingling symptom profile"]
};
