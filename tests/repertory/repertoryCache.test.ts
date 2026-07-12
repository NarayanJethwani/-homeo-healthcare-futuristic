import assert from "assert";
import { SearchCache, CacheFingerprint } from "../../src/features/repertory/search/SearchCache";
import { RubricSearchResult } from "../../src/features/repertory/search/RubricSearchIndex";
import { RepertoryEditionId, RepertorySourceId, RepertoryChapterId, RubricRecordId, RubricConceptId } from "../../src/features/repertory/types/repertoryTypes";

export function runCacheTests() {
  console.log("▶ Running Repertory Search Cache Tests...");
  const cache = new SearchCache(10, 5000); // entries max = 10, ttl = 5s

  const fingerprint = (query: string, editions: string[], org: string): CacheFingerprint => ({
    organizationId: org,
    allowedEditions: editions.map(id => id as RepertoryEditionId),
    activeFeatureFlags: [],
    corpusVersion: "v1.0.0",
    indexVersion: "1.0.0-index",
    synonymVersion: "1.0.0-synonyms",
    query,
    filters: {},
    limit: 10
  });

  const key1 = cache.generateFingerprintKey(fingerprint("pain", ["kent_1908"], "org1"));
  const key2 = cache.generateFingerprintKey(fingerprint("pain", ["kent_1908"], "org2")); // different org

  assert.notStrictEqual(key1, key2, "Cache key must be isolated by organization ID fingerprint");

  const mockResult: RubricSearchResult = {
    rubric: {
      id: "r1" as RubricRecordId,
      conceptId: "c1" as RubricConceptId,
      sourceId: "kent" as RepertorySourceId,
      editionId: "kent_1908" as RepertoryEditionId,
      chapterId: "Stomach" as RepertoryChapterId,
      hierarchyPath: [],
      displayText: "Pain in stomach",
      depth: 1,
      hasChildren: false,
      sourceVersion: "v1.0.0"
    },
    relevanceScore: 1.0,
    highlightedFields: {},
    traceId: "t1"
  };

  const cacheEntry = {
    results: [mockResult],
    trace: {
      traceId: "t1",
      query: "pain",
      normalizedQuery: "pain",
      expandedTerms: ["pain"],
      sourceIds: ["kent" as RepertorySourceId],
      editionIds: ["kent_1908" as RepertoryEditionId],
      filters: {},
      executedAt: new Date().toISOString(),
      searchIndexVersion: "1.0.0-index",
      synonymRegistryVersion: "1.0.0-synonyms",
      corpusVersions: { active: "v1.0.0" },
      durationMs: 5,
      cacheStatus: "miss" as const
    },
    timestamp: Date.now()
  };

  cache.set(key1, cacheEntry);

  // Test hit
  const hit = cache.get(key1);
  assert.ok(hit, "Should get cache hit");
  assert.strictEqual(hit.results[0].rubric.displayText, "Pain in stomach");

  // Test miss on key2
  const miss = cache.get(key2);
  assert.strictEqual(miss, null, "Should register cache miss for different tenant");

  // Test invalidation
  cache.invalidateEditions(["kent_1908" as RepertoryEditionId]);
  const hitAfterInvalidate = cache.get(key1);
  assert.strictEqual(hitAfterInvalidate, null, "Cache must invalidate entries matching invalidated edition ID");

  console.log("✅ Repertory Search Cache Tests Passed");
}
