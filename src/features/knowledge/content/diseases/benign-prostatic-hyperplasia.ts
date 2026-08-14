import { KnowledgeEntity } from "../../types";

export const BenignProstaticHyperplasiaDisease: KnowledgeEntity = {
  id: "D0031",
  slug: "benign-prostatic-hyperplasia",
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
    en: "Benign Prostatic Hyperplasia (BPH / Prostate Enlargement)",
    hi: "प्रोस्टेट ग्रंथि बढ़ना / बीपीएच (Benign Prostatic Hyperplasia / BPH)",
    gu: "પ્રોસ્ટેટ ગ્રંથિનો સોજો / બીપીએચ (Benign Prostatic Hyperplasia)",
    mr: "प्रोस्टेट ग्रंथी वाढणे / बीपीएच (Benign Prostatic Hyperplasia)",
    es: "Hiperplasia Prostática Benigna (HPB / Agrandamiento de Próstata)",
    ar: "تضخم البروستاتا الحميد (Benign Prostatic Hyperplasia)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Benign Prostatic Hyperplasia (BPH), covering dihydrotestosterone (DHT)-driven transition zone proliferation, lower urinary tract symptoms (LUTS), bladder outlet obstruction, constitutional homeopathic supportive management, and emergency red flags for acute urinary retention, bilateral hydronephrosis, and post-renal uremia.",
    hi: "बीपीएच (प्रोस्टेट ग्रंथि की वृद्धि) का डायहाइड्रोटेस्टोस्टेरोन (DHT) पैथोलॉजी, लोअर यूरिनरी ट्रैक्ट सिम्पटम्स (LUTS), मूत्र रुकावट, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और तीव्र मूत्र अवरोध (एक्यूट रिटेंशन) व गुर्दे की खराबी की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પ્રોસ્ટેટ ગ્રંથિની વૃદ્ધિ (BPH) ની ડીએચટી હોર્મોનલ પેથોલોજી, પેશાબની ધાર ધીમી પડવી અને અટકાઈને આવવું, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પેશાબના સંપૂર્ણ અટકાવાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "प्रोस्टेट ग्रंथी वाढणे (BPH), लघवी अडखळत होणे व रात्री वारंवार उठावे लागणे, पारंपरिक होमिओपॅथिक पद्धत आणि लघवी पूर्णपणे बंद होण्याच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la hiperplasia prostática benigna (HPB) que cubre la proliferación de la zona de transición, STUI, manejo homeopático complementario y banderas rojas de retención urinaria aguda e hidronefrosis.",
    ar: "دليل سريري وتعليمي موثوق لتضخم البروستاتا الحميد يغطي تكاثر المنطقة الانتقالية بفعل الديهيدروتستوستيرون وأعراض المسالك البولية السفلية والرعاية التكميلية وعلامات الخطر لاحتباس البول الحاد واستسقاء الكلى."
  },
  content: {
    overview:
      "Benign Prostatic Hyperplasia (BPH) is a non-malignant, progressive adenomatous enlargement of the transition zone of the prostate gland resulting from stromal and epithelial cellular proliferation. Predominantly affecting aging men, BPH causes progressive mechanical and dynamic compression of the prostatic urethra, producing Lower Urinary Tract Symptoms (LUTS) categorized into voiding (obstructive: hesitancy, weak stream, intermittency, straining, terminal dribbling) and storage (irritative: frequency, urgency, nocturia) symptoms, with potential complications of acute urinary retention (AUR), recurrent UTIs, and bladder calculi.",
    definition:
      "A histological diagnosis characterized by non-malignant hyperplasia of prostatic stromal and glandular epithelial cells within the transition zone surrounding the urethra, leading to clinical bladder outlet obstruction (BOO) and lower urinary tract dysfunction.",
    causes: [
      "Dihydrotestosterone (DHT) stimulation: local conversion of circulating testosterone to potent intraprostatic DHT by the enzyme 5-alpha reductase (type 2 isoenzyme), binding to androgen receptors and stimulating growth factors (FGF, IGF, TGF-beta)",
      "Altered estrogen-to-androgen ratio with advancing age (estrogen upregulates androgen receptor expression in prostatic stroma)",
      "Imbalance between cellular proliferation and programmed cell death (apoptosis inhibition in aging prostatic tissue)",
      "Chronic low-grade intraprostatic inflammation, metabolic syndrome, and elevated sympathetic alpha-1 adrenergic tone in prostatic smooth muscle"
    ],
    riskFactors: [
      "Advancing age (histologically present in >50% of men in their 50s and >80% of men by age 80)",
      "Family history of benign prostatic enlargement or early prostatic surgery",
      "Metabolic syndrome: obesity, insulin resistance, dyslipidemia, and systemic hypertension",
      "Sedentary lifestyle and lack of regular physical exercise",
      "Use of sympathomimetic decongestants (pseudoephedrine) or anticholinergic medications (can trigger acute urinary retention)"
    ],
    symptoms: [
      "Voiding (Obstructive) symptoms: urinary hesitancy (delay in initiating stream), weak or diminished urinary stream, intermittency (flow stops and starts), straining to void, and prolonged terminal dribbling",
      "Storage (Irritative) symptoms: nocturia (waking \u22652 times per night to urinate), daytime urinary frequency, and sudden compelling urinary urgency with occasional urge incontinence",
      "Feeling of incomplete bladder emptying (sensation that the bladder has not emptied completely after voiding)",
      "Post-void dribbling: involuntary leakage of urine immediately after leaving the toilet",
      "Hematuria from congested, fragile submucosal prostatic varices"
    ],
    diagnosis:
      "Evaluated clinically using the International Prostate Symptom Score (IPSS / AUA-SI; mild 0–7, moderate 8–19, severe 20–35), Digital Rectal Examination (DRE; assessing prostate size, symmetry, smooth rubbery consistency, and ruling out hard malignant nodules), Serum Prostate-Specific Antigen (PSA; screening for prostate adenocarcinoma and estimating prostate volume), Urinalysis (to rule out UTI and hematuria), and Uroflowmetry with Post-Void Residual (PVR) ultrasound measurement (\u2265100–200 mL indicates significant urinary retention).",
    differentialDiagnosis:
      "Differentiate BPH from Prostate Adenocarcinoma (nodular, firm, asymmetric gland on DRE with elevated PSA), Urethral Stricture Disease (younger history of urethral trauma or STI), Neurogenic Bladder (diabetes, Parkinson's, spinal injury), Bladder Neck Sclerosis, Urinary Tract Infection, and Bladder Calculus.",
    conventionalManagement:
      "Watchful waiting with lifestyle modifications for mild symptoms (IPSS \u22647). First-line medical therapy includes alpha-1 adrenergic antagonists (tamsulosin, silodosin, alfuzosin; relaxes prostatic smooth muscle) and 5-alpha reductase inhibitors (5-ARIs: finasteride, dutasteride; reduces prostate volume by 20–30% in glands >30–40 mL over 6–12 months). Surgical interventions include Transurethral Resection of the Prostate (TURP; historical gold standard), Holmium Laser Enucleation of the Prostate (HoLEP), and minimally invasive procedures (Rezum water vapor therapy, UroLift prostatic urethral lift) for refractory retention, recurrent infections, or bladder stones.",
    homeopathicApproach:
      "Homeopathic constitutional and prostatic remedies (such as Sabal Serrulata, Conium Maculatum, Thuja Occidentalis, Staphysagria, Chimaphila Umbellata, Pareira Brava, Baryta Carbonica, Lycopodium) serve as supportive care to ease urinary dribbling, relieve pelvic congestion, and assist bladder comfort alongside urological monitoring, PSA testing, and PVR ultrasound evaluations.",
    lifestyleAdvice:
      "Avoid fluid intake 2 hours before bedtime to reduce nocturia, limit caffeine and alcohol consumption (both act as mild diuretics and irritate bladder muscle), practice 'double voiding' (urinate, wait a minute, and urinate again to completely empty the bladder), avoid cold weather exposure and over-the-counter antihistamine/decongestant cold remedies that provoke urinary retention, and engage in daily physical exercise.",
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
        question: "Does having an enlarged prostate (BPH) increase the risk of prostate cancer?",
        answer: "No. BPH is a benign condition affecting the inner transition zone of the prostate, whereas prostate cancer most commonly arises in the outer peripheral zone. However, both conditions can occur together, so PSA testing and digital rectal exams are important."
      },
      {
        question: "What medications can suddenly stop an enlarged prostate patient from urinating?",
        answer: "Over-the-counter nasal decongestants containing pseudoephedrine (which contract prostatic smooth muscle) and antihistamines or bladder anticholinergics (which relax bladder detrusor muscle) can suddenly trigger acute urinary retention in men with BPH."
      }
    ],
    redFlags: [
      "Acute Urinary Retention (AUR): sudden, complete inability to pass urine accompanied by agonizing suprapubic pain and a tense, distended, palpable bladder (urological emergency requiring immediate emergency urethral catheterization)",
      "Asymmetric, hard, stony, or nodular prostate on digital rectal exam, or rapidly rising/elevated serum PSA (suspected Prostate Adenocarcinoma requiring multiparametric prostate MRI and biopsy)",
      "Bilateral hydronephrosis with elevated serum creatinine indicating post-renal obstructive uropathy and renal failure",
      "Gross painless hematuria with blood clots (requires urgent cystoscopy to rule out bladder or urothelial malignancy)"
    ]
  },
  claimCitations: [
    { claimId: "D0031-TRADITIONAL-PROFILE", statement: "Homeopathic BPH profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0031-TRADITIONAL-PROFILE" },
    { claimId: "D0031-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for volumetric prostate shrinkage, TURP surgery, or acute urinary retention catheterization.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0031-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0031-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute urinary retention, post-renal renal failure, or prostate cancer screening.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden complete inability to void with severe suprapubic distension indicating acute urinary retention requiring emergency catheterization",
    "Hard nodular prostate on DRE or significantly elevated PSA requiring urgent oncologic prostate biopsy",
    "Bilateral hydronephrosis and rising creatinine indicating post-renal acute kidney injury"
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
  tags: ["Benign Prostatic Hyperplasia", "BPH", "Prostate Enlargement", "Disease", "LUTS", "Nocturia", "Weak Stream", "Urology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/benign-prostatic-hyperplasia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive urological LUTS clinical boundaries, acute retention red flags, and verified citations"],
  clinicalPearl: "Digital Rectal Examination (DRE) and Serum PSA are mandatory in every patient with lower urinary tract symptoms to differentiate benign enlargement from prostate cancer.",
  quickFacts: {
    "Prevalence": "Present in >50% of men in their 50s and >80% of men by age 80",
    "Primary System": "Genitourinary & Prostatic System (Urology / Andrology)",
    "Diagnostic Standard": "IPSS Symptom Score, DRE Exam, Serum PSA, & Post-Void Residual (PVR) Ultrasound",
    "Clinical Character": "Progressive non-malignant adenomatous transition zone enlargement causing bladder outlet obstruction"
  },
  aiReadiness: {
    retrievalSummary: "Benign Prostatic Hyperplasia is an age-related non-malignant enlargement of the prostate gland causing urinary hesitancy, weak stream, and nocturia, managed with supportive care, alpha-blockers/5-ARIs, and urological evaluation.",
    clinicalSummary: "BPH pathophysiology involves DHT-mediated transition zone cellular hyperplasia and bladder outlet obstruction. Homeopathic remedies serve as supportive prostatic care and do not replace emergency catheterization for acute urinary retention, surgical resection (TURP), or prostate cancer biopsy.",
    patientSummary: "An enlarged prostate (BPH) is a common condition in older men that squeezes the urinary tube, causing a weak stream, waking up multiple times at night to pee, and feeling like the bladder is not empty.",
    studentSummary: "DHT synthesized by 5-alpha reductase drives transition zone hyperplasia. IPSS score quantifies severity. First-line medical therapy: alpha-1 blockers (tamsulosin) and 5-ARIs (finasteride). Red flag: Acute Urinary Retention requiring immediate catheterization.",
    keywords: ["benign prostatic hyperplasia", "bph", "enlarged prostate", "prostate enlargement", "weak urine stream", "nocturia", "ipss"],
    semanticKeywords: ["prostatic transition zone hyperplasia", "bladder outlet obstruction", "lower urinary tract symptoms"],
    icd: "N40.1",
    mesh: "D011470",
    bodySystem: "Urology & Andrology",
    urgency: "routine"
  }
};
