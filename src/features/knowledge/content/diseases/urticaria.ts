import { KnowledgeEntity } from "../../types";

export const UrticariaDisease: KnowledgeEntity = {
  id: "D0016",
  slug: "urticaria",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Urticaria (Hives) & Angioedema",
    hi: "पित्ती / आर्टिकेरिया (Urticaria)",
    gu: "શીતપિત્ત / અર્ટિકેરિયા (Urticaria)",
    mr: "शीतपित्त / आर्टिकेरिया (Urticaria)",
    es: "Urticaria y Angioedema",
    ar: "الشري وتورم وعائي",
  },
  summary: {
    en: "An authoritative clinical profile of Urticaria covering EAACI 2022 guidelines, mast cell histamine degranulation, acute angioedema emergency red flags, and epinephrine non-replacement rules.",
    hi: "आर्टिकेरिया (Urticaria) का EAACI 2022 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "અર્ટિકેરિયાનું EAACI 2022 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "आर्टिकेरियाचे EAACI 2022 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Urticaria según los criterios EAACI 2022 y límites de emergencia.",
    ar: "دليل سريري موثوق للشري وفقًا لمعايير EAACI 2022 وحدود السلامة.",
  },
  content: {
    overview:
      "Urticaria (hives) is characterized by sudden development of transient pruritic wheals, angioedema, or both driven by cutaneous mast cell activation and histamine release [D0016-KEYNOTES, CIT-0048]. EAACI 2022 classifies duration <6 weeks as acute and ≥6 weeks as chronic urticaria.",
    definition:
      "A mast cell-driven inflammatory skin disorder producing edematous pruritic superficial wheals (hives) that resolve within 24 hours without scarring, frequently associated with deeper dermal/submucosal angioedema.",
    causes: [
      "IgE-mediated Type I allergic hypersensitivity (foods, insect stings, medications) or pseudoallergic reactions [D0016-KEYNOTES, CIT-0048]",
      "Autoimmune thyroiditis or functional autoantibodies (anti-FcεRI or anti-IgE) in chronic spontaneous urticaria (CSU)",
      "Physical triggers: Cold, heat, pressure (dermographism), solar radiation, or exercise (cholinergic urticaria)",
    ],
    riskFactors: [
      "Personal or family history of atopic disease or autoimmune disorders (Hashimoto's thyroiditis)",
      "Recent viral URTI infection, acute psychogenic stress, or ingestion of NSAIDs/ACE inhibitors",
      "Exposure to specific food allergens (shellfish, nuts, eggs) or hymenoptera stings",
    ],
    symptoms: [
      "Pruritic erythematous or pale central wheals surrounded by flare, resolving within 24 hours [D0016-KEYNOTES, CIT-0048]",
      "Angioedema: Painful, burning asymmetric swelling of lips, eyelids, tongue, or extremities lasting up to 72 hours",
      "Severe flares: Generalized pruritus, dermatographism, and systemic malaise",
    ],
    diagnosis:
      "Diagnosed clinically via skin examination, Urticaria Activity Score (UAS7), autologous serum skin test (ASST), thyroid autoantibody screening, and exclusion of urticarial vasculitis via biopsy if wheals persist >24 hours with purpura [CIT-0048].",
    differentialDiagnosis:
      "Differentiate Urticaria from Urticarial Vasculitis (wheals painful >24h with residual hyperpigmentation), Erythema Multiforme, Bullous Pemphigoid (pre-bullous stage), and Hereditary Angioedema (HAE).",
    conventionalManagement:
      "Management includes second-generation non-sedating H1-antihistamines up to 4x licensed dose, omalizumab (anti-IgE) for antihistamine-refractory CSU, cyclosporine, and short-course oral corticosteroids for severe acute flares [CIT-0048].",
    homeopathicApproach:
      "Homeopathic remedies (such as Apis Mellifica, Urtica Urens, Rhus Toxicodendron, Natrum Muriaticum) provide supportive constitutional care to reduce cutaneous histamine hyper-reactivity and soothe burning edema alongside medical evaluation.",
    lifestyleAdvice:
      "Identify and eliminate specific allergen/physical triggers, avoid NSAIDs and alcohol during flares, wear loose non-restrictive cotton clothing, and apply cool compresses.",
    references: ["CIT-0002", "CIT-0019", "CIT-0022", "CIT-0048"],
    faqs: [
      {
        question: "When is Angioedema considered an immediate life-threatening emergency?",
        answer:
          "Swelling of the tongue, soft palate, or laryngeal tissue causing hoarseness, stridor, feeling of throat tightness, or dyspnea indicates ACUTE AIRWAY COMPROMISE / ANAPHYLAXIS [D0016-EMERGENCY-LIMITS, CIT-0048]. This is a MEDICAL EMERGENCY requiring IMMEDIATE INTRAMUSCULAR EPINEPHRINE (EpiPen) AND ER TRANSPORT.",
      },
      {
        question: "Can homeopathic remedies replace emergency epinephrine (EpiPen) during acute allergic angioedema?",
        answer:
          "NO. Homeopathy MUST NEVER be used to replace emergency intramuscular epinephrine or delay ER transport in acute airway angioedema [D0016-REGULATORY-LIMITS]. Asphyxiation can occur rapidly without epinephrine.",
      },
      {
        question: "How does homeopathy integrate with standard allergy care for chronic hives?",
        answer:
          "Homeopathy acts as complementary constitutional care while patients remain under standard allergy supervision and antihistamine protocols [D0016-REGULATORY-LIMITS].",
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
    specialty: "Allergy & Clinical Immunology Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Urticaria", "Disease", "EAACI-2022", "Allergy", "Angioedema", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/urticaria",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Urticaria profile",
    "1.1.0: Upgraded with EAACI 2022 evidence citations (CIT-0048), passage-level claim citations (D0016-KEYNOTES, D0016-EMERGENCY-LIMITS, D0016-REGULATORY-LIMITS), airway angioedema red flags, and emergency epinephrine safety boundaries",
  ],
};
