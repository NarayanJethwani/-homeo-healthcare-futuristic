"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateClinicalDecisionSupport = calculateClinicalDecisionSupport;
exports.compareRemedyGenomes = compareRemedyGenomes;
exports.analyzeHeringsLaw = analyzeHeringsLaw;
exports.checkPrescriptionSafety = checkPrescriptionSafety;
const remedyGenomeSchema_1 = require("./remedyGenomeSchema");
const repertoryData_1 = require("./repertoryData");
const remedyIdToAbbr = {
    'rem_sulphur': 'Sulph',
    'rem_lycopodium': 'Lyc',
    'rem_nux_vomica': 'Nux-v',
    'rem_arsenicum': 'Ars',
    'rem_calcarea': 'Calc',
    'rem_lachesis': 'Lach',
    'rem_pulsatilla': 'Puls',
    'rem_gelsemium': 'Gels',
    'rem_bryonia': 'Bry',
    'rem_aconite': 'Acon',
    'rem_nat_mur': 'Nat-m',
    'rem_phosphorus': 'Phos',
    'rem_silicea': 'Sil',
    'rem_sepia': 'Sep',
    'rem_belladonna': 'Bell',
    'rem_apis': 'Apis'
};
/**
 * Calculates Clinical Decision Support (CDS) differential rankings, contradictions, and expected reactions.
 * Implements the dynamic rubric token matching math formulas.
 */
