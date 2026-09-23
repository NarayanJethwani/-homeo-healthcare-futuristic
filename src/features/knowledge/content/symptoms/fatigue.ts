import { KnowledgeEntity } from "../../types";

export const FatigueSymptom: KnowledgeEntity = {
  id: "S0013",
  slug: "fatigue",
  entityType: "symptom",
  editorialStatus: "published",
  legacyVerificationStatus: "verified-published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T00:00:00Z",
    reviewed: "2026-09-23T00:00:00Z",
  },
  title: {
    en: "Fatigue: Why You May Feel Tired and When to Seek Help",
    hi: "थकान: आप क्यों थका हुआ महसूस कर सकते हैं और कब मदद लें",
    gu: "થાક: શા માટે થાક લાગે અને ક્યારે મદદ લેવી",
    mr: "थकवा: थकवा का जाणवतो आणि कधी मदत घ्यावी",
    es: "Fatiga: Por Qué Puede Sentirse Cansado y Cuándo Buscar Ayuda",
    ar: "الإرهاق: لماذا قد تشعر بالتعب ومتى تطلب المساعدة",
  },
  summary: {
    en: "Fatigue is more than an occasional sleepy day: it is a low-energy feeling that can affect daily life. Sleep, stress, recovery from illness, medicines, mood, and health conditions can all contribute. Persistent or worsening fatigue deserves a proper conversation with a clinician.",
    hi: "थकान केवल कभी-कभार नींद आने जैसा नहीं है; यह कम ऊर्जा की भावना है जो रोज़मर्रा की ज़िंदगी को प्रभावित कर सकती है।",
    gu: "થાક માત્ર ક્યારેક ઊંઘ આવવા જેવો નથી; તે ઓછી ઊર્જાની લાગણી છે જે રોજિંદા જીવનને અસર કરી શકે છે.",
    mr: "थकवा म्हणजे फक्त अधूनमधून झोप येणे नव्हे; कमी ऊर्जेची भावना दैनंदिन जीवनावर परिणाम करू शकते.",
    es: "La fatiga es más que un día ocasional de sueño: es una sensación de poca energía que puede afectar la vida diaria.",
    ar: "الإرهاق أكثر من مجرد يوم نعاس عابر؛ إنه شعور بانخفاض الطاقة يمكن أن يؤثر في الحياة اليومية.",
  },
  content: {
    definition:
      "Fatigue is a feeling of low energy, weariness, or exhaustion that can make usual activities feel harder. It is different from simply being sleepy: sleepiness is the urge to sleep, while fatigue is a sense that your physical or mental energy is running low.",
    clinicalMeaning:
      "Fatigue is a symptom, not a diagnosis. It can follow poor sleep, stress, a busy period, infection, pain, medicines, or an ongoing health condition. If it lasts for weeks, is getting worse, or changes what you can normally do, a clinician can help look for the cause rather than treating it as something you should simply push through.",
    commonCauses: [
      "Not getting enough restorative sleep, insomnia, or a sleep problem such as sleep apnoea",
      "Stress, low mood, anxiety, grief, or the demands of caring, work, or a major life change",
      "Recovery from an infection, persistent pain, or a long-term condition",
      "Anaemia or low iron, thyroid conditions, diabetes, heart, lung, liver, or kidney conditions",
      "Some medicines, alcohol or other substances, and changes in daily routine, food, or activity",
    ],
    differentialDiagnosis:
      "A clinician considers the pattern of fatigue alongside sleep, mood, pain, infection, medicines, nutrition, menstrual or pregnancy history where relevant, and other symptoms. Tests are not always needed, but blood tests or another assessment may be appropriate when the history or examination suggests anaemia, diabetes, thyroid disease, inflammation, infection, or another cause.",
    redFlags: [
      "Fatigue with chest pain or pressure, severe shortness of breath, fainting, a new irregular heartbeat, or a blue/grey colour around the lips: seek emergency care",
      "New confusion, a seizure, trouble speaking, a new one-sided weakness, or a sudden major change in vision: seek emergency care",
      "Very little urine, repeated vomiting, severe dehydration, or rapidly worsening weakness",
      "Thoughts of harming yourself or feeling unable to keep yourself safe: contact local emergency services or a crisis service now",
      "Unexplained weight loss, persistent fever, drenching night sweats, bleeding, a new lump, or fatigue that persists for several weeks or is worsening: arrange prompt clinical advice",
    ],
    lifestyleAdvice:
      "Start with basics that fit your situation: regular meals and fluids, a consistent sleep routine, daylight and gentle movement if it feels safe, and small pauses before you are exhausted. A brief record of sleep, energy, mood, symptoms, medicines, and what makes fatigue better or worse can make a clinical appointment more useful. If activity predictably causes a delayed or disproportionate worsening, do not force yourself through it—discuss pacing and assessment with a clinician.",
    references: ["CIT-0121", "CIT-0122", "CIT-0023"],
    claimCitations: [
      {
        claimId: "S0013-DEFINITION-AND-CAUSES",
        passage: "definition; clinicalMeaning; commonCauses",
        citationIds: ["CIT-0121", "CIT-0122"],
      },
      {
        claimId: "S0013-CARE-SEEKING",
        passage: "redFlags; differentialDiagnosis",
        citationIds: ["CIT-0121", "CIT-0122"],
      },
      {
        claimId: "S0013-HOMEOPATHY-BOUNDARY",
        passage: "FAQ: homeopathy and fatigue",
        citationIds: ["CIT-0023"],
      },
    ],
    faqs: [
      {
        question: "When should I see a doctor about fatigue?",
        answer:
          "Arrange an appointment if fatigue has lasted a few weeks, is worsening, affects work or usual activities, or comes with symptoms such as weight loss, fever, mood changes, heavy snoring or gasping during sleep, palpitations, breathlessness, or pale skin. Seek emergency care for chest pain, severe breathlessness, fainting, confusion, a new one-sided weakness, or if you feel unsafe.",
      },
      {
        question: "Can poor sleep cause fatigue even if I spend enough time in bed?",
        answer:
          "Yes. Sleep can be disrupted by insomnia, pain, stress, alcohol, medicines, a breathing problem during sleep, or an inconsistent routine. A clinician can help explore this when tiredness is persistent, especially if there is loud snoring, gasping, or frequent waking.",
      },
      {
        question: "Could low iron or thyroid problems be the reason?",
        answer:
          "They can be possible contributors, but fatigue has many causes and symptoms alone cannot confirm one. Your clinician may consider blood tests based on your history, examination, menstrual or dietary history, medicines, and other symptoms. Avoid starting high-dose iron or thyroid products without advice.",
      },
      {
        question: "Should I push through exercise when I feel exhausted?",
        answer:
          "Not necessarily. Gentle activity can support wellbeing for some people, but forcing activity through marked symptoms or a delayed crash can be unhelpful. Match activity to how you feel, rest when needed, and seek assessment when fatigue is persistent or limits everyday life.",
      },
      {
        question: "Can homeopathy treat fatigue?",
        answer:
          "Reliable clinical evidence has not established homeopathy as a treatment for persistent fatigue or its underlying causes. It should not replace assessment for anaemia, thyroid disease, sleep problems, depression, infection, heart or lung symptoms, or any urgent warning sign.",
      },
    ],
  },
  author: { name: "Homeo Healthcare Editorial Team", credentials: "Patient Education" },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Governance",
    institution: "Homeo Healthcare",
  },
  reviewerRole: "Program-owner final authorization",
  lastClinicalReview: "2026-09-23",
  nextClinicalReview: "2027-09-23",
  referencesUpdated: "2026-09-23",
  clinicalChangesSinceLastRevision:
    "Rewrote the topic in plain language; added practical care-seeking boundaries, cause-based context, question-led FAQs, and an explicit evidence boundary for homeopathy.",
  reviewStatus: "owner-authorized-source-bound",
  citationHealth: "complete",
  contentCompleteness: 100,
  graphCompleteness: 100,
  evidenceLevel: "Consensus-Guidance",
  evidenceProfile: {
    evidenceStrength: "moderate",
    sourceQuality: "authoritative",
    classicalSource: false,
    modernSource: true,
    clinicalConfidence: 0.9,
    editorialConfidence: 0.95,
    citationCompleteness: 1,
    lastReviewedAt: "2026-09-23",
    reviewIntervalDays: 365,
    nextReviewDueAt: "2027-09-23",
    reviewExpiryPolicy: "flag-only",
    rationale: "Patient-facing cause, self-care, and care-seeking guidance is mapped to current NIH and NHS public clinical information.",
    methodologyVersion: "knowledge-authority-led-v1",
  },
  tags: ["Fatigue", "Tiredness", "Low Energy", "Exhaustion", "Sleep", "Anaemia", "Thyroid"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/fatigue",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Fatigue symptom profile.",
    "1.2.0: Added patient-first explanation, safer activity framing, care-seeking guidance, source-bound FAQs, and visual guide.",
  ],
  clinicalPearl:
    "Fatigue is common, but it is not something a person has to simply endure—its timing, triggers, sleep pattern, and companion symptoms help guide the next step.",
  quickFacts: {
    "What it feels like": "Low energy or exhaustion that makes usual tasks harder",
    "Common contributors": "Sleep, stress, recovery from illness, medicines, and health conditions",
    "First useful step": "Notice the pattern and protect rest, food, fluids, and sleep",
    "Get advice": "If it lasts for weeks, worsens, limits daily life, or comes with concerning symptoms",
  },
  aiReadiness: {
    retrievalSummary:
      "Fatigue is a feeling of low energy or exhaustion that can be caused by sleep problems, stress, illness recovery, medicines, mood, or health conditions. Persistent, worsening, or function-limiting fatigue needs clinical assessment.",
    clinicalSummary:
      "Assess duration, severity, functional effect, sleep quality, snoring, medication and substance use, mood, pain, infection, diet, bleeding, cardiopulmonary and neurologic symptoms, and warning signs. Target tests to history and examination rather than assuming a single cause.",
    patientSummary:
      "Feeling tired is common, but fatigue that lasts, worsens, or changes daily life is worth discussing with a clinician. Seek urgent help for chest pain, severe breathing trouble, fainting, confusion, new weakness, or if you feel unsafe.",
    studentSummary:
      "Fatigue is a nonspecific symptom with sleep, psychiatric, medication, infectious, endocrine, haematologic, cardiopulmonary, renal, hepatic, and inflammatory differentials. Evaluate red flags and function before targeted investigations.",
    keywords: ["fatigue", "tiredness", "low energy", "exhaustion", "always tired", "weakness"],
    semanticKeywords: ["persistent fatigue", "sleep quality", "anaemia fatigue", "thyroid fatigue", "fatigue red flags"],
    icd: "R53.83",
    bodySystem: "General Health",
    urgency: "monitor",
  },
  qualityScore: {
    editorialQuality: 96,
    clinicalDepth: 90,
    graphConnectivity: 90,
    citationQuality: 100,
    educationalValue: 96,
    aiReadiness: 96,
    seoReadiness: 95,
  },
};
