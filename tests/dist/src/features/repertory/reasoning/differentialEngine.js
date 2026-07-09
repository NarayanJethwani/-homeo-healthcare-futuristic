"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifferentialEngine = void 0;
const repertoryData_1 = require("../../../lib/repertoryData");
const repertoryDb_1 = require("../database/repertoryDb");
class DifferentialEngine {
    /**
     * Compares two remedies against the active case symptoms.
     */
    static async compareRemedies(remedyA, remedyB, symptoms, confidenceA, confidenceB) {
        const rubrics = [];
        for (const s of symptoms) {
            const rub = await repertoryDb_1.repertoryRepository.getRubricById(s.rubricId);
            if (rub)
                rubrics.push(rub);
        }
        const sharedRubrics = [];
        const uniqueToA = [];
        const uniqueToB = [];
        rubrics.forEach(rub => {
            const hasA = rub.relatedRemedies.some(r => r.remedyId === remedyA);
            const hasB = rub.relatedRemedies.some(r => r.remedyId === remedyB);
            if (hasA && hasB) {
                sharedRubrics.push(rub.title);
            }
            else if (hasA) {
                uniqueToA.push(rub.title);
            }
            else if (hasB) {
                uniqueToB.push(rub.title);
            }
        });
        const confA = repertoryData_1.JETHWANI_REMEDY_CONFIRMATIONS[remedyA]?.confirmatory || [];
        const confB = repertoryData_1.JETHWANI_REMEDY_CONFIRMATIONS[remedyB]?.confirmatory || [];
        const getMissingConfirmations = (remedyId, confirmations) => {
            return confirmations.filter(c => !rubrics.some(rub => rub.relatedRemedies.some(r => r.remedyId === remedyId) &&
                (rub.title.toLowerCase().includes(c.toLowerCase()) ||
                    rub.plainLanguageMeaning.toLowerCase().includes(c.toLowerCase()))));
        };
        const missingConfirmationA = getMissingConfirmations(remedyA, confA);
        const missingConfirmationB = getMissingConfirmations(remedyB, confB);
        const differentiatingQuestions = [];
        const isChillyA = confA.some(c => c.toLowerCase().includes('chilly'));
        const isWarmA = confA.some(c => c.toLowerCase().includes('warm') || c.toLowerCase().includes('hot'));
        const isChillyB = confB.some(c => c.toLowerCase().includes('chilly'));
        const isWarmB = confB.some(c => c.toLowerCase().includes('warm') || c.toLowerCase().includes('hot'));
        if ((isChillyA && isWarmB) || (isWarmA && isChillyB)) {
            differentiatingQuestions.push(`Thermal check: Is the patient chilly (favors ${remedyA}) or warm-blooded (favors ${remedyB})?`);
        }
        const thirstlessA = confA.some(c => c.toLowerCase().includes('thirstless'));
        const thirstyA = confA.some(c => c.toLowerCase().includes('thirst ') || c.toLowerCase().includes('thirsty'));
        const thirstlessB = confB.some(c => c.toLowerCase().includes('thirstless'));
        const thirstyB = confB.some(c => c.toLowerCase().includes('thirst ') || c.toLowerCase().includes('thirsty'));
        if ((thirstlessA && thirstyB) || (thirstyA && thirstlessB)) {
            const favorsA = thirstlessA ? remedyA : remedyB;
            const favorsB = thirstyA ? remedyA : remedyB;
            differentiatingQuestions.push(`Thirst check: Is the patient thirstless (favors ${favorsA}) or thirsty (favors ${favorsB})?`);
        }
        const motionAmelA = confA.some(c => c.toLowerCase().includes('motion'));
        const motionAmelB = confB.some(c => c.toLowerCase().includes('motion'));
        if (motionAmelA !== motionAmelB) {
            differentiatingQuestions.push(`Motion check: Are physical symptoms ameliorated by motion (favors ${motionAmelA ? remedyA : remedyB})?`);
        }
        if (differentiatingQuestions.length === 0) {
            differentiatingQuestions.push(`Differential consideration: Assess the patient's reaction to cold drinks and open air.`);
        }
        const strongDifferentiators = [];
        if ((isChillyA && isWarmB) || (isWarmA && isChillyB)) {
            strongDifferentiators.push(`Thermal: ${remedyA} is ${isChillyA ? 'Chilly' : 'Warm'}, whereas ${remedyB} is ${isChillyB ? 'Chilly' : 'Warm'}.`);
        }
        if ((thirstlessA && thirstyB) || (thirstyA && thirstlessB)) {
            strongDifferentiators.push(`Thirst: ${remedyA} is ${thirstlessA ? 'Thirstless' : 'Thirsty'}, whereas ${remedyB} is ${thirstlessB ? 'Thirstless' : 'Thirsty'}.`);
        }
        if (uniqueToA.length > 0) {
            strongDifferentiators.push(`Symptom Coverage: Only ${remedyA} covers "${uniqueToA.slice(0, 2).join('", "')}".`);
        }
        if (uniqueToB.length > 0) {
            strongDifferentiators.push(`Symptom Coverage: Only ${remedyB} covers "${uniqueToB.slice(0, 2).join('", "')}".`);
        }
        const whyAInsteadOfB = uniqueToA.length > 0
            ? `${remedyA} covers unique symptoms (${uniqueToA.slice(0, 3).join(', ')}) that are not matched by ${remedyB}. Additionally, ${remedyA} aligns better with the case keynotes.`
            : `${remedyA} is indicated due to strong constitutional affinity and high rubric grade matching, with fewer contraindications than ${remedyB}.`;
        const whyBInsteadOfA = uniqueToB.length > 0
            ? `${remedyB} covers unique symptoms (${uniqueToB.slice(0, 3).join(', ')}) that are not matched by ${remedyA}. Additionally, ${remedyB} aligns better with the case keynotes.`
            : `${remedyB} is indicated due to strong constitutional affinity and high rubric grade matching, with fewer contraindications than ${remedyA}.`;
        return {
            remedyA,
            remedyB,
            sharedRubrics,
            uniqueToA,
            uniqueToB,
            missingConfirmationA,
            missingConfirmationB,
            differentiatingQuestions,
            confidenceGap: Math.abs(confidenceA - confidenceB),
            whyAInsteadOfB,
            whyBInsteadOfA,
            strongDifferentiators
        };
    }
}
exports.DifferentialEngine = DifferentialEngine;
