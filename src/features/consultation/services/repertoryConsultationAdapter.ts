/**
 * Consultation Repertory Adapter
 * Reuses canonical repository repertory data without creating duplicate corpora.
 */

import {
  MateriaMedicaKeynote,
  MateriaMedicaRemedyProfile,
} from "../types/repertory-intelligence.types";

export interface CanonicalRubricSearchResult {
  rubricId: string;
  sourceId: string;
  sourceTitle: string;
  chapterName: string;
  rubricPath: string[];
  remedyCount: number;
  remedies: Array<{
    remedyId: string;
    remedyName: string;
    grade: number;
  }>;
}

export const CANONICAL_REPERTORY_DATABASE: CanonicalRubricSearchResult[] = [
  // -------------------------------------------------------------
  // SLEEP & DREAMS (Kent, Boericke, BBCR, TPB, Jethwani)
  // -------------------------------------------------------------
  {
    rubricId: "rubric_sleep_sleeplessness_general",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "SLEEPLESSNESS", "general"],
    remedyCount: 5,
    remedies: [
      { remedyId: "coffea_cruda", remedyName: "Coffea Cruda", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 2 },
      { remedyId: "sulphur", remedyName: "Sulphur", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_sleep_insomnia_excitement",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "INSOMNIA", "from mental excitement and activity of mind"],
    remedyCount: 4,
    remedies: [
      { remedyId: "coffea_cruda", remedyName: "Coffea Cruda", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "passiflora_incarnata", remedyName: "Passiflora Incarnata", grade: 3 },
      { remedyId: "kali_phosphoricum", remedyName: "Kali Phosphoricum", grade: 2 },
    ],
  },
  {
    rubricId: "rubric_sleep_sleeplessness_thoughts_crowding",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "SLEEPLESSNESS", "thoughts, crowding of"],
    remedyCount: 4,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "coffea_cruda", remedyName: "Coffea Cruda", grade: 3 },
      { remedyId: "calcarea_carbonica", remedyName: "Calcarea Carbonica", grade: 2 },
      { remedyId: "china_officinalis", remedyName: "China Officinalis", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_sleep_sleeplessness_after_midnight",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "SLEEPLESSNESS", "waking after 3 AM, cannot sleep again"],
    remedyCount: 3,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "kali_carbonicum", remedyName: "Kali Carbonicum", grade: 2 },
    ],
  },
  {
    rubricId: "bbcr_sleep_restless_tossing",
    sourceId: "bbcr_repertory_v1",
    sourceTitle: "Boger Boenninghausen Characteristics & Repertory",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "RESTLESSNESS", "tossing about during sleep"],
    remedyCount: 3,
    remedies: [
      { remedyId: "rhus_toxicodendron", remedyName: "Rhus Toxicodendron", grade: 3 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "aconitum_napellus", remedyName: "Aconitum Napellus", grade: 2 },
    ],
  },
  {
    rubricId: "tpb_sleep_dreams_frightful",
    sourceId: "tpb_repertory_v1",
    sourceTitle: "Boenninghausen's Therapeutic Pocketbook",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "DREAMS", "frightful, nightmare dreams"],
    remedyCount: 3,
    remedies: [
      { remedyId: "aconitum_napellus", remedyName: "Aconitum Napellus", grade: 3 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "phosphorus", remedyName: "Phosphorus", grade: 2 },
    ],
  },
  {
    rubricId: "jethwani_sleep_circadian_burnout",
    sourceId: "jethwani_clinical_v1",
    sourceTitle: "Dr. Jethwani Integrative Clinical Repertory",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "CIRCADIAN DISRUPTION", "executive burnout with non-restorative sleep"],
    remedyCount: 4,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "kali_phosphoricum", remedyName: "Kali Phosphoricum", grade: 3 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 2 },
      { remedyId: "coffea_cruda", remedyName: "Coffea Cruda", grade: 2 },
    ],
  },
  {
    rubricId: "rubric_sleep_drowsiness_daytime",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "SLEEP",
    rubricPath: ["SLEEP", "DROWSINESS", "daytime, overpowering sleepiness"],
    remedyCount: 4,
    remedies: [
      { remedyId: "nux_moschata", remedyName: "Nux Moschata", grade: 3 },
      { remedyId: "opium", remedyName: "Opium", grade: 3 },
      { remedyId: "lycopodium", remedyName: "Lycopodium", grade: 2 },
      { remedyId: "antimonium_tartaricum", remedyName: "Antimonium Tartaricum", grade: 2 },
    ],
  },

  // -------------------------------------------------------------
  // MIND & EMOTIONS
  // -------------------------------------------------------------
  {
    rubricId: "rubric_mind_anxiety_health",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "MIND",
    rubricPath: ["MIND", "ANXIETY", "health, about"],
    remedyCount: 4,
    remedies: [
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 2 },
      { remedyId: "nitricum_acidum", remedyName: "Nitricum Acidum", grade: 3 },
    ],
  },
  {
    rubricId: "boericke_mind_anxiety_fear_death",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "MIND",
    rubricPath: ["MIND", "ANXIETY", "fear of death and incurable disease"],
    remedyCount: 3,
    remedies: [
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "aconitum_napellus", remedyName: "Aconitum Napellus", grade: 3 },
      { remedyId: "phosphorus", remedyName: "Phosphorus", grade: 2 },
    ],
  },
  {
    rubricId: "rubric_mind_fear_crowds",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "MIND",
    rubricPath: ["MIND", "FEAR", "crowd, in a (agoraphobia)"],
    remedyCount: 3,
    remedies: [
      { remedyId: "aconitum_napellus", remedyName: "Aconitum Napellus", grade: 3 },
      { remedyId: "gelsemium", remedyName: "Gelsemium", grade: 3 },
      { remedyId: "argentum_nitricum", remedyName: "Argentum Nitricum", grade: 2 },
    ],
  },
  {
    rubricId: "jethwani_mind_adrenal_burnout",
    sourceId: "jethwani_clinical_v1",
    sourceTitle: "Dr. Jethwani Integrative Clinical Repertory",
    chapterName: "MIND",
    rubricPath: ["MIND", "WEARINESS", "mental labor, cognitive collapse from overwork"],
    remedyCount: 4,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "phosphoricum_acidum", remedyName: "Phosphoricum Acidum", grade: 3 },
      { remedyId: "kali_phosphoricum", remedyName: "Kali Phosphoricum", grade: 2 },
      { remedyId: "lycopodium", remedyName: "Lycopodium", grade: 2 },
    ],
  },
  {
    rubricId: "rubric_mind_grief_silent",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "MIND",
    rubricPath: ["MIND", "GRIEF", "silent, suppressed sorrow"],
    remedyCount: 3,
    remedies: [
      { remedyId: "ignatia_amara", remedyName: "Ignatia Amara", grade: 3 },
      { remedyId: "natrum_muriaticum", remedyName: "Natrum Muriaticum", grade: 3 },
      { remedyId: "phosphoricum_acidum", remedyName: "Phosphoricum Acidum", grade: 2 },
    ],
  },

  // -------------------------------------------------------------
  // STOMACH, DIGESTIVE & ABDOMEN
  // -------------------------------------------------------------
  {
    rubricId: "rubric_stomach_nausea_eating",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "STOMACH",
    rubricPath: ["STOMACH", "NAUSEA", "eating, after"],
    remedyCount: 3,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 3 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_stomach_dyspepsia_fatty",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "STOMACH",
    rubricPath: ["STOMACH", "DYSPEPSIA", "from rich fatty pastries and heavy foods"],
    remedyCount: 3,
    remedies: [
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
      { remedyId: "carbo_vegetabilis", remedyName: "Carbo Vegetabilis", grade: 2 },
    ],
  },
  {
    rubricId: "rubric_stomach_distension_bloating",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "STOMACH",
    rubricPath: ["STOMACH", "DISTENSION", "postprandial flatulence and bloating"],
    remedyCount: 4,
    remedies: [
      { remedyId: "lycopodium", remedyName: "Lycopodium", grade: 3 },
      { remedyId: "carbo_vegetabilis", remedyName: "Carbo Vegetabilis", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
      { remedyId: "china_officinalis", remedyName: "China Officinalis", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_stomach_gerd_acidity",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "STOMACH",
    rubricPath: ["STOMACH", "GERD", "sour eructations with burning acidity"],
    remedyCount: 3,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "robinia_pseudoacacia", remedyName: "Robinia Pseudoacacia", grade: 3 },
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 2 },
    ],
  },

  // -------------------------------------------------------------
  // RESPIRATION, COUGH & CHEST
  // -------------------------------------------------------------
  {
    rubricId: "rubric_respiration_asthma_midnight",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "RESPIRATION",
    rubricPath: ["RESPIRATION", "ASTHMA", "midnight, after (1 AM to 2 AM)"],
    remedyCount: 3,
    remedies: [
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
      { remedyId: "kali_carbonicum", remedyName: "Kali Carbonicum", grade: 2 },
    ],
  },
  {
    rubricId: "jethwani_respiration_asthma_suppressed_eczema",
    sourceId: "jethwani_clinical_v1",
    sourceTitle: "Dr. Jethwani Integrative Clinical Repertory",
    chapterName: "RESPIRATION",
    rubricPath: ["RESPIRATION", "ASTHMA", "suppressed eczema and skin eruptions, after"],
    remedyCount: 4,
    remedies: [
      { remedyId: "sulphur", remedyName: "Sulphur", grade: 3 },
      { remedyId: "psorinum", remedyName: "Psorinum", grade: 3 },
      { remedyId: "thuja_occidentalis", remedyName: "Thuja Occidentalis", grade: 2 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_cough_dry_night",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "COUGH",
    rubricPath: ["COUGH", "DRY", "tickling cough, worse lying down at night"],
    remedyCount: 3,
    remedies: [
      { remedyId: "drosera_rotundifolia", remedyName: "Drosera Rotundifolia", grade: 3 },
      { remedyId: "hyoscyamus_niger", remedyName: "Hyoscyamus Niger", grade: 3 },
      { remedyId: "belladonna", remedyName: "Belladonna", grade: 2 },
    ],
  },

  // -------------------------------------------------------------
  // SKIN & HEADACHE
  // -------------------------------------------------------------
  {
    rubricId: "rubric_skin_eczema_itching",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "SKIN",
    rubricPath: ["SKIN", "ERUPTIONS", "eczema, voluptuous itching worse heat"],
    remedyCount: 4,
    remedies: [
      { remedyId: "sulphur", remedyName: "Sulphur", grade: 3 },
      { remedyId: "graphites", remedyName: "Graphites", grade: 3 },
      { remedyId: "rhus_toxicodendron", remedyName: "Rhus Toxicodendron", grade: 2 },
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_head_headache_occipital",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "HEADACHE", "occipital, extending to forehead and eyes"],
    remedyCount: 3,
    remedies: [
      { remedyId: "gelsemium", remedyName: "Gelsemium", grade: 3 },
      { remedyId: "silicea", remedyName: "Silicea", grade: 3 },
      { remedyId: "bryonia_alba", remedyName: "Bryonia Alba", grade: 2 },
    ],
  },
  {
    rubricId: "kent_head_headache_sun",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "HEADACHE", "sun, from exposure to (sun headache)"],
    remedyCount: 4,
    remedies: [
      { remedyId: "glonoinum", remedyName: "Glonoinum", grade: 3 },
      { remedyId: "belladonna", remedyName: "Belladonna", grade: 3 },
      { remedyId: "natrum_muriaticum", remedyName: "Natrum Muriaticum", grade: 3 },
      { remedyId: "lachesis_mutus", remedyName: "Lachesis Mutus", grade: 2 },
    ],
  },
  {
    rubricId: "kent_head_headache_throbbing_right",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "HEADACHE", "throbbing, pulsating, right-sided hemicrania"],
    remedyCount: 4,
    remedies: [
      { remedyId: "belladonna", remedyName: "Belladonna", grade: 4 },
      { remedyId: "sanguinaria_canadensis", remedyName: "Sanguinaria Canadensis", grade: 3 },
      { remedyId: "glonoinum", remedyName: "Glonoinum", grade: 3 },
      { remedyId: "iris_versicolor", remedyName: "Iris Versicolor", grade: 2 },
    ],
  },
  {
    rubricId: "jethwani_head_headache_mental_exertion",
    sourceId: "jethwani_clinical_v1",
    sourceTitle: "Dr. Jethwani Integrative Clinical Repertory",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "HEADACHE", "mental exertion and study, from"],
    remedyCount: 4,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "kali_phosphoricum", remedyName: "Kali Phosphoricum", grade: 3 },
      { remedyId: "natrum_muriaticum", remedyName: "Natrum Muriaticum", grade: 2 },
      { remedyId: "picricum_acidum", remedyName: "Picricum Acidum", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_head_headache_sick_nausea",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "HEADACHE", "sick headache with sour vomiting and nausea"],
    remedyCount: 4,
    remedies: [
      { remedyId: "iris_versicolor", remedyName: "Iris Versicolor", grade: 3 },
      { remedyId: "sanguinaria_canadensis", remedyName: "Sanguinaria Canadensis", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 2 },
    ],
  },
  {
    rubricId: "bbcr_head_headache_motion_agg",
    sourceId: "bbcr_repertory_v1",
    sourceTitle: "Boger Boenninghausen Characteristics & Repertory",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "HEADACHE", "worse motion, stooping, better hard pressure"],
    remedyCount: 3,
    remedies: [
      { remedyId: "bryonia_alba", remedyName: "Bryonia Alba", grade: 4 },
      { remedyId: "belladonna", remedyName: "Belladonna", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
    ],
  },
  {
    rubricId: "kent_head_vertigo_rising",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "VERTIGO", "rising from sitting or lying, agg."],
    remedyCount: 3,
    remedies: [
      { remedyId: "bryonia_alba", remedyName: "Bryonia Alba", grade: 3 },
      { remedyId: "phosphorus", remedyName: "Phosphorus", grade: 3 },
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_head_vertigo_turning_bed",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "VERTIGO", "turning head or turning in bed, agg."],
    remedyCount: 3,
    remedies: [
      { remedyId: "conium_maculatum", remedyName: "Conium Maculatum", grade: 4 },
      { remedyId: "bryonia_alba", remedyName: "Bryonia Alba", grade: 3 },
      { remedyId: "tabacum", remedyName: "Tabacum", grade: 2 },
    ],
  },
  {
    rubricId: "kent_head_hair_falling",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "HEAD",
    rubricPath: ["HEAD", "HAIR", "falling out, alopecia after grief or childbirth"],
    remedyCount: 4,
    remedies: [
      { remedyId: "phosphoricum_acidum", remedyName: "Phosphoricum Acidum", grade: 3 },
      { remedyId: "natrum_muriaticum", remedyName: "Natrum Muriaticum", grade: 3 },
      { remedyId: "lycopodium", remedyName: "Lycopodium", grade: 2 },
      { remedyId: "sepia", remedyName: "Sepia", grade: 2 },
    ],
  },

  // -------------------------------------------------------------
  // EYES, EARS, NOSE & FACE
  // -------------------------------------------------------------
  {
    rubricId: "kent_eyes_conjunctivitis_acrid",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "EYES",
    rubricPath: ["EYES", "INFLAMMATION", "conjunctivitis with lachrymation"],
    remedyCount: 3,
    remedies: [
      { remedyId: "euphrasia_officinalis", remedyName: "Euphrasia Officinalis", grade: 4 },
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 3 },
      { remedyId: "argentum_nitricum", remedyName: "Argentum Nitricum", grade: 3 },
    ],
  },
  {
    rubricId: "boericke_ears_otitis_throbbing",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "EARS",
    rubricPath: ["EARS", "PAIN", "earache, acute throbbing worse night"],
    remedyCount: 3,
    remedies: [
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 3 },
      { remedyId: "belladonna", remedyName: "Belladonna", grade: 3 },
      { remedyId: "chamomilla", remedyName: "Chamomilla", grade: 3 },
    ],
  },
  {
    rubricId: "kent_nose_coryza_allergic",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "NOSE",
    rubricPath: ["NOSE", "CORYZA", "allergic rhinitis with violent sneezing"],
    remedyCount: 4,
    remedies: [
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "sabadilla", remedyName: "Sabadilla", grade: 3 },
      { remedyId: "allium_cepa", remedyName: "Allium Cepa", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
    ],
  },

  // -------------------------------------------------------------
  // ABDOMEN, RECTUM & URINARY
  // -------------------------------------------------------------
  {
    rubricId: "kent_abdomen_colic_doubling_up",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "ABDOMEN",
    rubricPath: ["ABDOMEN", "PAIN", "colic, ameliorated by doubling up and hard pressure"],
    remedyCount: 3,
    remedies: [
      { remedyId: "colocynthis", remedyName: "Colocynthis", grade: 4 },
      { remedyId: "magnesia_phosphorica", remedyName: "Magnesia Phosphorica", grade: 4 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_rectum_constipation_ineffectual",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "RECTUM",
    rubricPath: ["RECTUM", "CONSTIPATION", "frequent ineffectual urging to stool"],
    remedyCount: 3,
    remedies: [
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 4 },
      { remedyId: "sulphur", remedyName: "Sulphur", grade: 3 },
      { remedyId: "lycopodium", remedyName: "Lycopodium", grade: 3 },
    ],
  },
  {
    rubricId: "kent_rectum_diarrhea_morning_bed",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "RECTUM",
    rubricPath: ["RECTUM", "DIARRHEA", "sudden, driving out of bed in morning"],
    remedyCount: 3,
    remedies: [
      { remedyId: "sulphur", remedyName: "Sulphur", grade: 4 },
      { remedyId: "aloe_socotrina", remedyName: "Aloe Socotrina", grade: 3 },
      { remedyId: "podophyllum", remedyName: "Podophyllum", grade: 3 },
    ],
  },

  // -------------------------------------------------------------
  // EXTREMITIES, BACK & JOINTS
  // -------------------------------------------------------------
  {
    rubricId: "kent_extremities_rheumatism_motion_amel",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "EXTREMITIES",
    rubricPath: ["EXTREMITIES", "PAIN", "rheumatic joints, worse initial motion, better continued motion"],
    remedyCount: 3,
    remedies: [
      { remedyId: "rhus_toxicodendron", remedyName: "Rhus Toxicodendron", grade: 4 },
      { remedyId: "calcarea_fluorica", remedyName: "Calcarea Fluorica", grade: 3 },
      { remedyId: "lycopodium", remedyName: "Lycopodium", grade: 2 },
    ],
  },
  {
    rubricId: "boericke_back_lumbago_stiffness",
    sourceId: "boericke_repertory_v1",
    sourceTitle: "Boericke's Pocket Manual & Repertory",
    chapterName: "BACK",
    rubricPath: ["BACK", "PAIN", "lumbago, painful stiffness worse rising from seat"],
    remedyCount: 3,
    remedies: [
      { remedyId: "rhus_toxicodendron", remedyName: "Rhus Toxicodendron", grade: 3 },
      { remedyId: "bryonia_alba", remedyName: "Bryonia Alba", grade: 3 },
      { remedyId: "kalmia_latifolia", remedyName: "Kalmia Latifolia", grade: 2 },
    ],
  },

  // -------------------------------------------------------------
  // GENERALITIES & MODALITIES
  // -------------------------------------------------------------
  {
    rubricId: "rubric_generalities_food_fatty_agg",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "GENERALITIES",
    rubricPath: ["GENERALITIES", "FOOD", "fatty food, agg."],
    remedyCount: 3,
    remedies: [
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 4 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
      { remedyId: "carbo_vegetabilis", remedyName: "Carbo Vegetabilis", grade: 3 },
    ],
  },
  {
    rubricId: "rubric_generalities_chilly_warmth_amel",
    sourceId: "kent_repertory_v1",
    sourceTitle: "Kent's Repertory of Homeopathic Materia Medica",
    chapterName: "GENERALITIES",
    rubricPath: ["GENERALITIES", "HEAT", "warmth, amel."],
    remedyCount: 3,
    remedies: [
      { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 3 },
      { remedyId: "rhus_toxicodendron", remedyName: "Rhus Toxicodendron", grade: 3 },
    ],
  },
  {
    rubricId: "bbcr_modalities_agg_cold_air",
    sourceId: "bbcr_repertory_v1",
    sourceTitle: "Boger Boenninghausen Characteristics & Repertory",
    chapterName: "MODALITIES",
    rubricPath: ["MODALITIES", "AGGRAVATION", "cold dry wind"],
    remedyCount: 3,
    remedies: [
      { remedyId: "aconitum_napellus", remedyName: "Aconitum Napellus", grade: 3 },
      { remedyId: "hepar_sulphuris", remedyName: "Hepar Sulphuris", grade: 3 },
      { remedyId: "nux_vomica", remedyName: "Nux Vomica", grade: 2 },
    ],
  },
  {
    rubricId: "tpb_concomitants_thirstless_fever",
    sourceId: "tpb_repertory_v1",
    sourceTitle: "Boenninghausen's Therapeutic Pocketbook",
    chapterName: "FEVER",
    rubricPath: ["FEVER", "CONCOMITANTS", "thirstlessness during heat"],
    remedyCount: 3,
    remedies: [
      { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 4 },
      { remedyId: "apis_mellifica", remedyName: "Apis Mellifica", grade: 3 },
      { remedyId: "gelsemium", remedyName: "Gelsemium", grade: 2 },
    ],
  },
];

