import { KnowledgeEntity } from "../../types";

export const VitiligoDisease: KnowledgeEntity = {
  id: "D0036",
  slug: "vitiligo",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Vitiligo",
    hi: "सफेद दाग / विटिलिगो (Vitiligo / Leukoderma)",
    gu: "સફેદ ડાઘ / વિટિલિગો (Vitiligo)",
    mr: "कोड / कोढ / विटिलिगो (Vitiligo)",
    es: "Vitíligo",
    ar: "البهاق",
  },
  summary: {
    en: "Vitiligo causes pale or white patches because the skin loses pigment. It is not contagious. Learn how to protect affected skin from sunburn, what a clinician may check, and the treatment and support options available.",
    hi: "विटिलिगो (Vitiligo) का EuroGuiDerm 2021 मानकों के अनुसार प्रामाणिक विवरण और सुरक्षा सीमाएँ।",
    gu: "વિટિલિગોનું EuroGuiDerm 2021 ધોરણો મુજબનું નૈદાનિક વિવરણ અને સુરક્ષા સીમાઓ.",
    mr: "विटिलिगोचे EuroGuiDerm 2021 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Vitíligo según los criterios EuroGuiDerm 2021 y límites de emergencia.",
    ar: "دليل سريري موثوق للبهاق وفقًا لمعايير EuroGuiDerm 2021 وحدود السلامة.",
  },
  content: {
    overview:
      "Vitiligo is a long-term condition in which patches of skin lose their natural colour. It can affect any skin tone and may also lighten hair in the affected area. It is not contagious or caused by poor hygiene. A clinician can confirm the diagnosis, consider related health conditions when relevant, and help with sun protection and treatment choices.",
    definition:
      "A condition in which pigment-producing skin cells stop working in some areas, leaving pale or white patches.",
    causes: [
      "An immune-related process is thought to be involved in many people",
      "Family history can increase the chance of developing vitiligo",
      "Skin injury, friction, or sunburn may precede or worsen patches in some people",
    ],
    riskFactors: [
      "A personal or family history of vitiligo or some autoimmune conditions",
      "Repeated skin injury, rubbing, or a severe sunburn in people who are prone to it",
      "The emotional impact of a visible skin change, which can affect confidence and wellbeing",
    ],
    symptoms: [
      "Clearly defined pale or white patches, often on the face, hands, skin folds, or around the eyes and mouth",
      "Hair in an affected area may turn white or grey",
      "The patches usually do not itch or hurt, but every new or changing skin mark should be assessed if the diagnosis is uncertain",
    ],
    diagnosis:
      "A clinician usually diagnoses vitiligo by examining the skin. They may use a special light or photographs to follow changes. Depending on your symptoms and history, they may also discuss tests for related autoimmune conditions; not everyone needs broad testing.",
    differentialDiagnosis:
      "Fungal infection, post-inflammatory colour change, pityriasis alba, chemical exposure, birthmarks, and other causes of pale patches can look similar. A clinician can distinguish these before treatment is chosen.",
    conventionalManagement:
      "Sun protection is important because affected skin burns easily. Depending on the pattern and how it affects you, a dermatologist may discuss camouflage, prescribed topical medicines, or supervised light treatment. Results vary and any return of pigment is usually gradual.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment that restores pigment in vitiligo. It should not replace sun protection, assessment of a new skin change, or dermatologist-led treatment.",
    lifestyleAdvice:
      "Use broad-spectrum high-protection sunscreen on exposed patches, and use shade and protective clothing to reduce sunburn. Avoid tanning beds and deliberate sun exposure. If vitiligo is affecting confidence, school, work, or relationships, discuss support and camouflage options with a clinician or trusted support service.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0060"],
    faqs: [
      {
        question: "Is vitiligo contagious?",
        answer:
          "No. Vitiligo cannot be passed from one person to another through touch, shared items, food, or close contact.",
      },
      {
        question: "What is most important for daily care?",
        answer:
          "Protect pale patches from sunburn with shade, suitable clothing, and broad-spectrum sunscreen. Arrange a routine clinical assessment for new unexplained patches or if the diagnosis has not been confirmed.",
      },
      {
        question: "Can homeopathy restore pigment?",
        answer:
          "Reliable clinical evidence has not shown that homeopathy restores pigment in vitiligo. Do not use it in place of sun protection, clinical assessment, or treatment discussed with a dermatologist.",
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
  tags: ["Vitiligo", "Leukoderma", "White Skin Patches", "Dermatology", "Skin Pigment", "Autoimmune"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/vitiligo",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Vitiligo profile",
    "1.1.0: Upgraded with EuroGuiDerm 2021 evidence citations (CIT-0060), passage-level claim citations (D0036-KEYNOTES, D0036-EMERGENCY-LIMITS, D0036-REGULATORY-LIMITS), active spreading / endocrine crisis red flags, and phototherapy safety boundaries",
    "1.2.0: Reframed the guide around visible changes, sun protection, treatment choices, and evidence-based care boundaries.",
  ],
};
