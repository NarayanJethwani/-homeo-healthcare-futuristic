import crypto from "crypto";
import {
  IRepertoryAccessPolicy
} from "../access/RepertoryAccessPolicy";
import {
  RepertoryRetrievalRepository,
  CursorPageRequest,
  RetrievalResult
} from "../repositories/RepertoryRetrievalRepository";
import { HierarchyService } from "../hierarchy/HierarchyService";
import { SynonymService } from "../search/SynonymService";
import { RubricSearchIndex, RubricSearchResult, SearchTrace } from "../search/RubricSearchIndex";
import { SearchCache, CacheFingerprint } from "../search/SearchCache";
import {
  RepertorySource,
  RepertoryEdition,
  RepertoryChapter,
  RepertoryRubricRecord,
  RepertorySourceId,
  RepertoryEditionId,
  RepertoryChapterId,
  RubricRecordId,
  RepertoryAccessContext
} from "../types/repertoryTypes";
import { CursorCodec, PaginatedResult } from "./cursorWrapperTypes";
import { generateAccessFingerprint } from "../../../server/repertory/cursor/HmacCursorCodec";

export class KnowledgeAccessService {
  constructor(
    private repository: RepertoryRetrievalRepository,
    private hierarchyService: HierarchyService,
    private accessPolicy: IRepertoryAccessPolicy,
    private searchIndex: RubricSearchIndex,
    private synonymService: SynonymService,
    private cache: SearchCache,
    private cursorCodec: CursorCodec
  ) {}

  async getSources(context: RepertoryAccessContext): Promise<RepertorySource[]> {
    const rawSources = await this.repository.getSources(context);
    return rawSources.filter(src => this.accessPolicy.canListSource(context, src).allowed);
  }

  async getEditions(
    context: RepertoryAccessContext,
    sourceId: RepertorySourceId
  ): Promise<RepertoryEdition[]> {
    const rawEditions = await this.repository.getEditions(context, sourceId);
    return rawEditions.filter(ed => this.accessPolicy.canListEdition(context, ed).allowed);
  }

  async getChapters(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId
  ): Promise<RepertoryChapter[]> {
    // 1. Resolve target edition
    const sources = await this.repository.getSources(context);
    let targetEdition: RepertoryEdition | null = null;
    for (const src of sources) {
      const eds = await this.repository.getEditions(context, src.id);
      const match = eds.find(e => e.id === editionId);
      if (match) {
        targetEdition = match;
        break;
      }
    }

    if (!targetEdition) {
      throw new Error("Edition not found or unavailable");
    }

    const decision = this.accessPolicy.canReadMetadata(context, targetEdition);
    if (!decision.allowed) {
      throw new Error(`Access denied to edition metadata: ${decision.reason}`);
    }

    return this.repository.getChapters(context, editionId);
  }

