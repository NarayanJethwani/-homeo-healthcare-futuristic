import { KnowledgeEntity } from "../../types";

export const TIBCLabTest: KnowledgeEntity = {
  id: "L0028",
  slug: "tibc",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "TIBC",
    hi: "TIBC",
    gu: "TIBC",
    mr: "TIBC",
    es: "TIBC",
    ar: "TIBC"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of TIBC lab results.",
    hi: "TIBC प्रयोगशाला परीक्षण विवरण.",
    gu: "TIBC લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "TIBC लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio TIBC.",
    ar: "الغرض السريري وتفسير نتائج اختبار TIBC."
  },
  content: {
  "overview": "TIBC: A blood panel parameter or cell count analysis designed to evaluate red cell mass, immune defense lines, and coagulation potential.",
  "normalRange": "Varies by laboratory. Typically defined within reference intervals.",
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
  "clinicalInterpretation": "TIBC evaluation: Red cell and hemoglobin drops suggest anemia, necessitating iron, B12, or folate evaluation. WBC spikes indicate infection or severe inflammation, while platelet drops warn of bleeding risks.",
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
    specialty: "Clinical Pathology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["TIBC", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/tibc",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of TIBC test guidelines"]
};
