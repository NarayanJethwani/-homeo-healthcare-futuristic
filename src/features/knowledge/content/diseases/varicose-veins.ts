import { KnowledgeEntity } from "../../types";

export const VaricoseVeinsDisease: KnowledgeEntity = {
  id: "D0043",
  slug: "varicose-veins",
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
    en: "Varicose Veins (Chronic Venous Insufficiency / Varicosis)",
    hi: "वेरिकोज वेन्स / नसों का फूलना (Varicose Veins)",
    gu: "વેરિકોઝ વેઇન્સ / નસો ફૂલવી (Varicose Veins)",
    mr: "व्हेररिकोज व्हेन्स / पायातील फुगलेल्या शिरा (Varicose Veins)",
    es: "Venas Varicosas (Varices / Insuficiencia Venosa Crónica)",
    ar: "الدوالي الوريدية (Varicose Veins)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Varicose Veins, covering valvular incompetence, ambulatory venous hypertension, stasis dermatitis, venous ulceration, constitutional homeopathic supportive management, and emergency red flags for deep vein thrombosis (DVT), pulmonary embolism, and acute hemorrhagic variceal rupture.",
    hi: "वेरिकोज वेन्स (पैरों की उभरी व मुड़ी हुई नसें) का वाल्वुलर इनकॉम्पिटेंस पैथोलॉजी, वीनस हाइपरटेंशन, पैरों का भारीपन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और डीप वेन थ्रॉम्बोसिस (DVT) व नस फटने से रक्तस्राव की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "વેરિકોઝ વેઇન્સ (પગની ફૂલેલી વાદળી નસો) ની વાલ્વ નિષ્ફળતા પેથોલોજી, પગમાં ભારેપણો અને દુખાવો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ડીવીટી (ડીપ વેઇન થ્રોમ્બોસિસ) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "व्हेररिकोज व्हेन्स (पायाच्या फुगलेल्या आणि वळणदार शिरा), पायातील जडपणा व सूज, पारंपरिक होमिओपॅथिक पद्धत आणि डीप व्हेन थ्रॉम्बोसिसच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de las varices que cubre la insuficiencia valvular, hipertensión venosa, dermatitis por estasis, manejo homeopático complementario y banderas rojas de TVP y hemorragia.",
    ar: "دليل سريري وتعليمي موثوق للدوالي الوريدية يغطي القصور الصمامي الوريدي وارتفاع الضغط الوريدي والتهاب الجلد الركودي والرعاية التكميلية وعلامات الخطر للتخثر الوريدي العميق والنزف الحاد."
  },
  content: {
    overview:
      "Varicose Veins are dilated, elongated, tortuous, subcutaneous superficial veins (measuring \u22653 mm in diameter in the upright position), most frequently involving the great saphenous vein (GSV), small saphenous vein (SSV), and their tributaries in the lower extremities. Driven by venous valvular incompetence and chronically elevated ambulatory venous pressure (Chronic Venous Insufficiency / CVI), they present clinically with aching, heavy, throbbing leg pain, dependent ankle edema, nocturnal leg cramps, stasis dermatitis, and, in advanced stages, lipodermatosclerosis and non-healing venous stasis ulcers.",
    definition:
      "A manifestation of chronic venous disease of the lower extremities characterized by pathological dilatation, elongation, and tortuosity of superficial veins resulting from intraluminal valvular incompetence and venous wall remodeling.",
    causes: [
      "Primary valvular incompetence in the superficial saphenous system and perforator veins (incompetent valve cusps failing to prevent retrograde blood reflux)",
      "Structural weakness and altered collagen/elastin ratio in the venous wall matrix (matrix metalloproteinase upregulation and smooth muscle hypertrophy)",
      "Secondary venous hypertension resulting from deep vein thrombosis (post-thrombotic syndrome) or proximal venous outflow obstruction (May-Thurner syndrome, pelvic masses)",
      "Increased hydrostatic column pressure during prolonged upright standing or seated immobility"
    ],
    riskFactors: [
      "Advanced age (degenerative degradation of venous elastic tissue and valve cusps)",
      "Female gender and multiparity (high levels of progesterone promote venous smooth muscle relaxation and increased pelvic venous capacitance during pregnancy)",
      "Occupational prolonged standing or sitting (e.g., nurses, retail workers, teachers, surgeons, drivers)",
      "Family history of chronic venous insufficiency and genetic collagen variations",
      "Obesity (elevates intra-abdominal pressure, impeding lower extremity venous return)",
      "Prior lower extremity deep vein thrombosis (DVT) or phlebitis"
    ],
    symptoms: [
      "Prominent, bulging, bluish-purple, twisted, serpentine superficial veins visible beneath the skin of the calves and thighs",
      "Subjective heaviness, fatigue, dull aching, and throbbing pain in the lower extremities, typically worsening toward the end of the day",
      "Dependent bilateral or unilateral pitting ankle and pretibial edema that improves with leg elevation or overnight rest",
      "Nocturnal calf muscle cramps and restless legs syndrome",
      "Cutaneous trophic changes (CEAP C4–C6): brown-hemosiderin pigmentation around medial malleolus ('stasis pigmentation'), stasis eczema, lipodermatosclerosis ('inverted champagne bottle leg'), atrophie blanche, and medial ankle venous ulcerations"
    ],
    diagnosis:
      "Diagnosed clinically using the CEAP classification (Clinical, Etiological, Anatomical, Pathophysiological; stages C0 to C6). Venous Duplex Ultrasonography (B-mode and color Doppler) performed in the standing position is the diagnostic gold standard, mapping retrograde reflux duration (>0.5 seconds in superficial/perforator veins and >1.0 second in deep femoral/popliteal veins) and ruling out acute or chronic deep vein thrombosis.",
    differentialDiagnosis:
      "Differentiate Varicose Veins from Deep Vein Thrombosis (DVT), Superficial Thrombophlebitis, Lower Extremity Lymphedema (non-pitting, Stemmer's sign positive), Congestive Heart Failure / Renal Edema, Peripheral Arterial Disease (arterial ulcers on toes/dorsum of foot), and Cellulitis.",
    conventionalManagement:
      "Foundational conservative management includes graduated medical compression stockings (20–30 mmHg or 30–40 mmHg Class II/III), leg elevation, exercise, and topical emollients. Interventional minimally invasive procedures include Endovenous Thermal Ablation (EVLA / RFA), Non-Thermal Non-Tumescent Ablation (mechanochemical / cyanoacrylate glue 'VenaSeal'), Ultrasound-Guided Foam Sclerotherapy (UGFS), and surgical Ambulatory Phlebectomy / Saphenofemoral Ligation for complex anatomy.",
    homeopathicApproach:
      "Homeopathic constitutional and vascular remedies (such as Hamamelis Virginiana, Pulsatilla Nigricans, Calcarea Fluorica, Vipera Berus, Aesculus Hippocastanum, Fluoricum Acidum, Arnica Montana, Collinsonia Canadensis) serve as supportive care to ease venous congestion, relieve heavy aching soreness, and support tissue vitality alongside daily compression therapy and vascular Doppler evaluation.",
    lifestyleAdvice:
      "Wear graduated compression stockings daily during standing hours, elevate legs above heart level for 15–20 minutes 3 to 4 times daily, engage in regular calf-pumping exercises (walking, swimming, ankle pumps), avoid prolonged unbroken standing or seated immobility, maintain a healthy body weight to reduce venous pressure, and moisturize lower leg skin daily to prevent stasis skin breakdown.",
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
        question: "Why does the skin near the ankle turn dark brown in severe varicose veins?",
        answer: "High venous pressure forces red blood cells to leak out of capillaries into the surrounding subcutaneous tissue. When these red blood cells break down, iron pigments called hemosiderin deposit in the dermis, causing permanent dark brown staining (stasis pigmentation)."
      },
      {
        question: "Can compression stockings cure varicose veins?",
        answer: "Compression stockings do not eliminate or cure existing tortuous veins, but they provide external counter-pressure that assists venous return, prevents progressive worsening, and effectively relieves swelling, aching, and ulcers."
      }
    ],
    redFlags: [
      "Deep Vein Thrombosis (DVT): sudden acute onset of unilateral whole-leg swelling, severe calf tenderness, warmth, and erythema (requires immediate emergency vascular Doppler ultrasound and anticoagulation)",
      "Pulmonary Embolism (PE): sudden unexplained dyspnea, pleuritic chest pain, hemoptysis, tachycardia, or syncope (life-threatening emergency requiring emergency CT pulmonary angiography)",
      "Acute external hemorrhage from a ruptured superficial varicose vein or ulcer (requires immediate direct manual pressure, leg elevation, and urgent medical evaluation)",
      "Rapidly spreading erythema, ascending warmth, and systemic fever over a venous ulcer (suspected severe secondary bacterial cellulitis)"
    ]
  },
  claimCitations: [
    { claimId: "D0043-TRADITIONAL-PROFILE", statement: "Homeopathic varicose veins profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0043-TRADITIONAL-PROFILE" },
    { claimId: "D0043-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for endovenous ablation, thrombosis anticoagulation, or ulcer debridement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0043-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0043-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for deep vein thrombosis, pulmonary embolism, or active variceal hemorrhage.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden unilateral calf swelling, warmth, and pain indicating acute deep vein thrombosis (DVT)",
    "Sudden shortness of breath, chest pain, or hemoptysis indicating acute pulmonary embolism (PE)",
    "Active profuse bleeding from a ruptured varicose vein"
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
  tags: ["Varicose Veins", "Chronic Venous Insufficiency", "Varicosis", "Disease", "Leg Heaviness", "Stasis Dermatitis", "Venous Ulcers", "Vascular"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/varicose-veins",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive vascular insufficiency clinical boundaries, DVT/PE red flags, and verified citations"],
  clinicalPearl: "Always screen for acute Deep Vein Thrombosis with Doppler ultrasound whenever a varicose vein patient presents with sudden unilateral leg swelling or acute pain.",
  quickFacts: {
    "Prevalence": "Affects approximately 25–35% of adult women and 15–20% of adult men",
    "Primary System": "Cardiovascular & Peripheral Vascular System (Phlebology)",
    "Diagnostic Standard": "Standing Venous Duplex Color Doppler Ultrasonography",
    "Clinical Character": "Chronic ambulatory venous hypertension resulting in dilated tortuous superficial lower limb veins"
  },
  aiReadiness: {
    retrievalSummary: "Varicose Veins are dilated, tortuous superficial leg veins caused by venous valve failure and venous hypertension, presenting with leg heaviness, swelling, and stasis dermatitis, managed with supportive care, compression stockings, and vascular evaluation.",
    clinicalSummary: "Varicose Veins pathophysiology involves saphenous valvular incompetence and venous wall remodeling. Homeopathic remedies serve as supportive vascular care and do not replace emergency anticoagulation for deep vein thrombosis (DVT) or pulmonary embolism (PE), or interventional ablation for severe chronic venous insufficiency.",
    patientSummary: "Varicose veins are swollen, twisted, blue or purple veins that bulge under the skin of the legs, causing an aching heavy feeling, swelling, and cramps that feel better when putting your feet up.",
    studentSummary: "Classified using CEAP system (C0-C6). Venous Duplex ultrasound maps reflux (>0.5s). First-line therapy: graduated compression stockings (20-30 mmHg). Red flags: DVT (unilateral swelling) and pulmonary embolism (sudden dyspnea/chest pain).",
    keywords: ["varicose veins", "chronic venous insufficiency", "varices", "heavy legs", "spider veins", "stasis dermatitis", "leg swelling"],
    semanticKeywords: ["saphenofemoral incompetence", "ambulatory venous hypertension", "peripheral vascular disease"],
    icd: "I83.90",
    mesh: "D014648",
    bodySystem: "Cardiovascular & Vascular",
    urgency: "routine"
  }
};
