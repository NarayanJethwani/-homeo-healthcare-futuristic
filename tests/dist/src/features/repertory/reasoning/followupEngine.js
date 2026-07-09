"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpEngine = void 0;
const repertoryDb_1 = require("../database/repertoryDb");
class FollowUpEngine {
    /**
     * Evaluates current active symptoms and remedy rankings to generate follow-up diagnostics.
     */
    static async generateFollowUpQuestions(symptoms, topRemedies) {
        const questions = [];
        const rubrics = [];
        for (const sym of symptoms) {
            const rub = await repertoryDb_1.repertoryRepository.getRubricById(sym.rubricId);
            if (rub)
                rubrics.push(rub);
        }
        // 1. Incomplete generals check (Thermal state missing)
        const hasThermal = rubrics.some(r => r.category === 'Thermal State');
        if (!hasThermal) {
            questions.push({
                key: "followup_thermal",
                questionText: "Does the patient feel generally chilly or warm-blooded, and how do they react to warm or cold rooms?",
                options: ["Chilly", "Warm-blooded", "Ambient / No preference"],
                priority: 1
            });
        }
        // 2. Incomplete modalities check
        const hasModalities = rubrics.some(r => r.category === 'Modalities');
        if (!hasModalities) {
            questions.push({
                key: "followup_modalities",
                questionText: "What environmental conditions or movements make the chief physical symptoms better or worse?",
                options: ["Worse from motion", "Better from warmth", "Worse from cold wraps", "Better in open air"],
                priority: 2
            });
        }
        // 3. Weak constitutional picture (Food cravings missing)
        const hasCravings = rubrics.some(r => r.category === 'Food & Cravings');
        if (!hasCravings) {
            questions.push({
                key: "followup_cravings",
                questionText: "Does the patient have any intense food cravings, specifically regarding sweet, salty, or fat foods?",
                options: ["Craves sweets", "Craves salt", "Aversion to fat foods", "Thirstless"],
                priority: 2
            });
        }
        // 4. Remedy Differentiation (top 2 remedies within 15 points)
        if (topRemedies.length >= 2) {
            const first = topRemedies[0];
            const second = topRemedies[1];
            const diff = first.score - second.score;
            if (diff <= 15) {
                if (first.remedyId === 'Ars' && second.remedyId === 'Nux-v') {
                    questions.push({
                        key: "followup_diff_ars_nux",
                        questionText: "Is the patient's restlessness accompanied by intense anxiety and panic, or are they primarily irritable and over-stressed?",
                        options: ["Restless anxiety", "Spasmodic irritability", "Overwork burnout"],
                        priority: 1
                    });
                    questions.push({
                        key: "followup_time_modality",
                        questionText: "Do the patient's symptoms worsen significantly around midnight (11 PM - 2 AM) or in the early morning (3 AM - 5 AM)?",
                        options: ["Midnight aggravation", "Early morning waking", "No change"],
                        priority: 1
                    });
                }
                else if (first.remedyId === 'Lyc' && second.remedyId === 'Sulph') {
                    questions.push({
                        key: "followup_diff_lyc_sulph",
                        questionText: "Is the abdominal bloating accompanied by anticipatory performance anxiety, or does the patient have burning soles of the feet?",
                        options: ["Bloating & anticipatory anxiety", "Burning soles / hot palms", " filosófical disposition"],
                        priority: 1
                    });
                }
                else {
                    questions.push({
                        key: `followup_diff_${first.remedyId}_${second.remedyId}`,
                        questionText: `To differentiate between ${first.remedyName} and ${second.remedyName}, is the general patient disposition yielding and mild, or structured and irritable?`,
                        options: ["Yielding / Weepy", "Structured / Competitive", "Warm-blooded", "Chilly"],
                        priority: 1
                    });
                }
            }
        }
        // 5. Conflicting Evidence check
        topRemedies.forEach(rem => {
            if (rem.contradictoryEvidence && rem.contradictoryEvidence.length > 0) {
                questions.push({
                    key: `followup_contradiction_${rem.remedyId}`,
                    questionText: `Verify patient details regarding: ${rem.contradictoryEvidence.join('; ')}`,
                    options: ["Confirm thermal mismatch", "Confirm modality conflict", "Unchanged"],
                    priority: 1
                });
            }
        });
        return questions;
    }
}
exports.FollowUpEngine = FollowUpEngine;
