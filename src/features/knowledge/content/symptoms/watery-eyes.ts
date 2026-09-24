import { KnowledgeEntity } from "../../types";

export const WateryEyesSymptom: KnowledgeEntity = {
  id: "S0039",
  slug: "watery-eyes",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Watery Eyes",
    hi: "Watery Eyes",
    gu: "Watery Eyes",
    mr: "Watery Eyes",
    es: "Watery Eyes",
    ar: "Watery Eyes"
  },
  summary: {
    en: "Watery eyes can be triggered by wind, allergy, dryness, irritation, infection, or a blocked tear drain. Pain, redness, or vision changes need timely assessment.",
    hi: "Watery Eyes के लक्षण की नैदानिक समझ.",
    gu: "Watery Eyes ના લક્ષણ ની સમજણ.",
    mr: "Watery Eyes चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Watery Eyes.",
    ar: "التعريف السريري والأهمية لـ Watery Eyes."
  },
  content: {
  "definition": "Watery eyes means tears overflow onto the face more than usual. The eye may be producing extra tears in response to irritation, or tears may not be draining normally.",
  "clinicalMeaning": "It is often temporary, but the associated symptoms matter. One-sided, persistent, painful, red, or vision-affecting watering should be assessed.",
  "commonCauses": [
    "Cold wind, smoke, dust, perfumes, or another irritant",
    "Allergy, which often causes itching as well as watering",
    "Dry eye, when irritation triggers reflex tearing",
    "Conjunctivitis, an eyelid problem, a foreign body, or a narrowed tear drain"
  ],
  "differentialDiagnosis": "A clinician or eye professional can check for allergy, infection, dry eye, eyelid changes, and tear-drain blockage. Contact-lens problems and eye injury need separate attention.",
  "redFlags": [
    "Seek urgent eye care for eye pain, marked redness, light sensitivity, reduced or changed vision, or an eye injury or chemical splash.",
    "Seek same-day advice for watering with significant swelling, pus-like discharge, or if you cannot comfortably keep the eye open.",
    "Arrange a review for persistent one-sided watering, recurrent infections, or symptoms that affect daily activities."
  ],
  "lifestyleAdvice": "Do not rub the eyes. Wash hands before touching the eye area, avoid sharing towels when infection is possible, and take a break from contact lenses if the eye is sore or red until you have professional advice. Protect eyes from wind and irritants where possible.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Why do my eyes water when they feel dry?",
      "answer": "Dryness can irritate the eye surface and trigger reflex tearing. An eye professional or pharmacist can advise if this keeps happening."
    },
    {
      "question": "How can I tell allergy from infection?",
      "answer": "Allergy often causes itching and affects both eyes. Infection can cause redness, soreness, or discharge, but symptoms overlap, so seek advice if you are unsure or symptoms are significant."
    },
    {
      "question": "When are watery eyes urgent?",
      "answer": "Pain, marked redness, light sensitivity, vision change, injury, or chemical exposure need urgent eye assessment."
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
  tags: ["Watery Eyes", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/watery-eyes",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Watery Eyes symptom profile"]
};
