import { KnowledgeEntity } from "../../types";

export const NuxMoschataRemedy: KnowledgeEntity = {
  id: "R0056",
  slug: "nux-moschata",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Nux Moschata (Nux Moschata Common)",
    hi: "Nux Moschata",
    gu: "Nux Moschata",
    mr: "Nux Moschata",
    es: "Nux Moschata",
    ar: "Nux Moschata"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Skin and Mucous Membranes and Nerves.",
    hi: "Nux Moschata का होम्योपैथिक विवरण.",
    gu: "Nux Moschata હોમિયોપેથિક દવા.",
    mr: "Nux Moschata चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Skin y Mucous Membranes y Nerves.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Skin و Mucous Membranes و Nerves."
  },
  content: {
    latinName: "Nux Moschata",
    commonName: "Nux Moschata Common",
    source: "Nux Moschata source material",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description: "Nux Moschata is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Key clinical indication 1 for Nux Moschata.",
    "Aggravation from cold, wet weather and relief from dry warmth.",
    "Marked constitutional affinity with typical physical presentations."
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
    "Skin",
    "Mucous Membranes",
    "Nerves"
],
    miasmaticAffinity: ["Psora"],
    constitution: "Suited to individuals showing typical indications for constitutional Plant remedies.",
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
  tags: ["Nux Moschata", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/nux-moschata",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Nux Moschata remedy profile"]
};
