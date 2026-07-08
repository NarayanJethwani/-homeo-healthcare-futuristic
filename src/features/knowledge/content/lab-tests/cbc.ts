import { KnowledgeEntity } from "../../types";

export const CbcLabTest: KnowledgeEntity = {
  id: "L0001",
  slug: "cbc",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Complete Blood Count (CBC)",
    hi: "कम्पलीट ब्लड काउंट (सीबीसी)",
    gu: "લોહીની સંપૂર્ણ તપાસ (CBC)",
    mr: "पूर्ण रक्त तपासणी (CBC)",
    es: "Conteo Sanguíneo Completo (CSC)",
    ar: "صورة الدم الكاملة (CBC)"
  },
  summary: {
    en: "A standard screening blood test evaluating red cells, white cells, platelets, and hemoglobin to assess overall health and spot anemia or infection.",
    hi: "रक्त की एक सामान्य जांच जो लाल कोशिकाओं, सफेद कोशिकाओं, प्लेटलेट्स और हीमोग्लोबिन का मूल्यांकन करती है, एनीमिया या संक्रमण को पकड़ने के लिए.",
    gu: "લોહીની સામાન્ય તપાસ જે રક્તકણો, શ્વેતકણો, પ્લેટલેટ્સ અને હિમોગ્લોબિનનું પ્રમાણ માપે છે, એનિમિયા કે ચેપ જાણવા માટે.",
    mr: "रक्ताची एक मूलभूत तपासणी ज्यामध्ये तांबड्या पेशी, पांढऱ्या पेशी, प्लेटलेट्स आणि हिमोग्लोबिन मोजले जाते.",
    es: "Un análisis de sangre estándar para evaluar las células rojas, blancas y plaquetas.",
    ar: "فحص دم قياسي يقيم خلايا الدم الحمراء والبيضاء والصفائح الدموية والهيموجلوبين."
  },
  content: {
  "overview": "CBC: A blood panel parameter or cell count analysis designed to evaluate red cell mass, immune defense lines, and coagulation potential.",
  "normalRange": "Hemoglobin: 12.0-17.5 g/dL; Hematocrit: 36-50%; WBC Count: 4,000-11,000 /mcL; Platelet Count: 150,000-450,000 /mcL.",
  "highValues": [
    "Erythrocytosis or dehydration (high RBC/Hgb)",
    "Leukocytosis indicating active infection or inflammation (high WBC)",
    "Thrombocytosis from inflammatory or marrow states (high platelets)"
  ],
  "lowValues": [
    "Anemia from nutritional or blood loss causes (low Hgb/RBC)",
    "Leukopenia suggesting viral or autoimmune suppression (low WBC)",
    "Thrombocytopenia posing bleeding risks (low platelets)"
  ],
  "clinicalInterpretation": "CBC evaluation: Red cell and hemoglobin drops suggest anemia, necessitating iron, B12, or folate evaluation. WBC spikes indicate infection or severe inflammation, while platelet drops warn of bleeding risks.",
  "references": [
    "CIT-0015",
    "CIT-0016",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "How often should a Complete Blood Count (CBC) be monitored?",
      "answer": "For healthy individuals, an annual check is standard. Patients with anemia, active infections, or ongoing hematological treatment may require frequent monitoring as directed by a clinician."
    },
    {
      "question": "What is the link between iron deficiency and anemia?",
      "answer": "Iron is an essential building block for hemoglobin, the protein in red blood cells that carries oxygen. Lack of iron directly limits hemoglobin synthesis, leading to anemia."
    },
    {
      "question": "Can dietary changes alone correct low hemoglobin?",
      "answer": "Mild nutritional anemias can improve with iron-rich foods and vitamin C, but moderate-to-severe states require clinical investigation and targeted supplementation."
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
    specialty: "Hematology & Clinical Diagnostics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-A",
  tags: ["CBC", "Complete Blood Count", "Blood Test", "Hemoglobin", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/cbc",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of CBC lab test profile"],
  clinicalPearl: "Isolated microcytosis without anemia is frequently the first indicator of thalassemia minor. Ferritin levels are crucial to rule out early iron deficiency.",
  quickFacts: {
    "Specimen Type": "Whole Blood (EDTA Tube)",
    "Preparation": "No fasting required",
    "Turnaround Time": "2–4 Hours",
    "Clinical Category": "Hematology Panel"
  },
  aiReadiness: {
    retrievalSummary: "Complete Blood Count (CBC) is a standard laboratory panel that measures erythrocytes, leukocytes, thrombocytes, hemoglobin concentration, and hematocrit to screen for hematologic pathology.",
    clinicalSummary: "CBC quantifies cellular elements using automated flow cytometry and electrical impedance. Differential leukocyte counts analyze neutrophil, lymphocyte, monocyte, eosinophil, and basophil fractions.",
    patientSummary: "A CBC is a basic blood test that checks your red blood cells, white blood cells, and platelets to screen for anemia, infections, or bleeding problems.",
    studentSummary: "Parameters include MCV (mean corpuscular volume) for classification of microcytic, normocytic, and macrocytic anemia; and RDW (red cell distribution width) to assess anisocytosis.",
    keywords: ["cbc", "complete blood count", "hemoglobin", "white blood cells", "platelet count", "anemia screen"],
    semanticKeywords: ["blood panel", "cellular count", "hematological profile"],
    icd: "R71.8", // Other abnormal findings of red blood cells
    bodySystem: "Hematology",
    urgency: "routine"
  }
};
