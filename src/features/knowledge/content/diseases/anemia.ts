import { KnowledgeEntity } from "../../types";

export const AnemiaDisease: KnowledgeEntity = {
  id: "D0051",
  slug: "anemia",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-21T12:00:00Z",
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
    en: "A clear guide to anaemia: what it means, common causes, the usual blood tests, safe next steps, and when to seek urgent care.",
    hi: "एनीमिया का डब्ल्यूएचओ 2017 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "એનિમિયાનું WHO 2017 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ॲनिमियाचे WHO 2017 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Anemia según los criterios OMS 2017 y límites de emergencia.",
    ar: "دليل سريري موثوق لفقر الدم وفقًا لمعايير منظمة الصحة العالمية 2017 وحدود السلامة.",
  },
  content: {
    overview:
      "Anaemia means there are not enough healthy red blood cells or haemoglobin to carry oxygen around the body. It can make people feel tired, weak, breathless, dizzy, or notice paler skin, but mild anaemia may cause few symptoms. It is not one single condition: iron deficiency, vitamin deficiencies, blood loss, inherited blood conditions, kidney disease, inflammation, and other causes need different care.",
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
      "A complete blood count (CBC) is usually the starting point. It includes haemoglobin and red-cell measurements that help show the pattern of anaemia. Depending on that pattern and your history, a clinician may add ferritin or other iron tests, B12 or folate tests, kidney tests, or investigations for a source of bleeding.",
    differentialDiagnosis:
      "Differentiate Iron Deficiency Anemia from Anemia of Chronic Disease, Thalassemia Trait, Sideroblastic Anemia, Vitamin B12 / Folate Megaloblastic Anemia, and Aplastic Anemia.",
    conventionalManagement:
      "Treatment depends on the cause and severity. It may include treating iron, B12, or folate deficiency; addressing bleeding or another underlying condition; and follow-up blood tests. Iron is not appropriate for every type of anaemia, so avoid starting high-dose supplements without knowing the likely cause. Severe or unstable anaemia may require urgent hospital care.",
    homeopathicApproach:
      "If you use complementary care, discuss it openly with your clinician and pharmacist. It should not replace investigation of anaemia, treatment for a confirmed deficiency or source of bleeding, or repeat blood tests.",
    lifestyleAdvice:
      "A varied diet can support blood health, but food alone may not correct every type of anaemia. Iron-containing foods include lentils, beans, leafy greens, meat, and fortified foods; vitamin C-rich foods can help absorb non-haem iron. Bring a list of medicines, diet changes, menstrual history, and any bleeding symptoms to your appointment.",
    references: ["CIT-0015", "CIT-0016", "CIT-0022", "CIT-0042"],
    faqs: [
      {
        question: "What does it mean if I have anaemia?",
        answer:
          "It means your blood has too little haemoglobin or too few healthy red blood cells to carry oxygen effectively. Anaemia is a finding with many possible causes, so the important next step is understanding the pattern on your CBC and why it occurred.",
      },
      {
        question: "Does tiredness mean I have anaemia?",
        answer:
          "Not necessarily. Tiredness is common and can be caused by sleep, stress, infections, thyroid conditions, mood changes, medicines, and many other factors. A CBC can help a clinician find out whether anaemia is contributing.",
      },
      {
        question: "What does a CBC or haemoglobin result tell me?",
        answer:
          "Haemoglobin is one part of a CBC and helps show whether anaemia is present. Other red-cell measurements can suggest which additional tests may be useful, such as ferritin, iron studies, B12, folate, kidney tests, or tests for bleeding.",
      },
      {
        question: "Should I take iron if my haemoglobin is low?",
        answer:
          "Ask a clinician before starting iron. Iron deficiency is common, but it is not the only cause of anaemia, and too much iron can be harmful. Ferritin and other tests can help determine whether iron replacement is appropriate.",
      },
      {
        question: "When should I seek medical advice urgently?",
        answer:
          "Seek urgent care for chest pain, severe shortness of breath, fainting, confusion, a very fast or irregular heartbeat, heavy active bleeding, black or bloody stools, or sudden marked weakness. Seek timely care for persistent fatigue, dizziness, palpitations, heavy periods, or any new bleeding.",
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
    "1.2.0: Added a question-first patient layer, cause-led next steps, and clearer safety guidance for supplements and urgent symptoms.",
  ],
};
