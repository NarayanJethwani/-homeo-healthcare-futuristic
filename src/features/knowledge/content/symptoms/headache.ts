import { KnowledgeEntity } from "../../types";

export const HeadacheSymptom: KnowledgeEntity = {
  id: "S0003",
  slug: "headache",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Headache (Cephalgia)",
    hi: "सिरदर्द (सेफैल्जिया)",
    gu: "માથાનો દુખાવો (Headache)",
    mr: "डोकेदुखी (Headache)",
    es: "Dolor de Cabeza (Cefalea)",
    ar: "الصداع (Headache)"
  },
  summary: {
    en: "Pain or discomfort in the head, scalp, or neck, originating from tension, vascular irritation, or neurological pathways.",
    hi: "सिर, खोपड़ी या गर्दन में दर्द या बेचैनी, जो तनाव, संवहनी जलन या न्यूरोलॉजिकल कारणों से उत्पन्न होती है.",
    gu: "માથામાં કે ગળાના ભાગમાં દુખાવો કે અસ્વસ્થતા, જે તાણ કે ન્યુરોલોજીકલ કારણોસર થાય છે.",
    mr: "डोके, कवटी किंवा मान या भागातील वेदना, ज्या मानसिक ताण किंवा रक्तवाहिन्यांच्या उत्तेजनामुळे होतात.",
    es: "Dolor o malestar en la cabeza, el cuero cabelludo o el cuello.",
    ar: "ألم أو انزعاج في الرأس أو فروة الرأس أو الرقبة."
  },
  content: {
  "definition": "Headache: A localized pain, sensory alteration, or mobility limitation originating from nerves, muscles, joints, or tendons.",
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
    specialty: "Neurology & Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Headache", "Cephalgia", "Head Pain", "Symptom", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/headache",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Headache symptom profile"]
};
