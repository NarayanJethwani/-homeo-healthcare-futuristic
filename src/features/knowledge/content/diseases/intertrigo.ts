import { KnowledgeEntity } from "../../types";

export const IntertrigoDisease: KnowledgeEntity = {
  id: "D0074",
  slug: "intertrigo",
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
    en: "Intertrigo & Intertriginous Candidiasis (Skin Fold Friction, Maceration & Satellite Pustulosis)",
    hi: "इंटरट्रिगो / त्वचा की सिलवटों में लालिमा, रगड़ व फंगल इन्फेक्शन (Intertrigo / Skin Fold Rash)",
    gu: "ઇન્ટરટ્રિગો / ચામડીના સળિયામાં થતી બળતરા અને ફૂગનો ચેપ (Intertrigo / Chafing)",
    mr: "इंटरट्रिगो / त्वचेच्या घड्यांमधील जळजळ व फंगल इन्फेक्शन (Intertrigo / Chafing)",
    es: "Intértrigo e Intertrigo Candidiasico (Fricción de Pliegues Cutáneos, Maceración y Pústulas Satélite)",
    ar: "المذح والتسلخات الجلدية في الثنيات الفطرية (Intertrigo)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Intertrigo and Intertriginous Candidiasis, covering moisture-associated skin friction damage, stratum corneum maceration, secondary Candida albicans opportunistic overgrowth, pathognomonic satellite pustulosis, bacterial superinfections (Corynebacterium erythrasma), constitutional homeopathic supportive management, and emergency red flags for necrotizing fasciitis, spreading bacterial cellulitis, and invasive candidemia in immunocompromised diabetic patients.",
    hi: "इंटरट्रिगो (त्वचा की सिलवटों जैसे जांघों, स्तनों के नीचे, बगल में रगड़ व फंगस) का स्किन फ्रिक्शन पैथोलॉजी, मैकरेटेड लाल चकत्ते, कैंडिडा एल्बिकैन्स ओवरग्रोथ, सैटेलाइट फुंसियां (Satellite Pustules), एरिथ्रास्मा (Wood's lamp), पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और नेक्रोटाइजिंग फैसियाइटिस (Necrotizing Fasciitis) व सेल्युलाइटिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ઇન્ટરટ્રિગો (જાંઘ, બગલ અને સ્તનની નીચે ચામડી ઘસાઈને લાલ થવી) ની પેથોલોજી, પરસેવાને લીધે ચામડી પોચી પડી છોલાઈ જવી, ફૂગનો ચેપ, નાની નાની ફોડલીઓ થવી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ચામડી સડી જવી (ગેન્ગ્રીન / સેલ્યુલાઇટિસ) તથા ગંભીર ઇન્ફેક્શનની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "इंटरट्रिगो (त्वचेच्या घड्यांमधील चट्टे), घाम व घर्षणामुळे होणारी जळजळ, बुरशीजन्य इन्फेक्शन (Candida), खाज व पुरळ, पारंपरिक होमिओपॅथिक पद्धत आणि गंभीर जिवाणू संसर्ग (Cellulitis / Necrotizing Fasciitis) च्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del intértrigo que cubre el daño por fricción cutánea, maceración del estrato córneo, sobrecrecimiento de Candida albicans, pústulas satélite, manejo homeopático complementario y banderas rojas de fascitis necrosante y celulitis.",
    ar: "دليل سريري وتعليمي موثوق للمذح والتهاب الثنيات الفطري يغطي التلف الاحتكاكي للجلد والتنقع واحمرار الثنيات والبثور التابعة والمبيضات البيض والرعاية التكميلية وعلامات الخطر لالتهاب اللفافة الناخر والتهاب الهلل."
  },
  content: {
    overview:
      "Intertrigo is an inflammatory, friction-induced dermatological condition of the intertriginous body folds (skin-on-skin surfaces), affecting up to 20% of obese individuals, diabetic patients, and bedbound or institutionalized individuals. Driven by the mechanical friction of opposing skin surfaces rubbing together in the presence of trapped sweat, moisture, warmth, and limited air circulation, the stratum corneum barrier becomes hydrated, softened, and disrupted (Maceration). The damaged, warm, alkaline microenvironment creates an ideal breeding ground for secondary microbial colonization and infection—most classically by the opportunistic yeast Candida albicans (producing bright 'beefy red' plaques with peripheral satellite pustules), as well as Gram-positive bacteria (Corynebacterium minutissimum [Erythrasma], Staphylococcus aureus, and Streptococcus pyogenes) and Gram-negative species (Pseudomonas aeruginosa).",
    definition:
      "A superficial inflammatory dermatosis occurring in opposing skin folds caused by moisture, warmth, and friction, frequently complicated by secondary Candida fungal or bacterial superinfection.",
    causes: [
      "Mechanical Skin-on-Skin Friction: repetitive physical shear stress and chafing between closely apposed cutaneous surfaces (axillae, inframammary folds, inguinal creases, abdominal pannus folds, gluteal cleft, and interdigital spaces)",
      "Moisture-Associated Skin Damage (MASD): excessive trapped perspiration (hyperhidrosis), urinary/fecal incontinence, or weeping serous fluid softening the stratum corneum and breaking down epidermal intercellular lipid bilayers",
      "Secondary Fungal Superinfection (Candida Albicans): opportunistic proliferation and phenotypic switching of commensal yeast into invasive pseudo-hyphae, secreting proteases that breach the macerated epidermal barrier",
      "Secondary Bacterial Superinfection: Corynebacterium minutissimum (causing Erythrasma; producing porphyrins that fluoresce coral-red), Streptococcus pyogenes (streptococcal intertrigo), Staphylococcus aureus, and Pseudomonas aeruginosa (producing green pus and sweet odor)",
      "Obesity and Anatomical Skin Folds: enlarged, heavy skin aprons (panniculi) creating deep, hypoxic, poorly ventilated intertriginous crevices with high ambient friction"
    ],
    riskFactors: [
      "Obesity and high body mass index (BMI \u226530; creates deep abdominal, groin, and submammary skin folds)",
      "Type 2 Diabetes Mellitus (cutaneous hyperglycemia and glycosuria in the groin accelerate fungal growth and impair neutrophil phagocytosis)",
      "Warm, humid, tropical summer climates and excessive physical activity producing heavy sweating",
      "Poor hygiene, tight occlusive synthetic clothing, or prolonged immobility in hospital/nursing home beds",
      "Immunosuppression (HIV, chemotherapy, chronic systemic corticosteroids)"
    ],
    symptoms: [
      "Erythematous Intertriginous Plaques: symmetric, mirror-image ('kissing lesions'), fiery red or deep pink macular patches located precisely within opposing skin creases (inframammary, inguinal, axillary, intergluteal, or abdominal apron folds)",
      "Stratum Corneum Maceration: pale, white, soggy, softened, weeping, waterlogged skin in the deepest crevice of the fold, accompanied by painful linear fissures (skin cracking)",
      "Pathognomonic Satellite Pustulosis (Candidal Intertrigo): bright 'beefy red' central plaque with tiny, pinpoint, discrete red papules, pustules, and collarettes of scale scattered beyond the distinct advancing border",
      "Sensory Discomfort: intense burning, stinging, itching (pruritus), raw tenderness, and chafing pain aggravated by movement, heat, and perspiration",
      "Malodorous exudate: sour, yeasty, or foul odor from trapped secretions and bacterial breakdown of keratin debris",
      "Absence of high fever, spreading indurated warmth, or skin crepitus in uncomplicated intertrigo"
    ],
    diagnosis:
      "Diagnosed primarily clinically based on visual inspection of the skin folds and straightforward bedside confirmatory testing: (1) Clinical Physical Examination (pathognomonic location in skin creases, kissing symmetry, and presence of satellite pustules). (2) Potassium Hydroxide (KOH) 10% Preparation of Skin Scrapings: direct microscopic examination demonstrating diagnostic budding yeast blastospores and branching pseudohyphae of Candida. (3) Wood's Lamp (Blacklight) Examination: long-wave UVA illumination demonstrating diagnostic Coral-Red Fluorescence pathognomonic for Erythrasma (Corynebacterium minutissimum porphyrin production). (4) Bacterial and Fungal Swab Cultures: indicated in refractory, purulent, erosive, or necrotic cases to identify methicillin-resistant S. aureus (MRSA) or Pseudomonas. (5) Fasting Blood Glucose and HbA1c screening: mandatory in all patients with recurrent or severe candidal intertrigo to screen for undiagnosed diabetes.",
    differentialDiagnosis:
      "Differentiate Intertrigo from Inverted / Inverse Psoriasis (smooth, shiny, deep red plaques in skin folds WITHOUT satellite pustules or silvery scaling, associated with nail pitting or scalp psoriasis), Tinea Cruris ('Jock Itch'; Dermatophyte fungal infection [Trichophyton rubrum]: raised, active scaling border with central clearing, characteristically sparing the scrotum, unlike candidiasis which heavily involves the scrotum), Hailey-Hailey Disease (familial benign chronic pemphigus: erosions and fissures in skin folds resembling 'wet tissue paper'), Erythrasma, Seborrheic Dermatitis, and Extramammary Paget's Disease (unresponsive, chronic, eczematous plaque requiring biopsy).",
    conventionalManagement:
      "A structured dermatological protocol focusing on drying, friction reduction, and targeted antimicrobials: (1) Core Barrier Drying & Friction Elimination: keeping skin folds meticulously clean and dry (using hair dryers on cool setting after bathing), placing clean, absorbent cotton/linen cloths or specialized moisture-wicking intertrigo dressings (InterDry with antimicrobial silver) between opposing skin surfaces, and using barrier pastes (zinc oxide, petrolatum) or drying powders (plain talc or cornstarch in uninfected states). (2) Topical Antifungal Therapy (for candidal intertrigo): Topical Clotrimazole 1%, Miconazole 2%, Ketoconazole 2%, or Nystatin cream applied twice daily for 2 to 4 weeks (combination antifungal-corticosteroid creams [e.g., clotrimazole-betamethasone] should be strictly avoided in skin folds due to high risk of severe steroid atrophy, striae, and telangiectasia). (3) Topical Antibacterial Therapy for Erythrasma: Topical Clindamycin 1% or Erythromycin 2% gel twice daily, or oral Clarithromycin 1 g single dose. (4) Systemic Antifungals (Oral Fluconazole 150 mg once weekly for 2–4 weeks) reserved for extensive, severe, or immunocompromised cases.",
    homeopathicApproach:
      "Homeopathic constitutional and intertrigo remedies (such as Graphites, Sulphur, Petroleum, Merc Sol, Lycopodium Clavatum, Causticum, Sepia Officinalis, Arsenicum Album, Rhus Toxicodendron, Hepar Sulphuris Calcareum) serve as supportive care to ease burning friction soreness, soothe skin fold itching, and support skin tissue recovery alongside cool drying techniques, cotton cloth barriers, and topical antifungal creams.",
    lifestyleAdvice:
      "Dry skin folds thoroughly after showering by gently patting with a clean towel and using a hair dryer on the cold/cool air setting, place a clean strip of dry cotton cloth or specialized moisture-wicking fabric inside deep skin folds under the breasts or abdomen to prevent skin-on-skin rubbing, wear loose-fitting, breathable 100% cotton clothing (avoid tight synthetic nylon or polyester), change out of sweaty workout clothes immediately after exercising, wash skin folds with gentle fragrance-free non-soap cleansers, manage blood sugar levels diligently if diabetic, and pursue gradual healthy weight loss to reduce deep skin fold depth.",
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
        question: "Why should I avoid using hydrocortisone or strong steroid creams on skin fold rashes?",
        answer: "Skin in the groin, armpits, and under the breasts is naturally very thin and warm. When you apply strong steroid creams to these enclosed folds, the skin absorbs massive amounts of steroid, causing the skin to rapidly thin out, stretch, tear (striae), and permanently weaken its defenses, allowing fungus (Candida) to spread even deeper."
      },
      {
        question: "How do I know if my skin fold rash is a yeast infection?",
        answer: "If the rash is bright 'beefy red' with raw, oozing skin in the fold and tiny red dots or pimples scattered around the edges (called 'satellite pustules'), it is almost certainly a Candida yeast infection requiring an antifungal cream."
      }
    ],
    redFlags: [
      "Necrotizing Fasciitis / Fournier Gangrene: rapid progression of severe, excruciating pain 'out of proportion' to visible skin findings, rapidly spreading dusky purple or black bullae, cutaneous crepitus (crackling gas bubbles under skin), high fever, and septic shock (life-threatening surgical emergency requiring immediate emergent debridement and broad-spectrum IV antibiotics)",
      "Spreading Bacterial Cellulitis / Erysipelas: rapidly expanding, warm, indurated, raised, fiery red plaque with red lymphangitic streaks, high spiking fever, and leukocytosis extending from a skin fold fissure (requires systemic antibiotics)",
      "Invasive Systemic Candidemia: fever, shaking chills, and systemic sepsis in an immunocompromised or diabetic patient with extensive candidal skin breakdowns",
      "Chronic, Non-Healing Ulcerated Plaque in the Groin or Perineum failing antifungal therapy (mandates skin punch biopsy to rule out Extramammary Paget's Disease or Squamous Cell Carcinoma)"
    ]
  },
  claimCitations: [
    { claimId: "D0074-TRADITIONAL-PROFILE", statement: "Homeopathic intertrigo profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0074-TRADITIONAL-PROFILE" },
    { claimId: "D0074-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for necrotizing fasciitis surgical debridement, cellulitis IV antibiotic clearance, or systemic candidemia resuscitation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0074-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0074-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for necrotizing soft tissue infections, spreading bacterial cellulitis, or systemic candidemia.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Excruciating out-of-proportion pain with skin crepitus indicating necrotizing fasciitis requiring immediate emergency surgical debridement",
    "Rapidly spreading hot red swelling with high fever indicating bacterial cellulitis requiring systemic antibiotics",
    "High fever and shaking chills in a diabetic with raw skin folds indicating invasive systemic candidemia"
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
  tags: ["Intertrigo", "Skin Fold Rash", "Candidal Intertrigo", "Chafing", "Satellite Pustules", "Maceration", "Erythrasma", "Disease", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/intertrigo",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive friction-maceration, Candida albicans satellite pustulosis, and Wood's lamp erythrasma clinical boundaries, necrotizing fasciitis red flags, and verified citations"],
  clinicalPearl: "Bright red skin fold plaques with tiny peripheral satellite pustules are pathognomonic for secondary Candida albicans intertrigo.",
  quickFacts: {
    "Key Pathogen": "Candida albicans (opportunistic yeast overgrowth in macerated folds)",
    "Primary System": "Integumentary System & Intertriginous Folds (Dermatology / Primary Care)",
    "Diagnostic Standard": "Clinical Exam (Kissing Plaque with Satellite Pustules) & 10% KOH / Wood's Lamp",
    "Clinical Character": "Moisture-associated friction dermatitis of opposing skin folds with secondary fungal colonization"
  },
  aiReadiness: {
    retrievalSummary: "Intertrigo is a skin fold rash caused by moisture and friction, often complicated by yeast (Candida) with red satellite bumps, managed with supportive care, drying, and topical antifungals.",
    clinicalSummary: "Intertrigo pathophysiology involves friction, maceration of the stratum corneum, and secondary Candida albicans or Corynebacterium overgrowth producing bright red plaques with satellite pustules. Homeopathic remedies serve as supportive cutaneous care and do not replace skin drying, topical azole antifungals, or emergency care for necrotizing fasciitis or cellulitis.",
    patientSummary: "Intertrigo is a red, raw, itchy rash that happens in warm skin folds (under the breasts, in the groin, or armpits) when skin rubs against skin and catches yeast, treated by keeping the skin cool and dry with antifungal creams.",
    studentSummary: "Friction-induced dermatosis in skin folds complicated by Candida albicans (beefy red plaque with satellite pustulosis) or Corynebacterium minutissimum (Erythrasma, coral-red on Wood's lamp). Key management: keep folds dry (cloth separators, cool blow-drying) + topical azoles or nystatin (avoid potent steroids). Red flags: necrotizing fasciitis and spreading cellulitis.",
    keywords: ["intertrigo", "skin fold rash", "candidal intertrigo", "chafing under breasts groin", "satellite pustules", "groin yeast infection", "erythrasma woods lamp"],
    semanticKeywords: ["moisture associated skin damage", "intertriginous candidiasis", "stratum corneum fold maceration"],
    icd: "L30.4",
    mesh: "D007373",
    bodySystem: "Dermatology & Skin Health",
    urgency: "routine"
  }
};
