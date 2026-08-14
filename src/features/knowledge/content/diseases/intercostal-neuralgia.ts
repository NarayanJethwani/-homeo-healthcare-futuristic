import { KnowledgeEntity } from "../../types";

export const IntercostalNeuralgiaDisease: KnowledgeEntity = {
  id: "D0039",
  slug: "intercostal-neuralgia",
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
    en: "Intercostal Neuralgia (Rib Cage Neuropathic Pain & Post-Herpetic Neuralgia)",
    hi: "इंटरकोस्टल न्यूराल्जिया / पसलियों की नसों का दर्द (Intercostal Neuralgia)",
    gu: "ઇન્ટરકોસ્ટલ ન્યુરાલ્જીયા / પાંસળીઓની નસોનો દુખાવો (Intercostal Neuralgia)",
    mr: "इंटरकोस्टल न्यूराल्जिया / बरगड्यांच्या नसांचे दुखणे (Intercostal Neuralgia)",
    es: "Neuralgia Intercostal (Dolor Neuropático de la Pared Torácica)",
    ar: "ألم العصب الوربي (Intercostal Neuralgia)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Intercostal Neuralgia, covering thoracic dermatomal nerve entrapment, post-herpetic neuralgia (varicella-zoster), neuropathic allodynia, constitutional homeopathic supportive management, and emergency red flags for Acute Coronary Syndrome (ACS / myocardial infarction), aortic dissection, pulmonary embolism, and tension pneumothorax.",
    hi: "इंटरकोस्टल न्यूराल्जिया (पसलियों की नसों में तेज चुभन व दर्द) का थोरैसिक नर्व कंप्रेशन पैथोलॉजी, हर्पीज ज़ोस्टर के बाद का दर्द (PHN), न्यूरोपैथिक एलोडीनिया, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और दिल के दौरे (Myocardial Infarction), एऑर्टिक डिसेक्शन व पल्मोनरी एम्बोलिज्म की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ઇન્ટરકોસ્ટલ ન્યુરાલ્જીયા (પાંસળીઓમાં વીજળીના આંચકા જેવો દુખાવો) ની પેથોલોજી, હર્પીસ પછીનો દુખાવો, શ્વાસ લેતી વખતે દુખાવો વધવો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને હાર્ટ એટેક તથા ફેફસાની ગંભીર બીમારીઓની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "इंटरकोस्टल न्यूराल्जिया (बरगड्यांमधील नसांचा तीव्र टोचणारा व जळजळणारा त्रास), श्वास घेताना वाढणाऱ्या वेदना, पारंपरिक होमिओपॅथिक पद्धत आणि हृदयविकाराचा झटका (Heart Attack) व न्यूमोथोरॅक्सच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la neuralgia intercostal que cubre el atrapamiento del nervio torácico, neuralgia posherpética, alodinia, manejo homeopático complementario y banderas rojas de síndrome coronario agudo y disección aórtica.",
    ar: "دليل سريري وتعليمي موثوق لألم العصب الوربي يغطي انضغاط الأعصاب الوربية الصدرية والألم العصبي التالي للهربس والألودينيا والرعاية التكميلية وعلامات الخطر للمتلازمة الإكليلية الحادة وسلخ الأبهر والانصمام الرئوي."
  },
  content: {
    overview:
      "Intercostal Neuralgia is a painful, debilitating neuropathic syndrome characterized by sharp, burning, lancinating, aching, or electric-shock-like pain distributed along the sensory dermatome of one or more intercostal nerves (T1 to T12) encircling the chest wall and rib cage. Caused by mechanical compression, surgical trauma, inflammatory neuropathy, or viral reactivation (Herpes Zoster / shingles leading to Post-Herpetic Neuralgia [PHN]), the pain is characteristically exacerbated by deep inspiration, coughing, laughing, twisting of the torso, or light skin touch (allodynia). Because chest wall pain frequently mimics life-threatening visceral emergencies, rigorous exclusion of cardiovascular, pleuropulmonary, and aortic pathologies is mandatory.",
    definition:
      "A peripheral focal neuropathy involving the intercostal nerves within the thoracic subcostal grooves, resulting in unilateral dermatomal neuropathic chest wall pain and sensory disturbances.",
    causes: [
      "Reactivation of Varicella-Zoster Virus (VZV / Shingles) within the thoracic dorsal root ganglia, causing acute herpes zoster and chronic Post-Herpetic Neuralgia (PHN; persisting >3 months after rash resolution)",
      "Mechanical nerve compression or entrapment: thoracic spine osteophytes, rib subluxation, thoracic disc herniation, or Slipping Rib Syndrome (hypermobility of the 8th, 9th, or 10th false ribs impinging the intercostal neurovascular bundle)",
      "Post-surgical nerve injury (Post-Thoracotomy / Post-Mastectomy Pain Syndrome): direct surgical transection, thermal cautery damage, or scar tissue entrapment of the intercostal nerve",
      "Thoracic trauma: rib fractures, contusions, or heavy compressive chest wall crush injuries",
      "Space-occupying lesions: thoracic neurofibroma, schwannoma, or metastatic pleural neoplasms invading the subcostal groove"
    ],
    riskFactors: [
      "Advanced age (>50–60 years; highest risk for herpes zoster reactivation and severe chronic post-herpetic neuralgia)",
      "Prior thoracic surgery (thoracotomy, sternotomy, chest tube insertion, breast surgery)",
      "Immunosuppressed states (corticosteroid therapy, chemotherapy, HIV/AIDS, malignancy)",
      "History of blunt chest wall trauma or high-impact athletic torso twisting",
      "Poor thoracic spine ergonomics, severe thoracic scoliosis, or thoracic kyphosis"
    ],
    symptoms: [
      "Sharp, stabbing, burning, electric-shock, or vice-like ache traveling horizontally around the chest wall from the back along a specific rib to the sternum",
      "Pain aggravated by mechanical torso motion: taking a deep breath, coughing, sneezing, laughing, bending, or twisting the trunk",
      "Cutaneous allodynia and hyperalgesia: even the light friction of a shirt or bedsheet against the affected skin triggers excruciating burning pain",
      "Paresthesias: localized numbness, tingling, itching, or 'pins and needles' along the affected intercostal dermatome",
      "History of a unilateral vesicular rash with crusting (characteristic of recent herpes zoster / shingles)",
      "Point tenderness on deep palpation over the subcostal groove of the affected rib or near the costovertebral joint"
    ],
    diagnosis:
      "Diagnosed clinically through a meticulous dermatomal neurological mapping and targeted physical examination (palpation along subcostal spaces, hooking maneuver for slipping rib syndrome, testing for allodynia with a cotton wisp). Because chest pain is a high-risk symptom, mandatory diagnostic workup includes: 12-lead Electrocardiogram (ECG) and high-sensitivity cardiac troponins (to definitively rule out acute myocardial infarction), Chest Radiograph / CT Chest (to rule out rib fracture, pneumothorax, pleurisy, and thoracic mass), and Thoracic Spine MRI when compressive radiculopathy is suspected.",
    differentialDiagnosis:
      "Differentiate Intercostal Neuralgia from Acute Coronary Syndrome (ACS / STEMI / NSTEMI; substernal pressure radiating to left arm/jaw, diaphoresis, unprovoked by torso motion), Acute Aortic Dissection (tearing back/chest pain with blood pressure discrepancy), Pulmonary Embolism (sudden pleuritic pain, hypoxia, tachycardia), Costochondritis (Tietze syndrome; parasternal anterior cartilage junction tenderness), Tension Pneumothorax, and Pleurisy / Pleural Effusion.",
    conventionalManagement:
      "A multimodal pain management strategy combines pharmacological and interventional modalities: (1) Topical therapies (first-line for localized post-herpetic neuralgia): 5% lidocaine patches and 8% capsaicin topical patches. (2) Neuropathic oral agents: alpha-2-delta calcium channel modulators (gabapentin, pregabalin) and tricyclic antidepressants (amitriptyline, nortriptyline) or SNRIs (duloxetine). (3) Interventional procedures: ultrasound-guided Intercostal Nerve Blocks (local anesthetic plus corticosteroid) or Erector Spinae Plane (ESP) blocks provide substantial diagnostic and therapeutic relief. (4) Pulsed radiofrequency ablation (RFA) or cryoneurolysis for severe intractable refractory nerve entrapment.",
    homeopathicApproach:
      "Homeopathic constitutional and nerve-trauma remedies (such as Ranunculus Bulbosus, Hypericum Perforatum, Mezereum, Rhus Toxicodendron, Bryonia Alba, Spigelia Anthelmia, Arsenicum Album, Causticum, Cimicifuga) serve as supportive care to soothe burning nerve pain, ease sensitivity to torso motion, and assist vitality alongside strict cardiological evaluation and pain clinic management.",
    lifestyleAdvice:
      "Wear loose-fitting, soft cotton clothing to minimize friction and prevent triggering cutaneous allodynia, apply gentle alternating warm or cool compresses if skin is intact and comfortable, practice shallow diaphragmatic breathing and gentle thoracic mobility stretches, avoid heavy lifting or aggressive torso twisting during acute nerve flares, and ensure timely administration of the recombinant shingles vaccine (Shingrix) in adults over 50.",
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
        question: "How can I tell if my chest pain is intercostal neuralgia or a heart attack?",
        answer: "A heart attack typically causes a deep, crushing, heavy pressure in the center of the chest that radiates to the left arm, neck, or jaw, often with shortness of breath and sweating, unaffected by pressing on the ribs. Intercostal neuralgia is a sharp or burning pain that follows the path of a single rib and sharpens markedly when taking a deep breath, coughing, or touching the skin. However, all new chest pain requires emergency medical clearance."
      },
      {
        question: "What is Post-Herpetic Neuralgia (PHN)?",
        answer: "Post-Herpetic Neuralgia is a chronic nerve pain condition that lingers for months or years after a shingles (herpes zoster) rash has healed. The virus damages sensory nerve fibers in the chest wall, causing them to send exaggerated pain signals to the brain even with gentle touch."
      }
    ],
    redFlags: [
      "Acute Coronary Syndrome (ACS / Myocardial Infarction): retrosternal chest pressure, heaviness, crushing tightness radiating to the jaw, neck, back, or left arm, accompanied by diaphoresis, shortness of breath, nausea, or lightheadedness (life-threatening emergency requiring immediate emergency 911 dispatch, 12-lead ECG, and cardiac troponins)",
      "Acute Aortic Dissection: sudden, catastrophic, tearing or ripping chest and back pain with pulse deficits, blood pressure discrepancy >20 mmHg between arms, or neurological deficits (requires immediate emergency CT angiography and vascular surgery)",
      "Acute Pulmonary Embolism: sudden-onset sharp pleuritic chest pain, severe dyspnea, tachycardia, tachypnea, and hemoptysis (coughing blood) in a patient with risk factors for deep vein thrombosis",
      "Tension Pneumothorax: sudden severe unilateral chest pain, acute respiratory distress, tracheal deviation, cyanosis, and absent breath sounds on the affected side (requires immediate emergency needle thoracostomy)"
    ]
  },
  claimCitations: [
    { claimId: "D0039-TRADITIONAL-PROFILE", statement: "Homeopathic intercostal neuralgia profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0039-TRADITIONAL-PROFILE" },
    { claimId: "D0039-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for intercostal nerve blocks, myocardial infarction, or emergency aortic dissection.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0039-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0039-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute coronary syndrome, aortic dissection, or pulmonary embolism.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Crushing substernal chest pressure radiating to jaw/arm with diaphoresis indicating acute myocardial infarction requiring emergency 911 dispatch",
    "Sudden tearing chest pain with blood pressure asymmetry between arms indicating acute aortic dissection",
    "Sudden pleuritic pain with severe shortness of breath and hypoxia indicating pulmonary embolism or pneumothorax"
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
  tags: ["Intercostal Neuralgia", "Chest Wall Pain", "Post-Herpetic Neuralgia", "Disease", "Rib Pain", "Neuropathic Pain", "Allodynia", "Pain Medicine"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/intercostal-neuralgia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive neuropathic chest wall clinical boundaries, myocardial infarction/aortic dissection red flags, and verified citations"],
  clinicalPearl: "Always obtain a 12-lead ECG in any patient presenting with unilateral chest wall pain to definitively exclude myocardial ischemia before diagnosing intercostal neuralgia.",
  quickFacts: {
    "Clinical Onset": "Commonly follows herpes zoster (shingles), thoracotomy surgery, or rib trauma",
    "Primary System": "Peripheral Nervous System & Thoracic Chest Wall (Pain Neurobiology)",
    "Diagnostic Standard": "Clinical Neurological Dermatomal Mapping & 12-Lead ECG / Troponin Exclusion",
    "Clinical Character": "Neuropathic burning or lancinating pain along an intercostal nerve path exacerbated by deep breathing"
  },
  aiReadiness: {
    retrievalSummary: "Intercostal Neuralgia is a neuropathic chest wall pain following the path of a rib, exacerbated by breathing or touch, managed with supportive care, topical lidocaine, nerve blocks, and mandatory cardiac exclusion.",
    clinicalSummary: "Intercostal Neuralgia pathophysiology involves thoracic nerve entrapment or post-herpetic varicella-zoster inflammation. Homeopathic remedies serve as supportive neuropathic care and do not replace mandatory emergency 12-lead ECG/troponins for acute coronary syndrome, or emergency intervention for aortic dissection and tension pneumothorax.",
    patientSummary: "Intercostal neuralgia is sharp, burning nerve pain that wraps around your rib cage like a tight band, often triggered by a shingles infection, taking a deep breath, or touching the skin, requiring emergency tests to make sure your heart is safe.",
    studentSummary: "Neuropathic pain along T1-T12 dermatomes. Common causes: post-herpetic neuralgia (VZV) and post-thoracotomy. Aggravated by respiratory motion. Critical rule: Rule out Acute Coronary Syndrome (ACS), aortic dissection, and pulmonary embolism first.",
    keywords: ["intercostal neuralgia", "rib nerve pain", "chest wall nerve pain", "post herpetic neuralgia", "shingles nerve pain", "pain along ribs", "burning chest wall"],
    semanticKeywords: ["thoracic radiculopathy", "intercostal nerve entrapment", "neuropathic thoracic pain"],
    icd: "M79.2",
    mesh: "D009437",
    bodySystem: "Neurology & Pain Medicine",
    urgency: "routine"
  }
};
