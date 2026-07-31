import { KnowledgeEntity } from "../../types";

export const AllergicRhinitisDisease: KnowledgeEntity = {
  id: "D0005",
  slug: "allergic-rhinitis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
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
    en: "An authoritative clinical profile of Allergic Rhinitis covering IgE-mediated upper mucosal inflammation, ARIA 2020 diagnostic criteria, emergency upper airway red flags, and non-replacement safety rules.",
    hi: "एलर्जिक राइनाइटिस का प्रामाणिक नैदानिक विवरण, एआरआईए 2020 दिशानिर्देश और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "એલર્જિક રાઇનાઇટિસનું ARIA 2020 માર્ગદર્શિકા મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ॲलર્જિક राहिनायटिसचे ARIA 2020 मार्गदर्शक तत्त्वांचे वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Rinitis Alérgica según las pautas ARIA 2020 y límites de seguridad.",
    ar: "دليل سريري موثوق لالتهاب الأنف التحسسي وفقًا لمعايير ARIA 2020 وحدود السلامة.",
  },
  content: {
    overview:
      "Allergic rhinitis is an IgE-mediated symptomatic inflammation of the nasal mucosa triggered by allergen exposure [D0005-KEYNOTES, CIT-0038]. It presents with paroxysmal sneezing, watery rhinorrhea, nasal congestion, and conjunctival itching.",
    definition:
      "An IgE-mediated type-I hypersensitivity disorder of the upper respiratory tract characterized by eosinophilic infiltration, histamine release, and mucosal hyper-reactivity.",
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
      "Homeopathic prescribing focuses on acute symptom palliation during seasonal flares and constitutional therapy aimed at desensitizing allergic diathesis.",
    lifestyleAdvice:
      "Implement allergen barrier controls, utilize HEPA air filters, perform daily isotonic saline nasal irrigations, and keep windows closed during high pollen counts.",
    references: ["CIT-0020", "CIT-0021", "CIT-0022", "CIT-0038"],
    faqs: [
      {
        question: "Can homeopathic remedies replace emergency treatment for acute anaphylaxis or severe laryngeal edema?",
        answer:
          "NO. Homeopathy MUST NOT be used to treat acute anaphylaxis, severe laryngeal angioedema, or acute upper airway stridor [D0005-EMERGENCY-LIMITS]. Call emergency medical services immediately for intramuscular epinephrine and ER airway stabilization.",
      },
      {
        question: "What is the difference between allergic rhinitis and a common cold?",
        answer:
          "Allergic rhinitis is an IgE-mediated non-infectious allergic response with clear discharge, nasal/eye itching, and absence of fever [D0005-KEYNOTES, CIT-0038]. A common cold is a viral infection presenting with thick discolored mucus, throat pain, body aches, and low-grade fever.",
      },
      {
        question: "How does homeopathy complement allergic rhinitis management?",
        answer:
          "Micro-diluted homeopathic remedies aim to reduce mucosal hyper-reactivity without causing drowsiness or rebound congestion, used alongside standard environmental controls [D0005-REGULATORY-LIMITS].",
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
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
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
