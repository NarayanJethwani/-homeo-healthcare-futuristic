import { KnowledgeEntity } from "../../types";

export const SiliceaTerraRemedy: KnowledgeEntity = {
  id: "R0022",
  slug: "silicea-terra",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Silicea Terra (Pure Silica)",
    hi: "Silicea Terra",
    gu: "Silicea Terra",
    mr: "Silicea Terra",
    es: "Silicea Terra",
    ar: "Silicea Terra"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Connective Tissues and Bones and Glands and Skin.",
    hi: "Silicea Terra का होम्योपैथिक विवरण.",
    gu: "Silicea Terra હોમિયોપેથિક દવા.",
    mr: "Silicea Terra चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Connective Tissues y Bones y Glands y Skin.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Connective Tissues و Bones و Glands و Skin."
  },
  content: {
    latinName: "Silicea Terra",
    commonName: "Pure Silica",
    source: "Silicon dioxide",
    kingdom: "Mineral",
    remedyType: "Polychrest / Constitutional",
    description: "Silicea Terra is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Lack of grit, physically and mentally; timid and refined constitution",
    "Suppurative processes, fistulas, and foreign bodies expelled",
    "Offensive foot sweat; chilly, sensitive to cold air and drafts"
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
    "Connective Tissues",
    "Bones",
    "Glands",
    "Skin"
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
  tags: ["Silicea Terra", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/silicea-terra",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Silicea Terra remedy profile"]
};
