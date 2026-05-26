export interface Rubric {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>; // Maps remedy abbreviation (e.g., "Nux-v") to grade (1, 2, or 3)
}

export const REMEDIES_METADATA: Record<string, { fullName: string; source: string }> = {
  "Acon": { fullName: "Aconitum Napellus", source: "Plant" },
  "Apis": { fullName: "Apis Mellifica", source: "Animal (Bee)" },
  "Arg-n": { fullName: "Argentum Nitricum", source: "Mineral" },
  "Ars": { fullName: "Arsenicum Album", source: "Mineral" },
  "Aur-m": { fullName: "Aurum Metallicum", source: "Mineral" },
  "Baryta-c": { fullName: "Baryta Carbonica", source: "Mineral" },
  "Bell": { fullName: "Belladonna", source: "Plant" },
  "Borax": { fullName: "Borax Veneta", source: "Mineral" },
  "Bry": { fullName: "Bryonia Alba", source: "Plant" },
  "Calc": { fullName: "Calcarea Carbonica", source: "Mineral" },
  "Calc-p": { fullName: "Calcarea Phosphorica", source: "Mineral" },
  "Caust": { fullName: "Causticum", source: "Mineral" },
  "Cham": { fullName: "Chamomilla", source: "Plant" },
  "Coff": { fullName: "Coffea Cruda", source: "Plant" },
  "Coloc": { fullName: "Colocynthis", source: "Plant" },
  "Con": { fullName: "Conium Maculatum", source: "Plant" },
  "Gels": { fullName: "Gelsemium Sempervirens", source: "Plant" },
  "Graph": { fullName: "Graphites", source: "Mineral" },
  "Hep": { fullName: "Hepar Sulphuris Calcareum", source: "Mineral" },
  "Ign": { fullName: "Ignatia Amara", source: "Plant" },
  "Ipec": { fullName: "Ipecacuanha", source: "Plant" },
  "Lach": { fullName: "Lachesis Muta", source: "Animal (Snake)" },
  "Lyc": { fullName: "Lycopodium Clavatum", source: "Plant" },
  "Merc": { fullName: "Mercurius Solubilis", source: "Mineral" },
  "Mez": { fullName: "Mezereum", source: "Plant" },
  "Nat-m": { fullName: "Natrum Muriaticum", source: "Mineral" },
  "Nux-v": { fullName: "Nux Vomica", source: "Plant" },
  "Phos": { fullName: "Phosphorus", source: "Mineral" },
  "Ph-ac": { fullName: "Phosphoricum Acidum", source: "Mineral" },
  "Puls": { fullName: "Pulsatilla Pratensis", source: "Plant" },
  "Rhus-t": { fullName: "Rhus Toxicodendron", source: "Plant" },
  "Sep": { fullName: "Sepia Officinalis", source: "Animal (Cuttlefish)" },
  "Sil": { fullName: "Silicea", source: "Mineral" },
  "Staph": { fullName: "Staphysagria", source: "Plant" },
  "Stram": { fullName: "Stramonium", source: "Plant" },
  "Sulph": { fullName: "Sulphur", source: "Mineral" }
};

export const REPERTORY_CHAPTERS = [
  "Mind (Psychological & Psychiatric)",
  "Pediatrics",
  "Geriatrics",
  "Veterinary Medicine",
  "Head & Vertigo",
  "Stomach & Abdomen",
  "Respiratory Care",
  "Skin & Eruptions",
  "Extremities & Joints",
  "Generalities & Modalities"
];

