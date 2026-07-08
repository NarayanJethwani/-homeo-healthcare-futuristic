import { KnowledgeEntity } from "../../types";

export const WheezingSymptom: KnowledgeEntity = {
  id: "S0069",
  slug: "wheezing",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Wheezing",
    hi: "Wheezing",
    gu: "Wheezing",
    mr: "Wheezing",
    es: "Wheezing",
    ar: "Wheezing"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Wheezing.",
    hi: "Wheezing के लक्षण की नैदानिक समझ.",
    gu: "Wheezing ના લક્ષણ ની સમજણ.",
    mr: "Wheezing चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Wheezing.",
    ar: "التعريف السريري والأهمية لـ Wheezing."
  },
  content: {
  "definition": "Wheezing: A subjective or objective upper or lower airway manifestation indicating mucosal congestion, irritation, or bronchospasm.",
  "clinicalMeaning": "Replects airway smooth muscle contraction, goblet cell hypersecretion, or trigeminal nerve irritation in the nasal mucosa.",
  "commonCauses": [
    "Allergic rhinitis or seasonal hay fever",
    "Bronchial asthma or hyper-reactivity",
    "Sinusitis or post-nasal drip",
    "Viral respiratory tract infections"
  ],
  "differentialDiagnosis": "Exclude foreign body aspiration, vocal cord paralysis, post-viral airway hyper-responsiveness, and cardiac asthma.",
  "redFlags": [
    "Severe respiratory distress with accessory muscle use",
    "Stridor, wheezing that suddenly stops (silent chest), or cyanosis",
    "High fever with foul-smelling nasal discharge and facial swelling"
  ],
  "lifestyleAdvice": "Keep windows closed during high pollen seasons, wash bedding weekly at 60°C, and stay hydrated to thin mucus secretions.",
  "references": [
    "CIT-0020",
    "CIT-0021",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What is the difference between allergic rhinitis and a common cold?",
      "answer": "Allergic rhinitis is an IgE-mediated immune response triggered by allergens (pollen, dust), presenting with itchy eyes, sneezing, and clear watery discharge. A cold is a viral infection, usually presenting with thicker discharge, throat irritation, and sometimes a low-grade fever."
    },
    {
      "question": "Can untreated allergies lead to asthma?",
      "answer": "Yes. The 'atopic march' describes how upper airway allergic inflammation (allergic rhinitis) can progress to involve the lower airways, triggering asthma in susceptible individuals."
    },
    {
      "question": "How does homeopathy support respiratory allergies?",
      "answer": "Homeopathic remedies aim to reduce the body's hyper-reactivity to environmental allergens and strengthen mucosal defenses, using acute and deep-acting constitutional remedies."
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
  tags: ["Wheezing", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/wheezing",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Wheezing symptom profile"]
};
