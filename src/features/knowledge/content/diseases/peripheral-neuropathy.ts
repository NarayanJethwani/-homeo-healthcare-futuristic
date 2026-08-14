import { KnowledgeEntity } from "../../types";

export const PeripheralNeuropathyDisease: KnowledgeEntity = {
  id: "D0070",
  slug: "peripheral-neuropathy",
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
    en: "Peripheral Neuropathy (Distal Symmetric Polyneuropathy & Diabetic Neuropathy)",
    hi: "पेरिफेरल न्यूरोपैथी / हाथ-पैरों की नसों की कमजोरी व सुन्नपन (Peripheral Neuropathy)",
    gu: "પેરિફેરલ ન્યુરોપેથી / પગ અને હાથમાં ઝણઝણાટી તથા બળતરા (Peripheral Neuropathy)",
    mr: "पेरिफेरल न्यूरोपॅथी / हात-पायांच्या नसांची कमजोरी व बधिरता (Peripheral Neuropathy)",
    es: "Neuropatía Periférica (Polineuropatía Simétrica Distal y Neuropatía Diabética)",
    ar: "اعتلال الأعصاب المحيطية والاعتلال العصبي السكري (Peripheral Neuropathy)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Peripheral Neuropathy (Distal Symmetric Polyneuropathy / DSPN), covering length-dependent axonal degeneration, microvascular endoneurial ischemia, 'stocking-glove' sensory loss and burning dysesthesias, constitutional homeopathic supportive management, and emergency red flags for acute ascending Guillain-Barré syndrome, infected neuropathic foot ulcers with osteomyelitis, and Charcot neuroarthropathy.",
    hi: "पेरिफेरल न्यूरोपैथी (हाथ-पैरों की नसों का नुकसान व सुन्नपन) का एक्सोनल डिजनरेशन पैथोलॉजी, डायबिटिक न्यूरोपैथी, मोजे-दस्ताने पैटर्न (Stocking-Glove) में सुन्नपन व जलन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और गुइयां-बैरे सिंड्रोम (Guillain-Barré Syndrome) व डायबिटिक फुट अल्सर/गैंग्रीन की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પેરિફેરલ ન્યુરોપેથી (ડાયાબિટીક ન્યુરોપેથી / નસોની નબળાઈ) ની પેથોલોજી, પગના તળિયામાં બળતરા અને સોય ભોંકાતી હોય તેવી ઝણઝણાટી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પગના ચાંદા (ડાયાબિટીક ફૂટ અલ્સર) તથા લકવાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "पेरिफेरल न्यूरोपॅथी (नसांची कमजोरी व पायांना मुंग्या येणे), तळपायांची जळजळ व बधिरता, डायबेटिक न्यूरोपॅथी, पारंपरिक होमिओपॅथिक पद्धत आणि डायबेटिक फूट अल्सर व गॅंग्रीनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la neuropatía periférica que cubre la degeneración axonal dependiente de la longitud, patrón en guante y calcetín, manejo homeopático complementario y banderas rojas de síndrome de Guillain-Barré y úlcera neuropática infectada.",
    ar: "دليل سريري وتعليمي موثوق لاعتلال الأعصاب المحيطية يغطي التنكس المحوري المعتمد على الطول ونمط القفاز والجورب الحسي والرعاية التكميلية وعلامات الخطر لمتلازمة غيلان باريه وقرحة القدم السكرية الإنتانية."
  },
  content: {
    overview:
      "Peripheral Neuropathy is a broad, debilitating neurological disorder caused by structural damage, metabolic injury, or dysfunction of the peripheral sensory, motor, or autonomic nerve fibers outside the brain and spinal cord. The most common presentation is Distal Symmetric Sensorimotor Polyneuropathy (DSPN)—a classical 'length-dependent' dying-back axonopathy that initially affects the longest nerve terminals in the lower extremities before progressing proximally in a characteristic 'stocking-glove' distribution. Predominantly driven by Diabetes Mellitus (diabetic peripheral neuropathy affecting >50% of long-term diabetic patients), chronic alcoholism, chemotherapy toxicity, and nutritional deficiencies, it manifests with burning neuropathic pain, electric shock paresthesias, sensory loss (numbness), balance instability, and loss of protective sensation predisposing to painless neuropathic foot ulcers.",
    definition:
      "A clinical and electrophysiological syndrome characterized by diffuse, symmetric damage to peripheral somatic and autonomic nerve axons or their myelin sheaths, presenting with length-dependent distal sensory loss, neuropathic pain, or motor weakness.",
    causes: [
      "Metabolic microvascular injury: chronic hyperglycemia in Diabetes Mellitus activates the polyol (sorbitol) pathway, forms advanced glycation end-products (AGEs), induces endoneurial microvascular capillary occlusion and hypoxia, and generates intense neuro-oxidative stress",
      "Nutritional and toxic etiologies: chronic alcohol neurotoxicity (direct toxic metabolite injury plus associated thiamine deficiency), Vitamin B12 (cobalamin) deficiency (subacute combined degeneration / demyelination), Vitamin B1 (thiamine) and Vitamin B6 (pyridoxine) deficiency or toxicity",
      "Chemotherapy-Induced Peripheral Neuropathy (CIPN): neurotoxic antineoplastic drugs disrupting axonal microtubule transport or mitochondrial function (taxanes: paclitaxel; platinum compounds: oxaliplatin, cisplatin; vinca alkaloids: vincristine; proteasome inhibitors: bortezomib)",
      "Immune-mediated and inflammatory neuropathies: Chronic Inflammatory Demyelinating Polyneuropathy (CIDP), Guillain-Barré Syndrome (acute post-infectious autoimmune demyelination), and systemic vasculitic mononeuritis multiplex",
      "Infectious neuropathies: Post-Herpetic Neuralgia, Leprosy (Hansen's disease; world's leading infectious cause of peripheral nerve damage), HIV/AIDS, Hepatitis C (cryoglobulinemia), and Lyme disease (Borrelia burgdorferi)",
      "Systemic and hereditary disorders: Chronic Kidney Disease (uremic neuropathy), Hypothyroidism, Monoclonal Gammopathy of Undetermined Significance (MGUS / anti-MAG neuropathy), and Charcot-Marie-Tooth disease (hereditary motor and sensory neuropathy [HMSN])"
    ],
    riskFactors: [
      "Poorly controlled Diabetes Mellitus (elevated HbA1c >7.0–8.0% and long duration of diabetes >10 years)",
      "Chronic heavy alcohol consumption and malnutrition",
      "Undergoing neurotoxic cancer chemotherapy regimens",
      "Bariatric surgery, restrictive vegan diets, or malabsorption syndromes without adequate Vitamin B12 / B-complex supplementation",
      "Chronic renal failure on hemodialysis or untreated primary hypothyroidism"
    ],
    symptoms: [
      "Positive sensory symptoms (neuropathic pain): continuous burning sensations, sharp lancinating pains, electric shocks, hyperalgesia, and cutaneous allodynia ('even the weight of bedsheets causes agonizing burning on the feet')",
      "Negative sensory symptoms (sensory loss): progressive numbness, sensation of 'walking on cotton, wool, or pebbles', and loss of temperature discrimination (inability to distinguish hot from cold water)",
      "Stocking-glove pattern: sensory loss begins symmetrically at the toes, ascends up the feet and lower legs to the mid-calf, and only then begins in the fingertips and hands",
      "Loss of proprioception and vibratory sensation: sensory ataxia, broad-based unsteady gait, frequent stumbling, and positive Romberg's sign (swaying/falling when closing eyes)",
      "Motor manifestations (in advanced stages): distal muscle weakness, toe scuffing, foot drop, intrinsic foot muscle atrophy leading to 'claw toes' and high arches",
      "Autonomic neuropathy symptoms: resting tachycardia, orthostatic hypotension (lightheadedness on standing), gastroparesis (early satiety, vomiting), diabetic diarrhea/constipation, erectile dysfunction, and gustatory sweating"
    ],
    diagnosis:
      "Diagnosed via a comprehensive bedside neurological examination: (1) Semmes-Weinstein 10-Gram Monofilament Testing (evaluating loss of protective sensation at 10 plantar sites; failure to feel indicates high foot ulcer risk). (2) 128-Hz Tuning Fork testing for vibratory sensation at the hallux interphalangeal joint. (3) Ankle Deep Tendon Reflexes (Achilles reflex; typically diminished or absent). (4) Standardized Laboratory Screening Panel: Fasting Plasma Glucose, HbA1c, Complete Blood Count (CBC), Comprehensive Metabolic Panel (BUN/Creatinine), Serum Vitamin B12 and Methylmalonic Acid (MMA; highly sensitive for cellular B12 deficiency), Serum TSH, and Serum Protein Electrophoresis with Immunofixation (SPEP/IFE; screening for paraproteinemic neuropathies). (5) Electrodiagnostic Testing: Electromyography / Nerve Conduction Studies (EMG/NCS; definitive standard differentiating axonal vs. demyelinating and motor vs. sensory neuropathy). Skin punch biopsy for Intraepidermal Nerve Fiber Density (IENFD) is the gold standard for small-fiber neuropathy.",
    differentialDiagnosis:
      "Differentiate Distal Symmetric Polyneuropathy from Lumbar Spinal Canal Stenosis (neurogenic claudication provoked by standing/walking and relieved by forward bending), Subacute Combined Degeneration of the Spinal Cord (dorsal column and corticospinal tract involvement with extensor plantar responses / Babinski), Cervical Spondylotic Myelopathy, Tarsal Tunnel Syndrome (localized entrapment), Peripheral Artery Disease (PAD / intermittent vascular claudication with diminished pedal pulses), and Restless Legs Syndrome (motor restlessness relieved by moving legs without objective sensory loss).",
    conventionalManagement:
      "A three-pillar comprehensive strategy: (1) Optimal glycemic control and disease-modifying etiology reversal: strict blood glucose control in diabetes (HbA1c <7.0%), alcohol cessation, Vitamin B12 replacement (intramuscular or high-dose oral cobalamin), and thyroid hormone replacement. (2) Symptomatic neuropathic pain pharmacotherapy (first-line evidence-based guidelines): Serotonin-Norepinephrine Reuptake Inhibitors (SNRIs: Duloxetine 60 mg/day), Alpha-2-Delta Calcium Channel Ligands (Pregabalin 150–300 mg/day, Gabapentin 900–2400 mg/day), and Tricyclic Antidepressants (Amitriptyline 10–50 mg at bedtime). Topical agents include 5% lidocaine patches and 8% capsaicin patches. (3) Preventive Foot Care: daily visual foot self-inspections, specialized diabetic therapeutic footwear, and routine podiatry debridement to prevent neuropathic foot ulceration and lower extremity amputation.",
    homeopathicApproach:
      "Homeopathic constitutional and neural-reparative remedies (such as Hypericum Perforatum, Causticum, Plumbum Metallicum, Phosphorus, Arsenicum Album, Secale Cornutum, Conium Maculatum, Zincum Metallicum, Kali Phosphoricum, Lachesis Muta) serve as supportive care to ease burning dysesthesias, soothe foot numbness, and support microvascular vitality alongside strict glycemic control, daily foot examinations, and podiatry monitoring.",
    lifestyleAdvice:
      "Inspect the bottom of both feet and between the toes every single day using a handheld mirror for red spots, blisters, cuts, or calluses, never walk barefoot (always wear well-cushioned socks and supportive diabetic shoes even indoors), test bathwater temperature with an elbow or thermometer before stepping in to prevent painless thermal burns, wash feet daily in lukewarm water and apply moisturizing lotion to heels (avoiding between the toes), and engage in regular low-impact exercise (swimming, stationary cycling).",
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
        question: "Why can peripheral neuropathy make a person unaware that they have a dangerous foot ulcer?",
        answer: "When sensory nerve fibers die, you lose 'protective sensation'—meaning your brain no longer receives warning pain signals when a shoe rubs a blister, a pebble cuts the sole, or hot water scalds the skin. A patient can walk for days on a severe infected wound without feeling any pain at all."
      },
      {
        question: "Can damaged peripheral nerves regrow or heal?",
        answer: "Peripheral nerve axons have a slow natural capacity for regeneration (growing at roughly 1 millimeter per day) if the underlying metabolic cause—such as high blood sugar, alcohol, or vitamin deficiency—is completely corrected. However, advanced long-standing axonal loss may be irreversible, making early prevention and glycemic control critical."
      }
    ],
    redFlags: [
      "Acute Inflammatory Demyelinating Polyradiculoneuropathy (Guillain-Barré Syndrome): rapid, symmetrical ascending muscle weakness and paralysis starting in the legs and moving up to the arms, chest, and face over hours to days, accompanied by hyporeflexia and respiratory muscle weakness (life-threatening neurological emergency requiring immediate hospitalization, ICU monitoring of forced vital capacity, IVIG, or plasmapheresis)",
      "Infected Diabetic Foot Ulcer with Sepsis or Osteomyelitis: non-healing deep foot ulcer with foul purulent drainage, surrounding spreading cellulitis/erythema, probing to deep bone, high fever, or black necrotic tissue (gangrene; surgical emergency requiring immediate surgical debridement, IV antibiotics, and vascular evaluation to prevent limb amputation)",
      "Acute Charcot Neuroarthropathy (Charcot Foot): sudden-onset unilateral warm, swollen, erythematous foot in a neuropathic diabetic patient with bounding pedal pulses and mild or no pain (requires immediate total non-weight-bearing immobilization and MRI to prevent catastrophic structural collapse of the foot arch)",
      "Rapid-onset asymmetrical multi-nerve motor loss (Mononeuritis Multiplex; e.g., wrist drop plus foot drop) indicating acute systemic necrotizing vasculitis"
    ]
  },
  claimCitations: [
    { claimId: "D0070-TRADITIONAL-PROFILE", statement: "Homeopathic peripheral neuropathy profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0070-TRADITIONAL-PROFILE" },
    { claimId: "D0070-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for Guillain-Barré plasmapheresis, diabetic osteomyelitis clearance, or Charcot foot immobilization.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0070-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0070-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for ascending Guillain-Barré syndrome, diabetic foot osteomyelitis, or acute Charcot neuroarthropathy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Rapidly ascending leg-to-arm paralysis with breathing difficulty indicating Guillain-Barré Syndrome requiring immediate ICU admission and IVIG",
    "Deep purulent neuropathic foot ulcer probing to bone or gangrenous tissue requiring emergency surgical debridement and IV antibiotics",
    "Acute hot swollen neuropathic foot indicating Charcot neuroarthropathy requiring immediate non-weight-bearing total contact casting"
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
  tags: ["Peripheral Neuropathy", "Diabetic Neuropathy", "Numb Feet", "Burning Soles", "Disease", "Stocking-Glove", "Monofilament", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/peripheral-neuropathy",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive length-dependent axonopathy clinical boundaries, Guillain-Barré/diabetic foot red flags, and verified citations"],
  clinicalPearl: "Perform the 10-gram Semmes-Weinstein monofilament test annually on every diabetic patient; loss of monofilament sensation is the single strongest predictor of future foot ulceration.",
  quickFacts: {
    "Prevalence": "Present in >50% of adults with long-standing diabetes (affects >20 million people in the US alone)",
    "Primary System": "Peripheral Somatic & Autonomic Nervous System (Neurology / Endocrinology)",
    "Diagnostic Standard": "10-Gram Monofilament, 128-Hz Vibration, Lab Screen (B12, HbA1c, SPEP), & EMG/NCS",
    "Clinical Character": "Length-dependent symmetrical dying-back polyneuropathy causing stocking-glove numbness and burning pain"
  },
  aiReadiness: {
    retrievalSummary: "Peripheral Neuropathy is damage to peripheral nerves causing stocking-glove numbness, tingling, and burning pain in feet and hands, managed with supportive care, blood sugar control, vitamin B12, and daily foot checks.",
    clinicalSummary: "Peripheral Neuropathy pathophysiology involves length-dependent axonal degeneration, microvascular endoneurial ischemia, and neuro-oxidative stress. Homeopathic remedies serve as supportive neuropathic care and do not replace strict glycemic control, monofilament foot exams, or emergency hospitalization for ascending Guillain-Barré syndrome or infected diabetic foot osteomyelitis.",
    patientSummary: "Peripheral neuropathy happens when nerves in your feet and hands become damaged (most often from high blood sugar or vitamin deficiencies), causing burning pain, tingling, and numbness, requiring daily foot inspections to prevent painless injuries.",
    studentSummary: "Length-dependent distal symmetric sensorimotor polyneuropathy. Most common cause: Diabetes Mellitus. Presentation: 'stocking-glove' distribution. Test with 10g monofilament and 128Hz vibration. First-line pain agents: duloxetine, pregabalin, gabapentin. Red flags: Guillain-Barré (ascending paralysis) and infected foot ulcers.",
    keywords: ["peripheral neuropathy", "diabetic neuropathy", "numb feet and hands", "burning feet night", "stocking glove numbness", "loss of balance walking", "monofilament test"],
    semanticKeywords: ["distal symmetric polyneuropathy", "length dependent axonal degeneration", "diabetic sensorimotor neuropathy"],
    icd: "G62.9",
    mesh: "D010523",
    bodySystem: "Neurology & Endocrinology",
    urgency: "routine"
  }
};
