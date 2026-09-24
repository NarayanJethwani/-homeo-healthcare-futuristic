import { KnowledgeEntity } from "../../types";

export const PCOSDisease: KnowledgeEntity = {
  id: "D0013",
  slug: "pcos",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T21:00:00Z",
    reviewed: "2026-09-23T21:00:00Z",
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
    en: "PCOS is a common hormone-related condition that can affect periods, skin, hair, fertility and long-term metabolic health. Learn what it can look like and what a practical care plan can include.",
    hi: "पीसीओएस का 2023 अंतर्राष्ट्रीय रोटरडैम मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "પીસીઓએસનું 2023 રોટરડેમ ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "पीसीओएसचे 2023 आंतरराष्ट्रीय रोटरडॅम निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "El SOP es una condición hormonal común que puede afectar los períodos, la piel, el cabello, la fertilidad y la salud metabólica.",
    ar: "دليل سريري موثوق لمتلازمة المبيض المتعدد التكيسات وفقًا لمعايير 2023 وحدود السلامة.",
  },
  content: {
    overview:
      "Polycystic Ovary Syndrome (PCOS) is a common condition involving ovulation and hormones. It can affect periods, acne, unwanted hair growth, scalp-hair thinning, weight, mood and fertility. Its name is misleading: having PCOS does not mean you necessarily have ovarian cysts, and an ultrasound alone does not diagnose it.",
    definition:
      "PCOS is diagnosed from a pattern of symptoms, hormone assessment and, when appropriate, ultrasound findings after other possible causes are considered. It is not caused by anything you did wrong, and people experience it differently.",
    causes: [
      "A mix of inherited tendency and differences in hormone and insulin signalling",
      "Family history can raise the chance of PCOS, but it is not anyone's fault",
      "Weight changes and lifestyle can affect symptoms for some people, but they are not the sole cause of PCOS",
    ],
    riskFactors: [
      "A close relative with PCOS or type 2 diabetes",
      "Signs of insulin resistance, such as dark, velvety skin patches on the neck or armpits",
      "Irregular cycles, acne, unwanted facial/body hair or scalp-hair thinning that are affecting daily life",
    ],
    symptoms: [
      "Irregular, infrequent or absent periods",
      "Acne, unwanted facial or body hair, or scalp-hair thinning",
      "Difficulty with weight changes, fertility, mood or energy for some people",
    ],
    diagnosis:
      "A clinician will discuss your cycles, symptoms, medicines and goals, and may arrange blood tests for hormones and metabolic health. Ultrasound can be useful in some adults, but is not always needed or appropriate—particularly for younger people.",
    differentialDiagnosis:
      "Other hormone, thyroid, medication and reproductive conditions can cause similar symptoms, which is why a proper assessment matters before labelling a pattern as PCOS.",
    redFlags: [
      "Get urgent medical help for sudden, severe one-sided pelvic or lower-abdominal pain, especially with vomiting, fainting, fever or a possible pregnancy.",
      "Seek prompt medical advice for very heavy bleeding, pain in pregnancy or possible pregnancy, or a rapid new change such as deepening voice or quickly worsening facial hair.",
      "Make a routine appointment if irregular periods, acne, hair changes, mood, fertility or weight concerns are affecting daily life."
    ],
    conventionalManagement:
      "Care is tailored to what matters to you: period regularity and endometrial protection, acne or hair symptoms, metabolic screening, fertility goals and emotional wellbeing. Options can include lifestyle support, hormonal treatment, acne or hair treatments, metformin for some people, and fertility care when pregnancy is desired.",
    homeopathicApproach:
      "Homeopathy should not replace diagnosis, cycle protection, metabolic screening, fertility treatment or prescribed medicines. If you choose complementary care, tell your gynecologist or endocrinologist so it can be coordinated safely.",
    lifestyleAdvice:
      "A sustainable routine works better than a perfect plan: regular movement you enjoy, balanced meals, sleep, stress support, and cycle tracking can help you and your clinician notice change. These steps support health but are not a cure or a substitute for medical follow-up.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0045", "CIT-0137", "CIT-0138"],
    faqs: [
      {
        question: "Do I need an ultrasound to be diagnosed with PCOS?",
        answer:
          "Not always. Diagnosis considers symptoms, cycles, hormone tests and your age. Ultrasound may help in some adults, but it is not the only test and is not generally used for diagnosis in younger adolescents.",
      },
      {
        question: "Can I have PCOS if I am not trying to conceive?",
        answer:
          "Yes. PCOS can affect periods, skin, hair, mood and metabolic health whether or not fertility is a current goal. Your care plan can focus on the symptoms and goals that matter to you now.",
      },
      {
        question: "When should I seek urgent help?",
        answer:
          "Seek urgent help for sudden severe pelvic pain, especially with vomiting, fainting, fever or possible pregnancy. Seek prompt advice for very heavy bleeding or a rapid new change in androgen-related symptoms.",
      },
      {
        question: "Can homeopathy replace my PCOS treatment plan?",
        answer:
          "No. Complementary care must not replace medical assessment, cycle protection, metabolic screening, fertility care or prescribed medicines. Discuss any complementary treatment with your clinical team.",
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
    "1.2.0: Rewritten as a patient-first guide while retaining diagnosis, metabolic screening and urgent-care safeguards.",
  ],
};
