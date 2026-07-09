"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNaturalLanguageQuery = parseNaturalLanguageQuery;
exports.searchRemediesAdvanced = searchRemediesAdvanced;
const remedyGenomeSchema_1 = require("./remedyGenomeSchema");
/**
 * Natural Language Query Parser (Phase 16)
 * Processes sentences into structural filter tokens.
 */
function parseNaturalLanguageQuery(query) {
    const tokens = { symptomKeywords: [] };
    const lower = query.toLowerCase();
    // 1. Kingdom Identifiers
    if (lower.includes("plant") || lower.includes("botanical") || lower.includes("vegetable"))
        tokens.kingdom = "Plant";
    if (lower.includes("mineral") || lower.includes("chemical") || lower.includes("element"))
        tokens.kingdom = "Mineral";
    if (lower.includes("animal") || lower.includes("venom") || lower.includes("snake") || lower.includes("spider"))
        tokens.kingdom = "Animal";
    if (lower.includes("nosode") || lower.includes("bacterial") || lower.includes("diseased"))
        tokens.kingdom = "Nosode";
    // 2. Thermal Identifiers
    if (lower.includes("chilly") || lower.includes("cold sensitivity") || lower.includes("worse cold"))
        tokens.thermal = "Chilly";
    if (lower.includes("hot-blooded") || lower.includes("warmth of bed") || lower.includes("worse warmth"))
        tokens.thermal = "Hot";
    // 3. Lateralization Identifiers
    if (lower.includes("right-sided") || lower.includes("right side") || lower.includes("right-side"))
        tokens.lateralization = "Right";
    if (lower.includes("left-sided") || lower.includes("left side") || lower.includes("left-side"))
        tokens.lateralization = "Left";
    // 4. Miasm Identifiers
    if (lower.includes("psora") || lower.includes("psoric"))
        tokens.miasm = "Psora";
    if (lower.includes("sycosis") || lower.includes("sycotic"))
        tokens.miasm = "Sycosis";
    if (lower.includes("syphilis") || lower.includes("syphilitic"))
        tokens.miasm = "Syphilis";
    if (lower.includes("tubercular"))
        tokens.miasm = "Tubercular";
    if (lower.includes("cancerinic") || lower.includes("carcinosin"))
        tokens.miasm = "Cancerinic";
    // 5. Keyword & Modality extraction patterns
    // Capture phrases like "fear of death", "desires warm water", "worse standing", "burning feet"
    const pattern = /(?:worse|better|fear of|desires|crave|cravings|burning|sinking|bloating)\s+[a-zA-Z0-9\s]+/g;
    const matches = lower.match(pattern);
    if (matches) {
        tokens.symptomKeywords = matches.map(m => m.trim());
    }
    else {
        // Fallback: extract nouns/adjectives if no pattern is matched
        const words = lower.split(/\s+/).filter(w => w.length > 3 && !["show", "remedies", "with", "similar", "less"].includes(w));
        tokens.symptomKeywords = words.map(w => w.replace(/[,.;!?]/g, ''));
    }
    return tokens;
}
/**
 * Traverses the database using advanced filters, scoring matching entities.
 */
