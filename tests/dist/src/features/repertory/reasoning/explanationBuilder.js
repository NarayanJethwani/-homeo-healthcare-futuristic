"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplanationBuilder = void 0;
const repertoryData_1 = require("../../../lib/repertoryData");
const repertoryDb_1 = require("../database/repertoryDb");
class ExplanationBuilder {
    /**
     * Constructs an explainable text narrative for the suggested remedy.
     */
    static async buildExplanation(remedyId, remedyName, confidence, symptoms) {
        const rubrics = [];
        for (const s of symptoms) {
            const rub = await repertoryDb_1.repertoryRepository.getRubricById(s.rubricId);
            if (rub && rub.relatedRemedies.some(r => r.remedyId === remedyId)) {
                rubrics.push(rub);
            }
        }
        const categories = {
            mental: [],
            generals: [],
            physicals: [],
            modalities: [],
            etiology: []
        };
        rubrics.forEach(r => {
            const title = r.title;
            if (r.category === 'Mental & Emotional') {
                categories.mental.push(title);
            }
            else if (r.category === 'Etiology / Causation') {
                categories.etiology.push(title);
            }
            else if (r.category === 'Modalities') {
                categories.modalities.push(title);
            }
            else if (r.category === 'Thermal State' || r.category === 'Constitutional Generals') {
                categories.generals.push(title);
            }
            else {
                categories.physicals.push(title);
            }
        });
        const lines = [];
        lines.push(`### Analysis for ${remedyName} (${remedyId})`);
        lines.push(`There is a possible remedy affinity with an overall confidence match of ${confidence}%.`);
        lines.push(`This represents supporting rubrics and evidence for clinician review only.`);
        lines.push(``);
        if (categories.mental.length > 0) {
            lines.push(`**Matched Mental Rubrics:**`);
            categories.mental.forEach(t => lines.push(`- ${t}`));
            lines.push(``);
        }
        if (categories.generals.length > 0) {
            lines.push(`**Matched Generals:**`);
            categories.generals.forEach(t => lines.push(`- ${t}`));
            lines.push(``);
        }
        if (categories.physicals.length > 0) {
            lines.push(`**Matched Physicals:**`);
            categories.physicals.forEach(t => lines.push(`- ${t}`));
            lines.push(``);
        }
        if (categories.modalities.length > 0) {
            lines.push(`**Matched Modalities:**`);
            categories.modalities.forEach(t => lines.push(`- ${t}`));
            lines.push(``);
        }
        if (categories.etiology.length > 0) {
            lines.push(`**Matched Etiology:**`);
            categories.etiology.forEach(t => lines.push(`- ${t}`));
            lines.push(``);
        }
        const confirmations = repertoryData_1.JETHWANI_REMEDY_CONFIRMATIONS[remedyId];
        if (confirmations) {
            lines.push(`**Clinical Confirmation Indicators:**`);
            confirmations.confirmatory.forEach(c => lines.push(`- ${c}`));
            lines.push(``);
        }
        return lines.join('\n').trim();
    }
}
exports.ExplanationBuilder = ExplanationBuilder;
