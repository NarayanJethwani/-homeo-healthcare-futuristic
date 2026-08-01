import { KnowledgeEntity } from "../../types";

export const AntiCCPLabTest: KnowledgeEntity = {
  id: "L0024",
  slug: "anti-ccp",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Anti-CCP Antibodies (ACPA)",
    hi: "एंटी-सीसीपी एंटीबॉडी (Anti-CCP)",
    gu: "એન્ટિ-સીસીપી એન્ટિબોડીઝ (Anti-CCP)",
    mr: "एंटी-सीसीपी अँटीबॉडीज (Anti-CCP)",
    es: "Anticuerpos Anti-CCP (ACPA)",
    ar: "أجسام مضادة لـ Anti-CCP"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and highly specific Rheumatoid Arthritis diagnosis for Anti-CCP (ACPA) under ACR standards.",
    hi: "एंटी-सीसीपी एंटीबॉडी लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "એન્ટિ-સીસીપી ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "एंटी-सीसीपी चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y alta especificidad para Artritis Reumatoide de los anticuerpos Anti-CCP.",
    ar: "التفسير السريري والنطاق المرجعي للأجسام المضادة لـ Anti-CCP."
  },
  content: {
    overview: "Anti-Cyclic Citrullinated Peptide (Anti-CCP) Antibodies / Anti-Citrullinated Protein Antibodies (ACPA): Highly specific autoantibodies targeting citrullinated protein epitopes generated via peptidylarginine deiminase (PAD) enzyme post-translational modification during synovial inflammation.",
    normalRange: "Negative: <20 U/mL; Weakly Positive: 20 - 39 U/mL; Moderately Positive: 40 - 59 U/mL; Strongly Positive: >=60 U/mL.",
    highValues: [
      "Rheumatoid Arthritis (High specificity 95-98% for early and established RA)",
      "High Risk for Progressive Erosive Joint Damage and Extra-Articular Manifestations",
      "Psoriatic Arthritis or Palindromic Rheumatism (Subgroup)"
    ],
    lowValues: [
      "Normal / Unremarkable Serology (Does not rule out Seronegative RA)"
    ],
    clinicalInterpretation: "Anti-CCP positivity has high diagnostic specificity (95-98%) for Rheumatoid Arthritis and can precede clinical joint inflammation by years; high-titer Anti-CCP strongly predicts aggressive erosive joint destruction warranting early DMARD therapy.",
    references: [
      "CIT-0071",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0024-001",
        passage: "Anti-CCP antibodies demonstrate 95-98% specificity for Rheumatoid Arthritis, superior to Rheumatoid Factor in distinguishing RA from other arthritides.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0024-002",
        passage: "High Anti-CCP antibody titers serve as an independent prognostic marker for rapid radiographical joint erosion and aggressive disease course.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0024-003",
        passage: "Anti-CCP positivity confers 3 points toward the 2010 ACR/EULAR Rheumatoid Arthritis classification criteria.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0024-004",
        passage: "Homeopathic supportive management does not replace early DMARD initiation in Anti-CCP positive erosive joint disease.",
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
  tags: ["Anti-CCP", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/anti-ccp",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Anti-CCP test guidelines"]
};
