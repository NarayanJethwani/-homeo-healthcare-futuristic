import { KnowledgeEntity } from "../../types";

export const ShortnessofBreathSymptom: KnowledgeEntity = {
  id: "S0034",
  slug: "shortness-of-breath",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Shortness of Breath",
    hi: "सांस फूलना (Shortness of Breath)",
    gu: "શ્વાસ ચડવો (Shortness of Breath)",
    mr: "श्वास घेण्यास त्रास (Shortness of Breath)",
    es: "Disnea / Dificultad Respiratoria (Shortness of Breath)",
    ar: "ضيق التنفس (Shortness of Breath)"
  },
  summary: {
    en: "Shortness of breath can have many causes, from asthma and infection to heart or lung conditions. New, severe, or worsening breathing difficulty needs urgent medical assessment.",
    hi: "सांस फूलने के लक्षण की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "શ્વાસ ચડવાના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "श्वास घेण्यास त्रासाचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y señales de emergencia de la disnea agudas.",
    ar: "التفرقة السريرية والعلامات التحذيرية لضيق التنفس."
  },
  content: {
    definition: "Shortness of Breath (Dyspnea): A subjective sensation of breathing discomfort that varies in intensity, originating from mechanical, metabolic, or gas exchange disturbances in the cardiopulmonary system.",
    clinicalMeaning: "Reflects hypoxemia, hypercapnia, bronchospasm, alveolar flooding, or impaired respiratory muscle function requiring urgent pulse oximetry and clinical triage.",
    commonCauses: [
      "Bronchial Asthma Acute Exacerbation or COPD",
      "Acute Pulmonary Embolism or Pneumothorax",
      "Acute Decompensated Heart Failure or Pulmonary Edema",
      "Pneumonia, Severe Anemia, or Anaphylaxis"
    ],
    differentialDiagnosis: "Differentiate acute upper airway obstruction, bronchial asthma, COPD exacerbation, acute heart failure, pulmonary embolism, and panic disorder.",
    redFlags: [
      "Severe resting dyspnea with accessory muscle use, cyanosis, or silent chest (Respiratory Failure)",
      "Sudden unilateral pleuritic chest pain and hyper-resonance (Tension Pneumothorax)",
      "SpO2 < 90% on room air, lethargy, or altered mental status"
    ],
    lifestyleAdvice: "Immediate emergency medical evaluation and supplemental oxygenation for acute or worsening dyspnea; avoid exertion until cardiopulmonary stability is confirmed.",
    references: [
      "CIT-0063",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0034-001",
        passage: "Acute resting dyspnea with cyanosis, silent chest, or accessory muscle work indicates impending respiratory failure requiring emergency oxygen and mechanical ventilation support.",
        citationIds: ["CIT-0063"]
      },
      {
        claimId: "CLM-S0034-002",
        passage: "Sudden onset of dyspnea with unilateral absent breath sounds and pleuritic pain suggests acute tension pneumothorax or massive pulmonary embolism.",
        citationIds: ["CIT-0063"]
      },
      {
        claimId: "CLM-S0034-003",
        passage: "Oxygen saturation below 90% on room air accompanied by confusion requires urgent emergency department transport.",
        citationIds: ["CIT-0063"]
      },
      {
        claimId: "CLM-S0034-004",
        passage: "Homeopathic supportive care does not replace emergency oxygenation, pulse oximetry, or emergency airway stabilization in acute dyspnea.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "When is shortness of breath an emergency?",
      "answer": "Call emergency services for severe difficulty breathing, blue or grey lips or skin, chest pain, fainting, confusion, or if you cannot speak in full sentences. Do not drive yourself if you are severely breathless."
    },
    {
      "question": "Can a cold or asthma cause shortness of breath?",
      "answer": "Yes. Respiratory infections and asthma can both affect breathing, but symptoms alone cannot confirm the cause. Seek prompt advice if breathlessness is new, worsening, occurs at rest, or comes with chest pain or fever."
    },
    {
      "question": "What should I do while waiting for help?",
      "answer": "Sit upright, loosen tight clothing, and follow your clinician-provided action plan if you have one, such as an asthma plan. Do not delay emergency care or use someone else's medicines."
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
  tags: ["Shortness of Breath", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/shortness-of-breath",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Shortness of Breath symptom profile"]
};
