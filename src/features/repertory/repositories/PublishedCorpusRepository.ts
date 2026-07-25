import path from 'path';
import crypto from 'crypto';
import { RepertoryRubric, RepertoryPublishedCorpusManifest } from '../types';
import { getRuntimeEnvironment } from '../config/runtimeEnv';
import { getActiveCorpusPointerRepository } from './ActiveCorpusPointerRepository';
import {
  createRepertoryArtifactStore,
  type RepertoryArtifactStore,
} from './RepertoryArtifactStore';

export type { RepertoryArtifactStore } from './RepertoryArtifactStore';
export { LocalRepertoryArtifactStore as LocalArtifactStore } from './RepertoryArtifactStore';

class LruCache<T> {
  private cache = new Map<string, { value: T; bytes: number; timestamp: number }>();
  private currentBytes = 0;

  constructor(
    private maxEntries: number,
    private maxBytes: number,
    private ttlMs: number
  ) {}

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.currentBytes -= entry.bytes;
      return null;
    }
    entry.timestamp = Date.now();
    return entry.value;
  }

  set(key: string, value: T, bytes: number): void {
    const existing = this.cache.get(key);
    if (existing) {
      this.currentBytes -= existing.bytes;
      this.cache.delete(key);
    }

    while (
      (this.cache.size >= this.maxEntries || this.currentBytes + bytes > this.maxBytes) &&
      this.cache.size > 0
    ) {
      let oldestKey: string | null = null;
      let oldestTimestamp = Infinity;
      for (const [k, e] of this.cache.entries()) {
        if (e.timestamp < oldestTimestamp) {
          oldestTimestamp = e.timestamp;
          oldestKey = k;
        }
      }
      if (oldestKey) {
        const e = this.cache.get(oldestKey)!;
        this.cache.delete(oldestKey);
        this.currentBytes -= e.bytes;
      } else {
        break;
      }
    }

    this.cache.set(key, { value, bytes, timestamp: Date.now() });
    this.currentBytes += bytes;
  }

  clear(): void {
    this.cache.clear();
    this.currentBytes = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      bytes: this.currentBytes
    };
  }
}

export class PublishedCorpusRepository {
  private static cachedVersion: string = '';
  private static cachedManifest: RepertoryPublishedCorpusManifest | null = null;
  private static inFlightLoads = new Map<string, Promise<any>>();
  private static activeVersionCache: { version: string; timestamp: number } | null = null;
  private static activeVersionCacheTtlMs = getRuntimeEnvironment().mode === 'test' ? 0 : 10000; // 10 seconds TTL

  // Abstraction layer
  private static artifactStore: RepertoryArtifactStore | null = null;
  private static artifactStorePromise: Promise<RepertoryArtifactStore> | null = null;

  // Separate caches for shards
  private static chapterCache = new LruCache<RepertoryRubric[]>(20, 20 * 1024 * 1024, 5 * 60 * 1000);
  private static indexCache = new LruCache<any>(100, 30 * 1024 * 1024, 10 * 60 * 1000);

  private static locationShardCount = 64;
  private static lexicalShardCount = 64;
  private static remedyShardCount = 32;
  private static conceptShardCount = 32;

