import { KnowledgeEntity } from "../../types";

export const PhytolaccaRemedy: KnowledgeEntity = {
  id: "R0058",
  slug: "phytolacca",
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
    en: "Phytolacca Decandra (Pokeweed)",
    hi: "फाइटोलैक्का डिकैंड्रा (पोकवीड)",
    gu: "ફાઇટોલેક્કા ડીકેન્ડ્રા (પોકવીડ)",
    mr: "फायटोलाक्का (Phytolacca)",
    es: "Phytolacca Decandra (Hierba Carmín)",
    ar: "فيتولاكا ديكاندرا (Phytolacca)"
  },
  summary: {
    en: "A cardinal glandular, breast, throat, and periosteal botanical remedy in classical homeopathic materia medica, historically described for stony-hard painful glandular indurations, acute mastitis with breast hardness, and dark red sore throat with pain shooting to the ears on swallowing.",
    hi: "होम्योपैथिक साहित्य में ग्रंथियों के पत्थर जैसे सख्त और दर्दनाक होने, स्तनपान के दौरान स्तनों में गांठ व सूजन (मैस्टाइटिस), और गले में दर्द जो निगलते ही कानों तक जाए, की प्रमुख वर्णित औषधि.",
    gu: "ગ્રંથિઓનો પથ્થર જેવો કઠણ અને દુખાવાવાળો સોજો, સ્તનપાન દરમિયાન સ્તનમાં ગાંઠ અને બળતરા (મેસ્ટાઇટિસ) તથા ગળતી વખતે કાન સુધી પહોંચતી ગળાની પીડા માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "ग्रंथींचा दगडासारखा कठीण व वेदनामय दाह, स्तनपान देणाऱ्या मातांमधील स्तनांचा दाह (Mastitis) आणि गिळताना कानाकडे जाणारी घशाची तीव्र कळ यावर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico glandular fundamental en materia médica homeopática, descrito históricamente para induraciones glandulares pétreas y dolorosas, mastitis aguda con mamas pétreas y dolor de garganta que irradia a los oídos al deglutir.",
    ar: "علاج نباتي غدي رئيسي في المعالجة المثلية يُوصف تاريخياً للتصلب الغدي المؤلم والتهاب الثدي الحاد وآلام الحلق الشديدة التي تمتد إلى الأذنين عند البلع."
  },
  content: {
    latinName: "Phytolacca americana / decandra",
    commonName: "Pokeweed / Poke Root",
    source: "Fresh root of Phytolacca decandra collected in autumn, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Phytolacca Decandra (Pokeweed) is a major glandular, musculoskeletal, and mucosal botanical remedy proved by Dr. E. M. Hale and Dr. Burt. In classical homeopathic texts, it is celebrated for its specific elective affinity for glandular tissue (particularly mammary glands, tonsils, salivary glands, and lymph nodes), fibrous and periosteal tissues, and mucous membranes. Key features recorded in materia medica include stony, hard, woody, tender indurations of glands, acute mastitis during lactation where breasts become hard as stone, congested, and exquisitely sensitive to touch, acute pharyngitis and tonsillitis characterized by dark red or bluish fauces and severe shooting pains radiating directly to both ears upon swallowing, and intense bone-aching pains worse in cold wet weather.",
    keynotes: [
      "Historically described for stony, hard, painful glandular indurations and lymphadenitis",
      "Acute mastitis in nursing women: breasts are hard as stone, swollen, congested, and exceedingly sensitive; pain radiates over whole body when nursing",
      "Sore throat: fauces are dark red or purplish; tonsils swollen; intense shooting pain into ears on swallowing hot drinks or saliva",
      "Irresistible desire to bite the teeth together or press gums together firmly (characteristic during dentition)",
      "Severe generalized aching: pains fly like electric shocks through muscles, periosteum, and joints",
      "Tongue is fiery red at tip with prominent papillae, or coated yellow with red blisters (strawberry-like appearance)",
    ],
    mentalSymptoms: [
      "Indifferent to life and surroundings; complete apathy and loss of interest",
      "Irritable and restless; constantly moves about despite motion aggravating pain",
      "Gloomy forebodings and dread of serious illness",
    ],
    physicalSymptoms: [
      "Mammary nodules and chronic mastitis with radiating pain to back and axillae",
      "Diphtheritic or follicular tonsillitis with foul breath and dark congested pharynx",
      "Sciatica and periosteal aching pains worse at night and in rainy damp weather",
    ],
    generalities:
      "Chilly patient, sensitive to cold damp air and rain. Strongly aggravated by cold damp weather, washing, swallowing hot drinks, motion, and right side. Ameliorated by warmth, dry weather, rest, and lying on painful side.",
    modalitiesBetter: [
      "Warm, dry weather",
      "Rest in bed",
      "Lying on painful side",
    ],
    modalitiesWorse: [
      "Cold, damp, raining weather",
      "Swallowing hot drinks (aggravates throat pain)",
      "Nursing infant (induces radiating body pain)",
      "Night and 2:00 AM to 5:00 AM",
      "Motion",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in lactation mastitis, follicular tonsillitis, and glandular indurations",
      "Historical materia medica reference for ear-radiating throat pain and teeth-clenching impulse profiles",
    ],
    organAffinity: [
      "Mammary glands and lymphatic system",
      "Pharynx, tonsils, and soft palate",
      "Periosteum, fibrous tissues, and large joints",
    ],
    miasmaticAffinity: [
      "Sycosis",
      "Syphilis"
    ],
    constitution:
      "Suited to rheumatic, scrofulous, or lymphatic constitutions with tendency to glandular enlargement, mastitis, and tonsillar inflammation.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude pokeweed contains toxic phytolaccatoxin and saponins and requires source-specific toxicology guidance. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute suppurative mastitis with systemic sepsis / high fever / abscess, peritonsillar abscess with upper airway stridor, or suspected breast neoplasm requires immediate emergency medical/surgical management; this traditional profile must not delay proven care.",
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
        "question": "What is the classic breast symptom of Phytolacca during lactation?",
        "answer": "In traditional homeopathic materia medica, Phytolacca is characterized by breasts that become stony hard, swollen, and tender, with pain radiating over the entire body whenever the infant nurses."
      },
      {
        "question": "What characteristic direction of pain is noted in Phytolacca sore throat?",
        "answer": "In classical descriptions, Phytolacca sore throat is marked by severe shooting pain that radiates directly into one or both ears upon swallowing."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0058-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0058-TRADITIONAL-PROFILE" },
    { claimId: "R0058-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for septic mastitis, quinsy, or breast malignancy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0058-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0058-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for breast abscess, sepsis, or airway compromise.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute suppurative mastitis with systemic sepsis or fluctuant abscess requires emergency surgical drainage.", "Peritonsillar abscess (quinsy) with airway compromise requires emergency medical evaluation."],
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
  tags: ["Phytolacca", "Pokeweed", "Remedy", "Stony Hard Mastitis", "Sore Throat Ear Pain", "Glandular Induration", "Desire to Bite Teeth"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/phytolacca",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional mastitis keynotes, pokeweed safety notes, and verified citations"],
  clinicalPearl: "Phytolacca is described in traditional materia medica for stony hard mastitis with pain radiating across body on nursing, and sore throat with pain shooting to ears on swallowing.",
  quickFacts: {
    "Latin Name": "Phytolacca decandra",
    "Common Name": "Pokeweed",
    "Source Kingdom": "Plant (Phytolaccaceae family)",
    "Thermal State": "Chilly (Aggravated by cold damp rainy weather)"
  },
  aiReadiness: {
    retrievalSummary: "Phytolacca Decandra (Pokeweed) is a major botanical homeopathic remedy described historically for stony-hard painful glandular indurations, acute mastitis with breast hardness, and dark red sore throat with pain shooting to ears on swallowing.",
    clinicalSummary: "Classical texts describe a Pokeweed symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency care for breast abscess, sepsis, or peritonsillar airway compromise.",
    patientSummary: "Phytolacca is a traditional homeopathic remedy described in literature for hard, painful breast swelling during breastfeeding, sore throat with pain shooting to the ears when swallowing, and hard swollen glands.",
    studentSummary: "Guiding traditional keynotes include stony hard mastitis with pain on nursing, sore throat radiating to ears on swallowing, urge to bite teeth together, periosteal aching worse in cold damp, and dark red throat.",
    keywords: ["phytolacca", "pokeweed", "mastitis remedy", "sore throat shooting to ears", "stony hard glands"],
    semanticKeywords: ["botanical remedy", "glandular profile", "mammary pathology"],
    bodySystem: "Reproductive & Lymphatic",
    urgency: "routine"
  }
};
