import { KnowledgeEntity } from "../../types";

export const VitaminB12DeficiencyDisease: KnowledgeEntity = {
  id: "D0053",
  slug: "vitamin-b12-deficiency",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-20T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Vitamin B12 Deficiency",
    hi: "विटामिन बी12 की कमी / घातक रक्ताल्पता व तंत्रिका क्षति (Vitamin B12 Deficiency)",
    gu: "વિટામિન બી૧૨ ની ઉણપ / નસોની નબળાઈ અને એનિમિયા (Vitamin B12 Deficiency)",
    mr: "व्हिटॅमिन बी१२ ची कमतरता / अ‍ॅनिमिया व मज्जासंस्थेचे विकार (Vitamin B12 Deficiency)",
    es: "Deficiencia de Vitamina B12 (Anemia Perniciosa, Anemia Megaloblástica y Degeneración Combinada)",
    ar: "عوز فيتامين ب12 وفقر الدم الخبيث (Vitamin B12 Deficiency)"
  },
  summary: {
    en: "A clear guide to low vitamin B12: possible symptoms, the usual tests, common causes, safe next steps, and when to seek medical advice.",
    hi: "विटामिन बी12 की कमी (कोबालामिन डेफिशिएंसी / परनिशियस एनीमिया) का गैस्ट्रिक इंट्रिंसिक फैक्टर पैथोलॉजी, मिथाइलमेलोनिक एसिड (MMA) एलिवेशन, मैक्रोसाइटिक मेगालोब्लास्टिक एनीमिया, रीढ़ की हड्डी का न्यूरोलॉजिकल डिजनरेशन (SCD), हाथ-पैरों में सुन्नपन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सबएक्यूट कंबाइंड डिजनरेशन व गंभीर पैनसाइटोपेनिया की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "વિટામિન બી૧૨ ની ઉણપની પેથોલોજી, પર્નિશિયસ એનિમિયા, નસોમાં કાયમી ખામી (સબએક્યુટ કમ્બાઇન્ડ ડીજનરેશન), હાથ-પગમાં ખાલી ચડવી, લાલ જીભ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પેરાલિસિસ તથા ગંભીર એનિમિયાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "व्हिटॅमिन बी१२ ची कमतरता (Cobalamin Deficiency), हात-पायांना मुंग्या येणे व तोल जाणे (SCD), लाल चकचकीत जीभ, मेगालोब्लास्टिक अ‍ॅनिमिया, पारंपरिक होमिओपॅथिक पद्धत आणि अर्धांगवायू (Paralysis) व गंभीर रक्ताल्पतेच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la deficiencia de vitamina B12 que cubre la anemia perniciosa, anemia megaloblástica, degeneración combinada subaguda medular, manejo homeopático complementario y banderas rojas de mielopatía progresiva y pancitopenia.",
    ar: "دليل سريري وتعليمي موثوق لعوز فيتامين ب12 يغطي فقر الدم الخبيث وفقر الدم الضخم الأرومات والتنكس المشترك تحت الحاد للنخاع الشوكي والرعاية التكميلية وعلامات الخطر للاعتلال النقوي التدريجي وقلة الكريات الشاملة."
  },
  content: {
    overview:
      "Vitamin B12 supports healthy red blood cells, nerve function, and DNA production. A low level can cause fatigue, weakness, mouth or tongue soreness, and tingling or numbness in the hands and feet—although some people have few symptoms. Deficiency can come from low intake, reduced absorption, stomach or bowel conditions, surgery, or certain medicines, so finding the cause is as important as replacing the vitamin.",
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
      "Treatment depends on the cause and whether nerve symptoms are present. A clinician may recommend oral B12, injections, follow-up blood tests, or treatment of an underlying absorption condition. People with pernicious anaemia, significant malabsorption, or neurological symptoms may need a different plan and longer follow-up. Do not self-treat persistent tingling, balance problems, or marked fatigue without medical assessment.",
    homeopathicApproach:
      "If you use complementary care, discuss it openly with your clinician and pharmacist. It should not replace a clinician-led B12 treatment plan, investigation of the cause, or follow-up testing.",
    lifestyleAdvice:
      "Vitamin B12 occurs naturally in animal-derived foods and is added to some fortified foods. People who eat little or no animal food often need a reliable fortified-food or supplement strategy; the right approach depends on diet and absorption. Keep a list of medicines and past stomach or bowel procedures for your appointment, and report new numbness, weakness, or balance changes promptly.",
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
        question: "What symptoms can low vitamin B12 cause?",
        answer: "Symptoms can include fatigue, weakness, pale skin, a sore tongue or mouth, tingling or numbness in the hands and feet, and balance or memory changes. These symptoms have many possible causes, so a blood test and clinical assessment are important."
      },
      {
        question: "What does a vitamin B12 test tell me?",
        answer: "A serum or plasma B12 result is usually the starting point. If it is borderline or does not match symptoms, a clinician may add tests such as methylmalonic acid (MMA) and a complete blood count, then investigate the cause."
      },
      {
        question: "Can a vegetarian or vegan diet cause low B12?",
        answer: "It can, because B12 is naturally found mainly in animal-derived foods. Fortified foods and supplements can be important for people who avoid animal foods, but the best plan depends on diet, test results, and whether absorption is normal."
      },
      {
        question: "Why do some people need injections while others use tablets?",
        answer: "The treatment route depends on why the level is low. Injections may be used when absorption is poor or when nerve symptoms are significant; tablets may be suitable in other situations. A clinician can choose the safest option and arrange follow-up."
      },
      {
        question: "When should I seek medical advice sooner?",
        answer: "Seek prompt medical advice for new or worsening tingling, numbness, weakness, balance problems, marked breathlessness, fainting, or confusion. Seek urgent care for sudden inability to walk, severe shortness of breath, chest pain, or altered consciousness."
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
  changeLog: ["1.2.0: Simplified the patient-first overview, treatment boundaries, and question-led guidance while retaining neurological safety information.", "1.1.0: Promoted to governed v1.1.0 with comprehensive cobalamin enzymatic clinical boundaries, subacute combined degeneration/pancytopenia red flags, and verified citations"],
  clinicalPearl: "Serum or plasma B12 is usually the first test; MMA can help clarify a borderline result, especially when symptoms or risk factors are present.",
  quickFacts: {
    "Why it matters": "B12 supports red blood cells, nerve function, and DNA production",
    "Usual starting test": "Serum or plasma vitamin B12, often with a complete blood count",
    "Possible next test": "Methylmalonic acid (MMA) when a result is unclear",
    "Next step": "Discuss symptoms, diet, medicines, and absorption risk with a clinician"
  },
  aiReadiness: {
    retrievalSummary: "Vitamin B12 deficiency can affect red blood cells and nerves, causing fatigue, weakness, tingling, numbness, or balance changes. Management depends on the cause and can include clinician-guided oral or injectable B12 and follow-up tests.",
    clinicalSummary: "Start with serum or plasma B12 and a complete blood count. Consider MMA for borderline values or a discordant clinical picture, then investigate diet, medications, pernicious anaemia, and gastrointestinal malabsorption. Neurological symptoms need timely assessment.",
    patientSummary: "Low B12 can cause fatigue, weakness, or tingling, but these symptoms have many causes. A clinician can interpret a B12 blood result, look for the cause, and advise whether tablets, injections, or further tests are appropriate.",
    studentSummary: "Use serum or plasma B12 with CBC as first-line assessment; MMA can help confirm a borderline result but is affected by renal function. Consider dietary restriction, metformin/PPI use, GI surgery or disease, and pernicious anaemia. Prioritise timely assessment of neurological symptoms.",
    keywords: ["vitamin b12 deficiency", "pernicious anemia", "megaloblastic anemia", "low cobalamin", "subacute combined degeneration", "tingling numbness feet", "hunter glossitis"],
    semanticKeywords: ["cobalamin metabolic deficiency", "methylmalonic acidemia neuropathy", "demyelinating myelopathy"],
    icd: "E53.8",
    mesh: "D014806",
    bodySystem: "Hematology & Neurology",
    urgency: "routine"
  }
};
