import assert from "assert";
import { ragService } from "../src/lib/ragService";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";
import { saveDraft, clearCmsMemoryStore } from "../src/features/knowledge-admin/cms/cmsManager";
import { globalKmsRepository } from "../src/features/knowledge-admin/repositories/MemoryRepository";
import { CmsArticleDraft } from "../src/features/knowledge-admin/cms/types";

async function runEvidenceRegressionTests() {
  console.log("🚀 Running Evidence Scoring Regression tests...");
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

  test("Feature flag off preserves V2.14.0-A baseline relevance ranking", async () => {
    clearCmsMemoryStore();

    const testDraft: CmsArticleDraft = {
      id: "draft-reg-1",
      articleId: "rem_sulphur",
      title: "Sulphur Remedy",
      slug: "sulphur",
      entityType: "remedy",
      status: "published",
      draftContent: "Sulphur remedy overview and keynotes",
      references: ["CIT-001"],
      reviewer: "Dr. Narayan Jethwani",
      reviewerRole: "MD(Hom)",
      clinicalReviewDate: "2026-07-11T00:00:00.000Z",
      nextReviewDate: "2027-07-11T00:00:00.000Z",
      createdAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      version: 1,
      evidenceProfile: {
        evidenceStrength: "high",
        sourceQuality: "authoritative",
        clinicalConfidence: 95,
        editorialConfidence: 95,
        reviewIntervalDays: 365,
        reviewGracePeriodDays: 30,
        reviewExpiryPolicy: "ranking-penalty",
        rationale: "High evidence",
        classicalSource: true,
        modernSource: true,
        lastReviewedAt: "2026-07-11T00:00:00.000Z"
      }
    };

    await saveDraft(testDraft, "Dr. Narayan Jethwani");

    // Save to public memory repo
    const publicEntity = {
      id: testDraft.articleId,
      slug: testDraft.slug,
      entityType: testDraft.entityType,
      title: { en: testDraft.title, hi: "", gu: "", mr: "", es: "", ar: "" },
      summary: { en: testDraft.draftContent, hi: "", gu: "", mr: "", es: "", ar: "" },
      relatedEntities: [],
      lastReviewed: testDraft.clinicalReviewDate,
      lastUpdated: new Date().toISOString(),
      author: { id: "CONTRIB-AUTH-01", name: "Dr. Narayan Jethwani" },
      reviewer: { id: "CONTRIB-REV-01", name: "Dr. Second Reviewer", specialty: "MD(Hom)" },
      reviewerRole: "MD(Hom)",
      lastClinicalReview: testDraft.clinicalReviewDate,
      nextClinicalReview: testDraft.nextReviewDate,
      referencesUpdated: testDraft.clinicalReviewDate,
      reviewStatus: "clinically-reviewed",
      isCornerstone: false,
      evidenceLevel: "Level-A",
      tags: [],
      canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sulphur",
      readingTimeMinutes: 5,
      audience: "practitioner",
      license: "CC-BY-4.0",
      versionInfo: {
        version: "1.0.0",
        created: testDraft.createdAt,
        updated: new Date().toISOString(),
        reviewed: testDraft.clinicalReviewDate,
        changelog: []
      },
      content: {
        overview: testDraft.draftContent,
        references: testDraft.references
      },
      evidenceProfile: testDraft.evidenceProfile
    };
    await globalKmsRepository.saveEntity(publicEntity as any, "Dr. Narayan Jethwani", "Administrator", "Initial publish");

    featureFlags.knowledgeEvidenceScoringEnabled = false;
    const resultsFlagOff = await ragService.hybridSearch("Sulphur", "public-search");
    const itemOff = resultsFlagOff.find(r => r.document.id === testDraft.articleId || r.document.id.includes(testDraft.articleId));
    assert.ok(itemOff);
    assert.ok(!itemOff.rankingExplanation);

    featureFlags.knowledgeEvidenceScoringEnabled = true;
    const resultsFlagOn = await ragService.hybridSearch("Sulphur", "public-search");
    const itemOn = resultsFlagOn.find(r => r.document.id === testDraft.articleId || r.document.id.includes(testDraft.articleId));
    assert.ok(itemOn);
    assert.ok(itemOn.rankingExplanation);
    assert.ok(itemOn.rankingExplanation.evidencePriorityScore !== undefined);

    featureFlags.knowledgeEvidenceScoringEnabled = false; // Restore
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceRegressionTests().catch(e => {
  console.error(e);
  process.exit(1);
});
