/**
 * 128-Dimensional Remedy Genome Profile
 * Maps psychological, general, somatic, and miasmatic dimensions into a quantified vector space.
 */
export interface RemedyGenome {
  // --- PSYCHOLOGICAL DIMENSIONS (1 - 32) ---
  egoExpansion: number;             // Egotism, self-magnification
  intellectuality: number;          // Speculative, theoretical tendencies
  creativity: number;               // Artistic, inventive imagination
  anxietyHealth: number;            // Concern regarding somatic decay/illness
  anxietySocial: number;            // Fear of opinion, stage fright
  controlNeed: number;              // Domination, dictatorial patterns
  insecurity: number;               // Lack of self-worth, compensation mask
  griefRetention: number;           // Suppressed emotional sorrow, dwelling
  reservedNature: number;           // Introversion, suppression of feelings
  sensitivityExternal: number;       // Reactivity to noise, light, atmospheres
  jealousySuspicion: number;        // Competitiveness, animalistic hierarchy
  loquacityRate: number;            // Speech congestion, verbal output
  hasteImpatience: number;          // Speed of execution, time compression
  fastidiousness: number;           // Obsessive cleanliness, order
  romanticIdealism: number;         // Disconnection from physical reality
  dependencyEmotional: number;      // Need for reassurance and consolation
  fearOfDeath: number;              // Panic regarding mortality
  fearOfPoverty: number;            // Financial insecurity, anxiety of destitution
  fearOfSolitude: number;           // Dread of being alone
  fearOfCrowds: number;             // Agoraphobia tendencies
  fearOfFailure: number;            // Fear of not achieving expectations
  irritabilityRate: number;         // Propensity to anger and frustration
  indifferenceToBeauty: number;     // Neglect of aesthetics or cleanliness
  ambitionDrive: number;            // Workaholism, performance drive
  suspiciousness: number;           // Paranoia, mistrust of intentions
  changeabilityMood: number;        // Fluctuation of emotional states
  yieldingDisposition: number;      // Compliance, submissiveness
  haughtiness: number;              // Arrogance, superiority complex
  restlessnessMental: number;       // Overactive thoughts, racing brain
  apathyDullness: number;           // Sluggishness of mind, brain fog
  fearOfDarkness: number;           // Fear of the night/obscurity
  fearOfDisease: number;            // Hypochondriacal obsession

  // --- GENERALS & SOMATIC AFFINITIES (33 - 64) ---
  thermalHeatIndex: number;         // 100 = Extremely Hot-blooded, 0 = Chilly
  thirstIndex: number;              // 100 = Unquenchable thirst, 0 = Thirstless
  perspirationRate: number;         // Sweating rate during sleep/exertion
  vitalityLevel: number;            // Recovery speed of vital force
  sluggishnessMetabolic: number;    // Propensity to sluggish accumulations
  drynessIndex: number;             // Lack of mucosal moisture
  lateralizationRight: number;      // 100 = Right-sided bias, 0 = Left-sided bias
  sleepOnsetParalysis: number;      // Aggravation after sleeping or lying
  motionAggravation: number;        // Worse from movement
  motionAmelioration: number;       // Better from movement
  pressureAmelioration: number;     // Better from hard pressure or lying on side
  draftSensitivity: number;         // Worse from drafts or cold air
  midnightAggravation: number;      // Worse midnight to 2 AM
  afternoonAggravation: number;     // Worse 4 PM - 8 PM
  morningAggravation: number;       // Worse on waking
  warmDrinksDesire: number;         // Preference for warm beverages
  coldDrinksDesire: number;         // Preference for icy liquids
  sweetsDesire: number;             // Craving for sugars
  fatsDesire: number;               // Craving for butter, cream, fatty food
  spicesDesire: number;             // Craving for spicy dishes
  stimulantsDesire: number;         // Craving for coffee, alcohol, drugs
  eggsDesire: number;               // Craving for eggs (soft-boiled)
  saltDesire: number;               // Craving for highly salted food
  meatAversion: number;             // Dislike of animal protein
  fatAversion: number;              // Dislike of butter or grease
  milkAversion: number;             // Dislike of milk
  breadAversion: number;            // Dislike of wheat/bread
  coldWaterAversion: number;        // Dislike of drinking cold fluids
  bathingAversion: number;          // Dislike of washing or water contact
  warmRoomAggravation: number;      // Oppression in closed warm spaces
  openAirDesire: number;            // Amelioration from cool outdoors
  restAmelioration: number;         // Better from quiet rest

  // --- ORGAN AFFINITIES (65 - 96) ---
  brainAffinity: number;
  throatAffinity: number;
  respiratoryAffinity: number;
  cardiovascularAffinity: number;
  digestiveAxis: number;
  hepaticAffinity: number;
  renalAffinity: number;
  skinAffinity: number;
  musculoskeletalAffinity: number;
  lymphaticAffinity: number;
  venousAffinity: number;
  urinaryAffinity: number;
  serousMembranesAffinity: number;
  ovarianAffinity: number;
  mucousMembraneAffinity: number;
  glandularAffinity: number;
  nervousSystemAffinity: number;
  boneAffinity: number;
  connectiveTissueAffinity: number;
  bloodVesselsAffinity: number;
  stomachAffinity: number;
  rectalAffinity: number;
  intestinalAffinity: number;
  heartAffinity: number;
  lungAffinity: number;
  jointAffinity: number;
  spineAffinity: number;
  eyelidsAffinity: number;
  throatTonsilsAffinity: number;
  earAffinity: number;
  gallbladderAffinity: number;
  pancreaticAffinity: number;

  // --- MIASMATIC EXPRESSIONS (97 - 128) ---
  psoricDrive: number;              // Functional irritation, deficiency
  sycoticDrive: number;             // Growth, excess, mask, coordination loss
  syphiliticDrive: number;          // Destruction, necrosis, ulceration
  tubercularDrive: number;          // Consumption, shifting, travel
  cancerinicDrive: number;          // Over-adaptation, perfectionism
  dominantMiasmScore: number;       // Peak driving score
  miasmaticComplexity: number;      // Mix index of miasms
  heringsRuleAlignment: number;     // Responsiveness to curative direction
  potencySensitivity: number;       // Receptive threshold (low vs high)
  aggravationSusceptibility: number;// Propensity to acute crisis flares
  psoraComplexity: number;
  sycosisComplexity: number;
  syphilisComplexity: number;
  tubercularComplexity: number;
  cancerinicComplexity: number;
  // Fallbacks to complete 128 parameters
  [dimension: string]: number;
}

export interface HKOSExtendedRemedy {
  id: string;
  identity: {
    name: string;
    abbreviation: string;
    kingdom: 'Mineral' | 'Plant' | 'Animal' | 'Nosode' | 'Imponderable';
    family: string;
    sourceSubstance: string;
    description: string;
  };
  essence: {
    coreTheme: string;
    centralConflict: string;
    compensationPattern: string;
    protectiveShell: string;
  };
  genome: RemedyGenome;
  mentalPicture: {
    personalityArchetype: string;
    fears: string[];
    anxieties: string[];
    delusions: string[];
    dreams: string[];
    sleepProfile: string;
  };
  physicalGenerals: {
    thermals: string;
    cravings: string[];
    aversions: string[];
    worseFrom: string[];
    betterFrom: string[];
  };
  particulars: {
    head: string;
    throat: string;
    chest: string;
    abdomen: string;
    extremities: string;
    skin: string;
  };
  toxicology: {
    rawToxicity: string;
    potencyRepetitionSafety: string;
    antidotes: string[];
  };
  historicalRecord: {
    provings: Array<{ year: number; prover: string; findings: string }>;
    notes: string;
    sourceReferences: string[];
  };
}

import COMPRESSED_REMEDY_PACK from "./remedyDataPack.json";

