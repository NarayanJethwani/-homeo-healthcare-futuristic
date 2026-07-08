import { KnowledgeEntity } from "../../types";

export const ThujaOccidentalisRemedy: KnowledgeEntity = {
  id: "R0023",
  slug: "thuja-occidentalis",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Thuja Occidentalis (Arbor Vitae)",
    hi: "Thuja Occidentalis",
    gu: "Thuja Occidentalis",
    mr: "Thuja Occidentalis",
    es: "Thuja Occidentalis",
    ar: "Thuja Occidentalis"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Skin and Genitourinary Organs and Mind and Glands.",
    hi: "Thuja Occidentalis का होम्योपैथिक विवरण.",
    gu: "Thuja Occidentalis હોમિયોપેથિક દવા.",
    mr: "Thuja Occidentalis चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Skin y Genitourinary Organs y Mind y Glands.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Skin و Genitourinary Organs و Mind و Glands."
  },
  content: {
    latinName: "Thuja Occidentalis",
    commonName: "Arbor Vitae",
    source: "Thuja occidentalis leaves",
    kingdom: "Plant",
    remedyType: "Polychrest / Sycotic",
    description: "Thuja Occidentalis is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Sycotic dyscrasia; warts, condylomata, and sycotic excrescences",
    "Fixed ideas: feels as if body were made of glass or something alive inside",
    "Aggravation from damp, cold air, onions, and vaccination"
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
    "Skin",
    "Genitourinary Organs",
    "Mind",
    "Glands"
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
  tags: ["Thuja Occidentalis", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/thuja-occidentalis",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Thuja Occidentalis remedy profile"]
};
