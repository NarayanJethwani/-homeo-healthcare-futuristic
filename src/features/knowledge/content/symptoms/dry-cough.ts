import { KnowledgeEntity } from "../../types";

export const DryCoughSymptom: KnowledgeEntity = {
  id: "S0007",
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
    en: "Clinical evaluation, differential diagnosis, red flag alarm features, and supportive management for Dry Cough under CHEST 2021 guidelines.",
    hi: "सूखी खांसी के लक्षण की नैदानिक समझ और चेतावनी लक्षण.",
    gu: "સૂકી ઉધરસના લક્ષણની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "कोरड्या खोकल्याच्या लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, diagnóstico diferencial y señales de alarma para la tos seca según CHEST 2021.",
    ar: "التقييم السريري وعلامات الخطر للسعال الجاف."
  },
  content: {
    definition: "Dry Cough: A non-productive cough lacking sputum production, resulting from mechanical, chemical, or inflammatory irritation of vagal afferent cough receptors in the upper or lower respiratory tract.",
    clinicalMeaning: "Reflects upper airway cough syndrome (UACS/post-nasal drip), cough-variant asthma, GERD micro-aspiration, drug-induced bronchospasm, or early interstitial lung disease.",
    commonCauses: [
      "Upper Airway Cough Syndrome (UACS), Post-Viral Airway Hyper-responsiveness",
      "Cough-Variant Asthma (CVA), Gastroesophageal Reflux Disease (GERD)",
      "ACE-Inhibitor Induced Cough (Bradykinin/Substance P Accumulation)",
      "Environmental Irritants (Tobacco smoke, pollution, occupational dusts)"
    ],
    differentialDiagnosis: "Differentiate uncomplicated dry cough from acute pulmonary embolism, pertussis, interstitial lung disease (ILD/pulmonary fibrosis), bronchogenic carcinoma, and left-sided heart failure (cardiac asthma).",
    redFlags: [
      "Hemoptysis (blood-streaked or frank bloody sputum)",
      "Unexplained dyspnea, hypoxia (SpO2 <90%), or stridor",
      "Unintentional weight loss, drenching night sweats, or hoarseness >3 weeks",
      "High fever with pleuritic chest pain or crackles on auscultation"
    ],
    lifestyleAdvice: "Maintain indoor humidity, eliminate tobacco smoke and airborne irritants, try warm honey or saline gargles, review medications with prescribing physician, and stay well hydrated.",
    references: [
      "CIT-0075",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0007-001",
        passage: "Chronic dry cough (>8 weeks duration) lacking red flags is most commonly caused by UACS, Asthma, or GERD ('the pathogenic triad').",
        citationIds: ["CIT-0075"]
      },
      {
        claimId: "CLM-S0007-002",
        passage: "ACE-inhibitor cough occurs in up to 15% of treated patients and typically resolves within 1 to 4 weeks after drug discontinuation.",
        citationIds: ["CIT-0075"]
      },
      {
        claimId: "CLM-S0007-003",
        passage: "Dry cough accompanied by hemoptysis, systemic constitutional symptoms, or smoking history warrants urgent chest radiography or CT.",
        citationIds: ["CIT-0075"]
      },
      {
        claimId: "CLM-S0007-004",
        passage: "Homeopathic supportive remedies (e.g., Drosera, Rumex, Spongia) do not replace chest imaging or pulmonology evaluation in chronic persistent cough.",
        citationIds: ["CIT-0023"]
      }
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
  tags: ["Dry Cough", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/dry-cough",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Dry Cough symptom profile"]
};
