import { KnowledgeEntity } from "../../types";

export const PhosphorusRemedy: KnowledgeEntity = {
  id: "R0018",
  slug: "phosphorus",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Phosphorus (Elemental Phosphorus)",
    hi: "Phosphorus",
    gu: "Phosphorus",
    mr: "Phosphorus",
    es: "Phosphorus",
    ar: "Phosphorus"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Blood vessels and Lungs and Nerves and Liver.",
    hi: "Phosphorus का होम्योपैथिक विवरण.",
    gu: "Phosphorus હોમિયોપેથિક દવા.",
    mr: "Phosphorus चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Blood vessels y Lungs y Nerves y Liver.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Blood vessels و Lungs و Nerves و Liver."
  },
  content: {
    latinName: "Phosphorus",
    commonName: "Elemental Phosphorus",
    source: "Phosphorus",
    kingdom: "Mineral",
    remedyType: "Polychrest / Constitutional",
    description: "Phosphorus is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Tall, slender, fair-skinned persons with active minds; highly sympathetic",
    "Hemorrhagic diathesis; easy bleeding from small wounds",
    "Craving for cold drinks, ice cream, and salty foods"
],
    mentalSymptoms: [
      "Anxiety or irritability corresponding to constitutional stressors.",
      "Sensitive to environmental disharmony or emotional overstimulation."
    ],
    physicalSymptoms: [
      "Physical sensitivity matching the primary organ affinities.",
      "Tension, stiffness, or functional sluggishness."
    ],
    generalities: "Chilly or warm depending on patient constitution; sensitive to weather changes and environmental stress.",
    modalitiesBetter: [
      "Warm, dry environment",
      "Gentle motion",
      "Rest"
    ],
    modalitiesWorse: [
      "Cold, damp air",
      "Sudden temperature transitions",
      "Mental exertion"
    ],
    clinicalUses: [
      "General fatigue",
      "Mild functional disturbances",
      "Supportive constitutional therapy"
    ],
    organAffinity: [
    "Blood vessels",
    "Lungs",
    "Nerves",
    "Liver"
],
    miasmaticAffinity: ["Psora"],
    constitution: "Suited to individuals showing typical indications for constitutional Mineral remedies.",
    potencies: ["30C", "200C"],
    safetyNotes: "Educational overview only. Use under qualified clinician guidance.",
    references: ["CIT-0001", "CIT-0002"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Prescribing",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Phosphorus", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/phosphorus",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Phosphorus remedy profile"]
};