  async getRubricById(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord | null> {
    const rubric = await this.repository.getRubricById(context, rubricId);
    if (!rubric) return null;

    const edition = await this.getEditionRecord(context, rubric.editionId);
    if (!edition) return null;

    const decision = this.accessPolicy.canReadContent(context, edition);
    if (!decision.allowed) {
      return null; // Enforce content access rights
    }

    // Hydrate dynamic hasChildren check
    const children = await this.hierarchyService.getChildren(context, rubricId);
    rubric.hasChildren = children.length > 0;

    return rubric;
  }

  async getRubricsByChapter(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId,
    chapterId: RepertoryChapterId,
    page: CursorPageRequest
  ): Promise<PaginatedResult<RepertoryRubricRecord>> {
    const edition = await this.getEditionRecord(context, editionId);
    if (!edition) {
      throw new Error("Edition not found");
    }

    const decision = this.accessPolicy.canReadContent(context, edition);
    if (!decision.allowed) {
      throw new Error(`Access denied to edition content: ${decision.reason}`);
    }

    const version = "v1.0.0";
    const limit = page.limit || 50;
    const allowedEditionIds = [editionId];
    const accessFingerprint = this.getAccessFingerprint(context, allowedEditionIds);

    let offset = 0;
    if (page.position !== undefined) {
      const cursorStr = String(page.position);
      const decoded = this.cursorCodec.decode(cursorStr, {
        purpose: "chapter_page",
        organizationId: context.organizationId || "default",
        accessFingerprint,
        editionId,
        chapterId,
        corpusVersion: version,
        limit
      });
      offset = typeof decoded.position === "number" ? decoded.position : parseInt(decoded.position, 10);
    }

    const result = await this.repository.getRubricsByChapter(context, editionId, chapterId, {
      limit,
      position: offset
    });
    
    // Dyn hydrate hasChildren
    for (const item of result.items) {
      const children = await this.hierarchyService.getChildren(context, item.id);
      item.hasChildren = children.length > 0;
    }

    let nextCursor: string | undefined;
    if (result.hasNextPage && result.nextPosition !== undefined) {
      nextCursor = this.cursorCodec.encode({
        purpose: "chapter_page",
        organizationId: context.organizationId || "default",
        accessFingerprint,
        editionId,
        chapterId,
        corpusVersion: version,
        limit,
        position: result.nextPosition
      });
    }

    return {
      items: result.items,
      hasNextPage: result.hasNextPage,
      nextCursor,
      totalCount: result.totalCount,
      sourceVersion: result.sourceVersion
    };
  }

  async searchRubrics(
    context: RepertoryAccessContext,
    query: string,
    filters: { chapterId?: string; editionIds?: RepertoryEditionId[] },
    page: CursorPageRequest
  ): Promise<PaginatedResult<RubricSearchResult>> {
    const limit = page.limit || 50;

    // 1. Resolve which editions are allowed
    const sources = await this.repository.getSources(context);
    const allowedEditions: RepertoryEdition[] = [];

    for (const src of sources) {
      const eds = await this.repository.getEditions(context, src.id);
      for (const ed of eds) {
        if (this.accessPolicy.canReadContent(context, ed).allowed) {
          allowedEditions.push(ed);
        }
      }
    }

    const allowedEditionIds = allowedEditions.map(e => e.id);

    // Apply target filter restriction if provided
    let filterEditionIds = filters.editionIds || allowedEditionIds;
    filterEditionIds = filterEditionIds.filter(id => allowedEditionIds.includes(id));

    if (filterEditionIds.length === 0) {
      return { items: [], hasNextPage: false, sourceVersion: "v1.0.0" };
    }

    const version = "v1.0.0";
    const accessFingerprint = this.getAccessFingerprint(context, filterEditionIds);
    const normQuery = this.canonicalizeQuery(query);
    const queryHash = this.sha256Hash(normQuery);
    const filterHash = this.sha256Hash(this.canonicalizeFilters(filters));

    let offset = 0;
    if (page.position !== undefined) {
      const cursorStr = String(page.position);
      const decoded = this.cursorCodec.decode(cursorStr, {
        purpose: "rubric_search",
        organizationId: context.organizationId || "default",
        accessFingerprint,
        queryHash,
        filterHash,
        corpusVersion: version,
        limit
      });
      offset = typeof decoded.position === "number" ? decoded.position : parseInt(decoded.position, 10);
    }

    // 2. Check Cache
    const fingerprint: CacheFingerprint = {
      organizationId: context.organizationId || "default",
      allowedEditions: filterEditionIds,
      activeFeatureFlags: context.activeFeatureFlags,
      corpusVersion: version,
      indexVersion: "1.0.0-index",
      synonymVersion: this.synonymService.expandTerm("").expansionVersion,
      query,
      filters,
      cursor: page.position ? String(page.position) : undefined,
      limit
    };

    const cacheKey = this.cache.generateFingerprintKey(fingerprint);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      cached.trace.cacheStatus = "hit";
      const totalCount = cached.results.length;
      const pageResults = cached.results.slice(offset, offset + limit);
      const hasNextPage = offset + limit < totalCount;
      
      let nextCursor: string | undefined;
      if (hasNextPage) {
        nextCursor = this.cursorCodec.encode({
          purpose: "rubric_search",
          organizationId: context.organizationId || "default",
          accessFingerprint,
          queryHash,
          filterHash,
          corpusVersion: version,
          limit,
          position: offset + limit
        });
      }

      return {
        items: pageResults,
        hasNextPage,
        nextCursor,
        totalCount,
        sourceVersion: version
      };
    }

    // 3. Collect rights-approved rubrics
    const rightsApprovedRubrics: RepertoryRubricRecord[] = [];
    for (const edId of filterEditionIds) {
      const chapters = await this.repository.getChapters(context, edId);
      for (const ch of chapters) {
        if (filters.chapterId && ch.id !== filters.chapterId) {
          continue;
        }
        const chResult = await this.repository.getRubricsByChapter(context, edId, ch.id, { limit: 100000 });
        rightsApprovedRubrics.push(...chResult.items);
      }
    }

    // 4. Run Search Index
    const searchVal = this.searchIndex.search(query, rightsApprovedRubrics, filters, version);
    
    // Save trace in cache
    const cacheEntry = {
      results: searchVal.results,
      trace: searchVal.trace,
      timestamp: Date.now()
    };
    this.cache.set(cacheKey, cacheEntry);

    // Paginate output
    const totalCount = searchVal.results.length;
    const pageResults = searchVal.results.slice(offset, offset + limit);
    const hasNextPage = offset + limit < totalCount;
    
    let nextCursor: string | undefined;
    if (hasNextPage) {
      nextCursor = this.cursorCodec.encode({
        purpose: "rubric_search",
        organizationId: context.organizationId || "default",
        accessFingerprint,
        queryHash,
        filterHash,
        corpusVersion: version,
        limit,
        position: offset + limit
      });
    }

    return {
      items: pageResults,
      hasNextPage,
      nextCursor,
      totalCount,
      sourceVersion: version
    };
  }

