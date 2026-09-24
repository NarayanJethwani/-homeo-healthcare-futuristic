import { KnowledgeEntity } from "../../types";

export const UrinaryTractInfectionDisease: KnowledgeEntity = {
  id: "D0032",
  slug: "urinary-tract-infection",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Urinary Tract Infection (UTI)",
    hi: "मूत्र मार्ग संक्रमण (यूटीआई / सिस्टाइटिस / UTI)",
    gu: "પેશાબનો ચેપ / યુટીઆઈ (Urinary Tract Infection)",
    mr: "मूत्रमार्गाचा संसर्ग (Urinary Tract Infection / UTI)",
    es: "Infección del Tracto Urinario (ITU / Cistitis)",
    ar: "التهاب المسالك البولية (Urinary Tract Infection)"
  },
  summary: {
    en: "A UTI can cause burning when passing urine, needing to go often or suddenly, and lower tummy discomfort. Learn when testing and antibiotics may be needed and when symptoms suggest a kidney infection.",
    hi: "मूत्र मार्ग संक्रमण (यूटीआई/सिस्टाइटिस) का यूरोपैथोजेनिक ई. कोलाई पैथोलॉजी, बार-बार होने वाले मूत्र संक्रमण, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और तीव्र पायलोनेफ्राइटिस (गुर्दे का संक्रमण) व सेप्सिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પેશાબનો ચેપ (યુટીઆઈ) ની બેક્ટેરિયલ પેથોલોજી, પેશાબમાં બળતરા અને વારંવાર પેશાબ થવાની લાગણી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પાયલોનેફ્રાઇટિસ (કિડની ઇન્ફેક્શન) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "मूत्रमार्गाचा जंतुसंसर्ग (UTI), लघवीची तीव्र जळजळ व कळ, वारंवार लघवीची भावना, पारंपरिक होमिओपॅथिक पद्धत आणि किडनी इन्फेक्शनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la infección urinaria que cubre la cistitis bacteriana, ITU recurrente, manejo homeopático complementario y banderas rojas de pielonefritis y sepsis.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب المسالك البولية يغطي استعمار الإشريكية القولونية والتهاب المثانة والتهاب الكلية الحاد والرعاية التكميلية وعلامات الخطر للصدمة الإنتانية البولية."
  },
  content: {
    overview:
      "A urinary tract infection (UTI) often affects the bladder and can cause burning or stinging when passing urine, needing to go more often or urgently, and lower tummy discomfort. Similar symptoms can have other causes, so testing is useful in some people. Fever, side or back pain, vomiting, or pregnancy need prompt care.",
    definition:
      "An infection of the urinary tract characterized by significant bacteriuria (typically \u226510^5 CFU/mL in clean-catch midstream urine or \u226510^3 CFU/mL in symptomatic females) accompanied by clinical symptoms of urothelial inflammation.",
    causes: [
      "Bacteria are the usual cause of a bladder infection; E. coli is common.",
      "A catheter, urinary blockage, or difficulty emptying the bladder can raise the risk.",
      "Some sexual-health, vaginal, prostate, or bladder conditions can cause similar symptoms and need different care."
    ],
    riskFactors: [
      "Previous UTIs, pregnancy, diabetes, or changes after menopause.",
      "A urinary catheter, kidney stone, prostate enlargement, or another cause of incomplete bladder emptying.",
      "Some contraceptive methods, including spermicides or diaphragms."
    ],
    symptoms: [
      "Burning or stinging when passing urine, and needing to pass urine more often or urgently.",
      "Lower tummy discomfort and urine that may look cloudy, have a strong smell, or contain blood.",
      "Fever, chills, nausea or vomiting, and pain in the side or back can suggest a kidney infection."
    ],
    diagnosis:
      "A clinician considers your symptoms, medical history, and sometimes a urine test or culture. Testing is especially important in pregnancy, for men and children, when infections keep returning, when treatment has not helped, or when a kidney infection is possible.",
    differentialDiagnosis:
      "Differentiate Lower UTI from Interstitial Cystitis / Bladder Pain Syndrome (BPS), Vulvovaginal Candidiasis, Trichomoniasis, Chlamydia trachomatis / Neisseria gonorrhoeae Urethritis, Genitourinary Syndrome of Menopause (atrophic vaginitis), and Bladder Carcinoma.",
    conventionalManagement:
      "Many bacterial UTIs are treated with a clinician-prescribed antibiotic. The choice and duration depend on the person, the bacteria, allergies, pregnancy, and whether the infection may involve the kidneys. Take prescribed antibiotics exactly as directed and seek advice if symptoms worsen or do not improve.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for UTIs. It must not replace testing, antibiotics when indicated, or prompt assessment for pregnancy, fever, side or back pain, vomiting, or severe illness.",
    lifestyleAdvice:
      "Drink enough fluid for your usual health needs, unless a clinician has advised a limit. Do not routinely hold urine, wipe front to back after a bowel movement, and avoid scented products that irritate the area. Ask a clinician about recurrent UTIs rather than relying on supplements or home remedies.",
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
        question: "When should I arrange a urine test or medical review?",
        answer: "Arrange timely review if you are pregnant, a man or child has symptoms, symptoms keep returning, there is visible blood in the urine, or treatment has not helped. Similar symptoms can come from conditions other than a UTI."
      },
      {
        question: "When could a UTI be a kidney infection?",
        answer: "Fever or chills, nausea or vomiting, and pain in the side or back can mean an infection has reached a kidney. Seek urgent medical care, especially if you feel very unwell."
      },
      {
        question: "Can homeopathy replace antibiotics for a UTI?",
        answer: "No. Homeopathy should not delay testing, prescribed antibiotics, or urgent assessment for a possible kidney infection."
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
  changeLog: ["1.2.0: Simplified the patient route from symptoms to testing, treatment boundaries, and urgent kidney-infection signs.", "1.1.0: Promoted to governed v1.1.0 with comprehensive uropathology clinical boundaries, pyelonephritis red flags, and verified citations"],
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
