import { KnowledgeEntity } from "../../types";

const ECZEMA_CITATIONS = ["CIT-0149", "CIT-0150", "CIT-0023"];

export const EczemaDisease: KnowledgeEntity = {
  id: "D0002",
  slug: "eczema",
  entityType: "disease",
  editorialStatus: "published",
  legacyVerificationStatus: "verified-published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z",
  },
  title: {
    en: "Atopic Dermatitis (Eczema)",
    hi: "एक्जिमा (खुजलीदार त्वचा रोग)",
    gu: "ખરજવું અને ત્વચાના રોગો (Eczema)",
    mr: "खरूज आणि त्वचेचे आजार (Eczema)",
    es: "Dermatitis Atópica (Eczema)",
    ar: "الأكزيما (Eczema)",
  },
  summary: {
    en: "Eczema is a common, non-contagious condition that makes skin dry, itchy and inflamed. Learn how to care for the skin barrier, manage flares and recognise signs of infection.",
    hi: "त्वचा की एक पुरानी सूजन संबंधी बीमारी जिसमें त्वचा पर लाल, सूखी और तीव्र खुजलीदार पपड़ीदार परतें बन जाती हैं।",
    gu: "લાંબા ગાળાનો ત્વચાનો સોજો, જેનાથી ત્વચા લાલ, સુકી અને તીવ્ર ખંજવાળવાળી થાય છે. આ અન્નનળી અને એલર્જી સાથે જોડાયેલ હોય છે.",
    mr: "त्वचेचा एक जुनाट दाहयुक्त आजार, ज्यामध्ये त्वचा कोरडी पडते, लाल डाग आणि तीव्र खाज निर्माण होते.",
    es: "Una condición crónica e inflamatoria de la piel caracterizada por parches secos, rojos y con picazón intensa.",
    ar: "حالة جلدية مزمنة والتهابية تتميز بوجود بقع جافة وحمراء ومثيرة للحكة شديدة.",
  },
  content: {
    overview:
      "Atopic dermatitis, usually called eczema, is a common, non-contagious condition that causes dry, itchy and inflamed skin. It tends to come and go. Daily skin-barrier care and a plan for flares can make a meaningful difference, while severe or infected-looking skin needs medical review.",
    definition:
      "Eczema is a long-term inflammatory skin condition. It can cause itch, dryness, rough or scaly patches, changes in colour, weeping or crusting. It can look different on different skin tones, so warmth, swelling, texture, pain and itch are also important clues.",
    causes: [
      "A skin barrier that loses moisture easily and reacts more strongly to everyday irritants",
      "A family or personal history of eczema, asthma, hay fever or sensitive skin",
      "Individual triggers such as fragranced products, harsh cleansers, dry air, overheating, sweat, rough fabrics, infection or stress",
    ],
    riskFactors: [
      "A personal or family history of eczema, asthma, hay fever or sensitive skin",
      "Frequent exposure to irritants, dry air, heat, sweat or rough fabrics",
      "Repeated scratching and cracks in the skin, which can make infection more likely",
    ],
    symptoms: [
      "Itch that can be worse at night and interrupt sleep",
      "Dry, rough, scaly or cracked areas; redness may be less visible on darker skin tones",
      "Small bumps, colour changes, warmth, swelling, weeping, crusting or thickened skin after repeated scratching",
      "Patches often affect the face, hands, neck, elbows, knees or skin folds, but can occur elsewhere",
    ],
    diagnosis:
      "A clinician usually diagnoses eczema from the story and skin examination. They may consider other causes—such as contact dermatitis, psoriasis, scabies or a fungal infection—when the pattern is unusual, severe or not improving. Testing is tailored to the history rather than done routinely.",
    differentialDiagnosis:
      "Important alternatives include allergic contact dermatitis, seborrheic dermatitis, psoriasis, scabies infestation, cutaneous fungal infections, and severe immunodeficiency syndromes.",
    labTests: [],
    imaging: "Imaging is not indicated for uncomplicated atopic dermatitis.",
    redFlags: [
      "Rapidly spreading painful blisters or punched-out sores, especially with fever or feeling very unwell: seek emergency care promptly",
      "Widespread redness or peeling, severe pain, fever or chills: seek urgent medical care",
      "Yellow or honey-coloured crusts, pus, increasing warmth, swelling, red streaks, pain or fever: arrange prompt medical review for possible infection",
    ],
    conventionalManagement:
      "A treatment plan is individual. It commonly includes frequent fragrance-free cream or ointment to protect the skin barrier, plus prescribed anti-inflammatory treatment for flares when needed. Dermatology care may include other treatments for eczema that is severe, widespread or not responding to first steps.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for atopic dermatitis or its complications. It must not replace diagnostic evaluation, emergency care, proven barrier emollients, or prescription topical anti-inflammatory therapy. Patients considering complementary care should inform their dermatologist.",
    lifestyleAdvice:
      "Use a thick, fragrance-free cream or ointment after a short warm—not hot—bath or shower and whenever the skin feels dry. Choose gentle cleanser only where needed, avoid known irritants, wear soft breathable clothing and keep fingernails short. Introduce one new skin product at a time and stop it if it clearly worsens the skin.",
    references: ECZEMA_CITATIONS,
    claimCitations: [
      {
        claimId: "D0002-DEFINITION",
        passage: "overview; definition",
        citationIds: ["CIT-0149", "CIT-0150"],
      },
      {
        claimId: "D0002-PATHOPHYSIOLOGY",
        passage: "causes; riskFactors",
        citationIds: ["CIT-0149", "CIT-0150"],
      },
      {
        claimId: "D0002-SYMPTOMS",
        passage: "symptoms",
        citationIds: ["CIT-0150"],
      },
      {
        claimId: "D0002-DIAGNOSIS",
        passage: "diagnosis; differentialDiagnosis",
        citationIds: ["CIT-0149", "CIT-0150"],
      },
      {
        claimId: "D0002-EMERGENCY-BOUNDARY",
        passage: "redFlags",
        citationIds: ["CIT-0150"],
      },
      {
        claimId: "D0002-CONVENTIONAL-MANAGEMENT",
        passage: "conventionalManagement",
        citationIds: ["CIT-0149", "CIT-0150"],
      },
      {
        claimId: "D0002-LIFESTYLE",
        passage: "lifestyleAdvice",
        citationIds: ["CIT-0149"],
      },
      {
        claimId: "D0002-HOMEOPATHY-BOUNDARY",
        passage: "homeopathicApproach",
        citationIds: ["CIT-0023"],
      },
    ],
    faqs: [
      {
        question: "Is eczema contagious?",
        answer:
          "No. Eczema itself does not spread from person to person. However, cracked or scratched skin can become infected, so increasing pain, warmth, swelling, pus, fever or rapidly spreading crusts need medical advice.",
      },
      {
        question: "What is the simplest daily eczema routine?",
        answer:
          "Keep it simple: use a thick fragrance-free cream or ointment after a short warm bath or shower and again whenever skin feels dry; use gentle cleanser only where needed; avoid personal irritants; and follow any prescribed flare treatment exactly as directed.",
      },
      {
        question: "When does an eczema flare need urgent care?",
        answer:
          "Get urgent help for rapidly spreading painful blisters or punched-out sores, especially with fever or feeling very unwell. Prompt medical advice is also important for yellow crusts, pus, increasing warmth, swelling, red streaks, pain or fever.",
      },
      {
        question: "Can homeopathy cure atopic dermatitis or replace dermatological care?",
        answer:
          "No. Reliable clinical evidence has not established homeopathy as a cure or replacement for medical dermatological evaluation, proven barrier repair, or anti-inflammatory treatment.",
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
    specialty: "Clinical Homeopathy & Dermatology",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final authorization",
  lastClinicalReview: "2026-09-24",
  nextClinicalReview: "2027-09-24",
  referencesUpdated: "2026-09-24",
  clinicalChangesSinceLastRevision:
    "Reframed the article for a patient-first reading path; refreshed source provenance, daily skin-care guidance, infection warnings and evidence boundaries.",
  reviewStatus: "owner-authorized-source-bound",
  citationHealth: "complete",
  contentCompleteness: 100,
  graphCompleteness: 100,
  evidenceLevel: "Consensus-Guidance",
  evidenceProfile: {
    evidenceStrength: "high",
    sourceQuality: "authoritative",
    classicalSource: false,
    modernSource: true,
    clinicalConfidence: 0.94,
    editorialConfidence: 0.96,
    citationCompleteness: 1,
    lastReviewedAt: "2026-09-24",
    reviewIntervalDays: 365,
    nextReviewDueAt: "2027-09-24",
    reviewExpiryPolicy: "flag-only",
    rationale:
      "Definition, flare care, infection warnings and escalation boundaries are mapped to American Academy of Dermatology patient guidance.",
    methodologyVersion: "knowledge-authority-led-v1",
  },
  tags: ["Eczema", "Atopic Dermatitis", "Pruritus", "Skin Barrier", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/eczema",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Eczema disease profile",
    "1.1.0: Source-bound rewrite with claim provenance, emergency boundaries, and NICE CG57 alignment",
    "1.2.0: Patient-first rewrite with clearer daily care, infection warnings and updated authoritative sources",
  ],
  clinicalPearl:
    "A simple daily routine is often more useful than many products: moisturise, use prescribed flare treatment as directed, and seek help quickly if the skin becomes painful, blistered, feverish or infected-looking.",
  quickFacts: {
    "Disease Type": "Inflammatory skin condition",
    "Core Mechanism": "A sensitive skin barrier that loses moisture easily",
    "First useful step": "Fragrance-free cream or ointment every day",
  },
};
