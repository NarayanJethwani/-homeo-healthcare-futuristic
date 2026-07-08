import { KnowledgeEntity } from "../../types";

export const FlatulentColicSymptom: KnowledgeEntity = {
  id: "S0060",
  slug: "flatulent-colic",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Flatulent Colic",
    hi: "Flatulent Colic",
    gu: "Flatulent Colic",
    mr: "Flatulent Colic",
    es: "Flatulent Colic",
    ar: "Flatulent Colic"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Flatulent Colic.",
    hi: "Flatulent Colic के लक्षण की नैदानिक समझ.",
    gu: "Flatulent Colic ના લક્ષણ ની સમજણ.",
    mr: "Flatulent Colic चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Flatulent Colic.",
    ar: "التعريف السريري والأهمية لـ Flatulent Colic."
  },
  content: {
  "definition": "Flatulent colic: A subjective abdominal or digestive manifestation of altered gut motility, mucosal irritation, or secretory dysregulation.",
  "clinicalMeaning": "Indicates mucosal inflammation, smooth muscle spasm, or hyper-reactivity of the enteric nervous system.",
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
  "lifestyleAdvice": "Avoid carbonated beverages, caffeine, and highly fatty foods; chew food thoroughly, maintain vertical posture for 2 hours post-meals, and manage stress.",
  "references": [
    "CIT-0017",
    "CIT-0018",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What are the common triggers for digestive flares?",
      "answer": "Common triggers include dietary irritants (caffeine, alcohol, fatty foods), chronic emotional stress, irregular eating habits, and dysbiosis."
    },
    {
      "question": "How does the gut-brain axis affect digestive health?",
      "answer": "The gut and brain are in constant communication via the vagus nerve. Emotional stress can alter gut motility, increase visceral sensitivity, and worsen symptoms of GERD, gastritis, or IBS."
    },
    {
      "question": "Can homeopathy manage chronic acid reflux (GERD)?",
      "answer": "Yes, individualized homeopathy can help manage symptoms of chronic acid reflux by addressing digestive motility and hyperacidity alongside lifestyle modifications."
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
  tags: ["Flatulent Colic", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/flatulent-colic",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Flatulent Colic symptom profile"]
};
