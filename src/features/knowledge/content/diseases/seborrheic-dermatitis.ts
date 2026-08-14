import { KnowledgeEntity } from "../../types";

export const SeborrheicDermatitisDisease: KnowledgeEntity = {
  id: "D0038",
  slug: "seborrheic-dermatitis",
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
    en: "Seborrheic Dermatitis (Cradle Cap, Facial Erythema & Greasy Scalp Scaling)",
    hi: "सेबोरहाइक डर्मेटाइटिस / चिकनी पपड़ीदार त्वचा रोग (Seborrheic Dermatitis)",
    gu: "સેબોરિક ડર્મેટાઇટિસ / તેલિય ચીકણી પોપડીઓ અને લાલ ચકામા (Seborrheic Dermatitis)",
    mr: "सेबोरिक डर्मेटायटिस / तेलकट खपल्या व त्वचेची जळजळ (Seborrheic Dermatitis)",
    es: "Dermatitis Seborreica (Costra Láctea, Eritema Facial y Descamación Grasa)",
    ar: "التهاب الجلد الدهني وغطاء المهد (Seborrheic Dermatitis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Seborrheic Dermatitis, covering Malassezia yeast-mediated cutaneous inflammation, greasy yellowish scaling and erythematous plaques across sebum-rich zones (scalp, nasolabial folds, glabella, pre-sternal chest), infant cradle cap, constitutional homeopathic supportive management, and emergency red flags for exfoliative erythroderma, secondary bacterial superinfections, and severe eczema herpeticum.",
    hi: "सेबोरहाइक डर्मेटाइटिस (तैलीय पपड़ीदार त्वचा रोग / क्रैडल कैप) का मैलासेजिया यीस्ट पैथोलॉजी, सीबम-युक्त क्षेत्रों (माथा, भौहें, नाक की सिलवटें, छाती) में लालिमा व चिकनी पीली पपड़ी, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सेकेंडरी बैक्टीरियल इन्फेक्शन व एरिथ्रोडर्मा की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "સેબોરિક ડર્મેટાઇટિસ (ચીકણી પોપડીઓવાળો ચામડીનો સોજો) ની પેથોલોજી, ચહેરા અને માથા પર પીળી તેલિય પોપડીઓ, શિશુઓમાં ક્રેડલ કેપ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને આખા શરીરમાં ફેલાતા ગંભીર એરિથ્રોડર્માની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "सेबोरिक डर्मेटायटिस (Seborrheic Dermatitis), चेहऱ्यावर आणि डोक्यात तेलकट पिवळसर खपल्या व लालसरपणा, नवजात बालकांमधील क्रॅडल कॅप, पारंपरिक होमिओपॅथिक पद्धत आणि गंभीर इन्फेक्शनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la dermatitis seborreica que cubre la inflamación mediada por Malassezia, placas eritematosas con escamas grasas, manejo homeopático complementario y banderas rojas de eritrodermia y eccema herpético.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب الجلد الدهني يغطي الالتهاب الجلدي بفطور الملاسيزية واللويحات الحمامية ذات القشور الدهنية وغطاء المهد والرعاية التكميلية وعلامات الخطر للاحمرار الجلدي التقشري والأكزيما الهربسية."
  },
  content: {
    overview:
      "Seborrheic Dermatitis is a chronic, relapsing inflammatory dermatosis characterized by well-demarcated erythematous plaques topped with greasy, yellowish, oily scales occurring predominantly in regions of high sebaceous gland density—including the scalp, face (nasolabial folds, glabella, eyebrows, beard area), retroauricular folds, external auditory canal, and upper central chest (pre-sternal region). Occurring in two distinct age populations—infants (infantile seborrheic dermatitis, presenting as thick greasy yellowish scalp crusts termed 'cradle cap' within the first 3 months of life) and adults (peak incidence between 30 and 60 years)—it is driven by an abnormal cell-mediated cutaneous inflammatory reaction to lipophilic Malassezia yeasts feeding on sebum lipids. In severe or sudden explosive forms, it may serve as an early cutaneous marker for underlying HIV infection or Parkinson's disease.",
    definition:
      "A chronic inflammatory skin disorder affecting areas rich in sebaceous glands, characterized by salmon-colored erythematous patches covered with greasy, yellowish, adherent scales and mild-to-moderate pruritus.",
    causes: [
      "Malassezia yeast colonization: overgrowth of Malassezia globosa and Malassezia restricta whose lipases degrade sebum triglycerides into irritant unsaturated free fatty acids",
      "Cutaneous inflammatory and immune response: localized epidermal penetration of metabolites activates keratinocyte Toll-like receptors (TLR2), NF-kappaB signaling, and local production of pro-inflammatory cytokines (IL-1beta, IL-6, TNF-alpha, IL-8)",
      "Sebaceous lipid hyperproduction: androgenic stimulation of sebaceous gland activity provides a continuous lipid-rich metabolic microenvironment for yeast proliferation",
      "Epidermal barrier dysfunction: impaired stratum corneum ceramide synthesis and altered lipid composition increasing vulnerability to fungal by-products",
      "Neurological and neuroendocrine factors: altered sebum composition and autonomic dysregulation in neurodegenerative disorders (Parkinson's disease, post-stroke states, facial nerve palsy)"
    ],
    riskFactors: [
      "Infancy (0–3 months; maternal transplacental androgen stimulation) and Adulthood (30–60 years; male predominance)",
      "Immunosuppression: Human Immunodeficiency Virus (HIV/AIDS; prevalence exceeds 35–80% with sudden severe presentation), organ transplant recipients, and lymphoma",
      "Neurological and psychiatric disorders: Parkinson's disease, traumatic brain injury, stroke, depression, and chronic fatigue",
      "Emotional stress, severe fatigue, and cold, dry winter climate triggering acute flare-ups",
      "Alcohol abuse and chronic malnutrition"
    ],
    symptoms: [
      "Well-demarcated salmon-pink or erythematous plaques covered with greasy, yellowish, oily, adherent scales",
      "Characteristic anatomical distribution: scalp ('cradle cap' in infants; diffuse greasy dandruff in adults), face (nasolabial folds, eyebrows, glabella, eyelashes [seborrheic blepharitis]), retroauricular creases, and sternal chest",
      "Mild to moderate pruritus (itching) and burning sensation, particularly on the scalp and face during sweating",
      "Cracking, weeping, and painful fissures in the retroauricular folds (behind the ears) and intertriginous body folds",
      "Waxing and waning clinical course with acute seasonal winter flares and spontaneous summer remissions",
      "Absence of nail changes (no oil drop spots or subungual hyperkeratosis) in uncomplicated seborrheic dermatitis"
    ],
    diagnosis:
      "Diagnosed clinically based on characteristic morphology (greasy yellow scales on erythematous plaques) and anatomical distribution in sebum-rich areas. Dermoscopy displays yellowish greasy scales, dotted vessels, and atypical red loops. Microscopic 10% KOH preparation demonstrates yeast blastospores and pseudohyphae excluding dermatophyte infections. In patients presenting with unusually severe, explosive, sudden-onset, or treatment-refractory seborrheic dermatitis, diagnostic HIV antibody/antigen testing and neurological screening are clinically mandatory.",
    differentialDiagnosis:
      "Differentiate Seborrheic Dermatitis from Plaque Psoriasis / Sebopsoriasis (thick, silvery-white micaceous scales on sharply defined erythematous plaques with Auspitz sign and nail pitting), Atopic Dermatitis (intense pruritus on flexural surfaces with elevated IgE), Rosacea (erythema and telangiectasias across central face without greasy yellow scales; triggered by spicy foods/heat), Contact Dermatitis, Lupus Erythematosus (malar butterfly rash sparing nasolabial folds, positive ANA), and Tinea Faciei.",
    conventionalManagement:
      "A multimodal topical strategy aimed at clearing scales, suppressing Malassezia burden, and soothing inflammation: (1) Scalp therapy: topical antifungal shampoos (Ketoconazole 2%, Ciclopirox 1%, Zinc Pyrithione 1–2%, Selenium Sulfide 2.5%) lathered and left for 5 minutes 2 to 3 times weekly; alternating with salicylic acid or coal tar shampoos for thick adherent crusts. (2) Facial and body therapy: topical antifungal creams (Ketoconazole 2% cream, Ciclopirox cream applied BID for 2–4 weeks). (3) Non-steroidal topical anti-inflammatory agents: Topical Calcineurin Inhibitors (Pimecrolimus 1% cream, Tacrolimus 0.1% ointment; highly effective steroid-sparing agents for facial and retroauricular areas avoiding steroid-induced skin atrophy or rosacea). (4) Mild low-potency topical corticosteroids (hydrocortisone 1% cream) for acute short-term flares (maximum 5–7 days). (5) Infantile cradle cap management: gentle massage with pure mineral or coconut oil to soften crusts followed by gentle brushing with a soft infant comb and washing with mild baby shampoo.",
    homeopathicApproach:
      "Homeopathic constitutional and skin remedies (such as Graphites, Sulphur, Natrum Muriaticum, Mezereum, Kali Sulphuricum, Calcarea Carbonica, Sepia Officinalis, Arsenicum Album, Petroleum, Thuja Occidentalis) serve as supportive care to ease facial redness, soothe itchy retroauricular fissures, and support skin barrier resilience alongside gentle cleansers, antifungal creams, and dermatologist follow-up.",
    lifestyleAdvice:
      "Wash face daily with a gentle, fragrance-free foaming cleanser, avoid alcohol-based skin toners, harsh soaps, and heavy petrolatum-based moisturizers that trap sebum, use lukewarm water rather than hot showers to prevent facial flushing, shave facial hair or maintain a trimmed beard if facial scaling persists beneath facial hair, spend safe brief periods in natural sunlight (UV radiation inhibits Malassezia growth), and avoid touching or picking at facial scales.",
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
        question: "How is seborrheic dermatitis different from facial eczema or rosacea?",
        answer: "Seborrheic dermatitis specifically produces greasy, yellowish scales located directly in the oily folds between the nose and cheeks (nasolabial folds) and eyebrows. Rosacea causes facial redness and spider veins on the cheeks and nose without greasy scales, while eczema typically appears on dry flexural areas like the insides of the elbows."
      },
      {
        question: "How should cradle cap be treated in a newborn baby?",
        answer: "Cradle cap is completely harmless and self-limiting in infants. Soften the thick yellow crusts by applying a small amount of pure mineral oil or coconut oil to the baby's scalp for 15 minutes, gently brush with a soft baby brush, and wash with mild baby shampoo. Avoid picking or aggressively peeling off dry crusts."
      }
    ],
    redFlags: [
      "Exfoliative Erythroderma (Leiner's Disease in infants): generalized, generalized severe redness and scaling covering >90% of the body surface area, accompanied by failure to thrive, persistent diarrhea, severe hypothermia, or dehydration (dermatological emergency requiring immediate pediatric/dermatology hospital admission)",
      "Secondary Bacterial Cellulitis / Impetiginization: rapidly spreading warm erythema, swelling, intense localized pain, honey-colored weeping crusts, facial cellulitis, or high spiking fever",
      "Severe Eczema Herpeticum (Kaposi's Varicelliform Eruption): sudden eruption of painful, punched-out, umbilicated vesicular lesions with high fever (viral emergency requiring immediate systemic acyclovir)",
      "Severe, explosive, treatment-refractory seborrheic dermatitis in a young adult (mandates urgent screening for underlying HIV infection)"
    ]
  },
  claimCitations: [
    { claimId: "D0038-TRADITIONAL-PROFILE", statement: "Homeopathic seborrheic dermatitis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0038-TRADITIONAL-PROFILE" },
    { claimId: "D0038-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for erythroderma resuscitation, secondary cellulitis clearance, or acyclovir replacement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0038-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0038-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for exfoliative erythroderma, severe secondary cellulitis, or eczema herpeticum.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Widespread red scaling skin involving >90% of body with fever indicating exfoliative erythroderma requiring emergency admission",
    "Rapidly spreading facial erythema with honey-colored weeping crusts indicating bacterial superinfection",
    "Punched-out vesicular blisters with high fever indicating eczema herpeticum requiring immediate systemic antiviral therapy"
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
  tags: ["Seborrheic Dermatitis", "Cradle Cap", "Greasy Scales", "Facial Redness", "Disease", "Nasolabial Flaking", "Malassezia", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/seborrheic-dermatitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive sebaceous zone inflammatory clinical boundaries, erythroderma/eczema herpeticum red flags, and verified citations"],
  clinicalPearl: "Sudden explosive, severe, or treatment-refractory seborrheic dermatitis in a young adult is an established clinical indicator warranting HIV screening.",
  quickFacts: {
    "Bimodal Incidence": "Infants (0–3 months; cradle cap) and Adults (30–60 years; male predominance)",
    "Primary System": "Integumentary System & Sebaceous Follicles (Dermatology / Immunology)",
    "Diagnostic Standard": "Clinical Visual Examination (Greasy Yellow Scales on Erythema in Sebum Areas)",
    "Clinical Character": "Chronic relapsing dermatitis characterized by greasy yellowish scaling across sebum-dense zones"
  },
  aiReadiness: {
    retrievalSummary: "Seborrheic Dermatitis is a chronic skin condition causing red patches and greasy yellow scales on the scalp, face, and chest, managed with supportive care, antifungal creams, gentle cleansers, and dermatologist care.",
    clinicalSummary: "Seborrheic Dermatitis pathophysiology involves Malassezia-mediated sebum lipid degradation, barrier impairment, and localized cytokine inflammation. Homeopathic remedies serve as supportive dermatological care and do not replace topical antifungals (ketoconazole/ciclopirox), calcineurin inhibitors, or emergency hospitalization for generalized erythroderma or eczema herpeticum.",
    patientSummary: "Seborrheic dermatitis causes red patches and oily, yellowish crusts or flakes on oily areas of your skin like your scalp, eyebrows, sides of the nose, and chest, managed with gentle face washing and medicated creams.",
    studentSummary: "Chronic relapsing dermatitis in sebum-rich areas (scalp, nasolabial folds, chest). Driven by Malassezia yeasts. Bimodal onset: infants (cradle cap) and adults (30-60y). Topical calcineurin inhibitors are effective steroid-sparing agents. Red flags: erythroderma, secondary cellulitis, and eczema herpeticum.",
    keywords: ["seborrheic dermatitis", "cradle cap", "greasy yellow scales", "nasolabial redness", "seborrhea", "itchy oily scalp", "facial flaking"],
    semanticKeywords: ["sebaceous gland dermatosis", "malassezia mediated erythema", "seborrheic eczema"],
    icd: "L21.9",
    mesh: "D012627",
    bodySystem: "Dermatology & Integumentary",
    urgency: "routine"
  }
};
