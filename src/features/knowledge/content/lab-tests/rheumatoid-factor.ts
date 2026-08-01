import { KnowledgeEntity } from "../../types";

export const RheumatoidFactorLabTest: KnowledgeEntity = {
  id: "L0023",
  slug: "rheumatoid-factor",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Rheumatoid Factor (RF)",
    hi: "रुमेटोइड फैक्टर (Rheumatoid Factor)",
    gu: "રુમેટોઇડ ફેક્ટર (Rheumatoid Factor)",
    mr: "संधिवाताचा घटक (Rheumatoid Factor)",
    es: "Factor Reumatoide (RF)",
    ar: "عامل الروماتويد (RF)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and autoimmune joint disease evaluation for Rheumatoid Factor under ACR standards.",
    hi: "रुमेटोइड फैक्टर लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "રુમેટોઇડ ફેક્ટર ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "संधिवाताच्या घटकाची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y evaluación de enfermedades autoinmunes articular según criterios ACR.",
    ar: "التفسير السريري والنطاق المرجعي لعامل الروماتويد."
  },
  content: {
    overview: "Rheumatoid Factor (RF): Autoantibodies (predominantly IgM class) directed against the Fc region of human IgG molecules, serving as a classical serological biomarker for Rheumatoid Arthritis and systemic autoimmune Connective Tissue Diseases.",
    normalRange: "Negative: <15 IU/mL; Weakly Positive: 15 - 30 IU/mL; Strongly Positive: >30 IU/mL.",
    highValues: [
      "Rheumatoid Arthritis (Positive in 70-80% of established RA cases)",
      "Sjögren's Syndrome, Systemic Lupus Erythematosus (SLE), Systemic Sclerosis",
      "Mixed Cryoglobulinemia, Subacute Bacterial Endocarditis, or Chronic Hepatitis C"
    ],
    lowValues: [
      "Normal / Unremarkable Serology (Does not exclude Seronegative Rheumatoid Arthritis)"
    ],
    clinicalInterpretation: "RF positivity must be evaluated alongside clinical joint distribution and Anti-CCP serology; high-titer RF (>3 times upper limit of normal) confers 3 points in the 2010 ACR/EULAR Rheumatoid Arthritis classification criteria.",
    references: [
      "CIT-0071",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0023-001",
        passage: "High-titer Rheumatoid Factor (>3 times upper limit of normal) combined with inflammatory polyarthritis supports the 2010 ACR/EULAR criteria for Rheumatoid Arthritis.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0023-002",
        passage: "RF is present in up to 15% of healthy elderly individuals, requiring high specificity testing via Anti-CCP antibodies to confirm autoimmune etiology.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0023-003",
        passage: "Seronegative Rheumatoid Arthritis accounts for 20-30% of clinical RA cases despite negative RF serology.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0023-004",
        passage: "Homeopathic supportive care does not replace disease-modifying antirheumatic drugs (DMARDs) in seropositive erosive Rheumatoid Arthritis.",
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
  tags: ["Rheumatoid Factor", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/rheumatoid-factor",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Rheumatoid Factor test guidelines"]
};
