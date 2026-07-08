import { KnowledgeEntity } from "../../types";

export const BryoniaAlbaRemedy: KnowledgeEntity = {
  id: "R0008",
  slug: "bryonia-alba",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Bryonia Alba (Wild Hops)",
    hi: "Bryonia Alba",
    gu: "Bryonia Alba",
    mr: "Bryonia Alba",
    es: "Bryonia Alba",
    ar: "Bryonia Alba"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Serous Membranes and Lungs and Joints and Liver.",
    hi: "Bryonia Alba का होम्योपैथिक विवरण.",
    gu: "Bryonia Alba હોમિયોપેથિક દવા.",
    mr: "Bryonia Alba चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Serous Membranes y Lungs y Joints y Liver.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Serous Membranes و Lungs و Joints و Liver."
  },
  content: {
    latinName: "Bryonia Alba",
    commonName: "Wild Hops",
    source: "Bryonia alba root",
    kingdom: "Plant",
    remedyType: "Polychrest / Constitutional",
    description: "Bryonia Alba is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Aggravation from the slightest motion; relief from absolute rest",
    "Stitching, tearing pains",
    "Great thirst for large quantities of cold water at long intervals"
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
    "Serous Membranes",
    "Lungs",
    "Joints",
    "Liver"
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
  tags: ["Bryonia Alba", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/bryonia-alba",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Bryonia Alba remedy profile"]
};
