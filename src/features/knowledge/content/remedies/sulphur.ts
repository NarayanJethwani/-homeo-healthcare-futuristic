import { KnowledgeEntity } from "../../types";

export const SulphurRemedy: KnowledgeEntity = {
  id: "R0001",
  slug: "sulphur",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-30T12:00:00Z",
    reviewed: "2026-07-30T12:00:00Z",
  },
  title: {
    en: "Sulphur (Sublimed Sulphur)",
    hi: "सल्फर (सब्लाइम्ड गंधक)",
    gu: "સલ્ફર (શુદ્ધ ગંધક)",
    mr: "सल्फर (शुद्ध गंधक)",
    es: "Sulphur (Azufre Sublimado)",
    ar: "الكبريت (Sulphur)",
  },
  summary: {
    en: "A primary mineral remedy in classical homeopathy, traditionally referred to as the 'king of chronic remedies' with a strong historical affinity for dermatological keynotes and metabolic reactivity.",
    hi: "होम्योपैथी में एक प्रमुख खनिज दवा, जिसे पारंपरिक रूप से पुरानी बीमारियों का राजा माना जाता है, विशेष रूप से त्वचा रोगों में उपयोगी है.",
    gu: "હોમિયોપેથીમાં એક મુખ્ય ખનિજ દવા જેને ક્રોનિક રોગોના રાજા કહેવાય છે, ચામડીના દર્દોમાં ખૂબ જ ગુણકારી છે.",
    mr: "होम्योपैथीमधील एक प्रमुख खनिज औषध ज्याला जुनाट आजारांचा राजा म्हटले जाते, विशेषतः त्वचेच्या आजारात प्रभावी आहे.",
    es: "Un remedio mineral primario en homeopatía, tradicionalmente conocido como el 'rey de los remedios crónicos'.",
    ar: "علاج معدني رئيسي في المعالجة المثلية، يُشار إليه تقليديًا باسم ملك الأدوية المزمنة.",
  },
  content: {
    latinName: "Sulphur",
    commonName: "Sublimed Sulphur / Brimstone",
    source: "Elemental sulfur purified and prepared according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Sulphur is a fundamental polychrest in classical homeopathy, traditionally described by Samuel Hahnemann and James Tyler Kent for constitutional profiles featuring thermal heat, skin eruptions with intense itching, burning sensations in palms and soles, and morning diarrhea.",
    keynotes: [
      "Burning sensations in vertex, soles of feet, and palms",
      "Skin eruptions with intense itching, severely aggravated by warmth of bed and washing",
      "Thermal state: hot-blooded, seeking cool open air and kicking off covers at night",
      "Morning diarrhea driving the patient out of bed at 5 AM",
      "Standing is the most uncomfortable posture; tendency to stoop",
    ],
    mentalSymptoms: [
      "Philosophical, highly intellectual or daydreaming dispositions; 'ragged philosopher'",
      "Irritability, selfishness, and aversion to physical effort or routine tasks",
      "Sensitivity to odors; elevated anxiety regarding health or skin appearances",
    ],
    physicalSymptoms: [
      "Localized burning, stitching, or throbbing sensations in mucosal linings and skin",
      "Cutaneous eruptions (eczema, psoriasis, acne) with burning after scratching",
      "Venous congestion, hemorrhoids, and redness of orifices (lips, eyelids, anus)",
    ],
    generalities:
      "Sulphur patients display marked thermal reactivity, typically feeling hot-blooded and desiring open cool air. Modalities are strongly influenced by washing, standing, and warmth of bed.",
    modalitiesBetter: [
      "Warm dry weather",
      "Open cool air",
      "Lying on right side",
      "Gentle motion",
    ],
    modalitiesWorse: [
      "Washing or bathing with water",
      "Warmth of bed at night",
      "Standing posture",
      "5 AM in the morning",
      "Periodic winter recurrence",
    ],
    clinicalUses: [
      "Traditional constitutional support for chronic eczema and itchy dermatoses",
      "Historical anti-psoric application for relapse tendencies and sluggish organ reactivity",
    ],
    organAffinity: [
      "Dermatological system and cutaneous microvasculature",
      "Venous capillary system and portal circulation",
      "Gastrointestinal tract and mucosal orifices",
    ],
    miasmaticAffinity: ["Psora", "Sycosis"],
    constitution:
      "Suited to stoop-shouldered, hot-blooded individuals who are intellectually inclined but physically averse to exertion, with dirty or unwashed skin appearances in classical literature.",
    potencies: ["6C", "30C", "200C", "1M"],
    safetyNotes:
      "Historical homeopathic descriptions reflect traditional materia medica concepts. Homeopathic remedies do not replace conventional medical evaluation or evidence-based treatments for serious dermatological, infectious, or systemic medical conditions.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007", "CIT-0023", "CIT-0024"],
    faqs: [
      {
        question: "Why does Sulphur itching worsen with warmth of bed?",
        "answer":
          "In classical homeopathic theory, warmth increases peripheral cutaneous capillary vasodilation, heightening local nerve sensitivity and triggering the characteristic burning itch.",
      },
      {
        question: "What is the distinction between traditional homeopathic Sulphur and crude elemental sulfur?",
        "answer":
          "Homeopathic Sulphur is serial diluted and succussed according to pharmacopoeial standards. It is used as a sub-molecular micro-potency under homeopathic theory, whereas crude sulfur has distinct chemical and dermatological pharmacological uses.",
      },
      {
        question: "Can homeopathic Sulphur replace medical care for bacterial skin infections or eczema?",
        "answer":
          "No. Serious skin conditions, bacterial superinfections (such as staphylococcal or streptococcal cellulitis), and severe eczema require conventional medical assessment and evidence-based dermatological care.",
      },
    ],
  },
  claimCitations: [
    {
      claimId: "R0001-KEYNOTES",
      statement:
        "Classical materia medica identifies Sulphur keynotes as burning soles, vertex heat, intense itching aggravated by warmth of bed, and 5 AM morning diarrhea.",
      citationIds: ["CIT-0004", "CIT-0006"],
      passageId: "CIT-0004-SULPHUR-KEYNOTES",
    },
    {
      claimId: "R0001-MODALITIES",
      statement:
        "Sulphur modalities feature marked aggravation from bathing, standing, and bed warmth, with amelioration in open cool air.",
      citationIds: ["CIT-0005", "CIT-0007"],
      passageId: "CIT-0005-SULPHUR-MODALITIES",
    },
    {
      claimId: "R0001-TRADITIONAL-USE",
      statement:
        "Samuel Hahnemann designated Sulphur as the primary anti-psoric polychrest for chronic systemic reactivity.",
      citationIds: ["CIT-0004", "CIT-0005"],
      passageId: "CIT-0004-ORGANON-PSORA",
    },
    {
      claimId: "R0001-SAFETY-LIMITATIONS",
      statement:
        "FDA and NCCIH guidelines emphasize that homeopathic product labeling must not claim to treat serious infections or replace proven medical therapy.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-FDA-SAFETY",
    },
    {
      claimId: "R0001-HOMEOPATHY-LIMITS",
      statement:
        "Homeopathic Sulphur must not replace conventional medical evaluation or evidence-based treatments for acute bacterial cellulitis, sepsis, or systemic erythrodermic states.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0023-NCCIH-SAFETY",
    },
  ],
  redFlags: [
    "Homeopathic Sulphur must not be used as a substitute for emergency medical care in severe bacterial skin infections, sepsis, anaphylaxis, or systemic erythrodermic states.",
    "Patients presenting with rapidly spreading erythema, high fever, bullae, or skin sloughing require immediate emergency medical evaluation.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Constitutional Prescribing & Homeopathic Research",
    institution: "Homeo Healthcare Clinic",
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Sulphur", "Remedy", "Skin Eczema", "Hot-Blooded", "Polychrest"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sulphur",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Sulphur remedy profile",
    "1.1.0: Upgraded with passage-level claim citations, safety boundaries, and traditional vs modern evidence distinctions",
  ],
  clinicalPearl:
    "Sulphur is classically recognized as the 'king of remedies' for skin affections, exhibiting burning sensations, intense itching aggravated by warmth of bed, and a dislike for bathing.",
  quickFacts: {
    "Latin Name": "Sulphur",
    "Common Name": "Brimstone / Sublimed Sulphur",
    "Source Kingdom": "Mineral (Elemental Sulphur)",
    "Thermal State": "Extremely Hot-blooded (Desires open, cool air)",
  },
  aiReadiness: {
    retrievalSummary:
      "Sulphur is a major constitutional polychrest and anti-psoric remedy in classical homeopathy, prepared from sublimed sulfur, primarily indicated for skin eruptions, thermal heat, and metabolic reactivity.",
    clinicalSummary:
      "Sulfur acts dynamically on skin surfaces, microvasculature, and mucous membranes. In classical literature, it is described as inducing capillary engorgement and cutaneous elimination.",
    patientSummary:
      "Sulphur is a fundamental homeopathic remedy prepared from sulfur, traditionally used for itchy skin conditions, eczema, hot flashes, and sluggish digestion.",
    studentSummary:
      "Guiding symptoms include burning sensations in soles, palms, and vertex; aggravation from heat and water; a tendency to stand rather than sit; and 5 AM morning diarrhea.",
    keywords: ["sulphur", "sulfur", "hot remedy", "skin eczema", "burning soles", "anti-psoric"],
    semanticKeywords: ["dermatological polychrest", "anti-psoric king", "venous capillary remedy"],
    bodySystem: "Dermatology",
    urgency: "routine",
  },
};
