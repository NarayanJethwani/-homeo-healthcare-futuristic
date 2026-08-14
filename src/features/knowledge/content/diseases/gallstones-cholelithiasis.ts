import { KnowledgeEntity } from "../../types";

export const GallstonesCholelithiasisDisease: KnowledgeEntity = {
  id: "D0060",
  slug: "gallstones-cholelithiasis",
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
    en: "Cholelithiasis & Biliary Colic (Gallbladder Stones / Gallstone Disease)",
    hi: "पित्त की पथरी / पित्ताशय की पथरी (Gallstones / Cholelithiasis)",
    gu: "પિત્તાશયની પથરી / ગોલસ્ટોન (Gallstones / Cholelithiasis)",
    mr: "पित्ताशयातील खडे / पित्ताचे खडे (Gallstones / Cholelithiasis)",
    es: "Colelitiasis y Cólico Biliar (Cálculos en la Vesícula Biliar)",
    ar: "حصوات المرارة والقولنج المراري (Cholelithiasis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Cholelithiasis and Biliary Colic, covering cholesterol supersaturation, gallbladder hypomotility, cystic duct obstruction, constitutional homeopathic supportive management, and emergency red flags for acute ascending cholangitis (Charcot's triad), acute gallstone pancreatitis, and acute gangrenous cholecystitis.",
    hi: "पित्त की पथरी (कोलेलिथियासिस / पित्ताशय की पथरी) का कोलेस्ट्रॉल सुपर-सैचुरेशन पैथोलॉजी, बिलियरी कोलिक दर्द, सिस्टिक डक्ट रुकावट, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और एक्यूट एक्यूट कोलेंजाइटिस (चारकॉट ट्रायड), पैन्क्रियाटाइटिस व पित्ताशय फटने की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પિત્તાશયની પથરી (કોલેલિથિઆસિસ) ની બાઇલ પેથોલોજી, જમણી બાજુ પેટનો અસહ્ય દુખાવો (બિલિયરી કોલિક), પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પિત્તાશયમાં પરુ, સોજો (કોલેસિસટાઇટિસ) તથા કમળાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "पित्ताशयातील खडे (Cholelithiasis), उजव्या बरगडीखाली तीव्र कळ (Biliary Colic), चरबीयुक्त जेवणानंतर वाढणारा त्रास, पारंपरिक होमिओपॅथिक पद्धत आणि अ‍ॅक्युट कोलेसिस्टिटिस व कावीळच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la colelitiasis y cólico biliar que cubre la sobresaturación de colesterol, obstrucción del conducto cístico, manejo homeopático complementario y banderas rojas de colangitis aguda (tríada de Charcot) y pancreatitis biliar.",
    ar: "دليل سريري وتعليمي موثوق لحصوات المرارة والمغص المراري يغطي فرط تشبع الكوليسترول وانسداد القناة المرارية والرعاية التكميلية وعلامات الخطر لالتهاب القنوات الصفراوية الحاد والتهاب البنكرياس الحصوي."
  },
  content: {
    overview:
      "Cholelithiasis (gallstone disease) is a very common hepatobiliary condition characterized by the formation of solid crystalline concretions (calculi) within the lumen of the gallbladder. Driven by an imbalance in biliary chemical composition (cholesterol supersaturation, gallbladder hypomotility, and accelerated crystallization), gallstones range from asymptomatic silent stones to symptomatic Biliary Colic—a severe, episodic, crescendo-decrescendo visceral pain in the epigastrium or right upper quadrant (RUQ) radiating to the right infrascapular region, typically triggered 30 to 90 minutes following a fatty, heavy meal due to transient impaction of a stone in the neck of the gallbladder (Hartmann's pouch) or cystic duct.",
    definition:
      "The presence of solid crystalline stones (cholesterol, black pigment, or brown pigment stones) inside the gallbladder, categorized clinically into asymptomatic cholelithiasis, uncomplicated symptomatic cholelithiasis (biliary colic), and complicated gallstone disease (acute cholecystitis, choledocholithiasis, cholangitis, gallstone pancreatitis).",
    causes: [
      "Cholesterol supersaturation: hepatic hypersecretion of cholesterol relative to solubilizing bile salts and phospholipids (lecithin), creating an unstable lithogenic bile microenvironment",
      "Gallbladder hypomotility and stasis: impaired gallbladder emptying and diminished cholecystokinin (CCK) receptor responsiveness allowing nucleated microcrystals to coalesce into macroscopic stones",
      "Accelerated cholesterol nucleation and crystallization facilitated by gallbladder mucin hypersecretion and inflammatory glycoproteins",
      "Pigment stone pathogenesis: Black pigment stones arise from chronic unconjugated hyperbilirubinemia (hemolytic anemias: sickle cell, thalassemia, hereditary spherocytosis, or cirrhosis); Brown pigment stones arise from chronic bacterial/parasitic biliary tract infections (E. coli, Clonorchis sinensis, Ascaris) producing bacterial beta-glucuronidase"
    ],
    riskFactors: [
      "The classic 'Female, Forty, Fertile, Fat' risk triad (female gender, age \u226540 years, multiparity/estrogen exposure, and obesity)",
      "Rapid, dramatic weight loss (bariatric surgery or severe very-low-calorie fasting mobilizing peripheral cholesterol and slowing gallbladder motility)",
      "Total Parenteral Nutrition (TPN) and prolonged fasting (absence of enteral stimulation causes profound biliary stasis)",
      "Medications: oral contraceptives, hormone replacement therapy (estrogen upregulates hepatic cholesterol secretion), fibrates, and ceftriaxone (biliary pseudolithiasis)",
      "Underlying hemolytic disorders (sickle cell disease) and terminal ileal disease (Crohn's resection impairing bile acid reabsorption)"
    ],
    symptoms: [
      "Episodic Biliary Colic: intense, severe, steady aching or squeezing pain located in the epigastrium or right upper quadrant (RUQ), lasting from 30 minutes up to 4 to 6 hours",
      "Right infrascapular radiation: pain radiating around the right costal margin to the right shoulder blade, right mid-back, or interscapular region (Boeas sign)",
      "Postprandial exacerbation: sudden onset characteristically triggered 30 to 90 minutes following a rich, fried, or high-fat meal",
      "Associated symptoms: profound nausea, non-projectile vomiting, diaphoresis, restless tossing during pain paroxysms, and postprandial bloating/dyspepsia",
      "Asymptomatic 'silent' gallstones: >70% to 80% of individuals with gallstones remain entirely asymptomatic throughout their lifetime and are detected incidentally on routine abdominal imaging"
    ],
    diagnosis:
      "Transabdominal Ultrasound (USG Abdomen) is the undisputed first-line imaging modality of choice (sensitivity and specificity >95% for detection of gallbladder stones \u22652 mm). Diagnostic sonographic criteria include: echogenic intraluminal foci casting strong posterior acoustic shadows, gravitational mobility (stones shifting positions with patient repositioning), and evaluation for complications (gallbladder wall thickening \u22653 mm, pericholecystic fluid, and sonographic Murphy's sign indicating acute cholecystitis). Magnetic Resonance Cholangiopancreatography (MRCP) or Endoscopic Ultrasound (EUS) is indicated if choledocholithiasis (common bile duct stones) is suspected.",
    differentialDiagnosis:
      "Differentiate Cholelithiasis from Peptic Ulcer Disease / Perforation, Acute Pancreatitis (epigastric pain radiating straight through to the mid-back with markedly elevated lipase), Acute Appendicitis, Gastroesophageal Reflux Disease (GERD), Right-sided Nephrolithiasis (flank pain with hematuria), Sphincter of Oddi Dysfunction, and Acute Coronary Syndrome (inferior wall myocardial infarction presenting as epigastric pain).",
    conventionalManagement:
      "Asymptomatic gallstones generally require watchful waiting without prophylactic intervention. Symptomatic cholelithiasis (recurrent biliary colic) is definitively treated with Laparoscopic Cholecystectomy (surgical removal of the gallbladder), which is the international gold standard. Acute cholecystitis mandates urgent hospital admission, IV fluid resuscitation, broad-spectrum IV antibiotics, and early laparoscopic cholecystectomy within 24 to 72 hours of admission. Choledocholithiasis requires Endoscopic Retrograde Cholangiopancreatography (ERCP) with biliary sphincterotomy and stone extraction. Medical dissolution therapy with Oral Ursodeoxycholic Acid (UDCA) is reserved strictly for select non-surgical candidates with small (<5–10 mm), radiolucent, pure cholesterol stones and a functioning gallbladder with a patent cystic duct.",
    homeopathicApproach:
      "Homeopathic constitutional and hepatobiliary remedies (such as Chelidonium Majus, Lycopodium Clavatum, Carduus Marianus, Berberis Vulgaris, Nux Vomica, Dioscorea Villosa, Hydrastis Canadensis, Phosphorus, Chionanthus Virginica) serve as supportive care to ease postprandial biliary spasms, relieve right hypochondriac heaviness, and support digestive comfort alongside low-fat dietary moderation, ultrasound monitoring, and surgical evaluation.",
    lifestyleAdvice:
      "Adopt a low-fat, high-fiber dietary pattern to avoid stimulating vigorous gallbladder contractions, eat small frequent meals at regular intervals (avoid prolonged fasting or skipping breakfast which worsens biliary stasis), avoid crash dieting and rapid weight loss (aim for a safe gradual weight loss of 0.5 to 1 kg per week), stay well hydrated, incorporate healthy unsaturated fats (extra-virgin olive oil) in moderation, and engage in daily physical exercise.",
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
        question: "Can gallstones dissolve naturally with lemon juice or olive oil 'gallbladder flushes'?",
        answer: "No. 'Gallbladder flushes' or 'liver detoxes' do not dissolve or pass gallstones. The green lumps passed in stool after a flush are simply solidified complexes of olive oil, lemon juice, and gastric acid formed in the intestines. Attempting to force stone passage with extreme fat flushes can trigger severe acute pancreatitis or bile duct obstruction."
      },
      {
        question: "Can a person live a normal life without a gallbladder after surgery?",
        answer: "Yes. The liver continues to produce bile normally without a gallbladder. Instead of being stored and concentrated between meals, bile flows continuously in a steady stream directly from the liver into the small intestine, allowing normal digestion."
      }
    ],
    redFlags: [
      "Acute Ascending Cholangitis: Charcot's triad (high spiking fevers with chills, right upper quadrant abdominal pain, and overt jaundice) or Reynolds' pentad (adding hypotension/shock and altered mental status; life-threatening surgical emergency requiring immediate emergency biliary decompression via ERCP and IV antibiotics)",
      "Acute Gallstone Pancreatitis: severe, agonizing epigastric pain radiating directly through to the back, intractable vomiting, and markedly elevated serum lipase/amylase (>3 times upper limit of normal; requires emergency hospital admission and intensive resuscitation)",
      "Acute Cholecystitis: constant severe right upper quadrant pain lasting >6 hours, high fever, localized peritoneal guarding, and positive Murphy's sign (arrest of inspiration on deep palpation under right costal margin; requires urgent hospitalization and laparoscopic cholecystectomy)",
      "Gallbladder Perforation: sudden transient relief of acute cholecystitis pain followed by generalized peritonitis, abdominal rigidity, and septic shock"
    ]
  },
  claimCitations: [
    { claimId: "D0060-TRADITIONAL-PROFILE", statement: "Homeopathic gallstone profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0060-TRADITIONAL-PROFILE" },
    { claimId: "D0060-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for laparoscopic cholecystectomy, ERCP stone extraction, or ascending cholangitis decompression.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0060-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0060-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute cholangitis, acute pancreatitis, or laparoscopic cholecystectomy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "High fever, right upper quadrant pain, and jaundice indicating acute ascending cholangitis (Charcot's triad) requiring emergency ERCP decompression",
    "Severe epigastric pain radiating to back with elevated lipase indicating acute gallstone pancreatitis",
    "Constant RUQ pain >6 hours with fever and positive Murphy's sign indicating acute cholecystitis requiring surgical admission"
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
  tags: ["Gallstones", "Cholelithiasis", "Biliary Colic", "Gallbladder Stones", "Disease", "Right Upper Quadrant Pain", "Murphy Sign", "Hepatobiliary"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gallstones-cholelithiasis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive biliary colic hepatobiliary clinical boundaries, cholangitis/pancreatitis red flags, and verified citations"],
  clinicalPearl: "Abdominal Ultrasound is the gold standard imaging for gallstones with >95% sensitivity; look for intraluminal echogenic foci with distinct posterior acoustic shadowing.",
  quickFacts: {
    "Lifetime Prevalence": "Present in 10% to 15% of the adult population (80% remain asymptomatic)",
    "Primary System": "Hepatobiliary System (Gastroenterology / Biliary Surgery)",
    "Diagnostic Standard": "Transabdominal Ultrasound (Echogenic Focus with Posterior Acoustic Shadowing)",
    "Clinical Character": "Formation of solid cholesterol or pigment stones in the gallbladder causing episodic biliary colic"
  },
  aiReadiness: {
    retrievalSummary: "Cholelithiasis (Gallstones) is the formation of stones in the gallbladder causing episodic right upper quadrant pain (biliary colic) after fatty meals, managed with supportive care, low-fat diet, ultrasound, and surgical evaluation.",
    clinicalSummary: "Cholelithiasis pathophysiology involves biliary cholesterol supersaturation, gallbladder hypomotility, and cystic duct obstruction. Homeopathic remedies serve as supportive hepatobiliary care and do not replace laparoscopic cholecystectomy, ERCP for choledocholithiasis, or emergency care for acute ascending cholangitis (Charcot's triad) or gallstone pancreatitis.",
    patientSummary: "Gallstones are hard pebble-like deposits in the gallbladder that cause sudden, severe pain under your right ribs after eating fatty foods (biliary colic), diagnosed by ultrasound and treated with a low-fat diet or gallbladder surgery if troublesome.",
    studentSummary: "Diagnosed with transabdominal ultrasound (>95% sensitivity). Pain radiates to right scapula. Uncomplicated biliary colic vs acute cholecystitis (Murphy's sign + fever). Red flags: Charcot's triad (cholangitis \u2192 emergency ERCP) and acute pancreatitis.",
    keywords: ["gallstones", "cholelithiasis", "biliary colic", "gallbladder stones", "ruq pain", "fatty food pain", "murphy sign", "cholecystitis"],
    semanticKeywords: ["gallbladder calculi", "biliary cholesterol supersaturation", "cystic duct obstruction"],
    icd: "K80.20",
    mesh: "D002769",
    bodySystem: "Hepatology & Gastroenterology",
    urgency: "routine"
  }
};
