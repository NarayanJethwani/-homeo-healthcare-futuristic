import { KnowledgeEntity } from "../../types";

export const VitaminB12DeficiencyDisease: KnowledgeEntity = {
  id: "D0053",
  slug: "vitamin-b12-deficiency",
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
    en: "Vitamin B12 Deficiency (Cobalamin Deficiency, Pernicious Anemia & Megaloblastic Anemia)",
    hi: "विटामिन बी12 की कमी / घातक रक्ताल्पता व तंत्रिका क्षति (Vitamin B12 Deficiency)",
    gu: "વિટામિન બી૧૨ ની ઉણપ / નસોની નબળાઈ અને એનિમિયા (Vitamin B12 Deficiency)",
    mr: "व्हिटॅमिन बी१२ ची कमतरता / अ‍ॅनिमिया व मज्जासंस्थेचे विकार (Vitamin B12 Deficiency)",
    es: "Deficiencia de Vitamina B12 (Anemia Perniciosa, Anemia Megaloblástica y Degeneración Combinada)",
    ar: "عوز فيتامين ب12 وفقر الدم الخبيث (Vitamin B12 Deficiency)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Vitamin B12 (Cobalamin) Deficiency, covering gastric intrinsic factor (IF) autoimmune destruction (Pernicious Anemia), impaired methionine synthase and methylmalonyl-CoA mutase enzymatic pathways, megaloblastic macrocytic anemia, subacute combined degeneration (SCD) of the spinal cord, constitutional homeopathic supportive management, and emergency red flags for progressive neuro-myelopathy, severe symptomatic pancytopenia, and high-output heart failure.",
    hi: "विटामिन बी12 की कमी (कोबालामिन डेफिशिएंसी / परनिशियस एनीमिया) का गैस्ट्रिक इंट्रिंसिक फैक्टर पैथोलॉजी, मिथाइलमेलोनिक एसिड (MMA) एलिवेशन, मैक्रोसाइटिक मेगालोब्लास्टिक एनीमिया, रीढ़ की हड्डी का न्यूरोलॉजिकल डिजनरेशन (SCD), हाथ-पैरों में सुन्नपन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सबएक्यूट कंबाइंड डिजनरेशन व गंभीर पैनसाइटोपेनिया की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "વિટામિન બી૧૨ ની ઉણપની પેથોલોજી, પર્નિશિયસ એનિમિયા, નસોમાં કાયમી ખામી (સબએક્યુટ કમ્બાઇન્ડ ડીજનરેશન), હાથ-પગમાં ખાલી ચડવી, લાલ જીભ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પેરાલિસિસ તથા ગંભીર એનિમિયાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "व्हिटॅमिन बी१२ ची कमतरता (Cobalamin Deficiency), हात-पायांना मुंग्या येणे व तोल जाणे (SCD), लाल चकचकीत जीभ, मेगालोब्लास्टिक अ‍ॅनिमिया, पारंपरिक होमिओपॅथिक पद्धत आणि अर्धांगवायू (Paralysis) व गंभीर रक्ताल्पतेच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la deficiencia de vitamina B12 que cubre la anemia perniciosa, anemia megaloblástica, degeneración combinada subaguda medular, manejo homeopático complementario y banderas rojas de mielopatía progresiva y pancitopenia.",
    ar: "دليل سريري وتعليمي موثوق لعوز فيتامين ب12 يغطي فقر الدم الخبيث وفقر الدم الضخم الأرومات والتنكس المشترك تحت الحاد للنخاع الشوكي والرعاية التكميلية وعلامات الخطر للاعتلال النقوي التدريجي وقلة الكريات الشاملة."
  },
  content: {
    overview:
      "Vitamin B12 (Cobalamin) Deficiency is a critical hematological and neuro-psychiatric metabolic disorder resulting from inadequate dietary intake, impaired gastrointestinal absorption, or autoimmune gastric destruction. Vitamin B12 serves as an essential water-soluble cofactor for two vital intracellular enzymatic reactions: (1) Methionine Synthase (converting homocysteine to methionine; essential for folate recycling and DNA thymidine synthesis in rapidly dividing hematopoietic cells) and (2) Methylmalonyl-CoA Mutase (converting methylmalonyl-CoA to succinyl-CoA in mitochondria; essential for fatty acid metabolism and myelin sheath synthesis). Impaired DNA synthesis results in nuclear-cytoplasmic dyssynchrony producing Megaloblastic Macrocytic Anemia and Pancytopenia, while defective myelin maintenance produces length-dependent peripheral neuropathy, cerebral neuropsychiatric symptoms, and life-threatening Subacute Combined Degeneration (SCD) of the spinal cord.",
    definition:
      "A clinical and biochemical state characterized by subnormal circulating serum Vitamin B12 (<200 pg/mL / <148 pmol/L) with elevated serum Methylmalonic Acid (MMA) and Homocysteine levels, resulting in megaloblastic hematopoiesis or progressive demyelinating neurological dysfunction.",
    causes: [
      "Autoimmune Pernicious Anemia: autoimmune destruction of gastric parietal cells and circulating Anti-Intrinsic Factor (anti-IF) / Anti-Parietal Cell antibodies causing loss of gastric intrinsic factor and achlorhydria (most common cause in older adults)",
      "Dietary Inadequacy: strict long-term vegan or vegetarian diets without fortification or supplementation (since vitamin B12 is synthesized exclusively by microorganisms and found naturally only in animal-derived foods)",
      "Gastric Malabsorption: total or partial gastrectomy, bariatric Roux-en-Y gastric bypass, and atrophic gastritis failing to release food-bound cobalamin (food-cobalamin malabsorption)",
      "Terminal Ileal Disease or Resection: surgical resection of the terminal ileum (>20–60 cm), severe ileal Crohn's disease, or celiac disease preventing absorption of the intrinsic factor-cobalamin complex (via cubam receptors)",
      "Pharmacological interference: prolonged use (>1–2 years) of Proton Pump Inhibitors (PPIs) or H2-receptor antagonists (suppresses gastric acid required to cleave B12 from dietary protein) and Metformin (impairs calcium-dependent ileal membrane absorption; occurs in up to 30% of diabetic users)",
      "Small Intestinal Bacterial Overgrowth (SIBO) and Diphyllobothrium latum (fish tapeworm) competitive lumen consumption"
    ],
    riskFactors: [
      "Strict vegan or vegetarian diet without oral B12 supplementation (>3–5 years, as hepatic B12 stores [2–5 mg] take years to deplete)",
      "Age >60 years (high prevalence of autoimmune atrophic gastritis and hypochlorhydria)",
      "Personal or family history of autoimmune endocrinopathies (Vitiligo, Hashimoto's Thyroiditis, Type 1 Diabetes, Addison's disease)",
      "Chronic prescription Metformin or high-dose PPI / antacid therapy",
      "History of bariatric weight loss surgery or ileal resection"
    ],
    symptoms: [
      "Hematological manifestations: profound generalized fatigue, exertional dyspnea, pallor, lightheadedness, and a characteristic lemon-yellow skin tint (pallor combined with mild indirect hyperbilirubinemia from intramedullary hemolysis)",
      "Oral mucosal signs: Hunter's Glossitis (beefy, smooth, shiny, erythematous, painful, depapillated tongue) and recurrent aphthous stomatitis",
      "Neurological sensory disturbances: symmetrical, bilateral tingling, paresthesias, numbness, and 'pins and needles' in the feet and hands ('stocking-glove' distribution)",
      "Subacute Combined Degeneration (SCD) signs: loss of vibration sense (tested with 128-Hz tuning fork) and loss of joint position sense (proprioception) in the lower limbs, sensory ataxia (positive Romberg test, broad-based stomping gait, unsteadiness in the dark), spastic paraparesis, hyperreflexia, and extensor plantar responses (positive Babinski sign)",
      "Neuropsychiatric ('Megaloblastic Madness'): progressive memory loss, cognitive decline, brain fog, depression, irritability, paranoia, and overt psychosis"
    ],
    diagnosis:
      "Diagnosed through an algorithmic hematological and biochemical laboratory panel: (1) Complete Blood Count (CBC) and Peripheral Blood Smear (demonstrating Macrocytic Anemia with elevated Mean Corpuscular Volume [MCV >100–115 fL], macro-ovalocytes, pancytopenia [leukopenia, thrombocytopenia], and pathognomonic hypersegmented neutrophils [\u22655 lobes in \u22655% of neutrophils]). (2) Total Serum Vitamin B12 (<200 pg/mL = Deficient; 200–300 pg/mL = Borderline/Equivocal). (3) Confirmatory Metabolites (essential in borderline cases or suspected cellular deficiency): Serum Methylmalonic Acid (MMA; highly sensitive and specific; elevated >0.40 micromol/L) and Total Serum Homocysteine (elevated >15 micromol/L). (4) Etiological Autoantibody Testing: Serum Anti-Intrinsic Factor (Anti-IF) Antibodies (high specificity for Pernicious Anemia) and Anti-Parietal Cell Antibodies.",
    differentialDiagnosis:
      "Differentiate Vitamin B12 Deficiency from Folate (Vitamin B9) Deficiency (macrocytic anemia with normal MMA and elevated homocysteine, without subacute combined degeneration; WARNING: treating B12 deficiency with high-dose folate alone cures the anemia but allows catastrophic irreversible spinal cord paralysis to progress), Myelodysplastic Syndrome (MDS), Alcohol-Related Macrocytosis, Hypothyroidism, Multiple Sclerosis, and Cervical Spondylotic Myelopathy.",
    conventionalManagement:
      "A structured, evidence-based cobalamin repletion protocol: (1) Parenteral Intramuscular (IM) Cyanocobalamin or Hydroxocobalamin: 1,000 mcg IM daily for 7 days, then weekly for 4 weeks, followed by 1,000 mcg IM monthly for life (mandatory initial protocol for severe neurological symptoms, pernicious anemia, or ileal resection). (2) High-Dose Oral Therapy: Oral Cyanocobalamin 1,000 to 2,000 mcg daily (1–2% is absorbed via passive non-intrinsic-factor-dependent diffusion; proven equivalent to IM therapy in non-neurological deficiency). (3) Rapid hematological response monitoring: brisk reticulocytosis peaks at days 5 to 7; serial monitoring of serum potassium is mandatory during early repletion to prevent life-threatening Hypokalemia (due to massive potassium uptake by new proliferating erythrocytes). (4) Lifelong maintenance therapy for pernicious anemia or post-bariatric surgery.",
    homeopathicApproach:
      "Homeopathic constitutional and vitality-supporting remedies (such as Phosphorus, Arsenicum Album, Picricum Acidum, Zincum Metallicum, China Officinalis, Kali Phosphoricum, Natrum Muriaticum, Lycopodium Clavatum, Plumbum Metallicum) serve as supportive care to ease fatigue, assist mental clarity, and soothe mild tingling sensations alongside mandatory high-dose oral or intramuscular cobalamin therapy, CBC tracking, and neurological rehabilitation.",
    lifestyleAdvice:
      "Strict vegetarians and vegans must consume a reliable daily oral vitamin B12 supplement (1,000 mcg) or fortified foods (fortified nutritional yeast, plant milks, breakfast cereals), take B12 supplements consistently as directed by your physician, eat a balanced diet with adequate potassium during the first week of B12 replacement, schedule regular follow-up CBC and B12 blood panels, and report any new tingling or walking unsteadiness immediately.",
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
        question: "Why is treating vitamin B12 deficiency with folic acid pills alone dangerous?",
        answer: "High-dose folic acid (vitamin B9) can fix the anemia on a blood test, masking the B12 deficiency. However, folic acid cannot protect the nervous system—allowing irreversible spinal cord damage and permanent paralysis (subacute combined degeneration) to progress unnoticed."
      },
      {
        question: "Why do some people need B12 injections while others can take pills?",
        answer: "People with Pernicious Anemia or stomach/intestinal surgery lack 'intrinsic factor', the special stomach protein required to absorb normal dietary B12. They require intramuscular injections (or very high-dose 2,000 mcg oral pills that force 1% absorption across the intestine) to get enough cobalamin into their bloodstream."
      }
    ],
    redFlags: [
      "Subacute Combined Degeneration (SCD) of the Spinal Cord: rapid progression of bilateral lower limb sensory ataxia, severe loss of proprioception/vibration, positive Babinski sign, spastic paraparesis, and inability to walk (neurological emergency requiring immediate high-dose parenteral IM cobalamin therapy to prevent permanent irreversible spinal cord transection/paralysis)",
      "Severe Symptomatic Megaloblastic Pancytopenia: severe anemia (Hb <6–7 g/dL) with profound thrombocytopenia (platelets <20,000/microL with active mucosal bleeding/petechiae) or severe neutropenia (ANC <500/microL with high fever/sepsis)",
      "High-Output Congestive Heart Failure: extreme exertional dyspnea, orthopnea, tachycardia, and pedal edema triggered by profound chronic severe anemia",
      "Acute Hypokalemia during initial B12 repletion therapy: cardiac arrhythmias or muscle paralysis resulting from rapid intracellular potassium shift during massive red cell production (reticulocyte surge)"
    ]
  },
  claimCitations: [
    { claimId: "D0053-TRADITIONAL-PROFILE", statement: "Homeopathic vitamin B12 deficiency profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0053-TRADITIONAL-PROFILE" },
    { claimId: "D0053-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for parenteral cobalamin repletion, subacute combined degeneration reversal, or pernicious anemia management.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0053-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0053-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for subacute combined degeneration, severe pancytopenia, or high-output heart failure.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Loss of proprioception, sensory ataxia, and spastic leg weakness indicating subacute combined degeneration requiring emergency IM B12",
    "Severe anemia with active bleeding or petechiae indicating severe megaloblastic pancytopenia requiring urgent hematology admission",
    "Orthopnea and severe tachycardia in profound anemia indicating high-output heart failure"
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
  tags: ["Vitamin B12 Deficiency", "Pernicious Anemia", "Megaloblastic Anemia", "Cobalamin", "Disease", "Subacute Combined Degeneration", "Hunter Glossitis", "Hematology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/vitamin-b12-deficiency",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive cobalamin enzymatic clinical boundaries, subacute combined degeneration/pancytopenia red flags, and verified citations"],
  clinicalPearl: "Never treat macrocytic anemia with folic acid alone before ruling out B12 deficiency; folate cures the anemia but allows catastrophic irreversible spinal cord paralysis to progress.",
  quickFacts: {
    "Hepatic Reserve": "Normal liver stores 2–5 mg of B12; takes 3 to 5 years of malabsorption to deplete",
    "Primary System": "Hematopoietic & Central/Peripheral Nervous System (Hematology / Neurology)",
    "Diagnostic Standard": "Serum B12 (<200 pg/mL), Serum Methylmalonic Acid (MMA), & Blood Smear (Hypersegmented PMNs)",
    "Clinical Character": "Cobalamin deficiency causing megaloblastic macrocytic anemia and subacute combined spinal degeneration"
  },
  aiReadiness: {
    retrievalSummary: "Vitamin B12 Deficiency causes anemia, tingling in hands/feet, balance problems, and fatigue, managed with supportive care, oral or intramuscular cobalamin, and neurological monitoring.",
    clinicalSummary: "Vitamin B12 Deficiency pathophysiology involves impaired methionine synthase and methylmalonyl-CoA mutase, causing megaloblastic macrocytic anemia and spinal dorsal column demyelination (SCD). Homeopathic remedies serve as supportive care and do not replace parenteral/oral cobalamin repletion, CBC monitoring, or emergency care for subacute combined degeneration.",
    patientSummary: "Vitamin B12 deficiency happens when your body does not absorb enough vitamin B12 from food or supplements, causing anemia, a smooth sore tongue, and tingling or numbness in your feet, treated with B12 vitamins.",
    studentSummary: "Macrocytic anemia (MCV >100) with hypersegmented neutrophils. Diagnostic standard: low serum B12 with elevated MMA and homocysteine. Autoimmune cause: Pernicious Anemia (anti-IF antibodies). Complication: Subacute Combined Degeneration (dorsal/lateral columns). Never give folate alone.",
    keywords: ["vitamin b12 deficiency", "pernicious anemia", "megaloblastic anemia", "low cobalamin", "subacute combined degeneration", "tingling numbness feet", "hunter glossitis"],
    semanticKeywords: ["cobalamin metabolic deficiency", "methylmalonic acidemia neuropathy", "demyelinating myelopathy"],
    icd: "E53.8",
    mesh: "D014806",
    bodySystem: "Hematology & Neurology",
    urgency: "routine"
  }
};
