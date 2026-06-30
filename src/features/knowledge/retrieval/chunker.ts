import { KnowledgeEntity } from "../types";

export interface KnowledgeChunk {
  chunkId: string;
  entityId: string;
  entityType: string;
  title: string;
  section: string;
  text: string;
  metadata: {
    tags: string[];
    version: string;
    reviewed: string;
    evidenceLevel: string;
  };
}

/**
 * Splits a KnowledgeEntity into structured chunks for future vector search embedding.
 */
export function chunkEntity(entity: KnowledgeEntity): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const titleStr = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
  const baseMetadata = {
    tags: entity.tags,
    version: entity.versionInfo.version,
    reviewed: entity.versionInfo.reviewed,
    evidenceLevel: entity.evidenceLevel,
  };

  // 1. Chunk Title & Summary
  const summaryStr = typeof entity.summary === "string" ? entity.summary : (entity.summary?.en || "");
  chunks.push({
    chunkId: `${entity.id}-summary`,
    entityId: entity.id,
    entityType: entity.entityType,
    title: titleStr,
    section: "Summary",
    text: `${titleStr}: ${summaryStr}`,
    metadata: baseMetadata,
  });

  // 2. Chunk individual content sections
  if (entity.content) {
    const keys = ["whatItMeans", "whenToConsultDoctor", "conventionalPerspective", "homeopathicPerspective", "remedyConsiderations", "lifestyleDietGuidance"];
    for (const key of keys) {
      const val = entity.content[key];
      if (val) {
        const textStr = typeof val === "string" ? val : (val.en || "");
        if (textStr) {
          chunks.push({
            chunkId: `${entity.id}-${key}`,
            entityId: entity.id,
            entityType: entity.entityType,
            title: titleStr,
            section: key,
            text: textStr,
            metadata: baseMetadata,
          });
        }
      }
    }
  }

  return chunks;
}
