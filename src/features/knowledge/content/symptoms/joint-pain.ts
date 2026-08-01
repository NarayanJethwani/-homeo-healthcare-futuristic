import { KnowledgeEntity } from "../../types";

export const JointPainSymptom: KnowledgeEntity = {
  id: "S0015",
  slug: "joint-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Joint Pain (Arthralgia)",
    hi: "जोड़ों का दर्द (Joint Pain / Arthralgia)",
    gu: "સાંધાનો દુખાવો (Joint Pain / Arthralgia)",
    mr: "सांधेदुखी (Joint Pain / Arthralgia)",
    es: "Dolor Articular (Joint Pain / Arthralgia)",
    ar: "ألم المفاصل (Arthralgia)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, septic joint emergency red flags, and supportive management for Joint Pain under ACR 2019 guidelines.",
    hi: "जोड़ों के दर्द के लक्षण की नैदानिक समझ और आपातकालीन अर्थराइटिस चेतावनी लक्षण.",
    gu: "સાંધાના દુખાવાની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "सांधेदुखीच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "Evaluación clínica, diagnóstico diferencial y señales de alarma de artritis séptica según ACR 2019.",
    ar: "التقييم السريري وعلامات الخطر لألم المفاصل."
  },
  content: {
    definition: "Joint Pain (Arthralgia): Discomfort, aching, or sharp pain originating from intra-articular structures (synovium, cartilage, subchondral bone) or peri-articular tissues (tendons, bursae, ligaments).",
    clinicalMeaning: "Reflects mechanical joint wear-and-tear (Osteoarthritis), autoimmune inflammatory synovitis (Rheumatoid Arthritis, SLE), crystal arthropathy (Gout, Pseudogout), or acute pyogenic infection (Septic Arthritis).",
    commonCauses: [
      "Degenerative: Osteoarthritis (Knee, Hip, Hands, Spine)",
      "Autoimmune Inflammatory: Rheumatoid Arthritis, Psoriatic Arthritis, Ankylosing Spondylitis",
      "Crystal Arthropathy: Acute Gouty Arthritis, CPPD Pseudogout",
      "Post-Infectious / Reactive: Reactive Arthritis, Viral Arthralgia (Dengue, Chikungunya)"
    ],
    differentialDiagnosis: "Differentiate non-inflammatory osteoarthritis (morning stiffness <30 mins, gel phenomenon) from inflammatory arthritis (morning stiffness >1 hour, systemic symptoms) and acute monoarthritis (septic joint vs. crystal attack).",
    redFlags: [
      "Acute hot, swollen, intensely painful monoarticular joint with high fever and inability to bear weight (Septic Arthritis)",
      "Joint pain with systemic malar rash, photosensitivity, renal compromise, or cytopenias (SLE Flare)",
      "Severe joint trauma with obvious deformity, inability to move, or open wound over joint",
      "Symmetrical polyarthritis with progressive joint erosions and elevated ESR/CRP"
    ],
    lifestyleAdvice: "Engage in low-impact joint-sparing physical activity (swimming, cycling), maintain optimal body weight to reduce lower extremity mechanical load, use warm or cold compresses appropriately, and strengthen supporting musculature.",
    references: [
      "CIT-0080",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0015-001",
        passage: "Acute hot swollen monoarthritis accompanied by fever and restricted range of motion constitutes a medical emergency requiring immediate arthrocentesis to exclude Septic Arthritis.",
        citationIds: ["CIT-0080"]
      },
      {
        claimId: "CLM-S0015-002",
        passage: "Morning joint stiffness lasting more than 60 minutes strongly distinguishes systemic inflammatory polyarthritis from non-inflammatory osteoarthritis.",
        citationIds: ["CIT-0080"]
      },
      {
        claimId: "CLM-S0015-003",
        passage: "ACR 2019 guidelines recommend first-line non-pharmacologic modalities including weight management, exercise, and physical therapy for knee and hip osteoarthritis.",
        citationIds: ["CIT-0080"]
      },
      {
        claimId: "CLM-S0015-004",
        passage: "Homeopathic supportive care (e.g., Rhus Tox, Bryonia, Colchicum) does not replace joint aspiration or IV antibiotic therapy in acute bacterial septic arthritis.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What causes muscle stiffness in the morning?",
      "answer": "Morning stiffness is often caused by localized inflammation, muscle inactivity during sleep, or structural degenerative joint changes that temporarily reduce synovial fluid circulation."
    },
    {
      "question": "How does stress affect nerve and muscle pain?",
      "answer": "Stress increases muscle tension and heightens pain sensitivity (central sensitization) by releasing stress hormones that lower the pain threshold."
    },
    {
      "question": "What is the homeopathic approach to physical injury?",
      "answer": "Homeopathy uses remedies like Arnica Montana to manage acute swelling and bruising, and Rhus Tox or Bryonia for joint stiffness and pain, tailored to whether movement improves or worsens the symptoms."
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
  tags: ["Joint Pain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/joint-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Joint Pain symptom profile"]
};
