import { KnowledgeEntity } from "../../types";

export const GingivitisDisease: KnowledgeEntity = {
  id: "D0050",
  slug: "gingivitis",
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
    en: "Gingivitis & Periodontal Inflammation (Dental Plaque-Induced Gum Disease)",
    hi: "मसूड़े की सूजन व मसूड़ों से खून आना / जिंजिवाइटिस (Gingivitis)",
    gu: "પેઢાનો સોજો / પાયોરિયા અને પેઢામાંથી લોહી નીકળવું (Gingivitis)",
    mr: "हिरड्यांची सूज व रक्त येणे / जिंजिव्हायटिस (Gingivitis)",
    es: "Gingivitis e Inflamación Periodontal (Enfermedad Gingival Inducida por Placa)",
    ar: "التهاب اللثة وأمراض النسج الداعمة (Gingivitis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Plaque-Induced Gingivitis, covering subgingival polymicrobial bacterial biofilm accumulation, host innate inflammatory chemokine recruitment, bleeding on probing (BOP), constitutional homeopathic supportive management, and emergency red flags for Acute Necrotizing Ulcerative Gingivitis (ANUG / trench mouth), Ludwig's angina, and deep facial space odontogenic infections.",
    hi: "जिंजिवाइटिस (मसूड़ों की सूजन व खून आना) का डेंटल प्लाक बैक्टीरियल बायोफिल्म पैथोलॉजी, ब्रशिंग करते समय मसूड़ों से खून निकलना, मसूड़ों की लालिमा व सूजन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और एक्यूट नेक्रोटाइजिंग अल्सरेटिव जिंजिवाइटिस (ANUG / Trench Mouth) व लुडविग एंजाइना की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પેઢાનો સોજો (જીંજીવાઇટીસ) ની બેક્ટેરિયલ બાયોફિલ્મ પેથોલોજી, બ્રશ કરતી વખતે પેઢામાંથી લોહી આવવું, પેઢા ફૂલી જવા અને દુખાવો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને લુડવિગ એન્જાઇના તથા ગળા-જડબાના ગંભીર ઇન્ફેક્શનની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "हिरड्यांची सूज (Gingivitis), दात घासताना हिरड्यांमधून रक्त येणे, तोंडाची दुर्गंधी, पारंपरिक होमिओपॅथिक पद्धत आणि नेक्रोटायझिंग जिंजिव्हायटिस (ANUG) व लुडविग्स एनजायनाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la gingivitis que cubre la biopelícula bacteriana subgingival, sangrado al sondaje, manejo homeopático complementario y banderas rojas de gingivitis ulceronecrotizante aguda (GUNA) y angina de Ludwig.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب اللثة يغطي تراكم اللويحة الجرثومية تحت اللثوية والنزف عند السبر والرعاية التكميلية وعلامات الخطر لالتهاب اللثة التقرحي النخري الحاد وخناق لودفيغ."
  },
  content: {
    overview:
      "Gingivitis is the most prevalent form of periodontal disease, affecting upwards of 70% to 90% of the global adult population. Plaque-Induced Gingivitis is an inflammatory condition of the gingival soft tissues surrounding the teeth, initiated by the accumulation of a complex polymicrobial bacterial biofilm (dental plaque) along the gingival margin. It characteristically manifests as gingival erythema, edema, loss of normal stippled texture, gingival enlargement, tenderness, halitosis (bad breath), and pathognomonic Bleeding on Probing (BOP) or bleeding during routine toothbrushing and flossing. Crucially, gingivitis is a reversible disease process confined strictly to the gingiva—without loss of clinical periodontal attachment, without periodontal pocket formation, and without alveolar bone resorption. However, if left unmanaged, it can progress irreversibly to Periodontitis, causing progressive bone loss, tooth mobility, and premature tooth loss.",
    definition:
      "A reversible, non-destructive inflammatory lesion of the gingival soft tissues directly elicited by dental bacterial plaque accumulation at the gingival margin, characterized by bleeding on probing in the absence of clinical attachment loss or alveolar bone destruction.",
    causes: [
      "Dental Plaque Biofilm Accumulation: uninhibited colonization of tooth surfaces by supra- and subgingival bacteria (Fusobacterium nucleatum, Prevotella intermedia, Porphyromonas gingivalis, Streptococcus spp., Actinomyces spp.) forming an organized structured extracellular matrix",
      "Host Innate Immune Response: bacterial lipopolysaccharides (LPS), proteases, and metabolic acids trigger gingival epithelial cells to release IL-1beta, TNF-alpha, IL-6, IL-8, and matrix metalloproteinases (MMPs), inducing vascular dilation, increased vascular permeability, and neutrophil transmigration into the gingival sulcus (crevicular fluid exudate)",
      "Dental calculus (tartar): calcified mineralized plaque creating a rough, plaque-retentive surface that prevents mechanical plaque removal",
      "Systemic hormonal fluctuations: exaggerated gingival vascular response to plaque during puberty, pregnancy ('pregnancy gingivitis' / pregnancy epulis driven by elevated progesterone and estrogens), and oral contraceptive therapy",
      "Nutritional deficiencies: severe Vitamin C deficiency (Scurvy; impaired collagen synthesis leading to swollen, bleeding, ulcerated gingiva)",
      "Drug-Induced Gingival Enlargement: pharmacological hyperplasia induced by calcium channel blockers (amlodipine, nifedipine), anticonvulsants (phenytoin), or immunosuppressants (cyclosporine)"
    ],
    riskFactors: [
      "Inadequate oral hygiene (infrequent brushing, lack of daily interdental flossing)",
      "Tobacco smoking and smokeless tobacco use (masks bleeding by causing gingival vasoconstriction while accelerating periodontal tissue destruction)",
      "Poorly controlled Diabetes Mellitus (impaired neutrophil chemotaxis and exaggerated pro-inflammatory cytokine secretion)",
      "Pregnancy and hormonal surges",
      "Malaligned / crowded teeth, defective dental restorations with overhangs, and fixed orthodontic appliances that trap plaque"
    ],
    symptoms: [
      "Gingival bleeding on provocation: bleeding upon gentle toothbrushing, flossing, eating hard foods (apples), or during dental probing",
      "Gingival color change: marginal gingiva turns from normal pale coral-pink to bright red, fiery erythematous, or deep violaceous/cyanotic",
      "Gingival edema: swollen, puffy, spongy, rolled gingival margins with loss of normal knife-edge architecture and loss of healthy orange-peel stippling",
      "Halitosis: persistent bad breath or unpleasant foul metallic taste in the mouth caused by volatile sulfur compounds (VSCs) produced by oral anaerobes",
      "Mild tenderness or dull soreness of the gums during mastication or brushing",
      "Absence of tooth mobility, pathological dental migration, or deep periodontal pocketing (>3 mm with attachment loss) in uncomplicated gingivitis"
    ],
    diagnosis:
      "Diagnosed clinically by a registered dental professional through a comprehensive Periodontal Examination: (1) Bleeding on Probing (BOP; the gold standard diagnostic parameter—gingivitis is defined as \u226510% bleeding sites on gentle 0.25 N probing). (2) Periodontal Probing Depth (PPD; measuring sulcus depths—normal healthy sulcus \u22643 mm without clinical attachment loss; pseudo-pockets may occur due to gingival swelling). (3) Plaque Index and Calculus Assessment. (4) Full-Mouth Dental Radiographs (Bitewing / Periapical X-rays; mandatory to confirm normal alveolar bone crest height [1.5–2.0 mm from the cementoenamel junction] and rule out chronic Periodontitis).",
    differentialDiagnosis:
      "Differentiate Plaque-Induced Gingivitis from Chronic Periodontitis (irreversible clinical attachment loss, periodontal pockets >4–6 mm, horizontal/vertical alveolar bone resorption on X-rays, and tooth mobility), Acute Necrotizing Ulcerative Gingivitis (ANUG; punched-out necrotic interdental papillae with grey pseudomembrane and severe pain), Primary Herpetic Gingivostomatitis (widespread painful oral vesicles and ulcerations with high fever), Lichen Planus (erosive/desquamative gingivitis with Wickham striae), Mucous Membrane Pemphigoid, and Leukemic Gingival Infiltration.",
    conventionalManagement:
      "A comprehensive, highly effective professional dental protocol: (1) Professional Mechanical Plaque Removal: thorough ultrasonic scaling and dental prophylaxis (debridement of supra- and subgingival plaque and calculus) performed every 6 months. (2) Daily home oral hygiene optimization: twice-daily brushing using a soft-bristled toothbrush with fluoridated toothpaste utilizing the Modified Bass technique, daily interdental cleaning (flossing, interdental brushes, or water flossers). (3) Short-term antimicrobial adjuncts: Chlorhexidine gluconate 0.12% or 0.2% mouthwash used twice daily for 2 weeks during acute flares (limited to prevent tooth staining and taste alteration), or essential oil / cetylpyridinium chloride (CPC) rinses for daily maintenance. (4) Correction of local plaque-retentive factors (smoothing overhangs, fixing ill-fitting crowns).",
    homeopathicApproach:
      "Homeopathic constitutional and oral-mucosal remedies (such as Mercurius Solubilis, Hepar Sulphuris Calcareum, Kreosotum, Plantago Major, Carbo Vegetabilis, Phosphorus, Silicea, Calcarea Fluorica, Staphysagria, Nitricum Acidum) serve as supportive care to ease gum tenderness, soothe swelling, and support tissue healing alongside daily flossing, toothbrushing, and professional dental ultrasonic scaling.",
    lifestyleAdvice:
      "Brush teeth thoroughly twice daily for a full 2 minutes using the Modified Bass technique (angling bristles 45 degrees toward the gumline), clean between teeth daily with dental floss or interdental brushes before nighttime brushing, rinse with warm saline solution (half a teaspoon of salt in warm water) to soothe inflamed gums, replace your toothbrush every 3 months or immediately following a cold/infection, cease all tobacco smoking, and schedule professional dental scaling check-ups every 6 months.",
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
        question: "Can gingivitis be completely cured, or is gum damage permanent?",
        answer: "Gingivitis is 100% reversible. Because it is confined to the surface gum tissue without bone damage, improving your brushing, flossing daily, and getting professional dental scaling will restore gums to complete health within 10 to 14 days."
      },
      {
        question: "Why do gums bleed during brushing, and should I stop brushing if they bleed?",
        answer: "Gums bleed because accumulated bacterial plaque produces toxins that dilate tiny blood vessels and cause inflammation. You should NEVER stop brushing or flossing when gums bleed; gentle, thorough cleaning is the exact cure needed to remove the bacteria and stop the bleeding."
      }
    ],
    redFlags: [
      "Acute Necrotizing Ulcerative Gingivitis (ANUG / Trench Mouth): rapid onset of excruciating gum pain, 'punched-out' crater-like ulcerations of the interdental papillae covered by a greyish-yellow necrotic pseudomembrane, metallic taste, severe fetid halitosis, fever, and submandibular lymphadenopathy (requires immediate urgent dental debridement, chlorhexidine, and oral metronidazole)",
      "Ludwig's Angina: rapid-onset bilateral, brawny, non-fluctuant swelling of the submandibular, sublingual, and submental spaces with elevation and protrusion of the tongue, airway compromise, severe dysphagia, and stridor (life-threatening surgical airway emergency requiring immediate hospitalization, airway management, IV antibiotics, and surgical decompression)",
      "Severe Spontaneous Gingival Hemorrhage with widespread cutaneous petechiae, ecchymoses, or profound fatigue (urgent hematological evaluation to rule out Acute Leukemia or severe thrombocytopenia)",
      "Rapidly developing facial swelling with high fever, trismus (inability to open mouth), and orbital swelling (odontogenic facial space infection)"
    ]
  },
  claimCitations: [
    { claimId: "D0050-TRADITIONAL-PROFILE", statement: "Homeopathic gingivitis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0050-TRADITIONAL-PROFILE" },
    { claimId: "D0050-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for professional ultrasonic scaling, ANUG debridement, or Ludwig's angina airway management.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0050-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0050-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute necrotizing gingivitis, Ludwig's angina, or deep facial space infections.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Severe painful punched-out necrotic gum craters with foul odor indicating ANUG requiring immediate dental debridement and antibiotics",
    "Brawny submandibular neck swelling with tongue elevation and breathing difficulty indicating Ludwig's angina airway emergency",
    "Spontaneous heavy gum bleeding with petechial rash indicating acute leukemia requiring emergency hematology evaluation"
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
  tags: ["Gingivitis", "Bleeding Gums", "Gum Disease", "Dental Plaque", "Disease", "Swollen Gums", "Dental Probing", "Periodontology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gingivitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive dental plaque biofilm clinical boundaries, ANUG/Ludwig's angina red flags, and verified citations"],
  clinicalPearl: "Gingivitis is fully reversible within 10 to 14 days of professional scaling and daily interdental flossing, as no bone loss or attachment loss has yet occurred.",
  quickFacts: {
    "Prevalence": "Affects over 70% to 90% of adults worldwide (most common periodontal disease)",
    "Primary System": "Gastrointestinal System & Oral Periodontal Tissues (Dentistry / Periodontology)",
    "Diagnostic Standard": "Clinical Periodontal Exam (Bleeding on Probing \u226510% & Normal Bone on Radiographs)",
    "Clinical Character": "Reversible plaque-induced gingival inflammation characterized by bleeding during toothbrushing"
  },
  aiReadiness: {
    retrievalSummary: "Gingivitis is a common, reversible gum inflammation causing redness, swelling, and bleeding during brushing due to dental plaque, managed with supportive care, daily flossing, and professional dental scaling.",
    clinicalSummary: "Gingivitis pathophysiology involves subgingival polymicrobial bacterial biofilm (plaque) stimulating innate chemokine release and vascular hyperpermeability without periodontal attachment loss. Homeopathic remedies serve as supportive oral care and do not replace mechanical dental scaling, daily flossing, or emergency treatment for ANUG or Ludwig's angina.",
    patientSummary: "Gingivitis is gum inflammation that makes your gums red, swollen, and bleed when you brush your teeth, caused by plaque buildup and fully cured by daily flossing, thorough brushing, and a dental cleaning.",
    studentSummary: "Reversible gingival inflammation without attachment loss or alveolar bone resorption. Hallmark: Bleeding on Probing (BOP \u226510%). Etiology: bacterial plaque biofilm. First-line management: mechanical scaling + daily interdental flossing. Red flags: ANUG (trench mouth) and Ludwig's angina.",
    keywords: ["gingivitis", "bleeding gums brushing", "swollen gums", "gum disease", "dental plaque", "bad breath halitosis", "bleeding on probing"],
    semanticKeywords: ["plaque induced gingival disease", "subgingival biofilm inflammation", "periodontal sulcular erythema"],
    icd: "K05.10",
    mesh: "D005891",
    bodySystem: "Dentistry & Oral Health",
    urgency: "routine"
  }
};
