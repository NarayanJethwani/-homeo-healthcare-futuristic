import { KnowledgeEntity } from "../../types";

export const PsoriasisDisease: KnowledgeEntity = {
  id: "D0015",
  slug: "psoriasis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Psoriasis Vulgaris",
    hi: "सोरायसिस / चर्म रोग (Psoriasis Vulgaris)",
    gu: "સોરાયસિસ (Psoriasis Vulgaris)",
    mr: "सोरायसिस (Psoriasis Vulgaris)",
    es: "Psoriasis Vulgar",
    ar: "الصدفية الشائعة",
  },
  summary: {
    en: "An authoritative clinical profile of Psoriasis Vulgaris covering EuroGuiDerm 2021 guidelines, IL-23/Th17 cutaneous immune pathways, erythrodermic and pustular psoriasis emergency red flags, and systemic biologic safety boundaries.",
    hi: "सोरायसिस (Psoriasis Vulgaris) का EuroGuiDerm 2021 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "સોરાયસિસનું EuroGuiDerm 2021 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "सोरायसिसचे EuroGuiDerm 2021 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Psoriasis Vulgar según los criterios EuroGuiDerm 2021 y límites de emergencia.",
    ar: "دليل سريري موثوق للصدفية الشائعة وفقًا لمعايير EuroGuiDerm 2021 وحدود السلامة.",
  },
  content: {
    overview:
      "Psoriasis Vulgaris is a chronic, immune-mediated inflammatory papulosquamous skin disease driven by the IL-23/IL-17 cytokine axis, resulting in keratinocyte hyperproliferation and silvery-scaled erythematous plaques [D0015-KEYNOTES, CIT-0047]. Psoriatic arthritis co-occurs in up to 30% of patients.",
    definition:
      "A systemic immune-mediated dermatosis characterized by well-demarcated erythematous plaques covered with silvery-white scales, predominantly over extensor surfaces, scalp, and nails.",
    causes: [
      "Dysregulated cutaneous immune activation driven by dendritic cells, T-helper 17 (Th17) cells, and IL-17/IL-23 cytokines [D0015-KEYNOTES, CIT-0047]",
      "Genetic susceptibility loci (PSORS1, HLA-Cw6 allele dominance)",
      "Environmental triggers: Streptococcal pharyngitis (guttate psoriasis), mechanical trauma (Koebner phenomenon), stress, and beta-blocker/lithium medications",
    ],
    riskFactors: [
      "Family history of psoriasis or psoriatic arthritis",
      "Smoking, heavy alcohol consumption, obesity, and metabolic syndrome",
      "Recent beta-hemolytic streptococcal infection or acute psychogenic stress",
    ],
    symptoms: [
      "Erythematous plaques with micaceous silvery scaling on knees, elbows, scalp, and lumbosacral skin [D0015-KEYNOTES, CIT-0047]",
      "Auspitz sign (pinpoint bleeding on scraping scale) and Koebner phenomenon (lesions at sites of trauma)",
      "Nail changes: Pitting, oil-drop discoloration, subungual hyperkeratosis, and onycholysis",
      "Joint symptoms: Asymmetric dactylitis ('sausage digits'), inflammatory enthesitis, and morning stiffness in psoriatic arthritis",
    ],
    diagnosis:
      "Diagnosed primarily clinically via lesion morphology, Auspitz sign, PASI (Psoriasis Area and Severity Index) scoring, and CASPAR criteria for suspected psoriatic arthritis. Biopsy reserved for atypical cases [CIT-0047].",
    differentialDiagnosis:
      "Differentiate Psoriasis Vulgaris from Seborrheic Dermatitis, Lichen Planus, Pityriasis Rosea, Secondary Syphilis, Cutaneous T-Cell Lymphoma, and Tinea Corporis.",
    conventionalManagement:
      "Management includes topical corticosteroids with vitamin D3 analogues (calcipotriol), phototherapy (NB-UVB), oral systemic agents (methotrexate, cyclosporine, apremilast), and targeted biologic therapies (anti-TNF, anti-IL-17, anti-IL-23) [CIT-0047].",
    homeopathicApproach:
      "Homeopathic remedies (such as Arsenicum Album, Graphites, Petroleum, Sulphur) serve as supportive constitutional care to manage pruritus, improve skin scaling, and address constitutional diathesis alongside dermatological evaluation.",
    lifestyleAdvice:
      "Apply thick emollient moisturizers daily, practice sun safety with brief natural UV exposure, avoid harsh chemical soaps or skin friction, quit smoking, and maintain healthy body weight.",
    references: ["CIT-0002", "CIT-0019", "CIT-0022", "CIT-0047"],
    faqs: [
      {
        question: "When is Psoriasis considered a life-threatening dermatological emergency requiring immediate hospitalization?",
        answer:
          "Generalized redness covering >90% body surface area with loss of thermoregulation (Erythrodermic Psoriasis) or sudden widespread eruption of sterile pustules with high fever and hypocalcemia (Generalized Pustular Psoriasis) is a DERMATOLOGICAL EMERGENCY [D0015-EMERGENCY-LIMITS, CIT-0047]. It requires IMMEDIATE ER evaluation to prevent high-output cardiac failure and sepsis.",
      },
      {
        question: "Can homeopathic remedies replace prescribed systemic biologic or methotrexate therapy in severe psoriasis?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace prescribed systemic biologics, methotrexate, or rheumatological management in severe joint-erosive psoriatic arthritis [D0015-REGULATORY-LIMITS]. Stopping systemic therapy abruptly can trigger severe erythrodermic rebound flares.",
      },
      {
        question: "How does homeopathy integrate with standard dermatological care for psoriasis?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard dermatological monitoring and PASI severity scoring [D0015-REGULATORY-LIMITS].",
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
  ],
};
