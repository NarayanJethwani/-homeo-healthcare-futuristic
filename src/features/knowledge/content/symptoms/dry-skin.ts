import { KnowledgeEntity } from "../../types";

export const DrySkinSymptom: KnowledgeEntity = {
  id: "S0066",
  slug: "dry-skin",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Dry Skin: Causes, Itch & Everyday Care",
    hi: "Dry Skin",
    gu: "Dry Skin",
    mr: "Dry Skin",
    es: "Dry Skin",
    ar: "Dry Skin"
  },
  summary: {
    en: "Dry skin can feel rough, flaky, tight or itchy. Learn practical ways to support the skin barrier and when ongoing dryness needs medical advice.",
    hi: "Dry Skin के लक्षण की नैदानिक समझ.",
    gu: "Dry Skin ના લક્ષણ ની સમજણ.",
    mr: "Dry Skin चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Dry Skin.",
    ar: "التعريف السريري والأهمية لـ Dry Skin."
  },
  content: {
  "definition": "Dry skin happens when the outer layer of skin loses too much water and protective oil. It can look flaky or ashy and may feel rough, tight or itchy.",
  "clinicalMeaning": "Dryness is common and often improves with gentle skin care. It can also occur alongside conditions such as eczema or psoriasis, so a persistent or painful change is worth discussing with a clinician.",
  "commonCauses": [
    "Low-humidity weather, indoor heating, frequent hot showers, or harsh soaps and fragrances",
    "Ageing skin, frequent handwashing, and irritation from products or fabrics",
    "Skin conditions such as eczema, psoriasis, or contact dermatitis",
    "Some medicines or underlying health conditions, particularly when dryness is new or severe"
  ],
  "differentialDiagnosis": "Dry skin can overlap with eczema, contact dermatitis, psoriasis, fungal infection, or a medicine-related reaction. A clinician can help when the pattern is recurrent, widespread, or unclear.",
  "redFlags": [
    "Painful cracks, bleeding, open skin, or signs of infection such as pus, warmth, or worsening swelling",
    "Dryness with a rapidly spreading rash, fever, or feeling generally unwell",
    "Persistent, worsening, or widespread dryness that does not improve with gentle self-care"
  ],
  "lifestyleAdvice": "Use short warm—not hot—showers, pat skin dry, and apply a fragrance-free cream or ointment while skin is still slightly damp. Choose gentle cleansers and avoid products that sting or leave skin feeling tight.",
  "references": [
    "CIT-0002",
    "CIT-0019",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "Why do skin conditions worsen with emotional stress?",
      "answer": "Stress can make it harder to keep up with sleep and skin-care routines, and some people notice more itching or flares during stressful periods. Tracking patterns can help you discuss them with a clinician."
    },
    {
      "question": "When should I seek advice about dry skin?",
      "answer": "Seek advice if dryness is painful, cracked, bleeding, infected-looking, widespread, or does not improve after a consistent gentle moisturising routine. It may be a sign of a skin condition that needs a tailored plan."
    },
    {
      "question": "Can I keep using a product that stings?",
      "answer": "Stop using a product that repeatedly stings, burns, or worsens the dryness, and choose a gentle fragrance-free alternative. Ask a clinician or pharmacist if you are unsure what to use."
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
  tags: ["Dry Skin", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/dry-skin",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Dry Skin symptom profile"]
};
