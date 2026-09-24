import { KnowledgeEntity } from "../../types";

export const DryCoughSymptom: KnowledgeEntity = {
  id: "S0107",
  slug: "dry-cough",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Dry Cough (Non-Productive Cough)",
    hi: "सूखी खांसी (Dry Cough)",
    gu: "સૂકી ઉધરસ (Dry Cough)",
    mr: "कोरडा खोकला (Dry Cough)",
    es: "Tos Seca (Dry Cough)",
    ar: "السعال الجاف (Dry Cough)"
  },
  summary: {
    en: "A dry cough brings up little or no mucus. It is often short-lived after a cold or irritation, but a persistent, worsening, or breathless cough needs assessment.",
    hi: "सूखी खांसी के लक्षण की नैदानिक समझ और चेतावनी लक्षण.",
    gu: "સૂકી ઉધરસના લક્ષણની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "कोरड्या खोकल्याच्या लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, diagnóstico diferencial y señales de alarma para la tos seca según CHEST 2021.",
    ar: "التقييم السريري وعلامات الخطر للسعال الجاف."
  },
  content: {
    definition: "A dry cough is a cough that produces little or no mucus. It may feel tickly or irritating in the throat or chest.",
    clinicalMeaning: "Most new coughs improve within three to four weeks. A dry cough can follow a viral infection or be linked to allergy, asthma, reflux, smoking, an irritant, or a medicine.",
    commonCauses: [
      "A cold, flu, COVID-19, or a cough that lingers after an infection",
      "Allergy, post-nasal drip, asthma, or reflux",
      "Smoking, vaping, air pollution, cold air, or strong-smelling irritants",
      "Some medicines, including ACE inhibitors used for blood pressure or heart conditions"
    ],
    differentialDiagnosis: "A clinician may consider the duration, smoking history, medicines, reflux, allergies, asthma symptoms, and infection signs. Persistent cough needs assessment rather than self-diagnosis.",
    redFlags: [
      "Get urgent help for severe or worsening breathing difficulty, chest pain, coughing blood, or feeling very unwell.",
      "Arrange a review for a cough lasting more than three weeks, unexplained weight loss, persistent fever, night sweats, or a hoarse voice that does not settle.",
      "Seek urgent advice sooner if you have a weakened immune system or a significant heart or lung condition."
    ],
    lifestyleAdvice: "Rest, drink fluids, avoid smoke and vaping, and speak to a pharmacist about suitable symptom relief. Honey and warm drinks may soothe adults and children over one year; do not give honey to babies. Do not stop a prescribed medicine without speaking to the prescriber.",
    references: [
      "CIT-0075",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0107-001",
        passage: "Chronic dry cough (>8 weeks duration) lacking red flags is most commonly caused by UACS, Asthma, or GERD ('the pathogenic triad').",
        citationIds: ["CIT-0075"]
      },
      {
        claimId: "CLM-S0107-002",
        passage: "ACE-inhibitor cough occurs in up to 15% of treated patients and typically resolves within 1 to 4 weeks after drug discontinuation.",
        citationIds: ["CIT-0075"]
      },
      {
        claimId: "CLM-S0107-003",
        passage: "Dry cough accompanied by hemoptysis, systemic constitutional symptoms, or smoking history warrants urgent chest radiography or CT.",
        citationIds: ["CIT-0075"]
      },
      {
        claimId: "CLM-S0107-004",
        passage: "Homeopathic supportive remedies (e.g., Drosera, Rumex, Spongia) do not replace chest imaging or pulmonology evaluation in chronic persistent cough.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "How long should a dry cough last?",
      "answer": "Most new coughs improve within three to four weeks. See a clinician if it lasts longer, is getting worse, or has warning symptoms."
    },
    {
      "question": "Could a medicine cause my cough?",
      "answer": "Some medicines, including ACE inhibitors, can cause a dry cough. Speak to the prescriber; do not stop a prescribed medicine by yourself."
    },
    {
      "question": "When is a dry cough urgent?",
      "answer": "Severe breathing difficulty, chest pain, coughing blood, or feeling very unwell needs urgent medical help."
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
  tags: ["Dry Cough", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/dry-cough",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Dry Cough symptom profile"]
};
