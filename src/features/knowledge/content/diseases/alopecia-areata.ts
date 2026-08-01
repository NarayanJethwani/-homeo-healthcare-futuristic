import { KnowledgeEntity } from "../../types";

export const AlopeciaAreataDisease: KnowledgeEntity = {
  id: "D0035",
  slug: "alopecia-areata",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Alopecia Areata",
    hi: "एलोपेशिया एरीटा / बाल झड़ने की बीमारी (Alopecia Areata)",
    gu: "એલોપેસિયા એરિયાટા / પેચમાં વાળ ખરવા (Alopecia Areata)",
    mr: "एलोपेशिया एरियटा / चट्टे पडणे (Alopecia Areata)",
    es: "Alopecia Areata",
    ar: "الثعلبة البقعية",
  },
  summary: {
    en: "An authoritative clinical profile of Alopecia Areata covering AAD 2022 guidelines, CD8+ T-cell immune privilege collapse mechanics, systemic JAK inhibitor safety monitoring, and cicatricial alopecia differential boundaries.",
    hi: "एलोपेशिया एरीटा (Alopecia Areata) का AAD 2022 मानकों के अनुसार प्रामाणिक विवरण और सुरक्षा सीमाएँ।",
    gu: "એલોપેસિયા એરિયાટાનું AAD 2022 ધોરણો મુજબનું નૈદાનિક વિવરણ અને સુરક્ષા સીમાઓ.",
    mr: "एलोपेशिया एरियटाचे AAD 2022 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Alopecia Areata según los criterios AAD 2022 y límites de emergencia.",
    ar: "دليل سريري موثوق للثعلبة البقعية وفقًا لمعايير AAD 2022 وحدود السلامة.",
  },
  content: {
    overview:
      "Alopecia Areata (AA) is an autoimmune non-scarring hair loss condition characterized by well-demarcated patches of hair loss on the scalp or body [D0035-KEYNOTES, CIT-0059]. AAD 2022 guidelines detail topical, intralesional, and systemic targeted immunomodulatory care.",
    definition:
      "An autoimmune disease of hair follicles driven by breakdown of immune privilege in the anagen hair bulb, mediated by CD8+ NKG2D+ T-lymphocytes, leading to hair cycle disruption without follicular scarring.",
    causes: [
      "Autoimmune attack against hair follicle autoantigens following collapse of hair follicle immune privilege [D0035-KEYNOTES, CIT-0059]",
      "Interferon-gamma (IFN-γ) and IL-15 pro-inflammatory signaling pathways",
      "Genetic susceptibility (HLA-DRB1, DQB1) combined with environmental triggers (viral infection, acute psychological stress)",
    ],
    riskFactors: [
      "Family history of Alopecia Areata or personal history of autoimmune disorders (Vitiligo, Hashimoto's Thyroiditis, Type 1 Diabetes, Celiac Disease)",
      "Atopic diathesis (eczema, allergic rhinitis, asthma)",
      "Severe acute emotional trauma or physical systemic illness",
    ],
    symptoms: [
      "Abrupt onset of smooth, round or oval non-scarring patches of complete hair loss [D0035-KEYNOTES, CIT-0059]",
      "Presence of short, tapered 'exclamation mark hairs' at the periphery of expanding lesions",
      "Nail changes: Pitting, trachyonychia (rough nails), red lunulae, and longitudinal ridging",
    ],
    diagnosis:
      "Diagnosed by clinical inspection and dermoscopy (trichoscopy showing yellow dots, black dots, exclamation mark hairs). Scalp biopsy and screening for thyroid autoantibodies (TPO) and serum TSH are performed when co-occurring systemic autoimmunity is suspected [CIT-0059].",
    differentialDiagnosis:
      "Differentiate Alopecia Areata from Tinea Capitis (fungal infection with scaling/black dots), Trichotillomania (hair-pulling disorder), Telogen Effluvium, Androgenetic Alopecia, and Cicatricial Scarring Alopecia (Lichen Planopilaris, Discoid Lupus).",
    conventionalManagement:
      "Management options include intralesional corticosteroid injections (triamcinolone acetonide), topical high-potency corticosteroids, topical immunotherapy (DPCP), topical minoxidil, and oral Janus Kinase (JAK) inhibitors (baricitinib, ritlecitinib) for severe extensive disease [CIT-0059].",
    homeopathicApproach:
      "Homeopathic remedies (such as Acidum Flouricum, Phosphorus, Natrum Muriaticum, Lycopodium, Vinca Minor) serve as supportive constitutional care to modulate immune reactivity, encourage follicular regrowth, and address emotional stress alongside dermatological care.",
    lifestyleAdvice:
      "Protect exposed scalp patches with sunblock (SPF 30+) or headwear, avoid harsh chemical hair treatments, practice stress reduction, and maintain balanced nutrition.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0059"],
    faqs: [
      {
        question: "When does rapid hair loss indicate a severe dermatological condition or scarring scalp disease?",
        answer:
          "Rapid fulminant shedding causing total scalp loss (Alopecia Totalis) or full body hair loss (Alopecia Universalis), or painful scalp erythema, pustules, and scarring (CICATRICIAL ALOPECIA) requires URGENT DERMATOLOGICAL EVALUATION [D0035-EMERGENCY-LIMITS, CIT-0059]. Scarring destruction of hair follicles is IRREVERSIBLE if untreated.",
      },
      {
        question: "Can homeopathic remedies replace dermatological dermoscopy, blood screens, or prescribed JAK inhibitors in severe cases?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace diagnostic dermoscopy, autoimmune thyroid screening, or prescribed systemic immunomodulatory therapy in severe rapidly progressing disease [D0035-REGULATORY-LIMITS].",
      },
      {
        question: "How does homeopathy integrate with standard dermatological care for alopecia areata?",
        answer:
          "Homeopathy serves as complementary constitutional support while patients remain under standard dermatological follow-up, trichoscopy tracking, and autoimmune screening [D0035-REGULATORY-LIMITS].",
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
  tags: ["Alopecia-Areata", "Disease", "AAD-2022", "Dermatology", "Autoimmune", "Hair-Loss", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/alopecia-areata",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Alopecia Areata profile",
    "1.1.0: Upgraded with AAD 2022 evidence citations (CIT-0059), passage-level claim citations (D0035-KEYNOTES, D0035-EMERGENCY-LIMITS, D0035-REGULATORY-LIMITS), alopecia totalis / scarring red flags, and immunomodulatory safety boundaries",
  ],
};
