import { KnowledgeEntity } from "../../types";

export const AconitumNapellusRemedy: KnowledgeEntity = {
  id: "R0004",
  slug: "aconitum-napellus",
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
    en: "Aconitum Napellus (Monkshood / Wolfsbane)",
    hi: "एकोनाइटनेपेलस (मोंकशूड / भेड़ियाबैन)",
    gu: "એકોનાઇટ નેપેલસ (મોન્કશૂડ)",
    mr: "एकोनाईट नॅपेलस (Monkshood)",
    es: "Aconitum Napellus (Acónito / Capuchón de Monje)",
    ar: "أكونيتوم نابيلوس (Aconitum Napellus)"
  },
  summary: {
    en: "A vital acute polychrest in classical homeopathy, indicated for sudden, intense, storm-like inflammatory or neurological complaints triggered by exposure to cold dry winds or acute emotional shock.",
    hi: "होम्योपैथी में एक प्रमुख तीव्र दवा, जो अचानक, तेज बुखार, घबराहट, और ठंडी सूखी हवा से उत्पन्न बीमारियों में अत्यधिक उपयोगी है.",
    gu: "હોમિયોપેથીમાં અચાનક અને તીવ્ર તાવ, ગભરાટ અને ઠંડી સુકી હવા દ્વારા થતા રોગો માટે મુખ્ય દવા.",
    mr: "अचानक उद्भवणारा तीव्र ताप, भीती आणि गार वाऱ्यामुळे होणाऱ्या आजारांवर अत्यंत प्रभावी औषध.",
    es: "Un remedio agudo clave en homeopatía para afecciones inflamatorias o nerviosas de inicio súbito e intenso tras frío seco o shock.",
    ar: "علاج حاد رئيسي في المعالجة المثلية للحالات التهابية أو العصبية المفاجئة والشديدة."
  },
  content: {
    latinName: "Aconitum napellus",
    commonName: "Monkshood / Wolfsbane",
    source: "Fresh plant with root of Aconitum napellus collected at commencement of flowering, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Aconitum napellus is a classic acute polychrest established by Samuel Hahnemann. Characterized by sudden, violent onset of symptoms, intense fear of death, mental restlessness, dry hot skin, and unquenchable thirst for cold water, especially following exposure to dry, cold winds.",
    keynotes: [
      "Sudden, storm-like onset of complaints after exposure to cold, dry winds or emotional shock",
      "Intense anxiety, mental restlessness, and terror with explicit fear of death (predicts time of death)",
      "High fever with dry, burning skin, full bounding arterial pulse, and absence of perspiration",
      "Unquenchable thirst for cold water during acute fever",
      "Face red and hot when lying down, but turns pale and dizzy on rising up",
    ],
    mentalSymptoms: [
      "Extreme panic, agitation, and motor restlessness; cannot lie still",
      "Overwhelming fear of death, crowds, crossing streets, or sudden collapse",
      "Hypersensitivity to noise, light, music, and physical touch during acute states",
    ],
    physicalSymptoms: [
      "Acute arterial congestion with rapid, hard, bounding pulse",
      "Local inflammation with intense heat, redness, shooting pains, and numbness/tingling",
      "Acute croupy dry cough, stridor, and chest oppression worse at night around midnight",
      "Neuralgias (trigeminal, sciatic) accompanied by numbness, tingling, and extreme agitation",
    ],
    generalities:
      "Complaints come on suddenly and violently. Strongly aggravated by cold dry winds, evening, and night around midnight.",
    modalitiesBetter: [
      "Open air",
      "Warm perspiration (signals resolution of dry heat phase)",
      "Rest and quiet environment",
    ],
    modalitiesWorse: [
      "Cold dry winds and draft of air",
      "Night, especially around midnight",
      "Rising up from lying position (causes paleness and vertigo)",
      "Warm room or close atmosphere",
    ],
    clinicalUses: [
      "Acute initial phase of febrile illnesses prior to localized exudation",
      "Management of acute panic attacks and neuralgia with numbness",
    ],
    organAffinity: [
      "Cardiovascular system and arterial circulation",
      "Central and peripheral nervous system",
      "Respiratory mucous membranes and skin",
    ],
    miasmaticAffinity: [
      "Psora",
      "Acute Miasm"
    ],
    constitution:
      "Suited to robust, plethoric individuals with strong circulation who experience sudden, violent acute illnesses.",
    potencies: [
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw Aconitum napellus is extremely toxic due to aconitine alkaloids (causing fatal arrhythmias and respiratory paralysis). Raw plant tinctures are strictly restricted; homeopathic preparations must be potentized (30C/200C). Immediate emergency evaluation is mandatory for severe dyspnea, chest pain, or anaphylaxis.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006"
    ],
    faqs: [
      {
        "question": "What is the classic trigger for an Aconitum state?",
        "answer": "Aconitum complaints are classically triggered by exposure to dry, cold winds, or by sudden fright/emotional shock."
      },
      {
        "question": "Is raw Aconitum plant material safe?",
        "answer": "No. Raw Aconitum napellus is a deadly poison containing aconitine. Homeopathic Aconitum must be highly diluted and potentized (e.g., 30C, 200C) according to official pharmacopoeial standards."
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
    specialty: "Constitutional Medicine & Acute Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Aconitum", "Remedy", "Fever", "Fear of Death", "Cold Wind Trigger"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/aconitum-napellus",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, toxicology warnings, and classical citations"],
  clinicalPearl: "Aconitum is indicated in the first 24 hours of sudden acute fevers with dry hot skin, terror, thirst, and bounding pulse before localized suppuration begins.",
  quickFacts: {
    "Latin Name": "Aconitum napellus",
    "Common Name": "Monkshood / Wolfsbane",
    "Source Kingdom": "Vegetable (Ranunculaceae family)",
    "Thermal State": "Hot skin, dry heat (Desires cold water)"
  },
  aiReadiness: {
    retrievalSummary: "Aconitum napellus is a major acute homeopathic polychrest indicated for sudden onset high fever, intense restlessness, terror, and dry hot skin following cold wind exposure.",
    clinicalSummary: "Botanical source contains aconitine. Potentized remedies are non-toxic. Primary clinical indications include early febrile onset, panic states, trigeminal neuralgia, and croupy cough.",
    patientSummary: "Aconitum napellus is a homeopathic remedy used for sudden high fevers, dry coughs, and intense anxiety triggered by cold weather or fright.",
    studentSummary: "Guiding keynotes include sudden onset, fear of death, dry hot skin without perspiration, thirst for cold water, and aggravation from cold dry wind.",
    keywords: ["aconitum", "monkshood", "fever remedy", "fear of death", "sudden onset"],
    semanticKeywords: ["acute febrile remedy", "neuralgia polychrest", "panic anxiety remedy"],
    bodySystem: "Nervous & Cardiovascular",
    urgency: "routine"
  }
};
