"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceEngine = void 0;
const repertoryDb_1 = require("../database/repertoryDb");
class ConfidenceEngine {
    /**
     * Calculates category-specific confidence coverage percentages for a given remedy.
     */
    static async getConfidenceBreakdown(remedyId, symptoms) {
        const rubrics = [];
        for (const s of symptoms) {
            const rub = await repertoryDb_1.repertoryRepository.getRubricById(s.rubricId);
            if (rub)
                rubrics.push(rub);
        }
        if (rubrics.length === 0) {
            return { mental: 0, physical: 0, modalities: 0, etiology: 0, thermals: 0, overall: 0 };
        }
        const groups = {
            mental: [],
            physical: [],
            modalities: [],
            etiology: [],
            thermals: []
        };
        rubrics.forEach(rub => {
            if (rub.category === 'Mental & Emotional') {
                groups.mental.push(rub);
            }
            else if (rub.category === 'Etiology / Causation') {
                groups.etiology.push(rub);
            }
            else if (rub.category === 'Modalities') {
                groups.modalities.push(rub);
            }
            else if (rub.category === 'Thermal State') {
                groups.thermals.push(rub);
            }
            else {
                groups.physical.push(rub);
            }
        });
        const calcCoverage = (groupRubrics) => {
            if (groupRubrics.length === 0)
                return 0;
            const matched = groupRubrics.filter(r => r.relatedRemedies.some(rem => rem.remedyId === remedyId));
            return Math.round((matched.length / groupRubrics.length) * 100);
        };
        const mental = calcCoverage(groups.mental);
        const physical = calcCoverage(groups.physical);
        const modalities = calcCoverage(groups.modalities);
        const etiology = calcCoverage(groups.etiology);
        const thermals = calcCoverage(groups.thermals);
        const totalMatched = rubrics.filter(r => r.relatedRemedies.some(rem => rem.remedyId === remedyId)).length;
        const overall = Math.round((totalMatched / rubrics.length) * 100);
        return { mental, physical, modalities, etiology, thermals, overall };
    }
}
exports.ConfidenceEngine = ConfidenceEngine;
