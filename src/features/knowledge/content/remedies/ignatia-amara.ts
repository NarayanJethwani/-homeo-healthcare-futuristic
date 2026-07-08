import { KnowledgeEntity } from "../../types";

export const IgnatiaAmaraRemedy: KnowledgeEntity = {
  id: "R0014",
  slug: "ignatia-amara",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Ignatia Amara (St. Ignatius Bean)",
    hi: "Ignatia Amara",
    gu: "Ignatia Amara",
    mr: "Ignatia Amara",
    es: "Ignatia Amara",
    ar: "Ignatia Amara"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Mind and Nervous System and Throat and Spine.",
    hi: "Ignatia Amara का होम्योपैथिक विवरण.",
    gu: "Ignatia Amara હોમિયોપેથિક દવા.",
    mr: "Ignatia Amara चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Mind y Nervous System y Throat y Spine.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Mind و Nervous System و Throat و Spine."
  },
  content: {
    latinName: "Ignatia Amara",
    commonName: "St. Ignatius Bean",
    source: "Strychnos ignatii seeds",
    kingdom: "Plant",
    remedyType: "Polychrest / Emotional",
    description: "Ignatia Amara is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Acute grief, worry, and emotional shocks; hysterical states",
    "Paradoxical, contradictory symptoms (e.g., sore throat relieved by swallowing solids)",
    "Frequent sighing and sobbing"
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
    "Mind",
    "Nervous System",
    "Throat",
    "Spine"
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
  tags: ["Ignatia Amara", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/ignatia-amara",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Ignatia Amara remedy profile"]
};
