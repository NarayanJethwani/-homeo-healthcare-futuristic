import { KnowledgeEntity } from "../../types";

export const ChamomillaRemedy: KnowledgeEntity = {
  id: "R0011",
  slug: "chamomilla",
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
    en: "Chamomilla (German Chamomile)",
    hi: "कैमोमिला (जर्मन कैमोमाइल)",
    gu: "કેમોમિલા (જર્મન કેમોમાઈલ)",
    mr: "कॅमोमिला (Chamomilla)",
    es: "Chamomilla (Manzanilla Alemana)",
    ar: "كاموميلا (Chamomilla)"
  },
  summary: {
    en: "A cardinal pediatric, dental, and neuro-emotional polychrest in classical homeopathy, indicated for intolerable pain, extreme anger and irritability, desire to be carried, one cheek red and one pale, and green stools during dentition.",
    hi: "होम्योपैथी में अत्यधिक गुस्सा, चिड़चिड़ापन, बच्चों के दांत निकलने का दर्द, और बच्चे को गोद में उठाने की मांग की प्रमुख दवा.",
    gu: "બાળકોના દાંત આવવાના સમયનો અસહ્ય દુખાવો, અતિશય ગુસ્સો અને ઉંચકીને ફેરવવાની ઈચ્છા માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "दांत येताना होणारा त्रास, मुलांचा प्रचंड चिडचिडपणा आणि अस्वस्थतेवर अत्यंत प्रभावी औषध.",
    es: "Un remedio primario en homeopatía infantil y del dolor, caracterizado por dolor insoportable, gran irritabilidad, deseo de ser cargado y una mejilla roja y otra pálida.",
    ar: "علاج رئيسي للأطفال والآلام الشديدة في المعالجة المثلية، يُشار إليه بالانزعاج الشديد والآلام التي لا تُطاق."
  },
  content: {
    latinName: "Matricaria chamomilla",
    commonName: "German Chamomile",
    source: "Fresh whole flowering plant of Matricaria chamomilla, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Chamomilla is a major antipsoric polychrest proved by Samuel Hahnemann. Recognized for its profound action on the nervous system, pediatric irritability, and pain tolerance. Key features include anger out of proportion to cause, children quiet only when carried, one cheek red and hot while the other is pale and cold, and green spinach-like diarrheal stools during teething.",
    keynotes: [
      "Extreme emotional irritability, impatience, and snappish anger; pain feels unbearable and drives patient to despair",
      "Teething infants demand to be carried constantly; quiet and calm only while being rocked or carried",
      "Facial asymmetry: one cheek is red and hot, while the other cheek is pale and cold",
      "Diarrhea during dentition with green, watery, rotten-egg smelling stools ('chopped spinach')",
      "Overt sensitivity to cold air, wind, coffee, and narcotics",
      "Thirst for cold water during feverish states with hot head and cold body",
    ],
    mentalSymptoms: [
      "Bad temper and quarrelsome demeanor; snarls at anyone who approaches or offers help",
      "Child piteously demands things, then angrily rejects them when offered",
      "Averse to talk or being touched; cannot bear to be spoken to",
    ],
    physicalSymptoms: [
      "Otalgia in children with severe piercing pain driving child wild",
      "Severe labor pains or dysmenorrhea with violent cramping tearing downwards in thighs",
      "Toothache worse from warm drinks and night; relieved temporarily by holding cold water in mouth",
    ],
    generalities:
      "Hot and sensitive patient, worse at night and from anger. Strongly ameliorated by being carried.",
    modalitiesBetter: [
      "Being carried, rocked, or held in arms",
      "Warm humid weather",
      "Cold drinks (toothache)",
    ],
    modalitiesWorse: [
      "Heat, warm drinks, and warm applications",
      "Night (especially 9 PM to midnight)",
      "Anger and contradiction",
      "Wind and cold damp air",
    ],
    clinicalUses: [
      "Pediatric dentition distress, infantile colic, and nocturnal earache",
      "Management of severe dysmenorrhea, toothache, and pain-induced irritability",
    ],
    organAffinity: [
      "Central and peripheral nervous system",
      "Gastrointestinal tract and liver",
      "Dental nerves and ears",
    ],
    miasmaticAffinity: [
      "Psora"
    ],
    constitution:
      "Suited to nervous, irritable children, dark-haired individuals, and patients with heightened pain sensitivity.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Botanical source tincture prepared from Matricaria chamomilla. Homeopathic potentized preparations (6C, 30C, 200C) are safe and non-toxic. Clinical evaluation is recommended for severe ear infections or high pediatric fever.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What is the classic mental indication for Chamomilla in children?",
        "answer": "The classic indication is intense irritability where the child screams, demands to be carried constantly, and calms down only while being carried or rocked."
      },
      {
        "question": "What facial keynote distinguishes Chamomilla?",
        "answer": "Chamomilla features a characteristic facial heat pattern where one cheek is bright red and hot, while the other is pale and cold."
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
    specialty: "Pediatric & Neuro-Emotional Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Chamomilla", "Remedy", "Teething", "Irritability", "Carried Desire"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/chamomilla",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with pediatric keynotes, cheek asymmetry, and classical citations"],
  clinicalPearl: "Chamomilla is indicated for unbearable pain accompanied by violent anger, where a crying child is pacified only when carried.",
  quickFacts: {
    "Latin Name": "Matricaria chamomilla",
    "Common Name": "German Chamomile",
    "Source Kingdom": "Plant (Asteraceae family)",
    "Thermal State": "Hot / Sensitive to heat"
  },
  aiReadiness: {
    retrievalSummary: "Chamomilla is a major classical homeopathic remedy for pediatric teething, unbearable pain, extreme irritability, desire to be carried, one cheek red and one pale, and green diarrheal stools.",
    clinicalSummary: "Botanical source German chamomile. Homeopathic potentized dilutions are non-toxic. Primary clinical affinities include nervous system, digestive tract, dental nerves, and ears.",
    patientSummary: "Chamomilla is a homeopathic remedy used for fussy teething babies who want to be held continuously, as well as adults suffering from severe toothache or cramps with bad temper.",
    studentSummary: "Guiding keynotes include unbearable pain driving to anger, child quiet only when carried, one cheek red/hot and one pale/cold, green rotten-egg stool during dentition, and aggravation from heat.",
    keywords: ["chamomilla", "chamomile", "teething remedy", "irritability", "carried desire"],
    semanticKeywords: ["pediatric dentition polychrest", "intolerable pain remedy", "neuro-emotional remedy"],
    bodySystem: "Nervous & Gastrointestinal",
    urgency: "routine"
  }
};
