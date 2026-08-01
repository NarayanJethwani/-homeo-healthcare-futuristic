import { KnowledgeEntity } from "../../types";

export const AntimoniumTartaricumRemedy: KnowledgeEntity = {
  id: "R0025",
  slug: "antimonium-tartaricum",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-01T12:00:00Z",
    reviewed: "2026-08-01T12:00:00Z",
  },
  title: {
    en: "Antimonium Tartaricum (Tartar Emetic)",
    hi: "एंटीमोनियम टार्टरिकम (टार्टर एमेटिक)",
    gu: "એન્ટીમોનિયમ ટાર્ટરિકમ (ટાર્ટર એમેટિક)",
    mr: "एंटीमोनियम टार्ट (Antimonium Tart)",
    es: "Antimonium Tartaricum (Tártaro Emético)",
    ar: "أنتيمونيوم طارطاريجوم (Antimonium Tart)"
  },
  summary: {
    en: "A cardinal respiratory, pediatric, and geriatric mineral-salt polychrest in classical homeopathy, indicated for coarse rattling bronchial mucus with inability to expectorate, prostration, cyanosis, pale cold sweaty face, and white pasty tongue.",
    hi: "होम्योपैथी में छाती में बलगम की घरघराहट, कफ न निकाल पाना, नीले होंठ, और सांस फूलने की प्रमुख आपातकालीन दवा.",
    gu: "છાતીમાં કફનો ભરાવો અને ઘડઘડાટ, કફ બહાર ન નીકળી શકવો, શ્વાસ ચડવો અને અશક્તિ માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "छातीत कफ साचून होणारा घरघर आवाज, कफ बाहेर न पडणे आणि श्वासोच्छवासाच्या त्रासावर अत्यंत प्रभावी औषध.",
    es: "Un remedio fundamental en homeopatía para mucosidad bronquial ruidosa con incapacidad para expectorar, prostración, cianosis y cara pálida sudorosa.",
    ar: "علاج معدني رئيسي للجهاز التنفسي في المعالجة المثلية يُشار إليه للخرخرة الشعبية الشديدة وعدم القدرة على إخراج البصاق."
  },
  content: {
    latinName: "Potassium antimony tartrate",
    commonName: "Tartar Emetic / Tartarated Antimony",
    source: "Chemical salt potassium antimony tartrate K(SbO)C4H4O6·1/2H2O potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Antimonium Tartaricum is a major respiratory polychrest proved by Samuel Hahnemann. Celebrated for its unique action on bronchial mucous membranes, vagus nerve, pulmonary circulation, and gastrointestinal motility. Key features include loud coarse rattling of mucus in the chest with helpless inability to cough it up, cyanotic prostration, cold clammy facial sweat, and thick white tongue coating.",
    keynotes: [
      "Loud coarse rattling of mucus in bronchial tree; chest seems full of phlegm, yet patient is too weak to expectorate",
      "Great drowsiness, prostration, cyanosis, and impending asphyxia from pulmonary accumulation",
      "Pale, bluish, sunken face covered with cold clammy perspiration, especially on forehead",
      "Thick white pasty coating on tongue; red papillae showing through; craves apples and acid fruits",
      "Nausea with intense loathing of food, violent retching, and prostration relieved by vomiting",
      "Child cannot bear to be touched or looked at; cries angrily if approached",
    ],
    mentalSymptoms: [
      "Drowsiness, stupor, and mental confusion; indifference to surroundings during respiratory distress",
      "Peevish, irritable, and whining disposition in sick children; desires to be left alone",
      "Fear of being alone with anxiety and restlessness",
    ],
    physicalSymptoms: [
      "Capillary bronchitis, broncho-pneumonia, and pulmonary edema with suffocation",
      "Dyspnea compelling patient to sit up upright (orthopnea); worse at 3 AM",
      "Gastroenteritis with nausea, vomiting, and watery diarrheal stools",
      "Pustular skin eruptions leaving bluish pits resembling smallpox scars",
    ],
    generalities:
      "Chilly patient with cold extremities. Strongly aggravated by warmth, lying down, and 3 AM. Ameliorated by sitting erect and expectoration.",
    modalitiesBetter: [
      "Sitting upright (relieves dyspnea)",
      "Expectoration of phlegm",
      "Eructation and lying on right side",
    ],
    modalitiesWorse: [
      "Warm room and warm weather",
      "Lying flat in bed",
      "Morning (3 AM) and damp cold",
      "Milk and sweet foods",
    ],
    clinicalUses: [
      "Traditional materia-medica profile associated with rattling respiratory symptom patterns",
      "Historical homeopathic literature association with weak expectoration and prostration",
    ],
    organAffinity: [
      "Bronchial mucous membranes and pulmonary alveoli",
      "Pneumogastric (vagus) nerve and respiratory center",
      "Gastrointestinal tract and skin",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to young infants, elderly patients, or debilitated individuals with weak respiratory musculature.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw tartar emetic is a toxic antimony compound. A dilution label alone does not prove product safety, composition, or quality; FDA has approved no product labeled homeopathic. Cyanosis, severe breathlessness, drowsiness, weak expectoration, or suspected respiratory failure requires emergency medical care and must never be managed with homeopathy alone.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007",
      "CIT-0023",
      "CIT-0024"
    ],
    faqs: [
      {
        "question": "What is the cardinal chest keynote of Antimonium Tart?",
        "answer": "Loud, coarse rattling of mucus in the chest with complete inability to cough it up or expectorate due to respiratory weakness."
      },
      {
        "question": "How does Antimonium Tart present in facial appearance?",
        "answer": "The face is pale, bluish (cyanotic), sunken, and covered with cold, clammy sweat, reflecting low oxygenation and prostration."
      }
    ]
  },
  claimCitations: [
    {
      claimId: "R0025-TRADITIONAL-PROFILE",
      statement: "Verified classical materia-medica sources describe Antimonium Tartaricum using coarse rattling mucus, weak expectoration, drowsiness, cyanosis, and cold sweat.",
      citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"],
      passageId: "CIT-0006-R0025-TRADITIONAL-PROFILE",
    },
    {
      claimId: "R0025-EVIDENCE-LIMITS",
      statement: "The historical profile is traditional literature evidence and does not establish modern clinical efficacy for any disease.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS",
    },
    {
      claimId: "R0025-PRODUCT-SAFETY",
      statement: "A homeopathic dilution label does not by itself guarantee product composition, quality, safety, or effectiveness.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY",
    },
    {
      claimId: "R0025-CONVENTIONAL-CARE-BOUNDARY",
      statement: "Homeopathic products must not delay emergency assessment or replace proven conventional treatment for serious or life-threatening symptoms.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY",
    },
  ],
  redFlags: [
    "Cyanosis, severe breathlessness, confusion, or inability to clear secretions requires emergency care.",
    "Do not delay oxygenation, airway support, antibiotics, bronchodilators, or other evidence-based respiratory treatment.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Pulmonary & Emergency Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Antimonium Tart", "Remedy", "Rattling Chest", "Inability to Expectorate", "Cyanosis"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/antimonium-tartaricum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with rattling mucus keynotes, cyanosis, and classical citations"],
  clinicalPearl: "Antimonium Tart is indicated in loud rattling bronchial phlegm where the patient is too weak to expectorate, accompanied by cyanosis and cold sweat.",
  quickFacts: {
    "Latin Name": "Potassium antimony tartrate",
    "Common Name": "Tartar Emetic",
    "Source Kingdom": "Mineral",
    "Thermal State": "Chilly (Cold sweat & extremities)"
  },
  aiReadiness: {
    retrievalSummary: "Antimonium Tartaricum is a major mineral homeopathic polychrest for loud rattling bronchial mucus with inability to expectorate, cyanotic prostration, cold sweat, and pale face.",
    clinicalSummary: "Classical literature derives this profile from tartar emetic and describes respiratory and gastrointestinal symptom patterns; it does not establish clinical efficacy or guarantee product safety.",
    patientSummary: "Classical texts associate Antimonium Tartaricum with rattling mucus and weak expectoration. These can signal a medical emergency and require prompt conventional assessment.",
    studentSummary: "Guiding keynotes include loud coarse rattling phlegm, inability to expectorate, pale cyanotic face with cold sweat, white pasty tongue, and relief sitting upright.",
    keywords: ["antimonium tart", "tartar emetic", "rattling chest", "bronchitis remedy", "cyanosis"],
    semanticKeywords: ["respiratory polychrest", "broncho-pneumonia remedy", "pulmonary congestion remedy"],
    bodySystem: "Respiratory & Cardiovascular",
    urgency: "emergency"
  }
};
