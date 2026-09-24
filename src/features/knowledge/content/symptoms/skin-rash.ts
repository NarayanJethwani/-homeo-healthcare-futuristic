import { KnowledgeEntity } from "../../types";

export const SkinRashSymptom: KnowledgeEntity = {
  id: "S0018",
  slug: "skin-rash",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T00:00:00Z",
    reviewed: "2026-09-24T00:00:00Z"
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
  definition: "A skin rash is a new change in the colour, texture or feeling of the skin. It may be itchy, sore, raised, scaly, dry, blistered, or made up of spots or patches. The same rash can look different on different skin tones, so changes in warmth, swelling, texture, pain or itch can be as useful to notice as colour.",
  clinicalMeaning: "A rash is a symptom, not one single diagnosis. It can be caused by irritation, allergy, eczema, hives, infection, a medicine reaction or another condition. Where it began, how quickly it spread, whether there is pain, itch, fever or swelling, and any new product, medicine or illness all help a clinician decide what is likely.",
  "commonCauses": [
      "Contact with an irritant or allergen, such as a new skin product, detergent, fabric, metal, plant, adhesive or medicine",
      "Eczema, psoriasis, hives, heat rash, or another inflammatory skin condition",
      "A viral, fungal or bacterial infection, or an insect bite or sting",
      "A medicine reaction or another illness affecting the body"
  ],
  differentialDiagnosis: "A clinician may consider contact dermatitis, eczema, hives, psoriasis, fungal infection, scabies, a viral rash or a medicine reaction. Clear photographs taken in natural light and a short timeline of where it started, how it changed, new exposures, medicines and other symptoms can make an assessment more useful.",
  redFlags: [
    "Call emergency services or go to the nearest emergency department for trouble breathing or swallowing, wheeze, faintness, or swelling of the lips, tongue, throat, eyes or face.",
    "Seek emergency care for a rapidly spreading, widespread, painful, blistering or peeling rash, especially after a new medicine or with fever or feeling very unwell.",
    "Seek urgent medical advice for a purple or non-fading rash with fever or severe illness, a rash involving the eyes, mouth or genital skin, or signs of infection such as pus, warmth, severe pain, red streaks or rapidly increasing swelling.",
    "Arrange a clinical review if a new rash is not improving, keeps returning, is spreading, or began after a medicine change. Do not stop a prescribed medicine without advice unless emergency care tells you to do so."
  ],
  lifestyleAdvice: "Avoid scratching, hot showers and harsh or fragranced products. Use a gentle cleanser and bland moisturiser if the skin is dry, and stop a clearly irritating new product if it is safe to do so. Keep a brief note of when the rash began, where it spread, recent medicines, illnesses, products and exposures. Take clear photos to show a clinician if it persists or changes. Avoid trying several new creams at once, as this can irritate the skin or make the cause harder to identify.",
  references: ["CIT-0147", "CIT-0148"],
  claimCitations: [
    { claimId: "S0018-RASH-UNDERSTANDING", passage: "definition; clinicalMeaning; commonCauses; differentialDiagnosis", citationIds: ["CIT-0147", "CIT-0148"] },
    { claimId: "S0018-RASH-SAFETY-AND-SUPPORT", passage: "redFlags; lifestyleAdvice; FAQs", citationIds: ["CIT-0147", "CIT-0148"] }
  ],
  faqs: [
    {
      question: "Could this be an allergy?",
      answer: "It could be, but many rashes are not allergies. A rash after a new product, food, medicine, bite or exposure may need assessment. Seek emergency help immediately for breathing difficulty, throat tightness, faintness or swelling of the face, lips or tongue."
    },
    {
      question: "How can I prepare for a rash consultation?",
      answer: "Take photos in natural light, note when it began and how it changed, and list new products, medicines, foods, activities, travel, illness or close contacts with a rash. Mention fever, pain, swelling, blisters, breathing symptoms or any rash in the eyes, mouth or genital area."
    },
    {
      question: "Can I treat every rash the same way?",
      answer: "No. A rash is a symptom with many causes. A cream that helps one problem may irritate or mask another. Avoid using several new or strong products at once and get advice for warning signs, persistent symptoms or a rash that is spreading."
    },
    {
      question: "Can homeopathy treat a skin rash?",
      answer: "Reliable clinical evidence has not established homeopathy as a treatment for skin rashes. It should not replace assessment for infection, a medicine reaction, allergy, severe skin symptoms or urgent warning signs."
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
  evidenceLevel: "Consensus-Guidance",
  tags: ["Skin Rash", "Dermatology", "Itching", "Allergy", "Symptom"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/skin-rash",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Skin Rash symptom profile", "1.2.0: Rewritten as a patient-first rash guide with safer medicine-reaction and emergency boundaries."]
};
