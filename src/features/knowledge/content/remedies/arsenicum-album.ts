import { KnowledgeEntity } from "../../types";

export const ArsenicumAlbumRemedy: KnowledgeEntity = {
  id: "R0006",
  slug: "arsenicum-album",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Arsenicum Album (White Oxide of Arsenic)",
    hi: "आर्सेनिकम एल्बम (Arsenicum Album)",
    gu: "આર્સેનિકમ આલ્બમ (Arsenicum Album)",
    mr: "आर्सेनिकम आल्बम (Arsenicum Album)",
    es: "Arsenicum Album (Trióxido de Arsénico)",
    ar: "أرسينيكوم ألبوم (أكسيد الأرسنيك الأبيض)",
  },
  summary: {
    en: "A major classical polychrest remedy in homeopathy, with explicit toxicological safety warnings regarding crude arsenic trioxide and FDA compliance standards.",
    hi: "होम्योपैथी की एक प्रमुख शास्त्रीय औषधि, जिसमें कच्चे आर्सेनिक ट्राइऑक्साइड की विषाक्तता चेतावनियों एवं सुरक्षा सीमाओं का स्पष्ट विवरण है।",
    gu: "હોમિયોપેથીની મહત્વપૂર્ણ ક્લાસિકલ પોલિક્રેસ્ટ દવા અને ટોક્સિકોલોજીકલ ઈમરજન્સી સુરક્ષા સીમાઓ.",
    mr: "होमिओपॅथीतील प्रमुख क्लासिकल औषध आणि विषशास्त्र सुरक्षितता मर्यादा.",
    es: "Un remedio policresto clásico importante en homeopatía con advertencias de seguridad toxicológicas explícitas.",
    ar: "علاج رئيسي متعدد الاستخدامات في الطب المثلي مع تحذيرات سلامة سمية صريحة.",
  },
  content: {
    latinName: "Arsenicum album (Arsenic trioxide, As2O3)",
    commonName: "White Oxide of Arsenic / White Arsenic",
    source:
      "Arsenic trioxide purified and potentized strictly in accordance with Homeopathic Pharmacopoeia of the United States (HPUS) serial dilution standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Arsenicum Album is one of the most prominent polychrest remedies in classical homeopathy, first proved by Samuel Hahnemann [CIT-0001]. In crude form, arsenic trioxide is a violent protoplasmic poison. In micro-diluted homeopathic potencies (6C, 30C, 200C), it is non-toxic and used based on symptom similarity.",
    keynotes: [
      "Profound weakness, rapid prostration, and exhaustion out of proportion to exertion [R0006-KEYNOTES, CIT-0002]",
      "Intense burning pains relieved by warmth or hot applications (except head pains relieved by cool air)",
      "Marked anxiety, restlessness, driving the patient from bed to bed, alongside fear of death",
      "Unquenchable thirst for small quantities of cold water at frequent intervals",
      "Modalities: Aggravation at midnight and 1:00 AM–2:00 AM; amelioration from heat and warm drinks [CIT-0002]",
    ],
    mentalSymptoms: [
      "Extreme anxiety, anguish, and fear of death or incurable illness [R0006-KEYNOTES]",
      "Restlessness: physically exhausted yet mentally driven to move constantly",
      "Fussy fastidiousness: extreme orderliness, neatness, and intolerance of disorder",
      "Fear of being alone, suspicion, and despair of recovery",
    ],
    physicalSymptoms: [
      "Gastrointestinal: acrid vomiting, burning epigastric pain, watery diarrhea with burning anus",
      "Respiratory: dyspnea worsening lying down, asthma triggered by cold weather or midnight aggravation",
      "Dermatological: dry, scaly, burning eruptions, excoriating discharges relieved by hot compresses",
      "Cardiovascular: palpitation, dyspnea on exertion, and nocturnal restlessness",
    ],
    toxicityWarning:
      "CRITICAL SAFETY WARNING: Crude, raw arsenic trioxide (As2O3) is a highly toxic metabolic poison that inhibits pyruvate dehydrogenase, causes severe hemorrhagic gastroenteritis, cardiac QT prolongation, acute renal failure, arsenicosis, and carcinogenicity [R0006-TOXICITY-WARNING, CIT-0024]. Crude un-diluted arsenic compounds must NEVER be ingested. Homeopathic preparations must adhere to HPUS micro-dilution standards (typically >= 6C / 30C) where no chemical arsenic remains.",
    emergencyRedFlags: [
      "Accidental acute ingestion of raw, crude chemical arsenic or industrial pesticides [R0006-HOMEOPATHY-LIMITS]",
      "Severe acute hemorrhagic gastroenteritis with rice-water stool, hypotension, dehydration, and circulatory shock",
      "Arsenic poisoning toxicity symptoms: garlic odor on breath, facial edema, peripheral neuropathy, Mees' lines on nails",
      "Acute cardiac arrhythmias, QT prolongation, or torsades de pointes following toxic chemical exposure",
    ],
    references: ["CIT-0001", "CIT-0002", "CIT-0024", "CIT-0023"],
    faqs: [
      {
        question: "Is homeopathic Arsenicum Album safe from chemical arsenic toxicity?",
        answer:
          "Yes, provided it is prepared according to official HPUS standards at regulated potencies (6C, 30C, or higher). At 6C potency and above, serial micro-dilution reduces chemical arsenic content below detectable toxicological thresholds, rendering it chemically non-toxic [R0006-TOXICITY-WARNING, CIT-0024].",
      },
      {
        question: "Can Arsenicum Album be used to treat acute heavy metal arsenic poisoning?",
        answer:
          "No. Acute heavy metal or pesticide arsenic poisoning is a severe toxicological emergency requiring immediate emergency room care, gastrointestinal decontamination, and chelation therapy (such as dimercaprol or succimer). Homeopathy cannot substitute for emergency chelation therapy [R0006-HOMEOPATHY-LIMITS, CIT-0023].",
      },
      {
        question: "What are the hallmark keynote modalities of Arsenicum Album?",
        answer:
          "The hallmark keynotes include intense burning pains relieved by heat, marked anxiety with physical restlessness, thirst for frequent small sips of cold water, and characteristic aggravation around midnight to 2:00 AM [CIT-0002].",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Homeopathy & Toxicology",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Classical-Homeopathic-Literature",
  tags: ["Arsenicum-Album", "Remedy", "Polychrest", "Toxicology-Safety", "FDA-Compliance"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/arsenicum-album",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Arsenicum Album profile",
    "1.1.0: Upgraded with crude arsenic trioxide toxicological safety warnings (CIT-0024), passage-level claim citations (CIT-0001, CIT-0002), and acute poisoning emergency boundaries",
  ],
};
