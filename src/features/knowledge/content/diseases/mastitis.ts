import { KnowledgeEntity } from "../../types";

export const MastitisDisease: KnowledgeEntity = {
  id: "D0073",
  slug: "mastitis",
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
    en: "Acute Mastitis (Lactational Puerperal Mastitis & Breast Inflammation)",
    hi: "मैस्टाइटिस / स्तन का तीव्र संक्रमण व सूजन (Acute Mastitis / Breast Infection)",
    gu: "મેસ્ટાઇટિસ / સ્તનનો ચેપ અને સોજો (Acute Mastitis)",
    mr: "स्तनाची सूज व संसर्ग / मॅस्टायटिस (Acute Mastitis)",
    es: "Mastitis Aguda (Mastitis Puerperal Lactacional e Infección Mamaria)",
    ar: "التهاب الثدي الحاد والتهاب الثدي النفاسي (Acute Mastitis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Acute Mastitis, covering lactational milk stasis, retrograde Staphylococcus aureus ductal colonization, localized wedge-shaped breast erythema and systemic flu-like toxemia, constitutional homeopathic supportive management, and emergency red flags for loculated breast abscess, puerperal sepsis, and inflammatory breast carcinoma (IBC).",
    hi: "एक्यूट मैस्टाइटिस (स्तनपान के दौरान स्तन की सूजन व संक्रमण) का मिल्क स्टैसिस पैथोलॉजी, स्टेफिलोकोकस संक्रमण, त्रिकोणीय लालिमा, तेज बुखार व ठंड, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और स्तन में मवाद भरा फोड़ा (Breast Abscess), सेप्सिस व इन्फ्लेमेटरी ब्रेस्ट कैंसर की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "મેસ્ટાઇટિસ (સ્તનનો ચેપ અને સોજો) ની લેક્ટેશનલ પેથોલોજી, દૂધ ભરાઈ રહેવું, સ્તનમાં લાલ ચકામા અને કંપારી સાથે તાવ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સ્તનમાં પરુ થવું (બ્રેસ્ટ એબ્સેસ) તથા સેપ્સિસની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "स्तनाचा संसर्ग व सूज (Mastitis), दूध साचल्याने होणारा संसर्ग, थंडी वाजून तीव्र ताप येणे, पारंपरिक होमिओपॅथिक पद्धत आणि स्तनात पू होणे (Breast Abscess) व सेप्सिसच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la mastitis aguda que cubre el estasis lácteo, infección por S. aureus, eritema mamario, manejo homeopático complementario y banderas rojas de absceso mamario fluctuante, sepsis y carcinoma inflamatorio.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب الثدي الحاد يغطي ركودة الحليب واستعمار المكورات العنقودية الذهبية والحمى الشبيهة بالإنفلونزا والرعاية التكميلية وعلامات الخطر لخراج الثدي المتموج والإنتان وسرطان الثدي الالتهابي."
  },
  content: {
    overview:
      "Acute Mastitis is an acute inflammatory and infectious condition of the breast parenchyma that predominantly affects lactating women (Puerperal / Lactational Mastitis; occurring in up to 10% to 20% of postpartum breastfeeding mothers, typically within the first 6 to 12 weeks postpartum), although it can also occur in non-lactating individuals (periductal mastitis or granulomatous lobular mastitis). Initiated by localized milk stasis (incomplete breast emptying, blocked lactiferous ducts, or engorgement) followed by retrograde bacterial colonization—most commonly by Staphylococcus aureus entering through micro-fissures in cracked or abraded nipples—it presents with acute localized wedge-shaped breast erythema, intense heat, swelling, exquisite tenderness, and acute systemic constitutional symptoms (high fever, shaking rigors, myalgias, and severe malaise).",
    definition:
      "An acute inflammatory process of the interlobular connective tissue and glandular parenchyma of the breast, with or without bacterial infection, characterized by localized breast pain, erythema, and systemic febrile illness.",
    causes: [
      "Lactational Milk Stasis: incomplete milk drainage, delayed or missed feedings, poor infant latch, tight restrictive bras, or oversupply leading to elevated intraductal pressure and leakage of inflammatory milk components into the surrounding breast stroma",
      "Retrograde bacterial ductal colonization: entry of pathogenic bacteria—predominantly Staphylococcus aureus (including Community-Acquired Methicillin-Resistant S. aureus [MRSA]), followed by Streptococcus pyogenes, Staphylococcus epidermidis, and Escherichia coli—from the infant's nasopharynx or mother's skin through cracked nipple fissures",
      "Non-lactational periductal mastitis: squamous metaplasia of lactiferous ductal lining, ductal ectasia, and keratin plug retention (strongly associated with cigarette smoking)",
      "Granulomatous Lobular Mastitis (GLM): idiopathic autoimmune inflammatory disease of the breast lobules mimicking inflammatory breast cancer"
    ],
    riskFactors: [
      "Primiparity (first-time breastfeeding mothers experiencing latch difficulties)",
      "Cracked, sore, blistered, or bleeding nipples providing a direct portal of microbial entry",
      "Infant oral anatomical restrictions (ankyloglossia / severe tongue-tie, cleft palate)",
      "Abrupt weaning or suddenly stretching intervals between breastfeeds",
      "Cigarette smoking (major independent risk factor for recurrent non-lactational subareolar abscesses and periductal mastitis)"
    ],
    symptoms: [
      "Localized breast erythema: bright red, hot, swollen, wedge-shaped inflammatory segment typically confined to one breast quadrant (most commonly upper-outer quadrant)",
      "Exquisite breast tenderness, engorgement, and throbbing pain aggravated by light touch and milk letdown",
      "Systemic flu-like toxemia: rapid onset of high spiking fever (>38.3–38.5°C / 101–101.3°F), shaking chills, rigors, body-wide myalgias, headache, and profound fatigue",
      "Palpable, firm, tender breast induration or hard inflammatory wedge without initial fluctuance",
      "Ipsilateral axillary lymphadenopathy: tender, enlarged reactive lymph nodes in the armpit on the affected side"
    ],
    diagnosis:
      "Diagnosed primarily clinically based on the characteristic presentation of acute localized breast inflammation in a lactating woman accompanied by systemic fever and chills. Diagnostic imaging and laboratory tests are indicated when symptoms fail to improve within 48 to 72 hours of appropriate antibiotic therapy, when a mass remains palpable, or when a breast abscess is suspected: (1) High-Resolution Breast Ultrasound (the definitive imaging modality of choice; readily differentiates diffuse cellulitic parenchymal inflammation from an anechoic/hypoechoic loculated, thick-walled, fluctuant Breast Abscess). (2) Expressed Breast Milk Culture and Sensitivity (indicated in hospital-acquired infections, severe systemic illness, or treatment-refractory recurrent cases).",
    differentialDiagnosis:
      "Differentiate Acute Mastitis from Simple Breast Engorgement (bilateral generalized breast fullness without localized erythema or high fever), Blocked Lactiferous Duct (localized tender lump without systemic fever/chills), Loculated Breast Abscess (fluctuant, exquisitely painful breast mass beneath indurated erythema), Galactocele (non-tender retention milk cyst), and Inflammatory Breast Carcinoma (IBC; non-lactating diffuse breast erythema, warmth, and 'peau d'orange' skin thickening that does not respond to antibiotic therapy).",
    conventionalManagement:
      "A comprehensive, structured protocol: (1) Mandatory continued frequent and effective milk removal (breastfeeding from the affected breast or expressing milk is the cornerstone of resolution; milk is safe for the healthy infant and continuing lactation prevents abscess formation). (2) Targeted antimicrobial therapy (indicated when symptoms are severe or persist >24 hours despite effective emptying): oral penicillinase-resistant penicillins (Dicloxacillin 500 mg QID, Flucloxacillin) or first-generation cephalosporins (Cephalexin 500 mg QID) for 10–14 days. For suspected MRSA: Clindamycin or Trimethoprim-Sulfamethoxazole (TMP-SMX; avoid in mothers of neonates <2 months). (3) Symptomatic supportive care: oral analgesics/anti-inflammatories (ibuprofen and acetaminophen reduce pain and swelling), cold compresses between feeds to reduce edema, and warm moist compresses immediately prior to nursing to encourage milk ejection.",
    homeopathicApproach:
      "Homeopathic constitutional and acute mastitis remedies (such as Phytolacca Decandra, Belladonna, Bryonia Alba, Hepar Sulphuris Calcareum, Silicea, Mercurius Solubilis, Chamomilla, Croton Tiglium, Arnica Montana) serve as supportive care to ease breast engorgement pain, soothe hard glandular induration, and assist tissue recovery alongside effective milk expression, hydration, and conventional antibiotic protocols.",
    lifestyleAdvice:
      "Continue breastfeeding or pumping from the affected breast every 2 to 3 hours (start feeding on the unaffected side first until milk lets down if pain is severe, then switch to the affected breast), position the baby's chin pointing toward the clogged duct to optimize drainage, apply a cool gel pack or chilled cabbage leaf to the breast between feeds to reduce swelling, apply pure medical-grade lanolin or expressed breast milk to sore nipples after feeds to heal micro-cracks, rest in bed, drink plenty of water, and avoid tight underwire bras.",
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
        question: "Is it safe to continue breastfeeding my baby when I have mastitis?",
        answer: "Yes, it is completely safe and medically recommended. The bacteria causing mastitis come from your skin and the baby's mouth, and your stomach acid and the baby's digestive tract safely destroy them. Stopping breastfeeding suddenly actually worsens milk stasis and dramatically increases your risk of developing a painful breast abscess."
      },
      {
        question: "How can I tell if my mastitis has turned into a breast abscess?",
        answer: "If your high fever, severe pain, and redness do not improve within 48 to 72 hours of taking antibiotics, or if you feel a distinct, painful, squishy or fluid-filled lump (fluctuance) under the red area, an ultrasound should be done immediately to check for a collection of pus (abscess) that requires needle drainage."
      }
    ],
    redFlags: [
      "Loculated Breast Abscess: persistent palpable, fluctuant, exquisitely tender fluid collection under the inflamed skin that fails to resolve after 48–72 hours of antibiotics (requires immediate diagnostic ultrasound and ultrasound-guided needle aspiration or surgical drainage)",
      "Puerperal Sepsis / Septic Shock: high spiking fever (>39°C / 102.2°F), severe hypotension, tachycardia (>120 bpm), tachypnea, confusion, and peripheral hypoperfusion (life-threatening medical emergency requiring immediate hospitalization, blood cultures, and broad-spectrum IV antibiotics)",
      "Inflammatory Breast Carcinoma (IBC): rapid onset of diffuse breast erythema, warmth, and skin edema resembling an orange peel ('peau d'orange') in a non-lactating or postmenopausal woman, or mastitis symptoms that fail to clear completely after a full course of antibiotics (mandates urgent diagnostic mammography, ultrasound, and punch biopsy of the skin/breast tissue to rule out aggressive breast cancer)"
    ]
  },
  claimCitations: [
    { claimId: "D0073-TRADITIONAL-PROFILE", statement: "Homeopathic mastitis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0073-TRADITIONAL-PROFILE" },
    { claimId: "D0073-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for breast abscess needle aspiration, sepsis clearance, or antibiotic replacement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0073-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0073-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for loculated breast abscess, puerperal sepsis, or inflammatory breast carcinoma.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Fluctuant tender breast mass failing to respond to antibiotics indicating loculated breast abscess requiring ultrasound-guided aspiration",
    "High fever, hypotension, and altered mental status indicating puerperal sepsis requiring emergency hospitalization and IV antibiotics",
    "Non-lactating diffuse breast erythema with peau d'orange skin changes indicating inflammatory breast carcinoma"
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
  tags: ["Mastitis", "Lactational Mastitis", "Breast Infection", "Milk Stasis", "Disease", "Breast Engorgement", "Breast Abscess", "Obstetrics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/mastitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive lactational mastitis clinical boundaries, breast abscess/sepsis red flags, and verified citations"],
  clinicalPearl: "Never stop breastfeeding or pumping during acute mastitis; continuous milk expression is the primary therapeutic action that prevents progress to a surgical breast abscess.",
  quickFacts: {
    "Postpartum Incidence": "Affects 10% to 20% of lactating women (peak incidence in the first 6 to 12 weeks)",
    "Primary System": "Reproductive System & Lactational Breast Parenchyma (Obstetrics / Breast Medicine)",
    "Diagnostic Standard": "Clinical Exam (Wedge Erythema + Fever) & Breast Ultrasound (to rule out Abscess)",
    "Clinical Character": "Acute parenchymal breast inflammation driven by milk stasis and retrograde bacterial infection"
  },
  aiReadiness: {
    retrievalSummary: "Acute Mastitis is an infection of the breast in breastfeeding mothers causing redness, pain, and flu-like fevers, managed with supportive care, continued breastfeeding, and antibiotics when indicated.",
    clinicalSummary: "Mastitis pathophysiology involves lactational milk stasis, retrograde S. aureus ductal colonization, and parenchymal inflammation. Homeopathic remedies serve as supportive care and do not replace continuous milk expression, conventional antibiotics (dicloxacillin/cephalexin), or emergency ultrasound-guided drainage for loculated breast abscesses or puerperal sepsis.",
    patientSummary: "Mastitis is a painful breast infection that can happen while breastfeeding due to a blocked milk duct, causing a red, tender, swollen breast and fever, improved by continuing to nurse, applying warm compresses, and resting.",
    studentSummary: "Puerperal mastitis is most common in first 6-12w postpartum. Major pathogen: S. aureus. Cardinal rule: continue breastfeeding to prevent abscess. Ultrasound is mandatory if mass remains after 48h of antibiotics. Red flags: fluctuant abscess, sepsis, and inflammatory breast cancer (IBC).",
    keywords: ["mastitis", "breast infection", "lactational mastitis", "sore red breast", "breastfeeding fever", "milk stasis", "breast abscess"],
    semanticKeywords: ["puerperal breast inflammation", "lactiferous ductal stasis", "staphylococcal mastitis"],
    icd: "N61.0",
    mesh: "D008413",
    bodySystem: "Obstetrics & Gynecology",
    urgency: "routine"
  }
};