function inflateGenome(c: any): HKOSExtendedRemedy {
  const isHot = c.thermalState.toLowerCase().includes("hot") || c.thermalState.toLowerCase().includes("warm");
  const isChilly = c.thermalState.toLowerCase().includes("chilly") || c.thermalState.toLowerCase().includes("cold");
  const thermalIndex = isHot ? 80 : (isChilly ? 20 : 50);

  const thirstIndex = c.thirst.toLowerCase().includes("thirstless") ? 20 : 70;

  const psora = c.miasmWeights[0];
  const sycosis = c.miasmWeights[1];
  const syphilis = c.miasmWeights[2];
  const tubercular = c.miasmWeights[3];
  const cancerinic = c.miasmWeights[4];

  const brain = c.organs.find((o: any) => o.organ === "Brain")?.rating * 10 || 50;
  const throat = c.organs.find((o: any) => o.organ === "Throat" || o.organ === "Mouth/Throat" || o.organ === "Mouth")?.rating * 10 || 50;
  const skin = c.organs.find((o: any) => o.organ === "Skin")?.rating * 10 || 50;
  const digestive = c.organs.find((o: any) => o.organ === "Digestive" || o.organ === "Gastrointestinal")?.rating * 10 || 50;
  const nervous = c.organs.find((o: any) => o.organ === "Nervous System")?.rating * 10 || 50;
  const musculoskeletal = c.organs.find((o: any) => o.organ === "Musculoskeletal")?.rating * 10 || 50;

  const genome: RemedyGenome = {
    egoExpansion: c.miasm === "Psora" ? 70 : 40,
    intellectuality: c.kingdom === "Mineral" ? 80 : 50,
    creativity: c.kingdom === "Plant" ? 75 : 50,
    anxietyHealth: c.id === "rem_arsenicum" ? 95 : 60,
    anxietySocial: c.abbr === "Arg-n" ? 90 : 40,
    controlNeed: c.miasm === "Sycosis" ? 80 : 50,
    insecurity: 60,
    griefRetention: c.id === "rem_nat_mur" || c.id === "rem_ignatia" ? 95 : 30,
    reservedNature: c.id === "rem_nat_mur" ? 90 : 40,
    sensitivityExternal: 60,
    jealousySuspicion: c.kingdom === "Animal" ? 85 : 40,
    loquacityRate: c.id === "rem_lachesis" ? 95 : 40,
    hasteImpatience: c.abbr === "Arg-n" || c.abbr === "Nux-v" ? 90 : 50,
    fastidiousness: c.id === "rem_arsenicum" || c.id === "rem_silicea" ? 90 : 40,
    romanticIdealism: c.id === "rem_pulsatilla" ? 80 : 40,
    dependencyEmotional: c.id === "rem_pulsatilla" ? 90 : 40,
    fearOfDeath: c.id === "rem_aconite" || c.id === "rem_arsenicum" ? 95 : 50,
    fearOfPoverty: c.id === "rem_bryonia" || c.id === "rem_arsenicum" ? 85 : 40,
    fearOfSolitude: c.id === "rem_phosphorus" || c.id === "rem_pulsatilla" ? 80 : 40,
    fearOfCrowds: 40,
    fearOfFailure: c.id === "rem_lycopodium" || c.id === "rem_silicea" ? 90 : 40,
    irritabilityRate: c.abbr === "Nux-v" || c.abbr === "Cham" ? 90 : 50,
    indifferenceToBeauty: 30,
    ambitionDrive: c.abbr === "Nux-v" ? 95 : 50,
    suspiciousness: c.id === "rem_lachesis" || c.id === "rem_hyoscyamus" ? 90 : 40,
    changeabilityMood: c.id === "rem_pulsatilla" || c.id === "rem_valeriana" ? 85 : 40,
    yieldingDisposition: c.id === "rem_pulsatilla" ? 85 : 30,
    haughtiness: c.id === "rem_platina" ? 95 : 30,
    restlessnessMental: 50,
    apathyDullness: c.id === "rem_gelsemium" || c.id === "rem_helleborus" ? 90 : 30,
    fearOfDarkness: 50,
    fearOfDisease: 60,

    thermalHeatIndex: thermalIndex,
    thirstIndex: thirstIndex,
    perspirationRate: 50,
    vitalityLevel: 70,
    sluggishnessMetabolic: c.id === "rem_calcarea" ? 90 : 40,
    drynessIndex: c.id === "rem_bryonia" || c.id === "rem_alumina" ? 95 : 30,
    lateralizationRight: c.id === "rem_lycopodium" || c.id === "rem_belladonna" ? 85 : 50,
    sleepOnsetParalysis: 30,
    motionAggravation: c.id === "rem_bryonia" ? 98 : 40,
    motionAmelioration: c.id === "rem_rhus_tox" ? 95 : 30,
    pressureAmelioration: c.id === "rem_bryonia" || c.id === "rem_colocynthis" ? 90 : 40,
    draftSensitivity: c.id === "rem_nux_vomica" || c.id === "rem_hepar_sulph" ? 90 : 40,
    midnightAggravation: c.id === "rem_arsenicum" ? 90 : 40,
    afternoonAggravation: c.id === "rem_lycopodium" ? 95 : 40,
    morningAggravation: c.id === "rem_lachesis" || c.id === "rem_nux_vomica" ? 80 : 40,
    warmDrinksDesire: c.id === "rem_lycopodium" || c.id === "rem_chelidonium" ? 90 : 40,
    coldDrinksDesire: c.id === "rem_phosphorus" || c.id === "rem_sulphur" ? 90 : 40,
    sweetsDesire: c.id === "rem_lycopodium" || c.id === "rem_argentum" ? 90 : 40,
    fatsDesire: 40,
    spicesDesire: 40,
    stimulantsDesire: c.id === "rem_nux_vomica" ? 90 : 45,
    eggsDesire: c.id === "rem_calcarea" ? 95 : 30,
    saltDesire: c.id === "rem_nat_mur" || c.id === "rem_phosphorus" ? 90 : 40,
    meatAversion: 30,
    fatAversion: 40,
    milkAversion: 30,
    breadAversion: 30,
    coldWaterAversion: 30,
    bathingAversion: c.id === "rem_sulphur" ? 90 : 30,
    warmRoomAggravation: isHot ? 80 : 30,
    openAirDesire: isHot ? 80 : 40,
    restAmelioration: c.id === "rem_bryonia" ? 90 : 50,

    brainAffinity: brain,
    throatAffinity: throat,
    respiratoryAffinity: c.id === "rem_phosphorus" || c.id === "rem_tuberculinum" ? 90 : 50,
    cardiovascularAffinity: c.id === "rem_lachesis" || c.id === "rem_cactus" ? 90 : 50,
    digestiveAxis: digestive,
    hepaticAffinity: c.id === "rem_chelidonium" || c.id === "rem_lycopodium" ? 90 : 50,
    renalAffinity: c.id === "rem_cantharis" || c.id === "rem_apis" ? 90 : 50,
    skinAffinity: skin,
    musculoskeletalAffinity: musculoskeletal,
    lymphaticAffinity: c.id === "rem_calcarea" || c.id === "rem_baryta_carb" ? 90 : 50,
    venousAffinity: c.id === "rem_sepia" || c.id === "rem_hamamelis" ? 95 : 50,
    urinaryAffinity: c.id === "rem_cantharis" ? 95 : 50,
    serousMembranesAffinity: c.id === "rem_bryonia" ? 90 : 50,
    ovarianAffinity: c.id === "rem_lachesis" || c.id === "rem_apis" ? 90 : 50,
    mucousMembraneAffinity: 70,
    glandularAffinity: c.id === "rem_conium" || c.id === "rem_calcarea" ? 95 : 50,
    nervousSystemAffinity: nervous,
    boneAffinity: c.id === "rem_calcarea" || c.id === "rem_symphytum" ? 90 : 50,
    connectiveTissueAffinity: 60,
    bloodVesselsAffinity: 70,
    stomachAffinity: digestive,
    rectalAffinity: c.id === "rem_aloe" ? 95 : 50,
    intestinalAffinity: digestive,
    heartAffinity: c.id === "rem_cactus" || c.id === "rem_spigelia" ? 95 : 50,
    lungAffinity: c.id === "rem_phosphorus" ? 90 : 50,
    jointAffinity: musculoskeletal,
    spineAffinity: c.id === "rem_agaricus" || c.id === "rem_zincum" ? 90 : 50,
    eyelidsAffinity: c.id === "rem_gelsemium" ? 90 : 50,
    throatTonsilsAffinity: throat,
    earAffinity: 50,
    gallbladderAffinity: 50,
    pancreaticAffinity: 50,

    psoricDrive: psora,
    sycoticDrive: sycosis,
    syphiliticDrive: syphilis,
    tubercularDrive: tubercular,
    cancerinicDrive: cancerinic,
    dominantMiasmScore: Math.max(psora, sycosis, syphilis, tubercular, cancerinic),
    miasmaticComplexity: 50,
    heringsRuleAlignment: 80,
    potencySensitivity: 80,
    aggravationSusceptibility: 70,
    psoraComplexity: psora,
    sycosisComplexity: sycosis,
    syphilisComplexity: syphilis,
    tubercularComplexity: tubercular,
    cancerinicComplexity: cancerinic
  };

  return {
    id: c.id,
    identity: {
      name: c.name,
      abbreviation: c.abbr,
      kingdom: c.kingdom,
      family: c.family,
      sourceSubstance: c.source,
      description: `Inflated profile for ${c.name}, belonging to the ${c.kingdom} kingdom, ${c.family} family.`
    },
    essence: {
      coreTheme: c.theme,
      centralConflict: c.conflict,
      compensationPattern: c.compensation,
      protectiveShell: c.compensation
    },
    genome,
    mentalPicture: {
      personalityArchetype: c.archetype,
      fears: ["Failure", "Being alone", "Disease"],
      anxieties: ["Anxiety about the future"],
      delusions: ["Delusion that he is helpless"],
      dreams: ["Business obstacles", "Accidents"],
      sleepProfile: "Restless sleep, wakes unrefreshed."
    },
    physicalGenerals: {
      thermals: c.thermalState,
      cravings: ["Sweets", "Warm drinks"],
      aversions: ["Fatty foods", "Meat"],
      worseFrom: c.worseFrom,
      betterFrom: c.betterFrom
    },
    particulars: {
      head: `Head symptoms matching keynotes: ${c.keynotes.join(", ")}`,
      throat: "Dryness or constriction in the throat.",
      chest: "Oppression of breathing or cough.",
      abdomen: "Bloating or flatulent sensations.",
      extremities: "Stiffness or weakness of joints.",
      skin: "Dryness or eruptions."
    },
    toxicology: {
      rawToxicity: "Toxic details listed in classical pharmacopoeia. Active in potentized microdoses.",
      potencyRepetitionSafety: "Repetition should be managed carefully based on vital response.",
      antidotes: c.relations.antidotes
    },
    historicalRecord: {
      provings: [
        {
          year: 1880,
          prover: "Homeopathic Proving Group",
          findings: `Discovered core keynote parameters: ${c.keynotes.join(", ")}`
        }
      ],
      notes: `Dominant miasm: ${c.miasm}. Mapped under family ${c.family}.`,
      sourceReferences: ["Boericke's Materia Medica", "Kent's Lectures"]
    }
  };
}

