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
  "latinName": "Chamomilla",
  "commonName": "Chamomilla Common",
  "source": "Natural material prepared according to homeopathic pharmacopoeia standards.",
  "kingdom": "Plant",
  "remedyType": "Polychrest",
  "description": "The remedy chamomilla is traditionally considered in constitutional clinical practice for profiles displaying marked physical and emotional characteristics. It exhibits affinity toward specific organ systems and is chosen based on matching modalities.",
  "keynotes": [
    "Modalities of aggravation and amelioration unique to chamomilla.",
    "Marked physical generalities and thermal characteristics.",
    "Concomitant physical symptoms appearing in tandem."
  ],
  "mentalSymptoms": [
    "Altered emotional state corresponding to remedy profile.",
    "Irritability or anxiety under stress.",
    "Cognitive fatigue and sensitivity to environmental stimuli."
  ],
  "physicalSymptoms": [
    "Localized burning, stitching, or throbbing sensations typical of chamomilla.",
    "Altered secretions or mucosal irritation.",
    "Musculoskeletal stiffness or sensory paresthesia."
  ],
  "generalities": "The patient displays typical constitutional reactivity. General physical symptoms are highly influenced by environmental elements like temperature and weather changes.",
  "modalitiesBetter": [
    "Warm dry applications",
    "Rest and quiet environment",
    "Gentle continuous motion"
  ],
  "modalitiesWorse": [
    "Cold damp air or drafts",
    "During rest or early morning",
    "Mental or physical exertion"
  ],
  "clinicalUses": [
    "Constitutional support for general symptoms",
    "Management of chronic tendencies"
  ],
  "organAffinity": [
    "Nervous system and mucosal linings",
    "Gastrointestinal tract"
  ],
  "miasmaticAffinity": [
    "Psora",
    "Sycosis"
  ],
  "constitution": "Suited to individuals showing typical reactivity corresponding to chamomilla pathogenesis.",
  "potencies": [
    "6C",
    "30C",
    "200C",
    "1M"
  ],
  "safetyNotes": "Remedy considerations are for clinician review and require consultation with a qualified physician.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What is a constitutional remedy in homeopathy?",
      "answer": "A constitutional remedy is a deep-acting medicine selected to match a patient's overall physical, mental, and emotional makeup, rather than just treating a single local symptom."
    },
    {
      "question": "Why does the homeopath ask so many detailed questions?",
      "answer": "To find the individualized remedy, the homeopath must understand all unique characteristics—such as sleep patterns, thermal sensitivities, food cravings, and emotional triggers."
    },
    {
      "question": "How should homeopathic remedies be stored?",
      "answer": "Remedies should be stored in a cool, dry place, away from direct sunlight, strong odors (like camphor, perfumes), and electronic devices to maintain their potency."
    }
  ]
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
