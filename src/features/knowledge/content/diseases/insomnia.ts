import { KnowledgeEntity } from "../../types";

export const InsomniaDisease: KnowledgeEntity = {
  id: "D0021",
  slug: "insomnia",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Chronic Insomnia Disorder (Sleep Initiation & Maintenance Disorder)",
    hi: "अनिद्रा रोग / इनसोमनिया (Insomnia / Sleeplessness)",
    gu: "અનિદ્રા / ઊંઘ ન આવવાની સમસ્યા (Insomnia)",
    mr: "निद्रानाश / शांत झोप न लागणे (Insomnia)",
    es: "Insomnio Crónico (Trastorno del Sueño)",
    ar: "الأرق المزمن واضطرابات النوم (Insomnia)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Chronic Insomnia Disorder, covering neurobiological hyperarousal, circadian rhythm dysregulation, sleep architecture, constitutional homeopathic supportive management, and emergency red flags for severe obstructive sleep apnea, nocturnal desaturation, and acute psychiatric crises.",
    hi: "क्रॉनिक इनसोमनिया (अनिद्रा रोग) का न्यूरोबायोलॉजिकल हाइपर-एरोउजल पैथोलॉजी, सर्केडियन रिदम डिसफंक्शन, स्लीप आर्किटेक्चर, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और ऑब्सट्रक्टिव स्लीप एप्निया व गंभीर मनोरोग की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ક્રોનિક અનિદ્રા (ઇન્સોમ્નિયા) ની ન્યુરોબાયોલોજીકલ પેથોલોજી, ઊંઘ ન આવવી કે વારંવાર તૂટવી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સ્લીપ એપ્નિયા તથા માનસિક અસ્વસ્થતાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "तीव्र निद्रानाश (Insomnia), झोप न लागणे किंवा वारंवार जाग येणे, सर्केडियन रिदमचे असंतुलन, पारंपरिक होमिओपॅथिक पद्धत आणि स्लीप अ‍ॅपनियाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del insomnio crónico que cubre el hiperalerta neurobiológico, desregulación circadiana, manejo homeopático complementario y banderas rojas de apnea obstructiva del sueño y crisis psiquiátricas.",
    ar: "دليل سريري وتعليمي موثوق للأرق المزمن يغطي فرط التيقظ العصبي واضطراب النظم اليوماوي وبنية النوم والرعاية التكميلية وعلامات الخطر لانقطاع النفس الانسدادي النومي والأزمات النفسية الحادة."
  },
  content: {
    overview:
      "Chronic Insomnia Disorder is a prevalent, debilitating sleep-wake disorder characterized by persistent difficulty with sleep initiation (sleep onset latency >30 minutes), sleep maintenance (frequent or prolonged nocturnal awakenings), or early morning awakenings with inability to return to sleep, occurring at least 3 nights per week for at least 3 months, despite adequate opportunity and circumstances for sleep. Driven by somatic and cognitive hyperarousal mechanisms and dysregulated hypothalamic-pituitary-adrenal (HPA) axis activity, it leads to significant daytime distress, cognitive impairment, emotional dysregulation, and fatigue.",
    definition:
      "A subjective perception of inadequate or non-restorative sleep characterized by dissatisfaction with sleep quantity or quality associated with clinically significant daytime impairment across occupational, social, and physical domains.",
    causes: [
      "Neurobiological hyperarousal: heightened 24-hour metabolic rate, elevated sympathetic tone, increased nocturnal cortisol, and blunted GABAergic sleep-switch inhibition in the ventrolateral preoptic nucleus (VLPO)",
      "Circadian rhythm phase delay or advance, pineal melatonin secretion suppression, and misaligned suprachiasmatic nucleus (SCN) signalling",
      "Psychophysiological conditioned arousal (Spielman 3P Model: predisposing genetic/temperamental traits, precipitating acute life stressors, and perpetuating maladaptive sleep habits)",
      "Comorbid medical and neuropsychiatric disorders (major depression, generalized anxiety, chronic pain, restless legs syndrome, gastroesophageal reflux)"
    ],
    riskFactors: [
      "Female gender (prevalence higher due to hormonal transitions during menstruation, pregnancy, and menopause)",
      "Advanced age (attenuation of slow-wave sleep and fragmentation of sleep architecture)",
      "Chronic psychosocial stress, rotating shift work, irregular sleep schedules, and jet lag",
      "Substance consumption: late-day caffeine intake, nicotine, evening alcohol (disrupts REM and late-night sleep continuity)",
      "Excessive nocturnal screen exposure emitting short-wavelength blue light suppressing endogenous melatonin secretion"
    ],
    symptoms: [
      "Prolonged sleep onset latency (tossing and turning for hours unable to initiate sleep)",
      "Fragmented nocturnal sleep with frequent awakenings and difficulty falling back asleep",
      "Terminal insomnia: waking up very early in the morning (3:00–4:00 AM) with racing mind or panic",
      "Non-restorative, unrefreshing sleep ('waking up just as tired as going to bed')",
      "Daytime sequelae: chronic daytime fatigue, brain fog, poor memory/concentration, irritability, tension headaches, and daytime sleepiness without the ability to nap"
    ],
    diagnosis:
      "Diagnosed clinically through a comprehensive sleep history, validated sleep questionnaires (Insomnia Severity Index [ISI], Pittsburgh Sleep Quality Index [PSQI]), and a 2-week sleep-wake diary. Overnight in-laboratory Polysomnography (PSG) is not routinely indicated for primary insomnia, but is mandatory when obstructive sleep apnea (OSA), periodic limb movement disorder (PLMD), or narcolepsy is suspected.",
    differentialDiagnosis:
      "Differentiate Chronic Insomnia Disorder from Obstructive Sleep Apnea (OSA; snoring, witnessed nocturnal choking/gasps), Restless Legs Syndrome (RLS / Willis-Ekbom disease), Circadian Rhythm Sleep-Wake Disorders (Delayed/Advanced Sleep Phase), Bipolar Disorder (manic/hypomanic reduced need for sleep), Major Depressive Disorder, and Nocturnal Panic Attacks.",
    conventionalManagement:
      "Cognitive Behavioral Therapy for Insomnia (CBT-I; encompassing sleep restriction, stimulus control, cognitive restructuring, and relaxation training) is the undisputed first-line standard of care across international clinical guidelines (AASM, ACP). Short-term pharmacological options include dual orexin receptor antagonists (DORAs: suvorexant, lemborexant), melatonin receptor agonists (ramelteon), low-dose sedating antidepressants (doxepin), and non-benzodiazepine hypnotics ('Z-drugs': zolpidem, eszopiclone) for acute refractory distress.",
    homeopathicApproach:
      "Homeopathic constitutional and nervous remedies (such as Coffea Cruda, Nux Vomica, Passiflora Incarnata, Ignatia Amara, Gelsemium Sempervirens, Kali Phosphoricum, Arsenicum Album, Cocculus Indicus) serve as supportive care to soothe mental restlessness, calm nervous agitation, and assist sleep relaxation alongside strict sleep hygiene and CBT-I behavioural techniques.",
    lifestyleAdvice:
      "Maintain a fixed wake-up time 7 days a week, use the bed strictly for sleep and intimacy (leave the bed if awake after 20 minutes and return only when sleepy), eliminate screen exposure at least 60 minutes before bedtime, keep the bedroom dark, quiet, and cool (approx. 18–20°C / 65–68°F), avoid caffeine after 12:00 PM, and obtain 20–30 minutes of natural outdoor sunlight exposure each morning.",
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
        question: "Why is alcohol a bad remedy for sleep problems?",
        answer: "While alcohol may initially induce drowsiness and shorten sleep latency, it severely fragments sleep in the second half of the night, suppresses restorative REM sleep, relaxes airway muscles worsening snoring and sleep apnea, and leads to early morning awakenings."
      },
      {
        question: "What is Cognitive Behavioral Therapy for Insomnia (CBT-I)?",
        answer: "CBT-I is an evidence-based psychological treatment that retrains your brain's relationship with sleep through stimulus control, sleep restriction, and relaxation techniques, proven to be more durable and effective long-term than prescription sleeping pills."
      }
    ],
    redFlags: [
      "Loud irregular snoring accompanied by witnessed nocturnal breathing pauses, choking, or gasping during sleep (suspected severe Obstructive Sleep Apnea requiring urgent diagnostic polysomnography)",
      "Severe acute insomnia accompanied by suicidal ideation, psychotic agitation, or manic symptoms (decreased need for sleep with grandiosity and pressured speech requiring emergency psychiatric intervention)",
      "Sudden onset of profound neurological symptoms: cataplexy (sudden loss of muscle tone triggered by emotion), sleep paralysis, or hypnagogic hallucinations (suspected Narcolepsy)",
      "Nocturnal hypoxemia, waking with severe morning headaches, or unprovoked daytime sleep attacks while driving"
    ]
  },
  claimCitations: [
    { claimId: "D0021-TRADITIONAL-PROFILE", statement: "Homeopathic insomnia profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0021-TRADITIONAL-PROFILE" },
    { claimId: "D0021-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for obstructive sleep apnea, polysomnographic normalization, or acute psychosis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0021-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0021-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for severe sleep apnea, suicidal crisis, or acute manic psychosis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Witnessed nocturnal choking, severe apneas, and daytime sleepiness while driving indicating obstructive sleep apnea requiring CPAP/PSG",
    "Acute severe insomnia with active suicidal ideation or psychotic mania requiring emergency psychiatric hospitalization",
    "Sudden muscle collapse with laughter/emotion indicating narcolepsy with cataplexy"
  ],
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
  tags: ["Insomnia", "Sleep Disorder", "Sleeplessness", "Disease", "Hyperarousal", "Circadian Rhythm", "CBT-I", "Sleep Medicine"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/insomnia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive sleep architecture clinical boundaries, sleep apnea/psychiatric red flags, and verified citations"],
  clinicalPearl: "Always screen for Obstructive Sleep Apnea with the STOP-BANG questionnaire and polysomnography when patients present with chronic unrefreshing sleep and daytime fatigue.",
  quickFacts: {
    "Prevalence": "Affects approximately 10% to 15% of adults chronically (up to 30% acutely)",
    "Primary System": "Central Nervous System & Sleep-Wake Neurobiology",
    "Diagnostic Standard": "Clinical Sleep History, Sleep Diary, & Insomnia Severity Index (ISI)",
    "Clinical Character": "Persistent difficulty initiating or maintaining sleep resulting in daytime cognitive and emotional impairment"
  },
  aiReadiness: {
    retrievalSummary: "Chronic Insomnia is a persistent difficulty initiating or maintaining sleep driven by neurobiological hyperarousal, presenting with daytime fatigue and cognitive dullness, managed with supportive care, CBT-I behavioural therapy, and sleep hygiene.",
    clinicalSummary: "Insomnia pathophysiology involves central hyperarousal, elevated nocturnal sympathetic tone, and altered circadian rhythms. Homeopathic remedies serve as supportive nervous care and do not replace evidence-based CBT-I, polysomnography for obstructive sleep apnea, or emergency psychiatric care for manic crises.",
    patientSummary: "Insomnia is trouble falling asleep, staying asleep, or waking up too early and feeling exhausted the next day, improved by sticking to a regular sleep schedule, calming bedtime routines, and healthy sleep habits.",
    studentSummary: "Diagnosed when symptoms occur \u22653 nights/week for \u22653 months with daytime impairment. First-line therapy is CBT-I. Differentiate from obstructive sleep apnea (snoring, choking gasps) and restless legs syndrome.",
    keywords: ["insomnia", "sleeplessness", "sleep disorder", "trouble sleeping", "waking at night", "sleep maintenance", "cbt-i"],
    semanticKeywords: ["chronic insomnia disorder", "neurobiological hyperarousal", "sleep-wake cycle dysregulation"],
    icd: "G47.00",
    mesh: "D007268",
    bodySystem: "Sleep Medicine & Neurology",
    urgency: "routine"
  }
};
