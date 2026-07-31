import { KnowledgeEntity } from "../../types";

export const ItchingSymptom: KnowledgeEntity = {
  id: "S0014",
  slug: "itching",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Itching (Pruritus)",
    hi: "खुजली (Itching / Pruritus)",
    gu: "ખંજવાળ (Itching / Pruritus)",
    mr: "खाज / खाज सुटणे (Itching / Pruritus)",
    es: "Picazón / Prurito (Itching / Pruritus)",
    ar: "الحكة (Pruritus)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, systemic etiology screening, and supportive management for Pruritus under AAD 2020 guidelines.",
    hi: "खुजली के लक्षण की नैदानिक समझ और प्रणालीगत चेतावनी लक्षण.",
    gu: "ખંજવાળના લક્ષણની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "खाजेच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "Evaluación clínica, causas sistémicas y señales de alarma del prurito según AAD 2020.",
    ar: "التقييم السريري وعلامات الخطر للحكة."
  },
  content: {
    definition: "Pruritus (Itching): An unpleasant, localized or generalized cutaneous sensation provoking the desire or reflex to scratch.",
    clinicalMeaning: "Reflects dermatologic inflammatory disease (pruritoceptive), neuropathic C-fiber stimulation, or neurogenic/systemic accumulation of pruritogens (bile salts, uremic toxins, cytokines).",
    commonCauses: [
      "Dermatologic: Atopic Dermatitis, Xerosis, Contact Dermatitis, Urticaria, Psoriasis",
      "Systemic: Cholestatic Liver Disease, Chronic Kidney Disease (Uremic Pruritus)",
      "Hematologic: Polycythemia Vera, Hodgkin Lymphoma, Iron Deficiency Anemia",
      "Endocrine / Infectious: Hyperthyroidism, Diabetes Mellitus, Scabies, Cutaneous Fungal Infection"
    ],
    differentialDiagnosis: "Differentiate primary dermatologic rash with pruritus from generalized non-rash systemic pruritus (biliary, renal, hematologic, malignant, or medication-induced).",
    redFlags: [
      "Generalized pruritus accompanied by jaundice, dark urine, or pale stools (biliary obstruction)",
      "Aquagenic pruritus (intense itching after warm water exposure) with plethoric face (Polycythemia Vera)",
      "Unexplained generalized itching with B-symptoms (fever, night sweats, weight loss, painless lymphadenopathy)",
      "Generalized erythroderma (>90% body surface area) with skin exfoliation and systemic toxicity"
    ],
    lifestyleAdvice: "Apply emollient barrier creams liberally, use lukewarm bath water with soap-free synthetic detergents, keep fingernails trimmed, wear loose cotton clothing, and avoid scratching.",
    references: [
      "CIT-0079",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0014-001",
        passage: "Generalized pruritus in the absence of primary skin lesions requires systematic evaluation for underlying hepatic, renal, hematologic, thyroid, or malignant disease.",
        citationIds: ["CIT-0079"]
      },
      {
        claimId: "CLM-S0014-002",
        passage: "Severe generalized itching accompanied by jaundice or elevated serum bile acids indicates cholestatic hepatobiliary obstruction.",
        citationIds: ["CIT-0079"]
      },
      {
        claimId: "CLM-S0014-003",
        passage: "Aquagenic pruritus without visible rash is a classical symptom of Polycythemia Vera, requiring complete blood count and JAK2 V617F mutation testing.",
        citationIds: ["CIT-0079"]
      },
      {
        claimId: "CLM-S0014-004",
        passage: "Homeopathic topical and internal supportive care (e.g., Sulphur, Graphites, Rhus Tox) does not substitute for hepatobiliary or hematologic evaluation in non-dermatologic systemic pruritus.",
        citationIds: ["CIT-0023"]
      }
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
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Itching", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/itching",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Itching symptom profile"]
};
