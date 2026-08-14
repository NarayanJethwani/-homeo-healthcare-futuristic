import { KnowledgeEntity } from "../../types";

export const HypochlorhydriaDisease: KnowledgeEntity = {
  id: "D0057",
  slug: "hypochlorhydria",
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
    en: "Hypochlorhydria & Achlorhydria (Low Stomach Acid & Parietal Cell Secretory Failure)",
    hi: "हाइपोक्लोरहाइड्रिया / पेट में पाचक एसिड की कमी (Hypochlorhydria / Low Stomach Acid)",
    gu: "હાઈપોક્લોરહાઈડ્રિયા / પેટમાં એસિડની ઉણપ અને પાચનની નબળાઈ (Hypochlorhydria)",
    mr: "हायपोक्लोरहायड्रिया / जठरात पाचक आम्लाची कमतरता (Hypochlorhydria)",
    es: "Hipoclorhidria y Aclorhidria (Deficiencia de Ácido Gástrico y Fallo Secretor Parietal)",
    ar: "نقص حموضة المعدة واللاكلورهيدريا (Hypochlorhydria)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Hypochlorhydria and Achlorhydria (Low Stomach Acid), covering parietal cell H+/K+ ATPase secretory failure, autoimmune atrophic gastritis, chronic Helicobacter pylori colonization, impaired pepsinogen activation, small intestinal bacterial overgrowth (SIBO), constitutional homeopathic supportive management, and emergency red flags for gastric adenocarcinoma, gastric neuroendocrine tumors (carcinoids), and acute gastrointestinal bleeding.",
    hi: "हाइपोक्लोरहाइड्रिया (पेट में पाचक हाइड्रोक्लोरिक एसिड की कमी) का पैराइटल सेल पैथोलॉजी, ऑटोइम्यून एट्रोफिक गैस्ट्राइटिस, प्रोटीन व माइक्रोन्यूट्रिएंट्स (B12, आयरन) का कुअवशोषण, पेट में भारीपन, गैस व SIBO, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और गैस्ट्रिक कैंसर व ब्लीडिंग की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "હાઈપોક્લોરહાઈડ્રિયા (પેટમાં એસિડ ઘટવું) ની પેથોલોજી, પ્રોટીન અને વિટામિન બી૧૨ તથા આયર્નનું અપચો, પેટ ફૂલવું, એન્ટાસિડ દવાઓની આડઅસર, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને જઠરના કેન્સર (ગેસ્ટ્રિક કેન્સર) તથા આંતરડાના રક્તસ્ત્રાવની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "हायपोक्लोरहायड्रिया (जठरातील आम्ल कमी होणे), अन्नाचे अपचन, पोट फुगणे व जड वाटणे, व्हिटॅमिन बी१२ ची कमतरता, पारंपरिक होमिओपॅथिक पद्धत आणि पोटात अल्सर किंवा कर्करोग (Gastric Cancer) व अंतर्गत रक्तस्त्रावाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la hipoclorhidria y aclorhidria que cubre el fallo de la bomba H+/K+ ATPasa parietal, gastritis atrófica autoinmune, malabsorción de B12 y hierro, sobrecrecimiento bacteriano (SIBO), manejo homeopático complementario y banderas rojas de adenocarcinoma gástrico y tumores neuroendocrinos.",
    ar: "دليل سريري وتعليمي موثوق لنقص حموضة المعدة يغطي فشل إفراز الخلايا الجدارية والتهاب المعدة الضموري المناعي الذاتي وسوء الامتصاص وفرط النمو الجرثومي المعوي والرعاية التكميلية وعلامات الخطر لسرطان المعدة الغدي والنزف الهضمي."
  },
  content: {
    overview:
      "Hypochlorhydria (deficient gastric hydrochloric acid secretion; fasting gastric pH >3.0–5.0) and Achlorhydria (complete absence of gastric acid secretion; fasting gastric pH >6.5–7.0) are clinically underrecognized disorders of upper gastrointestinal physiology. Normal gastric acid secretion by gastric corpus parietal cells—producing up to 2 liters of hydrochloric acid (HCl) daily at a luminal pH of 1.5 to 2.0—is essential for: (1) denaturing dietary proteins and activating inactive pepsinogen into proteolytic pepsin, (2) releasing bound micronutrients (vitamin B12, non-heme iron, calcium, magnesium, zinc) from food matrices, (3) serving as a chemical antimicrobial barrier sterilizing ingested pathogens, and (4) triggering the release of secretin and cholecystokinin (CCK) to stimulate pancreatic enzyme and bile secretion. Loss of gastric acidity leads to postprandial fullness, fermentation, small intestinal bacterial overgrowth (SIBO), nutrient deficiencies, and compensatory hypergastrinemia.",
    definition:
      "A clinical state characterized by pathologically reduced (hypochlorhydria) or absent (achlorhydria) secretion of hydrochloric acid by the gastric parietal cells, resulting in impaired protein digestion, micronutrient malabsorption, and altered gastrointestinal microbiome homeostasis.",
    causes: [
      "Autoimmune Metaplastic Atrophic Gastritis (AMAG / Type A Gastritis): autoimmune CD4+ T-cell and autoantibody destruction (Anti-Parietal Cell Antibodies [APCA] directed against the H+/K+ ATPase proton pump, and Anti-Intrinsic Factor Antibodies), leading to diffuse gastric corpus/fundus mucosal atrophy, achlorhydria, and pernicious anemia",
      "Chronic Helicobacter Pylori Infection (Type B Atrophic Pan-Gastritis): chronic unresolved bacterial inflammation causing progressive multifocal atrophic gastritis and destruction of oxyntic glands over decades",
      "Iatrogenic / Pharmacological Suppression: prolonged, uninterrupted high-dose Proton Pump Inhibitor (PPI; omeprazole, pantoprazole, esomeprazole) or high-dose H2-receptor antagonist therapy",
      "Gastric Surgery: post-gastrectomy, Roux-en-Y gastric bypass, or total truncal vagotomy eliminating neural parasympathetic (vagal) acid stimulation",
      "Age-Related Gastric Mucosal Atrophy: progressive physiological decline in functional parietal cell mass and mucosal microvascular perfusion in the elderly (>65 years)",
      "Systemic Autoimmune & Connective Tissue Diseases: Systemic Sclerosis (Scleroderma), Sjögren's Syndrome, Hashimoto's Thyroiditis, and Type 1 Diabetes Mellitus"
    ],
    riskFactors: [
      "Long-term daily use of PPI acid-suppressive medications (>1 year)",
      "Coexisting autoimmune conditions (Hashimoto's thyroiditis, Type 1 diabetes, vitiligo, Addison's disease)",
      "Advanced age (>60–70 years)",
      "Chronic untreated H. pylori infection or personal/family history of gastric atrophic gastritis",
      "History of bariatric, anti-reflux, or gastric ulcer surgery"
    ],
    symptoms: [
      "Early postprandial fullness and prolonged epigastric heaviness ('food sitting in the stomach like a heavy stone' for hours after meals, especially after dense protein or meat consumption)",
      "Excessive upper abdominal bloating, belching, flatulence, and epigastric distension beginning within 30 to 60 minutes after eating due to unsterilized bacterial fermentation of carbohydrates",
      "Paradoxical acid reflux symptoms: heartburn, regurgitation, and throat irritation (caused by delayed gastric emptying, increased intragastric pressure, and weak fermentation acids refluxing upward into the esophagus)",
      "Undigested food fragments visible in the stool (lientery) and chronic loose stools / diarrhea alternating with constipation (associated with secondary SIBO)",
      "Secondary micronutrient deficiency manifestations: brittle, soft, peeling fingernails with vertical ridges, hair thinning, diffuse fatigue, pallor, and peripheral neuropathy (vitamin B12 and iron deficiency)",
      "Nausea, early satiety, and a reduced appetite or aversion to animal meat proteins"
    ],
    diagnosis:
      "Diagnosed through clinical assessment and specialized physiological/endoscopic testing: (1) Esophagogastroduodenoscopy (EGD / Upper Endoscopy) with Biopsies: the gold standard anatomical investigation (Sydney protocol biopsies of the antrum and corpus revealing loss of oxyntic glands, parietal cell atrophy, intestinal metaplasia, and enterochromaffin-like [ECL] cell hyperplasia). (2) Fasting Serum Gastrin Level: markedly elevated fasting gastrin (>200–1,000 pg/mL) due to loss of the negative feedback inhibition normally exerted by luminal acid on antral D-cells (which secrete somatostatin). (3) Serological Autoantibodies: positive Anti-Parietal Cell Antibodies (APCA) and Anti-Intrinsic Factor (anti-IF) antibodies. (4) Direct Intragastric pH Telemetry (Heidelberg Capsule or Bravo pH wireless capsule: confirms persistent fasting and post-challenge intragastric pH >5.0–6.5). (5) Laboratory micronutrient workup: Serum Vitamin B12, Methylmalonic Acid (MMA), Serum Ferritin, Total Iron Binding Capacity, and Complete Blood Count (macrocytic or microcytic anemia).",
    differentialDiagnosis:
      "Differentiate Hypochlorhydria from Gastroesophageal Reflux Disease (GERD with true hyperacidity), Gastroparesis (delayed gastric emptying confirmed by 4-hour gastric scintigraphy in diabetics), Functional Dyspepsia (Rome IV criteria: postprandial distress syndrome with normal gastric biopsies), Chronic Pancreatic Exocrine Insufficiency (PEI; low fecal elastase-1 <200 mcg/g with steatorrhea), Celiac Disease (anti-tTG IgA with duodenal villous blunting), and Gastric Malignancy.",
    conventionalManagement:
      "A structured nutritional, replacement, and surveillance protocol: (1) Hydrochloric Acid & Digestive Enzyme Replacement: Betaine Hydrochloride with Pepsin capsules taken at the beginning of protein-dense meals (titrated carefully to achieve normal gastric acidification and relieve postprandial fullness; strictly contraindicated in active peptic ulcer disease). (2) Aggressive Micronutrient Repletion: sublingual or intramuscular Vitamin B12 (cyanocobalamin / hydroxocobalamin 1,000 mcg), elemental iron (ferrous bisglycinate or IV iron if oral absorption is failed), calcium citrate (which does not require acid for absorption, unlike calcium carbonate), magnesium, and zinc. (3) SIBO and Dysbiosis Management: targeted non-absorbable antibiotic therapy (Rifaximin 550 mg TID for 14 days) or herbal microbials for secondary small bowel bacterial overgrowth. (4) Cautious PPI Deprescribing: gradual tapering of unnecessary acid-suppressing medications when clinically appropriate. (5) Endoscopic Cancer Surveillance: surveillance upper endoscopy every 3 to 5 years in patients with autoimmune atrophic gastritis and extensive intestinal metaplasia to detect early gastric adenocarcinoma and Type 1 Gastric Neuroendocrine Tumors (NETs / Carcinoids).",
    homeopathicApproach:
      "Homeopathic constitutional and digestive remedies (such as Nux Vomica, Carbo Vegetabilis, Lycopodium Clavatum, China Officinalis, Pulsatilla Nigricans, Hydrastis Canadensis, Anacardium Orientale, Phosphorus, Natrum Carbonicum, Argentum Nitricum) serve as supportive care to ease postprandial heaviness, soothe abdominal bloating, and support digestive comfort alongside Betaine HCl, micronutrient repletion, and endoscopic monitoring.",
    lifestyleAdvice:
      "Chew food thoroughly (at least 20 to 30 times per bite) to mechanically break down food and mix it with salivary amylase before swallowing, avoid drinking large volumes of iced water or beverages with meals which further dilutes stomach juices, consume naturally fermented organic foods (unpasteurized raw apple cider vinegar [1 teaspoon in warm water before meals], sauerkraut, kimchi) to gently lower meal pH, consume smaller, frequent protein meals rather than massive heavy feasts, sit upright for at least 2 hours following meals, and avoid eating within 3 hours of bedtime.",
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
        question: "Can low stomach acid cause heartburn and acid reflux?",
        answer: "Yes, frequently. When stomach acid is too low, food sits in the stomach without digesting properly, allowing bacteria to ferment the food and produce gas. This build-up of gas increases pressure inside the stomach, forcing the lower esophageal valve to pop open and allow even weak, fermented stomach juices to irritate the esophagus, causing classic heartburn symptoms."
      },
      {
        question: "How does low stomach acid cause Vitamin B12 and Iron deficiency?",
        answer: "Vitamin B12 and non-heme iron in food are tightly bound to protein molecules. Strong stomach acid (pH 1.5–2.0) and the enzyme pepsin are required to cleave these vitamins free from food so they can attach to intrinsic factor and be absorbed in the intestines. Without adequate acid, your body cannot extract these vital nutrients."
      }
    ],
    redFlags: [
      "Gastric Adenocarcinoma / Gastric Malignancy: unexplained progressive weight loss, early satiety (feeling full after just a few bites), persistent unprovoked vomiting, new-onset dysphagia (difficulty swallowing), epigastric abdominal mass, or palpable left supraclavicular lymph node (Virchow's node; requires urgent upper endoscopy with multiple targeted biopsies)",
      "Type 1 Gastric Neuroendocrine Tumors (Carcinoids): driven by severe chronic hypergastrinemia stimulating ECL cell hyperplasia (requires endoscopic surveillance, biopsy, and endoscopic mucosal resection [EMR])",
      "Acute Upper Gastrointestinal Hemorrhage: vomiting bright red blood or 'coffee-ground' material (hematemesis), or passing black, tarry, foul-smelling stools (melena) with dizziness and hypotension (life-threatening medical emergency requiring urgent fluid resuscitation and emergency endoscopy)",
      "Severe Neurological Subacute Combined Degeneration: progressive loss of balance, sensory ataxia, spasticity, and severe memory loss from uncorrected autoimmune B12 malabsorption (requires urgent parenteral B12 therapy)"
    ]
  },
  claimCitations: [
    { claimId: "D0057-TRADITIONAL-PROFILE", statement: "Homeopathic hypochlorhydria profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0057-TRADITIONAL-PROFILE" },
    { claimId: "D0057-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for gastric adenocarcinoma oncologic surgery, neuroendocrine tumor resection, or parenteral B12 repletion.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0057-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0057-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for gastric malignancy, upper gastrointestinal hemorrhage, or severe nutritional deficiency.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Unexplained weight loss with early satiety and vomiting indicating possible gastric malignancy requiring urgent endoscopy",
    "Vomiting coffee-ground material or passing black tarry stools indicating acute upper gastrointestinal hemorrhage",
    "Severe sensory ataxia and progressive memory loss indicating neurodegenerative vitamin B12 malabsorption"
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
  tags: ["Hypochlorhydria", "Low Stomach Acid", "Achlorhydria", "Atrophic Gastritis", "Disease", "Betaine HCl", "Vitamin B12 Malabsorption", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hypochlorhydria",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive parietal cell H+/K+ ATPase secretory failure clinical boundaries, gastric cancer/gastrointestinal hemorrhage red flags, and verified citations"],
  clinicalPearl: "Low stomach acid causes food to ferment and generate intra-abdominal pressure, paradoxically presenting as heartburn and acid reflux.",
  quickFacts: {
    "Key Biomarker": "Serum Gastrin Elevation (>200–1000 pg/mL) & Fasting Intragastric pH >3.0–5.0",
    "Primary System": "Upper Gastrointestinal Tract & Oxyntic Mucosa (Gastroenterology / Hepatology)",
    "Diagnostic Standard": "Upper Endoscopy (EGD with Sydney Biopsies) & Intragastric pH Telemetry",
    "Clinical Character": "Deficient parietal cell gastric hydrochloric acid secretion causing protein maldigestion and fermentation"
  },
  aiReadiness: {
    retrievalSummary: "Hypochlorhydria is low stomach acid causing post-meal heaviness, bloating, and nutrient malabsorption, managed with supportive care, Betaine HCl, and medical monitoring for atrophic gastritis.",
    clinicalSummary: "Hypochlorhydria pathophysiology involves parietal cell failure (autoimmune gastritis, H. pylori, chronic PPIs), raising gastric pH, impairing pepsin activation, and promoting SIBO and B12/iron malabsorption. Homeopathic remedies serve as supportive digestive care and do not replace Betaine HCl, micronutrient repletion, or emergency evaluation for gastric malignancy or gastrointestinal bleeding.",
    patientSummary: "Hypochlorhydria means your stomach does not produce enough digestive acid, causing food to sit like a heavy brick after eating, bloating, and vitamin deficiencies, managed by chewing thoroughly, digestive supports, and medical care.",
    studentSummary: "Parietal cell acid secretion failure (pH >3-5). Etiologies: autoimmune atrophic gastritis (anti-parietal cell Ab), chronic H. pylori, chronic PPI use. Consequences: hypergastrinemia, B12/iron malabsorption, SIBO. Red flags: gastric adenocarcinoma (3-5x risk in AMAG), neuroendocrine carcinoids, and GI bleeding.",
    keywords: ["hypochlorhydria", "low stomach acid", "achlorhydria", "atrophic gastritis", "heavy food sitting stomach", "betaine hcl pepsin", "vitamin b12 malabsorption"],
    semanticKeywords: ["parietal cell secretory failure", "gastric acid hypochlorhydria", "intragastric ph elevation"],
    icd: "K31.89",
    mesh: "D000133",
    bodySystem: "Gastroenterology & Digestive Health",
    urgency: "routine"
  }
};
