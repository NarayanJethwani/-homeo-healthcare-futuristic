import { MASTER_REMEDY_DB } from "./materiaMedicaDb";
import { resolveCanonicalRemedyId } from "./normalizationEngine";
import { GENOME_REMEDY_DB, HKOSExtendedRemedy } from "./remedyGenomeSchema";

// ============================================================================
// MODULE 1: DYNAMIC REMEDY DIFFERENTIAL ATLAS
// ============================================================================

export interface RemedyDifferentialData {
  mental: string;
  generals: string;
  thermals: string;
  modalities: string;
  sleep: string;
  food: string;
  clinical: string;
  miasmatic: string;
  decisionTree: string;
  whyThis: string;
  whyNotThis: string;
}

export interface DifferentialMatrix {
  remedyA: string;
  remedyB: string;
  comparison: RemedyDifferentialData;
}

/**
 * Calculates Euclidean similarity distance between two 128-dimensional remedy genomes.
 * Returns the similarity percentage (0% to 100%).
 */
export function getGenomeSimilarity(idA: string, idB: string): number {
  const canonA = resolveCanonicalRemedyId(idA);
  const canonB = resolveCanonicalRemedyId(idB);
  
  const remA = GENOME_REMEDY_DB.find(r => r.id === canonA);
  const remB = GENOME_REMEDY_DB.find(r => r.id === canonB);
  
  if (!remA || !remB) return 50;

  let sumSq = 0;
  let count = 0;
  
  // Compute distance across numeric dimensions in genome vectors
  for (const key in remA.genome) {
    const valA = remA.genome[key];
    const valB = remB.genome[key];
    if (typeof valA === "number" && typeof valB === "number") {
      const diff = valA - valB;
      sumSq += diff * diff;
      count++;
    }
  }

  const distance = Math.sqrt(sumSq);
  const maxDistance = 100 * Math.sqrt(count || 1);
  return Math.max(10, Math.round(((maxDistance - distance) / maxDistance) * 100));
}

/**
 * Finds the top 20 closest remedies to any given remedy using Euclidean genome distance.
 */