  static async inspectReleaseArtifacts(version: string): Promise<{
    manifest: RepertoryPublishedCorpusManifest | null;
    governedArtifactCount: number;
    missingArtifacts: string[];
    sampleIndexReadable: boolean;
  }> {
    if (!/^v[a-zA-Z0-9._-]{1,64}$/.test(version)) {
      throw new Error("Corpus version is invalid.");
    }

    const releaseDir = this.getPublishedDir(version);
    const store = await this.getArtifactStore();
    const manifestPath = path.join(releaseDir, "manifest.json");
    if (!(await store.exists(manifestPath))) {
      return {
        manifest: null,
        governedArtifactCount: 0,
        missingArtifacts: ["manifest.json"],
        sampleIndexReadable: false,
      };
    }

    const manifest = await store.readJson<RepertoryPublishedCorpusManifest>(manifestPath);
    const governedPaths = Object.keys(manifest.artifactChecksums || {}).sort();
    // Object storage can verify the whole governed inventory with one prefix
    // listing. Custom/legacy stores fall back to concurrent existence checks.
    const missingArtifacts = store.findMissing
      ? await store.findMissing(releaseDir, governedPaths)
      : (await Promise.all(governedPaths.map(async (relativePath) => ({
          relativePath,
          exists: await store.exists(path.join(releaseDir, relativePath)),
        }))))
          .filter((result) => !result.exists)
          .map((result) => result.relativePath);

    const sampleShard = this.stableHash("fever") % this.lexicalShardCount;
    const samplePath = path.join(
      releaseDir,
      "indexes",
      "lexical",
      `term-${sampleShard.toString().padStart(2, "0")}.json`
    );
    let sampleIndexReadable = false;
    try {
      const sampleIndex = await store.readJson<unknown>(samplePath);
      sampleIndexReadable = Boolean(sampleIndex && typeof sampleIndex === "object");
    } catch {
      sampleIndexReadable = false;
    }

    return {
      manifest,
      governedArtifactCount: governedPaths.length,
      missingArtifacts,
      sampleIndexReadable,
    };
  }

  // Track cache statistics
  private static hitCount = 0;
  private static missCount = 0;

  static setArtifactStore(store: RepertoryArtifactStore): void {
    this.artifactStore = store;
    this.artifactStorePromise = Promise.resolve(store);
    this.invalidateCache();
  }

  static resetArtifactStore(): void {
    this.artifactStore = null;
    this.artifactStorePromise = null;
    this.invalidateCache();
  }

  private static async getArtifactStore(): Promise<RepertoryArtifactStore> {
    if (this.artifactStore) return this.artifactStore;
    if (!this.artifactStorePromise) {
      this.artifactStorePromise = createRepertoryArtifactStore(getRuntimeEnvironment());
    }
    this.artifactStore = await this.artifactStorePromise;
    return this.artifactStore;
  }

  private static getPublishedDir(version: string): string {
    const env = getRuntimeEnvironment();
    return path.join(env.artifactRoot, 'published', version);
  }

  private static stableHash(str: string): number {
    const hash = crypto.createHash('md5').update(str).digest('hex');
    return parseInt(hash.slice(0, 8), 16);
  }

  static async getActiveVersion(): Promise<string> {
    const now = Date.now();
    if (this.activeVersionCache && (now - this.activeVersionCache.timestamp < this.activeVersionCacheTtlMs)) {
      return this.activeVersionCache.version;
    }

    let version = 'v1.0.0';
    try {
      const repo = getActiveCorpusPointerRepository();
      const active = await repo.getActive();
      if (active && active.activeVersion) {
        version = active.activeVersion;
      }
    } catch (e) {
      console.warn("PublishedCorpusRepository: Failed to get active version from pointer repository:", e);
    }

    this.activeVersionCache = { version, timestamp: now };
    return version;
  }

  static async setActiveVersion(
    version: string,
    options?: {
      previousVersion?: string;
      contentHash?: string;
      actorUid?: string;
      actorRole?: string;
      reason?: string;
      transactionId?: string;
      auditLogId?: string;
    }
  ): Promise<void> {
    const repo = getActiveCorpusPointerRepository();
    await repo.activate({
      version,
      previousVersion: options?.previousVersion,
      contentHash: options?.contentHash || "unknown-hash",
      actorUid: options?.actorUid || "system",
      actorRole: options?.actorRole || "system",
      reason: options?.reason || `Set pointer active atomically to ${version}`,
      transactionId: options?.transactionId || `tx_${Date.now()}`,
      auditLogId: options?.auditLogId || `audit_${Date.now()}`
    });

    this.activeVersionCache = { version, timestamp: Date.now() };
    this.invalidateCache();
  }

