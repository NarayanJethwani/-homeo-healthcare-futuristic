"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEntity = resolveEntity;
const index_1 = require("../index");
/**
 * Resolves an entity by its stable ID or slug.
 */
function resolveEntity(identifier, entityType) {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    // Try matching by stable ID
    let match = entities.find(e => e.id.toLowerCase() === identifier.toLowerCase());
    if (match)
        return match;
    // Try matching by slug
    match = entities.find(e => {
        const slugMatch = e.slug.toLowerCase() === identifier.toLowerCase();
        const typeMatch = entityType ? e.entityType === entityType : true;
        return slugMatch && typeMatch;
    });
    return match;
}
