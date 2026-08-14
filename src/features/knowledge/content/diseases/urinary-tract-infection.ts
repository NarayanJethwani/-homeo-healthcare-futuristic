import { KnowledgeEntity } from "../../types";

export const UrinaryTractInfectionDisease: KnowledgeEntity = {
  id: "D0032",
  slug: "urinary-tract-infection",
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
    en: "Urinary Tract Infection (UTI / Acute Cystitis & Pyelonephritis)",
    hi: "मूत्र मार्ग संक्रमण (यूटीआई / सिस्टाइटिस / UTI)",
    gu: "પેશાબનો ચેપ / યુટીઆઈ (Urinary Tract Infection)",
    mr: "मूत्रमार्गाचा संसर्ग (Urinary Tract Infection / UTI)",
    es: "Infección del Tracto Urinario (ITU / Cistitis)",
    ar: "التهاب المسالك البولية (Urinary Tract Infection)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Urinary Tract Infections (UTI), covering uropathogenic E. coli colonization, acute cystitis, recurrent UTI pathophysiology, constitutional homeopathic supportive management, and emergency red flags for acute ascending pyelonephritis and uroseptic bacteremia.",
    hi: "मूत्र मार्ग संक्रमण (यूटीआई/सिस्टाइटिस) का यूरोपैथोजेनिक ई. कोलाई पैथोलॉजी, बार-बार होने वाले मूत्र संक्रमण, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और तीव्र पायलोनेफ्राइटिस (गुर्दे का संक्रमण) व सेप्सिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પેશાબનો ચેપ (યુટીઆઈ) ની બેક્ટેરિયલ પેથોલોજી, પેશાબમાં બળતરા અને વારંવાર પેશાબ થવાની લાગણી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પાયલોનેફ્રાઇટિસ (કિડની ઇન્ફેક્શન) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "मूत्रमार्गाचा जंतुसंसर्ग (UTI), लघवीची तीव्र जळजळ व कळ, वारंवार लघवीची भावना, पारंपरिक होमिओपॅथिक पद्धत आणि किडनी इन्फेक्शनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la infección urinaria que cubre la cistitis bacteriana, ITU recurrente, manejo homeopático complementario y banderas rojas de pielonefritis y sepsis.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب المسالك البولية يغطي استعمار الإشريكية القولونية والتهاب المثانة والتهاب الكلية الحاد والرعاية التكميلية وعلامات الخطر للصدمة الإنتانية البولية."
  },
  content: {
    overview:
      "Urinary Tract Infection (UTI) represents microbial invasion and inflammation of the urinary tract epithelium, ranging from uncomplicated lower urinary tract infection (acute bacterial cystitis) to upper tract involvement (acute pyelonephritis). Predominantly driven by uropathogenic Escherichia coli (UPEC) ascending from the perianal microbiota, it presents clinically with severe dysuria (burning micturition), urinary frequency, urgency, suprapubic tenderness, and cloudy, foul-smelling or blood-tinged urine.",
    definition:
      "An infection of the urinary tract characterized by significant bacteriuria (typically \u226510^5 CFU/mL in clean-catch midstream urine or \u226510^3 CFU/mL in symptomatic females) accompanied by clinical symptoms of urothelial inflammation.",
    causes: [
      "Ascending colonization by uropathogenic Escherichia coli (UPEC; responsible for 75–90% of uncomplicated community UTIs)",
      "Other uropathogens: Klebsiella pneumoniae, Proteus mirabilis, Enterococcus faecalis, Staphylococcus saprophyticus, Pseudomonas aeruginosa",
      "Bacterial virulence factors: type 1 fimbriae and P-fimbriae facilitating urothelial adherence and intracellular bacterial community (IBC) formation",
      "Short female urethral length and close anatomical proximity of the external urethral meatus to the anus"
    ],
    riskFactors: [
      "Female gender (up to 50–60% of women experience at least one UTI in their lifetime)",
      "Recent sexual intercourse ('honeymoon cystitis') and use of spermicides or diaphragm contraception",
      "Postmenopausal estrogen deficiency (loss of protective vaginal Lactobacillus species and elevated vaginal pH)",
      "Incomplete bladder emptying: benign prostatic hyperplasia (BPH), neurogenic bladder, pelvic organ prolapse, urinary strictures",
      "Indwelling urinary catheters, immunosuppression, poorly controlled diabetes mellitus, and urolithiasis"
    ],
    symptoms: [
      "Dysuria: intense, sharp, burning or scalding sensation in the urethra during and immediately following urination",
      "Urinary frequency (voiding small volumes frequently) and urgent, compelling desire to void (urinary urgency)",
      "Suprapubic aching, pelvic heaviness, and lower abdominal discomfort",
      "Cloudy, turbid, malodorous urine, and microscopic or gross terminal hematuria",
      "Systemic symptoms in pyelonephritis: high fever, shaking chills/rigors, nausea, vomiting, and unilateral or bilateral costovertebral angle (flank) tenderness"
    ],
    diagnosis:
      "Diagnosed clinically based on characteristic lower urinary symptoms, supported by rapid urine dipstick analysis (positive leukocyte esterase and positive urinary nitrites) and microscopic urinalysis (pyuria \u226510 WBCs/hpf and bacteriuria). Clean-catch midstream urine culture and antimicrobial susceptibility testing is the gold standard, mandatory for recurrent UTIs, treatment failures, pregnancy, men, and suspected pyelonephritis.",
    differentialDiagnosis:
      "Differentiate Lower UTI from Interstitial Cystitis / Bladder Pain Syndrome (BPS), Vulvovaginal Candidiasis, Trichomoniasis, Chlamydia trachomatis / Neisseria gonorrhoeae Urethritis, Genitourinary Syndrome of Menopause (atrophic vaginitis), and Bladder Carcinoma.",
    conventionalManagement:
      "First-line empirical antibiotic regimens for uncomplicated acute cystitis include nitrofurantoin monohydrate/macrocrystals (5 days), trimethoprim-sulfamethoxazole (TMP-SMX; 3 days where local resistance <20%), or fosfomycin trometamol (single dose). Acute pyelonephritis requires fluoroquinolones (ciprofloxacin) or parenteral cephalosporins (ceftriaxone) based on culture sensitivity. Prophylaxis includes non-antimicrobial options like D-mannose, cranberry proanthocyanidins, and vaginal estrogen in postmenopausal women.",
    homeopathicApproach:
      "Homeopathic constitutional and urinary tract remedies (such as Cantharis Vesicatoria, Staphysagria, Sarsaparilla, Equisetum Hyemale, Apis Mellifica, Berberis Vulgaris, Chimaphila Umbellata) serve as supportive care to ease burning dysuria, soothe post-coital urethral spasms, and assist recurring bladder irritability alongside adequate fluid intake and conventional antibiotic treatment where indicated.",
    lifestyleAdvice:
      "Drink plenty of water throughout the day to flush bacteria from the urinary tract, void promptly following sexual intercourse, wipe from front to back after bowel movements, avoid irritating feminine hygiene sprays, douches, and scented bath products, take showers rather than bubble baths, and avoid delaying urination when the urge arises.",
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
        question: "How does D-mannose help prevent recurrent urinary tract infections?",
        answer: "D-mannose is a natural sugar that binds to the type 1 fimbriae of E. coli bacteria, preventing them from adhering to the bladder wall receptors and allowing them to be flushed out naturally in the urine stream."
      },
      {
        question: "When does a simple bladder infection become a kidney infection (pyelonephritis)?",
        answer: "When bacteria travel up the ureters to the kidney tissue, resulting in systemic symptoms such as high fever, shaking chills, severe flank pain (costovertebral angle tenderness), and nausea."
      }
    ],
    redFlags: [
      "Ascending acute pyelonephritis: high spiking fever, shaking chills, severe flank/costovertebral angle pain, and vomiting (requires immediate physician evaluation and parenteral antibiotics)",
      "Uroseptic shock: hypotension, tachycardia, altered mental status, hypothermia, or tachypnea (life-threatening emergency requiring intensive care resuscitation)",
      "Gross continuous hematuria with passage of large blood clots causing acute urinary retention",
      "UTI symptoms in pregnant women (asymptomatic bacteriuria or cystitis requires prompt antibiotic therapy to prevent preterm labor and maternal pyelonephritis)"
    ]
  },
  claimCitations: [
    { claimId: "D0032-TRADITIONAL-PROFILE", statement: "Homeopathic UTI profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0032-TRADITIONAL-PROFILE" },
    { claimId: "D0032-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for severe bacterial pyelonephritis or uroseptic bacteremia.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0032-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0032-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute pyelonephritis, urosepsis, or gestational urinary infection.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "High fever, rigors, and flank pain indicating acute ascending pyelonephritis requiring emergency antibiotic therapy",
    "Hypotension, lethargy, or altered sensorium indicating uroseptic shock requiring emergency hospital resuscitation",
    "Acute urinary tract infection during pregnancy requiring urgent obstetric/medical antimicrobial evaluation"
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
  tags: ["Urinary Tract Infection", "UTI", "Cystitis", "Pyelonephritis", "Disease", "Dysuria", "Burning Urination", "Urology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/urinary-tract-infection",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive uropathology clinical boundaries, pyelonephritis red flags, and verified citations"],
  clinicalPearl: "Flank tenderness (CVA tenderness) paired with fever and dysuria immediately differentiates upper tract pyelonephritis from simple lower tract cystitis.",
  quickFacts: {
    "Lifetime Incidence": "Over 50% in adult females (up to 25% experience recurrent episodes within 6 months)",
    "Primary System": "Urinary & Genitourinary System (Urology / Infectious Disease)",
    "Diagnostic Standard": "Urine Dipstick, Microscopy (Pyuria), and Quantitative Urine Culture",
    "Clinical Character": "Bacterial urothelial inflammatory syndrome characterized by burning dysuria, frequency, and urgency"
  },
  aiReadiness: {
    retrievalSummary: "Urinary Tract Infection is a bacterial infection of the bladder or kidneys causing burning urination, urgency, and frequency, managed with supportive constitutional care, increased hydration, and conventional antimicrobial guidance.",
    clinicalSummary: "UTI pathophysiology involves ascending colonization by uropathogenic E. coli, fimbrial adherence, and mucosal inflammation. Homeopathic remedies serve as supportive care and do not replace conventional antibiotic therapy for acute bacterial cystitis, pyelonephritis, or gestational bacteriuria.",
    patientSummary: "A urinary tract infection is a common bladder infection causing sharp burning when peeing, feeling the urge to pee all the time, and cloudy urine, often treated with fluids and doctor-prescribed medicine.",
    studentSummary: "Uropathogenic E. coli causes >80% of uncomplicated cases. Distinguish cystitis (localized lower tract dysuria/frequency) from pyelonephritis (fever, rigors, CVA flank tenderness). Red flag: urosepsis and pregnancy.",
    keywords: ["urinary tract infection", "uti", "cystitis", "burning urination", "dysuria", "frequent urination", "pyelonephritis"],
    semanticKeywords: ["uropathogenic e coli", "bacterial cystitis", "ascending urinary infection"],
    icd: "N39.0",
    mesh: "D014552",
    bodySystem: "Urology & Nephrology",
    urgency: "routine"
  }
};
