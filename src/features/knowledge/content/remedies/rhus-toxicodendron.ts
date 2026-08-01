import { KnowledgeEntity } from "../../types";

export const RhusToxicodendronRemedy: KnowledgeEntity = {
  id: "R0020",
  slug: "rhus-toxicodendron",
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
    en: "Rhus Toxicodendron (Poison Ivy / Poison Oak)",
    hi: "रस टॉक्सिकोडेंड्रोन (पॉइज़न आइवी)",
    gu: "રસ ટોક્સિકોડેન્ડ્રોન (પોઇઝન આઇવી)",
    mr: "रस टॉक्सिकोडेंड्रोन (Poison Ivy)",
    es: "Rhus Toxicodendron (Hiedra Venenosa)",
    ar: "روس توكسيكوديندرون (Rhus Toxicodendron)"
  },
  summary: {
    en: "A cardinal musculoskeletal and dermatological polychrest in classical homeopathy, indicated for fibrous tissue inflammation, joint stiffness worse on initial motion and better on continued motion, triangular red tip on tongue, and vesicular skin eruptions.",
    hi: "होम्योपैथी में जोड़ों की जकड़न (शुरुआती चलने में दर्द, चलने पर आराम), मांसपेशियों में खिंचाव, और त्वचा पर पपड़ीदार छालों की प्रमुख दवा.",
    gu: "સાંધાની અકડામણ (શરૂઆતના હલનચલનમાં દુખાવો, આગળ ચાલતાં રાહત), સ્નાયુઓના દુખાવા અને ચામડીના ફોલ્લા માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "सुरुवातीला दुखणारे पण चालत राहिल्यास बरे वाटणारे सांधेदुखी आणि त्वचेवरील पुरळांवर अत्यंत प्रभावी औषध.",
    es: "Un remedio polychrest principal en homeopatía para rigidez articular peor al iniciar movimiento y mejor al continuar, y erupciones vesiculares.",
    ar: "علاج رئيسي في المعالجة المثلية لتصلب المفاصل الذي يسوء مع بداية الحركة ويتحسن مع استمرارها."
  },
  content: {
    latinName: "Toxicodendron radicans / Rhus toxicodendron",
    commonName: "Poison Ivy / Poison Oak",
    source: "Fresh leaves of Toxicodendron radicans collected before flowering, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Rhus toxicodendron is a classic polychrest proved by Samuel Hahnemann. Celebrated for its affinity for fibrous tissues (tendons, ligaments, fascia), skin, and joints. Its cardinal hallmark is physical restlessness, stiffness on initial motion ('rusty gate'), relief from continued motion and hot applications, and red triangular tip on the tongue.",
    keynotes: [
      "Great stiffness and pain on first beginning to move, which eases up gradually with continued motion ('rusty gate' modality)",
      "Extreme physical restlessness; patient must change position constantly to obtain temporary pain relief",
      "Red triangular patch at the tip of the tongue with dry coated body",
      "Triggered by getting wet while overheated, exposure to damp cold, or ligamentous strain",
      "Vesicular skin eruptions (herpes zoster, eczema, dermatitis) with intense itching and burning relieved by hot water",
    ],
    mentalSymptoms: [
      "Extreme mental restlessness and anxiety at night; cannot stay in bed",
      "Apprehension, fear of poison, fear of being harmed, and weeping without cause",
      "Depression and irritability worse during rest and stormy weather",
    ],
    physicalSymptoms: [
      "Rheumatic arthritis, sciatica, and lumbago with stiffness worse in morning and rainy weather",
      "Ligamentous sprains, tendonitis, and joint effusion from overstretching",
      "Vesicular skin eruptions filled with yellow serum, burning severely, relieved by hot baths",
      "Typhoid febrile state with dry red-tipped tongue, muttering delirium, and restlessness",
    ],
    generalities:
      "Extremely chilly patient. Strongly aggravated by cold damp weather, rain, rest, and night. Ameliorated by hot applications and continued motion.",
    modalitiesBetter: [
      "Warm heat, hot bath, and warm dry weather",
      "Continued physical motion and walking",
      "Change of position and stretching limbs",
      "Dry warm covering",
    ],
    modalitiesWorse: [
      "Cold damp air, rain, and getting wet while perspiring",
      "First beginning to move after rest",
      "Resting or lying still",
      "Night and stormy weather",
    ],
    clinicalUses: [
      "First-line support in acute tendon/ligament sprains, tendonitis, and sciatica",
      "Management of herpes zoster, vesicular dermatitis, and rheumatic stiffness",
    ],
    organAffinity: [
      "Fibrous tissues (tendons, ligaments, periosteum, fascia)",
      "Joints and synovial membranes",
      "Skin and mucous membranes",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to rheumatic, nervous, restless individuals sensitive to damp cold weather and physical over-exertion.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw Toxicodendron radicans contains urushiol, an aggressive toxic antigen causing severe contact dermatitis, facial edema, and mucosal inflammation. Raw plant contact is strictly toxic; homeopathic preparations must be potentized (6C, 30C, 200C). Urgent emergency medical review is indicated for severe herpes zoster complications, facial cellutitis, or acute septic arthritis.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006"
    ],
    faqs: [
      {
        "question": "What is the hallmark motion modality of Rhus Tox?",
        "answer": "The hallmark modality of Rhus Tox is severe stiffness and pain on initial movement ('rusty gate'), which gradually improves with continued motion."
      },
      {
        "question": "What tongue feature is characteristic of Rhus Tox?",
        "answer": "A classic keynote feature of Rhus Tox is a clean, red, triangular patch at the tip of an otherwise coated tongue."
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
    specialty: "Rheumatic & Dermatological Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Rhus Tox", "Remedy", "Stiffness", "Worse Initial Motion", "Vesicles"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/rhus-toxicodendron",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, urushiol allergen safety warnings, and classical citations"],
  clinicalPearl: "Rhus Tox is indicated in joint stiffness worse on starting to move and better with continued motion, accompanied by physical restlessness and red-tipped tongue.",
  quickFacts: {
    "Latin Name": "Toxicodendron radicans",
    "Common Name": "Poison Ivy",
    "Source Kingdom": "Vegetable (Anacardiaceae family)",
    "Thermal State": "Chilly (Relieved by hot heat)"
  },
  aiReadiness: {
    retrievalSummary: "Rhus toxicodendron is a major classical homeopathic polychrest indicated for fibrous tissue inflammation, sprains, joint stiffness worse on initial motion, vesicular skin eruptions, and restlessness.",
    clinicalSummary: "Botanical source contains urushiol. Homeopathic potentized dilutions are safe and non-toxic. Primary clinical affinities are tendons, ligaments, periosteum, joints, and skin.",
    patientSummary: "Rhus toxicodendron is a homeopathic remedy widely used for joint stiffness that improves after walking around, muscle sprains, sciatica, and itchy blister-like rashes.",
    studentSummary: "Guiding keynotes include stiffness worse on initial motion, relief from continued motion and heat, restlessness, red triangular tongue tip, and vesicles.",
    keywords: ["rhus tox", "poison ivy", "joint stiffness", "rusty gate modality", "herpes zoster"],
    semanticKeywords: ["fibrous tissue polychrest", "ligament sprain remedy", "rheumatic stiffness remedy"],
    bodySystem: "Musculoskeletal & Integumentary",
    urgency: "routine"
  }
};
