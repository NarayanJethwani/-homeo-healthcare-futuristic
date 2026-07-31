import { KnowledgeEntity } from "../../types";

export const AnemiaDisease: KnowledgeEntity = {
  id: "D0051",
  slug: "anemia",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Anemia",
    hi: "एनीमिया / रक्ताल्पता (Anemia)",
    gu: "એનિમિયા / લોહીની ઉણપ (Anemia)",
    mr: "ॲनिमिया / रक्ताल्पता (Anemia)",
    es: "Anemia",
    ar: "فقر الدم",
  },
  summary: {
    en: "An authoritative clinical profile of Anemia covering WHO 2017 hemoglobin threshold criteria, iron deficiency vs megaloblastic etiologies, severe anemia emergency red flags (Hb <7.0 g/dL), and transfusion non-replacement rules.",
    hi: "एनीमिया का डब्ल्यूएचओ 2017 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "એનિમિયાનું WHO 2017 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ॲनिमियाचे WHO 2017 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Anemia según los criterios OMS 2017 y límites de emergencia.",
    ar: "دليل سريري موثوق لفقر الدم وفقًا لمعايير منظمة الصحة العالمية 2017 وحدود السلامة.",
  },
  content: {
    overview:
      "Anemia is defined as a reduction in red blood cell (RBC) count, hematocrit, or hemoglobin concentration below WHO age- and sex-adjusted reference values (hemoglobin <12.0 g/dL in adult non-pregnant females, <13.0 g/dL in adult males) [D0051-KEYNOTES, CIT-0042]. It impairs tissue oxygen delivery.",
    definition:
      "A systemic hematological disorder characterized by inadequate circulating hemoglobin mass to meet cellular oxygenation requirements.",
    causes: [
      "Decreased RBC production: Nutritional iron deficiency, vitamin B12 or folate deficiency, chronic renal disease (erythropoietin deficiency), or bone marrow suppression [D0051-KEYNOTES, CIT-0042]",
      "Increased RBC destruction (Hemolysis): Autoimmune hemolytic anemia, sickle cell disease, thalassemia, G6PD deficiency, or mechanical heart valve hemolysis",
      "Acute or chronic blood loss: Gastrointestinal ulceration/malignancy, heavy menstrual bleeding (menorrhagia), or trauma",
    ],
    riskFactors: [
      "Diets deficient in bioavailable iron, vitamin B12, or folate (e.g. strict unsupplemented vegan diets)",
      "Pregnancy and lactation (increased red cell mass demand)",
      "Chronic inflammatory diseases (rheumatoid arthritis, IBD, chronic kidney disease) and occult GI bleeding",
    ],
    symptoms: [
      "Exertional dyspnea, postural dizziness, syncope, and persistent fatigue [D0051-KEYNOTES, CIT-0042]",
      "Pallor of palpebral conjunctivae, tongue mucosa, palm creases, and skin",
      "Tachycardia, flow murmurs, palpitations, and cold extremities",
      "Iron deficiency signs: Koilonychia (spoon nails), angular stomatitis, and pica (craving ice/dirt)",
    ],
    diagnosis:
      "Diagnosed via Complete Blood Count (CBC) showing reduced Hb/Hct, red cell indices (MCV, MCH, MCHC, RDW), serum ferritin, iron, total iron-binding capacity (TIBC), reticulocyte count, and vitamin B12 / folate levels [CIT-0042].",
    differentialDiagnosis:
      "Differentiate Iron Deficiency Anemia from Anemia of Chronic Disease, Thalassemia Trait, Sideroblastic Anemia, Vitamin B12 / Folate Megaloblastic Anemia, and Aplastic Anemia.",
    conventionalManagement:
      "Management includes oral elemental iron therapy (ferrous sulfate/fumarate), IV iron infusions for malabsorption, vitamin B12 injections, treatment of underlying bleeding, and packed RBC transfusions for severe hemodynamically unstable anemia [CIT-0042].",
    homeopathicApproach:
      "Homeopathic prescribing acts as supportive constitutional care to optimize digestive absorption, improve iron assimilation dynamics, and alleviate subjective weakness alongside regular CBC monitoring.",
    lifestyleAdvice:
      "Consume iron-rich foods (dark leafy greens, lentils, beans, poultry) paired with vitamin C (citrus fruits) to enhance non-heme iron absorption, and avoid tea/coffee near meal times.",
    references: ["CIT-0015", "CIT-0016", "CIT-0022", "CIT-0042"],
    faqs: [
      {
        question: "When is Anemia considered a medical emergency requiring hospitalization or blood transfusion?",
        answer:
          "Severe anemia with hemoglobin <7.0 g/dL, acute active gastrointestinal hemorrhage, hemodynamic instability (hypotension, severe tachycardia), or acute ischemic cardiac angina is a MEDICAL EMERGENCY [D0051-EMERGENCY-LIMITS, CIT-0042]. It requires IMMEDIATE ER transport for blood transfusion and hemodynamic stabilization.",
      },
      {
        question: "Can homeopathic remedies replace blood transfusions or prescribed iron therapy in severe anemia?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace blood transfusions in acute severe anemia or prescribed iron/B12 replacement in severe nutritional deficiencies [D0051-REGULATORY-LIMITS]. Delaying transfusion in severe hemorrhage risks cardiac arrest.",
      },
      {
        question: "How does homeopathy integrate with standard hematology monitoring?",
        answer:
          "Homeopathy provides complementary constitutional support while patients remain under standard hematology monitoring with regular Hemoglobin and Ferritin blood tests [D0051-REGULATORY-LIMITS].",
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
    specialty: "Hematology & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Anemia", "Disease", "WHO-2017", "Hematology", "Hemoglobin", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/anemia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Anemia profile",
    "1.1.0: Upgraded with WHO 2017 evidence citations (CIT-0042), passage-level claim citations (D0051-KEYNOTES, D0051-EMERGENCY-LIMITS, D0051-REGULATORY-LIMITS), severe anemia red flags (Hb <7.0 g/dL), and transfusion non-replacement rules",
  ],
};
