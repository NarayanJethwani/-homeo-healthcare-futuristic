import { KnowledgeEntity } from "../../types";

export const SciaticaDisease: KnowledgeEntity = {
  id: "D0040",
  slug: "sciatica",
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
    en: "Sciatica (Lumbar Radiculopathy / Sciatic Neuralgia)",
    hi: "साइटिका / गृध्रसी (Sciatica / Lumbar Radiculopathy)",
    gu: "રાંઝણ / સાયટીકા (Sciatica / Lumbar Radiculopathy)",
    mr: "सायटिका / रांजण (Sciatica / Lumbar Radiculopathy)",
    es: "Ciática (Radiculopatía Lumbar)",
    ar: "عرق النسا (Sciatica)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Sciatica, covering L4, L5, and S1 lumbar nerve root compression, disc herniation, piriformis syndrome, constitutional homeopathic supportive management, and emergency red flags for cauda equina syndrome and progressive motor weakness (foot drop).",
    hi: "साइटिका (गृध्रसी/कमर से पैर का दर्द) का लम्बर डिस्क हर्नियेशन पैथोलॉजी, एल5/एस1 नर्व रूट कंप्रेशन, पाइरीफॉर्मिस सिंड्रोम, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और कॉडा इक्विना सिंड्रोम की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "રાંઝણ (સાયટીકા) ની લમ્બર ડિસ્ક હર્નિયેશન પેથોલોજી, કમરથી પગની એડી સુધી ખેંચાતો તીવ્ર દુખાવો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને કૉડા ઇક્વિના સિન્ડ્રોમની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "सायटिका (रांजण), कंबरेतून पायात जाणारी तीव्र कळ, पायाला मुंग्या व बधिरता, पारंपरिक होमिओपॅथिक पद्धत आणि कॉडा इक्विना सिंड्रोमच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la ciática que cubre la hernia discal lumbar, radiculopatía L5-S1, manejo homeopático complementario y banderas rojas del síndrome de cola de caballo.",
    ar: "دليل سريري وتعليمي موثوق لعرق النسا يغطي انزلاق الغضروف القطني والاعتلال الجذري العصبي ومتلازمة الكمثرية والرعاية التكميلية وعلامات الخطر لمتلازمة ذيل الفرس."
  },
  content: {
    overview:
      "Sciatica (lumbar radiculopathy) describes neuropathic radiating pain originating in the lumbosacral spine and traveling down the distribution of the sciatic nerve (the largest nerve in the human body, formed by nerve roots L4 through S3). Characteristically unilateral, it shoots through the buttock, posterior or posterolateral thigh, popliteal fossa, calf, and into the foot and toes, exacerbated by sitting, forward bending, coughing, or sneezing.",
    definition:
      "A clinical syndrome of radiating leg pain, sensory paresthesias, and motor weakness caused by mechanical compression and neurogenic inflammation of one or more lumbosacral nerve roots comprising the sciatic nerve.",
    causes: [
      "Lumbar intervertebral disc herniation (extrusion, protrusion, or sequestration of nucleus pulposus; responsible for >90% of acute sciatica, predominantly at L4–L5 and L5–S1)",
      "Lumbar spinal stenosis: degenerative bony hypertrophy and ligamentum flavum thickening narrowing the central canal or lateral recess",
      "Lumbar spondylolisthesis: forward slippage of one lumbar vertebra over another causing foraminal nerve root pinching",
      "Piriformis syndrome: hypertrophy, spasm, or anatomical variation of the piriformis muscle compressing the sciatic nerve in the greater sciatic notch"
    ],
    riskFactors: [
      "Occupational lifting strain: heavy manual lifting, twisting while bending, and whole-body vibrational exposure (e.g., truck driving)",
      "Prolonged sedentary sitting with poor lumbar support",
      "Obesity and increased mechanical load on the lumbar intervertebral discs",
      "Age (peak incidence between 30 and 50 years of age for disc herniation, and >60 years for degenerative spinal stenosis)",
      "Tobacco smoking (reduces microvascular perfusion to intervertebral discs and accelerates annular fissuring)"
    ],
    symptoms: [
      "Sharp, shooting, burning, lancinating, or electric shock-like pain radiating from the low back/gluteal region down the leg past the knee to the foot",
      "Paresthesias: subjective numbness, tingling ('pins and needles'), or 'dead sensation' in a specific dermatomal pattern (L5: dorsum of foot/great toe; S1: lateral foot/sole/heel)",
      "Aggravation with increased intra-abdominal pressure: coughing, sneezing, bearing down (Valsalva maneuver)",
      "Motor weakness: difficulty with great toe dorsiflexion / heel walking (L5 root), or weak plantarflexion / toe walking (S1 root)",
      "Diminished or absent Achilles tendon reflex (S1 radiculopathy)"
    ],
    diagnosis:
      "Diagnosed clinically using provocative neurodynamic maneuvers, primarily the Straight Leg Raise (SLR / Lasègue's sign; high sensitivity for L4–S1 disc herniation) and the Crossed Straight Leg Raise test (high specificity for nerve root compression). Lumbar Spine MRI is the gold standard diagnostic modality, indicated when symptoms persist beyond 4 to 6 weeks, when conservative therapy fails, or when red flag neurological signs are present.",
    differentialDiagnosis:
      "Differentiate Sciatica from Non-specific Low Back Pain (musculoligamentous strain without radiating leg symptoms), Sacroiliac Joint Dysfunction, Greater Trochanteric Pain Syndrome (trochanteric bursitis), Meralgia Paresthetica (lateral femoral cutaneous nerve entrapment), Diabetic Polyneuropathy, and Vascular Claudication (peripheral arterial disease).",
    conventionalManagement:
      "Conservative therapy forms the first-line foundation: short-term activity modification (avoiding bed rest beyond 48 hours), physical therapy (McKenzie extensions, core stabilization), NSAIDs, oral neuropathic agents (gabapentin, pregabalin), and fluoroscopy-guided lumbar transforaminal epidural steroid injections (TFESI). Surgical microdiscectomy or decompression is indicated for progressive neurological deficit, cauda equina syndrome, or refractory intractable pain lasting >6–12 weeks.",
    homeopathicApproach:
      "Homeopathic constitutional and neuralgic remedies (such as Colocynthis, Magnesia Phosphorica, Gnaphalium Polycephalum, Rhus Toxicodendron, Hypericum Perforatum, Valeriana Officinalis, Kali Bichromicum, Bryonia) serve as supportive care to ease neuralgic spasms, relieve posture-related stiffness, and address individual pain modalities alongside core physiotherapy and ergonomic guidance.",
    lifestyleAdvice:
      "Avoid prolonged static sitting or slumping, use a firm lumbar support cushion, engage in daily low-impact walking and gentle hamstring stretches, practice safe lifting techniques (bend at the knees and hips, keep heavy loads close to the body, and never twist while lifting), and maintain healthy abdominal core muscle tone.",
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
        question: "Is bed rest recommended for acute sciatica pain?",
        answer: "No. Current clinical guidelines recommend staying as active as tolerated and avoiding prolonged bed rest beyond 1 to 2 days, as staying gently active promotes healing and prevents spinal muscle deconditioning."
      },
      {
        question: "What is the Straight Leg Raise (SLR) test?",
        answer: "A physical exam test where the doctor lifts your straight leg while you lie flat on your back. If shooting pain radiates down your leg below the knee between 30 and 70 degrees of elevation, it strongly suggests a herniated disc pinching a sciatic nerve root."
      }
    ],
    redFlags: [
      "Cauda Equina Syndrome: new-onset urinary retention, overflow incontinence, loss of bowel sphincter control, or bilateral saddle anesthesia (numbness in the perineal/groin region; requires emergency surgical decompression within 24–48 hours)",
      "Rapidly progressive motor weakness in the leg (such as acute foot drop or inability to bear weight on the heel/toe)",
      "Sciatica in a patient with a history of cancer, unexplained weight loss, or persistent night pain unrelieved by lying down (suspected spinal metastases)",
      "Severe back and leg pain accompanied by high fever, localized spinal tenderness, and history of IV drug use or recent spinal procedure (suspected spinal epidural abscess)"
    ]
  },
  claimCitations: [
    { claimId: "D0040-TRADITIONAL-PROFILE", statement: "Homeopathic sciatica profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0040-TRADITIONAL-PROFILE" },
    { claimId: "D0040-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for structural disc sequestration or surgical cauda equina decompression.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0040-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0040-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for cauda equina syndrome, acute foot drop, or spinal epidural abscess.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Saddle anesthesia, urinary retention, or fecal incontinence indicating cauda equina syndrome requiring emergency spinal MRI and discectomy",
    "Rapidly progressive motor paralysis (such as acute foot drop)",
    "Fever, rigors, and focal spinal tenderness indicating spinal epidural abscess"
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
  tags: ["Sciatica", "Lumbar Radiculopathy", "Disc Herniation", "Disease", "Nerve Pain", "Leg Pain", "Slipped Disc", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/sciatica",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive radiculopathy clinical boundaries, cauda equina red flags, and verified citations"],
  clinicalPearl: "Always test perianal sensation and anal sphincter tone in patients with severe low back and leg pain to immediately identify surgical cauda equina syndrome.",
  quickFacts: {
    "Lifetime Prevalence": "Estimated 10% to 40% across the general adult population",
    "Primary System": "Nervous System & Musculoskeletal System (Lumbosacral Spine)",
    "Diagnostic Standard": "Clinical Neurological Exam (SLR Test) & Lumbar Spine MRI",
    "Clinical Character": "Unilateral radiating neuropathic leg pain along the distribution of the sciatic nerve"
  },
  aiReadiness: {
    retrievalSummary: "Sciatica is radiating neuropathic pain down the sciatic nerve distribution caused by lumbar disc herniation or spinal stenosis, managed with supportive constitutional care, physiotherapy, and conventional medical guidance.",
    clinicalSummary: "Sciatica pathophysiology involves mechanical compression and inflammatory sensitization of L4-S1 nerve roots. Homeopathic remedies serve as supportive musculoskeletal care and do not replace emergency neurosurgical decompression for cauda equina syndrome or progressive foot drop paresis.",
    patientSummary: "Sciatica is sharp, shooting, or burning pain that travels from the lower back through the buttock and down the leg into the foot, usually caused by a slipped disc pinching a nerve.",
    studentSummary: "Most commonly caused by L4-L5 or L5-S1 disc herniations. Positive Straight Leg Raise (Lasègue's sign) supports diagnosis. Red flag: Cauda Equina Syndrome (saddle anesthesia and bowel/bladder incontinence) requiring emergency surgery.",
    keywords: ["sciatica", "lumbar radiculopathy", "slipped disc", "radiating leg pain", "nerve pain leg", "piriformis syndrome", "disc herniation"],
    semanticKeywords: ["lumbar nerve root compression", "sciatic nerve neuralgia", "intervertebral disc herniation"],
    icd: "M54.30",
    mesh: "D012585",
    bodySystem: "Neurology & Musculoskeletal",
    urgency: "routine"
  }
};
