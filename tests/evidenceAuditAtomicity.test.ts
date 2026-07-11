import assert from "assert";
import { saveDraft, getDraft, clearCmsMemoryStore } from "../src/features/knowledge-admin/cms/cmsManager";
import { CmsArticleDraft } from "../src/features/knowledge-admin/cms/types";

async function runAuditAtomicityTests() {
  console.log("🚀 Running Evidence Audit Atomicity tests...");
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

  const baseDraft: CmsArticleDraft = {
    id: "draft-atom-1",
    articleId: "art-atom-1",
    title: "Arnica Pediatric Trauma",
    slug: "arnica-ped-trauma",
    entityType: "remedy",
    status: "draft",
    draftContent: "Arnica pediatric trauma notes",
    references: ["Hahnemann S. Organon. 6th ed."],
    reviewer: "Dr. Narayan Jethwani",
    reviewerRole: "MD(Hom)",
    clinicalReviewDate: "2026-07-11T00:00:00.000Z",
    nextReviewDate: "2027-07-11T00:00:00.000Z",
    createdAt: "2026-07-11T00:00:00.000Z",
    updatedAt: "2026-07-11T00:00:00.000Z",
    version: 1,
    revision: 1
  };

  await test("Audit Atomicity: Stale revision conflict throws 409-like Error", async () => {
    clearCmsMemoryStore();

    // 1. Save initial draft (Revision initialized to 1)
    const initialSaved = await saveDraft(baseDraft, "Dr. Narayan Jethwani");
    assert.strictEqual(initialSaved.revision, 1);

    // 2. Try to save again with obsolete revision 0
    const stalePayload = {
      ...initialSaved,
      title: "Arnica Pediatric Trauma Updated",
      revision: 0 // stale revision
    };

    await assert.rejects(async () => {
      await saveDraft(stalePayload, "Dr. Narayan Jethwani");
    }, /Stale state or transition conflict/);
  });

  await test("Audit Atomicity: Audit log failure blocks state updates (fail-closed)", async () => {
    clearCmsMemoryStore();

    // Save initial draft
    const initialSaved = await saveDraft(baseDraft, "Dr. Narayan Jethwani");

    // Force failure during next save by making actor throw or audit logging fail
    // We can simulate audit log error by passing an invalid actor role or name that triggers throws in cmsManager
    // In our implementation, a missing actorName/actorContext.userId will fail. Let's send an invalid actor object.
    const invalidActor = {
      userId: "", // empty user ID to trigger failure
      role: "super-admin" as any,
      capabilities: new Set()
    } as any;

    const updatedPayload = {
      ...initialSaved,
      title: "Tampered Title",
      evidenceProfile: {
        evidenceStrength: "high" as any,
        sourceQuality: "authoritative" as any,
        clinicalConfidence: 90,
        editorialConfidence: 90,
        classicalSource: true,
        modernSource: true
      }
    };

    await assert.rejects(async () => {
      await saveDraft(updatedPayload, invalidActor);
    });

    // Verify that the stored draft remains untouched in memory/state (the title is NOT updated)
    const current = await getDraft(baseDraft.articleId);
    assert.strictEqual(current?.title, baseDraft.title, "State must not persist partial updates when a transaction or audit failure occurs");
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runAuditAtomicityTests().catch(e => {
  console.error(e);
  process.exit(1);
});
