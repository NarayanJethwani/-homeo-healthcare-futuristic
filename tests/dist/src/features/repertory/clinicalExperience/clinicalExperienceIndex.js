"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalExperienceIndex = void 0;
const clinicalExperienceRegistry_1 = require("./clinicalExperienceRegistry");
class ClinicalExperienceIndex {
    /**
     * Searches Dr. Jethwani's clinical observations by query terms.
     */
    static searchObservations(query) {
        const term = query.toLowerCase().trim();
        if (!term)
            return this.cache;
        return this.cache.filter(record => record.title.toLowerCase().includes(term) ||
            record.content.toLowerCase().includes(term) ||
            record.provenance.toLowerCase().includes(term) ||
            (record.remedies && record.remedies.some(r => r.toLowerCase().includes(term))) ||
            (record.rubrics && record.rubrics.some(ru => ru.toLowerCase().includes(term))));
    }
    /**
     * Fetches observations that directly map to a given remedy candidate.
     */
    static getObservationsForRemedy(remedyId) {
        const rid = remedyId.toLowerCase().trim();
        return this.cache.filter(record => record.remedies && record.remedies.some(r => r.toLowerCase() === rid));
    }
}
exports.ClinicalExperienceIndex = ClinicalExperienceIndex;
ClinicalExperienceIndex.cache = Object.values(clinicalExperienceRegistry_1.JETHWANI_CLINICAL_EXPERIENCE_REGISTRY);
