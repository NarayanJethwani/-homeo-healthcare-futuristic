import { KnowledgeEntity } from "../../types";

export const CalcareaCarbonicaRemedy: KnowledgeEntity = {
  id: "R0009",
  slug: "calcarea-carbonica",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Calcarea Carbonica (Oyster Shell)",
    hi: "Calcarea Carbonica",
    gu: "Calcarea Carbonica",
    mr: "Calcarea Carbonica",
    es: "Calcarea Carbonica",
    ar: "Calcarea Carbonica"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Bones and Glands and Blood and Lymphatics.",
    hi: "Calcarea Carbonica का होम्योपैथिक विवरण.",
    gu: "Calcarea Carbonica હોમિયોપેથિક દવા.",
    mr: "Calcarea Carbonica चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Bones y Glands y Blood y Lymphatics.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Bones و Glands و Blood و Lymphatics."
  },
  content: {
    latinName: "Calcarea Carbonica",
    commonName: "Oyster Shell",
    source: "Middle layer of oyster shell",
    kingdom: "Animal",
    remedyType: "Polychrest / Constitutional",
    description: "Calcarea Carbonica is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Chilly, sluggish metabolic type; sweats easily, especially on head",
    "Apprehensive, fears losing mind or infectious diseases",
    "Craving for boiled eggs and indigestible things"
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
    "Bones",
    "Glands",
    "Blood",
    "Lymphatics"
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
  tags: ["Calcarea Carbonica", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/calcarea-carbonica",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Calcarea Carbonica remedy profile"]
};
