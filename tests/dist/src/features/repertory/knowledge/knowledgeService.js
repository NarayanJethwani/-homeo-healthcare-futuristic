"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeService = void 0;
const evidenceRegistry_1 = require("./evidenceRegistry");
const repertoryGraph_1 = require("../graph/repertoryGraph");
class KnowledgeService {
    /**
     * Initializes the knowledge relations inside the Clinical Knowledge Graph.
     */
    static async initializeKnowledgeGraph() {
        if (this.isGraphInitialized)
            return;
        for (const record of Object.values(evidenceRegistry_1.JETHWANI_EVIDENCE_REGISTRY)) {
            const remedyId = record.remedyId;
            // Register pathology relations
            for (const pathology of record.pathologyRelations) {
                await repertoryGraph_1.RepertoryGraph.registerRelationship(remedyId, 'treatsPathology', pathology, 0.8);
            }
            // Register remedy relationships (complementary, inimical, antidotes)
            for (const rel of record.remedyRelations) {
                if (rel.toLowerCase().includes('complementary')) {
                    const targetRemId = rel.split(' ')[0];
                    await repertoryGraph_1.RepertoryGraph.registerRelationship(remedyId, 'isComplementaryTo', targetRemId, 0.9);
                }
                else if (rel.toLowerCase().includes('antidote')) {
                    const targetRemId = rel.split(' ')[0];
                    await repertoryGraph_1.RepertoryGraph.registerRelationship(remedyId, 'antidotesRemedy', targetRemId, 0.85);
                }
                else if (rel.toLowerCase().includes('inimical')) {
                    const targetRemId = rel.split(' ')[0];
                    await repertoryGraph_1.RepertoryGraph.registerRelationship(remedyId, 'isInimicalTo', targetRemId, 0.95);
                }
            }
        }
        this.isGraphInitialized = true;
    }
    /**
     * Retrieves structured knowledge for a remedy, using a memoization cache to keep lookups sub-millisecond.
     */
    static async getRemedyKnowledge(remedyId) {
        await this.initializeKnowledgeGraph();
        if (this.cache.has(remedyId)) {
            return this.cache.get(remedyId);
        }
        const record = evidenceRegistry_1.JETHWANI_EVIDENCE_REGISTRY[remedyId];
        if (record) {
            this.cache.set(remedyId, record);
            return record;
        }
        return null;
    }
    /**
     * Queries specific evidence items matching a search tag or pathology concept.
     */
    static async queryEvidenceByConcept(concept) {
        await this.initializeKnowledgeGraph();
        const results = [];
        const normalizedConcept = concept.toLowerCase();
        for (const record of Object.values(evidenceRegistry_1.JETHWANI_EVIDENCE_REGISTRY)) {
            // Direct matches in pathology relations
            const matchesPathology = record.pathologyRelations.some(p => p.toLowerCase().includes(normalizedConcept));
            if (matchesPathology) {
                results.push(...record.evidenceItems);
            }
            else {
                // Fallback to searching evidence content text
                const matchesContent = record.evidenceItems.filter(item => item.title.toLowerCase().includes(normalizedConcept) ||
                    item.summary.toLowerCase().includes(normalizedConcept));
                results.push(...matchesContent);
            }
        }
        return results;
    }
}
exports.KnowledgeService = KnowledgeService;
KnowledgeService.cache = new Map();
KnowledgeService.isGraphInitialized = false;
