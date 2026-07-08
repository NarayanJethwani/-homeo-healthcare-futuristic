import { KnowledgeEntity } from "../../types";

export const SepiaOfficinalisRemedy: KnowledgeEntity = {
  id: "R0021",
  slug: "sepia-officinalis",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Sepia Officinalis (Cuttlefish Ink)",
    hi: "Sepia Officinalis",
    gu: "Sepia Officinalis",
    mr: "Sepia Officinalis",
    es: "Sepia Officinalis",
    ar: "Sepia Officinalis"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Uterus and Portal System and Veins and Nerves.",
    hi: "Sepia Officinalis का होम्योपैथिक विवरण.",
    gu: "Sepia Officinalis હોમિયોપેથિક દવા.",
    mr: "Sepia Officinalis चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Uterus y Portal System y Veins y Nerves.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Uterus و Portal System و Veins و Nerves."
  },
  content: {
    latinName: "Sepia Officinalis",
    commonName: "Cuttlefish Ink",
    source: "Inky juice of cuttlefish",
    kingdom: "Animal",
    remedyType: "Polychrest / Constitutional",
    description: "Sepia Officinalis is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Indifference to loved ones; sad, weary, and irritable constitutional type",
    "Bearing-down sensation as if everything would escape through pelvis",
    "Yellow saddle across nose; relief from vigorous physical exercise"
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
    "Uterus",
    "Portal System",
    "Veins",
    "Nerves"
],
    miasmaticAffinity: ["Psora"],
    constitution: "Suited to individuals showing typical indications for constitutional Animal remedies.",
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
  tags: ["Sepia Officinalis", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sepia-officinalis",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Sepia Officinalis remedy profile"]
};
