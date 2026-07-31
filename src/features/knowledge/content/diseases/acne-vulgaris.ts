import { KnowledgeEntity } from "../../types";

export const AcneVulgarisDisease: KnowledgeEntity = {
  id: "D0014",
  slug: "acne-vulgaris",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Acne Vulgaris",
    hi: "मुहासे / एक्ने वर्लगारिस (Acne Vulgaris)",
    gu: "ખીલ / એક્ને વલ્ગારિસ (Acne Vulgaris)",
    mr: "कीळ / ॲक्ने व्हल्गारिस (Acne Vulgaris)",
    es: "Acné Vulgar",
    ar: "حب الشباب الشائع",
  },
  summary: {
    en: "An authoritative clinical profile of Acne Vulgaris covering AAD 2024 evidence guidelines, Cutibacterium acnes follicular dynamics, acne fulminans emergency red flags, and isotretinoin safety boundaries.",
    hi: "मुहासों (Acne Vulgaris) का AAD 2024 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ખીલનું AAD 2024 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ॲक्ने व्हल्गारिसचे AAD 2024 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Acné Vulgar según los criterios AAD 2024 y límites de emergencia.",
    ar: "دليل سريري موثوق لحب الشباب وفقًا لمعايير AAD 2024 وحدود السلامة.",
  },
  content: {
    overview:
      "Acne Vulgaris is a chronic inflammatory dermatosis of the pilosebaceous unit characterized by follicular hyperkeratinization, seborrhea, Cutibacterium acnes proliferation, and inflammatory papules, pustules, nodules, or cysts [D0014-KEYNOTES, CIT-0046]. AAD 2024 classifies severity as mild, moderate, or severe.",
    definition:
      "A chronic multifactorial inflammatory disorder of hair follicles and sebaceous glands leading to comedones, inflammatory papulopustules, deep nodulocysts, and potential scarring.",
    causes: [
      "Androgen-driven seborrhea and altered sebum lipid composition [D0014-KEYNOTES, CIT-0046]",
      "Abnormal follicular infundibular hyperkeratinization blocking sebum outflow",
      "Follicular colonization by Cutibacterium acnes triggering innate and adaptive cutaneous immunity",
    ],
    riskFactors: [
      "Adolescent and young adult hyperandrogenemia or PCOS",
      "Family history of severe nodulocystic acne and keloidal scarring",
      "Use of comedogenic cosmetics, topical corticosteroids, or systemic medications (lithium, anticonvulsants)",
    ],
    symptoms: [
      "Non-inflammatory comedones (open blackheads, closed whiteheads) and inflammatory papules/pustules [D0014-KEYNOTES, CIT-0046]",
      "Painful deep erythematous nodulocysts located on face, chest, upper back, and shoulders",
      "Post-inflammatory hyperpigmentation (PIH), erythematous macules, and permanent atrophic/hypertrophic scarring",
    ],
    diagnosis:
      "Diagnosed clinically via skin examination assessing lesion type, distribution, and severity grading (Global Acne Grading System). Hormonal evaluation (testosterone, DHEAS) indicated if hyperandrogenism signs exist [CIT-0046].",
    differentialDiagnosis:
      "Differentiate Acne Vulgaris from Rosacea, Folliculitis (Malassezia/bacterial), Perioral Dermatitis, Hidradenitis Suppurativa, and Drug-Induced Acneiform Eruptions.",
    conventionalManagement:
      "Management includes topical benzoyl peroxide, topical retinoids (adapalene, tretinoin), topical/oral antibiotics (doxycycline), hormonal therapy (COCPs, spironolactone), and oral isotretinoin for severe recalcitrant nodulocystic acne [CIT-0046].",
    homeopathicApproach:
      "Homeopathic remedies (such as Hepar Sulphuris, Silicea, Sulphur, Pulsatilla, Berberis Aquifolium) act as supportive constitutional therapy to soothe cutaneous inflammation, reduce pustular suppurative tendency, and promote skin healing alongside dermatological evaluation.",
    lifestyleAdvice:
      "Cleanse face twice daily with a mild non-comedogenic cleanser, avoid aggressive scrubbing or popping lesions, apply oil-free sunscreen, and consume a balanced low-glycemic diet.",
    references: ["CIT-0002", "CIT-0019", "CIT-0022", "CIT-0046"],
    faqs: [
      {
        question: "When does severe Acne require emergency dermatological hospitalization?",
        answer:
          "Sudden explosive onset of ulcerative, necrotizing, hemorrhagic acne nodules accompanied by high fever, polyarthralgias, and systemic leukocytosis indicates ACNE FULMINANS [D0014-EMERGENCY-LIMITS, CIT-0046]. This is a DERMATOLOGICAL EMERGENCY requiring IMMEDIATE ER evaluation.",
      },
      {
        question: "Can homeopathic remedies replace prescribed systemic isotretinoin or dermatological supervision?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace prescribed systemic isotretinoin in severe scarring nodulocystic acne or delay dermatological supervision [D0014-REGULATORY-LIMITS]. Delaying effective treatment in severe nodular acne risks permanent facial scarring.",
      },
      {
        question: "How does homeopathy integrate with standard dermatological acne care?",
        answer:
          "Homeopathy serves as complementary constitutional support while patients remain under standard dermatological care and non-comedogenic skin hygiene protocols [D0014-REGULATORY-LIMITS].",
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
  ],
};
