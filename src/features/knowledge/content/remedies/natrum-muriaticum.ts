import { KnowledgeEntity } from "../../types";

export const NatrumMuriaticumRemedy: KnowledgeEntity = {
  id: "R0017",
  slug: "natrum-muriaticum",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Natrum Muriaticum (Common Salt)",
    hi: "Natrum Muriaticum",
    gu: "Natrum Muriaticum",
    mr: "Natrum Muriaticum",
    es: "Natrum Muriaticum",
    ar: "Natrum Muriaticum"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Blood and Nerves and Skin and Mucous Membranes.",
    hi: "Natrum Muriaticum का होम्योपैथिक विवरण.",
    gu: "Natrum Muriaticum હોમિયોપેથિક દવા.",
    mr: "Natrum Muriaticum चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Blood y Nerves y Skin y Mucous Membranes.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Blood و Nerves و Skin و Mucous Membranes."
  },
  content: {
    latinName: "Natrum Muriaticum",
    commonName: "Common Salt",
    source: "Sodium chloride",
    kingdom: "Mineral",
    remedyType: "Polychrest / Constitutional",
    description: "Natrum Muriaticum is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Silent grief, dwells on past unpleasant memories; consolidation aggravates",
    "Hammering headache, worse from sunrise to sunset",
    "Mapped tongue; craving for salt"
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
    "Blood",
    "Nerves",
    "Skin",
    "Mucous Membranes"
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
  tags: ["Natrum Muriaticum", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/natrum-muriaticum",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Natrum Muriaticum remedy profile"]
};
