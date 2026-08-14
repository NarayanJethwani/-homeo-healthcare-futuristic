import { KnowledgeEntity } from "../../types";

export const PostViralFatigueDisease: KnowledgeEntity = {
  id: "D0068",
  slug: "post-viral-fatigue",
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
    en: "Post-Viral Fatigue Syndrome (PVFS, Post-Acute Sequelae of COVID-19 & ME/CFS Spectrum)",
    hi: "पोस्ट-वायरल फटीग सिंड्रोम / वायरल संक्रमण के बाद की गंभीर कमजोरी (Post-Viral Fatigue Syndrome)",
    gu: "પોસ્ટ-વાયરલ ફેટીગ સિન્ડ્રોમ / વાયરલ તાવ કે કોરોના પછીની લાંબી થકાવટ (Post-Viral Fatigue)",
    mr: "पोस्ट-व्हायरल फटीग सिंड्रोम / व्हायरल आजारानंतर येणारा दीर्घकालीन थकवा (Post-Viral Fatigue)",
    es: "Síndrome de Fatiga Poscvírica (SFPV, Secuelas Poscovid-19 y Espectro EM/SFC)",
    ar: "متلازمة التعب التالي للإصابة الفيروسية وكوفيد طويل الأمد (Post-Viral Fatigue Syndrome)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Post-Viral Fatigue Syndrome (PVFS / PASC / Long COVID), covering persistent neuroinflammation, microvascular endothelial injury, mitochondrial bioenergetic dysfunction, Post-Exertional Malaise (PEM / energy crashes), Postural Orthostatic Tachycardia Syndrome (POTS), constitutional homeopathic supportive management, and emergency red flags for acute viral myocarditis, pulmonary embolism, Addisonian crisis, and severe syncope.",
    hi: "पोस्ट-वायरल फटीग सिंड्रोम (वायरल इन्फेक्शन या लॉन्ग कोविड के बाद की अत्यधिक थकान) का न्यूरोइन्फ्लेमेशन पैथोलॉजी, माइटोकॉन्ड्रियल एनर्जी विफलता, पोस्ट-एक्जर्शनल मैलेज (PEM / थोड़ा काम करते ही क्रैश होना), ब्रेन फॉग, POTS, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और एक्यूट मायोकार्डाइटिस (Myocarditis), पल्मोनरी एम्बोलिज्म व एडिसोनियन क्राइसिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પોસ્ટ-વાયરલ ફેટીગ સિન્ડ્રોમ (કોરોના કે ડેન્ગ્યુ-ચિકનગુનિયા પછીની અતિશય નબળાઈ) ની પેથોલોજી, થોડું કામ કરવાથી થતો અસહ્ય થાક (PEM), યાદશક્તિ ઓછી થવી (Brain Fog), ઉભા થતા ચક્કર આવવા (POTS), પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને હૃદયમાં સોજો (માયોકાર્ડાઇટિસ) તથા ફેફસામાં લોહીની ગાંઠની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "पोस्ट-व्हायरल फटीग सिंड्रोम (Post-Viral Fatigue / Long COVID), अंग गळून जाणे, थोड्या श्रमाने प्रचंड थकवा (PEM), स्मरणशक्ती मंदावणे, पारंपरिक होमिओपॅथिक पद्धत आणि हृदयाची सूज (Myocarditis) व फुप्फुसातील रक्ताच्या गुठळीच्या (Pulmonary Embolism) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del síndrome de fatiga posvírica que cubre la neuroinflamación persistente, disfunción mitocondrial, malestar posesfuerzo (MPE), síndrome de taquicardia ortostática postural (POTS), manejo homeopático complementario y banderas rojas de miocarditis aguda y tromboembolismo pulmonar.",
    ar: "دليل سريري وتعليمي موثوق لمتلازمة التعب التالي للفيروسات يغطي الالتهاب العصبي المستمر والخلل المتقدري والوعكة التالية للجهد ومتلازمة تسارع القلب الوضعي الانتصابي والرعاية التكميلية وعلامات الخطر لالتهاب العضلة القلبية والانصمام الرئوي."
  },
  content: {
    overview:
      "Post-Viral Fatigue Syndrome (PVFS; also encompassing Post-Acute Sequelae of SARS-CoV-2 [PASC / Long COVID] and closely overlapping with Myalgic Encephalomyelitis / Chronic Fatigue Syndrome [ME/CFS]) is a complex, multisystem neuro-immune disorder characterized by profound, debilitating physical and cognitive exhaustion persisting for more than 12 weeks following an acute viral infection (such as SARS-CoV-2, Epstein-Barr Virus [EBV / Infectious Mononucleosis], Cytomegalovirus [CMV], Dengue, Chikungunya, or Influenza). Far from psychological fatigue or simple deconditioning, PVFS is driven by objective pathophysiological mechanisms: persistent low-grade microglial neuroinflammation, microvascular endothelial endotheliopathy with persistent circulating microclots, mitochondrial electron transport chain decoupling and bioenergetic depletion, and autonomic nervous system dysregulation (Dysautonomia).",
    definition:
      "A clinical syndrome of profound, medically unexplained exhaustion, cognitive dysfunction, unrefreshing sleep, and autonomic instability persisting \u22653 months following an acute viral infection, characteristically worsening after minimal physical or cognitive exertion (Post-Exertional Malaise).",
    causes: [
      "Persistent Low-Grade Neuroinflammation: chronic microglial activation and elevated cerebrospinal fluid pro-inflammatory cytokines (IL-1beta, IL-6, TNF-alpha, IFN-gamma) triggering neurovascular signaling disruption in the brainstem, thalamus, and basal ganglia",
      "Microvascular Endothelial Dysfunction & Microclots: viral-induced systemic endotheliopathy, von Willebrand factor elevation, and amyloid-rich fibrin microclots impairing microcapillary oxygen delivery and nutrient diffusion to skeletal muscle and brain tissue",
      "Mitochondrial Bioenergetic Defect: altered pyruvate dehydrogenase activity, impaired oxidative phosphorylation, and reduced ATP generation forcing cellular reliance on inefficient anaerobic glycolysis and premature lactic acid accumulation",
      "Autonomic Nervous System Dysregulation (Dysautonomia): sympathetic-parasympathetic imbalance, vagal nerve neuropathy, reduced cerebral blood flow, and Postural Orthostatic Tachycardia Syndrome (POTS; sustained heart rate increase \u226530 bpm upon standing without orthostatic hypotension)",
      "Immune Dysregulation & Viral Reactivation: persistent viral antigen reservoirs (viral RNA/protein persistence in gut or lymphoid tissues), loss of natural killer (NK) cell cytotoxicity, and secondary reactivation of latent herpesviruses (EBV, HHV-6)",
      "Hypothalamic-Pituitary-Adrenal (HPA) Axis Blunting: central hypocortisolism, low waking salivary cortisol slope, and blunted adrenocorticotropic hormone (ACTH) response"
    ],
    riskFactors: [
      "Severe or prolonged acute viral illness (e.g., severe COVID-19, high viral load acute EBV mononucleosis)",
      "Female gender (females have a 2- to 3-fold higher incidence, influenced by estrogenic immune modulation and X-chromosome gene dosage)",
      "Pre-existing autoimmune diathesis or atopic allergic history",
      "Overexertion or premature return to high-intensity aerobic exercise during acute viral convalescence ('pushing through')",
      "High baseline physical or psychological distress and sleep deprivation at the time of acute infection"
    ],
    symptoms: [
      "Pathognomonic Post-Exertional Malaise (PEM / 'The Crash'): a severe, disproportionate worsening of all symptoms and profound functional collapse triggered by trivial physical, cognitive, or emotional exertion, typically delayed by 12 to 48 hours and persisting for days to weeks",
      "Unrefreshing Sleep: waking up feeling exhausted and un-restored regardless of the number of hours slept, accompanied by circadian rhythm disruption and vivid dreams",
      "Cognitive Dysfunction ('Brain Fog'): impaired short-term working memory, word-finding difficulty, slowed information processing speed, and inability to multitask",
      "Orthostatic Intolerance & POTS: lightheadedness, dizziness, blurred vision, palpitations, and tremulousness when standing or sitting upright, relieved immediately upon lying supine",
      "Widespread Neuro-Somatic symptoms: migratory joint and muscle aches (myalgias) without joint swelling, chronic fluctuating low-grade sore throat, tender cervical/axillary lymph nodes, and new-onset tension/migraine headaches",
      "Thermoregulatory instability: unexplained low-grade fevers, hot flushes, chills, and extreme intolerance to hot or cold ambient temperatures"
    ],
    diagnosis:
      "Diagnosed clinically using consensus diagnostic criteria (Institute of Medicine [IOM / NAM 2015] criteria for ME/CFS and WHO case definition for Post-COVID-19 condition) after systematically excluding mimicking organic diseases: (1) Core Criteria: profound fatigue (>6 months reducing activity by >50%), mandatory PEM, and unrefreshing sleep, plus either cognitive impairment ('brain fog') or orthostatic intolerance (POTS). (2) Objective Autonomic Testing: 10-Minute NASA Lean Test or Active Stand Test (demonstrates sustained HR increase \u226530 bpm within 10 minutes of standing). (3) Comprehensive Exclusionary Laboratory Battery: Complete Blood Count, Comprehensive Metabolic Panel, Thyroid Function Tests (TSH, free T4), Morning Cortisol, Serum Ferritin, Vitamin B12, Vitamin D, Erythrocyte Sedimentation Rate (ESR), C-Reactive Protein (CRP), Antinuclear Antibodies (ANA), and Lyme serologies.",
    differentialDiagnosis:
      "Differentiate Post-Viral Fatigue Syndrome from Major Depressive Disorder (in depression, physical exertion often transiently improves energy; in PVFS, exertion triggers debilitating PEM crashes; depression features prominent anhedonia and guilt rather than desire to be active), Chronic Hypothyroidism (elevated TSH), Primary Adrenal Insufficiency (Addison's disease: low morning cortisol, hyperkalemia, hyperpigmentation), Obstructive Sleep Apnea (OSA; confirmed on polysomnography), Multiple Sclerosis, Fibromyalgia (primary chronic widespread myofascial pain with tender points), and Occult Malignancy.",
    conventionalManagement:
      "A multimodal pacing, symptom-directed, and neuro-autonomic supportive protocol: (1) Energy Envelope Pacing & Activity Management (the absolute foundational cornerstone: identifying the patient's individual anaerobic threshold and 'energy envelope', strictly avoiding PEM crash triggers using heart rate monitors, and pacing daily activities into micro-intervals; graded exercise therapy [GET] that forces fixed increases in exertion is strictly contraindicated). (2) Orthostatic Intolerance / POTS Therapy: increasing daily fluid intake (2.5–3.5 liters/day) and sodium intake (6–10 grams elemental salt/day), wearing medical-grade waist-high compression garments (20–30 mmHg), counter-pressure maneuvers, and pharmacological agents (fludrocortisone, midodrine, ivabradine, or low-dose propranolol). (3) Sleep Architecture Optimization: low-dose nocturnal medications (trazodone, low-dose melatonin, gabapentin). (4) Neuroinflammation and Pain Modulation: Low-Dose Naltrexone (LDN 1.5–4.5 mg at bedtime to downregulate microglial activation and reduce neuroinflammation), Coenzyme Q10 (200–400 mg/day), Acetyl-L-Carnitine, and high-dose Omega-3 fatty acids.",
    homeopathicApproach:
      "Homeopathic constitutional and post-illness restorative remedies (such as Gelsemium Sempervirens, Phosphoricum Acidum, Kali Phosphoricum, China Officinalis, Arsenicum Album, Picricum Acidum, Carbo Vegetabilis, Avena Sativa, Silicea, Calcarea Carbonica) serve as supportive care to ease post-viral exhaustion, soothe nervous prostration, and support vitality alongside strict pacing, POTS hydration, and physician management.",
    lifestyleAdvice:
      "Master the 'Four P's' of energy management: Prioritize, Plan, Pace, and Position (sit rather than stand whenever possible during cooking, grooming, or showering), use a smartwatch to monitor your resting and standing heart rate (stay below your calculated anaerobic threshold: [220 - age] \u00d7 0.6), incorporate structured 15-minute 'horizontal aggressive rest' breaks throughout the day in a dark, quiet room with zero sensory stimulation, consume 2.5 to 3 liters of electrolyte-rich fluids daily, and never attempt to 'push through' fatigue crashes.",
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
        question: "Why does exercise make me feel so much worse instead of building my strength?",
        answer: "In post-viral fatigue syndrome, your cellular powerhouses (mitochondria) cannot generate normal oxygen-based energy (ATP) and your blood vessels cannot deliver enough oxygen to working muscles. When you exercise, your cells instantly shift into anaerobic lactic-acid distress, triggering an immune inflammatory surge that results in a severe 'crash' (Post-Exertional Malaise) 24–48 hours later."
      },
      {
        question: "What is 'Brain Fog' and why can't I concentrate or remember words?",
        answer: "Brain fog is caused by low-grade inflammation of brain support cells (microglia) combined with reduced blood flow and oxygen delivery to the brain (cerebral hypoperfusion) when standing or sitting upright. It slows down neural processing speed, impairs working memory, and makes word retrieval difficult."
      }
    ],
    redFlags: [
      "Acute Viral Myocarditis / Heart Failure: new-onset acute crushing chest pain, worsening severe shortness of breath when lying flat (orthopnea), lower extremity pitting edema, elevated troponin, or new cardiac arrhythmias (requires immediate emergency ECG, echocardiogram, and cardiology admission)",
      "Acute Pulmonary Embolism (PE): sudden pleuritic chest pain, unexplained acute hypoxia (SpO2 <92%), hemoptysis, and tachycardia in post-viral hypercoagulable states (requires emergent contrast CT pulmonary angiography)",
      "Acute Addisonian Adrenal Crisis: severe hypotension, intractable vomiting, severe hypoglycemia, abdominal pain, and confusion (life-threatening emergency requiring STAT IV hydrocortisone and fluid resuscitation)",
      "Recurrent Syncope with Head Trauma or severe neurological focal deficits (sudden unilateral weakness, facial droop, or aphasia requiring urgent stroke protocol)"
    ]
  },
  claimCitations: [
    { claimId: "D0068-TRADITIONAL-PROFILE", statement: "Homeopathic post-viral fatigue profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0068-TRADITIONAL-PROFILE" },
    { claimId: "D0068-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for viral myocarditis ICU stabilization, pulmonary embolism anticoagulation, or adrenal crisis resuscitation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0068-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0068-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute myocarditis, pulmonary embolism, or severe adrenal crisis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Acute chest pain with shortness of breath and elevated troponin indicating viral myocarditis requiring emergency cardiology care",
    "Sudden pleuritic chest pain with hypoxia indicating pulmonary embolism requiring immediate emergency CT angiography",
    "Severe hypotension with vomiting and confusion indicating Addisonian adrenal crisis requiring emergency IV hydrocortisone"
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
  tags: ["Post-Viral Fatigue", "PVFS", "Long COVID", "PASC", "ME/CFS", "Post-Exertional Malaise", "Brain Fog", "POTS", "Disease", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/post-viral-fatigue",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive neuroinflammation, mitochondrial bioenergetics, and PEM clinical boundaries, myocarditis/PE red flags, and verified citations"],
  clinicalPearl: "Post-Exertional Malaise (PEM) is the cardinal feature of PVFS/ME/CFS; pushing through fatigue triggers multi-day cellular bioenergetic collapse.",
  quickFacts: {
    "Hallmark Symptom": "Post-Exertional Malaise (PEM) & Autonomic Orthostatic Intolerance (POTS)",
    "Primary System": "Central Nervous System & Mitochondrial Bioenergetics (Neurology / Immunology)",
    "Diagnostic Standard": "IOM 2015 Criteria (Fatigue >6mo, PEM, Unrefreshing Sleep, Brain Fog/POTS)",
    "Clinical Character": "Neuro-immune post-viral fatigue with mitochondrial ATP depletion and exercise intolerance"
  },
  aiReadiness: {
    retrievalSummary: "Post-Viral Fatigue Syndrome is debilitating exhaustion and brain fog following viral illness that worsens after exertion (PEM), managed with supportive care, pacing, and medical supervision.",
    clinicalSummary: "PVFS/Long COVID pathophysiology involves microglial neuroinflammation, microclot endothelial endotheliopathy, mitochondrial ATP failure, and POTS dysautonomia. Homeopathic remedies serve as supportive restorative care and do not replace energy pacing, POTS hydration, or emergency care for acute myocarditis, PE, or adrenal crisis.",
    patientSummary: "Post-viral fatigue syndrome is severe exhaustion, brain fog, and dizziness that lingers for months after a viral infection (like COVID-19 or mono), where doing too much causes a severe crash, managed by careful energy pacing and rest.",
    studentSummary: "Multisystem disorder following viral infection (COVID, EBV). Pathophysiology: neuroinflammation, endothelial microclots, mitochondrial defect, dysautonomia/POTS. Hallmark: Post-Exertional Malaise (PEM; crash delayed 12-48h). Strict pacing is mandatory (avoid GET). Red flags: acute viral myocarditis, pulmonary embolism, and Addisonian crisis.",
    keywords: ["post-viral fatigue", "long covid", "pvfs", "chronic fatigue syndrome", "post-exertional malaise", "brain fog exhaustion", "pots orthostatic intolerance"],
    semanticKeywords: ["post-acute viral sequelae", "mitochondrial bioenergetic depletion", "post-exertional neuro-immune crash"],
    icd: "G93.32",
    mesh: "D015673",
    bodySystem: "Neurology & Immunology",
    urgency: "routine"
  }
};
