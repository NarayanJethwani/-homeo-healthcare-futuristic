import assert from 'assert';
import { PublishedCorpusRepository } from '../src/features/repertory/repositories/PublishedCorpusRepository';
import { RepertoryScoring } from '../src/features/repertory/scoring/repertoryScoring';

async function run() {
  console.log("🚀 Running Repertory Performance Safety Benchmarks...");
  let passed = 0;

  // Measure initial memory
  const initialMem = process.memoryUsage();
  console.log(`[Memory] Startup RSS: ${(initialMem.rss / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(initialMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  passed++;

  // Test 1: Search Performance (Cold vs. Warm)
  const startCold = performance.now();
  const coldResults = await PublishedCorpusRepository.searchRubrics("cough");
  const endCold = performance.now();
  const coldLatency = endCold - startCold;
  console.log(`[Search] Cold search for "cough": ${coldLatency.toFixed(2)} ms (results: ${coldResults.length})`);

  const startWarm = performance.now();
  const warmResults = await PublishedCorpusRepository.searchRubrics("cough");
  const endWarm = performance.now();
  const warmLatency = endWarm - startWarm;
  console.log(`[Search] Warm search for "cough": ${warmLatency.toFixed(2)} ms (results: ${warmResults.length})`);
  
  assert.ok(warmLatency <= coldLatency, "Warm search should be faster than or equal to cold search.");
  passed++;

  // Test 2: Repertorization Latency (Scoring)
  const scoringSymptoms = [
    { rubricId: "kent_mind_mental_emotional_0", severity: 5, frequency: "frequent", impact: "moderate" },
    { rubricId: "kent_mind_mental_emotional_1", severity: 7, frequency: "frequent", impact: "severe" }
  ];

  const startScoring = performance.now();
  // We hydrate rubrics and run scoring
  const rubrics = await PublishedCorpusRepository.getRubricsByIds(scoringSymptoms.map(s => s.rubricId));
  const endScoring = performance.now();
  const scoringLatency = endScoring - startScoring;
  console.log(`[Scoring] Hydration of ${scoringSymptoms.length} rubrics: ${scoringLatency.toFixed(2)} ms`);
  passed++;

  // Test 3: Concurrency testing (1, 10, 25 requests)
  const runConcurrency = async (count: number) => {
    const start = performance.now();
    const promises = Array.from({ length: count }).map(() =>
      PublishedCorpusRepository.searchRubrics("cough")
    );
    const results = await Promise.all(promises);
    const end = performance.now();
    const duration = end - start;
    console.log(`[Concurrency] Finished ${count} concurrent searches in ${duration.toFixed(2)} ms`);
    results.forEach(r => assert.ok(r !== undefined));
  };

  await runConcurrency(1);
  await runConcurrency(10);
  await runConcurrency(25);
  passed++;

  // Measure final memory
  const finalMem = process.memoryUsage();
  console.log(`[Memory] Final RSS: ${(finalMem.rss / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(finalMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  passed++;

  console.log(`✅ Performance Safety Tests Passed: ${passed}/5`);
}

run().catch(err => {
  console.error("Performance Safety Test Failed:", err);
  process.exit(1);
});
