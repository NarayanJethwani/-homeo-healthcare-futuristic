import { KnowledgeEntity } from "../../types";

export const NasalCongestionSymptom: KnowledgeEntity = {
  id: "S0037",
  slug: "nasal-congestion",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Nasal Congestion",
    hi: "Nasal Congestion",
    gu: "Nasal Congestion",
    mr: "Nasal Congestion",
    es: "Nasal Congestion",
    ar: "Nasal Congestion"
  },
  summary: {
    en: "Nasal congestion is a blocked or stuffy nose caused by swelling inside the nose. Colds and allergies are common causes, but persistent one-sided blockage should be assessed.",
    hi: "Nasal Congestion के लक्षण की नैदानिक समझ.",
    gu: "Nasal Congestion ના લક્ષણ ની સમજણ.",
    mr: "Nasal Congestion चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Nasal Congestion.",
    ar: "التعريف السريري والأهمية لـ Nasal Congestion."
  },
  content: {
  "definition": "Nasal congestion is the feeling that airflow through one or both nostrils is reduced because the lining inside the nose is swollen or mucus is present.",
  "clinicalMeaning": "It is usually short-lived with a cold or allergy. The pattern—seasonal, sudden, one-sided, or persistent—helps distinguish likely causes and when assessment is useful.",
  "commonCauses": [
    "A viral cold or another upper respiratory infection",
    "Allergy to pollen, dust mites, animals, mould, or an irritant",
    "Non-allergic rhinitis triggered by temperature changes, smoke, or strong smells",
    "Sinus inflammation, a medicine effect, or a structural nasal problem"
  ],
  "differentialDiagnosis": "A clinician may consider allergy, infection, sinus disease, medication overuse, nasal polyps, or a structural cause. A blocked nose caused by decongestant overuse needs a different approach.",
  "redFlags": [
    "Seek urgent help for severe breathing difficulty, swelling of the face or throat, severe headache with neck stiffness, or eye swelling or vision changes.",
    "Arrange a review for one-sided blockage that persists, repeated nosebleeds, reduced sense of smell that does not recover, facial pain or swelling, or symptoms lasting several weeks.",
    "Get advice before using a decongestant if you are pregnant, have heart disease, high blood pressure, glaucoma, or take regular medicines."
  ],
  "lifestyleAdvice": "Rest, drink fluids, avoid smoke and known triggers, and consider saline spray or rinse. A pharmacist can advise on allergy treatments or a short course of nasal decongestant; do not use decongestant sprays for longer than the product guidance because they can make blockage worse.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Is a blocked nose always a cold?",
      "answer": "No. Allergy, irritants, sinus inflammation, medicines, and structural nasal problems can also cause congestion."
    },
    {
      "question": "Can I use a nasal decongestant spray?",
      "answer": "A pharmacist can advise whether it is suitable. These sprays should only be used for the short period in the product instructions because longer use can worsen congestion."
    },
    {
      "question": "When should a blocked nose be checked?",
      "answer": "Seek advice for persistent one-sided blockage, recurring nosebleeds, facial pain or swelling, or symptoms that do not settle."
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
  tags: ["Nasal Congestion", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/nasal-congestion",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Nasal Congestion symptom profile"]
};
