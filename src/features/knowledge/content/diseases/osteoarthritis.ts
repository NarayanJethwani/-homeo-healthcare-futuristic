import { KnowledgeEntity } from "../../types";

export const OsteoarthritisDisease: KnowledgeEntity = {
  id: "D0017",
  slug: "osteoarthritis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Osteoarthritis (OA)",
    hi: "ऑस्टियोआर्थराइटिस / जोड़ों का घिसना (Osteoarthritis)",
    gu: "ઓસ્ટિઓઆર્થરાઇટિસ (Osteoarthritis)",
    mr: "ऑस्टिओआर्थरायटिस (Osteoarthritis)",
    es: "Osteoartritis",
    ar: "الفيصال العظمي",
  },
  summary: {
    en: "An authoritative clinical profile of Osteoarthritis covering OARSI 2019 guidelines, articular cartilage degradation mechanics, septic arthritis emergency red flags, and surgical referral safety boundaries.",
    hi: "ऑस्टियोआर्थराइटिस का OARSI 2019 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ઓસ્ટિઓઆર્થરાઇટિસનું OARSI 2019 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ऑस्टिओआर्थरायटिसचे OARSI 2019 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Osteoartritis según los criterios OARSI 2019 y límites de emergencia.",
    ar: "دليل سريري موثوق للفيصال العظمي وفقًا لمعايير OARSI 2019 وحدود السلامة.",
  },
  content: {
    overview:
      "Osteoarthritis (OA) is a degenerative joint disease characterized by progressive loss of articular cartilage, subchondral bone remodeling, osteophyte formation, and low-grade synovial inflammation [D0017-KEYNOTES, CIT-0049]. OARSI 2019 prioritizes non-pharmacological biomechanical care.",
    definition:
      "A chronic joint disorder involving structural breakdown of hyaline cartilage, osteophyte proliferation, capsular thickening, and mechanical pain in weight-bearing joints (knees, hips, spine, hand PIP/DIP joints).",
    causes: [
      "Age-related wear, biomechanical joint overload, and chondrocyte senescence [D0017-KEYNOTES, CIT-0049]",
      "Prior joint trauma (meniscal tears, ligamentous tears, intra-articular fractures)",
      "Obesity increasing mechanical load and secreting pro-inflammatory adipokines",
    ],
    riskFactors: [
      "Advanced age (≥50 years), female sex (post-menopausal), and obesity",
      "Repetitive occupational joint stress or competitive high-impact sports",
      "Joint dysplasia, malalignment (varus/valgus knee deformities), and family history",
    ],
    symptoms: [
      "Use-related joint pain worsening with activity and relieved by rest [D0017-KEYNOTES, CIT-0049]",
      "Brief morning stiffness (<30 minutes) and gel phenomenon after inactivity",
      "Bony enlargement (Heberden's nodes at DIP joints, Bouchard's nodes at PIP joints), crepitus, and restricted range of motion",
    ],
    diagnosis:
      "Diagnosed clinically (pain, age ≥50, stiffness <30m, crepitus, bony enlargement) and confirmed via weight-bearing radiographs showing joint space narrowing, subchondral sclerosis, osteophytes, and subchondral cysts [CIT-0049].",
    differentialDiagnosis:
      "Differentiate Osteoarthritis from Rheumatoid Arthritis (symmetric PIP/MCP inflammation, morning stiffness >1h), Gout/CPPD Pseudogout, Septic Arthritis, and Polymyalgia Rheumatica.",
    conventionalManagement:
      "Management includes biomechanical therapy (weight loss, low-impact exercise, quadriceps strengthening, knee braces), topical NSAIDs, oral acetaminophen/NSAIDs, intra-articular corticosteroid or hyaluronic acid injections, and total joint arthroplasty for end-stage destruction [CIT-0049].",
    homeopathicApproach:
      "Homeopathic remedies (such as Rhus Toxicodendron, Bryonia Alba, Calcarea Fluorica, Ruta Graveolens) act as supportive care to soothe mechanical joint stiffness, improve mobility, and reduce weather-change sensitivity alongside physical rehabilitation.",
    lifestyleAdvice:
      "Perform low-impact aerobic exercise (swimming, cycling), achieve weight reduction, wear supportive shock-absorbing footwear, and utilize thermal therapy (warm baths/ice packs).",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0049"],
    faqs: [
      {
        question: "When does acute joint pain in Osteoarthritis indicate a surgical or medical emergency?",
        answer:
          "Sudden acute onset of a hot, red, swollen single joint with high fever and inability to bear weight indicates SEPTIC ARTHRITIS [D0017-EMERGENCY-LIMITS, CIT-0049]. Also, sudden bowel/bladder incontinence or lower limb paralysis in spine OA indicates CAUDA EQUINA SYNDROME. Both are MEDICAL EMERGENCIES requiring IMMEDIATE ER EVALUATION.",
      },
      {
        question: "Can homeopathic remedies replace joint replacement surgery in end-stage osteoarthritis?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace joint replacement surgery (arthroplasty) in severe end-stage bone-on-bone joint destruction or delay orthopedic consultation [D0017-REGULATORY-LIMITS].",
      },
      {
        question: "How does homeopathy integrate with standard physical therapy for osteoarthritis?",
        answer:
          "Homeopathy serves as complementary pain support while patients remain under standard physical therapy, weight management, and orthopedic supervision [D0017-REGULATORY-LIMITS].",
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
    specialty: "Rheumatology & Orthopedic Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Osteoarthritis", "Disease", "OARSI-2019", "Rheumatology", "Joint-Pain", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/osteoarthritis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Osteoarthritis profile",
    "1.1.0: Upgraded with OARSI 2019 evidence citations (CIT-0049), passage-level claim citations (D0017-KEYNOTES, D0017-EMERGENCY-LIMITS, D0017-REGULATORY-LIMITS), septic arthritis and cauda equina red flags, and joint replacement safety boundaries",
  ],
};
