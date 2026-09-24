import { KnowledgeEntity } from "../../types";

export const KneePainSymptom: KnowledgeEntity = {
  id: "S0014",
  slug: "knee-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Knee Pain",
    hi: "Knee Pain",
    gu: "Knee Pain",
    mr: "Knee Pain",
    es: "Knee Pain",
    ar: "Knee Pain"
  },
  summary: {
    en: "Knee pain is common after strain or injury; swelling, inability to bear weight, or a hot red knee needs faster assessment.",
    hi: "Knee Pain के लक्षण की नैदानिक समझ.",
    gu: "Knee Pain ના લક્ષણ ની સમજણ.",
    mr: "Knee Pain चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Knee Pain.",
    ar: "التعريف السريري والأهمية لـ Knee Pain."
  },
  content: {
  "definition": "Knee pain is discomfort in or around the knee joint. It can start after an injury, develop gradually, or come and go with activity.",
  "clinicalMeaning": "Common causes include a strain, overuse, arthritis, tendon irritation, or a kneecap problem. The way symptoms began, the ability to bear weight, swelling, warmth, and locking or giving way help guide the next step.",
  "commonCauses": [
    "A twist, fall, overuse, or a sprain or strain",
    "Tendon irritation from running, jumping, kneeling, or repetitive activity",
    "Osteoarthritis or another long-term joint condition",
    "Less commonly, gout, bursitis, infection, or a ligament, cartilage, or kneecap injury"
  ],
  "differentialDiagnosis": "A clinician may assess the injury mechanism, movement, stability, swelling, warmth, and whether the knee locks, clicks painfully, or gives way. A hot red joint with fever is different from a mild strain and needs urgent assessment.",
  "redFlags": [
    "Get urgent help if you cannot move the knee or bear weight, it is badly swollen or changed shape, or it locks or repeatedly gives way",
    "Seek urgent assessment for a hot, red, very painful knee with fever, chills, or feeling unwell",
    "Book a review if pain is worsening, affects normal activities, follows a significant injury, or is not improving after a few weeks"
  ],
  "lifestyleAdvice": "Reduce activities that clearly worsen pain at first, use an ice pack wrapped in a cloth for up to 20 minutes at a time, and keep gently moving within comfort. Avoid long periods of complete rest. A pharmacist can advise whether pain medicine is suitable for you.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "Should I keep moving with knee pain?",
      "answer": "For most mild strains, gentle movement helps prevent stiffness. Avoid activities that sharply increase pain and seek urgent advice if you cannot bear weight or the knee is unstable."
    },
    {
      "question": "When does a knee injury need urgent care?",
      "answer": "Seek urgent assessment if the knee is deformed, very swollen, hot and red, you cannot move it or put weight through it, or you feel unwell with fever."
    },
    {
      "question": "Is clicking always a sign of damage?",
      "answer": "No. Painless clicking can be normal. Painful clicking, locking, giving way, or a sudden injury should be assessed."
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
  tags: ["Knee Pain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/knee-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Knee Pain symptom profile"]
};
