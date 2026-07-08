import { KnowledgeEntity } from "../../types";

export const ChamomillaRemedy: KnowledgeEntity = {
  id: "R0011",
  slug: "chamomilla",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Chamomilla (German Chamomile)",
    hi: "Chamomilla",
    gu: "Chamomilla",
    mr: "Chamomilla",
    es: "Chamomilla",
    ar: "Chamomilla"
  },
  summary: {
    en: "A clinically vital homeopathic remedy with primary affinities for the Nerves and Mind and Ears and Digestive Tract.",
    hi: "Chamomilla का होम्योपैथिक विवरण.",
    gu: "Chamomilla હોમિયોપેથિક દવા.",
    mr: "Chamomilla चे होमिओपॅथी माहिती.",
    es: "Un remedio homeopático clave con afinidad clínica para Nerves y Mind y Ears y Digestive Tract.",
    ar: "علاج مثلي هام ذو تقارب سريري لـ Nerves و Mind و Ears و Digestive Tract."
  },
  content: {
    latinName: "Chamomilla",
    commonName: "German Chamomile",
    source: "Matricaria chamomilla plant",
    kingdom: "Plant",
    remedyType: "Polychrest / Pediatric",
    description: "Chamomilla is prepared in accordance with homeopathic pharmacopoeia principles. It has a significant clinical legacy and provides deep constitutional support.",
    keynotes: [
    "Extreme irritability and sensitiveness to pain; child demands to be carried",
    "One cheek red, the other pale during teething",
    "Ailments from anger or teething"
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
    "Mind",
    "Ears",
    "Digestive Tract"
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
  tags: ["Chamomilla", "Remedy", "Homeopathy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/chamomilla",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Chamomilla remedy profile"]
};
