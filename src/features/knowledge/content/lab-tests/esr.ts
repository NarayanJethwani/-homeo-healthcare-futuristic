import { KnowledgeEntity } from "../../types";

export const ESRLabTest: KnowledgeEntity = {
  id: "L0003",
  slug: "esr",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Erythrocyte Sedimentation Rate (ESR)",
    hi: "एरिथ्रोसाइट सेडिमेंटेशन रेट (ESR)",
    gu: "એરિથ્રોસાઇટ સેડિમેન્ટેશન રેટ (ESR)",
    mr: "एरिथ्रोसाइट सेडिमेंटेशन रेट (ESR)",
    es: "Velocidad de Sedimentación Globular (VSG / ESR)",
    ar: "سرعة ترسب الدم (ESR)"
  },
  summary: {
    en: "Clinical interpretation, age-adjusted reference ranges, and inflammatory disease monitoring for Erythrocyte Sedimentation Rate (ESR).",
    hi: "ईएसआर (ESR) सूजन संबंधी लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "ESR લેબોરેટરી ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "ESR लॅब टेस्टची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y rangos de referencia para la velocidad de sedimentación globular.",
    ar: "التفسير السريري والنطاق المرجعي لسرعة ترسب الدم."
  },
  content: {
    overview: "Erythrocyte Sedimentation Rate (ESR): An indirect quantitative laboratory measurement of systemic acute-phase inflammation, determining the distance in millimeters that red blood cells settle in uncoagulated anticoagulated blood in one hour.",
    normalRange: "Men <50 yrs: <15 mm/hr; Men >50 yrs: <20 mm/hr; Women <50 yrs: <20 mm/hr; Women >50 yrs: <30 mm/hr.",
    highValues: [
      "Marked Elevation (>100 mm/mm): Temporal Arteritis (Giant Cell Arteritis), Polymyalgia Rheumatica",
      "Multiple Myeloma, Systemic Necrotizing Vasculitis, Metastatic Malignancy",
      "Acute Bacterial Infections (Osteomyelitis, Endocarditis), Rheumatoid Arthritis, SLE"
    ],
    lowValues: [
      "Polycythemia Vera, Sickle Cell Anemia (Altered Red Cell Morphology)",
      "Extreme Leukocytosis, Congestive Heart Failure, Hypofibrinogenemia"
    ],
    clinicalInterpretation: "Extreme ESR elevation (>100 mm/hr) in an elderly patient with new headache or jaw claudication strongly indicates Temporal Arteritis, demanding immediate high-dose glucocorticoid therapy to prevent permanent blindness.",
    references: [
      "CIT-0004",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0002-001",
        passage: "ESR elevation >100 mm/hr accompanied by temporal headache or visual disturbances indicates Temporal Arteritis, requiring urgent ophthalmology and rheumatology evaluation.",
        citationIds: ["CIT-0004"]
      },
      {
        claimId: "CLM-L0002-002",
        passage: "ESR is a non-specific inflammatory marker affected by fibrinogen, immunoglobulins, anemia, age, and sex, requiring clinical correlation.",
        citationIds: ["CIT-0004"]
      },
      {
        claimId: "CLM-L0002-003",
        passage: "Polymyalgia Rheumatica presents with severe proximal shoulder and hip girdle stiffness and markedly elevated ESR >50 mm/hr.",
        citationIds: ["CIT-0004"]
      },
      {
        claimId: "CLM-L0002-004",
        passage: "Homeopathic supportive remedies do not replace emergency steroid therapy in biopsy-proven Giant Cell Arteritis to prevent irreversible optic nerve ischemia.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What is a constitutional remedy in homeopathy?",
      "answer": "A constitutional remedy is a deep-acting medicine selected to match a patient's overall physical, mental, and emotional makeup, rather than just treating a single local symptom."
    },
    {
      "question": "Why does the homeopath ask so many detailed questions?",
      "answer": "To find the individualized remedy, the homeopath must understand all unique characteristics—such as sleep patterns, thermal sensitivities, food cravings, and emotional triggers."
    },
    {
      "question": "How should homeopathic remedies be stored?",
      "answer": "Remedies should be stored in a cool, dry place, away from direct sunlight, strong odors (like camphor, perfumes), and electronic devices to maintain their potency."
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
    specialty: "Clinical Pathology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["ESR", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/esr",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of ESR test guidelines"]
};
