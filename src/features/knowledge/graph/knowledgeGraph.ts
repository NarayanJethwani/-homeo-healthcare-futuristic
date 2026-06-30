import { KNOWLEDGE_RELATIONSHIPS } from "./entityRelationships";
import { getAllKnowledgeEntities } from "../index";
import { KnowledgeEntity, RelationshipType } from "../types";

/**
 * Returns all relationships where the given entity is either source or target.
 */
export function getEntityRelationships(entityId: string) {
  return KNOWLEDGE_RELATIONSHIPS.filter(
    rel => rel.source === entityId || rel.target === entityId
  );
}

/**
 * Resolves related entities of a specific type or relationship for a source entity.
 */
export function getRelatedEntities(
  entityId: string,
  relation?: RelationshipType
): { entity: KnowledgeEntity; relation: RelationshipType; direction: "incoming" | "outgoing" }[] {
  const entities = getAllKnowledgeEntities();
  const results: { entity: KnowledgeEntity; relation: RelationshipType; direction: "incoming" | "outgoing" }[] = [];

  for (const rel of KNOWLEDGE_RELATIONSHIPS) {
    if (relation && rel.relation !== relation) continue;

    if (rel.source === entityId) {
      const targetEntity = entities.find(e => e.id === rel.target);
      if (targetEntity) {
        results.push({ entity: targetEntity, relation: rel.relation, direction: "outgoing" });
      }
    } else if (rel.target === entityId) {
      const sourceEntity = entities.find(e => e.id === rel.source);
      if (sourceEntity) {
        results.push({ entity: sourceEntity, relation: rel.relation, direction: "incoming" });
      }
    }
  }

  return results;
}
