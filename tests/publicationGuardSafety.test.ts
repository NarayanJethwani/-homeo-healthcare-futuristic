import assert from "assert";
import { 
  evaluatePublicationEligibility, 
  isEntityIndexable, 
  isEntityEligibleForSitemap, 
  isEntityEligibleForRag, 
  getPublicReviewLabel,
  TRANSITIONAL_PUBLICATION_FREEZE,
  FLAGSHIP_ALLOWLIST,
  WITHDRAWN_SAFETY_ENTITIES
} from "../src/features/knowledge/governance/publicationGuard";
import { getAllKnowledgeEntities } from "../src/features/knowledge";
import { DISEASES } from "../src/features/knowledge/content/diseases";
import { REMEDIES } from "../src/features/knowledge/content/remedies";
import { FAQS } from "../src/features/knowledge/content/faqs";

async function runTests() {
  console.log("🚀 Starting Phase 1 Publication Safety & Governance Guard Test Suite...");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  // 1. Unreviewed entity cannot be indexed
  await test("1. Unreviewed non-allowlisted entity cannot be indexed", () => {
    const unreviewedEntity = DISEASES.find(d => !FLAGSHIP_ALLOWLIST.has(d.id) && d.id !== "D0007")!;
    assert.ok(unreviewedEntity, "Should find a non-allowlisted disease entity");
    
    const eligibility = evaluatePublicationEligibility(unreviewedEntity);
    assert.strictEqual(eligibility.eligibleForIndexing, false);
    assert.strictEqual(isEntityIndexable(unreviewedEntity), false);
    assert.strictEqual(eligibility.publicationStatus, "review-required");
  });

  // 2. Unreviewed entity cannot enter the sitemap
  await test("2. Unreviewed non-allowlisted entity cannot enter the sitemap", () => {
    const allEntities = getAllKnowledgeEntities();
    const sitemapEntities = allEntities.filter(isEntityEligibleForSitemap);
    const sitemapIds = new Set(sitemapEntities.map(e => e.id));

    // Asthma (withdrawn), Arsenicum (withdrawn), FAQ-safety (withdrawn) must be absent
    assert.strictEqual(sitemapIds.has("D0007"), false, "Asthma should not be in sitemap");
    assert.strictEqual(sitemapIds.has("R0006"), false, "Arsenicum Album should not be in sitemap");
    assert.strictEqual(sitemapIds.has("FAQ-safety"), false, "FAQ-safety should not be in sitemap");

    // Non-allowlisted unreviewed entity must be absent
    const unreviewedEntity = DISEASES.find(d => !FLAGSHIP_ALLOWLIST.has(d.id) && d.id !== "D0007")!;
    assert.strictEqual(sitemapIds.has(unreviewedEntity.id), false, "Unreviewed entity should not be in sitemap");

    // Flagship allowlisted entities should be present
    assert.strictEqual(sitemapIds.has("D0001"), true, "Flagship GERD (D0001) should be in sitemap");
  });

  // 3. Unreviewed entity cannot enter RAG
  await test("3. Unreviewed non-allowlisted entity cannot enter RAG", () => {
    const unreviewedEntity = DISEASES.find(d => !FLAGSHIP_ALLOWLIST.has(d.id) && d.id !== "D0007")!;
    assert.strictEqual(isEntityEligibleForRag(unreviewedEntity), false);
  });

  // 4 & 5. Withdrawn entity status & review label
  await test("4 & 5. Withdrawn entities (Asthma, Arsenicum, FAQ) have withdrawn status and Under Review label", () => {
    const asthma = DISEASES.find(d => d.id === "D0007")!;
    const arsenic = REMEDIES.find(r => r.id === "R0006")!;
    const faq = FAQS.find(f => f.id === "FAQ-safety")!;

    [asthma, arsenic, faq].forEach(entity => {
      const eligibility = evaluatePublicationEligibility(entity);
      assert.strictEqual(eligibility.publicationStatus, "withdrawn");
      assert.strictEqual(eligibility.clinicalReviewStatus, "under-review");
      assert.strictEqual(eligibility.eligibleForIndexing, false);
      assert.strictEqual(eligibility.eligibleForSitemap, false);
      assert.strictEqual(eligibility.eligibleForAiIngestion, false);
      assert.strictEqual(eligibility.reviewLabel, "Under Clinical Review");
      assert.ok(eligibility.reasons.includes("safety-withdrawal-active"));
    });
  });

  // 6. A published boolean alone cannot produce a 'Reviewed' label
  await test("6. A published boolean alone cannot produce a 'Reviewed' label without allowlist & governance checks", () => {
    const mockPublishedEntity: any = {
      id: "MOCK-001",
      slug: "mock-unreviewed",
      entityType: "disease",
      editorialStatus: "published",
      author: { name: "System" },
      reviewer: { name: "System" },
      content: { overview: "Overview text", references: ["CIT-0001"] },
      versionInfo: { updated: "2026-07-01" },
      tags: []
    };

    const eligibility = evaluatePublicationEligibility(mockPublishedEntity);
    assert.strictEqual(eligibility.reviewLabel, "Clinical Review Pending");
    assert.strictEqual(getPublicReviewLabel(mockPublishedEntity), "Clinical Review Pending");
    assert.notStrictEqual(getPublicReviewLabel(mockPublishedEntity), "Reviewed");
  });

  // 7. Allowlisted entity still fails when it has a critical governance failure
  await test("7. Allowlisted entity fails eligibility when missing required overview content or citations", () => {
    const brokenAllowlistedEntity: any = {
      id: "D0001", // In FLAGSHIP_ALLOWLIST
      slug: "gerd",
      entityType: "disease",
      editorialStatus: "published",
      author: { name: "Author A" },
      reviewer: { name: "Reviewer B" },
      content: { overview: "", references: [] }, // Critical governance failures
      versionInfo: { updated: "2026-07-01" },
      tags: []
    };

    const eligibility = evaluatePublicationEligibility(brokenAllowlistedEntity);
    assert.strictEqual(eligibility.eligibleForIndexing, false);
    assert.strictEqual(eligibility.eligibleForSitemap, false);
    assert.strictEqual(eligibility.eligibleForAiIngestion, false);
    assert.ok(eligibility.reasons.includes("missing-overview-content"));
    assert.ok(eligibility.reasons.includes("citation-requirements-unmet"));
  });

  // 8. Non-allowlisted entity is blocked while transitional freeze is active
  await test("8. Non-allowlisted entity is blocked while TRANSITIONAL_PUBLICATION_FREEZE is active", () => {
    assert.strictEqual(TRANSITIONAL_PUBLICATION_FREEZE, true);

    const validNonAllowlisted: any = {
      id: "DIS-9999", // Not in allowlist
      slug: "custom-disease",
      entityType: "disease",
      editorialStatus: "published",
      author: { name: "Author A" },
      reviewer: { name: "Reviewer B" },
      content: { overview: "Valid overview", references: ["CIT-0001"] },
      versionInfo: { updated: "2026-07-01" },
      tags: []
    };

    const eligibility = evaluatePublicationEligibility(validNonAllowlisted);
    assert.strictEqual(eligibility.eligibleForIndexing, false);
    assert.ok(eligibility.reasons.includes("transitional-publication-freeze"));
  });

  // 9. Flagship allowlisted entity (GERD D0001) receives transitional index eligibility but pending review label
  await test("9. Flagship allowlisted entity (GERD D0001) receives transitional index eligibility but pending review label", () => {
    const gerd = DISEASES.find(d => d.id === "D0001")!;
    const eligibility = evaluatePublicationEligibility(gerd);
    assert.strictEqual(eligibility.publicationStatus, "published");
    assert.strictEqual(eligibility.clinicalReviewStatus, "pending");
    assert.strictEqual(eligibility.eligibleForIndexing, true);
    assert.strictEqual(eligibility.eligibleForSitemap, true);
    assert.strictEqual(eligibility.eligibleForAiIngestion, false);
    assert.strictEqual(eligibility.eligibleByClinicalGovernance, false);
    assert.strictEqual(eligibility.eligibleByTemporaryPublicIndexException, true);
    assert.ok(eligibility.reasons.includes("temporary-editorial-index-exception"));
    assert.strictEqual(
      eligibility.reviewLabel,
      "Editorial review complete — independent clinical validation pending"
    );
  });

  // 10. Safety & governance audit failure CLI execution returns non-zero process exit status
  await test("10. Safety & governance audit failure CLI execution returns non-zero process exit status", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { spawnSync } = require("child_process");
    const res = spawnSync("npx", [
      "ts-node",
      "-P", "tests/tsconfig.test.json",
      "-r", "tsconfig-paths/register",
      "src/features/knowledge/governance/editorialAuditor.ts"
    ], { encoding: "utf8" });

    assert.notStrictEqual(res.status, 0, "CLI execution of editorialAuditor with quality issues must exit with non-zero code");
    assert.strictEqual(res.status, 1, "Exit code must be 1 when issues are detected");
  });

  // 11. Withdrawn text cannot enter a generated retrieval corpus
  await test("11. Withdrawn text cannot enter a generated retrieval corpus", () => {
    // Import real retrieval corpus function
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getEligibleAIArticlesForRAG } = require("../src/features/knowledge/retrieval/aiKnowledgeService");
    const corpus = getEligibleAIArticlesForRAG();

    const asthmaInCorpus = corpus.some((e: any) => e.id === "D0007");
    const arsenicInCorpus = corpus.some((e: any) => e.id === "R0006");
    const faqInCorpus = corpus.some((e: any) => e.id === "FAQ-safety");

    assert.strictEqual(asthmaInCorpus, false, "D0007 Asthma must be excluded from real retrieval corpus");
    assert.strictEqual(arsenicInCorpus, false, "R0006 Arsenicum Album must be excluded from real retrieval corpus");
    assert.strictEqual(faqInCorpus, false, "FAQ-safety must be excluded from real retrieval corpus");
    assert.strictEqual(corpus.length, 0, "Real retrieval corpus must contain 0 entities while RAG allowlist is empty");
  });

  // 12. Public allowlist alone cannot authorize RAG
  await test("12. Public index allowlist membership alone cannot authorize RAG ingestion", () => {
    const gerd = DISEASES.find(d => d.id === "D0001")!;
    assert.strictEqual(isEntityIndexable(gerd), true, "GERD is in PUBLIC_INDEX_ALLOWLIST");
    assert.strictEqual(isEntityEligibleForRag(gerd), false, "GERD is NOT in RAG_INGESTION_ALLOWLIST");
  });

  console.log(`\n==============================================`);
  console.log(`Phase 1 Publication Guard Tests Completed. Passed: ${passed} | Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
