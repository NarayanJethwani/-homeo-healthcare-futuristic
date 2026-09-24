import { KnowledgeEntity } from "../../types";

export const IndigestionSymptom: KnowledgeEntity = {
  id: "S0046",
  slug: "indigestion",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Indigestion",
    hi: "Indigestion",
    gu: "Indigestion",
    mr: "Indigestion",
    es: "Indigestion",
    ar: "Indigestion"
  },
  summary: {
    en: "Indigestion can feel like discomfort, burning, fullness, bloating, or nausea after eating. Learn common triggers, simple changes that may help, and the warning signs that need medical assessment.",
    hi: "Indigestion के लक्षण की नैदानिक समझ.",
    gu: "Indigestion ના લક્ષણ ની સમજણ.",
    mr: "Indigestion चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Indigestion.",
    ar: "التعريف السريري والأهمية لـ Indigestion."
  },
  content: {
  "definition": "Indigestion is discomfort in the upper tummy or chest that can include fullness, burning, bloating, nausea, or burping after eating.",
  "clinicalMeaning": "It is common and may be linked to reflux, certain foods or drinks, medicines, or stomach irritation. Persistent symptoms should be assessed rather than self-diagnosed.",
  "commonCauses": [
    "Gastroesophageal reflux disease (GERD)",
    "Gastritis or peptic ulcer disease",
    "Irritable Bowel Syndrome (IBS)",
    "Dietary intolerance or food allergies"
  ],
  "differentialDiagnosis": "Exclude gallstones, chronic pancreatitis, celiac disease, and acute surgical abdomen conditions.",
  "redFlags": [
    "Unexplained weight loss or persistent vomiting",
    "Difficulty swallowing (dysphagia) or gastrointestinal bleeding (melena)",
    "Severe overnight abdominal pain waking the patient"
  ],
  "lifestyleAdvice": "Try smaller meals, avoid lying down soon after eating, and notice whether particular foods, drinks, or medicines trigger symptoms. A pharmacist can advise on suitable short-term treatments.",
  "references": [
    "CIT-0017",
    "CIT-0018",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What commonly triggers indigestion?",
      "answer": "Triggers vary but can include large or fatty meals, alcohol, caffeine, smoking, stress, and some medicines. Keeping a short food-and-symptom note can help identify a pattern."
    },
    {
      "question": "When should I get medical advice?",
      "answer": "Get medical advice for difficulty swallowing, repeated vomiting, unexplained weight loss, blood in vomit or stools, black stools, severe pain, or symptoms that keep returning despite self-care."
    },
    {
      "question": "Could it be something other than indigestion?",
      "answer": "Yes. Reflux, ulcers, gallbladder problems, some medicines, and other conditions can cause similar symptoms. A clinician can help assess persistent or worrying symptoms."
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
  tags: ["Indigestion", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/indigestion",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Indigestion symptom profile"]
};
