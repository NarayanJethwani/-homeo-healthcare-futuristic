import { KnowledgeEntity } from "../../types";

export const SepiaOfficinalisRemedy: KnowledgeEntity = {
  id: "R0021",
  slug: "sepia-officinalis",
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
    en: "Sepia Officinalis (Inky Juice of Cuttlefish)",
    hi: "सेपिया ऑफिशियलिस (कटलफिश स्याही)",
    gu: "સેપિયા ઓફિશિનાલિસ (કટલફિશ શાહી)",
    mr: "सेपिया ऑफिशियलिस (Sepia Officinalis)",
    es: "Sepia Officinalis (Tinta de Sepia)",
    ar: "سيبيا أوفيسيناليس (Sepia)"
  },
  summary: {
    en: "A cardinal female and venous constitutional polychrest in classical homeopathy, indicated for portal congestion, pelvic bearing-down sensation, emotional indifference to loved ones, chloasma across the nose, and relief from vigorous exercise.",
    hi: "होम्योपैथी में महिलाओं के हार्मोनल असंतुलन, पेल्विक दबाव, उदासीनता, और चेहरे पर छाइयों की प्रमुख दवा.",
    gu: "સ્ત્રીઓના હોર્મોનલ અસંતુલન, પેલ્વિકમાં દબાણ અને ચહેરાના ડાઘ-ધબ્બા માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "स्त्रीरोग, हॉर्मोनल असंतुलन, नैराश्य आणि चेहऱ्यावरील डागांवर अत्यंत गुणकारी औषध.",
    es: "Un remedio constitucional primario en homeopatía para congestión portal, sensación de descenso pélvico, indiferencia emocional y alivio con ejercicio intenso.",
    ar: "علاج دستوري رئيسي في المعالجة المثلية للاحتشاء البابي، الشور بالانضغط الحوضي، واللامبالاة العاطفية."
  },
  content: {
    latinName: "Sepia officinalis",
    commonName: "Inky Juice of Cuttlefish",
    source: "Dried dark brown liquid from the ink bag of Sepia officinalis, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Animal",
    remedyType: "Polychrest",
    description:
      "Sepia officinalis is a deep-acting antipsoric and antisycotic polychrest proved by Samuel Hahnemann. Celebrated for its profound action on the venous circulation, portal system, and female pelvic organs. Key features include pelvic bearing-down as if pelvic organs would escape, emotional apathy towards family, saddle-like facial pigmentation, and relief from strenuous physical exercise.",
    keynotes: [
      "Pelvic bearing-down sensation as if internal organs would protrude through vulva; must cross legs tightly to prevent prolapse",
      "Emotional apathy and complete indifference to loved ones (family, children, spouse)",
      "Yellowish-brown saddle-like discoloration across the bridge of the nose and cheeks (chloasma / melasma)",
      "Marked relief from vigorous physical exercise, fast walking, or dancing (improves venous stasis)",
      "Nausea at the smell, thought, or sight of food; aversion to meat and fat",
      "Chilly, sensitive to cold air, yet suffers hot flashes during menopause",
    ],
    mentalSymptoms: [
      "Apathy, mental depression, and emotional fatigue; loss of affection for family members",
      "Irritability and weeping when questioned or contradicted; desires solitude",
      "Dread of being alone, yet avoids company; mental stasis and brain-fag",
    ],
    physicalSymptoms: [
      "Pelvic organ relaxation, uterine prolapse, leucorrhea, and dyspareunia",
      "Portal stasis, hemorrhoids, venous stasis in legs, and sensation of ball in rectum/uterus",
      "Dyspepsia with empty sensation in pit of stomach not relieved by eating",
      "Hot flashes during climacteric with drenching sweats and faintness",
    ],
    generalities:
      "Chilly patient with venous stasis. Strongly aggravated by laundry work, damp cold, and rest. Ameliorated by strenuous physical exertion.",
    modalitiesBetter: [
      "Strenuous physical exercise, fast walking, or dancing",
      "Warmth of bed and hot applications",
      "Crossing legs tightly (pelvic support)",
      "Open air",
    ],
    modalitiesWorse: [
      "Cold air, damp cold, and washing clothes / laundry work",
      "Morning and evening",
      "Rest and sitting still",
      "Smell of food",
    ],
    clinicalUses: [
      "Constitutional support in menopausal hot flashes, pelvic organ prolapse, and chloasma",
      "Management of post-partum depression, leucorrhea, and chronic venous stasis",
    ],
    organAffinity: [
      "Female reproductive system (uterus, ovaries)",
      "Venous vascular system and portal circulation",
      "Skin, liver, and nervous system",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to dark-haired, slender individuals with sallow skin, pelvic relaxation, and tendency to venous congestion.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Animal source ink sac liquid prepared by trituration according to official pharmacopoeia standards. Homeopathic potentized dilutions (6C, 30C, 200C) are non-toxic. Clinical gynecological evaluation is recommended for acute pelvic pain or uterine prolapse.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What is the key pelvic symptom of Sepia?",
        "answer": "A classic keynote of Sepia is a heavy bearing-down sensation in the pelvis as if organs would protrude, compelling the patient to cross her legs tightly."
      },
      {
        "question": "How does exercise affect Sepia symptoms?",
        "answer": "Sepia is uniquely relieved by vigorous physical exercise, fast walking, or dancing, which helps overcome venous and portal stasis."
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
    specialty: "Gynecological & Venous Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Sepia", "Remedy", "Bearing Down", "Indifference", "Exercise Better"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sepia-officinalis",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, venous modalities, and classical citations"],
  clinicalPearl: "Sepia is indicated in pelvic bearing-down states with emotional indifference to loved ones, chloasma, and marked relief from vigorous exercise.",
  quickFacts: {
    "Latin Name": "Sepia officinalis",
    "Common Name": "Cuttlefish Ink",
    "Source Kingdom": "Animal (Cephalopoda family)",
    "Thermal State": "Chilly (Hot flashes in menopause)"
  },
  aiReadiness: {
    retrievalSummary: "Sepia officinalis is a major classical homeopathic polychrest indicated for pelvic bearing-down sensation, uterine prolapse, emotional indifference to family, chloasma, and relief from vigorous exercise.",
    clinicalSummary: "Source is cuttlefish ink. Homeopathic potentized remedies are non-toxic. Primary clinical affinities include female reproductive organs, venous system, portal circulation, and skin.",
    patientSummary: "Sepia officinalis is a homeopathic remedy used for women experiencing menopausal hot flashes, pelvic heaviness, dark facial patches, and feelings of emotional exhaustion.",
    studentSummary: "Guiding keynotes include pelvic bearing-down compelling crossing legs, emotional apathy to loved ones, chloasma saddle across nose, nausea at smell of food, and relief from fast walking.",
    keywords: ["sepia", "cuttlefish ink", "bearing down", "indifference", "chloasma"],
    semanticKeywords: ["female pelvic polychrest", "portal venous remedy", "menopausal hot flash remedy"],
    bodySystem: "Reproductive & Vascular",
    urgency: "routine"
  }
};
