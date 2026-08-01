import { KnowledgeEntity } from "../../types";

export const CausticumRemedy: KnowledgeEntity = {
  id: "R0033",
  slug: "causticum",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
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
      "Management of urinary stress incontinence, nocturnal enuresis, and bladder sphincter weakness",
      "Supportive care in facial nerve paralysis (Bell's palsy), vocal cord paresis/hoarseness, tendon contractures, and warts",
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
      "Prepared according to Hahnemann's chemical distillation formula. Potentized homeopathic preparations (6C, 30C, 200C) are safe and non-toxic. Clinical neurological evaluation is recommended for acute stroke, acute cranial nerve paralysis, or progressive motor neuron disease.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
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
    clinicalSummary: "Source is Hahnemann's chemical distillate. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include motor nerves, bladder sphincter, larynx, tendons, and skin.",
    patientSummary: "Causticum is a homeopathic remedy used for leaking urine when coughing or sneezing, hoarseness with raw throat pain, facial nerve weakness, and stiffness relieved by rainy weather.",
    studentSummary: "Guiding keynotes include stress incontinence on coughing, raw larynx burning, single-muscle paralysis, tendon contractures, intense social sympathy, and relief in damp wet weather.",
    keywords: ["causticum", "stress incontinence", "paralysis remedy", "raw throat", "damp weather better"],
    semanticKeywords: ["neurological polychrest", "urinary incontinence remedy", "facial paralysis remedy"],
    bodySystem: "Nervous & Urological",
    urgency: "routine"
  }
};
