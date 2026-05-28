export interface Rubric {
  id: string;
  chapter: string;
  name: string;
  remedies: Record<string, number>; // Maps remedy abbreviation (e.g., "Nux-v") to grade (1, 2, or 3)
}

export const REMEDIES_METADATA: Record<string, { fullName: string; source: string }> = {
  "Abrot": { fullName: "Abrotanum", source: "Plant" },
  "Acac": { fullName: "Acac", source: "Plant" },
  "Acon": { fullName: "Aconitum Napellus", source: "Plant" },
  "Aesc": { fullName: "Aesculus Hippocastanum", source: "Plant" },
  "Aeth": { fullName: "Aethusa Cynapium", source: "Plant" },
  "Agar": { fullName: "Agaricus Muscarius", source: "Plant" },
  "Ail": { fullName: "Ailanthus Glandulosa", source: "Plant" },
  "All-c": { fullName: "Allium Cepa", source: "Plant" },
  "Aloe": { fullName: "Aloe Socotrina", source: "Plant" },
  "Alum": { fullName: "Alumina", source: "Mineral" },
  "Am-c": { fullName: "Ammonium Carbonicum", source: "Mineral" },
  "Am-m": { fullName: "Ammonium Muriaticum", source: "Mineral" },
  "Ambr": { fullName: "Ammonium Bromatum", source: "Plant" },
  "Aml-n": { fullName: "Amylenum Nitrosum", source: "Plant" },
  "Anac": { fullName: "Anacardium Orientale", source: "Plant" },
  "Ant-c": { fullName: "Antimonium Crudum", source: "Plant" },
  "Ant-t": { fullName: "Antimonium Tartaricum", source: "Plant" },
  "Apis": { fullName: "Apis Mellifica", source: "Animal (Bee)" },
  "Aran": { fullName: "Aranea Diadema", source: "Animal" },
  "Arg-m": { fullName: "Argentum Muriaticum", source: "Mineral" },
  "Arg-n": { fullName: "Argentum Nitricum", source: "Mineral" },
  "Arn": { fullName: "Arnica Montana", source: "Plant" },
  "Ars": { fullName: "Arsenicum Album", source: "Mineral" },
  "Ars-i": { fullName: "Arsenicum Iodatum", source: "Mineral" },
  "Arund": { fullName: "Arundo Mauritanica", source: "Plant" },
  "Asaf": { fullName: "Asa Foetida", source: "Plant" },
  "Asar": { fullName: "Asarum Officinale", source: "Plant" },
  "Astra-mo": { fullName: "Astragalus Mollissimus", source: "Plant" },
  "Aur-m": { fullName: "Aurum Metallicum", source: "Mineral" },
  "Bapt": { fullName: "Baptisia Tinctoria", source: "Plant" },
  "Baryta-c": { fullName: "Baryta Carbonica", source: "Mineral" },
  "Baryta-m": { fullName: "Baryta-m", source: "Mineral" },
  "Bell": { fullName: "Belladonna", source: "Plant" },
  "Bell-p": { fullName: "Bellis Perennis", source: "Plant" },
  "Benz-ac": { fullName: "Benzoicum Acidum", source: "Mineral" },
  "Berb": { fullName: "Berberis Vulgaris", source: "Plant" },
  "Bism": { fullName: "Bismutum Subnitricum (+ -o.)", source: "Mineral" },
  "Borax": { fullName: "Borax Veneta", source: "Mineral" },
  "Bov": { fullName: "Bovista Lycoperdon", source: "Plant" },
  "Brom": { fullName: "Bromum", source: "Plant" },
  "Bry": { fullName: "Bryonia Alba", source: "Plant" },
  "Bufo": { fullName: "Bufo Rana", source: "Animal" },
  "Cact": { fullName: "Cactus Grandiflorus", source: "Plant" },
  "Cadm-br": { fullName: "Cadmium Bromatum", source: "Plant" },
  "Cadm-s": { fullName: "Cadmium Sulphuratum", source: "Mineral" },
  "Calc": { fullName: "Calcarea Carbonica", source: "Mineral" },
  "Calc-f": { fullName: "Calcarea Fluorica", source: "Mineral" },
  "Calc-p": { fullName: "Calcarea Phosphorica", source: "Mineral" },
  "Calc-s": { fullName: "Calcarea Sulphurica", source: "Mineral" },
  "Calen": { fullName: "Calendula Officinalis", source: "Plant" },
  "Camph": { fullName: "Camphora Officinalis", source: "Plant" },
  "Canch": { fullName: "Canchalagua", source: "Plant" },
  "Canth": { fullName: "Cantharis Vesicatoria", source: "Animal (Spanish Fly)" },
  "Caps": { fullName: "Capsicum Annuum", source: "Plant" },
  "Car": { fullName: "Carissa Schimperi", source: "Plant" },
  "Carb-ac": { fullName: "Carbolicum Acidum", source: "Mineral" },
  "Carbo-an": { fullName: "Carissa Schimperi", source: "Plant" },
  "Carbo-v": { fullName: "Carbo Vegetabilis", source: "Vegetable Charcoal" },
  "Card-m": { fullName: "Carduus Marianus", source: "Plant" },
  "Caul": { fullName: "Caulophyllum Thalictroides", source: "Plant" },
  "Caust": { fullName: "Causticum", source: "Mineral" },
  "Cedr": { fullName: "Cedron", source: "Plant" },
  "Cent": { fullName: "Centaurea Tagana", source: "Plant" },
  "Cham": { fullName: "Chamomilla", source: "Plant" },
  "Chel": { fullName: "Chelidonium Majus", source: "Plant" },
  "Chin-s": { fullName: "Chininum Sulphuricum", source: "Mineral" },
  "Chion": { fullName: "Chionanthus Virginica", source: "Plant" },
  "Chna": { fullName: "China Officinalis", source: "Plant" },
  "Cic": { fullName: "Cicuta Virosa", source: "Plant" },
  "Cimic": { fullName: "Cimicifuga Racemosa", source: "Plant" },
  "Cina": { fullName: "Cina Maritima", source: "Plant" },
  "Cinnb": { fullName: "Cinnabaris", source: "Plant" },
  "Cist": { fullName: "Cistus Canadensis", source: "Plant" },
  "Clem": { fullName: "Clematis Erecta", source: "Plant" },
  "Coca": { fullName: "Coca", source: "Plant" },
  "Cocculus": { fullName: "Cocculus Indicus", source: "Plant" },
  "Coff": { fullName: "Coffea Cruda", source: "Plant" },
  "Colch": { fullName: "Colchicum Autumnale", source: "Plant" },
  "Coll": { fullName: "Collinsonia Canadensis", source: "Plant" },
  "Coloc": { fullName: "Colocynthis", source: "Plant" },
  "Con": { fullName: "Conium Maculatum", source: "Plant" },
  "Croc": { fullName: "Crocus Sativus", source: "Plant" },
  "Crot-c": { fullName: "Crotalus Cascavella", source: "Plant" },
  "Crot-h": { fullName: "Crotalus Horridus", source: "Plant" },
  "Croto-t": { fullName: "Croton Tiglium", source: "Plant" },
  "Cupr": { fullName: "Cuprum Metallicum", source: "Mineral" },
  "Cycl": { fullName: "Cyclamen Europaeum", source: "Plant" },
  "Dig": { fullName: "Digitalis Purpurea", source: "Plant" },
  "Dios": { fullName: "Dioscorea Villosa", source: "Plant" },
  "Dros": { fullName: "Drosera Rotundifolia", source: "Plant" },
  "Dulc": { fullName: "Dulcamara", source: "Plant" },
  "Dys": { fullName: "Bacillus Dysenteriae (Bach)", source: "Plant" },
  "Echin": { fullName: "Echinacea Angustifolia", source: "Plant" },
  "Elaps": { fullName: "Elaps Corallinus", source: "Animal" },
  "Equis": { fullName: "Equisetum Hyemale", source: "Plant" },
  "Eup-per": { fullName: "Eupatorium Perfoliatum", source: "Plant" },
  "Eup-pur": { fullName: "Eupatorium Purpureum", source: "Plant" },
  "Euph": { fullName: "Euphorbium Officinarum", source: "Plant" },
  "Euphr": { fullName: "Euphrasia Officinalis", source: "Plant" },
  "Ferr": { fullName: "Ferrum Metallicum", source: "Mineral" },
  "Ferr-i": { fullName: "Ferrum Iodatum", source: "Mineral" },
  "Ferr-p": { fullName: "Ferrum Phosphoricum", source: "Mineral" },
  "Flu-ac": { fullName: "Flu-ac", source: "Plant" },
  "Form": { fullName: "Formica Rufa", source: "Plant" },
  "Gels": { fullName: "Gelsemium Sempervirens", source: "Plant" },
  "Glon": { fullName: "Glonoine", source: "Chemical (Nitro-glycerine)" },
  "Gnaph": { fullName: "Gnaphalium Polycephalum", source: "Mineral" },
  "Graph": { fullName: "Graphites", source: "Mineral" },
  "Grat": { fullName: "Gratiola Officinalis", source: "Plant" },
  "Grin": { fullName: "Grindelia Robusta", source: "Plant" },
  "Guai": { fullName: "Guajacum Officinale", source: "Plant" },
  "Ham": { fullName: "Hamamelis Virginiana", source: "Plant" },
  "Hell": { fullName: "Helleborus Niger", source: "Plant" },
  "Heln-ov": { fullName: "Helinus Ovata", source: "Plant" },
  "Helo": { fullName: "Heloderma (+ -h., + -s.)", source: "Plant" },
  "Hep": { fullName: "Hepar Sulphuris Calcareum", source: "Mineral" },
  "Hydr": { fullName: "Hydrastis Canadensis", source: "Plant" },
  "Hydr-ac": { fullName: "Hydrocyanicum Acidum", source: "Mineral" },
  "Hydrastis": { fullName: "Hydrastis Canadensis", source: "Plant" },
  "Hyos": { fullName: "Hyoscyamus Niger", source: "Plant" },
  "Hyper": { fullName: "Hypericum Perforatum", source: "Plant" },
  "Ign": { fullName: "Ignatia Amara", source: "Plant" },
  "Ind": { fullName: "Indium Metallicum", source: "Mineral" },
  "Iod": { fullName: "Iodum", source: "Mineral" },
  "Ipec": { fullName: "Ipecacuanha", source: "Plant" },
  "Iris": { fullName: "Iris Versicolor", source: "Plant" },
  "Just": { fullName: "Justicia Adhatoda", source: "Plant" },
  "Kali-acet": { fullName: "Kalium Aceticum", source: "Mineral" },
  "Kali-bi": { fullName: "Kali Bichromicum", source: "Mineral" },
  "Kali-br": { fullName: "Kalium Bromatum", source: "Mineral" },
  "Kali-c": { fullName: "Kali Carbonicum", source: "Mineral" },
  "Kali-i": { fullName: "Kalium Iodatum", source: "Mineral" },
  "Kali-m": { fullName: "Kalium Muriaticum", source: "Mineral" },
  "Kali-n": { fullName: "Kalium Nitricum", source: "Mineral" },
  "Kali-p": { fullName: "Kalium Phosphoricum", source: "Mineral" },
  "Kali-s": { fullName: "Kalium Sulphuricum", source: "Mineral" },
  "Kalm": { fullName: "Kalmia Latifolia", source: "Plant" },
  "Kreos": { fullName: "Kreosotum", source: "Plant" },
  "Lac-c": { fullName: "Lac Caninum", source: "Plant" },
  "Lac-d": { fullName: "Lac Vaccinum Defloratum", source: "Nosode" },
  "Lach": { fullName: "Lachesis Muta", source: "Animal (Snake)" },
  "Lachn": { fullName: "Lachnanthes Tinctoria", source: "Plant" },
  "Lat-h": { fullName: "Lathyrus Sativus", source: "Plant" },
  "Lat-m": { fullName: "Latrodectus Mactans", source: "Plant" },
  "Laur": { fullName: "Laurocerasus", source: "Plant" },
  "Led": { fullName: "Ledum Palustre", source: "Plant" },
  "Lept": { fullName: "Leptandra Virginica", source: "Plant" },
  "Lil-t": { fullName: "Lilium Tigrinum", source: "Plant" },
  "Lith-i": { fullName: "Lithium Iodatum", source: "Mineral" },
  "Lob": { fullName: "Lobelia Inflata", source: "Plant" },
  "Lyc": { fullName: "Lycopodium Clavatum", source: "Plant" },
  "Lys": { fullName: "Lysinum", source: "Plant" },
  "Mag-c": { fullName: "Magnesium Carbonicum", source: "Mineral" },
  "Mag-m": { fullName: "Magnesium Muriaticum", source: "Mineral" },
  "Mag-p": { fullName: "Magnesia Phosphorica", source: "Mineral" },
  "Manc": { fullName: "Mancinella", source: "Plant" },
  "Mang": { fullName: "Manganum Aceticum (+ -c.)", source: "Plant" },
  "Med": { fullName: "Medorrhinum", source: "Plant" },
  "Meny": { fullName: "Menyanthes Trifoliata", source: "Plant" },
  "Meph": { fullName: "Mephitis Putorius", source: "Plant" },
  "Merc": { fullName: "Mercurius Solubilis", source: "Mineral" },
  "Merc-c": { fullName: "Mercurius Corrosivus", source: "Mineral" },
  "Merc-cy": { fullName: "Mercurius Cyanatus", source: "Plant" },
  "Merc-d": { fullName: "Mercurius Dulcis", source: "Plant" },
  "Merc-i-f": { fullName: "Mercurius Iodatus Flavus", source: "Mineral" },
  "Merc-i-r": { fullName: "Mercurius Iodatus Ruber", source: "Mineral" },
  "Mez": { fullName: "Mezereum", source: "Plant" },
  "Mill": { fullName: "Millefolium Herba", source: "Plant" },
  "Morg": { fullName: "Bacillus Morgan (Bach)", source: "Plant" },
  "Mosch": { fullName: "Moschus", source: "Plant" },
  "Mur-ac": { fullName: "Muriaticum Acidum", source: "Mineral" },
  "Murx": { fullName: "Murex Purpurea", source: "Plant" },
  "Naja": { fullName: "Naja Tripudians", source: "Animal" },
  "Nat-acet": { fullName: "Natrium Aceticum", source: "Plant" },
  "Nat-c": { fullName: "Natrium Carbonicum", source: "Mineral" },
  "Nat-m": { fullName: "Natrum Muriaticum", source: "Mineral" },
  "Nat-p": { fullName: "Natrium Phosphoricum", source: "Mineral" },
  "Nat-s": { fullName: "Natrum Sulphuricum", source: "Mineral" },
  "Nit-ac": { fullName: "Nitricum Acidum", source: "Mineral" },
  "Nux-m": { fullName: "Nux Moschata", source: "Plant" },
  "Nux-v": { fullName: "Nux Vomica", source: "Plant" },
  "Ol-an": { fullName: "Oleum Animale Aethereum", source: "Plant" },
  "Olden-h": { fullName: "Oldenlandia Herbacea", source: "Plant" },
  "Onos": { fullName: "Onosmodium Virginianum", source: "Plant" },
  "Op": { fullName: "Opium", source: "Plant" },
  "Osm": { fullName: "Osmium Metallicum (+ -ac.)", source: "Mineral" },
  "Ox-ac": { fullName: "Oxalicum Acidum", source: "Mineral" },
  "Paeon": { fullName: "Paeonia Officinalis", source: "Plant" },
  "Pall": { fullName: "Palladium Metallicum", source: "Mineral" },
  "Par": { fullName: "Paris Quadrifolia", source: "Plant" },
  "Petr": { fullName: "Petroleum", source: "Mineral" },
  "Ph-ac": { fullName: "Phosphoricum Acidum", source: "Mineral" },
  "Phos": { fullName: "Phosphorus", source: "Mineral" },
  "Phys": { fullName: "Physostigma Venenosum", source: "Plant" },
  "Phyt": { fullName: "Phytolacca Decandra", source: "Plant" },
  "Pic-ac": { fullName: "Picricum Acidum", source: "Mineral" },
  "Pip-m": { fullName: "Piper Methysticum", source: "Plant" },
  "Plan": { fullName: "Plantago Major", source: "Plant" },
  "Plat": { fullName: "Platinum Metallicum", source: "Mineral" },
  "Plumb": { fullName: "Plumbago Littoralis", source: "Mineral" },
  "Podoph": { fullName: "Podophyllum Peltatum", source: "Plant" },
  "Polyg": { fullName: "Polygonum Hydropiperoides", source: "Plant" },
  "Prot": { fullName: "Bacillus Proteus (Bach)", source: "Plant" },
  "Prun": { fullName: "Prunus Spinosa", source: "Plant" },
  "Psor": { fullName: "Psorinum", source: "Plant" },
  "Ptel": { fullName: "Ptelea Trifoliata", source: "Plant" },
  "Puls": { fullName: "Pulsatilla Pratensis", source: "Plant" },
  "Pyr": { fullName: "Pyrethrum Parthenium", source: "Plant" },
  "Rad-br": { fullName: "Radium Bromatum", source: "Plant" },
  "Ran-b": { fullName: "Ranunculus Bulbosus", source: "Plant" },
  "Ran-s": { fullName: "Ranunculus Sceleratus", source: "Plant" },
  "Raph": { fullName: "Raphanus Sativus", source: "Plant" },
  "Rat": { fullName: "Ratanhia Peruviana", source: "Plant" },
  "Rheum": { fullName: "Rheum Palmatum", source: "Plant" },
  "Rhod": { fullName: "Rhododendron Chrysanthum", source: "Plant" },
  "Rhus-t": { fullName: "Rhus Toxicodendron", source: "Plant" },
  "Rob": { fullName: "Robinia Pseudacacia", source: "Plant" },
  "Robinia": { fullName: "Robinia Pseudoacacia", source: "Plant" },
  "Rumex": { fullName: "Rumex Crispus", source: "Plant" },
  "Ruta": { fullName: "Ruta Graveolens", source: "Plant" },
  "Sabad": { fullName: "Sabadilla", source: "Plant" },
  "Sabal": { fullName: "Sabal Serrulata", source: "Plant" },
  "Sabina": { fullName: "Sabina Officinalis", source: "Plant" },
  "Sal-ac": { fullName: "Salicylicum Acidum", source: "Mineral" },
  "Samb": { fullName: "Sambucus Nigra", source: "Plant" },
  "Sang": { fullName: "Sanguinaria Canadensis", source: "Plant" },
  "Sanic": { fullName: "Sanicula Aqua", source: "Plant" },
  "Sars": { fullName: "Sarsaparilla Officinalis", source: "Plant" },
  "Sec": { fullName: "Secale Cornutum", source: "Plant" },
  "Sel": { fullName: "Selenium Metallicum", source: "Mineral" },
  "Senec": { fullName: "Senecio Aureus", source: "Plant" },
  "Seneg": { fullName: "Senega", source: "Plant" },
  "Sep": { fullName: "Sepia Officinalis", source: "Animal (Cuttlefish)" },
  "Sil": { fullName: "Silicea", source: "Mineral" },
  "Spig": { fullName: "Spigelia Anthelmia", source: "Plant" },
  "Spong": { fullName: "Spongia Tosta", source: "Animal (Toasted Sponge)" },
  "Squil": { fullName: "Squilla Maritima", source: "Plant" },
  "Stann": { fullName: "Stannum Metallicum", source: "Mineral" },
  "Staph": { fullName: "Staphysagria", source: "Plant" },
  "Stict": { fullName: "Sticta Pulmonaria", source: "Plant" },
  "Stram": { fullName: "Stramonium", source: "Plant" },
  "Stront-br": { fullName: "Strontium Bromatum", source: "Plant" },
  "Stroph": { fullName: "Strophanthus Hispidus", source: "Plant" },
  "Stry": { fullName: "Strychninum", source: "Plant" },
  "Sul-i": { fullName: "Sulphur Iodatum", source: "Mineral" },
  "Sulph": { fullName: "Sulphur", source: "Mineral" },
  "Sulph-ac": { fullName: "Sulphur", source: "Mineral" },
  "Sumb": { fullName: "Sumbulus Moschatus", source: "Plant" },
  "Syc": { fullName: "Bacillus Sycoccus (Paterson)", source: "Plant" },
  "Symph": { fullName: "Symphytum Officinale", source: "Plant" },
  "Syph": { fullName: "Syphilinum", source: "Plant" },
  "Tab": { fullName: "Tabacum", source: "Plant" },
  "Tarax": { fullName: "Taraxacum Officinale", source: "Plant" },
  "Tarent": { fullName: "Tarentula Hispanica", source: "Animal" },
  "Tell": { fullName: "Tellurium", source: "Plant" },
  "Ter": { fullName: "Terebinthiniae Oleum", source: "Plant" },
  "Teucr": { fullName: "Teucrium Marum Verum", source: "Plant" },
  "Ther": { fullName: "Theridion Curassavicum", source: "Plant" },
  "Thuja": { fullName: "Thuja Occidentalis", source: "Plant" },
  "Thyr": { fullName: "Thyreoidinum", source: "Plant" },
  "Trill": { fullName: "Trillium Pendulum", source: "Plant" },
  "Tub": { fullName: "Tuberculinum Bovinum Kent", source: "Plant" },
  "Urt-u": { fullName: "Urtica Urens", source: "Plant" },
  "Ust": { fullName: "Ustilago Maydis", source: "Plant" },
  "Valer": { fullName: "Valeriana Officinalis", source: "Plant" },
  "Verat": { fullName: "Veratrum Album", source: "Plant" },
  "Verat-v": { fullName: "Veratrum Viride", source: "Plant" },
  "Vib": { fullName: "Viburnum Opulus", source: "Plant" },
  "Viol-o": { fullName: "Viola Odorata", source: "Plant" },
  "Viol-t": { fullName: "Viola Tricolor", source: "Plant" },
  "Vip": { fullName: "Vipera Berus", source: "Plant" },
  "Visc": { fullName: "Viscum Album", source: "Plant" },
  "X-ray": { fullName: "X-ray", source: "Plant" },
  "Xan": { fullName: "Xantoxylum Fraxineum", source: "Plant" },
  "Zinc": { fullName: "Zincum Metallicum", source: "Mineral" },
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
  "Clinical Tiers (Peds/Geri/Vet)",
];

