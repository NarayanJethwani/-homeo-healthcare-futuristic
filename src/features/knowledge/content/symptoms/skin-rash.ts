import { KnowledgeEntity } from "../../types";

export const SkinRashSymptom: KnowledgeEntity = {
  id: "S0018",
  slug: "skin-rash",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Skin Rash: What It May Mean & When to Get Help",
    hi: "Skin Rash",
    gu: "Skin Rash",
    mr: "Skin Rash",
    es: "Skin Rash",
    ar: "Skin Rash"
  },
  summary: {
    en: "A rash is a visible change in the skin, not one single diagnosis. Learn what to notice, safe first steps, and the warning signs that need urgent medical care.",
    hi: "Skin Rash के लक्षण की नैदानिक समझ.",
    gu: "Skin Rash ના લક્ષણ ની સમજણ.",
    mr: "Skin Rash चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Skin Rash.",
    ar: "التعريف السريري والأهمية لـ Skin Rash."
  },
  content: {
  "definition": "A skin rash is a new change in skin colour, texture, or sensation. It may be itchy, sore, raised, scaly, or made up of spots or patches.",
  "clinicalMeaning": "Rashes have many possible causes, including irritation, allergy, eczema, hives, infection, or a medicine reaction. The pattern, timing, other symptoms, and where it appears all matter.",
  "commonCauses": [
    "Irritant or allergic contact with a new product, fabric, metal, plant, or medicine",
    "Eczema, psoriasis, hives, heat rash, or another inflammatory skin condition",
    "Viral, fungal, or bacterial skin infections",
    "A reaction to a medicine or a wider illness affecting the body"
  ],
  "differentialDiagnosis": "A clinician may consider eczema, hives, contact dermatitis, psoriasis, fungal infection, scabies, a medicine reaction, or a viral rash. A photograph and a timeline of new exposures can be useful.",
  "redFlags": [
    "Trouble breathing or swallowing, or swelling of the lips, tongue, eyes, or face — seek emergency care",
    "A rapidly spreading, painful, blistering, or widespread rash, especially with fever or feeling unwell",
    "Rash involving the eyes, mouth, or genital skin, or signs of infection such as pus, warmth, severe pain, or rapidly increasing swelling"
  ],
  "lifestyleAdvice": "Avoid scratching, stop a clearly irritating new product if it is safe to do so, and use gentle fragrance-free skin care. Note when the rash started, where it spread, recent medicines or exposures, and take clear photos to show a clinician if it persists.",
  "references": [
    "CIT-0002",
    "CIT-0019",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "Why do skin conditions worsen with emotional stress?",
      "answer": "Stress can make itch feel harder to manage and may coincide with flares of existing skin conditions. It does not identify the cause of a new rash, so look for other changes too."
    },
    {
      "question": "How can I prepare for a rash consultation?",
      "answer": "Take photos in good light, note when it began, list new products, foods, activities and medicines, and mention fever, pain, swelling, or breathing symptoms. This helps a clinician narrow down the cause."
    },
    {
      "question": "Can I treat every rash the same way?",
      "answer": "No. A rash is a symptom with many causes. Avoid trying several strong creams at once or delaying care for warning signs, because the right treatment depends on the cause."
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
  tags: ["Skin Rash", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/skin-rash",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Skin Rash symptom profile"]
};
