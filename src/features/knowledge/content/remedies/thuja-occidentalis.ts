import { KnowledgeEntity } from "../../types";

export const ThujaOccidentalisRemedy: KnowledgeEntity = {
  id: "R0023",
  slug: "thuja-occidentalis",
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
    en: "Thuja Occidentalis (Arbor Vitae / Tree of Life)",
    hi: "थूजा ऑक्सिडेंटालिस (आर्बर विटे)",
    gu: "થૂજા ઓક્સિડેન્ટાલિસ (આર્બર વિટે)",
    mr: "थूजा ऑक्सिडेंटालिस (Thuja)",
    es: "Thuja Occidentalis (Árbol de la Vida)",
    ar: "ثوجا أوكسيدنتاليس (Thuja)"
  },
  summary: {
    en: "A cardinal sycotic, dermatological, and genitourinary botanical polychrest in classical homeopathy, known as the 'king of sycosis', indicated for warts, condylomata, ill effects of vaccination, delusion of body made of glass, and sweetish honey-like sweat.",
    hi: "होम्योपैथी में मस्से, गोखरू, त्वचा की गांठें, टीकाकरण के दुष्प्रभाव, और कांच के शरीर का वहम की प्रमुख दवा.",
    gu: "મસા (વોર્ટ્સ), ચામડીના મસો-ગાંઠ, વેક્સિનેશનની આડઅસર અને શરીર કાચનું બનેલું હોવાના ભ્રમ માટે હોમિયોપેથીની કિંગ સાયકોટિક દવા.",
    mr: "म्हसे (Warts), त्वचेवरील गाठी, लसीकरणाचे दुष्परिणाम आणि शरीर काचेचे असल्याच्या भ्रमावर अत्यंत प्रभावी औषध.",
    es: "Un remedio botánico fundamental en homeopatía para el miasma sicótico, verrugas, condilomas, efectos adversos de vacunas y delirio de cuerpo de cristal.",
    ar: "علاج نباتي رئيسي للمياسم السيكوزي في المعالجة المثلية يُشار إليه للثآليل، الآثار الجانبية لللقاحات، والتوهمات الجسدية."
  },
  content: {
    latinName: "Thuja occidentalis",
    commonName: "Arbor Vitae / White Cedar / Tree of Life",
    source: "Fresh green twigs of Thuja occidentalis harvested in summer, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Thuja Occidentalis is the primary antisycotic polychrest proved by Samuel Hahnemann. Celebrated for its unique action on skin excrescences, genital mucosa, post-vaccinial dyscrasia, and sycotic constitutional states. Key hallmarks include warts, fig-warts, condylomata, ill effects of vaccination, sensation as if body or limbs were made of glass and fragile, and sweetish honey-like sweat on uncovered body parts.",
    keynotes: [
      "King of sycosis: specific remedy for warts, fig-warts, condylomata, pedunculated skin tags, and warty excrescences",
      "Bad effects of vaccination (post-vaccinial syndrome, chronic eczema, asthma, or neuralgias following vaccines)",
      "Fixed somatic delusions: feels as if limbs were made of glass and would break, or as if a living animal were moving in abdomen",
      "Sweating on uncovered parts of the body only; sweat smells sweetish, honey-like, or garlic-like",
      "Urethral split or double stream of urine due to urethral condylomata, stricture, or chronic gonorrhea",
      "Brittle, soft, ribbed nails with dark discoloration or crumbling margins",
    ],
    mentalSymptoms: [
      "Fixed ideas and delusions regarding physical body; feels fragile, light, or detached from physical form",
      "Emotional depression, taciturnity, and obsession with secret guilt",
      "Hasty, hurried speech and movement",
    ],
    physicalSymptoms: [
      "Genital condylomata acuminata, soft spongy bleeding warts, and chronic purulent urethritis",
      "Left-sided ovarian pain worse during menstruation and extend into groin/thigh",
      "Chronic oily skin, facial seborrhea, brownish spots (liver spots) on hands/forearm",
      "Left-sided frontal headache as if a nail were driven into temple (clavus)",
    ],
    generalities:
      "Chilly patient, strongly aggravated by cold damp air, 3 AM and 3 PM, vaccination, and tea drinking. Ameliorated by warmth and dry weather.",
    modalitiesBetter: [
      "Warmth and dry warm weather",
      "Drawing up limbs",
      "Sneezing (headache)",
    ],
    modalitiesWorse: [
      "Cold damp weather and cold rain",
      "Vaccination (ill effects)",
      "3 AM and 3 PM (periodicity)",
      "Drinking tea, coffee, or fatty food",
      "Uncovering body",
    ],
    clinicalUses: [
      "Management of warts (verruca vulgaris), condylomata, skin tags, seborrheic keratosis, and oily skin",
      "Supportive care in post-vaccinial skin/respiratory reactions, urethral stricture, and chronic pelvic pain",
    ],
    organAffinity: [
      "Skin, mucous membranes, and genitourinary tract",
      "Left ovary and uterus",
      "Mind and nervous system",
    ],
    miasmaticAffinity: [
      "Sycosis",
      "Psora",
      "Syphilis"
    ],
    constitution:
      "Suited to sycotic individuals with oily skin, dark hair, dark spots, soft brittle nails, and tendency to warty outgrowths.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Tincture prepared from fresh twigs of Thuja occidentalis. Essential oil contains thujone, a neurotoxic monoterpene ketone. Potentized homeopathic preparations (6C, 30C, 200C) are non-toxic and free of thujone neurotoxicity. Dermatological evaluation is recommended for suspicious or rapidly growing skin pigmented lesions.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "Why is Thuja considered the 'king of sycosis' in homeopathy?",
        "answer": "Thuja was identified by Hahnemann as the principal remedy for overcoming the sycotic miasm, characterized by overgrowths, warts, condylomata, and fluid retention."
      },
      {
        "question": "What is the unique perspiration keynote of Thuja?",
        "answer": "Thuja features perspiration occurring exclusively on uncovered parts of the body, often smelling sweetish or like honey."
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
    specialty: "Dermatological & Antisycotic Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Thuja", "Remedy", "Warts", "Vaccination Effects", "Glass Body Delusion"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/thuja-occidentalis",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with warty keynotes, post-vaccinial effects, and classical citations"],
  clinicalPearl: "Thuja is indicated in warts, condylomata, ill effects of vaccination, delusion of body made of glass, and sweat on uncovered parts.",
  quickFacts: {
    "Latin Name": "Thuja occidentalis",
    "Common Name": "Arbor Vitae",
    "Source Kingdom": "Plant (Cupressaceae family)",
    "Thermal State": "Chilly (Worse cold damp)"
  },
  aiReadiness: {
    retrievalSummary: "Thuja Occidentalis is a major botanical homeopathic polychrest for warts, condylomata, ill effects of vaccination, delusion of body made of glass, and sweetish sweat on uncovered parts.",
    clinicalSummary: "Source is Arbor Vitae. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include skin, genitourinary tract, left ovary, and mind.",
    patientSummary: "Thuja Occidentalis is a homeopathic remedy used for skin warts, skin tags, oily skin, reactions after vaccination, and nail brittleness.",
    studentSummary: "Guiding keynotes include king of sycosis, warts/condylomata, bad effects of vaccination, glass body delusion, sweat on uncovered parts, split urine stream, and aggravation at 3 AM/PM.",
    keywords: ["thuja", "arbor vitae", "warts remedy", "vaccination effects", "sycotic remedy"],
    semanticKeywords: ["sycotic polychrest", "dermatological wart remedy", "post-vaccinial remedy"],
    bodySystem: "Dermatologic & Genitourinary",
    urgency: "routine"
  }
};
