import { KnowledgeEntity } from "../../types";

export const SkinEruptionsSymptom: KnowledgeEntity = {
  id: "S0002",
  slug: "skin-eruptions",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Skin Eruptions (Dermatosis)",
    hi: "त्वचा पर दाने (स्किन इरप्शन)",
    gu: "ચામડીના ફોલ્લીઓ અને ખંજવાળ (Skin Eruptions)",
    mr: "त्वचेवरील पुरळ आणि डाग (Skin Eruptions)",
    es: "Erupciones Cutáneas",
    ar: "الطفح الجلدي (Skin Eruptions)"
  },
  summary: {
    en: "Visible changes in the texture or color of the skin, characterized by redness, papules, vesicles, or scaling, often accompanied by pruritus.",
    hi: "त्वचा की बनावट या रंग में दृश्य बदलाव, जैसे लालिमा, फुंसियां, छाले या पपड़ी बनना, जिसके साथ अक्सर तेज खुजली होती है.",
    gu: "ત્વચાના રંગ અથવા બંધારણમાં ફેરફાર, જેમ કે લાલાશ, ફોલ્લીઓ કે ભીંગડા થવા અને ખંજવાળ આવવી.",
    mr: "त्वचेच्या संरचनेत किंवा रंगात होणारा बदल, जसे की लालसरपणा, पुरळ, फोड येणे आणि खाज सुटणे.",
    es: "Cambios visibles en la textura o el color de la piel, caracterizados por enrojecimiento o picazón.",
    ar: "تغيرات مرئية في ملمس الجلد أو لونه، تتميز بالاحمرار والورم أو القشور."
  },
  content: {
    definition: "Skin eruptions are physical lesions on the integumentary surface, presenting as erythematous macules, papules, plaques, vesicles, pustules, or scaly areas.",
    clinicalMeaning: "In dermatology, skin eruptions represent localized or generalized inflammatory responses within the epidermis or dermis. This involves leukocyte infiltration, vasodilation, and epidermal hyperplasia, often driven by helper T-cell activations.",
    commonCauses: [
      "Atopic Dermatitis / Eczema.",
      "Allergic contact dermatitis (e.g. poison ivy, nickel).",
      "Infections (viral rashes, fungal tinea, bacterial impetigo).",
      "Autoimmune diseases (Psoriasis, Lupus)."
    ],
    differentialDiagnosis: "Eczematous dermatitis, Psoriasiform hyperplasia, Lichen planus, Drug eruptions, and Urticaria.",
    redFlags: [
      "Rapidly spreading rash over the entire body.",
      "Concomitant high fever, joint pain, or systemic toxicity.",
      "Blistering or peeling of skin around the mouth, eyes, or genitals (signs of Stevens-Johnson syndrome).",
      "Purpura or petechiae (non-blanching red-purple spots) suggesting vasculitis or meningococcemia."
    ],
    lifestyleAdvice: "Keep the affected area clean and dry. Avoid scratching to prevent secondary bacterial infections. Apply cool, wet compresses to soothe itching. Use mild cleansers and avoid perfumed cosmetics. Wear loose-fitting cotton clothing.",
    references: ["CIT-0002"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Dermatology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-C",
  tags: ["Skin Eruptions", "Eczema Rash", "Pruritus", "Symptom", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/skin-eruptions",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Skin Eruptions symptom profile"]
};