function searchRemediesAdvanced(filters) {
    const results = [];
    remedyGenomeSchema_1.GENOME_REMEDY_DB.forEach(rem => {
        let score = 0;
        const reasons = [];
        // --- 1. Kingdom Match ---
        if (filters.kingdom && rem.identity.kingdom === filters.kingdom) {
            score += 25;
            reasons.push({
                facet: "Kingdom",
                matchText: `Matches ${filters.kingdom} Kingdom.`,
                score: 25
            });
        }
        // --- 2. Thermal Match ---
        if (filters.thermal) {
            const isHotRemedy = rem.genome.thermalHeatIndex > 70;
            const isChillyRemedy = rem.genome.thermalHeatIndex < 35;
            if (filters.thermal === "Hot" && isHotRemedy) {
                score += 20;
                reasons.push({
                    facet: "Thermal",
                    matchText: `Matches Hot-blooded thermal preference (Index: ${rem.genome.thermalHeatIndex}).`,
                    score: 20
                });
            }
            else if (filters.thermal === "Chilly" && isChillyRemedy) {
                score += 20;
                reasons.push({
                    facet: "Thermal",
                    matchText: `Matches Chilly thermal preference (Index: ${rem.genome.thermalHeatIndex}).`,
                    score: 20
                });
            }
        }
        // --- 3. Lateralization Match ---
        if (filters.lateralization) {
            const isRight = rem.genome.lateralizationRight > 70;
            const isLeft = rem.genome.lateralizationRight < 30; // 0-100 where < 30 is Left-biased
            if (filters.lateralization === "Right" && isRight) {
                score += 15;
                reasons.push({
                    facet: "Lateralization",
                    matchText: "Matches Right-sided symptoms bias.",
                    score: 15
                });
            }
            else if (filters.lateralization === "Left" && isLeft) {
                score += 15;
                reasons.push({
                    facet: "Lateralization",
                    matchText: "Matches Left-sided symptoms bias.",
                    score: 15
                });
            }
        }
        // --- 4. Miasm Match ---
        if (filters.miasm) {
            let miasmScore = 0;
            if (filters.miasm === "Psora")
                miasmScore = rem.genome.psoricDrive;
            else if (filters.miasm === "Sycosis")
                miasmScore = rem.genome.sycoticDrive;
            else if (filters.miasm === "Syphilis")
                miasmScore = rem.genome.syphiliticDrive;
            else if (filters.miasm === "Tubercular")
                miasmScore = rem.genome.tubercularDrive;
            else if (filters.miasm === "Cancerinic")
                miasmScore = rem.genome.cancerinicDrive;
            if (miasmScore > 50) {
                const added = Math.round(miasmScore / 4);
                score += added;
                reasons.push({
                    facet: "Miasm",
                    matchText: `Strong expression of ${filters.miasm} miasm (Score: ${miasmScore}).`,
                    score: added
                });
            }
        }
        // --- 5. Symptom Keywords Match ---
        filters.symptomKeywords.forEach((keyword) => {
            const kwLower = keyword.toLowerCase();
            let matchPoints = 0;
            let matchedField = "";
            // Check mental picture archetype/fears/delusions
            const mentalStr = `${rem.mentalPicture.personalityArchetype} ${rem.mentalPicture.fears.join(" ")} ${rem.mentalPicture.delusions.join(" ")}`.toLowerCase();
            if (mentalStr.includes(kwLower)) {
                matchPoints = 15;
                matchedField = "Mental Picture";
            }
            // Check physical generals
            const generalStr = `${rem.physicalGenerals.thermals} ${rem.physicalGenerals.cravings.join(" ")} ${rem.physicalGenerals.aversions.join(" ")} ${rem.physicalGenerals.worseFrom.join(" ")}`.toLowerCase();
            if (generalStr.includes(kwLower)) {
                matchPoints = 15;
                matchedField = "Physical Generals";
            }
            // Check particulars
            const particularsStr = `${rem.particulars.head} ${rem.particulars.throat} ${rem.particulars.chest} ${rem.particulars.abdomen} ${rem.particulars.extremities} ${rem.particulars.skin}`.toLowerCase();
            if (particularsStr.includes(kwLower)) {
                matchPoints = 10;
                matchedField = "Particulars";
            }
            if (matchPoints > 0) {
                score += matchPoints;
                reasons.push({
                    facet: "Symptom Keyword",
                    matchText: `Matched "${keyword}" in ${matchedField}.`,
                    score: matchPoints
                });
            }
        });
        if (score > 0) {
            results.push({
                remedy: rem,
                score,
                reasons
            });
        }
    });
    // Sort by match score descending
    return results.sort((a, b) => b.score - a.score);
}
