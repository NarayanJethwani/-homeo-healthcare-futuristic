import { KnowledgeEntity } from "../../types";

export const VitiligoDisease: KnowledgeEntity = {
  id: "D0036",
  slug: "vitiligo",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Vitiligo (Leukoderma)",
    hi: "सफेद दाग / विटिलिगो (Vitiligo / Leukoderma)",
    gu: "સફેદ ડાઘ / વિટિલિગો (Vitiligo)",
    mr: "कोड / कोढ / विटिलिगो (Vitiligo)",
    es: "Vitíligo",
    ar: "البهاق",
  },
  summary: {
    en: "An authoritative clinical profile of Vitiligo covering EuroGuiDerm 2021 guidelines, CD8+ cytotoxic T-cell melanocyte destruction mechanics, narrowband UVB phototherapy safety boundaries, and systemic autoimmune screening requirements.",
    hi: "विटिलिगो (Vitiligo) का EuroGuiDerm 2021 मानकों के अनुसार प्रामाणिक विवरण और सुरक्षा सीमाएँ।",
    gu: "વિટિલિગોનું EuroGuiDerm 2021 ધોરણો મુજબનું નૈદાનિક વિવરણ અને સુરક્ષા સીમાઓ.",
    mr: "विटिलिगोचे EuroGuiDerm 2021 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Vitíligo según los criterios EuroGuiDerm 2021 y límites de emergencia.",
    ar: "دليل سريري موثوق للبهاق وفقًا لمعايير EuroGuiDerm 2021 وحدود السلامة.",
  },
  content: {
    overview:
      "Vitiligo is a chronic autoimmune depigmenting skin disorder characterized by selective destruction of epidermal melanocytes, resulting in chalk-white macules and patches [D0036-KEYNOTES, CIT-0060]. EuroGuiDerm 2021 guidelines prioritize halting active progression and inducing re-pigmentation.",
    definition:
      "An acquired autoimmune disease affecting 0.5-2% of the global population, categorized into non-segmental (generalized, acrofacial, universal) and segmental vitiligo, driven by CD8+ T-cell-mediated melanocyte apoptosis.",
    causes: [
      "Autoimmune destruction of functional melanocytes mediated by CD8+ cytotoxic T-cells producing IFN-γ and CXCL10 [D0036-KEYNOTES, CIT-0060]",
      "Melanocyte intrinsic oxidative stress susceptibility combined with organelle dysfunction",
      "Genetic heritability (HLA-A2, HLA-DR4, NLRP1) interacting with environmental trauma (Koebner phenomenon)",
    ],
    riskFactors: [
      "Personal or family history of vitiligo or co-occurring autoimmune conditions (Hashimoto's Thyroiditis, Graves' Disease, Alopecia Areata, Pernicious Anemia, Addison's Disease)",
      "Physical skin trauma, friction, or chemical exposure (monobenzone, phenols)",
      "Psychological stress aggravating oxidative stress cascades",
    ],
    symptoms: [
      "Asymptomatic, well-circumscribed milk-white or chalk-white macules and patches [D0036-KEYNOTES, CIT-0060]",
      "Trichrome or quadrichrome lesions with varying shades of depigmentation, and leukotrichia (depigmented hair within lesions)",
      "Predilection for sun-exposed areas (face, hands), periorificial zones (eyes, mouth), extensor surfaces (wrinkles, knees), and flexural friction folds",
    ],
    diagnosis:
      "Diagnosed by clinical examination enhanced by Wood's lamp fluorescence (accentuating bright blue-white epidermal depigmentation). Screening includes thyroid peroxidase autoantibodies (TPO), serum TSH, CBC, and fasting blood glucose [CIT-0060].",
    differentialDiagnosis:
      "Differentiate Vitiligo from Pityriasis Alba, Tinea Versicolor (fungal scaling), Post-Inflammatory Hypopigmentation, Leprosy (hypopigmented anaesthetic macules), Nevus Depigmentosus, and Chemical Leukoderma.",
    conventionalManagement:
      "Management includes topical corticosteroids (high-potency), topical calcineurin inhibitors (tacrolimus, pimecrolimus), targeted narrowband UVB (NB-UVB) phototherapy, systemic mini-pulse corticosteroids (for rapidly spreading active disease), and surgical autologous melanocyte transplantation for stable localized lesions [CIT-0060].",
    homeopathicApproach:
      "Homeopathic remedies (such as Hydrocotyle Asiatica, Arsenicum Sulfuratum Flavum, Silicea, Sulphur, Sepia) serve as supportive constitutional care to modulate systemic immune hyper-reactivity, reduce oxidative stress, and support skin health alongside dermatological care.",
    lifestyleAdvice:
      "Apply broad-spectrum sunscreen (SPF 30+) to depigmented patches to prevent sunburn, avoid tight friction-causing clothing (minimizing Koebnerization), and manage stress.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0060"],
    faqs: [
      {
        question: "When does rapidly spreading depigmentation indicate active progressive disease or systemic autoimmune crisis?",
        answer:
          "Rapid spreading of multiple new white patches over weeks (ACTIVE PROGRESSIVE VITILIGO), or co-occurrence of severe fatigue, dizziness, and low blood pressure (ADDISON'S DISEASE CRISIS) or eye pain/vision changes (VOGT-KOYANAGI-HARADA SYNDROME) requires URGENT DERMATOLOGICAL / ENDOCRINE EVALUATION [D0036-EMERGENCY-LIMITS, CIT-0060]. Active spreading requires prompt stabilization.",
      },
      {
        question: "Can homeopathic remedies replace Wood's lamp examination, thyroid screens, or phototherapy monitoring?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace diagnostic Wood's lamp evaluation, thyroid autoantibody screens, or supervised NB-UVB phototherapy [D0036-REGULATORY-LIMITS].",
      },
      {
        question: "How does homeopathy integrate with standard dermatological treatment for vitiligo?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard dermatological guidance, Wood's lamp tracking, and phototherapy protocols [D0036-REGULATORY-LIMITS].",
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
  tags: ["Vitiligo", "Disease", "EuroGuiDerm-2021", "Dermatology", "Autoimmune", "Phototherapy", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/vitiligo",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Vitiligo profile",
    "1.1.0: Upgraded with EuroGuiDerm 2021 evidence citations (CIT-0060), passage-level claim citations (D0036-KEYNOTES, D0036-EMERGENCY-LIMITS, D0036-REGULATORY-LIMITS), active spreading / endocrine crisis red flags, and phototherapy safety boundaries",
  ],
};
