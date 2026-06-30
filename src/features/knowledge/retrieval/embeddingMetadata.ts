import { KnowledgeEntity } from "../types";

export interface RAGMetadata {
  entityId: string;
  slug: string;
  type: string;
  evidenceLevel: string;
  reviewer: string;
  lastUpdated: string;
  topics: string[];
  audience: string;
}

/**
 * Returns structured metadata tags optimized for LLM context retrieval filters.
 */
export function compileRAGMetadata(entity: KnowledgeEntity): RAGMetadata {
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
