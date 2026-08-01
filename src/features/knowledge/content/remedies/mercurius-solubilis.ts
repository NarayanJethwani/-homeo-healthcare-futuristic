import { KnowledgeEntity } from "../../types";

export const MercuriusSolubilisRemedy: KnowledgeEntity = {
  id: "R0016",
  slug: "mercurius-solubilis",
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
    en: "Mercurius Solubilis (Hahnemann's Soluble Mercury)",
    hi: "मर्क्यूरियस सॉल्युबिलिस (हैनिमैन घुलनशील मर्करी)",
    gu: "મરક્યુરીયસ સોલ્યુબિલિસ (હેનિમેન મરક્યુરી)",
    mr: "मर्क्यूरियस सॉल्युबिलिस (Mercurius Solubilis)",
    es: "Mercurius Solubilis (Mercurio Soluble de Hahnemann)",
    ar: "مركوريوس سولوبيليس (Mercurius Sol)"
  },
  summary: {
    en: "A cardinal glandular, oral, and syphilitic mineral polychrest in classical homeopathy, indicated for profuse night sweats without relief, excessive nocturnal salivation soaking the pillow, indented tongue taking teeth imprints, sensitivity to both heat and cold, and foul breath odor.",
    hi: "होम्योपैथी में रात को पसीना, मुंह से लार टपकना, दांतों के निशान वाली जीभ, और मुंह की बदबू की प्रमुख दवा.",
    gu: "રાત્રે અતિશય પરસેવો, મોંમાંથી લાળ ગળવી, જીભ પર દાંતની છાપ અને મોંની દુર્ગંધ માટે હોમિયોપેથીની શ્રેષ્ઠ અલ્સર-ઓરીજિનલ દવા.",
    mr: "रात्री होणारा भरपूर घाम, तोंडातून लाल गळणे, जिभेवर दातांचे ठसे आणि तोंडाच्या दुर्गंधीवर अत्यंत गुणकारी औषध.",
    es: "Un remedio mineral fundamental en homeopatía para sudoración nocturna profusa sin alivio, salivación nocturna en almohada, lengua marcada por dientes y sensibilidad a calor y frío.",
    ar: "علاج معدني زئبقي رئيسي في المعالجة المثلية يُشار إليه للتعرق ليلاً، اللعاب المفرط، وللسان المطبوع بالأسنان."
  },
  content: {
    latinName: "Mercurius solubilis hahnemanni",
    commonName: "Hahnemann's Soluble Mercury / Black Oxide of Mercury",
    source: "Precipitated black nitrate of mercury and ammonia prepared according to Samuel Hahnemann's original formula, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Mercurius Solubilis is a cornerstone syphilitic polychrest introduced and proved by Samuel Hahnemann. Celebrated for its unique action on lymphatic glands, oral mucosa, bone periosteum, and skin. Key features include profuse nocturnal sweating that brings no relief, excessive salivation soaking the pillow during sleep, a moist flabby tongue taking imprints of teeth, and extreme sensitivity to both heat and cold ('human thermometer').",
    keynotes: [
      "Profuse nocturnal perspiration that affords no relief; bed sheets feel cold, wet, and uncomfortable",
      "Excessive salivation (ptyalism) at night soaking the pillow; mouth is moist yet patient suffers unquenchable thirst",
      "Flabby, swollen tongue with yellow coating, taking clear imprints of teeth along margins ('indented tongue')",
      "Extreme thermal instability; sensitive to both heat and cold ('human thermometer')",
      "Foul, offensive, metallic, or fetid odor from breath, sweat, stool, and all body discharges",
      "Tremor of hands, tongue, and limbs ('mercurial tremor'); worse from mental or physical exertion",
    ],
    mentalSymptoms: [
      "Memory weak, mind sluggish, and answers questions slowly; loss of willpower",
      "Anxiety and restlessness at night with fear of losing mind or committing violence",
      "Suspicious, mistrustful, and impulse to do harm when contradicted",
    ],
    physicalSymptoms: [
      "Aphthous stomatitis, gingivitis, bleeding gums, and foul pyorrhea with loose teeth",
      "Suppurative tonsillitis with pharyngeal ulcers, dirty yellow coating, and lancinating pain to ears on swallowing",
      "Dysentery with severe tenesmus ('never-get-done' feeling) and bloody slimy stools",
      "Nocturnal bone pains (osteocopic pains) in tibia, skull, and sternum",
    ],
    generalities:
      "Sensitive to both heat and cold. Strongly aggravated at night, by warm bed, damp weather, and sweating.",
    modalitiesBetter: [
      "Moderate uniform temperature",
      "Rest during daytime",
    ],
    modalitiesWorse: [
      "Night (sunset to sunrise)",
      "Warmth of bed and extreme heat",
      "Cold damp weather and drafts",
      "Perspiration (does not relieve)",
    ],
    clinicalUses: [
      "Management of acute aphthous stomatitis, ulcerative gingivitis, pyorrhea, and tonsillitis",
      "Supportive care in dysenteric colitis, nocturnal otitis media, and periosteal bone pain",
    ],
    organAffinity: [
      "Lymphatic glands and mucous membranes",
      "Oral cavity (salivary glands, teeth, tongue, gums)",
      "Vascular system, liver, and bones",
    ],
    miasmaticAffinity: [
      "Syphilis",
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to scrofulous, lymphatic individuals with sallow skin, oily hair, weak stamina, and tendency to suppuration.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Source material is a mercurial chemical compound. Elemental mercury is a toxic heavy metal. Homeopathic potentized preparations (6C, 30C, 200C) are non-toxic and contain no free heavy metal ions. Clinical dental or medical evaluation is required for severe ulcerative stomatitis, dysentery, or deep bone infections.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What is the unique thermal modality of Mercurius?",
        "answer": "Mercurius is known as a 'human thermometer' because the patient is extremely sensitive to both heat and cold—neither extreme is tolerated."
      },
      {
        "question": "What is the classic tongue presentation in Mercurius?",
        "answer": "The tongue of Mercurius is swollen, moist, flabby, yellow-coated, and clearly indented with teeth imprints along its lateral borders."
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
    specialty: "Oral & Glandular Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Mercurius", "Remedy", "Night Sweats", "Salivation", "Indented Tongue"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/mercurius-solubilis",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with oral/night sweat keynotes, indented tongue, and classical citations"],
  clinicalPearl: "Mercurius is indicated in nocturnal salivation, profuse un-relieving night sweats, indented tongue, and intolerance to both heat and cold.",
  quickFacts: {
    "Latin Name": "Mercurius solubilis hahnemanni",
    "Common Name": "Hahnemann's Soluble Mercury",
    "Source Kingdom": "Mineral",
    "Thermal State": "Human thermometer (Sensitive to heat & cold)"
  },
  aiReadiness: {
    retrievalSummary: "Mercurius Solubilis is a major mineral homeopathic polychrest for profuse night sweats without relief, nocturnal salivation soaking the pillow, indented tongue taking teeth imprints, and extreme sensitivity to heat and cold.",
    clinicalSummary: "Prepared according to Hahnemann's mercurial formula. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include oral mucosa, salivary glands, lymphatic system, and bones.",
    patientSummary: "Mercurius Solubilis is a homeopathic remedy used for mouth ulcers, swollen gums with bad breath, excessive night drooling, and night sweats.",
    studentSummary: "Guiding keynotes include un-relieving night sweats, nocturnal salivation soaking pillow, indented tongue, human thermometer thermal state, offensive breath, and aggravation at night.",
    keywords: ["mercurius", "soluble mercury", "night sweats", "salivation", "indented tongue"],
    semanticKeywords: ["syphilitic polychrest", "stomatitis remedy", "glandular ulcer remedy"],
    bodySystem: "Oral & Lymphatic",
    urgency: "routine"
  }
};
