import { KnowledgeEntity } from "../../types";

export const SneezingSymptom: KnowledgeEntity = {
  id: "S0038",
  slug: "sneezing",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Sneezing",
    hi: "Sneezing",
    gu: "Sneezing",
    mr: "Sneezing",
    es: "Sneezing",
    ar: "Sneezing"
  },
  summary: {
    en: "Sneezing is a protective reflex that clears irritants from the nose. Repeated sneezing is often linked to allergy, a cold, or an irritant.",
    hi: "Sneezing के लक्षण की नैदानिक समझ.",
    gu: "Sneezing ના લક્ષણ ની સમજણ.",
    mr: "Sneezing चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Sneezing.",
    ar: "التعريف السريري والأهمية لـ Sneezing."
  },
  content: {
  "definition": "Sneezing is a sudden, forceful release of air through the nose and mouth. It is a normal reflex when the inside of the nose is irritated.",
  "clinicalMeaning": "Short spells are common. A pattern with itching, watery eyes, and a clear runny nose suggests allergy, while a sore throat, aches, or fever can point to an infection.",
  "commonCauses": [
    "Allergic rhinitis, including seasonal hay fever",
    "A viral cold or another upper respiratory infection",
    "Dust, smoke, perfume, cold air, or another nasal irritant",
    "Less commonly, non-allergic rhinitis or a medicine effect"
  ],
  "differentialDiagnosis": "The timing and associated symptoms help: allergies often recur with a trigger and itch, while colds normally improve within one to two weeks. A clinician can assess severe, persistent, or unclear symptoms.",
  "redFlags": [
    "Seek urgent help for trouble breathing, facial or throat swelling, widespread hives, or feeling faint after an exposure—these can be signs of a severe allergic reaction.",
    "Arrange a review for persistent symptoms that disturb sleep or daily life, repeated sinus pain, wheeze, or symptoms not responding to pharmacy advice.",
    "Seek advice for a child, pregnancy, or long-term condition before using over-the-counter treatments."
  ],
  "lifestyleAdvice": "Avoid known triggers where practical. During pollen season, shower and change after being outside, keep windows closed when pollen is high, and do not smoke. A pharmacist can advise on antihistamines, saline sprays, and suitable nasal treatments.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "How can I tell allergy from a cold?",
      "answer": "Allergy often causes itching, repeated sneezing, and watery eyes after a trigger. A cold is more likely to include sore throat, feeling unwell, and improvement within one to two weeks."
    },
    {
      "question": "Can sneezing be related to asthma?",
      "answer": "Allergic rhinitis and asthma can occur together. Wheeze, cough, chest tightness, or breathlessness should be discussed with a clinician."
    },
    {
      "question": "When is sneezing an emergency?",
      "answer": "Trouble breathing, swelling of the face or throat, widespread hives, or faintness after an exposure needs emergency help."
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
  tags: ["Sneezing", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/sneezing",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Sneezing symptom profile"]
};
