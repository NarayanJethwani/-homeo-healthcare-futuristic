"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityRelationships = getEntityRelationships;
exports.getRelatedEntities = getRelatedEntities;
const entityRelationships_1 = require("./entityRelationships");
const index_1 = require("../index");
/**
 * Returns all relationships where the given entity is either source or target.
 */
function getEntityRelationships(entityId) {
    return entityRelationships_1.KNOWLEDGE_RELATIONSHIPS.filter(rel => rel.source === entityId || rel.target === entityId);
}
/**
 * Resolves related entities of a specific type or relationship for a source entity.
 */
function getRelatedEntities(entityId, relation) {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const results = [];
    for (const rel of entityRelationships_1.KNOWLEDGE_RELATIONSHIPS) {
        if (relation && rel.relation !== relation)
            continue;
        if (rel.source === entityId) {
            const targetEntity = entities.find(e => e.id === rel.target);
            if (targetEntity) {
                results.push({ entity: targetEntity, relation: rel.relation, direction: "outgoing" });
            }
        }
        else if (rel.target === entityId) {
            const sourceEntity = entities.find(e => e.id === rel.source);
            if (sourceEntity) {
                results.push({ entity: sourceEntity, relation: rel.relation, direction: "incoming" });
            }
        }
    }
    return results;
}
