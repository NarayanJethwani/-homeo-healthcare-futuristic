import { KnowledgeEntity } from "../../types";

export const ColdExtremitiesSymptom: KnowledgeEntity = {
  id: "S0054",
  slug: "cold-extremities",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Cold Extremities",
    hi: "Cold Extremities",
    gu: "Cold Extremities",
    mr: "Cold Extremities",
    es: "Cold Extremities",
    ar: "Cold Extremities"
  },
  summary: {
    en: "Cold hands and feet are often harmless in cold weather, but recurring colour change, pain, or numbness deserves attention.",
    hi: "Cold Extremities के लक्षण की नैदानिक समझ.",
    gu: "Cold Extremities ના લક્ષણ ની સમજણ.",
    mr: "Cold Extremities चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Cold Extremities.",
    ar: "التعريف السريري والأهمية لـ Cold Extremities."
  },
  content: {
  "definition": "Cold extremities means hands, feet, fingers, or toes that feel unusually cold. They may be cold because of the environment, or because blood vessels narrow in response to cold or stress.",
  "clinicalMeaning": "Occasional cold hands and feet are common. Repeated attacks with white, blue, grey, or red colour changes, pain, numbness, or pins and needles can occur with Raynaud's phenomenon and should be discussed with a clinician if they are severe, new, or worsening.",
  "commonCauses": [
    "Cold weather, wet clothing, or long periods without moving",
    "Stress or anxiety, which can temporarily narrow blood vessels",
    "Raynaud's phenomenon, where fingers or toes may change colour in cold or stressful situations",
    "Smoking, some medicines, or an underlying health condition affecting circulation or blood count"
  ],
  "differentialDiagnosis": "Keep track of triggers, how long episodes last, whether both sides are affected, and any colour change, pain, sores, numbness, or pins and needles. A clinician can decide whether this is a simple cold response, Raynaud's, a nerve problem, or another circulation concern.",
  "redFlags": [
    "Get immediate help for blue or grey skin or lips with breathing difficulty, chest pain, confusion, dizziness, or fainting",
    "Seek urgent assessment for a suddenly cold, pale or blue, painful limb, or a new painful swollen leg",
    "Book a GP review if colour changes, pain, numbness, sores, or pins and needles are persistent, worsening, or first begin after age 30; seek advice early for any foot problem if you have diabetes"
  ],
  "lifestyleAdvice": "Keep hands and feet warm with layers, gloves, and socks; avoid sudden temperature changes; and gently move regularly. Warm cold skin gradually rather than using very hot water or a radiator. Avoid smoking, and reduce caffeine if it seems to trigger attacks.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What does Raynaud's look like?",
      "answer": "During an attack, fingers or toes may become white or lighter, then blue, and may turn red as they warm again. They can feel numb, painful, or tingly. Colour changes can look different on different skin tones."
    },
    {
      "question": "How should I warm cold hands and feet?",
      "answer": "Move to a warm place and warm them slowly with dry layers. Do not put very cold hands or feet directly on a radiator or under hot water, as this can injure the skin."
    },
    {
      "question": "When should I get advice?",
      "answer": "Get advice for recurring or worsening attacks, colour change with pain or numbness, skin sores, or any new foot problem if you have diabetes. Seek emergency help for blue or grey colour with breathing or chest symptoms."
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
  tags: ["Cold Extremities", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/cold-extremities",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Cold Extremities symptom profile"]
};
