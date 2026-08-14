import { KnowledgeEntity } from "../../types";

export const HyoscyamusRemedy: KnowledgeEntity = {
  id: "R0047",
  slug: "hyoscyamus",
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
    en: "Hyoscyamus Niger (Black Henbane)",
    hi: "हायोसायमस नाइजर (काली खुरासानी अजवायन)",
    gu: "હાયોસાયમસ નાઇજર (કાળી ખુરાસાની અજમો)",
    mr: "हायोसायमस (Hyoscyamus)",
    es: "Hyoscyamus Niger (Beleño Negro)",
    ar: "هيوسياموس نيجر (Hyoscyamus)"
  },
  summary: {
    en: "A cardinal neurological, psychiatric, and respiratory botanical remedy in classical homeopathic materia medica, historically described for nervous excitement, delirium with jealousy, erotic mania with desire to uncover, muscular twitching, and dry nocturnal cough relieved by sitting up.",
    hi: "होम्योपैथिक साहित्य में अत्यधिक मानसिक उत्तेजना, शक्की मिजाज, भ्रम की स्थिति, मांसपेशियों में कंपन या फड़कन, और रात में लेटते ही आने वाली सूखी खांसी जो उठकर बैठने से ठीक हो, की प्रमुख वर्णित औषधि.",
    gu: "અતિશય માનસિક ઉત્તેજના, વહેમી અને ઈર્ષ્યાળુ સ્વભાવ, સ્નાયુઓમાં ધ્રુજારી, અને રાત્રે સૂવાથી વધતી અને બેસવાથી મટતી સૂકી ઉધરસ માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "अति-मानसिक उत्तेजना, संशयी वृत्ती, स्नायूंमधील थरथर आणि रात्री झोपल्यावर वाढणारा कोरडा खोकला (जो बसल्यावर थांबतो) यावर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico neurológico y psiquiátrico fundamental en materia médica homeopática, descrito históricamente para excitación nerviosa, delirio con celos, manía erótica, espasmos musculares y tos nocturna seca que mejora al sentarse.",
    ar: "علاج نباتي عصبي ونفسي رئيسي في المعالجة المثلية يُوصف تاريخياً للإثارة العصبية والهذيان والغيرة والتشنجات العضلية والسعال الليلي الجاف الذي يتحسن بالجلوس."
  },
  content: {
    latinName: "Hyoscyamus niger",
    commonName: "Black Henbane",
    source: "Fresh flowering plant of Hyoscyamus niger, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Hyoscyamus Niger (Black Henbane) is a major neurological and psychiatric botanical remedy proved by Samuel Hahnemann. In classical homeopathic texts, it occupies a distinctive clinical position alongside Belladonna and Stramonium as part of the classic trio of delirious remedies. Unlike Belladonna (which is characterized by violent fever, intense congestion, and red face), Hyoscyamus is characterized by nervous weakness, low muttering delirium, suspicious jealousy, erotic mania with shameless exposure of the body, picking at bedclothes (carphologia), muscular twitching, and a dry spasmodic cough worse at night upon lying down and relieved immediately upon sitting up in bed.",
    keynotes: [
      "Historically described for nervous excitation, low muttering delirium, suspicious jealousy, and fear of being poisoned or betrayed",
      "Erotic mania: talks obscenely, sings amorous songs, and persistently attempts to uncover the genitals or strip off clothing",
      "Muscular twitching, jerking, subsultus tendinum, and picking at bedclothes or grasping at imaginary objects",
      "Dry, hacking, spasmodic cough occurring exclusively at night upon lying down in bed, relieved immediately upon sitting up",
      "Extreme aversion to drinking liquids with difficulty in swallowing, while throat feels dry and constricted",
      "Involuntary evacuation of stool and urine from sphincter paresis in low febrile or stuporous states",
    ],
    mentalSymptoms: [
      "Suspicious, distrustful, and jealous; refuses food or medicine believing it is poisoned",
      "Restless and talkative; constantly changing themes during delirium",
      "Laughs at everything, acts silly, or falls into sudden comatose stupor",
    ],
    physicalSymptoms: [
      "Spasmodic twitching of facial muscles and choreic movements of extremities",
      "Typhoid-like low muttering delirium with dry brown tongue and dropped jaw",
      "Nocturnal dry laryngo-tracheal cough aggravated by horizontal posture",
    ],
    generalities:
      "Chilly patient. Strongly aggravated at night, lying down, during menses, from jealousy or unrequited love, and touch. Ameliorated by sitting up, warmth, and bending forward.",
    modalitiesBetter: [
      "Sitting up in bed (cardinal for cough)",
      "Warmth and quiet rest",
      "Bending forward",
    ],
    modalitiesWorse: [
      "Night (especially midnight to morning)",
      "Lying down flat in bed",
      "Jealousy, fright, and emotional vexation",
      "Touch and cold air",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in nocturnal posture-dependent cough, muscular twitching, and nervous delirium",
      "Historical materia medica reference for jealousy-etiology and choreic symptom profiles",
    ],
    organAffinity: [
      "Central nervous system and higher cognitive centers",
      "Motor nerves and involuntary muscles",
      "Respiratory tract and laryngeal mucosa",
    ],
    miasmaticAffinity: [
      "Psora",
      "Syphilis"
    ],
    constitution:
      "Suited to nervous, irritable, hysterical, or weakened individuals with unstable emotional equilibrium and tendency to spasmodic twitching.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude Hyoscyamus niger contains toxic tropane alkaloids (hyoscyamine, scopolamine) and requires source-specific toxicology guidance. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute anticholinergic syndrome, psychotic delirium, violent agitation, or acute respiratory depression requires immediate emergency psychiatric/intensive care intervention; this traditional profile must not delay proven care.",
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
        "question": "What classic posture relieves the Hyoscyamus cough in classical texts?",
        "answer": "In traditional homeopathic materia medica, the dry spasmodic nocturnal Hyoscyamus cough is aggravated immediately upon lying down and is relieved promptly by sitting up in bed."
      },
      {
        "question": "How does Hyoscyamus delirium differ from Belladonna delirium in classical descriptions?",
        "answer": "Belladonna delirium is typically acute, furious, with bright red face, throbbing carotids, and high fever; Hyoscyamus delirium is marked by nervous weakness, suspicious jealousy, erotic mania, picking at bedclothes, and absence of intense cerebral vascular congestion."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0047-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0047-TRADITIONAL-PROFILE" },
    { claimId: "R0047-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for delirium, psychiatric conditions, or respiratory infections.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0047-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0047-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for anticholinergic toxicity, severe agitation, or respiratory failure.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute anticholinergic poisoning, hyperpyrexia, or coma requires intensive care emergency resuscitation.", "Severe agitation, acute psychotic breakdown, or self-harm risk requires emergency psychiatric hospitalization."],
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
  tags: ["Hyoscyamus", "Henbane", "Remedy", "Nocturnal Cough", "Delirium", "Muscular Twitching", "Jealousy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/hyoscyamus",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional delirium and cough keynotes, tropane alkaloid safety notes, and verified citations"],
  clinicalPearl: "Hyoscyamus is described in traditional materia medica for nervous excitation, suspicious jealousy, erotic uncovering, muscular twitching, and dry nocturnal cough relieved sitting up.",
  quickFacts: {
    "Latin Name": "Hyoscyamus niger",
    "Common Name": "Black Henbane",
    "Source Kingdom": "Plant (Solanaceae family)",
    "Thermal State": "Chilly (Aggravated by cold air & lying down)"
  },
  aiReadiness: {
    retrievalSummary: "Hyoscyamus Niger (Black Henbane) is a major botanical homeopathic remedy described historically for nervous excitation, low muttering delirium, suspicious jealousy, erotic mania, muscular twitching, and dry nocturnal cough relieved by sitting up.",
    clinicalSummary: "Classical texts describe a Black Henbane symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency care for anticholinergic syndrome, status epilepticus, or acute psychiatric crisis.",
    patientSummary: "Hyoscyamus is a traditional homeopathic remedy described in literature for extreme nervous restlessness, suspicious fears, muscle twitches, and dry coughing at night that stops when sitting up.",
    studentSummary: "Guiding traditional keynotes include suspicious jealousy, erotic mania, picking at bedclothes, dry cough worse lying down / relieved sitting up, and absence of intense inflammatory heat.",
    keywords: ["hyoscyamus", "henbane", "nocturnal cough sitting up better", "delirium remedy", "muscular twitching"],
    semanticKeywords: ["botanical remedy", "neuro-psychiatric profile", "spasmodic nocturnal cough"],
    bodySystem: "Neurological & Psychiatric",
    urgency: "routine"
  }
};
