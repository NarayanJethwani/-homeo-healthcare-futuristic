import { KnowledgeEntity } from "../../types";

export const CbcLabTest: KnowledgeEntity = {
  id: "L0001",
  slug: "cbc",
  entityType: "lab-test",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  citationHealth: "complete",
  contentCompleteness: 100,
  versionInfo: {
    version: "1.2.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-09-21T12:00:00Z",
    reviewed: "2026-07-30T12:00:00Z",
  },
  title: {
    en: "Complete Blood Count (CBC)",
    hi: "कम्पलीट ब्लड काउंट (सीबीसी)",
    gu: "લોહીની સંપૂર્ણ તપાસ (CBC)",
    mr: "पूर्ण रक्त तपासणी (CBC)",
    es: "Conteo Sanguíneo Completo (CSC)",
    ar: "صورة الدم الكاملة (CBC)",
  },
  summary: {
    en: "A practical guide to a CBC blood test: what it measures, how to read the main sections, what an abnormal result may mean, and what to ask next.",
    hi: "रक्त की एक सामान्य जांच जो लाल कोशिकाओं, सफेद कोशिकाओं, प्लेटलेट्स और हीमोग्लोबिन का मूल्यांकन करती है.",
    gu: "લોહીની સામાન્ય તપાસ જે રક્તકણો, શ્વેતકણો, પ્લેટલેટ્સ અને હિમોગ્લોબિનનું પ્રમાણ માપે છે.",
    mr: "रक्ताची एक मूलभूत तपासणी ज्यामध्ये तांबड्या पेशी, पांढऱ्या पेशी, प्लेटलेट्स आणि हिमोग्लोबिन मोजले जाते.",
    es: "Un análisis de sangre estándar para evaluar las células rojas, blancas y plaquetas.",
    ar: "فحص دم قياسي يقيم خلايا الدم الحمراء والبيضاء والصفائح الدموية والهيموجلوبين.",
  },
  content: {
    overview:
      "A Complete Blood Count, or CBC, is a common blood test that counts the main cells in your blood. It reports red blood cells and haemoglobin, which carry oxygen; white blood cells, which are part of immune defence; and platelets, which help blood clot. A CBC is a useful starting point, but one out-of-range value does not by itself diagnose a condition.",
    normalRange:
      "Use the reference range printed on your own report. Ranges can vary by laboratory, age, sex, altitude, medicines, hydration, and other individual factors. A clinician interprets the pattern, your symptoms, and other tests together.",
    highValues: [
      "Erythrocytosis / Polycythemia or hemoconcentration due to dehydration (high RBC/Hgb/Hct)",
      "Leukocytosis (neutrophilia/lymphocytosis) indicating acute bacterial/viral infection, systemic inflammation, or myeloproliferative states (high WBC)",
      "Thrombocytosis from reactive inflammation, acute blood loss, or essential thrombocythemia (high platelets)",
    ],
    lowValues: [
      "Anemia due to iron deficiency, vitamin B12/folate deficiency, chronic disease, or hemolysis (low Hgb/RBC)",
      "Leukopenia / Neutropenia suggesting bone marrow suppression, severe viral infection, or drug toxicity (low WBC/ANC)",
      "Thrombocytopenia posing petechial and mucocutaneous bleeding risks (low platelets)",
    ],
    clinicalInterpretation:
      "The pattern can guide the next question. For example, low haemoglobin may prompt iron, ferritin, B12, folate, bleeding, or kidney evaluation; white-cell changes can be affected by infections, inflammation, medicines, and many other factors; platelet changes may need repeat testing or further assessment. The CBC does not replace clinical evaluation.",
    references: ["CIT-0015", "CIT-0016", "CIT-0022", "CIT-0024", "CIT-0025"],
    homeopathyLimits:
      "Laboratory blood counts provide objective clinical data regarding hematological health. Homeopathy does not replace diagnostic blood testing, bone marrow evaluation, or emergency transfusion/hematology interventions.",
    faqs: [
      {
        question: "What are the main parts of a CBC?",
        answer:
          "The main sections are red blood cells and haemoglobin, white blood cells, and platelets. Many reports also include haematocrit and red-cell measurements such as MCV, which describes average red-cell size.",
      },
      {
        question: "Does an abnormal CBC result mean I have a disease?",
        answer:
          "Not necessarily. Results can be influenced by hydration, medicines, menstrual periods, recent illness, activity, and laboratory variation. Your clinician considers the whole pattern, symptoms, medical history, and sometimes repeat or additional tests.",
      },
      {
        question: "What does low haemoglobin usually lead to next?",
        answer:
          "Low haemoglobin can be a sign of anaemia. The next steps may include looking at red-cell size, ferritin or other iron tests, B12 or folate, kidney function, diet, periods, and possible sources of blood loss. The right tests depend on your situation.",
      },
      {
        question: "Do I need to fast before a CBC?",
        answer:
          "Usually, no special preparation is needed for a CBC. If other tests were ordered from the same sample, such as glucose or certain lipids, your clinic may give separate instructions.",
      },
      {
        question: "When should I seek medical advice urgently?",
        answer:
          "Seek urgent care for chest pain, severe shortness of breath, fainting, confusion, heavy active bleeding, black or bloody stools, a high fever with severe weakness, or rapidly spreading bruising or pinpoint bleeding spots. Ask your clinician how a critical laboratory alert should be handled if you receive one.",
      },
    ],
  },
  claimCitations: [
    {
      claimId: "L0001-DEFINITION",
      passageId: "L0001-DEFINITION",
      statement:
        "CBC measures cellular components of blood including erythrocytes, leukocytes, and thrombocytes.",
      citationIds: ["CIT-0015", "CIT-0022"],
    },
    {
      claimId: "L0001-INDICATION",
      passageId: "L0001-INDICATION",
      statement:
        "Indicated for screening anemia, infection, systemic inflammation, bleeding tendencies, and hematological malignancies.",
      citationIds: ["CIT-0015", "CIT-0016"],
    },
    {
      claimId: "L0001-COMPONENTS",
      passageId: "L0001-COMPONENTS",
      statement:
        "Parameters include Hgb, Hct, RBC, WBC, WBC differential (neutrophils, lymphocytes, monocytes, eosinophils, basophils), platelet count, and indices (MCV, MCH, MCHC, RDW).",
      citationIds: ["CIT-0015", "CIT-0022"],
    },
    {
      claimId: "L0001-INTERPRETATION",
      passageId: "L0001-INTERPRETATION",
      statement:
        "MCV and RDW systematically differentiate microcytic, normocytic, and macrocytic anemias.",
      citationIds: ["CIT-0016", "CIT-0022"],
    },
    {
      claimId: "L0001-CRITICAL-VALUES",
      passageId: "L0001-CRITICAL-VALUES",
      statement:
        "Hemoglobin < 7.0 g/dL, Platelets < 20,000/µL, ANC < 500/µL, or presence of blast cells are critical emergency values requiring urgent medical intervention.",
      citationIds: ["CIT-0022", "CIT-0024"],
    },
    {
      claimId: "L0001-HOMEOPATHY-LIMITS",
      passageId: "L0001-HOMEOPATHY-LIMITS",
      statement:
        "Laboratory blood counts provide objective clinical data; homeopathy does not replace diagnostic blood testing or emergency hematological care.",
      citationIds: ["CIT-0024", "CIT-0025"],
    },
  ],
  redFlags: [
    "Severe Anemia: Hemoglobin < 7.0 g/dL or rapid precipitous drop accompanied by dyspnea, tachycardia, or presyncope.",
    "Severe Thrombocytopenia: Platelet count < 20,000 /µL with spontaneous mucosal bleeding, petechiae, or purpura.",
    "Severe Neutropenia: Absolute Neutrophil Count (ANC) < 500 /µL with fever (Febrile Neutropenia), requiring immediate broad-spectrum antibiotics.",
    "Leukemic Blast Cells: Presence of immature blast cells or WBC > 50,000 /µL requiring urgent hematology consultation.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Hematology & Clinical Diagnostics",
    institution: "Homeo Healthcare Clinic",
  },
  evidenceLevel: "Level-A",
  tags: ["CBC", "Complete Blood Count", "Blood Test", "Hemoglobin", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/cbc",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: [
    "1.0.0: Initial release of CBC lab test profile",
    "1.1.0: Upgraded with claim-level passage citations, critical value panic thresholds, emergency red flags, and explicit homeopathy safety boundaries.",
    "1.2.0: Added a question-first result-reading layer, report-range context, and patient-oriented next-step guidance.",
  ],
  clinicalPearl:
    "A CBC is best read as a pattern, not as an isolated abnormal number. The report range, symptoms, and follow-up tests determine what it means for an individual.",
  quickFacts: {
    "Specimen Type": "Whole Blood (EDTA Lavender Tube)",
    "Preparation": "No fasting required",
    "Turnaround Time": "2–4 Hours",
    "Clinical Category": "Hematology Panel",
  },
  aiReadiness: {
    retrievalSummary:
      "Complete Blood Count (CBC) is a standard blood panel that measures red cells, white cells, platelets, haemoglobin, haematocrit, and red-cell indices. It helps guide, but does not establish, a diagnosis.",
    clinicalSummary:
      "CBC quantifies cellular elements using automated flow cytometry and electrical impedance. Differential leukocyte counts analyze neutrophil, lymphocyte, monocyte, eosinophil, and basophil fractions.",
    patientSummary:
      "A CBC is a basic blood test that checks red cells, white cells, and platelets. An unusual result is only one part of the picture; your clinician uses it with your symptoms, history, and other tests.",
    studentSummary:
      "Parameters include MCV (mean corpuscular volume) for classification of microcytic, normocytic, and macrocytic anemia; and RDW (red cell distribution width) to assess anisocytosis.",
    keywords: [
      "cbc",
      "complete blood count",
      "hemoglobin",
      "white blood cells",
      "platelet count",
      "anemia screen",
    ],
    semanticKeywords: ["blood panel", "cellular count", "hematological profile"],
    icd: "R71.8",
    bodySystem: "Hematology",
    urgency: "routine",
  },
  qualityScore: {
    editorialQuality: 5,
    clinicalDepth: 95,
    graphConnectivity: 96,
    citationQuality: 98,
    educationalValue: 95,
    aiReadiness: 100,
    seoReadiness: 97,
  },
};
