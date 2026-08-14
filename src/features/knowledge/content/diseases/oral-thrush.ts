import { KnowledgeEntity } from "../../types";

export const OralThrushDisease: KnowledgeEntity = {
  id: "D0065",
  slug: "oral-thrush",
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
    en: "Oral Thrush (Pseudomembranous Oral Candidiasis & Moniliasis)",
    hi: "ओरल थ्रश / मुंह का फंगल इन्फेक्शन व सफेद छाले (Oral Thrush / Candidiasis)",
    gu: "ઓરલ થ્રશ / મોંમાં ફૂગનો ચેપ અને સફેદ છારી વળવી (Oral Thrush)",
    mr: "तोंडातील बुरशीजन्य संसर्ग / ओरल थ्रश (Oral Thrush / Candidiasis)",
    es: "Candidiasis Oral (Muguet Oral, Candidiasis Pseudomembranosa y Moniliasis)",
    ar: "داء المبيضات الفموي والسلاق (Oral Thrush)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Oral Thrush (Pseudomembranous Oral Candidiasis), covering opportunistic Candida albicans fungal dimorphism (yeast-to-hyphal transition), curd-like white pseudomembranous plaques wiping off to reveal underlying erythematous bleeding mucosa, host mucosal immunosuppression, constitutional homeopathic supportive management, and emergency red flags for invasive Esophageal Candidiasis (HIV/AIDS-defining illness), systemic candidemia, and necrotizing stomatitis.",
    hi: "ओरल थ्रश (कैंडिडिआसिस / मुंह में सफेद फफूंद जमना) का कैंडिडा एल्बिकैन्स पैथोलॉजी, जीभ व गालों पर सफेद दही जैसी परत जो पोंछने पर लाल छिले हुए म्यूकोसा को दर्शाती है, कॉर्टिकोस्टेरॉइड इनहेलर व एंटीबायोटिक का प्रभाव, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और इसोफेजियल कैंडिडिआसिस (निगलने में तेज दर्द) व सेप्सिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ઓરલ થ્રશ (મોંમાં કેન્ડિડા ફૂગનો ચેપ) ની પેથોલોજી, જીભ અને મોંની અંદર દહીં જેવા સફેદ ચકામાં, લૂછવાથી નીચેથી લાલ લોહી નીકળતી ચામડી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને અન્નનળીમાં ફેલાતા કેન્ડિડાયાસિસ (ખોરાક ગળવામાં અસહ્ય દુખાવો) તથા એઇડ્સ-ઇમ્યુનોડેફિશિયન્સીની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "ओरल थ्रश (तोंडातील फंगल इन्फेक्शन / Candidiasis), जिभेवर पांढरा थर, चव जाणे व तोंडात आग होणे, पारंपरिक होमिओपॅथिक पद्धत आणि अन्ननलिकेतील इन्फेक्शन (Esophageal Candidiasis) व सेप्सिसच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del muguet oral que cubre la transición dimórfica de Candida albicans, placas pseudomembranosas blanquecinas desprendibles, manejo homeopático complementario y banderas rojas de candidiasis esofágica y candidemia sistémica.",
    ar: "دليل سريري وتعليمي موثوق لداء المبيضات الفموي يغطي التحول ثنائي الشكل للمبيضات البيض واللويحات الغشائية الكاذبة الجبنية والرعاية التكميلية وعلامات الخطر لداء المبيضات المريئي وإنتان الدم بالمبيضات."
  },
  content: {
    overview:
      "Oral Thrush (Pseudomembranous Oral Candidiasis / Moniliasis) is the most common fungal opportunistic infection of the oral cavity, driven by the commensal polymorphic yeast Candida albicans (and increasingly non-albicans species such as Candida glabrata, C. tropicalis, and C. krusei). Under normal physiological conditions, Candida exists harmlessly as a benign unicellular yeast within the oral microbiome, held in check by salivary antimicrobial peptides (histatins, lactoferrin, lysozyme), resident bacterial competition, and intact cell-mediated immunity (CD4+ T-helper cells). When local or systemic host defenses are compromised—such as through broad-spectrum antibiotic use, inhaled corticosteroids, xerostomia, dentures, diabetes, chemotherapy, or HIV/AIDS—Candida transitions from harmless yeast to invasive pseudo-hyphae, penetrating oral keratinocytes and producing pathognomonic, creamy white, curd-like pseudomembranous plaques on the tongue, buccal mucosa, palate, and pharynx.",
    definition:
      "An opportunistic fungal infection of the oral mucous membranes caused by Candida species, characterized by white, curd-like, detachable pseudomembranes leaving an erythematous, bleeding base when scraped.",
    causes: [
      "Candida Albicans Dimorphism: phenotypic switching from unicellular budding blastospores to filamentous invasive hyphae and pseudohyphae capable of secreting secreted aspartyl proteinases (SAPs) and candidalysin that invade mucosal epithelial cells",
      "Broad-Spectrum Antibiotic Therapy: disruption of the normal competitive oral bacterial microflora, eliminating bacterial suppression and allowing unchecked fungal overgrowth",
      "Inhaled and Systemic Corticosteroids: local immunosuppression of oral mucosal cell-mediated immunity and salivary defense proteins (especially when metered-dose inhalers are used without a spacer or post-dose rinsing)",
      "Cell-Mediated Immunodeficiency: profound reduction in CD4+ T-cell counts in HIV/AIDS (<200–500 cells/microL; oral thrush serves as a cardinal clinical hallmark of disease progression), hematological malignancies (leukemia, lymphoma), and chemotherapy-induced neutropenia",
      "Poorly Controlled Diabetes Mellitus: salivary hyperglycemia providing an abundant carbohydrate substrate for fungal growth and impairing neutrophil phagocytosis",
      "Local oral factors: ill-fitting acrylic dentures (Denture Stomatitis / chronic atrophic candidiasis; fungal biofilms adhere tenaciously to polymethylmethacrylate resin), xerostomia (Sjögren's syndrome, head/neck radiation), and heavy cigarette smoking"
    ],
    riskFactors: [
      "Neonates and infants (<6 months; immature salivary immune defenses and maternal vaginal colonization during delivery)",
      "Elderly individuals wearing removable full or partial acrylic dentures (especially wearing dentures overnight)",
      "Daily use of inhaled corticosteroid (ICS) medications for asthma or COPD",
      "HIV/AIDS infection or solid organ / bone marrow transplant immunosuppressive therapy",
      "Active systemic broad-spectrum antibiotic or antineoplastic chemotherapy courses"
    ],
    symptoms: [
      "Creamy white, elevated, curd-like or cottage cheese-like pseudomembranous patches scattered across the dorsal tongue, buccal mucosa, hard/soft palate, gingiva, and tonsillar pillars",
      "Pathognomonic Detachability: the white plaques can be easily scraped or wiped off with a wooden tongue blade or gauze pad, revealing an underlying raw, fiery red, erythematous, bleeding, and tender mucosal base (distinguishing it from non-detachable Leukoplakia)",
      "Oral dysesthesia: burning sensation in the mouth, tongue soreness, and altered taste perception (dysgeusia / metallic taste)",
      "Loss of taste sensation and difficulty eating or drinking acidic/spicy foods due to mucosal raw tenderness",
      "Associated angular cheilitis (perleche): painful erythema, scaling, and deep inflammatory macerated fissures at the labial commissures (corners of the mouth)",
      "Absence of severe retrosternal swallowing pain (odynophagia) in uncomplicated oral candidiasis"
    ],
    diagnosis:
      "Diagnosed primarily clinically based on the characteristic appearance of creamy white plaques that wipe off to reveal a bleeding base. Confirmatory laboratory testing includes: (1) Direct Microscopic Examination of a Scraped Smear with 10% Potassium Hydroxide (KOH) or Gram Stain (demonstrating diagnostic budding yeast blastospores and elongated pseudohyphae). (2) Fungal Culture on Sabouraud Dextrose Agar (SDA) or CHROMagar Candida (identifies specific species [C. albicans vs. resistant C. glabrata/krusei] and antifungal susceptibility in refractory cases). (3) Unexplained, severe, or recurrent oral thrush in an adult with no obvious risk factors mandates urgent diagnostic HIV antibody testing and fasting blood glucose / HbA1c testing.",
    differentialDiagnosis:
      "Differentiate Pseudomembranous Candidiasis from Oral Leukoplakia (premalignant hyperkeratotic white plaque that CANNOT be wiped or scraped off), Oral Hairy Leukoplakia (EBV-driven corrugated white ridges along lateral tongue borders in immunocompromised, cannot be scraped off), Oral Lichen Planus (bilateral lacy white Wickham striae on buccal mucosa), Geographic Tongue (erythema migrans with white borders), Secondary Syphilitic Mucous Patches, and Chemical Burns (aspirin burn).",
    conventionalManagement:
      "A targeted antifungal strategy based on patient immune status and infection severity (IDSA Candidiasis Guidelines): (1) Topical antifungal therapy for mild, uncomplicated cases (7–14 days): Clotrimazole troches / lozenges 10 mg dissolved slowly in the mouth 5 times daily, OR Nystatin oral suspension 100,000 units/mL (4–6 mL swished in mouth for several minutes and swallowed 4 times daily), OR Miconazole 50 mg mucoadhesive buccal tablets once daily. (2) Systemic oral antifungal therapy for moderate-to-severe disease, immunocompromised hosts, or failed topical therapy: Oral Fluconazole 200 mg loading dose on day 1, then 100–200 mg daily for 7 to 14 days (itraconazole, posaconazole, or voriconazole for fluconazole-refractory strains). (3) Denture stomatitis protocol: removing dentures overnight, soaking them in chlorhexidine gluconate or antifungal denture cleansers, and applying topical antifungal cream to the tissue-bearing denture surface. (4) Prevention: using a valved spacer device and rinsing mouth and gargling with water immediately following inhaled corticosteroid use.",
    homeopathicApproach:
      "Homeopathic constitutional and oral remedies (such as Borax Veneta, Mercurius Solubilis, Nitricum Acidum, Sulphur, Hydrastis Canadensis, Kali Bichromicum, Kreosotum, Arsenicum Album, Echinacea Angustifolia, Natrum Muriaticum) serve as supportive care to ease oral burning, soothe raw mucosal soreness, and support oral tissue vitality alongside topical antifungal washes, mouth rinsing after inhalers, and dental hygiene.",
    lifestyleAdvice:
      "Rinse your mouth thoroughly with warm water and spit it out immediately every time after using a steroid asthma inhaler (always use a spacer chamber if prescribed a metered-dose inhaler), remove dentures every night before sleeping, clean dentures daily with a denture brush and soak them overnight in a specialized disinfectant solution, replace your toothbrush immediately after starting antifungal treatment, limit refined sugar and sweet beverages which fuel fungal growth, and eat unsweetened probiotic yogurt to support healthy bacterial flora.",
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
        question: "How do I know if the white coating on my tongue is oral thrush or just food/milk residue?",
        answer: "Gently wipe the white patch with a clean gauze pad or cotton swab. If it is oral thrush, it will wipe off with slight resistance, leaving a raw, red, sore, and sometimes bleeding surface underneath. Normal tongue coatings or milk residue wipe away easily without causing redness or bleeding."
      },
      {
        question: "Why did I get oral thrush after using my asthma inhaler?",
        answer: "Steroid inhalers leave tiny deposits of corticosteroid medication on the lining of your tongue and throat. This locally weakens your mouth's natural immune defenses, allowing normal harmless yeast (Candida) to multiply into an infection. Rinsing your mouth with water and spitting it out after every puff prevents this completely."
      }
    ],
    redFlags: [
      "Esophageal Candidiasis: oral thrush accompanied by severe retrosternal chest pain on swallowing (Odynophagia) or difficulty swallowing (Dysphagia) (indicates deep invasive fungal extension down the esophagus; an AIDS-defining opportunistic illness requiring immediate upper GI endoscopy and systemic oral/IV Fluconazole therapy)",
      "Invasive Systemic Candidemia / Sepsis: high spiking fevers, chills, hypotension, tachycardia, and altered mental status in an immunocompromised, neutropenic, or ICU patient with central venous catheters (life-threatening bloodstream emergency requiring immediate blood cultures and IV Echinocandins [caspofungin/micafungin])",
      "Necrotizing Stomatitis: rapid, destructive gangrenous ulceration and necrosis of the gingiva, tongue, and underlying jawbone (seen in severe advanced immunosuppression; surgical emergency)",
      "Unexplained, recurrent oral thrush in an otherwise healthy adult (mandates urgent screening for undiagnosed HIV infection, diabetes mellitus, or leukemia)"
    ]
  },
  claimCitations: [
    { claimId: "D0065-TRADITIONAL-PROFILE", statement: "Homeopathic oral thrush profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0065-TRADITIONAL-PROFILE" },
    { claimId: "D0065-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for esophageal candidiasis fluconazole clearance, systemic candidemia resuscitation, or echinocandin replacement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0065-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0065-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for esophageal candidiasis, systemic candidemia, or necrotizing stomatitis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Severe chest pain when swallowing indicating invasive esophageal candidiasis requiring systemic fluconazole and endoscopy",
    "High fever, hypotension, and chills in an immunocompromised patient indicating systemic candidemia sepsis requiring IV echinocandins",
    "Rapidly destroying necrotic oral ulceration indicating necrotizing stomatitis requiring emergency surgical debridement"
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
  tags: ["Oral Thrush", "Candidiasis", "Candida Albicans", "White Tongue Patches", "Disease", "Nystatin", "Fluconazole", "Infectious Diseases"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/oral-thrush",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive Candida dimorphism clinical boundaries, esophageal candidiasis/candidemia red flags, and verified citations"],
  clinicalPearl: "Oral thrush plaques wipe off with gauze to reveal a raw, bleeding base, whereas oral leukoplakia cannot be wiped away.",
  quickFacts: {
    "Key Pathogen": "Candida albicans (dimorphic yeast-to-hyphae opportunistic transition)",
    "Primary System": "Gastrointestinal Tract & Oral Mucous Membranes (Infectious Diseases / Stomatology)",
    "Diagnostic Standard": "Clinical Exam (Detachable Curd-Like Plaques on Erythema) & 10% KOH Smear",
    "Clinical Character": "Opportunistic fungal pseudomembranous oral mucosal plaques leaving a bleeding base when scraped"
  },
  aiReadiness: {
    retrievalSummary: "Oral Thrush is a fungal mouth infection causing white, curd-like patches that wipe off to reveal raw redness, managed with supportive care, antifungal rinses, and rinsing after steroid inhalers.",
    clinicalSummary: "Oral Thrush pathophysiology involves opportunistic Candida albicans yeast-to-hyphal dimorphism invading mucosal keratinocytes when local or cell-mediated immunity is suppressed. Homeopathic remedies serve as supportive mucosal care and do not replace topical nystatin/clotrimazole, oral fluconazole, or emergency care for invasive esophageal candidiasis or candidemia.",
    patientSummary: "Oral thrush is a fungal infection in your mouth that creates creamy white, cottage-cheese-like patches on your tongue and inner cheeks that leave a sore red spot when wiped, treated with antifungal mouth medicines.",
    studentSummary: "Opportunistic infection by Candida albicans. Hallmark: white pseudomembranous plaques that scrape off, leaving raw bleeding mucosa (vs. Leukoplakia which cannot be scraped). First-line: topical nystatin suspension or clotrimazole troches; oral fluconazole for severe disease. Red flag: Esophageal candidiasis (odynophagia; AIDS-defining).",
    keywords: ["oral thrush", "oral candidiasis", "white tongue patches", "moniliasis", "cottage cheese tongue", "inhaler thrush", "nystatin mouthwash"],
    semanticKeywords: ["pseudomembranous oral candidiasis", "candida dimorphic hyphal invasion", "mucosal candidal stomatitis"],
    icd: "B37.0",
    mesh: "D002180",
    bodySystem: "Infectious Diseases & Oral Health",
    urgency: "routine"
  }
};
