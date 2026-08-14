import { KnowledgeEntity } from "../../types";

export const DryEyeSyndromeDisease: KnowledgeEntity = {
  id: "D0064",
  slug: "dry-eye-syndrome",
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
    en: "Dry Eye Syndrome (Keratoconjunctivitis Sicca & Meibomian Gland Dysfunction)",
    hi: "ड्राई आई सिंड्रोम / आंखों का सूखापन व जलन (Dry Eye Syndrome)",
    gu: "ડ્રાય આઈ સિન્ડ્રોમ / આંખોમાં સુકાપો અને બળતરા (Dry Eye Syndrome)",
    mr: "ड्राय आय सिंड्रोम / डोळ्यांचा कोरडेपणा व जळजळ (Dry Eye Syndrome)",
    es: "Síndrome de Ojo Seco (Queratoconjuntivitis Seca y Disfunción de Glándulas de Meibomio)",
    ar: "متلازمة جفاف العين والتهاب القرنية والملتحمة الجاف (Dry Eye Syndrome)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Dry Eye Syndrome (Keratoconjunctivitis Sicca / DED), covering the vicious circle of tear film hyperosmolarity, evaporative Meibomian Gland Dysfunction (MGD), aqueous-deficient tear deficiency (Sjögren's Syndrome), ocular surface friction, constitutional homeopathic supportive management, and emergency red flags for infectious bacterial corneal ulceration, melting corneal perforation, and acute angle-closure glaucoma.",
    hi: "ड्राई आई सिंड्रोम (केराटोकोनजंक्टिवाइटिस सिका / आंखों का सूखापन) का टीयर फिल्म हाइपरोस्मोलैरिटी पैथोलॉजी, मीबोमियन ग्लैंड डिसफंक्शन (MGD), एक्वियस डेफिशिएंसी (Sjögren's), आंखों में रेत चुभने जैसा अहसास, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और बैक्टीरियल कॉर्नियल अल्सर (Corneal Ulcer) व कॉर्निया फटने की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ડ્રાય આઈ સિન્ડ્રોમ (આંખો સુકાઈ જવી) ની ઓક્યુલર ટીયર ફિલ્મ પેથોલોજી, આંખોમાં કચરો પડ્યો હોય તેવી ખૂંચ અને બળતરા, સ્ક્રીન ટાઈમની અસર, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને કીકી પર ચાંદુ પડવું (કોર્નિયલ અલ્સર) તથા દ્રષ્ટિ ગુમાવવાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "ड्राय आय सिंड्रोम (Dry Eye Disease), डोळ्यात वाळू टोचल्यासारखे वाटणे, लालसरपणा व जळजळ, कॉम्प्युटर स्क्रीनचा ताण, पारंपरिक होमिओपॅथिक पद्धत आणि कॉर्नियावरील अल्सर (Corneal Ulcer) व अंधत्वाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del síndrome de ojo seco que cubre la hiperosmolaridad lagrimal, disfunción de glándulas de Meibomio, manejo homeopático complementario y banderas rojas de úlcera corneal bacteriana y perforación corneal.",
    ar: "دليل سريري وتعليمي موثوق لمتلازمة جفاف العين يغطي فرط أسمولية الفلم الدمعي وخلل غدد ميبوميوس والتهاب القرنية والملتحمة الجاف والرعاية التكميلية وعلامات الخطر للقرحة القرنية الجرثومية والانثقاب القرني."
  },
  content: {
    overview:
      "Dry Eye Disease (DED / Keratoconjunctivitis Sicca [KCS]) is a multifactorial disorder of the ocular surface and tear film affecting approximately 5% to 30% of the global population, characterized by a loss of tear film homeostasis and accompanied by ocular symptoms. Classified fundamentally by the Tear Film & Ocular Surface Society (TFOS DEWS II) into two overlapping pathophysiological categories—Evaporative Dry Eye (the most common form, accounting for >85% of cases; driven by Meibomian Gland Dysfunction [MGD] leading to a deficient tear lipid layer and rapid tear evaporation) and Aqueous-Deficient Dry Eye (lacrimal gland failure leading to deficient tear volume, classically seen in autoimmune Sjögren's Syndrome or age-related lacrimal gland atrophy)—it initiates a self-perpetuating 'vicious circle' of tear film hyperosmolarity, ocular surface inflammation, goblet cell loss, and friction-induced corneal epithelial damage.",
    definition:
      "A multifactorial disease of the ocular surface characterized by a loss of homeostasis of the tear film, and accompanied by ocular symptoms, in which tear film instability and hyperosmolarity, ocular surface inflammation and damage, and neurosensory abnormalities play etiological roles.",
    causes: [
      "Evaporative Tear Deficiency: Meibomian Gland Dysfunction (MGD; ductal hyperkeratinization and altered lipid composition [meibum] causing tear lipid layer breakdown and excessive evaporation), blepharitis, infrequent or incomplete blinking during intense digital screen use ('computer vision syndrome'), and contact lens wear",
      "Aqueous Tear Deficiency: autoimmune lacrimal gland destruction in Primary or Secondary Sjögren's Syndrome (associated with Rheumatoid Arthritis, Systemic Lupus Erythematosus), non-Sjögren lacrimal gland infiltration (sarcoidosis, lymphoma), lacrimal gland ablation, or age-related ductal fibrosis",
      "Neurotrophic sensory denervation: impaired corneal sensory innervation following LASIK/PRK refractive surgery, chronic contact lens overwear, diabetes mellitus, or herpes simplex keratitis reducing the reflex lacrimation loop",
      "Pharmacological agents: systemic medications with anticholinergic properties (antihistamines, tricyclic antidepressants, decongestants), beta-blockers, oral contraceptives, diuretics, and topical ophthalmic preservatives (benzalkonium chloride [BAK])",
      "Anatomical eyelid abnormalities: lagophthalmos (incomplete eyelid closure during sleep), ectropion, entropion, or nocturnal exposure keratopathy"
    ],
    riskFactors: [
      "Advanced age (>50 years; progressive decline in androgen levels and lacrimal/meibomian secretion)",
      "Female gender (hormonal shifts during menopause, pregnancy, or hormone replacement therapy)",
      "Prolonged daily visual display unit (VDU / smartphone / computer) screen exposure reducing spontaneous blink rate from 15–20 blinks/min down to 4–6 blinks/min",
      "Environmental exposures: air-conditioned offices, low ambient humidity, forced air heaters, wind, aircraft cabins, and cigarette smoke",
      "Autoimmune diseases (Sjögren's syndrome, Rheumatoid Arthritis, Lupus, Thyroid Eye Disease)"
    ],
    symptoms: [
      "Persistent gritty, sandy, scratchy, or 'foreign body' sensation on the ocular surface as if an eyelash or grain of dust is trapped in the eye",
      "Burning, stinging, ocular tiredness, aching, and mild conjunctival hyperemia (redness)",
      "Paradoxical Epiphora (reflex tearing): sudden episodes of excessive watery tearing triggered by corneal epithelial exposure to air currents and friction",
      "Fluctuating visual acuity: intermittent blurring of vision that temporarily sharpens immediately after blinking",
      "Photophobia (light sensitivity) and severe ocular discomfort when opening eyes in air-conditioned or windy environments",
      "Accumulation of stringy, ropey mucus strands in the inner canthi of the eyes"
    ],
    diagnosis:
      "Diagnosed through an objective multi-parameter ophthalmic assessment (TFOS DEWS II diagnostic battery): (1) Non-Invasive Tear Break-Up Time (NIBUT / Fluorescein TBUT; pathognomonic if <10 seconds, indicating tear film instability). (2) Corneal and Conjunctival Staining with Fluorescein and Lissamine Green (evaluates punctate epithelial erosions and Oxford grading scale). (3) Tear Osmolarity Testing (hyperosmolarity >308 mOsm/L or inter-eye difference >8 mOsm/L). (4) Schirmer's Test without anesthesia (Schirmer I; measures aqueous tear production on standardized filter paper over 5 minutes—normal >10–15 mm; abnormal \u22645 mm confirming aqueous deficiency). (5) Meibography and Meibomian Gland Expression (assessing meibum clarity, gland drop-out, and capping). (6) Autoantibody screening (Anti-Ro/SSA and Anti-La/SSB antibodies for Sjögren's syndrome).",
    differentialDiagnosis:
      "Differentiate Dry Eye Disease from Allergic Conjunctivitis (prominent intense ocular itching, chemosis, tarsal papillae, seasonal flares), Blepharitis / Demodex Infestation (collarettes/cylindrical dandruff at eyelash bases), Infectious Bacterial/Viral Keratitis (focal corneal infiltrate with ciliary flush and severe pain), Recurrent Corneal Erosion Syndrome (sudden severe awakening eye pain), Anterior Uveitis (deep aching orbital pain, photophobia, ciliary flush, cells/flare in anterior chamber), and Glaucoma.",
    conventionalManagement:
      "A tiered evidence-based therapeutic ladder: (1) First-line environmental and tear supplementation: preservative-free artificial tear lubricating drops (carboxymethylcellulose, sodium hyaluronate, trehalose) 4 to 6 times daily, combined with bedtime lubricating ophthalmic ointments (mineral oil/petrolatum). (2) Meibomian Gland therapy for MGD: daily warm compresses (10 minutes at 40–45°C) followed by vertical eyelid massage, eyelid hygiene foam cleansers, and oral Omega-3 fatty acid supplementation (EPA/DHA 1,000–2,000 mg/day). (3) Anti-inflammatory ophthalmic pharmacotherapy (for moderate-to-severe DED): Topical Cyclosporine 0.05% or 0.1% (Restasis, Cequa), Lifitegrast 5% (Xiidra; LFA-1 antagonist), or short-course preservative-free topical loteprednol etabonate corticosteroids (2–4 weeks). (4) Tear conservation procedures: temporary or permanent Punctal Plugs (silicone or collagen plugs inserted into the lower/upper lacrimal puncta to block tear drainage). (5) Advanced therapies: Autologous Serum Eye Drops, scleral contact lenses (PROSE), and in-office thermal pulsation therapy (LipiFlow).",
    homeopathicApproach:
      "Homeopathic constitutional and ophthalmic remedies (such as Euphrasia Officinalis, Ruta Graveolens, Alumina, Silicea, Belladonna, Pulsatilla Nigricans, Aconitum Napellus, Zincum Metallicum, Natrum Muriaticum, Sulphur) serve as supportive care to ease ocular grittiness, soothe burning eye strain from digital devices, and support mucosal moisture alongside preservative-free artificial tears, warm lid compresses, and ophthalmologist monitoring.",
    lifestyleAdvice:
      "Practice the '20-20-20 rule' during computer and screen work (every 20 minutes, look at an object 20 feet away for at least 20 seconds and make 10 deliberate complete blinks), position computer monitors slightly below eye level to minimize the palpebral fissure surface area exposed to air, use a room humidifier in your bedroom and office, avoid direct airflow from car air vents, fans, or hair dryers into your eyes, wear wraparound sunglasses outdoors to block wind, and always use preservative-free eye drops if applying drops more than 4 times daily.",
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
        question: "Why do my eyes water constantly if I have 'dry eyes'?",
        answer: "When your tear film dries out, exposed corneal nerves send urgent panic signals to your brain that the eye is burning. Your brain responds by turning on the emergency lacrimal glands to flood the eye with watery reflex tears. However, these emergency tears lack natural oils, so they quickly evaporate and leave the eye dry again."
      },
      {
        question: "Why should I use 'preservative-free' artificial tears instead of standard drops?",
        answer: "Standard eye drop bottles contain chemical preservatives (like benzalkonium chloride [BAK]) to prevent bacterial growth in the bottle. When used frequently (more than 4 times a day), these preservatives can damage your corneal surface cells, making dry eyes significantly worse."
      }
    ],
    redFlags: [
      "Infectious Bacterial Corneal Ulcer (Keratitis): sudden severe localized eye pain, marked conjunctival injection (red eye), visible white or yellowish corneal spot/infiltrate, severe photophobia, and mucopurulent discharge (ophthalmic emergency requiring STAT slit-lamp examination and hourly fortified broad-spectrum antibiotic eye drops to prevent permanent corneal scarring or loss of the eye)",
      "Corneal Melting and Descemetocele / Perforation: severe progressive corneal thinning and spontaneous rupture of the anterior chamber with loss of ocular pressure (requires immediate tectonic corneal grafting or cyanoacrylate tissue gluing)",
      "Acute Angle-Closure Glaucoma: severe unilateral ocular/orbital pain, cloudy hazy cornea, fixed mid-dilated pupil, seeing rainbow-colored halos around lights, nausea, and vomiting",
      "Severe Primary Sjögren's Syndrome with systemic vasculitis, severe xerostomia with rampant dental decay, or B-cell lymphoma"
    ]
  },
  claimCitations: [
    { claimId: "D0064-TRADITIONAL-PROFILE", statement: "Homeopathic dry eye syndrome profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0064-TRADITIONAL-PROFILE" },
    { claimId: "D0064-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for corneal ulcer antibiotic clearance, corneal perforation grafting, or cyclosporine replacement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0064-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0064-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for bacterial corneal ulceration, corneal perforation, or acute glaucoma.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "White spot on the cornea with severe pain and redness indicating bacterial corneal ulcer requiring immediate emergency ophthalmology care",
    "Sudden ocular fluid leakage or visible corneal hole indicating descemetocele perforation requiring tectonic corneal surgery",
    "Severe eye pain with halos around lights, cloudy cornea, and vomiting indicating acute angle-closure glaucoma"
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
  tags: ["Dry Eye Syndrome", "Keratoconjunctivitis Sicca", "MGD", "Meibomian Gland", "Disease", "Tear Break Up Time", "Artificial Tears", "Ophthalmology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/dry-eye-syndrome",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive TFOS DEWS II tear film hyperosmolarity clinical boundaries, corneal ulcer/perforation red flags, and verified citations"],
  clinicalPearl: "Paradoxical excessive watery tearing is a classic sign of evaporative dry eye; rapid evaporation of poor-quality tears triggers reflex hyperlacrimation.",
  quickFacts: {
    "Global Prevalence": "Affects 5% to 30% of adults worldwide (significantly higher in screen users and postmenopausal women)",
    "Primary System": "Ocular Surface & Lacrimal-Meibomian Functional Unit (Ophthalmology / Cornea)",
    "Diagnostic Standard": "Tear Break-Up Time (TBUT <10s), Ocular Surface Staining, & Schirmer Test (\u22645mm)",
    "Clinical Character": "Multifactorial ocular surface disorder driven by tear film hyperosmolarity and meibomian dysfunction"
  },
  aiReadiness: {
    retrievalSummary: "Dry Eye Syndrome is an ocular surface disorder causing gritty foreign body sensation, burning, and reflex tearing due to tear instability, managed with supportive care, preservative-free tears, and warm lid compresses.",
    clinicalSummary: "Dry Eye Syndrome pathophysiology involves tear film hyperosmolarity, evaporative Meibomian Gland Dysfunction (MGD), and aqueous deficiency (Sjögren's). Homeopathic remedies serve as supportive ocular care and do not replace preservative-free artificial tears, punctal plugs, or emergency ophthalmology care for bacterial corneal ulcers or corneal perforation.",
    patientSummary: "Dry eye syndrome happens when your eyes do not make enough tears or your tears evaporate too quickly, making your eyes feel gritty, sandy, and tired, improved by using preservative-free lubricating eye drops and warm eyelid compresses.",
    studentSummary: "Multifactorial disease categorized into Evaporative (MGD, >85%) and Aqueous-Deficient (Sjögren's). Hallmark: gritty foreign body sensation and reflex epiphora. Diagnostic battery: TBUT <10s, Schirmer \u22645mm, ocular surface staining. Red flags: infectious corneal ulcer (white infiltrate) and corneal perforation.",
    keywords: ["dry eye syndrome", "keratoconjunctivitis sicca", "gritty eyes foreign body", "burning watery eyes", "meibomian gland dysfunction", "artificial tears preservative free", "computer vision eye strain"],
    semanticKeywords: ["tear film hyperosmolarity", "ocular surface friction inflammation", "meibomian lipid deficiency"],
    icd: "H04.123",
    mesh: "D015352",
    bodySystem: "Ophthalmology & Eye Health",
    urgency: "routine"
  }
};
