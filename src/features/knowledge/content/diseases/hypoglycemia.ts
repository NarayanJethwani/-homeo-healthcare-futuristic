import { KnowledgeEntity } from "../../types";

export const HypoglycemiaDisease: KnowledgeEntity = {
  id: "D0072",
  slug: "hypoglycemia",
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
    en: "Hypoglycemia & Low Blood Glucose Crisis (Neuroglycopenia, Autonomic Counter-Regulation & Whipple's Triad)",
    hi: "हाइपोग्लाइसीमिया / ब्लड शुगर कम होना व लो ग्लूकोज संकट (Hypoglycemia / Low Blood Sugar)",
    gu: "હાયપોગ્લાયકેમિયા / બ્લડ સુગર ઘટી જવું અને અચાનક ચક્કર-ધ્રુજારી (Hypoglycemia)",
    mr: "हायपोग्लायसेमिया / रक्तातील साखर अचानक कमी होणे (Hypoglycemia / Low Blood Sugar)",
    es: "Hipoglucemia y Crisis de Glucosa Baja (Neuroglucopenia, Contrarregulación Autonómica y Tríada de Whipple)",
    ar: "نقص سكر الدم والأزمة السكرية المنخفضة (Hypoglycemia)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Hypoglycemia and Low Blood Sugar Crisis, covering Whipple's triad, neuroglycopenia, autonomic sympathoadrenal counter-regulatory hormone failure, reactive postprandial hypoglycemia, insulinoma, the 'Rule of 15' rapid glucose rescue, constitutional homeopathic supportive management, and emergency red flags for severe neuroglycopenic coma, status epilepticus, and sulfonylurea overdose.",
    hi: "हाइपोग्लाइसीमिया (ब्लड ग्लूकोज <70 mg/dL की कमी) का ऑटोनोमिक व न्यूरोग्लाइकोपेनिया पैथोलॉजी, व्हिपल्स ट्रायड (Whipple's Triad), हाथ कांपना, अत्यधिक पसीना, घबराहट, चक्कर व बेहोशी, 'Rule of 15' ग्लूकोज प्रबंधन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और हाइपोग्लाइसीमिक कोमा (Coma), मिर्गी के दौरे व इंसुलिनोमा की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "હાયપોગ્લાયકેમિયા (સુગર ૭૦ થી ઓછી થવી) ની પેથોલોજી, અચાનક પરસેવો વળવો, હાથ-પગ ધ્રૂજવા, હૃદયના ધબકારા વધવા, તાત્કાલિક ૧૫ ગ્રામ ગ્લુકોઝ લેવાનો નિયમ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સુગર ઘટીને બેભાન થઈ જવું (કોમા) તથા ખેંચ આવવાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "हायपोग्लायसेमिया (Low Blood Sugar), अचानक दरदरून घाम फुटणे, थरथर कापणे, चक्कर येऊन डोळ्यापुढे अंधारी, 'Rule of 15' साखर नियंत्रण, पारंपरिक होमिओपॅथिक पद्धत आणि बेशुद्धावस्था (Hypoglycemic Coma) व फिट्स येण्याच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la hipoglucemia que cubre la tríada de Whipple, neuroglucopenia, fallo contrarregulador autonómico, la 'Regla del 15', manejo homeopático complementario y banderas rojas de coma hipoglucémico y crisis convulsivas.",
    ar: "دليل سريري وتعليمي موثوق لنقص سكر الدم يغطي ثلاثية ويبل والنقص العصبي للسكر وفشل الاستجابة المعاكسة وقاعدة الـ 15 والرعاية التكميلية وعلامات الخطر للغيبوبة النقصية السكرية والاختلاجات والورم الإنسوليني."
  },
  content: {
    overview:
      "Hypoglycemia is a clinical syndrome characterized by abnormally low plasma glucose concentrations that expose the human body to potential harm. Defined physiologically in individuals without diabetes by Whipple's Triad (plasma glucose <55 mg/dL with concurrent symptoms and immediate symptom resolution following glucose administration) and clinically in diabetic patients by a plasma glucose threshold <70 mg/dL (3.9 mmol/L). Because the human central nervous system is entirely dependent upon a continuous arterial supply of glucose for aerobic cerebral metabolism (consuming ~120 grams of glucose daily without storing glycogen), a rapid decline in blood glucose triggers a sequential biphasic physiological response: (1) an initial Autonomic / Sympathoadrenal surge (epinephrine and norepinephrine release at ~65–70 mg/dL causing tremors, diaphoresis, tachycardia, and hunger), followed by (2) Neuroglycopenia (cerebral neuronal glucose starvation at <50–54 mg/dL causing confusion, behavioral changes, visual blur, seizures, coma, and irreversible brain death).",
    definition:
      "A clinical state defined by low venous plasma glucose (<70 mg/dL in diabetics or <55 mg/dL in non-diabetics) accompanied by autonomic or neuroglycopenic symptoms that promptly resolve upon the administration of carbohydrates (Whipple's triad).",
    causes: [
      "Iatrogenic Pharmacological Excess (most common in diabetes): accidental overdose, mistimed dosing, or excessive administration of exogenous Insulin, long-acting Sulfonylureas (glimepiride, glyburide, gliclazide), or Meglitinides, combined with missed or delayed carbohydrate meals",
      "Strenuous Physical Exercise without Carbohydrate Adjustment: accelerated skeletal muscle GLUT4 glucose uptake and glycogen depletion during or hours after prolonged intense physical activity ('lag effect')",
      "Excessive Alcohol Ingestion: acute binge drinking especially on an empty stomach (alcohol metabolism oxidizes ethanol to acetaldehyde via alcohol dehydrogenase, consuming cytosolic NAD+ and completely shutting down hepatic Gluconeogenesis)",
      "Endogenous Hyperinsulinism: Insulinoma (benign pancreatic beta-cell neuroendocrine adenoma causing autonomous, unsuppressed insulin and C-peptide hypersecretion during fasting), Nesidioblastosis / Non-Insulinoma Pancreatogenous Hypoglycemia Syndrome (NIPHS), and Post-Bariatric Hypoglycemia",
      "Endocrine & Organ Failure: Primary Adrenal Insufficiency (Addison's disease with severe cortisol and epinephrine deficiency), Hypopituitarism (growth hormone and ACTH deficiency), End-Stage Renal Disease (reduced renal insulin clearance and impaired renal gluconeogenesis), and Fulminant Hepatic Failure (massive loss of hepatic glycogen storage)",
      "Reactive (Postprandial) Hypoglycemia: exaggerated incretin (GLP-1) release and late hyperinsulinemic overshoot occurring 2 to 4 hours following carbohydrate-dense meals in idiopathic or pre-diabetic states"
    ],
    riskFactors: [
      "Treatment with insulin secretagogues (sulfonylureas) or intensive basal-bolus insulin regimens in Type 1 or Type 2 Diabetes",
      "Hypoglycemia-Associated Autonomic Failure (HAAF) / Hypoglycemia Unawareness: loss of warning sympathoadrenal symptoms due to recurrent hypoglycemia",
      "Chronic Kidney Disease (eGFR <30 mL/min; severely prolongs circulating half-life of insulin and oral hypoglycemics)",
      "Erratic eating patterns, prolonged fasting, skipping meals, or strict carbohydrate-free ketogenic diets",
      "Advanced age, cognitive impairment, or living alone with insulin dependency"
    ],
    symptoms: [
      "Autonomic / Neurogenic Warning Signs (Early Phase; Glucose ~55–70 mg/dL): profuse cold diaphoresis (sweating), fine hand tremors/shakiness, palpitations and tachycardia, pallor, intense ravenous hunger, nausea, and acute severe anxiety/jitters",
      "Neuroglycopenic Brain Starvation Signs (Late Phase; Glucose <50–55 mg/dL): cognitive slowing, profound confusion, difficulty speaking or slurred speech, glass-eyed stare, extreme drowsiness, dizziness, and visual disturbances (diplopia/blurring)",
      "Hypoglycemic Behavioral Changes: uncharacteristic irritability, belligerence, agitation, emotional crying, irrational stubbornness, or acting intoxicated",
      "Nocturnal Hypoglycemia: waking up with night sweats, soaking wet bedclothes, nightmares, waking with a pounding morning headache, and sleep fragmentation",
      "Severe Neuroglycopenic Crisis: focal neurological deficits (hemiplegia mimicking acute ischemic stroke), generalized tonic-clonic status epilepticus seizures, profound coma, and respiratory arrest"
    ],
    diagnosis:
      "Diagnosed using objective biochemical parameters and the strict validation of Whipple's Triad: (1) Point-of-Care Capillary Blood Glucose Meter (fingerstick) or Continuous Glucose Monitoring (CGM; triggers automated low glucose alarms at <70 mg/dL and <54 mg/dL). (2) Formal 72-Hour Supervised Inpatient Fasting Test (the diagnostic gold standard for unprovoked non-diabetic hypoglycemia: patient is fasted with water only; when glucose drops <55 mg/dL with symptoms, simultaneous blood is drawn for Plasma Glucose, Plasma Insulin, C-peptide, Proinsulin, Beta-Hydroxybutyrate [BHOB], and Sulfonylurea/Meglitinide Drug Screen). (3) Diagnostic Interpretation: elevated insulin (\u22653 microU/mL), elevated C-peptide (\u22650.2 nmol/L), and elevated proinsulin (\u22655 pmol/L) during hypoglycemia confirms an Insulinoma or beta-cell hypertrophy. (4) Mixed Meal Tolerance Test (MMTT) for Postprandial Reactive Hypoglycemia. (5) Endocrine Screening: Morning Cortisol, ACTH, and Thyroid function to rule out adrenal crisis.",
    differentialDiagnosis:
      "Differentiate Hypoglycemia from Acute Ischemic Stroke or Transient Ischemic Attack (TIA; mandatory fingerstick glucose must be performed in all acute stroke codes to rule out hypoglycemic stroke mimic), Generalized Anxiety Disorder / Panic Attacks (elevated glucose during panic, no neuroglycopenia), Vasovagal Syncope, Epilepsy / Seizure Disorder, Alcohol / Drug Intoxication, Pheochromocytoma (hyperglycemic spells with hypertension), and Factitious Hypoglycemia (surreptitious exogenous insulin injection: high insulin with suppressed C-peptide <0.2 nmol/L).",
    conventionalManagement:
      "A structured emergency and preventative protocol: (1) The Standard 'Rule of 15' for Conscious Patients (Glucose 55–69 mg/dL): consume 15 to 20 grams of fast-acting simple carbohydrates (4 glucose tablets, 4 ounces / 120 mL of fruit juice or regular soda, or 1 tablespoon of sugar/honey), wait 15 minutes in absolute rest, re-check blood glucose; if still <70 mg/dL, repeat with another 15 grams of fast-acting carbohydrates until glucose is \u226570 mg/dL, then immediately consume a complex carbohydrate and protein snack (peanut butter crackers, meal) to prevent rebound hypoglycemia. (2) Emergency Management of Severe / Unconscious Hypoglycemia (Level 3 Crisis): DO NOT put liquids or food into the mouth (severe aspiration risk); administer Intravenous Dextrose (25 to 50 mL of D50W [50% Dextrose] IV push over 2–3 minutes followed by 10% Dextrose infusion) OR Emergency Glucagon (Nasal Glucagon powder [Baqsimi 3 mg single spray into one nostril] or Subcutaneous/IM Glucagon 1 mg auto-injector [Gvoke / Zegalogue]). (3) Sulfonylurea Overdose Management: requires admission and IV Octreotide (50–100 mcg SQ every 8 hours) to suppress continuous pancreatic insulin secretion. (4) Surgical Resection: laparoscopic enucleation of pancreatic Insulinoma.",
    homeopathicApproach:
      "Homeopathic constitutional and metabolic remedies (such as Lycopodium Clavatum, Phosphorus, Arsenicum Album, Nux Vomica, Sulphur, China Officinalis, Gelsemium Sempervirens, Natrum Muriaticum, Argentum Nitricum, Iodium) serve as supportive care to ease postprandial glycemic volatility, soothe nervousness from mild hunger drops, and support vitality alongside strict nutritional pacing, the Rule of 15, and physician monitoring.",
    lifestyleAdvice:
      "Always carry emergency fast-acting glucose tablets or candies everywhere you go (in pockets, car glove compartment, bedside table, and gym bag), never skip or significantly delay planned meals after taking diabetes medications, eat small, balanced meals every 3 to 4 hours containing complex carbohydrates, lean protein, and healthy fats to stabilize postprandial glucose curves, avoid consuming alcohol on an empty stomach, wear a medical alert identification bracelet indicating diabetes/hypoglycemia, use a Continuous Glucose Monitor (CGM) with customizable low-glucose alarms, and ensure family members and coworkers are trained on how to use emergency nasal glucagon (Baqsimi).",
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
        question: "Why does the 'Rule of 15' recommend fruit juice or candy instead of chocolate or cookies?",
        answer: "Chocolate, cakes, and cookies contain large amounts of dietary fat. Fat significantly slows down stomach emptying and delays the absorption of sugar into your bloodstream. When you are hypoglycemic, your brain needs fast-acting simple glucose (like fruit juice, glucose tablets, or regular soda) that absorbs into the blood within minutes."
      },
      {
        question: "What is 'Hypoglycemia Unawareness' and why is it so dangerous?",
        answer: "When a person experiences frequent low blood sugar drops, the brain's warning system gets exhausted and resets its threshold. As a result, the body stops releasing adrenaline, so the patient feels no shaking, sweating, or hunger. The blood sugar drops straight into dangerous neuroglycopenia, causing sudden confusion or fainting without any warning."
      }
    ],
    redFlags: [
      "Severe Neuroglycopenic Hypoglycemic Coma: unresponsiveness, stupor, inability to swallow, or profound unconsciousness with blood glucose <40–50 mg/dL (life-threatening emergency requiring immediate emergency 911 dispatch, administration of emergency nasal glucagon [Baqsimi] or IM glucagon, and IV 50% Dextrose)",
      "Hypoglycemia-Induced Status Epilepticus: generalized tonic-clonic seizures triggered by severe cerebral glucose starvation (requires immediate airway protection, IV dextrose, and anticonvulsants)",
      "Refractory Long-Acting Sulfonylurea Overdose: recurrent severe hypoglycemic crashes requiring prolonged ICU dextrose infusions and IV/SQ Octreotide to suppress pancreatic insulin release",
      "Unexplained Severe Fasting Hypoglycemia in a Non-Diabetic: mandates urgent 72-hour fasting test to detect Pancreatic Insulinoma or severe occult Addisonian adrenal insufficiency"
    ]
  },
  claimCitations: [
    { claimId: "D0072-TRADITIONAL-PROFILE", statement: "Homeopathic hypoglycemia profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0072-TRADITIONAL-PROFILE" },
    { claimId: "D0072-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for severe hypoglycemic coma IV dextrose resuscitation, emergency glucagon rescue, or insulinoma resection.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0072-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0072-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for severe hypoglycemic coma, seizures, or acute glucose resuscitation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Profound unconsciousness or coma with blood sugar <50 mg/dL requiring emergency 911 dispatch and IV dextrose / glucagon",
    "Generalized epileptic seizures triggered by low blood sugar requiring immediate emergency glucose administration",
    "Recurrent severe fasting drops in a non-diabetic indicating potential pancreatic insulinoma requiring 72-hour fasting test"
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
  tags: ["Hypoglycemia", "Low Blood Sugar", "Neuroglycopenia", "Whipple's Triad", "Rule of 15", "Glucagon", "Insulinoma", "Disease", "Endocrinology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hypoglycemia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive neuroglycopenia, autonomic counter-regulation, Whipple's triad, and Rule of 15 clinical boundaries, hypoglycemic coma/seizure red flags, and verified citations"],
  clinicalPearl: "Always treat acute hypoglycemia with fast-acting pure glucose (Rule of 15); avoid fatty chocolates which delay gastric emptying and glucose absorption.",
  quickFacts: {
    "Clinical Threshold": "Venous Plasma Glucose <70 mg/dL in Diabetics or <55 mg/dL with Whipple's Triad",
    "Primary System": "Endocrine System & Glucose Homeostasis (Endocrinology / Emergency Medicine)",
    "Diagnostic Standard": "Whipple's Triad (Low Glucose, Symptoms, Immediate Relief with Glucose)",
    "Clinical Character": "Acute systemic glucose deficit triggering autonomic adrenaline surge and neuroglycopenia"
  },
  aiReadiness: {
    retrievalSummary: "Hypoglycemia is low blood sugar (<70 mg/dL) causing shakiness, sweating, and confusion, treated immediately with the Rule of 15 (15g fast-acting sugar) and medical emergency care.",
    clinicalSummary: "Hypoglycemia pathophysiology involves plasma glucose falling below critical thresholds (<70 mg/dL), triggering sympathoadrenal catecholamine surges and cerebral neuroglycopenia (<50 mg/dL). Homeopathic remedies serve as supportive metabolic care and do not replace immediate simple carbohydrate rescue (Rule of 15), IV dextrose, or emergency glucagon for coma or seizures.",
    patientSummary: "Hypoglycemia means your blood sugar has dropped too low, making you feel shaky, sweaty, dizzy, and confused, requiring immediate treatment with 15 grams of fast sugar (juice or glucose tablets).",
    studentSummary: "Low blood glucose triggering autonomic surge (tremor, diaphoresis) and neuroglycopenia (confusion, coma). Non-diabetic standard: Whipple's triad. Diabetic threshold: <70 mg/dL. Treatment: Rule of 15 (conscious) or IV D50W / nasal glucagon (unconscious). Red flags: hypoglycemic coma, status epilepticus, and sulfonylurea overdose.",
    keywords: ["hypoglycemia", "low blood sugar", "shaky sweaty low sugar", "whipple's triad", "rule of 15 glucose", "glucagon baqsimi", "insulinoma neuroglycopenia"],
    semanticKeywords: ["acute glucose counter-regulation", "neuroglycopenic cerebral starvation", "sympathoadrenal hypoglycemia"],
    icd: "E16.2",
    mesh: "D007003",
    bodySystem: "Endocrinology & Metabolism",
    urgency: "urgent"
  }
};
