import { KnowledgeEntity } from "../../types";

export const BelladonnaRemedy: KnowledgeEntity = {
  id: "R0007",
  slug: "belladonna",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Belladonna (Deadly Nightshade)",
    hi: "Belladonna",
    gu: "Belladonna",
    mr: "Belladonna",
    es: "Belladonna",
    ar: "Belladonna"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Brain and Blood vessels and Nerves and Skin.",
    hi: "Belladonna का होम्योपैथिक विवरण.",
    gu: "Belladonna હોમિયોપેથિક દવા.",
    mr: "Belladonna चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Brain y Blood vessels y Nerves y Skin.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Brain و Blood vessels و Nerves و Skin."
  },
  content: {
    latinName: "Belladonna",
    commonName: "Deadly Nightshade",
    source: "Atropa belladonna plant",
    kingdom: "Plant",
    remedyType: "Polychrest / Acute",
    description: "Belladonna is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Sudden, violent onset of symptoms with high fever",
    "Throbbing headache with hot, red skin and dilated pupils",
    "Aggravation from light, noise, jar, or lying down"
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
    "Brain",
    "Blood vessels",
    "Nerves",
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
  tags: ["Belladonna", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/belladonna",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Belladonna remedy profile"]
};
