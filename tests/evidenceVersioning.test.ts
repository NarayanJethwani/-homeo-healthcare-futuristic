import assert from "assert";
import { saveDraft, rollbackToVersion, getVersions, clearCmsMemoryStore } from "../src/features/knowledge-admin/cms/cmsManager";

async function runEvidenceVersioningTests() {
  console.log("🚀 Running Evidence Versioning and Rollback tests...");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (e: any) {
      console.error(`❌ ${name}`);
      console.error(e.stack || e);
      failed++;
    }
  }

  test("Creating a draft and updating it creates distinct snapshots, and rollback restores it", async () => {
    clearCmsMemoryStore();

    const articleId = "art-ver-test-1";

    const v1Draft = await saveDraft({
      articleId,
      title: "Title V1",
      evidenceProfile: {
        evidenceStrength: "low",
        sourceQuality: "primary",
        clinicalConfidence: 50,
        editorialConfidence: 50,
        reviewIntervalDays: 90,
        reviewGracePeriodDays: 10,
        reviewExpiryPolicy: "ranking-penalty",
        rationale: "V1 rationale",
        classicalSource: true,
        modernSource: false
      } as any
    }, "Dr. Narayan Jethwani");

    // Update to V2
    const v2Draft = await saveDraft({
      articleId,
      revision: v1Draft.revision,
      title: "Title V2",
      evidenceProfile: {
        evidenceStrength: "high",
        sourceQuality: "peer-reviewed",
        clinicalConfidence: 90,
        editorialConfidence: 90,
        reviewIntervalDays: 365,
        reviewGracePeriodDays: 30,
        reviewExpiryPolicy: "exclude-from-ai",
        rationale: "V2 rationale",
        classicalSource: true,
        modernSource: true
      } as any
    }, "Clinical Director");

    const versions = await getVersions(articleId);
    assert.strictEqual(versions.length, 2);

    const v1Snapshot = versions.find(v => v.version === 1);
    assert.ok(v1Snapshot);
    assert.strictEqual(v1Snapshot.snapshot.title, "Title V1");
    assert.strictEqual(v1Snapshot.snapshot.evidenceProfile?.evidenceStrength, "low");

    // Perform Rollback to V1
    const rolledBack = await rollbackToVersion(v1Snapshot.id, "Super Admin", true);
    assert.strictEqual(rolledBack.title, "Title V1");
    assert.strictEqual(rolledBack.evidenceProfile?.evidenceStrength, "low");
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceVersioningTests().catch(e => {
  console.error(e);
  process.exit(1);
});
