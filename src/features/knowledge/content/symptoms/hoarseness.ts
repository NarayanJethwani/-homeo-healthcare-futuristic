import { KnowledgeEntity } from "../../types";

export const HoarsenessSymptom: KnowledgeEntity = {
  id: "S0033",
  slug: "hoarseness",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Hoarseness",
    hi: "Hoarseness",
    gu: "Hoarseness",
    mr: "Hoarseness",
    es: "Hoarseness",
    ar: "Hoarseness"
  },
  summary: {
    en: "A hoarse or croaky voice often follows a cold or voice strain; a persistent voice change should be checked.",
    hi: "Hoarseness के लक्षण की नैदानिक समझ.",
    gu: "Hoarseness ના લક્ષણ ની સમજણ.",
    mr: "Hoarseness चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Hoarseness.",
    ar: "التعريف السريري والأهمية لـ Hoarseness."
  },
  content: {
  "definition": "Hoarseness is a change in how the voice sounds. It may seem croaky, rough, breathy, weak, strained, or quieter than usual.",
  "clinicalMeaning": "A short-lived hoarse voice is commonly caused by laryngitis after a cold, voice overuse, or irritation. Reflux, allergies, smoking, inhalers, and other conditions can also contribute. A voice that remains altered for more than 3 weeks needs a GP assessment.",
  "commonCauses": [
    "Viral laryngitis linked to a cold or flu",
    "Voice overuse, shouting, singing, or frequent throat-clearing",
    "Acid reflux, allergies, smoke, dust, dry air, alcohol, or caffeine",
    "Some medicines or, less commonly, a condition affecting the voice box"
  ],
  "differentialDiagnosis": "A clinician will ask how long the change has lasted, whether it is constant, your voice demands, smoking and alcohol history, reflux symptoms, coughing, swallowing symptoms, neck lumps, and medicines. An ENT specialist may examine the voice box if needed.",
  "redFlags": [
    "Call emergency services for difficulty breathing, or urgent care if swallowing is very painful or difficult",
    "Book a GP appointment if hoarseness lasts more than 3 weeks, keeps returning, or is getting worse",
    "Seek prompt advice for a voice change with coughing blood, a neck lump, unintentional weight loss, severe pain, or a history of smoking"
  ],
  "lifestyleAdvice": "Rest the voice where possible, sip fluids, avoid smoking and smoky or dusty places, and reduce throat-clearing. Do not whisper or speak loudly because both can strain the voice. Address reflux symptoms with a clinician or pharmacist if they are frequent.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "How long does laryngitis usually last?",
      "answer": "A typical viral laryngitis often improves within 1 to 2 weeks. If your voice has not returned to normal after 3 weeks, arrange a GP review."
    },
    {
      "question": "Should I whisper to rest my voice?",
      "answer": "No. Whispering can strain the voice box. Speak gently only when needed and avoid shouting or prolonged talking while recovering."
    },
    {
      "question": "Can reflux cause hoarseness?",
      "answer": "Yes. Acid reaching the throat can irritate the voice box. Mention heartburn, sour taste, or symptoms worse after meals or lying down to a clinician."
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
  tags: ["Hoarseness", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/hoarseness",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Hoarseness symptom profile"]
};
