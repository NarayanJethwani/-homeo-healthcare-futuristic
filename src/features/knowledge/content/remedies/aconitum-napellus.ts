import { KnowledgeEntity } from "../../types";

export const AconitumNapellusRemedy: KnowledgeEntity = {
  id: "R0004",
  slug: "aconitum-napellus",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Aconitum Napellus (Monkshood)",
    hi: "Aconitum Napellus",
    gu: "Aconitum Napellus",
    mr: "Aconitum Napellus",
    es: "Aconitum Napellus",
    ar: "Aconitum Napellus"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Nerves and Circulation and Heart and Skin.",
    hi: "Aconitum Napellus का होम्योपैथिक विवरण.",
    gu: "Aconitum Napellus હોમિયોપેથિક દવા.",
    mr: "Aconitum Napellus चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Nerves y Circulation y Heart y Skin.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Nerves و Circulation و Heart و Skin."
  },
  content: {
    latinName: "Aconitum Napellus",
    commonName: "Monkshood",
    source: "Aconitum napellus plant",
    kingdom: "Plant",
    remedyType: "Polychrest / Acute",
    description: "Aconitum Napellus is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Sudden onset of intense fever with physical/mental restlessness",
    "Fear of death, highly anxious",
    "Ailments from dry, cold winds"
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
    "Nerves",
    "Circulation",
    "Heart",
    "Skin"
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
  tags: ["Aconitum Napellus", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/aconitum-napellus",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Aconitum Napellus remedy profile"]
};
