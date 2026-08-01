import { KnowledgeEntity } from "../../types";

export const CarboVegetabilisRemedy: KnowledgeEntity = {
  id: "R0010",
  slug: "carbo-vegetabilis",
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
    en: "Carbo Vegetabilis (Vegetable Charcoal)",
    hi: "कार्वो वेजीटेबिलिस (वेजीटेबल चारकोल)",
    gu: "કાર્બો વેજીટેબિલિસ (વેજીટેબલ ચારકોલ)",
    mr: "कार्बो व्हेजिटेबिलिस (Carbo Veg)",
    es: "Carbo Vegetabilis (Carbón Vegetal)",
    ar: "كاربو فيجيتابيليس (Carbo Veg)"
  },
  summary: {
    en: "A vital collapsed-state and gastrointestinal polychrest in classical homeopathy, traditionally known as the 'corpse reviver', indicated for air hunger, desire to be fanned close to face, severe upper abdominal flatulence, cold breath, and venous stasis.",
    hi: "होम्योपैथी में गंभीर कमजोरी, हवा की कमी (पंखे की हवा की मांग), पेट की ऊपरी गैस, और ठंडे पसीने की प्रमुख जीवनरक्षक दवा.",
    gu: "ગંભીર અશક્તિ, પંખાની હવા મેળવવાની તીવ્ર ઈચ્છા અને ઉપલા પેટમાં ગેસ માટે હોમિયોપેથીની શ્રેષ્ઠ સંજીવની સમાન દવા.",
    mr: "गंभीर अशक्तपणा, श्वास घेण्यास त्रास आणि पंख्याची हवा हवी असणाऱ्या अवस्थेवर अत्यंत गुणकारी औषध.",
    es: "Un remedio vital para estados de colapso y distensión gastrointestinal superior en homeopatía, con sed de aire y deseo de abanico cerca del rostro.",
    ar: "علاج حاد رئيسي للحالات الانهيارية والانتفاخ المعدي في المعالجة المثلية يُعرف تقليديًا بمحيي الجثث."
  },
  content: {
    latinName: "Carbo vegetabilis",
    commonName: "Vegetable Charcoal / Beechwood Charcoal",
    source: "Charcoal prepared from wood of Carpinus betulus or Fagus sylvatica, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant/Mineral",
    remedyType: "Polychrest",
    description:
      "Carbo vegetabilis is a classical polychrest introduced by Samuel Hahnemann. Celebrated for its action on collapsed vital force, sluggish capillary venous circulation, severe upper abdominal gas distension, and extreme air hunger where the patient demands to be fanned rapidly.",
    keynotes: [
      "State of low vitality, collapse, and prostration ('corpse reviver'); cold skin, cold breath, and cold sweat",
      "Air hunger; patient craves fresh air and demands to be fanned rapidly and close to the face",
      "Severe upper abdominal flatulence and bloating; stomach feels full, distended, and heavy after eating",
      "Coldness of knees, nose, hands, and feet, accompanied by internal burning heat",
      "Sluggish venous circulation, capillary stasis, cyanosis, and slow recovery after severe illness",
    ],
    mentalSymptoms: [
      "Apathy, mental sluggishness, and indifference; brain feels confused and dull",
      "Irritability towards family members despite general physical weakness",
      "Anxiety with fear of darkness, ghosts, or impending death during acute collapse",
    ],
    physicalSymptoms: [
      "Frequent sour eructations giving temporary relief from upper abdominal flatulent oppression",
      "Hoarseness and dyspnea worse in evening, damp air, and talking",
      "Venous stasis, varicose ulceration, and passive hemorrhages from mucous membranes",
      "Digestion sluggish; even simple plain food turns to gas",
    ],
    generalities:
      "Chilly patient with icy cold skin and breath. Strongly desires cool air over face and rapid fanning. Relieved by eructation.",
    modalitiesBetter: [
      "Being fanned rapidly and close to the face",
      "Fresh open air and unclosing windows",
      "Eructation (burping)",
      "Elevating feet",
    ],
    modalitiesWorse: [
      "Warm close room and humid weather",
      "Evening and night",
      "Eating fat food, butter, milk, or wine",
      "Lying flat on bed",
    ],
    clinicalUses: [
      "Supportive management in severe flatulent dyspepsia and upper abdominal distension",
      "Convalescent support for persistent debility and air hunger after severe illness",
    ],
    organAffinity: [
      "Capillaries and venous vascular circulation",
      "Gastrointestinal tract (stomach, duodenum)",
      "Respiratory system and lungs",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to elderly individuals, patients exhausted by previous severe illnesses, or infants with weak digestive assimilation.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Prepared from inert vegetable charcoal by trituration according to official pharmacopoeial standards. Potentized homeopathic dilutions (6C, 30C, 200C) are non-toxic. Immediate emergency medical care is mandatory for cardiovascular collapse, acute cyanosis, or shock.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "Why is Carbo Veg called the 'corpse reviver' in homeopathy?",
        "answer": "Carbo Veg earned this historical nickname due to its traditional use in states of severe prostration, coldness, blue skin, and air hunger, where the patient appears near collapse."
      },
      {
        "question": "What is the key environmental modality of Carbo Veg?",
        "answer": "A cardinal keynote of Carbo Veg is the intense desire to be fanned rapidly and close to the face, which helps relieve air hunger."
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
    specialty: "Gastrointestinal & Convalescent Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Carbo Veg", "Remedy", "Flatulence", "Air Hunger", "Fanning Desire"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/carbo-vegetabilis",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, fanning modalities, and classical citations"],
  clinicalPearl: "Carbo Veg is indicated in severe upper flatulent bloating and air hunger where the patient is cold yet insists on being fanned close to the face.",
  quickFacts: {
    "Latin Name": "Carbo vegetabilis",
    "Common Name": "Vegetable Charcoal",
    "Source Kingdom": "Vegetable (Charcoal)",
    "Thermal State": "Icy cold (Desires cold fanning)"
  },
  aiReadiness: {
    retrievalSummary: "Carbo vegetabilis is a classical homeopathic polychrest indicated for severe upper abdominal flatulence, air hunger, desire to be fanned rapidly, cold skin, and sluggish venous circulation.",
    clinicalSummary: "Prepared from beechwood charcoal. Homeopathic potentized dilutions are safe and non-toxic. Primary clinical affinities include gastrointestinal tract, capillaries, and respiratory system.",
    patientSummary: "Carbo vegetabilis is a homeopathic remedy used for severe gas and bloating after meals, extreme tiredness, and a feeling of needing fresh air or fanning.",
    studentSummary: "Guiding keynotes include air hunger, desire to be fanned close to face, upper abdominal gas distension relieved by burping, icy coldness of knees and breath, and blue skin.",
    keywords: ["carbo veg", "charcoal", "air hunger", "fanning desire", "bloating"],
    semanticKeywords: ["collapse polychrest", "flatulent dyspepsia remedy", "venous stasis remedy"],
    bodySystem: "Gastrointestinal & Vascular",
    urgency: "routine"
  }
};
