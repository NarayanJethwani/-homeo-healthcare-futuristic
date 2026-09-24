import { KnowledgeEntity } from "../../types";

export const HalitosisSymptom: KnowledgeEntity = {
  id: "S0057",
  slug: "halitosis",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Halitosis",
    hi: "Halitosis",
    gu: "Halitosis",
    mr: "Halitosis",
    es: "Halitosis",
    ar: "Halitosis"
  },
  summary: {
    en: "Bad breath, also called halitosis, is common and usually comes from the mouth. Persistent bad breath may need a dental check.",
    hi: "Halitosis के लक्षण की नैदानिक समझ.",
    gu: "Halitosis ના લક્ષણ ની સમજણ.",
    mr: "Halitosis चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Halitosis.",
    ar: "التعريف السريري والأهمية لـ Halitosis."
  },
  content: {
  "definition": "Halitosis is an unpleasant smell on the breath. It is usually related to bacteria and food debris in the mouth, teeth, gums, or tongue.",
  "clinicalMeaning": "Persistent bad breath can be a sign of gum disease, tooth decay, dry mouth, tonsillitis, reflux, or another issue needing dental or medical care.",
  "commonCauses": [
    "Plaque on teeth or tongue, gum disease, tooth decay, or a dental infection",
    "Dry mouth, smoking, alcohol, fasting, or strong-smelling foods and drinks",
    "Tonsillitis, acid reflux, or another nose, throat, or digestive condition",
    "Poorly cleaned dentures"
  ],
  "differentialDiagnosis": "A dentist can check teeth, gums, tongue, and dentures. If oral causes are excluded or there are other symptoms, medical assessment may be appropriate.",
  "redFlags": [
    "See a dentist for bad breath that persists after several weeks of good oral care, or for toothache, painful or bleeding gums, swollen gums, loose adult teeth, or denture problems.",
    "Seek urgent dental or medical advice for facial swelling, fever, severe mouth pain, trouble swallowing, or breathing difficulty.",
    "A mouth ulcer, lump, or red or white patch lasting more than three weeks should be checked."
  ],
  "lifestyleAdvice": "Brush teeth and gums twice daily with fluoride toothpaste, clean between teeth daily, gently clean the tongue, keep dentures clean and out at night, drink water, and avoid smoking. Regular dental check-ups help prevent oral causes.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Is bad breath usually from the stomach?",
      "answer": "Usually not. Most bad breath starts in the mouth, from teeth, gums, tongue coating, dry mouth, or dentures."
    },
    {
      "question": "What oral care helps?",
      "answer": "Brush teeth and gums twice daily, clean between teeth daily, clean the tongue gently, and attend regular dental checks."
    },
    {
      "question": "When should I see a dentist?",
      "answer": "See a dentist if bad breath does not improve after a few weeks of good oral care or you have tooth, gum, or denture symptoms."
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
  tags: ["Halitosis", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/halitosis",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Halitosis symptom profile"]
};