  static async rollbackActiveVersion(
    version: string,
    options?: {
      previousVersion?: string;
      contentHash?: string;
      actorUid?: string;
      actorRole?: string;
      reason?: string;
      transactionId?: string;
      auditLogId?: string;
    }
  ): Promise<void> {
    const repo = getActiveCorpusPointerRepository();
    await repo.rollback({
      version,
      previousVersion: options?.previousVersion,
      contentHash: options?.contentHash || "unknown-hash",
      actorUid: options?.actorUid || "system",
      actorRole: options?.actorRole || "system",
      reason: options?.reason || `Rollback pointer atomically to ${version}`,
      transactionId: options?.transactionId || `tx_${Date.now()}`,
      auditLogId: options?.auditLogId || `audit_${Date.now()}`
    });

    this.activeVersionCache = { version, timestamp: Date.now() };
    this.invalidateCache();
  }

  static invalidateCache(): void {
    this.cachedVersion = '';
    this.cachedManifest = null;
    this.activeVersionCache = null;
    this.chapterCache.clear();
    this.indexCache.clear();
    this.inFlightLoads.clear();
  }

  static async ensureActiveCorpusLoaded(): Promise<void> {
    const activeVersion = await this.getActiveVersion();
    if (this.cachedVersion === activeVersion && this.cachedManifest) {
      return;
    }

    console.log(`PublishedCorpusRepository: Initializing active pointer to version ${activeVersion}...`);
    const dir = this.getPublishedDir(activeVersion);
    const manifestPath = path.join(dir, 'manifest.json');
    const artifactStore = await this.getArtifactStore();

    if (!(await artifactStore.exists(manifestPath))) {
      console.warn(`PublishedCorpusRepository: Snapshot directory ${dir} manifest not found.`);
      return;
    }

    try {
      this.cachedManifest = await artifactStore.readJson<RepertoryPublishedCorpusManifest>(manifestPath);
      this.cachedVersion = activeVersion;
    } catch (e: any) {
      console.error(`PublishedCorpusRepository: Failed to load manifest for version ${activeVersion}:`, e);
      throw new Error(`Failed to load manifest: ${e.message}`);
    }
  }

