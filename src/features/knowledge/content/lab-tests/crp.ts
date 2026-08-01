import { KnowledgeEntity } from "../../types";

export const CRPLabTest: KnowledgeEntity = {
  id: "L0004",
  slug: "crp",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "C-Reactive Protein (CRP / hs-CRP)",
    hi: "सी-रिएक्टिव प्रोटीन (CRP)",
    gu: "સી-રિએક્ટિવ પ્રોટીન (CRP)",
    mr: "सी-रिएक्टिव्ह प्रोटीन (CRP)",
    es: "Proteína C Reactiva (PCR / hs-CRP)",
    ar: "البروتين المتفاعل سي (CRP)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, hs-CRP cardiovascular risk stratification, and bacterial sepsis evaluation for C-Reactive Protein (CRP).",
    hi: "सीआरपी (CRP) सूजन और संक्रमण संबंधी लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "CRP લેબોરેટરી ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "CRP लॅब टेस्टची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y estratificación de riesgo cardiovascular de la proteína C reactiva.",
    ar: "التفسير السريري والنطاق المرجعي للبروتين المتفاعل سي."
  },
  content: {
    overview: "C-Reactive Protein (CRP): An acute-phase pentraxin reactant protein synthesized rapidly by hepatocytes in response to interleukin-6 (IL-6) stimulation during acute inflammation, bacterial infection, or tissue necrosis.",
    normalRange: "Standard CRP: <3.0 mg/L (<0.3 mg/dL); High-Sensitivity hs-CRP (Cardiovascular Risk): Low Risk <1.0 mg/L, Average Risk 1.0 - 3.0 mg/L, High Risk >3.0 mg/L.",
    highValues: [
      "Severe Bacterial Sepsis / Bacteremia (>100 mg/L)",
      "Acute Pyogenic Infections (Pneumonia, Osteomyelitis, Appendicitis, Abscess)",
      "Active Autoimmune Flares (Rheumatoid Arthritis, IBD, Vasculitis), Acute Myocardial Infarction"
    ],
    lowValues: [
      "Normal Physiological State (Absence of acute systemic inflammation)",
      "Severe Hepatic Failure (Impaired Hepatic Protein Synthesis Capacity)"
    ],
    clinicalInterpretation: "Marked CRP elevation (>100 mg/L) strongly points to acute invasive bacterial infection or severe tissue trauma; rapid CRP drops correlate with clinical response to effective therapy.",
    references: [
      "CIT-0004",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0003-001",
        passage: "Standard CRP levels >100 mg/L are highly specific for severe bacterial infection, sepsis, or major systemic tissue injury.",
        citationIds: ["CIT-0004"]
      },
      {
        claimId: "CLM-L0003-002",
        passage: "High-sensitivity CRP (hs-CRP) levels >3.0 mg/L in asymptomatic individuals serve as an independent biomarker for elevated atherogenic cardiovascular event risk.",
        citationIds: ["CIT-0004"]
      },
      {
        claimId: "CLM-L0003-003",
        passage: "CRP rises rapidly within 6-12 hours of inflammatory onset and has a short half-life (~19 hours), making it superior to ESR for serial monitoring of treatment response.",
        citationIds: ["CIT-0004"]
      },
      {
        claimId: "CLM-L0003-004",
        passage: "Homeopathic supportive remedies do not substitute for emergency IV antibiotic therapy or surgical source control in acute septic CRP elevations.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What is a constitutional remedy in homeopathy?",
      "answer": "A constitutional remedy is a deep-acting medicine selected to match a patient's overall physical, mental, and emotional makeup, rather than just treating a single local symptom."
    },
    {
      "question": "Why does the homeopath ask so many detailed questions?",
      "answer": "To find the individualized remedy, the homeopath must understand all unique characteristics—such as sleep patterns, thermal sensitivities, food cravings, and emotional triggers."
    },
    {
      "question": "How should homeopathic remedies be stored?",
      "answer": "Remedies should be stored in a cool, dry place, away from direct sunlight, strong odors (like camphor, perfumes), and electronic devices to maintain their potency."
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
    specialty: "Clinical Pathology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["CRP", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/crp",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of CRP test guidelines"]
};
