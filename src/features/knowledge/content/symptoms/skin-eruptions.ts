import { KnowledgeEntity } from "../../types";

const SKIN_ERUPTIONS_CITATIONS = ["CIT-0019", "CIT-0022", "CIT-0023", "CIT-0024"];

export const SkinEruptionsSymptom: KnowledgeEntity = {
  id: "S0002",
  slug: "skin-eruptions",
  entityType: "symptom",
  editorialStatus: "published",
  legacyVerificationStatus: "verified-published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-30T12:00:00Z",
    reviewed: "2026-07-30T12:00:00Z",
  },
  title: {
    en: "Skin Eruptions (Dermatosis)",
    hi: "त्वचा पर दाने (स्किन इरप्शन)",
    gu: "ચામડીના ફોલ્લીઓ અને ખંજવાળ (Skin Eruptions)",
    mr: "त्वचेवरील पुरळ आणि डाग (Skin Eruptions)",
    es: "Erupciones Cutáneas",
    ar: "الطفح الجلدي (Skin Eruptions)",
  },
  summary: {
    en: "Visible cutaneous changes including macules, papules, vesicles, or scaling, representing inflammatory, infectious, allergic, or systemic skin responses.",
    hi: "त्वचा की बनावट या रंग में दृश्य बदलाव जैसे चकत्ते, फुंसियां, छाले या पपड़ी बनना, जो सूजन, संक्रमण, एलर्जिक या शारीरिक प्रतिक्रियाओं का संकेत देते हैं।",
    gu: "ત્વચાના રંગ અથવા બંધારણમાં ફેરફાર, જેમ કે લાલાશ, ફોલ્લીઓ કે ભીંગડા થવા અને ખંજવાળ આવવી.",
    mr: "त्वचेच्या संरचनेत किंवा रंगात होणारा बदल, जसे की लालसरपणा, पुरळ, फोड येणे आणि खाज सुटणे.",
    es: "Cambios visibles en la textura o el color de la piel, caracterizados por enrojecimiento, pápulas, vesículas o escamas.",
    ar: "تغيرات مرئية في ملمس الجلد أو لونه، تتميز بالاحمرار والورم أو القشور.",
  },
  content: {
    definition:
      "Skin eruptions refer to visible lesions of the skin—such as macules, papules, vesicles, pustules, wheals, or scaling—arising from cutaneous inflammation, epidermal barrier disruption, infection, or systemic hypersensitivity.",
    clinicalMeaning:
      "Skin eruptions are non-specific clinical signs requiring morphological classification (primary vs secondary lesions) and anatomical distribution analysis. They can reflect localized skin disease (e.g., atopic eczema, contact dermatitis), drug reactions, systemic infection, or autoimmune illness.",
    commonCauses: [
      "Inflammatory dermatoses including atopic eczema, contact dermatitis, seborrheic dermatitis, and psoriasis",
      "Cutaneous histamine release causing acute urticaria or angioedema",
      "Infectious etiologies including viral exanthems, bacterial impetigo/cellulitis, fungal tinea, and scabies infestation",
      "Medication-induced cutaneous adverse reactions ranging from mild morbilliform rashes to severe cutaneous adverse reactions (SCARs)",
    ],
    differentialDiagnosis:
      "Morphological differential includes urticaria, drug eruption, scabies, tinea corporis, secondary syphilis, cutaneous lupus, and viral exanthems (e.g., varicella, measles).",
    redFlags: [
      "Rapidly spreading rash with high fever, facial edema, mucosal involvement (mouth/eye erosions), or skin sloughing (suspect Stevens-Johnson syndrome / TEN; immediate emergency hospital admission)",
      "Petechial or purpuric non-blanching rash accompanied by fever or altered mental state (suspect meningococcal septicemia)",
      "Generalized erythroderma involving >90% body surface area with shivering, dehydration, or hemodynamic compromise",
      "Spreading warm, tender erythema with purulent discharge or red streaks (suspect cellulitis or invasive soft tissue infection)",
    ],
    lifestyleAdvice:
      "Avoid scratching or excoriating lesions to prevent secondary bacterial infection. Cleanse gently with lukewarm water and soap-free liquid washes. Apply plain, unperfumed emollients to restore skin barrier. Avoid self-medicating with unverified topical creams or remedies.",
    references: SKIN_ERUPTIONS_CITATIONS,
    claimCitations: [
      {
        claimId: "S0002-DEFINITION",
        passage: "definition",
        citationIds: ["CIT-0019", "CIT-0022"],
      },
      {
        claimId: "S0002-CLINICAL-MEANING",
        passage: "clinicalMeaning; commonCauses",
        citationIds: ["CIT-0019", "CIT-0022"],
      },
      {
        claimId: "S0002-DIFFERENTIAL",
        passage: "differentialDiagnosis",
        citationIds: ["CIT-0019", "CIT-0022"],
      },
      {
        claimId: "S0002-EMERGENCY-BOUNDARY",
        passage: "redFlags",
        citationIds: ["CIT-0019"],
      },
      {
        claimId: "S0002-LIFESTYLE",
        passage: "lifestyleAdvice",
        citationIds: ["CIT-0019"],
      },
      {
        claimId: "S0002-HOMEOPATHY-BOUNDARY",
        passage: "FAQ: complementary-care boundary",
        citationIds: ["CIT-0023"],
      },
    ],
    faqs: [
      {
        question: "Does every skin eruption need prescription treatment?",
        answer:
          "No. Mild transient eruptions caused by minor irritation may resolve with gentle cleansing and emollients. However, persistent, worsening, painful, or unexplained rashes require professional medical evaluation.",
      },
      {
        question: "When is a skin rash a medical emergency?",
        answer:
          "A rash is an emergency if accompanied by high fever, skin pain, blistering/sloughing, mouth or eye sores, facial swelling, non-blanching purple spots, or signs of severe infection.",
      },
      {
        question: "Can homeopathy replace emergency medical care for severe skin eruptions?",
        answer:
          "No. Severe eruptions, blistering, drug reactions, or infected lesions require urgent conventional emergency evaluation and care. Homeopathy has not been established as a replacement for emergency therapy.",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Homeopathy & Dermatology",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final authorization",
  lastClinicalReview: "2026-07-30",
  nextClinicalReview: "2027-07-30",
  referencesUpdated: "2026-07-30",
  clinicalChangesSinceLastRevision:
    "Source-bound rewrite to v1.1.0; expanded clinical definition, primary vs secondary lesion morphology, urgent emergency boundaries (SJS/TEN, meningococcal purpura, erythroderma), and claim-level provenance.",
  reviewStatus: "owner-authorized-source-bound",
  citationHealth: "complete",
  contentCompleteness: 100,
  graphCompleteness: 100,
  evidenceLevel: "Consensus-Guidance",
  evidenceProfile: {
    evidenceStrength: "high",
    sourceQuality: "authoritative",
    classicalSource: false,
    modernSource: true,
    clinicalConfidence: 0.93,
    editorialConfidence: 0.96,
    citationCompleteness: 1,
    lastReviewedAt: "2026-07-30",
    reviewIntervalDays: 365,
    nextReviewDueAt: "2027-07-30",
    reviewExpiryPolicy: "flag-only",
    rationale:
      "Morphological triage, emergency red flag boundaries (SJS/TEN, petechiae, erythroderma), and barrier care are mapped to authoritative dermatology clinical guidance.",
    methodologyVersion: "knowledge-authority-led-v1",
  },
  tags: ["Skin Eruptions", "Rash", "Dermatosis", "Lesion Triage", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/skin-eruptions",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Skin Eruptions symptom profile",
    "1.1.0: Source-bound rewrite with emergency red flag boundaries and claim provenance",
  ],
  clinicalPearl:
    "Morphological triage (blanching vs non-blanching, bullous vs papular) and mucosal examination are vital in distinguishing benign eruptions from dermatological emergencies.",
  quickFacts: {
    "Symptom Category": "Cutaneous Lesion / Dermatosis",
    "Primary Morphologies": "Macules, Papules, Vesicles, Pustules, Wheals",
    "Urgency Level": "Context-dependent; emergency if bullous, mucosal, purple non-blanching, or systemic toxicity present",
  },
};
