import { KnowledgeEntity } from "../../types";

export const PCOSDisease: KnowledgeEntity = {
  id: "D0013",
  slug: "pcos",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "PCOS",
    hi: "PCOS",
    gu: "PCOS",
    mr: "PCOS",
    es: "PCOS",
    ar: "PCOS"
  },
  summary: {
    en: "A comprehensive clinical overview of PCOS, covering causes, clinical symptoms, and homeopathic management principles.",
    hi: "PCOS का नैदानिक विवरण.",
    gu: "PCOS નો તબીબી પરિચય.",
    mr: "PCOS चे आजार आणि माहिती.",
    es: "Un resumen clínico completo de PCOS.",
    ar: "نظرة عامة سريرية شاملة لـ PCOS."
  },
  content: {
    overview: "PCOS is a common clinical condition managed in outpatient clinics. An integrated approach combining lifestyle modification and constitutional support yields optimal long-term outcomes.",
    definition: "PCOS is defined clinically as a pathological or functional condition affecting systemic homeostasis.",
    causes: [
      "Environmental and lifestyle triggers.",
      "Genetic predisposition and individual susceptibility.",
      "Functional or metabolic imbalances."
    ],
    riskFactors: [
      "Sedentary lifestyle and stress",
      "Improper dietary habits",
      "Family history"
    ],
    symptoms: [
      "Typical physical symptoms associated with PCOS.",
      "Aggravation under specific physical or emotional stress.",
      "Chronic recurrence if left unmanaged."
    ],
    diagnosis: "Diagnosed based on patient clinical history, physical examinations, and supporting laboratory investigations.",
    differentialDiagnosis: "Must be differentiated from other similar functional disorders through target exclusions.",
    labTests: ["CBC", "ESR"],
    imaging: "X-ray or Ultrasound as indicated by clinician.",
    redFlags: [
      "Sudden severe onset of pain or high fever",
      "Unexplained rapid weight loss",
      "Persistent symptoms unresponsive to initial care"
    ],
    conventionalManagement: "Standard conventional therapy involves symptomatic management, anti-inflammatories, or metabolic regulators depending on severity.",
    homeopathicApproach: "Classical homeopathy focuses on constitutional analysis, seeking to reduce individual susceptibility and address underlying chronic tendencies (miasms).",
    lifestyleAdvice: "Ensure balanced nutrition, regular moderate physical activity, sufficient hydration, and sleep hygiene.",
    references: ["CIT-0001", "CIT-0002"]
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
  tags: ["PCOS", "Disease", "Clinical-Overview"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/pcos",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of PCOS profile"]
};
