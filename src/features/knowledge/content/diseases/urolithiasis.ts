import { KnowledgeEntity } from "../../types";

export const UrolithiasisDisease: KnowledgeEntity = {
  id: "D0030",
  slug: "urolithiasis",
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
    en: "Urolithiasis (Kidney & Urinary Tract Stones / Nephrolithiasis)",
    hi: "गुर्दे व मूत्र पथ की पथरी (Urolithiasis / Kidney Stones)",
    gu: "મૂત્રપિંડ અને પેશાબની પથરી (Urolithiasis / Renal Calculi)",
    mr: "मुतखडा / किडनी स्टोन (Urolithiasis / Renal Calculi)",
    es: "Urolitiasis (Cálculos Renales y Urinarios)",
    ar: "حصوات المسالك البولية والكلى (Urolithiasis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Urolithiasis, covering calcium oxalate, uric acid, and struvite stone pathogenesis, acute renal colic, constitutional homeopathic supportive management, and emergency red flags for acute urinary obstruction, hydronephrosis, and uroseptic shock.",
    hi: "मूत्र पथ की पथरी (किडनी स्टोन) का रासायनिक क्रिस्टलीकरण पैथोलॉजी, रीनल कॉलिक (तीव्र पेट व कमर दर्द), पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और ऑब्सट्रक्टिव यूरोसेप्सिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "મૂત્રપિંડની પથરી (કિડની સ્ટોન) ની કેલ્શિયમ-યુરિક સ્ફટિક પેથોલોજી, કમરથી જાંઘ તરફ જતો તીવ્ર દુખાવો (રીનલ કોલિક), પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પેશાબના અટકાવાથી થતા ચેપ (યુરોસેપ્સિસ) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "मुतखडा (Kidney Stone), पाठीतून जांघेकडे जाणारी तीव्र कळ (Renal Colic), लघवीतून रक्त येणे, पारंपरिक होमिओपॅथिक पद्धत आणि लघवी तुंबून होणाऱ्या इन्फेक्शनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la urolitiasis que cubre la litogénesis, cólico nefrítico agudo, manejo homeopático complementario y banderas rojas de urosepsis obstructiva.",
    ar: "دليل سريري وتعليمي موثوق لحصوات المسالك البولية يغطي نشأة الحصيات ومغص الكلى الحاد والرعاية التكميلية وعلامات الخطر للانسداد البولي الحاد والصدمة الإنتانية."
  },
  content: {
    overview:
      "Urolithiasis refers to the formation and presence of crystalline mineral deposits (calculi) anywhere within the urinary tract—including the renal pelvis and calyces (nephrolithiasis), ureter (ureterolithiasis), or bladder (cystolithiasis). The passage of a calculus down the ureter precipitates acute renal colic, marked by excruciating spasmodic flank and loin pain radiating toward the groin and external genitalia, accompanied by gross or microscopic hematuria, nausea, and diaphoresis.",
    definition:
      "A multifactorial metabolic and biophysical disorder characterized by the supersaturation, nucleation, aggregation, and retention of urinary solutes into solid calculi within the renal collecting system and urinary tract.",
    causes: [
      "Urinary supersaturation with lithogenic solutes (calcium, oxalate, phosphate, uric acid, cystine) exceeding solubility thresholds",
      "Deficiency of physiological urinary crystallization inhibitors (citrate, magnesium, pyrophosphate, nephrocalcin, Tamm-Horsfall glycoprotein)",
      "Urinary pH abnormalities: acidic urine (pH <5.5) promotes uric acid and cystine crystallization; alkaline urine (pH >7.2) promotes calcium phosphate and struvite formation",
      "Urea-splitting bacterial urinary infections (Proteus mirabilis, Klebsiella pneumoniae, Pseudomonas) producing triple phosphate 'struvite' or staghorn calculi"
    ],
    riskFactors: [
      "Chronic low fluid intake and chronic dehydration (concentrates urinary solutes)",
      "Dietary excesses: high animal protein (increases uric acid and lowers urinary citrate), high sodium (promotes hypercalciuria), high-oxalate foods (spinach, rhubarb, nuts, chocolate)",
      "Metabolic disorders: primary hyperparathyroidism, gout, renal tubular acidosis (Type 1), cystinuria, primary hyperoxaluria",
      "Gastrointestinal malabsorption: inflammatory bowel disease (Crohn's disease), gastric bypass surgery (causes enteric hyperoxaluria)",
      "Family history of nephrolithiasis and anatomical urinary tract stasis (pelviureteric junction obstruction, horseshoe kidney)"
    ],
    symptoms: [
      "Acute renal colic: severe, sudden, crescendo-decrescendo spasmodic flank and costovertebral angle pain that waxes and wanes",
      "Characteristic radiation: pain shoots anteriorly and downward from the flank into the lower quadrant, groin, labia, or testicle",
      "Hematuria: gross frank blood or microscopic red blood cells in the urine in >90% of acute presentations",
      "Urinary frequency, urgency, and strangury when the calculus reaches the distal ureterovesical junction (UVJ)",
      "Autonomic features: intense nausea, projectile vomiting, pale cold clammy perspiration, and motor restlessness (patient tosses and turns, unable to find a comfortable position)"
    ],
    diagnosis:
      "The diagnostic gold standard is non-contrast low-dose computed tomography of the abdomen and pelvis (NCCT KUB), which detects calculi of all compositions (including radiolucent uric acid stones) with >95% sensitivity and evaluates stone size, location, and degree of hydronephrosis. Supported by renal ultrasound, urinalysis (hematuria, crystal identification, urine pH), serum electrolytes, BUN, creatinine, and 24-hour urine metabolic evaluation.",
    differentialDiagnosis:
      "Differentiate Urolithiasis from Acute Appendicitis, Acute Diverticulitis, Ovarian Torsion, Ectopic Pregnancy, Ruptured Abdominal Aortic Aneurysm (AAA), Testicular Torsion, Acute Pyelonephritis, and Lumbar Disc Herniation.",
    conventionalManagement:
      "Acute medical expulsive therapy (MET) using alpha-blockers (tamsulosin) and NSAID analgesia for small uncomplicated ureteral calculi (<5–6 mm). Interventional urological procedures include Extracorporeal Shock Wave Lithotripsy (ESWL), Ureteroscopy (URS) with laser lithotripsy, and Percutaneous Nephrolithotomy (PCNL) for large (>20 mm) or staghorn calculi. Prevention utilizes potassium citrate (alkalinizer/inhibitor) and thiazide diuretics.",
    homeopathicApproach:
      "Homeopathic constitutional and drainage remedies (such as Berberis Vulgaris, Lycopodium Clavatum, Cantharis, Sarsaparilla, Hydrangea Arborescens, Ocimum Canum, Pareira Brava, Tabacum) serve as supportive care to relieve spasmodic colic, assist small gravel passage, and balance metabolic diathesis alongside urological imaging and hydration guidance.",
    lifestyleAdvice:
      "Consume sufficient water to maintain a daily urine output of at least 2 to 2.5 liters (aim for pale clear urine throughout the day), add fresh lemon juice to water (provides natural citrate), limit dietary sodium to <2,000 mg/day, maintain moderate calcium intake from dietary sources rather than calcium supplements, avoid high-oxalate foods in hyperoxaluric patients, and moderate animal protein consumption.",
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
        question: "What stone size can pass spontaneously through the urinary tract?",
        answer: "Calculi smaller than 4 to 5 mm have an approximately 70% to 80% chance of passing spontaneously with hydration and medical therapy. Stones larger than 7 mm rarely pass spontaneously and typically require urological intervention."
      },
      {
        question: "Should people with calcium kidney stones stop eating calcium-rich foods?",
        answer: "No. Dietary calcium binds to oxalate in the intestines, preventing oxalate absorption and urinary excretion. Restricting dietary calcium actually increases oxalate absorption and elevates stone risk."
      }
    ],
    redFlags: [
      "Obstructive urosepsis: severe flank pain accompanied by high fever, shaking rigors, tachycardia, hypotension, and clouded urine (urological emergency requiring emergency decompression with JJ stent or nephrostomy)",
      "Complete anuria or acute oliguria in a patient with a solitary kidney or bilateral ureteral obstruction",
      "Intractable vomiting preventing oral hydration and unremitting pain refractory to maximum analgesia",
      "Rapidly rising serum creatinine indicating acute post-renal acute kidney injury"
    ]
  },
  claimCitations: [
    { claimId: "D0030-TRADITIONAL-PROFILE", statement: "Homeopathic urolithiasis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0030-TRADITIONAL-PROFILE" },
    { claimId: "D0030-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for large staghorn stones, laser lithotripsy, or surgical decompression.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0030-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0030-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for obstructive urosepsis, complete urinary blockage, or acute kidney injury.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Flank pain accompanied by fever and chills indicating infected hydronephrosis / obstructive urosepsis requiring emergency stent decompression",
    "Complete anuria or acute renal shutdown in a solitary kidney or bilateral obstruction",
    "Severe unrelenting pain and persistent vomiting leading to hypovolemic shock"
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
  tags: ["Urolithiasis", "Kidney Stones", "Nephrolithiasis", "Disease", "Renal Colic", "Hematuria", "Urinary Calculi", "Urology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/urolithiasis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive urological metabolic clinical boundaries, uroseptic red flags, and verified citations"],
  clinicalPearl: "Fever in the presence of an obstructing ureteral calculus represents a surgical emergency (infected hydronephrosis) requiring immediate urological decompression.",
  quickFacts: {
    "Lifetime Risk": "Approximately 10–12% in men and 5–7% in women globally",
    "Primary System": "Urinary & Renal System (Urology / Nephrology)",
    "Diagnostic Standard": "Non-Contrast Low-Dose CT of Kidneys, Ureters, Bladder (NCCT KUB)",
    "Clinical Character": "Paroxysmal acute spasmodic renal colic with hematuria driven by urinary crystal supersaturation"
  },
  aiReadiness: {
    retrievalSummary: "Urolithiasis is the formation of stones in the urinary tract, causing acute spasmodic flank-to-groin colic and hematuria, managed with supportive constitutional care, high fluid intake, and conventional urological monitoring.",
    clinicalSummary: "Urolithiasis pathology involves urinary supersaturation with calcium oxalate, phosphate, or uric acid crystals. Homeopathic remedies serve as supportive metabolic care and do not replace emergency urological intervention or stenting for infected hydronephrosis, obstructive urosepsis, or anuria.",
    patientSummary: "Kidney stones are hard mineral deposits that form in the kidneys and cause intense waves of lower back and side pain radiating to the groin, blood in urine, and nausea as they travel down the urinary tube.",
    studentSummary: "Diagnosed via NCCT KUB. Stones <5 mm often pass with medical expulsive therapy (tamsulosin). The combination of an obstructing stone, fever, and hydronephrosis is an emergency requiring surgical drainage.",
    keywords: ["urolithiasis", "kidney stones", "renal calculi", "renal colic", "flank pain", "hematuria", "ureter stone"],
    semanticKeywords: ["nephrolithiasis", "calcium oxalate crystals", "obstructive uropathy"],
    icd: "N20.9",
    mesh: "D053040",
    bodySystem: "Urology & Nephrology",
    urgency: "routine"
  }
};
