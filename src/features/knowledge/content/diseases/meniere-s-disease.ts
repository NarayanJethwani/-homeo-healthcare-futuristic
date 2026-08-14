import { KnowledgeEntity } from "../../types";

export const MenieresDisease: KnowledgeEntity = {
  id: "D0062",
  slug: "meniere-s-disease",
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
    en: "Ménière's Disease (Idiopathic Endolymphatic Hydrops / Episodic Vertigo)",
    hi: "मेनियर रोग / आंतरिक कान का चक्कर व बहरापन (Ménière's Disease)",
    gu: "મેનિયર્સ ડીસીઝ / કાનની અંદર પ્રવાહી ભરાવાથી ચક્કર આવવા (Ménière's Disease)",
    mr: "मेनियर्स डिसीज / कानातील द्रवाच्या असंतुलनामुळे येणारे तीव्र चक्कर (Ménière's Disease)",
    es: "Enfermedad de Ménière (Hidropesía Endolinfática Idiopática)",
    ar: "مرض مينيير واستسقاء اللمف الداخلي (Ménière's Disease)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Ménière's Disease (Endolymphatic Hydrops), covering membranous labyrinth fluid hypertension, the classic clinical tetrad (episodic true rotational vertigo, fluctuating low-frequency sensorineural hearing loss, tinnitus, and aural fullness), constitutional homeopathic supportive management, and emergency red flags for posterior circulation stroke, cerebellar infarction, and vestibular schwannoma (acoustic neuroma).",
    hi: "मेनियर रोग (आंतरिक कान में एंडोलिम्फैटिक हाइड्रोप्स) का इनर ईयर फ्लूइड प्रेशर पैथोलॉजी, क्लासिक टेट्राड (गंभीर चक्कर, कानों में घंटी बजना / टिनिटस, कान का भारीपन, सुनने की क्षमता घटना), पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सेरिबेलर स्ट्रोक (Brainstem Stroke) व एकॉस्टिक न्यूरोमा की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "મેનિયર્સ રોગ (કાનમાં પ્રવાહીનું દબાણ) ની પેથોલોજી, ગોળ-ગોળ ચક્કર આવવા, કાનમાં સિસોટી વાગવી (ટિનાઇટસ), કાન ભારે થવો અને ઓછું સંભળાવું, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને બ્રેઈન સ્ટ્રોકની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "मेनियर्स रोग (Ménière's Disease), कानात द्रव साचल्याने तीव्र फिरणारे चक्कर, कानात आवाज येणे (Tinnitus) व बहिरेपणा, पारंपरिक होमिओपॅथिक पद्धत आणि मेंदूच्या स्ट्रोकच्या (Brain Stroke) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la enfermedad de Ménière que cubre la hidropesía endolinfática, tétrada clínica, manejo homeopático complementario y banderas rojas de ictus vertebrobasilar y neurinoma del acústico.",
    ar: "دليل سريري وتعليمي موثوق لمرض مينيير يغطي استسقاء اللمف الداخلي في التيه الغشائي والرباعية السريرية والرعاية التكميلية وعلامات الخطر لسكتة الدوران الخلفي والورم الشفاني الدهليزي."
  },
  content: {
    overview:
      "Ménière's Disease (Idiopathic Endolymphatic Hydrops) is a chronic, progressive inner ear disorder of the membranous labyrinth affecting the cochlear and vestibular systems. Driven by the pathological accumulation and elevated hydrostatic pressure of potassium-rich endolymphatic fluid within the scala media and vestibular end-organs (endolymphatic hydrops), it is characterized by the classic clinical tetrad: (1) spontaneous, recurrent episodes of severe rotational vertigo lasting between 20 minutes and 12 hours, (2) documented fluctuating low- to mid-frequency sensorineural hearing loss (SNHL) in the affected ear, (3) fluctuating ipsilateral tinnitus (roaring, ringing, or hissing sound), and (4) a sensation of aural fullness or pressure in the affected ear. Over time, episodic attacks may subside while permanent sensorineural hearing loss and chronic balance instability progress.",
    definition:
      "A clinical inner ear syndrome defined by the Barany Society criteria as at least two spontaneous episodes of rotational vertigo lasting 20 minutes to 12 hours, with audiometrically documented low- to mid-frequency sensorineural hearing loss and fluctuating aural symptoms in the affected ear, in the absence of other vestibular diagnoses.",
    causes: [
      "Endolymphatic Hydrops: defective fluid reabsorption by the endolymphatic sac, mechanical obstruction of the endolymphatic duct, or excess endolymph secretion by the stria vascularis causing progressive distension of the membranous labyrinth (Reissner's membrane)",
      "Membrane micro-rupture: microscopic tears in the distended Reissner's membrane allowing potassium-rich endolymph to mix with sodium-rich perilymph, depolarizing and paralyzing vestibular and cochlear hair cells (triggering acute vertigo paroxysms)",
      "Autoimmune inner ear disease (AIED) mechanisms: circulating anti-cochlear antibodies and immune complex deposition in the endolymphatic sac",
      "Microvascular ischemia: transient hypoperfusion of the anterior inferior cerebellar artery (AICA) or internal auditory artery supplying the labyrinth",
      "Genetic predispositions (familial clustering identified in 10% of cases; associated with DTNA, FAM136A, and PRKCB gene variants)"
    ],
    riskFactors: [
      "Age of onset commonly between 30 and 50 years of age (equal male-to-female distribution)",
      "High dietary sodium intake (provokes fluid retention and increases inner ear endolymphatic pressure)",
      "High caffeine, nicotine, and alcohol consumption (triggers inner ear microvascular vasospasm)",
      "Personal or family history of migraine (strong clinical and pathophysiological overlap between vestibular migraine and Ménière's disease)",
      "Chronic emotional distress, fatigue, or major weather/barometric pressure changes"
    ],
    symptoms: [
      "Paroxysmal Rotational Vertigo: violent, room-spinning vertigo lasting between 20 minutes and 12 hours, accompanied by severe horizontal-torsional nystagmus, diaphoresis, pallor, and intense nausea/vomiting",
      "Fluctuating Sensorineural Hearing Loss: progressive loss of low-frequency hearing in the affected ear, characteristically worsening immediately before and during vertigo attacks and partially recovering between flares",
      "Ipsilateral Tinnitus: loud, low-pitched roaring, rushing, humming, or buzzing sound in the affected ear",
      "Aural fullness: deep, uncomfortable sensation of mechanical pressure, plugging, or water trapped inside the affected ear preceding an attack",
      "Tumarkin's Otolithic Crisis ('Drop Attacks'): sudden, unprovoked violent falling to the ground without loss of consciousness (caused by acute otolithic macula deformation; occurs in advanced stages)",
      "Post-attack exhaustion: profound somnolence, brain fog, and unsteadiness lasting for 24 to 48 hours following a severe vertigo spell"
    ],
    diagnosis:
      "Diagnosed using the Barany Society & AAO-HNS Diagnostic Criteria: requiring (1) \u22652 spontaneous episodes of vertigo lasting 20 minutes to 12 hours, (2) Pure Tone Audiometry (PTA; documenting low-frequency sensorineural hearing loss >30 dB at 250, 500, and 1000 Hz in the affected ear), and (3) fluctuating hearing, tinnitus, or fullness in the affected ear. Gadolinium-enhanced High-Resolution Inner Ear MRI (3T-MRI with delayed intravenous gadolinium) directly visualizes endolymphatic hydrops in vivo. Brain MRI with Internal Auditory Canal (IAC) thin cuts is mandatory to definitively rule out a cerebellopontine angle tumor (vestibular schwannoma / acoustic neuroma) or multiple sclerosis.",
    differentialDiagnosis:
      "Differentiate Ménière's Disease from Vestibular Migraine (vertigo with migrainous headaches, photophobia, normal audiogram), Benign Paroxysmal Positional Vertigo (BPPV; brief vertigo lasting <1 minute triggered by head position changes, positive Dix-Hallpike test), Vestibular Neuritis / Labyrinthitis (acute continuous vertigo lasting several days following a viral infection), Acoustic Neuroma / Vestibular Schwannoma (unilateral progressive hearing loss and non-fluctuating tinnitus), and Posterior Circulation Cerebrovascular Stroke / TIA (associated with focal neurological signs: dysarthria, diplopia, ataxia).",
    conventionalManagement:
      "A structured tiered therapeutic approach: (1) Dietary and lifestyle modifications: strict dietary sodium restriction (<1.5–2.0 g/day), elimination of caffeine, nicotine, and alcohol. (2) Maintenance medical therapy: Betahistine (H1 agonist / H3 antagonist; increases inner ear microvascular blood flow) and oral diuretics (hydrochlorothiazide, triamterene; reduces endolymphatic hydrops). (3) Acute rescue therapy: vestibular suppressants (meclizine, dimenhydrinate) and antiemetics (ondansetron) for acute vertigo attacks. (4) Second-line interventional therapy: Intratympanic Dexamethasone injections (anti-inflammatory) or Intratympanic Gentamicin (chemical vestibular ablation for intractable unilateral vertigo). (5) Surgical procedures: Endolymphatic Sac Decompression / Shunt, Vestibular Nerve Section, or Labyrinthectomy for medically refractory cases.",
    homeopathicApproach:
      "Homeopathic constitutional and vestibular remedies (such as Cocculus Indicus, Conium Maculatum, Tabacum, Chininum Sulphuricum, Gelsemium Sempervirens, Theridion Curassavicum, Bryonia Alba, Kali Bichromicum, Phosphorus) serve as supportive care to ease motion sickness nausea, soothe aural heaviness, and assist equilibrium alongside strict low-sodium dietary adherence, audiometry tracking, and ENT monitoring.",
    lifestyleAdvice:
      "Strictly restrict dietary sodium to less than 1,500 to 2,000 mg per day (avoid processed canned foods, chips, cured meats, and soy sauce), distribute fluid intake evenly across the day, completely avoid caffeine (coffee, energy drinks), tobacco, and alcohol, practice stress reduction and deep breathing exercises, sleep with the head slightly elevated, and avoid driving or operating dangerous machinery when prodromal aural fullness signals an impending vertigo attack.",
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
        question: "Why is a low-salt diet so important for Ménière's disease?",
        answer: "Excess salt in your diet causes your body to retain fluid, which increases fluid pressure (endolymphatic hydrops) inside the delicate chambers of your inner ear. Keeping daily salt intake low and steady stabilizes inner ear pressure and dramatically reduces the frequency of vertigo attacks."
      },
      {
        question: "What is a 'Drop Attack' (Tumarkin's crisis) in Ménière's disease?",
        answer: "A drop attack is a sudden, terrifying sensation of being violently pushed to the ground without any warning or loss of consciousness. It happens in advanced Ménière's disease when a sudden pressure wave deforms the balance gravity sensors (otolithic organs) in the inner ear."
      }
    ],
    redFlags: [
      "Posterior Circulation Stroke (Vertebrobasilar / Cerebellar Infarction): acute sudden vertigo accompanied by the '5 Ds' of stroke: Dysarthria (slurred speech), Diplopia (double vision), Dysphagia (difficulty swallowing), Dysmetria / Ataxia (inability to walk, falling to one side), and Dizziness / Vertigo (neurological emergency requiring immediate emergency CT/MRI brain and stroke team activation)",
      "Acoustic Neuroma (Vestibular Schwannoma): asymmetric progressive unilateral hearing loss with facial numbness (trigeminal nerve involvement) or facial weakness (mandates thin-slice contrast MRI of the internal auditory canal)",
      "Sudden Sensorineural Hearing Loss (SSNHL): rapid drop in hearing over <72 hours without previous history (otologic emergency requiring immediate high-dose systemic corticosteroid therapy within 14 days to prevent permanent deafness)",
      "Vertigo accompanied by a new, severe, thunderclap headache or vertical nystagmus (central nervous system lesion)"
    ]
  },
  claimCitations: [
    { claimId: "D0062-TRADITIONAL-PROFILE", statement: "Homeopathic Ménière's disease profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0062-TRADITIONAL-PROFILE" },
    { claimId: "D0062-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for endolymphatic hydrops decompression, intratympanic gentamicin, or stroke differentiation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0062-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0062-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for posterior circulation stroke, cerebellar stroke, or acoustic neuroma.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Vertigo with slurred speech, double vision, or inability to walk indicating posterior circulation cerebellar stroke requiring emergency 911 dispatch",
    "Rapid unexplained unilateral deafness requiring emergency ENT evaluation for sudden sensorineural hearing loss",
    "Unilateral progressive hearing loss and facial numbness indicating vestibular schwannoma (acoustic neuroma) requiring MRI IAC"
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
  tags: ["Menieres Disease", "Endolymphatic Hydrops", "Vertigo", "Tinnitus", "Disease", "Hearing Loss", "Aural Fullness", "Otolaryngology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/meniere-s-disease",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive inner ear endolymphatic hydrops clinical boundaries, stroke/acoustic neuroma red flags, and verified citations"],
  clinicalPearl: "The classic clinical tetrad of episodic vertigo, fluctuating low-frequency hearing loss, roaring tinnitus, and aural fullness defines Ménière's disease.",
  quickFacts: {
    "Prevalence": "Estimated 0.2% to 0.5% of the adult population (peak onset between 30 and 50 years)",
    "Primary System": "Vestibulocochlear System & Inner Ear Labyrinth (Otolaryngology / Neurotology)",
    "Diagnostic Standard": "Pure Tone Audiometry (Low-Frequency SNHL) & Barany Society Criteria",
    "Clinical Character": "Endolymphatic hydrops causing episodic true vertigo, fluctuating hearing loss, tinnitus, and ear pressure"
  },
  aiReadiness: {
    retrievalSummary: "Ménière's Disease is an inner ear fluid disorder causing episodes of spinning vertigo, fluctuating hearing loss, tinnitus, and ear fullness, managed with supportive care, low-salt diet, betahistine, and ENT care.",
    clinicalSummary: "Ménière's Disease pathophysiology involves endolymphatic hydrops and membranous labyrinth hypertension. Homeopathic remedies serve as supportive vestibular care and do not replace low-sodium dietary therapy, pure tone audiometry, or emergency evaluation for posterior circulation cerebellar strokes or acoustic neuromas.",
    patientSummary: "Ménière's disease is an inner ear condition where fluid pressure builds up, causing sudden attacks of severe spinning dizziness (vertigo), ringing in the ear (tinnitus), ear fullness, and temporary hearing loss, helped by eating a low-salt diet.",
    studentSummary: "Classic tetrad: (1) episodic vertigo (20m-12h), (2) fluctuating low-frequency SNHL on audiogram, (3) tinnitus, (4) aural fullness. First-line management: dietary salt restriction (<2g/day) and diuretics. Red flag: posterior circulation stroke (HINTS exam).",
    keywords: ["menieres disease", "endolymphatic hydrops", "vertigo ear ringing", "tinnitus fullness", "low frequency hearing loss", "spinning dizziness attacks"],
    semanticKeywords: ["membranous labyrinth hydrops", "vestibular end organ hypertension", "episodic peripheral vertigo"],
    icd: "H81.09",
    mesh: "D008575",
    bodySystem: "Otolaryngology & Vestibular Medicine",
    urgency: "routine"
  }
};

export const MenieresDiseaseDisease = MenieresDisease;
