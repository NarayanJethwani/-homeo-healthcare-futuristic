import { KnowledgeEntity } from "../../types";

export const UrticariaDisease: KnowledgeEntity = {
  id: "D0016",
  slug: "urticaria",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Hives (Urticaria)",
    hi: "पित्ती / आर्टिकेरिया (Urticaria)",
    gu: "શીતપિત્ત / અર્ટિકેરિયા (Urticaria)",
    mr: "शीतपित्त / आर्टिकेरिया (Urticaria)",
    es: "Urticaria y Angioedema",
    ar: "الشري وتورم وعائي",
  },
  summary: {
    en: "Hives are raised, itchy patches that can appear and fade quickly. Learn common triggers, safe next steps, and the swelling symptoms that need urgent medical care.",
    hi: "आर्टिकेरिया (Urticaria) का EAACI 2022 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "અર્ટિકેરિયાનું EAACI 2022 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "आर्टिकेरियाचे EAACI 2022 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Urticaria según los criterios EAACI 2022 y límites de emergencia.",
    ar: "دليل سريري موثوق للشري وفقًا لمعايير EAACI 2022 وحدود السلامة.",
  },
  content: {
    overview:
      "Hives are raised, itchy patches that can change shape, move around, and fade within hours. They can happen after an infection, medicine, food, heat, or pressure, but often no single trigger is found. Deeper swelling is called angioedema and needs particular attention when it affects the face, tongue, or throat.",
    definition:
      "It is a skin reaction that causes short-lived, raised itchy welts. Hives lasting less than six weeks are usually called acute; a repeated pattern lasting longer is called chronic.",
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
      "A pharmacist or clinician may recommend a non-drowsy antihistamine. Recurrent or persistent hives may need a treatment plan and a review of possible triggers. Do not take more than the labelled or prescribed dose unless a clinician specifically tells you to.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for hives or angioedema. It must never delay emergency care or prescribed treatment for swelling or breathing symptoms.",
    lifestyleAdvice:
      "A cool compress, loose clothing, and avoiding heat or scratching can make a flare more comfortable. Keep a simple note of new medicines, foods, infections, and timing if hives keep returning, but do not cut out major food groups without clinical advice.",
    references: ["CIT-0002", "CIT-0019", "CIT-0022", "CIT-0048"],
    faqs: [
      {
        question: "When are hives or swelling an emergency?",
        answer:
          "Call emergency services immediately for trouble breathing, wheeze, throat tightness, a hoarse voice, trouble swallowing, tongue or throat swelling, fainting, severe dizziness, or a rapidly worsening whole-body reaction. Use an adrenaline auto-injector if you have been prescribed one, then seek emergency care.",
      },
      {
        question: "Can homeopathy replace emergency allergy treatment?",
        answer:
          "No. Homeopathy must never replace an adrenaline auto-injector, emergency assessment, or prescribed allergy treatment.",
      },
      {
        question: "When should I seek advice for recurring hives?",
        answer:
          "Arrange a review when hives keep returning, last most days for more than six weeks, leave bruising or marks, or come with joint pain, fever, or other new symptoms. A clinician can help distinguish hives from other rashes and make a safe plan.",
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
    "1.2.0: Reframed the page around transient welts, practical relief, recurring-hives review, and unmistakable emergency signs.",
  ],
};
