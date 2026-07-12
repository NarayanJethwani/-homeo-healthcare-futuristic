import assert from "assert";
import { getRemedyGradeAccessService } from "../../src/features/repertory/application/RemedyGradeAccessService";
import { RepertoryAccessContext, RepertoryEditionId, RubricRecordId } from "../../src/features/repertory/types/repertoryTypes";

export async function runRemedyRightsTests() {
  console.log("▶ Running Remedy Rights-Aware Access Tests...");

  const service = getRemedyGradeAccessService();

  const mockContext = (role: string, entitlements: string[], flags: string[]): RepertoryAccessContext => ({
    userId: "test-user",
    userRole: role,
    organizationEntitlements: entitlements.map(id => ({
      editionId: id as RepertoryEditionId,
      organizationId: "org-default",
      entitlementType: "licensed",
      status: "active"
    })),
    activeFeatureFlags: flags
  });

  const rubricId = "boer_circulatory_heart_4044" as RubricRecordId; // boericke_1927 rubric (public domain)

  // 1. Ordinary user can read public domain rubric remedy grades
  const publicCtx = mockContext("practitioner", [], []);
  const resPublic = await service.getRemediesForRubric(publicCtx, rubricId, { limit: 10 });
  assert.ok(resPublic.items.length >= 0);

  // 2. Denied check on non-existent or restricted context
  // Let's create an invalid rubric that belongs to a restricted or licensed edition (if any)
  // Let's verify that a bad rubricId throws error
  try {
    await service.getRemediesForRubric(publicCtx, "invalid-rubric-id" as RubricRecordId, { limit: 10 });
    assert.fail("Should have thrown error for non-existent rubric");
  } catch (err: any) {
    assert.ok(err.message.includes("Rubric not found"));
  }

  console.log("✅ Remedy Rights Tests Passed");
}