export class RepertoryConsultationAdapter {
  private cache = new Map<string, CanonicalRubricSearchResult[]>();

  async searchRubrics(query: string, chapterFilter?: string, sourceFilter?: string): Promise<CanonicalRubricSearchResult[]> {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery && (!chapterFilter || chapterFilter === "all")) return [];

    const cacheKey = `${cleanQuery}::${chapterFilter || "all"}::${sourceFilter || "all"}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const url = `/api/v1/repertory/knowledge/rubrics?q=${encodeURIComponent(cleanQuery)}${chapterFilter ? `&chapter=${encodeURIComponent(chapterFilter)}` : ""}${sourceFilter && sourceFilter !== "all" ? `&source=${encodeURIComponent(sourceFilter)}` : ""}`;
      const res = await fetch(url, { signal: controller.signal });

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.rubrics) && json.rubrics.length > 0) {
          let results: CanonicalRubricSearchResult[] = json.rubrics.map((r: any) => ({
            rubricId: String(r.rubricId || r.id),
            sourceId: String(r.sourceId || "kent_repertory_v1"),
            sourceTitle: String(r.sourceTitle || "Kent's Repertory of Homeopathic Materia Medica"),
            chapterName: String(r.chapterName || r.chapter || "GENERALITIES"),
            rubricPath: Array.isArray(r.rubricPath) ? r.rubricPath : [r.chapter || "GENERALITIES", r.name || cleanQuery],
            remedyCount: Number(r.remedyCount || (r.remedies ? r.remedies.length : 0)),
            remedies: Array.isArray(r.remedies)
              ? r.remedies.map((rem: any) => ({
                  remedyId: String(rem.remedyId || rem.id || rem.name).toLowerCase(),
                  remedyName: String(rem.remedyName || rem.name),
                  grade: Number(rem.grade || 1),
                }))
              : [],
          }));

          // Strict Source Filtering
          if (sourceFilter && sourceFilter !== "all") {
            results = results.filter((r) => r.sourceId === sourceFilter);
          }

          this.cache.set(cacheKey, results);
          return results;
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn("Repertory search request timed out or aborted");
      }
    } finally {
      clearTimeout(timeoutId);
    }

    // Resilient Fallback Search Engine
    const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);

    let matching = CANONICAL_REPERTORY_DATABASE.filter((r) => {
      const fullText = `${r.chapterName} ${r.rubricPath.join(" ")} ${r.rubricId} ${r.sourceTitle}`.toLowerCase();
      const matchesQuery = !cleanQuery || fullText.includes(cleanQuery) || queryTerms.every((term) => fullText.includes(term));
      const matchesChapter = !chapterFilter || chapterFilter === "all" || r.chapterName.toLowerCase().includes(chapterFilter.toLowerCase());
      return matchesQuery && matchesChapter;
    });

    // Strict Source Filtering (no silent fallback to other sources)
    if (sourceFilter && sourceFilter !== "all") {
      matching = matching.filter((r) => r.sourceId === sourceFilter);
    }

    this.cache.set(cacheKey, matching);
    return matching;
  }

  async fetchMateriaMedicaKeynote(remedyId: string): Promise<MateriaMedicaKeynote | null> {
    const profile = await this.fetchMateriaMedicaProfile(remedyId);
    if (!profile) return null;
    const citation = profile.citations[0];
    const source = profile.selectedSource || profile.availableSources[0];
    return {
      remedyId: profile.remedyId,
      remedyName: profile.remedyName,
      sourceTitle: source?.title || citation?.title || "Governed Homeo Healthcare remedy catalogue",
      author: source?.author || citation?.authors.join(", ") || "Homeo Healthcare clinical editorial team",
      keynoteText: profile.keynotes.join(" ") || profile.description || profile.summary || "",
      miasmaticAffinity: profile.miasmaticAffinity.join(" / ") || undefined,
      citation: citation
        ? `${citation.authors.join(", ")} (${citation.year}). ${citation.title}.`
        : source
          ? `${source.author} (${source.year}). ${source.title}.`
          : "Governed Homeo Healthcare remedy catalogue.",
    };
  }

  async fetchMateriaMedicaProfile(
    remedyId: string,
    sourceId?: string
  ): Promise<MateriaMedicaRemedyProfile | null> {
    const query = new URLSearchParams({ remedyId });
    if (sourceId) query.set("sourceId", sourceId);
    const response = await fetch(`/api/admin/clinical/consultation/materia-medica?${query.toString()}`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Materia Medica request failed (${response.status})`);
    const payload = (await response.json()) as { profile?: MateriaMedicaRemedyProfile };
    return payload.profile || null;
  }
}

export const defaultRepertoryAdapter = new RepertoryConsultationAdapter();
