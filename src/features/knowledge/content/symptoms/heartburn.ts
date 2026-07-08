import { KnowledgeEntity } from "../../types";

export const HeartburnSymptom: KnowledgeEntity = {
  id: "S0001",
  slug: "heartburn",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Heartburn / Acid Regurgitation",
    hi: "छाती में जलन / खट्टा पानी आना",
    gu: "છાતીમાં બળતરા / એસિડિટી",
    mr: "छातीत जळजळ / आम्लपित्त",
    es: "Acidez / Regurgitación Ácida",
    ar: "حرقة المعدة / الارتجاع الحمضي"
  },
  summary: {
    en: "A burning sensation in the chest, behind the breastbone, often rising towards the throat, caused by stomach acid irritation.",
    hi: "छाती के पीछे होने वाली जलन जो गले की तरफ ऊपर चढ़ती है, यह पेट के एसिड के कारण होती है.",
    gu: "છાતીના વચ્ચેના ભાગમાં બળતરા થવી જે ઘણીવાર ગળા સુધી પહોંચે છે, જે એસિડિટીને કારણે થાય છે.",
    mr: "छातीत जळजळ होणे, जी सहसा घशाकडे वर सरकते, पोटातील आम्लतेमुळे होते.",
    es: "Una sensación de ardor en el pecho, detrás del esternón, que a menudo sube hacia la garganta.",
    ar: "شعور بالحرقان في الصدر، خلف عظم الصدر، وغالبًا ما يرتفع نحو الحلق."
  },
  content: {
  "definition": "Heartburn: A subjective abdominal or digestive manifestation of altered gut motility, mucosal irritation, or secretory dysregulation.",
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
    specialty: "Gastroenterology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Heartburn", "Acid Reflux", "Acidity", "Stomach Pain", "Burning"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/heartburn",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Heartburn symptom profile"]
};
