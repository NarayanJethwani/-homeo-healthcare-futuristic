import { KnowledgeEntity } from "../../types";

export const BackPainSymptom: KnowledgeEntity = {
  id: "S0005",
  slug: "back-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Low Back Pain",
    hi: "पीठ / कमर दर्द (Low Back Pain)",
    gu: "પીઠનો દુખાવો (Low Back Pain)",
    mr: "पाठदुखी / कंबरदुखी (Low Back Pain)",
    es: "Dolor de Espalda (Low Back Pain)",
    ar: "ألم الظهر (Low Back Pain)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, cauda equina red flags, and supportive management for Low Back Pain under ACP 2017 guidelines.",
    hi: "कमर दर्द लक्षण की नैदानिक समझ और आपातकालीन तंत्रिका चेतावनी लक्षण.",
    gu: "પીઠના દુખાવાની તબીબી સમજણ અને ઈમરજન્સી રેડ ફ્લેગ્સ.",
    mr: "पाठदुखीच्या लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, síndrome de cola de caballo y manejo del dolor lumbar según ACP 2017.",
    ar: "التقييم السريري وعلامات الخطر لألم الظهر."
  },
  content: {
    definition: "Low Back Pain: Musculoskeletal or neurogenic pain localized between the 12th rib margin and inferior gluteal folds, with or without lower extremity radicular sensory or motor radiation.",
    clinicalMeaning: "Reflects mechanical lumbar strain, intervertebral disc herniation, spinal stenosis, facet arthropathy, or systemic pathology requiring red flag neurological screening.",
    commonCauses: [
      "Lumbar Musculoskeletal Strain, Ligamentous Sprain",
      "Intervertebral Disc Herniation (Sciatica / L4-S1 Radiculopathy)",
      "Lumbar Spinal Stenosis, Degenerative Spondylolisthesis, Osteoarthritis",
      "Vertebral Compression Fracture (Osteoporosis / Trauma)"
    ],
    differentialDiagnosis: "Differentiate mechanical back pain from Cauda Equina Syndrome, spinal epidural abscess/osteomyelitis, metastatic spinal neoplasms, ankylosing spondylitis, and referred visceral pain (nephrolithiasis, AAA).",
    redFlags: [
      "Loss of bowel or bladder control (urinary retention/incontinence) or saddle anesthesia",
      "Progressive bilateral lower extremity motor weakness or acute foot drop",
      "Fever, night sweats, or history of IV drug use / immunosuppression (spinal infection)",
      "Unexplained weight loss or history of cancer (vertebral metastasis)"
    ],
    lifestyleAdvice: "Remain active with early low-impact walking, avoid prolonged bed rest, practice proper ergonomic lifting mechanics, and strengthen core trunk musculature.",
    references: [
      "CIT-0074",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0005-001",
        passage: "Acute low back pain with acute urinary retention or saddle anesthesia indicates Cauda Equina Syndrome requiring emergency spinal decompression surgery within 24-48 hours.",
        citationIds: ["CIT-0074"]
      },
      {
        claimId: "CLM-S0005-002",
        passage: "ACP 2017 guidelines recommend non-pharmacologic therapies as initial management for acute or subacute non-radicular low back pain.",
        citationIds: ["CIT-0074"]
      },
      {
        claimId: "CLM-S0005-003",
        passage: "Routine lumbar spine imaging is not indicated for uncomplicated acute back pain lacking red flag clinical indicators.",
        citationIds: ["CIT-0074"]
      },
      {
        claimId: "CLM-S0005-004",
        passage: "Homeopathic supportive remedies (e.g., Rhus Tox, Bryonia) do not substitute for emergency MRI and surgical consultation in progressive neurological deficit.",
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
  tags: ["Back Pain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/back-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Back Pain symptom profile"]
};
