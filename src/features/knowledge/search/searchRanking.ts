import { KnowledgeEntity } from "../types";
import { tokenize } from "./searchTokenizer";

export interface SearchResult {
  entity: KnowledgeEntity;
  score: number;
  matchedFields: string[];
}

/**
 * Calculates search match score for a given entity and query tokens.
 */
export function scoreEntity(entity: KnowledgeEntity, queryTokens: string[]): SearchResult {
  let score = 0;
  const matchedFields: string[] = [];
  
  const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
  const summary = typeof entity.summary === "string" ? entity.summary : (entity.summary?.en || "");
  
  const titleTokens = tokenize(title);
  const summaryTokens = tokenize(summary);
  const tagTokens = entity.tags.flatMap(tag => tokenize(tag));
  const contentStr = JSON.stringify(entity.content || "").toLowerCase();

  for (const token of queryTokens) {
    // Exact title match boost
    if (title.toLowerCase() === token) {
      score += 100;
      matchedFields.push("title-exact");
    }
    // Partial title match
    else if (titleTokens.includes(token)) {
      score += 30;
      matchedFields.push("title-token");
    }
    // Tag match boost
    if (tagTokens.includes(token)) {
      score += 20;
      matchedFields.push("tag");
    }
    // Summary match
    if (summaryTokens.includes(token)) {
      score += 10;
      matchedFields.push("summary");
    }
    // Content body match
    if (contentStr.includes(token)) {
      score += 5;
      matchedFields.push("content");
    }
  }

  return {
    entity,
    score,
    matchedFields: Array.from(new Set(matchedFields)),
  };
}
