import { KnowledgeEntity } from "../../types";

export const ItchingSymptom: KnowledgeEntity = {
  id: "S0017",
  slug: "itching",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Itching",
    hi: "Itching",
    gu: "Itching",
    mr: "Itching",
    es: "Itching",
    ar: "Itching"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Itching.",
    hi: "Itching के लक्षण की नैदानिक समझ.",
    gu: "Itching ના લક્ષણ ની સમજણ.",
    mr: "Itching चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Itching.",
    ar: "التعريف السريري والأهمية لـ Itching."
  },
  content: {
  "definition": "Itching: A subjective or visible skin manifestation representing cutaneous inflammation, epidermal barrier damage, or localized histamine release.",
  "clinicalMeaning": "Reflects localized capillary dilation, dermal infiltration by inflammatory cells, or nerve fiber excitation causing pruritus.",
  "commonCauses": [
    "Atopic eczema or contact allergy",
    "Psoriasis or seborrheic dermatitis",
    "Urticarial histamine reactions",
    "Local infections or sweat duct occlusion"
  ],
  "differentialDiagnosis": "Differentiate from scabies infestation, drug eruptions, cutaneous lymphoma, and viral exanthems.",
  "redFlags": [
    "Rapidly spreading rash with fever or systemic toxicity",
    "Signs of secondary bacterial infection (pus, warmth, severe pain)",
    "Erythroderma involving >90% of the body surface area"
  ],
  "lifestyleAdvice": "Use gentle soap-free cleansers, keep skin moisturized, avoid hot water, and identify and avoid trigger substances.",
  "references": [
    "CIT-0002",
    "CIT-0019",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "Why do skin conditions worsen with emotional stress?",
      "answer": "Stress releases cortisol and pro-inflammatory cytokines, which compromise the skin barrier and activate immune pathways, triggering flares of eczema, psoriasis, or acne."
    },
    {
      "question": "Are topical steroids the only treatment for eczema?",
      "answer": "No. While topical steroids manage acute flare inflammation, long-term care requires barrier repair (emollients), trigger identification, and systemic constitutional support."
    },
    {
      "question": "How does homeopathy approach skin diseases?",
      "answer": "Homeopathy views skin eruptions as outward manifestations of internal systemic imbalance. Treatment focuses on systemic immunomodulation and constitutional remedies rather than purely suppressing symptoms."
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
  tags: ["Itching", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/itching",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Itching symptom profile"]
};
