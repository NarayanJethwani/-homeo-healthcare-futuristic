import { KnowledgeEntity } from "../../types";

export const PyrogeniumRemedy: KnowledgeEntity = {
  id: "R0061",
  slug: "pyrogenium",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z",
  },
  title: {
    en: "Pyrogenium (Sepsis / Artificial Pyrogen)",
    hi: "पायरोजेनियम (पाय्रोजन / सेप्सिस नोसोड)",
    gu: "પાયરોજેનિયમ (સેપ્સિસ નોસોડ)",
    mr: "पायरोजेनियम (Pyrogenium)",
    es: "Pyrogenium (Pirógeno Artificial)",
    ar: "بايروجينيوم (Pyrogenium)"
  },
  summary: {
    en: "A cardinal sepsis and septic fever nosode in classical homeopathic materia medica, historically described for marked pulse-temperature discordance (rapid pulse with moderate fever or vice versa), bruised soreness where the bed feels too hard, and horribly offensive carrion-like discharges.",
    hi: "होम्योपैथिक साहित्य में बुखार और नाड़ी की गति में भारी असंतुलन (तेज नाड़ी पर कम बुखार), पूरे शरीर में भयंकर कुचलन जैसा दर्द जिससे बिस्तर पत्थर जैसा सख्त लगे, और सड़ी लाश जैसी बदबूदार स्राव की प्रमुख वर्णित नोसोड औषधि.",
    gu: "નાડીના ધબકારા અને તાવના તાપમાન વચ્ચે ભારે વિસંગતતા (નાડી અતિશય ઝડપી અને તાવ ઓછો), બિસ્તર પથ્થર જેવો કઠણ લાગે તેવી આખા શરીરની કળતર અને સડેલા માંસ જેવી અતિ દુર્ગંધવાળા સ્રાવ માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "नाडीचे ठोके आणि ताप यांमधील विसंगती, अंथरुण अतिशय कठीण वाटण्याइतकी शरीराची दुखणी आणि सडलेल्या मांसासारख्या दुर्गंधीयुक्त स्रावावर अत्यंत गुणकारी पारंपरिक नोसोड औषध.",
    es: "Un nosode fundamental para sepsis y estados sépticos en materia médica homeopática, descrito históricamente para discordancia entre pulso y temperatura, dolor contusivo donde la cama se siente dura y descargas fétidas cadavéricas.",
    ar: "علاج نوسود رئيسي للإنتان والحمى الإنتانية في المعالجة المثلية يُوصف تاريخياً لعدم التوافق بين النبض والحرارة وألم العظام حيث يبدو السرير صلباً والإفرازات الكريهة الشبيهة بالجيف."
  },
  content: {
    latinName: "Pyrogenium",
    commonName: "Pus / Sepsis Nosode (Decomposed Lean Beef)",
    source: "Prepared from the sterile aqueous extract of decomposed lean beef subjected to natural autolysis, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Nosode",
    remedyType: "Polychrest",
    description:
      "Pyrogenium is a profound septic nosode proved by Dr. Drysdale, Dr. Burnett, and Dr. Swan. In classical homeopathic texts, it occupies a vital clinical position in the management of severe adynamic, typhoid-like, and septic fevers. Key features recorded in materia medica include an unmistakable pulse-temperature disproportion (such as a rapid, thready pulse of 120–140 bpm with a moderate temperature of 100°F, or conversely high fever with an abnormally slow pulse), intense generalized bruised muscular soreness causing the patient to complain that the bed feels intensely hard (forcing constant movement resembling Rhus Tox and Arnica), horribly offensive, carrion-like odor of all discharges, breath, sweat, and stool, and severe septic chilliness starting in the back between the scapulae.",
    keynotes: [
      "Historically described for marked disparity between pulse rate and body temperature (e.g. pulse 130 with temperature 99°F, or high fever with slow pulse)",
      "Intense bruised soreness of whole body: bed feels like stones, forcing patient to move constantly to find a soft spot (combining Arnica soreness and Rhus Tox restlessness)",
      "Horribly offensive, putrid, carrion-like odor of all secretions, lochia, sweat, breath, and stool",
      "Severe chilliness beginning in back between scapulae, not relieved by heat or covers",
      "Puerperal fever, septicemia, and absorption of septic materials following childbirth, abortion, or surgical abscesses",
      "Tongue is clean, fiery red, smooth, and dry, looking as if varnished or cracked",
    ],
    mentalSymptoms: [
      "Talkative and loquacious with rapid flight of ideas during feverish states",
      "Hallucinations: feels as if crowded with arms and legs, or that body parts are separated",
      "Restless and anxious, especially at night between 1:00 AM and 4:00 AM",
    ],
    physicalSymptoms: [
      "Puerperal sepsis with offensive lochia, pelvic tenderness, and high pulse rate",
      "Chronic recurrent boils, carbuncles, and dissecting cellulitis with foul ichorous pus",
      "Obstinate diarrhea with black, horribly putrid, water-like stools or complete septic constipation with large hard balls",
    ],
    generalities:
      "Chilly patient with internal burning heat. Strongly aggravated by cold air, dampness, and rest in one posture. Ameliorated by motion, changing position, heat, and sweating.",
    modalitiesBetter: [
      "Constant motion and changing position",
      "Warmth and hot applications",
      "Establishment of profuse sweat",
    ],
    modalitiesWorse: [
      "Rest and remaining still in bed",
      "Cold damp weather and drafts",
      "Sitting up",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in septic fever profiles, pulse-temperature discordance, and post-surgical adynamia",
      "Historical materia medica reference for puerperal septicemia and putrid discharge profiles",
    ],
    organAffinity: [
      "Blood, vascular endothelium, and immune system",
      "Thermoregulatory center and autonomic cardiac plexus",
      "Mucous membranes, pelvic viscera, and skin",
    ],
    miasmaticAffinity: [
      "Psora",
      "Syphilis",
      "Tubercular"
    ],
    constitution:
      "Suited to septic, exhausted, cachectic individuals overwhelmed by bacterial toxins, pelvic infections, or slow surgical recovery.",
    potencies: [
      "30C",
      "200C",
      "1M",
      "10M"
    ],
    safetyNotes:
      "Biological nosode source prepared from autolyzed organic matter; source-specific sterilization and pharmacopoeial validation are required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute septic shock, bacteremia, puerperal pelvic peritonitis, necrotizing fasciitis, or systemic inflammatory response syndrome (SIRS) requires immediate emergency intensive care resuscitation, hemodynamic support, and parenteral antibiotics; this traditional profile must not delay proven care.",
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
        "question": "What is the cardinal objective clinical keynote for Pyrogenium in classical texts?",
        "answer": "In traditional homeopathic materia medica, Pyrogenium is characterized by marked pulse-temperature discordance, where the pulse rate is extremely rapid (120–140 bpm) while body temperature remains disproportionately low, or vice versa."
      },
      {
        "question": "How does the physical restlessness of Pyrogenium compare to Arnica and Rhus Tox?",
        "answer": "Pyrogenium combines the extreme bruised bed-feels-too-hard soreness of Arnica with the continuous restless need to change positions of Rhus Tox, driven by septic aching."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0061-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0061-TRADITIONAL-PROFILE" },
    { claimId: "R0061-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for bacteremia, septic shock, or puerperal sepsis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0061-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0061-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for septic shock, parenteral antibiotics, or intensive care.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Septic shock with hypotension, tachycardia, altered mental status, or purpura requires immediate intensive care resuscitation.", "Puerperal peritonitis or necrotizing fasciitis requires immediate surgical and intravenous antibiotic treatment."],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Governance & Materia Medica",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Pyrogenium", "Sepsis Nosode", "Remedy", "Pulse-Temperature Discordance", "Bed Feels Hard", "Putrid Lochia", "Restlessness"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/pyrogenium",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional septic fever keynotes, sepsis safety boundaries, and verified citations"],
  clinicalPearl: "Pyrogenium is described in traditional materia medica for marked pulse-temperature discordance, whole-body soreness where bed feels hard, and putrid carrion-like discharges.",
  quickFacts: {
    "Latin Name": "Pyrogenium",
    "Common Name": "Sepsis / Pyrogen Nosode",
    "Source Kingdom": "Nosode",
    "Thermal State": "Chilly (With internal burning fever & relief from motion)"
  },
  aiReadiness: {
    retrievalSummary: "Pyrogenium is a major sepsis nosode in homeopathy described historically for marked pulse-temperature discordance, bruised soreness where the bed feels too hard, and horribly offensive carrion-like discharges.",
    clinicalSummary: "Classical texts describe a Sepsis nosode symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency intensive care, hemodynamic support, or parenteral antibiotic therapy for sepsis.",
    patientSummary: "Pyrogenium is a traditional homeopathic nosode described in literature for severe aching fevers where the bed feels rock hard and the body needs to keep shifting positions to find comfort.",
    studentSummary: "Guiding traditional keynotes include pulse-temperature discordance, bed feels hard with constant restlessness, horribly offensive discharges, varnished fiery-red tongue, and septic puerperal states.",
    keywords: ["pyrogenium", "sepsis nosode", "pulse temperature discordance", "bed feels hard", "putrid discharges"],
    semanticKeywords: ["nosode remedy", "septic fever profile", "adynamic pyrexia"],
    bodySystem: "Hematologic & Infectious",
    urgency: "routine"
  }
};
