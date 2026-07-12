import assert from "assert";
import { PublishedCorpusRetrievalAdapter } from "../../src/features/repertory/repositories/PublishedCorpusRetrievalAdapter";
import { RepertoryAccessContext, RepertoryEditionId, RepertoryChapterId, RubricRecordId } from "../../src/features/repertory/types/repertoryTypes";

export async function runRepositoryTests() {
  console.log("▶ Running Repertory Repository Tests...");
  const adapter = new PublishedCorpusRetrievalAdapter();

  const ctx: RepertoryAccessContext = {
    userId: "test-user",
    userRole: "super-admin",
    organizationEntitlements: [],
    activeFeatureFlags: []
  };

  // Test getSources
  const sources = await adapter.getSources(ctx);
  assert.ok(sources.length > 0, "Should load sources");
  assert.ok(sources.some(s => s.id === "kent"), "Should contain kent source");

  // Test getEditions
  const editions = await adapter.getEditions(ctx, "kent" as any);
  assert.ok(editions.length > 0, "Should load editions for kent");
  assert.strictEqual(editions[0].id, "kent_1908");

  // Test getChapters
  const chapters = await adapter.getChapters(ctx, "kent_1908" as RepertoryEditionId);
  assert.ok(chapters.length > 0, "Should load chapters for kent_1908");

  // Test getRubricsByChapter
  const ch = chapters[0];
  const rubricsResult = await adapter.getRubricsByChapter(ctx, "kent_1908" as RepertoryEditionId, ch.id, { limit: 10 });
  assert.ok(rubricsResult.items.length > 0, "Should load rubrics in chapter");

  // Test getRubricById
  const firstRubric = rubricsResult.items[0];
  const fetched = await adapter.getRubricById(ctx, firstRubric.id);
  assert.ok(fetched, "Should load rubric by ID");
  assert.strictEqual(fetched.displayText, firstRubric.displayText);

  console.log("✅ Repertory Repository Tests Passed");
}
