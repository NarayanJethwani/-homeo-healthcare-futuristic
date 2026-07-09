"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRepertoryRepository = void 0;
const repertorySeed_1 = require("../data/repertorySeed");
class MemoryRepertoryRepository {
    constructor() {
        this.rubrics = new Map();
        this.triples = [];
        // Seed the database in memory
        repertorySeed_1.SEED_RUBRICS.forEach(r => this.rubrics.set(r.rubricId, { ...r }));
        this.triples = [...repertorySeed_1.SEED_TRIPLES];
    }
    async getRubrics(filters) {
        let result = Array.from(this.rubrics.values());
        if (filters) {
            if (filters.category && filters.category !== 'All') {
                result = result.filter(r => r.category === filters.category);
            }
            if (filters.organSystem && filters.organSystem !== 'All') {
                result = result.filter(r => r.organSystem === filters.organSystem);
            }
            if (filters.miasm && filters.miasm !== 'All') {
                result = result.filter(r => {
                    const w = r.miasmaticWeight[filters.miasm];
                    return w !== undefined && w > 0.0;
                });
            }
            if (filters.remedy && filters.remedy !== 'All') {
                result = result.filter(r => r.relatedRemedies.some(rem => rem.remedyId.toLowerCase() === filters.remedy.toLowerCase()));
            }
        }
        return result;
    }
    async getRubricById(id) {
        const r = this.rubrics.get(id);
        return r ? { ...r } : null;
    }
    async saveRubric(rubric) {
        this.rubrics.set(rubric.rubricId, { ...rubric });
        return { ...rubric };
    }
    async deleteRubric(id) {
        return this.rubrics.delete(id);
    }
    async getTriples() {
        return [...this.triples];
    }
    async saveTriple(triple) {
        // Remove if already exists to prevent duplicate triples
        await this.deleteTriple(triple.subjectId, triple.predicate, triple.objectId);
        this.triples.push({ ...triple });
    }
    async deleteTriple(subjectId, predicate, objectId) {
        const initialLen = this.triples.length;
        this.triples = this.triples.filter(t => !(t.subjectId === subjectId && t.predicate === predicate && t.objectId === objectId));
        return this.triples.length < initialLen;
    }
}
exports.MemoryRepertoryRepository = MemoryRepertoryRepository;
