import { KnowledgeEntity } from "../../types";

export const PCOSDisease: KnowledgeEntity = {
  id: "D0013",
  slug: "pcos",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Polycystic Ovary Syndrome (PCOS)",
    hi: "पीसीओएस / पॉलीसिस्टिक ओवरी सिंड्रोम (PCOS)",
    gu: "પીસીઓએસ (PCOS)",
    mr: "पीसीओएस (PCOS)",
    es: "Síndrome de Ovario Poliquístico (SOP)",
    ar: "متلازمة المبيض المتعدد التكيسات",
  },
  summary: {
    en: "An authoritative clinical profile of Polycystic Ovary Syndrome (PCOS) covering 2023 Rotterdam criteria, hyperandrogenism vs insulin resistance dynamics, ovarian torsion emergency red flags, and metabolic screening non-replacement rules.",
    hi: "पीसीओएस का 2023 अंतर्राष्ट्रीय रोटरडैम मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "પીસીઓએસનું 2023 રોટરડેમ ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "पीसीओएसचे 2023 आंतरराष्ट्रीय रोटरडॅम निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del SOP según los criterios Rotterdam 2023 y límites de emergencia.",
    ar: "دليل سريري موثوق لمتلازمة المبيض المتعدد التكيسات وفقًا لمعايير 2023 وحدود السلامة.",
  },
  content: {
    overview:
      "Polycystic Ovary Syndrome (PCOS) is a complex endocrine-metabolic disorder defined by the 2023 International Rotterdam criteria requiring at least 2 of 3 features: ovulatory dysfunction (oligo-/amenorrhea), hyperandrogenism (clinical or biochemical), and polycystic ovarian morphology on ultrasound [D0013-KEYNOTES, CIT-0045].",
    definition:
      "A heterogenous reproductive and metabolic endocrinopathy characterized by anovulation, hyperandrogenemia, insulin resistance, and characteristic ovarian follicular microcysts.",
    causes: [
      "Insulin resistance and compensatory hyperinsulinemia stimulating ovarian androgen synthesis [D0013-KEYNOTES, CIT-0045]",
      "Altered hypothalamic-pituitary LH/FSH pulse frequency favoring excess luteinizing hormone secretion",
      "Genetic polygenic architecture interacting with sedentary lifestyle and weight gain",
    ],
    riskFactors: [
      "First-degree family history of PCOS or Type 2 Diabetes Mellitus",
      "Obesity, central adiposity, and metabolic syndrome",
      "Premature adrenarche or early-onset childhood weight gain",
    ],
    symptoms: [
      "Irregular, infrequent, or absent menstrual cycles (oligo- or amenorrhea) [D0013-KEYNOTES, CIT-0045]",
      "Hirsutism (excessive terminal facial/body hair), severe recalcitrant acne, and androgenic alopecia",
      "Acanthosis nigricans (velvety hyperpigmentation of neck/axillae), weight gain, and infertility",
    ],
    diagnosis:
      "Evaluated via serum free/total testosterone, DHEAS, LH/FSH ratio, fasting glucose/insulin (OGTT), lipid panel, serum progesterone, and pelvic transvaginal/abdominal ultrasound showing ≥20 follicles per ovary or volume ≥10 mL [CIT-0045].",
    differentialDiagnosis:
      "Differentiate PCOS from Thyroid Dysfunction, Hyperprolactinemia, Non-Classic Congenital Adrenal Hyperplasia (NCCAH), Cushing Syndrome, and Androgen-Secreting Ovarian Tumors.",
    conventionalManagement:
      "Management includes lifestyle weight management, combined oral contraceptive pills (COCPs) for cycle regulation, metformin for insulin resistance, anti-androgens (spironolactone) for hirsutism, and letrozole/clomiphene for ovulation induction [CIT-0045].",
    homeopathicApproach:
      "Homeopathic remedies (such as Pulsatilla, Sepia, Calcarea Carbonica, Thuja) provide supportive constitutional care to assist in menstrual regularity, soothe associated acne, and enhance general vitality alongside metabolic monitoring.",
    lifestyleAdvice:
      "Engage in 150+ minutes of weekly aerobic and resistance exercise, consume a low-glycemic Mediterranean-style diet, manage stress, and track menstrual cycle regularity.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0045"],
    faqs: [
      {
        question: "When is pelvic pain in a PCOS patient considered a medical emergency requiring urgent surgery?",
        answer:
          "Sudden, acute, severe unilateral pelvic pain accompanied by nausea, vomiting, fever, or peritoneal signs indicates POSSIBLE OVARIAN TORSION OR RUPTURED HEMORRHAGIC CYST [D0013-EMERGENCY-LIMITS, CIT-0045]. This is a SURGICAL EMERGENCY requiring IMMEDIATE ER evaluation.",
      },
      {
        question: "Can homeopathic remedies replace pelvic ultrasound, endometrial safety screening, or metformin?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace diagnostic pelvic ultrasound, glucose tolerance testing, or endometrial protection in prolonged amenorrhea [D0013-REGULATORY-LIMITS]. Unopposed estrogen in prolonged amenorrhea increases endometrial cancer risk.",
      },
      {
        question: "How does homeopathy integrate with standard gynecological care for PCOS?",
        answer:
          "Homeopathy serves as complementary constitutional care alongside routine metabolic screening, pelvic ultrasound, and gynecological supervision [D0013-REGULATORY-LIMITS].",
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
    specialty: "Gynecological Endocrinology & Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["PCOS", "Disease", "ASRM-2023", "Gynecology", "Rotterdam-Criteria", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/pcos",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of PCOS profile",
    "1.1.0: Upgraded with 2023 Rotterdam International PCOS evidence citations (CIT-0045), passage-level claim citations (D0013-KEYNOTES, D0013-EMERGENCY-LIMITS, D0013-REGULATORY-LIMITS), ovarian torsion red flags, and endometrial safety screening rules",
  ],
};