function calculateClinicalDecisionSupport(caseInput) {
    const differentials = [];
    // Extract lowercase alphanumeric search tokens from primary presenting symptom
    const stopwords = new Set(["a", "an", "the", "with", "of", "in", "and", "to", "for", "is", "at", "on", "from", "symptoms", "complaint", "patient", "history", "years", "year", "old", "chronic", "severe", "recurrent", "feels", "feeling", "desires", "craves", "complaints"]);
    const tokens = caseInput.primarySymptom
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter(word => word.length >= 3 && !stopwords.has(word));
    // Query rubrics in REPERTORY_DATA that contain any search tokens
    const matchedRubrics = repertoryData_1.REPERTORY_DATA.filter(rubric => {
        const rubName = rubric.name.toLowerCase();
        return tokens.some(token => rubName.includes(token));
    });
    remedyGenomeSchema_1.GENOME_REMEDY_DB.forEach(rem => {
        const rubricMatches = [];
        const contradictionAlerts = [];
        let contradictionPenalty = 0;
        // --- 1. Dynamic Primary Symptom Rubric Matching ---
        let somaticMatchPoints = 0;
        let somaticTotalPoints = 0;
        const abbr = remedyIdToAbbr[rem.id];
        if (abbr) {
            matchedRubrics.forEach(rubric => {
                const grade = rubric.remedies[abbr];
                if (grade !== undefined) {
                    if (grade > 0) {
                        somaticMatchPoints += grade * 15;
                        somaticTotalPoints += 45; // Max possible grade is 3 (3 * 15 = 45)
                        const citation = grade === 3 ? '[Kent]' : grade === 2 ? '[Boericke]' : '[Allen]';
                        rubricMatches.push(`${rubric.chapter}: ${rubric.name} - Grade ${grade} ${citation}`);
                    }
                    else if (grade < 0) {
                        // Negative grade represents an explicit contradiction (counter-indication)
                        contradictionPenalty += 20;
                        contradictionAlerts.push(`Somatic Contraindication: Presentation fits "${rubric.name}" which is counter-indicated for ${rem.identity.name} [Allen] (Grade ${grade}). Penalty -20%`);
                    }
                }
            });
        }
        let somaticScore = 50; // baseline
        if (somaticTotalPoints > 0) {
            somaticScore = Math.round((somaticMatchPoints / somaticTotalPoints) * 100);
        }
        else {
            // Fallback to Genome organ/brain affinities
            const symptomLower = caseInput.primarySymptom.toLowerCase();
            let affinityScore = 50;
            let affinitySource = "";
            if (symptomLower.includes("skin") || symptomLower.includes("eczema") || symptomLower.includes("eruption") || symptomLower.includes("itch")) {
                affinityScore = rem.genome.skinAffinity;
                affinitySource = "Skin Affinity [Boericke]";
            }
            else if (symptomLower.includes("bloat") || symptomLower.includes("flatulence") || symptomLower.includes("digest") || symptomLower.includes("stomach") || symptomLower.includes("gas") || symptomLower.includes("dyspepsia")) {
                affinityScore = rem.genome.digestiveAxis;
                affinitySource = "Digestive Axis Affinity [Kent]";
            }
            else if (symptomLower.includes("anxiety") || symptomLower.includes("panic") || symptomLower.includes("fear") || symptomLower.includes("mind") || symptomLower.includes("grief") || symptomLower.includes("sadness") || symptomLower.includes("depress")) {
                affinityScore = Math.max(rem.genome.brainAffinity, rem.genome.nervousSystemAffinity);
                affinitySource = "Nervous System Affinity [Hering]";
            }
            else if (symptomLower.includes("cough") || symptomLower.includes("lung") || symptomLower.includes("respirat") || symptomLower.includes("chest") || symptomLower.includes("asthma")) {
                affinityScore = Math.max(rem.genome.lungAffinity, rem.genome.respiratoryAffinity);
                affinitySource = "Respiratory Affinity [Kent]";
            }
            else if (symptomLower.includes("fever") || symptomLower.includes("hot") || symptomLower.includes("temp") || symptomLower.includes("delirium")) {
                affinityScore = Math.max(rem.genome.vitalityLevel, 70);
                affinitySource = "Vascular Vitality [Boericke]";
            }
            else if (symptomLower.includes("joint") || symptomLower.includes("arthr") || symptomLower.includes("musculo") || symptomLower.includes("rheum") || symptomLower.includes("stiff")) {
                affinityScore = rem.genome.jointAffinity || rem.genome.musculoskeletalAffinity;
                affinitySource = "Musculoskeletal Affinity [Allen]";
            }
            else {
                affinityScore = Math.round((rem.genome.brainAffinity + rem.genome.nervousSystemAffinity) / 2);
                affinitySource = "Constitutional Core Affinity [Boericke]";
            }
            somaticScore = affinityScore;
            rubricMatches.push(`Genome Affinity: Primary symptom matches ${affinitySource} (Affinity: ${affinityScore}%).`);
        }
        // --- 2. Dynamic Food Desires Matching ---
        let foodMatchPoints = 0;
        let foodTotalPoints = 0;
        caseInput.foodDesires.forEach(food => {
            foodTotalPoints += 100;
            const fLower = food.toLowerCase();
            let desireIndex = 50;
            let foodLabel = "";
            if (fLower.includes("sweet")) {
                desireIndex = rem.genome.sweetsDesire;
                foodLabel = "Sweets [Kent]";
            }
            else if (fLower.includes("salt")) {
                desireIndex = rem.genome.saltDesire;
                foodLabel = "Salt [Boericke]";
            }
            else if (fLower.includes("fat")) {
                desireIndex = rem.genome.fatsDesire;
                foodLabel = "Fats [Kent]";
            }
            else if (fLower.includes("spice") || fLower.includes("pungent")) {
                desireIndex = rem.genome.spicesDesire;
                foodLabel = "Spices [Allen]";
            }
            else if (fLower.includes("stimulant") || fLower.includes("coffee") || fLower.includes("alcohol")) {
                desireIndex = rem.genome.stimulantsDesire;
                foodLabel = "Stimulants [Hering]";
            }
            else if (fLower.includes("egg")) {
                desireIndex = rem.genome.eggsDesire;
                foodLabel = "Eggs [Kent]";
            }
            foodMatchPoints += desireIndex;
            if (desireIndex > 65) {
                rubricMatches.push(`Generals: Craving match for ${foodLabel} (Intensity: ${desireIndex}%).`);
            }
            else if (desireIndex < 35) {
                contradictionPenalty += 10;
                contradictionAlerts.push(`Generals Contradiction: Patient craves ${food}, but ${rem.identity.name} has low preference or aversion [Allen] (Desire Index: ${desireIndex}%). Penalty -10%`);
            }
        });
        const foodScore = foodTotalPoints > 0 ? Math.round((foodMatchPoints / foodTotalPoints) * 100) : 50;
        // --- 3. Dynamic Modalities Matching ---
        let modMatchPoints = 0;
        let modTotalPoints = 0;
        caseInput.worseFrom.forEach(mod => {
            modTotalPoints += 100;
            const mLower = mod.toLowerCase();
            let sensitivityIndex = 50;
            let modLabel = "";
            if (mLower.includes("warmth of bed") || mLower.includes("blanket") || mLower.includes("warm room") || mLower.includes("heat")) {
                sensitivityIndex = rem.genome.warmRoomAggravation;
                modLabel = "Warmth/Warm Room [Kent]";
            }
            else if (mLower.includes("standing")) {
                sensitivityIndex = rem.genome.sluggishnessMetabolic > 60 ? 80 : 35;
                modLabel = "Standing still [Boericke]";
            }
            else if (mLower.includes("4 pm") || mLower.includes("evening") || mLower.includes("afternoon")) {
                sensitivityIndex = rem.genome.afternoonAggravation;
                modLabel = "4 PM - 8 PM [Kent]";
            }
            else if (mLower.includes("midnight") || mLower.includes("night")) {
                sensitivityIndex = rem.genome.midnightAggravation;
                modLabel = "Midnight - 2 AM [Ars/Kent]";
            }
            else if (mLower.includes("cold draft") || mLower.includes("wind") || mLower.includes("chill") || mLower.includes("cold air")) {
                sensitivityIndex = rem.genome.draftSensitivity;
                modLabel = "Cold Damp Drafts [Boericke]";
            }
            else if (mLower.includes("motion") || mLower.includes("movement") || mLower.includes("move")) {
                sensitivityIndex = rem.genome.motionAggravation;
                modLabel = "Motion [Bryonia/Kent]";
            }
            modMatchPoints += sensitivityIndex;
            if (sensitivityIndex > 65) {
                rubricMatches.push(`Modalities: Aggravation match for ${modLabel} (Intensity: ${sensitivityIndex}%).`);
            }
            else if (sensitivityIndex < 35) {
                contradictionPenalty += 15;
                contradictionAlerts.push(`Modality Contradiction: Patient worse from ${mod}, but ${rem.identity.name} has low sensitivity [Kent] (Aggravation Index: ${sensitivityIndex}%). Penalty -15%`);
            }
        });
        const modScore = modTotalPoints > 0 ? Math.round((modMatchPoints / modTotalPoints) * 100) : 50;
        // --- 4. Weighted Repertorization Fit Score (RF) Calculation ---
        const rfScore = Math.round((somaticScore * 0.4) + (foodScore * 0.3) + (modScore * 0.3));
        // --- 5. Thermal Contradiction Deductions (25% Penalty) ---
        if (caseInput.thermalState === "Chilly" && rem.genome.thermalHeatIndex > 65) {
            contradictionPenalty += 25;
            contradictionAlerts.push(`Thermal Contradiction: Patient is Chilly, but ${rem.identity.name} is warm-blooded (Heat Index: ${rem.genome.thermalHeatIndex}%). [Kent] Penalty -25%`);
        }
        else if (caseInput.thermalState === "Hot" && rem.genome.thermalHeatIndex < 35) {
            contradictionPenalty += 25;
            contradictionAlerts.push(`Thermal Contradiction: Patient is Hot-blooded, but ${rem.identity.name} is chilly (Heat Index: ${rem.genome.thermalHeatIndex}%). [Boericke] Penalty -25%`);
        }
        // --- 6. Final Score Calculation ---
        const overallScore = Math.max(0, rfScore - contradictionPenalty);
        // --- 7. Potency Recommendation ---
        let suggestedPotency = "30C";
        let potencyRationale = "Moderate constitutional fit. Recommended standard potency [Allen] with gradual repetition.";
        let aggravationRisk = 'Low';
        if (overallScore >= 80) {
            if (rem.genome.potencySensitivity > 75) {
                suggestedPotency = "1M";
                potencyRationale = "Deep emotional picture matching constitutional state. Recommends a single high potency dose [Kent] to avoid primary aggravation.";
                aggravationRisk = 'High';
            }
            else {
                suggestedPotency = "200C";
                potencyRationale = "Strong somatic matching. Patient vital force can handle moderate-high potency [Boericke].";
                aggravationRisk = 'Moderate';
            }
        }
        else if (overallScore < 50) {
            suggestedPotency = "6C";
            potencyRationale = "Low structural matching. Recommended low potency organ support [Hahnemann] daily.";
            aggravationRisk = 'Low';
        }
        // --- 8. Dynamic Expected Reactions Forecast based on Kingdom & Miasms ---
        let expectedReactions = [];
        if (rem.identity.kingdom === "Mineral") {
            expectedReactions = [
                { timelineDays: 3, symptomShift: "Initial emotional stabilization and stabilization of sleep patterns [Kent].", directionOfCureMatch: true },
                { timelineDays: 10, symptomShift: "Slow metabolic activation with transient discharge (nasal or sweat) [Hering].", directionOfCureMatch: true },
                { timelineDays: 28, symptomShift: "Deep musculoskeletal alignment and gradual healing of chronic complaints from within outward.", directionOfCureMatch: true }
            ];
        }
        else if (rem.identity.kingdom === "Plant") {
            expectedReactions = [
                { timelineDays: 1, symptomShift: "Rapid relief of acute neuralgic tension or fever spike [Boericke].", directionOfCureMatch: true },
                { timelineDays: 4, symptomShift: "Emergence of mild superficial skin rash, indicating outward redirection [Hering].", directionOfCureMatch: true },
                { timelineDays: 10, symptomShift: "Return of energy levels and recovery of normal organ functions.", directionOfCureMatch: true }
            ];
        }
        else {
            expectedReactions = [
                { timelineDays: 2, symptomShift: "Immediate drop in nervous loquacity or jealousy; improved sleep [Allen].", directionOfCureMatch: true },
                { timelineDays: 5, symptomShift: "Vascular heat dispersion with relief of pelvic or local congestions.", directionOfCureMatch: true },
                { timelineDays: 14, symptomShift: "Clear reversal of symptoms in reverse chronological order of appearance [Hering].", directionOfCureMatch: true }
            ];
        }
        differentials.push({
            remedyId: rem.id,
            remedyName: rem.identity.name,
            overallScore,
            rubricMatches,
            contradictionAlerts,
            potencyRecommendation: {
                suggested: suggestedPotency,
                rationale: potencyRationale,
                aggravationRisk
            },
            expectedReactions
        });
    });
    return differentials.sort((a, b) => b.overallScore - a.overallScore);
}
function compareRemedyGenomes(remedyIds) {
    const comparisonList = [];
    remedyIds.forEach(id => {
        const rem = remedyGenomeSchema_1.GENOME_REMEDY_DB.find(r => r.id === id);
        if (!rem)
            return;
        const abbr = remedyIdToAbbr[rem.id] || rem.identity.name.substring(0, 5);
        const thermal = rem.genome.thermalHeatIndex > 65 ? 'Hot' : rem.genome.thermalHeatIndex < 35 ? 'Chilly' : 'Ambi';
        const foodDesires = [];
        if (rem.genome.sweetsDesire > 65)
            foodDesires.push("Sweets");
        if (rem.genome.saltDesire > 65)
            foodDesires.push("Salt");
        if (rem.genome.fatsDesire > 65)
            foodDesires.push("Fats");
        if (rem.genome.spicesDesire > 65)
            foodDesires.push("Spices");
        if (rem.genome.stimulantsDesire > 65)
            foodDesires.push("Stimulants");
        if (rem.genome.eggsDesire > 65)
            foodDesires.push("Eggs");
        if (rem.genome.warmDrinksDesire > 65)
            foodDesires.push("Warm Drinks");
        if (rem.genome.coldDrinksDesire > 65)
            foodDesires.push("Cold Drinks");
        const foodAversions = [];
        if (rem.genome.meatAversion > 65)
            foodAversions.push("Meat");
        if (rem.genome.fatAversion > 65)
            foodAversions.push("Fats");
        if (rem.genome.milkAversion > 65)
            foodAversions.push("Milk");
        if (rem.genome.breadAversion > 65)
            foodAversions.push("Bread");
        if (rem.genome.coldWaterAversion > 65)
            foodAversions.push("Cold Water");
        if (rem.genome.bathingAversion > 65)
            foodAversions.push("Bathing");
        const modalitiesWorse = [];
        if (rem.genome.draftSensitivity > 65)
            modalitiesWorse.push("Cold Drafts");
        if (rem.genome.motionAggravation > 65)
            modalitiesWorse.push("Motion");
        if (rem.genome.midnightAggravation > 65)
            modalitiesWorse.push("Midnight (12-2 AM)");
        if (rem.genome.afternoonAggravation > 65)
            modalitiesWorse.push("Afternoon (4-8 PM)");
        if (rem.genome.morningAggravation > 65)
            modalitiesWorse.push("Morning on Waking");
        if (rem.genome.warmRoomAggravation > 65)
            modalitiesWorse.push("Warm Room");
        const modalitiesBetter = [];
        if (rem.genome.motionAmelioration > 65)
            modalitiesBetter.push("Gentle Motion");
        if (rem.genome.pressureAmelioration > 65)
            modalitiesBetter.push("Hard Pressure");
        if (rem.genome.openAirDesire > 65)
            modalitiesBetter.push("Open Cool Air");
        if (rem.genome.restAmelioration > 65)
            modalitiesBetter.push("Rest");
        const affinities = [
            { organ: "Skin", rating: rem.genome.skinAffinity || 0 },
            { organ: "Digestive Axis", rating: rem.genome.digestiveAxis || 0 },
            { organ: "Hepatic", rating: rem.genome.hepaticAffinity || 0 },
            { organ: "Renal", rating: rem.genome.renalAffinity || 0 },
            { organ: "Brain/Mind", rating: rem.genome.brainAffinity || 0 },
            { organ: "Respiratory", rating: rem.genome.respiratoryAffinity || 0 },
            { organ: "Musculoskeletal", rating: rem.genome.musculoskeletalAffinity || 0 },
            { organ: "Nervous System", rating: rem.genome.nervousSystemAffinity || 0 },
            { organ: "Urinary", rating: rem.genome.urinaryAffinity || 0 }
        ].sort((a, b) => b.rating - a.rating).slice(0, 4);
        comparisonList.push({
            id: rem.id,
            name: rem.identity.name,
            abbreviation: abbr,
            kingdom: rem.identity.kingdom,
            family: rem.identity.family,
            thermalState: thermal,
            thirstIndex: rem.genome.thirstIndex || 50,
            miasms: {
                psora: rem.genome.psoraComplexity || 50,
                sycosis: rem.genome.sycosisComplexity || 50,
                syphilis: rem.genome.syphilisComplexity || 50,
                tubercular: rem.genome.tubercularComplexity || 50
            },
            organAffinities: affinities,
            foodDesires,
            foodAversions,
            modalitiesWorse,
            modalitiesBetter,
            potencySensitivity: rem.genome.potencySensitivity || 50
        });
    });
    return comparisonList;
}
function analyzeHeringsLaw(previousSymptoms, currentSymptoms) {
    const details = [];
    let score = 50; // Neutral baseline
    let direction = 'Mixed';
    // Helper to convert severity to numeric weight
    const severityWeight = (sev) => {
        const s = sev.toLowerCase();
        if (s.includes("severe"))
            return 3;
        if (s.includes("moderate"))
            return 2;
        if (s.includes("mild"))
            return 1;
        return 0; // if stabilized or resolved
    };
    // Helper to determine depth of organ affinity
    const getOrganDepth = (affinity) => {
        const a = affinity.toLowerCase();
        if (a.includes("renal") || a.includes("kidney") || a.includes("cardio") || a.includes("heart") || a.includes("endocrine") || a.includes("pancreas") || a.includes("brain") || a.includes("nervous") || a.includes("respiratory") || a.includes("lung") || a.includes("hepatic") || a.includes("liver")) {
            return 3; // Deep Vital Organ
        }
        if (a.includes("digestive") || a.includes("stomach") || a.includes("gastro") || a.includes("gut")) {
            return 2; // Mid-level / Systemic
        }
        return 1; // Superficial / Musculoskeletal / Skin
    };
    // Track symptom changes
    const prevMap = new Map(previousSymptoms.map(s => [s.name.toLowerCase(), s]));
    const currMap = new Map(currentSymptoms.map(s => [s.name.toLowerCase(), s]));
    let deepImprovedCount = 0;
    let superficialWorsenedCount = 0;
    let suppressionCount = 0;
    // 1. Inside-Out Analysis
    previousSymptoms.forEach(prev => {
        const curr = currMap.get(prev.name.toLowerCase());
        const prevSev = severityWeight(prev.severity);
        const currSev = curr ? severityWeight(curr.severity) : 0; // 0 if symptom disappeared
        const depth = getOrganDepth(prev.organAffinity);
        if (prevSev > currSev) {
            // Symptom improved or resolved
            if (depth === 3) {
                deepImprovedCount++;
            }
        }
        else if (prevSev < currSev) {
            // Symptom worsened or appeared (should check if superficial)
            if (depth === 1) {
                superficialWorsenedCount++;
            }
        }
    });
    // Check new symptoms
    currentSymptoms.forEach(curr => {
        if (!prevMap.has(curr.name.toLowerCase())) {
            // New symptom appeared
            const depth = getOrganDepth(curr.organAffinity);
            if (depth === 1) {
                superficialWorsenedCount++;
            }
            else if (depth === 3) {
                // New deep symptom appeared! This is suppression / unfavorable
                suppressionCount++;
            }
        }
    });
    // Evaluate Inside-Out
    if (deepImprovedCount > 0 && superficialWorsenedCount > 0) {
        details.push(`Inside-Out Match: Deep vital organ symptoms (${deepImprovedCount}) improved while superficial skin/extremity symptoms (${superficialWorsenedCount}) surfaced. Positive prognosis [Hering].`);
        score += 25;
    }
    // 2. Above-Downwards Analysis
    // If symptoms in head/neck improved, and symptoms in knees/legs/feet appeared or worsened
    let headImproved = false;
    let limbsWorsened = false;
    previousSymptoms.forEach(prev => {
        const name = prev.name.toLowerCase();
        const curr = currMap.get(name);
        const prevSev = severityWeight(prev.severity);
        const currSev = curr ? severityWeight(curr.severity) : 0;
        if (prevSev > currSev && (name.includes("head") || name.includes("vertigo") || name.includes("mind") || name.includes("anxiety") || name.includes("migraine") || name.includes("throat"))) {
            headImproved = true;
        }
    });
    currentSymptoms.forEach(curr => {
        const name = curr.name.toLowerCase();
        if ((name.includes("leg") || name.includes("foot") || name.includes("joint") || name.includes("ankle") || name.includes("knee") || name.includes("edema")) && (!prevMap.has(name) || severityWeight(curr.severity) > severityWeight(prevMap.get(name).severity))) {
            limbsWorsened = true;
        }
    });
    if (headImproved && limbsWorsened) {
        details.push("Above-Downward Match: Head/psychological symptoms improved, and joint/extremity symptoms became active. Downward progression of cure [Hering].");
        score += 15;
    }
    // 3. Suppression check
    if (suppressionCount > 0) {
        const sampleSymptom = currentSymptoms.find(s => getOrganDepth(s.organAffinity) === 3 && !prevMap.has(s.name.toLowerCase()))?.name;
        details.push(`Warning (Suppression): New vital organ symptom "${sampleSymptom || 'Deep pathology'}" appeared. Indicates unfavorable suppression [Hahnemann].`);
        score -= 30;
        direction = 'Unfavorable';
    }
    // 4. General improvement or worsening
    let totalImproved = 0;
    let totalWorsened = 0;
    previousSymptoms.forEach(prev => {
        const curr = currMap.get(prev.name.toLowerCase());
        const prevSev = severityWeight(prev.severity);
        const currSev = curr ? severityWeight(curr.severity) : 0;
        if (prevSev > currSev)
            totalImproved++;
        if (prevSev < currSev)
            totalWorsened++;
    });
    if (totalImproved > 0 && totalWorsened === 0) {
        details.push("Constitutional Improvement: All tracked chronic complaints are systematically resolving.");
        score += 20;
        direction = 'Outward';
    }
    else if (totalWorsened > 0 && totalImproved === 0 && suppressionCount > 0) {
        details.push("General Deterioration: Aggravation of primary pathogenetic load without outward redirect.");
        score -= 15;
        direction = 'Unfavorable';
    }
    // Bound score
    score = Math.max(0, Math.min(100, score));
    const match = score >= 65;
    if (direction !== 'Unfavorable') {
        if (match) {
            direction = headImproved && limbsWorsened ? 'Downward' : 'Outward';
        }
        else if (score < 45) {
            direction = 'Unfavorable';
        }
        else {
            direction = 'Mixed';
        }
    }
    return {
        match,
        score,
        details: details.length > 0 ? details : ["No significant directional shifts or Hering's dynamics detected in this follow-up interval."],
        direction
    };
}
function checkPrescriptionSafety(remedyName, patientImplantsOrConditions = [], activeRemedies = []) {
    const warnings = [];
    const relationships = [];
    const normalizedNew = remedyName.toLowerCase().trim();
    // Inimical (antagonistic) mapping
    const INIMICAL_MAP = {
        "sulphur": ["sepia", "sepia officinalis"],
        "sulph": ["sep", "sepia"],
        "sepia": ["sulphur", "sulph"],
        "sep": ["sulphur", "sulph"],
        "apis": ["rhus-t", "rhus tox", "rhus toxicodendron"],
        "rhus-t": ["apis", "apis mellifica"],
        "lachesis": ["dulcamara"],
        "lach": ["dulc"],
        "silicea": ["mercurius", "merc", "merc-sol"],
        "sil": ["merc", "merc-sol"],
        "mercurius": ["silicea", "sil"],
        "merc": ["silicea", "sil"],
        "zincum": ["nux-v", "nux vomica"],
        "zinc": ["nux-v", "nux"]
    };
    // Check active remedies for inimical combinations
    activeRemedies.forEach(active => {
        const normalizedActive = active.toLowerCase().trim();
        const inimicalsForNew = INIMICAL_MAP[normalizedNew] || [];
        if (inimicalsForNew.some(i => normalizedActive.includes(i) || i.includes(normalizedActive))) {
            warnings.push(`Antagonistic Pair: Prescribing ${remedyName} alongside active remedy ${active} is contraindicated due to inimical (antagonistic) relationship.`);
            relationships.push(`Inimical: ${remedyName} ↔ ${active}`);
        }
        const inimicalsForActive = INIMICAL_MAP[normalizedActive] || [];
        if (inimicalsForActive.some(i => normalizedNew.includes(i) || i.includes(normalizedNew))) {
            if (!warnings.some(w => w.includes(active))) {
                warnings.push(`Antagonistic Pair: Active remedy ${active} is inimical (antagonistic) to ${remedyName}.`);
                relationships.push(`Inimical: ${active} ↔ ${remedyName}`);
            }
        }
    });
    // Check for foreign body implants when prescribing Silicea
    const isSilicea = normalizedNew.includes("silicea") || normalizedNew === "sil";
    if (isSilicea) {
        const implantKeywords = ["implant", "pacemaker", "plate", "screw", "stent", "valve", "prosthetic", "mesh", "device"];
        const hasImplant = patientImplantsOrConditions.some(cond => implantKeywords.some(kw => cond.toLowerCase().includes(kw)));
        if (hasImplant) {
            warnings.push(`Foreign Body Expulsion Hazard: Silicea stimulates suppuration and elimination of foreign objects. Contraindicated for patients with pacemakers, surgical plates/screws, or implants.`);
        }
    }
    return {
        isSafe: warnings.length === 0,
        warnings,
        relationships
    };
}
