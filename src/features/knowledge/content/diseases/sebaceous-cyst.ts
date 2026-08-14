import { KnowledgeEntity } from "../../types";

export const SebaceousCystDisease: KnowledgeEntity = {
  id: "D0066",
  slug: "sebaceous-cyst",
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
    en: "Epidermoid & Sebaceous Cyst (Infundibular Follicular Cyst & Keratinaceous Skin Nodule)",
    hi: "एपिडर्मॉइड व सिबेसियस सिस्ट / त्वचा की गांठ या रसौली (Epidermoid & Sebaceous Cyst)",
    gu: "એપિડર્મોઇડ / સિબેશિયસ સિસ્ટ (ચામડી નીચે થતી ચીકણી ગાંઠ) (Epidermoid Cyst)",
    mr: "एपिडर्मॉइड व सिबेशियस सिस्ट / त्वचेखालील गाठ (Epidermoid & Sebaceous Cyst)",
    es: "Quiste Epidermoide y Quiste Sebáceo (Quiste Infundibular Folicular y Nódulo de Queratina)",
    ar: "الكيسة البشرانية والكيسة الزهمية (Epidermoid & Sebaceous Cyst)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Epidermoid and Sebaceous Cysts (Infundibular Keratin Cysts), covering follicular infundibular occlusion, stratified squamous epithelial cystic lining, lamellated keratin retention, central comedo punctum, constitutional homeopathic supportive management, and emergency red flags for acute ruptured infected abscess, Fournier gangrene, and malignant transformation to cutaneous squamous cell carcinoma.",
    hi: "एपिडर्मॉइड व सिबेसियस सिस्ट (त्वचा के नीचे केराटिन से भरी गांठ) का फॉलिक्युलर इन्फंडिबुलम पैथोलॉजी, सेंट्रल पंक्टम (Punctum), चीज़ी दुर्गंधयुक्त केराटिन जमाव, बिनाइन प्रकृति, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सिस्ट फटने से होने वाले एक्यूट एब्सेस (Abscess) व स्क्वैमस सेल कार्सिनोमा की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "એપિડર્મોઇડ સિસ્ટ (ચામડીની અંદર કેરાટિન વાળી ગાંઠ) ની પેથોલોજી, મોં પર કાળો ટપકો (Punctum), ચીઝ જેવું સફેદ ચીકણું પ્રવાહી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ગાંઠ પાકી જવી (એબ્સિસ / પરુ થવું) તથા ઓપરેશનની જરૂરિયાતની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "एपिडर्मॉइड व सिबेशियस सिस्ट (Epidermoid Cyst), त्वचेखालील गाठ, दुर्गंधीयुक्त पांढरा स्त्राव, पारंपारिक होमिओपॅथिक पद्धत आणि गाठ फुटून इन्फेक्शन होणे (Abscess) व शस्त्रक्रियेच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del quiste epidermoide y sebáceo que cubre la oclusión infundibular folicular, revestimiento escamoso estratificado, queratina lamelar, manejo homeopático complementario y banderas rojas de absceso infectado roto y carcinoma epidermoide.",
    ar: "دليل سريري وتعليمي موثوق للكيسات البشرانية والزهمية يغطي انسداد قمع الجريب والبطانة الرصفية المطبقة واحتباس الكيراتين والرعاية التكميلية وعلامات الخطر للخراج المتمزق الملتهب والغنغرينا والتنكس الخبيث."
  },
  content: {
    overview:
      "Epidermoid Cysts (also widely referred to clinically as Infundibular Cysts, Epidermal Inclusion Cysts, or colloquially as 'Sebaceous Cysts') are the most common benign epithelial cystic lesions of the skin and subcutaneous tissue. Arising from the occlusion of the follicular infundibulum (the uppermost portion of the hair follicle) or from traumatic implantation of epidermis into the dermis, the cyst is enclosed by a true capsule of stratified squamous epithelium with an intact granular cell layer. The epithelial lining continuously sheds concentric lamellae of keratin, cholesterol crystals, and degenerated cornified cells into the closed cystic lumen, producing a slowly enlarging, mobile, dome-shaped, subcutaneous nodule containing a characteristic cheesy, rancid, foul-smelling white-to-yellow paste.",
    definition:
      "A benign encapsulated subcutaneous cystic nodule lined by true stratified squamous epithelium and filled with lamellated keratinaceous debris, characteristically exhibiting a central comedo-like punctum.",
    causes: [
      "Follicular Infundibular Occlusion: obstruction of the hair follicle infundibular orifice by hyperkeratosis, sebum, and cellular debris (most common primary mechanism on the face, neck, upper chest, and back)",
      "Traumatic Epithelial Implantation (True Epidermal Inclusion Cyst): penetrating trauma, surgical incisions, or crush injuries that forcibly push surface epidermal fragments deep into the subcutaneous dermis (frequently on palms, soles, and buttocks)",
      "Genetic Syndromes: Gardner Syndrome (Familial Adenomatous Polyposis [FAP] with multiple epidermoid cysts, osteomas, and premalignant colonic polyps driven by APC gene mutations), Nevoid Basal Cell Carcinoma Syndrome (Gorlin Syndrome), and Favré-Racouchot Syndrome",
      "True Sebaceous Cysts (Steatocystoma Simplex / Multiplex): rare true sebaceous cysts lined by true sebaceous glands producing pure oily sebum (associated with KRT17 gene mutations)",
      "Pharmacological agents: 5-fluorouracil, BRAF inhibitors (vemurafenib), and cyclosporine triggering cutaneous cystic hyperkeratinization"
    ],
    riskFactors: [
      "Post-pubertal age (increased androgen-stimulated sebaceous gland activity and sebum production)",
      "Personal history of moderate-to-severe acne vulgaris (inflammatory comedones predisposing to follicular rupture)",
      "History of blunt or penetrating cutaneous trauma, lacerations, or previous skin surgery",
      "Genetic disorders: Gardner Syndrome (multiple cutaneous epidermoid cysts in a young patient warrants colonoscopy)",
      "Excessive ultraviolet sun exposure inducing solar elastosis and follicular infundibular dilation"
    ],
    symptoms: [
      "Solitary or multiple discrete, firm, smooth, dome-shaped, non-tender subcutaneous nodules (ranging in size from 0.5 cm up to 5 cm in diameter)",
      "High mobility: the cyst moves freely over the deep underlying subcutaneous fascia but remains tethered to the overlying epidermis",
      "Pathognomonic Central Punctum: a visible, tiny, black or dark-grey comedo-like pore on the dome apex of the cyst representing the occluded follicular opening",
      "Painless in uninflamed state: painless slow progressive growth over months to years without localized heat or erythema",
      "Cheesy malodorous discharge: if squeezed or punctured, it expels a thick, pasty, white-to-yellowish keratin substance with a distinctive foul, rancid odor",
      "Acute rupture presentation: sudden severe throbbing pain, fiery redness, rapid swelling, tenderness, and localized fluctuance when keratin leaks into the dermis triggering an intense sterile foreign-body granulomatous inflammatory reaction"
    ],
    diagnosis:
      "Diagnosed primarily clinically based on visual inspection and palpation: (1) Clinical Physical Examination (palpation of a discrete, mobile subcutaneous mass tethered to the skin with a visible central punctum is diagnostic). (2) High-Resolution Dermatological Ultrasound (demonstrates a well-circumscribed, hypoechoic or anechoic, round or oval avascular subcutaneous mass with posterior acoustic enhancement and absence of internal color Doppler vascular flow). (3) Histopathological Examination following surgical excision (confirms a cystic wall lined by stratified squamous epithelium containing a prominent stratum granulosum and filled with laminated orthokeratotic keratin sheets without true sebaceous gland elements). (4) Gardner Syndrome screening (colonoscopy for adenomatous polyps in patients presenting with multiple atypical epidermoid cysts, desmoid tumors, or osteomas).",
    differentialDiagnosis:
      "Differentiate Epidermoid Cysts from Lipomas (soft, doughy, lobulated, deeper subcutaneous adipose masses without a central punctum or epidermal tethering), Pilar / Trichilemmal Cysts (90% occur on the scalp, lack a central punctum, lined by stratified epithelium without a granular layer [trichilemmal keratinization]), Ganglion Cysts (periarticular mucin-filled cysts over tendons and wrist joints), Dermoid Cysts (congenital inclusion cysts along embryonic fusion lines containing hair follicles and sweat glands), Hidradenitis Suppurativa, and Cutaneous Squamous Cell Carcinoma.",
    conventionalManagement:
      "A structured dermatological and surgical management protocol: (1) Conservative watchful waiting for small (<1 cm), asymptomatic, cosmetically unbothersome uninflamed cysts. (2) Definitive Complete Surgical Excision: surgical removal of the intact cyst and its ENTIRE outer epithelial capsule under local anesthesia (via standard elliptical excision or minimal-incision punch biopsy technique; if even a microscopic fragment of the cyst capsule lining is left behind, the cyst will inevitably recur). (3) Management of Acute Ruptured / Inflamed Cysts: intralesional triamcinolone acetonide (5–10 mg/mL) steroid injection to rapidly calm sterile foreign-body inflammation, OR Incision and Drainage (I&D) with packing if a true fluctuant bacterial abscess is present (definitive capsule excision must be delayed for 4–8 weeks until acute inflammation completely subsides). (4) Systemic Oral Antibiotics (cephalexin, doxycycline) only if secondary bacterial cellulitis is clinically present.",
    homeopathicApproach:
      "Homeopathic constitutional and resorption remedies (such as Silicea, Hepar Sulphuris Calcareum, Calcarea Carbonica, Graphites, Conium Maculatum, Thuja Occidentalis, Baryta Carbonica, Calcarea Fluorica, Sulphur, Kali Muriaticum) serve as supportive care to ease localized discomfort, soothe minor surface irritation, and support skin tissue vitality alongside warm compresses, hygienic skin care, and dermatological surgical excision.",
    lifestyleAdvice:
      "NEVER forcefully squeeze, pinch, scratch, or pop an epidermoid cyst at home (squeezing forces the keratin capsule to burst deep inside the dermis, causing a painful, severe inflammatory abscess and permanent scarring), apply warm, moist compresses for 10 to 15 minutes twice daily to encourage natural drainage, keep the overlying skin clean with gentle pH-balanced antibacterial cleanser, avoid applying harsh corrosive acids or unverified topical pastes, and schedule an evaluation with a dermatologist or surgeon for clean, painless surgical capsule removal before the cyst becomes infected.",
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
        question: "Why does an epidermoid cyst smell so bad if it pops?",
        answer: "The contents of the cyst consist of trapped dead skin cells (keratin) and natural body oils that have been enclosed and broken down by skin bacteria over months or years. The decomposition of these proteins and lipids creates fatty acids that produce a distinctive pungent, cheese-like odor."
      },
      {
        question: "Why did my cyst grow back after a doctor squeezed it out?",
        answer: "An epidermoid cyst is like a tiny balloon inside your skin. If you only pop or squeeze the white paste out, the outer 'balloon' wall (the epithelial capsule) remains alive inside your skin and immediately starts shedding new keratin, causing the cyst to refill completely. It only goes away permanently if a surgeon removes the entire capsule wall."
      }
    ],
    redFlags: [
      "Acute Ruptured Abscess with Spreading Cellulitis: rapid enlargement, excruciating throbbing pain, spreading fiery erythema extending beyond the cyst margin, localized heat, fluctuance, and high fever (requires urgent surgical incision, drainage, pus culture, and systemic antibiotics)",
      "Fournier Gangrene / Necrotizing Soft Tissue Infection: rapid discoloration, intense out-of-proportion pain, cutaneous crepitus (gas under skin), and systemic septic shock from a neglected infected perineal or scrotal epidermoid cyst (life-threatening surgical emergency)",
      "Malignant Transformation to Cutaneous Squamous Cell Carcinoma (SCC): rare (0.01–0.05%) development of rapid asymmetric growth, hard induration, deep fixation to underlying muscle/bone, surface ulceration, spontaneous bleeding, and regional lymphadenopathy (requires urgent deep biopsy and wide oncologic surgical excision)",
      "Multiple Subcutaneous Cysts with Family History of Colon Cancer (Gardner Syndrome / FAP): mandates immediate gastroenterology referral and total colonoscopy"
    ]
  },
  claimCitations: [
    { claimId: "D0066-TRADITIONAL-PROFILE", statement: "Homeopathic epidermoid cyst profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0066-TRADITIONAL-PROFILE" },
    { claimId: "D0066-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for complete surgical cyst capsule excision, abscess debridement, or oncologic cancer resection.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0066-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0066-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for ruptured infected abscesses, necrotizing soft tissue infections, or suspected malignancy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Rapidly spreading redness and extreme throbbing pain indicating ruptured infected abscess requiring urgent surgical drainage and antibiotics",
    "Rapid asymmetric growth with ulceration and deep tissue fixation indicating possible squamous cell carcinoma transformation",
    "Severe perineal pain and skin crepitus from an infected genital cyst indicating necrotizing soft tissue infection"
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
  tags: ["Sebaceous Cyst", "Epidermoid Cyst", "Infundibular Cyst", "Keratin Nodule", "Disease", "Surgical Excision", "Central Punctum", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/sebaceous-cyst",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive follicular infundibular keratin retention clinical boundaries, ruptured abscess/malignant transformation red flags, and verified citations"],
  clinicalPearl: "To prevent recurrence of an epidermoid cyst, the entire outer epithelial capsule wall must be completely excised surgically.",
  quickFacts: {
    "Key Clinical Sign": "Dome-Shaped Mobile Subcutaneous Nodule with Visible Central Punctum",
    "Primary System": "Integumentary System & Cutaneous Follicular Apparatus (Dermatology / General Surgery)",
    "Diagnostic Standard": "Clinical Palpation & Dermatological High-Frequency Ultrasound",
    "Clinical Character": "Benign encapsulated subcutaneous keratin-filled cystic nodule derived from hair follicle infundibulum"
  },
  aiReadiness: {
    retrievalSummary: "Epidermoid and Sebaceous Cysts are benign keratin-filled skin lumps with a central punctum, managed with supportive care, warm compresses, and complete surgical capsule removal.",
    clinicalSummary: "Epidermoid cyst pathophysiology involves follicular infundibular occlusion lined by stratified squamous epithelium shedding lamellated keratin. Homeopathic remedies serve as supportive cutaneous care and do not replace complete surgical capsule excision, or emergency incision/drainage for acute ruptured abscesses or necrotizing infection.",
    patientSummary: "An epidermoid cyst is a harmless, slow-growing lump under the skin filled with soft white keratin that has a tiny black dot on top, permanently cured only by a doctor surgically removing the complete sac.",
    studentSummary: "Benign cyst derived from follicular infundibulum. Hallmark: mobile subcutaneous nodule with central punctum filled with foul-smelling cheesy keratin. Complete surgical capsule excision is required to prevent recurrence. Do not squeeze (rupture causes severe sterile foreign body granuloma). Red flags: infected abscess, necrotizing fasciitis, and squamous cell transformation.",
    keywords: ["sebaceous cyst", "epidermoid cyst", "skin lump nodule", "central punctum cyst", "cheesy foul smelling cyst", "surgical cyst removal", "keratin inclusion cyst"],
    semanticKeywords: ["follicular infundibular cyst", "stratified squamous cystic lining", "epidermal inclusion nodule"],
    icd: "L72.0",
    mesh: "D004814",
    bodySystem: "Dermatology & Skin Health",
    urgency: "routine"
  }
};
