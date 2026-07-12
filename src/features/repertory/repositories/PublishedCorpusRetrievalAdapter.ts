import fs from "fs";
import path from "path";
import { PublishedCorpusRepository } from "./PublishedCorpusRepository";
import {
  RepertoryRetrievalRepository,
  CursorPageRequest,
  RetrievalResult
} from "./RepertoryRetrievalRepository";
import {
  RepertorySource,
  RepertoryEdition,
  RepertoryChapter,
  RepertoryRubricRecord,
  RepertorySourceId,
  RepertoryEditionId,
  RepertoryChapterId,
  RubricRecordId,
  RubricConceptId,
  RepertoryAccessContext
} from "../types/repertoryTypes";

export class PublishedCorpusRetrievalAdapter implements RepertoryRetrievalRepository {
  private getMetadataPath(version: string, subPath: string): string {
    return path.join(process.cwd(), "data", "repertory", "published", version, subPath);
  }

  private mapSourceId(editionId: string): RepertorySourceId {
    if (editionId.startsWith("kent")) return "kent" as RepertorySourceId;
    if (editionId.startsWith("boericke")) return "boericke" as RepertorySourceId;
    return editionId.split("_")[0] as RepertorySourceId;
  }

  private mapSourceType(type: string): "classical" | "modern" | "clinical_experience" {
    if (type === "classical" || type === "modern" || type === "clinical_experience") {
      return type;
    }
    return "classical";
  }

  private mapRightsStatus(status: string): "public_domain" | "licensed" | "internal" | "experimental" | "restricted" | "disabled" {
    if (status === "public-domain") return "public_domain";
    if (status === "public_domain" || status === "licensed" || status === "internal" || status === "experimental" || status === "restricted" || status === "disabled") {
      return status;
    }
    return "public_domain";
  }

  private mapPublicationStatus(status: string): "not_published" | "staged" | "active" | "superseded" | "blocked" {
    if (status === "active" || status === "not_published" || status === "staged" || status === "superseded" || status === "blocked") {
      return status;
    }
    return "active";
  }

