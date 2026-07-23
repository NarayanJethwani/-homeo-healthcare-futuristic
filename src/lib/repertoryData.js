"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JETHWANI_REPERTORY_DATA = exports.JETHWANI_REMEDY_CONFIRMATIONS = exports.JETHWANI_SECTIONS = exports.SEARCH_SYNONYMS = exports.CLARKE_CHAPTERS = exports.CLARKE_REPERTORY_DATA = exports.BOERICKE_REPERTORY_DATA = exports.BOERICKE_CHAPTERS = exports.REPERTORY_DATA = exports.REPERTORY_CHAPTERS = exports.REMEDIES_METADATA = void 0;
exports.setRepertoryData = setRepertoryData;
exports.getRepertoryData = getRepertoryData;
exports.calculateClinicalIndices = calculateClinicalIndices;
exports.REMEDIES_METADATA = {
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
exports.REPERTORY_CHAPTERS = [
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
exports.REPERTORY_DATA = [];
exports.BOERICKE_CHAPTERS = [
    "Mind & Nervous System",
    "Head & Vertigo",
    "Eyes & Vision",
    "Ears & Hearing",
    "Respiratory System",
    "Circulatory & Heart",
    "Stomach & Abdomen",
    "Urinary & Kidneys",
    "Locomotor & Joints",
    "Skin & Eruptions",
    "Fever & Chill",
    "Modalities & Generalities",
];
exports.BOERICKE_REPERTORY_DATA = [];
exports.CLARKE_REPERTORY_DATA = [];
exports.CLARKE_CHAPTERS = [];
function setRepertoryData(kentData, boerickeData, clarkeData = []) {
    exports.REPERTORY_DATA.length = 0;
    exports.REPERTORY_DATA.push(...kentData);
    exports.BOERICKE_REPERTORY_DATA.length = 0;
    exports.BOERICKE_REPERTORY_DATA.push(...boerickeData);
    exports.CLARKE_REPERTORY_DATA.length = 0;
    exports.CLARKE_REPERTORY_DATA.push(...clarkeData.map((rubric) => ({
        ...rubric,
        source: "clarke",
        scoringEnabled: false,
    })));
    exports.CLARKE_CHAPTERS.length = 0;
    exports.CLARKE_CHAPTERS.push(...Array.from(new Set(exports.CLARKE_REPERTORY_DATA.map((rubric) => rubric.chapter))).sort());
}
exports.SEARCH_SYNONYMS = {
    "sweat": ["perspir", "diaphor", "sweat", "perspiration", "sweating"],
    "sweating": ["perspir", "diaphor", "sweat", "perspiration"],
    "perspiration": ["sweat", "diaphor", "perspir"],
    "anxiety": ["anxi", "fear", "apprehens", "worry", "panic", "dread"],
    "anxious": ["anxi", "fear", "apprehens", "worry", "panic", "dread"],
    "fear": ["anxi", "fear", "apprehens", "worry", "panic", "dread", "fears", "phobia"],
    "fears": ["anxi", "fear", "apprehens", "worry", "panic", "dread", "phobia"],
    "worry": ["anxi", "fear", "apprehens", "worry", "panic", "dread"],
    "grief": ["grief", "sorrow", "sadness", "depression", "weep", "grieving"],
    "sadness": ["grief", "sorrow", "sadness", "depression", "weep", "melancholy"],
    "depression": ["grief", "sorrow", "sadness", "depression", "weep", "melancholy"],
    "depressed": ["grief", "sorrow", "sadness", "depression", "weep", "melancholy"],
    "weep": ["weep", "cry", "tearful", "weeping", "sadness"],
    "weeping": ["weep", "cry", "tearful", "weeping", "sadness"],
    "stomach": ["stomach", "gastric", "acidi", "nausea", "vomit", "dyspep", "gerd", "reflux", "heartburn"],
    "gastric": ["stomach", "gastric", "acidi", "nausea", "vomit", "dyspep", "gerd", "reflux", "heartburn"],
    "bloating": ["flatulent", "gas", "bloat", "distend", "distension", "flatus"],
    "flatulence": ["flatulent", "gas", "bloat", "distend", "distension", "flatus"],
    "gas": ["flatulent", "gas", "bloat", "distend", "distension", "flatus"],
    "constipation": ["constipat", "stool", "rectum", "hard stool"],
    "diarrhea": ["diarrh", "loose stool", "loose", "dysenter", "tenesmus"],
    "head": ["head", "migrain", "vertig", "cephal", "headache", "brain", "sunstroke"],
    "headache": ["head", "migrain", "vertig", "cephal", "headache", "brain"],
    "migraine": ["head", "migrain", "vertig", "cephal", "headache", "brain"],
    "vertigo": ["vertig", "dizzy", "giddy", "vertigo"],
    "joint": ["joint", "rheumat", "arthri", "sciatica", "back", "limbs", "joints", "gout"],
    "joints": ["joint", "rheumat", "arthri", "sciatica", "back", "limbs", "joints", "gout"],
    "rheumatism": ["joint", "rheumat", "arthri", "sciatica", "back", "limbs", "joints", "gout"],
    "arthritis": ["joint", "rheumat", "arthri", "sciatica", "back", "limbs", "joints", "gout"],
    "back": ["back", "spine", "scapula", "backache", "lumbar"],
    "spine": ["back", "spine", "scapula", "backache", "lumbar"],
    "cough": ["cough", "tussis", "barking", "tickling", "bronch"],
    "bronchitis": ["cough", "tussis", "barking", "larynx", "tickling", "bronch", "asthma"],
    "asthma": ["asthma", "dyspnea", "respir", "breathing", "suffoc"],
    "fever": ["fever", "pyrex", "heat", "chill", "cold", "shiver"],
    "chill": ["fever", "pyrex", "heat", "chill", "cold", "shiver", "coldness"],
    "shiver": ["fever", "pyrex", "heat", "chill", "cold", "shiver", "shivering"],
    "skin": ["skin", "eczema", "psorias", "vitiligo", "urticaria", "hives", "eruption", "itch"],
    "eruption": ["skin", "eczema", "psorias", "vitiligo", "urticaria", "hives", "eruption", "itch", "blister", "vesicle"],
    "itch": ["itch", "itching", "prurit"],
    "itching": ["itch", "itching", "prurit"],
    "hives": ["urticaria", "hives", "apian", "sting"],
    "cold": ["chilly", "cold", "freezing", "winter", "draft"],
    "chilly": ["chilly", "cold", "freezing", "winter", "draft"],
    "hot": ["warm", "heat", "hot", "summer", "bed"],
    "warm": ["warm", "heat", "hot", "summer", "bed"],
    "anger": ["anger", "irritable", "temper", "irritability", "fury", "rage"],
    "irritable": ["anger", "irritable", "temper", "irritability", "fury", "rage", "cross", "fault-finding"],
    "irritability": ["anger", "irritable", "temper", "irritability", "fury", "rage", "cross", "fault-finding"]
};
function getRepertoryData(source) {
    const kentWithSource = exports.REPERTORY_DATA.map(r => ({ ...r, source: 'kent' }));
    const boerickeWithSource = exports.BOERICKE_REPERTORY_DATA.map(r => ({ ...r, source: 'boericke' }));
    const clarkeWithSource = exports.CLARKE_REPERTORY_DATA.map(r => ({
        ...r,
        source: 'clarke',
        scoringEnabled: false,
    }));
    if (source === 'kent')
        return kentWithSource;
    if (source === 'boericke')
        return boerickeWithSource;
    if (source === 'clarke')
        return clarkeWithSource;
    return [...kentWithSource, ...boerickeWithSource, ...clarkeWithSource];
}
exports.JETHWANI_SECTIONS = {
    "Section A": { name: "Mental & Emotional", icon: "🧠", description: "Modern cognitive, emotional, and neuro-psychological states" },
    "Section B": { name: "Constitutional Generals", icon: "⚖️", description: "Thermals, physical generals, metabolism, and energy states" },
    "Section C": { name: "Etiology (Root Cause)", icon: "🌱", description: "Etiological triggers, suppressions, drug abuse, and post-viral states" },
    "Section D": { name: "Modern Clinical Conditions", icon: "🩺", description: "Organ-system chronic conditions (IBS, GERD, PCOS, Fibromyalgia)" },
    "Section E": { name: "Follow-Up & Response Indicators", icon: "⏱️", description: "Evaluating Hering's law, direction of cure, and response patterns" },
    "Section F": { name: "Miasmatic Load & Diathesis", icon: "🧬", description: "Dynamic calculations of Psora, Sycosis, Syphilis, and Tubercular loads" }
};
exports.JETHWANI_REMEDY_CONFIRMATIONS = {
    "Nux-v": {
        confirmatory: ["Irritability, type A personality, workaholic", "Etiology: excess stimulants/coffee/stress", "Chilly, worse cold drafts"],
        eliminating: ["Thirstless with burning fever", "Desires mild weather and consolation", "Extremely warm-blooded, hot patient"],
        differentiating: ["More irritable and chilly than Lycopodium", "More active than Gelsemium", "Less burning heat than Arsenicum"]
    },
    "Lyc": {
        confirmatory: ["Anticipatory anxiety with lack of self-confidence", "Bloating/flatulence immediately after eating", "Right-sided complaints"],
        eliminating: ["Desires cold food/drinks", "Rapid onset of symptoms with high fever", "Aggravation in the morning"],
        differentiating: ["Worse 4-8 PM compared to Nux Vomica", "Less physically restless than Arsenicum", "Worse right side compared to Lachesis"]
    },
    "Ars": {
        confirmatory: ["Extreme restlessness, physical and mental", "Burning pains relieved by heat", "Thirst for small sips frequently"],
        eliminating: ["Warm-blooded, hot patient, desires cold", "Thirstless in all stages", "Ameliorated by lying flat on back without head elevation"],
        differentiating: ["More restless and chilly than Pulsatilla", "Less flatulence than Lycopodium or Carbo Veg", "More anxious about health than Sulphur"]
    },
    "Sulph": {
        confirmatory: ["Warm-blooded patient, puts feet out of bed", "Intense itching, worse warmth of bed", "Appetite ravenous, empty sinking at 11 AM"],
        eliminating: ["Extremely chilly patient", "Better cold dry weather", "Aggravated by open fresh air"],
        differentiating: ["Warmer and more untidy than Calcarea Carbonica", "Less emotional and yielding than Pulsatilla", "Worse left side compared to Lycopodium"]
    },
    "Puls": {
        confirmatory: ["Yielding disposition, desires sympathy and consolation", "Thirstless with dry mouth", "Better in cool open fresh air"],
        eliminating: ["Chilly patient, aggravated by open air", "Highly irritable and fault-finding", "Thirsty for large quantities of cold water"],
        differentiating: ["More yielding and thirstless than Nux Vomica", "Less restless and anxious than Arsenicum", "Better cool open air compared to Silicea"]
    },
    "Sep": {
        confirmatory: ["Indifference to family and loved ones", "Sensation of dragging down in pelvis", "Chilly, but better from vigorous exercise"],
        eliminating: ["Highly emotional, weeping at every word, desires constant sympathy", "Better resting quietly in a warm room", "Thirsty with active fever"],
        differentiating: ["More indifferent than Pulsatilla", "Less physically active than Lycopodium", "Better hard exercise compared to Lachesis"]
    },
    "Lach": {
        confirmatory: ["Left-sided complaints, moving to right", "Intolerance of tight collars or restriction", "Aggravation after sleep"],
        eliminating: ["Chilly, desires tight wrapping and heat", "Better in a closed, warm room", "Amelioration immediately on waking from deep sleep"],
        differentiating: ["More talkative and hot than Sepia", "Less chilly than Arsenicum", "Worse left side compared to Lycopodium"]
    },
    "Bell": {
        confirmatory: ["Sudden, violent onset of complaints", "Throbbing headache with red face", "Hot skin with cold hands/feet"],
        eliminating: ["Slow, insidious development of symptoms over days", "Thirstless with dry skin and low pulse", "Ameliorated by light, noise, and jarring motion"],
        differentiating: ["Faster onset and more throbbing than Gelsemium", "Less anxious and restless than Aconite", "Worse right side compared to Lachesis"]
    }
};
exports.JETHWANI_REPERTORY_DATA = [
    // --- SECTION A: MENTAL & EMOTIONAL (15 Rubrics) ---
    {
        id: "jeth_a_burnout",
        section: "Section A",
        name: "Adrenal burnout, work exhaustion, cognitive collapse",
        remedies: { "Nux-v": 3, "Ph-ac": 3, "Kali-p": 3, "Lyc": 2, "Gels": 2, "Sep": 2 },
        indexWeights: { stress_load: 1.0, vital_force: -0.8, constitutional_stability: -0.6, sleep_quality: -0.4 },
        researchCitation: { source: "Jethwani Clinical Studies Vol. II", detail: "Clinical correlation between prolonged sympathetic nervous overdrive and depletion of Vital Force status." }
    },
    {
        id: "jeth_a_panic_disorder",
        section: "Section A",
        name: "Panic disorder, sudden onset of acute death terror",
        remedies: { "Acon": 3, "Ars": 3, "Arg-n": 2, "Phos": 2, "Gels": 1 },
        indexWeights: { anxiety_severity: 1.0, stress_load: 0.8, constitutional_stability: -0.4 },
        researchCitation: { source: "Homeo-Cardiology Annals 2024", detail: "Aconitum and Arsenicum show significant speed in calming post-panic autonomic flares." }
    },
    {
        id: "jeth_a_anticipatory_dread",
        section: "Section A",
        name: "Anticipatory anxiety, stage fright, fear of failure",
        remedies: { "Gels": 3, "Arg-n": 3, "Lyc": 3, "Sil": 2, "Med": 2 },
        indexWeights: { anxiety_severity: 0.8, stress_load: 0.6, constitutional_stability: -0.3 }
    },
    {
        id: "jeth_a_brain_fog",
        section: "Section A",
        name: "Brain fog, chronic mental fatigue, unable to concentrate",
        remedies: { "Ph-ac": 3, "Kali-p": 3, "Pic-ac": 3, "Nux-v": 2, "Lyc": 2, "Sulph": 2 },
        indexWeights: { vital_force: -0.6, stress_load: 0.5, sleep_quality: -0.3 }
    },
    {
        id: "jeth_a_suppressed_anger",
        section: "Section A",
        name: "Suppressed anger, ailments from long-term silent resentment",
        remedies: { "Staph": 3, "Coloc": 3, "Ign": 2, "Nat-m": 3, "Cham": 2 },
        indexWeights: { stress_load: 0.7, hormonal_balance: -0.5, digestive_function: -0.4 }
    },
    {
        id: "jeth_a_silent_grief",
        section: "Section A",
        name: "Silent grief, depression from bereavement, closed emotional state",
        remedies: { "Ign": 3, "Nat-m": 3, "Aur-m": 3, "Ph-ac": 3, "Puls": 2 },
        indexWeights: { anxiety_severity: 0.6, vital_force: -0.5, sleep_quality: -0.4 }
    },
    {
        id: "jeth_a_claustrophobia",
        section: "Section A",
        name: "Claustrophobia, extreme panic in elevator or small spaces",
        remedies: { "Arg-n": 3, "Acon": 3, "Puls": 2, "Lyc": 2 },
        indexWeights: { anxiety_severity: 0.9, stress_load: 0.5 }
    },
    {
        id: "jeth_a_insomnia_thoughts",
        section: "Section A",
        name: "Insomnia, hyperactive mind, thoughts crowd in bed",
        remedies: { "Coff": 3, "Nux-v": 3, "Gels": 2, "Sulph": 2, "Chna": 2 },
        indexWeights: { sleep_quality: -1.0, stress_load: 0.8, vital_force: -0.5 }
    },
    {
        id: "jeth_a_night_terrors",
        section: "Section A",
        name: "Night terrors, waking up screaming, hallucinating in dark",
        remedies: { "Stram": 3, "Bell": 3, "Calc": 2, "Puls": 2, "Cham": 2 },
        indexWeights: { sleep_quality: -0.8, anxiety_severity: 0.7 }
    },
    {
        id: "jeth_a_indifference_family",
        section: "Section A",
        name: "Indifference to family, loved ones, loss of emotional warmth",
        remedies: { "Sep": 3, "Ph-ac": 3, "Aur-m": 2, "Sulph": 1 },
        indexWeights: { constitutional_stability: -0.8, vital_force: -0.4 }
    },
    {
        id: "jeth_a_weeping_yielding",
        section: "Section A",
        name: "Weeping easily, yielding disposition, craves sympathy",
        remedies: { "Puls": 3, "Ign": 2, "Sil": 2, "Nat-m": 1 },
        indexWeights: { anxiety_severity: 0.5, constitutional_stability: -0.3 }
    },
    {
        id: "jeth_a_irritability_morning",
        section: "Section A",
        name: "Irritability, Morning on waking, fault-finding with family",
        remedies: { "Cham": 2, "Lyc": 3, "Nux-v": 3, "Sulph": 2, "Nat-m": 2 },
        indexWeights: { stress_load: 0.6, sleep_quality: -0.3 }
    },
    {
        id: "jeth_a_depressive_melancholia",
        section: "Section A",
        name: "Depressive melancholia, suicidal ideation, self-loathing",
        remedies: { "Aur-m": 3, "Nat-m": 3, "Ign": 2, "Ars": 2, "Psor": 2 },
        indexWeights: { constitutional_stability: -1.0, anxiety_severity: 0.8, vital_force: -0.7 }
    },
    {
        id: "jeth_a_hypochondria",
        section: "Section A",
        name: "Hypochondriasis, obsessive fear of chronic incurable diseases",
        remedies: { "Ars": 3, "Phos": 3, "Calc": 2, "Nux-v": 2, "Sulph": 1 },
        indexWeights: { anxiety_severity: 0.9, stress_load: 0.7 }
    },
    {
        id: "jeth_a_dread_crowds",
        section: "Section A",
        name: "Dread of crowds (agoraphobia), fear of open spaces",
        remedies: { "Acon": 3, "Arg-n": 3, "Gels": 2, "Puls": 2, "Lyc": 2 },
        indexWeights: { anxiety_severity: 0.8, stress_load: 0.5 }
    },
    // --- SECTION B: CONSTITUTIONAL GENERALS (15 Rubrics) ---
    {
        id: "jeth_b_chilly_sensitive",
        section: "Section B",
        name: "Extremely chilly, sensitive to cold drafts and dampness",
        remedies: { "Ars": 3, "Calc": 3, "Hep": 3, "Nux-v": 3, "Sil": 3, "Psor": 3 },
        indexWeights: { constitutional_stability: 0.5, immune_reactivity: -0.4 }
    },
    {
        id: "jeth_b_warm_blooded",
        section: "Section B",
        name: "Warm-blooded, hot, suffocated in closed room, desires cold air",
        remedies: { "Sulph": 3, "Puls": 3, "Apis": 3, "Arg-n": 3, "Iod": 3, "Lach": 2 },
        indexWeights: { constitutional_stability: 0.5, immune_reactivity: -0.3 }
    },
    {
        id: "jeth_b_right_sided",
        section: "Section B",
        name: "Right-sided complaints, symptoms progress from right to left",
        remedies: { "Lyc": 3, "Bell": 3, "Bry": 3, "Chel": 3, "Apis": 2 },
        indexWeights: { constitutional_stability: 0.3 }
    },
    {
        id: "jeth_b_left_sided",
        section: "Section B",
        name: "Left-sided complaints, symptoms progress from left to right",
        remedies: { "Lach": 3, "Sep": 2, "Phos": 2, "Thuja": 3, "Spig": 3 },
        indexWeights: { constitutional_stability: 0.3 }
    },
    {
        id: "jeth_b_sluggish_obese",
        section: "Section B",
        name: "Sluggish metabolism, overweight tendency, slow reaction",
        remedies: { "Calc": 3, "Graph": 3, "Caps": 2, "Sulph": 2, "Baryta-c": 2 },
        indexWeights: { vital_force: -0.5, hormonal_balance: -0.4, chronic_disease: 0.4 }
    },
    {
        id: "jeth_b_lean_hyperactive",
        section: "Section B",
        name: "Lean, thin, high metabolism, restless energy",
        remedies: { "Phos": 3, "Iod": 3, "Ars": 3, "Lyc": 2, "Tarent": 2 },
        indexWeights: { stress_load: 0.6, constitutional_stability: -0.3 }
    },
    {
        id: "jeth_b_thirstless",
        section: "Section B",
        name: "Thirstless, dry mouth but absolute aversion to water",
        remedies: { "Puls": 3, "Apis": 3, "Gels": 2, "Nux-m": 2 },
        indexWeights: { digestive_function: -0.3 }
    },
    {
        id: "jeth_b_thirsty_large",
        section: "Section B",
        name: "Thirsty for large quantities of cold water at long intervals",
        remedies: { "Bry": 3, "Nat-m": 3, "Phos": 2, "Acon": 2, "Sulph": 2 },
        indexWeights: { digestive_function: 0.3 }
    },
    {
        id: "jeth_b_thirsty_sips",
        section: "Section B",
        name: "Thirsty for small quantities frequently, burning dry mouth",
        remedies: { "Ars": 3, "Acon": 2, "Bell": 2, "Chna": 2 },
        indexWeights: { stress_load: 0.4, anxiety_severity: 0.4 }
    },
    {
        id: "jeth_b_craves_sweets",
        section: "Section B",
        name: "Constitutional craving for sweets and sugar",
        remedies: { "Arg-n": 3, "Lyc": 3, "Sulph": 3, "Calc": 2, "Med": 2 },
        indexWeights: { hormonal_balance: -0.4, digestive_function: -0.3 }
    },
    {
        id: "jeth_b_craves_salt",
        section: "Section B",
        name: "Constitutional craving for salt and salty food",
        remedies: { "Nat-m": 3, "Phos": 3, "Calc": 2, "Med": 2, "Sep": 2 },
        indexWeights: { hormonal_balance: -0.3 }
    },
    {
        id: "jeth_b_craves_spicy",
        section: "Section B",
        name: "Constitutional craving for spicy, highly seasoned foods",
        remedies: { "Nux-v": 3, "Phos": 2, "Sulph": 2, "Hep": 1 },
        indexWeights: { digestive_function: -0.4, stress_load: 0.3 }
    },
    {
        id: "jeth_b_sleep_unrefreshing",
        section: "Section B",
        name: "Sleep unrefreshing, waking up more tired than on lying down",
        remedies: { "Lach": 3, "Nux-v": 3, "Phos": 2, "Sep": 2, "Sulph": 2, "Psor": 2 },
        indexWeights: { sleep_quality: -0.9, vital_force: -0.6 }
    },
    {
        id: "jeth_b_sensitive_noises",
        section: "Section B",
        name: "Hypersensitivity to noise, light, odors, touch",
        remedies: { "Nux-v": 3, "Bell": 3, "Cham": 3, "Hep": 3, "Sil": 2, "Ign": 2 },
        indexWeights: { stress_load: 0.8, anxiety_severity: 0.5 }
    },
    {
        id: "jeth_b_exhaustion_heat",
        section: "Section B",
        name: "Physical exhaustion from heat of summer/sun",
        remedies: { "Gels": 3, "Glon": 3, "Nat-m": 3, "Bell": 2, "Lach": 2 },
        indexWeights: { vital_force: -0.5, constitutional_stability: -0.4 }
    },
    // --- SECTION C: ETIOLOGY (ROOT CAUSE) (15 Rubrics) ---
    {
        id: "jeth_c_post_viral_fatigue",
        section: "Section C",
        name: "Etiology: Post-viral fatigue, exhaustion after acute respiratory/viral fever",
        remedies: { "Gels": 3, "Ph-ac": 3, "Chna": 3, "Kali-p": 2, "Ars-i": 2, "Psor": 2 },
        indexWeights: { vital_force: -0.9, immune_reactivity: -0.6, chronic_disease: 0.5 },
        researchCitation: { source: "Clinical Homeopathy Archives 2023", detail: "Gelsemium and Acid Phos show high clinical efficacy in restoring mitochondrial reserves post-influenza." }
    },
    {
        id: "jeth_c_suppressed_skin",
        section: "Section C",
        name: "Etiology: Suppressed skin eruptions (via steroid creams or cautery)",
        remedies: { "Sulph": 3, "Psor": 3, "Thuja": 3, "Mez": 2, "Graph": 2, "Dulcamara": 2 },
        indexWeights: { immune_reactivity: -0.8, chronic_disease: 0.7, constitutional_stability: -0.5 },
        researchCitation: { source: "Hahnemannian Miasm Journal", detail: "Suppression of primary psoric skin symptoms drives pathology inward to respiratory/digestive spheres." }
    },
    {
        id: "jeth_c_grief_chronic",
        section: "Section C",
        name: "Etiology: Silent, chronic grief or romantic disappointment",
        remedies: { "Nat-m": 3, "Ign": 3, "Ph-ac": 3, "Aur-m": 3, "Sep": 2 },
        indexWeights: { stress_load: 0.6, hormonal_balance: -0.5, vital_force: -0.4 }
    },
    {
        id: "jeth_c_anger_suppressed",
        section: "Section C",
        name: "Etiology: Suppressed anger, humiliation, silent indignation",
        remedies: { "Staph": 3, "Coloc": 3, "Cham": 2, "Nux-v": 2, "Ign": 2 },
        indexWeights: { stress_load: 0.7, digestive_function: -0.5 }
    },
    {
        id: "jeth_c_stimulants_abuse",
        section: "Section C",
        name: "Etiology: Abuse of coffee, alcohol, drugs, or stimulants",
        remedies: { "Nux-v": 3, "Sulph": 2, "Lach": 2, "Ars": 2, "Cham": 1 },
        indexWeights: { stress_load: 0.9, digestive_function: -0.6, sleep_quality: -0.5 }
    },
    {
        id: "jeth_c_antibiotics_abuse",
        section: "Section C",
        name: "Etiology: Abuse of antibiotics, chronic gut dysbiosis therefrom",
        remedies: { "Nux-v": 3, "Sulph": 2, "Thuja": 2, "Carbo-v": 2, "Puls": 2 },
        indexWeights: { digestive_function: -0.8, immune_reactivity: -0.5 }
    },
    {
        id: "jeth_c_physical_injury_old",
        section: "Section C",
        name: "Etiology: Old mechanical injuries, falls, sprains never fully healed",
        remedies: { "Arn": 3, "Rhus-t": 3, "Ruta": 3, "Symph": 3, "Hyper": 3 },
        indexWeights: { chronic_disease: 0.4, vital_force: -0.3 }
    },
    {
        id: "jeth_c_sunstroke_exposure",
        section: "Section C",
        name: "Etiology: Long exposure to sun, sunstroke, radiant heat",
        remedies: { "Glon": 3, "Bell": 3, "Nat-m": 3, "Gels": 2 },
        indexWeights: { stress_load: 0.5, constitutional_stability: -0.4 }
    },
    {
        id: "jeth_c_damp_weather_wetting",
        section: "Section C",
        name: "Etiology: Exposure to damp weather, working in water, getting wet",
        remedies: { "Rhus-t": 3, "Dulc": 3, "Nat-s": 3, "Calc": 2, "Ant-t": 2 },
        indexWeights: { immune_reactivity: -0.6, chronic_disease: 0.4 }
    },
    {
        id: "jeth_c_sleep_deprivation",
        section: "Section C",
        name: "Etiology: Chronic sleep deprivation, night watches, nursing sick",
        remedies: { "Cocculus": 3, "Nux-v": 2, "Ph-ac": 2, "Gels": 2, "Nit-ac": 2 },
        indexWeights: { sleep_quality: -0.9, vital_force: -0.7, stress_load: 0.8 }
    },
    {
        id: "jeth_c_vaccination_effects",
        section: "Section C",
        name: "Etiology: Adverse constitutional reactions after vaccinations",
        remedies: { "Thuja": 3, "Sil": 3, "Sulph": 2, "Ant-t": 2, "Apis": 1 },
        indexWeights: { immune_reactivity: -0.7, chronic_disease: 0.5 }
    },
    {
        id: "jeth_c_menstruation_suppressed",
        section: "Section C",
        name: "Etiology: Menstruation suppressed from getting wet or cold exposure",
        remedies: { "Puls": 3, "Dulc": 3, "Bell": 2, "Cimic": 2, "Sep": 2 },
        indexWeights: { hormonal_balance: -0.8, chronic_disease: 0.3 }
    },
    {
        id: "jeth_c_mental_strain_excessive",
        section: "Section C",
        name: "Etiology: Prolonged study, exam stress, intense mental work",
        remedies: { "Nux-v": 3, "Kali-p": 3, "Pic-ac": 3, "Gels": 2, "Lyc": 2 },
        indexWeights: { stress_load: 0.8, vital_force: -0.5, sleep_quality: -0.4 }
    },
    {
        id: "jeth_c_perspiration_suppressed",
        section: "Section C",
        name: "Etiology: Suppression of perspiration from cold winds",
        remedies: { "Acon": 3, "Dulc": 2, "Sil": 2, "Bry": 2, "Cham": 1 },
        indexWeights: { immune_reactivity: -0.5, chronic_disease: 0.3 }
    },
    {
        id: "jeth_c_bad_news_fright",
        section: "Section C",
        name: "Etiology: Fright, sudden hearing of bad news, emotional shock",
        remedies: { "Gels": 3, "Ign": 3, "Acon": 3, "Op": 3, "Ph-ac": 2 },
        indexWeights: { stress_load: 0.7, anxiety_severity: 0.8, vital_force: -0.4 }
    },
    // --- SECTION D: MODERN CLINICAL CONDITIONS (20 Rubrics) ---
    {
        id: "jeth_d_gerd_reflux",
        section: "Section D",
        name: "GERD, severe acid reflux, retrosternal burning pain",
        remedies: { "Robinia": 3, "Nux-v": 3, "Lyc": 3, "Ars": 2, "Sulph": 2, "Carbo-v": 2 },
        indexWeights: { digestive_function: -0.9, stress_load: 0.4 },
        researchCitation: { source: "Gastroenterology Homeopathy Study 2022", detail: "Robinia 30C shows high success rate in normalizing hyperchlorhydria under pH monitoring." }
    },
    {
        id: "jeth_d_ibs_bloating",
        section: "Section D",
        name: "IBS, chronic bloating, diarrhea alternating with constipation",
        remedies: { "Lyc": 3, "Carbo-v": 3, "Nux-v": 3, "Aloe": 2, "Coloc": 2, "Sulph": 2 },
        indexWeights: { digestive_function: -1.0, stress_load: 0.5, chronic_disease: 0.4 }
    },
    {
        id: "jeth_d_fibromyalgia_myalgia",
        section: "Section D",
        name: "Fibromyalgia, widespread musculoskeletal pain, chronic soreness",
        remedies: { "Rhus-t": 3, "Bry": 3, "Cimic": 3, "Arn": 2, "Gels": 2, "Ruta": 2 },
        indexWeights: { chronic_disease: 0.8, vital_force: -0.6, sleep_quality: -0.5 }
    },
    {
        id: "jeth_d_chronic_fatigue_syndrome",
        section: "Section D",
        name: "Chronic Fatigue Syndrome (CFS), profound debility",
        remedies: { "Ars": 3, "Ph-ac": 3, "Kali-p": 3, "Gels": 2, "Psor": 2, "Chna": 2 },
        indexWeights: { vital_force: -1.0, chronic_disease: 0.7, stress_load: 0.5 }
    },
    {
        id: "jeth_d_atopic_dermatitis_eczema",
        section: "Section D",
        name: "Atopic dermatitis, eczema, intense dry scaling, oozing",
        remedies: { "Graph": 3, "Sulph": 3, "Mez": 2, "Rhus-t": 3, "Ars": 2, "Petr": 2 },
        indexWeights: { immune_reactivity: -0.9, chronic_disease: 0.6 }
    },
    {
        id: "jeth_d_allergic_rhinitis_sinusitis",
        section: "Section D",
        name: "Allergic rhinitis, chronic sinusitis, nasal polyps",
        remedies: { "Kali-bi": 3, "All-c": 3, "Sabad": 2, "Ars": 2, "Hep": 2, "Sil": 2 },
        indexWeights: { immune_reactivity: -0.8, chronic_disease: 0.4 }
    },
    {
        id: "jeth_d_bronchial_asthma",
        section: "Section D",
        name: "Bronchial asthma, wheezing, constriction, worse night",
        remedies: { "Ars": 3, "Nat-s": 3, "Kali-c": 3, "Samb": 2, "Ipec": 2, "Lob": 2 },
        indexWeights: { immune_reactivity: -0.9, vital_force: -0.7, chronic_disease: 0.6 }
    },
    {
        id: "jeth_d_hormonal_acne",
        section: "Section D",
        name: "Hormonal acne, painful pustules, cyclic eruption",
        remedies: { "Sulph": 3, "Calc-s": 3, "Hep": 2, "Sep": 2, "Puls": 2, "Sil": 2 },
        indexWeights: { hormonal_balance: -0.7, immune_reactivity: -0.4 }
    },
    {
        id: "jeth_d_pcos_cystic",
        section: "Section D",
        name: "PCOS, polycystic ovarian syndrome, hirsutism, delayed menses",
        remedies: { "Thuja": 3, "Sep": 3, "Apis": 3, "Puls": 3, "Lyc": 2, "Calc": 2 },
        indexWeights: { hormonal_balance: -1.0, chronic_disease: 0.6 }
    },
    {
        id: "jeth_d_hypertension_essential",
        section: "Section D",
        name: "Hypertension, essential, with congestive heat to head",
        remedies: { "Glon": 3, "Bell": 3, "Aur-m": 3, "Lach": 2, "Nux-v": 2 },
        indexWeights: { stress_load: 0.7, chronic_disease: 0.5 }
    },
    {
        id: "jeth_d_migraine_throbbing",
        section: "Section D",
        name: "Migraine, chronic throbbing headache, worse noise/light",
        remedies: { "Bell": 3, "Nat-m": 3, "Sanguinaria": 3, "Gels": 2, "Spig": 3, "Lach": 2 },
        indexWeights: { stress_load: 0.6, sleep_quality: -0.4, chronic_disease: 0.4 }
    },
    {
        id: "jeth_d_rheumatoid_arthritis",
        section: "Section D",
        name: "Rheumatoid arthritis, joint stiffness, worse morning",
        remedies: { "Rhus-t": 3, "Bry": 3, "Caust": 3, "Led": 2, "Colch": 3, "Calc-f": 2 },
        indexWeights: { chronic_disease: 0.9, vital_force: -0.5 }
    },
    {
        id: "jeth_d_urticaria_hives",
        section: "Section D",
        name: "Urticaria, hives, acute wheals, burning, itching, cold ameliorates",
        remedies: { "Apis": 3, "Urt-u": 3, "Ars": 2, "Rhus-t": 2, "Sulph": 2 },
        indexWeights: { immune_reactivity: -0.9 }
    },
    {
        id: "jeth_d_vitiligo_depigmentation",
        section: "Section D",
        name: "Vitiligo, depigmented spots, slowly progressive",
        remedies: { "Ars-i": 3, "Calc": 2, "Nat-m": 2, "Sep": 2, "Sulph": 2, "Sil": 1 },
        indexWeights: { immune_reactivity: -0.6, chronic_disease: 0.5 }
    },
    {
        id: "jeth_d_psoriasis_plaques",
        section: "Section D",
        name: "Psoriasis, dry scaly plaques on elbows, knees, bleeding cracks",
        remedies: { "Ars": 3, "Graph": 3, "Petr": 3, "Sulph": 3, "Psor": 2 },
        indexWeights: { chronic_disease: 0.7, immune_reactivity: -0.8 }
    },
    {
        id: "jeth_d_insulin_resistance",
        section: "Section D",
        name: "Insulin resistance, metabolic syndrome, fatty liver",
        remedies: { "Lyc": 3, "Sulph": 3, "Calc": 2, "Chel": 2, "Phosphorus": 2 },
        indexWeights: { hormonal_balance: -0.8, digestive_function: -0.5, chronic_disease: 0.6 }
    },
    {
        id: "jeth_d_hypothyroidism",
        section: "Section D",
        name: "Hypothyroidism, lethargy, cold sensitivity, weight gain",
        remedies: { "Calc": 3, "Graph": 3, "Sep": 3, "Thyr": 3, "Lyc": 2 },
        indexWeights: { hormonal_balance: -0.9, vital_force: -0.6, chronic_disease: 0.5 }
    },
    {
        id: "jeth_d_leaky_gut_dysbiosis",
        section: "Section D",
        name: "Leaky gut, multiple food allergies, toxic load",
        remedies: { "Nux-v": 3, "Sulph": 3, "Carbo-v": 2, "Ars": 2, "Thuja": 2, "Psor": 2 },
        indexWeights: { digestive_function: -0.8, immune_reactivity: -0.7, vital_force: -0.4 }
    },
    {
        id: "jeth_d_insomnia_chronic",
        section: "Section D",
        name: "Chronic insomnia, waking multiple times, sleep apnea symptoms",
        remedies: { "Lach": 2, "Ars": 2, "Nux-v": 3, "Sulph": 2, "Op": 2, "Kali-p": 2 },
        indexWeights: { sleep_quality: -1.0, stress_load: 0.7, vital_force: -0.5 }
    },
    {
        id: "jeth_d_autoimmune_flare",
        section: "Section D",
        name: "Autoimmune hyper-reactivity flare-ups, chronic inflammatory states",
        remedies: { "Thuja": 3, "Sil": 3, "Ars": 2, "Sulph": 2, "Psor": 2, "Med": 2 },
        indexWeights: { immune_reactivity: -1.0, vital_force: -0.6, chronic_disease: 0.7 }
    },
    // --- SECTION E: FOLLOW-UP & RESPONSE INDICATORS (10 Rubrics) ---
    {
        id: "jeth_e_herings_inside_out",
        section: "Section E",
        name: "Amelioration of internal organs, eruption on skin appears (Hering's Law)",
        remedies: { "Sulph": 3, "Psor": 3, "Thuja": 2, "Lyc": 2 },
        indexWeights: { vital_force: 0.8, constitutional_stability: 0.6, chronic_disease: -0.4 }
    },
    {
        id: "jeth_e_herings_top_down",
        section: "Section E",
        name: "Symptom shifts downwards, from head to extremities (Hering's Law)",
        remedies: { "Bry": 2, "Rhus-t": 2, "Calc": 1, "Sulph": 1 },
        indexWeights: { vital_force: 0.6, constitutional_stability: 0.5 }
    },
    {
        id: "jeth_e_return_old_symptom",
        section: "Section E",
        name: "Return of old, long-forgotten symptoms (Excellent prognosis)",
        remedies: { "Sulph": 3, "Psor": 3, "Lyc": 2, "Sil": 2 },
        indexWeights: { vital_force: 0.7, constitutional_stability: 0.7 }
    },
    {
        id: "jeth_e_suppression_signs",
        section: "Section E",
        name: "Eruption disappears, breathing/internal distress increases (Suppression)",
        remedies: { "Ars": 3, "Sulph": -2, "Psor": -2, "Thuja": -2 },
        indexWeights: { vital_force: -0.9, constitutional_stability: -0.7, chronic_disease: 0.6 }
    },
    {
        id: "jeth_e_new_symptom_inward",
        section: "Section E",
        name: "New symptoms appear, moving towards vital organs (Unfavorable)",
        remedies: { "Lach": 3, "Ars": 2, "Phosphorus": 2, "Ph-ac": 2 },
        indexWeights: { vital_force: -0.8, constitutional_stability: -0.6, chronic_disease: 0.5 }
    },
    {
        id: "jeth_e_rapid_amelioration",
        section: "Section E",
        name: "Rapid, gentle, and permanent amelioration of core symptoms",
        remedies: { "Puls": 3, "Acon": 2, "Bell": 2, "Nux-v": 2 },
        indexWeights: { vital_force: 0.9, stress_load: -0.6, anxiety_severity: -0.6 }
    },
    {
        id: "jeth_e_status_quo",
        section: "Section E",
        name: "Status quo, no change in physical or mental symptoms",
        remedies: { "Psor": 2, "Sulph": 2, "Thuja": 2, "Sil": 1 },
        indexWeights: { constitutional_stability: -0.2 }
    },
    {
        id: "jeth_e_potency_exhausted",
        section: "Section E",
        name: "Action of remedy stops, symptoms begin to return (Change potency)",
        remedies: { "Sulph": 2, "Lyc": 2, "Calc": 2, "Nux-v": 2 },
        indexWeights: { vital_force: -0.3 }
    },
    {
        id: "jeth_e_antidoted_symptoms",
        section: "Section E",
        name: "Symptoms antidoted by coffee, camphor, or strong odours",
        remedies: { "Ign": 3, "Nux-v": 2, "Puls": 2, "Bell": 1 },
        indexWeights: { vital_force: -0.4, constitutional_stability: -0.4 }
    },
    {
        id: "jeth_e_pathological_block",
        section: "Section E",
        name: "No reaction to well-selected remedy, pathological block",
        remedies: { "Psor": 3, "Sulph": 3, "Thuja": 3, "Med": 3, "Carbo-v": 2, "Tub": 2 },
        indexWeights: { vital_force: -0.5, chronic_disease: 0.4 }
    },
    // --- SECTION F: MIASMATIC LOAD & DIATHESIS (10 Rubrics) ---
    {
        id: "jeth_f_psora_load",
        section: "Section F",
        name: "Miasm: Psora (itching, functional disorders, skin sensitivities)",
        remedies: { "Sulph": 3, "Psor": 3, "Calc": 3, "Ars": 2, "Lyc": 2, "Graph": 2 },
        indexWeights: { chronic_disease: 0.2 },
        researchCitation: { source: "Jethwani Miasmatic Compendium", detail: "Psora acts as the foundational dynamic disturbance of the immunological barrier." }
    },
    {
        id: "jeth_f_sycosis_load",
        section: "Section F",
        name: "Miasm: Sycosis (hypertrophy, warts, catarrh, suspicious mind)",
        remedies: { "Thuja": 3, "Med": 3, "Nat-s": 3, "Sil": 2, "Puls": 2, "Lyc": 2 },
        indexWeights: { chronic_disease: 0.3 }
    },
    {
        id: "jeth_f_syphilis_load",
        section: "Section F",
        name: "Miasm: Syphilis (destruction, ulceration, bone pains, depression)",
        remedies: { "Merc": 3, "Nit-ac": 3, "Aur-m": 3, "Lach": 2, "Phos": 1 },
        indexWeights: { chronic_disease: 0.5, vital_force: -0.4 }
    },
    {
        id: "jeth_f_tubercular_load",
        section: "Section F",
        name: "Miasm: Tubercular (emaciation, chest weakness, cosmopolitan desires)",
        remedies: { "Tub": 3, "Phos": 3, "Calc-p": 3, "Iod": 3, "Puls": 2 },
        indexWeights: { chronic_disease: 0.4, vital_force: -0.3 }
    },
    {
        id: "jeth_f_cancerinic_load",
        section: "Section F",
        name: "Miasm: Cancerinic (autoimmune collapse, perfectionism, insomnia)",
        remedies: { "Carcinosin": 3, "Thuja": 2, "Ars": 2, "Phos": 2, "Con": 2 },
        indexWeights: { chronic_disease: 0.6, vital_force: -0.5 }
    },
    {
        id: "jeth_f_latent_miasm_flare",
        section: "Section F",
        name: "Miasm: Latent miasmatic burden flaring up after grief or trauma",
        remedies: { "Psor": 3, "Thuja": 3, "Sulph": 2, "Lach": 2 },
        indexWeights: { vital_force: -0.4, chronic_disease: 0.3 }
    },
    {
        id: "jeth_f_hereditary_burden",
        section: "Section F",
        name: "Miasm: Strong family history of chronic illness, metabolic blocks",
        remedies: { "Carcinosin": 3, "Tub": 3, "Med": 2, "Sulph": 2, "Calc": 2, "Thuja": 2 },
        indexWeights: { chronic_disease: 0.5, constitutional_stability: -0.4 }
    },
    {
        id: "jeth_f_destructive_diathesis",
        section: "Section F",
        name: "Miasm: Destructive diathesis, rapid tissue degeneration",
        remedies: { "Merc": 3, "Nit-ac": 3, "Aur-m": 3, "Ars": 2, "Sec": 2 },
        indexWeights: { chronic_disease: 0.7, vital_force: -0.5 }
    },
    {
        id: "jeth_f_catarrhal_diathesis",
        section: "Section F",
        name: "Miasm: Catarrhal diathesis, chronic mucous membrane discharge",
        remedies: { "Kali-bi": 3, "Puls": 3, "Hydrastis": 2, "Nat-s": 2, "Calc": 1 },
        indexWeights: { chronic_disease: 0.3, immune_reactivity: -0.4 }
    },
    {
        id: "jeth_f_inflammatory_diathesis",
        section: "Section F",
        name: "Miasm: Inflammatory diathesis, rapid redness, swelling, high fever",
        remedies: { "Bell": 3, "Acon": 3, "Apis": 3, "Bry": 2, "Ferr-p": 2 },
        indexWeights: { immune_reactivity: -0.5 }
    }
];
function calculateClinicalIndices(symptoms) {
    // Initialize indices to baseline values
    const indices = {
        stress_load: 10,
        anxiety_severity: 10,
        sleep_quality: 90,
        digestive_function: 95,
        hormonal_balance: 90,
        immune_reactivity: 95,
        vital_force: 100,
        chronic_disease: 5,
        constitutional_stability: 95
    };
    if (!symptoms || symptoms.length === 0) {
        return indices;
    }
    let vitalForceDecrement = 0;
    symptoms.forEach(s => {
        // 1. Calculate individual symptom weight
        const freqMult = s.frequency === 'constant' ? 1.2 : s.frequency === 'frequent' ? 1.0 : 0.8;
        const impMult = s.impact === 'severe' ? 1.2 : s.impact === 'moderate' ? 1.0 : 0.8;
        const symptomWeight = (s.severity / 10) * freqMult * impMult;
        // Find the corresponding rubric in JETHWANI_REPERTORY_DATA to check index mappings
        const rubric = exports.JETHWANI_REPERTORY_DATA.find(r => r.id === s.rubricId);
        if (rubric && rubric.indexWeights) {
            Object.entries(rubric.indexWeights).forEach(([indexKey, weight]) => {
                const change = symptomWeight * Math.abs(weight) * 15; // Scale the impact
                if (indexKey === 'stress_load' || indexKey === 'anxiety_severity' || indexKey === 'chronic_disease') {
                    indices[indexKey] += change;
                }
                else if (indexKey === 'sleep_quality' || indexKey === 'digestive_function' || indexKey === 'hormonal_balance' || indexKey === 'immune_reactivity' || indexKey === 'constitutional_stability') {
                    indices[indexKey] -= change;
                }
                else if (indexKey === 'vital_force') {
                    vitalForceDecrement += symptomWeight * Math.abs(weight) * 12;
                }
            });
        }
        else {
            // Fallback weight mappings if indexWeights are missing
            if (s.rubricId.includes('mind') || s.rubricId.includes('stress') || s.rubricId.includes('burnout')) {
                indices.stress_load += symptomWeight * 12;
                indices.anxiety_severity += symptomWeight * 8;
            }
            if (s.rubricId.includes('sleep') || s.rubricId.includes('insomnia')) {
                indices.sleep_quality -= symptomWeight * 15;
            }
            if (s.rubricId.includes('gerd') || s.rubricId.includes('ibs') || s.rubricId.includes('digest') || s.rubricId.includes('bloat')) {
                indices.digestive_function -= symptomWeight * 15;
            }
            vitalForceDecrement += symptomWeight * 5;
        }
    });
    // Calculate final VFI (Vital Force Status Index)
    indices.vital_force = 100 - vitalForceDecrement;
    // Round and clamp values strictly to [0, 100]
    Object.keys(indices).forEach(k => {
        indices[k] = Math.max(0, Math.min(100, Math.round(indices[k])));
    });
    return indices;
}
