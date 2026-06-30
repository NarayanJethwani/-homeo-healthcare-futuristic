import { getAllKnowledgeEntities } from "../index";
import { chunkEntity, KnowledgeChunk } from "./chunker";
import { tokenize } from "../search/searchTokenizer";

/**
 * Returns all tokenized text chunks across the published knowledge entities.
 */
export function getAllKnowledgeChunks(): KnowledgeChunk[] {
  const entities = getAllKnowledgeEntities().filter(
    e => e.editorialStatus === "published"
  );
  return entities.flatMap(entity => chunkEntity(entity));
}

/**
 * Performs flat-text chunk retrieval matching queries.
 */
export function retrieveRelevantChunks(query: string, limit: number = 3): KnowledgeChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const chunks = getAllKnowledgeChunks();
  const scored = chunks.map(chunk => {
    let score = 0;
    const chunkTokens = tokenize(chunk.text);
    
    for (const token of tokens) {
      if (chunkTokens.includes(token)) {
        score += 1;
      }
      if (chunk.title.toLowerCase().includes(token)) {
        score += 2; // Boost if matched title
      }
    }
    return { chunk, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk);
}