export const REPERTORY_DATA: Rubric[] = [
  {
    id: "mind_anxiety_health",
    chapter: "Mind (Mental & Emotional)",
    name: "Anxiety, health about, extreme worry",
    remedies: { "Acon": 2, "Ars": 3, "Calc": 3, "Lyc": 2, "Nux-v": 1, "Phos": 3, "Puls": 2 }
  },
  {
    id: "mind_grief_silent",
    chapter: "Mind (Mental & Emotional)",
    name: "Grief, silent, long-lasting sorrow",
    remedies: { "Aur-m": 3, "Ign": 3, "Nat-m": 3, "Ph-ac": 3, "Puls": 2, "Sep": 2 }
  },
  {
    id: "mind_anger_ailments",
    chapter: "Mind (Mental & Emotional)",
    name: "Anger, ailments from, suppressed irritability",
    remedies: { "Bry": 2, "Cham": 3, "Coloc": 3, "Ign": 2, "Lyc": 2, "Nux-v": 3, "Staph": 3 }
  },
  {
    id: "mind_depression_sadness",
    chapter: "Mind (Mental & Emotional)",
    name: "Depression, deep sadness, weeping disposition",
    remedies: { "Aur-m": 3, "Calc": 2, "Ign": 3, "Nat-m": 3, "Ph-ac": 2, "Puls": 3, "Sep": 3 }
  },
  {
    id: "mind_claustrophobia",
    chapter: "Mind (Mental & Emotional)",
    name: "Fear, narrow spaces (claustrophobia)",
    remedies: { "Acon": 3, "Arg-n": 3, "Calc": 2, "Lyc": 2, "Puls": 2 }
  },
  {
    id: "mind_anxiety_anticipatory",
    chapter: "Mind (Mental & Emotional)",
    name: "Anxiety, anticipatory (before public events/exams)",
    remedies: { "Arg-n": 3, "Ars": 2, "Gels": 3, "Lyc": 3, "Sil": 2 }
  },
  {
    id: "mind_irritability_morning",
    chapter: "Mind (Mental & Emotional)",
    name: "Irritability, morning on waking, fault-finding",
    remedies: { "Cham": 2, "Lyc": 3, "Nat-m": 2, "Nux-v": 3, "Sulph": 3 }
  },
  {
    id: "mind_restlessness_tossing",
    chapter: "Mind (Mental & Emotional)",
    name: "Restlessness, tossing about, mental and physical, driving out of bed",
    remedies: { "Acon": 3, "Ars": 3, "Cham": 2, "Rhus-t": 3 }
  },
  {
    id: "mind_consolation_agg",
    chapter: "Mind (Mental & Emotional)",
    name: "Consolation aggravates mental symptoms",
    remedies: { "Ign": 3, "Nat-m": 3, "Sep": 3, "Sil": 2 }
  },
  {
    id: "mind_consolation_amel",
    chapter: "Mind (Mental & Emotional)",
    name: "Consolation ameliorates symptoms (desires sympathy)",
    remedies: { "Puls": 3, "Sil": 2 }
  },
  {
    id: "head_migraine_throbbing",
    chapter: "Vertigo & Head",
    name: "Migraine, throbbing pain, worse noise, light, heat",
    remedies: { "Bell": 3, "Gels": 2, "Lach": 2, "Nat-m": 3, "Phos": 1, "Sulph": 2 }
  },
  {
    id: "head_vertigo_motion",
    chapter: "Vertigo & Head",
    name: "Vertigo, on motion, turning in bed, looking up",
    remedies: { "Bry": 3, "Cocculus": 3, "Con": 3, "Gels": 2, "Puls": 2 }
  },
  {
    id: "head_tension_neck",
    chapter: "Vertigo & Head",
    name: "Tension headache, radiating from neck/occiput forward",
    remedies: { "Bry": 2, "Cimic": 3, "Gels": 3, "Nux-v": 2, "Sil": 3 }
  },
  {
    id: "head_congestive_sun",
    chapter: "Vertigo & Head",
    name: "Headache, congestive, bursting sensation, worse sun heat",
    remedies: { "Bell": 3, "Gels": 2, "Glon": 3, "Lach": 2, "Nat-m": 3 }
  },
  {
    id: "head_stitching_motion",
    chapter: "Vertigo & Head",
    name: "Headache, sharp stitching pain, worse least motion",
    remedies: { "Bry": 3, "Kali-c": 2, "Spig": 3 }
  },
  {
    id: "head_vertigo_nausea",
    chapter: "Vertigo & Head",
    name: "Vertigo, with nausea, riding in a carriage or boat",
    remedies: { "Cocculus": 3, "Petr": 3, "Tab": 3 }
  },
  {
    id: "eyes_photophobia",
    chapter: "Eyes & Vision",
    name: "Photophobia, extreme sensitivity to light",
    remedies: { "Bell": 3, "Con": 3, "Hep": 3, "Sil": 2, "Sulph": 3 }
  },
  {
    id: "eyes_vision_dimness",
    chapter: "Eyes & Vision",
    name: "Vision, dimness, as if looking through a gauze",
    remedies: { "Caust": 2, "Gels": 3, "Lyc": 2, "Puls": 2, "Sulph": 2 }
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
    remedies: { "Ars": 3, "Euphr": 3, "Merc": 2 }
  },
  {
    id: "ears_otitis_throbbing",
    chapter: "Ears & Hearing",
    name: "Otitis media, throbbing pain, red ear, high fever",
    remedies: { "Bell": 3, "Cham": 3, "Hep": 3, "Merc": 2, "Puls": 3 }
  },
  {
    id: "ears_hearing_buzzing",
    chapter: "Ears & Hearing",
    name: "Hearing, impaired, with roaring, ringing, or buzzing noises",
    remedies: { "Carbo-v": 2, "Chna": 3, "Lyc": 2, "Sil": 2 }
  },
  {
    id: "ears_stitching_throat",
    chapter: "Ears & Hearing",
    name: "Ears, stitching pain, extending to throat when swallowing",
    remedies: { "Hep": 3, "Nux-v": 2, "Phyt": 2 }
  },
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
    remedies: { "Hep": 2, "Hydrastis": 3, "Kali-bi": 3, "Puls": 3 }
  },
  {
    id: "nose_epistaxis_morning",
    chapter: "Nose & Coryza",
    name: "Epistaxis, nosebleed, bright red blood, morning on washing face",
    remedies: { "Arn": 2, "Phos": 3 }
  },
  {
    id: "face_neuralgia_left",
    chapter: "Face & Mouth",
    name: "Neuralgia, facial, left-sided, tearing pain",
    remedies: { "Coloc": 3, "Lach": 2, "Spig": 3 }
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
    remedies: { "Ars": 2, "Borax": 3, "Merc": 3, "Nit-ac": 3 }
  },
  {
    id: "mouth_toothache_cold",
    chapter: "Face & Mouth",
    name: "Toothache, tearing pain, relieved temporarily by holding cold water in mouth",
    remedies: { "Cham": 2, "Coff": 3, "Puls": 3 }
  },
  {
    id: "throat_tonsillitis_right",
    chapter: "Throat & Neck",
    name: "Tonsillitis, right-sided, swallowing difficult, liquids choke",
    remedies: { "Bell": 3, "Lyc": 3, "Merc-i-f": 3 }
  },
  {
    id: "throat_tonsillitis_left",
    chapter: "Throat & Neck",
    name: "Tonsillitis, left-sided, sensitive to least touch on neck",
    remedies: { "Lach": 3, "Merc-i-r": 3, "Phyt": 3 }
  },
  {
    id: "throat_sensation_plug",
    chapter: "Throat & Neck",
    name: "Throat, sensation of a plug or lump, worse swallowing empty",
    remedies: { "Hep": 2, "Ign": 3, "Lach": 3 }
  },
  {
    id: "stomach_gerd_acid",
    chapter: "Stomach & Gastric",
    name: "GERD, acid reflux, sour eructations, burning pain",
    remedies: { "Ars": 2, "Lyc": 3, "Nux-v": 3, "Puls": 2, "Robinia": 3, "Sulph": 2 }
  },
  {
    id: "stomach_nausea_vomiting",
    chapter: "Stomach & Gastric",
    name: "Nausea and vomiting, constant, not relieved by vomiting",
    remedies: { "Ars": 2, "Colch": 3, "Ipec": 3, "Nux-v": 2, "Tab": 3 }
  },
  {
    id: "stomach_thirst_large_quantities",
    chapter: "Stomach & Gastric",
    name: "Thirst, for large quantities at long intervals",
    remedies: { "Acon": 2, "Bry": 3, "Nat-m": 3, "Phos": 2, "Sulph": 2 }
  },
  {
    id: "stomach_thirst_small_sips",
    chapter: "Stomach & Gastric",
    name: "Thirst, for small quantities frequently, burning",
    remedies: { "Acon": 2, "Ars": 3, "Bell": 2, "Chna": 2 }
  },
  {
    id: "stomach_bloating_flatulence",
    chapter: "Stomach & Gastric",
    name: "Bloating, flatulence, gas immediately after eating",
    remedies: { "Carbo-v": 3, "Chna": 3, "Lyc": 3, "Nux-v": 2, "Sulph": 2 }
  },
  {
    id: "stomach_appetite_ravenous",
    chapter: "Stomach & Gastric",
    name: "Appetite, ravenous, empty sinking feeling in stomach (11 AM)",
    remedies: { "Iod": 3, "Lyc": 2, "Phos": 2, "Sep": 2, "Sulph": 3 }
  },
  {
    id: "abdomen_colic_double",
    chapter: "Abdomen & Liver",
    name: "Colic, flatulent, forcing patient to bend double for relief",
    remedies: { "Cham": 2, "Coloc": 3, "Mag-p": 3, "Nux-v": 2 }
  },
  {
    id: "abdomen_liver_soreness",
    chapter: "Abdomen & Liver",
    name: "Liver, soreness and stitching pain, worse lying on right side",
    remedies: { "Bry": 3, "Chel": 3, "Lyc": 2, "Merc": 2 }
  },
  {
    id: "abdomen_distended_drum",
    chapter: "Abdomen & Liver",
    name: "Abdomen, distended like a drum, painful, trapped flatus",
    remedies: { "Carbo-v": 3, "Chna": 3, "Coloc": 2, "Lyc": 3 }
  },
  {
    id: "stool_constipation_dry",
    chapter: "Rectum, Stool & Bowels",
    name: "Constipation, dry, hard stools, as if burnt, crumbling",
    remedies: { "Alum": 3, "Bry": 3, "Nat-m": 3, "Nux-v": 2, "Sulph": 3 }
  },
  {
    id: "stool_diarrhea_morning",
    chapter: "Rectum, Stool & Bowels",
    name: "Diarrhea, painless, watery, offensive, driving out of bed early morning",
    remedies: { "Ars": 2, "Chna": 2, "Podoph": 3, "Sulph": 3 }
  },
  {
    id: "stool_diarrhea_tenesmus",
    chapter: "Rectum, Stool & Bowels",
    name: "Diarrhea, with painful straining (tenesmus), slimy stools",
    remedies: { "Aloe": 2, "Merc": 3, "Merc-c": 3 }
  },
  {
    id: "urinary_cystitis_burning",
    chapter: "Urinary Organs",
    name: "Cystitis, violent burning and cutting pain during and after urination",
    remedies: { "Apis": 3, "Canth": 3, "Nux-v": 2, "Sars": 2 }
  },
  {
    id: "urinary_involuntary_cough",
    chapter: "Urinary Organs",
    name: "Urination, frequent, involuntary when coughing, sneezing, or walking",
    remedies: { "Caust": 3, "Nat-m": 2, "Puls": 2, "Sep": 2 }
  },
  {
    id: "urinary_brick_dust",
    chapter: "Urinary Organs",
    name: "Urine, brick-dust red sediment in vessel",
    remedies: { "Lyc": 3, "Nat-m": 2, "Sars": 3, "Sep": 3 }
  },
  {
    id: "genitalia_menses_painful",
    chapter: "Male & Female Genitalia",
    name: "Menses, painful (dysmenorrhea), with cramping, better heat and pressure",
    remedies: { "Cham": 2, "Cimic": 3, "Mag-p": 3, "Puls": 2 }
  },
  {
    id: "genitalia_menses_ Sabina",
    chapter: "Male & Female Genitalia",
    name: "Menses, dark, clotted, flow only when moving about, active flow",
    remedies: { "Cham": 2, "Puls": 3, "Sabina": 3 }
  },
  {
    id: "genitalia_leucorrhea_yellow",
    chapter: "Male & Female Genitalia",
    name: "Leucorrhea, thick, yellow-green, mild and bland (non-irritating)",
    remedies: { "Alum": 2, "Calc": 2, "Puls": 3, "Sep": 2 }
  },
  {
    id: "resp_cough_spasmodic",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, dry, spasmodic, worse warm room, better cold air",
    remedies: { "Acon": 2, "Bry": 2, "Dros": 3, "Puls": 3, "Spong": 2 }
  },
  {
    id: "resp_cough_barking",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, barking, croupy, sawing sound, worse after midnight, waking choking",
    remedies: { "Acon": 3, "Dros": 2, "Hep": 3, "Spong": 3 }
  },
  {
    id: "resp_cough_tickling",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, tickling in larynx, triggered by talking or laughing, dry tickling",
    remedies: { "Con": 2, "Dros": 3, "Phos": 3, "Rumex": 3 }
  },
  {
    id: "resp_asthma_night",
    chapter: "Respiration & Chest",
    name: "Asthma, attacks at night, especially after midnight (1-3 AM)",
    remedies: { "Ars": 3, "Kali-c": 3, "Lyc": 1, "Nat-s": 3, "Puls": 1, "Samb": 2 }
  },
  {
    id: "resp_dyspnea_fresh_air",
    chapter: "Respiration & Chest",
    name: "Respiration, difficult (dyspnea), must sit up, desires fresh open air",
    remedies: { "Ars": 3, "Carbo-v": 3, "Lach": 2, "Puls": 3 }
  },
  {
    id: "resp_chest_stitching",
    chapter: "Respiration & Chest",
    name: "Chest, sharp stitching pain, worse least breathing or motion, holds chest",
    remedies: { "Bry": 3, "Kali-c": 3, "Ran-b": 3 }
  },
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
    remedies: { "Calc": 2, "Caust": 2, "Rhus-t": 3 }
  },
  {
    id: "back_burning_scapulae",
    chapter: "Back & Spine",
    name: "Spine, burning heat or soreness between scapulae",
    remedies: { "Lyc": 2, "Phos": 3, "Sulph": 3 }
  },
  {
    id: "joints_rheumatic_pain_motion",
    chapter: "Extremities & Joints",
    name: "Joint pain, tearing, stitching, worse from any motion",
    remedies: { "Bry": 3, "Caust": 2, "Colch": 2, "Led": 2, "Nux-v": 1 }
  },
  {
    id: "joints_rheumatic_pain_rest",
    chapter: "Extremities & Joints",
    name: "Joint pain, tearing, worse rest, better continuous motion",
    remedies: { "Calc": 2, "Caust": 2, "Rhod": 3, "Rhus-t": 3, "Ruta": 3 }
  },
  {
    id: "joints_gouty_inflammation",
    chapter: "Extremities & Joints",
    name: "Gouty inflammation of big toe, swelling, hot and red",
    remedies: { "Arn": 2, "Bry": 2, "Colch": 3, "Led": 3, "Urt-u": 2 }
  },
  {
    id: "joints_sciatica_right",
    chapter: "Extremities & Joints",
    name: "Sciatica, right-sided, worse lying on painful side, better heat",
    remedies: { "Coloc": 3, "Lyc": 2, "Mag-p": 3 }
  },
  {
    id: "sleep_insomnia_thoughts",
    chapter: "Sleep & Dreams",
    name: "Insomnia, sleeplessness from rush of thoughts, hyperactive mind",
    remedies: { "Coff": 3, "Gels": 2, "Nux-v": 2, "Sulph": 2 }
  },
  {
    id: "sleep_fragmentation_3am",
    chapter: "Sleep & Dreams",
    name: "Sleep, fragmentation, waking very early (3 AM), unable to sleep again",
    remedies: { "Ars": 2, "Calc": 2, "Nux-v": 3, "Sulph": 2 }
  },
  {
    id: "sleep_dreams_vivid",
    chapter: "Sleep & Dreams",
    name: "Dreams, vivid, of robbers, falling, or fire",
    remedies: { "Bell": 2, "Nat-m": 3, "Sil": 3, "Sulph": 2 }
  },
  {
    id: "fever_dry_heat_bell",
    chapter: "Fever, Chill & Sweat",
    name: "Fever, dry heat, bounding pulse, red face, dilated pupils, no thirst",
    remedies: { "Acon": 3, "Bell": 3, "Gels": 2 }
  },
  {
    id: "fever_chill_spine",
    chapter: "Fever, Chill & Sweat",
    name: "Chill, running up and down the back, worse cold air",
    remedies: { "Ars": 2, "Gels": 3, "Nux-v": 2 }
  },
  {
    id: "fever_perspiration_sour",
    chapter: "Fever, Chill & Sweat",
    name: "Perspiration, offensive, staining linen yellow, sour smell",
    remedies: { "Calc": 2, "Hep": 3, "Merc": 3, "Sulph": 2 }
  },
  {
    id: "skin_eczema_itching",
    chapter: "Skin & Eruptions",
    name: "Eczema, intense itching, scratching until bleeding",
    remedies: { "Ars": 2, "Graph": 3, "Mez": 2, "Rhus-t": 3, "Sulph": 3 }
  },
  {
    id: "skin_eruptions_sticky",
    chapter: "Skin & Eruptions",
    name: "Eruptions, honey-like, sticky fluid oozing",
    remedies: { "Calc": 1, "Graph": 3, "Mez": 2, "Sulph": 1 }
  },
  {
    id: "skin_vitiligo_patches",
    chapter: "Skin & Eruptions",
    name: "Vitiligo, depigmented patches, localized or spreading",
    remedies: { "Ars-i": 3, "Calc": 2, "Nat-m": 2, "Sep": 2, "Sulph": 2 }
  },
  {
    id: "skin_urticaria_hives",
    chapter: "Skin & Eruptions",
    name: "Urticaria, hives, burning, stinging, better cold bathing",
    remedies: { "Apis": 3, "Ars": 1, "Rhus-t": 2, "Sulph": 2, "Urt-u": 3 }
  },
  {
    id: "skin_psoriasis_scales",
    chapter: "Skin & Eruptions",
    name: "Psoriasis, thick dry scales, cracks on hands or heels",
    remedies: { "Ars": 2, "Graph": 3, "Petr": 3, "Sulph": 3 }
  },
  {
    id: "gen_chilly_patient",
    chapter: "Generalities & Modalities",
    name: "Generalities, chilly patient, extremely sensitive to cold",
    remedies: { "Ars": 3, "Calc": 3, "Hep": 3, "Nux-v": 3, "Puls": -1, "Sil": 3 }
  },
  {
    id: "gen_warm_patient",
    chapter: "Generalities & Modalities",
    name: "Generalities, warm patient, desires open air and cold",
    remedies: { "Apis": 3, "Arg-n": 3, "Ars": -1, "Iod": 3, "Puls": 3, "Sulph": 3 }
  },
  {
    id: "gen_right_sided",
    chapter: "Generalities & Modalities",
    name: "Generalities, complaints affecting primarily the right side",
    remedies: { "Apis": 3, "Bell": 3, "Bry": 2, "Chel": 3, "Lyc": 3 }
  },
  {
    id: "gen_left_sided",
    chapter: "Generalities & Modalities",
    name: "Generalities, complaints affecting primarily the left side",
    remedies: { "Lach": 3, "Phos": 2, "Puls": 1, "Sep": 2, "Thuja": 3 }
  },
  {
    id: "peds_dentition_irritability",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Dentition, difficult, with extreme irritability & screaming",
    remedies: { "Bell": 2, "Calc": 2, "Calc-p": 3, "Cham": 3, "Puls": 1 }
  },
  {
    id: "peds_night_terrors",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Night terrors in children, waking screaming and frightened",
    remedies: { "Bell": 3, "Calc": 2, "Cham": 2, "Puls": 2, "Stram": 3 }
  },
  {
    id: "peds_growth_pain",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Growth spurts, rapid, with bone and muscle aching",
    remedies: { "Calc": 2, "Calc-p": 3, "Ph-ac": 2, "Sulph": 1 }
  },
  {
    id: "peds_crying_clinging",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Pediatrics: Crying constantly, wants to be held, clinging to mother",
    remedies: { "Calc": 2, "Cham": 2, "Puls": 3, "Sil": 1 }
  },
  {
    id: "geri_memory_loss",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Geriatrics: Memory loss, senile dementia, confusion of mind",
    remedies: { "Alum": 2, "Baryta-c": 3, "Con": 3, "Lyc": 3, "Nat-m": 1, "Phos": 2 }
  },
  {
    id: "geri_joint_stiffness",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Geriatrics: Joint stiffness, worse cold weather, better heat (old age)",
    remedies: { "Bry": 2, "Calc": 2, "Caust": 3, "Rhus-t": 3, "Sulph": 2 }
  },
  {
    id: "geri_weakness_debility",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Geriatrics: General physical debility, weakness in limbs, easily fatigued",
    remedies: { "Ars": 2, "Baryta-c": 2, "Con": 3, "Gels": 3, "Phos": 2 }
  },
  {
    id: "vet_separation_anxiety",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Separation anxiety in pets, whining, destroying things",
    remedies: { "Ars": 3, "Gels": 1, "Ign": 2, "Ph-ac": 2, "Puls": 3 }
  },
  {
    id: "vet_eruptions_scaly",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Eruptions, dry, scaly, scratching raw in animals",
    remedies: { "Ars": 2, "Graph": 3, "Mez": 2, "Rhus-t": 2, "Sulph": 3 }
  },
  {
    id: "vet_thunder_fear",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Fear of thunder, firecrackers, loud noises",
    remedies: { "Acon": 3, "Bell": 2, "Borax": 3, "Gels": 2, "Phos": 3 }
  },
  {
    id: "vet_lethargy_stiffness",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Veterinary: Lethargy in animals, stiffness when rising, improves with motion",
    remedies: { "Arn": 3, "Bry": 1, "Calc": 2, "Rhus-t": 3 }
  },
  {
    id: "skin_abscess",
    chapter: "Skin & Eruptions",
    name: "Abscess",
    remedies: { "Acon": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Calc": 2, "Calc-f": 2, "Calc-p": 2, "Calc-s": 2, "Calen": 2, "Carb-ac": 2, "Chna": 2, "Croto-t": 2, "Flu-ac": 2, "Graph": 2, "Hep": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Ph-ac": 2, "Phos": 2, "Rhus-t": 2, "Sil": 2, "Sulph": 2, "Tarent": 2 }
  },
  {
    id: "stomach_acidity",
    chapter: "Stomach & Gastric",
    name: "Acidity",
    remedies: { "Calc": 2, "Chna": 2, "Graph": 2, "Hep": 2, "Iris": 2, "Kali-c": 2, "Lept": 2, "Lyc": 2, "Mag-c": 2, "Merc-c": 2, "Nat-c": 2, "Nat-m": 2, "Nat-p": 2, "Nat-s": 2, "Nux-v": 2, "Ox-ac": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Rheum": 2, "Rob": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Sulph-ac": 2 }
  },
  {
    id: "extremities_aching",
    chapter: "Extremities & Joints",
    name: "Aching",
    remedies: { "Agar": 2, "Arn": 2, "Bapt": 2, "Berb": 2, "Bry": 2, "Carbo-v": 2, "Chna": 2, "Cimic": 2, "Dulc": 2, "Echin": 2, "Eup-per": 2, "Gels": 2, "Hyos": 2, "Ign": 2, "Kali-m": 2, "Lach": 2, "Nux-v": 2, "Onos": 2, "Phyt": 2, "Pyr": 2, "Rad-br": 2, "Rhus-t": 2, "Ruta": 2, "Ter": 2 }
  },
  {
    id: "generalities_air_open",
    chapter: "Generalities & Modalities",
    name: "Air Open <",
    remedies: { "Acon": 2, "Am-c": 2, "Calc": 2, "Calc-p": 2, "Camph": 2, "Caps": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cocculus": 2, "Coff": 2, "Colch": 2, "Dulc": 2, "Hep": 2, "Ign": 2, "Kali-bi": 2, "Kali-c": 2, "Mag-p": 2, "Merc": 2, "Nit-ac": 2, "Nux-m": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Phyt": 2, "Rumex": 2, "Seneg": 2, "Sil": 2, "Sulph": 2, "Zinc": 2 }
  },
  {
    id: "generalities_air_open",
    chapter: "Generalities & Modalities",
    name: "Air Open >",
    remedies: { "All-c": 2, "Alum": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Aur-m": 2, "Bapt": 2, "Canch": 2, "Carbo-v": 2, "Chna": 2, "Croc": 2, "Dios": 2, "Euph": 2, "Ferr": 2, "Ferr-i": 2, "Glon": 2, "Iod": 2, "Ipec": 2, "Kali-i": 2, "Lach": 2, "Lyc": 2, "Mag-c": 2, "Mag-m": 2, "Med": 2, "Naja": 2, "Nat-m": 2, "Nat-s": 2, "Op": 2, "Puls": 2, "Rad-br": 2, "Rhus-t": 2, "Sabad": 2, "Sabina": 2, "Seneg": 2, "Sulph": 2, "Tub": 2 }
  },
  {
    id: "mind_anger",
    chapter: "Mind (Mental & Emotional)",
    name: "Anger",
    remedies: { "Acon": 2, "Alum": 2, "Anac": 2, "Ant-c": 2, "Ant-t": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Borax": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Calc-s": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Cina": 2, "Cocculus": 2, "Coloc": 2, "Graph": 2, "Hep": 2, "Ign": 2, "Iod": 2, "Kali-c": 2, "Kali-m": 2, "Kali-s": 2, "Lyc": 2, "Nat-c": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Plat": 2, "Sel": 2, "Senec": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Sulph-ac": 2, "Thuja": 2, "Tub": 2, "Verat-v": 2, "Zinc": 2 }
  },
  {
    id: "respiration_angina_pains",
    chapter: "Respiration & Chest",
    name: "Angina Pains",
    remedies: { "Agar": 2, "Am-c": 2, "Aml-n": 2, "Apis": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Aur-m": 2, "Cact": 2, "Cent": 2, "Chna": 2, "Cimic": 2, "Cupr": 2, "Glon": 2, "Kali-acet": 2, "Kalm": 2, "Lach": 2, "Lat-m": 2, "Lith-i": 2, "Naja": 2, "Nux-v": 2, "Ox-ac": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Spig": 2, "Spong": 2, "Tab": 2 }
  },
  {
    id: "rectum,_anus_affections_of",
    chapter: "Rectum, Stool & Bowels",
    name: "Anus, affections of",
    remedies: { "Aloe": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Calc-f": 2, "Calc-p": 2, "Carbo-v": 2, "Caust": 2, "Con": 2, "Flu-ac": 2, "Graph": 2, "Ham": 2, "Hydr": 2, "Ign": 2, "Iris": 2, "Kali-i": 2, "Lach": 2, "Led": 2, "Merc": 2, "Nat-m": 2, "Nit-ac": 2, "Op": 2, "Petr": 2, "Phos": 2, "Plumb": 2, "Rat": 2, "Rhus-t": 2, "Sang": 2, "Sanic": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Syph": 2, "Thuja": 2 }
  },
  {
    id: "stomach_appetite_perverted",
    chapter: "Stomach & Gastric",
    name: "Appetite (Perverted)",
    remedies: { "Alum": 2, "Ant-c": 2, "Ars": 2, "Calc": 2, "Chna": 2, "Cina": 2, "Ferr": 2, "Graph": 2, "Iod": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Sil": 2, "Sulph": 2, "Verat": 2 }
  },
  {
    id: "generalities_ascending",
    chapter: "Generalities & Modalities",
    name: "Ascending <",
    remedies: { "Ars": 2, "Aur-m": 2, "Borax": 2, "Bry": 2, "Calc": 2, "Coca": 2, "Iod": 2, "Merc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Sep": 2, "Spig": 2, "Spong": 2, "Sulph": 2 }
  },
  {
    id: "face_apthae",
    chapter: "Face & Mouth",
    name: "Apthae",
    remedies: { "Aeth": 2, "Ant-t": 2, "Ars": 2, "Bapt": 2, "Borax": 2, "Bry": 2, "Carbo-v": 2, "Hydr": 2, "Kali-m": 2, "Merc": 2, "Merc-c": 2, "Mur-ac": 2, "Nat-m": 2, "Nit-ac": 2, "Sars": 2, "Sulph": 2, "Sulph-ac": 2 }
  },
  {
    id: "generalities_arthritis",
    chapter: "Generalities & Modalities",
    name: "Arthritis",
    remedies: { "Abrot": 2, "Acon": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Benz-ac": 2, "Berb": 2, "Bry": 2, "Calc-p": 2, "Caust": 2, "Cham": 2, "Chin-s": 2, "Chna": 2, "Cimic": 2, "Colch": 2, "Dulc": 2, "Gels": 2, "Graph": 2, "Guai": 2, "Ham": 2, "Iod": 2, "Kali-bi": 2, "Kali-i": 2, "Kali-m": 2, "Kalm": 2, "Led": 2, "Lil-t": 2, "Lith-i": 2, "Lyc": 2, "Med": 2, "Merc": 2, "Merc-c": 2, "Nat-m": 2, "Nat-p": 2, "Nat-s": 2, "Nit-ac": 2, "Ox-ac": 2, "Phyt": 2, "Puls": 2, "Rad-br": 2, "Ran-b": 2, "Rhus-t": 2, "Sabina": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Stict": 2, "Sulph": 2, "Syph": 2, "Verat-v": 2 }
  },
  {
    id: "back_back_spine",
    chapter: "Back & Spine",
    name: "Back, Spine",
    remedies: { "Agar": 2, "Alum": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Calc": 2, "Chin-s": 2, "Cimic": 2, "Cocculus": 2, "Con": 2, "Ferr": 2, "Gels": 2, "Hyper": 2, "Kali-c": 2, "Lach": 2, "Nat-m": 2, "Nat-s": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Pic-ac": 2, "Rhus-t": 2, "Sal-ac": 2, "Sec": 2, "Sil": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "generalities_bathing_cold_application",
    chapter: "Generalities & Modalities",
    name: "Bathing, cold application >",
    remedies: { "Apis": 2, "Arg-n": 2, "Asar": 2, "Aur-m": 2, "Bry": 2, "Flu-ac": 2, "Hyper": 2, "Iod": 2, "Led": 2, "Lyc": 2, "Nat-m": 2, "Phyt": 2, "Puls": 2, "Rat": 2, "Sec": 2, "Sep": 2, "Sulph": 2 }
  },
  {
    id: "respiration_breathing_deeply",
    chapter: "Respiration & Chest",
    name: "Breathing deeply <",
    remedies: { "Acon": 2, "Ars": 2, "Borax": 2, "Bry": 2, "Calc": 2, "Caust": 2, "Graph": 2, "Kali-c": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Phos": 2, "Ran-b": 2, "Ran-s": 2, "Rhus-t": 2, "Rumex": 2, "Sabina": 2, "Sang": 2, "Spig": 2, "Squil": 2, "Sulph": 2 }
  },
  {
    id: "extremities_bruised",
    chapter: "Extremities & Joints",
    name: "Bruised",
    remedies: { "Apis": 2, "Arg-m": 2, "Arn": 2, "Asaf": 2, "Aur-m": 2, "Bapt": 2, "Bell": 2, "Berb": 2, "Bry": 2, "Canth": 2, "Caps": 2, "Carbo-v": 2, "Caust": 2, "Chna": 2, "Cimic": 2, "Cina": 2, "Con": 2, "Dros": 2, "Eup-per": 2, "Gels": 2, "Ham": 2, "Hep": 2, "Hyper": 2, "Kali-c": 2, "Kali-m": 2, "Lach": 2, "Lith-i": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Onos": 2, "Ox-ac": 2, "Ph-ac": 2, "Phos": 2, "Phyt": 2, "Plan": 2, "Plat": 2, "Puls": 2, "Pyr": 2, "Ran-b": 2, "Rhus-t": 2, "Ruta": 2, "Sil": 2, "Staph": 2, "Sulph": 2 }
  },
  {
    id: "urinary_calculi",
    chapter: "Urinary Organs",
    name: "Calculi",
    remedies: { "Bell": 2, "Benz-ac": 2, "Berb": 2, "Bry": 2, "Calc": 2, "Canth": 2, "Chion": 2, "Chna": 2, "Cocculus": 2, "Coloc": 2, "Dios": 2, "Dulc": 2, "Hydr": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Morg": 2, "Nux-v": 2, "Par": 2, "Podoph": 2, "Polyg": 2, "Puls": 2, "Sars": 2, "Sep": 2 }
  },
  {
    id: "respiration_chest_internal",
    chapter: "Respiration & Chest",
    name: "Chest, internal",
    remedies: { "Acon": 2, "Ant-t": 2, "Arn": 2, "Ars": 2, "Bry": 2, "Calc": 2, "Chel": 2, "Chna": 2, "Dulc": 2, "Ferr-p": 2, "Iod": 2, "Ipec": 2, "Kali-c": 2, "Lyc": 2, "Op": 2, "Phos": 2, "Puls": 2, "Ran-b": 2, "Rhus-t": 2, "Sang": 2, "Senec": 2, "Spig": 2, "Stann": 2, "Sulph": 2, "Tub": 2, "Verat-v": 2 }
  },
  {
    id: "skin_chilblains",
    chapter: "Skin & Eruptions",
    name: "Chilblains",
    remedies: { "Abrot": 2, "Agar": 2, "Apis": 2, "Ars": 2, "Borax": 2, "Calc": 2, "Calen": 2, "Canth": 2, "Carbo-an": 2, "Croto-t": 2, "Cycl": 2, "Ham": 2, "Hep": 2, "Lach": 2, "Led": 2, "Merc": 2, "Mur-ac": 2, "Nit-ac": 2, "Petr": 2, "Plan": 2, "Puls": 2, "Rhus-t": 2, "Sil": 2, "Sulph": 2, "Ter": 2, "Zinc": 2 }
  },
  {
    id: "clinical_children_infants",
    chapter: "Clinical Tiers (Peds/Geri/Vet)",
    name: "Children, infants",
    remedies: { "Acon": 2, "Ant-c": 2, "Ant-t": 2, "Bell": 2, "Borax": 2, "Calc": 2, "Calc-p": 2, "Cham": 2, "Cina": 2, "Coff": 2, "Ipec": 2, "Merc": 2, "Phyt": 2, "Podoph": 2, "Puls": 2, "Rheum": 2, "Sep": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "generalities_chilled_while_from_hot",
    chapter: "Generalities & Modalities",
    name: "Chilled, while from hot",
    remedies: { "Acon": 2, "Agar": 2, "Ars": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Brom": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Cham": 2, "Chna": 2, "Coff": 2, "Colch": 2, "Dulc": 2, "Ferr": 2, "Graph": 2, "Hep": 2, "Hyos": 2, "Ipec": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-s": 2, "Merc": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Pyr": 2, "Rhod": 2, "Rhus-t": 2, "Samb": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Sulph": 2, "Sulph-ac": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "fever,_chilly_cold",
    chapter: "Fever, Chill & Sweat",
    name: "Chilly, cold",
    remedies: { "Acon": 2, "Agar": 2, "Am-c": 2, "Ant-t": 2, "Arn": 2, "Ars": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calc-f": 2, "Calc-p": 2, "Camph": 2, "Caps": 2, "Carbo-an": 2, "Carbo-v": 2, "Caust": 2, "Chna": 2, "Cimic": 2, "Cocculus": 2, "Colch": 2, "Dulc": 2, "Echin": 2, "Eup-per": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hell": 2, "Hep": 2, "Hyper": 2, "Ign": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-p": 2, "Led": 2, "Lyc": 2, "Mag-c": 2, "Mag-p": 2, "Merc": 2, "Mez": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-m": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Rhod": 2, "Rhus-t": 2, "Rumex": 2, "Sabad": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Stann": 2, "Stront-br": 2, "Sulph": 2, "Verat": 2 }
  },
  {
    id: "generalities_chorea",
    chapter: "Generalities & Modalities",
    name: "Chorea",
    remedies: { "Agar": 2, "Arg-n": 2, "Ars": 2, "Asaf": 2, "Astra-mo": 2, "Bell": 2, "Bufo": 2, "Calc": 2, "Calc-p": 2, "Caust": 2, "Cham": 2, "Cic": 2, "Cimic": 2, "Cina": 2, "Cocculus": 2, "Con": 2, "Croc": 2, "Cupr": 2, "Hyos": 2, "Ign": 2, "Iod": 2, "Kali-br": 2, "Mag-p": 2, "Nat-m": 2, "Nux-v": 2, "Op": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Sep": 2, "Spig": 2, "Stram": 2, "Sulph": 2, "Sumb": 2, "Thuja": 2, "Verat-v": 2, "Visc": 2, "Zinc": 2 }
  },
  {
    id: "generalities_cloudy_weather_agg",
    chapter: "Generalities & Modalities",
    name: "Cloudy weather, agg.",
    remedies: { "Aloe": 2, "Am-c": 2, "Arn": 2, "Aur-m": 2, "Baryta-c": 2, "Cham": 2, "Chna": 2, "Hyper": 2, "Lach": 2, "Merc": 2, "Nux-m": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2 }
  },
  {
    id: "generalities_coated_furred_as_if",
    chapter: "Generalities & Modalities",
    name: "Coated, furred as if",
    remedies: { "Alum": 2, "Caust": 2, "Chna": 2, "Cocculus": 2, "Colch": 2, "Dig": 2, "Dros": 2, "Kali-c": 2, "Merc": 2, "Nux-m": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Verat": 2 }
  },
  {
    id: "generalities_cold_and_heat_agg",
    chapter: "Generalities & Modalities",
    name: "Cold and heat agg.",
    remedies: { "Ant-c": 2, "Calc": 2, "Caust": 2, "Ferr": 2, "Graph": 2, "Hell": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Mag-c": 2, "Merc": 2, "Nat-m": 2, "Ph-ac": 2, "Phos": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Sulph-ac": 2, "Syph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_cold_tendency_to_take",
    chapter: "Generalities & Modalities",
    name: "Cold, tendency to take",
    remedies: { "Acon": 2, "Alum": 2, "Baryta-c": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Carbo-v": 2, "Cham": 2, "Dulc": 2, "Hep": 2, "Kali-c": 2, "Kali-p": 2, "Lyc": 2, "Mag-c": 2, "Merc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Psor": 2, "Rhus-t": 2, "Rumex": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Tub": 2 }
  },
  {
    id: "fever,_coldness_chilliness_partiallocal",
    chapter: "Fever, Chill & Sweat",
    name: "Coldness, chilliness (Partial/local)",
    remedies: { "Ars": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Calen": 2, "Carbo-v": 2, "Chel": 2, "Chna": 2, "Cocculus": 2, "Colch": 2, "Dulc": 2, "Ign": 2, "Kali-c": 2, "Lach": 2, "Led": 2, "Lyc": 2, "Mez": 2, "Nat-m": 2, "Ph-ac": 2, "Plat": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Sulph": 2, "Verat": 2 }
  },
  {
    id: "abdomen_colic",
    chapter: "Abdomen & Liver",
    name: "Colic",
    remedies: { "Anac": 2, "Bell": 2, "Cact": 2, "Calc": 2, "Caust": 2, "Cham": 2, "Cina": 2, "Cocculus": 2, "Coloc": 2, "Con": 2, "Cupr": 2, "Dios": 2, "Dulc": 2, "Graph": 2, "Hyos": 2, "Ign": 2, "Lach": 2, "Lyc": 2, "Mag-p": 2, "Merc": 2, "Nit-ac": 2, "Nux-v": 2, "Plat": 2, "Rheum": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Stann": 2, "Staph": 2, "Sulph": 2, "Verat": 2 }
  },
  {
    id: "mind_company_worse",
    chapter: "Mind (Mental & Emotional)",
    name: "Company worse",
    remedies: { "Acon": 2, "Ambr": 2, "Anac": 2, "Ant-c": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Carbo-an": 2, "Cham": 2, "Gels": 2, "Ign": 2, "Lyc": 2, "Nat-c": 2, "Nat-m": 2, "Nux-v": 2, "Sep": 2, "Thuja": 2 }
  },
  {
    id: "mind_company_better",
    chapter: "Mind (Mental & Emotional)",
    name: "Company better",
    remedies: { "Arg-n": 2, "Ars": 2, "Dros": 2, "Hep": 2, "Hyos": 2, "Kali-c": 2, "Lyc": 2, "Phos": 2, "Stram": 2 }
  },
  {
    id: "rectum,_constipation",
    chapter: "Rectum, Stool & Bowels",
    name: "Constipation",
    remedies: { "Acon": 2, "Aesc": 2, "Agar": 2, "Aloe": 2, "Alum": 2, "Am-c": 2, "Am-m": 2, "Anac": 2, "Ant-c": 2, "Apis": 2, "Arn": 2, "Asar": 2, "Berb": 2, "Bry": 2, "Calc": 2, "Calc-f": 2, "Carb-ac": 2, "Caust": 2, "Chel": 2, "Chna": 2, "Coll": 2, "Croc": 2, "Euphr": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Guai": 2, "Hep": 2, "Hydr": 2, "Ign": 2, "Iod": 2, "Iris": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-m": 2, "Lach": 2, "Lil-t": 2, "Lyc": 2, "Mag-m": 2, "Mez": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Op": 2, "Petr": 2, "Phos": 2, "Plat": 2, "Plumb": 2, "Podoph": 2, "Psor": 2, "Pyr": 2, "Rat": 2, "Ruta": 2, "Sanic": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Staph": 2, "Sulph": 2, "Syph": 2, "Tab": 2, "Thuja": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "generalities_constriction_tight_band_cloths_etc",
    chapter: "Generalities & Modalities",
    name: "Constriction, tight band, cloths etc.",
    remedies: { "All-c": 2, "Alum": 2, "Anac": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Bell": 2, "Cact": 2, "Carbo-v": 2, "Chel": 2, "Chna": 2, "Cimic": 2, "Cocculus": 2, "Coloc": 2, "Con": 2, "Graph": 2, "Hyos": 2, "Ign": 2, "Lach": 2, "Lyc": 2, "Mag-p": 2, "Merc": 2, "Naja": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Plat": 2, "Puls": 2, "Rat": 2, "Rhus-t": 2, "Sel": 2, "Sil": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "nose_coryza_dry_stuffy_cold",
    chapter: "Nose & Coryza",
    name: "Coryza Dry, Stuffy cold",
    remedies: { "Acon": 2, "Am-c": 2, "Am-m": 2, "Anac": 2, "Ars": 2, "Arund": 2, "Aur-m": 2, "Calc": 2, "Camph": 2, "Caust": 2, "Cham": 2, "Con": 2, "Dulc": 2, "Graph": 2, "Hep": 2, "Iod": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-i": 2, "Lach": 2, "Lyc": 2, "Nat-c": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Petr": 2, "Puls": 2, "Sabad": 2, "Samb": 2, "Sep": 2, "Sil": 2, "Spong": 2, "Stict": 2 }
  },
  {
    id: "nose_coryza_fluent_running_cold",
    chapter: "Nose & Coryza",
    name: "Coryza fluent, running cold",
    remedies: { "Acon": 2, "Aesc": 2, "All-c": 2, "Am-m": 2, "Ars": 2, "Arund": 2, "Brom": 2, "Con": 2, "Eup-per": 2, "Euphr": 2, "Gels": 2, "Hydr": 2, "Iod": 2, "Ipec": 2, "Just": 2, "Kali-i": 2, "Kali-s": 2, "Merc": 2, "Merc-c": 2, "Nat-acet": 2, "Nat-m": 2, "Sang": 2, "Sil": 2 }
  },
  {
    id: "larynx,_cough",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough",
    remedies: { "Acon": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cina": 2, "Con": 2, "Dros": 2, "Hep": 2, "Hyos": 2, "Ign": 2, "Ipec": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Rumex": 2, "Sang": 2, "Sep": 2, "Spong": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "larynx,_cough_excited_from_larynx",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, excited from larynx",
    remedies: { "Acon": 2, "Calc": 2, "Cham": 2, "Con": 2, "Hep": 2, "Hyos": 2, "Ipec": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Nat-m": 2, "Nux-v": 2, "Phos": 2, "Rumex": 2, "Sang": 2, "Sep": 2, "Staph": 2 }
  },
  {
    id: "larynx,_cough_painful",
    chapter: "Larynx, Cough & Trachea",
    name: "Cough, painful",
    remedies: { "Acon": 2, "All-c": 2, "Arn": 2, "Bell": 2, "Bry": 2, "Caps": 2, "Caust": 2, "Dros": 2, "Eup-per": 2, "Kali-c": 2, "Nat-m": 2, "Nux-v": 2, "Phos": 2, "Rhus-t": 2, "Spong": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "larynx,_coughing",
    chapter: "Larynx, Cough & Trachea",
    name: "Coughing <",
    remedies: { "Acon": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Caps": 2, "Carbo-v": 2, "Caust": 2, "Cina": 2, "Dros": 2, "Ign": 2, "Ipec": 2, "Merc": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "rectum,_cracks_fissures_chaps",
    chapter: "Rectum, Stool & Bowels",
    name: "Cracks, Fissures, Chaps",
    remedies: { "Alum": 2, "Ant-c": 2, "Ant-t": 2, "Arund": 2, "Calc": 2, "Calc-f": 2, "Caust": 2, "Ferr": 2, "Graph": 2, "Hep": 2, "Ign": 2, "Kali-bi": 2, "Lyc": 2, "Merc": 2, "Merc-c": 2, "Mez": 2, "Nat-m": 2, "Nit-ac": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Rat": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "extremities_cramps",
    chapter: "Extremities & Joints",
    name: "Cramps",
    remedies: { "Abrot": 2, "Acon": 2, "Aesc": 2, "Agar": 2, "Am-m": 2, "Anac": 2, "Arn": 2, "Bapt": 2, "Baryta-c": 2, "Calc": 2, "Camph": 2, "Carbo-v": 2, "Caust": 2, "Chna": 2, "Cimic": 2, "Cocculus": 2, "Coloc": 2, "Con": 2, "Cupr": 2, "Ferr": 2, "Gels": 2, "Hyos": 2, "Hyper": 2, "Iris": 2, "Lyc": 2, "Mag-p": 2, "Med": 2, "Nit-ac": 2, "Nux-v": 2, "Ox-ac": 2, "Plumb": 2, "Puls": 2, "Rhus-t": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Verat": 2 }
  },
  {
    id: "generalities_dampness_getting_wet_wet_whether",
    chapter: "Generalities & Modalities",
    name: "Dampness, getting wet, wet whether",
    remedies: { "All-c": 2, "Alum": 2, "Am-c": 2, "Ant-c": 2, "Ant-t": 2, "Ars": 2, "Baryta-c": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Calc-s": 2, "Cham": 2, "Cimic": 2, "Colch": 2, "Dulc": 2, "Gels": 2, "Kali-m": 2, "Lyc": 2, "Mag-p": 2, "Med": 2, "Merc": 2, "Nat-c": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-m": 2, "Phos": 2, "Phyt": 2, "Psor": 2, "Puls": 2, "Pyr": 2, "Rhod": 2, "Rhus-t": 2, "Sabal": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Sulph": 2, "Tell": 2, "Thuja": 2, "Tub": 2 }
  },
  {
    id: "rectum,_diarrhoea",
    chapter: "Rectum, Stool & Bowels",
    name: "Diarrhoea",
    remedies: { "Acac": 2, "Acon": 2, "Aeth": 2, "Agar": 2, "Aloe": 2, "Ant-c": 2, "Ant-t": 2, "Apis": 2, "Aran": 2, "Arg-m": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Ars-i": 2, "Asaf": 2, "Bapt": 2, "Bell": 2, "Benz-ac": 2, "Bov": 2, "Bry": 2, "Cadm-s": 2, "Calc": 2, "Calc-p": 2, "Camph": 2, "Canth": 2, "Caps": 2, "Chna": 2, "Coloc": 2, "Croto-t": 2, "Cycl": 2, "Dulc": 2, "Echin": 2, "Ferr": 2, "Ferr-p": 2, "Flu-ac": 2, "Gels": 2, "Hell": 2, "Hep": 2, "Hyos": 2, "Iod": 2, "Ipec": 2, "Iris": 2, "Merc": 2, "Mur-ac": 2, "Nat-m": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Ol-an": 2, "Op": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Phys": 2, "Podoph": 2, "Psor": 2, "Puls": 2, "Rheum": 2, "Rhus-t": 2, "Rumex": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Sulph-ac": 2, "Thuja": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "generalities_discharges_loss_of",
    chapter: "Generalities & Modalities",
    name: "Discharges loss of, <",
    remedies: { "Acon": 2, "Agar": 2, "Calc": 2, "Calc-p": 2, "Carbo-v": 2, "Chin-s": 2, "Chna": 2, "Cimic": 2, "Graph": 2, "Ipec": 2, "Kali-c": 2, "Lach": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Sec": 2, "Sel": 2, "Sep": 2, "Staph": 2, "Verat": 2 }
  },
  {
    id: "generalities_discharges_onset_of",
    chapter: "Generalities & Modalities",
    name: "Discharges onset of, >",
    remedies: { "Ant-t": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Camph": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Colch": 2, "Cupr": 2, "Dulc": 2, "Gels": 2, "Hell": 2, "Ipec": 2, "Lach": 2, "Lyc": 2, "Mez": 2, "Nux-v": 2, "Op": 2, "Petr": 2, "Ph-ac": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Senec": 2, "Sep": 2, "Sil": 2, "Stict": 2, "Stram": 2, "Sulph": 2, "Thuja": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "generalities_discharge_thin_acrid",
    chapter: "Generalities & Modalities",
    name: "Discharge thin acrid",
    remedies: { "All-c": 2, "Am-c": 2, "Ars": 2, "Arund": 2, "Brom": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Colch": 2, "Euph": 2, "Graph": 2, "Hep": 2, "Hydr": 2, "Iod": 2, "Lyc": 2, "Med": 2, "Merc": 2, "Merc-c": 2, "Mez": 2, "Nit-ac": 2, "Phos": 2, "Rhus-t": 2, "Rob": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Sulph-ac": 2, "Thuja": 2, "Tub": 2 }
  },
  {
    id: "generalities_discharge_albuminous",
    chapter: "Generalities & Modalities",
    name: "Discharge albuminous",
    remedies: { "Alum": 2, "Am-m": 2, "Borax": 2, "Calc-p": 2, "Nat-m": 2, "Petr": 2, "Phyt": 2, "Seneg": 2, "Sep": 2, "Stann": 2 }
  },
  {
    id: "generalities_discharge_gelatinous",
    chapter: "Generalities & Modalities",
    name: "Discharge gelatinous",
    remedies: { "Aloe": 2, "Arg-n": 2, "Colch": 2, "Coloc": 2, "Dig": 2, "Hell": 2, "Kali-bi": 2, "Podoph": 2, "Rhus-t": 2, "Sel": 2, "Sep": 2 }
  },
  {
    id: "generalities_discharge_moistness_increased",
    chapter: "Generalities & Modalities",
    name: "Discharge moistness increased",
    remedies: { "Acac": 2, "All-c": 2, "Am-m": 2, "Ant-t": 2, "Arg-n": 2, "Ars": 2, "Calc": 2, "Carbo-v": 2, "Cham": 2, "Chna": 2, "Dulc": 2, "Euph": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hep": 2, "Hydr": 2, "Iod": 2, "Ipec": 2, "Kali-bi": 2, "Lach": 2, "Lyc": 2, "Med": 2, "Merc": 2, "Nat-m": 2, "Nat-s": 2, "Nux-v": 2, "Op": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Samb": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Stann": 2, "Sulph": 2, "Sulph-ac": 2, "Thuja": 2, "Verat": 2 }
  },
  {
    id: "generalities_discharge_purulent_green_yellow",
    chapter: "Generalities & Modalities",
    name: "Discharge purulent, green, yellow",
    remedies: { "Alum": 2, "Ars": 2, "Ars-i": 2, "Arund": 2, "Aur-m": 2, "Calc": 2, "Calc-s": 2, "Dulc": 2, "Hep": 2, "Hydr": 2, "Kali-bi": 2, "Kali-i": 2, "Kali-s": 2, "Lyc": 2, "Med": 2, "Merc": 2, "Merc-c": 2, "Nat-c": 2, "Nat-s": 2, "Nit-ac": 2, "Phos": 2, "Puls": 2, "Sep": 2, "Sil": 2, "Thuja": 2, "Tub": 2 }
  },
  {
    id: "generalities_discharge_secretion_altered",
    chapter: "Generalities & Modalities",
    name: "Discharge secretion altered",
    remedies: { "Ant-t": 2, "Arg-m": 2, "Arg-n": 2, "Ars": 2, "Calc": 2, "Calc-s": 2, "Caust": 2, "Cham": 2, "Graph": 2, "Hep": 2, "Hydr": 2, "Kali-bi": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Sep": 2, "Sil": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "generalities_discharge_thick",
    chapter: "Generalities & Modalities",
    name: "Discharge thick",
    remedies: { "Arg-m": 2, "Ars": 2, "Borax": 2, "Calc": 2, "Calc-s": 2, "Canth": 2, "Carbo-v": 2, "Con": 2, "Dulc": 2, "Graph": 2, "Hydr": 2, "Kali-bi": 2, "Kali-m": 2, "Merc": 2, "Nat-m": 2, "Psor": 2, "Puls": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "stomach_drinking_worse",
    chapter: "Stomach & Gastric",
    name: "Drinking, worse",
    remedies: { "Arg-n": 2, "Ars": 2, "Bell": 2, "Brom": 2, "Cadm-s": 2, "Calc": 2, "Canth": 2, "Chna": 2, "Cocculus": 2, "Ferr": 2, "Ign": 2, "Lach": 2, "Merc": 2, "Merc-c": 2, "Nux-v": 2, "Phos": 2, "Phyt": 2, "Podoph": 2, "Puls": 2, "Rhus-t": 2, "Sil": 2, "Stram": 2, "Sulph-ac": 2, "Verat": 2 }
  },
  {
    id: "stomach_drinking_better",
    chapter: "Stomach & Gastric",
    name: "Drinking, better",
    remedies: { "Bry": 2, "Caust": 2, "Cupr": 2, "Nux-v": 2, "Phos": 2, "Sep": 2, "Spong": 2 }
  },
  {
    id: "generalities_dry_weather_clear_cold_agg",
    chapter: "Generalities & Modalities",
    name: "Dry weather, clear & cold, agg.",
    remedies: { "Acon": 2, "Bry": 2, "Carbo-an": 2, "Caust": 2, "Cham": 2, "Hep": 2, "Ipec": 2, "Kali-c": 2, "Med": 2, "Nux-v": 2, "Samb": 2, "Sep": 2, "Spong": 2 }
  },
  {
    id: "skin_dryness_general",
    chapter: "Skin & Eruptions",
    name: "Dryness, general",
    remedies: { "Acon": 2, "Alum": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calen": 2, "Camph": 2, "Canth": 2, "Ferr": 2, "Graph": 2, "Iod": 2, "Lach": 2, "Lyc": 2, "Mag-m": 2, "Nat-m": 2, "Nat-s": 2, "Nux-m": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sang": 2, "Sec": 2, "Sep": 2, "Sulph": 2, "Tub": 2 }
  },
  {
    id: "generalities_dust_worse",
    chapter: "Generalities & Modalities",
    name: "Dust, worse",
    remedies: { "Am-c": 2, "Ars": 2, "Bell": 2, "Brom": 2, "Calc": 2, "Chel": 2, "Chna": 2, "Dros": 2, "Hep": 2, "Ign": 2, "Lyc": 2, "Ph-ac": 2, "Puls": 2, "Rumex": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "rectum,_dysentery",
    chapter: "Rectum, Stool & Bowels",
    name: "Dysentery",
    remedies: { "Acon": 2, "Aloe": 2, "Ant-t": 2, "Apis": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Bapt": 2, "Bell": 2, "Calc": 2, "Canth": 2, "Caps": 2, "Carbo-v": 2, "Chna": 2, "Colch": 2, "Coll": 2, "Coloc": 2, "Dulc": 2, "Ferr-p": 2, "Ham": 2, "Hep": 2, "Ipec": 2, "Iris": 2, "Kali-bi": 2, "Kali-m": 2, "Kali-p": 2, "Lach": 2, "Lept": 2, "Lil-t": 2, "Lyc": 2, "Mag-c": 2, "Merc": 2, "Merc-c": 2, "Nit-ac": 2, "Nux-v": 2, "Op": 2, "Ph-ac": 2, "Phos": 2, "Podoph": 2, "Puls": 2, "Rheum": 2, "Rhus-t": 2, "Sec": 2, "Verat": 2 }
  },
  {
    id: "ears_earache",
    chapter: "Ears & Hearing",
    name: "Earache",
    remedies: { "Acon": 2, "All-c": 2, "Anac": 2, "Apis": 2, "Bell": 2, "Borax": 2, "Caps": 2, "Cham": 2, "Chin-s": 2, "Chna": 2, "Coff": 2, "Dulc": 2, "Ferr": 2, "Gels": 2, "Glon": 2, "Hep": 2, "Iod": 2, "Kali-bi": 2, "Kali-i": 2, "Mag-p": 2, "Merc": 2, "Merc-c": 2, "Naja": 2, "Plan": 2, "Puls": 2, "Rhus-t": 2, "Sang": 2, "Sil": 2, "Spig": 2, "Ter": 2 }
  },
  {
    id: "ears_ears_affections_of",
    chapter: "Ears & Hearing",
    name: "Ears, affections of",
    remedies: { "Aur-m": 2, "Bell": 2, "Calc": 2, "Caps": 2, "Cham": 2, "Ferr": 2, "Graph": 2, "Hep": 2, "Lyc": 2, "Merc": 2, "Petr": 2, "Phos": 2, "Plan": 2, "Psor": 2, "Puls": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "stomach_eating_worse_after",
    chapter: "Stomach & Gastric",
    name: "Eating, worse after",
    remedies: { "Aeth": 2, "Aloe": 2, "Am-c": 2, "Anac": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Carbo-an": 2, "Carbo-v": 2, "Caust": 2, "Chna": 2, "Coloc": 2, "Con": 2, "Echin": 2, "Ferr": 2, "Hep": 2, "Ign": 2, "Kali-bi": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Mag-m": 2, "Merc": 2, "Nat-c": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Podoph": 2, "Puls": 2, "Rob": 2, "Rumex": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "stomach_eating_better_after",
    chapter: "Stomach & Gastric",
    name: "Eating, better after",
    remedies: { "Anac": 2, "Cham": 2, "Chel": 2, "Cimic": 2, "Con": 2, "Graph": 2, "Hep": 2, "Ign": 2, "Iod": 2, "Kali-bi": 2, "Kali-m": 2, "Lach": 2, "Nat-c": 2, "Nat-m": 2, "Phos": 2, "Psor": 2, "Rhod": 2, "Sep": 2, "Spong": 2, "Zinc": 2 }
  },
  {
    id: "stomach_eating_little",
    chapter: "Stomach & Gastric",
    name: "Eating, little <",
    remedies: { "Bry": 2, "Carbo-an": 2, "Chna": 2, "Con": 2, "Kali-c": 2, "Lyc": 2, "Nat-p": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Sulph": 2 }
  },
  {
    id: "stomach_eating_long_after",
    chapter: "Stomach & Gastric",
    name: "Eating, long after <",
    remedies: { "Aeth": 2, "Anac": 2, "Carbo-v": 2, "Ferr": 2, "Kali-bi": 2, "Nat-m": 2, "Phos": 2, "Puls": 2, "Sulph": 2, "Zinc": 2 }
  },
  {
    id: "generalities_emotions",
    chapter: "Generalities & Modalities",
    name: "Emotions <",
    remedies: { "Acon": 2, "Anac": 2, "Ant-c": 2, "Arg-n": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Bry": 2, "Caps": 2, "Caust": 2, "Cham": 2, "Cimic": 2, "Coff": 2, "Coloc": 2, "Con": 2, "Cupr": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hyos": 2, "Ign": 2, "Kali-c": 2, "Kali-i": 2, "Lach": 2, "Lyc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Op": 2, "Ph-ac": 2, "Phos": 2, "Plat": 2, "Psor": 2, "Puls": 2, "Sep": 2, "Sil": 2, "Staph": 2 }
  },
  {
    id: "stomach_eructation",
    chapter: "Stomach & Gastric",
    name: "Eructation <",
    remedies: { "Bry": 2, "Carbo-an": 2, "Carbo-v": 2, "Cham": 2, "Chna": 2, "Cocculus": 2, "Lach": 2, "Nux-v": 2, "Phos": 2, "Rhus-t": 2, "Sulph": 2 }
  },
  {
    id: "stomach_eructation",
    chapter: "Stomach & Gastric",
    name: "Eructation >",
    remedies: { "Ant-t": 2, "Arg-n": 2, "Carbo-v": 2, "Graph": 2, "Ign": 2, "Kali-bi": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Nux-v": 2, "Puls": 2, "Sang": 2 }
  },
  {
    id: "skin_eruptions",
    chapter: "Skin & Eruptions",
    name: "Eruptions",
    remedies: { "Acon": 2, "Ars": 2, "Baryta-c": 2, "Bell": 2, "Calc": 2, "Calc-s": 2, "Caust": 2, "Dulc": 2, "Graph": 2, "Kali-c": 2, "Kali-s": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Mez": 2, "Nat-m": 2, "Nit-ac": 2, "Petr": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "eyes_eyelids_affections_of",
    chapter: "Eyes & Vision",
    name: "Eyelids, affections of",
    remedies: { "Agar": 2, "Alum": 2, "Ant-c": 2, "Apis": 2, "Arg-n": 2, "Aur-m": 2, "Borax": 2, "Calc": 2, "Caust": 2, "Con": 2, "Dig": 2, "Dulc": 2, "Euphr": 2, "Gels": 2, "Graph": 2, "Hep": 2, "Kali-bi": 2, "Kali-c": 2, "Lyc": 2, "Merc": 2, "Nat-acet": 2, "Nat-m": 2, "Nux-m": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Spig": 2, "Staph": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "eyes_eyes_affections_of",
    chapter: "Eyes & Vision",
    name: "Eyes, affections of",
    remedies: { "Acon": 2, "Agar": 2, "All-c": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Bell": 2, "Calc": 2, "Caust": 2, "Euphr": 2, "Gels": 2, "Graph": 2, "Kali-bi": 2, "Kali-s": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Nat-s": 2, "Nux-v": 2, "Phos": 2, "Phys": 2, "Puls": 2, "Rhus-t": 2, "Ruta": 2, "Sep": 2, "Sulph": 2, "Symph": 2, "Thuja": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "mind_fearsome",
    chapter: "Mind (Mental & Emotional)",
    name: "Fearsome",
    remedies: { "Acon": 2, "Anac": 2, "Arg-m": 2, "Arn": 2, "Ars": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Borax": 2, "Bry": 2, "Cact": 2, "Calc": 2, "Calc-p": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cocculus": 2, "Con": 2, "Dig": 2, "Gels": 2, "Graph": 2, "Hyos": 2, "Ign": 2, "Iod": 2, "Kali-c": 2, "Kali-p": 2, "Kali-s": 2, "Lyc": 2, "Med": 2, "Merc-c": 2, "Mez": 2, "Nat-c": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-m": 2, "Nux-v": 2, "Op": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Plat": 2, "Psor": 2, "Puls": 2, "Rat": 2, "Rhus-t": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Spong": 2, "Stram": 2, "Sulph": 2, "Tub": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "male_female_sex_organs",
    chapter: "Male & Female Genitalia",
    name: "Female sex organs",
    remedies: { "Ambr": 2, "Apis": 2, "Arn": 2, "Astra-mo": 2, "Bell": 2, "Calc": 2, "Calen": 2, "Caul": 2, "Caust": 2, "Cham": 2, "Cimic": 2, "Con": 2, "Eup-pur": 2, "Ferr": 2, "Graph": 2, "Heln-ov": 2, "Kali-c": 2, "Kreos": 2, "Lach": 2, "Lil-t": 2, "Lyc": 2, "Mag-m": 2, "Murx": 2, "Nat-m": 2, "Nux-v": 2, "Onos": 2, "Pall": 2, "Phos": 2, "Plat": 2, "Puls": 2, "Sabal": 2, "Sabina": 2, "Sec": 2, "Senec": 2, "Sep": 2, "Sulph": 2, "Thuja": 2, "Trill": 2, "Ust": 2, "Vib": 2, "Visc": 2 }
  },
  {
    id: "fever,_fever_heat",
    chapter: "Fever, Chill & Sweat",
    name: "Fever, heat",
    remedies: { "Acon": 2, "Aloe": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Arund": 2, "Bapt": 2, "Bell": 2, "Bry": 2, "Cact": 2, "Canth": 2, "Caps": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Chin-s": 2, "Chna": 2, "Con": 2, "Echin": 2, "Eup-per": 2, "Euph": 2, "Ferr-p": 2, "Gels": 2, "Graph": 2, "Ign": 2, "Iod": 2, "Ipec": 2, "Kali-s": 2, "Lach": 2, "Lyc": 2, "Mag-m": 2, "Med": 2, "Merc": 2, "Merc-c": 2, "Mez": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Op": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Pyr": 2, "Rat": 2, "Rhus-t": 2, "Sang": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Spong": 2, "Stann": 2, "Stram": 2, "Sulph": 2, "Tub": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "rectum,_fissures_anus",
    chapter: "Rectum, Stool & Bowels",
    name: "Fissures, (anus)",
    remedies: { "Aesc": 2, "Agar": 2, "Aloe": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Calc-f": 2, "Carbo-v": 2, "Caust": 2, "Con": 2, "Graph": 2, "Ham": 2, "Hydr": 2, "Ign": 2, "Iris": 2, "Kali-i": 2, "Lach": 2, "Led": 2, "Merc": 2, "Nat-m": 2, "Nit-ac": 2, "Petr": 2, "Phos": 2, "Phyt": 2, "Plat": 2, "Plumb": 2, "Rat": 2, "Rhus-t": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Syph": 2, "Thuja": 2 }
  },
  {
    id: "abdomen_flatulence",
    chapter: "Abdomen & Liver",
    name: "Flatulence",
    remedies: { "Agar": 2, "Ant-c": 2, "Arg-n": 2, "Asaf": 2, "Brom": 2, "Calc": 2, "Calc-f": 2, "Caps": 2, "Carb-ac": 2, "Carbo-v": 2, "Chna": 2, "Coloc": 2, "Cycl": 2, "Dios": 2, "Graph": 2, "Hydr": 2, "Ign": 2, "Iod": 2, "Kali-bi": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Nux-m": 2, "Nux-v": 2, "Ox-ac": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Sil": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "stomach_food_fatty",
    chapter: "Stomach & Gastric",
    name: "Food, fatty <",
    remedies: { "Ant-c": 2, "Ars": 2, "Calc": 2, "Carbo-v": 2, "Chna": 2, "Ferr": 2, "Graph": 2, "Kali-m": 2, "Lyc": 2, "Puls": 2, "Rob": 2 }
  },
  {
    id: "stomach_food_drink_cold",
    chapter: "Stomach & Gastric",
    name: "Food & drink, cold <",
    remedies: { "Ars": 2, "Bell": 2, "Calc": 2, "Canth": 2, "Caps": 2, "Cham": 2, "Chel": 2, "Chna": 2, "Dulc": 2, "Ferr": 2, "Hep": 2, "Kali-m": 2, "Kreos": 2, "Lach": 2, "Lyc": 2, "Nux-v": 2, "Rhus-t": 2, "Sabad": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph-ac": 2, "Verat": 2 }
  },
  {
    id: "stomach_food_drink_cold",
    chapter: "Stomach & Gastric",
    name: "Food & drink, cold >",
    remedies: { "Apis": 2, "Arg-n": 2, "Bell": 2, "Bry": 2, "Canth": 2, "Caust": 2, "Cupr": 2, "Ign": 2, "Lach": 2, "Phos": 2, "Phyt": 2, "Puls": 2, "Sang": 2, "Sep": 2 }
  },
  {
    id: "generalities_hairs_falling_off",
    chapter: "Generalities & Modalities",
    name: "Hairs falling off",
    remedies: { "Alum": 2, "Am-c": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Calc": 2, "Canth": 2, "Carbo-v": 2, "Dulc": 2, "Graph": 2, "Hep": 2, "Kali-c": 2, "Kali-m": 2, "Kali-s": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Mez": 2, "Nat-m": 2, "Nit-ac": 2, "Ph-ac": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Thuja": 2, "Tub": 2 }
  },
  {
    id: "generalities_hard_bed_sensation",
    chapter: "Generalities & Modalities",
    name: "Hard bed (Sensation)",
    remedies: { "Arn": 2, "Bapt": 2, "Con": 2, "Dros": 2, "Gels": 2, "Kali-c": 2, "Nux-v": 2, "Phos": 2, "Plat": 2, "Pyr": 2, "Rhus-t": 2, "Sil": 2 }
  },
  {
    id: "vertigo_head_external_scalp_bones_etc",
    chapter: "Vertigo & Head",
    name: "Head, external scalp, bones etc",
    remedies: { "Acon": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Carbo-v": 2, "Chna": 2, "Gels": 2, "Glon": 2, "Ign": 2, "Lach": 2, "Lachn": 2, "Lyc": 2, "Nat-m": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Rob": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Sulph": 2, "Tub": 2 }
  },
  {
    id: "vertigo_headache",
    chapter: "Vertigo & Head",
    name: "Headache",
    remedies: { "Agar": 2, "All-c": 2, "Aloe": 2, "Am-c": 2, "Anac": 2, "Ant-c": 2, "Arg-n": 2, "Ars": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Bry": 2, "Cact": 2, "Calc": 2, "Calc-f": 2, "Carbo-an": 2, "Chna": 2, "Cocculus": 2, "Coff": 2, "Cycl": 2, "Eup-per": 2, "Ferr-p": 2, "Gels": 2, "Glon": 2, "Hyper": 2, "Ign": 2, "Kali-bi": 2, "Kalm": 2, "Kreos": 2, "Lach": 2, "Lil-t": 2, "Mag-m": 2, "Mag-p": 2, "Med": 2, "Meny": 2, "Mez": 2, "Nat-acet": 2, "Nat-c": 2, "Nat-m": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Phyt": 2, "Pic-ac": 2, "Plat": 2, "Podoph": 2, "Psor": 2, "Rhus-t": 2, "Sabad": 2, "Sang": 2, "Sars": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Stann": 2, "Sulph": 2, "Sulph-ac": 2, "Syph": 2, "Thuja": 2, "Tub": 2 }
  },
  {
    id: "generalities_healing_slow",
    chapter: "Generalities & Modalities",
    name: "Healing, slow",
    remedies: { "Arn": 2, "Ars": 2, "Borax": 2, "Calc": 2, "Cham": 2, "Con": 2, "Graph": 2, "Hep": 2, "Kali-bi": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Petr": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "respiration_heart_affections_of",
    chapter: "Respiration & Chest",
    name: "Heart, affections of",
    remedies: { "Acon": 2, "Agar": 2, "Am-c": 2, "Am-m": 2, "Aml-n": 2, "Arn": 2, "Ars": 2, "Ars-i": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Benz-ac": 2, "Bov": 2, "Brom": 2, "Bry": 2, "Cact": 2, "Calc": 2, "Calc-f": 2, "Calc-s": 2, "Carbo-v": 2, "Chin-s": 2, "Chna": 2, "Cimic": 2, "Colch": 2, "Coll": 2, "Cycl": 2, "Dig": 2, "Ferr-p": 2, "Gels": 2, "Glon": 2, "Ign": 2, "Iod": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-p": 2, "Kali-s": 2, "Kalm": 2, "Lach": 2, "Lil-t": 2, "Lyc": 2, "Mag-m": 2, "Med": 2, "Merc-c": 2, "Mur-ac": 2, "Naja": 2, "Nat-acet": 2, "Nat-m": 2, "Nat-p": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Ox-ac": 2, "Phos": 2, "Psor": 2, "Spig": 2, "Spong": 2, "Staph": 2 }
  },
  {
    id: "respiration_heart_circulation_pulse",
    chapter: "Respiration & Chest",
    name: "Heart, circulation, pulse",
    remedies: { "Acon": 2, "Am-c": 2, "Am-m": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Bov": 2, "Bry": 2, "Cact": 2, "Calc": 2, "Carbo-v": 2, "Chna": 2, "Coll": 2, "Dig": 2, "Echin": 2, "Ferr": 2, "Glon": 2, "Iod": 2, "Kali-c": 2, "Kali-m": 2, "Lach": 2, "Lyc": 2, "Naja": 2, "Nat-m": 2, "Phos": 2, "Puls": 2, "Sabad": 2, "Sep": 2, "Spig": 2, "Spong": 2, "Sulph": 2, "Verat": 2, "Verat-v": 2, "Zinc": 2 }
  },
  {
    id: "generalities_heat_fire_sun_etc",
    chapter: "Generalities & Modalities",
    name: "Heat, fire, sun etc. <",
    remedies: { "Acon": 2, "Ant-c": 2, "Bell": 2, "Bov": 2, "Bry": 2, "Camph": 2, "Carbo-v": 2, "Gels": 2, "Glon": 2, "Hyos": 2, "Iod": 2, "Ipec": 2, "Kali-c": 2, "Kali-s": 2, "Lach": 2, "Merc": 2, "Nat-c": 2, "Nat-m": 2, "Nux-v": 2, "Op": 2, "Puls": 2, "Rat": 2, "Samb": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Verat-v": 2, "Zinc": 2 }
  },
  {
    id: "generalities_here_there_shifting_pains",
    chapter: "Generalities & Modalities",
    name: "Here & there, shifting pains",
    remedies: { "Acon": 2, "Agar": 2, "Am-c": 2, "Aur-m": 2, "Baryta-c": 2, "Calc": 2, "Chel": 2, "Chna": 2, "Cimic": 2, "Cina": 2, "Cocculus": 2, "Graph": 2, "Ign": 2, "Lyc": 2, "Mag-c": 2, "Mag-p": 2, "Op": 2, "Ph-ac": 2, "Phos": 2, "Rat": 2, "Rhus-t": 2, "Sil": 2, "Stann": 2, "Staph": 2, "Sulph": 2, "Thuja": 2, "Verat-v": 2, "Zinc": 2 }
  },
  {
    id: "generalities_herpes",
    chapter: "Generalities & Modalities",
    name: "Herpes",
    remedies: { "Apis": 2, "Arg-n": 2, "Ars": 2, "Astra-mo": 2, "Canth": 2, "Caust": 2, "Cedr": 2, "Cist": 2, "Croto-t": 2, "Dulc": 2, "Graph": 2, "Grin": 2, "Hyper": 2, "Iris": 2, "Kali-acet": 2, "Kalm": 2, "Merc": 2, "Mez": 2, "Staph": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "larynx,_hoarseness",
    chapter: "Larynx, Cough & Trachea",
    name: "Hoarseness",
    remedies: { "Acon": 2, "Alum": 2, "Am-c": 2, "Am-m": 2, "Ant-c": 2, "Arg-m": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Arund": 2, "Baryta-c": 2, "Bell": 2, "Brom": 2, "Bry": 2, "Calc": 2, "Camph": 2, "Caust": 2, "Cham": 2, "Cina": 2, "Cocculus": 2, "Dros": 2, "Dulc": 2, "Eup-per": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hep": 2, "Hyos": 2, "Ign": 2, "Iod": 2, "Ipec": 2, "Just": 2, "Kali-bi": 2, "Kali-c": 2, "Kreos": 2, "Mag-p": 2, "Merc": 2, "Nit-ac": 2, "Nux-m": 2, "Nux-v": 2, "Op": 2, "Ox-ac": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Rumex": 2, "Samb": 2, "Sang": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Spong": 2, "Stann": 2, "Stict": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_humid_warm_wet_weather",
    chapter: "Generalities & Modalities",
    name: "Humid, warm wet weather",
    remedies: { "Aloe": 2, "Ars": 2, "Bapt": 2, "Brom": 2, "Bry": 2, "Carbo-v": 2, "Gels": 2, "Iod": 2, "Ipec": 2, "Kali-bi": 2, "Lach": 2, "Nat-m": 2, "Nat-s": 2, "Puls": 2, "Rhus-t": 2, "Sil": 2, "Verat": 2 }
  },
  {
    id: "male_impotence",
    chapter: "Male & Female Genitalia",
    name: "Impotence",
    remedies: { "Agar": 2, "Anac": 2, "Ant-c": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Baryta-c": 2, "Berb": 2, "Calc": 2, "Calen": 2, "Camph": 2, "Chin-s": 2, "Chna": 2, "Dig": 2, "Dios": 2, "Gels": 2, "Graph": 2, "Hyper": 2, "Ign": 2, "Iod": 2, "Kali-bi": 2, "Kali-i": 2, "Lyc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Onos": 2, "Ph-ac": 2, "Phos": 2, "Pic-ac": 2, "Sabad": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "generalities_inactive_lies_down",
    chapter: "Generalities & Modalities",
    name: "Inactive, lies down",
    remedies: { "Acon": 2, "Alum": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Bapt": 2, "Calc": 2, "Calen": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Chel": 2, "Chna": 2, "Con": 2, "Cupr": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hell": 2, "Kali-c": 2, "Lach": 2, "Mur-ac": 2, "Nux-v": 2, "Op": 2, "Ph-ac": 2, "Phos": 2, "Pic-ac": 2, "Psor": 2, "Ruta": 2, "Sang": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Stram": 2, "Sulph": 2, "Sulph-ac": 2, "Zinc": 2 }
  },
  {
    id: "stomach_indigestion",
    chapter: "Stomach & Gastric",
    name: "Indigestion",
    remedies: { "Abrot": 2, "Acac": 2, "Aesc": 2, "Aeth": 2, "Agar": 2, "Aloe": 2, "Alum": 2, "Am-c": 2, "Ant-c": 2, "Ant-t": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Bapt": 2, "Baryta-c": 2, "Bell": 2, "Bism": 2, "Brom": 2, "Bry": 2, "Calc": 2, "Caps": 2, "Carb-ac": 2, "Carbo-v": 2, "Card-m": 2, "Chel": 2, "Chna": 2, "Cina": 2, "Cocculus": 2, "Ign": 2, "Iod": 2, "Ipec": 2, "Iris": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-m": 2, "Lach": 2, "Lept": 2, "Lyc": 2, "Merc": 2, "Nat-c": 2, "Nat-m": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-m": 2, "Nux-v": 2, "Op": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Pic-ac": 2, "Podoph": 2, "Puls": 2, "Rob": 2, "Sang": 2, "Sep": 2, "Stann": 2, "Sulph": 2, "Sulph-ac": 2 }
  },
  {
    id: "generalities_inflammation",
    chapter: "Generalities & Modalities",
    name: "Inflammation",
    remedies: { "Abrot": 2, "Acon": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Canch": 2, "Chel": 2, "Chna": 2, "Ferr-p": 2, "Gels": 2, "Hep": 2, "Iod": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-i": 2, "Kali-m": 2, "Kali-s": 2, "Puls": 2, "Sulph": 2, "Verat-v": 2 }
  },
  {
    id: "generalities_injuries",
    chapter: "Generalities & Modalities",
    name: "Injuries",
    remedies: { "All-c": 2, "Arn": 2, "Calc": 2, "Calen": 2, "Cic": 2, "Con": 2, "Glon": 2, "Ham": 2, "Hep": 2, "Hyper": 2, "Kali-i": 2, "Lach": 2, "Led": 2, "Lith-i": 2, "Nat-s": 2, "Nit-ac": 2, "Puls": 2, "Rhus-t": 2, "Ruta": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Sulph-ac": 2, "Symph": 2 }
  },
  {
    id: "skin_itching",
    chapter: "Skin & Eruptions",
    name: "Itching",
    remedies: { "Acon": 2, "Agar": 2, "Alum": 2, "Anac": 2, "Ant-c": 2, "Apis": 2, "Ars": 2, "Arund": 2, "Bov": 2, "Bry": 2, "Calc": 2, "Calen": 2, "Carbo-v": 2, "Caust": 2, "Chel": 2, "Coff": 2, "Con": 2, "Ferr": 2, "Graph": 2, "Hyos": 2, "Iod": 2, "Lyc": 2, "Mag-c": 2, "Merc": 2, "Mez": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Op": 2, "Petr": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Rumex": 2, "Sang": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Spong": 2, "Staph": 2, "Sulph": 2, "Sumb": 2, "Tarent": 2, "Teucr": 2, "Thuja": 2 }
  },
  {
    id: "extremities_joint_painful",
    chapter: "Extremities & Joints",
    name: "Joint Painful",
    remedies: { "Arg-m": 2, "Arn": 2, "Aur-m": 2, "Bell": 2, "Benz-ac": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Caul": 2, "Caust": 2, "Cham": 2, "Cimic": 2, "Colch": 2, "Dros": 2, "Dulc": 2, "Graph": 2, "Kali-bi": 2, "Kali-m": 2, "Led": 2, "Lith-i": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Nux-v": 2, "Phyt": 2, "Puls": 2, "Rhus-t": 2, "Ruta": 2, "Sabina": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph": 2 }
  },
  {
    id: "larynx,_larynx_trachea",
    chapter: "Larynx, Cough & Trachea",
    name: "Larynx & trachea",
    remedies: { "Acon": 2, "All-c": 2, "Arg-m": 2, "Bell": 2, "Brom": 2, "Caust": 2, "Dros": 2, "Hep": 2, "Iod": 2, "Kali-bi": 2, "Lach": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Rumex": 2, "Sel": 2, "Spong": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "generalities_lethargic",
    chapter: "Generalities & Modalities",
    name: "Lethargic",
    remedies: { "Acon": 2, "Alum": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Bapt": 2, "Calc": 2, "Calen": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Chel": 2, "Chna": 2, "Con": 2, "Cupr": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hell": 2, "Kali-acet": 2, "Kali-c": 2, "Lach": 2, "Mur-ac": 2, "Nux-v": 2, "Op": 2, "Ph-ac": 2, "Phos": 2, "Pic-ac": 2, "Psor": 2, "Rad-br": 2, "Ruta": 2, "Sang": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Stram": 2, "Sulph": 2, "Sulph-ac": 2, "Tarent": 2, "Zinc": 2 }
  },
  {
    id: "extremities_limbs_upper",
    chapter: "Extremities & Joints",
    name: "Limbs upper",
    remedies: { "Am-m": 2, "Ars": 2, "Bell": 2, "Calc": 2, "Caust": 2, "Cocculus": 2, "Ferr": 2, "Kali-c": 2, "Lyc": 2, "Merc": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "extremities_limbs_lower",
    chapter: "Extremities & Joints",
    name: "Limbs lower",
    remedies: { "Alum": 2, "Ars": 2, "Bell": 2, "Calc": 2, "Caust": 2, "Graph": 2, "Kali-c": 2, "Led": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Nux-v": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Zinc": 2 }
  },
  {
    id: "abdomen_liver_affections_of",
    chapter: "Abdomen & Liver",
    name: "Liver, affections of",
    remedies: { "Acon": 2, "Aloe": 2, "Am-c": 2, "Am-m": 2, "Ars": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Berb": 2, "Bry": 2, "Calc": 2, "Chel": 2, "Chna": 2, "Cocculus": 2, "Colch": 2, "Dios": 2, "Gels": 2, "Hydr": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Mag-m": 2, "Merc": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-m": 2, "Nux-v": 2, "Phos": 2, "Podoph": 2, "Rheum": 2, "Sang": 2, "Sep": 2, "Sulph": 2 }
  },
  {
    id: "back_lumbar_region",
    chapter: "Back & Spine",
    name: "Lumbar region",
    remedies: { "Alum": 2, "Ant-t": 2, "Arg-m": 2, "Ars": 2, "Baryta-c": 2, "Berb": 2, "Bry": 2, "Calc": 2, "Canth": 2, "Caust": 2, "Chna": 2, "Cimic": 2, "Dulc": 2, "Euph": 2, "Graph": 2, "Kali-c": 2, "Led": 2, "Nux-m": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sulph": 2 }
  },
  {
    id: "generalities_lying_worse",
    chapter: "Generalities & Modalities",
    name: "Lying, worse",
    remedies: { "Ambr": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Caps": 2, "Cham": 2, "Con": 2, "Dros": 2, "Dulc": 2, "Ferr": 2, "Hyos": 2, "Kali-c": 2, "Lyc": 2, "Meny": 2, "Merc": 2, "Nat-s": 2, "Phos": 2, "Plat": 2, "Puls": 2, "Rhus-t": 2, "Rumex": 2, "Ruta": 2, "Samb": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Stront-br": 2 }
  },
  {
    id: "generalities_lying_better",
    chapter: "Generalities & Modalities",
    name: "Lying, better",
    remedies: { "Am-m": 2, "Arn": 2, "Asar": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Cham": 2, "Coloc": 2, "Ferr": 2, "Ign": 2, "Mang": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Pic-ac": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Squil": 2, "Stann": 2 }
  },
  {
    id: "abdomen_lying_on_abdomen",
    chapter: "Abdomen & Liver",
    name: "Lying, on abdomen >",
    remedies: { "Acac": 2, "Bell": 2, "Calc-p": 2, "Chel": 2, "Cina": 2, "Coloc": 2, "Euph": 2, "Lach": 2, "Med": 2, "Nit-ac": 2, "Phos": 2, "Podoph": 2, "Psor": 2, "Sep": 2, "Stann": 2, "Stram": 2 }
  },
  {
    id: "back_lying_on_back",
    chapter: "Back & Spine",
    name: "Lying, on back <",
    remedies: { "Acon": 2, "Am-m": 2, "Arg-m": 2, "Ars": 2, "Cact": 2, "Caust": 2, "Cham": 2, "Cocculus": 2, "Colch": 2, "Coloc": 2, "Cupr": 2, "Ign": 2, "Iod": 2, "Kali-n": 2, "Lept": 2, "Merc-i-f": 2, "Nat-s": 2, "Nux-v": 2, "Op": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Sulph": 2 }
  },
  {
    id: "generalities_lying_on_sides",
    chapter: "Generalities & Modalities",
    name: "Lying, on sides",
    remedies: { "Acon": 2, "Am-m": 2, "Anac": 2, "Arg-m": 2, "Baryta-c": 2, "Bry": 2, "Calc": 2, "Calen": 2, "Carbo-an": 2, "Cina": 2, "Con": 2, "Dig": 2, "Ferr": 2, "Ign": 2, "Ipec": 2, "Kali-c": 2, "Kreos": 2, "Lyc": 2, "Merc": 2, "Merc-c": 2, "Nat-s": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Ruta": 2, "Sang": 2, "Seneg": 2, "Sil": 2, "Stann": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_lying_on_right_side",
    chapter: "Generalities & Modalities",
    name: "Lying, on right side <",
    remedies: { "Alum": 2, "Am-c": 2, "Am-m": 2, "Arg-n": 2, "Benz-ac": 2, "Borax": 2, "Calc": 2, "Caust": 2, "Hydr": 2, "Ign": 2, "Iris": 2, "Lil-t": 2, "Mag-m": 2, "Mag-p": 2, "Merc": 2, "Mur-ac": 2, "Nux-v": 2, "Phos": 2, "Phyt": 2, "Rumex": 2, "Spong": 2, "Stann": 2 }
  },
  {
    id: "generalities_lying_on_left_side",
    chapter: "Generalities & Modalities",
    name: "Lying, on left side <",
    remedies: { "Acon": 2, "Am-c": 2, "Ant-t": 2, "Apis": 2, "Arg-n": 2, "Baryta-c": 2, "Bry": 2, "Cact": 2, "Carbo-an": 2, "Colch": 2, "Dig": 2, "Ipec": 2, "Kali-c": 2, "Kali-m": 2, "Lil-t": 2, "Lyc": 2, "Naja": 2, "Nat-c": 2, "Nat-m": 2, "Nat-s": 2, "Petr": 2, "Phos": 2, "Ptel": 2, "Puls": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Tab": 2, "Thuja": 2, "Tub": 2 }
  },
  {
    id: "vertigo_lying_head_low",
    chapter: "Vertigo & Head",
    name: "Lying, head low <",
    remedies: { "Ant-t": 2, "Apis": 2, "Arg-m": 2, "Ars": 2, "Bell": 2, "Cact": 2, "Caps": 2, "Chna": 2, "Colch": 2, "Con": 2, "Gels": 2, "Glon": 2, "Hep": 2, "Kali-c": 2, "Kali-n": 2, "Lach": 2, "Puls": 2, "Samb": 2, "Sang": 2, "Spig": 2, "Spong": 2 }
  },
  {
    id: "male_male_sex_organs",
    chapter: "Male & Female Genitalia",
    name: "Male sex organs",
    remedies: { "Arg-n": 2, "Aur-m": 2, "Calen": 2, "Canch": 2, "Canth": 2, "Cinnb": 2, "Clem": 2, "Con": 2, "Graph": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Nux-v": 2, "Ol-an": 2, "Phos": 2, "Plat": 2, "Puls": 2, "Rhod": 2, "Rhus-t": 2, "Spong": 2, "Staph": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_memory_affected",
    chapter: "Generalities & Modalities",
    name: "Memory affected",
    remedies: { "Anac": 2, "Arn": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Calc": 2, "Canch": 2, "Con": 2, "Hell": 2, "Hyos": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Nux-m": 2, "Op": 2, "Ph-ac": 2, "Rhod": 2, "Staph": 2, "Sulph": 2, "Syph": 2 }
  },
  {
    id: "male_menses_worse_during",
    chapter: "Male & Female Genitalia",
    name: "Menses worse during",
    remedies: { "Acon": 2, "Agar": 2, "Am-c": 2, "Arg-n": 2, "Bov": 2, "Calc": 2, "Car": 2, "Caust": 2, "Cham": 2, "Cimic": 2, "Cocculus": 2, "Graph": 2, "Hyos": 2, "Ign": 2, "Kali-c": 2, "Lac-c": 2, "Mag-c": 2, "Mag-m": 2, "Nux-m": 2, "Nux-v": 2, "Phos": 2, "Plat": 2, "Puls": 2, "Sec": 2, "Sep": 2, "Staph": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "male_menstrual_disturbances",
    chapter: "Male & Female Genitalia",
    name: "Menstrual disturbances",
    remedies: { "Acon": 2, "Bell": 2, "Borax": 2, "Calc": 2, "Cham": 2, "Cocculus": 2, "Ferr": 2, "Graph": 2, "Ipec": 2, "Kali-c": 2, "Kali-m": 2, "Kreos": 2, "Lach": 2, "Lachn": 2, "Lil-t": 2, "Lith-i": 2, "Lyc": 2, "Mag-c": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-m": 2, "Nux-v": 2, "Phos": 2, "Plat": 2, "Puls": 2, "Sabina": 2, "Sec": 2, "Sep": 2, "Staph": 2, "Stram": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "generalities_mental_exertion",
    chapter: "Generalities & Modalities",
    name: "Mental exertion <",
    remedies: { "Anac": 2, "Arg-m": 2, "Arg-n": 2, "Aur-m": 2, "Calc": 2, "Calc-p": 2, "Ign": 2, "Kali-p": 2, "Lach": 2, "Lyc": 2, "Nat-c": 2, "Nat-m": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Pic-ac": 2, "Puls": 2, "Rhus-t": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph": 2 }
  },
  {
    id: "vertigo_migraine",
    chapter: "Vertigo & Head",
    name: "Migraine",
    remedies: { "Arg-n": 2, "Ars": 2, "Bry": 2, "Calc": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cocculus": 2, "Coloc": 2, "Gels": 2, "Ign": 2, "Ipec": 2, "Iris": 2, "Kali-bi": 2, "Kali-m": 2, "Mag-p": 2, "Mez": 2, "Nat-m": 2, "Nat-s": 2, "Nux-v": 2, "Onos": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Rob": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Spig": 2 }
  },
  {
    id: "generalities_moistness_increased",
    chapter: "Generalities & Modalities",
    name: "Moistness increased",
    remedies: { "Acac": 2, "All-c": 2, "Am-m": 2, "Ant-t": 2, "Arg-m": 2, "Ars": 2, "Calc": 2, "Carbo-v": 2, "Cham": 2, "Chna": 2, "Dulc": 2, "Euph": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hep": 2, "Hydr": 2, "Iod": 2, "Ipec": 2, "Kali-bi": 2, "Kali-i": 2, "Lach": 2, "Lyc": 2, "Med": 2, "Merc": 2, "Nat-m": 2, "Nat-s": 2, "Nux-v": 2, "Ol-an": 2, "Op": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Samb": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Squil": 2, "Stann": 2, "Sulph": 2, "Sulph-ac": 2, "Thuja": 2, "Verat": 2 }
  },
  {
    id: "generalities_morning_evening",
    chapter: "Generalities & Modalities",
    name: "Morning & evening <",
    remedies: { "Alum": 2, "Bov": 2, "Calc": 2, "Caust": 2, "Colch": 2, "Graph": 2, "Hep": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Nat-m": 2, "Phos": 2, "Psor": 2, "Rhus-t": 2, "Sang": 2, "Sep": 2, "Stram": 2, "Stront-br": 2, "Thuja": 2, "Verat": 2 }
  },
  {
    id: "generalities_motion_worse",
    chapter: "Generalities & Modalities",
    name: "Motion, worse",
    remedies: { "Aesc": 2, "Arn": 2, "Bell": 2, "Bry": 2, "Cadm-s": 2, "Calc": 2, "Calc-s": 2, "Calen": 2, "Caust": 2, "Chel": 2, "Chna": 2, "Cocculus": 2, "Colch": 2, "Coloc": 2, "Con": 2, "Glon": 2, "Kali-c": 2, "Kali-m": 2, "Led": 2, "Merc": 2, "Nat-acet": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Phyt": 2, "Pic-ac": 2, "Podoph": 2, "Pyr": 2, "Rad-br": 2, "Ran-b": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Stann": 2, "Sulph": 2, "Tarent": 2, "Tub": 2 }
  },
  {
    id: "generalities_motion_amelioration",
    chapter: "Generalities & Modalities",
    name: "Motion, amelioration",
    remedies: { "Ant-t": 2, "Arg-m": 2, "Arg-n": 2, "Ars": 2, "Aur-m": 2, "Caps": 2, "Con": 2, "Cycl": 2, "Dulc": 2, "Euph": 2, "Ferr": 2, "Flu-ac": 2, "Gels": 2, "Iod": 2, "Kali-c": 2, "Kali-i": 2, "Kali-s": 2, "Kreos": 2, "Lil-t": 2, "Lyc": 2, "Mag-c": 2, "Mag-m": 2, "Merc-c": 2, "Puls": 2, "Pyr": 2, "Rhod": 2, "Rhus-t": 2, "Sabad": 2, "Samb": 2, "Seneg": 2, "Sep": 2, "Sulph": 2, "Tarent": 2, "Teucr": 2, "Zinc": 2 }
  },
  {
    id: "generalities_motion_beginning",
    chapter: "Generalities & Modalities",
    name: "Motion, beginning <",
    remedies: { "Ambr": 2, "Anac": 2, "Calc-f": 2, "Caps": 2, "Con": 2, "Ferr": 2, "Lyc": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Samb": 2, "Sep": 2, "Syph": 2 }
  },
  {
    id: "generalities_motion_rapid",
    chapter: "Generalities & Modalities",
    name: "Motion, rapid >",
    remedies: { "Am-m": 2, "Ars": 2, "Aur-m": 2, "Bry": 2, "Flu-ac": 2, "Graph": 2, "Ign": 2, "Nit-ac": 2, "Sep": 2, "Stann": 2, "Sulph-ac": 2, "Tarent": 2, "Tub": 2 }
  },
  {
    id: "generalities_motion_slow",
    chapter: "Generalities & Modalities",
    name: "Motion, slow >",
    remedies: { "Agar": 2, "Alum": 2, "Ambr": 2, "Ars": 2, "Aur-m": 2, "Bell": 2, "Bry": 2, "Caust": 2, "Coloc": 2, "Con": 2, "Ferr": 2, "Glon": 2, "Kali-p": 2, "Mag-m": 2, "Phos": 2, "Puls": 2, "Sil": 2, "Sulph": 2, "Syph": 2, "Tarent": 2 }
  },
  {
    id: "face_mouth_throat",
    chapter: "Face & Mouth",
    name: "Mouth & throat",
    remedies: { "Apis": 2, "Arg-m": 2, "Arund": 2, "Baryta-c": 2, "Bell": 2, "Caps": 2, "Caust": 2, "Gels": 2, "Hep": 2, "Kali-bi": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Merc-c": 2, "Merc-i-f": 2, "Merc-i-r": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Phyt": 2, "Puls": 2, "Rhus-t": 2, "Sulph": 2 }
  },
  {
    id: "generalities_nails",
    chapter: "Generalities & Modalities",
    name: "Nails",
    remedies: { "Alum": 2, "Ant-c": 2, "Clem": 2, "Flu-ac": 2, "Graph": 2, "Merc": 2, "Nit-ac": 2, "Sabad": 2, "Sep": 2, "Sil": 2, "Squil": 2, "Sulph": 2, "Thuja": 2, "Ust": 2 }
  },
  {
    id: "stomach_nausea",
    chapter: "Stomach & Gastric",
    name: "Nausea",
    remedies: { "Aeth": 2, "Ant-c": 2, "Ant-t": 2, "Arg-m": 2, "Ars": 2, "Bell": 2, "Bism": 2, "Bry": 2, "Cadm-s": 2, "Carbo-v": 2, "Cham": 2, "Chna": 2, "Cocculus": 2, "Colch": 2, "Cupr": 2, "Dig": 2, "Dulc": 2, "Echin": 2, "Hell": 2, "Hep": 2, "Ign": 2, "Ipec": 2, "Iris": 2, "Kali-c": 2, "Lyc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Rob": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Sulph-ac": 2, "Tab": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "generalities_nazo_pharynx",
    chapter: "Generalities & Modalities",
    name: "Nazo- Pharynx",
    remedies: { "Arn": 2, "Calc": 2, "Caps": 2, "Carbo-v": 2, "Caust": 2, "Cinnb": 2, "Cist": 2, "Colch": 2, "Elaps": 2, "Hep": 2, "Hydr": 2, "Kali-bi": 2, "Mag-c": 2, "Merc": 2, "Nat-c": 2, "Nat-m": 2, "Nit-ac": 2, "Phos": 2, "Phyt": 2, "Rumex": 2, "Sep": 2, "Spig": 2, "Staph": 2, "Sulph": 2, "Syph": 2, "Ther": 2, "Thuja": 2 }
  },
  {
    id: "generalities_nerves_nervous_patients",
    chapter: "Generalities & Modalities",
    name: "Nerves, nervous patients",
    remedies: { "Acon": 2, "Agar": 2, "Arg-n": 2, "Asaf": 2, "Aur-m": 2, "Bell": 2, "Borax": 2, "Carbo-v": 2, "Caul": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cimic": 2, "Cocculus": 2, "Coff": 2, "Con": 2, "Cupr": 2, "Ferr": 2, "Gels": 2, "Hell": 2, "Hep": 2, "Hyos": 2, "Ign": 2, "Ind": 2, "Iod": 2, "Iris": 2, "Kali-p": 2, "Lach": 2, "Lil-t": 2, "Lys": 2, "Mag-c": 2, "Mag-m": 2, "Mag-p": 2, "Merc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Petr": 2, "Phos": 2, "Pic-ac": 2, "Puls": 2, "Sabad": 2, "Senec": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Stict": 2, "Stram": 2, "Sulph": 2, "Tarent": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "generalities_neuralgia",
    chapter: "Generalities & Modalities",
    name: "Neuralgia",
    remedies: { "Acon": 2, "All-c": 2, "Arg-m": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Caust": 2, "Cedr": 2, "Cham": 2, "Chna": 2, "Cimic": 2, "Coff": 2, "Coloc": 2, "Dios": 2, "Gels": 2, "Gnaph": 2, "Hep": 2, "Hyper": 2, "Ign": 2, "Ind": 2, "Iris": 2, "Kali-bi": 2, "Kali-m": 2, "Kali-n": 2, "Lach": 2, "Lyc": 2, "Mag-c": 2, "Mag-p": 2, "Merc": 2, "Mez": 2, "Nat-m": 2, "Nux-v": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Ran-b": 2, "Rhus-t": 2, "Sabad": 2, "Sang": 2, "Spig": 2, "Stann": 2, "Sulph": 2, "Sulph-ac": 2, "Thuja": 2, "Ust": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "generalities_night_worse",
    chapter: "Generalities & Modalities",
    name: "Night, worse",
    remedies: { "Acon": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Asaf": 2, "Aur-m": 2, "Bell": 2, "Calc": 2, "Calc-p": 2, "Calc-s": 2, "Carbo-an": 2, "Cham": 2, "Chna": 2, "Cimic": 2, "Coff": 2, "Colch": 2, "Con": 2, "Dulc": 2, "Ferr": 2, "Graph": 2, "Hep": 2, "Hyos": 2, "Iod": 2, "Ipec": 2, "Merc": 2, "Nit-ac": 2, "Phos": 2, "Plumb": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Rob": 2, "Rumex": 2, "Sabina": 2, "Sep": 2, "Sil": 2, "Stram": 2, "Stront-br": 2, "Sulph": 2, "Syph": 2, "Zinc": 2 }
  },
  {
    id: "generalities_numbness",
    chapter: "Generalities & Modalities",
    name: "Numbness",
    remedies: { "Acon": 2, "Ambr": 2, "Anac": 2, "Ant-c": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Berb": 2, "Cadm-br": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Cocculus": 2, "Coloc": 2, "Con": 2, "Gels": 2, "Glon": 2, "Gnaph": 2, "Graph": 2, "Hyos": 2, "Kali-br": 2, "Kali-c": 2, "Lyc": 2, "Mag-c": 2, "Med": 2, "Nat-m": 2, "Nux-m": 2, "Nux-v": 2, "Olden-h": 2, "Op": 2, "Ph-ac": 2, "Phos": 2, "Pic-ac": 2, "Plat": 2, "Plumb": 2, "Puls": 2, "Rhus-t": 2, "Sec": 2, "Stram": 2, "Tarent": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "respiration_palpitation_heart",
    chapter: "Respiration & Chest",
    name: "Palpitation, (Heart)",
    remedies: { "Acon": 2, "Agar": 2, "Aml-n": 2, "Arg-n": 2, "Ars": 2, "Ars-i": 2, "Aur-m": 2, "Cact": 2, "Calc": 2, "Cham": 2, "Chna": 2, "Coca": 2, "Colch": 2, "Con": 2, "Dig": 2, "Glon": 2, "Iod": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-m": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Naja": 2, "Nat-c": 2, "Nat-m": 2, "Nat-p": 2, "Nit-ac": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Spig": 2, "Spong": 2, "Stroph": 2, "Sulph": 2, "Tab": 2, "Thuja": 2, "Thyr": 2, "Verat": 2 }
  },
  {
    id: "male_pregnancy_complaints_during",
    chapter: "Male & Female Genitalia",
    name: "Pregnancy, complaints during",
    remedies: { "Acon": 2, "Arn": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Caul": 2, "Cham": 2, "Cimic": 2, "Cocculus": 2, "Coll": 2, "Con": 2, "Gels": 2, "Hell": 2, "Heln-ov": 2, "Ign": 2, "Ipec": 2, "Kali-c": 2, "Kreos": 2, "Lyc": 2, "Nux-m": 2, "Nux-v": 2, "Phos": 2, "Plat": 2, "Puls": 2, "Pyr": 2, "Rhus-t": 2, "Sabina": 2, "Sec": 2, "Sep": 2, "Stram": 2, "Sulph": 2, "Tab": 2, "Verat": 2, "Vib": 2 }
  },
  {
    id: "generalities_pressure_agg",
    chapter: "Generalities & Modalities",
    name: "Pressure agg.",
    remedies: { "Acon": 2, "Agar": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Baryta-c": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calen": 2, "Carbo-v": 2, "Cina": 2, "Cycl": 2, "Dros": 2, "Equis": 2, "Ferr": 2, "Hep": 2, "Iod": 2, "Kali-c": 2, "Kali-i": 2, "Lach": 2, "Laur": 2, "Lil-t": 2, "Lyc": 2, "Mag-c": 2, "Mag-m": 2, "Merc-c": 2, "Nat-acet": 2, "Nat-s": 2, "Nux-m": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Psor": 2, "Ruta": 2, "Sabad": 2, "Sil": 2, "Spong": 2, "Tarent": 2, "Tell": 2, "Ther": 2, "Thuja": 2, "Vib": 2 }
  },
  {
    id: "generalities_pressure_amel",
    chapter: "Generalities & Modalities",
    name: "Pressure amel.",
    remedies: { "Am-c": 2, "Arg-n": 2, "Bry": 2, "Calc": 2, "Caps": 2, "Cham": 2, "Chel": 2, "Chna": 2, "Cimic": 2, "Coloc": 2, "Con": 2, "Dios": 2, "Dros": 2, "Flu-ac": 2, "Form": 2, "Ign": 2, "Ind": 2, "Lil-t": 2, "Mag-m": 2, "Mag-p": 2, "Meny": 2, "Nat-c": 2, "Nat-s": 2, "Ol-an": 2, "Plumb": 2, "Puls": 2, "Pyr": 2, "Rhus-t": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Stann": 2, "Vib": 2 }
  },
  {
    id: "generalities_pressure_hard_amel",
    chapter: "Generalities & Modalities",
    name: "Pressure, hard  amel.",
    remedies: { "Bell": 2, "Caust": 2, "Chna": 2, "Coloc": 2, "Con": 2, "Ign": 2, "Lach": 2, "Mag-p": 2, "Nux-v": 2, "Plumb": 2, "Psor": 2, "Samb": 2, "Sang": 2, "Stann": 2, "Zinc": 2 }
  },
  {
    id: "generalities_pricking_pains",
    chapter: "Generalities & Modalities",
    name: "Pricking pains",
    remedies: { "Agar": 2, "All-c": 2, "Alum": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Caps": 2, "Crot-h": 2, "Hep": 2, "Kali-bi": 2, "Kali-c": 2, "Nat-m": 2, "Nat-p": 2, "Nit-ac": 2, "Osm": 2, "Paeon": 2, "Phos": 2, "Plat": 2, "Rat": 2, "Rhus-t": 2, "Sabad": 2, "Sil": 2, "Sulph": 2, "Symph": 2, "Syph": 2, "Thuja": 2, "Valer": 2, "Verat": 2 }
  },
  {
    id: "generalities_pulse_slow",
    chapter: "Generalities & Modalities",
    name: "Pulse slow",
    remedies: { "Agar": 2, "Bapt": 2, "Berb": 2, "Canch": 2, "Cent": 2, "Cic": 2, "Cupr": 2, "Dig": 2, "Gels": 2, "Kalm": 2, "Manc": 2, "Mur-ac": 2, "Ol-an": 2, "Op": 2, "Pyr": 2, "Sec": 2, "Sep": 2, "Spig": 2, "Squil": 2, "Stram": 2, "Verat": 2, "Verat-v": 2 }
  },
  {
    id: "respiration_rattling_chest_internal",
    chapter: "Respiration & Chest",
    name: "Rattling, chest internal",
    remedies: { "Am-c": 2, "Am-m": 2, "Ant-t": 2, "Ars": 2, "Cact": 2, "Calc": 2, "Calc-s": 2, "Caust": 2, "Chna": 2, "Cupr": 2, "Dulc": 2, "Hep": 2, "Ipec": 2, "Kali-s": 2, "Lyc": 2, "Op": 2, "Phos": 2, "Puls": 2, "Seneg": 2, "Sil": 2, "Squil": 2, "Sulph": 2, "Verat": 2 }
  },
  {
    id: "generalities_rawness",
    chapter: "Generalities & Modalities",
    name: "Rawness",
    remedies: { "Arg-m": 2, "Arund": 2, "Berb": 2, "Calc": 2, "Canth": 2, "Caps": 2, "Carbo-v": 2, "Caust": 2, "Euph": 2, "Flu-ac": 2, "Graph": 2, "Hep": 2, "Hydr": 2, "Ign": 2, "Iod": 2, "Kreos": 2, "Lach": 2, "Led": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Puls": 2, "Sang": 2, "Sep": 2, "Stann": 2, "Staph": 2, "Sulph": 2, "Sulph-ac": 2, "Zinc": 2 }
  },
  {
    id: "generalities_reaction_poor",
    chapter: "Generalities & Modalities",
    name: "Reaction, poor",
    remedies: { "Aeth": 2, "Am-c": 2, "Ambr": 2, "Ant-t": 2, "Calc": 2, "Caps": 2, "Carbo-v": 2, "Con": 2, "Cupr": 2, "Dig": 2, "Ferr": 2, "Gels": 2, "Graph": 2, "Hell": 2, "Med": 2, "Op": 2, "Ph-ac": 2, "Psor": 2, "Sulph": 2, "Syph": 2, "Tarent": 2, "Tub": 2, "Zinc": 2 }
  },
  {
    id: "rectum,_rectum_anus",
    chapter: "Rectum, Stool & Bowels",
    name: "Rectum & anus",
    remedies: { "Aesc": 2, "Aloe": 2, "Calc": 2, "Carbo-v": 2, "Graph": 2, "Ham": 2, "Ign": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Mag-m": 2, "Merc-c": 2, "Mur-ac": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Podoph": 2, "Rat": 2, "Sabad": 2, "Sep": 2, "Sulph": 2, "Teucr": 2 }
  },
  {
    id: "generalities_redness",
    chapter: "Generalities & Modalities",
    name: "Redness",
    remedies: { "Acon": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Cham": 2, "Chna": 2, "Ferr": 2, "Lach": 2, "Merc": 2, "Nux-v": 2, "Op": 2, "Phos": 2, "Rhus-t": 2, "Sabina": 2, "Sang": 2, "Sep": 2, "Sulph": 2 }
  },
  {
    id: "respiration_respiration",
    chapter: "Respiration & Chest",
    name: "Respiration",
    remedies: { "Acon": 2, "Am-c": 2, "Ant-t": 2, "Apis": 2, "Ars": 2, "Bell": 2, "Brom": 2, "Bry": 2, "Carbo-v": 2, "Coca": 2, "Cupr": 2, "Dig": 2, "Dros": 2, "Hep": 2, "Ipec": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Nat-s": 2, "Op": 2, "Phos": 2, "Puls": 2, "Samb": 2, "Spong": 2, "Stann": 2, "Sulph": 2, "Tarent": 2 }
  },
  {
    id: "respiration_respiration_suffocative",
    chapter: "Respiration & Chest",
    name: "Respiration, suffocative",
    remedies: { "Acon": 2, "Anac": 2, "Ant-t": 2, "Apis": 2, "Ars": 2, "Brom": 2, "Bry": 2, "Carbo-v": 2, "Caust": 2, "Chel": 2, "Chna": 2, "Cina": 2, "Coca": 2, "Cupr": 2, "Ferr": 2, "Graph": 2, "Hep": 2, "Ign": 2, "Iod": 2, "Ipec": 2, "Kali-acet": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-i": 2, "Kali-m": 2, "Lach": 2, "Lyc": 2, "Merc-c": 2, "Naja": 2, "Nat-m": 2, "Nat-s": 2, "Nux-v": 2, "Op": 2, "Phos": 2, "Puls": 2, "Rumex": 2, "Samb": 2, "Sel": 2, "Sil": 2, "Spong": 2, "Stann": 2, "Sulph": 2, "Sumb": 2, "Tarent": 2, "Verat": 2 }
  },
  {
    id: "mind_restlessness",
    chapter: "Mind (Mental & Emotional)",
    name: "Restlessness",
    remedies: { "Acon": 2, "Anac": 2, "Apis": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Bapt": 2, "Bell": 2, "Calc": 2, "Calc-p": 2, "Camph": 2, "Cham": 2, "Cimic": 2, "Cina": 2, "Coff": 2, "Coloc": 2, "Cupr": 2, "Ferr": 2, "Hyos": 2, "Iod": 2, "Lyc": 2, "Mag-p": 2, "Merc": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Stram": 2, "Sulph": 2, "Tarent": 2, "Teucr": 2, "Zinc": 2 }
  },
  {
    id: "generalities_rheumatism",
    chapter: "Generalities & Modalities",
    name: "Rheumatism",
    remedies: { "Acon": 2, "Agar": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Benz-ac": 2, "Berb": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Caust": 2, "Cham": 2, "Chin-s": 2, "Chna": 2, "Cimic": 2, "Colch": 2, "Dulc": 2, "Eup-per": 2, "Ferr-p": 2, "Gels": 2, "Graph": 2, "Guai": 2, "Ham": 2, "Iod": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-i": 2, "Kali-m": 2, "Kalm": 2, "Led": 2, "Lil-t": 2, "Lith-i": 2, "Lyc": 2, "Med": 2, "Merc": 2, "Merc-c": 2, "Nat-m": 2, "Nat-p": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Ox-ac": 2, "Phyt": 2, "Puls": 2, "Rad-br": 2, "Ran-b": 2, "Rhus-t": 2, "Ruta": 2, "Sabina": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Stict": 2, "Sulph": 2, "Syph": 2, "Verat-v": 2 }
  },
  {
    id: "mind_sadness_grief_low_spirits",
    chapter: "Mind (Mental & Emotional)",
    name: "Sadness, grief, low spirits",
    remedies: { "Acon": 2, "Ars": 2, "Aur-m": 2, "Calc": 2, "Car": 2, "Carbo-an": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cimic": 2, "Cocculus": 2, "Colch": 2, "Crot-c": 2, "Ferr": 2, "Flu-ac": 2, "Gels": 2, "Graph": 2, "Hell": 2, "Ign": 2, "Ind": 2, "Iod": 2, "Kali-br": 2, "Kali-p": 2, "Kreos": 2, "Lac-c": 2, "Lach": 2, "Lept": 2, "Lil-t": 2, "Lyc": 2, "Med": 2, "Merc": 2, "Mez": 2, "Mur-ac": 2, "Murx": 2, "Nat-c": 2, "Nat-m": 2, "Nat-s": 2, "Nit-ac": 2, "Petr": 2, "Ph-ac": 2, "Plat": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Sabad": 2, "Sel": 2, "Sep": 2, "Stann": 2, "Staph": 2, "Sulph": 2, "Syph": 2, "Tab": 2, "Tarax": 2, "Thuja": 2, "Verat": 2, "Zinc": 2 }
  },
  {
    id: "extremities_sciatica",
    chapter: "Extremities & Joints",
    name: "Sciatica",
    remedies: { "Acon": 2, "Am-m": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Caps": 2, "Cham": 2, "Chna": 2, "Coloc": 2, "Dios": 2, "Gels": 2, "Gnaph": 2, "Hyper": 2, "Ign": 2, "Ind": 2, "Iris": 2, "Kali-c": 2, "Kali-i": 2, "Kali-p": 2, "Lac-c": 2, "Lyc": 2, "Mag-p": 2, "Nat-s": 2, "Nux-v": 2, "Phyt": 2, "Plumb": 2, "Ran-b": 2, "Rhus-t": 2, "Ruta": 2, "Sal-ac": 2, "Sep": 2, "Staph": 2, "Sulph": 2, "Syph": 2, "Ter": 2, "Thuja": 2, "Verat": 2 }
  },
  {
    id: "generalities_season_autumn",
    chapter: "Generalities & Modalities",
    name: "Season, autumn",
    remedies: { "Aran": 2, "Chna": 2, "Colch": 2, "Coloc": 2, "Dulc": 2, "Lach": 2, "Merc": 2, "Merc-c": 2, "Rhus-t": 2, "Verat": 2 }
  },
  {
    id: "generalities_season_spring",
    chapter: "Generalities & Modalities",
    name: "Season, spring",
    remedies: { "All-c": 2, "Ambr": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Carbo-v": 2, "Crot-h": 2, "Gels": 2, "Iris": 2, "Kali-bi": 2, "Lach": 2, "Rhus-t": 2, "Sars": 2, "Verat": 2 }
  },
  {
    id: "generalities_season_summer",
    chapter: "Generalities & Modalities",
    name: "Season, summer",
    remedies: { "Aeth": 2, "Aloe": 2, "Ant-c": 2, "Bell": 2, "Bry": 2, "Carbo-v": 2, "Cinnb": 2, "Cupr": 2, "Dulc": 2, "Flu-ac": 2, "Gels": 2, "Grat": 2, "Iris": 2, "Kali-bi": 2, "Lach": 2, "Nat-c": 2, "Nat-m": 2, "Podoph": 2, "Puls": 2, "Rheum": 2, "Sel": 2, "Verat-v": 2 }
  },
  {
    id: "generalities_season_winter",
    chapter: "Generalities & Modalities",
    name: "Season, winter",
    remedies: { "Ars": 2, "Aur-m": 2, "Dulc": 2, "Flu-ac": 2, "Hep": 2, "Kali-c": 2, "Kalm": 2, "Nux-v": 2, "Petr": 2, "Psor": 2, "Rhus-t": 2, "Sep": 2 }
  },
  {
    id: "generalities_season_change_of",
    chapter: "Generalities & Modalities",
    name: "Season, change of",
    remedies: { "Acon": 2, "Ars-i": 2, "Asar": 2, "Bry": 2, "Carbo-an": 2, "Caust": 2, "Cham": 2, "Hep": 2, "Ipec": 2, "Kali-acet": 2, "Kali-c": 2, "Med": 2, "Nux-v": 2, "Samb": 2, "Sep": 2, "Spong": 2 }
  },
  {
    id: "generalities_season_hot_humid",
    chapter: "Generalities & Modalities",
    name: "Season, hot & humid",
    remedies: { "Aloe": 2, "Ars": 2, "Bapt": 2, "Brom": 2, "Bry": 2, "Car": 2, "Carbo-v": 2, "Gels": 2, "Iod": 2, "Ipec": 2, "Kali-bi": 2, "Lach": 2, "Lys": 2, "Nat-m": 2, "Nat-s": 2, "Puls": 2, "Rhus-t": 2, "Sil": 2, "Verat": 2 }
  },
  {
    id: "generalities_sensitive_to_noise_light_order_etc",
    chapter: "Generalities & Modalities",
    name: "Sensitive to noise, light, order etc",
    remedies: { "Acon": 2, "Aesc": 2, "Agar": 2, "All-c": 2, "Am-c": 2, "Am-m": 2, "Ambr": 2, "Aml-n": 2, "Anac": 2, "Ant-c": 2, "Ant-t": 2, "Apis": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Asaf": 2, "Asar": 2, "Aur-m": 2, "Bell": 2, "Borax": 2, "Bry": 2, "Bufo": 2, "Calc": 2, "Caust": 2, "Cham": 2, "Chin-s": 2, "Chna": 2, "Cina": 2, "Cocculus": 2, "Coff": 2, "Colch": 2, "Coloc": 2, "Con": 2, "Croc": 2, "Cupr": 2, "Dios": 2, "Dys": 2, "Ferr": 2, "Ferr-i": 2, "Gels": 2, "Glon": 2, "Graph": 2, "Hep": 2, "Hyos": 2, "Ign": 2, "Kali-acet": 2, "Kali-c": 2, "Kali-s": 2, "Lach": 2, "Lyc": 2, "Lys": 2, "Mag-c": 2, "Mag-p": 2, "Manc": 2, "Mang": 2, "Med": 2, "Merc": 2, "Merc-c": 2, "Nat-c": 2, "Nat-m": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Op": 2, "Paeon": 2, "Ph-ac": 2, "Phos": 2, "Plat": 2, "Plumb": 2, "Psor": 2, "Puls": 2, "Ran-b": 2, "Ran-s": 2, "Raph": 2, "Rat": 2, "Rheum": 2, "Rhod": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Staph": 2, "Sul-i": 2, "Sulph": 2, "Symph": 2, "Tarent": 2, "Tell": 2, "Ter": 2, "Teucr": 2, "Ther": 2, "Tub": 2, "Zinc": 2 }
  },
  {
    id: "extremities_shoulders",
    chapter: "Extremities & Joints",
    name: "Shoulders",
    remedies: { "Acon": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Caust": 2, "Chel": 2, "Chna": 2, "Cimic": 2, "Dulc": 2, "Ferr": 2, "Ferr-p": 2, "Kali-c": 2, "Kalm": 2, "Kreos": 2, "Mag-c": 2, "Merc": 2, "Nat-acet": 2, "Nux-v": 2, "Ol-an": 2, "Phos": 2, "Phyt": 2, "Puls": 2, "Rhus-t": 2, "Rumex": 2, "Sang": 2, "Sep": 2, "Sil": 2, "Stict": 2, "Sulph": 2, "Tell": 2, "Zinc": 2 }
  },
  {
    id: "back_shoulder_scapulae_between",
    chapter: "Back & Spine",
    name: "Shoulder & scapulae between",
    remedies: { "Acon": 2, "Agar": 2, "Am-m": 2, "Arn": 2, "Ars": 2, "Calc": 2, "Calc-p": 2, "Caps": 2, "Coloc": 2, "Guai": 2, "Lach": 2, "Lyc": 2, "Nat-s": 2, "Nit-ac": 2, "Phos": 2, "Rhus-t": 2, "Sep": 2 }
  },
  {
    id: "generalities_sides_lain_on_agg",
    chapter: "Generalities & Modalities",
    name: "Sides, lain on agg.",
    remedies: { "Ars": 2, "Bry": 2, "Calc": 2, "Cimic": 2, "Graph": 2, "Hep": 2, "Kali-c": 2, "Merc": 2, "Nat-m": 2, "Nux-m": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Phys": 2, "Puls": 2, "Sep": 2, "Sil": 2, "Teucr": 2 }
  },
  {
    id: "generalities_sides_lain_on_amel",
    chapter: "Generalities & Modalities",
    name: "Sides, lain on amel.",
    remedies: { "Bry": 2, "Cupr": 2, "Flu-ac": 2, "Graph": 2, "Ign": 2, "Kali-bi": 2, "Puls": 2, "Rhus-t": 2 }
  },
  {
    id: "generalities_sides_right",
    chapter: "Generalities & Modalities",
    name: "Sides, right",
    remedies: { "Apis": 2, "Arg-m": 2, "Ars": 2, "Aur-m": 2, "Bapt": 2, "Bell": 2, "Borax": 2, "Bry": 2, "Calc": 2, "Canth": 2, "Caust": 2, "Chel": 2, "Cimic": 2, "Coloc": 2, "Con": 2, "Crot-c": 2, "Crot-h": 2, "Eup-pur": 2, "Gels": 2, "Iris": 2, "Kalm": 2, "Lyc": 2, "Lys": 2, "Naja": 2, "Nux-v": 2, "Puls": 2, "Ran-s": 2, "Rat": 2, "Rumex": 2, "Sang": 2, "Sars": 2, "Sec": 2, "Sil": 2, "Sulph-ac": 2, "Tarent": 2 }
  },
  {
    id: "generalities_sides_right_to_left",
    chapter: "Generalities & Modalities",
    name: "Sides, right to left",
    remedies: { "Acon": 2, "Am-c": 2, "Ambr": 2, "Apis": 2, "Bell": 2, "Calc-p": 2, "Caust": 2, "Chel": 2, "Cupr": 2, "Lil-t": 2, "Lyc": 2, "Merc-i-f": 2, "Phos": 2, "Rumex": 2, "Sabad": 2, "Sang": 2, "Sulph-ac": 2, "Syph": 2, "Verat": 2 }
  },
  {
    id: "generalities_sides_left",
    chapter: "Generalities & Modalities",
    name: "Sides, left",
    remedies: { "Arg-n": 2, "Asaf": 2, "Asar": 2, "Astra-mo": 2, "Calc-f": 2, "Caps": 2, "Cina": 2, "Clem": 2, "Croc": 2, "Euph": 2, "Graph": 2, "Kreos": 2, "Lach": 2, "Lil-t": 2, "Mez": 2, "Olden-h": 2, "Phos": 2, "Rhus-t": 2, "Sel": 2, "Sep": 2, "Spig": 2, "Squil": 2, "Stann": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_sides_left_to_right",
    chapter: "Generalities & Modalities",
    name: "Sides, left to right",
    remedies: { "All-c": 2, "Ars": 2, "Brom": 2, "Calc": 2, "Ferr": 2, "Lach": 2, "Merc-i-r": 2, "Nux-m": 2, "Puls": 2, "Rhus-t": 2, "Sabad": 2, "Stann": 2, "Tarax": 2 }
  },
  {
    id: "skin_skin",
    chapter: "Skin & Eruptions",
    name: "Skin",
    remedies: { "Ambr": 2, "Anac": 2, "Ant-t": 2, "Apis": 2, "Ars": 2, "Bell": 2, "Bov": 2, "Bry": 2, "Calc": 2, "Calen": 2, "Caust": 2, "Euph": 2, "Flu-ac": 2, "Graph": 2, "Hep": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Olden-h": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Rad-br": 2, "Ran-b": 2, "Ran-s": 2, "Rhus-t": 2, "Sabad": 2, "Sars": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Thuja": 2, "Ust": 2, "Viol-o": 2, "Viol-t": 2, "X-ray": 2 }
  },
  {
    id: "skin_skin_folds",
    chapter: "Skin & Eruptions",
    name: "Skin, folds",
    remedies: { "Ars": 2, "Calc": 2, "Carbo-v": 2, "Graph": 2, "Hep": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Ol-an": 2, "Petr": 2, "Psor": 2, "Puls": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "sleep_sleep_loss_of",
    chapter: "Sleep & Dreams",
    name: "Sleep> / loss of <",
    remedies: { "Agar": 2, "Ars": 2, "Calen": 2, "Carbo-v": 2, "Cimic": 2, "Cocculus": 2, "Coff": 2, "Colch": 2, "Cupr": 2, "Kali-p": 2, "Lac-d": 2, "Laur": 2, "Med": 2, "Merc": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Sabal": 2, "Sang": 2, "Sel": 2, "Sep": 2, "Zinc": 2 }
  },
  {
    id: "sleep_sleep_during_worse",
    chapter: "Sleep & Dreams",
    name: "Sleep during worse",
    remedies: { "Acon": 2, "Arg-m": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Borax": 2, "Bry": 2, "Bufo": 2, "Cham": 2, "Cina": 2, "Con": 2, "Hep": 2, "Hyos": 2, "Lach": 2, "Merc": 2, "Op": 2, "Puls": 2, "Sil": 2, "Stram": 2, "Sulph": 2, "Zinc": 2 }
  },
  {
    id: "sleep_sleep_waking_from",
    chapter: "Sleep & Dreams",
    name: "Sleep, waking from <",
    remedies: { "Am-m": 2, "Ambr": 2, "Apis": 2, "Ars": 2, "Bapt": 2, "Bell": 2, "Bufo": 2, "Calc": 2, "Caust": 2, "Cent": 2, "Chna": 2, "Crot-c": 2, "Helo": 2, "Hep": 2, "Hyos": 2, "Kali-bi": 2, "Lach": 2, "Lyc": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Onos": 2, "Op": 2, "Phos": 2, "Puls": 2, "Sel": 2, "Sep": 2, "Spong": 2, "Stann": 2, "Stram": 2, "Sulph": 2, "Tarent": 2, "Tub": 2 }
  },
  {
    id: "sleep_sleepiness",
    chapter: "Sleep & Dreams",
    name: "Sleepiness",
    remedies: { "Aeth": 2, "Alum": 2, "Ant-c": 2, "Ant-t": 2, "Apis": 2, "Ars": 2, "Bapt": 2, "Bell": 2, "Calc": 2, "Canch": 2, "Car": 2, "Caust": 2, "Chel": 2, "Chna": 2, "Clem": 2, "Croc": 2, "Echin": 2, "Ferr-p": 2, "Gels": 2, "Graph": 2, "Kali-acet": 2, "Lach": 2, "Lept": 2, "Merc-c": 2, "Nux-m": 2, "Nux-v": 2, "Op": 2, "Ph-ac": 2, "Phos": 2, "Phys": 2, "Pic-ac": 2, "Podoph": 2, "Puls": 2, "Sulph": 2, "Ter": 2, "Thuja": 2 }
  },
  {
    id: "sleep_sleeplessness",
    chapter: "Sleep & Dreams",
    name: "Sleeplessness",
    remedies: { "Acon": 2, "Arg-n": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Cact": 2, "Calc": 2, "Cham": 2, "Chna": 2, "Cocculus": 2, "Coff": 2, "Cycl": 2, "Hep": 2, "Hyos": 2, "Kali-acet": 2, "Kali-c": 2, "Lach": 2, "Merc": 2, "Merc-c": 2, "Nux-v": 2, "Op": 2, "Ox-ac": 2, "Phos": 2, "Plumb": 2, "Puls": 2, "Rhus-t": 2, "Sanic": 2, "Sep": 2, "Sil": 2, "Stann": 2, "Staph": 2, "Sulph": 2, "Symph": 2, "Thuja": 2 }
  },
  {
    id: "nose_sneezing",
    chapter: "Nose & Coryza",
    name: "Sneezing",
    remedies: { "All-c": 2, "Ars": 2, "Bry": 2, "Car": 2, "Carbo-v": 2, "Cina": 2, "Eup-per": 2, "Gels": 2, "Ign": 2, "Ipec": 2, "Kali-i": 2, "Kali-p": 2, "Merc": 2, "Nat-m": 2, "Nux-v": 2, "Puls": 2, "Rhus-t": 2, "Rumex": 2, "Sabad": 2, "Sanic": 2, "Senec": 2, "Seneg": 2, "Sil": 2, "Squil": 2, "Sulph": 2 }
  },
  {
    id: "generalities_sourness",
    chapter: "Generalities & Modalities",
    name: "Sourness",
    remedies: { "Calc": 2, "Chna": 2, "Graph": 2, "Hep": 2, "Iris": 2, "Kali-c": 2, "Lept": 2, "Lith-i": 2, "Lyc": 2, "Mag-c": 2, "Merc": 2, "Nat-c": 2, "Nat-m": 2, "Nat-p": 2, "Nat-s": 2, "Nux-v": 2, "Ox-ac": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Rheum": 2, "Rob": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Sulph-ac": 2 }
  },
  {
    id: "generalities_spasmodic_convulsive_twitching",
    chapter: "Generalities & Modalities",
    name: "Spasmodic, convulsive, twitching",
    remedies: { "Aeth": 2, "Agar": 2, "Ambr": 2, "Ars": 2, "Asaf": 2, "Baryta-m": 2, "Bell": 2, "Borax": 2, "Bufo": 2, "Calc": 2, "Calc-p": 2, "Camph": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cic": 2, "Cimic": 2, "Cina": 2, "Colch": 2, "Con": 2, "Cupr": 2, "Dios": 2, "Gels": 2, "Guai": 2, "Hydr-ac": 2, "Hyos": 2, "Hyper": 2, "Ign": 2, "Iod": 2, "Ipec": 2, "Just": 2, "Kali-c": 2, "Lach": 2, "Laur": 2, "Lob": 2, "Lyc": 2, "Med": 2, "Meny": 2, "Merc": 2, "Mez": 2, "Mill": 2, "Mosch": 2, "Nat-c": 2, "Nat-m": 2, "Nux-m": 2, "Nux-v": 2, "Olden-h": 2, "Op": 2, "Plat": 2, "Plumb": 2, "Prot": 2, "Puls": 2, "Rat": 2, "Rhus-t": 2, "Sabad": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Stann": 2, "Stram": 2, "Stroph": 2, "Stry": 2, "Sulph": 2, "Sulph-ac": 2, "Tab": 2, "Tarent": 2, "Thuja": 2, "Valer": 2, "Verat": 2, "Verat-v": 2, "Vib": 2, "Visc": 2, "Zinc": 2 }
  },
  {
    id: "generalities_spots_pain_sensation_etc",
    chapter: "Generalities & Modalities",
    name: "Spots; pain, sensation etc",
    remedies: { "Agar": 2, "Alum": 2, "Arg-m": 2, "Ars": 2, "Berb": 2, "Bufo": 2, "Calc-p": 2, "Caust": 2, "Cist": 2, "Colch": 2, "Con": 2, "Flu-ac": 2, "Glon": 2, "Hep": 2, "Ign": 2, "Kali-bi": 2, "Lach": 2, "Lil-t": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Nux-m": 2, "Ol-an": 2, "Ox-ac": 2, "Petr": 2, "Phos": 2, "Ran-b": 2, "Rhus-t": 2, "Sars": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "generalities_sprained",
    chapter: "Generalities & Modalities",
    name: "Sprained",
    remedies: { "Am-m": 2, "Arn": 2, "Ars": 2, "Asaf": 2, "Bell-p": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Carbo-an": 2, "Caust": 2, "Chel": 2, "Con": 2, "Graph": 2, "Ign": 2, "Led": 2, "Lyc": 2, "Nat-c": 2, "Nat-m": 2, "Onos": 2, "Petr": 2, "Phos": 2, "Psor": 2, "Puls": 2, "Rhus-t": 2, "Ruta": 2, "Sep": 2, "Sil": 2, "Stront-br": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_soreness",
    chapter: "Generalities & Modalities",
    name: "Soreness",
    remedies: { "Apis": 2, "Arg-m": 2, "Arn": 2, "Asaf": 2, "Aur-m": 2, "Bapt": 2, "Bell": 2, "Bell-p": 2, "Berb": 2, "Bry": 2, "Canth": 2, "Caps": 2, "Carbo-v": 2, "Caust": 2, "Chna": 2, "Cimic": 2, "Cina": 2, "Con": 2, "Dros": 2, "Eup-per": 2, "Gels": 2, "Ham": 2, "Hep": 2, "Hyper": 2, "Iris": 2, "Kali-c": 2, "Kali-m": 2, "Kalm": 2, "Lach": 2, "Lith-i": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Onos": 2, "Ox-ac": 2, "Ph-ac": 2, "Phos": 2, "Phyt": 2, "Plan": 2, "Plat": 2, "Puls": 2, "Pyr": 2, "Ran-b": 2, "Rhus-t": 2, "Ruta": 2, "Sil": 2, "Staph": 2, "Sulph": 2 }
  },
  {
    id: "generalities_suppuration_tendency_to",
    chapter: "Generalities & Modalities",
    name: "Suppuration, tendency to",
    remedies: { "Arn": 2, "Ars": 2, "Ars-i": 2, "Asaf": 2, "Bell": 2, "Calc": 2, "Calc-s": 2, "Calen": 2, "Carbo-an": 2, "Dulc": 2, "Echin": 2, "Guai": 2, "Hep": 2, "Kali-bi": 2, "Kali-i": 2, "Kali-s": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Phos": 2, "Puls": 2, "Pyr": 2, "Rhus-t": 2, "Sil": 2, "Sul-i": 2, "Sulph": 2, "Sulph-ac": 2, "Syph": 2, "Tarent": 2 }
  },
  {
    id: "throat_swallowing_difficult_painful",
    chapter: "Throat & Neck",
    name: "Swallowing, difficult, painful",
    remedies: { "Alum": 2, "Am-c": 2, "Apis": 2, "Arg-m": 2, "Ars": 2, "Arund": 2, "Aur-m": 2, "Baryta-c": 2, "Bell": 2, "Brom": 2, "Bry": 2, "Canth": 2, "Caust": 2, "Chna": 2, "Cina": 2, "Cocculus": 2, "Con": 2, "Cupr": 2, "Gels": 2, "Graph": 2, "Hep": 2, "Hydr-ac": 2, "Hyos": 2, "Kali-c": 2, "Kali-i": 2, "Lac-c": 2, "Lach": 2, "Laur": 2, "Lyc": 2, "Lys": 2, "Meph": 2, "Merc": 2, "Merc-c": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Phyt": 2, "Plumb": 2, "Rhus-t": 2, "Stram": 2, "Stry": 2, "Sul-i": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "throat_swallowing_empty_agg",
    chapter: "Throat & Neck",
    name: "Swallowing, empty agg.",
    remedies: { "Baryta-c": 2, "Bell": 2, "Bry": 2, "Cocculus": 2, "Graph": 2, "Hep": 2, "Kali-c": 2, "Lach": 2, "Merc": 2, "Merc-c": 2, "Merc-i-r": 2, "Nux-v": 2, "Puls": 2, "Rhus-t": 2, "Sabad": 2, "Sulph": 2, "Tell": 2 }
  },
  {
    id: "throat_swallowing_amel",
    chapter: "Throat & Neck",
    name: "Swallowing amel.",
    remedies: { "Alum": 2, "Ambr": 2, "Arn": 2, "Caps": 2, "Ferr": 2, "Hyos": 2, "Ign": 2, "Lach": 2, "Led": 2, "Mang": 2, "Merc-cy": 2, "Mez": 2, "Nit-ac": 2, "Nux-v": 2, "Puls": 2, "Rhus-t": 2, "Sabad": 2, "Spong": 2, "Zinc": 2 }
  },
  {
    id: "generalities_swaying_worse_car_seasickness",
    chapter: "Generalities & Modalities",
    name: "Swaying worse, car, sea-sickness",
    remedies: { "Ars": 2, "Borax": 2, "Carbo-v": 2, "Cocculus": 2, "Colch": 2, "Con": 2, "Glon": 2, "Iod": 2, "Kreos": 2, "Lach": 2, "Morg": 2, "Petr": 2, "Sanic": 2, "Sel": 2, "Sep": 2, "Tab": 2, "Ther": 2, "Thuja": 2 }
  },
  {
    id: "generalities_sycosis",
    chapter: "Generalities & Modalities",
    name: "Sycosis",
    remedies: { "Agar": 2, "Apis": 2, "Arg-m": 2, "Arg-n": 2, "Ars": 2, "Baryta-c": 2, "Calc": 2, "Caust": 2, "Dulc": 2, "Ferr": 2, "Flu-ac": 2, "Graph": 2, "Iod": 2, "Kali-i": 2, "Kali-s": 2, "Kalm": 2, "Lach": 2, "Lyc": 2, "Mang": 2, "Med": 2, "Merc": 2, "Mez": 2, "Nat-s": 2, "Nit-ac": 2, "Ph-ac": 2, "Phyt": 2, "Puls": 2, "Sabad": 2, "Sabina": 2, "Sars": 2, "Sec": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_syphilis",
    chapter: "Generalities & Modalities",
    name: "Syphilis",
    remedies: { "Am-c": 2, "Ars": 2, "Ars-i": 2, "Asaf": 2, "Aur-m": 2, "Calc-s": 2, "Cinnb": 2, "Flu-ac": 2, "Hep": 2, "Iod": 2, "Kali-acet": 2, "Kali-bi": 2, "Kali-i": 2, "Kali-s": 2, "Lach": 2, "Led": 2, "Lyc": 2, "Merc": 2, "Merc-c": 2, "Merc-i-f": 2, "Merc-i-r": 2, "Mez": 2, "Nit-ac": 2, "Ph-ac": 2, "Phos": 2, "Phyt": 2, "Sars": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Syph": 2, "Thuja": 2 }
  },
  {
    id: "generalities_talking_speaking_agg",
    chapter: "Generalities & Modalities",
    name: "Talking/ speaking agg.",
    remedies: { "Acon": 2, "Alum": 2, "Anac": 2, "Arg-m": 2, "Arn": 2, "Ars": 2, "Arund": 2, "Calc": 2, "Canch": 2, "Chna": 2, "Cocculus": 2, "Dros": 2, "Ign": 2, "Iod": 2, "Mang": 2, "Nat-c": 2, "Nat-m": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Rhus-t": 2, "Sel": 2, "Sep": 2, "Sil": 2, "Spong": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "eyes_tearing_pains",
    chapter: "Eyes & Vision",
    name: "Tearing, pains",
    remedies: { "Acon": 2, "Anac": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Berb": 2, "Bry": 2, "Calc": 2, "Caps": 2, "Car": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Colch": 2, "Con": 2, "Hyper": 2, "Kali-c": 2, "Kali-p": 2, "Kali-s": 2, "Led": 2, "Lyc": 2, "Merc": 2, "Nat-c": 2, "Nat-m": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Plat": 2, "Puls": 2, "Rhod": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Spig": 2, "Staph": 2, "Stront-br": 2, "Sulph": 2, "Valer": 2, "Vip": 2, "Visc": 2, "Xan": 2, "Zinc": 2 }
  },
  {
    id: "face_teeth_affections_of",
    chapter: "Face & Mouth",
    name: "Teeth, affections of",
    remedies: { "Acon": 2, "Am-c": 2, "Ant-c": 2, "Bell": 2, "Bism": 2, "Bry": 2, "Cham": 2, "Chna": 2, "Coff": 2, "Kali-c": 2, "Kreos": 2, "Mag-c": 2, "Mag-m": 2, "Mag-p": 2, "Merc": 2, "Mez": 2, "Nat-c": 2, "Nat-s": 2, "Nux-v": 2, "Puls": 2, "Rat": 2, "Rhod": 2, "Spig": 2, "Staph": 2, "Syph": 2, "Thuja": 2 }
  },
  {
    id: "face_teeth_dentation",
    chapter: "Face & Mouth",
    name: "Teeth, dentation",
    remedies: { "Acon": 2, "Aeth": 2, "Bell": 2, "Borax": 2, "Calc": 2, "Calc-p": 2, "Caust": 2, "Cham": 2, "Cina": 2, "Coff": 2, "Cupr": 2, "Ferr-p": 2, "Gels": 2, "Kali-br": 2, "Kreos": 2, "Mag-p": 2, "Merc": 2, "Nux-v": 2, "Phyt": 2, "Podoph": 2, "Puls": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Ter": 2, "Zinc": 2 }
  },
  {
    id: "stomach_thirst_increased",
    chapter: "Stomach & Gastric",
    name: "Thirst, increased",
    remedies: { "Acac": 2, "Acon": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calc-s": 2, "Caps": 2, "Caust": 2, "Cham": 2, "Chna": 2, "Cina": 2, "Croc": 2, "Dig": 2, "Eup-per": 2, "Hell": 2, "Iod": 2, "Lil-t": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Op": 2, "Phos": 2, "Pyr": 2, "Rhus-t": 2, "Rob": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Stram": 2, "Sulph": 2, "Tarent": 2, "Verat": 2 }
  },
  {
    id: "stomach_thirst_absent",
    chapter: "Stomach & Gastric",
    name: "Thirst, absent",
    remedies: { "Aeth": 2, "Anac": 2, "Ant-t": 2, "Apis": 2, "Bell": 2, "Canth": 2, "Carbo-v": 2, "Cham": 2, "Chna": 2, "Cimic": 2, "Colch": 2, "Ferr": 2, "Gels": 2, "Hell": 2, "Hyos": 2, "Ign": 2, "Ipec": 2, "Meny": 2, "Nat-acet": 2, "Nux-m": 2, "Ph-ac": 2, "Puls": 2, "Sabad": 2, "Sel": 2, "Sep": 2, "Stram": 2 }
  },
  {
    id: "throat_throat_affections_of",
    chapter: "Throat & Neck",
    name: "Throat, affections of",
    remedies: { "Apis": 2, "Arg-n": 2, "Arund": 2, "Baryta-c": 2, "Bell": 2, "Caps": 2, "Caust": 2, "Gels": 2, "Hep": 2, "Kali-bi": 2, "Lac-c": 2, "Lach": 2, "Lyc": 2, "Lys": 2, "Merc": 2, "Merc-c": 2, "Merc-i-f": 2, "Merc-i-r": 2, "Nit-ac": 2, "Nux-v": 2, "Phos": 2, "Phyt": 2, "Puls": 2, "Rhus-t": 2, "Sulph": 2 }
  },
  {
    id: "generalities_time_agg_after_midnight",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) After midnight",
    remedies: { "Am-c": 2, "Am-m": 2, "Ars": 2, "Caust": 2, "Dros": 2, "Ferr": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-n": 2, "Lach": 2, "Mag-c": 2, "Nat-acet": 2, "Nat-m": 2, "Nux-v": 2, "Phos": 2, "Podoph": 2, "Puls": 2, "Rhus-t": 2, "Rumex": 2, "Sil": 2, "Sulph": 2, "Thuja": 2, "Verat": 2 }
  },
  {
    id: "generalities_time_agg_morning_48_am",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) Morning (4-8 AM)",
    remedies: { "Agar": 2, "Am-m": 2, "Ant-t": 2, "Arg-m": 2, "Ars-i": 2, "Aur-m": 2, "Borax": 2, "Bov": 2, "Bry": 2, "Calc": 2, "Calc-p": 2, "Canch": 2, "Car": 2, "Carbo-an": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Chel": 2, "Cina": 2, "Con": 2, "Croc": 2, "Echin": 2, "Elaps": 2, "Hep": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-n": 2, "Lach": 2, "Naja": 2, "Nat-acet": 2, "Nat-m": 2, "Nat-s": 2, "Nit-ac": 2, "Nux-v": 2, "Onos": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Podoph": 2, "Puls": 2, "Rhod": 2, "Rhus-t": 2, "Rumex": 2, "Sabad": 2, "Sep": 2, "Spig": 2, "Squil": 2, "Sulph": 2, "Valer": 2 }
  },
  {
    id: "generalities_time_agg_forenoon_812_am",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) Forenoon (8-12 AM)",
    remedies: { "Arg-m": 2, "Cact": 2, "Canch": 2, "Carbo-v": 2, "Chin-s": 2, "Eup-per": 2, "Gels": 2, "Guai": 2, "Hep": 2, "Laur": 2, "Nat-c": 2, "Nat-m": 2, "Nux-m": 2, "Phos": 2, "Podoph": 2, "Ran-b": 2, "Rhus-t": 2, "Sabad": 2, "Sep": 2, "Sil": 2, "Stann": 2, "Sulph": 2, "Sulph-ac": 2 }
  },
  {
    id: "generalities_time_agg_afternoon",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) Afternoon",
    remedies: { "Agar": 2, "Aloe": 2, "Alum": 2, "Ambr": 2, "Ant-c": 2, "Apis": 2, "Arg-m": 2, "Ars": 2, "Asaf": 2, "Bell": 2, "Bry": 2, "Chel": 2, "Chna": 2, "Cimic": 2, "Colch": 2, "Coloc": 2, "Dig": 2, "Hell": 2, "Ign": 2, "Kali-n": 2, "Lach": 2, "Lyc": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Thuja": 2, "Zinc": 2 }
  },
  {
    id: "generalities_time_agg_evening_48_pm",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) Evening (4-8 PM)",
    remedies: { "Acon": 2, "All-c": 2, "Alum": 2, "Am-c": 2, "Ambr": 2, "Ant-c": 2, "Ant-t": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Caps": 2, "Car": 2, "Carbo-an": 2, "Carbo-v": 2, "Caust": 2, "Cham": 2, "Colch": 2, "Coloc": 2, "Cycl": 2, "Euphr": 2, "Flu-ac": 2, "Hell": 2, "Hyos": 2, "Kali-n": 2, "Kali-s": 2, "Lach": 2, "Lyc": 2, "Mag-c": 2, "Meny": 2, "Merc": 2, "Mez": 2, "Nat-p": 2, "Nit-ac": 2, "Nux-m": 2, "Ph-ac": 2, "Phos": 2, "Plat": 2, "Plumb": 2, "Puls": 2, "Rumex": 2, "Ruta": 2, "Sabad": 2, "Sep": 2, "Sil": 2, "Stann": 2, "Stront-br": 2, "Sulph": 2, "Sulph-ac": 2, "Syph": 2, "Zinc": 2 }
  },
  {
    id: "generalities_time_agg_before_midnight",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) Before Midnight",
    remedies: { "Arg-n": 2, "Ars": 2, "Bov": 2, "Bry": 2, "Carbo-v": 2, "Cham": 2, "Coff": 2, "Gels": 2, "Kali-acet": 2, "Led": 2, "Lyc": 2, "Mur-ac": 2, "Phos": 2, "Puls": 2, "Rumex": 2, "Sabad": 2, "Stann": 2, "Sulph": 2 }
  },
  {
    id: "generalities_time_agg_midnight",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) Midnight",
    remedies: { "Acon": 2, "Arg-n": 2, "Ars": 2, "Calc": 2, "Calen": 2, "Canth": 2, "Caust": 2, "Chna": 2, "Dig": 2, "Dros": 2, "Ferr": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Mag-m": 2, "Mur-ac": 2, "Nat-m": 2, "Nux-m": 2, "Nux-v": 2, "Op": 2, "Phos": 2, "Rhus-t": 2, "Samb": 2, "Stram": 2, "Sulph": 2, "Verat": 2 }
  },
  {
    id: "generalities_time_agg_morning_evening",
    chapter: "Generalities & Modalities",
    name: "Time (Agg.) Morning & Evening",
    remedies: { "Alum": 2, "Bov": 2, "Calc": 2, "Caust": 2, "Cocculus": 2, "Colch": 2, "Graph": 2, "Hep": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Nat-m": 2, "Phos": 2, "Psor": 2, "Rhus-t": 2, "Sang": 2, "Sep": 2, "Stram": 2, "Stront-br": 2, "Thuja": 2, "Verat": 2 }
  },
  {
    id: "face_tongue_white_furred",
    chapter: "Face & Mouth",
    name: "Tongue white, furred",
    remedies: { "Acon": 2, "Aesc": 2, "Ant-c": 2, "Ant-t": 2, "Arg-n": 2, "Arn": 2, "Bapt": 2, "Bell": 2, "Bism": 2, "Bry": 2, "Calc": 2, "Carbo-v": 2, "Card-m": 2, "Chel": 2, "Chna": 2, "Cycl": 2, "Ferr": 2, "Glon": 2, "Hydr": 2, "Ipec": 2, "Kali-c": 2, "Kali-m": 2, "Lac-c": 2, "Lob": 2, "Lyc": 2, "Merc": 2, "Merc-c": 2, "Mez": 2, "Nat-m": 2, "Nux-v": 2, "Ox-ac": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Sep": 2, "Sulph": 2, "Tarax": 2, "Verat-v": 2 }
  },
  {
    id: "face_tongue_yellow_dirty",
    chapter: "Face & Mouth",
    name: "Tongue yellow, dirty",
    remedies: { "Aesc": 2, "Bapt": 2, "Bry": 2, "Carbo-v": 2, "Cham": 2, "Chel": 2, "Chna": 2, "Ferr": 2, "Hydr": 2, "Kali-bi": 2, "Kali-s": 2, "Lept": 2, "Lyc": 2, "Merc": 2, "Merc-d": 2, "Merc-i-f": 2, "Nat-p": 2, "Nat-s": 2, "Nux-v": 2, "Podoph": 2, "Puls": 2, "Sang": 2, "Sulph": 2 }
  },
  {
    id: "throat_tonsil_inflammation_of",
    chapter: "Throat & Neck",
    name: "Tonsil, inflammation of",
    remedies: { "Acon": 2, "Ail": 2, "Am-m": 2, "Apis": 2, "Ars-i": 2, "Bapt": 2, "Baryta-c": 2, "Bell": 2, "Brom": 2, "Calc-f": 2, "Caps": 2, "Dulc": 2, "Ferr-p": 2, "Gels": 2, "Guai": 2, "Hep": 2, "Ign": 2, "Iod": 2, "Kali-bi": 2, "Kali-m": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nat-s": 2, "Phyt": 2, "Rhus-t": 2, "Sabad": 2, "Sang": 2, "Sil": 2, "Sulph": 2 }
  },
  {
    id: "generalities_touch_agg",
    chapter: "Generalities & Modalities",
    name: "Touch agg.",
    remedies: { "Acon": 2, "Agar": 2, "Apis": 2, "Arg-m": 2, "Asaf": 2, "Bell": 2, "Bry": 2, "Cham": 2, "Chin-s": 2, "Chna": 2, "Cina": 2, "Cocculus": 2, "Coff": 2, "Colch": 2, "Crot-c": 2, "Cupr": 2, "Guai": 2, "Ham": 2, "Hep": 2, "Hyos": 2, "Ign": 2, "Iod": 2, "Kali-acet": 2, "Kali-c": 2, "Lach": 2, "Lyc": 2, "Mag-p": 2, "Mang": 2, "Merc": 2, "Nit-ac": 2, "Nux-v": 2, "Plat": 2, "Plumb": 2, "Ran-b": 2, "Ran-s": 2, "Raph": 2, "Rhod": 2, "Rhus-t": 2, "Rob": 2, "Sabina": 2, "Sep": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Tarent": 2 }
  },
  {
    id: "generalities_tumors_cysts",
    chapter: "Generalities & Modalities",
    name: "Tumors & Cysts",
    remedies: { "Am-c": 2, "Ant-c": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Baryta-c": 2, "Bell": 2, "Benz-ac": 2, "Calc": 2, "Calc-f": 2, "Carbo-an": 2, "Carbo-v": 2, "Caust": 2, "Clem": 2, "Con": 2, "Graph": 2, "Lyc": 2, "Med": 2, "Nat-m": 2, "Nit-ac": 2, "Phos": 2, "Ran-b": 2, "Ruta": 2, "Sabina": 2, "Sil": 2, "Staph": 2, "Stict": 2, "Sulph": 2, "Thuja": 2 }
  },
  {
    id: "face_ulceration",
    chapter: "Face & Mouth",
    name: "Ulceration",
    remedies: { "Arg-n": 2, "Arn": 2, "Ars": 2, "Ars-i": 2, "Asaf": 2, "Aur-m": 2, "Bufo": 2, "Calc": 2, "Calc-s": 2, "Carbo-v": 2, "Caust": 2, "Flu-ac": 2, "Graph": 2, "Hep": 2, "Kali-bi": 2, "Kali-c": 2, "Kali-s": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Paeon": 2, "Ph-ac": 2, "Phos": 2, "Phyt": 2, "Puls": 2, "Rhus-t": 2, "Sep": 2, "Sil": 2, "Sul-i": 2, "Sulph": 2, "Syph": 2 }
  },
  {
    id: "urinary_urinary_organs",
    chapter: "Urinary Organs",
    name: "Urinary organs",
    remedies: { "Acon": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Benz-ac": 2, "Berb": 2, "Calc": 2, "Camph": 2, "Canch": 2, "Canth": 2, "Caust": 2, "Dulc": 2, "Equis": 2, "Ferr": 2, "Hell": 2, "Heln-ov": 2, "Hep": 2, "Hyos": 2, "Lac-d": 2, "Lat-h": 2, "Lyc": 2, "Merc": 2, "Merc-c": 2, "Morg": 2, "Nat-m": 2, "Nit-ac": 2, "Nux-v": 2, "Ol-an": 2, "Op": 2, "Par": 2, "Ph-ac": 2, "Phos": 2, "Pip-m": 2, "Polyg": 2, "Prun": 2, "Puls": 2, "Rhus-t": 2, "Sabal": 2, "Sars": 2, "Sep": 2, "Sil": 2, "Squil": 2, "Staph": 2, "Sulph": 2, "Syc": 2, "Ter": 2, "Thuja": 2, "Trill": 2, "Valer": 2, "Verat": 2, "Viol-o": 2, "Viol-t": 2 }
  },
  {
    id: "generalities_uncovering_agg",
    chapter: "Generalities & Modalities",
    name: "Uncovering agg.",
    remedies: { "Acon": 2, "Anac": 2, "Ars": 2, "Bell": 2, "Calc": 2, "Calc-f": 2, "Calc-p": 2, "Caps": 2, "Cham": 2, "Chna": 2, "Colch": 2, "Coloc": 2, "Helo": 2, "Hep": 2, "Ign": 2, "Kali-acet": 2, "Kali-c": 2, "Lac-d": 2, "Lach": 2, "Lyc": 2, "Lys": 2, "Mag-c": 2, "Mag-p": 2, "Med": 2, "Merc": 2, "Nux-m": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Puls": 2, "Pyr": 2, "Rad-br": 2, "Rheum": 2, "Rhod": 2, "Rhus-t": 2, "Samb": 2, "Sel": 2, "Sil": 2, "Squil": 2, "Stram": 2, "Stront-br": 2, "Sulph": 2, "Syph": 2, "Verat-v": 2, "Zinc": 2 }
  },
  {
    id: "generalities_uncovering_amel",
    chapter: "Generalities & Modalities",
    name: "Uncovering amel.",
    remedies: { "Acon": 2, "Apis": 2, "Arg-n": 2, "Asar": 2, "Aur-m": 2, "Calc": 2, "Camph": 2, "Cham": 2, "Dros": 2, "Ferr": 2, "Flu-ac": 2, "Guai": 2, "Iod": 2, "Kali-c": 2, "Kali-i": 2, "Kali-s": 2, "Lat-h": 2, "Led": 2, "Lyc": 2, "Merc": 2, "Mur-ac": 2, "Op": 2, "Psor": 2, "Puls": 2, "Sabad": 2, "Sanic": 2, "Sec": 2, "Spig": 2, "Sulph": 2, "Syph": 2 }
  },
  {
    id: "urinary_urine_copious",
    chapter: "Urinary Organs",
    name: "Urine Copious",
    remedies: { "Acac": 2, "Ambr": 2, "Arg-m": 2, "Ars-i": 2, "Benz-ac": 2, "Berb": 2, "Bry": 2, "Calc-f": 2, "Calc-p": 2, "Cina": 2, "Cycl": 2, "Equis": 2, "Ferr-p": 2, "Heln-ov": 2, "Ign": 2, "Kreos": 2, "Led": 2, "Mag-p": 2, "Med": 2, "Merc": 2, "Nat-p": 2, "Ox-ac": 2, "Ph-ac": 2, "Phos": 2, "Sars": 2, "Squil": 2, "Sulph": 2, "Ter": 2 }
  },
  {
    id: "urinary_urine_dark",
    chapter: "Urinary Organs",
    name: "Urine Dark",
    remedies: { "All-c": 2, "Ant-c": 2, "Apis": 2, "Arg-n": 2, "Arn": 2, "Ars": 2, "Bell": 2, "Benz-ac": 2, "Berb": 2, "Bry": 2, "Canth": 2, "Carb-ac": 2, "Carbo-v": 2, "Chel": 2, "Chin-s": 2, "Cocculus": 2, "Colch": 2, "Crot-c": 2, "Dig": 2, "Equis": 2, "Ham": 2, "Hell": 2, "Hep": 2, "Ipec": 2, "Lach": 2, "Lyc": 2, "Nat-c": 2, "Nit-ac": 2, "Nux-v": 2, "Ph-ac": 2, "Phos": 2, "Phyt": 2, "Pic-ac": 2, "Puls": 2, "Rheum": 2, "Rhus-t": 2, "Sars": 2, "Sel": 2, "Senec": 2, "Sep": 2, "Staph": 2, "Sulph": 2, "Ter": 2, "Thuja": 2 }
  },
  {
    id: "urinary_urine_foul_smell",
    chapter: "Urinary Organs",
    name: "Urine Foul Smell",
    remedies: { "Am-c": 2, "Apis": 2, "Arg-n": 2, "Ars": 2, "Ars-i": 2, "Bapt": 2, "Benz-ac": 2, "Berb": 2, "Borax": 2, "Calc": 2, "Calen": 2, "Camph": 2, "Carbo-an": 2, "Carbo-v": 2, "Chin-s": 2, "Coloc": 2, "Dulc": 2, "Graph": 2, "Hydr": 2, "Kali-bi": 2, "Kreos": 2, "Lach": 2, "Lyc": 2, "Merc": 2, "Nit-ac": 2, "Petr": 2, "Phos": 2, "Sep": 2, "Sulph": 2 }
  },
  {
    id: "vertigo_vertigo",
    chapter: "Vertigo & Head",
    name: "Vertigo",
    remedies: { "Acon": 2, "Agar": 2, "Apis": 2, "Arg-m": 2, "Bapt": 2, "Bell": 2, "Bry": 2, "Calc": 2, "Calc-s": 2, "Canth": 2, "Car": 2, "Chel": 2, "Chin-s": 2, "Coca": 2, "Cocculus": 2, "Con": 2, "Cupr": 2, "Cycl": 2, "Dig": 2, "Dulc": 2, "Ferr": 2, "Gels": 2, "Lyc": 2, "Nat-m": 2, "Nux-v": 2, "Onos": 2, "Op": 2, "Petr": 2, "Phos": 2, "Puls": 2, "Rhus-t": 2, "Sang": 2, "Sec": 2, "Sep": 2, "Sil": 2, "Sulph": 2, "Tab": 2 }
  },
  {
    id: "generalities_vesicles_blister",
    chapter: "Generalities & Modalities",
    name: "Vesicles / Blister",
    remedies: { "Apis": 2, "Ars": 2, "Arund": 2, "Calc": 2, "Canth": 2, "Carb-ac": 2, "Caust": 2, "Clem": 2, "Croto-t": 2, "Dulc": 2, "Euphr": 2, "Graph": 2, "Lach": 2, "Mag-c": 2, "Med": 2, "Merc-d": 2, "Nat-c": 2, "Nat-m": 2, "Nit-ac": 2, "Phos": 2, "Ran-b": 2, "Rhus-t": 2, "Sec": 2, "Sep": 2, "Sulph": 2 }
  },
  {
    id: "stomach_vomiting",
    chapter: "Stomach & Gastric",
    name: "Vomiting",
    remedies: { "Acon": 2, "Aeth": 2, "Ant-c": 2, "Ant-t": 2, "Apis": 2, "Arn": 2, "Ars": 2, "Bry": 2, "Cadm-s": 2, "Cham": 2, "Cina": 2, "Colch": 2, "Cupr": 2, "Ferr": 2, "Ipec": 2, "Iris": 2, "Kreos": 2, "Lob": 2, "Nux-v": 2, "Op": 2, "Phos": 2, "Plumb": 2, "Puls": 2, "Sil": 2, "Sulph": 2, "Tab": 2, "Verat": 2, "Verat-v": 2 }
  },
  {
    id: "stomach_vomiting_amel",
    chapter: "Stomach & Gastric",
    name: "Vomiting amel.",
    remedies: { "Ant-t": 2, "Cocculus": 2, "Dig": 2, "Eup-per": 2, "Kali-bi": 2, "Nux-v": 2, "Sang": 2, "Sec": 2, "Tab": 2 }
  },
  {
    id: "generalities_wandering_shifting_pains",
    chapter: "Generalities & Modalities",
    name: "Wandering / shifting pains",
    remedies: { "Ambr": 2, "Arn": 2, "Asaf": 2, "Benz-ac": 2, "Berb": 2, "Calc-p": 2, "Caul": 2, "Cimic": 2, "Colch": 2, "Croc": 2, "Cupr": 2, "Ferr": 2, "Kali-bi": 2, "Kali-m": 2, "Kali-n": 2, "Kali-s": 2, "Kalm": 2, "Lac-c": 2, "Led": 2, "Mag-c": 2, "Mag-p": 2, "Merc-i-r": 2, "Nux-m": 2, "Plan": 2, "Puls": 2, "Rad-br": 2, "Rhod": 2, "Rhus-t": 2, "Rumex": 2, "Sep": 2, "Sil": 2, "Stront-br": 2, "Tab": 2, "Thuja": 2, "Tub": 2, "Valer": 2 }
  },
  {
    id: "generalities_warmth_worse",
    chapter: "Generalities & Modalities",
    name: "Warmth worse",
    remedies: { "Aloe": 2, "Alum": 2, "Ant-c": 2, "Apis": 2, "Ars-i": 2, "Bell": 2, "Bry": 2, "Carbo-v": 2, "Crot-h": 2, "Cupr": 2, "Ferr-i": 2, "Flu-ac": 2, "Gels": 2, "Guai": 2, "Iod": 2, "Kali-i": 2, "Lach": 2, "Led": 2, "Lil-t": 2, "Lyc": 2, "Merc": 2, "Nat-m": 2, "Puls": 2, "Sabina": 2, "Sec": 2, "Spig": 2, "Sulph": 2, "Teucr": 2 }
  },
  {
    id: "generalities_warts",
    chapter: "Generalities & Modalities",
    name: "Warts",
    remedies: { "Alum": 2, "Ant-c": 2, "Ars": 2, "Baryta-c": 2, "Bell": 2, "Calc": 2, "Calc-p": 2, "Calc-s": 2, "Carbo-an": 2, "Caust": 2, "Clem": 2, "Cocculus": 2, "Con": 2, "Dulc": 2, "Graph": 2, "Hell": 2, "Lach": 2, "Lyc": 2, "Med": 2, "Meny": 2, "Merc": 2, "Merc-c": 2, "Merc-i-f": 2, "Nat-c": 2, "Nat-s": 2, "Nit-ac": 2, "Petr": 2, "Ph-ac": 2, "Phos": 2, "Psor": 2, "Ran-b": 2, "Rhus-t": 2, "Sabina": 2, "Sang": 2, "Sil": 2, "Staph": 2, "Sulph": 2, "Syc": 2, "Teucr": 2, "Thuja": 2 }
  },
  {
    id: "generalities_worms",
    chapter: "Generalities & Modalities",
    name: "Worms",
    remedies: { "Acon": 2, "Calc": 2, "Chna": 2, "Cic": 2, "Cina": 2, "Ferr": 2, "Graph": 2, "Ign": 2, "Ipec": 2, "Merc": 2, "Nat-p": 2, "Nux-v": 2, "Plat": 2, "Puls": 2, "Sabad": 2, "Sil": 2, "Spig": 2, "Stann": 2, "Sulph": 2 }
  },
];
