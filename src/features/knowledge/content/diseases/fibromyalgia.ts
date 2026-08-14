import { KnowledgeEntity } from "../../types";

export const FibromyalgiaDisease: KnowledgeEntity = {
  id: "D0024",
  slug: "fibromyalgia",
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
    en: "Fibromyalgia Syndrome (Central Pain Sensitization Syndrome / FMS)",
    hi: "फाइब्रोमायल्जिया / पूरे शरीर का दर्द व थकान (Fibromyalgia Syndrome)",
    gu: "ફાઇબ્રોમાયાલ્જીયા / સમગ્ર શરીરમાં દુખાવો અને થાક (Fibromyalgia)",
    mr: "फायब्रोमायल्जिया / संपूर्ण शरीर दुखणे आणि तीव्र थकवा (Fibromyalgia)",
    es: "Síndrome de Fibromialgia (Sensibilización Central del Dolor)",
    ar: "متلازمة الألم العضلي الليفي (Fibromyalgia)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Fibromyalgia Syndrome (FMS), covering central pain sensitization, widespread multisite musculo-fascial allodynia, cognitive 'fibro fog', constitutional homeopathic supportive management, and emergency red flags for acute inflammatory myopathy, rhabdomyolysis, and systemic autoimmune disease.",
    hi: "फाइब्रोमायल्जिया सिंड्रोम (पूरे शरीर में नसों व मांसपेशियों का दर्द) का सेंट्रल पेन सेंसिटाइजेशन पैथोलॉजी, व्यापक मस्कुलो-फेशियल दर्द, फाइब्रो फॉग, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और इंफ्लेमेटरी मायोपैथी की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ફાઇબ્રોમાયાલ્જીયા (સ્નાયુઓ અને સાંધાનો વ્યાપક દુખાવો) ની સેન્ટ્રલ સેન્સિટાઇઝેશન પેથોલોજી, ક્રોનિક થાક, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સ્નાયુઓના સોજા (માયોપથી) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "फायब्रोमायल्जिया सिंड्रोम (स्नायू आणि नसांचा तीव्र सार्वत्रिक त्रास), थकवा, पारंपरिक होमिओपॅथिक पद्धत आणि मायोपॅथीच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la fibromialgia que cubre la sensibilización central, alodinia generalizada, niebla mental, manejo homeopático complementario y banderas rojas de miopatías inflamatorias.",
    ar: "دليل سريري وتعليمي موثوق لمتلازمة الألم العضلي الليفي يغطي فرط التحسس المركزي للآلام والألودينيا المنتشرة والضباب الذهني والرعاية التكميلية وعلامات الخطر لاعتلال العضلات الالتهابي وانحلال الربيدات."
  },
  content: {
    overview:
      "Fibromyalgia Syndrome (FMS) is a complex, chronic neuro-sensory disorder characterized by widespread, diffuse, multisite musculoskeletal aching, stiffness, and hyperalgesia/allodynia lasting \u22653 months, accompanied by profound fatigue, non-restorative sleep, cognitive disturbances ('fibro fog'), and mood disturbances. Rather than a localized joint or muscle inflammatory disease, fibromyalgia is recognized as a prototypical central pain sensitization (nociplastic pain) condition driven by abnormal central nervous system pain amplification and impaired descending inhibitory pain pathways.",
    definition:
      "A chronic widespread pain condition defined by multisite musculoskeletal pain associated with sleep disturbance, severe physical fatigue, and cognitive dysfunction resulting from altered central nociceptive processing in the absence of structural tissue damage.",
    causes: [
      "Central pain sensitization: neuroplastic alterations in spinal dorsal horn neurons and cerebral somatosensory networks amplifying pain signals (hyperalgesia) and registering non-painful tactile stimuli as pain (allodynia)",
      "Neurotransmitter and neuromodulator imbalances: elevated levels of substance P, glutamate, and nerve growth factor (NGF) in cerebrospinal fluid, alongside decreased levels of serotonin and norepinephrine in descending antinociceptive pathways",
      "Dysregulation of the hypothalamic-pituitary-adrenal (HPA) axis and autonomic nervous system (hypocortisolism and blunted autonomic stress reactivity)",
      "Precipitating triggers: physical trauma (cervical whiplash injury), severe viral infections (Epstein-Barr, parvovirus), or profound emotional/psychological trauma in genetically predisposed individuals"
    ],
    riskFactors: [
      "Female gender (diagnosed 2 to 3 times more frequently in adult females)",
      "Personal or family history of other functional pain disorders (irritable bowel syndrome [IBS], interstitial cystitis, temporomandibular joint disorder [TMJD], chronic migraine)",
      "Presence of comorbid rheumatologic diseases (rheumatoid arthritis, systemic lupus erythematosus, ankylosing spondylitis; 'secondary fibromyalgia')",
      "History of chronic emotional stress, early life trauma, or major depressive disorder",
      "Sleep deprivation and disruption of restorative Stage 4 slow-wave delta sleep"
    ],
    symptoms: [
      "Widespread, symmetrical, deep muscular aching, burning, throbbing, or shooting pain affecting both sides of the body, above and below the waist, and the axial skeleton",
      "Cutaneous and musculoskeletal allodynia: light pressure, gentle clothing touch, or hugs provoke severe soreness",
      "Morning stiffness lasting for hours, often feeling worse than generalized arthritis",
      "Profound physical and mental fatigue unrelieved by sleep, waking up feeling exhausted and sore ('unrefreshing sleep')",
      "'Fibro fog': cognitive difficulties involving impaired short-term memory, word-finding difficulty, slowed processing speed, and mental confusion",
      "Somatic comorbidities: tension headaches, irritable bowel syndrome (bloating, alternating diarrhea/constipation), parasthesias in hands/feet, and cold intolerance"
    ],
    diagnosis:
      "Diagnosed clinically using the American College of Rheumatology (ACR) 2016 revised diagnostic criteria: Widespread Pain Index (WPI \u22657) and Symptom Severity Scale (SSS \u22655), or WPI 4–6 and SSS \u22659, with symptoms persisting at a similar level for at least 3 months. Laboratory testing (CBC, ESR, CRP, TSH, CK, Vitamin D, ANA, RF) is performed strictly to rule out mimicking inflammatory rheumatologic, metabolic, and endocrine disorders (normal inflammatory markers are characteristic of FMS).",
    differentialDiagnosis:
      "Differentiate Fibromyalgia from Hypothyroidism (elevated TSH), Polymyalgia Rheumatica (elderly patients with markedly elevated ESR/CRP), Rheumatoid Arthritis, Systemic Lupus Erythematosus (positive ANA with specific serologies), Polymyositis / Dermatomyositis (elevated serum creatine kinase and muscle weakness), Chronic Fatigue Syndrome / ME-CFS (distinguished by cardinal post-exertional malaise), and Vitamin D Deficiency.",
    conventionalManagement:
      "A multimodal interdisciplinary strategy combines non-pharmacological and pharmacological modalities. First-line evidence-based non-pharmacological therapies include graduated low-impact aerobic exercise (walking, swimming, aquatic therapy), strength training, and Cognitive Behavioral Therapy (CBT). FDA-approved pharmacotherapies include serotonin-norepinephrine reuptake inhibitors (SNRIs: duloxetine, milnacipran) and alpha-2-delta calcium channel ligands (pregabalin, gabapentin). Opioids and systemic corticosteroids are strictly not recommended.",
    homeopathicApproach:
      "Homeopathic constitutional and neuralgic remedies (such as Rhus Toxicodendron, Arnica Montana, Causticum, Cimicifuga Racemosa, Bryonia Alba, Ruta Graveolens, Hypericum Perforatum, Kali Phosphoricum) serve as supportive care to ease generalized body soreness, relieve weather-related stiffness, and assist sleep relaxation alongside structured gentle exercise and rheumatology guidance.",
    lifestyleAdvice:
      "Engage in daily gentle low-impact physical exercise (start with 5–10 minutes of gentle walking or warm-water aquatic therapy and increase gradually without overexerting), maintain strict sleep hygiene practices, practice mindfulness-based stress reduction (MBSR), apply gentle dry warmth or take warm baths before bed, and pace daily activities into manageable intervals.",
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
        question: "Is fibromyalgia an autoimmune disease or arthritis?",
        answer: "No. Fibromyalgia is classified as a neurosensory disorder of central pain processing (nociplastic pain) rather than an autoimmune disease or joint-damaging inflammatory arthritis. Blood tests and joint X-rays are typically normal."
      },
      {
        question: "Why does exercise help fibromyalgia if it hurts to move?",
        answer: "Gentle, gradual aerobic exercise stimulates the body's natural endorphin production, strengthens descending pain inhibitory pathways in the brain, improves restorative deep sleep, and reduces central nervous system sensitivity over time."
      }
    ],
    redFlags: [
      "True objective proximal muscle weakness (inability to lift arms above head or stand from a chair without pushing; indicates inflammatory polymyositis or myopathy requiring emergency creatine kinase [CK] and EMG evaluation)",
      "Markedly elevated inflammatory markers (ESR >60–100 mm/hr or highly elevated CRP; suggests occult giant cell arteritis, polymyalgia rheumatica, or systemic malignancy)",
      "Dark tea-colored urine, acute severe muscle pain, and extreme weakness following exertion or new statin medication (suspected acute Rhabdomyolysis requiring emergency hospitalization and IV hydration)",
      "Synovitis: objective joint swelling, warmth, joint effusion, or visible joint deformities (indicates inflammatory autoimmune arthritis)"
    ]
  },
  claimCitations: [
    { claimId: "D0024-TRADITIONAL-PROFILE", statement: "Homeopathic fibromyalgia profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0024-TRADITIONAL-PROFILE" },
    { claimId: "D0024-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for central sensitization, inflammatory myopathies, or rhabdomyolysis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0024-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0024-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for inflammatory myopathy, rhabdomyolysis, or systemic autoimmune disease.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "True objective proximal muscle weakness indicating inflammatory polymyositis/dermatomyositis requiring emergency CK and muscle biopsy",
    "Dark cola-colored urine and acute severe muscle swelling indicating acute rhabdomyolysis requiring emergency IV fluids",
    "Markedly elevated ESR/CRP with jaw claudication indicating giant cell arteritis"
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
  tags: ["Fibromyalgia", "FMS", "Central Sensitization", "Disease", "Widespread Pain", "Allodynia", "Fibro Fog", "Rheumatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/fibromyalgia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive nociplastic pain clinical boundaries, myopathy/rhabdomyolysis red flags, and verified citations"],
  clinicalPearl: "Normal blood tests (ESR, CRP, CK, ANA) in a patient with widespread severe body pain strongly support the clinical diagnosis of central sensitization in fibromyalgia.",
  quickFacts: {
    "Prevalence": "Estimated 2% to 4% of the global adult population (female predominance)",
    "Primary System": "Central Nervous System & Musculoskeletal System (Pain Neurobiology)",
    "Diagnostic Standard": "ACR 2016 Diagnostic Criteria (Widespread Pain Index & Symptom Severity Scale)",
    "Clinical Character": "Widespread diffuse musculoskeletal pain and allodynia accompanied by fatigue, unrefreshing sleep, and fibro fog"
  },
  aiReadiness: {
    retrievalSummary: "Fibromyalgia Syndrome is a chronic widespread pain disorder driven by central sensitization and pain amplification, presenting with muscle aching, fatigue, and fibro fog, managed with supportive care, gentle aerobic exercise, and CBT.",
    clinicalSummary: "Fibromyalgia pathophysiology involves central pain sensitization, substance P elevation, and impaired descending pain inhibition. Homeopathic remedies serve as supportive musculoskeletal care and do not replace rheumatological evaluation, exercise therapy, or emergency care for acute inflammatory myopathies or rhabdomyolysis.",
    patientSummary: "Fibromyalgia is a condition that causes chronic widespread pain all over the body, extreme fatigue, trouble sleeping, and brain fog, helped by gentle walking, pacing activities, and stress management.",
    studentSummary: "Diagnosed using ACR 2016 criteria (WPI and SSS scores). Prototypical nociplastic pain condition with normal inflammatory markers. Differentiate from polymyalgia rheumatica (high ESR) and myopathies (elevated CK and true motor weakness).",
    keywords: ["fibromyalgia", "fibromyalgia syndrome", "fms", "widespread body pain", "fibro fog", "allodynia", "tender points"],
    semanticKeywords: ["central pain sensitization", "nociplastic pain", "chronic widespread musculoskeletal pain"],
    icd: "M79.7",
    mesh: "D005356",
    bodySystem: "Rheumatology & Pain Medicine",
    urgency: "routine"
  }
};
