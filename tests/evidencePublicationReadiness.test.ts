import assert from "assert";
import { validatePublicationReadiness } from "../src/features/knowledge-admin/cms/publicationReadiness";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";
import { CmsArticleDraft } from "../src/features/knowledge-admin/cms/types";

async function runPublicationReadinessTests() {
  console.log("🚀 Running Evidence Publication Readiness tests...");
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

  const baseDraft: CmsArticleDraft = {
    id: "draft-pr-1",
    articleId: "art-pr-1",
    title: "Arnica Pediatric Trauma",
    slug: "arnica-ped-trauma",
    entityType: "remedy",
    status: "published",
    draftContent: "Arnica for pediatric trauma guidance notes. Disclaimer: For educational only purposes.",
    references: ["Hahnemann S. Organon. 6th ed.", "Kent JT. Lectures."],
    reviewer: "Dr. Narayan Jethwani",
    reviewerRole: "MD(Hom)",
    clinicalReviewDate: "2026-07-11T00:00:00.000Z",
    nextReviewDate: "2027-07-11T00:00:00.000Z",
    createdAt: "2026-07-11T00:00:00.000Z",
    updatedAt: "2026-07-11T00:00:00.000Z",
    version: 1
  };

  await test("Flag off: does not require evidence metadata", async () => {
    featureFlags.knowledgeEvidenceScoringEnabled = false;
    const res = await validatePublicationReadiness(baseDraft);
    console.log("[DEBUG ERRORS]", res.errors);
    assert.strictEqual(res.errors.length, 0, "Should have no errors when flag is off");
  });

  await test("Flag off: malformed supplied evidence profile is rejected", async () => {
    featureFlags.knowledgeEvidenceScoringEnabled = false;
    const malformedDraft: CmsArticleDraft = {
      ...baseDraft,
      evidenceProfile: {
        evidenceStrength: "invalid-strength" as any,
        sourceQuality: "primary",
        clinicalConfidence: 150,
        editorialConfidence: 90,
        reviewIntervalDays: 365,
        reviewExpiryPolicy: "ranking-penalty",
        rationale: "Rationale",
        classicalSource: true,
        modernSource: true,
        assessedBy: "Dr. Narayan Jethwani",
        assessedAt: "2026-07-11T00:00:00.000Z"
      }
    };
    const res = await validatePublicationReadiness(malformedDraft);
    assert.ok(res.errors.length > 0, "Should catch malformed fields even when feature flag is off to preserve data integrity");
  });

  await test("Flag on: requires configured evidence profile", async () => {
    featureFlags.knowledgeEvidenceScoringEnabled = true;
    const res = await validatePublicationReadiness(baseDraft);
    assert.ok(res.errors.some((e: string) => e.includes("Evidence Profile is missing")));
  });

  await test("Flag on: valid configured profile passes", async () => {
    featureFlags.knowledgeEvidenceScoringEnabled = true;
    const validDraft: CmsArticleDraft = {
      ...baseDraft,
      evidenceProfile: {
        evidenceStrength: "high",
        sourceQuality: "authoritative",
        clinicalConfidence: 95,
        editorialConfidence: 90,
        reviewIntervalDays: 365,
        reviewGracePeriodDays: 30,
        reviewExpiryPolicy: "ranking-penalty",
        rationale: "Robust clinical rationale.",
        classicalSource: true,
        modernSource: true,
        assessedBy: "Dr. Narayan Jethwani",
        assessedAt: "2026-07-11T00:00:00.000Z",
        nextReviewDueAt: "2027-07-11T00:00:00.000Z"
      }
    };
    const res = await validatePublicationReadiness(validDraft);
    const evidenceErrors = res.errors.filter((e: string) => e.includes("Evidence Profile:"));
    assert.strictEqual(evidenceErrors.length, 0, `Should have no evidence errors: ${evidenceErrors.join(", ")}`);
  });

  await test("Flag on: low evidence strength levels generate warnings, not blocking errors", async () => {
    featureFlags.knowledgeEvidenceScoringEnabled = true;
    const lowEvidenceDraft: CmsArticleDraft = {
      ...baseDraft,
      evidenceProfile: {
        evidenceStrength: "low",
        sourceQuality: "unverified",
        clinicalConfidence: 45,
        editorialConfidence: 45,
        reviewIntervalDays: 365,
        reviewExpiryPolicy: "flag-only",
        rationale: "",
        classicalSource: true,
        modernSource: false,
        assessedBy: "Dr. Narayan Jethwani",
        assessedAt: "2026-07-11T00:00:00.000Z",
        nextReviewDueAt: "2027-07-11T00:00:00.000Z"
      }
    };
    const res = await validatePublicationReadiness(lowEvidenceDraft);
    const evidenceErrors = res.errors.filter((e: string) => e.includes("Evidence Profile:"));
    const evidenceWarnings = res.warnings.filter((w: string) => w.includes("Evidence Profile:"));
    assert.strictEqual(evidenceErrors.length, 0);
    assert.ok(evidenceWarnings.length > 0, "Should have low evidence and empty rationale warnings");
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runPublicationReadinessTests().catch(e => {
  console.error(e);
  process.exit(1);
});