export function getClosestRemedies(remedyId: string, limit = 20): Array<{ remedyId: string; name: string; score: number }> {
  const canonId = resolveCanonicalRemedyId(remedyId);
  const target = GENOME_REMEDY_DB.find(r => r.id === canonId);
  if (!target) return [];

  const distances = GENOME_REMEDY_DB
    .filter(r => r.id !== canonId)
    .map(other => {
      const score = getGenomeSimilarity(canonId, other.id);
      return {
        remedyId: other.id,
        name: other.identity.name,
        score
      };
    });

  return distances.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Returns a detailed differential monograph comparing any two remedies in the database.
 * Computes comparative descriptions dynamically from the 128-dimensional genome vectors.
 */
export function getRemedyDifferentiation(idA: string, idB: string): RemedyDifferentialData {
  const canonA = resolveCanonicalRemedyId(idA);
  const canonB = resolveCanonicalRemedyId(idB);
  
  const remA = MASTER_REMEDY_DB.find(r => r.id === canonA);
  const remB = MASTER_REMEDY_DB.find(r => r.id === canonB);
  
  const genA = GENOME_REMEDY_DB.find(r => r.id === canonA);
  const genB = GENOME_REMEDY_DB.find(r => r.id === canonB);

  const nameA = remA?.identity.name || idA;
  const nameB = remB?.identity.name || idB;

  // Pre-compiled high-fidelity differentiation templates for core remedies
  const key = `${canonA}_vs_${canonB}`;
  const reverseKey = `${canonB}_vs_${canonA}`;

  const staticDiffs: Record<string, RemedyDifferentialData> = {
    "rem_sulphur_vs_rem_lycopodium": {
      mental: `${nameA} is highly egotistical, outgoing, argumentative, and theoretical (the ragged philosopher). ${nameB} hides deep insecurity under an authoritarian, dictatorial public mask, fearing failure and stage fright.`,
      generals: `${nameA} is sluggish mornings, worse standing still, and has a sudden empty sinking hunger at 11 AM. ${nameB} is characterized by right-sided complaints and a distinct daily aggravation from 4 PM to 8 PM.`,
      thermals: `${nameA} is intensely hot-blooded and aggravated by heat in all forms. ${nameB} is chilly but desires cold open air on the head/face, while the stomach wants warm food/drinks.`,
      modalities: `${nameA} is worse from warmth of bed and washing/bathing; better from cold open air. ${nameB} is worse from cold food/drinks and warm closed rooms; better from warm drinks and slow motion.`,
      sleep: `${nameA} sleeps in short cat-naps, waking frequently with burning feet that must be put out of bed. ${nameB} has unrefreshing sleep, waking cross, and often wakes at 3 AM with business worries.`,
      food: `${nameA} craves sweets, spices, fats, and cold drinks; hates meat. ${nameB} craves sweets, pastries, and warm drinks; hates cold drinks and bread.`,
      clinical: `${nameA} is primarily suited for hot, itchy, burning skin eruptions (eczema) and venous stasis (hemorrhoids). ${nameB} is suited for lower gastrointestinal bloating immediately after a few bites (IBS), liver congestion, and right-sided kidney stones.`,
      miasmatic: `${nameA} is predominantly Psoric, representing functional skin outbreaks. ${nameB} has a strong Sycotic element of local digestive accumulations.`,
      decisionTree: `IF Patient is Hot-blooded with burning feet -> Choose ${nameA}.\nIF Patient is Chilly with right-sided flatulence at 4-8 PM -> Choose ${nameB}.`,
      whyThis: `Select ${nameA} if skin itching is aggravated by warmth of bed or when 11 AM sinking hunger is present.`,
      whyNotThis: `Avoid ${nameA} if patient is highly chilly, relieved by warm wraps, or has left-to-right lateral symptoms.`
    },
    "rem_sulphur_vs_rem_nux_vomica": {
      mental: `${nameA} is speculative, philosophical, untidy, and indifferent to social conventions. ${nameB} is highly ambitious, competitive, workaholic, extremely impatient, and quick to anger.`,
      generals: `${nameA} is worse standing still, sluggish, and has 11 AM sinking hunger. ${nameB} is highly tense, hyperactive, spastic, and completely refreshed by a short 10-15 minute nap.`,
      thermals: `${nameA} is hot-blooded, worse heat. ${nameB} is intensely chilly, flinching and shivering from the slightest cold drafts.`,
      modalities: `${nameA} is worse warmth of bed and bathing; better cold air. ${nameB} is worse cold drafts, early morning (3-4 AM), and after eating; better warm wraps and rest.`,
      sleep: `${nameA} sleeps in light cat-naps, burning feet. ${nameB} wakes at 3-4 AM thinking of business, falling into a heavy dull sleep at dawn, waking exhausted.`,
      food: `${nameA} desires sweets, spices, and cold water; hates meat. ${nameB} desires stimulants (coffee, alcohol), spices, and fats; hates cold water and meat.`,
      clinical: `${nameA} targets burning eczemas, boils, and hemorrhoids. ${nameB} targets spastic gastritis, acid reflux, and chronic constipation with constant ineffectual urging.`,
      miasmatic: `${nameA} is pure Psora (irritation). ${nameB} carries a strong Syphilitic element (spasmodic, destructive tension).`,
      decisionTree: `IF Patient is warm-blooded and speculates -> Choose ${nameA}.\nIF Patient is chilly, highly irritable, and desires coffee/stimulants -> Choose ${nameB}.`,
      whyThis: `Select ${nameA} for indolent, warm skin outbreaks or sluggish venous stasis.`,
      whyNotThis: `Avoid ${nameA} for high-stress workaholics with spastic gastrointestinal pains.`
    }
  };

  if (staticDiffs[key]) {
    return staticDiffs[key];
  }
  
  if (staticDiffs[reverseKey]) {
    const rev = staticDiffs[reverseKey];
    return {
      mental: rev.mental,
      generals: rev.generals,
      thermals: rev.thermals,
      modalities: rev.modalities,
      sleep: rev.sleep,
      food: rev.food,
      clinical: rev.clinical,
      miasmatic: rev.miasmatic,
      decisionTree: rev.decisionTree,
      whyThis: rev.whyNotThis,
      whyNotThis: rev.whyThis
    };
  }

  // Dynamic fallback generator if no precompiled static matrix entry exists
  const getCompareText = (valA: number, valB: number, label: string) => {
    if (Math.abs(valA - valB) < 15) {
      return `Both exhibit similar levels of ${label} (index: ${valA} vs ${valB}).`;
    }
    return valA > valB
      ? `${nameA} displays higher ${label} (${valA} vs ${valB} for ${nameB}).`
      : `${nameB} has stronger ${label} (${valB} vs ${valA} for ${nameA}).`;
  };

  const getMiasmName = (weights: number[]) => {
    const miasms = ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancer"];
    const maxIdx = weights.indexOf(Math.max(...weights));
    return miasms[maxIdx] || "Psora";
  };

  const weightsA = genA ? [genA.genome.psoricDrive, genA.genome.sycoticDrive, genA.genome.syphiliticDrive, genA.genome.tubercularDrive, genA.genome.cancerinicDrive] : [50, 20, 20, 10, 0];
  const weightsB = genB ? [genB.genome.psoricDrive, genB.genome.sycoticDrive, genB.genome.syphiliticDrive, genB.genome.tubercularDrive, genB.genome.cancerinicDrive] : [50, 20, 20, 10, 0];

  const miasmA = getMiasmName(weightsA);
  const miasmB = getMiasmName(weightsB);

  const thermValA = genA?.genome.thermalHeatIndex ?? 50;
  const thermValB = genB?.genome.thermalHeatIndex ?? 50;

  const thermText = thermValA > 60 && thermValB < 40
    ? `${nameA} is warm-blooded (Heat Index: ${thermValA}). ${nameB} is chilly (Heat Index: ${thermValB}).`
    : thermValB > 60 && thermValA < 40
      ? `${nameA} is chilly (Heat Index: ${thermValA}). ${nameB} is warm-blooded (Heat Index: ${thermValB}).`
      : `Both have comparable thermal axes (${thermValA} vs ${thermValB}).`;

  return {
    mental: `${getCompareText(genA?.genome.egoExpansion ?? 50, genB?.genome.egoExpansion ?? 50, "egotism")} ${getCompareText(genA?.genome.reservedNature ?? 50, genB?.genome.reservedNature ?? 50, "introversion")}`,
    generals: `${getCompareText(genA?.genome.vitalityLevel ?? 70, genB?.genome.vitalityLevel ?? 70, "vitality")} ${getCompareText(genA?.genome.lateralizationRight ?? 50, genB?.genome.lateralizationRight ?? 50, "right-sided lateralization")}`,
    thermals: thermText,
    modalities: `${nameA} is worse from [${remA?.modalities.worseFrom.slice(0, 2).join(", ") || "cold"}], better from [${remA?.modalities.betterFrom.slice(0, 2).join(", ") || "warmth"}]. ${nameB} is worse from [${remB?.modalities.worseFrom.slice(0, 2).join(", ") || "cold"}], better from [${remB?.modalities.betterFrom.slice(0, 2).join(", ") || "warmth"}].`,
    sleep: `${getCompareText(genA?.genome.sleepOnsetParalysis ?? 30, genB?.genome.sleepOnsetParalysis ?? 30, "sleep aggravation")}`,
    food: `${nameA} desires sweets: ${genA?.genome.sweetsDesire ?? 50}, salt: ${genA?.genome.saltDesire ?? 50}. ${nameB} desires sweets: ${genB?.genome.sweetsDesire ?? 50}, salt: ${genB?.genome.saltDesire ?? 50}.`,
    clinical: `${nameA} has strong affinity for ${remA?.organAffinities.slice(0, 2).map(o => o.organ).join(", ") || "nervous system"}. ${nameB} primarily targets ${remB?.organAffinities.slice(0, 2).map(o => o.organ).join(", ") || "digestive axis"}.`,
    miasmatic: `${nameA} has dominant miasmatic drive: ${miasmA}. ${nameB} has dominant drive: ${miasmB}.`,
    decisionTree: `IF thermal index is ${thermValA > 50 ? "Warm" : "Chilly"} -> Prefer ${nameA}.\nIF thermal index is ${thermValB > 50 ? "Warm" : "Chilly"} -> Prefer ${nameB}.`,
    whyThis: `Select ${nameA} when presenting keynotes align: [${remA?.keynotes.top10.slice(0, 2).join(", ") || "primary keynotes"}].`,
    whyNotThis: `Avoid ${nameA} if symptoms contradict baseline modality worsening: [${remA?.modalities.worseFrom.slice(0, 1) || "cold drafts"}].`
  };
}

// ============================================================================
// MODULE 2: CASE RECOGNITION ARCHETYPES
// ============================================================================

export interface CaseArchetype {
  name: string;
  coreRemedyId: string;
  description: string;
  keySymptoms: string[];
}

export const CONSTITUTIONAL_ARCHETYPES: CaseArchetype[] = [
  {
    name: "The Intellectual Philosopher",
    coreRemedyId: "rem_sulphur",
    description: "Highly theoretical, speculative, self-absorbed intellectual who neglects physical details, cleanliness, and order. Hot-blooded, prone to dry burning skin eruptions, and sluggish mornings with empty stomach sinking at 11 AM.",
    keySymptoms: ["egotism", "speculation", "rags", "philosopher", "dirty", "11 am", "burning feet"]
  },
  {
    name: "The Performance-Anxious Executive",
    coreRemedyId: "rem_lycopodium",
    description: "Hides deep insecurity and anticipatory stage fright under a dictatorial, controlling public mask. Prone to severe digestive flatulence, bloating after a few mouthfuls, right-sided complaints, and late afternoon (4-8 PM) fatigue.",
    keySymptoms: ["anticipatory", "stage fright", "dictatorial", "bloating", "flatulence", "right-sided", "4-8 pm"]
  },
  {
    name: "The Silent Griever",
    coreRemedyId: "rem_nat_mur",
    description: "Reserved, introverted, and highly dignified personality carrying deep silent grief. Rejects consolation, dwells on past hurts, suffers from sun-induced migraines, has a crack in the middle of dry lips, and craves salt.",
    keySymptoms: ["grief", "consolation", "reserved", "salty", "sun", "lip crack", "migraine"]
  },
  {
    name: "The Hypervigilant Protector",
    coreRemedyId: "rem_arsenicum",
    description: "Obsessively anxious regarding survival, health, and death, leading to extreme fastidiousness, strict order, and panic. Restless but weak, chilly, experiences burning pains paradoxically relieved by heat, and thirsty for tiny frequent sips.",
    keySymptoms: ["death", "fastidious", "restless", "chilly", "sips", "burning heat"]
  }
];

export function recognizeCaseArchetype(symptomText: string): Array<{ archetype: CaseArchetype; score: number }> {
  const text = symptomText.toLowerCase();
  const results = CONSTITUTIONAL_ARCHETYPES.map(arch => {
    let matchCount = 0;
    arch.keySymptoms.forEach(sym => {
      if (text.includes(sym)) {
        matchCount++;
      }
    });
    if (text.includes(arch.coreRemedyId.replace("rem_", "")) || text.includes(arch.name.toLowerCase())) {
      matchCount += 3;
    }
    const score = Math.min(100, Math.round((matchCount / (arch.keySymptoms.length + 3)) * 130));
    return { archetype: arch, score };
  });

  return results.filter(r => r.score > 0).sort((a, b) => b.score - a.score);
}

// ============================================================================
// MODULE 3: CONFIRMATORY QUESTION ENGINE
// ============================================================================

export interface ConfirmatoryQuestion {
  question: string;
  factor: string;
  weight: number;
}

export const CONFIRMATORY_QUESTIONS_DB: Record<string, ConfirmatoryQuestion[]> = {
  "rem_sulphur": [
    { question: "Do your feet burn at night, forcing you to stick them out of bed?", factor: "Burning feet in bed", weight: 9 },
    { question: "Do you experience an empty, sinking hunger around 11 AM?", factor: "11 AM sinking stomach", weight: 8 },
    { question: "Are your symptoms aggravated by warmth of bed or warm rooms?", factor: "Worse warmth", weight: 8 },
    { question: "Do you have an aversion to washing, bathing, or cold water?", factor: "Aversion to bathing", weight: 7 },
    { question: "Do you tend to over-speculate or get absorbed in philosophical theories?", factor: "Egotism/speculation", weight: 8 }
  ],
  "rem_lycopodium": [
    { question: "Do you experience stomach gas and bloating immediately after a few bites of food?", factor: "Abdominal flatulence", weight: 10 },
    { question: "Do your symptoms systematically worsen between 4 PM and 8 PM?", factor: "Worse 4-8 PM", weight: 9 },
    { question: "Do you crave sweets, pastries, and hot drinks?", factor: "Craves sweets", weight: 8 },
    { question: "Do you hide performance anxiety or stage fright under a confident/dictatorial mask?", factor: "Anticipatory anxiety", weight: 8 }
  ],
  "rem_nat_mur": [
    { question: "Does consolidation or sympathy from others make you feel worse or angry?", factor: "Worse consolation", weight: 10 },
    { question: "Do you carry a silent, deep grief, preferring not to weep in front of others?", factor: "Silent grief", weight: 9 },
    { question: "Do you have an intense, marked craving for salt or salty foods?", factor: "Salt craving", weight: 9 }
  ],
  "rem_arsenicum": [
    { question: "Are you extremely anxious about your health, disease, and death?", factor: "Health anxiety", weight: 10 },
    { question: "Do you feel highly restless, pacing the room, yet physically very weak?", factor: "Restlessness with weakness", weight: 9 },
    { question: "Are you obsessed with cleanliness, order, and absolute fastidiousness?", factor: "Fastidiousness", weight: 9 }
  ]
};

export function getConfirmatoryQuestions(remedyId: string): ConfirmatoryQuestion[] {
  const canon = resolveCanonicalRemedyId(remedyId);
  if (CONFIRMATORY_QUESTIONS_DB[canon]) {
    return CONFIRMATORY_QUESTIONS_DB[canon];
  }
  const rem = MASTER_REMEDY_DB.find(r => r.id === canon);
  if (rem) {
    const keynotes = rem.keynotes.top10;
    return keynotes.slice(0, 5).map((keynote, idx) => ({
      question: `Does the keynote symptom "${keynote}" match your clinical presentation?`,
      factor: keynote,
      weight: Math.max(5, 9 - idx)
    }));
  }
  return [
    { question: "Are your symptoms worse from change of weather?", factor: "Weather sensitivity", weight: 5 },
    { question: "Do you feel better from resting in a quiet, dark room?", factor: "Rest amelioration", weight: 5 }
  ];
}

// ============================================================================
// MODULE 4: CASE SIMULATOR DATABASE EXPANSION (15 CATEGORIES)
// ============================================================================

export interface SimulatedCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  category: "Anxiety" | "Depression" | "ADHD" | "Autism" | "Migraine" | "Asthma" | "Allergy" | "Arthritis" | "Skin Diseases" | "IBS" | "Kidney Stones" | "Thyroid Disorders" | "Women's Health" | "Pediatrics" | "Sleep Disorders";
  
  // Extended Clinical Telemetry
  chiefComplaint: string;
  history: string;
  mentals: string;
  generals: string;
  modalities: string;
  clinicalFindings: string;
  rubrics: string[];
  remedyAnalysis: string;
  differentialAnalysis: string;
  prescription: string;
  followUpNotes: string;
  outcomeTracking: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  teachingNotes: string;

  // Backwards compatibility keys
  narrative: string;
  correctRemedyId: string;
  correctPotency: string;
  keyRubrics: string[];
  justification: string;
}

