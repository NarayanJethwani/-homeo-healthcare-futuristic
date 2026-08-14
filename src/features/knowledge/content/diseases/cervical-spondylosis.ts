import { KnowledgeEntity } from "../../types";

export const CervicalSpondylosisDisease: KnowledgeEntity = {
  id: "D0018",
  slug: "cervical-spondylosis",
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
    en: "Cervical Spondylosis (Cervical Osteoarthritis)",
    hi: "सर्वाइकल स्पॉन्डिलाइटिस / स्पोंडिलोसिस (गर्दन का दर्द व जकड़न)",
    gu: "સર્વાઇકલ સ્પોન્ડિલોસિસ / ગરદનનો ઘસારો (Cervical Spondylosis)",
    mr: "सर्व्हायकल स्पॉन्डिलायटिस / मानेचा त्रास (Cervical Spondylosis)",
    es: "Espondilosis Cervical (Artrosis Cervical)",
    ar: "داء الفقار الرقبية (Cervical Spondylosis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Cervical Spondylosis, covering age-related intervertebral disc degeneration, osteophytosis, cervical radiculopathy, constitutional homeopathic supportive management, and emergency red flags for progressive cervical myelopathy and spinal cord compression.",
    hi: "सर्वाइकल स्पोंडिलोसिस (गर्दन की हड्डियों और डिस्क का घिसाव) का पैथोफिजियोलॉजी, सर्वाइकल रेडिकुलोपैथी के लक्षण, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और स्पाइनल कॉर्ड कंप्रेशन (मायलोपैथी) की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "સર્વાઇકલ સ્પોન્ડિલોસિસ (ગરદનના મણકાનો ઘસારો), ચેતા દબાણ (રેડિક્યુલોપથી), પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સ્પાઇનલ કૉર્ડ દબાણ (માયલોપથી) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "सर्व्हायकल स्पॉन्डिलोसिस (मानेच्या मणक्यांची झीज), हाताला मुंग्या येणे, पारंपरिक होमिओपॅथिक पद्धत आणि मज्जारज्जूवरील दाबाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la espondilosis cervical que cubre la degeneración discal, radiculopatía, manejo homeopático de apoyo y banderas rojas de mielopatía.",
    ar: "دليل سريري وتعليمي موثوق لداء الفقار الرقبية يغطي تنكس الأقراص الرقبية والاعتلال الجذري والرعاية التكميلية وعلامات الخطر لاعتلال النخاع الشوكي الرقبي."
  },
  content: {
    overview:
      "Cervical Spondylosis is a chronic, progressive, age-related degenerative disorder affecting the cervical intervertebral discs, facet joints, uncinate processes (joints of Luschka), and surrounding longitudinal ligaments (typically C5–C6 and C6–C7). It manifests as chronic neck pain, occipital headache, paraspinal muscle spasm, restricted range of cervical motion, and, when nerve roots or the spinal cord are compromised, cervical radiculopathy or cervical spondylotic myelopathy (CSM).",
    definition:
      "A chronic degenerative condition of the cervical spine characterized by disc desiccation, loss of disc height, osteophyte (bone spur) formation, ligamentous hypertrophy, and narrowing of the neural foramina or spinal canal.",
    causes: [
      "Age-related intervertebral disc dehydration, nucleus pulposus collapse, and annular fissuring",
      "Compensatory reactive osteophyte formation along vertebral endplates and uncinate joints",
      "Facet joint cartilage erosion and hypertrophic arthropathy",
      "Hypertrophy and calcification of the ligamentum flavum and posterior longitudinal ligament"
    ],
    riskFactors: [
      "Advanced age (present radiologically in >85% of individuals over age 60)",
      "Occupational strain: repetitive neck twisting, heavy overhead lifting, or prolonged forward-head posture (e.g., computer/smartphone use 'tech neck')",
      "Prior cervical spine trauma, whiplash injury, or sports-related axial load impact",
      "Genetic predisposition to early osteoarthritis and disc degeneration",
      "Tobacco smoking (accelerates intervertebral disc desiccation and microvascular ischemia)"
    ],
    symptoms: [
      "Chronic axial neck stiffness, aching soreness, and muscle spasm aggravated by holding the neck in one position or neck extension",
      "Cervicogenic headaches radiating from the suboccipital region toward the vertex, temples, and retro-orbital area",
      "Cervical radiculopathy: sharp, electric, shooting pain radiating down the shoulder, arm, forearm, and fingers in a dermatomal distribution",
      "Paresthesias, numbness, or subjective tingling sensation ('pins and needles') in the thumb, index, or middle fingers (C6/C7 root compression)",
      "Crepitus, grinding sensations, and clicking on active rotational movements of the neck"
    ],
    diagnosis:
      "Diagnosed clinically via cervical physical examination (Spurling's test, Lhermitte's sign, deep tendon reflexes) supported by plain cervical radiographs (anteroposterior, lateral, flexion-extension views) to identify disc space narrowing and osteophytes. Cervical MRI is the gold standard when radiculopathy, neurological deficit, or suspected myelopathy is present.",
    differentialDiagnosis:
      "Differentiate Cervical Spondylosis from Cervical Disc Herniation, Rotator Cuff Tendinopathy, Thoracic Outlet Syndrome, Carpal Tunnel Syndrome (double crush syndrome), Rheumatoid Arthritis of the cervical spine, Polymyalgia Rheumatica, and Cervical Spine Neoplasms/Infections.",
    conventionalManagement:
      "Initial conservative therapy includes physical therapy (isometric cervical strengthening, postural re-education), NSAIDs, short-term muscle relaxants, ergonomic modifications, and selective cervical epidural steroid injections. Surgical decompression (anterior cervical discectomy and fusion [ACDF] or cervical arthroplasty) is indicated for progressive neurological deficit or intractable radiculopathy/myelopathy.",
    homeopathicApproach:
      "Homeopathic constitutional and tissue remedies (such as Ruta Graveolens, Rhus Toxicodendron, Kalmia Latifolia, Actaea Racemosa, Calcarea Fluorica, Paris Quadrifolia, Guaiacum) serve as supportive care to relieve musculoskeletal stiffness, ease radicular neuralgias, and improve mobility alongside structured ergonomic and physiotherapy guidance.",
    lifestyleAdvice:
      "Maintain proper ergonomic workstation alignment with the monitor at eye level, avoid cradling the telephone between the ear and shoulder, perform regular gentle neck stretches and chin tucks, use a supportive cervical orthopedic pillow, and take frequent breaks during prolonged computer work.",
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
        question: "What is the difference between cervical radiculopathy and cervical myelopathy?",
        answer: "Cervical radiculopathy involves compression of an individual nerve root causing radiating arm pain, numbness, and tingling. Cervical myelopathy involves compression of the spinal cord itself, causing gait unsteadiness, loss of hand dexterity (clumsiness dropping objects), and hyperreflexia."
      },
      {
        question: "Can cervical spondylosis cause dizziness or lightheadedness?",
        answer: "Yes, osteophytes pressing on the vertebral arteries during neck rotation or irritation of cervical sympathetic plexus can occasionally cause dizziness or imbalance (cervicogenic dizziness)."
      }
    ],
    redFlags: [
      "Progressive gait ataxia, broad-based unsteady walking, or feeling that legs are 'heavy' (suspected cervical myelopathy)",
      "Loss of fine motor dexterity in the hands (difficulty buttoning shirts, tying shoelaces, or dropping objects)",
      "Bowel or bladder sphincter dysfunction (urinary urgency, retention, or incontinence) indicating severe spinal cord compression",
      "Lhermitte's sign: sudden electric shock sensation shooting down the spine and limbs upon neck flexion",
      "Rapidly progressive upper extremity motor weakness (e.g., wrist drop, triceps paralysis, or intrinsic hand muscle wasting)"
    ]
  },
  claimCitations: [
    { claimId: "D0018-TRADITIONAL-PROFILE", statement: "Homeopathic cervical spondylosis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0018-TRADITIONAL-PROFILE" },
    { claimId: "D0018-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for structural spine osteophytes or surgical decompression.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0018-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0018-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for cervical myelopathy, cord compression, or progressive paralysis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Progressive gait unsteadiness, leg weakness, or loss of hand dexterity indicating cervical spondylotic myelopathy",
    "New-onset urinary retention, urgency, or fecal incontinence requiring emergency spinal surgical decompression",
    "Rapidly worsening motor paresis or muscle wasting in the upper extremities"
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
  tags: ["Cervical Spondylosis", "Cervical Osteoarthritis", "Disease", "Neck Pain", "Radiculopathy", "Spine Degeneration", "Tech Neck"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/cervical-spondylosis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive cervical degenerative clinical boundaries, myelopathy red flags, and verified citations"],
  clinicalPearl: "Always perform a detailed upper and lower extremity neurological examination in neck pain patients to screen for cervical myelopathy (Hoffmann's reflex, inverted radial reflex, gait unsteadiness).",
  quickFacts: {
    "Prevalence": "Present radiographically in >85% of adults over age 60",
    "Primary System": "Musculoskeletal & Nervous System (Cervical Spine)",
    "Diagnostic Standard": "Clinical Neurological Exam & Cervical Spine MRI / X-ray",
    "Clinical Character": "Chronic degenerative disc and facet arthropathy with potential radicular and cord compromise"
  },
  aiReadiness: {
    retrievalSummary: "Cervical Spondylosis is a chronic degenerative condition of the cervical intervertebral discs and vertebrae, leading to neck stiffness, cervicogenic headache, and radiating arm pain, managed with supportive constitutional care, physiotherapy, and ergonomics.",
    clinicalSummary: "Cervical Spondylosis pathology involves disc desiccation, osteophyte formation, and foraminal narrowing. Homeopathic remedies serve as supportive musculoskeletal care and do not replace emergency neurosurgical decompression for cervical spondylotic myelopathy or progressive motor loss.",
    patientSummary: "Cervical Spondylosis is age-related wear-and-tear of the neck joints and discs that causes neck stiffness, headaches, and tingling or aching down the arms, helped by posture care, gentle neck exercises, and supportive therapies.",
    studentSummary: "Degenerative disc disease predominantly at C5-C6 and C6-C7. Distinguish radiculopathy (single root nerve pain) from myelopathy (cord compression with gait ataxia and hyperreflexia).",
    keywords: ["cervical spondylosis", "cervical osteoarthritis", "neck pain", "cervical radiculopathy", "neck stiffness", "tech neck"],
    semanticKeywords: ["degenerative cervical spine", "intervertebral disc degeneration", "cervical myelopathy"],
    icd: "M47.812",
    mesh: "D055009",
    bodySystem: "Musculoskeletal & Neurology",
    urgency: "routine"
  }
};
