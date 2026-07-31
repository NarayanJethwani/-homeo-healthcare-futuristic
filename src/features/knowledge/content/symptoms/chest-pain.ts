import { KnowledgeEntity } from "../../types";

export const ChestPainSymptom: KnowledgeEntity = {
  id: "S0035",
  slug: "chest-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Chest Pain",
    hi: "छाती में दर्द (Chest Pain)",
    gu: "છાતીમાં દુખાવો (Chest Pain)",
    mr: "छातीत दुखणे (Chest Pain)",
    es: "Dolor Torácico (Chest Pain)",
    ar: "ألم الصدر (Chest Pain)"
  },
  summary: {
    en: "Clinical triage, emergency differentiation, and supportive management of Chest Pain under ACC/AHA 2021 standards.",
    hi: "Chest Pain के लक्षण की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "Chest Pain ના લક્ષણ ની સમજણ અને એટોમિક ઇમરજન્સી ફ્લેગ્સ.",
    mr: "Chest Pain चे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y señales de emergencia del dolor torácico.",
    ar: "التفرقة السريرية والعلامات التحذيرية لألم الصدر."
  },
  content: {
    definition: "Chest Pain: A sensory symptom originating from visceral (cardiac, esophageal, vascular) or somatic (musculoskeletal, dermatomal) pain pathways, ranging from benign muscle strain to life-threatening acute coronary syndrome.",
    clinicalMeaning: "Reflects myocardial ischemia, aortic wall shear, pulmonary artery obstruction, intercostal strain, or reflux esophagitis requiring systematic risk stratification.",
    commonCauses: [
      "Acute Coronary Syndrome (Unstable Angina, Myocardial Infarction)",
      "Aortic Dissection or Pulmonary Embolism",
      "Gastroesophageal Reflux Disease (GERD) or Esophageal Spasm",
      "Costochondritis, Intercostal Strain, or Anxiety/Panic Episode"
    ],
    differentialDiagnosis: "Differentiate acute cardiac ischemia from pulmonary embolism, tension pneumothorax, aortic dissection, GERD, and musculoskeletal chest wall pain.",
    redFlags: [
      "Crushing substernal pressure radiating to jaw, neck, or left arm with diaphoresis (ACS)",
      "Tearing mid-scapular back pain with blood pressure asymmetry (Aortic Dissection)",
      "Sudden dyspnea, pleuritic chest pain, and hemoptysis (Pulmonary Embolism)"
    ],
    lifestyleAdvice: "Immediate 911 / emergency transport for severe or crushing chest pain; avoid physical exertion until cardiac causes are ruled out by ECG and high-sensitivity troponin.",
    references: [
      "CIT-0062",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0035-001",
        passage: "Substernal chest pressure radiating to the jaw, neck, or left arm accompanied by cold sweats requires immediate emergency triage for Acute Coronary Syndrome.",
        citationIds: ["CIT-0062"]
      },
      {
        claimId: "CLM-S0035-002",
        passage: "Tearing interscapular back pain with pulse or blood pressure disparity between arms is a classic red flag for Acute Aortic Dissection.",
        citationIds: ["CIT-0062"]
      },
      {
        claimId: "CLM-S0035-003",
        passage: "Sudden onset of dyspnea, pleuritic chest pain, and tachycardia requires urgent evaluation for Pulmonary Embolism.",
        citationIds: ["CIT-0062"]
      },
      {
        claimId: "CLM-S0035-004",
        passage: "Homeopathic supportive care does not replace emergency cardiac evaluation, 12-lead ECG, or troponin testing in acute chest pain.",
        citationIds: ["CIT-0023"]
      }
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
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Chest Pain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/chest-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Chest Pain symptom profile"]
};