export const REPERTORY_DATA: Rubric[] = [
  // Mind (Psychological & Psychiatric)
  {
    id: "mind_anxiety_health",
    chapter: "Mind (Psychological & Psychiatric)",
    name: "Anxiety, health about, extreme worry",
    remedies: { "Ars": 3, "Phos": 3, "Calc": 3, "Lyc": 2, "Puls": 2, "Acon": 2, "Nux-v": 1 }
  },
  {
    id: "mind_grief_silent",
    chapter: "Mind (Psychological & Psychiatric)",
    name: "Grief, silent, long-lasting sorrow",
    remedies: { "Ign": 3, "Nat-m": 3, "Ph-ac": 3, "Puls": 2, "Sep": 2, "Aur-m": 3 }
  },
  {
    id: "mind_anger_ailments",
    chapter: "Mind (Psychological & Psychiatric)",
    name: "Anger, ailments from, suppressed irritability",
    remedies: { "Cham": 3, "Nux-v": 3, "Staph": 3, "Coloc": 3, "Bry": 2, "Lyc": 2, "Ign": 2 }
  },
  {
    id: "mind_depression_sadness",
    chapter: "Mind (Psychological & Psychiatric)",
    name: "Depression, deep sadness, weeping disposition",
    remedies: { "Aur-m": 3, "Ign": 3, "Nat-m": 3, "Puls": 3, "Sep": 3, "Calc": 2, "Ph-ac": 2 }
  },
  {
    id: "mind_claustrophobia",
    chapter: "Mind (Psychological & Psychiatric)",
    name: "Fear, narrow spaces (claustrophobia)",
    remedies: { "Arg-n": 3, "Puls": 2, "Lyc": 2, "Calc": 2, "Acon": 3 }
  },
  {
    id: "mind_anxiety_anticipatory",
    chapter: "Mind (Psychological & Psychiatric)",
    name: "Anxiety, anticipatory (before public events/exams)",
    remedies: { "Gels": 3, "Arg-n": 3, "Lyc": 3, "Sil": 2, "Ars": 2 }
  },

  // Pediatrics
  {
    id: "peds_dentition_irritability",
    chapter: "Pediatrics",
    name: "Dentition, difficult, with extreme irritability & screaming",
    remedies: { "Cham": 3, "Calc-p": 3, "Bell": 2, "Calc": 2, "Puls": 1 }
  },
  {
    id: "peds_night_terrors",
    chapter: "Pediatrics",
    name: "Night terrors in children, waking screaming and frightened",
    remedies: { "Bell": 3, "Stram": 3, "Calc": 2, "Cham": 2, "Puls": 2 }
  },
  {
    id: "peds_growth_pain",
    chapter: "Pediatrics",
    name: "Growth spurts, rapid, with bone and muscle aching",
    remedies: { "Calc-p": 3, "Calc": 2, "Ph-ac": 2, "Sulph": 1 }
  },
  {
    id: "peds_crying_clinging",
    chapter: "Pediatrics",
    name: "Crying constantly, wants to be held, clinging to mother",
    remedies: { "Puls": 3, "Cham": 2, "Calc": 2, "Sil": 1 }
  },

  // Geriatrics
  {
    id: "geri_memory_loss",
    chapter: "Geriatrics",
    name: "Memory loss, senile dementia, confusion of mind",
    remedies: { "Baryta-c": 3, "Lyc": 3, "Con": 3, "Alum": 2, "Phos": 2, "Nat-m": 1 }
  },
  {
    id: "geri_joint_stiffness",
    chapter: "Geriatrics",
    name: "Joint stiffness, worse cold weather, better heat (old age)",
    remedies: { "Rhus-t": 3, "Caust": 3, "Bry": 2, "Calc": 2, "Sulph": 2 }
  },
  {
    id: "geri_sleep_early_waking",
    chapter: "Geriatrics",
    name: "Sleep fragmentation, waking very early, unable to sleep again",
    remedies: { "Nux-v": 3, "Coff": 3, "Ars": 2, "Sulph": 2, "Bell": 1 }
  },
  {
    id: "geri_weakness_debility",
    chapter: "Geriatrics",
    name: "General physical debility, weakness in limbs, easily fatigued",
    remedies: { "Con": 3, "Gels": 3, "Baryta-c": 2, "Ars": 2, "Phos": 2 }
  },

  // Veterinary Medicine
  {
    id: "vet_separation_anxiety",
    chapter: "Veterinary Medicine",
    name: "Separation anxiety in pets, whining, destroying things",
    remedies: { "Puls": 3, "Ars": 3, "Ign": 2, "Ph-ac": 2, "Gels": 1 }
  },
  {
    id: "vet_eruptions_scaly",
    chapter: "Veterinary Medicine",
    name: "Eruptions, dry, scaly, scratching raw in animals",
    remedies: { "Sulph": 3, "Graph": 3, "Ars": 2, "Mez": 2, "Rhus-t": 2 }
  },
  {
    id: "vet_thunder_fear",
    chapter: "Veterinary Medicine",
    name: "Fear of thunder, firecrackers, loud noises",
    remedies: { "Phos": 3, "Acon": 3, "Borax": 3, "Gels": 2, "Bell": 2 }
  },
  {
    id: "vet_lethargy_stiffness",
    chapter: "Veterinary Medicine",
    name: "Lethargy in animals, stiffness when rising, improves with motion",
    remedies: { "Rhus-t": 3, "Bry": 1, "Arn": 3, "Calc": 2 }
  },

  // Head & Vertigo
  {
    id: "head_migraine_throbbing",
    chapter: "Head & Vertigo",
    name: "Migraine, throbbing pain, worse noise, light, heat",
    remedies: { "Bell": 3, "Gels": 2, "Nat-m": 3, "Sulph": 2, "Lach": 2, "Phos": 1 }
  },
  {
    id: "head_vertigo_motion",
    chapter: "Head & Vertigo",
    name: "Vertigo, on motion, turning in bed, looking up",
    remedies: { "Con": 3, "Bry": 3, "Gels": 2, "Puls": 2, "Cocculus": 3 }
  },
  {
    id: "head_tension_neck",
    chapter: "Head & Vertigo",
    name: "Tension headache, radiating from neck/occiput forward",
    remedies: { "Gels": 3, "Sil": 3, "Bry": 2, "Nux-v": 2, "Cimic": 3 }
  },

  // Stomach & Abdomen
  {
    id: "stomach_gerd_acid",
    chapter: "Stomach & Abdomen",
    name: "GERD, acid reflux, sour eructations, burning pain",
    remedies: { "Nux-v": 3, "Lyc": 3, "Ars": 2, "Sulph": 2, "Puls": 2, "Robinia": 3 }
  },
  {
    id: "stomach_nausea_vomiting",
    chapter: "Stomach & Abdomen",
    name: "Nausea and vomiting, constant, not relieved by vomiting",
    remedies: { "Ipec": 3, "Tab": 3, "Nux-v": 2, "Ars": 2, "Colch": 3 }
  },
  {
    id: "stomach_thirst_large_quantities",
    chapter: "Stomach & Abdomen",
    name: "Thirst, for large quantities at long intervals",
    remedies: { "Bry": 3, "Acon": 2, "Nat-m": 3, "Sulph": 2, "Phos": 2 }
  },
  {
    id: "stomach_thirst_small_sips",
    chapter: "Stomach & Abdomen",
    name: "Thirst, for small quantities frequently, burning",
    remedies: { "Ars": 3, "Bell": 2, "Acon": 2, "Chna": 2 }
  },
  {
    id: "stomach_bloating_flatulence",
    chapter: "Stomach & Abdomen",
    name: "Bloating, flatulence, gas immediately after eating",
    remedies: { "Lyc": 3, "Carbo-v": 3, "Chna": 3, "Nux-v": 2, "Sulph": 2 }
  },

  // Respiratory Care
  {
    id: "resp_asthma_night",
    chapter: "Respiratory Care",
    name: "Asthma, attacks at night, especially after midnight (1-3 AM)",
    remedies: { "Ars": 3, "Samb": 2, "Kali-c": 3, "Nat-s": 3, "Lyc": 1, "Puls": 1 }
  },
  {
    id: "resp_cough_spasmodic",
    chapter: "Respiratory Care",
    name: "Cough, dry, spasmodic, worse warm room, better cold air",
    remedies: { "Puls": 3, "Bry": 2, "Dros": 3, "Acon": 2, "Spong": 2 }
  },
  {
    id: "resp_sinus_thick_discharge",
    chapter: "Respiratory Care",
    name: "Sinus congestion, thick, stringy, yellow-green discharge",
    remedies: { "Kali-bi": 3, "Puls": 3, "Hydrastis": 3, "Hep": 2, "Sil": 2 }
  },
  {
    id: "resp_hoarseness_loss_voice",
    chapter: "Respiratory Care",
    name: "Hoarseness, loss of voice, worse morning, painful throat",
    remedies: { "Caust": 3, "Phos": 3, "Bell": 2, "Carbo-v": 2 }
  },

  // Skin & Eruptions
  {
    id: "skin_eczema_itching",
    chapter: "Skin & Eruptions",
    name: "Eczema, intense itching, scratching until bleeding",
    remedies: { "Sulph": 3, "Rhus-t": 3, "Ars": 2, "Mez": 2, "Graph": 3 }
  },
  {
    id: "skin_eruptions_sticky",
    chapter: "Skin & Eruptions",
    name: "Eruptions, honey-like, sticky fluid oozing",
    remedies: { "Graph": 3, "Mez": 2, "Calc": 1, "Sulph": 1 }
  },
  {
    id: "skin_vitiligo_patches",
    chapter: "Skin & Eruptions",
    name: "Vitiligo, depigmented patches, localized or spreading",
    remedies: { "Ars-i": 3, "Sulph": 2, "Calc": 2, "Sep": 2, "Nat-m": 2 }
  },
  {
    id: "skin_urticaria_hives",
    chapter: "Skin & Eruptions",
    name: "Urticaria, hives, burning, stinging, better cold bathing",
    remedies: { "Apis": 3, "Urt-u": 3, "Rhus-t": 2, "Sulph": 2, "Ars": 1 }
  },

  // Extremities & Joints
  {
    id: "joints_rheumatic_pain_motion",
    chapter: "Extremities & Joints",
    name: "Joint pain, tearing, stitching, worse from any motion",
    remedies: { "Bry": 3, "Led": 2, "Colch": 2, "Caust": 2, "Nux-v": 1 }
  },
  {
    id: "joints_rheumatic_pain_rest",
    chapter: "Extremities & Joints",
    name: "Joint pain, tearing, worse rest, better continuous motion",
    remedies: { "Rhus-t": 3, "Ruta": 3, "Caust": 2, "Calc": 2, "Rhod": 3 }
  },
  {
    id: "joints_gouty_inflammation",
    chapter: "Extremities & Joints",
    name: "Gouty inflammation of big toe, swelling, hot and red",
    remedies: { "Led": 3, "Colch": 3, "Bry": 2, "Arn": 2, "Urt-u": 2 }
  },

  // Generalities & Modalities
  {
    id: "gen_chilly_patient",
    chapter: "Generalities & Modalities",
    name: "Generalities, chilly patient, extremely sensitive to cold",
    remedies: { "Ars": 3, "Sil": 3, "Hep": 3, "Nux-v": 3, "Calc": 3, "Puls": -1 } // -1 means contraindicated or extremely warm
  },
  {
    id: "gen_warm_patient",
    chapter: "Generalities & Modalities",
    name: "Generalities, warm patient, desires open air and cold",
    remedies: { "Puls": 3, "Sulph": 3, "Apis": 3, "Iod": 3, "Arg-n": 3, "Ars": -1 }
  },
  {
    id: "gen_right_sided",
    chapter: "Generalities & Modalities",
    name: "Generalities, complaints affecting primarily the right side",
    remedies: { "Lyc": 3, "Bell": 3, "Bry": 2, "Apis": 3, "Chel": 3 }
  },
  {
    id: "gen_left_sided",
    chapter: "Generalities & Modalities",
    name: "Generalities, complaints affecting primarily the left side",
    remedies: { "Lach": 3, "Phos": 2, "Thuja": 3, "Sep": 2, "Puls": 1 }
  }
];
