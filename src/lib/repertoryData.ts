export interface Rubric {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>; // Maps remedy abbreviation (e.g., "Nux-v") to grade (1, 2, or 3)
}

export const REMEDIES_METADATA: Record<string, { fullName: string; source: string }> = {
  "Acon": { fullName: "Aconitum Napellus", source: "Plant" },
  "Aloe": { fullName: "Aloe Socotrina", source: "Plant" },
  "All-c": { fullName: "Allium Cepa", source: "Plant" },
  "Alum": { fullName: "Alumina", source: "Mineral" },
  "Apis": { fullName: "Apis Mellifica", source: "Animal (Bee)" },
  "Arg-n": { fullName: "Argentum Nitricum", source: "Mineral" },
  "Arn": { fullName: "Arnica Montana", source: "Plant" },
  "Ars": { fullName: "Arsenicum Album", source: "Mineral" },
  "Ars-i": { fullName: "Arsenicum Iodatum", source: "Mineral" },
  "Aur-m": { fullName: "Aurum Metallicum", source: "Mineral" },
  "Baryta-c": { fullName: "Baryta Carbonica", source: "Mineral" },
  "Bell": { fullName: "Belladonna", source: "Plant" },
  "Borax": { fullName: "Borax Veneta", source: "Mineral" },
  "Bry": { fullName: "Bryonia Alba", source: "Plant" },
  "Calc": { fullName: "Calcarea Carbonica", source: "Mineral" },
  "Calc-p": { fullName: "Calcarea Phosphorica", source: "Mineral" },
  "Canth": { fullName: "Cantharis Vesicatoria", source: "Animal (Spanish Fly)" },
  "Carbo-v": { fullName: "Carbo Vegetabilis", source: "Vegetable Charcoal" },
  "Caust": { fullName: "Causticum", source: "Mineral" },
  "Cham": { fullName: "Chamomilla", source: "Plant" },
  "Chel": { fullName: "Chelidonium Majus", source: "Plant" },
  "Chna": { fullName: "China Officinalis", source: "Plant" },
  "Cimic": { fullName: "Cimicifuga Racemosa", source: "Plant" },
  "Cocculus": { fullName: "Cocculus Indicus", source: "Plant" },
  "Coff": { fullName: "Coffea Cruda", source: "Plant" },
  "Colch": { fullName: "Colchicum Autumnale", source: "Plant" },
  "Coloc": { fullName: "Colocynthis", source: "Plant" },
  "Con": { fullName: "Conium Maculatum", source: "Plant" },
  "Dros": { fullName: "Drosera Rotundifolia", source: "Plant" },
  "Euphr": { fullName: "Euphrasia Officinalis", source: "Plant" },
  "Gels": { fullName: "Gelsemium Sempervirens", source: "Plant" },
  "Glon": { fullName: "Glonoine", source: "Chemical (Nitro-glycerine)" },
  "Graph": { fullName: "Graphites", source: "Mineral" },
  "Ham": { fullName: "Hamamelis Virginiana", source: "Plant" },
  "Hep": { fullName: "Hepar Sulphuris Calcareum", source: "Mineral" },
  "Hydrastis": { fullName: "Hydrastis Canadensis", source: "Plant" },
  "Hyos": { fullName: "Hyoscyamus Niger", source: "Plant" },
  "Ign": { fullName: "Ignatia Amara", source: "Plant" },
  "Iod": { fullName: "Iodum", source: "Mineral" },
  "Ipec": { fullName: "Ipecacuanha", source: "Plant" },
  "Kali-bi": { fullName: "Kali Bichromicum", source: "Mineral" },
  "Kali-c": { fullName: "Kali Carbonicum", source: "Mineral" },
  "Lach": { fullName: "Lachesis Muta", source: "Animal (Snake)" },
  "Led": { fullName: "Ledum Palustre", source: "Plant" },
  "Lyc": { fullName: "Lycopodium Clavatum", source: "Plant" },
  "Mag-p": { fullName: "Magnesia Phosphorica", source: "Mineral" },
  "Merc": { fullName: "Mercurius Solubilis", source: "Mineral" },
  "Merc-c": { fullName: "Mercurius Corrosivus", source: "Mineral" },
  "Merc-i-f": { fullName: "Mercurius Iodatus Flavus", source: "Mineral" },
  "Merc-i-r": { fullName: "Mercurius Iodatus Ruber", source: "Mineral" },
  "Mez": { fullName: "Mezereum", source: "Plant" },
  "Nat-m": { fullName: "Natrum Muriaticum", source: "Mineral" },
  "Nat-s": { fullName: "Natrum Sulphuricum", source: "Mineral" },
  "Nit-ac": { fullName: "Nitricum Acidum", source: "Mineral" },
  "Nux-v": { fullName: "Nux Vomica", source: "Plant" },
  "Petr": { fullName: "Petroleum", source: "Mineral" },
  "Phos": { fullName: "Phosphorus", source: "Mineral" },
  "Ph-ac": { fullName: "Phosphoricum Acidum", source: "Mineral" },
  "Phyt": { fullName: "Phytolacca Decandra", source: "Plant" },
  "Podoph": { fullName: "Podophyllum Peltatum", source: "Plant" },
  "Puls": { fullName: "Pulsatilla Pratensis", source: "Plant" },
  "Ran-b": { fullName: "Ranunculus Bulbosus", source: "Plant" },
  "Rhod": { fullName: "Rhododendron Chrysanthum", source: "Plant" },
  "Rhus-t": { fullName: "Rhus Toxicodendron", source: "Plant" },
  "Robinia": { fullName: "Robinia Pseudoacacia", source: "Plant" },
  "Rumex": { fullName: "Rumex Crispus", source: "Plant" },
  "Ruta": { fullName: "Ruta Graveolens", source: "Plant" },
  "Sabina": { fullName: "Sabina Officinalis", source: "Plant" },
  "Samb": { fullName: "Sambucus Nigra", source: "Plant" },
  "Sars": { fullName: "Sarsaparilla Officinalis", source: "Plant" },
  "Sep": { fullName: "Sepia Officinalis", source: "Animal (Cuttlefish)" },
  "Sil": { fullName: "Silicea", source: "Mineral" },
  "Spig": { fullName: "Spigelia Anthelmia", source: "Plant" },
  "Spong": { fullName: "Spongia Tosta", source: "Animal (Toasted Sponge)" },
  "Staph": { fullName: "Staphysagria", source: "Plant" },
  "Stram": { fullName: "Stramonium", source: "Plant" },
  "Sulph": { fullName: "Sulphur", source: "Mineral" },
  "Tab": { fullName: "Tabacum", source: "Plant" },
  "Thuja": { fullName: "Thuja Occidentalis", source: "Plant" },
  "Urt-u": { fullName: "Urtica Urens", source: "Plant" }
};

