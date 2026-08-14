import { KnowledgeEntity } from "../../types";

export const LowBackPainDisease: KnowledgeEntity = {
  id: "D0056",
  slug: "low-back-pain",
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
    en: "Mechanical Low Back Pain & Lumbago (Lumbar Spondylosis & Myofascial Strain)",
    hi: "कमर दर्द / लम्बर स्पोंडिलोसिस व लंबैगो (Low Back Pain / Lumbago)",
    gu: "કમરનો દુખાવો / લમ્બાગો (Low Back Pain / Lumbar Spondylosis)",
    mr: "पाठदुखी आणि कंबरदुखी / लंबॅगो (Low Back Pain / Lumbar Strain)",
    es: "Lumbalgia Mecánica (Dolor Lumbar y Espondilosis Lumbar)",
    ar: "ألم أسفل الظهر واللومباغو (Low Back Pain)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Non-Specific Mechanical Low Back Pain (Lumbago), covering paraspinal muscle strain, lumbar facet arthropathy, degenerative disc disease, constitutional homeopathic supportive management, and emergency red flags for Cauda Equina Syndrome, spinal epidural abscess, metastatic vertebral collapse, and abdominal aortic aneurysm (AAA).",
    hi: "कमर दर्द (लंबैगो / मैकेनिकल लो बैक पेन) का मांसपेशीय ऐंठन पैथोलॉजी, लम्बर फैसेट आर्थ्रोपैथी, डिस्क डिजनरेशन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और काउडा इक्विना सिंड्रोम (Cauda Equina) व रीढ़ की हड्डी के संक्रमण की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "કમરનો દુખાવો (લમ્બાગો) ની મસ્ક્યુલોસ્કેલેટલ પેથોલોજી, કમરના મણકાનો ઘસારો, સ્નાયુઓની અકડાઈ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પેશાબ-મળના નિયંત્રણ ગુમાવવા (કાઉડા ઇક્વિના) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "कंबरदुखी (Low Back Pain / Lumbago), मणक्यांची झीज व स्नायूंचा ताण, पारंपरिक होमिओपॅथिक पद्धत आणि कॉडा इक्विना सिंड्रोमच्या (Cauda Equina) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del dolor lumbar mecánico que cubre la contractura paravertebral, artropatía facetaria, discopatía degenerativa, manejo homeopático complementario y banderas rojas de síndrome de cola de caballo y absceso epidural.",
    ar: "دليل سريري وتعليمي موثوق لألم أسفل الظهر الميكانيكي يغطي إجهاد العضلات المجاورة للفقرات واعتلال المفاصل الوجيهية والتنكس القرصي والرعاية التكميلية وعلامات الخطر لمتلازمة ذيل الفرس والخراج فوق الجافية."
  },
  content: {
    overview:
      "Low Back Pain (LBP / Lumbago) is the leading cause of global disability and years lived with disability (YLDs) across all age groups worldwide. Affecting the lumbosacral region extending from the 12th rib costal margins to the inferior gluteal folds, up to 90% of cases are classified as Non-Specific Mechanical Low Back Pain—meaning pain not attributable to a specific recognizable systemic disease, fracture, structural deformity, malignancy, or major neurological compromise. Driven by a complex interaction between paraspinal musculoligamentous strain, lumbar facet joint arthropathy, intervertebral disc degeneration (spondylosis), sacroiliac joint dysfunction, and biopsychosocial stressors, it is characterized by localized aching, stiffness, and posture-dependent mechanical exacerbation.",
    definition:
      "Pain, muscle tension, or stiffness localized below the costal margin and above the inferior gluteal folds, with or without leg pain, lasting <6 weeks (acute), 6–12 weeks (subacute), or >12 weeks (chronic).",
    causes: [
      "Acute paraspinal myofascial strain and ligamentous sprain from sudden lifting, twisting torque, or excessive physical exertion",
      "Degenerative Disc Disease (lumbar spondylosis): age-related annular disc desiccation, loss of disc height, and endplate sclerosis",
      "Lumbar Facet Joint (Zygapophysial) Arthropathy: synovial facet inflammation, cartilage wear, and reactive subchondral hypertrophy provoking extension-related low back ache",
      "Sacroiliac (SI) joint mechanical dysfunction and ligamentous shear stress",
      "Poor biomechanics, prolonged sedentary desk sitting, obesity, and weak core abdominal/lumbar stabilizing muscles (transversus abdominis, multifidus)"
    ],
    riskFactors: [
      "Heavy physical labor involving repetitive heavy lifting, awkward bending, and whole-body vibration (truck drivers, construction)",
      "Prolonged sedentary occupations with poor ergonomic seating",
      "Elevated Body Mass Index (BMI \u226530; increased mechanical load on lumbosacral spinal motion segments)",
      "Smoking (compromises microvascular capillary perfusion to avascular intervertebral discs)",
      "Psychosocial stress, depression, anxiety, job dissatisfaction, and somatization ('yellow flags' strongly predicting transition to chronic disability)"
    ],
    symptoms: [
      "Aching, dull, or sharp pain localized across the lower lumbar and lumbosacral spine, often radiating into the upper buttocks",
      "Paraspinal muscle spasm: painful guarding, tightness, and palpation tenderness along the erector spinae muscles",
      "Mechanical aggravation: pain worsens with forward bending, lifting, prolonged standing, or transitioning from sitting to standing",
      "Stiffness on waking in the morning or after prolonged sitting, typically loosening with gentle walking",
      "Absence of progressive motor weakness, foot drop, or bowel/bladder sphincter dysfunction in uncomplicated mechanical back pain"
    ],
    diagnosis:
      "Diagnosed primarily through a focused clinical history and physical examination (evaluating lumbar range of motion, paraspinal palpation tenderness, gait, deep tendon reflexes, manual muscle motor testing, sensory dermatome mapping, and the Straight Leg Raise [SLR] test). Routine diagnostic imaging (Lumbar Spine X-rays or MRI) is strictly NOT recommended in the first 4 to 6 weeks for uncomplicated acute mechanical back pain in the absence of clinical 'Red Flags' (because age-related incidental disc bulges and degenerative changes are universally present in asymptomatic individuals).",
    differentialDiagnosis:
      "Differentiate Mechanical Low Back Pain from Lumbar Radiculopathy / Sciatica (dermatomal shooting leg pain below the knee with positive SLR), Axial Spondyloarthritis / Ankylosing Spondylitis (young males, morning stiffness >30–60 minutes improving with exercise, HLA-B27 positive), Spinal Epidural Abscess (fever, localized severe spine tenderness, IV drug use), Metastatic Spinal Neoplasm, Vertebral Compression Fracture (osteoporosis, acute trauma), and Ruptured Abdominal Aortic Aneurysm (pulsatile abdominal mass).",
    conventionalManagement:
      "Evidence-based clinical guidelines (ACP, NICE) recommend: (1) Remaining physically active and avoiding prolonged bed rest (bed rest >48 hours delays recovery). (2) First-line non-pharmacological therapies: superficial heat wraps, spinal manipulation, acupuncture, massage, Cognitive Behavioral Therapy (CBT), and active structured exercise programs (core stabilization, McKenzie method, yoga). (3) Pharmacotherapy for acute exacerbations: oral NSAIDs (ibuprofen, naproxen) or skeletal muscle relaxants for short-term rescue use. Acetaminophen and opioids are not recommended as first-line therapies. (4) Interventional lumbar facet joint medial branch blocks or radiofrequency ablation for chronic refractory facetogenic back pain.",
    homeopathicApproach:
      "Homeopathic constitutional and musculoskeletal remedies (such as Rhus Toxicodendron, Bryonia Alba, Arnica Montana, Kali Carbonicum, Ruta Graveolens, Calcarea Fluorica, Aesculus Hippocastanum, Berberis Vulgaris, Cimicifuga Racemosa) serve as supportive care to soothe paraspinal stiffness, ease motion-related aching, and support structural vitality alongside active exercise, core strengthening, and ergonomic modifications.",
    lifestyleAdvice:
      "Stay active with daily walking and avoid staying in bed, apply a warm heating pad for 20 minutes to soothe paraspinal muscle spasms, practice core strengthening exercises (planks, bird-dog, pelvic tilts) once acute pain settles, maintain an ergonomic workstation with adequate lumbar support, practice safe lifting techniques (bend at the knees and hips, keep heavy loads close to the body, and never twist while lifting), and maintain a healthy body weight.",
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
        question: "Why is staying in bed the wrong thing to do for an acute back strain?",
        answer: "Clinical trials prove that strict bed rest weakens core stabilizing muscles, stiffens spinal ligaments, prolongs inflammation, and significantly delays recovery. Staying gently active with light walking and normal daily routines speeds up healing and reduces pain much faster."
      },
      {
        question: "Why is an MRI usually not ordered right away for back pain?",
        answer: "In the absence of red flags, imaging does not change early treatment and often shows normal age-related findings (like disc bulges or mild arthritis) that occur in healthy, pain-free people. An early MRI can cause unnecessary worry and does not improve recovery rates."
      }
    ],
    redFlags: [
      "Cauda Equina Syndrome: sudden new-onset urinary retention or overflow incontinence, fecal incontinence, bilateral lower extremity weakness or foot drop, and bilateral 'saddle anesthesia' (numbness in the groin, buttocks, and perineum; neurosurgical emergency requiring immediate emergency MRI and surgical decompression within 24–48 hours)",
      "Spinal Infection (Vertebral Osteomyelitis / Epidural Abscess): new or worsening severe low back pain accompanied by high fever, chills, localized spinal percussion tenderness, and risk factors (recent spinal injection, indwelling catheter, or IV drug use)",
      "Spinal Malignancy / Epidural Metastasis: constant, progressive, severe back pain that is worse at night while lying flat in bed (unrelieved by rest), accompanied by unexplained weight loss and a personal history of cancer (breast, prostate, lung, kidney, myeloma)",
      "Abdominal Aortic Aneurysm (AAA) Rupture: sudden, catastrophic tearing lower back and flank pain accompanied by hypotension, syncope, and a pulsatile midline abdominal mass"
    ]
  },
  claimCitations: [
    { claimId: "D0056-TRADITIONAL-PROFILE", statement: "Homeopathic low back pain profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0056-TRADITIONAL-PROFILE" },
    { claimId: "D0056-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for cauda equina decompression surgery, spinal infection clearance, or vertebral fracture stabilization.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0056-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0056-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for cauda equina syndrome, spinal epidural abscess, or spinal cord compression.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Urinary retention and saddle anesthesia indicating Cauda Equina Syndrome requiring immediate emergency neurosurgical decompression",
    "Severe localized spine tenderness with high fever indicating spinal epidural abscess requiring emergency MRI and IV antibiotics",
    "Constant nocturnal back pain unrelieved by rest with history of cancer indicating metastatic cord compression"
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
  tags: ["Low Back Pain", "Lumbago", "Lumbar Spondylosis", "Disease", "Back Strain", "Paraspinal Spasm", "Spinal Ergonomics", "Orthopedics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/low-back-pain",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive mechanical lumbar spine clinical boundaries, cauda equina/spinal infection red flags, and verified citations"],
  clinicalPearl: "Always check for 'saddle anesthesia' and post-void urinary retention in any patient with severe low back pain to immediately rule out surgical Cauda Equina Syndrome.",
  quickFacts: {
    "Lifetime Prevalence": "Up to 80% of adults experience at least one episode of significant low back pain",
    "Primary System": "Musculoskeletal & Lumbosacral Spine (Orthopedics / Physical Medicine)",
    "Diagnostic Standard": "Clinical Neurological & Biomechanical Exam (Imaging reserved for Red Flags)",
    "Clinical Character": "Mechanical myofascial and degenerative lumbosacral pain aggravated by movement and prolonged postures"
  },
  aiReadiness: {
    retrievalSummary: "Mechanical Low Back Pain is localized lumbosacral aching and muscle spasm aggravated by movement, managed with supportive care, remaining physically active, core exercise, and avoiding bed rest.",
    clinicalSummary: "Low Back Pain pathophysiology involves paraspinal muscle spasm, lumbar facet joint arthropathy, and intervertebral disc spondylosis. Homeopathic remedies serve as supportive musculoskeletal care and do not replace physical activity, core strengthening, or emergency neurosurgery for acute Cauda Equina Syndrome or spinal epidural abscess.",
    patientSummary: "Low back pain (lumbago) is common muscle stiffness and aching in your lower spine that gets better by staying active, gentle walking, heat wraps, and avoiding staying in bed.",
    studentSummary: "Non-specific mechanical back pain accounts for >90% of cases. Avoid routine early MRI without red flags. Bed rest is harmful; stay active. Red flags: Cauda Equina Syndrome (saddle anesthesia + urinary retention), spinal epidural abscess (fever + tenderness), and cancer metastases.",
    keywords: ["low back pain", "lumbago", "lumbar spondylosis", "back ache", "paraspinal muscle spasm", "stiff lower back", "cauda equina"],
    semanticKeywords: ["mechanical lumbosacral pain", "lumbar facet arthropathy", "myofascial lumbar strain"],
    icd: "M54.50",
    mesh: "D017116",
    bodySystem: "Orthopedics & Spine Medicine",
    urgency: "routine"
  }
};
