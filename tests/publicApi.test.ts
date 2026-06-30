import assert from "assert";
import { GET as getDiseases } from "../src/app/api/public/knowledge/diseases/route";
import { GET as getRemedies } from "../src/app/api/public/knowledge/remedies/route";
import { GET as getSymptoms } from "../src/app/api/public/knowledge/symptoms/route";
import { GET as getLabTests } from "../src/app/api/public/knowledge/lab-tests/route";
import { GET as getFaqs } from "../src/app/api/public/knowledge/faqs/route";
import { searchKnowledgeBase } from "../src/features/knowledge/search/knowledgeIndex";

async function runPublicApiTests() {
  console.log("🚀 Starting Public API and Search Boundary Tests...");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  // Helper to extract JSON from Next.js NextResponse
  async function getResponseJson(response: any): Promise<any> {
    return await response.json();
  }

  // --- Tests ---

  await test("GET /api/public/knowledge/diseases - exposes only published records", async () => {
    const res = await getDiseases();
    const list = await getResponseJson(res);
    
    assert.ok(Array.isArray(list), "Response must be an array");
    assert.ok(list.length > 0, "Should have at least one disease");
    
    list.forEach((item: any) => {
      assert.strictEqual(item.editorialStatus, "published", `Entity ${item.id} is not published`);
      assert.ok(!item.editorialNotes, `Private notes leaked in public disease API: ${item.id}`);
    });
  });

  await test("GET /api/public/knowledge/remedies - exposes only published records", async () => {
    const res = await getRemedies();
    const list = await getResponseJson(res);
    
    assert.ok(Array.isArray(list));
    list.forEach((item: any) => {
      assert.strictEqual(item.editorialStatus, "published");
      assert.ok(!item.editorialNotes);
    });
  });

  await test("GET /api/public/knowledge/symptoms - exposes only published records", async () => {
    const res = await getSymptoms();
    const list = await getResponseJson(res);
    
    assert.ok(Array.isArray(list));
    list.forEach((item: any) => {
      assert.strictEqual(item.editorialStatus, "published");
      assert.ok(!item.editorialNotes);
    });
  });

  await test("GET /api/public/knowledge/lab-tests - exposes only published records", async () => {
    const res = await getLabTests();
    const list = await getResponseJson(res);
    
    assert.ok(Array.isArray(list));
    list.forEach((item: any) => {
      assert.strictEqual(item.editorialStatus, "published");
      assert.ok(!item.editorialNotes);
    });
  });

  await test("GET /api/public/knowledge/faqs - exposes only published records", async () => {
    const res = await getFaqs();
    const list = await getResponseJson(res);
    
    assert.ok(Array.isArray(list));
    list.forEach((item: any) => {
      assert.strictEqual(item.editorialStatus, "published");
      assert.ok(!item.editorialNotes);
    });
  });

  await test("searchKnowledgeBase - public search filters out non-published items", () => {
    // 1. Search empty query which returns all matchable items
    const results = searchKnowledgeBase("");
    assert.ok(results.length > 0);
    
    results.forEach(res => {
      assert.strictEqual(res.entity.editorialStatus, "published", `Search result ${res.entity.id} is not published`);
      assert.ok(!(res.entity as any).editorialNotes, `Search result leaks editorialNotes on ${res.entity.id}`);
    });

    // 2. Search keyword query
    const gerdResults = searchKnowledgeBase("GERD");
    gerdResults.forEach(res => {
      assert.strictEqual(res.entity.editorialStatus, "published");
      assert.ok(!(res.entity as any).editorialNotes);
    });
  });

  console.log(`\n=== Public API Boundary Suite Summary: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPublicApiTests().catch(err => {
  console.error(err);
  process.exit(1);
});
