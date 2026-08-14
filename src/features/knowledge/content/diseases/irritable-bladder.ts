import { KnowledgeEntity } from "../../types";

export const IrritableBladderDisease: KnowledgeEntity = {
  id: "D0069",
  slug: "irritable-bladder",
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
    en: "Irritable Bladder & Overactive Bladder (OAB, Detrusor Muscle Overactivity & Urgency Incontinence)",
    hi: "इरिटेबल ब्लैडर / बार-बार व अचानक पेशाब लगना (Irritable Bladder / Overactive Bladder)",
    gu: "ઇરિટેબલ બ્લેડર / પેશાબ વારંવાર આવવો અને તાત્કાલિક દબાણ થવું (Irritable Bladder / OAB)",
    mr: "इरिटेबल ब्लॅडर / वारंवार लघवीची तीव्र भावना (Irritable Bladder / Overactive Bladder)",
    es: "Vejiga Irritable e Hiperactiva (VH, Hiperactividad del Músculo Detrusor e Incontinencia de Urgencia)",
    ar: "المثانة العصبية والمثانة فرط النشاط وسلس البول الالحاحي (Irritable Bladder / OAB)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Irritable Bladder and Overactive Bladder (OAB), covering myogenic detrusor smooth muscle overactivity, urothelial suburothelial C-fiber afferent hypersensitivity, urinary urgency, daytime frequency, nocturia, urge incontinence, constitutional homeopathic supportive management, and emergency red flags for bladder transitional cell carcinoma, acute urinary retention, cauda equina syndrome, and urosepsis.",
    hi: "इरिटेबल ब्लैडर / ओवरएक्टिव ब्लैडर (पेशाब की थैली की अतिसंवेदनशीलता) का डेट्रूसर मसल पैथोलॉजी, बार-बार पेशाब जाना (Urinary Frequency), अचानक तीव्र वेग (Urgency), रात में बार-बार उठना (Nocturia), यूरिन लीक होना, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और ब्लैडर कैंसर (पेशाब में खून), एक्यूट यूरिनरी रिटेंशन व सेप्सिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ઇરિટેબલ બ્લેડર (પેશાબની કોથળીની નબળાઈ) ની પેથોલોજી, પેશાબ રોકવામાં તકલીફ, દિવસ-રાત વારંવાર જવું, ઉધરસ કે હસતી વખતે ટીપાં પડવા, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને પેશાબમાં લોહી પડવું (કેન્સર), પેશાબ અટકી જવો તથા કિડની ઇન્ફેક્શનની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "इरिटेबल ब्लॅडर (Overactive Bladder), लघवीची घाई होणे, रात्री वारंवार उठावे लागणे, कपड्यात लघवी होणे, पेल्विक फ्लोअर स्नायू, पारंपरिक होमिओपॅथिक पद्धत आणि लघवीतून रक्त जाणे (Bladder Cancer) व लघवी अडकण्याच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la vejiga hiperactiva que cubre la hiperactividad del detrusor, hipersensibilidad de fibras C uroteliales, urgencia miccional, nicturia, manejo homeopático complementario y banderas rojas de carcinoma urotelial y retención urinaria aguda.",
    ar: "دليل سريري وتعليمي موثوق لفرط نشاط المثانة يغطي فرط نشاط العضلة الدافعة للبول وفرط حساسية ألياف C الإحساسية والإلحاح البولي وسلس الإلحاح والرعاية التكميلية وعلامات الخطر لسرطان المثانة واحتباس البول الحاد والإنتان البولي."
  },
  content: {
    overview:
      "Overactive Bladder (OAB; widely termed 'Irritable Bladder') is a highly prevalent urological syndrome affecting approximately 12% to 17% of the global adult population, significantly increasing with advancing age. Defined by the International Continence Society (ICS) as urinary urgency, usually accompanied by daytime frequency and nocturia, with or without urgency urinary incontinence (OAB-wet vs. OAB-dry), in the absence of urinary tract infection or other obvious pathology. Driven by dual myogenic and neurogenic mechanisms—uninhibited involuntary contractions of the detrusor smooth muscle during the bladder filling phase (detrusor overactivity), and pathological hyperexcitability of suburothelial C-fiber sensory mechanoreceptors releasing acetylcholine, ATP, and substance P—it causes profound disruption to sleep, emotional wellbeing, work productivity, and quality of life.",
    definition:
      "A symptom complex characterized by urinary urgency (a sudden, compelling desire to void that is difficult to defer), usually with daytime frequency (\u22658 times/day) and nocturia (\u22652 times/night), with or without urgency urinary incontinence, in the absence of proven infection or local metabolic pathology.",
    causes: [
      "Myogenic Detrusor Muscle Overactivity: uninhibited spontaneous micromotions and electrical gap-junction coupling between detrusor smooth muscle cells, triggering involuntary coordinated bladder wall contractions at low filling volumes",
      "Urothelial Sensory Hypersensitivity: abnormal urothelial stretch reception, excessive ATP release from urothelial cells acting on P2X3 purinergic receptors, and unmyelinated C-fiber afferent firing signaling false urgency to the spinal micturition center (S2–S4)",
      "Central & Spinal Neurological Dysregulation: loss of cortical frontopontine inhibitory pathways following stroke, Parkinson's disease, Multiple Sclerosis, or incomplete spinal cord lesions",
      "Bladder Outlet Obstruction (BOO): benign prostatic hyperplasia (BPH) in men or urethral stricture inducing secondary detrusor wall hypertrophy, collagen deposition, and patchy denervation hypersensitivity",
      "Pelvic Floor Muscle Laxity & Pelvic Organ Prolapse: cystocele, uterine prolapse, or postpartum pelvic floor muscle weakness altering urethrovesical junction geometry and stimulating trigonal mechanoreceptors",
      "Metabolic and Hormonal triggers: Estrogen Deficiency (Genitourinary Syndrome of Menopause [GSM] causing trigonal mucosal atrophy and sensory hyperreflexia), uncontrolled diabetes mellitus (glucosuria-induced osmotic diuresis and diabetic cystopathy), and chronic constipation"
    ],
    riskFactors: [
      "Advancing age (>60 years; progressive detrusor neuromuscular degeneration and microvascular ischemia)",
      "Female gender (especially post-menopausal status and multiparity / vaginal delivery trauma)",
      "Male gender with underlying Benign Prostatic Hyperplasia (BPH) or bladder outlet obstruction",
      "High daily consumption of bladder irritants: caffeine (coffee, tea, energy drinks), carbonated sodas, alcohol, artificial sweeteners (aspartame), and spicy foods",
      "Neurological conditions (Parkinson's, post-stroke hemiplegia, multiple sclerosis, lumbar disc herniation)"
    ],
    symptoms: [
      "Urinary Urgency (the cardinal pathognomonic symptom): an abrupt, intense, irresistible desire to urinate that cannot be safely suppressed or deferred",
      "Urinary Frequency: needing to urinate \u22658 times within a 24-hour period while consuming normal fluid volumes",
      "Nocturia: waking up \u22652 or more times per night from sound sleep specifically to void, causing severe sleep fragmentation and daytime fatigue",
      "Urgency Urinary Incontinence (OAB-Wet): involuntary leakage of urine immediately preceded by or occurring simultaneously with a sudden urge wave (often triggered by reaching for a key in the door or hearing running water ['key-in-the-lock syndrome'])",
      "Small Voided Volumes: passing only 50 to 150 mL of urine per void despite an overwhelming sensation of bladder fullness",
      "Absence of severe dysuria (burning pain during urination), gross hematuria, or fever in uncomplicated OAB"
    ],
    diagnosis:
      "Diagnosed through a structured clinical history, voiding diary, and targeted testing to rule out confounds: (1) 3-Day Frequency-Volume Chart / Bladder Diary (the gold standard non-invasive tool: logs fluid intake, exact voided volumes, urgency severity scores, and leakage episodes). (2) Urinalysis and Urine Culture & Sensitivity (mandatory in every patient to definitively rule out acute bacterial cystitis and microscopic hematuria). (3) Post-Void Residual (PVR) Urine Volume Measurement via Bladder Ultrasound (normal <50 mL; elevated PVR >150–200 mL indicates urinary retention or overflow incontinence, warning against anticholinergic medications). (4) Complex Multichannel Urodynamic Studies (UDS; reserved for refractory or neurogenic cases: demonstrates spontaneous involuntary detrusor contractions during continuous saline cystometry). (5) Cystoscopy and Renal Ultrasound (indicated if hematuria, pelvic pain, or suspicion of bladder carcinoma/stones is present).",
    differentialDiagnosis:
      "Differentiate Overactive Bladder from Acute Bacterial Urinary Tract Infection (UTI; positive nitrites/leukocyte esterase, burning dysuria, pyuria on culture), Interstitial Cystitis / Bladder Pain Syndrome (IC/BPS; hallmark is severe pelvic pain that worsens with bladder filling and is relieved by voiding, accompanied by Hunner lesions on cystoscopy), Stress Urinary Incontinence (SUI; urine leakage during coughing, laughing, or heavy lifting WITHOUT prior urgency), Bladder Transitional Cell Carcinoma (painless gross/microscopic hematuria), Bladder Calculi (stones), and Polyuria (diabetes insipidus, uncontrolled diabetes mellitus).",
    conventionalManagement:
      "A stepped clinical treatment algorithm (AUA / SUFU OAB Guidelines): (1) First-Line Behavioral & Pelvic Therapy: Bladder Retraining (timed voiding drills with progressive suppression intervals of 15–30 minutes), Pelvic Floor Muscle Training (Kegel exercises with biofeedback), fluid management (reducing evening fluids and completely eliminating caffeine, alcohol, and carbonated beverages), and weight reduction. (2) Second-Line Pharmacotherapy: Beta-3 Adrenergic Receptor Agonists (Mirabegron 25–50 mg or Vibegron 75 mg daily; relaxes detrusor smooth muscle during filling with minimal anticholinergic side effects) OR Oral Antimuscarinic / Anticholinergic Agents (Solifenacin, Tolterodine, Oxybutynin; blocks M2/M3 muscarinic receptors; use with caution in elderly due to dry mouth, constipation, and cognitive impairment risk). (3) Third-Line Advanced Therapies: Intra-detrusor OnabotulinumtoxinA (Botox 100 units injected into the bladder wall via cystoscopy), Sacral Neuromodulation (InterStim implantable pacemaker lead at S3 nerve root), or Percutaneous Tibial Nerve Stimulation (PTNS; weekly neuromodulatory sessions).",
    homeopathicApproach:
      "Homeopathic constitutional and urinary remedies (such as Causticum, Sepia Officinalis, Cantharis Vesicatoria, Staphysagria, Equisetum Hyemale, Pulsatilla Nigricans, Nux Vomica, Lycopodium Clavatum, Sarsaparilla Officinalis, Petroselinum Sativum) serve as supportive care to ease urinary urgency, soothe vesical irritability, and support pelvic comfort alongside bladder retraining drills, pelvic floor exercises, and urological monitoring.",
    lifestyleAdvice:
      "Completely eliminate caffeine (coffee, tea, cola, energy drinks) and artificial sweeteners which directly irritate bladder nerves, practice the 'quick flick' pelvic floor technique when an urge wave hits (stand still, take 5 slow deep breaths, perform 5 rapid contractions of the pelvic floor muscles to inhibit the detrusor reflex, and walk calmly to the toilet only after the urge subsides), drink 1.5 to 2 liters of water spread evenly throughout the day, stop drinking fluids 2 hours before bedtime, maintain regular bowel habits to prevent hard stool from pressing against the bladder, and track your daily voids with a bladder diary.",
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
        question: "Why do I feel an intense urge to pee the exact second I reach my front door?",
        answer: "This is known as 'Key-in-the-Lock Syndrome.' It is a Pavlovian conditioned reflex where your brain recognizes environmental cues associated with being home and safe near a toilet, triggering an involuntary, premature surge of nerve signals that causes your bladder muscle to clamp down before you are ready."
      },
      {
        question: "Should I stop drinking water so I don't have to pee as often?",
        answer: "No, restricting water actually makes overactive bladder worse. When you drink too little water, your urine becomes highly concentrated, acidic, and dark amber. This concentrated urine severely irritates the delicate bladder lining, triggering even stronger, more frequent emergency spasms."
      }
    ],
    redFlags: [
      "Painless Gross or Microscopic Hematuria: visible pink, red, or tea-colored blood in the urine in the absence of infection (cardinal warning sign of Bladder Transitional Cell Carcinoma or Renal Cell Carcinoma; requires urgent cystoscopy, urine cytology, and CT Urography)",
      "Acute Complete Urinary Retention: agonizing lower abdominal pain, a tense palpable suprapubic bladder mass, and total inability to pass urine (urological emergency requiring immediate urethral or suprapubic catheter decompression to prevent bladder rupture or post-renal acute kidney injury)",
      "Cauda Equina Syndrome / Spinal Cord Compression: new-onset urinary urgency/incontinence accompanied by saddle anesthesia (numbness in groin/buttocks), bilateral leg weakness, or fecal incontinence (neurosurgical emergency requiring emergent lumbar spine MRI and surgical decompression)",
      "Urosepsis / Acute Pyelonephritis: high fever, shaking chills, severe flank / costovertebral angle tenderness, altered mental status, and hypotension in a patient with urinary symptoms (requires immediate hospitalization, IV antibiotics, and septic workup)"
    ]
  },
  claimCitations: [
    { claimId: "D0069-TRADITIONAL-PROFILE", statement: "Homeopathic irritable bladder profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0069-TRADITIONAL-PROFILE" },
    { claimId: "D0069-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for bladder cancer cystectomy, acute urinary retention catheterization, or cauda equina decompression.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0069-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0069-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for bladder malignancy, acute urinary retention, or cauda equina compression.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Painless blood in the urine indicating possible bladder carcinoma requiring urgent cystoscopy and CT urography",
    "Agonizing suprapubic pain with complete inability to pass urine indicating acute urinary retention requiring emergency catheterization",
    "Urinary incontinence with saddle numbness in groin indicating cauda equina syndrome requiring emergency spinal MRI"
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
  tags: ["Irritable Bladder", "Overactive Bladder", "OAB", "Urinary Urgency", "Detrusor Overactivity", "Nocturia", "Disease", "Urology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/irritable-bladder",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive detrusor muscle overactivity and urothelial C-fiber hypersensitivity clinical boundaries, bladder cancer/cauda equina red flags, and verified citations"],
  clinicalPearl: "Restricting fluid intake concentrates urine and irritates the urothelium, paradoxically worsening bladder urgency and frequency.",
  quickFacts: {
    "Prevalence": "Affects 12% to 17% of adults (significantly higher in post-menopausal women and elderly)",
    "Primary System": "Urinary Tract & Vesical Neuromuscular Unit (Urology / Urogynecology)",
    "Diagnostic Standard": "Clinical Criteria (Urgency, Frequency \u22658, Nocturia \u22652) & 3-Day Bladder Diary",
    "Clinical Character": "Detrusor smooth muscle overactivity and urothelial sensory hypersensitivity causing urinary urgency"
  },
  aiReadiness: {
    retrievalSummary: "Irritable Bladder (Overactive Bladder) is a condition causing sudden irresistible urges to urinate, frequent daytime voids, and nocturia, managed with supportive care, bladder retraining, and medical therapies.",
    clinicalSummary: "OAB pathophysiology involves involuntary detrusor smooth muscle contractions and urothelial C-fiber afferent hypersensitivity releasing excess ATP. Homeopathic remedies serve as supportive vesical care and do not replace bladder retraining, Beta-3 agonists, or emergency evaluation for bladder malignancy, acute retention, or cauda equina syndrome.",
    patientSummary: "Overactive bladder is a condition where your bladder muscle suddenly squeezes when it shouldn't, making you feel an urgent need to pee right away, waking you up at night, managed by bladder training, pelvic exercises, and doctor care.",
    studentSummary: "Symptom complex of urinary urgency, frequency (\u22658/day), nocturia (\u22652/night), +/- urge incontinence. Pathophysiology: detrusor overactivity and urothelial C-fiber sensory upregulation. First-line: behavioral/bladder training. Second-line: Beta-3 agonists (mirabegron) / antimuscarinics. Red flags: painless hematuria (bladder cancer), acute retention, and cauda equina syndrome.",
    keywords: ["irritable bladder", "overactive bladder", "oab", "urinary urgency frequency", "nocturia waking up to pee", "urge incontinence", "bladder retraining exercises"],
    semanticKeywords: ["detrusor muscle overactivity", "urothelial afferent hypersensitivity", "vesical urgency incontinence"],
    icd: "N32.81",
    mesh: "D053201",
    bodySystem: "Urology & Renal Medicine",
    urgency: "routine"
  }
};
