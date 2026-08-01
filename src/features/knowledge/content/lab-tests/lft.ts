import { KnowledgeEntity } from "../../types";

export const LFTLabTest: KnowledgeEntity = {
  id: "L0012",
  slug: "lft",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Liver Function Tests (LFT / Liver Panel)",
    hi: "लिवर फंक्शन टेस्ट (LFT / लिवर पैनल)",
    gu: "લીવર ફંકશન ટેસ્ટ (LFT / લીવર પેનલ)",
    mr: "यकृत कार्य चाचणी (LFT / लिव्हर पॅनेल)",
    es: "Pruebas de Función Hepática (PFH / LFT)",
    ar: "وظائف الكبد (LFT)"
  },
  summary: {
    en: "Clinical evaluation, ACG 2021 abnormal liver chemistry patterns, hepatocellular vs cholestatic differentiation, and hepatic clearance monitoring for Liver Function Tests (LFT).",
    hi: "लिवर फंक्शन टेस्ट (LFT) की नैदानिक समझ, हेपेटोसेलुलर और कोलेस्टैटिक पैटर्न.",
    gu: "લીવર ફંકશન ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "LFT लॅब टेस्टची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y patrones de lesión hepática según las guías ACG 2021.",
    ar: "التفسير السريري والنطاق المرجعي لوظائف الكبد."
  },
  content: {
    overview: "Liver Function Tests (LFT / Liver Panel): Comprehensive biochemical assessment of hepatic cellular integrity (ALT, AST), biliary excretory function (Alkaline Phosphatase, Total/Direct Bilirubin), and synthetic metabolic capacity (Serum Albumin, Total Protein, Prothrombin Time/INR).",
    normalRange: "ALT: Male 29–33 U/L, Female 19–25 U/L; AST: 10–40 U/L; Alkaline Phosphatase (ALP): 44–147 U/L; Total Bilirubin: 0.2–1.2 mg/dL; Direct Bilirubin: 0.0–0.3 mg/dL; Serum Albumin: 3.5–5.0 g/dL.",
    highValues: [
      "Hepatocellular Pattern (ALT/AST >5-10x ULN): Acute Viral Hepatitis, Acetaminophen Toxicity, Ischemic Hepatitis, Alcoholic Liver Disease (AST:ALT ratio >2:1)",
      "Cholestatic Pattern (Elevated ALP & Direct Bilirubin): Choledocholithiasis, Primary Biliary Cholangitis (PBC), Biliary Stricture, Pancreatic Head Malignancy",
      "Hyperbilirubinemia: Jaundice due to Hemolysis (Indirect), Hepatic Failure, or Biliary Obstruction (Direct)"
    ],
    lowValues: [
      "Hypoalbuminemia: End-stage Cirrhosis / Chronic Liver Failure, Severe Malnutrition, Nephrotic Syndrome, Protein-Losing Enteropathy",
      "Low Total Protein: Severe Malabsorption, Advanced Hepatic Parenchymal Destruction"
    ],
    clinicalInterpretation: "Acute transaminase elevation >1000 U/L indicates acute ischemic hepatitis, acetaminophen overdose, or acute viral hepatitis; severe hypoalbuminemia with elevated INR indicates decompensated hepatic failure.",
    references: [
      "CIT-0072",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0007-001",
        passage: "ACG 2021 guidelines define upper limit of normal for ALT as 29 to 33 U/L in males and 19 to 25 U/L in females; levels above these warrant diagnostic workup.",
        citationIds: ["CIT-0072"]
      },
      {
        claimId: "CLM-L0007-002",
        passage: "Serum transaminase levels >1000 U/L occur predominantly in ischemic hepatitis ('shock liver'), acute acetaminophen toxicity, or acute viral hepatitis.",
        citationIds: ["CIT-0072"]
      },
      {
        claimId: "CLM-L0007-003",
        passage: "AST:ALT ratio >2:1 combined with elevated GGT is highly suggestive of Alcoholic Liver Disease.",
        citationIds: ["CIT-0072"]
      },
      {
        claimId: "CLM-L0007-004",
        passage: "Homeopathic supportive management (e.g., Chelidonium, Carduus Marianus) does not substitute for urgent hepatology evaluation or N-acetylcysteine therapy in acute acetaminophen toxicity.",
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
  tags: ["LFT", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/lft",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of LFT test guidelines"]
};