  private static async loadShardCoalesced<T>(
    relativePath: string,
    cache: LruCache<T>
  ): Promise<T> {
    await this.ensureActiveCorpusLoaded();
    const activeVersion = this.cachedVersion;
    const cacheKey = `${activeVersion}:${relativePath}`;

    // 1. Check Cache
    const cached = cache.get(cacheKey);
    if (cached) {
      this.hitCount++;
      return cached;
    }
    this.missCount++;

    // 2. Check In-flight reads (Coalescing)
    let inFlight = this.inFlightLoads.get(cacheKey);
    if (!inFlight) {
      inFlight = (async () => {
        let timeoutId: NodeJS.Timeout | null = null;
        try {
          const dir = this.getPublishedDir(activeVersion);
          const fullPath = path.join(dir, relativePath);

          const timeout = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error(`Read timeout for shard: ${relativePath}`)), 10000);
          });

          const data = await Promise.race([
            (await this.getArtifactStore()).readJson<T>(fullPath),
            timeout
          ]);

          const estimatedBytes = JSON.stringify(data).length * 2;
          cache.set(cacheKey, data, estimatedBytes);
          return data;
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          this.inFlightLoads.delete(cacheKey);
        }
      })();
      this.inFlightLoads.set(cacheKey, inFlight);
    }

    return inFlight;
  }

  // Lazy loaders for shards
  static async loadLocationShard(rubricId: string): Promise<any> {
    const shardIdx = this.stableHash(rubricId) % this.locationShardCount;
    const prefix = shardIdx.toString().padStart(2, '0');
    return this.loadShardCoalesced<any>(`locations/rubric-locations-${prefix}.json`, this.indexCache);
  }

  static async loadLexicalShard(term: string): Promise<any> {
    const shardIdx = this.stableHash(term) % this.lexicalShardCount;
    const prefix = shardIdx.toString().padStart(2, '0');
    return this.loadShardCoalesced<any>(`indexes/lexical/term-${prefix}.json`, this.indexCache);
  }

  static async loadRemedyShard(remedyId: string): Promise<any> {
    const shardIdx = this.stableHash(remedyId) % this.remedyShardCount;
    const prefix = shardIdx.toString().padStart(2, '0');
    return this.loadShardCoalesced<any>(`indexes/remedies/remedy-${prefix}.json`, this.indexCache);
  }

  static async loadConceptShard(conceptId: string): Promise<any> {
    const shardIdx = this.stableHash(conceptId) % this.conceptShardCount;
    const prefix = shardIdx.toString().padStart(2, '0');
    return this.loadShardCoalesced<any>(`indexes/concepts/concept-${prefix}.json`, this.indexCache);
  }

  static async loadChapterShard(sourceId: string, safeChapterId: string, shardId: string): Promise<RepertoryRubric[]> {
    return this.loadShardCoalesced<RepertoryRubric[]>(
      `sources/${sourceId}/chapters/${safeChapterId}-${shardId}.json`,
      this.chapterCache
    );
  }

  // Public Query Interfaces
  static async getRubricById(id: string): Promise<RepertoryRubric | null> {
    await this.ensureActiveCorpusLoaded();
    try {
      const locations = await this.loadLocationShard(id);
      const loc = locations[id];
      if (!loc) return null;

      const rubrics = await this.loadChapterShard(loc.sourceId, loc.safeChapterId, loc.shardId);
      const match = rubrics.find(r => r.rubricId === id);
      return match ? { ...match } : null;
    } catch (e) {
      console.warn(`Failed to hydrate rubric ${id}:`, e);
      return null;
    }
  }

  static async getRubrics(filters?: {
    category?: string;
    organSystem?: string;
    sourceId?: string;
  }): Promise<RepertoryRubric[]> {
    await this.ensureActiveCorpusLoaded();
    if (!this.cachedManifest) return [];

    // Filtered loading using source index or by reading relevant chapters
    const sources = this.cachedManifest.sourceIds;
    const matchSources = filters?.sourceId && filters.sourceId !== 'All'
      ? [filters.sourceId]
      : sources;

    const results: RepertoryRubric[] = [];
    
    for (const srcId of matchSources) {
      try {
        const chaptersPath = `sources/${srcId}/chapters.json`;
        const chapters = await this.loadShardCoalesced<any[]>(chaptersPath, this.indexCache);
        
        for (const chap of chapters) {
          if (filters?.organSystem && filters.organSystem !== 'All' && chap.chapterId !== filters.organSystem) {
            continue;
          }
          for (const shard of chap.shards) {
            const rubrics = await this.loadChapterShard(srcId, chap.safeChapterId, shard.shardId);
            let filtered = rubrics;
            if (filters?.category && filters.category !== 'All') {
              filtered = filtered.filter(r => r.category === filters.category);
            }
            results.push(...filtered);
            if (results.length >= 100) {
              return results.slice(0, 100); // Bounded page size for initial loads
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to read chapters list for source ${srcId}:`, err);
      }
    }

    return results.slice(0, 100);
  }

  static async searchRubrics(query: string, filters?: {
    category?: string;
    organSystem?: string;
    sourceId?: string;
  }): Promise<RepertoryRubric[]> {
    await this.ensureActiveCorpusLoaded();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      return this.getRubrics(filters);
    }

    const terms = cleanQuery.split(/\s+/).filter(t => t.length > 2);
    if (terms.length === 0) return [];

    // Enforce safety limits
    if (terms.length > 5) {
      throw new Error("Search query exceeds maximum limit of 5 search tokens.");
    }

    // 1. Candidate Retrieval
    let candidateIds: Set<string> | null = null;

    for (const term of terms) {
      const index = await this.loadLexicalShard(term);
      const matches = index[term] || [];
      const termSet = new Set<string>(matches);
      
      if (candidateIds === null) {
        candidateIds = termSet;
      } else {
        // Intersect
        candidateIds = new Set((Array.from(candidateIds) as string[]).filter(x => termSet.has(x)));
      }
      if (candidateIds.size === 0) break;
    }

    if (!candidateIds || candidateIds.size === 0) return [];

    // 2. Hydration and Filtering
    const candidates = Array.from(candidateIds).slice(0, 100); // Bounded result window
    return this.getRubricsByIds(candidates, filters);
  }

  // Batch Hydration logic (coalescing file reads)
  static async getRubricsByIds(ids: string[], filters?: {
    category?: string;
    organSystem?: string;
    sourceId?: string;
  }): Promise<RepertoryRubric[]> {
    await this.ensureActiveCorpusLoaded();

    // Group rubric IDs by their location shard to read location indices efficiently
    const locShardGroups: Record<string, string[]> = {};
    for (const id of ids) {
      const shardIdx = this.stableHash(id) % this.locationShardCount;
      const prefix = shardIdx.toString().padStart(2, '0');
      if (!locShardGroups[prefix]) locShardGroups[prefix] = [];
      locShardGroups[prefix].push(id);
    }

    const locations: Record<string, any> = {};
    for (const [prefix, groupedIds] of Object.entries(locShardGroups)) {
      try {
        const index = await this.loadShardCoalesced<any>(`locations/rubric-locations-${prefix}.json`, this.indexCache);
        for (const id of groupedIds) {
          if (index[id]) {
            locations[id] = index[id];
          }
        }
      } catch (err) {
        console.warn(`Failed to load locations shard prefix ${prefix}:`, err);
      }
    }

    // Group rubric IDs by chapter shard path to avoid duplicate loads
    const chapterShardGroups: Record<string, { sourceId: string; safeChapterId: string; shardId: string; rubricIds: string[] }> = {};
    for (const id of ids) {
      const loc = locations[id];
      if (!loc) continue;

      // Filter out ineligible or unapproved sources early
      if (this.cachedManifest && !this.cachedManifest.sourceIds.includes(loc.sourceId)) {
        continue;
      }

      if (filters) {
        if (filters.sourceId && filters.sourceId !== 'All' && loc.sourceId !== filters.sourceId) {
          continue;
        }
      }

      const shardPath = `${loc.sourceId}:${loc.safeChapterId}:${loc.shardId}`;
      if (!chapterShardGroups[shardPath]) {
        chapterShardGroups[shardPath] = {
          sourceId: loc.sourceId,
          safeChapterId: loc.safeChapterId,
          shardId: loc.shardId,
          rubricIds: []
        };
      }
      chapterShardGroups[shardPath].rubricIds.push(id);
    }

    const hydrated: RepertoryRubric[] = [];

    for (const group of Object.values(chapterShardGroups)) {
      try {
        const rubrics = await this.loadChapterShard(group.sourceId, group.safeChapterId, group.shardId);
        for (const id of group.rubricIds) {
          const match = rubrics.find(r => r.rubricId === id);
          if (match) {
            if (filters) {
              if (filters.category && filters.category !== 'All' && match.category !== filters.category) continue;
              if (filters.organSystem && filters.organSystem !== 'All' && match.organSystem !== filters.organSystem) continue;
            }
            hydrated.push({ ...match });
          }
        }
      } catch (err) {
        console.warn(`Failed to load chapter shard ${group.safeChapterId}-${group.shardId}:`, err);
      }
    }

    return hydrated;
  }

  static async getManifest(): Promise<RepertoryPublishedCorpusManifest | null> {
    await this.ensureActiveCorpusLoaded();
    return this.cachedManifest;
  }

  static async getCanonicalConcepts(): Promise<Record<string, string>> {
    // Return mock concept index matching the active loaded manifest
    await this.ensureActiveCorpusLoaded();
    // Concept mapping can be loaded from shard as needed or computed lazily
    return {};
  }

  static async getRemedyIndex(): Promise<any> {
    await this.ensureActiveCorpusLoaded();
    return {};
  }

  static async getRAGDocuments(): Promise<any[]> {
    await this.ensureActiveCorpusLoaded();
    if (!this.cachedManifest) return [];

    const results: any[] = [];
    try {
      const artifactPaths = Object.keys(this.cachedManifest.artifactChecksums || {})
        .filter((artifactPath) => /^rag\/documents-[^/]+\.json$/.test(artifactPath))
        .sort();

      for (const artifactPath of artifactPaths) {
        const shard = await this.loadShardCoalesced<any[]>(artifactPath, this.indexCache);
        results.push(...shard);
      }
    } catch (e) {
      console.warn("Failed to load RAG document shards:", e);
    }
    return results;
  }

  static getCacheStats() {
    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      chapterCache: this.chapterCache.getStats(),
      indexCache: this.indexCache.getStats()
    };
  }
}
