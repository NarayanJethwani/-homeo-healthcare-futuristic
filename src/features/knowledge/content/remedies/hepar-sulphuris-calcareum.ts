import { KnowledgeEntity } from "../../types";

export const HeparSulphurisCalcareumRemedy: KnowledgeEntity = {
  id: "R0013",
  slug: "hepar-sulphuris-calcareum",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-01T12:00:00Z",
    reviewed: "2026-08-01T12:00:00Z",
  },
  title: {
    en: "Hepar Sulphuris Calcareum (Hahnemann's Calcium Sulfide)",
    hi: "हेपर सल्फर (कैल्शियम सल्फाइड)",
    gu: "હેપર સલ્ફરિકમ (કેલ્શિયમ સલ્ફાઇડ)",
    mr: "हेपर सल्फर (Hepar Sulphur)",
    es: "Hepar Sulphuris Calcareum (Sulfuro de Calcio)",
    ar: "هيبار سلفوريس كالكاريوم (Hepar Sulf)"
  },
  summary: {
    en: "A cardinal suppurative, respiratory, and hypersensitive mineral polychrest in classical homeopathy, indicated for extreme sensitivity to cold drafts, splinter-like sticking pains, abscess formation with thick sour pus, and intense touch sensitivity.",
    hi: "होम्योपैथी में ठंडी हवा से अत्यधिक संवेदनशीलता, सुई चुभने जैसा दर्द, और मवाद या फोड़े की प्रमुख दवा.",
    gu: "ઠંડા પવનથી અતિશય સંવેદનશીલતા, કાંટો વાગ્યા જેવો દુખાવો અને પરુવાળા ચાંદા/ફોડલી માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "थंड हवेचा त्रास, सुई टोचल्यासारखी वेदना आणि जखमेत पू होण्याच्या प्रवृत्तीवर अत्यंत गुणकारी औषध.",
    es: "Un remedio mineral fundamental en homeopatía para la supuración, dolor como astilla, extrema sensibilidad al aire frío y al tacto.",
    ar: "علاج معدني رئيسي في المعالجة المثلية للحالات القيحية، الآلام كالظفر، والحساسية الفائقة للهواء البارد."
  },
  content: {
    latinName: "Hepar sulphuris calcareum",
    commonName: "Hahnemann's Calcium Sulfide / Liver of Sulphur",
    source: "Chemical compound prepared by fusing equal parts of finely powdered oyster shells (Calcarea carbonica) and sublimed sulphur, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Hepar sulphuris calcareum is a profound antipsoric and antisycotic mineral polychrest introduced by Samuel Hahnemann. Celebrated for its unique action on suppurative tissue inflammation, extreme chilliness, pain as if a splinter were stuck in the part, and intense mental and physical hyper-reactivity to cold air and touch.",
    keynotes: [
      "Extreme hypersensitivity to cold drafts, uncovering, and physical touch; patient wraps up head tightly",
      "Sticking, sharp, splinter-like pain in affected parts (tonsils, skin ulcers, ear canal)",
      "Marked tendency to suppuration and abscess formation with thick yellow offensive pus smelling of old cheese",
      "Profuse sour-smelling perspiration from least exertion without temperature drop or relief",
      "Irascible, violent temper; impetuous impulse to hurt or destroy from trivial contradiction",
      "Croupy, rattling, choking cough worse from exposure to cold dry wind or uncovering a hand",
    ],
    mentalSymptoms: [
      "Extreme irritability and anger; passion drives patient to violent impulses",
      "Hypersensitive mind; offended by mildest remark or slightest contradiction",
      "Anxious, hasty speech and hasty action",
    ],
    physicalSymptoms: [
      "Suppurative tonsillitis and pharyngitis with sharp splinter pain extending to ear on swallowing",
      "Chronic otitis media with offensive purulent discharge and tenderness over mastoid",
      "Skin unhealthy; every small injury or cut suppurates and heals slowly",
      "Chronic rhinitis with thick yellow fetid purulent nasal discharge",
    ],
    generalities:
      "Extremely chilly patient; cannot bear uncovering even a single hand or foot. Ameliorated by moist heat and wrapping up warmly.",
    modalitiesBetter: [
      "Warmth of bed, hot moist compresses, and heavy clothing",
      "Wrapping head up in warm scarf",
      "Damp warm weather",
    ],
    modalitiesWorse: [
      "Cold dry wind, cold air, and drafts of air",
      "Uncovering any part of body (even hand/foot)",
      "Touch and pressure on affected part",
      "Lying on painful side",
    ],
    clinicalUses: [
      "Management of acute suppurative tonsillitis, quinsy, skin boils, and furuncles",
      "Supportive care in croupous bronchitis, otitis media, and purulent sinusitis",
    ],
    organAffinity: [
      "Skin and subcutaneous cellular tissue",
      "Upper and lower respiratory tract (larynx, bronchi)",
      "Lymphatic system and tonsils",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis",
      "Syphilis"
    ],
    constitution:
      "Suited to scrofulous, lymphatic individuals with pale skin, flabby muscles, and extreme cold intolerance.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Prepared from calcium sulfide by trituration according to official pharmacopoeial standards. Homeopathic potentized dilutions (6C, 30C, 200C) are non-toxic. High potencies (200C, 1M) favor resolution without suppuration, while low potencies (3C, 6C) promote pus maturation. Medical evaluation is essential for deep fascial or internal abscesses.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What pain sensation is characteristic of Hepar Sulph?",
        "answer": "A classic keynote sensation of Hepar Sulph is sharp, sticking pain as if a wooden splinter or fishbone were lodged in the inflamed tissue."
      },
      {
        "question": "How does potency affect suppurative abscesses in Hepar Sulph?",
        "answer": "In classical homeopathic practice, lower potencies (3C-6C) promote suppuration and pus discharge, while higher potencies (200C-1M) favor reabsorption and resolution of early inflammation."
      }
    ]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Suppurative & Respiratory Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Hepar Sulph", "Remedy", "Suppuration", "Splinter Pain", "Cold Draft Sensitivity"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/hepar-sulphuris-calcareum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with suppurative keynotes, splinter sensation, and classical citations"],
  clinicalPearl: "Hepar Sulph is indicated in suppurative states with splinter-like pain, extreme intolerance to cold drafts, and skin that heals poorly.",
  quickFacts: {
    "Latin Name": "Hepar sulphuris calcareum",
    "Common Name": "Hahnemann's Calcium Sulfide",
    "Source Kingdom": "Mineral",
    "Thermal State": "Extremely chilly (Must wrap up)"
  },
  aiReadiness: {
    retrievalSummary: "Hepar sulphuris calcareum is a major mineral homeopathic polychrest indicated for extreme sensitivity to cold drafts, splinter-like sticking pains, abscess suppuration with sour pus, and touch intolerance.",
    clinicalSummary: "Prepared from fused oyster shell and sulphur. Homeopathic potentized dilutions are safe and non-toxic. Primary clinical affinities include skin, subcutaneous tissues, respiratory tract, and lymphatic glands.",
    patientSummary: "Hepar sulphuris is a homeopathic remedy used for painful boils, ear infections, or sore throats with sharp splinter-like pain and extreme sensitivity to cold wind.",
    studentSummary: "Guiding keynotes include sharp splinter-like pain, extreme sensitivity to cold drafts, suppuration with old-cheese smelling pus, violent temper, and aggravation from uncovering.",
    keywords: ["hepar sulph", "calcium sulfide", "suppuration", "splinter pain", "chilly remedy"],
    semanticKeywords: ["suppurative polychrest", "abscess remedy", "splinter-sensation remedy"],
    bodySystem: "Skin & Respiratory",
    urgency: "routine"
  }
};
