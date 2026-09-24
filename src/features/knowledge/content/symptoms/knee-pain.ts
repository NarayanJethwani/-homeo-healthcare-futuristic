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
    en: "Knee pain can follow an injury, strain, or a condition such as osteoarthritis. Find simple ways to ease symptoms and the signs—such as inability to bear weight or a hot swollen knee—that need urgent advice.",
    hi: "Knee Pain के लक्षण की नैदानिक समझ.",
    gu: "Knee Pain ના લક્ષણ ની સમજણ.",
    mr: "Knee Pain चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Knee Pain.",
    ar: "التعريف السريري والأهمية لـ Knee Pain."
  },
  content: {
  "definition": "Knee pain is discomfort, stiffness, swelling, or reduced movement in or around the knee joint.",
  "clinicalMeaning": "It can result from an injury, overuse, osteoarthritis, inflammation, or less commonly infection. The pattern of pain, swelling, and ability to bear weight helps guide next steps.",
  "commonCauses": [
    "A strain, sprain, tendon problem, or overuse injury",
    "Osteoarthritis or other joint wear-and-tear",
    "Cartilage or ligament injury after twisting or impact",
    "Inflammation, gout, or joint infection"
  ],
  "differentialDiagnosis": "A clinician may consider injury, osteoarthritis, inflammatory arthritis, gout, infection, or pain referred from the hip or back.",
  "redFlags": [
    "A very painful knee that cannot move or bear weight",
    "A badly swollen knee, a changed shape, or locking or giving way after injury",
    "A hot, red, swollen knee with fever or feeling generally unwell"
  ],
  "lifestyleAdvice": "Reduce weight-bearing briefly if it is painful, use a wrapped cold pack for up to 20 minutes at a time, and return to gentle movement as symptoms allow. Ask a clinician or physiotherapist about exercises that suit the cause of your pain.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What can I do for knee pain at home?",
      "answer": "Avoid activities that make pain worse, use a cold pack wrapped in a towel for short periods, and consider pain relief that is safe for you. A pharmacist can help you choose an option."
    },
    {
      "question": "When should I get urgent help for knee pain?",
      "answer": "Get urgent advice if you cannot move the knee or bear weight, it is badly swollen or changed shape, it locks or gives way, or it is hot, red, swollen, and you have a fever or feel unwell."
    },
    {
      "question": "Could knee pain be osteoarthritis?",
      "answer": "Osteoarthritis is one common cause, especially when pain and stiffness build gradually and affect activity. A clinician can help confirm the cause and discuss exercise, weight management, pain relief, and other support."
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
