import { KnowledgeEntity } from "../../types";

export const PepticUlcerDisease: KnowledgeEntity = {
  id: "D0049",
  slug: "peptic-ulcer",
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
    en: "Peptic Ulcer Disease (Gastric & Duodenal Ulcer / PUD)",
    hi: "पेप्टिक अल्सर / पेट व आंत का छाला (Peptic Ulcer Disease)",
    gu: "પેપ્ટીક અલ્સર / પેટ અને આંતરડાના ચાંદા (Peptic Ulcer Disease)",
    mr: "पेप्टिक अल्सर / पोटातील व्रण व अल्सर (Peptic Ulcer Disease)",
    es: "Úlcera Péptica (Úlcera Gástrica y Duodenal)",
    ar: "مرض القرحة الهضمية (Peptic Ulcer Disease)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Peptic Ulcer Disease (PUD), covering Helicobacter pylori infection, NSAID-induced mucosal injury, gastric and duodenal ulcer distinctions, constitutional homeopathic supportive management, and emergency red flags for gastrointestinal perforation, peritonitis, and massive upper GI hemorrhage.",
    hi: "पेप्टिक अल्सर (पेट व ग्रहणी के छाले) का हेलिकोबैक्टर पाइलोरी पैथोलॉजी, दर्द निवारक दवाओं (NSAIDs) से म्यूकोसल क्षति, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और अल्सर फटने (परफोरेशन) व खून की उल्टी (हेमाटेमेसिस) की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પેપ્ટીક અલ્સર (જઠર અને આંતરડાના ચાંદા) ની એચ. પાયલોરી બેક્ટેરિયલ પેથોલોજી, એસિડિટી અને બળતરા, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને હોજરી ફાટવા (પરફોરેશન) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "पेप्टिक अल्सर (पोटातील व लहान आतड्यातील अल्सर), पोटात जळजळ व तीव्र दुखणे, पारंपरिक होमिओपॅथिक पद्धत आणि अल्सर फुटून पोटात रक्तस्राव होण्याच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la úlcera péptica que cubre la infección por H. pylori, toxicidad por AINEs, manejo homeopático complementario y banderas rojas de perforación y hemorragia digestiva alta.",
    ar: "دليل سريري وتعليمي موثوق لمرض القرحة الهضمية يغطي عدوى الملوية البوابية وأضرار مضادات الالتهاب غير الستيرويدية والرعاية التكميلية وعلامات الخطر للثقب الهضمي والنزيف الحاد."
  },
  content: {
    overview:
      "Peptic Ulcer Disease (PUD) refers to focal mucosal defects penetrating through the muscularis mucosae into the deeper layers of the stomach wall (gastric ulcer) or the first portion of the duodenum (duodenal ulcer). Primarily driven by Helicobacter pylori bacterial colonization or mucosal cyclooxygenase-1 (COX-1) inhibition by nonsteroidal anti-inflammatory drugs (NSAIDs), it manifests clinically as gnawing, burning epigastric pain, postprandial dyspepsia, early satiety, nausea, and vomiting.",
    definition:
      "A disruption in the integrity of the gastric or duodenal mucosa characterized by a circumscribed ulceration measuring \u22655 mm in diameter, extending into the submucosa or muscularis propria due to caustic acid-peptic digestion.",
    causes: [
      "Helicobacter pylori infection (flagellated gram-negative microaerophilic bacterium producing urease, CagA/VacA cytotoxins, and chronic antral/corpus gastritis; accounts for ~70% of gastric ulcers and >85% of duodenal ulcers)",
      "Nonsteroidal Anti-inflammatory Drugs (NSAIDs, including aspirin, ibuprofen, naproxen, ketorolac, diclofenac; inhibit gastric mucosal prostaglandin synthesis via COX-1 suppression)",
      "Stress-related mucosal disease (severe physiological stress in ICU patients, sepsis, major trauma, extensive burns 'Curling ulcer', severe intracranial injury 'Cushing ulcer')",
      "Zollinger-Ellison syndrome (gastrinoma producing severe hypergastrinemia and refractory multiple atypical peptic ulcers)"
    ],
    riskFactors: [
      "Concurrent use of NSAIDs with systemic corticosteroids, anticoagulants, or antiplatelet agents (multiplies GI bleeding risk 4- to 12-fold)",
      "Tobacco smoking (inhibits pancreatic bicarbonate secretion, reduces mucosal blood flow, and accelerates ulcer recurrence)",
      "Chronic heavy alcohol consumption (direct mucosal barrier injury and stimulation of acid secretion)",
      "Advanced age (>65 years; higher prevalence of silent ulcers and severe complications)",
      "Prior history of documented peptic ulcer or upper gastrointestinal bleeding"
    ],
    symptoms: [
      "Epigastric pain: rhythmic, sharp, gnawing, burning, or aching discomfort located between the xiphoid process and umbilicus",
      "Duodenal ulcer classic pattern: pain occurs 2 to 3 hours after meals or during the night (typically between 11 PM and 2 AM) and is characteristically relieved by food ingestion or antacids",
      "Gastric ulcer classic pattern: pain is often worsened or triggered soon after eating (within 15–30 minutes), leading to food avoidance and weight loss",
      "Postprandial bloating, abdominal distension, belching, early satiety, and nausea",
      "Occult blood in stool or iron deficiency anemia from chronic microscopic ulcer oozing"
    ],
    diagnosis:
      "Esophagogastroduodenoscopy (EGD / upper endoscopy) is the definitive gold standard diagnostic investigation, allowing direct visualization of ulcer depth, size, and location, and mandatory multiple biopsies of gastric ulcers to exclude gastric adenocarcinoma or lymphoma. H. pylori testing includes urea breath test (UBT), stool antigen test (HpSA), or endoscopic mucosal biopsy with rapid urease testing (RUT / CLO test).",
    differentialDiagnosis:
      "Differentiate Peptic Ulcer Disease from Functional Dyspepsia, Gastroesophageal Reflux Disease (GERD), Biliary Colic / Acute Cholecystitis, Acute or Chronic Pancreatitis, Gastric Malignancy, Mesenteric Ischemia, and Coronary Artery Disease (inferior wall myocardial infarction presenting as epigastric burning).",
    conventionalManagement:
      "First-line medical therapy involves Proton Pump Inhibitors (PPIs: omeprazole, pantoprazole, esomeprazole; 4–8 weeks) to achieve gastric acid suppression. H. pylori eradication utilizes quadruple therapy (bismuth subcitrate + metronidazole + tetracycline + PPI for 14 days, or concomitant non-bismuth quadruple therapy). Discontinuation of offending NSAIDs or co-prescription of gastroprotective agents (PPIs, misoprostol). Endoscopic hemostasis (hemoclips, thermal coagulation, epinephrine injection) is indicated for actively bleeding ulcers.",
    homeopathicApproach:
      "Homeopathic constitutional and gastrointestinal remedies (such as Nux Vomica, Argentum Nitricum, Arsenicum Album, Hydrastis Canadensis, Phosphorus, Robinia Pseudacacia, Anacardium Orientale, Kali Bichromicum) serve as supportive care to soothe burning dyspepsia, ease nervous digestive irritability, and assist mucosal comfort alongside endoscopic evaluation and conventional H. pylori eradication therapy.",
    lifestyleAdvice:
      "Strictly avoid NSAIDs and aspirin unless medically prescribed (substitute acetaminophen for simple pain relief where appropriate), eliminate cigarette smoking and tobacco use, abstain from heavy alcohol consumption, eat regular balanced meals rather than large heavy late-night meals, and practice stress-reduction techniques.",
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
        question: "How do stomach ulcers differ from duodenal ulcers in pain timing?",
        answer: "Stomach (gastric) ulcer pain is typically aggravated soon after eating when stomach acid is secreted over food. Duodenal ulcer pain is classically relieved by eating and returns 2 to 3 hours later when the stomach empties acid into the duodenum, often waking patients at night."
      },
      {
        question: "Does spicy food cause peptic ulcers?",
        answer: "No. Spicy foods may irritate existing ulcers and cause temporary indigestion or discomfort, but they do not cause ulcers. The primary causes are H. pylori bacterial infection and NSAID painkiller medications."
      }
    ],
    redFlags: [
      "Acute Perforated Peptic Ulcer: sudden, catastrophic, explosive epigastric pain rapidly spreading across the entire abdomen, accompanied by rigid 'board-like' abdominal wall, rebound tenderness, and subdiaphragmatic free air on upright abdominal X-ray (surgical emergency requiring emergency laparoscopy/laparotomy)",
      "Massive Upper Gastrointestinal Hemorrhage: vomiting frank bright red blood or dark 'coffee-ground' emesis (hematemesis), or passing dark, tarry, sticky foul-smelling stools (melena), accompanied by tachycardia, dizziness, or hypovolemic shock (requires emergency endoscopic hemostasis and blood resuscitation)",
      "Gastric Outlet Obstruction (GOO): intractable projectile vomiting of undigested food eaten hours earlier, severe weight loss, and visible abdominal peristalsis due to chronic pyloric cicatricial scarring"
    ]
  },
  claimCitations: [
    { claimId: "D0049-TRADITIONAL-PROFILE", statement: "Homeopathic peptic ulcer profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0049-TRADITIONAL-PROFILE" },
    { claimId: "D0049-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for H. pylori eradication, endoscopic clipping, or perforated ulcer surgery.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0049-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0049-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for gastrointestinal perforation, hematemesis, or hypovolemic shock.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden explosive abdominal pain with board-like rigidity indicating acute gastrointestinal perforation requiring emergency surgery",
    "Hematemesis (vomiting blood) or melena (black tarry stool) with tachycardia and shock indicating massive upper GI hemorrhage",
    "Intractable vomiting and rapid weight loss indicating gastric outlet obstruction"
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
  tags: ["Peptic Ulcer Disease", "Gastric Ulcer", "Duodenal Ulcer", "PUD", "Disease", "Epigastric Pain", "H Pylori", "Dyspepsia", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/peptic-ulcer",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive gastroduodenal ulcer clinical boundaries, GI bleeding/perforation red flags, and verified citations"],
  clinicalPearl: "Every gastric ulcer visualized on endoscopy must be biopsied and followed to complete endoscopic healing to rigorously exclude early gastric adenocarcinoma.",
  quickFacts: {
    "Lifetime Prevalence": "Approximately 5% to 10% in the general population globally",
    "Primary System": "Gastrointestinal System (Gastroenterology / Upper GI)",
    "Diagnostic Standard": "Upper Endoscopy (Esophagogastroduodenoscopy / EGD) with Biopsy",
    "Clinical Character": "Acid-peptic mucosal defect in stomach or duodenum driven by H. pylori or NSAIDs"
  },
  aiReadiness: {
    retrievalSummary: "Peptic Ulcer Disease is an ulceration of the stomach or duodenal lining caused by H. pylori infection or NSAID use, presenting with burning epigastric pain, managed with supportive care, PPI acid suppression, and conventional antibiotic therapy.",
    clinicalSummary: "Peptic Ulcer Disease pathophysiology involves mucosal breakdown from H. pylori cytotoxins or NSAID COX-1 prostaglandin inhibition. Homeopathic remedies serve as supportive digestive care and do not replace emergency endoscopic hemostasis, surgery, or quadruple antibiotic therapy for active bleeding, perforation, or H. pylori infection.",
    patientSummary: "A peptic ulcer is a sore in the lining of the stomach or upper small intestine that causes burning stomach pain between meals or at night, heartburn, and bloating, usually caused by bacteria or painkiller medications.",
    studentSummary: "Caused primarily by H. pylori and NSAIDs. Differentiate gastric ulcer (pain worse with food) from duodenal ulcer (pain relieved by food, nocturnal pain). Red flags: perforation (board-like rigidity) and massive upper GI bleeding (hematemesis/melena).",
    keywords: ["peptic ulcer", "gastric ulcer", "duodenal ulcer", "pud", "stomach ulcer", "epigastric pain", "h pylori", "burning stomach"],
    semanticKeywords: ["acid peptic disease", "helicobacter pylori gastritis", "upper gastrointestinal ulceration"],
    icd: "K27.9",
    mesh: "D010437",
    bodySystem: "Gastroenterology",
    urgency: "routine"
  }
};
