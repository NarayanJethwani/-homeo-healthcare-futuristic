import { KnowledgeEntity } from "../../types";

export const ArsenicumAlbumRemedy: KnowledgeEntity = {
  id: "R0006",
  slug: "arsenicum-album",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Arsenicum Album (White Oxide of Arsenic)",
    hi: "Arsenicum Album",
    gu: "Arsenicum Album",
    mr: "Arsenicum Album",
    es: "Arsenicum Album",
    ar: "Arsenicum Album"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Mucous Membranes and Mind and GI Tract and Nerves.",
    hi: "Arsenicum Album का होम्योपैथिक विवरण.",
    gu: "Arsenicum Album હોમિયોપેથિક દવા.",
    mr: "Arsenicum Album चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Mucous Membranes y Mind y GI Tract y Nerves.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Mucous Membranes و Mind و GI Tract و Nerves."
  },
  content: {
    latinName: "Arsenicum Album",
    commonName: "White Oxide of Arsenic",
    source: "Arsenious acid",
    kingdom: "Mineral",
    remedyType: "Polychrest / Constitutional",
    description: "Arsenicum Album is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Great anxiety, restlessness, fear of death",
    "Burning pains relieved by heat",
    "Thirst for small quantities of cold water at frequent intervals"
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
    "Mucous Membranes",
    "Mind",
    "GI Tract",
    "Nerves"
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
  tags: ["Arsenicum Album", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/arsenicum-album",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Arsenicum Album remedy profile"]
};
