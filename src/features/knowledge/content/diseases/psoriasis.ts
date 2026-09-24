import { KnowledgeEntity } from "../../types";

export const PsoriasisDisease: KnowledgeEntity = {
  id: "D0015",
  slug: "psoriasis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Psoriasis",
    hi: "सोरायसिस / चर्म रोग (Psoriasis Vulgaris)",
    gu: "સોરાયસિસ (Psoriasis Vulgaris)",
    mr: "सोरायसिस (Psoriasis Vulgaris)",
    es: "Psoriasis Vulgar",
    ar: "الصدفية الشائعة",
  },
  summary: {
    en: "Psoriasis is a long-term immune-related skin condition that can cause dry, scaly patches and sometimes joint symptoms. Learn practical support, treatment options, and when widespread redness, fever, or a painful swollen joint needs urgent care.",
    hi: "सोरायसिस (Psoriasis Vulgaris) का EuroGuiDerm 2021 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "સોરાયસિસનું EuroGuiDerm 2021 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "सोरायसिसचे EuroGuiDerm 2021 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Psoriasis Vulgar según los criterios EuroGuiDerm 2021 y límites de emergencia.",
    ar: "دليل سريري موثوق للصدفية الشائعة وفقًا لمعايير EuroGuiDerm 2021 وحدود السلامة.",
  },
  content: {
    overview:
      "Psoriasis is a long-term immune-related condition that speeds up the skin's renewal cycle. It often causes dry, raised, scaly patches on the elbows, knees, scalp, or lower back. It is not contagious, and some people also develop joint symptoms that need assessment.",
    definition:
      "It is an immune-related skin condition that can also affect nails and joints.",
    causes: [
      "A tendency in the immune system and, in many people, family history.",
      "A flare can be linked with illness, skin injury, stress, smoking, alcohol, or some medicines.",
      "The triggers differ between people and are not always obvious.",
    ],
    riskFactors: [
      "A family history of psoriasis or psoriatic arthritis.",
      "Smoking, heavier alcohol use, or a higher body weight can make psoriasis harder to manage.",
      "A recent throat infection, stress, or skin injury can trigger a flare for some people.",
    ],
    symptoms: [
      "Dry, itchy, sore, flaky patches with silvery scales, often on the elbows, knees, scalp, or lower back.",
      "Nail pitting, changes in nail colour, or nails lifting away from the bed.",
      "Persistent joint pain, stiffness, swollen fingers or toes, or heel pain can be signs of psoriatic arthritis.",
    ],
    diagnosis:
      "A clinician often diagnoses psoriasis from the appearance and location of the patches. A skin sample is sometimes needed when the diagnosis is unclear. New or persistent joint symptoms should be assessed separately.",
    differentialDiagnosis:
      "Differentiate Psoriasis Vulgaris from Seborrheic Dermatitis, Lichen Planus, Pityriasis Rosea, Secondary Syphilis, Cutaneous T-Cell Lymphoma, and Tinea Corporis.",
    conventionalManagement:
      "Treatment is matched to the sites affected, severity, and impact on your life. It can include regular moisturisers, prescribed creams, light therapy, tablets, injections, and joint care. Do not stop a prescribed treatment abruptly without medical advice.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for psoriasis. It must not replace dermatologist or rheumatology care, especially for significant skin disease or possible psoriatic arthritis.",
    lifestyleAdvice:
      "Use a plain moisturiser regularly, avoid harsh soaps and picking scales, and notice personal flare triggers. Smoking cessation, moderating alcohol, movement, and weight support can help overall health. Do not use sun exposure as a substitute for prescribed light therapy or sun protection.",
    references: ["CIT-0002", "CIT-0019", "CIT-0022", "CIT-0047"],
    faqs: [
      {
        question: "When does psoriasis need urgent medical help?",
        answer:
          "Seek urgent care for widespread red or peeling skin, a sudden rash of pus-filled spots with fever, feeling very unwell, or a hot, very painful, swollen joint. These are not typical everyday flares and need prompt assessment.",
      },
      {
        question: "Can homeopathy replace prescribed psoriasis treatment?",
        answer:
          "No. Do not use homeopathy to replace prescribed treatment or to delay care for severe psoriasis or possible psoriatic arthritis.",
      },
      {
        question: "Could my joint pain be related to psoriasis?",
        answer:
          "It could be. Tell a clinician about ongoing joint stiffness, swelling, heel pain, or a whole swollen finger or toe, particularly if it is worse after rest or comes with psoriasis patches or nail changes.",
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
    specialty: "Dermatology & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Psoriasis", "Disease", "EuroGuiDerm-2021", "Dermatology", "Erythrodermic-Psoriasis", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/psoriasis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Psoriasis profile",
    "1.1.0: Upgraded with EuroGuiDerm 2021 evidence citations (CIT-0047), passage-level claim citations (D0015-KEYNOTES, D0015-EMERGENCY-LIMITS, D0015-REGULATORY-LIMITS), erythrodermic/pustular psoriasis red flags, and systemic biologic safety boundaries",
    "1.2.0: Reframed the page around daily skin support, joint-awareness, and plain-language urgent-care boundaries.",
  ],
};
