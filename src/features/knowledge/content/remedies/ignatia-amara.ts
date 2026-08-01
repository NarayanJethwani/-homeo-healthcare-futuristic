import { KnowledgeEntity } from "../../types";

export const IgnatiaAmaraRemedy: KnowledgeEntity = {
  id: "R0014",
  slug: "ignatia-amara",
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
    en: "Ignatia Amara (St. Ignatius Bean)",
    hi: "इग्नेशिया अमारा (सेंट इग्नेशियस बीन)",
    gu: "ઇગ્નેશિયા અમારા (સેન્ટ ઇગ્નેશિયસ બીન)",
    mr: "इग्नेशिया अमारा (Ignatia Amara)",
    es: "Ignatia Amara (Haba de San Ignacio)",
    ar: "إغناتيا أمارا (Ignatia)"
  },
  summary: {
    en: "A cardinal neuro-emotional, grief, and hysterical polychrest in classical homeopathy, indicated for silent grief, emotional shock, paradoxical symptoms, frequent sighing, globus hystericus, and clavus headache.",
    hi: "होम्योपैथी में मानसिक सदमा, गहरा शोक/दुख, बार-बार आह भरना, और विरोधाभासी लक्षणों की प्रमुख दवा.",
    gu: "માનસિક આઘાત, ગંભીર દુઃખ/શોક, વારંવાર ઊંડા નિસાસા નાખવા અને ચમત્કારી-વિરોધાભાષી લક્ષણો માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "मानसिक धक्का, दुःख, अति-संवेदनशीलता आणि सतत उसासे टाकण्याच्या सवयीवर अत्यंत प्रभावी औषध.",
    es: "Un remedio primario en homeopatía para el duelo silencioso, shock emocional, síntomas paradójicos, suspiros frecuentes y sensación de nudo en la garganta.",
    ar: "علاج نفسي عاطفي رئيسي في المعالجة المثلية يُشار إليه للحزن الصامت، الصدمة العاطفية، والأعراض المتناقضة."
  },
  content: {
    latinName: "Strychnos ignatii",
    commonName: "St. Ignatius Bean",
    source: "Dried seeds of Strychnos ignatii containing strychnine and brucine alkaloids, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Ignatia Amara is a major antipsoric polychrest proved by Samuel Hahnemann. Celebrated for its profound action on the emotional sphere, nervous system, and acute reactions to emotional trauma, bereavement, disappointed love, or financial ruin. Key hallmarks include silent suppressed grief, frequent involuntary sighing, globus hystericus, and paradoxical physical symptoms.",
    keynotes: [
      "Acute effects of emotional trauma, silent suppressed grief, bereavement, or disappointed affection",
      "Paradoxical and contradictory symptoms (e.g. sore throat relieved by swallowing hard food, stomach pain relieved by eating, cough aggravated by coughing)",
      "Frequent, deep, involuntary sighing or sobbing; rapid mood swings from weeping to hysterical laughter",
      "Globus hystericus: sensation of a lump in the throat that cannot be swallowed down",
      "Clavus hystericus: sharp pressing headache as if a nail were driven into the side of the head, relieved by lying on painful side",
      "Hypersensitivity to tobacco smoke, coffee, and strong odors",
    ],
    mentalSymptoms: [
      "Silent, internalizing grief; brood over imaginary or real misfortunes in solitude",
      "Emotional instability; easily offended, hyper-sensitive, and intolerant of contradiction",
      "Desire for solitude to weep alone; resists consolidation",
    ],
    physicalSymptoms: [
      "Spasmodic twitching of facial muscles, eyelids, and limbs during emotional distress",
      "Dry spasmodic hacking cough without expectoration; the more patient coughs, the greater the urge to cough",
      "Dyspepsia with empty sensation in pit of stomach not relieved by eating; hiccough from grief",
      "Insomnia from emotional brooding with jerking of limbs on falling asleep",
    ],
    generalities:
      "Sensitive, emotional patient. Strongly aggravated by tobacco smoke, coffee, grief, and strong odors. Ameliorated by hard pressure and lying on painful side.",
    modalitiesBetter: [
      "Hard pressure and lying on painful side",
      "Swallowing solid food (sore throat)",
      "Warmth and change of position",
    ],
    modalitiesWorse: [
      "Tobacco smoke, coffee, and alcohol",
      "Emotional stress, grief, and sympathy",
      "Morning and open air",
      "Sweets",
    ],
    clinicalUses: [
      "Management of acute grief reactions, bereavement, situational anxiety, and post-traumatic stress",
      "Supportive care in hysterical dysphagia (globus hystericus), tension headache (clavus), and twitching disorders",
    ],
    organAffinity: [
      "Central nervous system and emotional brain (limbic system)",
      "Throat, esophagus, and pharynx",
      "Gastrointestinal tract",
    ],
    miasmaticAffinity: [
      "Psora"
    ],
    constitution:
      "Suited to refined, sensitive, artistic individuals with dark hair and high nerve tension who internalize grief.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Source seeds of Strychnos ignatii contain poisonous alkaloids strychnine and brucine. Potentized homeopathic preparations (6C, 30C, 200C) are non-toxic and free of active alkaloid toxicity. Clinical psychiatric evaluation is required for severe clinical depression, major affective disorders, or suicidal ideation.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What is the key respiratory/mental sign of Ignatia?",
        "answer": "Frequent, deep, involuntary sighing accompanied by silent grief and mood swings is a cardinal diagnostic keynote of Ignatia."
      },
      {
        "question": "What does 'paradoxical symptom' mean in Ignatia?",
        "answer": "Ignatia is famous for contradictory symptoms where physical distress defies normal physiological expectations, such as a sore throat relieved by swallowing hard bread or stomach pain relieved by heavy meals."
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
    specialty: "Psychosomatic & Neuro-Emotional Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Ignatia", "Remedy", "Grief", "Sighing", "Paradoxical Symptoms"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/ignatia-amara",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with grief keynotes, paradoxical symptoms, and classical citations"],
  clinicalPearl: "Ignatia is indicated in acute silent grief and emotional trauma characterized by frequent sighing, globus throat sensation, and paradoxical physical relief.",
  quickFacts: {
    "Latin Name": "Strychnos ignatii",
    "Common Name": "St. Ignatius Bean",
    "Source Kingdom": "Plant (Loganiaceae family)",
    "Thermal State": "Variable / Sensitive to cold draft"
  },
  aiReadiness: {
    retrievalSummary: "Ignatia Amara is a major classical homeopathic polychrest for acute silent grief, emotional shocks, paradoxical symptoms, frequent sighing, globus hystericus, and hysterical headaches.",
    clinicalSummary: "Source seeds contain strychnine/brucine. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include central nervous system, limbic emotional system, and throat.",
    patientSummary: "Ignatia Amara is a homeopathic remedy used for emotional distress, grief after loss or heartbreak, frequent deep sighing, and throat tightness.",
    studentSummary: "Guiding keynotes include acute silent grief, frequent involuntary sighing, paradoxical physical symptoms, globus hystericus, clavus headache, and aggravation from tobacco smoke.",
    keywords: ["ignatia", "st ignatius bean", "grief remedy", "sighing", "globus hystericus"],
    semanticKeywords: ["grief polychrest", "emotional trauma remedy", "hysterical symptom remedy"],
    bodySystem: "Nervous & Emotional",
    urgency: "routine"
  }
};
