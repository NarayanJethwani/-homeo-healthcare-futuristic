import { KnowledgeEntity } from "../../types";

export const CalcareaCarbonicaRemedy: KnowledgeEntity = {
  id: "R0009",
  slug: "calcarea-carbonica",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Calcarea Carbonica (Calcium Carbonate / Oyster Shell)",
    hi: "कैल्केरिया कार्बोनिका (कैल्शियम कार्बोनेट / ऑयस्टर शेल)",
    gu: "કેલ્કેરિયા કાર્બોનિકા (ઓઇસ્ટર શેલ)",
    mr: "कॅल्केरिया कार्बोनिका (Calcarea Carbonica)",
    es: "Calcarea Carbonica (Carbonato de Calcio / Concha de Ostra)",
    ar: "كالكاريا كاربونيكا (Calcarea Carbonica)"
  },
  summary: {
    en: "A major constitutional mineral polychrest in classical homeopathy, indicated for sluggish calcium metabolism, lymphatic enlargement, chilliness, head perspiration during sleep, cold damp feet, craving for eggs, and dyspnea on exertion.",
    hi: "होम्योपैथी में एक प्रमुख संवैधानिक खनिज दवा, जो कमजोर चयापचय, सिर में पसीना, ठंडे गीले पैर, और अंडों की लालसा वाले रोगियों में उपयोगी है.",
    gu: "હોમિયોપેથીમાં ચયાપચયની નબળાઈ, માથામાં પરસેવો, અને ઠંડા પગ વાળા દર્દીઓ માટે મહત્વપૂર્ણ બંધારણીય દવા.",
    mr: "अशक्तपणा, डोक्याला येणारा घाम, थंड पाय आणि कॅल्शियमच्या कमतरतेवर अत्यंत प्रभावी औषध.",
    es: "Un remedio mineral constitucional primario en homeopatía para metabolismo lento de calcio, frialdad, sudor cefálico nocturno y pies fríos y húmedos.",
    ar: "علاج معدني دستوري رئيسي في المعالجة المثلية للاستقلاب الكلسي البطيء والتضخم اللمفاوي والبرودة."
  },
  content: {
    latinName: "Calcarea carbonica",
    commonName: "Calcium Carbonate / Impure Calcium Carbonate from Oyster Shell",
    source: "Middle layer of the shell of Ostrea edulis (oyster shell), purified and potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Animal/Mineral",
    remedyType: "Polychrest",
    description:
      "Calcarea carbonica is a deep-acting antipsoric polychrest proved by Samuel Hahnemann. It corresponds to impaired nutrition, defective calcium assimilation, scrofulous glandular swelling, excessive chilliness, head sweating during sleep, cold damp feet, craving for eggs, and dyspnea on ascending.",
    keynotes: [
      "Fair, fat, flabby, cold, chilly constitution with tendency to sweat easily, especially on the head during sleep",
      "Head perspires profusely at night, soaking the pillow; cold damp feet as if wearing damp stockings",
      "Craving for eggs, soft-boiled eggs, or indigestible items (chalk, earth); aversion to milk and fat",
      "Shortness of breath on ascending stairs, walking uphill, or least exertion",
      "Anxiety regarding health, fear of insanity, fear of contagious disease, or disaster",
    ],
    mentalSymptoms: [
      "Apprehensive, anxious, easily overwhelmed by work or responsibility",
      "Fears others will notice their mental weakness or confusion; fear of losing mind/insanity",
      "Desire for stability, routine, and safety; slow, methodical mental processing",
    ],
    physicalSymptoms: [
      "Glandular enlargement (cervical, mesenteric glands) and delayed dentition/bone closure in infants",
      "Dyspepsia with sour eructations, sour vomiting, and sour diarrhea",
      "Coldness of local parts (cold knees, cold feet, icy coldness in scalp)",
      "Profuse, early menses in women, accompanied by cold feet and night sweats",
    ],
    generalities:
      "Marked chilliness and sensitivity to cold damp air. Great weakness and dyspnea on ascending heights.",
    modalitiesBetter: [
      "Dry warm weather and warm atmosphere",
      "Lying on the painful side",
    ],
    modalitiesWorse: [
      "Cold damp weather, cold water, and cold air",
      "Physical exertion and ascending stairs/hills",
      "Full moon",
      "Standing",
    ],
    clinicalUses: [
      "Constitutional support in defective calcium assimilation, rickets, and delayed dentition",
      "Management of chronic lymphatic glandular hypertrophy and chronic catarrh",
    ],
    organAffinity: [
      "Osseous and cartilage system (bones, teeth)",
      "Lymphatic glandular system",
      "Metabolic and digestive systems",
    ],
    miasmaticAffinity: [
      "Psora",
      "Tubercular"
    ],
    constitution:
      "Suited to fair, soft-muscled, stout, chilly individuals who tire easily on walking uphill or climbing stairs.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Mineral carbonate source prepared by trituration according to official pharmacopoeial standards. Potentized homeopathic dilutions (6C, 30C, 200C) are non-toxic. Professional clinical evaluation is recommended for metabolic bone or endocrine disorders.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What are the classic thermal and sweat characteristics of Calcarea Carbonica?",
        "answer": "Calcarea Carbonica patients are typically chilly, sensitive to cold damp air, and experience profuse head perspiration during sleep that soaks the pillow, along with cold damp feet."
      },
      {
        "question": "What food craving is most characteristic of Calcarea Carbonica?",
        "answer": "A strong, characteristic craving for eggs (especially soft-boiled eggs) is a well-known keynote of Calcarea Carbonica."
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
    specialty: "Constitutional & Metabolic Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Calcarea Carbonica", "Remedy", "Chilly", "Head Sweat", "Craving Eggs"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/calcarea-carbonica",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, constitutional modalities, and classical citations"],
  clinicalPearl: "Calcarea Carbonica is indicated in chilly, sluggish constitutions with head sweat during sleep, cold damp feet, and dyspnea on ascending stairs.",
  quickFacts: {
    "Latin Name": "Calcarea carbonica",
    "Common Name": "Calcium Carbonate / Oyster Shell",
    "Source Kingdom": "Animal / Mineral",
    "Thermal State": "Very chilly (Worse cold damp)"
  },
  aiReadiness: {
    retrievalSummary: "Calcarea carbonica is a deep-acting antipsoric constitutional polychrest in classical homeopathy indicated for impaired calcium assimilation, head sweating during sleep, cold damp feet, and craving for eggs.",
    clinicalSummary: "Prepared from oyster shell inner layer. Primary clinical affinities include bones, teeth, lymphatic glands, and digestive system, presenting with sluggishness and chilliness.",
    patientSummary: "Calcarea carbonica is a homeopathic remedy used for sluggish metabolism, joint/bone weakness, enlarged glands, and individuals who feel chilly and sweat easily on the head at night.",
    studentSummary: "Guiding keynotes include fair fat flabby constitution, head sweat soaking pillow, cold damp feet, craving for eggs, and dyspnea on ascending stairs.",
    keywords: ["calcarea carbonica", "oyster shell", "chilly remedy", "head sweat", "craving eggs"],
    semanticKeywords: ["antipsoric polychrest", "calcium assimilation remedy", "lymphatic gland remedy"],
    bodySystem: "Musculoskeletal & Glandular",
    urgency: "routine"
  }
};
