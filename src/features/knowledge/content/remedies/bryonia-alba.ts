import { KnowledgeEntity } from "../../types";

export const BryoniaAlbaRemedy: KnowledgeEntity = {
  id: "R0008",
  slug: "bryonia-alba",
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
    en: "Bryonia Alba (White Bryony / Wild Hops)",
    hi: "ब्रायोनिया अल्बा (व्हाइट ब्रायनी / वाइल्ड हॉप्स)",
    gu: "બ્રાયોનિયા અલ્બા (વાયલ્ડ હોપ્સ)",
    mr: "ब्रायोनिया अल्बा (Wild Hops)",
    es: "Bryonia Alba (Nuez Blanca / Lúpulo Silvestre)",
    ar: "برايونيا ألكا (Bryonia Alba)"
  },
  summary: {
    en: "A cornerstone polychrest in classical homeopathy, indicated for inflammatory conditions of serous membranes, joints, and respiratory mucosa characterized by stitching pain, extreme dryness, thirst for large quantities of cold water, and severe aggravation from motion.",
    hi: "हिलने-डुलने से बढ़ने वाले दर्द, सूखी खांसी, अत्यधिक प्यास, और जोड़ों में सुई चुभने जैसे दर्द की होम्योपैथिक दवा.",
    gu: "સહેજ પણ હલનચલનથી વધતા દુખાવા, સુકી ઉધરસ અને અતિશય તરસ માટે હોમિયોપેથીની મુખ્ય ક્રોનિક અને એક્યુટ દવા.",
    mr: "हलताच वाढणाऱ्या वेदना, कोरडा खोकला आणि खूप तहान लागण्यावर अत्यंत गुणकारी औषध.",
    es: "Un remedio polychrest fundamental en homeopatía para inflamación de serosas y articulaciones peor por el menor movimiento.",
    ar: "علاج رئيسي في المعالجة المثلية للحالات التهابية في الأغشية المصلية والمفاصل ساءت مع الحركة."
  },
  content: {
    latinName: "Bryonia alba",
    commonName: "White Bryony / Wild Hops",
    source: "Fresh root of Bryonia alba collected before flowering, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Bryonia alba is a fundamental polychrest in classical homeopathy established by Samuel Hahnemann. Its central clinical features are stitching pains worsened by the slightest physical movement, relief from firm pressure and lying on the painful side, marked dryness of mucous membranes, and thirst for large volumes of cold water.",
    keynotes: [
      "Extreme aggravation from the slightest physical movement or motion; absolute rest is demanded",
      "Amelioration from firm pressure and lying directly on the painful affected side",
      "Stitching, tearing pains in serous membranes (pleura, peritoneum) and joints",
      "Extreme dryness of all mucous membranes (dry cracked lips, parched tongue, dry hard stool as if burnt)",
      "Unquenchable thirst for large quantities of cold water at long intervals",
    ],
    mentalSymptoms: [
      "Irritable, easily angered; desires to be left undisturbed in absolute quiet",
      "Delirium during fever with continuous talk about business, work, or desire to go home",
      "Apprehension regarding financial security and business affairs",
    ],
    physicalSymptoms: [
      "Dry, painful, hard cough with chest stitching pains; patient holds the chest firmly when coughing",
      "Acute articular rheumatism and joint swelling, hot and pale red, painful on least motion",
      "Dry constipation with hard, dry, dark stool as if burnt; lack of intestinal secretion",
      "Right-sided liver congestion with stitching pain in right hypochondrium worse on inspiration",
    ],
    generalities:
      "Chilly overall, yet desires cold water. Modalities dominated by motion (worse) and rest/pressure (better).",
    modalitiesBetter: [
      "Absolute rest and lying completely still",
      "Firm pressure on painful part",
      "Lying on the painful side",
      "Cold drinks and cool applications",
    ],
    modalitiesWorse: [
      "Any physical motion or movement (even moving eyes or coughing)",
      "Warmth and warm room",
      "Morning upon first moving",
      "Eating and deep inspiration",
    ],
    clinicalUses: [
      "Supportive management in acute pleurisy, tracheobronchitis, and dry cough",
      "Management of acute articular inflammation, constipation, and mastitis",
    ],
    organAffinity: [
      "Serous membranes (pleura, peritoneum, pericardium, synovia)",
      "Respiratory mucosa and lungs",
      "Gastrointestinal tract, liver, and joints",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to firm, dark-complexioned, irritable individuals with strong muscular fiber who are prone to bilious and rheumatic complaints.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw Bryonia root contains toxic cucurbitacin glycosides (bryonin) that cause severe gastrointestinal ulceration, emesis, and bloody diarrhea. Raw plant material is strictly toxic; homeopathic preparations must be potentized (30C/200C). Urgent clinical evaluation is required for severe chest pain, dyspnea, or acute abdomen.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006"
    ],
    faqs: [
      {
        "question": "What is the characteristic motion modality of Bryonia?",
        "answer": "Bryonia is characterized by extreme aggravation from even the slightest motion or movement, and relief from remaining completely still in absolute rest."
      },
      {
        "question": "How does Bryonia pain respond to pressure?",
        "answer": "Unlike many remedies, Bryonia pain is relieved by firm pressure and by lying directly on the painful side, which immobilizes the affected area."
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
    specialty: "Rheumatic & Respiratory Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Bryonia", "Remedy", "Stitching Pain", "Worse Motion", "Dry Cough"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/bryonia-alba",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, bryonin toxicity warnings, and classical citations"],
  clinicalPearl: "Bryonia is indicated in dry inflammatory states where the slightest motion aggravates, pressure relieves, and thirst for cold water is intense.",
  quickFacts: {
    "Latin Name": "Bryonia alba",
    "Common Name": "White Bryony / Wild Hops",
    "Source Kingdom": "Vegetable (Cucurbitaceae family)",
    "Thermal State": "Desires cold water (Worse warmth)"
  },
  aiReadiness: {
    retrievalSummary: "Bryonia alba is a cardinal classical homeopathic polychrest indicated for pleurisy, joint inflammation, dry cough, and constipation characterized by stitching pain worsened by motion.",
    clinicalSummary: "Botanical source contains cucurbitacins. Homeopathic potentized remedies are non-toxic. Primary clinical affinities are serous membranes, synovia, respiratory tract, and liver.",
    patientSummary: "Bryonia alba is a homeopathic remedy used for dry painful coughs, joint pain, and headache that feel much worse with any movement and better with rest.",
    studentSummary: "Guiding keynotes include aggravation from least motion, relief from pressure and lying on painful side, stitching pain, mucous membrane dryness, and thirst for cold water.",
    keywords: ["bryonia", "white bryony", "worse motion", "stitching pain", "dry cough"],
    semanticKeywords: ["serous membrane polychrest", "pleurisy remedy", "rheumatic polychrest"],
    bodySystem: "Respiratory & Musculoskeletal",
    urgency: "routine"
  }
};
