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
    overview: "A Complete Blood Count (CBC) is a fundamental diagnostic panel that measures the cells that circulate in your blood. The panel assesses three primary components: Red Blood Cells (carrying oxygen), White Blood Cells (fighting infection), and Platelets (assisting in blood clotting). It provides vital markers of systemic health.",
    normalRange: "Varies by parameter. Typical reference ranges: Hemoglobin: 13.5 - 17.5 g/dL (male), 12.0 - 15.5 g/dL (female); White Blood Cell (WBC) count: 4,000 - 11,000 cells/mcL; Platelet count: 150,000 - 450,000/mcL.",
    highValues: [
      "High Red Blood Cells / Hemoglobin (Polycythemia): Suggests dehydration, chronic hypoxia (smoking, lung disease), or primary bone marrow disorders.",
      "High White Blood Cells (Leukocytosis): Indicates acute bacterial infection, severe physical stress, tissue necrosis, or leukemia.",
      "High Platelets (Thrombocytosis): Associated with acute inflammation, iron deficiency, or myeloproliferative disorders."
    ],
    lowValues: [
      "Low Red Blood Cells / Hemoglobin (Anemia): Suggests nutritional deficiency (iron, B12, folate), chronic blood loss, renal failure, or hemolysis.",
      "Low White Blood Cells (Leukopenia): Linked to viral infections, autoimmune destruction, bone marrow suppression, or certain drugs.",
      "Low Platelets (Thrombocytopenia): Poses risks of bleeding, often caused by immune destruction, viral infections, or splenic sequestration."
    ],
    clinicalInterpretation: "In clinical practice, a CBC serves as a diagnostic window. High white cell counts point to inflammatory processes (such as severe atopic eczema flares or gastritis), whereas low hemoglobin suggests a chronic microcytic anemia from gastrointestinal bleeding. Homeopaths correlate these findings with the patient's structural vitality.",
    references: ["CIT-0002"]
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
  changeLog: ["1.0.0: Initial release of CBC lab test profile"]
};
