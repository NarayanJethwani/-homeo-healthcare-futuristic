import { KnowledgeEntity } from "../../types";

export const SarsaparillaRemedy: KnowledgeEntity = {
  id: "R0066",
  slug: "sarsaparilla",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z",
  },
  title: {
    en: "Sarsaparilla (Wild Licorice / Smilax)",
    hi: "सारसापरिला (अनंतमूल / स्माइलैक्स)",
    gu: "સારસાપરિલા (અનંતમૂળ / સ્માઇલેક્સ)",
    mr: "सारसापरिला (Sarsaparilla)",
    es: "Sarsaparilla (Zarzaparrilla)",
    ar: "سارساباريلا (Sarsaparilla)"
  },
  summary: {
    en: "A cardinal urinary, renal, and dermatological botanical remedy in classical homeopathic materia medica, historically described for excruciating agony at the conclusion of urination, passage of renal gravel and white sand, marasmus with dry shriveled skin, and deep painful fissures of fingers and toes.",
    hi: "होम्योपैथिक साहित्य में पेशाब खत्म होते ही होने वाले असहनीय चीरने वाले दर्द, गुर्दे की पथरी में सफेद व बालू जैसी रेत निकलने, त्वचा के सूखने व सिकुड़ने (मरास्मस), और हाथ-पैर की उंगलियों में गहरी दर्दनाक दरारों की प्रमुख वर्णित औषधि.",
    gu: "પેશાબ પૂરું થતાંની સાથે જ થતી અસહ્ય ચીસ પડાવી દે તેવી પીડા, પેશાબમાં સફેદ રેતી કે કચરો નીકળવો અને આંગળીઓના ટેરવાં ફાટી જવાની તકલીફ માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "लघवी संपताना होणारी असह्य कळ, मूतखड्यामुळे लघवीतून पांढरी वाळू पडणे आणि हातापायांच्या बोटांना पडणाऱ्या खोल भेगांवर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico urinario, renal y dermatológico fundamental en materia médica homeopática, descrito históricamente para dolor atroz al terminar de orinar, litiasis renal con arena blanca y fisuras cutáneas profundas.",
    ar: "علاج نباتي بولي وكلوي وجلدي رئيسي في المعالجة المثلية يُوصف تاريخياً للألم الشديد عند نهاية التبول والرمل الكلوي والشقوق الجلدية العميقة المؤلمة."
  },
  content: {
    latinName: "Smilax officinalis / Smilax medica",
    commonName: "Sarsaparilla / Wild Licorice",
    source: "Dried root of Smilax officinalis, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Sarsaparilla (Smilax) is a major urinary, renal, and cutaneous botanical remedy proved by Samuel Hahnemann and Dr. C. G. Nenning. In classical homeopathic texts, it is celebrated for its specific pathogenetic affinity for the urinary bladder neck, urethra, kidneys, and skin. Key features recorded in materia medica include an unmistakable and agonizing keynote modality: intense, excruciating, burning, and cutting pain occurring strictly at the conclusion of urination, crying and screaming of infants before and while passing urine, passage of gravel, white sandy particles, or blood in the urine, severe emaciation and marasmus where the skin becomes dry, shriveled, and hangs in loose folds, and deep, painful, bleeding rhagades and fissures on the hands, feet, and sides of fingers.",
    keynotes: [
      "Historically described for excruciating, agonizing, burning pain at the neck of bladder at the conclusion of urination",
      "Infants scream and cry bitterly before and during urination, passing sand on diapers (calculous diathesis)",
      "Urinary lithiasis and renal colic: passage of white sand, greyish sediment, or bloody mucus with burning along urethra",
      "Urine can only be passed freely while standing; dribbles or stops completely when sitting down",
      "Skin is dry, shriveled, withered, and hangs in loose folds with emaciation (especially of neck and extremities)",
      "Deep, painful, bleeding cracks, fissures, and rhagades on fingers, toes, nipples, and skin folds, worse in winter",
    ],
    mentalSymptoms: [
      "Depressed, taciturn, and gloomy; easily offended and sensitive to slight slights",
      "Anxious and fearful during paroxysms of renal pain",
      "Impatient and irritable, especially before urination",
    ],
    physicalSymptoms: [
      "Right-sided renal colic radiating downwards along ureter to bladder and genitals",
      "Herpetic eruptions on prepuce and scrotum with intolerable itching and burning",
      "Dry, cracked, rhagadic eczema of hands and feet with deep indurated borders",
    ],
    generalities:
      "Chilly patient, sensitive to cold damp air and washing. Strongly aggravated at the end of urination, while sitting, from cold damp, and in winter. Ameliorated by standing up (during urination), warmth, and warm dry weather.",
    modalitiesBetter: [
      "Standing up (can only void urine easily when standing)",
      "Warmth and warm dry weather",
      "Discharge of urinary gravel",
    ],
    modalitiesWorse: [
      "At conclusion of urination (severe agony)",
      "Sitting down (urination stops)",
      "Cold, damp air and washing in cold water",
      "Winter season (skin fissures)",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in end-of-urination dysuria, nephrolithiasis gravel, and rhagadic eczema",
      "Historical materia medica reference for infantile urinary sand and shriveled marasmic skin profiles",
    ],
    organAffinity: [
      "Urinary tract (kidneys, ureters, bladder neck, urethra)",
      "Skin, subcutaneous tissues, and mucosal junctions",
      "Male and female external genitalia",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis",
      "Syphilis"
    ],
    constitution:
      "Suited to emaciated, withered children with shriveled necks and scrofulous diathesis, or elderly men with urinary lithiasis.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude Sarsaparilla root contains steroidal saponins (sarsasapogenin, smilagenin); source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute complete urinary tract obstruction, urosepsis, pyelonephritis with septic shock, or acute kidney injury requires immediate emergency urologic/medical intervention; this traditional profile must not delay proven care.",
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
        "question": "What is the hallmark urinary keynote of Sarsaparilla in traditional texts?",
        "answer": "In classical homeopathic materia medica, Sarsaparilla is characterized by excruciating, agonizing, cutting pain occurring specifically at the very conclusion of urination."
      },
      {
        "question": "What peculiar posture aids urination in Sarsaparilla in traditional descriptions?",
        "answer": "In classical literature, the patient can only void urine freely while standing up; when sitting, urine dribbles or ceases entirely."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0066-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0066-TRADITIONAL-PROFILE" },
    { claimId: "R0066-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for obstructive uropathy, pyelonephritis, or renal failure.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0066-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0066-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for urinary retention, urosepsis, or obstructive calculus.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute complete urinary obstruction with anuria or bladder distension requires immediate emergency catheterization.", "Acute pyelonephritis with high fever, rigors, or uroseptic shock requires emergency intravenous antibiotic therapy."],
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
  tags: ["Sarsaparilla", "Smilax", "Remedy", "Agony End of Urination", "Urinary Gravel", "Urine Passing Standing", "Skin Fissures"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sarsaparilla",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional urinary gravel keynotes, saponin safety notes, and verified citations"],
  clinicalPearl: "Sarsaparilla is described in traditional materia medica for excruciating pain at conclusion of urination, passage of white sand, voiding urine standing, and deep skin fissures.",
  quickFacts: {
    "Latin Name": "Smilax officinalis",
    "Common Name": "Sarsaparilla",
    "Source Kingdom": "Plant (Smilacaceae family)",
    "Thermal State": "Chilly (Aggravated by cold damp air & washing)"
  },
  aiReadiness: {
    retrievalSummary: "Sarsaparilla (Smilax) is a major botanical homeopathic remedy described historically for excruciating agony at conclusion of urination, passage of renal gravel and white sand, and deep skin fissures.",
    clinicalSummary: "Classical texts describe a Sarsaparilla root symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency urological decompression for obstructive stones or urosepsis.",
    patientSummary: "Sarsaparilla is a traditional homeopathic remedy described in literature for severe burning and pain right at the end of passing urine, passing sandy sediment, and painful deep cracks in the skin.",
    studentSummary: "Guiding traditional keynotes include agony at end of urination, urination only possible standing, white urinary sand, infantile crying before urination, shriveled marasmic skin, and winter fissures.",
    keywords: ["sarsaparilla", "smilax", "pain at end of urination", "urinary sand gravel remedy", "rhagades fissures"],
    semanticKeywords: ["botanical remedy", "urinary renal profile", "calculous diathesis"],
    bodySystem: "Urinary & Dermatologic",
    urgency: "routine"
  }
};
