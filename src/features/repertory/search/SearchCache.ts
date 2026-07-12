import crypto from "crypto";
import { RubricSearchResult, SearchTrace } from "./RubricSearchIndex";
import { RepertoryEditionId } from "../types/repertoryTypes";

export interface CacheEntry {
  results: RubricSearchResult[];
  trace: SearchTrace;
  timestamp: number;
}

export interface CacheFingerprint {
  organizationId: string;
  allowedEditions: RepertoryEditionId[];
  activeFeatureFlags: string[];
  corpusVersion: string;
  indexVersion: string;
  synonymVersion: string;
  query: string;
  filters: any;
  cursor?: string;
  limit: number;
}

export class SearchCache {
  private cache = new Map<string, { value: CacheEntry; size: number }>();
  private currentSize = 0;
  private hitCount = 0;
  private missCount = 0;

  constructor(
    private maxEntries: number = 100,
    private ttlMs: number = 5 * 60 * 1000 // 5 minutes default
  ) {}

  generateFingerprintKey(fingerprint: CacheFingerprint): string {
    // Sort edition IDs and feature flags to make the string stable
    const sortedEditions = [...fingerprint.allowedEditions].sort();
    const sortedFlags = [...fingerprint.activeFeatureFlags].sort();

    const rawKey = JSON.stringify({
      org: fingerprint.organizationId,
      editions: sortedEditions,
      flags: sortedFlags,
      corpus: fingerprint.corpusVersion,
      idx: fingerprint.indexVersion,
      syn: fingerprint.synonymVersion,
      q: fingerprint.query.trim().toLowerCase(),
      f: fingerprint.filters,
      cursor: fingerprint.cursor,
      limit: fingerprint.limit
    });

    // Return a secure stable SHA-256 hash of the fingerprint key to prevent raw leakage
    return crypto.createHash("sha256").update(rawKey).digest("hex");
  }

  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.missCount++;
      return null;
    }

    // TTL check
    if (Date.now() - entry.value.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.currentSize--;
      this.missCount++;
      return null;
    }

    this.hitCount++;
    // Keep-alive/LRU behavior: delete and re-insert
    const value = entry.value;
    this.cache.delete(key);
    this.cache.set(key, entry);

    return value;
  }

  set(key: string, value: CacheEntry): void {
    const estimatedSize = value.results.length;

    // Evict oldest entries if we exceed limits
    while (this.cache.size >= this.maxEntries && this.cache.size > 0) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { value, size: estimatedSize });
  }

  invalidateEditions(editionIds: RepertoryEditionId[]): void {
    // If a source or edition changes, invalidate all entries containing that edition
    const keysToDelete: string[] = [];
    for (const [key, entry] of this.cache.entries()) {
      const traceEditions = entry.value.trace.editionIds;
      const overlaps = traceEditions.some(id => editionIds.includes(id));
      if (overlaps) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(k => this.cache.delete(k));
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.hitCount = 0;
    this.missCount = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.hitCount + this.missCount > 0 ? this.hitCount / (this.hitCount + this.missCount) : 0
    };
  }
}
