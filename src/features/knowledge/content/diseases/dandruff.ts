import { KnowledgeEntity } from "../../types";

export const DandruffDisease: KnowledgeEntity = {
  id: "D0037",
  slug: "dandruff",
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
    en: "Dandruff",
    hi: "डैंड्रफ / रूसी व सिर की त्वचा का छिलना (Dandruff / Pityriasis Capitis)",
    gu: "ખોડો / માથાની ચામડી પર પોપડી વળવી અને ખંજવાળ (Dandruff)",
    mr: "कोंडा / डोक्यातील खाज व पांढरी खपली (Dandruff / Pityriasis Capitis)",
    es: "Caspa (Pitiriasis Capitis / Descamación del Cuero Cabelludo)",
    ar: "قشرة الرأس والنخالية الرأسية (Dandruff)"
  },
  summary: {
    en: "Dandruff is common scalp flaking, sometimes with itch or mild irritation. Learn what can trigger it, practical scalp-care steps, and when a clinician should look for another cause.",
    hi: "डैंड्रफ (रूसी / पिटिरियासिस कैपिटिस) का मैलासेजिया फंगल ओवरग्रोथ पैथोलॉजी, सीबम लिपिड मेटाबॉलिज्म, खोपड़ी पर सफेद-धूसर पपड़ी व खुजली, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सेकेंडरी बैक्टीरियल सेल्युलाइटिस व एरिथ्रोडर्मा की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ખોડો (ડેન્ડ્રફ) ની ફંગલ પેથોલોજી, માથામાં ખંજવાળ અને સફેદ પોપડીઓ ખરવી, ત્વચાની અતિસંવેદનશીલતા, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સ્કેલ્પમાં ગંભીર ઇન્ફેક્શન (સેલ્યુલાઇટિસ) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "कोंडा (Dandruff / Pityriasis Capitis), डोक्यात खाज येणे व पांढऱ्या खपल्या पडणे, त्वचेची संवेदनशीलता, पारंपरिक होमिओपॅथिक पद्धत आणि गंभीर बॅक्टेरियल इन्फेक्शनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la caspa que cubre la proliferación de Malassezia, hiperproliferación epidérmica, manejo homeopático complementario y banderas rojas de celulitis bacteriana y eritrodermia.",
    ar: "دليل سريري وتعليمي موثوق لقشرة الرأس يغطي تكاثر فطور الملاسيزية والتكاثر المفرط للبشرة والرعاية التكميلية وعلامات الخطر لالتهاب الهلل الجلدي الجرثومي والاحمرار الجلدي التقشري."
  },
  content: {
    overview:
      "Dandruff is a common scalp condition that causes white or grey flakes in the hair, sometimes with itch or mild redness. It is not a sign of poor hygiene. For many people, regular use of an anti-dandruff shampoo helps; persistent or painful scalp changes need a clinician to check for another cause.",
    definition:
      "It is increased shedding of skin cells from the scalp. Dandruff is often considered a mild end of the seborrhoeic dermatitis spectrum.",
    causes: [
      "Malassezia fungal proliferation: lipophilic yeasts (Malassezia globosa and M. restricta) utilize extracellular lipases to metabolize sebaceous lipids, producing irritating unsaturated fatty acids (oleic acid)",
      "Stratum corneum barrier disruption: penetration of free fatty acids induces hyperkeratosis, parakeratosis (retention of nuclei in stratum corneum cells), and premature cellular shedding",
      "Accelerated epidermal turnover: keratinocyte maturation cycle compresses from the normal 28 days down to 10–14 days, preventing normal desmosomal cleavage and causing corneocytes to aggregate into visible macroscopic flakes",
      "Sebaceous lipid hypersecretion: androgen-driven post-pubertal activation of scalp sebaceous glands providing an abundant metabolic substrate for fungal colonization",
      "Individual scalp immune reactivity: subclinical localized activation of inflammatory pathways (IL-1alpha, IL-8) in susceptible hosts"
    ],
    riskFactors: [
      "Post-pubertal age through mid-adulthood (peak prevalence between ages 15 and 50; rare in pre-pubertal children)",
      "Male gender (larger sebaceous glands and higher circulating androgen levels)",
      "Oily scalp skin type (hyperseborrhea) and infrequent hair washing allowing sebum and corneocyte buildup",
      "Cold, dry winter weather (low outdoor relative humidity and indoor heating dry the stratum corneum)",
      "Psychological stress, fatigue, and neurological conditions (Parkinson's disease, autonomic dysfunction)"
    ],
    symptoms: [
      "Visible white, silvery, or grayish fine flakes scattered throughout the scalp hair and shedding onto dark clothing / shoulders",
      "Mild to moderate scalp pruritus (itching) and irritation, often exacerbated by perspiration or emotional tension",
      "Sensation of scalp dryness, tightness, or mild burning without severe inflammatory induration",
      "Absence of thick, adherent, greasy yellow scales, indurated plaques, or facial involvement in uncomplicated pityriasis capitis",
      "Absence of permanent hair loss or cicatricial alopecia in uncomplicated dandruff"
    ],
    diagnosis:
      "Diagnosed clinically by direct visual inspection of the scalp and hair, noting diffuse fine non-adherent flaking without marked erythema or infiltration. Dermoscopy (trichoscopy) reveals fine white/translucent scales without vascular loops or yellow crusting. Microscopic Potassium Hydroxide (KOH) preparation shows yeast clusters and pseudohyphae characteristic of Malassezia. Scalp skin biopsy is rarely required and reserved for cases refractory to standard antifungals to exclude Psoriasis (silvery micaceous scales with Auspitz sign), Tinea Capitis (broken hairs, fungal spores on Wood's lamp), or Lichen Planopilaris.",
    differentialDiagnosis:
      "Differentiate Dandruff from Seborrheic Dermatitis (prominent erythema, thick greasy yellowish scales extending to eyebrows, nasolabial folds, and chest), Scalp Psoriasis (well-demarcated thick erythematous plaques with silvery adherent scales and nail pitting), Tinea Capitis (fungal dermatophyte infection with patchy alopecia, black dots, and scaling in children), Contact Dermatitis (intense erythema following hair dye or styling products), and Atopic Dermatitis.",
    conventionalManagement:
      "An anti-dandruff shampoo is often the first step. A pharmacist can help you choose one and explain how to use it. If it has not helped after several weeks, the scalp is very red or sore, or you are losing hair in patches, arrange medical advice rather than adding many products at once.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for dandruff. It should not replace assessment for a painful, infected, very inflamed, or patchy hair-loss scalp condition.",
    lifestyleAdvice:
      "Wash hair regularly and follow the shampoo directions, including the recommended contact time before rinsing. Avoid scratching hard or picking the scalp. Keep new oils, styling products, or hair dyes to a minimum if they seem to aggravate the flakes or itch.",
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
        question: "Is dandruff caused by poor hygiene?",
        answer: "No. Dandruff is common and is not a sign that someone is unclean. Scalp oil, sensitivity, and a normal skin yeast can all play a part."
      },
      {
        question: "When should I get dandruff checked?",
        answer: "Arrange medical advice if the scalp is very red, painful, swollen, weeping, bleeding, has patchy hair loss, or does not improve with a suitable shampoo. These signs can point to psoriasis, eczema, a fungal infection, or another scalp condition."
      }
    ],
    redFlags: [
      "Secondary Bacterial Scalp Infection (Cellulitis / Impetiginization): intense scalp erythema, severe localized warmth, purulent weeping crusts, facial/orbital edema, high fever, or tender enlarged cervical lymph nodes (requires prompt conventional medical evaluation and oral antibiotic therapy)",
      "Exfoliative Erythroderma: widespread inflammatory peeling and redness involving >90% of the entire body surface area, accompanied by hypothermia, fluid loss, and electrolyte disturbances (dermatological emergency requiring immediate hospitalization)",
      "Patchy Alopecia with Scalp Breakdown: localized areas of hair breakage, pustules, severe scaling, or boggy fluctuant swelling (kerion) in children (suspected Tinea Capitis requiring systemic oral antifungals)",
      "Thick, painful, bleeding scalp plaques with joint pains (suspected Psoriatic Arthritis)"
    ]
  },
  claimCitations: [
    { claimId: "D0037-TRADITIONAL-PROFILE", statement: "Homeopathic dandruff profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0037-TRADITIONAL-PROFILE" },
    { claimId: "D0037-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for scalp cellulitis clearance, systemic erythroderma, or ketoconazole replacement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0037-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0037-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for secondary scalp cellulitis, impetigo, or exfoliative erythroderma.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Spreading scalp erythema with pus, severe warmth, and fever indicating bacterial cellulitis requiring oral antibiotics",
    "Patchy hair loss with broken hairs and crusting in children indicating tinea capitis requiring oral antifungals",
    "Widespread whole-body red peeling skin with fever indicating exfoliative erythroderma requiring emergency admission"
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
  tags: ["Dandruff", "Pityriasis Capitis", "Scalp Flakes", "Malassezia", "Disease", "Scalp Pruritus", "Ketoconazole", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/dandruff",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.2.0: Simplified the route from common flakes to safe shampoo use and signs that need a different diagnosis.", "1.1.0: Promoted to governed v1.1.0 with comprehensive Malassezia lipid metabolism clinical boundaries, scalp cellulitis/erythroderma red flags, and verified citations"],
  clinicalPearl: "Always instruct patients to leave antifungal shampoos on the scalp for a full 3 to 5 minutes before rinsing; immediate washing off renders active ingredients ineffective.",
  quickFacts: {
    "Prevalence": "Affects approximately 50% of the post-pubertal global population",
    "Primary System": "Integumentary System & Scalp Epidermis (Dermatology / Mycology)",
    "Diagnostic Standard": "Clinical Visual Examination & Dermoscopy (Exclusion of Psoriasis/Tinea)",
    "Clinical Character": "Non-inflammatory stratum corneum flaking driven by Malassezia yeast and sebum lipid metabolism"
  },
  aiReadiness: {
    retrievalSummary: "Dandruff is a common scalp condition causing white flaking and mild itching driven by Malassezia yeast and sebum, managed with supportive care, antifungal shampoos, and gentle scalp hygiene.",
    clinicalSummary: "Dandruff pathophysiology involves Malassezia globosa/restricta lipases metabolizing sebum triglycerides into irritating free fatty acids, accelerating epidermal turnover. Homeopathic remedies serve as supportive dermatological care and do not replace antifungal shampoos (ketoconazole/zinc pyrithione) or conventional antibiotics for secondary scalp cellulitis.",
    patientSummary: "Dandruff causes small white or gray flakes of dead skin to shed from your scalp into your hair and shoulders, triggered by natural scalp oils and a common harmless yeast, improved by using medicated shampoos.",
    studentSummary: "Pityriasis capitis represents the mild end of the seborrheic dermatitis spectrum. Malassezia globosa/restricta lipase activity produces oleic acid, causing parakeratosis. First-line treatments: ketoconazole 2%, zinc pyrithione, selenium sulfide. Red flags: scalp cellulitis and tinea capitis.",
    keywords: ["dandruff", "pityriasis capitis", "scalp flaking", "itchy scalp", "white flakes hair", "malassezia scalp", "ketoconazole shampoo"],
    semanticKeywords: ["stratum corneum hyperproliferation", "sebaceous fatty acid irritation", "scalp desquamation"],
    icd: "L21.0",
    mesh: "D012628",
    bodySystem: "Dermatology & Integumentary",
    urgency: "routine"
  }
};
