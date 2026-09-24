import { KnowledgeEntity } from "../../types";

export const WaterRetentionSymptom: KnowledgeEntity = {
  id: "S0074",
  slug: "water-retention",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Water Retention",
    hi: "Water Retention",
    gu: "Water Retention",
    mr: "Water Retention",
    es: "Water Retention",
    ar: "Water Retention"
  },
  summary: {
    en: "Water retention is swelling from fluid build-up; its pattern and speed help show whether it needs urgent care.",
    hi: "Water Retention के लक्षण की नैदानिक समझ.",
    gu: "Water Retention ના લક્ષણ ની સમજણ.",
    mr: "Water Retention चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Water Retention.",
    ar: "التعريف السريري والأهمية لـ Water Retention."
  },
  content: {
  "definition": "Water retention, also called oedema, is swelling caused by fluid collecting in body tissues. It often affects the feet, ankles, legs, hands, or face.",
  "clinicalMeaning": "Mild swelling can occur after long periods sitting or standing, in pregnancy, or after a salty meal. New, sudden, one-sided, painful, or widespread swelling needs medical assessment because it can sometimes be linked to medicines, infection, a blood clot, or heart, kidney, liver, or thyroid conditions.",
  "commonCauses": [
    "Sitting or standing in one position for a long time, hot weather, or a high-salt diet",
    "Pregnancy, being overweight, varicose veins, or an injury or insect bite",
    "Some medicines, including certain blood-pressure medicines, hormones, antidepressants, and steroids",
    "Conditions affecting the heart, kidneys, liver, thyroid, veins, or lymphatic system"
  ],
  "differentialDiagnosis": "A clinician will ask where the swelling is, whether it is one-sided, how quickly it started, and whether there is pain, redness, warmth, fever, breathlessness, or a change in urine. This helps distinguish common temporary swelling from conditions needing treatment.",
  "redFlags": [
    "Seek urgent help for sudden, severe, painful, red, or hot swelling; unexplained swelling in one leg; or swelling with fever or feeling very unwell",
    "Call emergency services for swelling with chest pain, severe breathlessness, coughing blood, fainting, confusion, or a new fast or irregular heartbeat",
    "Arrange a clinical review for swelling of the face, tummy, or more than one body area, or if swelling persists or is getting worse"
  ],
  "lifestyleAdvice": "For mild ankle or foot swelling without warning signs, gentle walking, avoiding long periods in one position, raising the legs when resting, and comfortable footwear may help. Do not start diuretics, tight compression garments, or major fluid restrictions without medical advice.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Is water retention the same as gaining body fat?",
      "answer": "No. Fluid retention can cause a quick increase in weight and visible swelling. Body-fat change is usually more gradual. A clinician can help distinguish them."
    },
    {
      "question": "When is swollen ankle urgent?",
      "answer": "It is urgent if it is sudden, severe, one-sided, painful, red or hot, or if you have chest pain, breathlessness, coughing blood, fainting, or feel very unwell."
    },
    {
      "question": "Should I drink less water if I am swollen?",
      "answer": "Not unless a clinician has told you to. The right fluid intake depends on the cause, and restricting fluids on your own can be harmful."
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
  tags: ["Water Retention", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/water-retention",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Water Retention symptom profile"]
};
