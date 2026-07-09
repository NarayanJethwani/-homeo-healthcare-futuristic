import assert from "assert";
import { calculateEditorialPriority } from "../src/features/knowledge-admin/services/editorialPriorityService";

function runTests() {
  console.log("🚀 Starting Editorial Priority Service Test Suite...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  // 1. Clinical safety warnings outrank SEO
  test("Clinical safety warning raises priority to Critical immediately", () => {
    const result = calculateEditorialPriority({
      isCornerstone: false,
      citationHealth: "Verified",
      editorialStatus: "published",
      clinicalOsViews: 10,
      searchImpressions: 100,
      searchCtr: 0.05,
      hasClinicalSafetyContraindications: true
    });
    assert.strictEqual(result.category, "Critical");
    assert.strictEqual(result.score, 100);
    assert.ok(result.reason.toLowerCase().includes("clinical safety"));
  });

  // 2. Cornerstone + poor/warning citation health -> CRITICAL
  test("Cornerstone article with poor citation health raises priority to Critical", () => {
    const result = calculateEditorialPriority({
      isCornerstone: true,
      citationHealth: "warning",
      editorialStatus: "published",
      clinicalOsViews: 200,
      searchImpressions: 1000,
      searchCtr: 0.02,
      hasClinicalSafetyContraindications: false
    });
    assert.strictEqual(result.category, "Critical");
    assert.strictEqual(result.score, 95);
    assert.ok(result.reason.toLowerCase().includes("cornerstone"));
  });

  // 3. Needs review + high Clinical OS views -> HIGH
  test("High Clinical OS usage with unreviewed/draft status raises priority to High", () => {
    const result = calculateEditorialPriority({
      isCornerstone: false,
      citationHealth: "Verified",
      editorialStatus: "needs-review",
      clinicalOsViews: 1200,
      searchImpressions: 500,
      searchCtr: 0.02,
      hasClinicalSafetyContraindications: false
    });
    assert.strictEqual(result.category, "High");
    assert.strictEqual(result.score, 85);
    assert.ok(result.reason.toLowerCase().includes("high clinical os"));
  });

  // 4. Citation warning (non-cornerstone) -> MEDIUM
  test("Weak citation health raises priority to Medium", () => {
    const result = calculateEditorialPriority({
      isCornerstone: false,
      citationHealth: "Needs Citations",
      editorialStatus: "published",
      clinicalOsViews: 50,
      searchImpressions: 100,
      searchCtr: 0.02,
      hasClinicalSafetyContraindications: false
    });
    assert.strictEqual(result.category, "Medium");
    assert.strictEqual(result.score, 65);
    assert.ok(result.reason.toLowerCase().includes("reference update"));
  });

  // 5. High search impressions + low CTR -> MEDIUM (SEO suggestion)
  test("High impressions with poor CTR raises priority to Medium", () => {
    const result = calculateEditorialPriority({
      isCornerstone: false,
      citationHealth: "Verified",
      editorialStatus: "published",
      clinicalOsViews: 50,
      searchImpressions: 6000,
      searchCtr: 0.01,
      hasClinicalSafetyContraindications: false
    });
    assert.strictEqual(result.category, "Medium");
    assert.strictEqual(result.score, 55);
    assert.ok(result.reason.toLowerCase().includes("seo"));
  });

  // 6. Healthy article -> LOW
  test("Healthy published article with normal views has Low priority", () => {
    const result = calculateEditorialPriority({
      isCornerstone: false,
      citationHealth: "Verified",
      editorialStatus: "published",
      clinicalOsViews: 150,
      searchImpressions: 200,
      searchCtr: 0.04,
      hasClinicalSafetyContraindications: false
    });
    assert.strictEqual(result.category, "Low");
    assert.strictEqual(result.score, 25);
  });

  console.log(`\n🎉 Editorial Priority Service Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