  async getParent(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord | null> {
    return this.hierarchyService.getParent(context, rubricId);
  }

  async getChildren(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord[]> {
    return this.hierarchyService.getChildren(context, rubricId);
  }

  async getAncestors(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord[]> {
    return this.hierarchyService.getAncestors(context, rubricId);
  }

  async getDescendants(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId,
    options?: { maxDepth?: number; maxItems?: number }
  ): Promise<RepertoryRubricRecord[]> {
    return this.hierarchyService.getDescendants(context, rubricId, options);
  }

  async buildBreadcrumb(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<{ id: RubricRecordId; label: string }[]> {
    return this.hierarchyService.buildBreadcrumb(context, rubricId);
  }

  private async getEditionRecord(context: RepertoryAccessContext, editionId: RepertoryEditionId): Promise<RepertoryEdition | null> {
    const sources = await this.repository.getSources(context);
    for (const src of sources) {
      const eds = await this.repository.getEditions(context, src.id);
      const match = eds.find(e => e.id === editionId);
      if (match) return match;
    }
    return null;
  }

  private getAccessFingerprint(context: RepertoryAccessContext, allowedEditionIds: string[]): string {
    const role = context.userRole || "clinician";
    const flags = context.activeFeatureFlags || [];
    return generateAccessFingerprint(context.organizationId || "default", allowedEditionIds, role, flags);
  }

  private canonicalizeQuery(query: string): string {
    return query.trim().toLowerCase().normalize("NFC").replace(/\s+/g, " ");
  }

  private canonicalizeFilters(filters: any): string {
    const keys = Object.keys(filters).sort();
    const sorted: any = {};
    for (const key of keys) {
      const val = filters[key];
      if (Array.isArray(val)) {
        sorted[key] = [...val].sort();
      } else {
        sorted[key] = val;
      }
    }
    return JSON.stringify(sorted);
  }

  private sha256Hash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }
}

import { PublishedCorpusRetrievalAdapter } from "../repositories/PublishedCorpusRetrievalAdapter";
import { RepertoryAccessPolicy } from "../access/RepertoryAccessPolicy";
import { HmacCursorCodec } from "../../../server/repertory/cursor/HmacCursorCodec";

let serviceInstance: KnowledgeAccessService | null = null;

export function getKnowledgeAccessService(): KnowledgeAccessService {
  if (!serviceInstance) {
    const repository = new PublishedCorpusRetrievalAdapter();
    const hierarchyService = new HierarchyService(repository);
    const accessPolicy = new RepertoryAccessPolicy();
    const synonymService = new SynonymService();
    const searchIndex = new RubricSearchIndex(synonymService);
    const cache = new SearchCache();
    const cursorCodec = new HmacCursorCodec();

    serviceInstance = new KnowledgeAccessService(
      repository,
      hierarchyService,
      accessPolicy,
      searchIndex,
      synonymService,
      cache,
      cursorCodec
    );
  }
  return serviceInstance;
}

