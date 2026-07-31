import { KnowledgeEntity } from "../../types";

export const LycopodiumRemedy: KnowledgeEntity = {
  id: "R0003",
  slug: "lycopodium",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Lycopodium (Club Moss Spores)",
    hi: "लाइकोपोडियम (क्लब मॉस बीजाणु)",
    gu: "લાયકોપોડિયમ (ક્લબ મોસ)",
    mr: "लायकोपोडियम (क्लब मॉस)",
    es: "Lycopodium (Esporas de Musgo de Club)",
    ar: "لايكوبوديوم (Lycopodium)"
  },
  summary: {
    en: "A primary mineral-like plant remedy in classical homeopathy, traditionally recognized as a deep-acting polycrest with affinity for liver, digestive, urinary, and right-sided complaints.",
    hi: "होम्योपैथी में एक प्रमुख गहरी क्रियाशील दवा, जो पेट फूलने, यकृत रोगों, गुर्दे की समस्याओं और दाहिने तरफ के लक्षणों में उपयोगी है.",
    gu: "હોમિયોપેથીમાં ઊંડી અસરકારક દવા જે લિવર, પાચન અને જમણી બાજુની તકલીફોમાં ઉપયોગી છે.",
    mr: "यकृत, मुतखडा आणि पोटातील गॅस यावर अत्यंत गुणकारी असलेले खोलवर परिणाम करणारे औषध.",
    es: "Un remedio constitucional profundo preparado a partir de esporas de musgo de club, útil en trastornos digestivos y hepáticos.",
    ar: "علاج دستوري عميق الأثر يُحضر من أبواغ طحلب النادي، مفيد في الاضطرابات الهضمية والكبدية."
  },
  content: {
    latinName: "Lycopodium clavatum",
    commonName: "Club Moss / Ground Pine",
    source: "Spores of Lycopodium clavatum prepared by trituration and potentization.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Lycopodium is a major classical polychrest described by Hahnemann, Kent, and Boericke. It features a right-sided affinity, marked digestive flatulence with 4 PM–8 PM aggravation, desire for warm food/drinks, and anticipatory anxiety combined with hidden capability.",
    keynotes: [
      "Right-sided complaints or symptoms moving right to left (right throat, right kidney, right liver)",
      "Marked 4 PM to 8 PM aggravation of physical symptoms and energy",
      "Abdominal distension and extreme flatulence immediately after eating even a small amount",
      "Desire for warm drinks and warm food; aversion to cold drinks",
      "Anticipatory anxiety with apprehension, yet executing duties capably once started",
    ],
    mentalSymptoms: [
      "Apprehensive and fearful of new responsibilities, public speaking, or meetings; lacks self-confidence initially",
      "Irritable and dictatorial at home with family, but submissive and yielding to superiors",
      "Cognitive fatigue, making mistakes in words, spelling, or names when tired",
    ],
    physicalSymptoms: [
      "Dyspepsia with sour eructations, heartburn, and fullness after a few mouthfuls",
      "Hepatic congestion, right hypochondriac fullness, and abdominal bloating",
      "Urinary lithiasis with red sand in urine and right renal colic",
      "Dryness of skin, mucosal membranes, and dry ticking cough",
    ],
    generalities:
      "Chilly patient overall, yet desires cool open air for head and breathing. Highly sensitive to tight clothing around the abdomen.",
    modalitiesBetter: [
      "Warm food and warm drinks",
      "Getting cold open air over head",
      "Unclosing tight clothes around waistband",
      "Continued gentle motion",
    ],
    modalitiesWorse: [
      "4 PM to 8 PM in the afternoon",
      "Right side of the body",
      "Cold drinks and cold food",
      "Eating to satiety (feels full after a few bites)",
    ],
    clinicalUses: [
      "Constitutional support in digestive dyspepsia and liver congestion",
      "Management of chronic flatulent colic and renal sand",
    ],
    organAffinity: [
      "Gastrointestinal tract and liver",
      "Urinary system (kidneys, bladder)",
      "Respiratory system and skin",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycotic"
    ],
    constitution:
      "Suited to intellectual, lean individuals with weak muscular development, prone to digestive flatulence and renal gravel.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw Lycopodium spores are biologically inert until triturated according to homeopathic pharmacopoeia. Potentized preparations are non-toxic. Constitutional prescribing requires clinician supervision.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What is the key time aggravation for Lycopodium?",
        "answer": "Lycopodium symptoms, both physical and mental, characteristically worsen between 4 PM and 8 PM in the late afternoon and evening."
      },
      {
        "question": "What are the temperature and food modalities for Lycopodium?",
        "answer": "Lycopodium patients generally crave warm food and warm drinks, which relieve their stomach complaints, while cold drinks irritate the stomach."
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
    specialty: "Constitutional Medicine & Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Lycopodium", "Remedy", "Bloating", "Flatulence", "Right-Sided"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/lycopodium",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with structured keynotes, modalities, and claim-level citations"],
  clinicalPearl: "Lycopodium symptoms typically demonstrate a marked 4 PM to 8 PM aggravation, a desire for warm drinks, and a right-to-left progression of complaints.",
  quickFacts: {
    "Latin Name": "Lycopodium clavatum",
    "Common Name": "Club Moss / Wolf's Claw",
    "Source Kingdom": "Vegetable (Lycopodiaceae family)",
    "Thermal State": "Warm-blooded (Desires cool air, but warm drinks)"
  },
  aiReadiness: {
    retrievalSummary: "Lycopodium is a major deep-acting constitutional polychrest remedy in classical homeopathy, prepared from Lycopodium clavatum, primarily indicated for liver, urinary, and gastrointestinal support.",
    clinicalSummary: "Prepared from spores containing sporopollenin and alkaloids. Primary clinical affinities include the gastrointestinal tract, portal venous system, kidneys, and skin, presenting with flatulence and slow digestion.",
    patientSummary: "Lycopodium is a deep-acting homeopathic remedy prepared from club moss, commonly used for gas, bloating, indigestion, and performance anxiety.",
    studentSummary: "Guiding keynotes include flatulent distension in the lower abdomen, hunger but filling up quickly after a few bites, right-to-left progression of symptoms, and apprehension before public appearances.",
    keywords: ["lycopodium", "club moss", "right-sided remedy", "bloating", "4pm to 8pm aggravation"],
    semanticKeywords: ["hepatic regulator", "constitutional gas remedy", "renal tract polychrest"],
    bodySystem: "Gastrointestinal",
    urgency: "routine"
  }
};
