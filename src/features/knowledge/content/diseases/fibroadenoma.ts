import { KnowledgeEntity } from "../../types";

export const FibroadenomaDisease: KnowledgeEntity = {
  id: "D0059",
  slug: "fibroadenoma",
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
    en: "Breast Fibroadenoma (Benign Fibroepithelial Breast Neoplasm / 'Breast Mouse')",
    hi: "ब्रेस्ट फाइब्रोएडीनोमा / स्तन की सौम्य गांठ (Breast Fibroadenoma)",
    gu: "સ્તનની સાદી ગાંઠ / ફાઈબ્રોએડીનોમા (Breast Fibroadenoma)",
    mr: "स्तनाची गाठ / फायब्रोअ‍ॅडेनोमा (Breast Fibroadenoma)",
    es: "Fibroadenoma de Mama (Neoplasia Fibroepitelial Benigna)",
    ar: "الورم الغدي الليفي في الثدي (Fibroadenoma)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Breast Fibroadenoma, covering estrogen-sensitive terminal duct lobular unit (TDLU) stromal proliferation, mobile 'breast mouse' clinical features, Triple Assessment diagnostic protocol, constitutional homeopathic supportive management, and emergency red flags for invasive breast carcinoma, malignant phyllodes tumor, and inflammatory breast cancer.",
    hi: "ब्रेस्ट फाइब्रोएडीनोमा (स्तन की गैर-कैंसरयुक्त सौम्य गांठ) का एस्ट्रोजन संवेदनशीलता पैथोलॉजी, गतिशील गांठ (Breast Mouse), ट्रिपल असेसमेंट प्रोटोकॉल, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और स्तन कैंसर (Invasive Carcinoma) व फिलाइड्स ट्यूमर की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "સ્તનની સાદી ગાંઠ (ફાઇબ્રોએડીનોમા) ની હોર્મોનલ પેથોલોજી, સરળતાથી હલતી નરમ ગાંઠ, ત્રિપલ એસેસમેન્ટ ડાયગ્નોસિસ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સ્તનના કેન્સરની તપાસ તથા ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "स्तनातील साधी गाठ (Fibroadenoma), निसरडी व न दुखणारी गाठ (Breast Mouse), ट्रिपल असेसमेंट पद्धत, पारंपरिक होमिओपॅथिक पद्धत आणि स्तन कर्करोगाच्या (Breast Cancer) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del fibroadenoma de mama que cubre la proliferación estromal sensible a estrógenos, evaluación triple, manejo homeopático complementario y banderas rojas de carcinoma mamario y tumor filodes.",
    ar: "دليل سريري وتعليمي موثوق للورم الغدي الليفي في الثدي يغطي التكاثر السدوي الحساس للإستروجين وفأرة الثدي والتقييم الثلاثي والرعاية التكميلية وعلامات الخطر لسرطان الثدي الغازي والورم الورقي."
  },
  content: {
    overview:
      "A Breast Fibroadenoma is the most common benign fibroepithelial solid neoplasm of the female breast, accounting for more than 50% of all breast biopsies and presenting predominantly in young women between 15 and 35 years of age. Arising from the specialized hormone-responsive intralobular stroma and epithelial elements of the terminal duct lobular unit (TDLU), it presents clinically as a solitary, discrete, smooth, rubbery, non-tender, and remarkably mobile breast lump—traditionally termed a 'breast mouse' due to its characteristic slipping mobility under the examining fingers. Because any palpable breast mass can cause significant anxiety and requires definitive exclusion of malignancy, all breast lumps mandate systematic evaluation via the standardized Triple Assessment protocol.",
    definition:
      "A benign, well-circumscribed, biphasic fibroepithelial tumor of the breast composed of both proliferating stromal (connective tissue) and epithelial (glandular ductal) components derived from the terminal duct lobular unit.",
    causes: [
      "Hormonal estrogen and progesterone sensitivity: localized stromal hyperplasia and exaggerated physiological responsiveness of the intralobular breast tissue to circulating estrogens (frequently grows during pregnancy or estrogen replacement therapy and undergoes postmenopausal involution/calcification)",
      "Somatic MED12 gene mutations: exon 2 somatic mutations in the Mediator Complex Subunit 12 (MED12) gene identified in over 60% of simple and complex fibroadenomas",
      "Imbalance between stromal cellular proliferation and local growth factors (epidermal growth factor [EGF], transforming growth factor-beta [TGF-beta])",
      "Genetic and developmental aberrations in normal lobular development and involution (ANDI classification)"
    ],
    riskFactors: [
      "Young reproductive age (peak incidence between 15 and 30 years; most common breast tumor in adolescent and young women)",
      "High endogenous estrogen levels, early menarche (<12 years), or pregnancy",
      "Use of oral contraceptives or hormone replacement therapy before age 20",
      "High body mass index in premenopausal women",
      "Complex fibroadenoma histology (presence of cysts >3 mm, sclerosing adenosis, epithelial calcifications, or papillary apocrine metaplasia confers a mild 1.5–2x relative risk for future breast carcinoma)"
    ],
    symptoms: [
      "Palpable discrete breast lump: typically solitary (10–20% are bilateral or multiple), round or ovoid in shape, measuring 1 to 3 cm in diameter",
      "Classic physical texture: smooth, firm, rubbery consistency with sharp, well-defined, distinct margins",
      "Extreme mobility ('Breast Mouse'): freely slips and glides effortlessly under the examining fingertips without tethering or fixation to the underlying pectoralis muscle or overlying skin",
      "Usually non-tender and completely painless, though mild premenstrual tenderness or slight enlargement may occur under luteal hormonal influence",
      "Absence of nipple discharge, skin dimpling, nipple inversion, or axillary lymphadenopathy in uncomplicated fibroadenomas"
    ],
    diagnosis:
      "Diagnosed definitively using the mandatory standardized 'Triple Assessment' protocol: (1) Clinical Breast Examination (CBE; assessing size, mobility, texture, and axillary nodes). (2) Diagnostic Imaging: High-Resolution Breast Ultrasound (first-line in women <30–35 years with dense breast tissue; shows a well-circumscribed, oval, hypoechoic mass with a wider-than-tall orientation and thin echogenic pseudocapsule) and Digital Diagnostic Mammography (in women >30–35 years; shows a circumscribed radiopaque mass with coarse 'popcorn' calcifications in involuting lesions). (3) Tissue Biopsy: Ultrasound-guided Core Needle Biopsy (CNB; definitive histological standard confirming biphasic epithelial-stromal architecture and ruling out phyllodes tumor or malignancy). Fine Needle Aspiration Cytology (FNAC) is an alternative.",
    differentialDiagnosis:
      "Differentiate Fibroadenoma from Invasive Breast Carcinoma (hard, irregular, fixed mass with poorly defined borders, skin tethering, and axillary lymphadenopathy), Phyllodes Tumor (rapidly enlarging fibroepithelial neoplasm with leaf-like stromal hypercellularity; requires wide local surgical excision), Fibrocystic Breast Changes (diffuse cyclic tender nodularity), Breast Cyst (fluid-filled, anechoic on ultrasound), Fat Necrosis (history of trauma or surgery), and Intraductal Papilloma (unilateral bloody nipple discharge).",
    conventionalManagement:
      "Conservative watchful waiting (clinical and ultrasound follow-up every 6 to 12 months for 1–2 years) is the standard evidence-based approach for biopsy-proven simple fibroadenomas <2–3 cm in young women that remain stable. Surgical excision (lumpectomy / enucleation) or minimally invasive ultrasound-guided vacuum-assisted core excision (VABB) / cryoablation is indicated for: giant fibroadenomas (>5 cm), rapidly growing masses, lesions causing significant pain or cosmetic deformity, complex histological features, cellular suspicion on biopsy, or patient preference/anxiety.",
    homeopathicApproach:
      "Homeopathic constitutional and glandular-supportive remedies (such as Conium Maculatum, Phytolacca Decandra, Calcarea Fluorica, Silicea, Pulsatilla Nigricans, Thuja Occidentalis, Asterias Rubens, Carbo Animalis, Graphites) serve as supportive care to ease cyclic breast tenderness, soothe glandular fullness, and support tissue vitality alongside mandatory ultrasound tracking and Triple Assessment clearance.",
    lifestyleAdvice:
      "Perform monthly breast self-awareness checks a few days following menstruation when breasts are least tender, wear a supportive, well-fitting, non-underwire bra to minimize breast movement and tenderness, reduce excessive caffeine consumption if breast tenderness is present, maintain a healthy balanced diet rich in cruciferous vegetables and antioxidants, and strictly adhere to scheduled follow-up imaging appointments.",
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
        question: "Can a fibroadenoma turn into breast cancer?",
        answer: "A simple fibroadenoma is a benign (non-cancerous) growth and does not transform into cancer. A small subtype called a 'complex fibroadenoma' (which contains tiny cysts or calcifications on biopsy) carries a very slight increase in long-term breast cancer risk, similar to a family history of breast disease."
      },
      {
        question: "Why is a fibroadenoma called a 'breast mouse'?",
        answer: "Because the tumor is not attached to the surrounding breast tissue, skin, or chest wall muscles, it moves and slips freely away under your fingers during an exam, resembling a tiny mouse darting around beneath the skin."
      }
    ],
    redFlags: [
      "Breast Carcinoma Alarm Signs: hard, stony, irregular, non-mobile or fixed breast mass, skin dimpling, tethering, nipple retraction, spontaneous unilateral bloody nipple discharge, or palpable hard axillary lymph nodes (mandates immediate urgent triple assessment and core biopsy)",
      "Inflammatory Breast Cancer: rapid-onset diffuse breast erythema, warmth, severe breast enlargement, and 'peau d'orange' (thickened skin resembling an orange peel) without a discrete mass (urgent oncology evaluation)",
      "Phyllodes Tumor: rapid, dramatic doubling of mass size over a few weeks or months (requires urgent wide surgical excision to rule out borderline or malignant phyllodes neoplasm)",
      "New palpable breast lump appearing in a postmenopausal woman"
    ]
  },
  claimCitations: [
    { claimId: "D0059-TRADITIONAL-PROFILE", statement: "Homeopathic fibroadenoma profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0059-TRADITIONAL-PROFILE" },
    { claimId: "D0059-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for breast carcinoma exclusion, surgical excision, or phyllodes tumor clearance.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0059-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0059-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for breast carcinoma, phyllodes tumor, or inflammatory breast cancer.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Hard fixed irregular breast mass with nipple inversion or bloody discharge indicating breast carcinoma requiring immediate Triple Assessment",
    "Rapid massive enlargement of a breast mass indicating potential phyllodes tumor requiring surgical biopsy",
    "Diffuse breast redness and orange-peel skin (peau d'orange) indicating inflammatory breast cancer"
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
  tags: ["Fibroadenoma", "Breast Lump", "Benign Breast Disease", "Disease", "Breast Mouse", "Triple Assessment", "Core Biopsy", "Gynecology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/fibroadenoma",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive fibroepithelial breast neoplasm clinical boundaries, breast cancer/phyllodes red flags, and verified citations"],
  clinicalPearl: "Every discrete palpable breast lump mandates the 'Triple Assessment' (Clinical exam, Imaging [Ultrasound/Mammography], and Biopsy) before diagnosing a benign fibroadenoma.",
  quickFacts: {
    "Peak Incidence": "Young reproductive females between 15 and 35 years of age (most common benign breast mass)",
    "Primary System": "Reproductive System & Breast Parenchyma (Gynecology / Breast Surgery)",
    "Diagnostic Standard": "Triple Assessment Protocol (Clinical Exam, Ultrasound, & Core Needle Biopsy)",
    "Clinical Character": "Benign biphasic fibroepithelial breast tumor presenting as a smooth, mobile 'breast mouse'"
  },
  aiReadiness: {
    retrievalSummary: "Breast Fibroadenoma is a benign, smooth, mobile breast lump ('breast mouse') common in young women, managed with supportive care, ultrasound tracking, and mandatory Triple Assessment evaluation.",
    clinicalSummary: "Fibroadenoma pathophysiology involves estrogen-sensitive terminal duct lobular unit (TDLU) stromal and epithelial proliferation. Homeopathic remedies serve as supportive glandular care and do not replace mandatory Triple Assessment (clinical exam, ultrasound, core biopsy) or oncology referral for fixed masses or inflammatory breast cancer.",
    patientSummary: "A fibroadenoma is a benign, non-cancerous breast lump common in young women that feels smooth, rubbery, and easily moves around under your fingers (called a breast mouse), confirmed safe with an ultrasound and medical check.",
    studentSummary: "Most common benign breast tumor in young women (<35y). Biphasic histology (epithelium + stroma). 'Breast mouse' mobility. Requires Triple Assessment. Differentiate from phyllodes tumor (rapid growth) and carcinoma (fixed, hard).",
    keywords: ["fibroadenoma", "breast lump", "breast mouse", "benign breast tumor", "mobile breast lump", "triple assessment", "breast ultrasound"],
    semanticKeywords: ["benign fibroepithelial neoplasm", "terminal duct lobular unit proliferation", "breast mass evaluation"],
    icd: "N60.2",
    mesh: "D005350",
    bodySystem: "Gynecology & Breast Health",
    urgency: "routine"
  }
};
