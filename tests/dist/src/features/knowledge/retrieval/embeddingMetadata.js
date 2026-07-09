"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileRAGMetadata = compileRAGMetadata;
/**
 * Returns structured metadata tags optimized for LLM context retrieval filters.
 */
function compileRAGMetadata(entity) {
    return {
        entityId: entity.id,
        slug: entity.slug,
        type: entity.entityType,
        evidenceLevel: entity.evidenceLevel,
        reviewer: `${entity.reviewer.name}, ${entity.reviewer.credentials}`,
        lastUpdated: entity.versionInfo.updated,
        topics: entity.tags,
        audience: entity.audience,
    };
}
