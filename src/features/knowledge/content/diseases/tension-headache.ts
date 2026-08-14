import { KnowledgeEntity } from "../../types";

export const TensionHeadacheDisease: KnowledgeEntity = {
  id: "D0063",
  slug: "tension-headache",
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
    en: "Tension-Type Headache (TTH / Stress & Pericranial Myofascial Headache)",
    hi: "तनाव सिरदर्द / टेंशन हेडेक (Tension-Type Headache / TTH)",
    gu: "ટેન્શન હેડેક / માથામાં પટ્ટી જેવું ભારેપણું અને દુખાવો (Tension Headache)",
    mr: "ताणतणावामुळे होणारी डोकेदुखी / टेन्शन हेडेक (Tension Headache)",
    es: "Cefalea Tensional (Dolor de Cabeza por Tensión / Cefalea Miofascial)",
    ar: "صداع التوتر والصداع الليفي العضلي (Tension-Type Headache)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Tension-Type Headache (TTH), covering pericranial myofascial nociception, central sensitization of spinal trigeminal neurons, bilateral non-pulsatile band-like pressure, constitutional homeopathic supportive management, and emergency red flags for subarachnoid hemorrhage (thunderclap headache), bacterial meningitis, acute angle-closure glaucoma, and giant cell arteritis.",
    hi: "टेंशन-टाइप सिरदर्द (तनाव व मांसपेशियों का सिरदर्द) का पेरिक्रेनियल मायोफेशियल टेंडरनेस पैथोलॉजी, सेंट्रल सेंसिटाइजेशन, माथे पर कसकर पट्टी बंधने जैसा भारी दबाव, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सबएरेकनॉइड हेमरेज (Thunderclap Headache), मेनिनजाइटिस व जाइंट सेल आर्टेराइटिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ટેન્શન હેડેક (તણાવ માથાનો દુખાવો) ની પેથોલોજી, માથા અને ગરદનના સ્નાયુઓનો ખેંચાણ, બંને બાજુ દબાણ જેવો દુખાવો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને બ્રેઇન હેમરેજ તથા મેનિન્જાઇટિસની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "टेन्शन-टाईप डोकेदुखी (TTH), डोक्यात घट्ट पट्टा बांधल्यासारखे वाटणे, मान व डोक्याच्या स्नायूंचा ताण, पारंपरिक होमिओपॅथिक पद्धत आणि ब्रेन हॅमरेज (Subarachnoid Hemorrhage) व मेंदुज्वराच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la cefalea tensional que cubre la nocicepción miofascial pericraneal, sensibilización central, dolor en banda no pulsátil, manejo homeopático complementario y banderas rojas de hemorragia subaracnoidea y arteritis de células gigantes.",
    ar: "دليل سريري وتعليمي موثوق لصداع التوتر يغطي التحسس الليفي العضلي حول القحف والتحسس المركزي والألم الضاغط غير النابض كالطوق والرعاية التكميلية وعلامات الخطر للنزف تحت العنكبوتية والتهاب السحايا."
  },
  content: {
    overview:
      "Tension-Type Headache (TTH) is the most prevalent primary headache disorder worldwide, affecting up to 70% to 80% of the global population at some point in their lives. Classified by the International Classification of Headache Disorders (ICHD-3) into infrequent episodic, frequent episodic, and chronic forms, it is characterized by recurrent bilateral, non-pulsatile, dull, aching, pressing, or tightening pain of mild to moderate intensity, classically described by patients as a 'tight vice, rubber band, or heavy helmet squeezing around the forehead and temples'. Driven by increased pericranial myofascial sensitivity and secondary central pain sensitization within the trigeminal spinal nucleus, TTH is notably distinct from migraine by the absence of severe throbbing, absence of vomiting, and lack of aggravation from routine physical activity.",
    definition:
      "A primary headache disorder defined by the ICHD-3 criteria as recurrent episodes of bilateral, non-pulsatile, pressing/tightening headache of mild-to-moderate intensity lasting 30 minutes to 7 days, unaccompanied by nausea or vomiting, and not aggravated by routine physical activity.",
    causes: [
      "Pericranial myofascial nociception: sustained involuntary isometric contraction, ischemia, and localized release of inflammatory algogenic substances (substance P, bradykinin, CGRP) within the muscles and tendon insertions of the head, neck, and shoulders (frontalis, temporalis, masseter, trapezius, splenius capitis)",
      "Central pain sensitization: prolonged nociceptive input from tender pericranial muscles causes neuroplastic hyperexcitability of second-order neurons in the trigeminal spinal nucleus (caudalis) and impaired descending pain inhibitory pathways in the brainstem",
      "Psychosocial stress and emotional strain: chronic mental stress activates the hypothalamic-pituitary-adrenal (HPA) axis and sympathetic nervous system, lowering pain thresholds",
      "Poor ergonomics and musculoskeletal strain: prolonged forward-head posture ('tech neck') during computer or smartphone use, cervical spine misalignment, and temporomandibular joint (TMJ) clenching/bruxism",
      "Sleep deprivation, irregular meals, dehydration, and ocular refractive fatigue"
    ],
    riskFactors: [
      "High psychological stress, occupational burnout, anxiety, and depressive disorders",
      "Female gender (slightly higher prevalence in women, ratio 1.2:1 to 1.5:1)",
      "Prolonged sedentary desk work with poor cervical ergonomics and forward head tilt",
      "Nocturnal teeth grinding (bruxism) or jaw clenching (TMJ dysfunction)",
      "Medication Overuse: frequent use of over-the-counter analgesics (>10–15 days per month) transforming episodic TTH into chronic daily Medication Overuse Headache (MOH)"
    ],
    symptoms: [
      "Bilateral, symmetric, continuous pain distributed across the frontal, temporal, parietal, or occipital regions of the head",
      "Quality of pain: dull, pressing, tightening, non-pulsatile ache ('tight vice, headband, or heavy weight pressing on top of the head')",
      "Mild to moderate intensity: typically does not prevent patients from performing normal daily activities, though it impairs productivity",
      "Duration: lasting from 30 minutes up to several continuous days (in episodic TTH) or unremitting for months (in chronic TTH)",
      "Palpation tenderness: prominent manual tenderness on palpating pericranial muscles (temporalis, masseter, trapezius, suboccipital insertions)",
      "Absence of cardinal migraine features: no vomiting, no severe unilateral pulsating throbbing, and either photophobia OR phonophobia may be present, but NOT both"
    ],
    diagnosis:
      "Diagnosed clinically strictly using the ICHD-3 diagnostic criteria: requiring (1) at least 10 episodes occurring on <1 day/month (infrequent), 1–14 days/month (frequent), or \u226515 days/month for >3 months (chronic), (2) lasting 30 minutes to 7 days, (3) possessing \u22652 of: bilateral location, pressing/tightening quality, mild/moderate intensity, not aggravated by routine walking/climbing stairs, and (4) no nausea/vomiting and no more than one of photophobia or phonophobia. Neuroimaging (MRI / CT Brain) is NOT indicated in typical presentations with a normal neurological exam, but is mandatory when red flag features (SNOOP mnemonic) are identified.",
    differentialDiagnosis:
      "Differentiate Tension-Type Headache from Migraine without Aura (unilateral, pulsating, moderate-to-severe, aggravated by physical activity, accompanied by nausea/vomiting and both photophobia/phonophobia), Medication Overuse Headache (MOH), Cervicogenic Headache (unilateral pain arising from cervical spine structures with neck motion limitation), Temporomandibular Joint Disorder (TMJD), Giant Cell Arteritis (elderly, temporal artery tenderness, elevated ESR), Chronic Sinusitis, and Secondary Structural Intracranial Lesions.",
    conventionalManagement:
      "A combined approach encompassing acute rescue relief, preventive pharmacotherapy, and behavioral lifestyle interventions: (1) Acute treatment: simple analgesics (acetaminophen / paracetamol 1000 mg, ibuprofen 400 mg, naproxen 500 mg, or aspirin) taken early in the attack. Combination analgesics containing caffeine are effective but carry high risk of Medication Overuse Headache (limit acute medication use to <2 days per week / <10 days per month). (2) Preventive prophylactic pharmacotherapy (indicated for chronic or frequent episodic TTH with significant disability): low-dose Tricyclic Antidepressants (Amitriptyline 10–50 mg at bedtime is the undisputed first-line evidence-based preventive agent; nortriptyline or mirtazapine as alternatives). (3) Non-pharmacological therapies: Cognitive Behavioral Therapy (CBT), electromyographic (EMG) biofeedback, physical therapy (cervical and postural muscle stretching/strengthening), acupuncture, and trigger point dry needling.",
    homeopathicApproach:
      "Homeopathic constitutional and tension-relieving remedies (such as Gelsemium Sempervirens, Bryonia Alba, Belladonna, Nux Vomica, Kali Phosphoricum, Cimicifuga Racemosa, Natrum Muriaticum, Silicea, Spigelia, Ignatia Amara) serve as supportive care to ease pericranial muscle tightness, soothe stress hyperarousal, and support vitality alongside ergonomic adjustments, stress reduction, and headache diary tracking.",
    lifestyleAdvice:
      "Optimize workstation ergonomics (ensure computer monitors are at eye level to prevent forward head posture), take 2-minute posture-reset breaks every hour of desk work, practice progressive muscle relaxation or mindfulness meditation, apply a warm compress to the neck and shoulders, maintain regular sleep schedules and meal times, stay well hydrated (drink 2–2.5 liters of water daily), and keep a detailed headache diary to identify personal stress triggers.",
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
        question: "How can I tell the difference between a tension headache and a migraine?",
        answer: "A tension headache feels like a steady, dull, non-pulsating band squeezing both sides of your head, does not cause nausea or vomiting, and does not get worse with light walking. A migraine is typically a throbbing, pounding pain on one side of the head, often accompanied by severe nausea, light and sound sensitivity, and worsens with movement."
      },
      {
        question: "What is a 'Medication Overuse Headache' (rebound headache)?",
        answer: "Taking pain relief medications (like ibuprofen, acetaminophen, or aspirin) too frequently—more than 2 to 3 days per week—can actually cause the brain's pain receptors to become hyper-sensitized, creating a daily rebound headache that gets worse as the medication wears off."
      }
    ],
    redFlags: [
      "Thunderclap Headache: sudden, explosive headache reaching maximum, 10/10 agonizing intensity within 60 seconds ('worst headache of life'; indicates acute Subarachnoid Hemorrhage requiring immediate emergency non-contrast CT head and lumbar puncture)",
      "Bacterial Meningitis: severe headache accompanied by high spiking fever, neck stiffness (nuchal rigidity), photophobia, purpuric rash, or confusion (medical emergency requiring immediate blood cultures and IV antibiotics)",
      "Giant Cell Arteritis (Temporal Arteritis): new-onset headache in an individual over 50 years old, accompanied by scalp tenderness, jaw claudication on chewing, elevated ESR (>50 mm/hr), or sudden visual loss (requires immediate emergency high-dose corticosteroids to prevent permanent blindness)",
      "Acute Angle-Closure Glaucoma: severe unilateral frontal/orbital headache accompanied by a red eye, cloudy cornea, fixed mid-dilated pupil, seeing colored halos around lights, and intense nausea (ophthalmologic emergency)",
      "Elevated Intracranial Pressure (ICP): headache that is worst upon waking in the morning, accompanied by projectile vomiting without nausea, worsening with coughing or bending forward, papilledema on fundoscopy, or new focal neurological deficits"
    ]
  },
  claimCitations: [
    { claimId: "D0063-TRADITIONAL-PROFILE", statement: "Homeopathic tension headache profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0063-TRADITIONAL-PROFILE" },
    { claimId: "D0063-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for subarachnoid hemorrhage, bacterial meningitis, or giant cell arteritis management.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0063-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0063-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for thunderclap subarachnoid hemorrhage, meningitis, or temporal arteritis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden explosive 10/10 headache reaching peak in seconds indicating subarachnoid hemorrhage requiring emergency CT brain",
    "Headache with high fever, neck stiffness, and photophobia indicating acute bacterial meningitis requiring emergency lumbar puncture",
    "New headache in patient >50y with scalp tenderness and jaw pain indicating giant cell arteritis requiring urgent ESR and steroids"
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
  tags: ["Tension Headache", "TTH", "Stress Headache", "Head Pain", "Disease", "Tight Band Headache", "Pericranial Muscle", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/tension-headache",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive ICHD-3 myofascial tension clinical boundaries, subarachnoid hemorrhage/meningitis red flags, and verified citations"],
  clinicalPearl: "The absence of nausea, vomiting, and aggravation from routine physical activity clearly distinguishes tension-type headache from migraine.",
  quickFacts: {
    "Lifetime Prevalence": "Up to 70% to 80% of adults experience tension-type headaches (most common primary headache)",
    "Primary System": "Central & Peripheral Nervous System (Neurology / Headache Medicine)",
    "Diagnostic Standard": "ICHD-3 Clinical Diagnostic Criteria (Bilateral Band-Like Pressure)",
    "Clinical Character": "Bilateral non-pulsatile pressing or tightening headache driven by pericranial myofascial sensitivity"
  },
  aiReadiness: {
    retrievalSummary: "Tension-Type Headache is a bilateral, band-like dull headache caused by muscle tension and stress without nausea, managed with supportive care, stress reduction, posture correction, and simple analgesics.",
    clinicalSummary: "Tension-Type Headache pathophysiology involves pericranial myofascial nociception and central trigeminal sensitization. Homeopathic remedies serve as supportive nervous care and do not replace ergonomic posture correction, amitriptyline prophylaxis for chronic TTH, or emergency neuroimaging for thunderclap headaches (SAH) or meningitis.",
    patientSummary: "A tension headache feels like a tight band or heavy hat squeezing around your forehead and temples, caused by stress, neck muscle tension, or poor posture, improved by rest, stretching, and staying hydrated.",
    studentSummary: "Most common primary headache. ICHD-3 criteria: bilateral, non-pulsatile pressing pain, mild-to-moderate, no nausea/vomiting, not aggravated by walking. Differentiate from migraine. Red flags: SNOOP mnemonic (thunderclap onset, fever/meningism, temporal arteritis in elderly).",
    keywords: ["tension headache", "tth", "stress headache", "tight band head pain", "pericranial muscle tenderness", "dull headache forehead", "ichd-3 tension headache"],
    semanticKeywords: ["tension-type headache", "pericranial myofascial nociception", "bilateral pressing cephalalgia"],
    icd: "G44.209",
    mesh: "D018781",
    bodySystem: "Neurology & Headache Medicine",
    urgency: "routine"
  }
};
