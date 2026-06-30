import { getAllKnowledgeEntities } from "../index";
import { KnowledgeEntity, EntityType } from "../types";

/**
 * Resolves an entity by its stable ID or slug.
 */
export function resolveEntity(
  identifier: string,
  entityType?: EntityType
): KnowledgeEntity | undefined {
  const entities = getAllKnowledgeEntities();
  
  // Try matching by stable ID
  let match = entities.find(e => e.id.toLowerCase() === identifier.toLowerCase());
  if (match) return match;

  // Try matching by slug
  match = entities.find(e => {
    const slugMatch = e.slug.toLowerCase() === identifier.toLowerCase();
    const typeMatch = entityType ? e.entityType === entityType : true;
    return slugMatch && typeMatch;
  });

  return match;
}
