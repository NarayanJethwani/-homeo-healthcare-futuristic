import assert from "assert";
import { saveDraft, clearCmsMemoryStore } from "../src/features/knowledge-admin/cms/cmsManager";
import { AuthenticatedKnowledgeActor } from "../src/features/knowledge-admin/cms/types";

async function runEvidencePermissionsTests() {
  console.log("🚀 Running Evidence Field-Level Permissions tests...");
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

  test("Only knowledge.editEvidence capability allows editing basic evidence settings", async () => {
    clearCmsMemoryStore();
    const draftData = {
      articleId: "art-perm-test-1",
      title: "Chamomilla for Pediatric Colic",
      evidenceProfile: {
        evidenceStrength: "moderate",
        sourceQuality: "primary",
        clinicalConfidence: 70,
        editorialConfidence: 70,
        reviewIntervalDays: 365,
        reviewGracePeriodDays: 90,
        reviewExpiryPolicy: "ranking-penalty",
        rationale: "Chamomilla records",
        classicalSource: true,
        modernSource: false
      } as any
    };

    // 1. Fail without editEvidence capability
    const badActor: AuthenticatedKnowledgeActor = {
      userId: "bad-user",
      role: "clinical-reviewer",
      capabilities: new Set([])
    };

    await assert.rejects(
      saveDraft(draftData, badActor),
      /Unauthorized: Role does not have permission to edit evidence profile/
    );

    // 2. Fail if editing clinical fields without assessClinicalEvidence
    const editEvidenceOnlyActor: AuthenticatedKnowledgeActor = {
      userId: "edit-only",
      role: "editor",
      capabilities: new Set(["knowledge.editEvidence"])
    };

    await assert.rejects(
      saveDraft(draftData, editEvidenceOnlyActor),
      /Unauthorized: Role does not have permission to assess clinical evidence/
    );

    // 3. Succeed if actor has full capabilities
    const fullActor: AuthenticatedKnowledgeActor = {
      userId: "full-user",
      role: "super-admin",
      capabilities: new Set([
        "knowledge.editEvidence",
        "knowledge.assessClinicalEvidence",
        "knowledge.assessEditorialConfidence",
        "knowledge.configureReviewPolicy"
      ])
    };

    const saved = await saveDraft(draftData, fullActor);
    assert.ok(saved.evidenceProfile);
    assert.strictEqual(saved.evidenceProfile.evidenceStrength, "moderate");
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidencePermissionsTests().catch(e => {
  console.error(e);
  process.exit(1);
});
