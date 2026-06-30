import { KnowledgeEntity } from "../types";

export interface DeprecationRedirect {
  deprecatedId: string;
  replacementId: string;
  redirectUrl: string;
}

/**
 * Validates and aggregates redirect routes for deprecated entities.
 */
export function buildDeprecationRedirectMap(entities: KnowledgeEntity[]): Map<string, DeprecationRedirect> {
  const redirectMap = new Map<string, DeprecationRedirect>();

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
