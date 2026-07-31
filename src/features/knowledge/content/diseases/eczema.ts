import { KnowledgeEntity } from "../../types";

const ECZEMA_CITATIONS = ["CIT-0019", "CIT-0022", "CIT-0023", "CIT-0024"];

export const EczemaDisease: KnowledgeEntity = {
  id: "D0002",
  slug: "eczema",
  entityType: "disease",
  editorialStatus: "published",
  legacyVerificationStatus: "verified-published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-30T12:00:00Z",
    reviewed: "2026-07-30T12:00:00Z",
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
    en: "A chronic, inflammatory skin condition characterized by dry, red, intensely itchy patches, resulting from skin barrier dysfunction and immune dysregulation.",
    hi: "त्वचा की एक पुरानी सूजन संबंधी बीमारी जिसमें त्वचा पर लाल, सूखी और तीव्र खुजलीदार पपड़ीदार परतें बन जाती हैं।",
    gu: "લાંબા ગાળાનો ત્વચાનો સોજો, જેનાથી ત્વચા લાલ, સુકી અને તીવ્ર ખંજવાળવાળી થાય છે. આ અન્નનળી અને એલર્જી સાથે જોડાયેલ હોય છે.",
    mr: "त्वचेचा एक जुनाट दाहयुक्त आजार, ज्यामध्ये त्वचा कोरडी पडते, लाल डाग आणि तीव्र खाज निर्माण होते.",
    es: "Una condición crónica e inflamatoria de la piel caracterizada por parches secos, rojos y con picazón intensa.",
    ar: "حالة جلدية مزمنة والتهابية تتميز بوجود بقع جافة وحمراء ومثيرة للحكة شديدة.",
  },
  content: {
    overview:
      "Atopic dermatitis (eczema) is a non-contagious, relapsing inflammatory skin disorder driven by epidermal barrier dysfunction (such as filaggrin deficiencies) and immune dysregulation. It presents with pruritus, xerosis, and erythematous lesions, significantly impacting quality of life.",
    definition:
      "Atopic dermatitis is a chronic, relapsing, pruritic inflammatory skin disease characterized by epidermal barrier dysfunction, immune hyperreactivity, and recurrent eczematous papules, plaques, and lichenification.",
    causes: [
      "Epidermal barrier failure due to genetic defects (e.g., filaggrin gene mutations) leading to transepidermal water loss",
      "Immune system dysregulation with T-helper-2 (Th2) cytokine pathway dominance",
      "Environmental triggers including harsh cleansers, wool, airborne allergens, climate extremes, and emotional stress",
    ],
    riskFactors: [
      "Personal or family history of atopic conditions (asthma, allergic rhinitis, atopic dermatitis)",
      "Frequent exposure to irritants, dry cold weather, or low humidity",
      "Cutaneous colonization by Staphylococcus aureus impairing skin microbial diversity",
    ],
    symptoms: [
      "Intense pruritus (itching) that often worsens at night and impairs sleep",
      "Erythematous, dry, scaling plaques and papules",
      "Exudative weeping and crusting in acute flares; lichenification (thickened skin) in chronic stages",
      "Typical age-dependent distribution: flexural creases in older children/adults, facial and extensor surfaces in infants",
    ],
    diagnosis:
      "Diagnosis is clinical, based on history, lesion morphology, and disease chronicity (e.g., UK Working Party criteria). Patch testing may be used if allergic contact dermatitis is suspected. Routine allergy blood or skin-prick testing is not indicated without specific clinical trigger history.",
    differentialDiagnosis:
      "Important alternatives include allergic contact dermatitis, seborrheic dermatitis, psoriasis, scabies infestation, cutaneous fungal infections, and severe immunodeficiency syndromes.",
    labTests: [],
    imaging: "Imaging is not indicated for uncomplicated atopic dermatitis.",
    redFlags: [
      "Rapidly spreading painful vesicular rash or punched-out erosions with fever (suspect eczema herpeticum; immediate emergency review)",
      "Erythroderma involving >90% body surface area with fever, chills, or metabolic instability",
      "Signs of severe secondary bacterial infection (extensive purulent discharge, spreading cellulitis, high fever)",
    ],
    conventionalManagement:
      "Management centers on skin barrier repair with liberal emollient therapy applied frequently. Topical anti-inflammatory agents—topical corticosteroids (TCS) and topical calcineurin inhibitors (TCI)—are first-line for active flares. Phototherapy, systemic immunosuppressants, or biologic agents (e.g., dupilumab) are prescribed for severe, refractory cases under dermatological care.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for atopic dermatitis or its complications. It must not replace diagnostic evaluation, emergency care, proven barrier emollients, or prescription topical anti-inflammatory therapy. Patients considering complementary care should inform their dermatologist.",
    lifestyleAdvice:
      "Apply unfragranced, thick emollients immediately after bathing while skin is damp ('soak and seal'). Take brief lukewarm baths or showers using soap-free mild cleansers. Avoid known individual irritants, wear soft breathable cotton clothing, and maintain short fingernails to prevent excoriation trauma.",
    references: ECZEMA_CITATIONS,
    claimCitations: [
      {
        claimId: "D0002-DEFINITION",
        passage: "overview; definition",
        citationIds: ["CIT-0019", "CIT-0022"],
      },
      {
        claimId: "D0002-PATHOPHYSIOLOGY",
        passage: "causes; riskFactors",
        citationIds: ["CIT-0019", "CIT-0022"],
      },
      {
        claimId: "D0002-SYMPTOMS",
        passage: "symptoms",
        citationIds: ["CIT-0019"],
      },
      {
        claimId: "D0002-DIAGNOSIS",
        passage: "diagnosis; differentialDiagnosis",
        citationIds: ["CIT-0019", "CIT-0022"],
      },
      {
        claimId: "D0002-EMERGENCY-BOUNDARY",
        passage: "redFlags",
        citationIds: ["CIT-0019"],
      },
      {
        claimId: "D0002-CONVENTIONAL-MANAGEMENT",
        passage: "conventionalManagement",
        citationIds: ["CIT-0019", "CIT-0024"],
      },
      {
        claimId: "D0002-LIFESTYLE",
        passage: "lifestyleAdvice",
        citationIds: ["CIT-0019"],
      },
      {
        claimId: "D0002-HOMEOPATHY-BOUNDARY",
        passage: "homeopathicApproach",
        citationIds: ["CIT-0023"],
      },
    ],
    faqs: [
      {
        question: "Can emollients and moisturizers replace topical prescription steroids during a severe eczema flare?",
        answer:
          "No. Emollients maintain the skin barrier, but acute inflammatory flares typically require prescribed topical anti-inflammatory treatment (such as topical steroids or calcineurin inhibitors) under medical guidance.",
      },
      {
        question: "When does an eczema flare require urgent emergency evaluation?",
        answer:
          "Urgent emergency review is required if a rapid, painful rash with blisters, punched-out sores, fever, or extensive pus develops (suspected eczema herpeticum or severe bacterial infection), or if redness covers over 90% of the body.",
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
  lastClinicalReview: "2026-07-30",
  nextClinicalReview: "2027-07-30",
  referencesUpdated: "2026-07-30",
  clinicalChangesSinceLastRevision:
    "Source-bound rewrite to v1.1.0; removed generic template findings; added NICE CG57 guideline alignment, claim-level provenance, emergency boundaries (eczema herpeticum, erythroderma), and explicit homeopathy boundaries.",
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
    lastReviewedAt: "2026-07-30",
    reviewIntervalDays: 365,
    nextReviewDueAt: "2027-07-30",
    reviewExpiryPolicy: "flag-only",
    rationale:
      "Definition, diagnosis, flare management, and red flag passages are mapped to NICE CG57 clinical guideline standards and FDA product safety policies.",
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
  ],
  clinicalPearl:
    "Effective eczema management requires daily barrier repair ('soak and seal') combined with targeted flare suppression; rapid blistering or severe systemic signs require emergency viral/bacterial ruling out.",
  quickFacts: {
    "Disease Type": "Inflammatory Dermatosis",
    "Core Mechanism": "Skin barrier dysfunction & Th2 immune hyperreactivity",
    "First-line Therapy": "Daily emollient repair + topical anti-inflammatories for flares",
  },
};
