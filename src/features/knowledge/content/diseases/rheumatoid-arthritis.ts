import { KnowledgeEntity } from "../../types";

export const RheumatoidArthritisDisease: KnowledgeEntity = {
  id: "D0022",
  slug: "rheumatoid-arthritis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Rheumatoid Arthritis (RA)",
    hi: "संधिशोथ / रूमैटॉइड आर्थराइटिस (Rheumatoid Arthritis)",
    gu: "સંધિવા / રૂમેટોઇડ આર્થરાઇટિસ (Rheumatoid Arthritis)",
    mr: "आमवाढ / रूमॅटॉइड आर्थरायटिस (Rheumatoid Arthritis)",
    es: "Artritis Reumatoide",
    ar: "التهاب المفاصل الروماتويدي",
  },
  summary: {
    en: "An authoritative clinical profile of Rheumatoid Arthritis covering EULAR 2023 recommendations, ACPA/RF autoantibody synovitis mechanisms, atlantoaxial subluxation and systemic vasculitis emergency red flags, and DMARD non-discontinuation safety boundaries.",
    hi: "रूमैटॉइड आर्थराइटिस (RA) का EULAR 2023 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "રૂમેટોઇડ આર્થરાઇટિસનું EULAR 2023 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "रूमॅटॉइड आर्थरायटिसचे EULAR 2023 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Artritis Reumatoide según los criterios EULAR 2023 y límites de emergencia.",
    ar: "دليل سريري موثوق لالتهاب المفاصل الروماتويدي وفقًا لمعايير EULAR 2023 وحدود السلامة.",
  },
  content: {
    overview:
      "Rheumatoid Arthritis (RA) is a chronic, systemic autoimmune inflammatory polyarthritis characterized by persistent symmetric synovitis, synovial pannus formation, cartilage degradation, and marginal bone erosions [D0022-KEYNOTES, CIT-0052]. EULAR 2023 emphasizes early disease-modifying therapy within the 'window of opportunity'.",
    definition:
      "A systemic autoimmune polyarthritis marked by symmetrical inflammatory synovitis of peripheral small joints (MCP, PIP, wrist, MTP), autoantibody positivity (ACPA, RF), and progressive articular erosion.",
    causes: [
      "Autoimmune loss of self-tolerance targeting citrullinated peptides (ACPA) and IgG Fc (Rheumatoid Factor) [D0022-KEYNOTES, CIT-0052]",
      "Synovial pannus formation driven by TNF-α, IL-6, and IL-1 pro-inflammatory cytokine networks",
      "Genetic predisposition (HLA-DRB1 shared epitope) interacting with environmental triggers (tobacco smoking, periodontitis)",
    ],
    riskFactors: [
      "Female sex (3:1 female-to-male ratio), age 30-60 years, and HLA-DRB1 shared epitope alleles",
      "Cigarette smoking (major environmental trigger for protein citrullination)",
      "First-degree family history of RA or autoimmune collagen vascular diseases",
    ],
    symptoms: [
      "Symmetrical pain, swelling, and warmth in small joints of hands (MCP, PIP) and feet (MTP) [D0022-KEYNOTES, CIT-0052]",
      "Prolonged morning joint stiffness lasting >1 hour, improving with activity",
      "Extra-articular signs: Subcutaneous rheumatoid nodules, keratoconjunctivitis sicca, pleural effusion, and systemic fatigue",
    ],
    diagnosis:
      "Diagnosed via 2010 ACR/EULAR Classification Criteria (joint involvement, serology - ACPA/RF, acute-phase reactants - ESR/CRP, symptom duration ≥6 weeks) and plain radiographs/ultrasound showing marginal erosions [CIT-0052].",
    differentialDiagnosis:
      "Differentiate RA from Osteoarthritis (DIP joint involvement, stiffness <30m), Psoriatic Arthritis, Systemic Lupus Erythematosus (non-erosive Jaccoud arthropathy), Gout, and Parvovirus B19 viral polyarthritis.",
    conventionalManagement:
      "Management follows EULAR 2023 treat-to-target protocols starting with conventional synthetic DMARDs (methotrexate, leflunomide, sulfasalazine), progressing to biologic DMARDs (anti-TNF, anti-IL-6, abatacept, rituximab) or targeted synthetic JAK inhibitors (tofacitinib, baricitinib) [CIT-0052].",
    homeopathicApproach:
      "Homeopathic remedies (such as Actaea Spicata, Rhus Toxicodendron, Caulophyllum, Antimonium Crudum, Pulsatilla) serve as supportive constitutional care to manage morning joint stiffness, relieve inflammatory discomfort, and improve functional mobility alongside rheumatological management.",
    lifestyleAdvice:
      "Perform gentle joint range-of-motion exercises, quit tobacco smoking immediately, adopt an anti-inflammatory Mediterranean diet, and protect joints with splints during acute flares.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0052"],
    faqs: [
      {
        question: "When is Rheumatoid Arthritis considered a severe neurological or vascular emergency requiring immediate hospitalization?",
        answer:
          "Severe neck pain with upper/lower extremity numbness, gait ataxia, or paresthesias (Atlantoaxial Subluxation / Cervical Myelopathy) or digital ischemic gangrene / mononeuritis multiplex (Rheumatoid Vasculitis) is a RHEUMATOLOGICAL AND NEUROLOGICAL EMERGENCY [D0022-EMERGENCY-LIMITS, CIT-0052]. It requires IMMEDIATE ER evaluation and neurosurgical/rheumatological intervention.",
      },
      {
        question: "Can homeopathic remedies replace prescribed DMARDs (methotrexate) or biologic therapy in rheumatoid arthritis?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace prescribed Disease-Modifying Antirheumatic Drugs (DMARDs) or biologics in active rheumatoid arthritis [D0022-REGULATORY-LIMITS]. Delaying DMARD therapy leads to irreversible joint erosions and permanent disability.",
      },
      {
        question: "How does homeopathy integrate with standard rheumatology care?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard rheumatology care, regular blood monitoring (CBC, LFTs, CRP), and radiographic joint tracking [D0022-REGULATORY-LIMITS].",
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
    specialty: "Rheumatology & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Rheumatoid-Arthritis", "Disease", "EULAR-2023", "Rheumatology", "DMARDs", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/rheumatoid-arthritis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Rheumatoid Arthritis profile",
    "1.1.0: Upgraded with EULAR 2023 evidence recommendations (CIT-0052), passage-level claim citations (D0022-KEYNOTES, D0022-EMERGENCY-LIMITS, D0022-REGULATORY-LIMITS), atlantoaxial subluxation / vasculitis red flags, and DMARD safety boundaries",
  ],
};
