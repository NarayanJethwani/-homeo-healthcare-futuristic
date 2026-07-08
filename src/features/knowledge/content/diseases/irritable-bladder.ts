import { KnowledgeEntity } from "../../types";

export const IrritableBladderDisease: KnowledgeEntity = {
  id: "D0069",
  slug: "irritable-bladder",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Irritable Bladder",
    hi: "Irritable Bladder",
    gu: "Irritable Bladder",
    mr: "Irritable Bladder",
    es: "Irritable Bladder",
    ar: "Irritable Bladder"
  },
  summary: {
    en: "A comprehensive clinical overview of Irritable Bladder, covering causes, clinical symptoms, and homeopathic management principles.",
    hi: "Irritable Bladder का नैदानिक विवरण.",
    gu: "Irritable Bladder નો તબીબી પરિચય.",
    mr: "Irritable Bladder चे आजार आणि माहिती.",
    es: "Un resumen clínico completo de Irritable Bladder.",
    ar: "نظرة عامة سريرية شاملة لـ Irritable Bladder."
  },
  content: {
  "overview": "Irritable bladder: Renal and lower urinary tract disorders affect fluid regulation, electrolyte balance, and bladder detrusor tone. Care targets mucosal lining health, glomerular filtration efficiency, and autonomic bladder control.",
  "definition": "Inflammatory or functional disorders of the urinary tract and kidneys, characterized by mucosal irritation, detrusor instability, or early glomerular filtration changes.",
  "causes": [
    "Bacterial migration and mucosal adherence within the urinary tract",
    "Autonomic bladder dysregulation and detrusor instability",
    "Increased glomerular capillary pressure leading to filtration leaks (e.g., microalbuminuria)"
  ],
  "riskFactors": [
    "Inadequate daily hydration",
    "Co-existing metabolic diseases (Diabetes, Hypertension)",
    "Frequent catheterization or structural urinary stasis"
  ],
  "symptoms": [
    "Burning or stinging sensation during micturition (dysuria)",
    "Urgency, frequency, and nocturia",
    "Dull dragging pain in the suprapubic or lumbar region",
    "Changes in urine output, color, or turbidity"
  ],
  "diagnosis": "Evaluated through urinalysis, urine culture, microalbumin-to-creatinine ratio (ACR), serum creatinine, and renal ultrasound.",
  "differentialDiagnosis": "Differentiate interstitial cystitis from acute bacterial cystitis, and early nephropathy from benign postural proteinuria.",
  "conventionalManagement": "Standard therapy uses antibiotics for infections, anticholinergics for overactive bladder, and ACE inhibitors to reduce glomerular capillary pressure.",
  "homeopathicApproach": "Aims to reduce mucosal irritation, strengthen detrusor coordination, and support glomerular filtration using targeted remedies.",
  "lifestyleAdvice": "Ensure high fluid intake (predominantly water), avoid known bladder irritants like caffeine, alcohol, and spicy foods, and avoid delaying urination.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What are the common causes of recurring burning urination?",
      "answer": "Common causes include urinary tract infections (UTIs), bladder irritation (from caffeine, spices), interstitial cystitis, or early signs of renal sand (gravel)."
    },
    {
      "question": "How does microalbuminuria reflect kidney health?",
      "answer": "Microalbuminuria is the presence of small amounts of albumin in the urine, indicating early glomerular capillary strain, typically associated with diabetes or hypertension."
    },
    {
      "question": "Can homeopathy support bladder control and urinary health?",
      "answer": "Yes. Homeopathic remedies help soothe bladder lining irritation, support detrusor muscle tone, and manage chronic urinary susceptibility under medical supervision."
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
    specialty: "Clinical Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Irritable Bladder", "Disease", "Clinical-Overview"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/irritable-bladder",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Irritable Bladder profile"]
};
