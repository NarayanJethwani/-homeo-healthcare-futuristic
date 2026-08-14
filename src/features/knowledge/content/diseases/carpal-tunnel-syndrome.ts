import { KnowledgeEntity } from "../../types";

export const CarpalTunnelSyndromeDisease: KnowledgeEntity = {
  id: "D0042",
  slug: "carpal-tunnel-syndrome",
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
    en: "Carpal Tunnel Syndrome (Median Nerve Entrapment Neuropathy / CTS)",
    hi: "कार्पल टनल सिंड्रोम / कलाई व हाथ की नसों का दर्द (Carpal Tunnel Syndrome)",
    gu: "કાર્પલ ટનલ સિન્ડ્રોમ / કાંડા અને આંગળીઓની નસ દબાવવી (CTS)",
    mr: "कार्पल टनेल सिंड्रोम / हाताच्या बोटांना मुंग्या येणे (Carpal Tunnel Syndrome)",
    es: "Síndrome del Túnel Carpiano (Neuropatía por Atrapamiento del Nervio Mediano)",
    ar: "متلازمة النفق الرسغي (Carpal Tunnel Syndrome)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Carpal Tunnel Syndrome (CTS), covering median nerve compression beneath the transverse carpal ligament, tenosynovial hypertrophy, nocturnal paresthesias, thenar atrophy, constitutional homeopathic supportive management, and emergency red flags for acute wrist compartment syndrome and irreversible motor denervation.",
    hi: "कार्पल टनल सिंड्रोम (कलाई में मीडियन नर्व कंप्रेशन) का ट्रांसवर्स कार्पल लिगामेंट पैथोलॉजी, रात में हाथों में झुनझुनी व सुन्नपन, थिनार मांसपेशियों की कमजोरी, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और एक्यूट कंपार्टमेंट सिंड्रोम की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "કાર્પલ ટનલ સિન્ડ્રોમ (કાંડામાં મિડિયન ચેતાનું દબાણ) ની પેથોલોજી, રાત્રે આંગળીઓમાં ઝણઝણાટી અને બળતરા, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સ્નાયુઓ સુકાઈ જવાની (થેનાર એટ્રોફી) ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "कार्पल टनेल सिंड्रोम (CTS), मनगटातील मीडियन नस दाबल्याने बोटांना मुंग्या व बधिरता येणे, पारंपरिक होमिओपॅथिक पद्धत आणि नसांच्या कायमस्वरूपी नुकसानीच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del síndrome del túnel carpiano que cubre el atrapamiento del nervio mediano, parestesias nocturnas, atrofia tenar, manejo homeopático complementario y banderas rojas de síndrome compartimental.",
    ar: "دليل سريري وتعليمي موثوق لمتلازمة النفق الرسغي يغطي انضغاط العصب المتوسط وخدر الأصابع الليلي وضمور عضلات ضرة الإبهام والرعاية التكميلية وعلامات الخطر لمتلازمة الحيز الحادة وفقدان التعصيب العضلي."
  },
  content: {
    overview:
      "Carpal Tunnel Syndrome (CTS) is the most common entrapment focal neuropathy of the upper extremity, caused by elevated interstitial fluid pressure and mechanical compression of the median nerve as it courses beneath the inextensible flexor retinaculum (transverse carpal ligament) in the fibro-osseous carpal tunnel of the wrist. It characteristically presents with nocturnal paresthesias ('pins and needles'), numbness, burning pain, and sensory loss in the median nerve sensory distribution (palmar aspect of the thumb, index finger, middle finger, and radial half of the ring finger), progressing in advanced stages to thenar muscle weakness, atrophy, and loss of hand grip/pinch dexterity.",
    definition:
      "A compressive focal mononeuropathy of the median nerve within the carpal canal at the wrist leading to chronic microvascular ischemia, focal demyelination, and axonal loss.",
    causes: [
      "Elevated hydrostatic carpal tunnel pressure (>30 mmHg compared to normal <10 mmHg) resulting from repetitive wrist flexion/extension, sustained power gripping, or vibratory hand-arm tool use",
      "Flexor tenosynovial proliferation and inflammatory thickening around the nine digital flexor tendons traversing the carpal tunnel",
      "Anatomical space-occupying lesions: ganglion cysts, lipomas, aberrant muscle bellies, or displaced distal radius fractures (Colles fracture)",
      "Systemic fluid retention and metabolic disorders: pregnancy (third trimester fluid overload), hypothyroidism (glycosaminoglycan mucinous edema), diabetes mellitus (increased nerve vulnerability to pressure), rheumatoid arthritis tenosynovitis, and chronic renal failure with amyloidosis"
    ],
    riskFactors: [
      "Female gender (prevalence 3 times higher in women due to anatomically smaller carpal canal volume)",
      "Occupational biomechanical strain: assembly line workers, keyboard typists, meatpackers, musicians, dental hygienists",
      "High Body Mass Index (BMI \u226530; increases carpal canal fat deposition and hydrostatic pressure)",
      "Third trimester pregnancy and perimenopause",
      "Comorbid metabolic conditions (diabetes mellitus, thyroid disease, inflammatory arthritis, acromegaly)"
    ],
    symptoms: [
      "Nocturnal dysesthesias: waking from sleep with painful tingling, numbness, and burning in the thumb, index, middle, and radial half of the ring finger (sparing the small 5th finger)",
      "'Flick sign': relief of paresthesias upon vigorously shaking or flicking the wrist and hands",
      "Loss of fine motor dexterity: clumsiness, difficulty buttoning shirts, turning keys, tying shoelaces, or dropping coffee cups",
      "Retrograde radiating pain traveling proximally from the wrist up the forearm toward the elbow and shoulder",
      "Thenar atrophy: flattening and wasting of the abductor pollicis brevis (APB) muscle at the base of the thumb in advanced chronic compression"
    ],
    diagnosis:
      "Diagnosed clinically using provocative physical examination maneuvers: Phalen's wrist flexion test (reproducing paresthesias within 60 seconds), Tinel's percussion sign (electric shock tingling on tapping over the volar wrist), and Durkan's carpal compression test (direct thumb pressure over carpal tunnel). Electrodiagnostic Studies (Electromyography / Nerve Conduction Studies [EMG/NCS]) are the definitive gold standard confirming focal median motor and sensory conduction slowing across the wrist segment. High-resolution wrist ultrasound demonstrates median nerve cross-sectional area (CSA \u226510 mm^2 at the inlet).",
    differentialDiagnosis:
      "Differentiate Carpal Tunnel Syndrome from Cervical Radiculopathy (C6/C7 nerve root compression; associated with neck pain and positive Spurling's test), Pronator Teres Syndrome (median nerve compression in the proximal forearm; includes palmar cutaneous branch numbness), Thoracic Outlet Syndrome, Diabetic Peripheral Polyneuropathy (bilateral stocking-glove sensory loss), and De Quervain's Tenosynovitis (positive Finkelstein's test over the radial styloid).",
    conventionalManagement:
      "Conservative therapy is first-line for mild to moderate CTS: rigid neutral-angle volar wrist splinting worn nightly for 6 to 12 weeks, ergonomic workstation modifications, activity pacing, and ultrasound-guided local corticosteroid injections into the carpal canal for short-term symptom relief. Surgical Carpal Tunnel Release (CTR; open or endoscopic division of the transverse carpal ligament) is the definitive curative standard for severe disease, progressive thenar muscle atrophy, or failure of conservative therapy.",
    homeopathicApproach:
      "Homeopathic constitutional and repetitive-strain remedies (such as Ruta Graveolens, Hypericum Perforatum, Rhus Toxicodendron, Causticum, Calcarea Fluorica, Plumbum Metallicum, Arnica Montana, Viola Odorata) serve as supportive care to ease tendon tightness, relieve nocturnal nerve tingling, and support connective tissue vitality alongside nightly neutral wrist splints and ergonomic physical therapy.",
    lifestyleAdvice:
      "Wear rigid neutral wrist splints every night while sleeping (prevents extreme nocturnal wrist flexion), adjust computer keyboards and mouse setups to maintain wrists in a straight neutral posture, take frequent 2-minute micro-breaks during prolonged repetitive keyboarding or hand tool use, perform gentle median nerve gliding exercises daily, and avoid resting wrists directly on hard desk edges.",
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
        question: "Why does carpal tunnel syndrome spare the pinky (little finger)?",
        answer: "The carpal tunnel carries only the median nerve, which supplies sensation to the thumb, index, middle, and half of the ring finger. The little finger (and the outer half of the ring finger) is innervated by the ulnar nerve, which runs outside the carpal tunnel through Guyon's canal."
      },
      {
        question: "Why are carpal tunnel symptoms usually worse at night?",
        answer: "During sleep, people naturally curl their wrists into extreme flexion, which dramatically spikes fluid pressure inside the carpal tunnel. Additionally, fluid redistribution while lying flat increases tissue edema in the wrist."
      }
    ],
    redFlags: [
      "Acute Carpal Tunnel Syndrome: rapid-onset, agonizing wrist/hand pain, tense swelling, and complete median sensory loss following acute wrist trauma, distal radius fracture, or acute wrist infection/hematoma (surgical emergency indicating acute compartment syndrome requiring immediate emergency surgical decompression)",
      "Visible thenar muscle atrophy with severe weakness in thumb abduction and opposition (dropping objects frequently; indicates advanced axonal loss requiring urgent surgical carpal tunnel release to prevent permanent motor paralysis)",
      "Rapidly ascending hand and forearm swelling accompanied by high fever and skin erythema (suspected deep space tenosynovial infection or necrotizing soft tissue infection)"
    ]
  },
  claimCitations: [
    { claimId: "D0042-TRADITIONAL-PROFILE", statement: "Homeopathic carpal tunnel profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0042-TRADITIONAL-PROFILE" },
    { claimId: "D0042-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for ligament release surgery, thenar denervation, or acute compartment syndrome.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0042-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0042-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute wrist compartment syndrome, thenar atrophy, or surgical nerve release.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Rapid-onset severe wrist pain and complete median nerve numbness following trauma indicating acute compartment syndrome requiring emergency surgical release",
    "Visible thenar muscle wasting and persistent motor weakness requiring urgent neurosurgical/orthopedic evaluation",
    "Purulent tenosynovial swelling with high fever requiring emergency surgical drainage"
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
  tags: ["Carpal Tunnel Syndrome", "CTS", "Median Nerve", "Disease", "Numbness Fingers", "Night Tingling", "Wrist Pain", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/carpal-tunnel-syndrome",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive median nerve entrapment clinical boundaries, compartment syndrome red flags, and verified citations"],
  clinicalPearl: "Tingling that spares the little finger (5th digit) is the hallmark physical exam clue pointing directly to median nerve entrapment at the carpal tunnel.",
  quickFacts: {
    "Lifetime Risk": "Estimated at approximately 10% in the general adult population",
    "Primary System": "Peripheral Nervous System & Musculoskeletal System (Wrist / Hand)",
    "Diagnostic Standard": "Clinical Provocative Tests (Phalen/Durkan) & Electromyography / NCS",
    "Clinical Character": "Compressive focal neuropathy of the median nerve producing nocturnal paresthesias and thenar motor weakness"
  },
  aiReadiness: {
    retrievalSummary: "Carpal Tunnel Syndrome is an entrapment neuropathy of the median nerve at the wrist causing nocturnal finger numbness, tingling, and grip weakness, managed with supportive care, nocturnal splinting, and orthopedic evaluation.",
    clinicalSummary: "CTS pathophysiology involves elevated carpal canal pressure, flexor tenosynovial hypertrophy, and median nerve ischemia. Homeopathic remedies serve as supportive care and do not replace nocturnal neutral splinting, electrodiagnostic testing (EMG/NCS), or surgical release for severe thenar muscle atrophy or acute compartment syndrome.",
    patientSummary: "Carpal tunnel syndrome happens when the main nerve through your wrist gets squeezed, causing waking up at night with tingling and numbness in your thumb and middle fingers, relieved by shaking your hand and wearing a wrist brace at night.",
    studentSummary: "Compression of the median nerve under the transverse carpal ligament. Symptoms spare the 5th digit. Positive Phalen's and Durkan's tests. EMG/NCS confirms diagnosis. Red flag: Thenar muscle atrophy (abductor pollicis brevis wasting).",
    keywords: ["carpal tunnel syndrome", "cts", "median nerve compression", "numb fingers", "hand tingling night", "thenar atrophy", "phalen test"],
    semanticKeywords: ["entrapment neuropathy", "transverse carpal ligament", "median nerve ischemia"],
    icd: "G56.00",
    mesh: "D002349",
    bodySystem: "Neurology & Orthopedics",
    urgency: "routine"
  }
};
