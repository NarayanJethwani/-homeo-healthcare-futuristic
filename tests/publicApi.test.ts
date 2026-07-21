import assert from "assert";
import { GET as getDiseases } from "../src/app/api/public/knowledge/diseases/route";
import { GET as getRemedies } from "../src/app/api/public/knowledge/remedies/route";
import { GET as getSymptoms } from "../src/app/api/public/knowledge/symptoms/route";
import { GET as getLabTests } from "../src/app/api/public/knowledge/lab-tests/route";
import { GET as getFaqs } from "../src/app/api/public/knowledge/faqs/route";
import {
  PUBLIC_KNOWLEDGE_ENTITY_KEYS,
  PUBLIC_LOCALIZED_STRING_KEYS,
  serializePublicKnowledgeEntity,
} from "../src/features/knowledge/public/publicKnowledgeEntityDTO";
import type { KnowledgeEntity } from "../src/features/knowledge/types";
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

  const expectedEntityKeys = [...PUBLIC_KNOWLEDGE_ENTITY_KEYS].sort();
  const expectedLocalizedKeys = [...PUBLIC_LOCALIZED_STRING_KEYS].sort();
  const forbiddenPublicKeys = [
    "content",
    "author",
    "reviewer",
    "versionInfo",
    "changeLog",
    "aiKnowledge",
    "aiReadiness",
    "knowledgeEmbedding",
    "editorialNotes",
    "currentDraftVersionId",
    "approvedVersionId",
    "publishedVersionId",
    "clinicalChangesSinceLastRevision",
  ];

  function assertPublicKnowledgeDTO(item: any): void {
    assert.deepStrictEqual(
      Object.keys(item).sort(),
      expectedEntityKeys,
      `Public DTO keys changed for ${item.id}`,
    );
    assert.deepStrictEqual(Object.keys(item.title).sort(), expectedLocalizedKeys);
    assert.deepStrictEqual(Object.keys(item.summary).sort(), expectedLocalizedKeys);
    assert.strictEqual(item.editorialStatus, "published");
    forbiddenPublicKeys.forEach((key) => {
      assert.ok(!(key in item), `Private field ${key} leaked for ${item.id}`);
    });
  }

  // --- Tests ---

  const publicRoutes = [
    ["diseases", getDiseases],
    ["remedies", getRemedies],
    ["symptoms", getSymptoms],
    ["lab-tests", getLabTests],
    ["faqs", getFaqs],
  ] as const;

  for (const [name, handler] of publicRoutes) {
    await test(`GET /api/public/knowledge/${name} - returns the exact public DTO`, async () => {
      const list = await getResponseJson(await handler());
      assert.ok(Array.isArray(list), "Response must be an array");
      assert.ok(list.length > 0, `Should have at least one ${name} record`);
      list.forEach(assertPublicKnowledgeDTO);
    });
  }

  await test("public serializer strips future private fields and copies nested values", () => {
    const sentinel = "PRIVATE_SENTINEL_MUST_NOT_LEAK";
    const entity = {
      id: "D-TEST",
      slug: "test-disease",
      entityType: "disease",
      editorialStatus: "published",
      versionInfo: {
        version: "1.0.0",
        created: "2026-01-01T00:00:00Z",
        updated: "2026-01-01T00:00:00Z",
        reviewed: "2026-01-01T00:00:00Z",
      },
      title: { en: "Test", hi: "", gu: "", mr: "", es: "", ar: "" },
      summary: { en: "Summary", hi: "", gu: "", mr: "", es: "", ar: "" },
      content: { privateValue: sentinel },
      author: { name: sentinel },
      reviewer: { name: sentinel },
      evidenceLevel: "Level-A",
      tags: ["test"],
      canonicalUrl: "https://homeo.healthcare/knowledge/diseases/test-disease",
      readingTimeMinutes: 1,
      audience: "patient",
      license: "Test license",
      editorialNotes: sentinel,
      futureInternalField: sentinel,
    } as KnowledgeEntity & { futureInternalField: string };

    const serialized = serializePublicKnowledgeEntity(entity);
    assert.ok(serialized);
    assertPublicKnowledgeDTO(serialized);
    assert.ok(!JSON.stringify(serialized).includes(sentinel));
    assert.notStrictEqual(serialized.title, entity.title);
    assert.notStrictEqual(serialized.summary, entity.summary);
    assert.notStrictEqual(serialized.tags, entity.tags);
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
