import { KnowledgeEntity } from "../../types";

export const AllergicRhinitisDisease: KnowledgeEntity = {
  id: "D0005",
  slug: "allergic-rhinitis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z",
  },
  title: {
    en: "Allergic Rhinitis",
    hi: "एलर्जिक राइनाइटिस (Allergic Rhinitis)",
    gu: "એલર્જિક રાઇનાઇટિસ (Allergic Rhinitis)",
    mr: "ॲलर्जिक राहिनायटिस (Allergic Rhinitis)",
    es: "Rinitis Alérgica",
    ar: "التهاب الأنف التحسسي",
  },
  summary: {
    en: "Allergic rhinitis is a nose-and-eye allergy that often causes sneezing, itching, a blocked nose and clear runny discharge. Learn how to reduce triggers and use treatment safely.",
    hi: "एलर्जिक राइनाइटिस का प्रामाणिक नैदानिक विवरण, एआरआईए 2020 दिशानिर्देश और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "એલર્જિક રાઇનાઇટિસનું ARIA 2020 માર્ગદર્શિકા મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ॲलર્જિક राहिनायटिसचे ARIA 2020 मार्गदर्शक तत्त्वांचे वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Rinitis Alérgica según las pautas ARIA 2020 y límites de seguridad.",
    ar: "دليل سريري موثوق لالتهاب الأنف التحسسي وفقًا لمعايير ARIA 2020 وحدود السلامة.",
  },
  content: {
    overview:
      "Allergic rhinitis, sometimes called hay fever, happens when the immune system reacts to an allergen such as pollen, dust mites, mould or animal dander. It is not contagious and can be seasonal or present all year.",
    definition:
      "It is an allergic inflammation of the inside of the nose. It commonly affects the eyes too and may overlap with asthma or eczema.",
    causes: [
      "IgE-mediated mast cell degranulation triggered by airborne aeroallergens (pollens, dust mites, mold spores, animal dander) [D0005-KEYNOTES, CIT-0038]",
      "Early-phase histamine and leukotriene release causing vasodilation and rhinorrhea",
      "Late-phase eosinophilic and T-lymphocyte mucosal infiltration maintaining chronic nasal congestion",
    ],
    riskFactors: [
      "Personal or family history of atopic diseases (eczema, asthma, allergic conjunctivitis)",
      "Exposure to secondhand environmental tobacco smoke, air pollution, or occupational sensitizers",
      "Early exposure to indoor house dust mites and pet allergens",
    ],
    symptoms: [
      "Paroxysmal sneezing bursts occurring repeatedly upon waking or allergen exposure [D0005-KEYNOTES, CIT-0038]",
      "Profuse, clear, watery nasal discharge (rhinorrhea) with anterior and posterior nasal drip",
      "Bilateral nasal airway obstruction and turbinate hypertrophy",
      "Pruritus of the nose, palate, throat, and conjunctiva with lacrimation",
    ],
    diagnosis:
      "Diagnosed via clinical history of symptoms following allergen exposure, anterior rhinoscopy showing pale bluish boggy turbinates, and allergen-specific IgE testing or skin prick testing [CIT-0038].",
    differentialDiagnosis:
      "Differentiate from non-allergic (vasomotor) rhinitis, infectious rhinosinusitis, rhinitis medicamentosa (overuse of topical decongestants), nasal polyposis, and cerebrospinal fluid (CSF) rhinorrhea.",
    conventionalManagement:
      "Standard therapy includes allergen avoidance, second-generation non-sedating oral H1-antihistamines, intranasal corticosteroid sprays, leukotriene receptor antagonists, and allergen immunotherapy [CIT-0038].",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for allergic rhinitis. It must not replace prescribed treatment or emergency care for breathing or swelling symptoms.",
    lifestyleAdvice:
      "Notice when symptoms occur and reduce personal triggers where practical. Saline rinses can help some people. Ask a pharmacist or clinician about safe use of antihistamines and nasal sprays; do not overuse decongestant sprays.",
    references: ["CIT-0020", "CIT-0021", "CIT-0022", "CIT-0038"],
    faqs: [
      {
        question: "When do allergy symptoms need emergency help?",
        answer:
          "Call emergency services for swelling of the lips, tongue or throat, trouble breathing or swallowing, severe wheeze, faintness or widespread hives with feeling unwell. These are not routine hay-fever symptoms.",
      },
      {
        question: "What is the difference between allergic rhinitis and a common cold?",
        answer:
          "Allergic rhinitis is an IgE-mediated non-infectious allergic response with clear discharge, nasal/eye itching, and absence of fever [D0005-KEYNOTES, CIT-0038]. A common cold is a viral infection presenting with thick discolored mucus, throat pain, body aches, and low-grade fever.",
      },
      {
        question: "How is allergic rhinitis different from a cold?",
        answer:
          "Allergy symptoms are often itchy and repeat around an exposure, usually without fever. Colds are infections and more often cause sore throat, body aches or fever. A clinician can help when symptoms are persistent or unclear.",
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
    specialty: "Clinical Immunology & Allergic Medicine",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-09-24",
  nextClinicalReview: "2027-09-24",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Allergic-Rhinitis", "Disease", "ARIA-2020", "Allergy", "Immunology", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/allergic-rhinitis",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Allergic Rhinitis profile",
    "1.1.0: Upgraded with ARIA 2020 guideline citations (CIT-0038), passage-level claim citations (D0005-KEYNOTES, D0005-EMERGENCY-LIMITS, D0005-REGULATORY-LIMITS), anaphylaxis/laryngeal edema red flags, and safety boundaries",
  ],
};
