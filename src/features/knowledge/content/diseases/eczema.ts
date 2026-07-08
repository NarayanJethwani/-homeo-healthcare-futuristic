import { KnowledgeEntity } from "../../types";

export const EczemaDisease: KnowledgeEntity = {
  id: "D0002",
  slug: "eczema",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Atopic Dermatitis (Eczema)",
    hi: "एक्जिमा (खुजलीदार त्वचा रोग)",
    gu: "ખરજવું અને ત્વચાના રોગો (Eczema)",
    mr: "खरूज आणि त्वचेचे आजार (Eczema)",
    es: "Dermatitis Atópica (Eczema)",
    ar: "الأكزيما (Eczema)"
  },
  summary: {
    en: "A chronic, inflammatory skin condition characterized by dry, red, itchy patches, commonly associated with personal or family history of allergic conditions.",
    hi: "त्वचा की एक पुरानी सूजन संबंधी बीमारी जिसमें त्वचा पर लाल, सूखी और खुजलीदार पपड़ीदार परतें बन जाती हैं.",
    gu: "લાંબા ગાળાનો ત્વચાનો સોજો, જેનાથી ત્વચા લાલ, સુકી અને ખંજવાળવાળી થાય છે. આ ઘણીવાર એલર્જી સાથે જોડાયેલ હોય છે.",
    mr: "त्वचेचा एक जुनाट दाहयुक्त आजार, ज्यामध्ये त्वचा कोरडी पडते, लाल डाग आणि तीव्र खाज निर्माण होते.",
    es: "Una condición crónica e inflamatoria de la piel caracterizada por parches secos, rojos y con picazón.",
    ar: "حالة جلدية مزمنة والتهابية تتميز بوجود بقع جافة وحمراء ومثيرة للحكة."
  },
  content: {
  "overview": "Eczema: Dermatological inflammatory conditions represent cutaneous manifestations of immune-mediated dysregulation, genetic skin barrier defects, and autonomic reactivity. Management focuses on skin barrier integrity and systemic immunomodulation.",
  "definition": "Chronic, relapsing inflammatory skin disorders characterized by pruritic lesions, scaling, erythema, and epidermal barrier breakdown.",
  "causes": [
    "Immune-mediated cutaneous inflammation (T-helper cell dominance)",
    "Epidermal barrier protein mutations (such as filaggrin defects)",
    "Environmental contact allergens, irritants, and neurogenic stress triggers"
  ],
  "riskFactors": [
    "Genetic predisposition and family history of atopy (asthma, eczema, hay fever)",
    "Dry climate and exposure to harsh chemical cleansers",
    "Chronic emotional stress and food sensitivities"
  ],
  "symptoms": [
    "Intense and persistent pruritus (itching), often worse at night",
    "Erythematous plaques, papules, and dry scaling skin",
    "Lichenification (thickened skin) from chronic scratching",
    "Exudative weeping and secondary bacterial colonization risk"
  ],
  "diagnosis": "Diagnosed by clinical inspection of lesion distribution and morphology, patient history, and patch testing for contact allergies.",
  "differentialDiagnosis": "Differentiate from contact dermatitis, seborrheic dermatitis, psoriasis, and cutaneous dermatophyte (fungal) infections.",
  "conventionalManagement": "Standard therapy relies on topical emollients, topical corticosteroids, calcineurin inhibitors, antihistamines, or systemic immunosuppressants.",
  "homeopathicApproach": "Constitutional homeopathic management seeks to balance immune responses, calm pruritus, and support epidermal healing without suppressing local symptoms.",
  "lifestyleAdvice": "Apply rich emollients within minutes after bathing, bathe in lukewarm water, avoid harsh synthetic soaps, and wear loose breathable cotton clothing.",
  "references": [
    "CIT-0002",
    "CIT-0019",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "Why do skin conditions worsen with emotional stress?",
      "answer": "Stress releases cortisol and pro-inflammatory cytokines, which compromise the skin barrier and activate immune pathways, triggering flares of eczema, psoriasis, or acne."
    },
    {
      "question": "Are topical steroids the only treatment for eczema?",
      "answer": "No. While topical steroids manage acute flare inflammation, long-term care requires barrier repair (emollients), trigger identification, and systemic constitutional support."
    },
    {
      "question": "How does homeopathy approach skin diseases?",
      "answer": "Homeopathy views skin eruptions as outward manifestations of internal systemic imbalance. Treatment focuses on systemic immunomodulation and constitutional remedies rather than purely suppressing symptoms."
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
    specialty: "Constitutional Prescribing",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Eczema", "Atopic Dermatitis", "Skin Rash", "Allergic Skin", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/eczema",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Eczema disease profile"]
};
