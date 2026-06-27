import { MateriaMedicaDocument, MiasmaticAnalysis } from "./materiaMedicaSchema";
import { MASTER_REMEDY_DB } from "./materiaMedicaDb";
import { resolveCanonicalRemedyId } from "./normalizationEngine";

export { MASTER_REMEDY_DB };

export interface SearchFilters {
  symptomQuery?: string;
  themeQuery?: string;
  modalities?: string[];
  fears?: string[];
  dreams?: string[];
  foodDesires?: string[];
  foodAversions?: string[];
  organAffinities?: string[];
  kingdoms?: string[];
  miasms?: string[];
}

export interface SearchMatchReason {
  facet: string;
  matchText: string;
  score: number;
}

export interface ScoredSearchResult {
  remedy: MateriaMedicaDocument;
  score: number;
  reasons: SearchMatchReason[];
}

// Helper to normalize and match text
const matchesText = (source: string | string[] | undefined, query: string): boolean => {
  if (!source) return false;
  const q = query.toLowerCase().trim();
  if (Array.isArray(source)) {
    return source.some(item => item.toLowerCase().includes(q));
  }
  return source.toLowerCase().includes(q);
};

export const searchRemedies = (filters: SearchFilters): ScoredSearchResult[] => {
  const results: ScoredSearchResult[] = [];

  let canonicalIdQuery: string | null = null;
  if (filters.symptomQuery) {
    const resolved = resolveCanonicalRemedyId(filters.symptomQuery);
    if (MASTER_REMEDY_DB.some(r => r.id === resolved)) {
      canonicalIdQuery = resolved;
    }
  }
  if (!canonicalIdQuery && filters.themeQuery) {
    const resolved = resolveCanonicalRemedyId(filters.themeQuery);
    if (MASTER_REMEDY_DB.some(r => r.id === resolved)) {
      canonicalIdQuery = resolved;
    }
  }

  for (const remedy of MASTER_REMEDY_DB) {
    let score = 0;
    const reasons: SearchMatchReason[] = [];

    if (canonicalIdQuery && remedy.id === canonicalIdQuery) {
      score += 100;
      reasons.push({
        facet: "Canonical Resolve",
        matchText: `Resolved query "${filters.symptomQuery || filters.themeQuery}" to canonical remedy ${remedy.identity.name}`,
        score: 100
      });
    }

    // 1. Symptom Query (searches keynotes, clinical conditions, personality, organs)
    if (filters.symptomQuery) {
      const q = filters.symptomQuery;
      // Check keynotes
      const allKeynotes = [
        ...(remedy.keynotes.top10 || []),
        ...(remedy.keynotes.top25 || []),
        ...(remedy.keynotes.top50 || [])
      ];
      const matchingKeynotes = allKeynotes.filter(k => k.toLowerCase().includes(q.toLowerCase()));
      if (matchingKeynotes.length > 0) {
        score += 15;
        reasons.push({
          facet: "Symptom (Keynote)",
          matchText: `Matches keynote(s): ${matchingKeynotes.slice(0, 3).join(", ")}`,
          score: 15
        });
      }

      // Check clinical conditions
      const matchingConditions = remedy.clinicalConditions.filter(c => 
        c.condition.toLowerCase().includes(q.toLowerCase()) || 
        c.details.toLowerCase().includes(q.toLowerCase())
      );
      if (matchingConditions.length > 0) {
        score += 15;
        reasons.push({
          facet: "Symptom (Clinical Condition)",
          matchText: `Matches clinical condition: ${matchingConditions[0].condition}`,
          score: 15
        });
      }

      // Check personality
      if (matchesText(remedy.mentalPicture.personality, q)) {
        score += 10;
        reasons.push({
          facet: "Symptom (Personality)",
          matchText: `Matches mental picture details`,
          score: 10
        });
      }

      // Check physical generals sleep/energy
      if (matchesText(remedy.physicalGenerals.sleep, q) || matchesText(remedy.physicalGenerals.energyPattern, q)) {
        score += 10;
        reasons.push({
          facet: "Symptom (Physical Generals)",
          matchText: `Matches sleep or energy pattern description`,
          score: 10
        });
      }
    }

    // 2. Theme Query (searches essence core theme, central conflict, compensation)
    if (filters.themeQuery) {
      const q = filters.themeQuery;
      if (matchesText(remedy.essence.coreTheme, q)) {
        score += 15;
        reasons.push({
          facet: "Theme (Core Theme)",
          matchText: `Core Theme: "${remedy.essence.coreTheme.slice(0, 50)}..."`,
          score: 15
        });
      }
      if (matchesText(remedy.essence.centralConflict, q)) {
        score += 10;
        reasons.push({
          facet: "Theme (Conflict)",
          matchText: `Central Conflict matches`,
          score: 10
        });
      }
      if (matchesText(remedy.essence.compensationPattern, q)) {
        score += 10;
        reasons.push({
          facet: "Theme (Compensation)",
          matchText: `Compensation pattern matches`,
          score: 10
        });
      }
    }

    // 3. Modalities Filter
    if (filters.modalities && filters.modalities.length > 0) {
      const allMods = [...remedy.modalities.betterFrom, ...remedy.modalities.worseFrom];
      const matchedMods = filters.modalities.filter(m => 
        allMods.some(am => am.toLowerCase().includes(m.toLowerCase()))
      );
      if (matchedMods.length > 0) {
        score += matchedMods.length * 8;
        reasons.push({
          facet: "Modalities",
          matchText: `Matches modalities: ${matchedMods.join(", ")}`,
          score: matchedMods.length * 8
        });
      }
    }

    // 4. Fears Filter
    if (filters.fears && filters.fears.length > 0) {
      const matchedFears = filters.fears.filter(f => 
        remedy.mentalPicture.fears.some(rf => rf.toLowerCase().includes(f.toLowerCase())) ||
        remedy.mentalPicture.anxietyPatterns.some(ap => ap.toLowerCase().includes(f.toLowerCase()))
      );
      if (matchedFears.length > 0) {
        score += matchedFears.length * 8;
        reasons.push({
          facet: "Fears & Anxieties",
          matchText: `Matches fears/anxieties: ${matchedFears.join(", ")}`,
          score: matchedFears.length * 8
        });
      }
    }

    // 5. Dreams Filter
    if (filters.dreams && filters.dreams.length > 0) {
      const matchedDreams = filters.dreams.filter(d => 
        remedy.physicalGenerals.dreams.some(rd => rd.toLowerCase().includes(d.toLowerCase()))
      );
      if (matchedDreams.length > 0) {
        score += matchedDreams.length * 8;
        reasons.push({
          facet: "Dreams",
          matchText: `Matches dreams: ${matchedDreams.join(", ")}`,
          score: matchedDreams.length * 8
        });
      }
    }

    // 6. Food Desires Filter
    if (filters.foodDesires && filters.foodDesires.length > 0) {
      const matchedDesires = filters.foodDesires.filter(fd => 
        remedy.physicalGenerals.foodDesires.some(rfd => rfd.toLowerCase().includes(fd.toLowerCase()))
      );
      if (matchedDesires.length > 0) {
        score += matchedDesires.length * 8;
        reasons.push({
          facet: "Food Desires",
          matchText: `Matches cravings: ${matchedDesires.join(", ")}`,
          score: matchedDesires.length * 8
        });
      }
    }

    // 7. Food Aversions Filter
    if (filters.foodAversions && filters.foodAversions.length > 0) {
      const matchedAversions = filters.foodAversions.filter(fa => 
        remedy.physicalGenerals.foodAversions.some(rfa => rfa.toLowerCase().includes(fa.toLowerCase()))
      );
      if (matchedAversions.length > 0) {
        score += matchedAversions.length * 8;
        reasons.push({
          facet: "Food Aversions",
          matchText: `Matches aversions: ${matchedAversions.join(", ")}`,
          score: matchedAversions.length * 8
        });
      }
    }

    // 8. Organ Affinities Filter
    if (filters.organAffinities && filters.organAffinities.length > 0) {
      const matchedOrgans = filters.organAffinities.filter(o => 
        remedy.organAffinities.some(ra => ra.organ.toLowerCase().includes(o.toLowerCase()))
      );
      if (matchedOrgans.length > 0) {
        score += matchedOrgans.length * 10;
        reasons.push({
          facet: "Organ Affinities",
          matchText: `Matches organ affinity: ${matchedOrgans.join(", ")}`,
          score: matchedOrgans.length * 10
        });
      }
    }

    // 9. Kingdoms Filter
    if (filters.kingdoms && filters.kingdoms.length > 0) {
      const matchedKingdom = filters.kingdoms.some(k => 
        remedy.identity.kingdom.toLowerCase() === k.toLowerCase()
      );
      if (matchedKingdom) {
        score += 10;
        reasons.push({
          facet: "Kingdom",
          matchText: `Matches kingdom: ${remedy.identity.kingdom}`,
          score: 10
        });
      }
    }

    // 10. Miasms Filter
    if (filters.miasms && filters.miasms.length > 0) {
      const matchedMiasms = filters.miasms.filter(m => {
        const mKey = m.toLowerCase() as keyof MiasmaticAnalysis;
        const miasmVal = remedy.miasmaticAnalysis[mKey];
        return typeof miasmVal === "number" && miasmVal >= 25; // 25% or higher
      });
      if (matchedMiasms.length > 0) {
        score += matchedMiasms.length * 10;
        reasons.push({
          facet: "Miasms",
          matchText: `High miasmatic expression (>=25%): ${matchedMiasms.join(", ")}`,
          score: matchedMiasms.length * 10
        });
      }
    }

    if (score > 0) {
      results.push({ remedy, score, reasons });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
};

// ==========================================
// COMPARISON ENGINE INTERFACES & IMPLEMENTATIONS
// ==========================================

export interface FamilyComparisonData {
  familyA: string;
  familyB: string;
  remediesA: string[];
  remediesB: string[];
  themesA: string[];
  themesB: string[];
  physicalA: string[];
  physicalB: string[];
  averageMiasmWeightsA: Record<string, number>;
  averageMiasmWeightsB: Record<string, number>;
  clinicalA: string[];
  clinicalB: string[];
}

export interface KingdomComparisonData {
  kingdomA: string;
  kingdomB: string;
  remediesA: string[];
  remediesB: string[];
  psychologicalThemesA: string[];
  psychologicalThemesB: string[];
  somaticFocusA: string[];
  somaticFocusB: string[];
  miasmaticTendencyA: string[];
  miasmaticTendencyB: string[];
  expressionSpeedA: string; // e.g. "Slow & deep", "Violent & sudden"
  expressionSpeedB: string;
}

export interface MiasmComparisonData {
  miasmA: string;
  miasmB: string;
  coreConceptA: string;
  coreConceptB: string;
  dermalExpressionA: string;
  dermalExpressionB: string;
  mentalStateA: string;
  mentalStateB: string;
  modalitiesA: string[];
  modalitiesB: string[];
  representativeRemediesA: string[];
  representativeRemediesB: string[];
}

// Kingdom Data Templates
export const KINGDOM_PROFILES: Record<string, {
  themes: string[];
  somatic: string[];
  miasms: string[];
  speed: string;
}> = {
  plant: {
    themes: [
      "Extreme sensitivity and reactivity to the environment",
      "Adapting or adjusting to external influences",
      "Experiencing sensations acutely (pain, stiffness, tightening, bursting)",
      "Vulnerable, easily hurt or offended, soft, and emotional"
    ],
    somatic: [
      "Localized tissue reactions, cramping, neuralgic pains, spasms",
      "Catarrhal mucus discharges, sudden inflammation",
      "Ameliorated or aggravated by temperature changes and touch"
    ],
    miasms: ["Psora (irritation)", "Sycosis (catarrhs, changeability)", "Tubercular (quick breakdown)"],
    speed: "Sudden or rapid onset of symptoms, changing frequently"
  },
  mineral: {
    themes: [
      "Struggle to build, maintain, or repair structural safety",
      "Themes of responsibility, performance, duty, work, and financial security",
      "Fear of losing relations, home, or physical support system",
      "Logical, organized, systematic, and analytical thinking"
    ],
    somatic: [
      "Deep bone, joint, and glandular pathologies",
      "Metabolic sluggishness, nutritional assimilation defects, calcification",
      "Slow, progressive, chronic developments over years"
    ],
    miasms: ["Psora (sluggish metabolism)", "Syphilis (structural breakdown, necrosis)", "Cancerinic (perfectionism)"],
    speed: "Slow, steady, deep-acting progression with low reactivity"
  },
  animal: {
    themes: [
      "Survival of the fittest: competitor vs rival, victim vs aggressor",
      "Focus on attractiveness, hierarchy, jealousy, and social dominance",
      "Fear of being attacked, poisoned, restricted, or cornered",
      "Lively, communicative, passion-driven, expressive, and passionate"
    ],
    somatic: [
      "Blood, blood vessels, nervous system, and venomous reactions",
      "Septic states, decomposition of tissues, sudden choking/suffocation",
      "Aggravated by confinement, sleep, and pressure; relieved by discharges"
    ],
    miasms: ["Sycosis (jealousy, hiding, excess)", "Syphilis (violence, necrosis, bleeding)"],
    speed: "Quick, active, destructive, with high intensity and emotional charge"
  },
  nosode: {
    themes: [
      "Deep-seated struggle with a chronic, inherited disease state",
      "Dread of failure, feeling dirty, contaminated, or fundamentally flawed",
      "Desperation, hopelessness, or hyper-intensity to overcome a curse",
      "Sensation of stagnation, decay, and persistent barriers"
    ],
    somatic: [
      "Congenital weaknesses, stubborn chronic states resistant to ordinary remedies",
      "Destructive glandular, pulmonary, or cutaneous eruptions",
      "Bizarre, paradoxical, or highly stubborn modalities"
    ],
    miasms: ["Tubercular (hectic decay)", "Cancerinic (absolute loss of control)", "Syphilis (degeneration)"],
    speed: "Insidious, destructive, deeply entrenched, and highly stubborn"
  }
};

// Miasm Data Templates
export const MIASM_PROFILES: Record<string, {
  core: string;
  dermal: string;
  mental: string;
  modalities: string[];
}> = {
  psora: {
    core: "Functional deficiency, irritation, struggle. The origin of all chronic diseases. Internal lack leads to external hyper-reactivity.",
    dermal: "Dry, scaly, intensely itchy skin eruptions, worse warmth of bed, leaving red burning skin. No structural destruction.",
    mental: "Anxiety about the future, health, and financial survival. Restless struggle, hopefulness, theoretical speculations.",
    modalities: ["Worse standing", "Worse warmth of bed", "Better open air", "Worse bathing"]
  },
  sycosis: {
    core: "Retention, multiplication, excess, hiding. Undergrowth, overgrowth, accumulation. Concealment of defects.",
    dermal: "Warty growths, condylomata, thick skin, oily secretions, dark skin tags, catarrhal yellow-green discharges.",
    mental: "Suspicion, jealousy, secretiveness, guilt, fixed ideas, obsessive-compulsive patterns, and dread of exposure.",
    modalities: ["Worse damp cold", "Worse after midnight", "Better motion", "Ameliorated by discharges"]
  },
  syphilis: {
    core: "Destruction, degeneration, ulceration, death. Complete structural decay, necrosis, self-destruction, and deformation.",
    dermal: "Deep copper-colored ulcers, clean-cut margins, necrotic sores, gangrene, painful nocturnal bone pains.",
    mental: "Despair, hopelessness, suicidal impulses, violent anger, dementia, memory loss, and mental paralysis.",
    modalities: ["Worse sunset to sunrise (nocturnal)", "Worse damp heat", "Worse cold applications"]
  },
  tubercular: {
    core: "Oppression, hectic activity, decay, desire for change. Feeling trapped in a narrow space, needing travel, fresh air, and movement.",
    dermal: "Rapidly spreading eczema, ringworm, bleeding cracks, dry scaling skin with hectic flushes of cheeks.",
    mental: "Restlessness, intense desire to travel, dissatisfaction, romanticism, hyper-activity followed by rapid exhaustion.",
    modalities: ["Better cold dry open air", "Worse cold damp weather", "Better constant motion"]
  },
  cancerinic: {
    core: "Chaos, loss of control, hyper-responsibility, perfectionism. Over-adaptation to demands leading to inner cellular rebellion.",
    dermal: "Pigmented nevi, blue-black moles, cracks at corners of mouth, stubborn acne, chronic indurations.",
    mental: "Perfectionist, fastidious, hyper-responsible child, artistic, sensitive to reprimand, suppresses own desires for others.",
    modalities: ["Better at sea or mountain", "Better sleep", "Worse at 4 PM or early morning"]
  }
};

// COMPARE FUNCTIONS

export const compareRemedies = (idA: string, idB: string): { remedyA?: MateriaMedicaDocument, remedyB?: MateriaMedicaDocument } => {
  const remedyA = MASTER_REMEDY_DB.find(r => r.id === idA);
  const remedyB = MASTER_REMEDY_DB.find(r => r.id === idB);
  return { remedyA, remedyB };
};

export const compareFamilies = (familyAName: string, familyBName: string): FamilyComparisonData => {
  const remediesA = MASTER_REMEDY_DB.filter(r => r.identity.family.toLowerCase().includes(familyAName.toLowerCase()));
  const remediesB = MASTER_REMEDY_DB.filter(r => r.identity.family.toLowerCase().includes(familyBName.toLowerCase()));

  // Average miasm profile
  const avgMiasmA: Record<string, number> = { psora: 0, sycosis: 0, syphilis: 0, tubercular: 0, cancerinic: 0 };
  const avgMiasmB: Record<string, number> = { psora: 0, sycosis: 0, syphilis: 0, tubercular: 0, cancerinic: 0 };

  if (remediesA.length > 0) {
    remediesA.forEach(r => {
      avgMiasmA.psora += r.miasmaticAnalysis.psora;
      avgMiasmA.sycosis += r.miasmaticAnalysis.sycosis;
      avgMiasmA.syphilis += r.miasmaticAnalysis.syphilis;
      avgMiasmA.tubercular += r.miasmaticAnalysis.tubercular;
      avgMiasmA.cancerinic += r.miasmaticAnalysis.cancerinic || 0;
    });
    Object.keys(avgMiasmA).forEach(k => {
      avgMiasmA[k] = Math.round(avgMiasmA[k] / remediesA.length);
    });
  }

  if (remediesB.length > 0) {
    remediesB.forEach(r => {
      avgMiasmB.psora += r.miasmaticAnalysis.psora;
      avgMiasmB.sycosis += r.miasmaticAnalysis.sycosis;
      avgMiasmB.syphilis += r.miasmaticAnalysis.syphilis;
      avgMiasmB.tubercular += r.miasmaticAnalysis.tubercular;
      avgMiasmB.cancerinic += r.miasmaticAnalysis.cancerinic || 0;
    });
    Object.keys(avgMiasmB).forEach(k => {
      avgMiasmB[k] = Math.round(avgMiasmB[k] / remediesB.length);
    });
  }

  return {
    familyA: familyAName,
    familyB: familyBName,
    remediesA: remediesA.map(r => r.identity.name),
    remediesB: remediesB.map(r => r.identity.name),
    themesA: Array.from(new Set(remediesA.map(r => r.essence.coreTheme))),
    themesB: Array.from(new Set(remediesB.map(r => r.essence.coreTheme))),
    physicalA: Array.from(new Set(remediesA.map(r => r.physicalGenerals.thermalState))),
    physicalB: Array.from(new Set(remediesB.map(r => r.physicalGenerals.thermalState))),
    averageMiasmWeightsA: avgMiasmA,
    averageMiasmWeightsB: avgMiasmB,
    clinicalA: Array.from(new Set(remediesA.flatMap(r => r.clinicalConditions.map(c => c.condition)))),
    clinicalB: Array.from(new Set(remediesB.flatMap(r => r.clinicalConditions.map(c => c.condition))))
  };
};

export const compareKingdoms = (kingdomAName: string, kingdomBName: string): KingdomComparisonData => {
  const normalizedK_A = kingdomAName.toLowerCase();
  const normalizedK_B = kingdomBName.toLowerCase();

  const remediesA = MASTER_REMEDY_DB.filter(r => r.identity.kingdom.toLowerCase() === normalizedK_A).map(r => r.identity.name);
  const remediesB = MASTER_REMEDY_DB.filter(r => r.identity.kingdom.toLowerCase() === normalizedK_B).map(r => r.identity.name);

  const profileA = KINGDOM_PROFILES[normalizedK_A] || { themes: [], somatic: [], miasms: [], speed: "Unknown" };
  const profileB = KINGDOM_PROFILES[normalizedK_B] || { themes: [], somatic: [], miasms: [], speed: "Unknown" };

  return {
    kingdomA: kingdomAName,
    kingdomB: kingdomBName,
    remediesA,
    remediesB,
    psychologicalThemesA: profileA.themes,
    psychologicalThemesB: profileB.themes,
    somaticFocusA: profileA.somatic,
    somaticFocusB: profileB.somatic,
    miasmaticTendencyA: profileA.miasms,
    miasmaticTendencyB: profileB.miasms,
    expressionSpeedA: profileA.speed,
    expressionSpeedB: profileB.speed
  };
};

export const compareMiasms = (miasmAName: string, miasmBName: string): MiasmComparisonData => {
  const normalizedM_A = miasmAName.toLowerCase();
  const normalizedM_B = miasmBName.toLowerCase();

  const profileA = MIASM_PROFILES[normalizedM_A] || { core: "", dermal: "", mental: "", modalities: [] };
  const profileB = MIASM_PROFILES[normalizedM_B] || { core: "", dermal: "", mental: "", modalities: [] };

  // Find representative remedies (ones where the miasm is >= 40%)
  const repsA = MASTER_REMEDY_DB.filter(r => {
    const miasmVal = r.miasmaticAnalysis[normalizedM_A as keyof MiasmaticAnalysis];
    return typeof miasmVal === "number" && miasmVal >= 40;
  }).map(r => `${r.identity.name} (${r.miasmaticAnalysis[normalizedM_A as keyof MiasmaticAnalysis]}%)`);

  const repsB = MASTER_REMEDY_DB.filter(r => {
    const miasmVal = r.miasmaticAnalysis[normalizedM_B as keyof MiasmaticAnalysis];
    return typeof miasmVal === "number" && miasmVal >= 40;
  }).map(r => `${r.identity.name} (${r.miasmaticAnalysis[normalizedM_B as keyof MiasmaticAnalysis]}%)`);

  return {
    miasmA: miasmAName,
    miasmB: miasmBName,
    coreConceptA: profileA.core,
    coreConceptB: profileB.core,
    dermalExpressionA: profileA.dermal,
    dermalExpressionB: profileB.dermal,
    mentalStateA: profileA.mental,
    mentalStateB: profileB.mental,
    modalitiesA: profileA.modalities,
    modalitiesB: profileB.modalities,
    representativeRemediesA: repsA,
    representativeRemediesB: repsB
  };
};

// ==========================================
// ADAPTER FOR COGNITIVE LEARNING cockpit
// ==========================================

import { getKnowledgeGraph } from "./knowledgeGraph";

export interface RemedyLearningData {
  remedyId: string;
  label: string;
  stories: {
    title: string;
    narrative: string;
  };
  mnemonics: {
    acronym: string;
    lines: { letter: string; description: string }[];
  };
  organAffinities: { organ: string; rating: number; details: string }[];
  flashcards: { question: string; answer: string }[];
  quizzes: { question: string; options: string[]; correctIdx: number; explanation: string }[];
  timeline: { year: string; author: string; milestone: string }[];
}

const STORY_LOOKUP: Record<string, { title: string; narrative: string }> = {
  rem_sulphur: {
    title: "The Ragged Philosopher's Dilemma",
    narrative: "Imagine a brilliant scholar sitting in a dusty room surrounded by piles of unread books. His hair is unkempt, his clothes are stained, and he couldn't care less about what others think of his appearance. He is deep in philosophical speculation, conceiving grand theories about the universe. Suddenly, it's 11 AM, and his stomach drops with an empty, sinking hunger. That night, he tosses and turns under warm blankets, his feet burning like fire until he throws them out of bed. This is Sulphur—hot-blooded, theoretical, untidy, and prone to fiery skin eruptions that are aggravated by the warmth of bed."
  },
  rem_lycopodium: {
    title: "The Mask of the Insecure Director",
    narrative: "Lycopodium is like a newly promoted manager who acts authoritarian and dictatorial to hide a deep, paralyzing insecurity. Inside, he is terrified of public speaking and stage fright, but outside he projects supreme confidence. He is highly intellectual and hates contradiction. Physically, his weakness lies in his digestive system—eating even a tiny bite makes him bloated and flatulent, specifically between 4 PM and 8 PM. He is chilly but loves cool air on his face, and his symptoms typically start on the right side of the body and move to the left."
  },
  rem_nux_vomica: {
    title: "The Driven Executive's Breakdown",
    narrative: "Nux Vomica is the ambitious, workaholic corporate executive. He runs on coffee, alcohol, spices, and high-stress meetings. He has zero patience for slow-talking people and gets extremely irritable over minor interruptions. Physically, he is intensely chilly, flinching at the slightest cold draft. His digestive system is spastic—he suffers from cramps, heartburn, and constipation with a frustrating ineffectual urging. If he can take a 10-minute nap in the afternoon, he wakes up completely refreshed. This is Nux Vomica—spastic, chilly, irritable, and driven."
  },
  rem_arsenicum: {
    title: "The Terrified Curator",
    narrative: "Arsenicum is the fastidious art gallery curator who lives in constant terror of disease, death, and financial ruin. Every painting must be hung exactly straight; if a desk is slightly cluttered, it triggers intense anxiety. He is highly restless, pacing the room in panic, yet physically very weak. He is extremely chilly and experiences burning pains (like hot coals) that are paradoxically relieved by warm applications. When sick, he is thirsty for warm water, which he takes in tiny, frequent sips because large gulps aggravate his stomach."
  },
  rem_calcarea: {
    title: "The Sluggish Oyster",
    narrative: "Calcarea Carbonica is the chubby, sluggish, sweet-tempered child who develops slowly. He is extremely chilly, sensitive to damp drafty air, and sweats profusely around the back of his neck and head when sleeping, wetting his pillow. He craves soft-boiled eggs and ice cream. He is slow to walk and slow to teething. When stressed, he develops a deep apprehension that he is going insane or that others will perceive his mental weakness. Like the oyster, he builds a thick protective calcium shell of security and routine to shield his flabby, vulnerable core."
  },
  rem_lachesis: {
    title: "The Overflowing Cauldron",
    narrative: "Lachesis is the hyper-talkative, passionate, and highly suspicious character who speaks with rapid loquacity, jumping from topic to topic. She cannot stand any physical constriction—she will rip off tight collars, neckties, or waistbands because she feels suffocated by them. She is warm-blooded, congestive, and suffers from dark purple throat swelling that begins on the left side and moves to the right. Her worst time is upon waking from sleep; she wakes in a suffocative fit of panic. Physically, she is relieved by any discharge, like nosebleeds or menstruation."
  },
  rem_pulsatilla: {
    title: "The Weeping Anemone",
    narrative: "Pulsatilla is the gentle, emotional, and dependency-seeking windflower that bends with every breeze. She weeps easily when telling her symptoms, but is instantly comforted by sympathy and consolation. Physically, she is warm-blooded but paradoxically thirstless, even with a dry mouth. She cannot tolerate stuffy, warm rooms, which make her feel suffocated; she constantly seeks open, cool air. Her symptoms are highly changeable—she might have joint pain that shifts from knee to elbow, or a stool that is never the same twice. Her discharges are thick, yellow-green, and bland."
  },
  rem_gelsemium: {
    title: "The Paralyzed Performer",
    narrative: "Gelsemium is the student facing a major board exam, or the performer about to go on stage, who is paralyzed with fear. His muscles tremble, his eyelids droop with a heavy dullness, and his bowels suddenly purge with nervous diarrhea. When he gets the flu, he lies in bed completely motionless, apathetic, and dull. He doesn't want to speak, move, or be disturbed. He is chilly, feeling shivers run up and down his spine, but is thirstless even during a high fever. His splitting headache starts at the base of the neck and is peculiarly relieved by a profuse flow of urine."
  },
  rem_bryonia: {
    title: "The Dry Miser",
    narrative: "Bryonia is the irritable, practical businessman who is obsessed with financial security and talks constantly about his business affairs. When sick, his mind is consumed with a fear of poverty. He wants to lie absolutely still; the slightest motion—even moving his eyes or breathing deeply—causes intense, splitting, stitching pain. Every mucous membrane in his body is bone dry: he has dry lips, a dry painful cough where he must hold his chest to prevent movement, and a dry, hard, burnt-looking stool. He has a massive thirst for huge quantities of cold water at long intervals, and is relieved by lying directly on his painful side."
  },
  rem_aconite: {
    title: "The Sudden Storm of Terror",
    narrative: "Aconite is like a violent lightning storm that comes out of nowhere. A patient is exposed to a cold, dry, biting wind, and within hours, develops a sky-high fever, dry burning skin, and an intense, agonizing panic. He is convinced he is going to die immediately, even predicting the exact hour of his death. He tosses and turns in bed in absolute restlessness. His cough is a sudden, dry, barking croup. This is Aconite—characterized by sudden onset, violent intensity, dry burning heat, and supreme mental terror."
  },
  rem_nat_mur: {
    title: "The Silent Griever",
    narrative: "Imagine a reserved, dignified person who carries a heavy, silent grief deep in their heart. They refuse to weep in public, reject all consolation (which makes them angry or cold), and seek solitude. They dwell on past hurts, love salty food, and feel worse in the heat of the sun. This is Natrum Mur—introverted, loyal, grieving, and closed to external intrusion."
  },
  rem_phosphorus: {
    title: "The Bright Sparkler",
    narrative: "Phosphorus is like a brilliant, warm, sparkling light. They are highly empathetic, open, make friends instantly, and love to be magnetic. But like a sparkler, they burn out quickly into sudden exhaustion. They are highly anxious, especially when alone or in the dark. Physically, they are chilly but crave ice-cold drinks which soothe their burning stomach, though they vomit them as soon as they become warm. They are prone to sudden, profuse bleeding."
  },
  rem_silicea: {
    title: "The Delicate Crystal",
    narrative: "Silicea is like a delicate, clear glass crystal. They are highly refined, polite, and intellectual, but lack grit and self-confidence. They have a deep dread of failure and public speaking, yet are obstinate and hold onto their ideas quietly. Physically, they are extremely chilly, aggravated by cold drafts, and must wrap their head warmly. They have offensive, sour, sweaty feet that can cause them to catch cold if suppressed. They have a tendency to form pus or fistulas and are slow to heal."
  },
  rem_sepia: {
    title: "The Exhausted Mother",
    narrative: "Sepia is the worn-out, exhausted person who feels completely drained by family duties. They have lost all affection for their loved ones and want to run away. They are sad, irritable, and seek quiet solitude. Physically, they have a sallow, yellow complexion (often with a saddle-like brown patch across the nose). They suffer from a constant bearing-down sensation in the pelvis (as if organs will escape) and must cross their legs for support. They are chilly, but are dramatically relieved by violent physical exercise (like dancing or fast walking)."
  },
  rem_belladonna: {
    title: "The Scarlet Fire",
    narrative: "Belladonna is like a sudden eruptive fire. It is characterized by intense congestion, throbbing, redness, and burning heat. Symptoms come on with extreme suddenness. The face is flushed bright red, the pupils are dilated and glassy, and the carotid arteries throb violently. They are hyper-sensitive to light, noise, jar, and drafts. When delirious with a high fever, they may bite, strike, or scream. Symptoms are typically right-sided."
  },
  rem_apis: {
    title: "The Busy Bee",
    narrative: "Apis is the busy bee—restless, active, jealous, and clumsy (drops things easily). Physically, they present with severe swelling (edema) that is puffy, pink, and water-logged, resembling a bee sting. They experience sharp, stinging, and burning pains. They are extremely hot-blooded and cannot tolerate any heat or warm rooms; they are completely thirstless even during dropsy and fever, and are dramatically relieved by cold applications and cool open air."
  }
};

const MNEMONIC_LOOKUP: Record<string, { acronym: string; lines: { letter: string; description: string }[] }> = {
  rem_sulphur: {
    acronym: "SULPHUR",
    lines: [
      { letter: "S", description: "Soles of feet burning at night in bed." },
      { letter: "U", description: "Untidy, ragged philosopher archetype." },
      { letter: "L", description: "Late morning sinking hunger at 11 AM." },
      { letter: "P", description: "Philosophical speculation and egotism." },
      { letter: "H", description: "Heat aggravation; strongly warm-blooded." },
      { letter: "U", description: "Uncomfortable standing still; causes backache." },
      { letter: "R", description: "Redness of all mucous membranes and external orifices." }
    ]
  },
  rem_lycopodium: {
    acronym: "LYCOPODIUM",
    lines: [
      { letter: "L", description: "Lack of self-confidence hidden by authority." },
      { letter: "Y", description: "Yielding mind in private, dictatorial in public." },
      { letter: "C", description: "Chilly, but desires cold air on the face." },
      { letter: "O", description: "Oppressed by gas, bloating immediately after food." },
      { letter: "P", description: "Periodic aggravation from 4 PM to 8 PM." },
      { letter: "O", description: "One foot hot, one foot cold." },
      { letter: "D", description: "Desires sweets, warm foods, and warm drinks." },
      { letter: "I", description: "Intellectual supremacy over physical power." },
      { letter: "U", description: "Urinary symptoms; red sand in urine." },
      { letter: "M", description: "Moves from right side to left side." }
    ]
  },
  rem_nux_vomica: {
    acronym: "NUXVOMICA",
    lines: [
      { letter: "N", description: "Nap of 10-15 minutes refreshes completely." },
      { letter: "U", description: "Urging for stool that is ineffectual and spastic." },
      { letter: "X", description: "Xerostomia (dry mouth) with morning bitter taste." },
      { letter: "V", description: "Violent anger, impatience, and irritability." },
      { letter: "O", description: "Over-stimulated by coffee, alcohol, and stress." },
      { letter: "M", description: "Morning aggravation, especially around 3-4 AM." },
      { letter: "I", description: "Intense chilliness; cannot uncover in bed." },
      { letter: "C", description: "Cramps and spastic pains in stomach." },
      { letter: "A", description: "Ambitious workaholic seeking stimulants." }
    ]
  },
  rem_arsenicum: {
    acronym: "ARSENIC",
    lines: [
      { letter: "A", description: "Anxiety about health, death, and cleanliness." },
      { letter: "R", description: "Restlessness physically, combined with extreme weakness." },
      { letter: "S", description: "Sips of warm water, taken frequently." },
      { letter: "E", description: "Exacting orderliness and fastidiousness." },
      { letter: "N", description: "Night aggravation, specifically 12 AM - 2 AM." },
      { letter: "I", description: "Ice-cold sensations, yet burning pains relieved by heat." },
      { letter: "C", description: "Chilly state; desires extreme physical warmth." }
    ]
  },
  rem_calcarea: {
    acronym: "CALCAREA",
    lines: [
      { letter: "C", description: "Chilly, damp feet feeling like cold wet socks." },
      { letter: "A", description: "Apprehension and fear of losing one's mind." },
      { letter: "L", description: "Lymph node enlargement and glandular swelling." },
      { letter: "C", description: "Craves soft-boiled eggs and indigestible things." },
      { letter: "A", description: "Aggravated by damp, cold drafts, and physical exertion." },
      { letter: "R", description: "Rooted in slow development and sluggish metabolism." },
      { letter: "E", description: "Easy sweating, especially on the back of neck during sleep." },
      { letter: "A", description: "Ameliorated by dry weather and lying down." }
    ]
  },
  rem_lachesis: {
    acronym: "LACHESIS",
    lines: [
      { letter: "L", description: "Left-sided symptoms, especially throat and ovaries." },
      { letter: "A", description: "Aggravation after sleep; wakes in suffocative fits." },
      { letter: "C", description: "Constriction intolerable; cannot bear tight collars." },
      { letter: "H", description: "Hemorrhages of dark, liquid, non-coagulating blood." },
      { letter: "E", description: "Extreme loquacity, speaking rapidly with changing topics." },
      { letter: "S", description: "Suspicion, jealousy, and competitive anxiety." },
      { letter: "I", description: "Intolerance to touch or pressure, even of light clothes." },
      { letter: "S", description: "Soothed and relieved by flow of discharges." }
    ]
  },
  rem_pulsatilla: {
    acronym: "PULSATILLA",
    lines: [
      { letter: "P", description: "Pliable, gentle, and yielding disposition." },
      { letter: "U", description: "Unstable, changeable symptoms (shifting pains)." },
      { letter: "L", description: "Lacks thirst, despite dry mouth." },
      { letter: "S", description: "Soothed by consolation and gentle sympathy." },
      { letter: "A", description: "Aggravated by warm, stuffy, unventilated rooms." },
      { letter: "T", description: "Thick, yellow-green, bland discharges." },
      { letter: "I", description: "Intolerance to rich, fatty foods and pastry." },
      { letter: "L", description: "Likes slow motion in open cool air." },
      { letter: "L", description: "Lies with hands overhead during restless sleep." },
      { letter: "A", description: "Abandonment fears; clings to company." }
    ]
  },
  rem_gelsemium: {
    acronym: "GELS",
    lines: [
      { letter: "G", description: "Grave muscular weakness, trembling, and paralysis." },
      { letter: "E", description: "Eyelids heavy and drooping (ptosis); sleepy look." },
      { letter: "L", description: "Loose bowels (diarrhea) triggered by stage fright." },
      { letter: "S", description: "Splitting occipital headache relieved by profuse urination." }
    ]
  },
  rem_bryonia: {
    acronym: "BRYONIA",
    lines: [
      { letter: "B", description: "Business talk; obsessed with financial security and work." },
      { letter: "R", description: "Rest absolute is required; slightest motion aggravates." },
      { letter: "Y", description: "Yearns for large quantities of cold water." },
      { letter: "O", description: "Occipital headache extending to forehead, worse moving eyes." },
      { letter: "N", description: "No moisture; extreme dryness of mucous membranes." },
      { letter: "I", description: "Intense stitching or stitching-like pains." },
      { letter: "A", description: "Ameliorated by lying on the painful side (hard pressure)." }
    ]
  },
  rem_aconite: {
    acronym: "ACONITE",
    lines: [
      { letter: "A", description: "Acute onset, sudden and violent in nature." },
      { letter: "C", description: "Cold dry wind exposure is the primary trigger." },
      { letter: "O", description: "Obvious panic and prediction of the hour of death." },
      { letter: "N", description: "Night aggravation, especially around midnight." },
      { letter: "I", description: "Intense restlessness, tossing, and turning." },
      { letter: "T", description: "Thirsty for large amounts of cold water." },
      { letter: "E", description: "Extreme dry burning skin with high fever." }
    ]
  },
  rem_nat_mur: {
    acronym: "NATMUR",
    lines: [
      { letter: "N", description: "No consolation accepted; consolation aggravates." },
      { letter: "A", description: "Aggravation under the heat of the sun." },
      { letter: "T", description: "Tears in secret; hides emotional grief." },
      { letter: "M", description: "Memory dwells on past insults and disagreeable events." },
      { letter: "U", description: "Unique craving for table salt and salty foods." },
      { letter: "R", description: "Reserved, introverted, and closed personality." }
    ]
  },
  rem_phosphorus: {
    acronym: "PHOSPHOR",
    lines: [
      { letter: "P", description: "Profuse bleeding of bright red blood." },
      { letter: "H", description: "Hyper-sensitive and highly empathetic to others." },
      { letter: "O", description: "Open, friendly, communicative, and magnetic." },
      { letter: "S", description: "Solitude causes intense anxiety; seeks company." },
      { letter: "P", description: "Panic in the dark and during thunderstorms." },
      { letter: "H", description: "Hot stomach burning, yet craves ice-cold drinks." },
      { letter: "O", description: "Out of energy suddenly; rapid burnout." },
      { letter: "R", description: "Relieved by short sleep or refreshing naps." }
    ]
  },
  rem_silicea: {
    acronym: "SILICEA",
    lines: [
      { letter: "S", description: "Sweaty feet, highly offensive and sour." },
      { letter: "I", description: "Intellectual but lacks grit and self-confidence." },
      { letter: "L", description: "Likes head to be wrapped up warmly; highly chilly." },
      { letter: "I", description: "Inability to heal quickly; tendency to suppurate." },
      { letter: "C", description: "Cold drafts aggravate; sensitive to temperature drops." },
      { letter: "E", description: "Expels foreign bodies (splinters, needles) from tissues." },
      { letter: "A", description: "Apprehensive of failure, yet obstinate." }
    ]
  },
  rem_sepia: {
    acronym: "SEPIA",
    lines: [
      { letter: "S", description: "Sadness and indifference to family and loved ones." },
      { letter: "E", description: "Exhausted by maternal duties and life strain." },
      { letter: "P", description: "Pelvic bearing-down sensation, must cross legs." },
      { letter: "I", description: "Improved by violent, rapid physical exercise (dancing)." },
      { letter: "A", description: "Aversion to sexual interaction and sympathy." }
    ]
  },
  rem_belladonna: {
    acronym: "BELLADONNA",
    lines: [
      { letter: "B", description: "Bright red flushed face and dilated pupils." },
      { letter: "E", description: "Extreme sensitivity to jarring, noise, and light." },
      { letter: "L", description: "Local burning heat, throbbing, and redness." },
      { letter: "L", description: "Lightning-like sudden onset of symptoms." },
      { letter: "A", description: "Aggravated by cold drafts on the head." }
    ]
  },
  rem_apis: {
    acronym: "APIS",
    lines: [
      { letter: "A", description: "Angry, jealous, clumsy, and busy bee archetype." },
      { letter: "P", description: "Puffy pink swelling and water-logged edema." },
      { letter: "I", description: "Intolerant of heat; warm closed rooms are suffocating." },
      { letter: "S", description: "Stinging, burning pains relieved by cold applications." }
    ]
  }
};

const TIMELINE_LOOKUP: Record<string, { year: string; author: string; milestone: string }[]> = {
  rem_sulphur: [
    { year: "1805", author: "Samuel Hahnemann", milestone: "First proving of Sulphur published in Fragmenta de viribus." },
    { year: "1828", author: "Samuel Hahnemann", milestone: "Established as the primary anti-psoric polychrest in Chronic Diseases." },
    { year: "1900", author: "J.T. Kent", milestone: "Detailed description of the 'Ragged Philosopher' in Lectures on Homoeopathic Materia Medica." }
  ],
  rem_lycopodium: [
    { year: "1828", author: "Samuel Hahnemann", milestone: "Included in Chronic Diseases after proving the club moss spores." },
    { year: "1880", author: "C. von Boenninghausen", milestone: "Documented the right-to-left sides of body relationship and verified it." },
    { year: "1905", author: "J.T. Kent", milestone: "Detailed the cognitive stage fright and performance anxiety layers in lectures." }
  ],
  rem_nux_vomica: [
    { year: "1805", author: "Samuel Hahnemann", milestone: "Proved and published in Fragmenta de viribus, documenting its anti-spasmodic nature." },
    { year: "1890", author: "E.B. Nash", milestone: "Highlighted Nux Vomica as one of the 'Leaders in Typhoid and Dyspeptic States'." },
    { year: "1905", author: "J.T. Kent", milestone: "Established the correlation between Nux Vomica and modern sedentary lifestyle stressors." }
  ],
  rem_arsenicum: [
    { year: "1805", author: "Samuel Hahnemann", milestone: "First clinical provings of Arsenic Trioxide published in Fragmenta." },
    { year: "1850", author: "C. Hering", milestone: "Documented the toxicological and pathogenetic patterns of Arsenicum." },
    { year: "1900", author: "J.H. Clarke", milestone: "Aggregated the respiratory, gastrointestinal, and dermatological differentials in Dictionary." }
  ],
  rem_calcarea: [
    { year: "1828", author: "Samuel Hahnemann", milestone: "Introduced Calcarea Carbonica in Chronic Diseases, proving the inner oyster shell." },
    { year: "1897", author: "H.C. Allen", milestone: "Detailed its pediatric growth delay, bone development, and egg-craving indicators." },
    { year: "1910", author: "J.T. Kent", milestone: "Sourced clinical cases linking Calcarea sluggishness with metabolic hypofunction." }
  ],
  rem_lachesis: [
    { year: "1837", author: "Constantine Hering", milestone: "Proved Lachesis Muta using venom he extracted himself from a live Surukuku snake in South America." },
    { year: "1880", author: "C. Hering", milestone: "Published detailed ophidian toxicology and clinical notes in Guiding Symptoms." },
    { year: "1905", author: "J.T. Kent", milestone: "Clarified the menopausal hot flushes and sleeping-into-aggravation dynamics." }
  ],
  rem_pulsatilla: [
    { year: "1805", author: "Samuel Hahnemann", milestone: "First published provings of Pulsatilla in Fragmenta de viribus." },
    { year: "1885", author: "J.H. Clarke", milestone: "Mapped its gynecological, venous, and pediatric profiles in Dictionary." },
    { year: "1905", author: "J.T. Kent", milestone: "Synthesized the emotional dependencies and thirstless-warm modalities in lectures." }
  ],
  rem_gelsemium: [
    { year: "1852", author: "Edwin M. Hale", milestone: "Introduced Gelsemium into homoeopathic practice, documenting its neural paralysis." },
    { year: "1875", author: "T.F. Allen", milestone: "Proved and documented the Ptosis (heavy eyelids) and muscle trembling in Encyclopedia." },
    { year: "1905", author: "J.T. Kent", milestone: "Outlined the 'Dull, Drowsy, Dizzy' flu characteristics in lectures." }
  ],
  rem_bryonia: [
    { year: "1816", author: "Samuel Hahnemann", milestone: "Proved Bryonia Alba and published it in Materia Medica Pura." },
    { year: "1880", author: "C. von Boenninghausen", milestone: "Clarified the stitching pains and rest/motion modalities in Therapeutic Pocket Book." },
    { year: "1900", author: "J.T. Kent", milestone: "Outlined the business worries and physical dryness layers in Lectures." }
  ],
  rem_aconite: [
    { year: "1805", author: "Samuel Hahnemann", milestone: "Proved Aconitum Napellus and published it in Fragmenta, establishing it as the first acute remedy." },
    { year: "1870", author: "A. Lippe", milestone: "Clarified the differentiation between Aconite (dry wind) and Gelsemium (damp heat) flu profiles." },
    { year: "1905", author: "J.T. Kent", milestone: "Emphasized the cardiovascular tension and mental agony keynote in lectures." }
  ],
  rem_nat_mur: [
    { year: "1832", author: "Samuel Hahnemann", milestone: "First detailed provings of Sodium Chloride published in Chronic Diseases." },
    { year: "1890", author: "J.T. Kent", milestone: "Published extensive clinical cases on silent grief and chronic headache treatments." }
  ],
  rem_phosphorus: [
    { year: "1810", author: "Samuel Hahnemann", milestone: "First provings of Phosphorus published, revealing its deep action on blood and nerves." },
    { year: "1899", author: "H.C. Allen", milestone: "Detailed comparative bleeding matrices and hemorrhagic keynotes." }
  ],
  rem_silicea: [
    { year: "1828", author: "Samuel Hahnemann", milestone: "Proved and established Silicea in Chronic Diseases, highlighting its slow deobstruent actions." },
    { year: "1900", author: "J.T. Kent", milestone: "Lectured on Silicea's lack of grit, mental stamina, and structural weakness." }
  ],
  rem_sepia: [
    { year: "1830", author: "Samuel Hahnemann", milestone: "Proved cuttlefish ink, establishing its massive affinity for female pelvic stasis." },
    { year: "1895", author: "E.B. Nash", milestone: "Documented sallow yellow saddle face profiles and hormonal modalities." }
  ],
  rem_belladonna: [
    { year: "1805", author: "Samuel Hahnemann", milestone: "Proved Atropa Belladonna, detailing its sudden congestion, throbbing, and high fever." },
    { year: "1880", author: "C. Hering", milestone: "Published detailed acute pediatric prescribing differentials in Guiding Symptoms." }
  ],
  rem_apis: [
    { year: "1853", author: "B. Mure", milestone: "Proved Apis Mellifica in Brazil, mapping drop-like edema, stinging pain, and heat aversion." },
    { year: "1890", author: "T.F. Allen", milestone: "Aggregated the acute inflammation and drop-like fluid stasis keynotes." }
  ]
};

// Generate REMEDY_LEARNING_DB dynamically from MASTER_REMEDY_DB
const generateLearningDb = (): Record<string, RemedyLearningData> => {
  const db: Record<string, RemedyLearningData> = {};

  for (const rem of MASTER_REMEDY_DB) {
    const id = rem.id;
    const label = rem.identity.name;

    // Handcrafted lookups
    const story = STORY_LOOKUP[id] || {
      title: `The Monograph of ${label}`,
      narrative: `${label} is a remedy derived from ${rem.identity.sourceSubstance}. Its core theme is: ${rem.essence.coreTheme}. In its mental state, it exhibits ${rem.mentalPicture.personality}. Physically, it is characterized by ${rem.physicalGenerals.thermalState} thermal conditions, ${rem.physicalGenerals.thirst} thirst patterns, and sleep patterns described as: ${rem.physicalGenerals.sleep}.`
    };

    const mnemonic = MNEMONIC_LOOKUP[id] || {
      acronym: label.toUpperCase().replace(/[^A-Z]/g, "").substring(0, 7),
      lines: label.toUpperCase().replace(/[^A-Z]/g, "").substring(0, 7).split("").map((letter, idx) => {
        const keynotes = rem.keynotes.top10 || [];
        const match = keynotes.find(k => k.toUpperCase().startsWith(letter)) || (keynotes[idx] || "Keynote indicator");
        return { letter, description: match };
      })
    };

    const timeline = TIMELINE_LOOKUP[id] || [
      { year: "1820", author: "Samuel Hahnemann", milestone: `First proving and pathogenetic description of ${label}.` },
      { year: "1905", author: "J.T. Kent", milestone: `Clinical presentation and structural analysis of ${label} in lectures.` }
    ];

    // Dynamic Flashcards
    const flashcards = [
      {
        question: `What is the primary thermal state of ${label}?`,
        answer: rem.physicalGenerals.thermalState
      },
      {
        question: `What is the characteristic thirst pattern of ${label}?`,
        answer: rem.physicalGenerals.thirst
      },
      {
        question: `What are the typical food desires (cravings) for ${label}?`,
        answer: rem.physicalGenerals.foodDesires.join(", ")
      },
      {
        question: `What are the worse modalities (aggravations) for ${label}?`,
        answer: rem.modalities.worseFrom.join(", ")
      },
      {
        question: `What are the better modalities (ameliorations) for ${label}?`,
        answer: rem.modalities.betterFrom.join(", ")
      }
    ];

    // Dynamic Quizzes
    const quizzes = [
      {
        question: `Which of the following modalities is an aggravation (worse from) keynote of ${label}?`,
        options: [
          rem.modalities.worseFrom[0] || "Stuffy closed rooms",
          "Better by absolute rest and pressure",
          "Ameliorated by warm drinks",
          "Worse sunset to sunrise (nocturnal)"
        ].sort(() => Math.random() - 0.5),
        correctIdx: 0, // Will be set correctly below
        explanation: `${label} is strongly aggravated by ${rem.modalities.worseFrom[0] || "its characteristic trigger"}, as noted in its clinical proving modalities.`
      },
      {
        question: `What is the dominant miasmatic signature for ${label}?`,
        options: ["Psora", "Sycosis", "Syphilis", "Tubercular", "Cancerinic"].filter((val, idx, self) => self.indexOf(val) === idx),
        correctIdx: 0,
        explanation: `${label} presents with a dominant ${rem.miasmaticAnalysis.dominantMiasm} miasmatic dynamic: ${rem.miasmaticAnalysis.description}`
      },
      {
        question: `Which of the following organ affinities rating is highest (most key) in ${label}?`,
        options: [
          `${rem.organAffinities[0]?.organ || "Skin"} (Rating: ${rem.organAffinities[0]?.rating || 10}/10)`,
          "Heart (Rating: 4/10)",
          "Nerves (Rating: 5/10)",
          "Thyroid (Rating: 3/10)"
        ].sort(() => Math.random() - 0.5),
        correctIdx: 0,
        explanation: `${rem.organAffinities[0]?.organ || "Its key system"} represents the primary physiological focus of ${label}.`
      }
    ];

    // Align correctIdx for shuffled options
    quizzes.forEach((q, qidx) => {
      let correctAns = "";
      if (qidx === 0) correctAns = rem.modalities.worseFrom[0] || "Stuffy closed rooms";
      else if (qidx === 1) correctAns = rem.miasmaticAnalysis.dominantMiasm;
      else correctAns = `${rem.organAffinities[0]?.organ || "Skin"} (Rating: ${rem.organAffinities[0]?.rating || 10}/10)`;

      // Set correct index
      const idx = q.options.indexOf(correctAns);
      if (idx !== -1) {
        q.correctIdx = idx;
      } else {
        q.options[0] = correctAns;
        q.correctIdx = 0;
      }
    });

    db[id] = {
      remedyId: id,
      label,
      stories: story,
      mnemonics: mnemonic,
      organAffinities: rem.organAffinities,
      flashcards,
      quizzes,
      timeline
    };
  }

  return db;
};

export const REMEDY_LEARNING_DB = generateLearningDb();

export const parseLearningTutorQuery = (queryText: string): { 
  interpretedQuery: string; 
  remedyId: string; 
  mode: string; 
  content: string; 
  quizData?: any[];
} => {
  const norm = queryText.toLowerCase().trim();
  const graph = getKnowledgeGraph();
  
  // Find remedy mentioned
  let remedyId = "rem_sulphur"; // default
  let label = "Sulphur";
  
  const remediesList = graph.nodes.filter(n => n.type === 'remedy');
  for (const rem of remediesList) {
    if (norm.includes(rem.label.toLowerCase()) || 
        (rem.label === "Lycopodium Clavatum" && norm.includes("lycopodium")) ||
        (rem.label === "Arsenicum Album" && norm.includes("arsenicum")) ||
        (rem.label === "Aconitum Napellus" && norm.includes("aconite")) ||
        (rem.label === "Calcarea Carbonica" && norm.includes("calcarea")) ||
        (rem.label === "Pulsatilla Pratensis" && norm.includes("pulsatilla")) ||
        (rem.label === "Gelsemium Sempervirens" && norm.includes("gelsemium")) ||
        (rem.label === "Natrum Muriaticum" && norm.includes("nat mur")) ||
        (rem.label === "Natrum Muriaticum" && norm.includes("natrum")) ||
        (rem.label === "Apis Mellifica" && norm.includes("apis")) ||
        (rem.label === "Lachesis Muta" && norm.includes("lachesis"))
    ) {
      remedyId = rem.id;
      label = rem.label;
      break;
    }
  }

  const db = REMEDY_LEARNING_DB[remedyId] || REMEDY_LEARNING_DB.rem_sulphur;

  // 1. Quiz Me On...
  if (norm.includes('quiz') || norm.includes('test')) {
    return {
      interpretedQuery: `Active Tutor Session: Quiz mode triggered for ${label}`,
      remedyId,
      mode: "quiz",
      content: `Let's test your clinical knowledge on <strong>${label}</strong>! I have loaded 3 questions based on keynotes, modalities, and relationships. Select an answer below to verify.`,
      quizData: db.quizzes
    };
  }

  // 2. Compare...
  if (norm.includes('compare') || norm.includes('versus') || norm.includes('vs')) {
    // Look for second remedy
    let secondLabel = "Lycopodium";
    let secondId = "rem_lycopodium";
    for (const rem of remediesList) {
      if (rem.id !== remedyId && (norm.includes(rem.label.toLowerCase()) || 
          (rem.label === "Lycopodium Clavatum" && norm.includes("lycopodium")) ||
          (rem.label === "Arsenicum Album" && norm.includes("arsenicum")) ||
          (rem.label === "Aconitum Napellus" && norm.includes("aconite")) ||
          (rem.label === "Calcarea Carbonica" && norm.includes("calcarea")) ||
          (rem.label === "Pulsatilla Pratensis" && norm.includes("pulsatilla")) ||
          (rem.label === "Gelsemium Sempervirens" && norm.includes("gelsemium")) ||
          (rem.label === "Natrum Muriaticum" && norm.includes("nat mur")) ||
          (rem.label === "Natrum Muriaticum" && norm.includes("natrum")) ||
          (rem.label === "Apis Mellifica" && norm.includes("apis")) ||
          (rem.label === "Lachesis Muta" && norm.includes("lachesis")))
      ) {
        secondId = rem.id;
        secondLabel = rem.label;
        break;
      }
    }
    
    const db2 = REMEDY_LEARNING_DB[secondId] || REMEDY_LEARNING_DB.rem_lycopodium;
    const rem1 = MASTER_REMEDY_DB.find(r => r.id === remedyId)!;
    const rem2 = MASTER_REMEDY_DB.find(r => r.id === secondId)!;

    return {
      interpretedQuery: `Active Tutor Session: Comparative Differential generated`,
      remedyId,
      mode: "comparison",
      content: `
        <div class="space-y-4">
          <p>Analyzing comparative monographs for <strong>${label}</strong> vs <strong>${secondLabel}</strong>:</p>
          <div class="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-900">
            <div>
              <h4 class="text-xs font-bold text-emerald-400 border-b border-slate-800 pb-1 mb-2">${label}</h4>
              <p class="text-[10px]"><strong class="text-slate-400">Kingdom/Family:</strong> ${rem1.identity.kingdom} (${rem1.identity.family})</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Thermals:</strong> ${rem1.physicalGenerals.thermalState.split(',')[0]}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Miasms:</strong> ${rem1.miasmaticAnalysis.dominantMiasm}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Keynotes:</strong> ${db.flashcards[0].answer}</p>
            </div>
            <div>
              <h4 class="text-xs font-bold text-violet-400 border-b border-slate-800 pb-1 mb-2">${secondLabel}</h4>
              <p class="text-[10px]"><strong class="text-slate-400">Kingdom/Family:</strong> ${rem2.identity.kingdom} (${rem2.identity.family})</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Thermals:</strong> ${rem2.physicalGenerals.thermalState.split(',')[0]}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Miasms:</strong> ${rem2.miasmaticAnalysis.dominantMiasm}</p>
              <p class="text-[10px] mt-1"><strong class="text-slate-400">Keynotes:</strong> ${db2.flashcards[0].answer}</p>
            </div>
          </div>
          <p class="text-[10px] leading-relaxed text-slate-400 italic">
            * Clinical Hint: Choose ${label} when matching ${db.flashcards[1].question.split(' ').slice(0, 4).join(' ')} -> ${db.flashcards[1].answer.substring(0, 30)}. Consider ${secondLabel} when matching ${db2.flashcards[1].question.split(' ').slice(0, 4).join(' ')} -> ${db2.flashcards[1].answer.substring(0, 30)}.
          </p>
        </div>
      `
    };
  }

  // 3. Explain like a professor...
  if (norm.includes('professor') || norm.includes('explain') || norm.includes('teach')) {
    const profExplanation = `Professor Hahnemann: 'Let us discuss ${label}. A profound polychrest representing a unique vital force disturbance. Focus on its keynotes, thermals, and organ affinities. It relates closely to its plant/mineral/animal relatives and responds well to careful potencies.'`;

    return {
      interpretedQuery: `Active Tutor Session: Professorial Explanation Mode`,
      remedyId,
      mode: "story",
      content: `
        <div class="space-y-3 font-serif">
          <p class="italic text-emerald-400 text-xs font-semibold">${profExplanation}</p>
          <div class="text-[10px] text-slate-400 font-sans border-t border-slate-900 pt-2 leading-relaxed">
            <strong>Professor's Academic Summary:</strong> ${db.stories.narrative}
          </div>
        </div>
      `
    };
  }

  // 4. Default: Complete Drug Picture
  const rem = MASTER_REMEDY_DB.find(r => r.id === remedyId)!;
  return {
    interpretedQuery: `Active Tutor Session: Complete Drug Picture of ${label}`,
    remedyId,
    mode: "clinical",
    content: `
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-emerald-400 border-b border-slate-900 pb-1 uppercase tracking-wider">Drug Picture: ${label}</h4>
        <p class="text-[10.5px] leading-relaxed"><strong class="text-slate-300">Essence:</strong> ${rem.essence.coreTheme}</p>
        <p class="text-[10px]"><strong class="text-slate-400">Kingdom / Family:</strong> ${rem.identity.kingdom} / ${rem.identity.family}</p>
        <p class="text-[10px]"><strong class="text-slate-400">Miasmatic Focus:</strong> ${rem.miasmaticAnalysis.dominantMiasm} (${rem.miasmaticAnalysis.psora}% P / ${rem.miasmaticAnalysis.sycosis}% Sy / ${rem.miasmaticAnalysis.syphilis}% Syph)</p>
        <p class="text-[10px]"><strong class="text-slate-400">Thermal Axis:</strong> ${rem.physicalGenerals.thermalState}</p>
        
        <div class="grid grid-cols-2 gap-2 text-[9.5px] pt-1">
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
            <span class="font-extrabold text-emerald-400 uppercase tracking-widest text-[8px] block mb-1">Mental Themes</span>
            <ul class="list-disc pl-3.5 space-y-0.5 text-slate-400">
              <li>Personality: ${rem.mentalPicture.personality.slice(0, 60)}...</li>
              <li>Fears: ${rem.mentalPicture.fears.slice(0, 2).join(", ")}</li>
            </ul>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
            <span class="font-extrabold text-emerald-400 uppercase tracking-widest text-[8px] block mb-1">Keynotes</span>
            <ul class="list-disc pl-3.5 space-y-0.5 text-slate-400">
              ${rem.keynotes.top10.slice(0, 3).map(k => `<li>${k}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    `
  };
};

export const CLINICAL_BOARD_QUESTIONS = [
  {
    question: "A 34-year-old high-stress corporate executive presents with chronic spasmodic gastritis and stubborn constipation accompanied by constant, ineffectual urging. He is extremely chilly, irritable, and relies heavily on coffee and stimulants. He notes that a 10-minute nap in the afternoon completely refreshes him. Which remedy is most indicated?",
    options: ["Nux Vomica", "Sulphur", "Arsenicum Album", "Lycopodium Clavatum"],
    correctIdx: 0,
    explanation: "Nux Vomica is the prime remedy for ambitious, sedentary workaholics with spasmodic gastric pains, ineffectual urging, chilliness, and relief from short naps."
  },
  {
    question: "A patient presents with an intense, dark-purple left-sided sore throat that is highly sensitive to the lightest touch. She cannot bear tight collars or neckwear and wakes from sleep with suffocative panic. Which remedy fits this clinical picture?",
    options: ["Lachesis Muta", "Pulsatilla Pratensis", "Apis Mellifica", "Belladonna"],
    correctIdx: 0,
    explanation: "Lachesis Muta has left-sided throat swelling, throat purple, intolerance to constriction/touch, and aggravation after sleep."
  },
  {
    question: "An introverted patient presents with severe headaches following chronic grief. They dwell on past hurts, refuse all consolation, and have a strong craving for salt. Which remedy is indicated?",
    options: ["Natrum Muriaticum", "Phosphorus", "Sepia Officinalis", "Silicea"],
    correctIdx: 0,
    explanation: "Natrum Muriaticum keynotes include grief, aversion to consolation, dwelling on past insults, sun aggravation, and salt cravings."
  },
  {
    question: "A patient presents with severe flatulence and bloating immediately after eating even a small amount of food. The symptoms are consistently worse between 4 PM and 8 PM. They act bossy and dictatorial in public to hide deep-seated insecurity. Which remedy is indicated?",
    options: ["Lycopodium Clavatum", "Sulphur", "Calcarea Carbonica", "Nux Vomica"],
    correctIdx: 0,
    explanation: "Lycopodium Clavatum has keynotes of right-sided symptoms, flatulence/bloating immediately after eating, 4-8 PM aggravation, and authoritarian compensation for insecurity."
  },
  {
    question: "A patient developed a sudden, violent fever of 104°F after walking in a dry, cold wind. They are extremely restless, tossing and turning, and exhibit agonizing anxiety with a prediction of the exact hour of their death. The skin is hot and dry, but they are not sweating. Which remedy is indicated?",
    options: ["Aconitum Napellus", "Belladonna", "Gelsemium Sempervirens", "Bryonia Alba"],
    correctIdx: 0,
    explanation: "Aconitum Napellus is characterized by sudden, violent onset of dry fever from cold dry wind exposure, intense restlessness, and fear of immediate death."
  },
  {
    question: "A patient presents with puffy, pink swelling of the eyelids and joints. The swollen areas are stinging, burning, and painful. They cannot tolerate warm rooms and are completely thirstless. Applying cold compresses brings dramatic relief. Which remedy is indicated?",
    options: ["Apis Mellifica", "Pulsatilla Pratensis", "Arsenicum Album", "Lachesis Muta"],
    correctIdx: 0,
    explanation: "Apis Mellifica represents the bee venom pathogenetic picture: pink puffy edema, stinging burning pains, heat aversion, thirstlessness, and relief from cold."
  },
  {
    question: "A highly sensitive, communicative, and empathetic patient presents with frequent nosebleeds of bright red blood. They are extremely anxious when alone or in the dark, and crave ice-cold drinks which soothe their burning stomach but are vomited as soon as they become warm. Which remedy is indicated?",
    options: ["Phosphorus", "Arsenicum Album", "Sulphur", "Natrum Muriaticum"],
    correctIdx: 0,
    explanation: "Phosphorus has open, magnetic psychology, fears of dark/solitude, bright red hemorrhages, and stomach burning relieved by ice-cold drinks."
  },
  {
    question: "A highly refined, polite child is slow to heal, and minor cuts turn into suppurating wounds. They have offensive, sour, sweaty feet, dread failure, and are extremely chilly, requiring their head to be wrapped up warmly. Which remedy is indicated?",
    options: ["Silicea", "Calcarea Carbonica", "Sepia Officinalis", "Bryonia Alba"],
    correctIdx: 0,
    explanation: "Silicea is indicated for lack of grit, offensive foot sweat, suppuration of wounds, head-wrapping modalities, and dread of failure."
  },
  {
    question: "A mild, yielding patient weeps easily while describing her symptoms and constantly seeks consolation. She has a dry mouth but is completely thirstless, and cannot tolerate stuffy, warm rooms, seeking open cool air. Her symptoms are highly changeable and she has thick, yellow-green, bland discharges. Which remedy is indicated?",
    options: ["Pulsatilla Pratensis", "Lachesis Muta", "Gelsemium Sempervirens", "Sepia Officinalis"],
    correctIdx: 0,
    explanation: "Pulsatilla Pratensis keynotes include mild yielding weeping state, consolation amelioration, stuffy room aggravation, thirstlessness, changeability, and thick bland discharges."
  },
  {
    question: "A patient presents with sudden, intense, throbbing right-sided headache. Their face is flushed bright red, their pupils are widely dilated, and their carotid arteries throb visibly. They are extremely sensitive to light, noise, and the slightest jar. Which remedy is indicated?",
    options: ["Belladonna", "Aconitum Napellus", "Gelsemium Sempervirens", "Silicea"],
    correctIdx: 0,
    explanation: "Belladonna produces sudden congestive heat, throbbing right-sided headaches, red flushed face, dilated pupils, and extreme sensitivity to jarring/light."
  }
];

