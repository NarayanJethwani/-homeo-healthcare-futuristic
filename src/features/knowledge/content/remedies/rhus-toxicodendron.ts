import { KnowledgeEntity } from "../../types";

export const RhusToxicodendronRemedy: KnowledgeEntity = {
  id: "R0020",
  slug: "rhus-toxicodendron",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Rhus Toxicodendron (Poison Ivy)",
    hi: "Rhus Toxicodendron",
    gu: "Rhus Toxicodendron",
    mr: "Rhus Toxicodendron",
    es: "Rhus Toxicodendron",
    ar: "Rhus Toxicodendron"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Fibrous Tissues and Joints and Skin and Tendons.",
    hi: "Rhus Toxicodendron का होम्योपैथिक विवरण.",
    gu: "Rhus Toxicodendron હોમિયોપેથિક દવા.",
    mr: "Rhus Toxicodendron चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Fibrous Tissues y Joints y Skin y Tendons.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Fibrous Tissues و Joints و Skin و Tendons."
  },
  content: {
    latinName: "Rhus Toxicodendron",
    commonName: "Poison Ivy",
    source: "Rhus toxicodendron leaves",
    kingdom: "Plant",
    remedyType: "Polychrest / Rheumatism",
    description: "Rhus Toxicodendron is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Stiffness and lameness; worse on beginning motion, better by continued motion",
    "Restlessness; must keep moving to find temporary relief",
    "Triangular red tip of tongue; skin vesicular eruptions"
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
    "Fibrous Tissues",
    "Joints",
    "Skin",
    "Tendons"
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
  tags: ["Rhus Toxicodendron", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/rhus-toxicodendron",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Rhus Toxicodendron remedy profile"]
};
