import assert from "assert";
import { 
  getKnowledgeLinkForDisease,
  getKnowledgeLinkForRemedy,
  getKnowledgeLinkForLabTest,
  getKnowledgeLinkForSymptom,
  getKnowledgeLinkForComparison,
  getKnowledgeContextForDisease,
  getKnowledgeContextForRemedy,
  getKnowledgeContextForLabTest,
  getKnowledgeContextForSymptom,
  getKnowledgeContextForComparison,
  getClinicalOsKnowledgeBundle
} from "../src/features/knowledge/governance/clinicalOsIntegration";

function runIntegrationTests() {
  console.log("🚀 Starting V2.3.1 Clinical OS Integration Layer Unit Tests...");
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

  // 1. Linking resolution for valid entities & route pattern validation
  test("Clinical OS Integration - resolve link for valid remedy (Sulphur)", () => {
    const link = getKnowledgeLinkForRemedy("sulphur");
    assert.strictEqual(link.found, true);
    assert.ok(link.url.startsWith("/knowledge/remedies/"));
    assert.strictEqual(link.url, "/knowledge/remedies/sulphur");
    assert.strictEqual(link.title, "Sulphur (Sublimed Sulphur)");
  });

  test("Clinical OS Integration - resolve link for valid disease (GERD via slug)", () => {
    const link = getKnowledgeLinkForDisease("gastroesophageal-reflux-disease");
    assert.strictEqual(link.found, true);
    assert.ok(link.url.startsWith("/knowledge/diseases/"));
    assert.strictEqual(link.url, "/knowledge/diseases/gastroesophageal-reflux-disease");
  });

  test("Clinical OS Integration - resolve link for valid symptom (Acid Reflux)", () => {
    const link = getKnowledgeLinkForSymptom("acid-reflux");
    assert.strictEqual(link.found, true);
    assert.ok(link.url.startsWith("/knowledge/symptoms/"));
    assert.strictEqual(link.url, "/knowledge/symptoms/acid-reflux");
  });

  // 2. Safe Fallback URL resolution when entities are missing (No broken links)
  test("Clinical OS Integration - fallback for nonexistent disease id", () => {
    const link = getKnowledgeLinkForDisease("nonexistent-disease-xyz");
    assert.strictEqual(link.found, false);
    assert.strictEqual(link.url, "");
    assert.strictEqual(link.title, "Knowledge article pending");
  });

  test("Clinical OS Integration - fallback for nonexistent remedy id", () => {
    const link = getKnowledgeLinkForRemedy("nonexistent-remedy-xyz");
    assert.strictEqual(link.found, false);
    assert.strictEqual(link.url, "");
    assert.strictEqual(link.title, "Knowledge article pending");
  });

  test("Clinical OS Integration - fallback for nonexistent comparison/case-study id", () => {
    const link = getKnowledgeLinkForComparison("nonexistent-comparison-xyz");
    assert.strictEqual(link.found, false);
    assert.strictEqual(link.url, "");
    assert.strictEqual(link.title, "Knowledge article pending");
  });

  // 3. Structured context lookup bundle for valid entities
  test("Clinical OS Integration - context lookup for valid remedy (Sulphur)", () => {
    const context = getKnowledgeContextForRemedy("sulphur");
    assert.strictEqual(context.found, true);
    assert.strictEqual(context.slug, "sulphur");
    assert.strictEqual(context.editorialStatus, "published");
    assert.strictEqual(context.isCornerstone, false);
    assert.strictEqual(context.citationHealth, "Pending Review");
    assert.ok(context.disclaimer.includes("Clinical Education Reference"));
    assert.ok(context.tags.includes("Sulphur"));
  });

  test("Clinical OS Integration - context lookup for valid disease (GERD via slug)", () => {
    const context = getKnowledgeContextForDisease("gastroesophageal-reflux-disease");
    assert.strictEqual(context.found, true);
    assert.strictEqual(context.slug, "gastroesophageal-reflux-disease");
    assert.strictEqual(context.editorialStatus, "published");
    assert.ok(context.icdCode?.includes("K21"));
  });

  // 4. Safe fallback context for nonexistent entities
  test("Clinical OS Integration - fallback context lookup for nonexistent remedy", () => {
    const context = getKnowledgeContextForRemedy("mystery-remedy");
    assert.strictEqual(context.found, false);
    assert.strictEqual(context.slug, "mystery-remedy");
    assert.strictEqual(context.editorialStatus, "needs-review");
    assert.strictEqual(context.url, "");
  });

  // 5. Consolidated batch lookups (handles missing items safely)
  test("Clinical OS Integration - consolidated batch lookup bundle", () => {
    const bundle = getClinicalOsKnowledgeBundle({
      diseases: ["gastroesophageal-reflux-disease", "missing-disease"],
      remedies: ["sulphur"],
      symptoms: ["acid-reflux", "missing-symptom"]
    });

    // Check disease sub-bundle
    assert.ok(bundle.diseases["gastroesophageal-reflux-disease"]);
    assert.strictEqual(bundle.diseases["gastroesophageal-reflux-disease"].found, true);
    assert.ok(bundle.diseases["missing-disease"]);
    assert.strictEqual(bundle.diseases["missing-disease"].found, false);
    assert.strictEqual(bundle.diseases["missing-disease"].url, "");

    // Check remedy sub-bundle
    assert.ok(bundle.remedies["sulphur"]);
    assert.strictEqual(bundle.remedies["sulphur"].found, true);

    // Check symptom sub-bundle
    assert.ok(bundle.symptoms["acid-reflux"]);
    assert.strictEqual(bundle.symptoms["acid-reflux"].found, true);
    assert.ok(bundle.symptoms["missing-symptom"]);
    assert.strictEqual(bundle.symptoms["missing-symptom"].found, false);
  });

  // 6. Safety Audit Checks
  test("Clinical OS Integration - disclaimer has no treatment recommendations or potencies", () => {
    const context = getKnowledgeContextForRemedy("sulphur");
    assert.ok(context.disclaimer.includes("Clinical Education Reference"));
    assert.ok(!context.disclaimer.includes("30C"));
    assert.ok(!context.disclaimer.includes("200C"));
    assert.ok(!context.disclaimer.includes("potency"));
    assert.ok(!context.disclaimer.includes("dosage"));
  });

  console.log(`\n🎉 V2.3.1 Integration Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrationTests();
