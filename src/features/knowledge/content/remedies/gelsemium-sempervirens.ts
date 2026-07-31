import { KnowledgeEntity } from "../../types";

export const GelsemiumSempervirensRemedy: KnowledgeEntity = {
  id: "R0012",
  slug: "gelsemium-sempervirens",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Gelsemium Sempervirens (Yellow Jasmine)",
    hi: "जेलसीमियम सेम्परविरेन्स (येलो जैस्मीन / पीली चमेली)",
    gu: "જેલસીમિયમ સેમ્પરવિરેન્સ (પીળી ચમેલી)",
    mr: "जेलसीमियम सेम्परविरेन्स (Gelsemium)",
    es: "Gelsemium Sempervirens (Jazmín Amarillo)",
    ar: "جيلسيميوم سيمبرفيرينس (Gelsemium)"
  },
  summary: {
    en: "A vital neurological and acute polychrest in classical homeopathy, characterized by the '4 Ds' (Dullness, Drowsiness, Dizziness, Trembling), absence of thirst during fever, occipital headache relieved by urination, and anticipatory anxiety.",
    hi: "होम्योपैथी में मानसिक कमजोरी, सुस्ती, चक्कर, कंपकंपी, और परीक्षा पूर्व घबराहट की प्रमुख दवा.",
    gu: "સુસ્તી, ચક્કર, ધ્રુજારી અને પરીક્ષા કે ઈન્ટરવ્યુ પૂર્વેના ગભરાટ માટે હોમિયોપેથીની શ્રેષ્ઠ અસ્વસ્થતા અને નાડીની દવા.",
    mr: "सुस्ती, चक्कर, थरकाप आणि भीतीमुळे होणाऱ्या अतिसारावर अत्यंत गुणकारी औषध.",
    es: "Un remedio neurológico y agudo en homeopatía caracterizado por las '4 D' (Embotamiento, Somnolencia, Mareo, Temblor) y ansiedad de anticipación.",
    ar: "علاج عصبي وحاد رئيسي في المعالجة المثلية يتميز بالكسل والنعاس والدوار والارتعاش."
  },
  content: {
    latinName: "Gelsemium sempervirens",
    commonName: "Yellow Jasmine / Carolina Jasmine",
    source: "Fresh root of Gelsemium sempervirens collected at flowering time, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Gelsemium sempervirens is a fundamental polychrest described by Hale, Kent, and Boericke. Famous for its action on the motor nervous system, producing motor paralysis, muscular prostration, heavy drooping eyelids (ptosis), complete lack of thirst during fever, and emotional weakness from anticipation.",
    keynotes: [
      "The '4 Ds': Dullness, Drowsiness, Dizziness, and Trembling (motor weakness)",
      "Absence of thirst during fever with heavy eyelids (ptosis) and muscular prostration",
      "Anticipatory anxiety with diarrhea or frequent urination before exams, public speaking, or ordeals",
      "Occipital headache extending over the head to the eyes, characteristically relieved by profuse urination",
      "Sensation as if the heart would stop beating unless the patient keeps moving",
    ],
    mentalSymptoms: [
      "Apathy, mental sluggishness, and dullness; desires to be left alone without being spoken to",
      "Anticipatory apprehension, stage fright, fear of dentists, or fear of public performance",
      "Bad effects from fright, fear, exciting news, or sudden emotional shock",
    ],
    physicalSymptoms: [
      "Motor weakness, muscular trembling, lack of coordination, and heavy limbs",
      "Heavy drooping upper eyelids (ptosis), diplopia, and blurred vision during headache",
      "Congestive occipital headache with band-like constriction around head",
      "Acute influenza with muscular soreness, chills running up and down the spine, and thirstlessness",
    ],
    generalities:
      "Chilly patient with chills starting in the lumbar spine. Marked motor weakness and trembling. Relieved by profuse urination.",
    modalitiesBetter: [
      "Profuse urination (relieves headache and mental congestion)",
      "Open cool air",
      "Continued gentle motion",
      "Mental rest and quiet",
    ],
    modalitiesWorse: [
      "Anticipation, exciting news, or emotional stress",
      "Damp weather, fog, and muggy atmosphere",
      "10 AM in the morning",
      "Heat of the sun",
    ],
    clinicalUses: [
      "Supportive management in acute influenza, viral fevers, and tension/occipital headache",
      "Management of anticipatory anxiety, stage fright, and acute motor weakness",
    ],
    organAffinity: [
      "Motor nervous system and spinal cord",
      "Ocular muscles and eyelids (ptosis)",
      "Cardiovascular system and gastrointestinal tract",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to nervous, excitable, sensitive individuals, elderly patients, or young students suffering from stage fright and anticipatory dread.",
    potencies: [
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw Gelsemium sempervirens root is a dangerous poison containing gelsemine alkaloids that paralyze motor spinal centers and respiratory muscles. Raw plant tinctures are strictly restricted; homeopathic preparations must be potentized (30C/200C). Urgent emergency medical evaluation is mandatory for progressive motor paralysis, dyspnea, or cardiac irregularities.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006"
    ],
    faqs: [
      {
        "question": "What are the '4 Ds' of Gelsemium?",
        "answer": "The classic '4 Ds' of Gelsemium are Dullness, Drowsiness, Dizziness, and Trembling."
      },
      {
        "question": "How does profuse urination affect a Gelsemium headache?",
        "answer": "A key modality of Gelsemium is that congestive occipital headaches are markedly relieved after passing a large volume of clear urine."
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
    specialty: "Neurological & Acute Fever Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Gelsemium", "Remedy", "Drowsiness", "Anticipatory Anxiety", "Thirstless Fever"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/gelsemium-sempervirens",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, gelsemine alkaloid safety warnings, and classical citations"],
  clinicalPearl: "Gelsemium is indicated in acute flu or anxiety states featuring drowsiness, trembling, heavy eyelids, thirstlessness, and headache relieved by urination.",
  quickFacts: {
    "Latin Name": "Gelsemium sempervirens",
    "Common Name": "Yellow Jasmine",
    "Source Kingdom": "Vegetable (Loganiaceae family)",
    "Thermal State": "Chilly (Chills up and down back)"
  },
  aiReadiness: {
    retrievalSummary: "Gelsemium sempervirens is a major neurological homeopathic polychrest indicated for motor weakness, heavy eyelids, thirstless flu fevers, occipital headache relieved by urination, and anticipatory anxiety.",
    clinicalSummary: "Botanical source contains gelsemine alkaloids. Homeopathic dilutions are safe and non-toxic. Primary clinical affinities include motor nerves, spinal cord, ocular muscles, and respiratory mucosa.",
    patientSummary: "Gelsemium sempervirens is a homeopathic remedy used for flu with tiredness and body aching, stage fright, dizziness, and nervous headache.",
    studentSummary: "Guiding keynotes include 4 Ds (Dullness, Drowsiness, Dizziness, Trembling), thirstless fever, ptosis, occipital headache relieved by urination, and anticipation diarrhea.",
    keywords: ["gelsemium", "yellow jasmine", "stage fright", "flu remedy", "thirstless fever"],
    semanticKeywords: ["motor nerve polychrest", "anticipatory anxiety remedy", "occipital headache remedy"],
    bodySystem: "Nervous & Respiratory",
    urgency: "routine"
  }
};
