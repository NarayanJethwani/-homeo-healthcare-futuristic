import { KnowledgeEntity } from "../../types";

export const ProductiveCoughSymptom: KnowledgeEntity = {
  id: "S0009",
  slug: "productive-cough",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Wet Cough (Productive Cough)",
    hi: "कफ वाली खांसी (Productive Cough)",
    gu: "કફવાળી ખાંસી (Productive Cough)",
    mr: "कफ असणारा खोकला (Productive Cough)",
    es: "Tos Productiva / Tos con Flemas (Productive Cough)",
    ar: "السعال المنتجة (Productive Cough)"
  },
  summary: {
    en: "A wet cough brings up mucus or phlegm and is often linked to a respiratory infection. Learn simple supportive measures and the signs—such as blood in phlegm or severe breathlessness—that need prompt care.",
    hi: "कफ वाली खांसी की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "કફવાળી ખાંસીના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "कफ असणाऱ्या खोकल्याचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y evaluación del esputo en tos productiva.",
    ar: "التفرقة السريرية والعلامات التحذيرية للسعال المنتج."
  },
  content: {
    definition: "Productive Cough: A respiratory defense reflex characterized by the expulsion of tracheobronchial mucus or purulent secretions from the lower respiratory tract.",
    clinicalMeaning: "Reflects bronchial mucosal hypersecretion, bacterial lower respiratory tract infection, bronchiectasis, or chronic bronchitis requiring sputum evaluation and chest imaging.",
    commonCauses: [
      "Acute Bacterial Bronchitis or Community-Acquired Pneumonia",
      "Chronic Obstructive Pulmonary Disease (COPD) Exacerbation",
      "Bronchiectasis or Pulmonary Tuberculosis",
      "Congestive Heart Failure (Pink Frothy Sputum / Pulmonary Edema)"
    ],
    differentialDiagnosis: "Differentiate acute bronchitis from pneumonia, COPD exacerbation, bronchiectasis, pulmonary tuberculosis, and lung malignancy.",
    redFlags: [
      "Hemoptysis (coughing up frank blood or rust-colored sputum)",
      "High fever with chest pain, tachypnea, and bronchial breath sounds (Pneumonia)",
      "Night sweats, unremitting weight loss, and chronic productive cough >3 weeks (Tuberculosis)"
    ],
    lifestyleAdvice: "Maintain oral hydration to thin secretions, use steam inhalation; seek immediate chest X-ray and medical care for hemoptysis, persistent high fever, or dyspnea.",
    references: [
      "CIT-0055",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0009-001",
        passage: "Hemoptysis or rust-colored sputum demands immediate chest radiography and clinical evaluation for pulmonary infection, infarction, or malignancy.",
        citationIds: ["CIT-0055"]
      },
      {
        claimId: "CLM-S0009-002",
        passage: "High fever accompanied by purulent sputum, focal pleuritic pain, and tachypnea indicates community-acquired pneumonia requiring antibiotic stewardship.",
        citationIds: ["CIT-0055"]
      },
      {
        claimId: "CLM-S0009-003",
        passage: "Chronic productive cough lasting over 3 weeks accompanied by night sweats requires sputum acid-fast bacilli (AFB) testing for tuberculosis.",
        citationIds: ["CIT-0055"]
      },
      {
        claimId: "CLM-S0009-004",
        passage: "Homeopathic supportive remedies do not replace antibiotics for bacterial pneumonia or emergency management of massive hemoptysis.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What can help a wet cough at home?",
      "answer": "Rest, fluids, and avoiding smoke can help. A warm drink with honey may soothe a cough for people over 1 year old. Ask a pharmacist before using cough medicines, especially for children, pregnancy, or long-term conditions."
    },
    {
      "question": "Does green or yellow phlegm always mean I need antibiotics?",
      "answer": "No. Mucus colour alone cannot tell whether an infection is bacterial or whether antibiotics are needed. A clinician considers the full pattern of symptoms, examination, and sometimes tests."
    },
    {
      "question": "When should I get urgent help?",
      "answer": "Seek urgent help if you cough up blood, have chest pain, severe or worsening breathlessness, confusion, blue or grey lips or skin, or feel too unwell to manage usual activities."
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
  tags: ["Productive Cough", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/productive-cough",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Productive Cough symptom profile"]
};
