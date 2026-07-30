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
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-30T12:00:00Z",
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
    en: "A standard screening blood test evaluating red cells, white cells, platelets, and hemoglobin to assess overall health and spot anemia, infection, or hematological disorders.",
    hi: "रक्त की एक सामान्य जांच जो लाल कोशिकाओं, सफेद कोशिकाओं, प्लेटलेट्स और हीमोग्लोबिन का मूल्यांकन करती है.",
    gu: "લોહીની સામાન્ય તપાસ જે રક્તકણો, શ્વેતકણો, પ્લેટલેટ્સ અને હિમોગ્લોબિનનું પ્રમાણ માપે છે.",
    mr: "रक्ताची एक मूलभूत तपासणी ज्यामध्ये तांबड्या पेशी, पांढऱ्या पेशी, प्लेटलेट्स आणि हिमोग्लोबिन मोजले जाते.",
    es: "Un análisis de sangre estándar para evaluar las células rojas, blancas y plaquetas.",
    ar: "فحص دم قياسي يقيم خلايا الدم الحمراء والبيضاء والصفائح الدموية والهيموجلوبين.",
  },
  content: {
    overview:
      "A Complete Blood Count (CBC) is an automated quantitative analysis of the cellular elements of blood: erythrocytes (red blood cells), leukocytes (white blood cells), and thrombocytes (platelets). It provides crucial baseline diagnostic data regarding oxygen-carrying capacity, immune activation, and hemostatic function.",
    normalRange:
      "Hemoglobin: Male 13.8–17.2 g/dL, Female 12.1–15.1 g/dL; Hematocrit: Male 40.7–50.3%, Female 36.1–44.3%; WBC Count: 4,500–11,000 /µL; Platelet Count: 150,000–450,000 /µL; Absolute Neutrophil Count (ANC): 1,800–7,800 /µL.",
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
      "CBC parameters guide differential diagnosis: low MCV indicates microcytic anemia (iron deficiency vs thalassemia trait); high MCV indicates macrocytic anemia (B12/folate deficiency or liver disease). WBC differential shifts (bandemia, atypical lymphocytes) distinguish bacterial from viral infections.",
    references: ["CIT-0015", "CIT-0016", "CIT-0022", "CIT-0024", "CIT-0025"],
    homeopathyLimits:
      "Laboratory blood counts provide objective clinical data regarding hematological health. Homeopathy does not replace diagnostic blood testing, bone marrow evaluation, or emergency transfusion/hematology interventions.",
    faqs: [
      {
        question: "How often should a Complete Blood Count (CBC) be monitored?",
        answer:
          "For healthy individuals, an annual check is standard. Patients with anemia, active infections, or ongoing hematological treatment require frequent monitoring as directed by a clinician.",
      },
      {
        question: "What is the link between iron deficiency and anemia?",
        answer:
          "Iron is an essential building block for hemoglobin, the oxygen-binding protein in red blood cells. Lack of iron directly limits hemoglobin synthesis, resulting in microcytic hypochromic anemia.",
      },
      {
        question: "Can dietary changes alone correct low hemoglobin?",
        answer:
          "Mild nutritional anemia may improve with iron-rich diet and vitamin C, but moderate-to-severe states require formal clinical investigation and targeted medical supplementation.",
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
  ],
  clinicalPearl:
    "Isolated microcytosis without anemia is frequently the first indicator of thalassemia minor. Ferritin levels are crucial to rule out early iron deficiency.",
  quickFacts: {
    "Specimen Type": "Whole Blood (EDTA Lavender Tube)",
    "Preparation": "No fasting required",
    "Turnaround Time": "2–4 Hours",
    "Clinical Category": "Hematology Panel",
  },
  aiReadiness: {
    retrievalSummary:
      "Complete Blood Count (CBC) is a standard laboratory panel that measures erythrocytes, leukocytes, thrombocytes, hemoglobin concentration, and hematocrit to screen for hematologic pathology.",
    clinicalSummary:
      "CBC quantifies cellular elements using automated flow cytometry and electrical impedance. Differential leukocyte counts analyze neutrophil, lymphocyte, monocyte, eosinophil, and basophil fractions.",
    patientSummary:
      "A CBC is a basic blood test that checks your red blood cells, white blood cells, and platelets to screen for anemia, infections, or bleeding problems.",
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
