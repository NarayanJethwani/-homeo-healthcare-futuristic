import { KnowledgeEntity } from "../../types";

export const CausticumRemedy: KnowledgeEntity = {
  id: "R0033",
  slug: "causticum",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-01T12:00:00Z",
    reviewed: "2026-08-01T12:00:00Z",
  },
  title: {
    en: "Causticum (Hahnemann's Tinctura Acris Sine Kali)",
    hi: "कॉस्टकम (हैनिमैन टिंक्चर एक्रिस)",
    gu: "કોસ્ટિકમ (હેનિમેન ટિંક્ચર એક્રિસ)",
    mr: "कॉस्टिकल (Causticum)",
    es: "Causticum (Tintura Acris de Hahnemann)",
    ar: "كوستيكوم (Causticum)"
  },
  summary: {
    en: "A cardinal neurological, paralytic, respiratory, and urinary mineral polychrest in classical homeopathy, indicated for rawness and burning in larynx, involuntary micturition on coughing/sneezing, paralysis of single muscles, tendon contractures, and deep social sympathy.",
    hi: "होम्योपैथी में खांसने-छींकने पर पेशाब निकल जाना, गले में छीलने जैसा दर्द, लकवा (पैरालिसिस), और दूसरों के प्रति अत्यधिक हमदर्दी की प्रमुख दवा.",
    gu: "ઉધરસ કે છીંક આવતી વખતે પેશાબ નીકળી જવો, ગળામાં છોલાઈ ગયા જેવી બળતરા, એકાદ સ્નાયુનો લકવો અને બીજા પ્રત્યે અતિશય દયાભાવ માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "खोकताना किंवा शिंकताना लघवी होणे, घशात जळजळ होणे, अर्धांगवायू (Paralysis) आणि इतरांबद्दल अति-सहानुभूतीवर अत्यंत गुणकारी औषध.",
    es: "Un remedio mineral fundamental en homeopatía para aspereza y ardor laríngeo, incontinencia urinaria al toser/estornudar, parálisis de músculos aislados y profunda empatía.",
    ar: "علاج معدني رئيسي للأعصاب في المعالجة المثلية يُشار إليه للحرقة في الحنجرة، السلس البولي عند السعال، والفلج العضلي."
  },
  content: {
    latinName: "Causticum hahnemanni",
    commonName: "Hahnemann's Causticum / Tinctura Acris Sine Kali",
    source: "Complex chemical distillate prepared from slaked lime (calcium hydroxide) and potassium bisulfate, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Causticum is a major antipsoric and antisyphilitic mineral polychrest proved by Samuel Hahnemann. Recognized for its unique action on motor and sensory nerves, vocal cords, urinary bladder sphincter, and flexor tendons. Key features include intense rawness and burning in mucous membranes, involuntary loss of urine when coughing or sneezing, progressive paralysis of isolated muscles (Bell's palsy, ptosis, vocal cord paralysis), tendon contractures, and intense social sympathy.",
    keynotes: [
      "Rawness, burning, and soreness in respiratory passages, larynx, and throat as if skin were scraped off",
      "Involuntary micturition (stress incontinence) when coughing, sneezing, laughing, blowing nose, or walking",
      "Paralysis or paresis of single isolated muscles or nerves (facial nerve, vocal cords, eyelids, bladder sphincter)",
      "Deep, intense, idealistic sympathy for the suffering of others; passionate intolerance of injustice and tyranny",
      "Rheumatic stiffness and shortening of flexor tendons causing joint contractures and deformities",
      "Cough with inability to expectorate phlegm; phlegm must be swallowed down",
    ],
    mentalSymptoms: [
      "Melancholy, hopeless, and fearful; anxious apprehension in evening at twilight",
      "Deep empathy for animals and human suffering; politically idealistic and indignant at injustice",
      "Children sensitive, timid, and cry easily from mildest reprimand",
    ],
    physicalSymptoms: [
      "Hoarseness worse in morning with raw burning in larynx; vocal paralysis in singers",
      "Bell's palsy (facial paralysis) from exposure to dry cold wind",
      "Large pedunculated warts on eyelids, face, nose, or fingertips that bleed easily",
      "Enuresis in children during first sleep, worse in winter",
    ],
    generalities:
      "Chilly patient, yet strongly ameliorated by damp wet weather. Strongly aggravated by dry cold wind, clear fine weather, and 3-4 AM. Ameliorated by damp weather and warm drinks.",
    modalitiesBetter: [
      "Damp warm weather and rain",
      "Warm drinks and cold water sips (cough)",
      "Warmth of bed",
    ],
    modalitiesWorse: [
      "Dry cold air, cold wind, and clear fine weather",
      "Coughing, sneezing, and laughing",
      "Evening and early morning (3 AM to 4 AM)",
      "Sweet foods",
    ],
    clinicalUses: [
      "Traditional materia-medica profile associated with stress-incontinence and laryngeal symptom patterns",
      "Historical homeopathic literature association with weakness, contracture, and selected skin symptoms",
    ],
    organAffinity: [
      "Motor and sensory nervous system (cranial nerves, vocal cords)",
      "Urinary bladder sphincter and kidneys",
      "Respiratory passages, larynx, tendons, and skin",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis",
      "Syphilis"
    ],
    constitution:
      "Suited to dark-haired, slender individuals with rigid fiber, weak nerve stamina, and sensitive sympathetic nature.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "This is a traditional materia-medica profile, not evidence that Causticum treats paralysis, stroke, incontinence, or progressive neurologic disease. Product composition and quality can vary. Sudden facial or limb weakness, speech difficulty, new urinary retention, saddle numbness, or rapidly progressive weakness requires emergency medical assessment.",
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
        "question": "What unique urinary symptom points directly to Causticum?",
        "answer": "Involuntary loss of urine (stress incontinence) when coughing, sneezing, blowing the nose, or laughing is a cardinal keynote of Causticum."
      },
      {
        "question": "How does weather affect Causticum patients?",
        "answer": "Causticum is uniquely relieved by damp wet rainy weather, and strongly aggravated by clear, fine, dry cold weather."
      }
    ]
  },
  claimCitations: [
    {
      claimId: "R0033-TRADITIONAL-PROFILE",
      statement: "Verified classical materia-medica sources describe Causticum using stress incontinence, raw laryngeal symptoms, focal weakness, contractures, and damp-weather amelioration.",
      citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"],
      passageId: "CIT-0006-R0033-TRADITIONAL-PROFILE",
    },
    {
      claimId: "R0033-EVIDENCE-LIMITS",
      statement: "The historical profile is traditional literature evidence and does not establish modern clinical efficacy for any disease.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS",
    },
    {
      claimId: "R0033-PRODUCT-SAFETY",
      statement: "A homeopathic dilution label does not by itself guarantee product composition, quality, safety, or effectiveness.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY",
    },
    {
      claimId: "R0033-CONVENTIONAL-CARE-BOUNDARY",
      statement: "Homeopathic products must not delay emergency assessment or replace proven conventional treatment for serious or life-threatening symptoms.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY",
    },
  ],
  redFlags: [
    "Sudden facial or limb weakness, speech difficulty, or loss of coordination requires emergency stroke evaluation.",
    "New urinary retention, saddle numbness, or rapidly progressive weakness requires emergency neurologic assessment.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Neurological & Urological Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Causticum", "Remedy", "Stress Incontinence", "Paralysis", "Raw Throat", "Damp Better"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/causticum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with paralytic keynotes, stress incontinence, damp modalities, and classical citations"],
  clinicalPearl: "Causticum is indicated in stress incontinence on coughing/sneezing, raw burning in larynx, single-muscle paralysis, and relief in damp wet weather.",
  quickFacts: {
    "Latin Name": "Causticum hahnemanni",
    "Common Name": "Hahnemann's Tinctura Acris Sine Kali",
    "Source Kingdom": "Mineral",
    "Thermal State": "Chilly (Worse dry cold / Better damp wet)"
  },
  aiReadiness: {
    retrievalSummary: "Causticum is a major mineral homeopathic polychrest for stress incontinence on coughing, rawness and burning in larynx, single-muscle paralysis, tendon contractures, and relief in damp weather.",
    clinicalSummary: "Classical literature describes a Causticum profile involving laryngeal, urinary, and motor symptoms; it does not establish efficacy or guarantee product safety.",
    patientSummary: "Classical texts associate Causticum with urinary leakage and hoarseness. Sudden weakness, speech difficulty, or urinary retention requires urgent conventional assessment.",
    studentSummary: "Guiding keynotes include stress incontinence on coughing, raw larynx burning, single-muscle paralysis, tendon contractures, intense social sympathy, and relief in damp wet weather.",
    keywords: ["causticum", "stress incontinence", "paralysis remedy", "raw throat", "damp weather better"],
    semanticKeywords: ["neurological polychrest", "urinary incontinence remedy", "facial paralysis remedy"],
    bodySystem: "Nervous & Urological",
    urgency: "routine"
  }
};
