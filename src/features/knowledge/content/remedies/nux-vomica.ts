import { KnowledgeEntity } from "../../types";

export const NuxVomicaRemedy: KnowledgeEntity = {
  id: "R0002",
  slug: "nux-vomica",
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
    en: "Nux Vomica (Poison Nut)",
    hi: "नक्स वोमिका (कुचला बीज)",
    gu: "નક્સ વોમિકા (ઝેરકોચલું)",
    mr: "नक्स व्होमिका (कुचला बीज)",
    es: "Nux Vomica (Nuez Vómica)",
    ar: "نوكس فوميكا (Nux Vomica)",
  },
  summary: {
    en: "A primary plant polychrest in classical homeopathy, prepared from seeds of Strychnos nux-vomica, traditionally indicated for digestive dysmotility, nervous hypersensitivity, and over-stimulation.",
    hi: "होम्योपैथी में एक प्रमुख वनस्पति दवा, जो पाचन संबंधी विकारों, कब्ज, और मानसिक तनाव के लिए अत्यंत प्रसिद्ध है.",
    gu: "હોમિયોપેથીમાં એક મુખ્ય વનસ્પતિ દવા, જે પાચનની તકલીફો અને માનસિક તણાવ માટે ખૂબ જાણીતી છે.",
    mr: "पचनाच्या तक्रारी आणि मानसिक ताण यावर अत्यंत गुणकारी असलेले वनस्पतीजन्य औषध.",
    es: "Un remedio vegetal primario en homeopatía, preparado a partir de semillas de Strychnos nux-vomica.",
    ar: "علاج نباتي رئيسي في المعالجة المثلية، يُحضر من بذور شجرة القيء.",
  },
  content: {
    latinName: "Strychnos nux-vomica",
    commonName: "Poison Nut / Nux Vomica",
    source: "Dried ripe seeds of Strychnos nux-vomica prepared according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Nux Vomica is a fundamental polychrest in classical homeopathy, traditionally described for nervous, irritable, sedentary individuals suffering from gastrointestinal dysmotility, acid reflux, constipation with ineffectual urging, and sensitivity to sensory stimuli.",
    keynotes: [
      "Ineffectual urging for stool ('passes small quantity, leaves feeling of un-cleared bowel')",
      "Hypersensitivity to external stimuli: noise, light, odors, drafts, and touch",
      "Thermal state: extremely chilly, sensitive to cold drafts and uncovering",
      "Morning aggravation: wakes early (3 AM), falls into un-refreshing sleep at dawn, wakes irritable",
      "Digestive distress after dietary over-indulgence, stimulants, coffee, or alcohol",
    ],
    mentalSymptoms: [
      "Irritable, fiery temperament; impatient, ambitious, and easily offended",
      "Mental strain from sedentary office work, business anxieties, and late-night studying",
      "Over-sensitivity to criticism or contradiction; intolerance of noise and light",
    ],
    physicalSymptoms: [
      "Spasmodic gastrointestinal contractions, epigastric pressure, and acid eructations",
      "Constipation with frequent, unsuccessful desire for stool",
      "Chills on moving or uncovering; backache requiring sitting up to turn in bed",
    ],
    generalities:
      "Nux Vomica patients display extreme chilliness and nervous hyper-reflexia. Symptoms are strongly aggravated in the early morning, by cold dry air, and after over-indulgence in coffee, alcohol, or rich food.",
    modalitiesBetter: [
      "Warmth and wrapping up head/body",
      "Restful quiet environment",
      "Lying on side",
      "Damp warm air",
    ],
    modalitiesWorse: [
      "Early morning (3 AM - 4 AM)",
      "Cold dry air and drafts",
      "Uncovering even a hand or foot",
      "Mental exertion and dietary stimulants",
      "Touch and noise",
    ],
    clinicalUses: [
      "Traditional constitutional support for functional dyspepsia and spastic constipation",
      "Historical application for nervous irritability, hangover recovery, and stimulant overuse",
    ],
    organAffinity: [
      "Cerebrospinal nervous system and spinal reflex arcs",
      "Gastrointestinal tract (stomach, colon, liver)",
      "Autonomic neuromuscular junctions",
    ],
    miasmaticAffinity: ["Psora", "Sycosis"],
    constitution:
      "Suited to thin, quick-tempered, ambitious, sedentary individuals who consume excessive stimulants (caffeine, alcohol, spices) and suffer from stress-induced digestive spasms.",
    potencies: ["6C", "30C", "200C", "1M"],
    safetyNotes:
      "CRUDE Strychnos nux-vomica seeds contain poisonous alkaloids (strychnine and brucine). Homeopathic preparations use high potencies diluted beyond toxicological risk according to pharmacopoeial standards. Un-diluted crude plant material is toxic and strictly prohibited. Homeopathic preparations do not replace emergency medical care for acute gastrointestinal obstruction, organ pathology, or acute toxicities.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007", "CIT-0023", "CIT-0024"],
    faqs: [
      {
        question: "What is 'ineffectual urging' in Nux Vomica digestive profiles?",
        "answer":
          "In classical homeopathy, ineffectual urging refers to frequent, unsatisfactory attempts to evacuate the bowel or bladder due to irregular uncoordinated peristaltic spasms.",
      },
      {
        question: "Does homeopathic Nux Vomica contain toxic strychnine?",
        "answer":
          "Homeopathic Nux Vomica is prepared via serial micro-dilution and succussion under official pharmacopoeia rules. Potencies like 6C, 30C, and 200C contain micro-diluted quantities far below toxicological thresholds. Crude Strychnos nux-vomica seeds are highly toxic and must never be ingested.",
      },
      {
        question: "Can Nux Vomica replace emergency medical care for acute bowel obstruction or severe gastritis?",
        "answer":
          "No. Acute intestinal obstruction, severe gastrointestinal bleeding, acute abdomen, or organ pathology require immediate emergency surgical or medical evaluation.",
      },
    ],
  },
  claimCitations: [
    {
      claimId: "R0002-KEYNOTES",
      statement:
        "Classical materia medica identifies Nux Vomica keynotes as ineffectual urging for stool, extreme chilliness, morning 3 AM waking, and hypersensitivity to sensory stimuli.",
      citationIds: ["CIT-0004", "CIT-0006"],
      passageId: "CIT-0004-NUX-VOMICA-KEYNOTES",
    },
    {
      claimId: "R0002-MODALITIES",
      statement:
        "Nux Vomica modalities feature marked aggravation from cold drafts, early morning, and stimulants, with amelioration from warmth and quiet rest.",
      citationIds: ["CIT-0005", "CIT-0007"],
      passageId: "CIT-0005-NUX-VOMICA-MODALITIES",
    },
    {
      claimId: "R0002-TRADITIONAL-USE",
      statement:
        "Samuel Hahnemann designated Nux Vomica as a primary remedy for ailments arising from sedentary lifestyle, mental overwork, and toxic over-stimulation.",
      citationIds: ["CIT-0004", "CIT-0005"],
      passageId: "CIT-0004-ORGANON-STIMULANTS",
    },
    {
      claimId: "R0002-SAFETY-LIMITATIONS",
      statement:
        "FDA and NCCIH guidelines emphasize that crude Strychnos nux-vomica is toxic due to strychnine content, while diluted homeopathic preparations must adhere to strict pharmacopoeial manufacturing standards.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-FDA-ALKALOID-SAFETY",
    },
    {
      claimId: "R0002-HOMEOPATHY-LIMITS",
      statement:
        "Homeopathic Nux Vomica must not replace emergency evaluation or surgical intervention for acute intestinal obstruction, gastrointestinal perforation, or severe internal hemorrhage.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0023-NCCIH-EMERGENCY-LIMITS",
    },
  ],
  redFlags: [
    "Homeopathic Nux Vomica must not be used as a substitute for emergency medical or surgical care in acute bowel obstruction, gastrointestinal hemorrhage, acute pancreatitis, or severe poisoning.",
    "Crude un-diluted Strychnos nux-vomica seeds are highly toxic due to strychnine content and must never be ingested.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Gastroenterology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic",
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Nux Vomica", "Remedy", "Digestive Reflux", "IBS", "Chilly", "Polychrest"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/nux-vomica",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Nux Vomica remedy profile",
    "1.1.0: Upgraded with passage-level claim citations, strychnine toxicity warnings, safety boundaries, and traditional vs modern evidence distinctions",
  ],
  clinicalPearl:
    "Classical Materia Medica characterizes Nux Vomica as highly suited to patients showing hypersensitivity to all stimuli—noise, light, and smells—coupled with an ineffectual urge for stool.",
  quickFacts: {
    "Latin Name": "Strychnos nux-vomica",
    "Common Name": "Poison Nut",
    "Source Kingdom": "Vegetable (Loganiaceae family)",
    "Thermal State": "Chilly (Aggravated by dry cold)",
  },
  aiReadiness: {
    retrievalSummary:
      "Nux Vomica is a primary polychrest remedy in classical homeopathy, prepared from Strychnos nux-vomica, indicated for nervous system hypersensitivity, digestive dysmotility, and morning irritability.",
    clinicalSummary:
      "Prepared from strychnine-containing seeds under homeopathic pharmacopoeia standards. Clinical indications focus on cerebrospinal hyper-reflexia, spasmodic gut contractions, and digestive hyperacidity.",
    patientSummary:
      "Nux Vomica is a traditional homeopathic remedy prepared from the poison nut, commonly used for digestive issues, irritability, and stress-related indigestion.",
    studentSummary:
      "Key keynote symptoms include morning irritability, extreme chilliness, hypersensitivity to external stimuli, and ineffectual urges ('inability to satisfy the urge') for stool.",
    keywords: ["nux vomica", "poison nut", "chilly remedy", "gastric spasm", "hypersensitivity"],
    semanticKeywords: ["gastrointestinal regulator", "nervous system polychrest", "portal congestion remedy"],
    bodySystem: "Gastrointestinal",
    urgency: "routine",
  },
};