  async getSources(context: RepertoryAccessContext): Promise<RepertorySource[]> {
    const version = await PublishedCorpusRepository.getActiveVersion();
    const filePath = this.getMetadataPath(version, "metadata/sources.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const list = JSON.parse(raw);

    const sourceMap = new Map<string, RepertorySource>();

    for (const item of list) {
      const srcId = this.mapSourceId(item.id);
      if (!sourceMap.has(srcId)) {
        sourceMap.set(srcId, {
          id: srcId,
          displayName: item.canonicalTitle || item.canonicalTitle || "Classical Repertory",
          shortName: item.shortTitle || "Repertory",
          author: item.author || "Unknown Author",
          originalLanguage: item.language || "en",
          sourceType: this.mapSourceType(item.sourceType)
        });
      }
    }

    return Array.from(sourceMap.values());
  }

  async getEditions(
    context: RepertoryAccessContext,
    sourceId: RepertorySourceId
  ): Promise<RepertoryEdition[]> {
    const version = await PublishedCorpusRepository.getActiveVersion();
    const filePath = this.getMetadataPath(version, "metadata/sources.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const list = JSON.parse(raw);

    const editions: RepertoryEdition[] = [];
    for (const item of list) {
      const mappedSrcId = this.mapSourceId(item.id);
      if (mappedSrcId === sourceId) {
        editions.push({
          id: item.id as RepertoryEditionId,
          sourceId: mappedSrcId,
          editionName: item.editionLabel || "Standard Edition",
          publicationYear: item.editionPublicationYear || 1900,
          originalPublicationYear: item.originalPublicationYear,
          language: item.language || "en",
          rightsStatus: this.mapRightsStatus(item.rightsStatus),
          publicationStatus: this.mapPublicationStatus(item.publicationStatus),
          citationFormat: item.citationFormat || `${item.shortTitle} p. [Page]`,
          corpusVersion: version,
          rightsReviewNotes: item.rightsReviewNotes
        });
      }
    }

    return editions;
  }

  async getChapters(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId
  ): Promise<RepertoryChapter[]> {
    const version = await PublishedCorpusRepository.getActiveVersion();
    const filePath = this.getMetadataPath(version, `sources/${editionId}/chapters.json`);
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const list = JSON.parse(raw);

    const sourceId = this.mapSourceId(editionId);

    return list.map((item: any, index: number) => ({
      id: item.chapterId as RepertoryChapterId,
      sourceId,
      editionId,
      stableChapterKey: item.safeChapterId,
      displayTitle: item.title || item.chapterId,
      hierarchyLevel: 0,
      ordering: index,
      rubricCount: item.shards?.reduce((acc: number, s: any) => acc + (s.recordCount || 0), 0) || 0,
      corpusVersion: version
    }));
  }

  async getRubricById(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord | null> {
    await PublishedCorpusRepository.ensureActiveCorpusLoaded();
    const rubric = await PublishedCorpusRepository.getRubricById(rubricId);
    if (!rubric) return null;

    const version = await PublishedCorpusRepository.getActiveVersion();
    const editionId = (rubric.sourceId || "kent_1908") as RepertoryEditionId;
    const sourceId = this.mapSourceId(editionId);

    return {
      id: rubric.rubricId as RubricRecordId,
      conceptId: (rubric.canonicalConceptId || `${editionId}_${rubric.rubricId}`) as RubricConceptId,
      sourceId,
      editionId,
      chapterId: (rubric.chapterId || "Unknown") as RepertoryChapterId,
      hierarchyPath: rubric.hierarchyPath || [],
      displayText: rubric.title,
      classicalWording: rubric.classicalWording,
      plainLanguageMeaning: rubric.plainLanguageMeaning,
      parentRecordId: rubric.parentId as RubricRecordId,
      depth: rubric.hierarchyPath ? rubric.hierarchyPath.length : 1,
      hasChildren: false, // will be evaluated dynamically by HierarchyService
      sourceVersion: version
    };
  }

  async getRubricsByChapter(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId,
    chapterId: RepertoryChapterId,
    page: CursorPageRequest
  ): Promise<RetrievalResult<RepertoryRubricRecord>> {
    const version = await PublishedCorpusRepository.getActiveVersion();
    const limit = page.limit || 50;
    let offset = 0;

    if (page.position !== undefined) {
      if (typeof page.position === "number") {
        offset = page.position;
      } else {
        offset = parseInt(page.position, 10) || 0;
      }
    }

    const chaptersFilePath = this.getMetadataPath(version, `sources/${editionId}/chapters.json`);
    if (!fs.existsSync(chaptersFilePath)) {
      return { items: [], hasNextPage: false, sourceVersion: version };
    }

    const chaptersRaw = fs.readFileSync(chaptersFilePath, "utf-8");
    const chaptersList = JSON.parse(chaptersRaw);
    const chapterMeta = chaptersList.find((c: any) => c.chapterId === chapterId);

    if (!chapterMeta || !chapterMeta.shards) {
      return { items: [], hasNextPage: false, sourceVersion: version };
    }

    // Load rubrics from the shards
    const rubrics: any[] = [];
    for (const shard of chapterMeta.shards) {
      const shardRubrics = await PublishedCorpusRepository.loadChapterShard(
        editionId,
        chapterMeta.safeChapterId,
        shard.shardId
      );
      rubrics.push(...shardRubrics);
    }

    const totalCount = rubrics.length;
    const pageItems = rubrics.slice(offset, offset + limit);
    const hasNextPage = offset + limit < totalCount;

    const sourceId = this.mapSourceId(editionId);

    const items: RepertoryRubricRecord[] = pageItems.map(rubric => ({
      id: rubric.rubricId as RubricRecordId,
      conceptId: (rubric.canonicalConceptId || `${editionId}_${rubric.rubricId}`) as RubricConceptId,
      sourceId,
      editionId,
      chapterId,
      hierarchyPath: rubric.hierarchyPath || [],
      displayText: rubric.title,
      classicalWording: rubric.classicalWording,
      plainLanguageMeaning: rubric.plainLanguageMeaning,
      parentRecordId: rubric.parentId as RubricRecordId,
      depth: rubric.hierarchyPath ? rubric.hierarchyPath.length : 1,
      hasChildren: false, // dynamic check
      sourceVersion: version
    }));

    return {
      items,
      hasNextPage,
      nextPosition: hasNextPage ? offset + limit : undefined,
      totalCount,
      sourceVersion: version
    };
  }
}
