import assert from "assert";
import { HierarchyService } from "../../src/features/repertory/hierarchy/HierarchyService";
import { PublishedCorpusRetrievalAdapter } from "../../src/features/repertory/repositories/PublishedCorpusRetrievalAdapter";
import { RepertoryAccessContext, RepertoryEditionId, RepertoryChapterId, RubricRecordId } from "../../src/features/repertory/types/repertoryTypes";

export async function runHierarchyTests() {
  console.log("▶ Running Repertory Hierarchy Tests...");
  const repository = new PublishedCorpusRetrievalAdapter();
  const service = new HierarchyService(repository);

  const ctx: RepertoryAccessContext = {
    userId: "test-user",
    userRole: "super-admin",
    organizationEntitlements: [],
    activeFeatureFlags: []
  };

  const sources = await repository.getSources(ctx);
  const editionId = "kent_1908" as RepertoryEditionId;
  const chapters = await repository.getChapters(ctx, editionId);
  const ch = chapters[0];

  // Test validateCorpus on the active chapter
  const report = await service.validateCorpus(ctx, editionId, ch.id);
  assert.strictEqual(report.valid, true, "Active chapter must have valid hierarchy paths");

  // Get all rubrics to find parent/child relationships
  const result = await repository.getRubricsByChapter(ctx, editionId, ch.id, { limit: 100 });
  const items = result.items;

  const child = items.find(r => r.parentRecordId);
  if (child) {
    const parent = await service.getParent(ctx, child.id);
    assert.ok(parent, "Child rubric should resolve parent");
    assert.strictEqual(parent.id, child.parentRecordId);

    const childrenOfParent = await service.getChildren(ctx, parent.id as RubricRecordId);
    assert.ok(childrenOfParent.length > 0, "Parent should have children");
    assert.ok(childrenOfParent.some(c => c.id === child.id), "Children list should contain the child");

    const ancestors = await service.getAncestors(ctx, child.id);
    assert.ok(ancestors.length > 0, "Child should have ancestors");
    assert.strictEqual(ancestors[ancestors.length - 1].id, parent.id);

    const breadcrumbs = await service.buildBreadcrumb(ctx, child.id);
    assert.ok(breadcrumbs.length > 0);
    assert.strictEqual(breadcrumbs[breadcrumbs.length - 1].id, child.id);
  }

  console.log("✅ Repertory Hierarchy Tests Passed");
}
