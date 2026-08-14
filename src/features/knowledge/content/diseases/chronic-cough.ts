import { KnowledgeEntity } from "../../types";

export const ChronicCoughDisease: KnowledgeEntity = {
  id: "D0054",
  slug: "chronic-cough",
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
    en: "Chronic Cough (Unexplained & Refractory Cough Reflex Hypersensitivity)",
    hi: "क्रॉनिक कफ / पुरानी व लगातार खांसी (Chronic Cough / Cough Hypersensitivity)",
    gu: "ક્રોનિક ઉધરસ / લાંબા સમયની જૂની ઉધરસ (Chronic Cough)",
    mr: "जुनाट खोकला / सतत येणारा कोरडा किंवा कफयुक्त खोकला (Chronic Cough)",
    es: "Tos Crónica (Hipersensibilidad del Reflejo Tusígeno)",
    ar: "السعال المزمن وفرط حساسية منعكس السعال (Chronic Cough)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Chronic Cough, covering Cough Hypersensitivity Syndrome (CHS), Upper Airway Cough Syndrome (UACS / post-nasal drip), Cough-Variant Asthma, non-acid GERD, constitutional homeopathic supportive management, and emergency red flags for massive hemoptysis, bronchogenic carcinoma, active pulmonary tuberculosis, and foreign body aspiration.",
    hi: "क्रॉनिक कफ (पुरानी लगातार खांसी) का कफ हाइपरसेंसिटिविटी सिंड्रोम पैथोलॉजी, पोस्ट-नेजल ड्रिप (UACS), कफ-वेरिएंट अस्थमा, रिफ्लक्स, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और खांसी में खून (Hemoptysis), फेफड़ों के कैंसर व टीबी की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ક્રોનિક કફ (લાંબા સમયની ઉધરસ) ની એરવે હાઇપર-રિએક્ટિવિટી પેથોલોજી, કફ વેરિઅન્ટ અસ્થમા, એસિડ રિફ્લક્સ ઉધરસ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ઉધરસમાં લોહી પડવું (હિમોપ્ટિસિસ) તથા ટીબી-કેન્સરની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "जुनाट खोकला (Chronic Cough), छातीत घरघर व घशात सतत टोचणे, अ‍ॅसिडिटी व अ‍ॅलर्जीमुळे येणारा खोकला, पारंपरिक होमिओपॅथिक पद्धत आणि खोकल्यातून रक्त पडणे (Hemoptysis) व क्षयरोगाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la tos crónica que cubre el síndrome de hipersensibilidad tusígena, goteo posnasal, asma variante, reflujo, manejo homeopático complementario y banderas rojas de hemoptisis masiva, neoplasias pulmonares y tuberculosis.",
    ar: "دليل سريري وتعليمي موثوق للسعال المزمن يغطي متلازمة فرط حساسية منعكس السعال وتناذر السعال في الطرق الهوائية العلوية والربو السعالي والرعاية التكميلية وعلامات الخطر لنفث الدم وسرطان القصبات والسل الرئوي."
  },
  content: {
    overview:
      "Chronic Cough is defined in adult clinical pulmonology as a persistent, bothersome cough lasting for more than 8 consecutive weeks (>4 weeks in pediatric populations). Rather than representing an isolated singular disease entity, chronic cough is fundamentally a neurobiological Cough Hypersensitivity Syndrome (CHS)—characterized by abnormal vagal sensory neural upregulation, low-threshold mechanical/thermal coughing (hypertussia), and throat irritation in response to non-tussive stimuli like talking or scents (allotussia). The overwhelming majority (>90%) of non-smoking adult cases with a normal chest radiograph are driven by the classic pathogenic triad: Upper Airway Cough Syndrome (UACS / post-nasal drip), Cough-Variant Asthma / Non-Asthmatic Eosinophilic Bronchitis (NAEB), and Gastroesophageal Reflux Disease (GERD / laryngopharyngeal reflux).",
    definition:
      "A cough persisting for >8 weeks in adults (>4 weeks in children) that impairs physical, social, and psychological functioning, requiring a systematic algorithmic clinical workup to identify primary anatomical triggers and neurosensory hypersensitivity.",
    causes: [
      "Upper Airway Cough Syndrome (UACS / Post-Nasal Drip): allergic rhinitis, non-allergic perennial rhinitis, or chronic rhinosinusitis with inflammatory mucus dripping onto laryngeal sensory receptors",
      "Cough-Variant Asthma and Non-Asthmatic Eosinophilic Bronchitis (NAEB): airway eosinophilic inflammation and hyperresponsiveness where chronic dry cough is the sole presenting manifestation",
      "Gastroesophageal Reflux Disease (GERD) and Laryngopharyngeal Reflux (LPR): acid or non-acid micro-aspiration and vagally-mediated esophagobronchial cough reflexes triggered by distal esophageal acid exposure",
      "Pharmacological triggers: Angiotensin-Converting Enzyme (ACE) Inhibitors (e.g., lisinopril, enalapril; causes bradykinin and substance P accumulation in airway tissues; occurs in up to 15% of users)",
      "Post-Infectious Cough (subacute cough persisting after viral tracheobronchitis, Bordetella pertussis, or Mycoplasma pneumoniae due to transient airway denudation)",
      "Neurogenic Unexplained / Refractory Chronic Cough (central and peripheral vagal sensory hypersensitivity / sensory neuropathy of the superior/recurrent laryngeal nerves)"
    ],
    riskFactors: [
      "Active cigarette smoking or chronic secondhand tobacco smoke exposure",
      "Prescription Angiotensin-Converting Enzyme (ACE) inhibitor antihypertensive therapy",
      "Atopic diathesis (allergic rhinitis, eczema, personal/family history of asthma)",
      "Female gender (females possess significantly higher cough reflex sensitivity on capsaicin challenge testing)",
      "Occupational and environmental exposures to airborne chemical fumes, dust, molds, and biomass smoke"
    ],
    symptoms: [
      "Persistent paroxysmal coughing episodes lasting >8 weeks (dry hacking, throat-clearing, or productive with clear mucoid sputum)",
      "Laryngeal paresthesia: persistent tickling, scratching, tightness, burning, or 'crumb in the throat' sensation triggering an irresistible urge to cough",
      "Allotussia: coughing triggered by innocuous non-tussive stimuli such as cold air, talking on the phone, laughing, singing, eating dry food, or breathing perfumes/chemical odors",
      "Nocturnal coughing fits awakening the patient from sleep (characteristic of asthma or severe gastroesophageal reflux)",
      "Physical complications of chronic coughing: stress urinary incontinence, rib fractures from violent spasms, subconjunctival hemorrhages, post-tussive syncope, hoarseness, and abdominal muscle soreness"
    ],
    diagnosis:
      "Evaluated via an evidence-based anatomical-diagnostic algorithm (ACCP / BTS Guidelines): (1) Chest Radiograph (CXR PA view; mandatory first-line test to rule out occult lung cancer, pneumonia, bronchiectasis, and active pulmonary tuberculosis). (2) Medication Review (discontinuing ACE inhibitors with a 4-week observation period). (3) Spirometry with Bronchodilator Reversibility and Methacholine Inhalation Challenge (evaluating for asthma / airway hyperresponsiveness). (4) Induced Sputum Eosinophil Count / Fractional Exhaled Nitric Oxide (FeNO; identifying eosinophilic airway inflammation). (5) 24-hour Ambulatory Esophageal pH-Impedance Monitoring (for refractory reflux-induced cough). (6) High-Resolution CT (HRCT) Chest and diagnostic Bronchoscopy for unexplained abnormal radiographs or alarm features.",
    differentialDiagnosis:
      "Differentiate Chronic Cough from Bronchogenic Lung Carcinoma, Pulmonary Tuberculosis (chronic cough, night sweats, hemoptysis, weight loss), Bronchiectasis (copious daily foul purulent sputum), Chronic Obstructive Pulmonary Disease (COPD / chronic bronchitis), Interstitial Lung Disease (ILD / idiopathic pulmonary fibrosis; dry velcro bibasilar crackles), Congestive Heart Failure ('cardiac asthma' with orthopnea and pedal edema), and Foreign Body Aspiration.",
    conventionalManagement:
      "Stepwise targeted therapy directed at the identified underlying etiology: (1) For UACS: intranasal corticosteroids (fluticasone) plus second-generation oral antihistamines / decongestants and nasal saline irrigations. (2) For Asthma/NAEB: inhaled corticosteroids (ICS: budesonide, fluticasone) with or without long-acting beta-agonists (LABA) or leukotriene receptor antagonists (montelukast). (3) For GERD/LPR: high-dose proton pump inhibitors (PPIs) plus dietary reflux precautions for 8–12 weeks; addition of prokinetics or baclofen for non-acid reflux. (4) For Refractory / Unexplained Neurogenic Cough: central cough neuromodulators (gabapentin, pregabalin, low-dose amitriptyline), Speech and Language Therapy (SLT; cough suppression behavioural techniques), or peripheral P2X3 receptor antagonists (gefapixant).",
    homeopathicApproach:
      "Homeopathic constitutional and respiratory remedies (such as Drosera Rotundifolia, Rumex Crispus, Spongia Tosta, Bryonia Alba, Ipecacuanha, Antimonium Tartaricum, Kali Bichromicum, Pulsatilla Nigricans, Causticum, Hepar Sulphuris) serve as supportive care to soothe laryngeal tickling, relieve spasmodic fits, and assist mucus clearance alongside chest radiograph screening, allergy management, and pulmonology evaluation.",
    lifestyleAdvice:
      "Maintain a smoke-free home environment and eliminate active tobacco smoking, practice cough suppression techniques (sip cold water, swallow hard, perform purse-lipped breathing when feeling a throat tickle), elevate the head of the bed 6 inches and avoid eating within 3 hours of sleep if reflux is present, use a cool mist room humidifier, and avoid strong chemical aerosol sprays and perfumes.",
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
        question: "Why can blood pressure medications like lisinopril cause a chronic dry cough?",
        answer: "ACE inhibitors (like lisinopril and enalapril) block the enzyme that breaks down bradykinin and substance P in the lungs. When these inflammatory peptides build up in the airway lining, they over-sensitize the cough nerves, causing a persistent dry, hacking tickle that only goes away after stopping the medication."
      },
      {
        question: "Can acid reflux cause a chronic cough even without heartburn?",
        answer: "Yes. Up to 75% of patients with reflux-induced chronic cough have 'silent reflux' (laryngopharyngeal reflux) without typical chest burning. Microscopic aerosolized acid or digestive enzymes travel up into the throat and irritate sensory cough nerves directly, or trigger a reflex spasm via the vagus nerve."
      }
    ],
    redFlags: [
      "Hemoptysis: coughing up frank blood or blood-streaked sputum (requires immediate emergency diagnostic evaluation for lung cancer, pulmonary tuberculosis, bronchiectasis, or pulmonary embolism)",
      "Systemic 'B-symptoms': rapid unexplained weight loss, drenching nocturnal sweats, and persistent low-grade fevers (suspected Bronchogenic Carcinoma, Tuberculosis, or Lymphoma)",
      "Progressive dyspnea on exertion, stridor (high-pitched inspiratory sound indicating upper airway obstruction), or dysphagia / painful swallowing (odynophagia)",
      "New or changing cough in a heavy smoker over the age of 40 (mandates urgent diagnostic Chest CT scan)",
      "Persistent hoarseness lasting >3 weeks without resolution (requires urgent ENT laryngoscopy to rule out laryngeal malignancy)"
    ]
  },
  claimCitations: [
    { claimId: "D0054-TRADITIONAL-PROFILE", statement: "Homeopathic chronic cough profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0054-TRADITIONAL-PROFILE" },
    { claimId: "D0054-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for bronchogenic carcinoma, pulmonary tuberculosis, or massive hemoptysis management.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0054-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0054-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for lung cancer, pulmonary tuberculosis, or massive hemoptysis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Coughing up frank blood (hemoptysis) requiring urgent chest CT and bronchoscopy to rule out malignancy or tuberculosis",
    "Unexplained weight loss, drenching night sweats, and persistent fevers indicating pulmonary tuberculosis or occult neoplasm",
    "New-onset stridor or progressive difficulty breathing indicating upper airway obstruction"
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
  tags: ["Chronic Cough", "Cough Hypersensitivity", "Post-Nasal Drip", "Asthma Cough", "Disease", "Hacking Cough", "Hemoptysis", "Pulmonology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/chronic-cough",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive pulmonological cough reflex clinical boundaries, hemoptysis/neoplasm red flags, and verified citations"],
  clinicalPearl: "A normal chest X-ray and non-smoking status in adult chronic cough points directly to the big three: Upper Airway Cough Syndrome, Cough-Variant Asthma, or GERD.",
  quickFacts: {
    "Clinical Definition": "Cough persisting for >8 weeks in adults (>4 weeks in children)",
    "Primary System": "Respiratory System & Vagal Sensory Neurobiology (Pulmonology / Allergy)",
    "Diagnostic Standard": "Chest Radiograph (CXR), Spirometry / FeNO, & Systematic Algorithmic Workup",
    "Clinical Character": "Neurobiological cough reflex hypersensitivity driven by rhinosinusitis, asthma, or gastroesophageal reflux"
  },
  aiReadiness: {
    retrievalSummary: "Chronic Cough is a cough lasting >8 weeks driven by cough hypersensitivity, post-nasal drip, asthma, or reflux, managed with supportive care, targeted respiratory therapy, and mandatory chest X-ray screening.",
    clinicalSummary: "Chronic Cough pathophysiology involves vagal sensory neurohypersensitivity (CHS) triggered by upper airway post-nasal drip, eosinophilic asthma, or GERD. Homeopathic remedies serve as supportive respiratory care and do not replace mandatory chest radiographs, spirometry, or emergency care for massive hemoptysis, lung carcinoma, or pulmonary tuberculosis.",
    patientSummary: "Chronic cough is a persistent cough lasting more than 8 weeks, most commonly caused by allergies, post-nasal drip, asthma, or acid reflux, requiring a chest X-ray to ensure the lungs are clear.",
    studentSummary: "Adult chronic cough (>8 weeks) with normal CXR is most commonly due to UACS, cough-variant asthma, or GERD. Discontinue ACE inhibitors. Red flags: hemoptysis, night sweats, weight loss (TB/malignancy), and hoarseness >3 weeks.",
    keywords: ["chronic cough", "persistent cough", "cough reflex hypersensitivity", "post nasal drip cough", "asthma cough", "gerd cough", "coughing up blood"],
    semanticKeywords: ["cough hypersensitivity syndrome", "upper airway cough syndrome", "non asthmatic eosinophilic bronchitis"],
    icd: "R05.3",
    mesh: "D003371",
    bodySystem: "Pulmonology & Respiratory Medicine",
    urgency: "routine"
  }
};
