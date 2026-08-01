import { KnowledgeEntity } from "../../types";

export const SiliceaTerraRemedy: KnowledgeEntity = {
  id: "R0022",
  slug: "silicea-terra",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-01T12:00:00Z",
    reviewed: "2026-08-01T12:00:00Z",
  },
  title: {
    en: "Silicea Terra (Pure Silica)",
    hi: "सिलिशिया टेरा (शुद्ध सिलिका)",
    gu: "સિલીશિયા ટેરા (શુદ્ધ સિલિકા)",
    mr: "सिलिशिया टेरा (Silicea)",
    es: "Silicea Terra (Sílice Pura)",
    ar: "سيليشيا تيرا (Silicea)"
  },
  summary: {
    en: "A cardinal deep-acting constitutional, connective tissue, and suppurative mineral polychrest in classical homeopathy, indicated for extreme chilliness, offensive foot sweat, foreign body expulsion, timid receding stool, and suppurative fistulae.",
    hi: "होम्योपैथी में अत्यधिक ठंड लगना, पैरों की बदबूदार पसीना, शरीर से कांटे या बाहरी चीज का निकलना, और पुराने फोड़ों की प्रमुख दवा.",
    gu: "અતિશય ઠંડી લાગવી, પગનો દુર્ગંધયુક્ત પરસેવો, શરીરમાંથી કાંટો કે કાચનો ટુકડો બહાર કાઢવો અને જૂના પરુવાળા ચાંદા માટે હોમિયોપેથીની શ્રેષ્ઠ કેલ્શિયમ-સિલિકા દવા.",
    mr: "थंड हवेचा त्रास, पायांना येणारा दुर्गंधीयुक्त घाम, काटा किंवा टोचलेली वस्तू बाहेर काढणे आणि जुनाट पुवावर अत्यंत गुणकारी औषध.",
    es: "Un remedio mineral fundamental en homeopatía para la intolerancia al frío, sudor de pies fétido, expulsión de cuerpos extraños y fístulas supurativas.",
    ar: "علاج معدني عميق التأثير في المعالجة المثلية يُشار إليه لعدم تحمل البرد، تعرق القدمين الكريه، وطرد الأجسام الغريبة."
  },
  content: {
    latinName: "Silicon dioxide",
    commonName: "Pure Silica / Flint / Quartz",
    source: "Precipitated pure silicon dioxide SiO2 potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Silicea Terra is a major antipsoric, antisycotic, and antisyphilitic mineral polychrest proved by Samuel Hahnemann. Celebrated for its deep action on connective tissue, bones, glands, skin, and nervous resilience ('homeopathic scalpel'). Key hallmarks include extreme chilliness, offensive foot sweat, expulsion of foreign bodies, receding stool, and suppurative inflammation.",
    keynotes: [
      "Extreme chilliness, lack of vital heat, and sensitivity to cold drafts; patient covers head warmly even in summer",
      "Profuse, offensive, acrid foot perspiration causing raw soreness between toes; ill effects from suppressed foot sweat",
      "Remarkable power to promote expulsion of foreign bodies from tissues (splinters, glass shards, bone spicules, needles)",
      "Obstinate constipation; stool recedes back into rectum after being partially expelled ('timid stool')",
      "Yielding, gentle, timid mind, yet stubborn and fixed on principles ('grit in character / spine of steel')",
      "Impaired nutrient assimilation; malnourished children with large abdomen, weak ankles, and delayed fontanelle closure",
    ],
    mentalSymptoms: [
      "Lack of stamina and self-confidence; stage fright before examinations or public speaking",
      "Conscientious about trifles; fixed ideas and obstinacy when pushed",
      "Mental fatigue from prolonged study or overwork",
    ],
    physicalSymptoms: [
      "Chronic suppurative fistulae, paronychia (whitlow), ingrown toenails, and keloids",
      "Recurrent tonsillitis, otitis media, and chronic lachrymal duct obstruction (dacryocystitis)",
      "Headache starting in occiput, extending over vertex to right eye, relieved by wrapping head warmly",
      "Cold, clammy perspiration on head during sleep",
    ],
    generalities:
      "Chilly patient; must wrap head warmly. Strongly aggravated by cold air, drafts, uncovering head, and new moon. Ameliorated by heat, warm room, and wrapping head.",
    modalitiesBetter: [
      "Warmth, hot applications, and warm room",
      "Wrapping head up warmly in wool/scarf",
      "Profuse urination (headache)",
    ],
    modalitiesWorse: [
      "Cold air, drafts, and uncovering head",
      "Suppression of foot sweat",
      "New moon and full moon (periodicity)",
      "Lying on left side",
    ],
    clinicalUses: [
      "Management of chronic skin abscesses, paronychia, ingrown toenails, fistulae, and keloid scars",
      "Supportive care in chronic otitis media, dacryocystitis, rickets, and post-vaccinial debility",
    ],
    organAffinity: [
      "Connective tissue, elastic fibers, and skin",
      "Bones, joints, cartilage, and teeth",
      "Lymphatic glands and nervous system",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis",
      "Syphilis"
    ],
    constitution:
      "Suited to fair, scrofulous individuals with fine hair, weak muscles, pale skin, cold feet, and low physical resistance.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Prepared from pure silicon dioxide by trituration according to official pharmacopoeial standards. Potentized homeopathic preparations (6C, 30C, 200C) are non-toxic. High potencies should be used cautiously in patients with internal surgical implants, pacemakers, or vascular stents due to traditional tissue expulsion properties. Medical evaluation is necessary for chronic deep fistulae.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "Why is Silicea called the 'homeopathic scalpel'?",
        "answer": "Silicea earned this name due to its historical reputation for promoting the suppuration, maturation, and expulsion of foreign bodies, splinters, or chronic abscesses from deep tissues."
      },
      {
        "question": "What is the unique stool keynote of Silicea?",
        "answer": "A classic stool keynote of Silicea is the 'timid stool', where the stool is partially expelled and then slips back into the rectum due to rectal muscle weakness."
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
    specialty: "Connective Tissue & Suppurative Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Silicea", "Remedy", "Foreign Body Expulsion", "Offensive Foot Sweat", "Timid Stool"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/silicea-terra",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with connective tissue keynotes, foreign body expulsion, and classical citations"],
  clinicalPearl: "Silicea is indicated in extreme chilliness, offensive foot sweat, foreign body expulsion from tissues, receding timid stool, and suppurative fistulae.",
  quickFacts: {
    "Latin Name": "Silicon dioxide",
    "Common Name": "Pure Silica / Flint",
    "Source Kingdom": "Mineral",
    "Thermal State": "Extremely chilly (Wraps head in cap)"
  },
  aiReadiness: {
    retrievalSummary: "Silicea Terra is a major mineral homeopathic polychrest for extreme chilliness, offensive foot sweat, expulsion of foreign bodies, timid receding stool, and suppurative fistulae.",
    clinicalSummary: "Source is pure silica. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include connective tissue, bones, skin, lymphatic glands, and nervous system.",
    patientSummary: "Silicea Terra is a homeopathic remedy used for cold hands/feet, foul foot sweat, recurring boils or ingrown toenails, and helping body push out splinters.",
    studentSummary: "Guiding keynotes include extreme chilliness, wrapping head, offensive foot sweat, foreign body expulsion, timid receding stool, occipital-to-eye headache, and paronychia.",
    keywords: ["silicea", "silica", "foreign body expulsion", "foot sweat", "timid stool"],
    semanticKeywords: ["connective tissue polychrest", "suppurative remedy", "homeopathic scalpel"],
    bodySystem: "Connective Tissue & Musculoskeletal",
    urgency: "routine"
  }
};
