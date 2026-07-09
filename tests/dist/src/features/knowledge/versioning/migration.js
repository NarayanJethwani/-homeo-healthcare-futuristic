"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDeprecationRedirectMap = buildDeprecationRedirectMap;
/**
 * Validates and aggregates redirect routes for deprecated entities.
 */
function buildDeprecationRedirectMap(entities) {
    const redirectMap = new Map();
    for (const entity of entities) {
        if (entity.versionInfo?.deprecated && entity.versionInfo.replacementEntityId) {
            const targetId = entity.versionInfo.replacementEntityId;
            const targetEntity = entities.find(e => e.id === targetId);
            if (targetEntity) {
                redirectMap.set(entity.id, {
                    deprecatedId: entity.id,
                    replacementId: targetId,
                    redirectUrl: targetEntity.canonicalUrl,
                });
            }
        }
    }
    return redirectMap;
}
