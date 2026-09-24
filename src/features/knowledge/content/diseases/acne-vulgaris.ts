import { KnowledgeEntity } from "../../types";

export const AcneVulgarisDisease: KnowledgeEntity = {
  id: "D0014",
  slug: "acne-vulgaris",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Acne",
    hi: "मुहासे / एक्ने वर्लगारिस (Acne Vulgaris)",
    gu: "ખીલ / એક્ને વલ્ગારિસ (Acne Vulgaris)",
    mr: "कीळ / ॲक्ने व्हल्गारिस (Acne Vulgaris)",
    es: "Acné Vulgar",
    ar: "حب الشباب الشائع",
  },
  summary: {
    en: "Acne can cause blackheads, whiteheads, pimples, and sometimes deep painful spots. Learn gentle skin-care steps, when treatment takes time, and when to see a dermatologist to reduce scarring.",
    hi: "मुहासों (Acne Vulgaris) का AAD 2024 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ખીલનું AAD 2024 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ॲक्ने व्हल्गारिसचे AAD 2024 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Acné Vulgar según los criterios AAD 2024 y límites de emergencia.",
    ar: "دليل سريري موثوق لحب الشباب وفقًا لمعايير AAD 2024 وحدود السلامة.",
  },
  content: {
    overview:
      "Acne is a common skin condition that causes blackheads, whiteheads, pimples, or deeper painful lumps. It develops when pores become blocked by oil and dead skin cells and inflammation follows. It is not caused by being unclean, and effective treatment is available.",
    definition:
      "It is an inflammatory condition of hair follicles and oil glands. It can affect the face, chest, shoulders, and back.",
    causes: [
      "Pores becoming blocked by oil and dead skin cells.",
      "Inflammation and normal skin bacteria contributing to spots.",
      "Hormonal changes, some medicines, and some hair or skin products can make acne more likely.",
    ],
    riskFactors: [
      "Puberty, menstrual or other hormonal changes, including PCOS in some people.",
      "A family tendency to acne or scarring.",
      "Products that clog pores or medicines that can trigger acne-like breakouts.",
    ],
    symptoms: [
      "Blackheads, whiteheads, red bumps, or pus-filled spots.",
      "Deep, painful lumps can occur, especially on the face, chest, shoulders, or back.",
      "Dark marks can remain after spots heal; deeper acne can leave scars.",
    ],
    diagnosis:
      "A clinician or dermatologist usually diagnoses acne by looking at the types and pattern of spots. They may ask about medicines, menstrual changes, excess hair growth, or other signs that a hormone assessment could be useful.",
    differentialDiagnosis:
      "Differentiate Acne Vulgaris from Rosacea, Folliculitis (Malassezia/bacterial), Perioral Dermatitis, Hidradenitis Suppurativa, and Drug-Induced Acneiform Eruptions.",
    conventionalManagement:
      "Treatment depends on the type and severity of acne. It can include a topical retinoid, benzoyl peroxide, other prescribed medicines, or specialist treatment for deep or scarring acne. Give a consistent plan time to work and ask a clinician or pharmacist which products are safe for you, especially during pregnancy.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for acne. It must not replace dermatologist care for deep, painful, scarring, or rapidly worsening acne.",
    lifestyleAdvice:
      "Wash gently up to twice a day and after sweating. Avoid scrubs, picking, or squeezing spots because they can increase irritation and scarring. Choose oil-free or non-comedogenic products and sunscreen, and introduce acne treatments slowly if your skin becomes dry or sore.",
    references: ["CIT-0002", "CIT-0019", "CIT-0022", "CIT-0046"],
    faqs: [
      {
        question: "When should I see a dermatologist sooner?",
        answer:
          "Arrange prompt care for deep painful lumps, scarring, acne that is affecting your wellbeing, or acne that does not improve with a consistent plan. Seek urgent care if a sudden severe outbreak comes with fever, joint pain, or feeling very unwell.",
      },
      {
        question: "Can homeopathy replace prescribed acne treatment?",
        answer:
          "No. Do not use homeopathy to delay dermatologist assessment, prescribed medicines, or treatment that can prevent permanent scars.",
      },
      {
        question: "Why is my acne treatment taking time?",
        answer:
          "Acne treatment works gradually because it treats both current and future blocked pores. Follow the product directions and give a consistent plan several weeks before deciding whether it is helping, unless you have a concerning reaction.",
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
  tags: ["Acne-Vulgaris", "Disease", "AAD-2024", "Dermatology", "Comedones", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/acne-vulgaris",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Acne Vulgaris profile",
    "1.1.0: Upgraded with AAD 2024 evidence citations (CIT-0046), passage-level claim citations (D0014-KEYNOTES, D0014-EMERGENCY-LIMITS, D0014-REGULATORY-LIMITS), acne fulminans red flags, and isotretinoin safety boundaries",
    "1.2.0: Reframed the page around acne types, a gentle routine, treatment expectations, and scar-prevention decisions.",
  ],
};