export const REPERTORY_CHAPTERS = [
  "Mind (Mental & Emotional)",
  "Vertigo & Head",
  "Eyes & Vision",
  "Ears & Hearing",
  "Nose & Coryza",
  "Face & Mouth",
  "Throat & Neck",
  "Stomach & Gastric",
  "Abdomen & Liver",
  "Rectum, Stool & Bowels",
  "Urinary Organs",
  "Male & Female Genitalia",
  "Larynx, Cough & Trachea",
  "Respiration & Chest",
  "Back & Spine",
  "Extremities & Joints",
  "Sleep & Dreams",
  "Fever, Chill & Sweat",
  "Skin & Eruptions",
  "Generalities & Modalities",
  "Clinical Tiers (Peds/Geri/Vet)"
];

export const REPERTORY_DATA: Rubric[] = [
  // Mind (Mental & Emotional)
  {
    id: "mind_anxiety_health",
    chapter: "Mind (Mental & Emotional)",
    name: "Anxiety, health about, extreme worry",
    remedies: { "Ars": 3, "Phos": 3, "Calc": 3, "Lyc": 2, "Puls": 2, "Acon": 2, "Nux-v": 1 }
  },
  {
    id: "mind_grief_silent",
    chapter: "Mind (Mental & Emotional)",
    name: "Grief, silent, long-lasting sorrow",
    remedies: { "Ign": 3, "Nat-m": 3, "Ph-ac": 3, "Puls": 2, "Sep": 2, "Aur-m": 3 }
  },
  {
    id: "mind_anger_ailments",
    chapter: "Mind (Mental & Emotional)",
    name: "Anger, ailments from, suppressed irritability",
    remedies: { "Cham": 3, "Nux-v": 3, "Staph": 3, "Coloc": 3, "Bry": 2, "Lyc": 2, "Ign": 2 }
  },
  {
    id: "mind_depression_sadness",
    chapter: "Mind (Mental & Emotional)",
    name: "Depression, deep sadness, weeping disposition",
    remedies: { "Aur-m": 3, "Ign": 3, "Nat-m": 3, "Puls": 3, "Sep": 3, "Calc": 2, "Ph-ac": 2 }
  },
  {
    id: "mind_claustrophobia",
    chapter: "Mind (Mental & Emotional)",
    name: "Fear, narrow spaces (claustrophobia)",
    remedies: { "Arg-n": 3, "Puls": 2, "Lyc": 2, "Calc": 2, "Acon": 3 }
  },
  {
    id: "mind_anxiety_anticipatory",
    chapter: "Mind (Mental & Emotional)",
    name: "Anxiety, anticipatory (before public events/exams)",
    remedies: { "Gels": 3, "Arg-n": 3, "Lyc": 3, "Sil": 2, "Ars": 2 }
  },
  {
    id: "mind_irritability_morning",
    chapter: "Mind (Mental & Emotional)",
    name: "Irritability, morning on waking, fault-finding",
    remedies: { "Nux-v": 3, "Sulph": 3, "Lyc": 3, "Cham": 2, "Nat-m": 2 }
  },
  {
    id: "mind_restlessness_tossing",
    chapter: "Mind (Mental & Emotional)",
    name: "Restlessness, tossing about, mental and physical, driving out of bed",
    remedies: { "Ars": 3, "Rhus-t": 3, "Acon": 3, "Cham": 2 }
  },
  {
    id: "mind_consolation_agg",
    chapter: "Mind (Mental & Emotional)",
    name: "Consolation aggravates mental symptoms",
    remedies: { "Nat-m": 3, "Ign": 3, "Sep": 3, "Sil": 2 }
  },
  {
    id: "mind_consolation_amel",
    chapter: "Mind (Mental & Emotional)",
    name: "Consolation ameliorates symptoms (desires sympathy)",
    remedies: { "Puls": 3, "Sil": 2 }
  },

  // Vertigo & Head
  {
    id: "head_migraine_throbbing",
    chapter: "Vertigo & Head",
    name: "Migraine, throbbing pain, worse noise, light, heat",
    remedies: { "Bell": 3, "Gels": 2, "Nat-m": 3, "Sulph": 2, "Lach": 2, "Phos": 1 }
  },
  {
    id: "head_vertigo_motion",
    chapter: "Vertigo & Head",
    name: "Vertigo, on motion, turning in bed, looking up",
    remedies: { "Con": 3, "Bry": 3, "Gels": 2, "Puls": 2, "Cocculus": 3 }
  },
  {
    id: "head_tension_neck",
    chapter: "Vertigo & Head",
    name: "Tension headache, radiating from neck/occiput forward",
    remedies: { "Gels": 3, "Sil": 3, "Bry": 2, "Nux-v": 2, "Cimic": 3 }
  },
  {
    id: "head_congestive_sun",
    chapter: "Vertigo & Head",
    name: "Headache, congestive, bursting sensation, worse sun heat",
    remedies: { "Glon": 3, "Bell": 3, "Nat-m": 3, "Lach": 2, "Gels": 2 }
  },
  {
    id: "head_stitching_motion",
    chapter: "Vertigo & Head",
    name: "Headache, sharp stitching pain, worse least motion",
    remedies: { "Bry": 3, "Spig": 3, "Kali-c": 2 }
  },
  {
    id: "head_vertigo_nausea",
    chapter: "Vertigo & Head",
    name: "Vertigo, with nausea, riding in a carriage or boat",
    remedies: { "Cocculus": 3, "Petr": 3, "Tab": 3 }
  },

  // Eyes & Vision
  {
    id: "eyes_photophobia",
    chapter: "Eyes & Vision",
    name: "Photophobia, extreme sensitivity to light",
    remedies: { "Bell": 3, "Sulph": 3, "Hep": 3, "Con": 3, "Sil": 2 }
  },
  {
    id: "eyes_vision_dimness",
    chapter: "Eyes & Vision",
    name: "Vision, dimness, as if looking through a gauze",
    remedies: { "Gels": 3, "Puls": 2, "Caust": 2, "Lyc": 2, "Sulph": 2 }
  },
  {
    id: "eyes_neuralgia_spigelia",
    chapter: "Eyes & Vision",
    name: "Eyes, neuralgic pain, shooting back into head, left-sided",
    remedies: { "Spig": 3 }
  },
  {
    id: "eyes_lachrymation_acrid",
    chapter: "Eyes & Vision",
    name: "Eyes, lachrymation, acrid, burning, excoriating tears",
    remedies: { "Euphr": 3, "Ars": 3, "Merc": 2 }
  },

  // Ears & Hearing
  {
    id: "ears_otitis_throbbing",
    chapter: "Ears & Hearing",
    name: "Otitis media, throbbing pain, red ear, high fever",
    remedies: { "Bell": 3, "Cham": 3, "Hep": 3, "Puls": 3, "Merc": 2 }
  },
  {
    id: "ears_hearing_buzzing",
    chapter: "Ears & Hearing",
    name: "Hearing, impaired, with roaring, ringing, or buzzing noises",
    remedies: { "Chna": 3, "Carbo-v": 2, "Lyc": 2, "Sil": 2 }
  },
  {
    id: "ears_stitching_throat",
    chapter: "Ears & Hearing",
    name: "Ears, stitching pain, extending to throat when swallowing",
    remedies: { "Hep": 3, "Nux-v": 2, "Phyt": 2 }
  },

  // Nose & Coryza
  {
    id: "nose_coryza_watery",
    chapter: "Nose & Coryza",
    name: "Coryza, watery acrid discharge, sneezing, worse warm room",
    remedies: { "All-c": 3, "Ars": 3, "Puls": -1 }
  },
  {
    id: "nose_sinusitis_thick",
    chapter: "Nose & Coryza",
    name: "Sinusitis, pressure at root of nose, thick stringy yellow-green mucus",
    remedies: { "Kali-bi": 3, "Hydrastis": 3, "Puls": 3, "Hep": 2 }
  },
  {
    id: "nose_epistaxis_morning",
    chapter: "Nose & Coryza",
    name: "Epistaxis, nosebleed, bright red blood, morning on washing face",
    remedies: { "Phos": 3, "Arn": 2 }
  },

  // Face & Mouth
  {
    id: "face_neuralgia_left",
    chapter: "Face & Mouth",
    name: "Neuralgia, facial, left-sided, tearing pain",
    remedies: { "Spig": 3, "Coloc": 3, "Lach": 2 }
  },
  {
    id: "face_neuralgia_right",
    chapter: "Face & Mouth",
    name: "Neuralgia, facial, right-sided, tearing pain",
    remedies: { "Bell": 3, "Lyc": 2, "Mag-p": 3 }
  },
  {
    id: "mouth_ulcers_aphthae",
    chapter: "Face & Mouth",
    name: "Mouth, ulcers, aphthae, burning, salivation, offensive breath",
    remedies: { "Merc": 3, "Borax": 3, "Nit-ac": 3, "Ars": 2 }
  },
  {
    id: "mouth_toothache_cold",
    chapter: "Face & Mouth",
    name: "Toothache, tearing pain, relieved temporarily by holding cold water in mouth",
    remedies: { "Coff": 3, "Puls": 3, "Cham": 2 }
  },

  // Throat & Neck
  {
    id: "throat_tonsillitis_right",
    chapter: "Throat & Neck",
    name: "Tonsillitis, right-sided, swallowing difficult, liquids choke",
    remedies: { "Lyc": 3, "Bell": 3, "Merc-i-f": 3 }
  },
  {
    id: "throat_tonsillitis_left",
    chapter: "Throat & Neck",
    name: "Tonsillitis, left-sided, sensitive to least touch on neck",
    remedies: { "Lach": 3, "Phyt": 3, "Merc-i-r": 3 }
  },
  {
    id: "throat_sensation_plug",
    chapter: "Throat & Neck",
    name: "Throat, sensation of a plug or lump, worse swallowing empty",
    remedies: { "Lach": 3, "Ign": 3, "Hep": 2 }
  },

  // Stomach & Gastric
  {
    id: "stomach_gerd_acid",
    chapter: "Stomach & Gastric",
    name: "GERD, acid reflux, sour eructations, burning pain",
    remedies: { "Nux-v": 3, "Lyc": 3, "Ars": 2, "Sulph": 2, "Puls": 2, "Robinia": 3 }
  },
  {
    id: "stomach_nausea_vomiting",
    chapter: "Stomach & Gastric",
    name: "Nausea and vomiting, constant, not relieved by vomiting",
    remedies: { "Ipec": 3, "Tab": 3, "Nux-v": 2, "Ars": 2, "Colch": 3 }
  },
  {
    id: "stomach_thirst_large_quantities",
    chapter: "Stomach & Gastric",
    name: "Thirst, for large quantities at long intervals",
    remedies: { "Bry": 3, "Acon": 2, "Nat-m": 3, "Sulph": 2, "Phos": 2 }
  },
  {
    id: "stomach_thirst_small_sips",
    chapter: "Stomach & Gastric",
    name: "Thirst, for small quantities frequently, burning",
    remedies: { "Ars": 3, "Bell": 2, "Acon": 2, "Chna": 2 }
  },
  {
    id: "stomach_bloating_flatulence",
    chapter: "Stomach & Gastric",
    name: "Bloating, flatulence, gas immediately after eating",
    remedies: { "Lyc": 3, "Carbo-v": 3, "Chna": 3, "Nux-v": 2, "Sulph": 2 }
  },
  {
    id: "stomach_appetite_ravenous",
    chapter: "Stomach & Gastric",
    name: "Appetite, ravenous, empty sinking feeling in stomach (11 AM)",
    remedies: { "Sulph": 3, "Iod": 3, "Lyc": 2, "Sep": 2, "Phos": 2 }
  },

  // Abdomen & Liver
  {
    id: "abdomen_colic_double",
    chapter: "Abdomen & Liver",
    name: "Colic, flatulent, forcing patient to bend double for relief",
    remedies: { "Coloc": 3, "Mag-p": 3, "Cham": 2, "Nux-v": 2 }
  },
  {
    id: "abdomen_liver_soreness",
    chapter: "Abdomen & Liver",
    name: "Liver, soreness and stitching pain, worse lying on right side",
    remedies: { "Chel": 3, "Bry": 3, "Lyc": 2, "Merc": 2 }
  },
  {
    id: "abdomen_distended_drum",
    chapter: "Abdomen & Liver",
    name: "Abdomen, distended like a drum, painful, trapped flatus",
    remedies: { "Carbo-v": 3, "Lyc": 3, "Chna": 3, "Coloc": 2 }
  },

  // Rectum, Stool & Bowels
  {
    id: "stool_constipation_dry",
    chapter: "Rectum, Stool & Bowels",
    name: "Constipation, dry, hard stools, as if burnt, crumbling",
    remedies: { "Bry": 3, "Sulph": 3, "Nat-m": 3, "Alum": 3, "Nux-v": 2 }
  },
  {
    id: "stool_diarrhea_morning",
    chapter: "Rectum, Stool & Bowels",
    name: "Diarrhea, painless, watery, offensive, driving out of bed early morning",
    remedies: { "Podoph": 3, "Sulph": 3, "Ars": 2, "Chna": 2 }
  },
  {
    id: "stool_diarrhea_tenesmus",
    chapter: "Rectum, Stool & Bowels",
    name: "Diarrhea, with painful straining (tenesmus), slimy stools",
    remedies: { "Merc": 3, "Merc-c": 3, "Aloe": 2 }
  },

  // Urinary Organs
  {
    id: "urinary_cystitis_burning",
    chapter: "Urinary Organs",
    name: "Cystitis, violent burning and cutting pain during and after urination",
    remedies: { "Canth": 3, "Apis": 3, "Sars": 2, "Nux-v": 2 }
  },
  {
    id: "urinary_involuntary_cough",
    chapter: "Urinary Organs",
    name: "Urination, frequent, involuntary when coughing, sneezing, or walking",
    remedies: { "Caust": 3, "Puls": 2, "Nat-m": 2, "Sep": 2 }
  },
  {
    id: "urinary_brick_dust",
    chapter: "Urinary Organs",
    name: "Urine, brick-dust red sediment in vessel",
    remedies: { "Lyc": 3, "Sep": 3, "Nat-m": 2, "Sars": 3 }
  },

  // Male & Female Genitalia
  {
    id: "genitalia_menses_painful",
    chapter: "Male & Female Genitalia",
    name: "Menses, painful (dysmenorrhea), with cramping, better heat and pressure",
    remedies: { "Mag-p": 3, "Cham": 2, "Puls": 2, "Cimic": 3 }
  },
  {
    id: "genitalia_menses_ Sabina",
    chapter: "Male & Female Genitalia",
    name: "Menses, dark, clotted, flow only when moving about, active flow",
    remedies: { "Puls": 3, "Sabina": 3, "Cham": 2 }
  },
  {
    id: "genitalia_leucorrhea_yellow",
    chapter: "Male & Female Genitalia",
    name: "Leucorrhea, thick, yellow-green, mild and bland (non-irritating)",
    remedies: { "Puls": 3, "Sep": 2, "Calc": 2, "Alum": 2 }
  },

  // Larynx, Cough & Trachea
  {
    id: "resp_cough_spasmodic",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, dry, spasmodic, worse warm room, better cold air",
    remedies: { "Puls": 3, "Bry": 2, "Dros": 3, "Acon": 2, "Spong": 2 }
  },
  {
    id: "resp_cough_barking",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, barking, croupy, sawing sound, worse after midnight, waking choking",
    remedies: { "Spong": 3, "Hep": 3, "Acon": 3, "Dros": 2 }
  },
  {
    id: "resp_cough_tickling",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, tickling in larynx, triggered by talking or laughing, dry tickling",
    remedies: { "Dros": 3, "Phos": 3, "Rumex": 3, "Con": 2 }
  },

  // Respiration & Chest
  {
    id: "resp_asthma_night",
    chapter: "Respiration & Chest",
    name: "Asthma, attacks at night, especially after midnight (1-3 AM)",
    remedies: { "Ars": 3, "Samb": 2, "Kali-c": 3, "Nat-s": 3, "Lyc": 1, "Puls": 1 }
  },
  {
    id: "resp_dyspnea_fresh_air",
    chapter: "Respiration & Chest",
    name: "Respiration, difficult (dyspnea), must sit up, desires fresh open air",
    remedies: { "Ars": 3, "Carbo-v": 3, "Puls": 3, "Lach": 2 }
  },
  {
    id: "resp_chest_stitching",
    chapter: "Respiration & Chest",
    name: "Chest, sharp stitching pain, worse least breathing or motion, holds chest",
    remedies: { "Bry": 3, "Kali-c": 3, "Ran-b": 3 }
  },

  // Back & Spine
  {
    id: "back_lower_lying_hard",
    chapter: "Back & Spine",
    name: "Backache, lower back, aching, relieved by lying on something hard",
    remedies: { "Nat-m": 3, "Rhus-t": 2, "Ruta": 2 }
  },
  {
    id: "back_stiffness_rising",
    chapter: "Back & Spine",
    name: "Backache, stiffness, worse rising from a seat, better walking",
    remedies: { "Rhus-t": 3, "Caust": 2, "Calc": 2 }
  },
  {
    id: "back_burning_scapulae",
    chapter: "Back & Spine",
    name: "Spine, burning heat or soreness between scapulae",
    remedies: { "Phos": 3, "Lyc": 2, "Sulph": 3 }
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
  {
    id: "joints_sciatica_right",
    chapter: "Extremities & Joints",
    name: "Sciatica, right-sided, worse lying on painful side, better heat",
    remedies: { "Coloc": 3, "Mag-p": 3, "Lyc": 2 }
  },

  // Sleep & Dreams
  {
    id: "sleep_insomnia_thoughts",
    chapter: "Sleep & Dreams",
    name: "Insomnia, sleeplessness from rush of thoughts, hyperactive mind",
    remedies: { "Coff": 3, "Nux-v": 2, "Gels": 2, "Sulph": 2 }
  },
  {
    id: "sleep_fragmentation_3am",
    chapter: "Sleep & Dreams",
    name: "Sleep, fragmentation, waking very early (3 AM), unable to sleep again",
    remedies: { "Nux-v": 3, "Ars": 2, "Sulph": 2, "Calc": 2 }
  },
  {
    id: "sleep_dreams_vivid",
    chapter: "Sleep & Dreams",
    name: "Dreams, vivid, of robbers, falling, or fire",
    remedies: { "Nat-m": 3, "Sil": 3, "Bell": 2, "Sulph": 2 }
  },

  // Fever, Chill & Sweat
  {
    id: "fever_dry_heat_bell",
    chapter: "Fever, Chill & Sweat",
    name: "Fever, dry heat, bounding pulse, red face, dilated pupils, no thirst",
    remedies: { "Bell": 3, "Acon": 3, "Gels": 2 }
  },
  {
    id: "fever_chill_spine",
    chapter: "Fever, Chill & Sweat",
    name: "Chill, running up and down the back, worse cold air",
    remedies: { "Gels": 3, "Nux-v": 2, "Ars": 2 }
  },
  {
    id: "fever_perspiration_sour",
    chapter: "Fever, Chill & Sweat",
    name: "Perspiration, offensive, staining linen yellow, sour smell",
    remedies: { "Merc": 3, "Hep": 3, "Sulph": 2, "Calc": 2 }
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
  {
    id: "skin_psoriasis_scales",
    chapter: "Skin & Eruptions",
    name: "Psoriasis, thick dry scales, cracks on hands or heels",
    remedies: { "Sulph": 3, "Petr": 3, "Graph": 3, "Ars": 2 }
  },

  // Generalities & Modalities
  {
    id: "gen_chilly_patient",
    chapter: "Generalities & Modalities",
    name: "Generalities, chilly patient, extremely sensitive to cold",
    remedies: { "Ars": 3, "Sil": 3, "Hep": 3, "Nux-v": 3, "Calc": 3, "Puls": -1 }
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
  },

  // Clinical Tiers (Peds/Geri/Vet)
  {
    id: "peds_dentition_irritability",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Dentition, difficult, with extreme irritability & screaming",
    remedies: { "Cham": 3, "Calc-p": 3, "Bell": 2, "Calc": 2, "Puls": 1 }
  },
  {
    id: "peds_night_terrors",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Night terrors in children, waking screaming and frightened",
    remedies: { "Bell": 3, "Stram": 3, "Calc": 2, "Cham": 2, "Puls": 2 }
  },
  {
    id: "peds_growth_pain",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Growth spurts, rapid, with bone and muscle aching",
    remedies: { "Calc-p": 3, "Calc": 2, "Ph-ac": 2, "Sulph": 1 }
  },
  {
    id: "peds_crying_clinging",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Crying constantly, wants to be held, clinging to mother",
    remedies: { "Puls": 3, "Cham": 2, "Calc": 2, "Sil": 1 }
  },
  {
    id: "geri_memory_loss",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Geriatrics: Memory loss, senile dementia, confusion of mind",
    remedies: { "Baryta-c": 3, "Lyc": 3, "Con": 3, "Alum": 2, "Phos": 2, "Nat-m": 1 }
  },
  {
    id: "geri_joint_stiffness",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Geriatrics: Joint stiffness, worse cold weather, better heat (old age)",
    remedies: { "Rhus-t": 3, "Caust": 3, "Bry": 2, "Calc": 2, "Sulph": 2 }
  },
  {
    id: "geri_weakness_debility",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Geriatrics: General physical debility, weakness in limbs, easily fatigued",
    remedies: { "Con": 3, "Gels": 3, "Baryta-c": 2, "Ars": 2, "Phos": 2 }
  },
  {
    id: "vet_separation_anxiety",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Separation anxiety in pets, whining, destroying things",
    remedies: { "Puls": 3, "Ars": 3, "Ign": 2, "Ph-ac": 2, "Gels": 1 }
  },
  {
    id: "vet_eruptions_scaly",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Eruptions, dry, scaly, scratching raw in animals",
    remedies: { "Sulph": 3, "Graph": 3, "Ars": 2, "Mez": 2, "Rhus-t": 2 }
  },
  {
    id: "vet_thunder_fear",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Fear of thunder, firecrackers, loud noises",
    remedies: { "Phos": 3, "Acon": 3, "Borax": 3, "Gels": 2, "Bell": 2 }
  },
  {
    id: "vet_lethargy_stiffness",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Lethargy in animals, stiffness when rising, improves with motion",
    remedies: { "Rhus-t": 3, "Bry": 1, "Arn": 3, "Calc": 2 }
  }
];
