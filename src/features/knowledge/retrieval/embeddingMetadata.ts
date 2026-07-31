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

export function getRAGMetadata(entity: KnowledgeEntity): RAGMetadata {
  const reviewerStr = typeof entity.reviewer === "string"
    ? entity.reviewer
    : entity.reviewer?.name
      ? `${entity.reviewer.name}${entity.reviewer.credentials ? `, ${entity.reviewer.credentials}` : ""}`
      : "Dr. Narayan Jethwani, MD (Hom)";

  return {
    entityId: entity.id,
    slug: entity.slug,
    type: entity.entityType,
    evidenceLevel: entity.evidenceLevel,
    reviewer: reviewerStr,
    lastUpdated: entity.versionInfo.updated,
    topics: entity.tags,
    audience: entity.audience,
  };
}
