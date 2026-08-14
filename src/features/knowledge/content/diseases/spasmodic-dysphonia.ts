import { KnowledgeEntity } from "../../types";

export const SpasmodicDysphoniaDisease: KnowledgeEntity = {
  id: "D0071",
  slug: "spasmodic-dysphonia",
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
    en: "Spasmodic Dysphonia (Laryngeal Dystonia, Focal Task-Specific Vocal Cord Spasms)",
    hi: "स्पास्मोडिक डिस्फोनिया / वोकल कॉर्ड्स की अनैच्छिक ऐंठन (Spasmodic Dysphonia / Laryngeal Dystonia)",
    gu: "સ્પાસ્મોડિક ડિસ્ફોનિયા / સ્વરપેટીના સ્નાયુઓની અચાનક ખેંચાણ (Spasmodic Dysphonia)",
    mr: "स्पास्मोडिक डिस्फोनिया / स्वरयंत्राचे आकस्मिक आकुंचन (Spasmodic Dysphonia)",
    es: "Disfonía Espasmódica (Distonía Laríngea y Espasmos Vocales Focales Tarea-Específicos)",
    ar: "خلل النطق التشنجي وخلل التوتر الحنجري (Spasmodic Dysphonia)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Spasmodic Dysphonia (Laryngeal Dystonia), covering basal ganglia-thalamocortical sensorimotor circuit dysfunction, task-specific vocal cord adductor vs. abductor spasms, voice breaks on voiced vs. voiceless vowels/consonants, speech sensory tricks (geste antagoniste), constitutional homeopathic supportive management, and emergency red flags for acute laryngeal dystonic crisis / airway stridor, rapidly generalizing multi-focal dystonias, and Parkinsonian neurodegeneration.",
    hi: "स्पास्मोडिक डिस्फोनिया (स्वरयंत्र का न्यूरोलॉजिकल डिस्टोनिया / बोलते समय आवाज टूटना) का बेसल गैन्ग्लिया पैथोलॉजी, एडक्टर (Adductor SD; आवाज का घुट-घुट कर निकलना) व एबडक्टर (Abductor SD; फुसफुसाती आवाज) प्रकार, टास्क-स्पेसिफिक लक्षण, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और एक्यूट एयरवे डिस्टोनिया (Airway Stridor) व सेकेंडरी न्यूरोलॉजिकल विकारों की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "સ્પાસ્મોડિક ડિસ્ફોનિયા (સ્વરપેટીના જ્ઞાનતંતુઓની બીમારી) ની ન્યુરોલોજીકલ પેથોલોજી, બોલતી વખતે અવાજ અચાનક અટકી જવો, ગળું દબાઈ જવું, બોટોક્સ ઇન્જેક્શનની જરૂરિયાત, પરંપराગત હોમિયોપેથીક સહાયક સારવાર અને શ્વાસનળી બંધ થવી (Stridor) તથા પાર્કિન્સન્સ જેવા રોગોની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "स्पास्मोडिक डिस्फोनिया (Laryngeal Dystonia), बोलताना स्वरयंत्र आवळणे, आवाज अडखळणे, गाताना किंवा हसताना आवाज सुरळीत राहणे, पारंपरिक होमिओपॅथिक पद्धत आणि श्वास अडकणे व गंभीर मज्जासंस्थेच्या विकारांच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la disfonía espasmódica que cubre la disfunción del circuito sensitivomotor ganglios basales-tálamo-corteza, espasmos aductores vs. abductores, manejo homeopático complementario y banderas rojas de crisis distónica laríngea y estridor respiratorio.",
    ar: "دليل سريري وتعليمي موثوق لخلل النطق التشنجي يغطي خلل الدارة الحركية الحية للعقد القاعدية وتشنجات الحبال الصوتية المبعدة والمقربة والرعاية التكميلية وعلامات الخطر للأزمة التشنجية الحنجرية والصرير التنفسي."
  },
  content: {
    overview:
      "Spasmodic Dysphonia (SD; historically called 'spastic dysphonia', now classified as Focal Laryngeal Dystonia) is a chronic, rare, task-specific neurological movement disorder affecting approximately 1 to 4 per 100,000 individuals. Driven by central sensorimotor integration abnormalities within the basal ganglia, thalamus, and motor cortex, SD produces involuntary, intermittent, spasmodic contractions of the intrinsic laryngeal muscles during connected speech. Classified into three distinct clinical phenotypes—Adductor Spasmodic Dysphonia (AdSD; accounting for ~80–85% of cases; thyroarytenoid muscle spasms forcing vocal cords to slam shut, creating a strained-strangled voice with pitch breaks on voiced vowels), Abductor Spasmodic Dysphonia (AbSD; ~15% of cases; posterior cricoarytenoid spasms forcing vocal cords open, creating breathy voice breaks on voiceless consonants), and Mixed SD—it is characteristically task-specific, sparing non-speech vocalizations (laughing, singing, whispering, shouting, and coughing).",
    definition:
      "A task-specific focal dystonia characterized by involuntary, intermittent contractions of the laryngeal musculature triggered selectively during voiced connected speech, producing speech breaks, phonatory strain, or breathy pauses.",
    causes: [
      "Basal Ganglia-Thalamocortical Circuit Disruption: impaired intracortical inhibition, loss of GABAergic tone, and aberrant functional connectivity within the striato-thalamo-cortical motor loops controlling phonation",
      "Sensorimotor Mismatch and Defective Laryngeal Somatosensation: abnormal central processing of laryngeal mucosal mechanoreceptor and proprioceptive feedback from internal superior laryngeal nerves",
      "Genetic Predisposition: familial dystonia with autosomal dominant inheritance and reduced penetrance associated with TOR1A (DYT1), THAP1 (DYT6), and GNAL (DYT25) gene mutations",
      "Environmental and Upper Respiratory Triggers: onset frequently preceded by an acute viral upper respiratory tract infection, localized laryngeal trauma, or intense prolonged psychological distress acting as a neuro-inflammatory trigger in genetically susceptible hosts",
      "Secondary Laryngeal Dystonias: neurodegenerative movement disorders (Multiple System Atrophy [MSA], Parkinson's disease, Progressive Supranuclear Palsy), Wilson's disease, or chronic dopamine-receptor-blocking medication exposure (tardive dystonia)"
    ],
    riskFactors: [
      "Female gender (females are affected 2.5 to 4 times more frequently than males, peaking between 30 and 50 years of age)",
      "Positive family history of focal dystonias (cervical dystonia/torticollis, blepharospasm, writer's cramp, or essential vocal tremor)",
      "Professional voice use accompanied by acute emotional or physical stress",
      "Previous severe viral upper respiratory tract infection immediately preceding the onset of voice breaks",
      "Exposure to neuroleptic / antipsychotic medications predisposing to tardive focal dystonias"
    ],
    symptoms: [
      "Adductor SD (AdSD) Presentation: 'Strained-strangled', squeezed, effortful, staccato voice quality with sudden involuntary phonatory arrests and pitch breaks, characteristically provoked by reading sentences rich in voiced vowels ('We eat eel every day', 'Early one morning')",
      "Abductor SD (AbSD) Presentation: Sudden, breathy, whispering voice dropouts and hypophonia, characteristically provoked by reading sentences rich in voiceless consonant-vowel combinations ('Peter pays for puppy paws', 'Harry had a hairy dog')",
      "Task-Specificity (the cardinal clinical hallmark): voice breaks disappear completely during non-speech vocalizations such as singing, laughing, yawning, whispering, humming, angry shouting, or speaking in a false falsetto accent",
      "Phonatory Effort & Physical Fatigue: severe muscular tension and physical exhaustion in the anterior neck, strap muscles, and chest after speaking for only a few minutes",
      "Sensory Tricks (Geste Antagoniste): voice quality transiently improves when touching the neck, placing a finger on the thyroid cartilage, or after consuming a small amount of alcohol (which enhances central GABAergic inhibition)",
      "Coexisting Essential Laryngeal Tremor: rhythmic 4 to 8 Hz oscillatory tremor of the vocal folds and palate in up to 30% of patients"
    ],
    diagnosis:
      "Diagnosed by an expert multidisciplinary voice team (Laryngologist, Neurologist, and specialized Speech-Language Pathologist): (1) Perceptual Voice Assessment (CAPE-V / Consensus Auditory-Perceptual Evaluation of Voice: testing standardized diagnostic sentence pairs contrasting voiced vowel load vs. voiceless consonant load to definitively distinguish AdSD from AbSD). (2) Flexible Fiberoptic Video-Laryngostroboscopy during connected speech (demonstrates episodic hyperadduction of true and false vocal folds in AdSD, or wide abductory spasms in AbSD, while confirming completely normal, smooth vocal fold movement during coughing, whistling, and sniffing). (3) Laryngeal Electromyography (LEMG; demonstrates characteristic clustered, involuntary motor unit burst discharges in the thyroarytenoid-lateral cricoarytenoid or posterior cricoarytenoid muscles during speech tasks). (4) Neurological Examination and Brain MRI (to rule out secondary dystonias, brainstem lesions, and Parkinsonian movement disorders).",
    differentialDiagnosis:
      "Differentiate Spasmodic Dysphonia from Muscle Tension Dysphonia (MTD; primary non-dystonic hyperfunctional voice disorder: continuous vocal strain that DOES NOT spare singing or laughing, has no task-specificity, and responds rapidly to manual laryngeal circumlaryngeal massage), Essential Vocal Tremor (rhythmic tremulous voice modulation on sustained vowels), Vocal Cord Nodules / Polyps (structural mucosal lesions visible on laryngoscopy), Parkinsonian Hypophonia (monotone, quiet voice with rest tremor and rigidity), and Psychogenic / Functional Neurological Voice Disorder.",
    conventionalManagement:
      "A specialized neurological and laryngological therapeutic standard: (1) Intralaryngeal OnabotulinumtoxinA (Botox) Injections: the gold standard first-line therapy (injected under EMG guidance or trans-nasal video-endoscopic guidance into the thyroarytenoid muscle bilaterally or unilaterally for AdSD [1.25–2.5 units], or into the posterior cricoarytenoid muscle for AbSD; produces temporary, reversible chemical denervation of the neuromuscular junction, abolishing spasms for 3 to 4 months per cycle). (2) Specialized Voice Therapy: behavioral speech therapy to optimize breath support, reduce compensatory supraglottic squeezing, and prolong the beneficial window of Botox injections. (3) Surgical Interventions for refractory AdSD: Selective Laryngeal Adductor Denervation-Reinnervation (SLAD-R; bilateral sectioning of the thyroarytenoid branch of the recurrent laryngeal nerve with ansa cervicalis nerve anastomosis) or Type II Thyroplasty (lateralization of thyroid cartilage laminae). (4) Systemic pharmacotherapy (trihexyphenidyl, baclofen, clonazepam) has limited efficacy and significant anticholinergic/sedative side effects.",
    homeopathicApproach:
      "Homeopathic constitutional and spasmolytic neuromuscular remedies (such as Causticum, Gelsemium Sempervirens, Magnesia Phosphorica, Argentum Nitricum, Cuprum Metallicum, Lachesis Muta, Ignatia Amara, Stramonium, Hyoscyamus Niger, Zincum Metallicum) serve as supportive care to ease muscular phonatory tension, soothe performance anxiety, and support vocal stamina alongside Botox injections, voice therapy, and laryngological monitoring.",
    lifestyleAdvice:
      "Learn and practice relaxed diaphragmatic breathing techniques before speaking to reduce neck muscle clenching, utilize voice amplification devices (wireless lapel microphones and portable waist-band speakers) to reduce vocal projection strain at work or social gatherings, practice sensory tricks (gently resting a light finger on your thyroid cartilage or speaking in a gentle sing-song rhythm) when voice blocks occur, avoid shouting or forcing through severe voice breaks, and stay well hydrated to keep vocal fold mucus membranes lubricated.",
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
        question: "Why can I sing, laugh, and whisper perfectly normally, but my voice breaks when I talk?",
        answer: "Spasmodic dysphonia is a 'task-specific' neurological disorder. The neural brain networks controlling conversational speech are separate from the ancestral brainstem circuits that control laughing, coughing, whispering, and singing. The involuntary dystonic spasms only trigger when you engage the specific motor pathways used for normal speaking."
      },
      {
        question: "How does Botox help spasmodic dysphonia?",
        answer: "Botox (botulinum toxin) is gently injected in tiny microscopic doses directly into the overactive vocal cord muscle using a fine needle. It blocks the nerve signals (acetylcholine) that cause the vocal cords to clamp down, relaxing the spasm so your voice can flow smoothly for 3 to 4 months until the injection is repeated."
      }
    ],
    redFlags: [
      "Acute Laryngeal Dystonic Crisis / Airway Stridor: severe bilateral abductory or paradoxical vocal cord adduction producing loud inspiratory stridor, intercostal retractions, and acute dyspnea (airway emergency requiring emergent fiberoptic laryngoscopy, oxygen, IV anticholinergics/benzodiazepines, and emergency airway support)",
      "Rapidly Progressing Multi-Focal or Generalized Dystonia: laryngeal spasms rapidly spreading within weeks to severe torticollis, blepharospasm, generalized limb dystonia, or gait impairment (mandates immediate comprehensive neurological movement-disorder workup, copper studies for Wilson's disease, and brain MRI)",
      "Atypical Parkinsonian Features: voice changes accompanied by progressive orthostatic hypotension, urinary incontinence, severe ataxia, or rapid falls (warning signs of Multiple System Atrophy [MSA] or Progressive Supranuclear Palsy)",
      "Acute Laryngeal Edema, profound dysphagia, or aspiration pneumonia following botulinum toxin injection (requires urgent ENT evaluation)"
    ]
  },
  claimCitations: [
    { claimId: "D0071-TRADITIONAL-PROFILE", statement: "Homeopathic spasmodic dysphonia profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0071-TRADITIONAL-PROFILE" },
    { claimId: "D0071-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for laryngeal EMG-guided botulinum toxin therapy, surgical laryngeal denervation, or airway crisis intubation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0071-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0071-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute laryngeal dystonic stridor, generalizing neurodegenerative dystonias, or botulinum toxin therapy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Severe inspiratory stridor and airway distress indicating acute laryngeal dystonic crisis requiring emergency airway management",
    "Rapid spread of dystonia to neck, eyes, and limbs indicating generalizing neurodegenerative movement disorder",
    "Severe swallowing difficulty with food aspiration following laryngeal intervention requiring urgent ENT evaluation"
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
  tags: ["Spasmodic Dysphonia", "Laryngeal Dystonia", "Adductor SD", "Abductor SD", "Voice Breaks", "Botulinum Toxin", "Disease", "Neurology", "Otolaryngology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/spasmodic-dysphonia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive basal ganglia sensorimotor circuit, AdSD/AbSD task-specificity clinical boundaries, acute dystonic stridor red flags, and verified citations"],
  clinicalPearl: "Spasmodic dysphonia is strictly task-specific: voice breaks occur during normal speech, but singing, whispering, and laughing remain completely normal.",
  quickFacts: {
    "Key Clinical Trait": "Task-Specific Voice Breaks on Voiced Vowels (AdSD) Sparing Singing and Laughing",
    "Primary System": "Central Nervous System & Laryngeal Phonatory Apparatus (Neurology / Laryngology)",
    "Diagnostic Standard": "Multidisciplinary Exam (CAPE-V Perceptual Testing, Stroboscopy, & Laryngeal EMG)",
    "Clinical Character": "Focal task-specific laryngeal dystonia causing involuntary vocal fold spasms during speech"
  },
  aiReadiness: {
    retrievalSummary: "Spasmodic Dysphonia is a neurological vocal condition causing involuntary voice breaks during speech that spare singing and laughing, managed with supportive care, Botox injections, and voice therapy.",
    clinicalSummary: "Spasmodic dysphonia pathophysiology involves basal ganglia sensorimotor loop dysfunction causing task-specific adductor (80%) or abductor (15%) laryngeal spasms. Homeopathic remedies serve as supportive spasmolytic care and do not replace EMG-guided botulinum toxin injections, voice therapy, or emergency airway care for acute dystonic stridor.",
    patientSummary: "Spasmodic dysphonia is a nerve condition that causes your vocal cords to spasm and catch when you speak, making your voice sound tight or breathy, while singing or laughing remains completely normal, treated with Botox injections.",
    studentSummary: "Focal task-specific dystonia of intrinsic laryngeal muscles. Two types: Adductor (AdSD, 80-85%, thyroarytenoid spasm, strained-strangled voice on vowels) and Abductor (AbSD, 15%, posterior cricoarytenoid spasm, breathy breaks on voiceless consonants). Pathognomonic: task-specificity (singing/laughing normal). Gold standard treatment: EMG-guided botulinum toxin. Red flags: acute laryngeal dystonic stridor.",
    keywords: ["spasmodic dysphonia", "laryngeal dystonia", "adductor spasmodic dysphonia", "voice breaks speech", "strained strangled voice", "botox vocal cords", "task specific voice disorder"],
    semanticKeywords: ["focal laryngeal dystonia", "basal ganglia phonatory dysfunction", "thyroarytenoid adductor spasm"],
    icd: "G24.2",
    mesh: "D004408",
    bodySystem: "Neurology & Otolaryngology",
    urgency: "routine"
  }
};
