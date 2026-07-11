import assert from "assert";
import { calculateRetrievalPriority } from "../src/features/knowledge/retrieval/evidenceScoringService";
import { ragService } from "../src/lib/ragService";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";

async function runPerformanceTests() {
  console.log("🚀 Running Evidence Performance tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => Promise<void> | void) {
    return (async () => {
      try {
        await fn();
        console.log(`✅ ${name}`);
        passed++;
      } catch (e: any) {
        console.error(`❌ ${name}`);
        console.error(e.stack || e);
        failed++;
      }
    })();
  }

  const profileFixture = {
    evidenceStrength: "high" as const,
    sourceQuality: "peer-reviewed" as const,
    clinicalConfidence: 90,
    editorialConfidence: 85,
    reviewIntervalDays: 365,
    reviewGracePeriodDays: 90,
    reviewExpiryPolicy: "ranking-penalty" as const,
    rationale: "Supported by RCTs.",
    classicalSource: true,
    modernSource: true,
    citationCompleteness: 100,
    assessedBy: "Dr. Narayan Jethwani",
    assessedAt: "2026-07-11T00:00:00.000Z"
  };

  await test("Performance: 1,000 scoring operations latency < 150ms", () => {
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      calculateRetrievalPriority({
        evidenceProfile: profileFixture,
        reviewState: "current",
        citationCount: 3,
        validCitationCount: 3
      });
    }
    const duration = Date.now() - start;
    console.log(`[*] 1,000 scoring operations took: ${duration}ms`);
    assert.ok(duration < 150, `Expected 1k calculations to be ultra-fast, took ${duration}ms`);
  });

  await test("Performance: 10,000 scoring operations latency < 1000ms", () => {
    const start = Date.now();
    for (let i = 0; i < 10000; i++) {
      calculateRetrievalPriority({
        evidenceProfile: profileFixture,
        reviewState: "current",
        citationCount: 3,
        validCitationCount: 3
      });
    }
    const duration = Date.now() - start;
    console.log(`[*] 10,000 scoring operations took: ${duration}ms`);
    assert.ok(duration < 1000, `Expected 10k calculations to take under 1s, took ${duration}ms`);
  });

  await test("Performance: Flag-off vs Flag-on RAG query latency", async () => {
    // Warm up search to load vectors
    await ragService.hybridSearch("Arnica", "public-search");

    // 1. Flag off latency
    featureFlags.knowledgeEvidenceScoringEnabled = false;
    const startOff = Date.now();
    await ragService.hybridSearch("Arnica", "public-search");
    const durationOff = Date.now() - startOff;

    // 2. Flag on latency
    featureFlags.knowledgeEvidenceScoringEnabled = true;
    const startOn = Date.now();
    await ragService.hybridSearch("Arnica", "public-search");
    const durationOn = Date.now() - startOn;

    console.log(`[*] Flag-off search latency: ${durationOff}ms | Flag-on search latency: ${durationOn}ms`);
    
    // Restore default
    featureFlags.knowledgeEvidenceScoringEnabled = false;

    // Latency must remain within reasonable bounds (e.g. priority scoring shouldn't introduce significant overhead)
    assert.ok(durationOn < 500, `Evidence blending must not exceed SLA (took ${durationOn}ms)`);
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runPerformanceTests().catch(e => {
  console.error(e);
  process.exit(1);
});
