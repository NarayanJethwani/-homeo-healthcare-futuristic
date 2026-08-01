import { KnowledgeEntity } from "../../types";

export const FeverSymptom: KnowledgeEntity = {
  id: "S0004",
  slug: "fever",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Fever (Pyrexia)",
    hi: "बुखार (Fever)",
    gu: "તાાવ (Fever)",
    mr: "ताप (Fever)",
    es: "Fiebre (Pirexia)",
    ar: "الحمى (Fever)"
  },
  summary: {
    en: "Clinical triage, systemic infection differentiation, and emergency escalation for Fever under IDSA guidelines.",
    hi: "बुखार के लक्षण की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "તાાવના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "तापाचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y manejo de la fiebre según las guías IDSA.",
    ar: "التفرقة Сريرية والعلامات التحذيرية للحمى."
  },
  content: {
    definition: "Fever (Pyrexia): An elevation of body temperature above the normal circadian range (>38.0°C / 100.4°F) driven by hypothalamic thermoregulatory set-point elevation in response to endogenous pyrogens (IL-1, IL-6, TNF-alpha).",
    clinicalMeaning: "Reflects acute systemic or focal infection, autoimmune hyper-inflammation, drug hypersensitivity, or occult malignancy demanding systematic source evaluation.",
    commonCauses: [
      "Acute Viral or Bacterial Respiratory, Urinary, or GI Infection",
      "Sepsis or Bacteremia",
      "Neutropenic Fever or Central Nervous System Infection (Meningitis)",
      "Autoimmune Connective Tissue Disease or Fever of Unknown Origin (FUO)"
    ],
    differentialDiagnosis: "Differentiate acute self-limited viral pyrexia from severe sepsis, bacterial meningitis, malaria, enteric fever, and drug fever.",
    redFlags: [
      "Fever with nuchal rigidity, confusion, and petechial rash (Meningococcemia / Bacterial Meningitis)",
      "High fever with hypotension, tachycardia, tachypnea, and altered sensorium (Severe Sepsis)",
      "Neutropenic fever (absolute neutrophil count <500/mcL) in chemotherapy patients"
    ],
    lifestyleAdvice: "Ensure adequate oral fluid intake; seek immediate emergency care for high fever with stiff neck, hypotension, confusion, or recent chemotherapy.",
    references: [
      "CIT-0065",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0004-001",
        passage: "Fever accompanied by nuchal rigidity, photophobia, and altered mental status requires immediate lumbar puncture and empirical parenteral antibiotics for bacterial meningitis.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0004-002",
        passage: "High fever associated with hypotension and organ dysfunction indicates sepsis requiring emergency blood cultures and IV fluid resuscitation.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0004-003",
        passage: "Fever in an immunocompromised patient demands immediate blood cultures and empirical broad-spectrum antibiotic coverage.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0004-004",
        passage: "Homeopathic antipyretic support does not replace blood cultures, parenteral antibiotics, or emergency resuscitation in severe sepsis.",
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
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Fever", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/fever",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Fever symptom profile"]
};
