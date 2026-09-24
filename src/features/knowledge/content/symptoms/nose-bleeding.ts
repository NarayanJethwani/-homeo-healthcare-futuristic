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
    en: "Nosebleed",
    hi: "Nose Bleeding",
    gu: "Nose Bleeding",
    mr: "Nose Bleeding",
    es: "Nose Bleeding",
    ar: "Nose Bleeding"
  },
  summary: {
    en: "A nosebleed is usually manageable with simple first aid. Know how to stop it safely and when bleeding needs urgent medical attention.",
    hi: "Nose Bleeding के लक्षण की नैदानिक समझ.",
    gu: "Nose Bleeding ના લક્ષણ ની સમજણ.",
    mr: "Nose Bleeding चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Nose Bleeding.",
    ar: "التعريف السريري والأهمية لـ Nose Bleeding."
  },
  content: {
  "definition": "A nosebleed is bleeding from the lining inside the nose. Most start near the front of the nose and stop with firm pressure and time.",
  "clinicalMeaning": "A single small bleed is common, especially in dry weather or after irritation. Repeated, heavy, or hard-to-stop bleeding needs medical assessment.",
  "commonCauses": [
    "Dry air, colds, allergies, or forceful blowing of the nose",
    "Picking, rubbing, or a minor injury to the nose",
    "Medicines that affect bleeding, including anticoagulants",
    "Less commonly, a blood-clotting problem or uncontrolled high blood pressure"
  ],
  "differentialDiagnosis": "Bleeding from the mouth, coughing blood, or vomiting blood can be mistaken for a nosebleed and needs different assessment. A clinician can review recurrent bleeding and medicines.",
  "redFlags": [
    "Get urgent help if bleeding does not stop after 10 to 15 minutes of firm pressure, is very heavy, or makes you feel faint, weak, or short of breath.",
    "Seek urgent care after a significant head or facial injury, or if blood is flowing heavily into the throat.",
    "Arrange a review for frequent nosebleeds, especially if you take blood-thinning medicine or bruise or bleed easily elsewhere."
  ],
  "lifestyleAdvice": "For a bleed, sit up and lean forward. Pinch the soft part of the nose just above the nostrils continuously for 10 to 15 minutes and breathe through your mouth. Do not tilt your head back. After it stops, avoid blowing or picking your nose for 24 hours; a pharmacist can advise on keeping a dry nose moist.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "How do I stop a nosebleed?",
      "answer": "Sit up, lean forward, and pinch the soft part of your nose continuously for 10 to 15 minutes. Spit out any blood that reaches your mouth rather than swallowing it."
    },
    {
      "question": "Why should I lean forward?",
      "answer": "Leaning forward helps keep blood out of the throat, where swallowing it can cause nausea or vomiting."
    },
    {
      "question": "When should I seek urgent help?",
      "answer": "Get urgent help if firm pressure has not stopped the bleed after 10 to 15 minutes, it is heavy, you feel unwell, or it followed a significant injury."
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
