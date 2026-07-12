import assert from "assert";
import { PublishedCorpusRetrievalAdapter } from "../../src/features/repertory/repositories/PublishedCorpusRetrievalAdapter";
import { RubricSearchIndex } from "../../src/features/repertory/search/RubricSearchIndex";
import { SynonymService } from "../../src/features/repertory/search/SynonymService";
import { RepertoryAccessContext, RepertoryEditionId } from "../../src/features/repertory/types/repertoryTypes";

export async function runPerformanceTests() {
  console.log("▶ Running Repertory Performance Tests...");
  const repository = new PublishedCorpusRetrievalAdapter();
  const synonymService = new SynonymService();
  const searchIndex = new RubricSearchIndex(synonymService);

  const ctx: RepertoryAccessContext = {
    userId: "test-user",
    userRole: "super-admin",
    organizationEntitlements: [],
    activeFeatureFlags: []
  };

  const editionId = "kent_1908" as RepertoryEditionId;
  const chapters = await repository.getChapters(ctx, editionId);
  const ch = chapters[0];

  // Load all rubrics for this chapter
  const startTimeLoad = Date.now();
  const rubricsResult = await repository.getRubricsByChapter(ctx, editionId, ch.id, { limit: 100000 });
  const loadTime = Date.now() - startTimeLoad;
  console.log(`- Loaded ${rubricsResult.items.length} rubrics from chapter in ${loadTime} ms`);

  // Run 10 search repetitions to benchmark performance
  const runs = 10;
  const latencies: number[] = [];

  for (let i = 0; i < runs; i++) {
    const start = Date.now();
    const searchVal = searchIndex.search("pain", rubricsResult.items, {}, "v1.0.0");
    latencies.push(Date.now() - start);
  }

  latencies.sort((a, b) => a - b);
  const median = latencies[Math.floor(runs / 2)];
  const p95 = latencies[Math.floor(runs * 0.95) - 1] || latencies[runs - 1];
  const max = latencies[runs - 1];

  console.log(`- Search Latency (10 runs):`);
  console.log(`  Median: ${median} ms`);
  console.log(`  p95:    ${p95} ms`);
  console.log(`  Max:    ${max} ms`);

  assert.ok(median < 200, "Search latency should be well under 200ms for single-chapter scopes");

  console.log("✅ Repertory Performance Benchmark Passed");
}
