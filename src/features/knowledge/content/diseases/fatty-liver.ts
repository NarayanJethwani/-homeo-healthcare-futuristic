import { KnowledgeEntity } from "../../types";

export const FattyLiverDisease: KnowledgeEntity = {
  id: "D0048",
  slug: "fatty-liver",
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
    en: "Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD / NAFLD / Fatty Liver)",
    hi: "फैटी लिवर रोग / हेपेटिक स्टीटोसिस (MASLD / NAFLD / Fatty Liver)",
    gu: "ફેટી લિવર / લીવર પર ચરબી જમા થવી (Fatty Liver Disease / MASLD)",
    mr: "फॅटी लिव्हर / यकृतावर चरबी साचणे (Fatty Liver Disease / MASLD)",
    es: "Enfermedad Hepática Esteatósica Metabólica (EHMet / HGNA / Hígado Graso)",
    ar: "مرض الكبد الدهني المرتبط بالخلل الأيضي (MASLD / Fatty Liver)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD / NAFLD / NASH), covering hepatic triglyceride accumulation, lipotoxicity, necroinflammation, progressive fibrogenesis, constitutional homeopathic supportive management, and emergency red flags for decompensated cirrhosis, bleeding esophageal varices, and acute hepatic encephalopathy.",
    hi: "फैटी लिवर (MASLD / NAFLD) का हेपेटिक लिपिड संचय पैथोलॉजी, इंसुलिन रेजिस्टेंस, नॉन-अल्कोहलिक स्टीटोहेपेटाइटिस (NASH), फाइब्रोसिस, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और डीकंपेंसेटेड सिरोसिस व हेपेटिक एन्सेफैलोपैथी की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ફેટી લિવર રોગ (MASLD / NAFLD) ની લિપિડ પેથોલોજી, ઇન્સ્યુલિન રેઝિસ્ટન્સ, લિવરમાં ચરબી અને સોજો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને લિવર સિરોસિસ તથા કમળાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "फॅटी लिव्हर (MASLD / NAFLD), यकृतात चरबी साचणे व सूज, इन्सुलिन रेझिस्टन्स, पारंपरिक होमिओपॅथिक पद्धत आणि लिव्हर सिरॉसिसच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del hígado graso metabólico (MASLD/HGNA/EHNA) que cubre la lipotoxicidad, esteatohepatitis, fibrosis progresiva, manejo homeopático complementario y banderas rojas de cirrosis descompensada y várices esofágicas sangrantes.",
    ar: "دليل سريري وتعليمي موثوق لمرض الكبد الدهني المرتبط بالخلل الأيضي يغطي تراكم الدهون الكبدية والسمية الشحمية والتهاب الكبد التليفي والرعاية التكميلية وعلامات الخطر لتشمع الكبد غير المعاوض واعتلال الدماغ الكبدي."
  },
  content: {
    overview:
      "Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD; historically known as Non-Alcoholic Fatty Liver Disease [NAFLD]) is the most common chronic liver disease worldwide, affecting over 25% to 30% of the global adult population. Defined by the pathological accumulation of intracellular triglycerides within hepatocytes exceeding 5% of liver weight (hepatic steatosis) in individuals with cardiometabolic risk factors (obesity, type 2 diabetes, dyslipidemia, hypertension) and minimal or no alcohol consumption, it encompasses a wide histological spectrum from simple steatosis (MASL) to progressive Metabolic Dysfunction-Associated Steatohepatitis (MASH / NASH; characterized by hepatocyte ballooning, lobular necroinflammation, and progressive pericellular fibrosis), with potential advancement to cirrhosis, liver failure, and hepatocellular carcinoma (HCC).",
    definition:
      "A multisystem metabolic liver disorder characterized by hepatic steatosis on imaging or histology associated with at least one cardiometabolic risk factor (overweight/obesity, type 2 diabetes, elevated triglycerides, low HDL, or hypertension) in the absence of significant alcohol consumption or secondary causes of steatosis.",
    causes: [
      "Peripheral insulin resistance (adipose tissue lipolysis releases excessive free fatty acids [FFAs] delivered directly to the liver via the portal circulation)",
      "Enhanced hepatic de novo lipogenesis (DNL) driven by hyperinsulinemia and high dietary fructose consumption, alongside impaired mitochondrial beta-oxidation of fatty acids",
      "Lipotoxicity: intracellular accumulation of toxic lipid intermediates (diacylglycerols, ceramides, lysophosphatidylcholines) triggering endoplasmic reticulum (ER) stress, mitochondrial dysfunction, and reactive oxygen species (ROS) production",
      "Immune activation and hepatic stellate cell (HSC) transdifferentiation: Kupffer cell activation releases inflammatory cytokines (TNF-alpha, IL-6, IL-1beta) and TGF-beta, activating hepatic stellate cells to secrete excessive extracellular collagen matrix (progressive hepatic fibrosis)",
      "Gut-liver axis dysbiosis: increased intestinal permeability ('leaky gut') allows portal translocation of bacterial lipopolysaccharides (LPS / endotoxins), activating Toll-like receptor 4 (TLR4) in the liver"
    ],
    riskFactors: [
      "Overweight and central visceral adiposity (elevated waist circumference and BMI \u226525 kg/m^2; \u226523 kg/m^2 in Asian populations)",
      "Type 2 Diabetes Mellitus and Impaired Glucose Tolerance (present in >60–70% of diabetic patients)",
      "Dyslipidemia (elevated serum triglycerides \u2265150 mg/dL and low HDL cholesterol <40 mg/dL in men, <50 mg/dL in women)",
      "Essential systemic hypertension (\u2265130/85 mmHg or taking antihypertensive therapy)",
      "Genetic polymorphisms: PNPLA3 (I148M variant), TM6SF2, and MBOAT7 gene alleles conferring heightened susceptibility to steatohepatitis and fibrosis"
    ],
    symptoms: [
      "Asymptomatic 'silent' disease: the overwhelming majority of patients have no overt symptoms and are discovered incidentally during routine health checks with elevated liver transaminases or ultrasound findings",
      "Non-specific constitutional symptoms: chronic mild fatigue, general malaise, sluggishness, and daytime low energy",
      "Right upper quadrant (RUQ) abdominal discomfort: dull, vague dragging sensation or fullness below the right rib cage due to stretching of Glisson's liver capsule",
      "Advanced symptoms (in patients developing progressive MASH fibrosis and cirrhosis): mild scleral icterus (yellow eyes), palmar erythema, spider angiomas on the chest, digital clubbing, mild ankle edema, and easy skin bruising"
    ],
    diagnosis:
      "Diagnosed through a combination of imaging, laboratory biomarkers, and non-invasive fibrosis risk scoring: (1) Abdominal Ultrasound (demonstrating increased hepatic parenchymal echogenicity ['bright liver'], acoustic attenuation, and hepatomegaly). (2) Liver Function Tests (elevated serum ALT and AST with AST/ALT ratio <1 in early steatosis, reversing to AST/ALT >1 as advanced fibrosis develops; serum GGT and Ferritin frequently elevated). (3) Non-Invasive Fibrosis Scoring: FIB-4 Index (combining Age, AST, ALT, and Platelet count; FIB-4 <1.30 rules out advanced fibrosis with >90% NPV; FIB-4 >2.67 indicates high risk of advanced fibrosis F3/F4) and NAFLD Fibrosis Score. (4) Transient Elastography (FibroScan / Shear Wave Elastography; measuring Liver Stiffness Measurement [LSM in kPa] and Controlled Attenuation Parameter [CAP score in dB/m]). Liver Biopsy remains the histological reference gold standard.",
    differentialDiagnosis:
      "Differentiate MASLD/NAFLD from Alcohol-Related Liver Disease (ARLD; AST/ALT ratio >2, elevated GGT/MCV, and significant alcohol history >20–30 g/day), Chronic Viral Hepatitis B and C (positive HBsAg, Anti-HCV, HCV RNA), Autoimmune Hepatitis (elevated IgG, ANA, ASMA), Hereditary Hemochromatosis (transferrin saturation >45%, elevated ferritin, HFE mutation), Wilson's Disease (ceruloplasmin, Kayser-Fleischer rings in young patients), Alpha-1 Antitrypsin Deficiency, and Drug-Induced Liver Injury (methotrexate, tamoxifen, amiodarone, corticosteroids).",
    conventionalManagement:
      "Lifestyle modification and cardiometabolic risk factor control form the foundation of management across all international hepatology guidelines (AASLD, EASL): (1) Dietary intervention: Mediterranean diet, restriction of refined carbohydrates and high-fructose corn syrup, and elimination of sugary beverages. (2) Weight loss targets: 3% to 5% total body weight loss reduces simple steatosis; 7% to 10% weight loss reverses steatohepatitis (MASH) and induces fibrosis regression. (3) Physical exercise: 150–300 minutes of moderate-intensity aerobic exercise plus 2 weekly resistance training sessions. (4) Pharmacotherapy: Resmetirom (thyroid hormone receptor-beta [THR-beta] agonist; first FDA-approved medication for non-cirrhotic MASH with moderate-to-advanced fibrosis), GLP-1 receptor agonists (semaglutide, tirzepatide; for patients with comorbid diabetes/obesity), Vitamin E (800 IU/day in non-diabetic biopsy-proven MASH), and pioglitazone.",
    homeopathicApproach:
      "Homeopathic constitutional and hepatic organ-drainage remedies (such as Chelidonium Majus, Carduus Marianus, Lycopodium Clavatum, Nux Vomica, Phosphorus, Taraxacum Officinale, Natrum Sulphuricum, Leptandra Virginica, Chionanthus Virginica) serve as supportive care to assist metabolic sluggishness, relieve right hypochondriac fullness, and support digestive function alongside structured Mediterranean diet, regular exercise, weight management, and hepatology fibrosis screening.",
    lifestyleAdvice:
      "Adopt a strict Mediterranean dietary pattern emphasizing extra-virgin olive oil, avocados, green leafy vegetables, nuts, legumes, and wild fatty fish, strictly eliminate sugar-sweetened beverages, fruit juices, and processed snacks containing high-fructose corn syrup, completely abstain from alcohol consumption to protect vulnerable hepatocytes, engage in at least 30 minutes of brisk walking 5 days a week, and drink 2 to 3 cups of unsweetened black or green coffee daily (proven to reduce hepatic fibrosis progression).",
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
        question: "Why is drinking coffee beneficial for fatty liver disease?",
        answer: "Multiple large clinical studies show that drinking 2 to 3 cups of unsweetened coffee daily is strongly protective for liver health. Bioactive coffee polyphenols and diterpenes reduce hepatic oxidative stress, suppress inflammatory cytokine production, and significantly slow down the progression of liver fibrosis in patients with MASLD."
      },
      {
        question: "Can fatty liver disease be completely reversed?",
        answer: "Yes. Early stages of fatty liver (steatosis and mild steatohepatitis) are completely reversible with a 7% to 10% loss of total body weight, adopting a Mediterranean diet, eliminating liquid sugars, and exercising regularly. Even early liver fibrosis can regress over time with sustained metabolic improvement."
      }
    ],
    redFlags: [
      "Decompensated Cirrhosis: sudden onset of gross abdominal ascites (fluid distension), bilateral pitting pedal edema, and jaundice (requires emergency hepatology admission and paracentesis)",
      "Upper Gastrointestinal Variceal Hemorrhage: vomiting frank blood (hematemesis), 'coffee-ground' vomitus, or passing black tarry stools (melena) from ruptured esophageal varices (life-threatening medical emergency requiring immediate emergency endoscopic band ligation and blood transfusion)",
      "Acute Hepatic Encephalopathy: sudden severe confusion, cognitive disorientation, reversed sleep-wake cycles, flapping hand tremor (asterixis), lethargy, or coma (requires immediate emergency hospital admission and lactulose therapy)",
      "Spontaneous Bacterial Peritonitis (SBP): fever, chills, and diffuse abdominal tenderness in a patient with pre-existing ascites"
    ]
  },
  claimCitations: [
    { claimId: "D0048-TRADITIONAL-PROFILE", statement: "Homeopathic fatty liver profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0048-TRADITIONAL-PROFILE" },
    { claimId: "D0048-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for histological fibrosis reversal, variceal bleeding ligation, or liver transplantation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0048-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0048-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for bleeding esophageal varices, decompensated cirrhosis, or hepatic encephalopathy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Vomiting frank blood (hematemesis) or passing black tarry stools (melena) indicating bleeding esophageal varices requiring emergency endoscopy",
    "Rapid development of ascites and jaundice indicating decompensated cirrhosis",
    "Acute confusion, disorientation, and flapping tremor (asterixis) indicating hepatic encephalopathy requiring emergency medical hospitalization"
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
  tags: ["Fatty Liver", "MASLD", "NAFLD", "NASH", "Disease", "Hepatic Steatosis", "Liver Enzymes", "Metabolic Syndrome", "Hepatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/fatty-liver",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive MASLD/MASH hepatology clinical boundaries, cirrhosis/variceal bleeding red flags, and verified citations"],
  clinicalPearl: "Calculate the FIB-4 index in every patient with fatty liver on ultrasound; a FIB-4 score <1.30 has a >90% negative predictive value for ruling out advanced liver fibrosis.",
  quickFacts: {
    "Global Prevalence": "Estimated 25% to 30% of the world adult population (rising rapidly with obesity and diabetes)",
    "Primary System": "Hepatobiliary & Metabolic System (Hepatology / Metabolism)",
    "Diagnostic Standard": "Abdominal Ultrasound, FIB-4 Score, & Transient Elastography (FibroScan)",
    "Clinical Character": "Metabolic accumulation of triglycerides in hepatocytes with potential progression to steatohepatitis and fibrosis"
  },
  aiReadiness: {
    retrievalSummary: "MASLD (Fatty Liver Disease) is the accumulation of excess fat in the liver linked to metabolic syndrome, managed with supportive care, weight loss, Mediterranean diet, exercise, and hepatology monitoring.",
    clinicalSummary: "MASLD pathophysiology involves insulin resistance, lipotoxicity, Kupffer cell inflammation, and hepatic stellate cell fibrogenesis. Homeopathic remedies serve as supportive hepatic care and do not replace structured weight loss, FIB-4/FibroScan risk stratification, or emergency care for bleeding esophageal varices, ascites, or hepatic encephalopathy.",
    patientSummary: "Fatty liver disease happens when excess fat builds up in liver cells due to metabolic factors like weight gain and insulin resistance, successfully reversed with healthy eating (Mediterranean diet), daily walking, and weight loss.",
    studentSummary: "MASLD criteria require hepatic steatosis plus \u22651 cardiometabolic risk factor. Spectrum: simple steatosis \u2192 MASH \u2192 fibrosis \u2192 cirrhosis. Screen with FIB-4 score. 7-10% weight loss reverses steatohepatitis. Red flags: variceal bleeding and hepatic encephalopathy.",
    keywords: ["fatty liver", "masld", "nafld", "nash", "hepatic steatosis", "fibro scan", "elevated alt", "fib4 score"],
    semanticKeywords: ["metabolic dysfunction associated steatotic liver disease", "nonalcoholic steatohepatitis", "hepatic lipotoxicity"],
    icd: "K76.0",
    mesh: "D065626",
    bodySystem: "Hepatology & Gastroenterology",
    urgency: "routine"
  }
};