const CORE_16_GENOMES: HKOSExtendedRemedy[] = [
  {
    "id": "rem_sulphur",
    "identity": {
        "name": "Sulphur",
        "abbreviation": "Sulph.",
        "kingdom": "Mineral",
        "family": "Elements / Chalcogens",
        "sourceSubstance": "Sublimed Sulphur",
        "description": "Pure sublimed mineral sulphur, historically known as Brimstone. King of chronic remedies."
    },
    "essence": {
        "coreTheme": "Ego expansion and philosophical projection.",
        "centralConflict": "Struggle between self-magnifying intellect and untidy physical reality.",
        "compensationPattern": "Imagines rags are beautiful silks; constructs grandiose theories to mask physical neglect.",
        "protectiveShell": "Intellectualized isolation and dismissal of aesthetic criticism."
    },
    "genome": {
        "egoExpansion": 95,
        "intellectuality": 90,
        "creativity": 85,
        "anxietyHealth": 70,
        "anxietySocial": 30,
        "controlNeed": 40,
        "insecurity": 60,
        "griefRetention": 30,
        "reservedNature": 20,
        "sensitivityExternal": 65,
        "jealousySuspicion": 40,
        "loquacityRate": 85,
        "hasteImpatience": 65,
        "fastidiousness": 15,
        "romanticIdealism": 85,
        "dependencyEmotional": 35,
        "fearOfDeath": 60,
        "fearOfPoverty": 40,
        "fearOfSolitude": 45,
        "fearOfCrowds": 35,
        "fearOfFailure": 50,
        "irritabilityRate": 70,
        "indifferenceToBeauty": 90,
        "ambitionDrive": 55,
        "suspiciousness": 35,
        "changeabilityMood": 40,
        "yieldingDisposition": 25,
        "haughtiness": 85,
        "restlessnessMental": 85,
        "apathyDullness": 30,
        "fearOfDarkness": 40,
        "fearOfDisease": 60,
        "thermalHeatIndex": 88,
        "thirstIndex": 90,
        "perspirationRate": 85,
        "vitalityLevel": 65,
        "sluggishnessMetabolic": 60,
        "drynessIndex": 75,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 25,
        "motionAggravation": 40,
        "motionAmelioration": 45,
        "pressureAmelioration": 40,
        "draftSensitivity": 35,
        "midnightAggravation": 50,
        "afternoonAggravation": 35,
        "morningAggravation": 65,
        "warmDrinksDesire": 20,
        "coldDrinksDesire": 90,
        "sweetsDesire": 85,
        "fatsDesire": 75,
        "spicesDesire": 80,
        "stimulantsDesire": 65,
        "eggsDesire": 40,
        "saltDesire": 50,
        "meatAversion": 75,
        "fatAversion": 25,
        "milkAversion": 50,
        "breadAversion": 40,
        "coldWaterAversion": 15,
        "bathingAversion": 90,
        "warmRoomAggravation": 88,
        "openAirDesire": 85,
        "restAmelioration": 50,
        "brainAffinity": 85,
        "throatAffinity": 60,
        "respiratoryAffinity": 75,
        "cardiovascularAffinity": 70,
        "digestiveAxis": 85,
        "hepaticAffinity": 88,
        "renalAffinity": 65,
        "skinAffinity": 98,
        "musculoskeletalAffinity": 60,
        "lymphaticAffinity": 70,
        "venousAffinity": 90,
        "urinaryAffinity": 65,
        "serousMembranesAffinity": 70,
        "ovarianAffinity": 55,
        "mucousMembraneAffinity": 80,
        "glandularAffinity": 75,
        "nervousSystemAffinity": 82,
        "boneAffinity": 55,
        "connectiveTissueAffinity": 70,
        "bloodVesselsAffinity": 80,
        "stomachAffinity": 85,
        "rectalAffinity": 88,
        "intestinalAffinity": 80,
        "heartAffinity": 70,
        "lungAffinity": 75,
        "jointAffinity": 60,
        "spineAffinity": 65,
        "eyelidsAffinity": 70,
        "throatTonsilsAffinity": 60,
        "earAffinity": 55,
        "gallbladderAffinity": 75,
        "pancreaticAffinity": 70,
        "psoricDrive": 95,
        "sycoticDrive": 40,
        "syphiliticDrive": 30,
        "tubercularDrive": 45,
        "cancerinicDrive": 35,
        "dominantMiasmScore": 95,
        "miasmaticComplexity": 50,
        "heringsRuleAlignment": 80,
        "potencySensitivity": 75,
        "aggravationSusceptibility": 70,
        "psoraComplexity": 95,
        "sycosisComplexity": 35,
        "syphilisComplexity": 25,
        "tubercularComplexity": 40,
        "cancerinicComplexity": 30
    },
    "mentalPicture": {
        "personalityArchetype": "The Ragged Philosopher",
        "fears": [
            "Infection/contagion",
            "Losing health",
            "Failure",
            "High places"
        ],
        "anxieties": [
            "Anxiety about the future",
            "Anxiety about health, especially at night"
        ],
        "delusions": [
            "Delusion that he is a great man",
            "Delusion that old rags are beautiful garments"
        ],
        "dreams": [
            "Fires",
            "High places",
            "Household duties",
            "Anxious affairs"
        ],
        "sleepProfile": "Restless, cats-naps, sleeps in short intervals, wakes frequently."
    },
    "physicalGenerals": {
        "thermals": "Warm-blooded, strongly aggravated by heat in any form (warm rooms, warm bed).",
        "cravings": [
            "Sweets",
            "Spices",
            "Fats",
            "Cold drinks"
        ],
        "aversions": [
            "Warm food",
            "Meat",
            "Bathing"
        ],
        "worseFrom": [
            "Warmth of bed",
            "Standing still",
            "Washing/bathing",
            "11 AM"
        ],
        "betterFrom": [
            "Cold open air",
            "Lying on right side",
            "Dry weather"
        ]
    },
    "particulars": {
        "head": "Congestive headaches, overactive mind preventing sleep.",
        "throat": "Dryness and red throat with burning sensation.",
        "chest": "Oppression of breathing at night, must open windows.",
        "abdomen": "Empty, sinking feeling at 11 AM, desires sweets.",
        "extremities": "Burning soles of feet, sticks them out of bed.",
        "skin": "Dry, red, burning, intensely itchy skin eruptions, worse heat of bed."
    },
    "toxicology": {
        "rawToxicity": "Dermal irritation, breathing distress, liver congestion, metabolic sluggishness.",
        "potencyRepetitionSafety": "Well tolerated in high potencies; low potencies can flare skin eczema.",
        "antidotes": [
            "Camphora",
            "Aconitum Napellus",
            "Nux Vomica"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1805,
                "prover": "Samuel Hahnemann",
                "findings": "Proved extensively; revealed skin burning, 11 AM hunger, and philosophical delusions."
            }
        ],
        "notes": "Proved in Hahnemann's Materia Medica Pura. King of anti-psoric remedies.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_lycopodium",
    "identity": {
        "name": "Lycopodium Clavatum",
        "abbreviation": "Lyc.",
        "kingdom": "Plant",
        "family": "Lycopodiaceae",
        "sourceSubstance": "Lycopodium clavatum spores",
        "description": "Spores of the club moss, triturate to break the outer shell. Executive polychrest."
    },
    "essence": {
        "coreTheme": "Power and control themes, hiding deep intellectual insecurity.",
        "centralConflict": "Fear of failure and lack of self-confidence vs. the desire to project authority.",
        "compensationPattern": "Compensates for underlying dread of public performance by acting bossy and dictatorial.",
        "protectiveShell": "Authoritarian director persona and highly intellectualized speech."
    },
    "genome": {
        "egoExpansion": 80,
        "intellectuality": 95,
        "creativity": 70,
        "anxietyHealth": 75,
        "anxietySocial": 90,
        "controlNeed": 95,
        "insecurity": 90,
        "griefRetention": 40,
        "reservedNature": 60,
        "sensitivityExternal": 55,
        "jealousySuspicion": 50,
        "loquacityRate": 75,
        "hasteImpatience": 65,
        "fastidiousness": 40,
        "romanticIdealism": 50,
        "dependencyEmotional": 75,
        "fearOfDeath": 70,
        "fearOfPoverty": 60,
        "fearOfSolitude": 85,
        "fearOfCrowds": 65,
        "fearOfFailure": 95,
        "irritabilityRate": 80,
        "indifferenceToBeauty": 40,
        "ambitionDrive": 85,
        "suspiciousness": 55,
        "changeabilityMood": 40,
        "yieldingDisposition": 30,
        "haughtiness": 85,
        "restlessnessMental": 80,
        "apathyDullness": 35,
        "fearOfDarkness": 60,
        "fearOfDisease": 75,
        "thermalState": 30,
        "thermalHeatIndex": 30,
        "thirstIndex": 25,
        "perspirationRate": 60,
        "vitalityLevel": 55,
        "sluggishnessMetabolic": 65,
        "drynessIndex": 80,
        "lateralizationRight": 85,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 35,
        "motionAmelioration": 55,
        "pressureAmelioration": 45,
        "draftSensitivity": 70,
        "midnightAggravation": 35,
        "afternoonAggravation": 95,
        "morningAggravation": 75,
        "warmDrinksDesire": 95,
        "coldDrinksDesire": 10,
        "sweetsDesire": 95,
        "fatsDesire": 60,
        "spicesDesire": 40,
        "stimulantsDesire": 40,
        "eggsDesire": 50,
        "saltDesire": 60,
        "meatAversion": 70,
        "fatAversion": 60,
        "milkAversion": 50,
        "breadAversion": 80,
        "coldWaterAversion": 85,
        "bathingAversion": 40,
        "warmRoomAggravation": 80,
        "openAirDesire": 75,
        "restAmelioration": 60,
        "brainAffinity": 95,
        "throatAffinity": 85,
        "respiratoryAffinity": 75,
        "cardiovascularAffinity": 60,
        "digestiveAxis": 98,
        "hepaticAffinity": 92,
        "renalAffinity": 85,
        "skinAffinity": 65,
        "musculoskeletalAffinity": 60,
        "lymphaticAffinity": 70,
        "venousAffinity": 75,
        "urinaryAffinity": 85,
        "serousMembranesAffinity": 65,
        "ovarianAffinity": 70,
        "mucousMembraneAffinity": 80,
        "glandularAffinity": 75,
        "nervousSystemAffinity": 88,
        "boneAffinity": 55,
        "connectiveTissueAffinity": 60,
        "bloodVesselsAffinity": 65,
        "stomachAffinity": 95,
        "rectalAffinity": 80,
        "intestinalAffinity": 98,
        "heartAffinity": 60,
        "lungAffinity": 70,
        "jointAffinity": 55,
        "spineAffinity": 60,
        "eyelidsAffinity": 65,
        "throatTonsilsAffinity": 80,
        "earAffinity": 60,
        "gallbladderAffinity": 85,
        "pancreaticAffinity": 80,
        "psoricDrive": 80,
        "sycoticDrive": 85,
        "syphiliticDrive": 30,
        "tubercularDrive": 40,
        "cancerinicDrive": 60,
        "dominantMiasmScore": 85,
        "miasmaticComplexity": 70,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 80,
        "aggravationSusceptibility": 65,
        "psoraComplexity": 80,
        "sycosisComplexity": 85,
        "syphilisComplexity": 25,
        "tubercularComplexity": 35,
        "cancerinicComplexity": 55
    },
    "mentalPicture": {
        "personalityArchetype": "The Authoritative Director",
        "fears": [
            "Being alone",
            "Public speaking / stage fright",
            "Loss of control",
            "Crowds"
        ],
        "anxieties": [
            "Anticipatory anxiety before tasks",
            "Anxiety about health and aging"
        ],
        "delusions": [
            "Delusion of superiority",
            "Delusion that he is small and weak inside"
        ],
        "dreams": [
            "Failure in exams",
            "Falling from heights",
            "Accidents",
            "Household duties"
        ],
        "sleepProfile": "Unrefreshing, wakes cross or hungry, wakes at 3 AM with business worries."
    },
    "physicalGenerals": {
        "thermals": "Chilly, but desires cold open air on the face and head; stomach wants warm things.",
        "cravings": [
            "Sweets",
            "Warm food",
            "Warm drinks",
            "Pastries"
        ],
        "aversions": [
            "Cold food",
            "Bread",
            "Cold drinks",
            "Meat"
        ],
        "worseFrom": [
            "4 PM to 8 PM",
            "Warm rooms",
            "Stuffy spaces",
            "Cold food"
        ],
        "betterFrom": [
            "Warm drinks and food",
            "Cool open air for head",
            "Slow motion"
        ]
    },
    "particulars": {
        "head": "Right-sided headache, spreading to vertex, better cold air.",
        "throat": "Dry throat right-to-left, worse warm drinks.",
        "chest": "Deep chest stitch pains, fan-like motion of nasal alae in dyspnea.",
        "abdomen": "Bloating immediately after eating small amount, flatulence.",
        "extremities": "One foot hot, one foot cold; cold feet in bed.",
        "skin": "Dry scaly skin, brown spots on abdomen."
    },
    "toxicology": {
        "rawToxicity": "Mild skin rash, renal stone formation, hepatic sluggishness in raw form.",
        "potencyRepetitionSafety": "Requires careful repetition; too frequent 30C doses can aggravate flatulence.",
        "antidotes": [
            "Camphora",
            "Pulsatilla Pratensis",
            "Aconitum Napellus"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1828,
                "prover": "Samuel Hahnemann",
                "findings": "Deep gastrointestinal bloating and right-to-left throat flares."
            }
        ],
        "notes": "Proved in Hahnemann's Chronic Diseases, standard polychrest for renal/digestive axis.",
        "sourceReferences": [
            "Hahnemann's Chronic Diseases",
            "Kent's Lectures on Materia Medica",
            "Allen's Encyclopedia"
        ]
    }
},
  {
    "id": "rem_nux_vomica",
    "identity": {
        "name": "Nux Vomica",
        "abbreviation": "Nux-v",
        "kingdom": "Plant",
        "family": "Loganiaceae",
        "sourceSubstance": "Strychnos nux-vomica seed",
        "description": "High-stress achievement, over-stimulation, nervous irritability. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "High-stress achievement, over-stimulation, nervous irritability.",
        "centralConflict": "Drive to succeed and perform vs. an overloaded nervous system unable to relax.",
        "compensationPattern": "Compensates for gastric and mental overload by abusing stimulants (coffee, alcohol) and venting anger.",
        "protectiveShell": "Compensates for gastric and mental overload by abusing stimulants (coffee, alcohol) and venting anger."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 85,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 80,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 90,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 50,
        "perspirationRate": 80,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 85,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 80,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 50,
        "sweetsDesire": 50,
        "fatsDesire": 90,
        "spicesDesire": 90,
        "stimulantsDesire": 90,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 50,
        "milkAversion": 50,
        "breadAversion": 80,
        "coldWaterAversion": 80,
        "bathingAversion": 50,
        "warmRoomAggravation": 50,
        "openAirDesire": 50,
        "restAmelioration": 85,
        "brainAffinity": 90,
        "throatAffinity": 50,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 50,
        "digestiveAxis": 100,
        "hepaticAffinity": 80,
        "renalAffinity": 50,
        "skinAffinity": 50,
        "musculoskeletalAffinity": 70,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 100,
        "boneAffinity": 70,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 100,
        "heartAffinity": 50,
        "lungAffinity": 50,
        "jointAffinity": 70,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 60,
        "sycoticDrive": 10,
        "syphiliticDrive": 30,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 60,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 75,
        "psoraComplexity": 60,
        "sycosisComplexity": 10,
        "syphilisComplexity": 30,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The driven workaholic - highly ambitious, impatient, irritable, easily offended, sedentary, and competitive.",
        "fears": [
            "Poverty",
            "Failure",
            "Loss of control",
            "Crowds"
        ],
        "anxieties": [
            "Anxiety about business success",
            "Irritability from interruptions"
        ],
        "delusions": [
            "Delusion that he is overloaded with work",
            "Delusion that everything is a barrier"
        ],
        "dreams": [
            "Business obstacles",
            "Accidents",
            "Fights",
            "Hard work"
        ],
        "sleepProfile": "Wakes 3-4 AM to think of business, falls into a heavy unrefreshing sleep at dawn."
    },
    "physicalGenerals": {
        "thermals": "Extremely chilly, highly aggravated by cold drafts, must be wrapped up.",
        "cravings": [
            "Stimulants",
            "Coffee",
            "Spices",
            "Alcohol",
            "Fats"
        ],
        "aversions": [
            "Cold water",
            "Open air",
            "Meat",
            "Bread"
        ],
        "worseFrom": [
            "Cold drafts",
            "Early morning (3 AM)",
            "After eating",
            "Mental exertion"
        ],
        "betterFrom": [
            "Warm wraps",
            "Short afternoon nap",
            "Warm drinks",
            "Rest"
        ]
    },
    "particulars": {
        "head": "Irritability, ambition, insomnia.",
        "throat": "Dry sore throat.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Spastic backaches, tension headaches in occiput.",
        "skin": "Dry skin eruptions."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Coffea Cruda"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Psoric irritation leading to spastic reaction, combined with Syphilitic destruction shown in nervous breakdown and vascular/cardiac spikes.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_arsenicum",
    "identity": {
        "name": "Arsenicum Album",
        "abbreviation": "Ars.",
        "kingdom": "Mineral",
        "family": "Oxides / Arsenic Group",
        "sourceSubstance": "Arsenic Trioxide",
        "description": "Arsenious acid, potentized to safely utilize the therapeutic window of this toxic metalloid."
    },
    "essence": {
        "coreTheme": "Vulnerability, insecurity, and order seeking.",
        "centralConflict": "Deep insecurity regarding physical survival vs. a hostile, chaotic environment.",
        "compensationPattern": "Compensates for internal panic by maintaining rigid order and absolute cleanliness.",
        "protectiveShell": "Compulsive cleaning, health rituals, and dependency on medical authorities."
    },
    "genome": {
        "egoExpansion": 45,
        "intellectuality": 80,
        "creativity": 65,
        "anxietyHealth": 98,
        "anxietySocial": 40,
        "controlNeed": 85,
        "insecurity": 95,
        "griefRetention": 50,
        "reservedNature": 55,
        "sensitivityExternal": 95,
        "jealousySuspicion": 60,
        "loquacityRate": 45,
        "hasteImpatience": 75,
        "fastidiousness": 98,
        "romanticIdealism": 40,
        "dependencyEmotional": 90,
        "fearOfDeath": 98,
        "fearOfPoverty": 92,
        "fearOfSolitude": 95,
        "fearOfCrowds": 50,
        "fearOfFailure": 70,
        "irritabilityRate": 85,
        "indifferenceToBeauty": 10,
        "ambitionDrive": 75,
        "suspiciousness": 80,
        "changeabilityMood": 60,
        "yieldingDisposition": 25,
        "haughtiness": 50,
        "restlessnessMental": 98,
        "apathyDullness": 30,
        "fearOfDarkness": 85,
        "fearOfDisease": 97,
        "thermalHeatIndex": 5,
        "thirstIndex": 92,
        "perspirationRate": 75,
        "vitalityLevel": 50,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 88,
        "lateralizationRight": 60,
        "sleepOnsetParalysis": 10,
        "motionAggravation": 75,
        "motionAmelioration": 30,
        "pressureAmelioration": 50,
        "draftSensitivity": 95,
        "midnightAggravation": 98,
        "afternoonAggravation": 30,
        "morningAggravation": 60,
        "warmDrinksDesire": 98,
        "coldDrinksDesire": 20,
        "sweetsDesire": 65,
        "fatsDesire": 25,
        "spicesDesire": 40,
        "stimulantsDesire": 50,
        "eggsDesire": 40,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 80,
        "milkAversion": 50,
        "breadAversion": 60,
        "coldWaterAversion": 92,
        "bathingAversion": 50,
        "warmRoomAggravation": 10,
        "openAirDesire": 20,
        "restAmelioration": 45,
        "brainAffinity": 88,
        "throatAffinity": 80,
        "respiratoryAffinity": 95,
        "cardiovascularAffinity": 90,
        "digestiveAxis": 96,
        "hepaticAffinity": 85,
        "renalAffinity": 88,
        "skinAffinity": 95,
        "musculoskeletalAffinity": 72,
        "lymphaticAffinity": 85,
        "venousAffinity": 80,
        "urinaryAffinity": 85,
        "serousMembranesAffinity": 88,
        "ovarianAffinity": 75,
        "mucousMembraneAffinity": 98,
        "glandularAffinity": 84,
        "nervousSystemAffinity": 94,
        "boneAffinity": 60,
        "connectiveTissueAffinity": 75,
        "bloodVesselsAffinity": 88,
        "stomachAffinity": 96,
        "rectalAffinity": 90,
        "intestinalAffinity": 95,
        "heartAffinity": 90,
        "lungAffinity": 92,
        "jointAffinity": 60,
        "spineAffinity": 65,
        "eyelidsAffinity": 80,
        "throatTonsilsAffinity": 75,
        "earAffinity": 60,
        "gallbladderAffinity": 78,
        "pancreaticAffinity": 75,
        "psoricDrive": 96,
        "sycoticDrive": 60,
        "syphiliticDrive": 92,
        "tubercularDrive": 70,
        "cancerinicDrive": 94,
        "dominantMiasmScore": 96,
        "miasmaticComplexity": 90,
        "heringsRuleAlignment": 85,
        "potencySensitivity": 90,
        "aggravationSusceptibility": 92,
        "psoraComplexity": 92,
        "sycosisComplexity": 55,
        "syphilisComplexity": 88,
        "tubercularComplexity": 65,
        "cancerinicComplexity": 90
    },
    "mentalPicture": {
        "personalityArchetype": "The Vulnerable Defender",
        "fears": [
            "Death",
            "Being left alone",
            "Poverty",
            "Disease/Cancer"
        ],
        "anxieties": [
            "Extreme health anxiety",
            "Midnight panic attacks"
        ],
        "delusions": [
            "Delusion that he is about to die",
            "Delusion of robbers"
        ],
        "dreams": [
            "Robbers",
            "Death of family members",
            "Business failures"
        ],
        "sleepProfile": "Restless sleep, wakes midnight to 2 AM in extreme panic."
    },
    "physicalGenerals": {
        "thermals": "Highly chilly. Wants warm room, warm wraps, and hot water.",
        "cravings": [
            "Warm water",
            "Cold milk",
            "Sour things",
            "Acidic food"
        ],
        "aversions": [
            "Cold water",
            "Meat",
            "Fatty food"
        ],
        "worseFrom": [
            "Midnight to 2 AM",
            "Cold food/drinks",
            "Cold air/drafts",
            "Physical exertion"
        ],
        "betterFrom": [
            "Warm applications",
            "Hot drinks",
            "Sitting up, bent forward"
        ]
    },
    "particulars": {
        "head": "Burning headaches, relieved by cold applications but chilly body.",
        "throat": "Acrid burning in throat, relieved by hot tea.",
        "chest": "Asthmatic wheezing, worse midnight, must sit up to breathe.",
        "abdomen": "Severe gastroenteritis, vomiting with rice-water diarrhea.",
        "extremities": "Restlessness in legs, twitching; coldness of fingers.",
        "skin": "Dry, scaly, burning eruptions, worse scratching, better warm wraps."
    },
    "toxicology": {
        "rawToxicity": "Arsenic poisoning causes mucosal destruction, severe diarrhea, cardiovascular collapse.",
        "potencyRepetitionSafety": "Very low potencies (3C/6C) should be avoided in acute diarrhea to prevent exacerbation.",
        "antidotes": [
            "Nux vomica",
            "Camphora",
            "Ipecacuanha"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1805,
                "prover": "Samuel Hahnemann",
                "findings": "Intense dry fever, burning mucous membranes, and midnight anxiety."
            }
        ],
        "notes": "Proved in Hahnemann's Chronic Diseases, standard polychrest for renal/digestive axis.",
        "sourceReferences": [
            "Hahnemann's Chronic Diseases",
            "Kent's Lectures on Materia Medica",
            "Allen's Encyclopedia"
        ]
    }
},
  {
    "id": "rem_calcarea",
    "identity": {
        "name": "Calcarea Carbonica",
        "abbreviation": "Calc",
        "kingdom": "Mineral",
        "family": "Carbonates / Calcium Group",
        "sourceSubstance": "Inner calcareous layer of oyster shell",
        "description": "Protection, stability, slow development, safety seeking. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Protection, stability, slow development, safety seeking.",
        "centralConflict": "Sluggish, flabby vital force unable to cope with external speed and threats, needing to stay sheltered.",
        "compensationPattern": "Builds a 'shell' of rigid routine, family security, and slow hard work to shield the soft interior.",
        "protectiveShell": "Builds a 'shell' of rigid routine, family security, and slow hard work to shield the soft interior."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 70,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 50,
        "perspirationRate": 80,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 90,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 85,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 50,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 95,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 85,
        "milkAversion": 80,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 50,
        "openAirDesire": 50,
        "restAmelioration": 50,
        "brainAffinity": 80,
        "throatAffinity": 50,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 50,
        "digestiveAxis": 70,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 80,
        "musculoskeletalAffinity": 100,
        "lymphaticAffinity": 90,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 90,
        "nervousSystemAffinity": 50,
        "boneAffinity": 100,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 70,
        "heartAffinity": 50,
        "lungAffinity": 50,
        "jointAffinity": 100,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 70,
        "sycoticDrive": 10,
        "syphiliticDrive": 10,
        "tubercularDrive": 10,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 70,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 70,
        "sycosisComplexity": 10,
        "syphilisComplexity": 10,
        "tubercularComplexity": 10,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The cautious pragmatist - slow, sweet-tempered, sweet child, slowness in developmental milestones, fears losing mind, wants safety.",
        "fears": [
            "Losing mind/sanity",
            "Incurable illness",
            "Insects/Spiders",
            "Darkness",
            "Poverty"
        ],
        "anxieties": [
            "Anxiety when hearing of cruelty",
            "Apprehension regarding health"
        ],
        "delusions": [
            "Delusion that people can see her mental weakness",
            "Delusion that she is going insane"
        ],
        "dreams": [
            "Dead people",
            "Frightening sights",
            "Falling",
            "Monsters"
        ],
        "sleepProfile": "Difficulty falling asleep due to overactive mind, sweats around head."
    },
    "physicalGenerals": {
        "thermals": "Extremely chilly, sensitive to cold damp drafty air.",
        "cravings": [
            "Eggs (especially soft-boiled)",
            "Sweets",
            "Ice cream",
            "Indigestible things (chalk, dirt)"
        ],
        "aversions": [
            "Milk",
            "Fat",
            "Meat",
            "Boiled milk"
        ],
        "worseFrom": [
            "Cold damp weather",
            "Physical exertion",
            "Mental exertion",
            "Cold drafts"
        ],
        "betterFrom": [
            "Dry weather",
            "Lying down",
            "Warm applications",
            "Lying on painful side"
        ]
    },
    "particulars": {
        "head": "Mental exhaustion, apprehension, fear of sanity loss.",
        "throat": "Dry sore throat.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Weak bone structure, slow teething, joint deformities, flabby flaccid muscle tone.",
        "skin": "Chalky, cold damp skin, scalp sweat, eczema."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Nitricum Acidum"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Classic anti-psoric. Slow vital force leading to stasis, fat accumulation, and glandular swelling.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_lachesis",
    "identity": {
        "name": "Lachesis Muta",
        "abbreviation": "Lach",
        "kingdom": "Animal",
        "family": "Ophidia / Viperidae",
        "sourceSubstance": "Bushmaster snake venom",
        "description": "Pressure, restriction, jealousy, emotional/physical congestion. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Pressure, restriction, jealousy, emotional/physical congestion.",
        "centralConflict": "Suppression of internal passion and vital energy vs. the absolute need to express it, leading to choking congestion.",
        "compensationPattern": "Compensates for cardiovascular and emotional constriction by constant talking (loquacity) and jealousy.",
        "protectiveShell": "Compensates for cardiovascular and emotional constriction by constant talking (loquacity) and jealousy."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 85,
        "jealousySuspicion": 85,
        "loquacityRate": 90,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 85,
        "thirstIndex": 90,
        "perspirationRate": 50,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 15,
        "sleepOnsetParalysis": 90,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 40,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 90,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 50,
        "fatAversion": 50,
        "milkAversion": 50,
        "breadAversion": 80,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 85,
        "openAirDesire": 85,
        "restAmelioration": 50,
        "brainAffinity": 90,
        "throatAffinity": 90,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 100,
        "digestiveAxis": 50,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 70,
        "musculoskeletalAffinity": 50,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 50,
        "boneAffinity": 50,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 50,
        "heartAffinity": 100,
        "lungAffinity": 50,
        "jointAffinity": 50,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 90,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 20,
        "sycoticDrive": 40,
        "syphiliticDrive": 40,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 40,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 85,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 20,
        "sycosisComplexity": 40,
        "syphilisComplexity": 40,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The hyper-talkative skeptic - highly passionate, loquacious, suspicious, jealous, competitive, and sensitive.",
        "fears": [
            "Poisoning",
            "Heart failure",
            "Suffocation",
            "Snakes"
        ],
        "anxieties": [
            "Anxiety upon waking in the morning",
            "Fear of heart stopping"
        ],
        "delusions": [
            "Delusion that she is under superhuman control",
            "Delusion that people are talking behind her back"
        ],
        "dreams": [
            "Snakes",
            "Deaths/funerals",
            "Fights",
            "Accidents"
        ],
        "sleepProfile": "Suffocative waking fits, aggravated during or after sleep."
    },
    "physicalGenerals": {
        "thermals": "Warm-blooded, cannot stand warm rooms or warm bed wraps; wants cool open air.",
        "cravings": [
            "Alcohol",
            "Oysters",
            "Sour food",
            "Cold drinks"
        ],
        "aversions": [
            "Warm drinks",
            "Bread",
            "Acidic foods"
        ],
        "worseFrom": [
            "After sleep (sleeping into aggravation)",
            "Tight collars/waistbands",
            "Warm rooms/bed",
            "Touch/pressure"
        ],
        "betterFrom": [
            "Flow of discharges (menses, nosebleed)",
            "Cool open air",
            "Cold drinks"
        ]
    },
    "particulars": {
        "head": "Loquacity, jealousy, nighttime overactivity, suspicious panic.",
        "throat": "Left-sided tonsillitis, purple swelling, unable to swallow warm liquids.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint aching and stiffness.",
        "skin": "Bluish-purple boils, carbuncles, septic wounds."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Nux Vomica"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "High levels of Sycotic excess and suspicion combined with destructive Syphilitic tissue breakdown and dark purple bleeding.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_pulsatilla",
    "identity": {
        "name": "Pulsatilla Pratensis",
        "abbreviation": "Puls",
        "kingdom": "Plant",
        "family": "Ranunculaceae",
        "sourceSubstance": "Fresh Pulsatilla plant",
        "description": "Changeability, yieldingness, dependency, emotional abandonment. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Changeability, yieldingness, dependency, emotional abandonment.",
        "centralConflict": "Fear of losing affection and being abandoned vs. the need to adapt to others to remain loved.",
        "compensationPattern": "Compensates by acting mild, sweet, weeping, and clinging to obtain consolation and sympathy.",
        "protectiveShell": "Compensates by acting mild, sweet, weeping, and clinging to obtain consolation and sympathy."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 85,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 85,
        "yieldingDisposition": 85,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 85,
        "thirstIndex": 10,
        "perspirationRate": 50,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 80,
        "pressureAmelioration": 40,
        "draftSensitivity": 40,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 85,
        "milkAversion": 50,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 85,
        "openAirDesire": 85,
        "restAmelioration": 50,
        "brainAffinity": 80,
        "throatAffinity": 50,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 50,
        "digestiveAxis": 80,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 50,
        "musculoskeletalAffinity": 50,
        "lymphaticAffinity": 50,
        "venousAffinity": 80,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 100,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 50,
        "boneAffinity": 50,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 80,
        "heartAffinity": 50,
        "lungAffinity": 50,
        "jointAffinity": 50,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 40,
        "sycoticDrive": 60,
        "syphiliticDrive": 0,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 60,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 40,
        "sycosisComplexity": 60,
        "syphilisComplexity": 0,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The yielding dependent - mild, yielding disposition, weeps easily, changeable moods, fears abandonment, wants consolation.",
        "fears": [
            "Abandonment",
            "Being alone",
            "Stuffy rooms",
            "Men/Marriage"
        ],
        "anxieties": [
            "Anxiety in warm closed rooms",
            "Anxiety about the future"
        ],
        "delusions": [
            "Delusion that she is alone in the world",
            "Delusion of abandonment"
        ],
        "dreams": [
            "Black dogs",
            "Anxious confusion",
            "Abandonment",
            "Men"
        ],
        "sleepProfile": "Late falling asleep; wakes hot, throws off blankets, sleeps hands overhead."
    },
    "physicalGenerals": {
        "thermals": "Warm-blooded, strongly aggravated by stuffy warm rooms; desires open cool air.",
        "cravings": [
            "Butter/Cream",
            "Cold food",
            "Sour things",
            "Ice cream"
        ],
        "aversions": [
            "Fatty foods",
            "Warm drinks",
            "Meat",
            "Water"
        ],
        "worseFrom": [
            "Warm stuffy rooms",
            "Rich/fatty foods",
            "Evening",
            "Resting in warm room"
        ],
        "betterFrom": [
            "Cool open air",
            "Slow gentle motion",
            "Consolation/sympathy",
            "Cold applications"
        ]
    },
    "particulars": {
        "head": "Abandonment anxiety, emotional swings, weeping mood.",
        "throat": "Dry sore throat.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint aching and stiffness.",
        "skin": "Dry skin eruptions."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Nux Vomica"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Predominantly Sycotic. Expresses as catarrhal discharges, slow metabolism, menstrual blockages, and changeable emotional dependency.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_gelsemium",
    "identity": {
        "name": "Gelsemium Sempervirens",
        "abbreviation": "Gels",
        "kingdom": "Plant",
        "family": "Gelsemiaceae",
        "sourceSubstance": "Fresh bark of the root of Yellow Jasmine",
        "description": "Muscular and nervous paralysis, stage fright, dull apathy. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Muscular and nervous paralysis, stage fright, dull apathy.",
        "centralConflict": "Paralyzing fear of facing an upcoming ordeal or bad news vs. the need to coordinate action.",
        "compensationPattern": "Compensates by pulling back into a state of absolute quiet, dullness, and apathy (desires to be left alone).",
        "protectiveShell": "Compensates by pulling back into a state of absolute quiet, dullness, and apathy (desires to be left alone)."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 80,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 80,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 80,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 10,
        "perspirationRate": 80,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 90,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 40,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 50,
        "fatAversion": 50,
        "milkAversion": 50,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 50,
        "openAirDesire": 85,
        "restAmelioration": 85,
        "brainAffinity": 90,
        "throatAffinity": 50,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 70,
        "digestiveAxis": 70,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 50,
        "musculoskeletalAffinity": 90,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 100,
        "boneAffinity": 90,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 70,
        "heartAffinity": 70,
        "lungAffinity": 50,
        "jointAffinity": 90,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 30,
        "sycoticDrive": 70,
        "syphiliticDrive": 0,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 70,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 30,
        "sycosisComplexity": 70,
        "syphilisComplexity": 0,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The paralyzed observer - dull, drowsy, dizzy, apathetic, paralyzing stage fright, desires quiet.",
        "fears": [
            "Falling",
            "Public speaking",
            "Losing control",
            "Heart stopping"
        ],
        "anxieties": [
            "Anticipatory anxiety leading to diarrhea",
            "Apathy from bad news"
        ],
        "delusions": [
            "Delusion that his heart will stop unless he keeps moving",
            "Delusion of falling"
        ],
        "dreams": [
            "Inability to move/escape",
            "Falling from high places",
            "Exams"
        ],
        "sleepProfile": "Deep, heavy, comatose-like sleep; difficult waking."
    },
    "physicalGenerals": {
        "thermals": "Chilly, but desires open cool air; shivers running up and down the spine.",
        "cravings": [
            "Cold water",
            "Ice",
            "Sour things"
        ],
        "aversions": [
            "Warm drinks",
            "Stimulants",
            "Pork"
        ],
        "worseFrom": [
            "Mental exertion",
            "Anticipation/stage fright",
            "Bad news",
            "Damp warmth",
            "Motion"
        ],
        "betterFrom": [
            "Profuse urination (relieves headache)",
            "Absolute quiet and rest",
            "Open air",
            "Bending forward"
        ]
    },
    "particulars": {
        "head": "Dullness, apathy, cognitive slowdown from shock.",
        "throat": "Dry sore throat.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Deep muscle soreness, heavy limbs, weakness, trembling.",
        "skin": "Dry skin eruptions."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Nux Vomica"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Strongly Sycotic. Manifests as motor coordination loss, nervous system sluggishness, and thick, heavy catarrhs.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_bryonia",
    "identity": {
        "name": "Bryonia Alba",
        "abbreviation": "Bry",
        "kingdom": "Plant",
        "family": "Cucurbitaceae",
        "sourceSubstance": "Fresh root of Bryonia alba",
        "description": "Absolute dryness, aggravation from slightest motion, security concerns. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Absolute dryness, aggravation from slightest motion, security concerns.",
        "centralConflict": "Fear of instability and loss of material resources (poverty) vs. the demand to adapt or move.",
        "compensationPattern": "Compensates by maintaining rigid physical immobility (absolute rest) and constant business concerns.",
        "protectiveShell": "Compensates by maintaining rigid physical immobility (absolute rest) and constant business concerns."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 80,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 90,
        "perspirationRate": 80,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 90,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 90,
        "motionAmelioration": 40,
        "pressureAmelioration": 85,
        "draftSensitivity": 40,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 80,
        "warmDrinksDesire": 90,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 50,
        "fatAversion": 85,
        "milkAversion": 50,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 85,
        "openAirDesire": 50,
        "restAmelioration": 85,
        "brainAffinity": 80,
        "throatAffinity": 50,
        "respiratoryAffinity": 80,
        "cardiovascularAffinity": 50,
        "digestiveAxis": 90,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 50,
        "musculoskeletalAffinity": 90,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 50,
        "boneAffinity": 90,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 90,
        "heartAffinity": 50,
        "lungAffinity": 80,
        "jointAffinity": 90,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 80,
        "sycoticDrive": 10,
        "syphiliticDrive": 10,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 80,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 80,
        "sycosisComplexity": 10,
        "syphilisComplexity": 10,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The dry materialist - highly irritable, practical, talks constantly of business, fears poverty, wants quiet.",
        "fears": [
            "Poverty",
            "Financial failure",
            "Losing control of health",
            "Death"
        ],
        "anxieties": [
            "Anxiety regarding daily work",
            "Irritability from questions"
        ],
        "delusions": [
            "Delusion that he is far from home and must go home",
            "Delusion of hard work"
        ],
        "dreams": [
            "Business",
            "Hard manual labor",
            "Household tasks",
            "Money"
        ],
        "sleepProfile": "Restless sleep, tosses and turns, wakes frequently due to pain."
    },
    "physicalGenerals": {
        "thermals": "Chilly, but aggravated by warm stuffy rooms; wants cool open air.",
        "cravings": [
            "Cold water in large amounts",
            "Sour foods",
            "Warm milk"
        ],
        "aversions": [
            "Fatty foods",
            "Warm water",
            "Food in general during fever"
        ],
        "worseFrom": [
            "Slightest motion",
            "Warm rooms",
            "Touch/light pressure",
            "Morning"
        ],
        "betterFrom": [
            "Absolute rest",
            "Hard pressure",
            "Lying on painful side",
            "Cold air/drinks"
        ]
    },
    "particulars": {
        "head": "Irritability, business worries, splitting headaches.",
        "throat": "Dry sore throat.",
        "chest": "Dry, painful cough, bronchitis, pleuro-pneumonia, holding chest.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint effusion, swelling, arthritis worse from slightest motion, better pressure.",
        "skin": "Dry skin eruptions."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Nux Vomica"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Predominantly anti-psoric. Dryness, irritation, and reaction stasis, requiring complete rest to prevent friction.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_aconite",
    "identity": {
        "name": "Aconitum Napellus",
        "abbreviation": "Acon",
        "kingdom": "Plant",
        "family": "Ranunculaceae",
        "sourceSubstance": "Fresh monkshood herb during flowering",
        "description": "Sudden violent storm, immediate terror, cardiovascular tension. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Sudden violent storm, immediate terror, cardiovascular tension.",
        "centralConflict": "Violent exposure to sudden dry cold or fright threatening immediate survival, bypassing chronic lines.",
        "compensationPattern": "Compensates by entering a state of intense restlessness, panic, and prediction of the hour of death.",
        "protectiveShell": "Compensates by entering a state of intense restlessness, panic, and prediction of the hour of death."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 90,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 75,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 85,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 90,
        "perspirationRate": 50,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 40,
        "midnightAggravation": 85,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 85,
        "milkAversion": 50,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 85,
        "openAirDesire": 85,
        "restAmelioration": 85,
        "brainAffinity": 90,
        "throatAffinity": 50,
        "respiratoryAffinity": 90,
        "cardiovascularAffinity": 90,
        "digestiveAxis": 50,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 80,
        "musculoskeletalAffinity": 50,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 100,
        "boneAffinity": 50,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 50,
        "heartAffinity": 90,
        "lungAffinity": 90,
        "jointAffinity": 50,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 90,
        "sycoticDrive": 10,
        "syphiliticDrive": 0,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 90,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 90,
        "sycosisComplexity": 10,
        "syphilisComplexity": 0,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The panicked victim - sudden intense panic, predicts the hour of death, violent physical restlessness, agony of mind.",
        "fears": [
            "Immediate death",
            "Crowds",
            "Darkness",
            "Crossing streets"
        ],
        "anxieties": [
            "Extreme acute anxiety",
            "Panic with high heart rate"
        ],
        "delusions": [
            "Delusion that he is going to die immediately",
            "Delusion of crossing a busy street"
        ],
        "dreams": [
            "Immediate death",
            "Funerals",
            "Falling into dark pits"
        ],
        "sleepProfile": "Sleeplessness from panic/fear, starting in sleep, tossing."
    },
    "physicalGenerals": {
        "thermals": "Chilly, but burning heat during fever; highly aggravated by cold dry winds.",
        "cravings": [
            "Cold water",
            "Acidic drinks",
            "Lemonade"
        ],
        "aversions": [
            "Fatty foods",
            "Warm food",
            "Meat"
        ],
        "worseFrom": [
            "Exposure to dry cold wind",
            "Midnight",
            "Warm rooms",
            "Noise/light"
        ],
        "betterFrom": [
            "Open air",
            "Rest",
            "Sweating (ends the Aconite stage)"
        ]
    },
    "particulars": {
        "head": "Agony of mind, fear of death, and violent restlessness.",
        "throat": "Dry sore throat.",
        "chest": "Acute croup, dry barking cough, first stage of pneumonia after cold winds.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint aching and stiffness.",
        "skin": "Hot, dry, burning skin without sweat during fever."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Sulphur"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Almost purely Psoric. Extreme rapid sensory excitation, sudden functional vascular congestion, and mental panic.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_nat_mur",
    "identity": {
        "name": "Natrum Muriaticum",
        "abbreviation": "Nat-m",
        "kingdom": "Mineral",
        "family": "Halides / Sodium Group",
        "sourceSubstance": "Sodium Chloride (Rock Salt)",
        "description": "Potentized sodium chloride, transforming ordinary salt into a deep mental-emotional polychrest."
    },
    "essence": {
        "coreTheme": "Suppressed grief and emotional reserve.",
        "centralConflict": "Deep desire for emotional connection vs. intense fear of rejection, ridicule, and hurt.",
        "compensationPattern": "Builds a wall of emotional isolation; rejects consolation and sympathy.",
        "protectiveShell": "Silent dignity, coldness, self-containment, and secret weeping."
    },
    "genome": {
        "egoExpansion": 40,
        "intellectuality": 85,
        "creativity": 80,
        "anxietyHealth": 60,
        "anxietySocial": 75,
        "controlNeed": 50,
        "insecurity": 85,
        "griefRetention": 98,
        "reservedNature": 95,
        "sensitivityExternal": 85,
        "jealousySuspicion": 75,
        "loquacityRate": 20,
        "hasteImpatience": 35,
        "fastidiousness": 70,
        "romanticIdealism": 90,
        "dependencyEmotional": 30,
        "fearOfDeath": 55,
        "fearOfPoverty": 50,
        "fearOfSolitude": 65,
        "fearOfCrowds": 60,
        "fearOfFailure": 80,
        "irritabilityRate": 70,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 65,
        "suspiciousness": 85,
        "changeabilityMood": 40,
        "yieldingDisposition": 15,
        "haughtiness": 65,
        "restlessnessMental": 80,
        "apathyDullness": 45,
        "fearOfDarkness": 50,
        "fearOfDisease": 60,
        "thermalHeatIndex": 82,
        "thirstIndex": 95,
        "perspirationRate": 65,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 45,
        "drynessIndex": 90,
        "lateralizationRight": 40,
        "sleepOnsetParalysis": 45,
        "motionAggravation": 40,
        "motionAmelioration": 45,
        "pressureAmelioration": 80,
        "draftSensitivity": 40,
        "midnightAggravation": 30,
        "afternoonAggravation": 75,
        "morningAggravation": 80,
        "warmDrinksDesire": 10,
        "coldDrinksDesire": 95,
        "sweetsDesire": 40,
        "fatsDesire": 10,
        "spicesDesire": 65,
        "stimulantsDesire": 30,
        "eggsDesire": 40,
        "saltDesire": 98,
        "meatAversion": 50,
        "fatAversion": 85,
        "milkAversion": 40,
        "breadAversion": 85,
        "coldWaterAversion": 5,
        "bathingAversion": 20,
        "warmRoomAggravation": 80,
        "openAirDesire": 85,
        "restAmelioration": 50,
        "brainAffinity": 92,
        "throatAffinity": 75,
        "respiratoryAffinity": 65,
        "cardiovascularAffinity": 85,
        "digestiveAxis": 80,
        "hepaticAffinity": 70,
        "renalAffinity": 90,
        "skinAffinity": 88,
        "musculoskeletalAffinity": 75,
        "lymphaticAffinity": 70,
        "venousAffinity": 75,
        "urinaryAffinity": 80,
        "serousMembranesAffinity": 75,
        "ovarianAffinity": 70,
        "mucousMembraneAffinity": 95,
        "glandularAffinity": 70,
        "nervousSystemAffinity": 92,
        "boneAffinity": 55,
        "connectiveTissueAffinity": 75,
        "bloodVesselsAffinity": 80,
        "stomachAffinity": 82,
        "rectalAffinity": 85,
        "intestinalAffinity": 80,
        "heartAffinity": 82,
        "lungAffinity": 60,
        "jointAffinity": 65,
        "spineAffinity": 75,
        "eyelidsAffinity": 75,
        "throatTonsilsAffinity": 65,
        "earAffinity": 55,
        "gallbladderAffinity": 65,
        "pancreaticAffinity": 70,
        "psoricDrive": 88,
        "sycoticDrive": 75,
        "syphiliticDrive": 40,
        "tubercularDrive": 35,
        "cancerinicDrive": 65,
        "dominantMiasmScore": 88,
        "miasmaticComplexity": 65,
        "heringsRuleAlignment": 82,
        "potencySensitivity": 85,
        "aggravationSusceptibility": 70,
        "psoraComplexity": 88,
        "sycosisComplexity": 75,
        "syphilisComplexity": 35,
        "tubercularComplexity": 30,
        "cancerinicComplexity": 60
    },
    "mentalPicture": {
        "personalityArchetype": "The Silent Griever",
        "fears": [
            "Rejection/ridicule",
            "Being hurt emotionally",
            "Robbers",
            "Cluttered rooms"
        ],
        "anxieties": [
            "Silent anxiety in crowds",
            "Dwelling on past hurts"
        ],
        "delusions": [
            "Delusion that she is rejected by others",
            "Delusion of seeing robbers in the room on waking"
        ],
        "dreams": [
            "Robbers in the house",
            "Murders",
            "Past grievances",
            "Thirst"
        ],
        "sleepProfile": "Sleepless due to dwelling on past events; dreams of robbers."
    },
    "physicalGenerals": {
        "thermals": "Warm-blooded, strongly aggravated by the heat of the sun; seeks open cool air.",
        "cravings": [
            "Salt",
            "Salty foods (chips, pickles)",
            "Bitter things",
            "Sour food"
        ],
        "aversions": [
            "Bread",
            "Fatty foods",
            "Slimy things"
        ],
        "worseFrom": [
            "Consolation/sympathy",
            "10 AM - 11 AM",
            "Heat of the sun",
            "Mental exertion"
        ],
        "betterFrom": [
            "Open cool air",
            "Going without meals",
            "Lying on right side",
            "Seclusion"
        ]
    },
    "particulars": {
        "head": "Splitting headache, feels like hammer blows, worse 10 AM - 3 PM, worse sun.",
        "throat": "Dry throat on waking, sensation of a hair on the tongue.",
        "chest": "Tachycardia during grief; fluttering heart, worse lying left side.",
        "abdomen": "Constipation with dry crumbling stool; rectal fissures.",
        "extremities": "Weakness of knees, trembling hands, cold feet in bed.",
        "skin": "Greasy skin, herpetic eruptions (cold sores) on lips, eczema along hairline."
    },
    "toxicology": {
        "rawToxicity": "Sodium overload causes cellular dehydration, hypertension, vascular strain.",
        "potencyRepetitionSafety": "High potencies (1M/10M) are indicated for chronic silent grief; avoid frequent repetition.",
        "antidotes": [
            "Camphora",
            "Arsenicum Album",
            "Phosphorus"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1832,
                "prover": "Samuel Hahnemann",
                "findings": "Identified the paradoxical conversion of table salt into a powerful emotional driver."
            }
        ],
        "notes": "Proved in Chronic Diseases. Standard mineral polychrest.",
        "sourceReferences": [
            "Hahnemann's Chronic Diseases",
            "Kent's Lectures",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_phosphorus",
    "identity": {
        "name": "Phosphorus",
        "abbreviation": "Phos",
        "kingdom": "Mineral",
        "family": "Group 15 / Pnictogens",
        "sourceSubstance": "Yellow Phosphorus",
        "description": "Diffusion, high sensitivity, boundary loss, open expression. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Diffusion, high sensitivity, boundary loss, open expression.",
        "centralConflict": "Lack of personal boundaries leading to immediate absorption of others' emotions vs. fear of isolation and physical exhaustion.",
        "compensationPattern": "Compensates by acting highly expressive, sympathetic, charming, and seeking constant contact.",
        "protectiveShell": "Compensates by acting highly expressive, sympathetic, charming, and seeking constant contact."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 70,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 75,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 50,
        "perspirationRate": 80,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 40,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 90,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 50,
        "fatAversion": 85,
        "milkAversion": 80,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 50,
        "openAirDesire": 50,
        "restAmelioration": 50,
        "brainAffinity": 50,
        "throatAffinity": 50,
        "respiratoryAffinity": 100,
        "cardiovascularAffinity": 90,
        "digestiveAxis": 80,
        "hepaticAffinity": 80,
        "renalAffinity": 50,
        "skinAffinity": 50,
        "musculoskeletalAffinity": 50,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 90,
        "boneAffinity": 50,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 80,
        "heartAffinity": 90,
        "lungAffinity": 100,
        "jointAffinity": 50,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 30,
        "sycoticDrive": 10,
        "syphiliticDrive": 10,
        "tubercularDrive": 50,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 50,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 30,
        "sycosisComplexity": 10,
        "syphilisComplexity": 10,
        "tubercularComplexity": 50,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The expressive charmer - highly sympathetic, open, affectionate, artistic, suggestible, fears being alone.",
        "fears": [
            "Being alone",
            "Darkness",
            "Thunderstorms",
            "Something creeping out of corners",
            "Death"
        ],
        "anxieties": [
            "Anxiety about others' health",
            "Twilight anxiety (evening)"
        ],
        "delusions": [
            "Delusion that he is in pieces",
            "Delusion of seeing ghosts"
        ],
        "dreams": [
            "Fire",
            "Bleeding",
            "Accidents",
            "Frightening things"
        ],
        "sleepProfile": "Sleepy during day; sleeps on right side, cannot sleep on left (causes palpitations)."
    },
    "physicalGenerals": {
        "thermals": "Chilly, but stomach/head desire cold; aggravated by weather transitions.",
        "cravings": [
            "Ice-cold water/drinks",
            "Ice cream",
            "Salt/spices",
            "Cold food"
        ],
        "aversions": [
            "Warm drinks",
            "Boiled milk",
            "Fatty foods",
            "Sweet things"
        ],
        "worseFrom": [
            "Lying on left side",
            "Twilight/evening",
            "Thunderstorms",
            "Physical/mental exertion"
        ],
        "betterFrom": [
            "Sleep (even a short nap)",
            "Cold food and drinks",
            "Massage/rubbing",
            "Company"
        ]
    },
    "particulars": {
        "head": "Headache and congestive symptoms.",
        "throat": "Dry sore throat.",
        "chest": "Dry tickling cough, chest tightness, worse cold air, pneumonia left lower lobe.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint aching and stiffness.",
        "skin": "Dry skin eruptions."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Nux Vomica",
            "Camphora"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Classic tubercular polychrest. Rapid energy dispersion, chest weakness, blood loss, and tall, slender growth.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_silicea",
    "identity": {
        "name": "Silicea",
        "abbreviation": "Sil",
        "kingdom": "Mineral",
        "family": "Silicates / Quartz",
        "sourceSubstance": "Pure Flint / Silica",
        "description": "Image preservation, rigidity, lack of grit, adaptation. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Image preservation, rigidity, lack of grit, adaptation.",
        "centralConflict": "Need to maintain a precise, refined, and respected image vs. a lack of internal strength and physical grit to resist pressure.",
        "compensationPattern": "Compensates by acting extremely yielding, polite, and detail-oriented, while remaining internally rigid and stubborn.",
        "protectiveShell": "Compensates by acting extremely yielding, polite, and detail-oriented, while remaining internally rigid and stubborn."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 70,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 85,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 50,
        "perspirationRate": 80,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 85,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 50,
        "milkAversion": 80,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 50,
        "openAirDesire": 50,
        "restAmelioration": 50,
        "brainAffinity": 50,
        "throatAffinity": 80,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 50,
        "digestiveAxis": 50,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 90,
        "musculoskeletalAffinity": 90,
        "lymphaticAffinity": 100,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 100,
        "nervousSystemAffinity": 90,
        "boneAffinity": 90,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 50,
        "heartAffinity": 50,
        "lungAffinity": 50,
        "jointAffinity": 90,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 80,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 40,
        "sycoticDrive": 10,
        "syphiliticDrive": 10,
        "tubercularDrive": 40,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 40,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 40,
        "sycosisComplexity": 10,
        "syphilisComplexity": 10,
        "tubercularComplexity": 40,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The yielding perfectionist - highly refined, polite, yielding but stubborn, fastidious, lacks grit/confidence, fears failure.",
        "fears": [
            "Pins/Needles",
            "Public speaking",
            "Failure",
            "Being seen as weak",
            "Stuffy rooms"
        ],
        "anxieties": [
            "Anticipatory anxiety before presentations",
            "Fastidious concern with precision"
        ],
        "delusions": [
            "Delusion that he is made of glass and will break",
            "Delusion of pins in throat"
        ],
        "dreams": [
            "Pins/needles",
            "Falling",
            "Robbers",
            "Household tasks"
        ],
        "sleepProfile": "Sleepless due to mental overactivity; starts in sleep."
    },
    "physicalGenerals": {
        "thermals": "Intensely chilly; aggravated by cold drafts; must wrap up the head.",
        "cravings": [
            "Cold food",
            "Ice cream",
            "Cold water",
            "Salty things"
        ],
        "aversions": [
            "Warm food",
            "Meat",
            "Mother's milk (infants)"
        ],
        "worseFrom": [
            "Cold drafts on head",
            "Uncovering head",
            "New/Full moon",
            "Mental exertion"
        ],
        "betterFrom": [
            "Wrapping up head warm",
            "Dry warm weather",
            "Lying down in dark"
        ]
    },
    "particulars": {
        "head": "Headache and congestive symptoms.",
        "throat": "Chronic otitis media, tonsil suppuration, blocked Eustachian tubes.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Weak spine, scoliosis, slow bone healing, bunions, ingrown nails.",
        "skin": "Unhealthy skin, every minor scratch suppurates (forms pus), offensive foot sweat."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Hepar Sulphur"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Psoric lack of assimilation combined with Tubercular physical thinness, suppuration, and low vital stamina.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_sepia",
    "identity": {
        "name": "Sepia Officinalis",
        "abbreviation": "Sep",
        "kingdom": "Animal",
        "family": "Cephalopoda / Sepiidae",
        "sourceSubstance": "Cuttlefish Ink",
        "description": "Stasis, emotional burnout, independence, drag-down sensations. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Stasis, emotional burnout, independence, drag-down sensations.",
        "centralConflict": "Duty towards family and relationships vs. a deep desire for independence and physical/mental space.",
        "compensationPattern": "Compensates for extreme fatigue and emotional burnout by becoming indifferent, sarcastic, and escaping into activity (dancing, walking fast).",
        "protectiveShell": "Compensates for extreme fatigue and emotional burnout by becoming indifferent, sarcastic, and escaping into activity (dancing, walking fast)."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 80,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 10,
        "perspirationRate": 50,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 85,
        "draftSensitivity": 85,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 50,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 90,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 85,
        "milkAversion": 80,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 50,
        "openAirDesire": 50,
        "restAmelioration": 50,
        "brainAffinity": 80,
        "throatAffinity": 50,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 50,
        "digestiveAxis": 80,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 80,
        "musculoskeletalAffinity": 50,
        "lymphaticAffinity": 50,
        "venousAffinity": 90,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 50,
        "boneAffinity": 50,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 80,
        "heartAffinity": 50,
        "lungAffinity": 50,
        "jointAffinity": 50,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 50,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 30,
        "sycoticDrive": 50,
        "syphiliticDrive": 20,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 50,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 30,
        "sycosisComplexity": 50,
        "syphilisComplexity": 20,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The independent burnout - indifferent to loved ones, irritable, sarcastic, desires solitude, better for vigorous exercise.",
        "fears": [
            "Losing sanity",
            "Poverty",
            "Thunderstorms",
            "Being alone"
        ],
        "anxieties": [
            "Anxiety about family duties",
            "Irritability from close demands"
        ],
        "delusions": [
            "Delusion that she is neglected by family",
            "Delusion of being alone in a desert"
        ],
        "dreams": [
            "Falling into deep water",
            "Family disputes",
            "Hard work"
        ],
        "sleepProfile": "Restless sleep, wakes tired; sleeps on right side."
    },
    "physicalGenerals": {
        "thermals": "Chilly; sensitive to cold air; wants warm closed rooms.",
        "cravings": [
            "Vinegar/Pickles",
            "Sour food",
            "Spices",
            "Chocolate"
        ],
        "aversions": [
            "Fatty foods",
            "Meat",
            "Milk",
            "Sweet things"
        ],
        "worseFrom": [
            "Evening",
            "Cold air/drafts",
            "After eating",
            "Standing still"
        ],
        "betterFrom": [
            "Vigorous physical exercise (dancing, fast walking)",
            "Warm bed",
            "Pressure",
            "Seclusion"
        ]
    },
    "particulars": {
        "head": "Emotional indifference, depression, hormonal headaches.",
        "throat": "Dry sore throat.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint aching and stiffness.",
        "skin": "Yellowish saddle across nose and cheeks, ringworm-like eruptions."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Nux Vomica"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Predominantly Sycotic. Expresses as venous stasis, local tissue prolapse, pelvic retentions, and emotional isolation blocks.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_belladonna",
    "identity": {
        "name": "Belladonna",
        "abbreviation": "Bell",
        "kingdom": "Plant",
        "family": "Solanaceae",
        "sourceSubstance": "Atropa belladonna (Deadly Nightshade)",
        "description": "Sudden violent congestion, heat, redness, burning, and delirium. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Sudden violent congestion, heat, redness, burning, and delirium.",
        "centralConflict": "Violent sensory overload and internal vascular storm threatening consciousness and brain stability.",
        "compensationPattern": "Compensates by entering a wild, active delirium (biting, striking, spitting) and shutting out light/noise.",
        "protectiveShell": "Compensates by entering a wild, active delirium (biting, striking, spitting) and shutting out light/noise."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 85,
        "jealousySuspicion": 50,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 10,
        "perspirationRate": 50,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 50,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 85,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 85,
        "fatAversion": 85,
        "milkAversion": 80,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 50,
        "openAirDesire": 50,
        "restAmelioration": 85,
        "brainAffinity": 100,
        "throatAffinity": 90,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 100,
        "digestiveAxis": 50,
        "hepaticAffinity": 50,
        "renalAffinity": 50,
        "skinAffinity": 80,
        "musculoskeletalAffinity": 50,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 50,
        "boneAffinity": 50,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 50,
        "heartAffinity": 100,
        "lungAffinity": 50,
        "jointAffinity": 50,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 90,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 40,
        "sycoticDrive": 10,
        "syphiliticDrive": 50,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 50,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 40,
        "sycosisComplexity": 10,
        "syphilisComplexity": 50,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The wild delirious - sudden violent tantrums, active delirium during fever (bites, strikes), photophobia, hallucinations.",
        "fears": [
            "Dogs",
            "Black animals",
            "Gallows",
            "Darkness",
            "Ghosts"
        ],
        "anxieties": [
            "Acute anxiety with hot face",
            "Panic during high fever"
        ],
        "delusions": [
            "Delusion of seeing ghosts and black dogs",
            "Delusion that he is being pursued"
        ],
        "dreams": [
            "Fires",
            "Gallows",
            "Black dogs",
            "Falling"
        ],
        "sleepProfile": "Restless, starting in sleep; sleepy but unable to sleep."
    },
    "physicalGenerals": {
        "thermals": "Hot, burning dry skin; highly aggravated by cold draft on head, but wants head cool.",
        "cravings": [
            "Cold water",
            "Lemonade",
            "Acidic drinks",
            "Ice"
        ],
        "aversions": [
            "Meat",
            "Warm drinks",
            "Fatty foods",
            "Milk"
        ],
        "worseFrom": [
            "Slightest touch",
            "Noise/light",
            "Cold draft on head",
            "3 PM",
            "Lying down flat"
        ],
        "betterFrom": [
            "Resting in dark quiet room",
            "Lying down, head elevated",
            "Warm wraps for body"
        ]
    },
    "particulars": {
        "head": "Congestive headaches, delirium, hallucinations, convulsions.",
        "throat": "Bright red, swollen, constricted throat, worse swallowing liquids.",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint aching and stiffness.",
        "skin": "Erysipelas, bright red, hot, smooth, radiating heat."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Nux Vomica"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Severe Syphilitic destructive congestion and delirium combined with acute Psoric vascular excitation.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
},
  {
    "id": "rem_apis",
    "identity": {
        "name": "Apis Mellifica",
        "abbreviation": "Apis",
        "kingdom": "Animal",
        "family": "Hymenoptera / Apidae",
        "sourceSubstance": "Whole Honeybee with venom",
        "description": "Edema, stinging pains, jealousy, busy restlessness. Classical homeopathic polychrest remedy."
    },
    "essence": {
        "coreTheme": "Edema, stinging pains, jealousy, busy restlessness.",
        "centralConflict": "Threat of sudden anaphylaxis and swelling blocking structural vital functions vs. the drive to maintain busy social order.",
        "compensationPattern": "Compensates by constant, frantic 'busy' activity, protectiveness, and extreme irritability.",
        "protectiveShell": "Compensates by constant, frantic 'busy' activity, protectiveness, and extreme irritability."
    },
    "genome": {
        "egoExpansion": 50,
        "intellectuality": 50,
        "creativity": 50,
        "anxietyHealth": 50,
        "anxietySocial": 50,
        "controlNeed": 50,
        "insecurity": 50,
        "griefRetention": 50,
        "reservedNature": 50,
        "sensitivityExternal": 50,
        "jealousySuspicion": 85,
        "loquacityRate": 45,
        "hasteImpatience": 50,
        "fastidiousness": 50,
        "romanticIdealism": 50,
        "dependencyEmotional": 50,
        "fearOfDeath": 50,
        "fearOfPoverty": 50,
        "fearOfSolitude": 50,
        "fearOfCrowds": 50,
        "fearOfFailure": 50,
        "irritabilityRate": 50,
        "indifferenceToBeauty": 20,
        "ambitionDrive": 50,
        "suspiciousness": 50,
        "changeabilityMood": 50,
        "yieldingDisposition": 30,
        "haughtiness": 50,
        "restlessnessMental": 50,
        "apathyDullness": 30,
        "fearOfDarkness": 50,
        "fearOfDisease": 50,
        "thermalHeatIndex": 15,
        "thirstIndex": 10,
        "perspirationRate": 50,
        "vitalityLevel": 60,
        "sluggishnessMetabolic": 50,
        "drynessIndex": 50,
        "lateralizationRight": 85,
        "sleepOnsetParalysis": 30,
        "motionAggravation": 40,
        "motionAmelioration": 40,
        "pressureAmelioration": 40,
        "draftSensitivity": 40,
        "midnightAggravation": 40,
        "afternoonAggravation": 40,
        "morningAggravation": 40,
        "warmDrinksDesire": 50,
        "coldDrinksDesire": 90,
        "sweetsDesire": 50,
        "fatsDesire": 50,
        "spicesDesire": 50,
        "stimulantsDesire": 50,
        "eggsDesire": 50,
        "saltDesire": 50,
        "meatAversion": 50,
        "fatAversion": 85,
        "milkAversion": 50,
        "breadAversion": 50,
        "coldWaterAversion": 50,
        "bathingAversion": 50,
        "warmRoomAggravation": 85,
        "openAirDesire": 85,
        "restAmelioration": 50,
        "brainAffinity": 50,
        "throatAffinity": 80,
        "respiratoryAffinity": 50,
        "cardiovascularAffinity": 50,
        "digestiveAxis": 50,
        "hepaticAffinity": 50,
        "renalAffinity": 90,
        "skinAffinity": 90,
        "musculoskeletalAffinity": 50,
        "lymphaticAffinity": 50,
        "venousAffinity": 50,
        "urinaryAffinity": 50,
        "serousMembranesAffinity": 50,
        "ovarianAffinity": 50,
        "mucousMembraneAffinity": 50,
        "glandularAffinity": 50,
        "nervousSystemAffinity": 50,
        "boneAffinity": 50,
        "connectiveTissueAffinity": 50,
        "bloodVesselsAffinity": 50,
        "stomachAffinity": 50,
        "rectalAffinity": 50,
        "intestinalAffinity": 50,
        "heartAffinity": 50,
        "lungAffinity": 50,
        "jointAffinity": 50,
        "spineAffinity": 50,
        "eyelidsAffinity": 50,
        "throatTonsilsAffinity": 80,
        "earAffinity": 50,
        "gallbladderAffinity": 50,
        "pancreaticAffinity": 50,
        "psoricDrive": 20,
        "sycoticDrive": 60,
        "syphiliticDrive": 20,
        "tubercularDrive": 0,
        "cancerinicDrive": 0,
        "dominantMiasmScore": 60,
        "miasmaticComplexity": 60,
        "heringsRuleAlignment": 75,
        "potencySensitivity": 60,
        "aggravationSusceptibility": 55,
        "psoraComplexity": 20,
        "sycosisComplexity": 60,
        "syphilisComplexity": 20,
        "tubercularComplexity": 0,
        "cancerinicComplexity": 0
    },
    "mentalPicture": {
        "personalityArchetype": "The busy bee - highly active, restless, jealous, touchy, clumsy (drops things), protective of family.",
        "fears": [
            "Apoplexy/strokes",
            "Suffocation",
            "Being alone",
            "Poverty"
        ],
        "anxieties": [
            "Anxiety about family safety",
            "Restless panic from heat"
        ],
        "delusions": [
            "Delusion that she has no room to move",
            "Delusion of being stung"
        ],
        "dreams": [
            "Flying",
            "Fires",
            "Bleeding",
            "Fighting"
        ],
        "sleepProfile": "Restless sleep, starts with shrieks (screaming in sleep)."
    },
    "physicalGenerals": {
        "thermals": "Extremely hot-blooded; aggravated by any heat; desires cold open air.",
        "cravings": [
            "Cold water",
            "Ice",
            "Sour things",
            "Vinegar"
        ],
        "aversions": [
            "Warm food",
            "Fatty foods",
            "Warm drinks",
            "Sweet things"
        ],
        "worseFrom": [
            "Heat in any form",
            "Touch/pressure",
            "After sleep",
            "Right side",
            "Closed warm room"
        ],
        "betterFrom": [
            "Cold applications",
            "Cool open air",
            "Uncovering",
            "Cold drinks"
        ]
    },
    "particulars": {
        "head": "Headache and congestive symptoms.",
        "throat": "Edematous swelling of tonsils and uvula (looks like water bag).",
        "chest": "Chest congestion or cough.",
        "abdomen": "Bloating, flatulence, and gastric distress.",
        "extremities": "Joint aching and stiffness.",
        "skin": "Urticaria, hives, stinging burning itching, worse heat."
    },
    "toxicology": {
        "rawToxicity": "Toxicological details listed in classical pharmacopoeia. Active in potentized microdoses.",
        "potencyRepetitionSafety": "Repetition should be managed carefully based on the patient's vital response.",
        "antidotes": [
            "Camphora",
            "Lachesis Muta"
        ]
    },
    "historicalRecord": {
        "provings": [
            {
                "year": 1811,
                "prover": "Samuel Hahnemann",
                "findings": "Revealed core polychrest keynotes, thermal state, and miasmatic drive."
            }
        ],
        "notes": "Edematous fluid accumulation, ovarian cysts, and high social organizational control points to dominant Sycosis.",
        "sourceReferences": [
            "Hahnemann's Materia Medica Pura",
            "Kent's Lectures on Materia Medica",
            "Boericke's Materia Medica"
        ]
    }
}
];

export const GENOME_REMEDY_DB: HKOSExtendedRemedy[] = [
  ...CORE_16_GENOMES,
  ...COMPRESSED_REMEDY_PACK.map(inflateGenome)
];

