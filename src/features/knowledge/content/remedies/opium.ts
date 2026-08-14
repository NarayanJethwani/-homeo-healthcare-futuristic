import { KnowledgeEntity } from "../../types";

export const OpiumRemedy: KnowledgeEntity = {
  id: "R0057",
  slug: "opium",
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
    en: "Opium (Papaver Somniferum / Poppy)",
    hi: "ओपियम (अफीम / पोस्त)",
    gu: "ઓપિયમ (અફીણ / પોસ્ત)",
    mr: "ओपियम (Opium)",
    es: "Opium (Amapola del Opio)",
    ar: "أوبيوم (Opium)"
  },
  summary: {
    en: "A cardinal botanical neurological and sensorium polychrest in classical homeopathic materia medica, historically described for complete lack of reaction or painlessness where pain is expected, deep stertorous sleep, heavy stupor with dark red face, hot sweat, and obstinate constipation from complete intestinal paralysis.",
    hi: "होम्योपैथिक साहित्य में बीमारी में दर्द का बिल्कुल न होना (दर्द-शून्यता), गहरी खर्राटेदार बेहोश नींद, लाल चेहरा, गर्म पसीना, और आंतों के निष्क्रिय होने से होने वाले भयंकर कब्ज की प्रमुख वर्णित औषधि.",
    gu: "રોગ હોવા છતાં પીડા કે દુખાવાનો સંપૂર્ણ અભાવ, ઘસઘસાટ નસકોરાં બોલાવતી ઘેનની ઊંઘ, લાલ ચહેરો, ગરમ પરસેવો અને આંતરડાના લકવા જેવા અસહ્ય કબજિયાત માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "वेदनांचा पूर्ण अभाव (वेदनाहीनता), गाढ घोरण्याची झोप किंवा सुस्ती, लालसर चेहरा, गरम घाम आणि आतड्यांच्या अकार्यक्षमतेमुळे होणाऱ्या तीव्र बद्धकोष्ठतेवर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico neurológico fundamental en materia médica homeopática, descrito históricamente para falta de reacción, ausencia de dolor donde debería haberlo, sueño estuporoso y estertoroso, y estreñimiento obstinado por parálisis intestinal.",
    ar: "علاج نباتي عصبي رئيسي في المعالجة المثلية يُوصف تاريخياً لانعدام الإحساس بالألم والنوم العميق المصحوب بالشخير والذهول والإمساك المستعصي الناتج عن شلل الأمعاء."
  },
  content: {
    latinName: "Papaver somniferum",
    commonName: "Opium / Poppy Gum",
    source: "Dried gummy exudate obtained by incising the unripe seed capsules of Papaver somniferum, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Opium (Papaver Somniferum) is a major neurological, sensorium, and constitutional botanical remedy proved by Samuel Hahnemann. In classical homeopathic texts, it occupies a unique pathogenetic sphere characterized by profound central nervous system depression, blunted sensory perception, and lack of vital reaction. Key features recorded in materia medica include complete painlessness of complaints where intense pain is normally expected (the patient complains of nothing and says they feel well despite serious illness), deep heavy comatose stupor with loud snoring or stertorous breathing, dark flushed mahogany-red face covered with hot sweat, small contracted or widely dilated pupils, and obstinate constipation from total paresis of peristalsis where stool recedes after partial expulsion or forms hard black balls.",
    keynotes: [
      "Historically described for complete painlessness of complaints and total lack of vital reactive power",
      "Deep, heavy, stertorous sleep with dropped lower jaw, loud snoring breathing, and difficult arousal",
      "Face is dark red, bloated, and congested, bathed in profuse hot sweat",
      "Obstinate constipation: no desire for stool for days from intestinal paresis; feces form round, hard, black balls resembling sheep dung",
      "Ailments following severe fright, terror, or sudden emotional shock (fear remains and terror returns repeatedly)",
      "Paradoxical acute hyperacusis in nervous states: distant sounds, clocks ticking, or distant cocks crowing keep patient awake",
    ],
    mentalSymptoms: [
      "Placid and insensible; insists that nothing ails them even in critical medical states",
      "Delirium with frightful hallucinations of animals, ghosts, or black specters",
      "Drowsy, stuporous, and indifferent to external stimuli",
    ],
    physicalSymptoms: [
      "Post-apoplectic coma, heavy snoring respiration, and hemiplegia",
      "Complete urinary retention from bladder sphincter spasm following surgery, fright, or labor",
      "Suffocative sleep apnea: patient stops breathing upon falling asleep and wakes gasping (resembling Lachesis, Grindelia)",
    ],
    generalities:
      "Hot-blooded, congested patient; cannot bear heat or warm room. Strongly aggravated during and after sleep, from heat, wine, and fright. Ameliorated by cold air, cold drinks, and continuous walking.",
    modalitiesBetter: [
      "Cold air and uncovering body",
      "Cold water and cool drinks",
      "Constant motion",
    ],
    modalitiesWorse: [
      "During and after sleep (wakes suffocating or stuporous)",
      "Heat, hot room, and warm bed",
      "Fright, anger, and sudden emotional shock",
      "Stimulants and alcohol",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in post-fright neurosis, blunted vital reaction, and paralytic constipation",
      "Historical materia medica reference for stuporous sleep and painless pathology profiles",
    ],
    organAffinity: [
      "Central nervous system, brainstem, and respiratory center",
      "Gastrointestinal tract (intestinal musculature and peristalsis)",
      "Circulatory system and urinary bladder sphincter",
    ],
    miasmaticAffinity: [
      "Psora",
      "Syphilis"
    ],
    constitution:
      "Suited to plethoric, dark-complexioned, aged individuals, or children with blunted nervous reactivity and sluggish circulation.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude opium contains morphinan alkaloids (morphine, codeine) and requires source-specific toxicology guidance. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute opioid overdose, respiratory failure (bradypnea <8 breaths/min), coma, acute stroke, or severe traumatic brain injury requires immediate emergency resuscitation, airway protection, and naloxone administration where clinically indicated; this traditional profile must not delay proven care.",
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
        "question": "What paradoxical clinical presentation characterizes Opium in classical literature?",
        "answer": "In traditional homeopathic materia medica, Opium is characterized by complete painlessness and lack of complaint even during severe organic pathology, with the patient declaring that nothing is wrong."
      },
      {
        "question": "What is the characteristic stool and bowel symptom of Opium?",
        "answer": "In classical descriptions, Opium is marked by total lack of peristalsis and no desire for stool; bowel movements consist of hard, round, black balls resembling sheep dung."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0057-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0057-TRADITIONAL-PROFILE" },
    { claimId: "R0057-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for opioid overdose, stroke, or coma.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0057-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0057-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for opioid toxicity, respiratory depression, or acute stroke.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute opioid overdose with respiratory depression requires immediate emergency naloxone resuscitation.", "Acute stroke with coma, hemiplegia, or uncal herniation requires emergency hospital resuscitation."],
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
  tags: ["Opium", "Poppy", "Remedy", "Painless Pathology", "Stertorous Sleep", "Paralytic Constipation", "Post Fright"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/opium",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional sensorium keynotes, narcotic alkaloid safety notes, and verified citations"],
  clinicalPearl: "Opium is described in traditional materia medica for painless pathology despite severe illness, deep stertorous sleep, dark red flushed face, and obstinate constipation from bowel paralysis.",
  quickFacts: {
    "Latin Name": "Papaver somniferum",
    "Common Name": "Opium Poppy",
    "Source Kingdom": "Plant (Papaveraceae family)",
    "Thermal State": "Hot (Cannot tolerate heat or warm room)"
  },
  aiReadiness: {
    retrievalSummary: "Opium (Papaver Somniferum) is a major botanical homeopathic remedy described historically for complete lack of reaction or painlessness where pain is expected, deep stertorous sleep, heavy stupor with dark red face, hot sweat, and obstinate constipation.",
    clinicalSummary: "Classical texts describe an Opium-poppy symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency naloxone, airway management, or critical stroke care.",
    patientSummary: "Opium is a traditional homeopathic remedy described in literature for severe sluggishness, feeling no pain even when very sick, loud snoring sleep, and severe stubborn constipation.",
    studentSummary: "Guiding traditional keynotes include painlessness of complaints, stertorous comatose sleep, red face with hot sweat, intestinal paresis with sheep-dung stool, ailments from fright, and aggravation from heat.",
    keywords: ["opium", "poppy", "painless pathology remedy", "stertorous sleep", "paralytic constipation"],
    semanticKeywords: ["botanical remedy", "neurological sensorium profile", "post-fright neurosis"],
    bodySystem: "Neurological & Gastrointestinal",
    urgency: "routine"
  }
};
