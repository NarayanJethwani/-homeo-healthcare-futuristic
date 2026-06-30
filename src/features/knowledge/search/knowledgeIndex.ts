import { getAllKnowledgeEntities } from "../index";
import { scoreEntity, SearchResult } from "./searchRanking";
import { tokenize } from "./searchTokenizer";
import { EntityType } from "../types";

/**
 * Searches the Clinical Knowledge Platform database.
 */
export function searchKnowledgeBase(
  query: string,
  entityTypeFilter?: EntityType
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    // If query is empty, return all active entities sorted alphabetically
    const entities = getAllKnowledgeEntities().filter(
      e => e.editorialStatus === "published"
    );
    const filtered = entityTypeFilter 
      ? entities.filter(e => e.entityType === entityTypeFilter)
      : entities;
      
    return filtered.map(entity => ({
      entity,
      score: 1,
      matchedFields: [],
    }));
  }

  const queryTokens = tokenize(query);
  const entities = getAllKnowledgeEntities().filter(
    e => e.editorialStatus === "published"
  );
  const filtered = entityTypeFilter 
    ? entities.filter(e => e.entityType === entityTypeFilter)
    : entities;

  return filtered
    .map(entity => scoreEntity(entity, queryTokens))
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score);
}
