import { KnowledgeEntity } from "../../types";

export const TabacumRemedy: KnowledgeEntity = {
  id: "R0074",
  slug: "tabacum",
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
    en: "Tabacum (Tobacco / Nicotiana Tabacum)",
    hi: "तबाकम (तंबाकू / निकोटियाना तबाकम)",
    gu: "તબાકમ (તમાકુ / નિકોટિયાના તબાકમ)",
    mr: "तबाकम (Tabacum)",
    es: "Tabacum (Tabaco)",
    ar: "تاباكوم (Tabacum)"
  },
  summary: {
    en: "A cardinal neurovascular, autonomic, and gastrointestinal botanical remedy in classical homeopathic materia medica, historically described for deathly nausea with cold clammy sweat, motion sickness / seasickness, intermittent thready pulse, and relief from uncovering the abdomen and cool open air.",
    hi: "होम्योपैथिक साहित्य में ठंडे पसीने और चेहरे के पीलेपन के साथ जानलेवा उल्टी-मिचली (डेथली नॉजिया), सफर में होने वाली उल्टी (मोशन सिकनेस/सी-सिकनेस), कमजोर नाड़ी, और पेट खोलने व ठंडी खुली हवा से मिलने वाले आराम की प्रमुख वर्णित औषधि.",
    gu: "ઠંડા પરસેવા અને ચહેરાના ફિક્કાપણા સાથે જીવલેણ ઊલટી-ઉબકા, મુસાફરીમાં થતી ઊલટી (મોશન સિકનેસ), ધીમી નાડી અને પેટ પરથી કપડાં હટાવવાથી તથા ઠંડી હવાથી મળતી રાહત માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "थंड घामासह होणारी मरणप्राय मळमळ व उलट्या, प्रवासातील उलट्या (Motion Sickness), क्षीण नाडी आणि पोट उघडे ठेवल्याने मिळणाऱ्या आरामावर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico neurovascular, autonómico y gastrointestinal fundamental en materia médica homeopática, descrito históricamente para náuseas mortales con sudor frío y pálido, mareo por movimiento, pulso filiforme y alivio al destapar el abdomen.",
    ar: "علاج نباتي وعائي عصبي وهضمي رئيسي في المعالجة المثلية يُوصف تاريخياً للغثيان الشديد المميت مع العرق البارد والشحوب ودوار الحركة والنبض الضعيف والتحسن بكشف البطن."
  },
  content: {
    latinName: "Nicotiana tabacum",
    commonName: "Tobacco",
    source: "Fresh leaves of Nicotiana tabacum collected before flowering, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Tabacum (Tobacco) is a major neurovascular, autonomic, and gastrointestinal botanical remedy proved by Dr. Hartlaub and Dr. Trinks. In classical homeopathic texts, it is celebrated for its extraordinary pathogenetic action on the vagus nerve, autonomic nervous system, vasomotor circulation, and gastrointestinal mucosa. Key features recorded in materia medica include an agonizing, deathly, persistent nausea with violent retching and cold clammy sweat, motion sickness, seasickness, and travel nausea worse from least motion or opening eyes, an unmistakable keynote modality where the patient frantically uncovers the abdomen to obtain relief from nausea and colic, complete coldness of the limbs with icy cold sweat on the forehead and face, dilated pupils with pale sunken features, and intermittent, feeble, thready, or irregular pulse.",
    keynotes: [
      "Historically described for deathly, prostrating nausea accompanied by cold clammy sweat, pallor of face, and faintness",
      "Motion sickness and seasickness: violent nausea and vomiting aggravated by least motion of head, boat, car, or opening eyes",
      "Unmistakable keynote modality: nausea, vomiting, and abdominal colic are remarkably relieved by uncovering the abdomen and fresh cold air",
      "Icy coldness of body and extremities: hands, feet, and face are icy cold and bathed in cold sweat",
      "Cardiovascular collapse: weak, slow, intermittent, thready, or imperceptible pulse with angina-like chest oppression",
      "Pregnancy hyperemesis: persistent vomiting of pregnancy with profuse cold salivation, sinking at epigastrium, and nausea on smelling food",
    ],
    mentalSymptoms: [
      "Profound melancholia, apathy, and dread of death during nausea paroxysms",
      "Anxious, terrified, and restless with confusion of the head and vertigo",
      "Aversion to mental or physical labor, worse after smoking tobacco",
    ],
    physicalSymptoms: [
      "Meniere's disease and labyrinthine vertigo with severe deathly nausea, pallor, and cold sweat",
      "Renal colic with agonizing vomiting, cold clammy sweat, and collapse during passage of calculus",
      "Strangulated hernia profile with violent fecal vomiting, coldness, and abdominal distension",
    ],
    generalities:
      "Chilly patient with icy cold extremities, but subjectively craves cold open air and uncovering abdomen. Strongly aggravated by motion, open eyes, warmth, and travel. Ameliorated by uncovering the abdomen, cold fresh air, and closing eyes.",
    modalitiesBetter: [
      "Uncovering the abdomen (vital keynote)",
      "Cold, fresh, open air and wind blowing in face",
      "Closing the eyes and remaining perfectly still",
    ],
    modalitiesWorse: [
      "Least motion of body, car, boat, or head",
      "Opening the eyes and bright light",
      "Warm room and heat of stove",
      "Smell of food or tobacco smoke",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in motion sickness, hyperemesis gravidarum, and neurovascular faintness",
      "Historical materia medica reference for uncovering-abdomen modality and deathly nausea profiles",
    ],
    organAffinity: [
      "Vagus nerve, autonomic nervous system, and chemoreceptor trigger zone",
      "Cardiovascular system (coronary vessels, vasomotor nerves)",
      "Gastrointestinal tract (stomach, intestines, portal circulation)",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to pale, emaciated, nervous, cachectic individuals, women during pregnancy, or persons suffering from severe motion sickness.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude tobacco contains toxic pyridine alkaloid (nicotine) producing severe autonomic stimulation, hypertension/hypotension, convulsions, and respiratory arrest; source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute nicotine poisoning, acute myocardial infarction, acute intestinal strangulation, severe hypovolemic shock, or intractable hyperemesis with ketonuria requires immediate emergency hospital management; this traditional profile must not delay proven care.",
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
        "question": "What is the hallmark abdominal modality for Tabacum in traditional texts?",
        "answer": "In classical homeopathic materia medica, Tabacum is uniquely characterized by dramatic relief of nausea, vomiting, and cold sweat upon completely uncovering the abdomen."
      },
      {
        "question": "What type of motion sickness is characteristic of Tabacum in classical literature?",
        "answer": "In traditional descriptions, Tabacum motion sickness is marked by deathly prostrating nausea, icy cold sweat on the forehead, pallor, faintness, and relief from closing the eyes and cold fresh air."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0074-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0074-TRADITIONAL-PROFILE" },
    { claimId: "R0074-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for nicotine overdose, acute coronary syndrome, or strangulated hernia.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0074-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0074-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute nicotine toxicity, myocardial infarction, or bowel strangulation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute nicotine toxicity, severe bradycardia, or circulatory collapse requires emergency hospital resuscitation.", "Acute strangulated hernia with bowel ischemia and feculent vomiting requires immediate emergency surgery."],
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
  tags: ["Tabacum", "Tobacco", "Remedy", "Deathly Nausea", "Motion Sickness", "Uncovering Abdomen Relieves", "Cold Clammy Sweat"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/tabacum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional motion sickness keynotes, nicotine safety notes, and verified citations"],
  clinicalPearl: "Tabacum is described in traditional materia medica for deathly nausea with cold sweat, motion sickness, relief from uncovering abdomen, and icy cold extremities.",
  quickFacts: {
    "Latin Name": "Nicotiana tabacum",
    "Common Name": "Tobacco",
    "Source Kingdom": "Plant (Solanaceae family)",
    "Thermal State": "Chilly (With icy cold skin, yet desires cold fresh air & uncovering)"
  },
  aiReadiness: {
    retrievalSummary: "Tabacum (Tobacco) is a major botanical homeopathic remedy described historically for deathly nausea with cold clammy sweat, motion sickness, relief from uncovering abdomen, and icy cold extremities.",
    clinicalSummary: "Classical texts describe a Tobacco leaf symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency toxicology, cardiology, or surgical intervention for acute poisoning, myocardial infarction, or hernia strangulation.",
    patientSummary: "Tabacum is a traditional homeopathic remedy described in literature for severe seasickness or car sickness with pale skin and cold sweats that feel better when uncovering the belly and getting fresh cold air.",
    studentSummary: "Guiding traditional keynotes include deathly nausea with cold clammy sweat, motion sickness worse opening eyes/moving, relief from uncovering abdomen and open air, intermittent weak pulse, and icy coldness.",
    keywords: ["tabacum", "tobacco", "motion sickness remedy", "deathly nausea remedy", "uncovering abdomen relieves"],
    semanticKeywords: ["botanical remedy", "neurovascular autonomic profile", "motion sickness vertigo"],
    bodySystem: "Gastrointestinal & Autonomic",
    urgency: "routine"
  }
};