const CATEGORY_LIST_15: Array<SimulatedCase["category"]> = [
  "Anxiety", "Depression", "ADHD", "Autism", "Migraine", "Asthma", "Allergy", "Arthritis", "Skin Diseases", "IBS", "Kidney Stones", "Thyroid Disorders", "Women's Health", "Pediatrics", "Sleep Disorders"
];

const CASE_NAMES_FIRST = ["Harold", "Beatrice", "Julian", "Clara", "Arthur", "Evelyn", "Walter", "Mabel", "Leonard", "Sophia", "Raymond", "Alice", "Thomas", "Rose", "Edwin", "Grace", "Aarav", "Priya", "Vikram", "Neha", "Rohan", "Ananya"];
const CASE_NAMES_LAST = ["Kent", "Boericke", "Hahnemann", "Allen", "Clarke", "Hering", "Nash", "Lippe", "Farrington", "Phatak", "Boger", "Dunham", "Wells", "Guernsey", "Burnett", "Mehta", "Sharma", "Joshi", "Patel", "Sen", "Nair"];

export function getSimulatedCase(idx: number): SimulatedCase {
  const index = Math.max(0, Math.min(999, idx));
  
  const hash1 = (index * 997) % 1000;
  const hash2 = (index * 883) % 1000;
  const category = CATEGORY_LIST_15[index % CATEGORY_LIST_15.length];
  
  const firstName = CASE_NAMES_FIRST[hash1 % CASE_NAMES_FIRST.length];
  const lastName = CASE_NAMES_LAST[hash2 % CASE_NAMES_LAST.length];
  const age = 6 + (hash1 % 75);
  const gender = (hash1 % 2 === 0) ? "Male" : "Female";

  const remediesPool = ["rem_sulphur", "rem_lycopodium", "rem_nat_mur", "rem_arsenicum", "rem_calcarea", "rem_lachesis", "rem_pulsatilla", "rem_gelsemium", "rem_bryonia", "rem_aconite"];
  const correctRemedyId = remediesPool[hash2 % remediesPool.length];
  const rem = MASTER_REMEDY_DB.find(r => r.id === correctRemedyId) || MASTER_REMEDY_DB[0];

  const potencies = ["30C", "200C", "1M", "10M"];
  const correctPotency = potencies[(hash1 + hash2) % potencies.length];

  const difficultyLevel: SimulatedCase["difficultyLevel"] = index % 3 === 0 ? "Beginner" : index % 3 === 1 ? "Intermediate" : "Advanced";

  // Build narratives dynamically depending on remedy and category
  let chiefComplaint = `Recurrent clinical manifestations of ${category.toLowerCase()}. `;
  let history = `Patient has suffered from these symptoms for ${2 + (hash1 % 8)} years. `;
  let mentals = "";
  let generals = "";
  let modalities = "";
  let clinicalFindings = `Examination reveals functional disturbance corresponding to ${category}. `;

  if (correctRemedyId === "rem_sulphur") {
    chiefComplaint += "Presents with burning heat, dry itchy skin eruptions, and extreme sluggishness in the morning.";
    history += "Began after topical suppression of eczema. Prone to acidic relapses.";
    mentals = "Highly talkative, intellectualizing, egotistical philosopher. Indifferent to order, untidy.";
    generals = "Intensely hot-blooded, aggravated by warm rooms. Sudden empty sinking hunger at 11 AM. Aversion to bathing.";
    modalities = "Aggravated by warmth of bed, standing still, and washing. Ameliorated by cold open air.";
    clinicalFindings += "Skin shows red, dry, scaly patches on flexures. Lips are bright red.";
  } else if (correctRemedyId === "rem_lycopodium") {
    chiefComplaint += "Severe gastrointestinal distension immediately after eating, and right-sided colic.";
    history += "Triggered by high professional stress and job insecurity. Has a history of kidney gravel.";
    mentals = "Hides deep insecurity and stage fright under a dictatorial, controlling mask.";
    generals = "Chilly but wants cool air. Craves sweets and warm drinks. Wakes cross and irritable.";
    modalities = "Aggravated from 4 PM to 8 PM and in warm rooms. Ameliorated by warm drinks and open air.";
    clinicalFindings += "Abdomen is tympanic and bloated. Lateralization is right-sided.";
  } else if (correctRemedyId === "rem_nat_mur") {
    chiefComplaint += "Splitting hammer-like headaches aggravated by sun, and severe introversion.";
    history += "Developed after severe unresolved emotional grief (loss of family member).";
    mentals = "Silent grief, weeps only in solitude. Consolation violently aggravates. Dwells on past insults.";
    generals = "Intense craving for salt. Warm-blooded, highly sensitive to summer sun heat.";
    modalities = "Aggravated by consolation, sun heat, and 10 AM morning. Ameliorated by open air and cold bathing.";
    clinicalFindings += "Mucous membranes are dry. Lip shows a deep central crack.";
  } else if (correctRemedyId === "rem_arsenicum") {
    chiefComplaint += "Severe nocturnal panic, health anxiety, and vomiting of fluids.";
    history += "Triggered by fear of disease outbreaks. Has a history of chronic food poisoning.";
    mentals = "Obsessively fastidious, demands absolute tidiness. Restless, paces room in panic.";
    generals = "Intensely chilly. Burning pains paradoxically relieved by heat. Thirst for tiny sips of cold water.";
    modalities = "Aggravated from midnight to 2 AM and by cold applications. Ameliorated by hot wraps and warm drinks.";
    clinicalFindings += "Dry, dusty skin. Exhausted vital force with rapid pulse.";
  } else {
    chiefComplaint += `Generalized constitutional symptoms matching ${rem.identity.name}.`;
    history += "Slow onset with gradual loss of vital reaction capacity.";
    mentals = "Dull, sluggish, or weepy. Apprehensive, seeking constant reassurance.";
    generals = `Thermal state: ${rem.physicalGenerals.thermalState}. Food cravings: ${rem.physicalGenerals.foodDesires.join(", ")}.`;
    modalities = `Worse from: ${rem.modalities.worseFrom.join(", ")}, better from: ${rem.modalities.betterFrom.join(", ")}.`;
    clinicalFindings += "Swollen lymphatic glands, flabby muscle tone.";
  }

  const rubrics = rem.keynotes.top10.slice(0, 4);
  const remedyAnalysis = `Remedy matching is determined by ${rem.identity.name}'s key notes. The thermal state matches and the cravings align.`;
  const differentialAnalysis = `Must compare against ${rem.relationships.complementary.join(", ") || "related remedies"} to rule out superficial matches.`;
  const prescription = `Prescribed ${rem.identity.name} ${correctPotency}, single dose.`;
  const followUpNotes = "Evaluate skin and sleep progress after 14 days. Watch for Hering's law outward redirection.";
  const outcomeTracking = "Expected 80% recovery of baseline digestive and sleep parameters within 6 weeks.";
  const teachingNotes = `This case teaches the importance of matching the thermal state (${rem.physicalGenerals.thermalState}) and modalities (${rem.modalities.worseFrom[0]}) before prescribing.`;

  const narrative = `${chiefComplaint} ${history} Mentals: ${mentals} Generals: ${generals} Modalities: ${modalities} Clinical: ${clinicalFindings}`;
  const keyRubrics = rubrics;
  const justification = `The constitutional state matches ${rem.identity.name}. Key indicators include the characteristic mental picture (${rem.essence.coreTheme}) combined with the physical generals (${rem.physicalGenerals.thermalState}, cravings, and modalities). The selected potency of ${correctPotency} fits the patient's structural status.`;

  return {
    id: `case_${index + 1}`,
    name: `${firstName} ${lastName}`,
    age,
    gender,
    category,
    chiefComplaint,
    history,
    mentals,
    generals,
    modalities,
    clinicalFindings,
    rubrics,
    remedyAnalysis,
    differentialAnalysis,
    prescription,
    followUpNotes,
    outcomeTracking,
    difficultyLevel,
    teachingNotes,
    
    narrative,
    correctRemedyId,
    correctPotency,
    keyRubrics,
    justification
  };
}
