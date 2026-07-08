import { KnowledgeEntity } from "../../types";

export const CarboVegetabilisRemedy: KnowledgeEntity = {
  id: "R0010",
  slug: "carbo-vegetabilis",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Carbo Vegetabilis (Vegetable Charcoal)",
    hi: "Carbo Vegetabilis",
    gu: "Carbo Vegetabilis",
    mr: "Carbo Vegetabilis",
    es: "Carbo Vegetabilis",
    ar: "Carbo Vegetabilis"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Blood and Digestive System and Heart and Lungs.",
    hi: "Carbo Vegetabilis का होम्योपैथिक विवरण.",
    gu: "Carbo Vegetabilis હોમિયોપેથિક દવા.",
    mr: "Carbo Vegetabilis चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Blood y Digestive System y Heart y Lungs.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Blood و Digestive System و Heart و Lungs."
  },
  content: {
    latinName: "Carbo Vegetabilis",
    commonName: "Vegetable Charcoal",
    source: "Charcoal of birch wood",
    kingdom: "Plant",
    remedyType: "Polychrest / Rescue",
    description: "Carbo Vegetabilis is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Great debility, air hunger; wants to be fanned rapidly",
    "Extreme flatulence, abdomen distended, relieved by eructations",
    "Cold sweat, cold breath, and collapsed states"
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
    "Digestive System",
    "Heart",
    "Lungs"
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
  tags: ["Carbo Vegetabilis", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/carbo-vegetabilis",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Carbo Vegetabilis remedy profile"]
};
