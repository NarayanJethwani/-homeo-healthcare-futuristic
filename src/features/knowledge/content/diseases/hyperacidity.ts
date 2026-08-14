import { KnowledgeEntity } from "../../types";

export const HyperacidityDisease: KnowledgeEntity = {
  id: "D0075",
  slug: "hyperacidity",
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
    en: "Hyperacidity & Functional Acid Dyspepsia (Gastric Acid Hypersecretion, Epigastric Burning & Heartburn)",
    hi: "हाइपरएसिडिटी / पेट में अत्यधिक एसिड बनना, खट्टी डकारें व जलन (Hyperacidity / Acid Dyspepsia)",
    gu: "હાઈપરએસિડિટી / છાતીમાં બળતરા અને ખાટા ઓડકાર (Hyperacidity / Acid Reflux)",
    mr: "हायपरॲसिडिटी / पित्त वाढणे, छातीत जळजळ व आंबट ढेकर (Hyperacidity / Pitta)",
    es: "Hiperacidez y Dispepsia Ácida Funcional (Hipersecreción Gástrica, Pirosis y Ardor Epigástrico)",
    ar: "فرط حموضة المعدة وعسر الهضم الحامضي والحرقة المعدية (Hyperacidity)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Hyperacidity and Functional Acid Dyspepsia, covering parietal cell gastric acid hypersecretion (histamine, gastrin, acetylcholine pathways), gastric mucosal mucosal defense breakdown, Helicobacter pylori-mediated inflammation, Zollinger-Ellison syndrome gastrinoma, constitutional homeopathic supportive management, and emergency red flags for acute perforated peptic ulcer peritonitis, massive upper gastrointestinal hemorrhage (hematemesis/melena), and Boerhaave esophageal rupture.",
    hi: "हाइपरएसिडिटी (पेट में एसिड की अधिकता व खट्टा पित्त) का पैराइटल सेल एसिड पाथवे, गैस्ट्रिक म्यूकोसल बैरियर क्षरण, सीने व पेट में जलन (Heartburn), खट्टी डकारें (Acid Regurgitation), H. pylori, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और अल्सर फटने (Perforated Peptic Ulcer / Peritonitis) व खून की उल्टी (Hematemesis) की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "હાઈપરએસિડિટી (પેટમાં એસિડ વધવો / પિત્ત થવું) ની પેથોલોજી, છાતીમાં બળતરા, ખાટા ઓડકાર, ઉબકા અને પેટમાં દુખાવો, મસાલેદાર ખોરાકની અસર, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પેટમાં કાણું પડવું (અલ્સર પર્ફોરેશન) તથા લોહીની ઉલટીની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "हायपरॲसिडिटी (अति-अम्लपित्त / छातीत जळजळ), आंबट पाणी घशात येणे, मळमळ व डोकेदुखी, जीवनशैलीतील बदल, पारंपरिक होमिओपॅथिक पद्धत आणि जठराचे अल्सर फुटणे (Peritonitis) व रक्ताच्या उलट्यांच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la hiperacidez y dispepsia ácida que cubre la hipersecreción de ácido por células parietales, alteración de la barrera mucosa, pirosis, manejo homeopático complementario y banderas rojas de úlcera péptica perforada y hemorragia digestiva alta.",
    ar: "دليل سريري وتعليمي موثوق لفرط حموضة المعدة يغطي فرط إفراز الخلايا الجدارية للحمض وتخرب الحاجز المخاطي وحرقة الفؤاد والرعاية التكميلية وعلامات الخطر للقرحة الهضمية المثقوبة والنزف الهضمي العلوي وتمزق المريء."
  },
  content: {
    overview:
      "Hyperacidity (also termed Gastric Hyperchlorhydria, Acid Dyspepsia, or colloquially 'acid reflux/pitta') is a ubiquitous functional and organic upper gastrointestinal disorder affecting up to 25% to 40% of the adult population. Driven by an imbalance between aggressive gastric luminal factors (hydrochloric acid hypersecretion by parietal cells, activated proteolytic pepsin, and bile salts) and protective mucosal defense barriers (bicarbonate-rich mucus gel layer, prostaglandins [PGE2/PGI2], mucosal microvascular blood flow, and tight epithelial apical junctions). Mediated through three interrelated secretagogue pathways—Histamine (H2 receptors), Gastrin (CCK-B receptors), and Acetylcholine (M3 muscarinic receptors)—excessive acid production or impaired esophageal clearance produces substernal retrosternal burning (heartburn/pyrosis), acidic regurgitation ('water brash'), postprandial epigastric pain, and nauseous dyspepsia.",
    definition:
      "A clinical condition characterized by excessive production of gastric hydrochloric acid or heightened mucosal sensitivity to normal acid concentrations, causing substernal pyrosis, epigastric burning, acid regurgitation, and dyspeptic distress.",
    causes: [
      "Parietal Cell Hypersecretion: over-activation of parietal cell H+/K+ ATPase pumps stimulated by excessive gastrin (antral G-cell hyperplasia), histamine (ECL cell activation), or vagal cholinergic parasympathetic tone",
      "Helicobacter Pylori Antral-Predominant Gastritis: H. pylori colonization of the gastric antrum selectively destroys somatostatin-producing D-cells, removing the negative feedback brake on gastrin release and causing unchecked 3- to 4-fold hyperchlorhydria",
      "Mucosal Barrier Breakdown by NSAIDs: chronic use of Non-Steroidal Anti-Inflammatory Drugs (aspirin, ibuprofen, naproxen) inhibiting COX-1 and COX-2 enzymes, depleting protective prostaglandins (PGE2), reducing mucus and bicarbonate secretion, and exposing bare mucosa to acid erosion",
      "Zollinger-Ellison Syndrome (ZES): rare gastrin-secreting neuroendocrine tumor (Gastrinoma) located in the duodenum or pancreas producing massive autonomous hypergastrinemia, refractory recurrent peptic ulcers, and secretory diarrhea",
      "Lifestyle and Dietary Triggers: high intake of dietary secretagogues and lower esophageal sphincter (LES) relaxing agents—caffeine, dark chocolate, peppermint, citrus fruits, tomatoes, fatty/fried foods, carbonated sodas, and alcohol",
      "Psychological Stress & Sleep Disruption: activation of the hypothalamic-pituitary-adrenal (HPA) axis and central sympathetic pathways increasing visceral hypersensitivity and lowering gastric pain thresholds"
    ],
    riskFactors: [
      "Frequent or chronic consumption of NSAID pain relievers or antiplatelet aspirin",
      "Untreated Helicobacter pylori bacterial infection",
      "Active cigarette smoking (nicotine relaxes the LES, inhibits pancreatic bicarbonate secretion, and reduces mucosal blood flow)",
      "High body mass index / central abdominal obesity (increased intra-abdominal pressure overcoming the lower esophageal sphincter barrier)",
      "Irregular meal timings, skipping meals, eating large meals immediately before lying down, and high psychological stress levels"
    ],
    symptoms: [
      "Pyrosis (Heartburn): rising, substernal, retrosternal burning discomfort or fiery pain starting in the epigastrium and radiating upward toward the throat, characteristically aggravated 30 to 60 minutes after eating or when lying flat or bending over",
      "Acid Regurgitation & Water Brash: sudden effortless return of sour, hot, acidic stomach juices into the back of the mouth, accompanied by reflex hyper-salivation",
      "Epigastric Gnawing Pain: sharp, burning, or hungry ache localized to the upper mid-abdomen, classically relieved temporarily by food or antacids (in duodenal hyperacidity) or aggravated by eating (in gastric ulceration)",
      "Dyspeptic symptoms: frequent sour/acidic belching (eructations), upper abdominal bloating, nausea, and early satiety",
      "Extra-esophageal / Atypical manifestations: chronic dry nocturnal cough, morning hoarseness/throat clearing (laryngopharyngeal reflux), wheezing, and dental enamel erosion on lingual tooth surfaces",
      "Absence of unprovoked vomiting, progressive dysphagia, hematemesis, or unintentional weight loss in uncomplicated hyperacidity"
    ],
    diagnosis:
      "Diagnosed through clinical history and objective upper gastrointestinal testing: (1) Empirical Proton Pump Inhibitor (PPI) Test (rapid symptom relief within 1–2 weeks of once-daily PPI confirms acid-mediated disease). (2) Esophagogastroduodenoscopy (EGD / Upper Endoscopy): the definitive gold standard anatomical test (mandatory in patients \u226550–55 years or with any red flag alarm symptoms: visualizes reflux esophagitis [Los Angeles Grades A–D], Barrett's Esophagus intestinal metaplasia, gastric/duodenal peptic ulcers, and provides mucosal biopsies for histology and rapid urease testing). (3) Helicobacter Pylori Testing: Urea Breath Test (13C-UBT) or Stool Antigen Immunoassay (high sensitivity and specificity). (4) Ambulatory 24-Hour Wireless Bravo pH or pH-Impedance Monitoring (measures exact esophageal acid exposure time [AET] and symptom association probability [SAP]). (5) Fasting Serum Gastrin Level (markedly elevated >1,000 pg/mL with gastric pH <2.0 confirms Zollinger-Ellison Syndrome).",
    differentialDiagnosis:
      "Differentiate Hyperacidity from Acute Coronary Syndrome (ACS / Myocardial Infarction; retrosternal chest pressure with radiation to jaw/left arm, diaphoresis, dyspnea; mandatory emergency ECG and troponin must rule out cardiac ischemia in all atypical acute chest burning), Gastroesophageal Reflux Disease (GERD with erosive esophagitis), Peptic Ulcer Disease (PUD; active mucosal defect on endoscopy), Functional Heartburn (normal endoscopy and normal 24-hour pH monitoring with negative symptom association), Biliary Colic / Cholecystitis (RUQ pain radiating to right shoulder following fatty meals), and Esophageal Motility Disorders (Achalasia, Distal Esophageal Spasm).",
    conventionalManagement:
      "A stepped medical and lifestyle protocol: (1) First-Line Rapid Neutralizers & Surface Barriers: oral Antacids (aluminum/magnesium hydroxide, calcium carbonate; provides rapid neutral chemical buffering within minutes) and Alginate Raft Formers (Gaviscon; forms a physical floating viscous barrier atop the gastric acid pocket). (2) Acid Suppression Pharmacotherapy: Histamine-2 Receptor Antagonists (H2RAs; Famotidine 20–40 mg BID; rapid onset, effective for nocturnal acid breakthrough) and Proton Pump Inhibitors (PPIs; Omeprazole, Pantoprazole, Esomeprazole 20–40 mg once daily 30–60 minutes before breakfast for 4–8 weeks; provides potent covalent inhibition of active H+/K+ ATPase pumps, achieving mucosal healing in >90% of erosive cases). (3) Potassium-Competitive Acid Blockers (P-CABs; Vonoprazan 20 mg daily; rapid, reversible, acid-independent proton pump inhibition). (4) H. Pylori Eradication Therapy: Bismuth Quadruple Therapy (PPI BID + Bismuth subsalicylate + Metronidazole + Tetracycline for 14 days). (5) Antireflux Surgical Interventions: Laparoscopic Nissen Fundoplication or Magnetic Sphincter Augmentation (LINX device) for severe refractory GERD with hiatal hernia.",
    homeopathicApproach:
      "Homeopathic constitutional and acid-relieving remedies (such as Nux Vomica, Robinia Pseudacacia, Iris Versicolor, Carbo Vegetabilis, Lycopodium Clavatum, Natrum Phosphoricum, Phosphorus, Arsenicum Album, Pulsatilla Nigricans, Capsicum Annuum) serve as supportive care to ease heartburn sensations, soothe acid reflux burning, and support stomach comfort alongside dietary modifications, antacid rescue, and physician monitoring.",
    lifestyleAdvice:
      "Elevate the head of your bed by 6 to 8 inches (15–20 cm) using specialized bed risers or a firm wedge pillow (extra pillows only bend the neck and increase abdominal pressure), avoid eating any food or snacks within 3 hours of going to sleep, consume smaller, frequent meals rather than large, heavy dinners, strictly eliminate personal dietary triggers (spicy curries, deep-fried snacks, citrus, chocolate, coffee, alcohol, and sodas), avoid tight belts or restrictive waistbands that squeeze the stomach, quit cigarette smoking, and maintain a healthy body weight.",
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
        question: "How do I know if my chest burning is simple acid reflux or a heart attack?",
        answer: "Never assume chest pain is just heartburn. If your chest discomfort is a heavy crushing pressure, squeezing, tightness, or burning that radiates to your left arm, neck, jaw, or back, or is accompanied by shortness of breath, cold sweating, or dizziness, call emergency 911 immediately. An emergency electrocardiogram (ECG) is mandatory to rule out a life-threatening heart attack."
      },
      {
        question: "Why should I take my PPI medication 30 minutes before breakfast rather than at bedtime?",
        answer: "Proton Pump Inhibitors (like omeprazole or pantoprazole) only work on active acid pumps. In the morning after an overnight fast, your stomach activates thousands of resting acid pumps in anticipation of breakfast. Taking your PPI 30 minutes before your first meal ensures maximum drug concentration in your blood when the pumps turn on."
      }
    ],
    redFlags: [
      "Acute Perforated Peptic Ulcer / Peritonitis: sudden, catastrophic, excruciating, knife-like epigastric pain that rapidly spreads across the entire abdomen, producing a rock-hard 'board-like' rigid abdomen, extreme rebound tenderness, high fever, and subdiaphragmatic free air on upright abdominal radiograph (surgical emergency requiring emergent exploratory laparotomy and omental patch repair)",
      "Massive Upper Gastrointestinal Hemorrhage: vomiting bright red blood or dark coffee-ground emesis (hematemesis), passing large volumes of black tarry stools (melena), syncope, severe pallor, and hypovolemic shock (life-threatening emergency requiring STAT IV resuscitation, blood transfusion, and emergency endoscopic thermal/clip hemostasis)",
      "Boerhaave Syndrome (Transmural Esophageal Rupture): severe tearing chest and upper back pain following forceful unprovoked retching, accompanied by subcutaneous neck crepitus, fever, and shock (life-threatening surgical emergency)",
      "New-Onset Dysphagia (food sticking in the esophagus), painful swallowing (odynophagia), or rapid unintentional weight loss in an adult (requires urgent upper endoscopy to rule out Esophageal Adenocarcinoma or advanced Peptic Stricture)"
    ]
  },
  claimCitations: [
    { claimId: "D0075-TRADITIONAL-PROFILE", statement: "Homeopathic hyperacidity profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0075-TRADITIONAL-PROFILE" },
    { claimId: "D0075-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for acute ulcer perforation emergency surgery, upper GI bleed endoscopic clipping, or esophageal cancer resection.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0075-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0075-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for perforated peptic ulcers, upper gastrointestinal hemorrhage, or cardiac chest pain.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden severe knife-like abdominal pain with board-like rigidity indicating perforated peptic ulcer requiring emergency laparotomy",
    "Vomiting bright red blood or passing black tarry stools indicating massive upper gastrointestinal hemorrhage requiring emergency endoscopy",
    "Severe crushing retrosternal chest pain radiating to arm or jaw requiring emergency ECG to rule out myocardial infarction"
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
  tags: ["Hyperacidity", "Acid Dyspepsia", "Heartburn", "Acid Reflux", "GERD", "Pyrosis", "Gastric Acid", "Disease", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hyperacidity",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive parietal cell acid secretagogue pathways, mucosal barrier breakdown, and PPI clinical boundaries, perforated ulcer/GI bleed red flags, and verified citations"],
  clinicalPearl: "Always rule out acute coronary syndrome with an emergency ECG in any patient presenting with severe atypical acute burning chest pain.",
  quickFacts: {
    "Key Pathophysiology": "Imbalance Between Aggressive Luminal Acid/Pepsin and Protective Mucosal Defense",
    "Primary System": "Upper Gastrointestinal Tract & Gastric Mucosa (Gastroenterology / Hepatology)",
    "Diagnostic Standard": "Clinical Symptoms, Upper Endoscopy (EGD for Alarm Signs), & 24h pH Monitoring",
    "Clinical Character": "Parietal cell hydrochloric acid hypersecretion causing substernal burning and acid dyspepsia"
  },
  aiReadiness: {
    retrievalSummary: "Hyperacidity is excess stomach acid causing heartburn, burning stomach pain, and sour burping, managed with supportive care, dietary changes, antacids, and medical PPI therapy.",
    clinicalSummary: "Hyperacidity pathophysiology involves parietal cell acid hypersecretion (histamine/gastrin pathways) and mucosal barrier breakdown (NSAIDs, H. pylori). Homeopathic remedies serve as supportive digestive care and do not replace PPI acid suppression, H. pylori eradication, or emergency surgery/endoscopy for perforated peptic ulcers, GI bleeding, or myocardial infarction.",
    patientSummary: "Hyperacidity happens when your stomach makes too much digestive acid, causing a burning feeling in your chest (heartburn) and sour burps, improved by eating smaller non-spicy meals, not lying down after eating, and antacids.",
    studentSummary: "Imbalance of aggressive (HCl, pepsin, H. pylori, NSAIDs) vs defensive (mucus, HCO3-, PGE2) factors. Triad of secretagogues: Gastrin, Histamine (H2), Acetylcholine (M3). First-line: antacids, H2RAs, PPIs (30 min before breakfast). Rule out cardiac ischemia in acute chest burning. Red flags: perforated peptic ulcer (rigid abdomen), massive GI hemorrhage, and Boerhaave syndrome.",
    keywords: ["hyperacidity", "heartburn", "acid reflux", "acid dyspepsia", "sour burps water brash", "epigastric burning", "antacids proton pump inhibitor"],
    semanticKeywords: ["gastric acid hyperchlorhydria", "parietal cell proton pump hypersecretion", "mucosal acid barrier erosion"],
    icd: "K30",
    mesh: "D005756",
    bodySystem: "Gastroenterology & Digestive Health",
    urgency: "routine"
  }
};
