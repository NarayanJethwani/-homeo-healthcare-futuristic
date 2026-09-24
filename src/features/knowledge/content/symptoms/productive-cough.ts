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
    en: "A productive or wet cough brings up mucus. It often accompanies a respiratory infection, but blood, chest pain, breathlessness, or a persistent cough needs medical assessment.",
    hi: "कफ वाली खांसी की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "કફવાળી ખાંસીના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "कफ असणाऱ्या खोकल्याचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y evaluación del esputo en tos productiva.",
    ar: "التفرقة السريرية والعلامات التحذيرية للسعال المنتج."
  },
  content: {
    definition: "A productive cough is a cough that brings up mucus, also called phlegm or sputum. Coughing helps clear mucus and irritants from the airways.",
    clinicalMeaning: "Mucus can occur with a cold or chest infection, but the duration, amount, colour, blood, fever, chest pain, and breathing symptoms determine whether you need assessment.",
    commonCauses: [
      "A cold, flu, COVID-19, or other respiratory infection",
      "Bronchitis, pneumonia, asthma, COPD, or another lung condition",
      "Mucus dripping from the nose or sinuses into the throat",
      "Smoking or long-term airway disease"
    ],
    differentialDiagnosis: "A clinician may listen to the chest, review symptoms and health history, and arrange a mucus sample, chest X-ray, or breathing test if needed.",
    redFlags: [
      "Get urgent advice for yellow or green mucus with chest pain, shortness of breath, high fever, or a rapidly worsening cough.",
      "Any blood in phlegm should be checked urgently; more than a few streaks, or blood with breathing difficulty or chest pain, is an emergency.",
      "Arrange a review for a cough lasting more than three weeks, repeated daily phlegm, weight loss, night sweats, or worsening symptoms with an existing lung condition."
    ],
    lifestyleAdvice: "Rest, drink fluids to help loosen mucus, avoid smoke and vaping, and raise your head slightly when resting if this makes breathing easier. A pharmacist can advise on symptom relief; antibiotics are not needed for every cough and should only be used when prescribed.",
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
      "question": "Does coloured phlegm always mean I need antibiotics?",
      "answer": "No. Mucus colour alone cannot tell whether antibiotics are needed. A clinician considers the full pattern of symptoms and examination."
    },
    {
      "question": "What should I do if I see blood in phlegm?",
      "answer": "Even small streaks of blood should be assessed urgently. Call emergency services for more than a few streaks, or blood with chest pain, rapid heartbeat, or breathing difficulty."
    },
    {
      "question": "When should a wet cough be checked?",
      "answer": "Seek advice for chest pain, breathlessness, high fever, blood, a cough lasting more than three weeks, or symptoms that are getting worse."
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
