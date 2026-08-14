import { KnowledgeEntity } from "../../types";

export const ValerianaRemedy: KnowledgeEntity = {
  id: "R0077",
  slug: "valeriana",
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
    en: "Valeriana Officinalis (Valerian)",
    hi: "वेलेरियना ऑफिसिनेलिस (तगर / वेलेरियन)",
    gu: "વેલેરિયાના ઓફિસિનાલિસ (તગર / વેલેરિયન)",
    mr: "व्हॅलेरियाना (Valeriana)",
    es: "Valeriana Officinalis (Valeriana)",
    ar: "فاليريانا أوفيسيناليس (Valeriana)"
  },
  summary: {
    en: "A cardinal hysterical, neurosensory, and rheumatic botanical remedy in classical homeopathic materia medica, historically described for capricious and changeable moods, globus hystericus with sensation of a thread hanging down the throat, and severe radiating sciatica aggravated by resting and sitting, relieved by walking.",
    hi: "होम्योपैथिक साहित्य में हिस्टीरिया जैसे बदलते व अप्रत्याशित मूड, गले में धागा लटकने जैसा अहसास, और साइटिका (गृध्रसी) के तेज दर्द जो बैठने व आराम करने पर बढ़े तथा लगातार चलने से घटे, की प्रमुख वर्णित औषधि.",
    gu: "હિસ્ટીરિયા જેવો ઝડપથી બદલાતો સ્વભાવ, ગળામાં દોરો લટકતો હોય તેવી લાગણી અને બેસવાથી કે આરામ કરવાથી વધતો તથા ચાલવાથી શાંત પડતો રાંઝણ (સાયટીકા)નો દુખાવો માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "सतत बदलणारा लहरी स्वभाव, घशात दोरा अडकल्यासारखी भावना आणि बसल्याने वाढणाऱ्या व चालल्याने कमी होणाऱ्या सायटिकाच्या (Sciatica) वेदनांवर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico histérico, neurosensorial y reumático fundamental en materia médica homeopática, descrito históricamente para humor caprichoso y cambiante, sensación de hilo en la garganta y ciática peor en reposo.",
    ar: "علاج نباتي هستيري وحسي عصبي رئيسي في المعالجة المثلية يُوصف تاريخياً للتقلبات المزاجية الحادة والإحساس بخيط معلق في الحلق وعرق النسا الذي يشتد بالراحة ويتحسن بالمشي."
  },
  content: {
    latinName: "Valeriana officinalis",
    commonName: "Valerian / All-Heal",
    source: "Fresh root of Valeriana officinalis collected in autumn from dry soil, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Valeriana Officinalis (Valerian) is a major hysterical, neurosensory, and musculoskeletal botanical remedy proved by Samuel Hahnemann and Dr. Stapf. In classical homeopathic texts, it is celebrated for its specific pathogenetic affinity for the cerebrospinal axis, autonomic nerves, sensory nerve endings, and peripheral nerve sheaths. Key features recorded in materia medica include extreme hysterical nervous mobility where the mental and emotional symptoms are singularly capricious, contradictory, and volatile (laughing changes instantly to weeping), globus hystericus with a distinct sensation as if a thread, hair, or feather is hanging down the throat and pharynx, severe neuralgic and sciatic pains that shoot down the posterior thigh to the heel, characteristically worse when resting, sitting still, or standing with the foot flat on the ground and remarkably relieved by walking about continuously, and intense nervous insomnia.",
    keynotes: [
      "Historically described for hysterical nervous temperament: extremely capricious, changeable moods; laughing alternating with weeping",
      "Sensation of a thread hanging down throat, or something alive rising from stomach into throat (globus hystericus)",
      "Severe sciatica: agonizing shooting pains down the leg, worse when resting, standing, or sitting; relieved by walking about continuously",
      "Pain in heel: severe bruised, aching pain in heel, worse when resting foot on floor or sitting down; relieved by walking",
      "Nervous insomnia: wide awake at night, tossing restlessly, with vivid hallucinations in the dark",
      "Hyperesthesia of special senses: taste and smell are strangely perverted; illusions of sight and hearing",
    ],
    mentalSymptoms: [
      "Extreme emotional instability; joyous ecstasy changes rapidly to dark melancholy",
      "Imagines surrounded by enemies, or that they are in a strange place",
      "Intellectual overactivity with restless flow of rapid ideas in evening",
    ],
    physicalSymptoms: [
      "Hysterical spasms and globus sensation with choking upon swallowing",
      "Dyspepsia with empty eructations tasting like rotten eggs, worse in evening",
      "Rheumatic tearing pains in limbs, worse in warmth of bed and during rest",
    ],
    generalities:
      "Warm-blooded, sensitive to warm room and heat. Strongly aggravated by rest, sitting still, standing with weight on foot, and in evening. Ameliorated by walking, continuous motion, and cool open air.",
    modalitiesBetter: [
      "Walking about continuously",
      "Continuous gentle motion",
      "Cool open air",
    ],
    modalitiesWorse: [
      "Resting, sitting, or lying down",
      "Standing with foot on ground",
      "Evening and night",
      "Warmth of room or bed",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in hysterical emotional mobility, globus sensation, and motion-relieved sciatica",
      "Historical materia medica reference for heel-pain and thread-in-throat sensation profiles",
    ],
    organAffinity: [
      "Central nervous system and autonomic plexus",
      "Sciatic nerve, peripheral sensory nerves, and heel",
      "Pharynx, esophagus, and gastrointestinal tract",
    ],
    miasmaticAffinity: [
      "Psora"
    ],
    constitution:
      "Suited to nervous, hysterical women and children with delicate nervous systems, vivid imaginations, and erratic pain responses.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude Valerian root contains valepotriates and volatile sesquiterpene oils (valerenic acid); source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute cauda equina syndrome with saddle anesthesia / bowel-bladder incontinence, acute spinal disc prolapse with severe motor paresis, or severe psychiatric psychosis requires immediate emergency orthopedic/neurological/psychiatric hospitalization; this traditional profile must not delay proven care.",
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
        "question": "What is the classic sciatic modality for Valeriana in traditional literature?",
        "answer": "In classical homeopathic materia medica, Valeriana sciatica is characteristically aggravated by sitting down, standing with the foot on the ground, or resting, and is remarkably relieved by walking about continuously."
      },
      {
        "question": "What peculiar sensation in the throat is noted in Valeriana?",
        "answer": "In traditional texts, Valeriana is celebrated for the sensation as if a thread, hair, or feather were hanging down the throat or pharynx."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0077-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0077-TRADITIONAL-PROFILE" },
    { claimId: "R0077-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for cauda equina syndrome, disc herniation, or psychiatric disorders.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0077-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0077-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute spinal compression, cauda equina, or motor paresis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute cauda equina syndrome with saddle anesthesia, urinary retention, or fecal incontinence requires emergency spinal surgery.", "Progressive motor paralysis or foot drop from acute disc herniation requires emergency neurosurgical evaluation."],
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
  tags: ["Valeriana", "Valerian", "Remedy", "Sciatica Worse Resting", "Thread in Throat Sensation", "Hysterical Moods", "Heel Pain"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/valeriana",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional motion-relieved sciatica keynotes, valerenic safety notes, and verified citations"],
  clinicalPearl: "Valeriana is described in traditional materia medica for capricious hysterical moods, thread-hanging throat sensation, and sciatica worse resting and relieved by walking.",
  quickFacts: {
    "Latin Name": "Valeriana officinalis",
    "Common Name": "Valerian",
    "Source Kingdom": "Plant (Caprifoliaceae family)",
    "Thermal State": "Hot (Aggravated by warm room, rest, & evening)"
  },
  aiReadiness: {
    retrievalSummary: "Valeriana Officinalis (Valerian) is a major botanical homeopathic remedy described historically for hysterical capricious moods, sensation of a thread hanging in throat, and sciatica worse resting and relieved by walking.",
    clinicalSummary: "Classical texts describe a Valerian root symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency spinal decompression for acute disc herniation or cauda equina syndrome.",
    patientSummary: "Valeriana is a traditional homeopathic remedy described in literature for shooting nerve pain down the back of the leg that feels worse when sitting or resting and better while pacing the floor, and feeling like a hair is caught in the throat.",
    studentSummary: "Guiding traditional keynotes include sciatica worse from rest/sitting and relieved by walking, sensation of a thread hanging down the throat, capricious hysterical mood swings, and heel pain on standing.",
    keywords: ["valeriana", "valerian", "sciatica worse resting remedy", "thread in throat remedy", "hysterical nerve pain"],
    semanticKeywords: ["botanical remedy", "neurosensory hysterical profile", "motion relieved sciatica"],
    bodySystem: "Neurological & Musculoskeletal",
    urgency: "routine"
  }
};
