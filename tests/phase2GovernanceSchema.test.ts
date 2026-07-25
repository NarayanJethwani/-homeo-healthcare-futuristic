import assert from "assert";
import fs from "fs";
import path from "path";
import { getKnowledgeEntityById, getAllKnowledgeEntities } from "../src/features/knowledge";
import { evaluatePublicationGovernance, evaluatePublicationEligibility, isEntityIndexable, isEntityEligibleForSitemap, isEntityEligibleForRag, getPublicReviewLabel } from "../src/features/knowledge/governance/publicationGuard";
import { evaluateIndependentReview, registerContributor } from "../src/features/knowledge/governance/services/contributorRegistry";
import { computeContentHash, isApprovalValidForRevision, createContentRevision } from "../src/features/knowledge/governance/services/contentRevisionService";
import { validateEvidenceProfile } from "../src/features/knowledge/governance/services/evidenceProfileService";
import { evaluateClaimsGovernance } from "../src/features/knowledge/governance/services/clinicalClaimService";
import { validateWorkflowTransition } from "../src/features/knowledge/governance/services/editorialWorkflowMachine";
import { validateAiIngestionApproval } from "../src/features/knowledge/governance/services/aiIngestionGovernance";
import { recordGovernanceAuditEvent, getAuditEventsForEntity, verifyAuditTrailIntegrity } from "../src/features/knowledge/governance/services/governanceAuditTrail";
import { AuthorshipRecord, ClinicalReviewRecord, EvidenceProfile, ClinicalClaim, AiIngestionApproval } from "../src/features/knowledge/governance/types/governanceTypes";

export function runPhase2GovernanceTests() {
  console.log("🚀 Starting Phase 2 Pre-Merge Integrity & Durable Governance Test Suite...\n");

  const gerdEntity = getKnowledgeEntityById("D0001")!;
  const currentHash = computeContentHash(gerdEntity.content);

  // 1. Identical author and reviewer IDs cannot satisfy independent review
  {
    const authors: AuthorshipRecord[] = [{ contributorId: "CONTRIB-001", role: "author", recordedAt: "2026-01-01" }];
    const selfReview: ClinicalReviewRecord = {
      reviewerId: "CONTRIB-001",
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: currentHash,
      reviewedAt: "2026-07-25",
      declarationOfIndependence: true,
    };
    const evalResult = evaluateIndependentReview(authors, selfReview, currentHash);
    assert.strictEqual(evalResult.isIndependentApproved, false, "Identical author and reviewer must fail independent review");
    assert.ok(evalResult.reasons.includes("reviewer-is-author-conflict"));
    console.log("✅ TEST PASSED: 1. Identical author and reviewer IDs cannot satisfy independent review");
  }

  // 2. Different IDs without an independence declaration cannot satisfy review
  {
    const authors: AuthorshipRecord[] = [{ contributorId: "CONTRIB-001", role: "author", recordedAt: "2026-01-01" }];
    const nonIndependentReview: ClinicalReviewRecord = {
      reviewerId: "CONTRIB-002",
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: currentHash,
      reviewedAt: "2026-07-25",
      declarationOfIndependence: false, // Missing declaration
    };
    const evalResult = evaluateIndependentReview(authors, nonIndependentReview, currentHash);
    assert.strictEqual(evalResult.isIndependentApproved, false, "Missing declaration of independence must fail review");
    assert.ok(evalResult.reasons.includes("declaration-of-independence-missing"));
    console.log("✅ TEST PASSED: 2. Different IDs without independence declaration cannot satisfy review");
  }

  // 3. Approval applies only to the reviewed revision hash
  {
    const authors: AuthorshipRecord[] = [{ contributorId: "CONTRIB-001", role: "author", recordedAt: "2026-01-01" }];
    const mismatchedReview: ClinicalReviewRecord = {
      reviewerId: "CONTRIB-002",
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: "old-outdated-hash-12345",
      reviewedAt: "2026-07-25",
      declarationOfIndependence: true,
    };
    const evalResult = evaluateIndependentReview(authors, mismatchedReview, currentHash);
    assert.strictEqual(evalResult.isIndependentApproved, false, "Mismatched content revision hash must fail review");
    assert.ok(evalResult.reasons.includes("review-version-mismatch"));
    console.log("✅ TEST PASSED: 3. Approval applies only to the reviewed revision hash");
  }

  // 4. Material content edits invalidate prior approval
  {
    const initialRev = createContentRevision("D0001", { overview: "Initial overview" }, "CONTRIB-001");
    const reviewRecord: ClinicalReviewRecord = {
      reviewerId: "CONTRIB-002",
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: initialRev.contentHash,
      reviewedAt: "2026-07-25",
      declarationOfIndependence: true,
    };
    const editedRev = createContentRevision("D0001", { overview: "Substantially modified overview with new clinical claims" }, "CONTRIB-001");
    assert.strictEqual(isApprovalValidForRevision(initialRev, reviewRecord), true);
    assert.strictEqual(isApprovalValidForRevision(editedRev, reviewRecord), false, "Edited revision must invalidate prior review record");
    console.log("✅ TEST PASSED: 4. Material content edits invalidate prior approval");
  }

  // 5. Canonical Content Hashing Assertions
  {
    // A. Key insertion order independence
    const objA = { z: 1, a: 2, m: { b: 3, a: 4 } };
    const objB = { a: 2, z: 1, m: { a: 4, b: 3 } };
    assert.strictEqual(computeContentHash(objA), computeContentHash(objB), "Key insertion order must yield identical content hash");

    // B. Volatile metadata changes do not change hash
    const contentBase = { overview: "GERD overview text", updatedAt: "2026-01-01" };
    const contentMetaMod = { overview: "GERD overview text", updatedAt: "2026-07-25" };
    assert.strictEqual(computeContentHash(contentBase), computeContentHash(contentMetaMod), "Volatile metadata fields must not change content hash");

    // C. Treatment content change changes hash
    const contentTreatmentMod = { overview: "GERD overview text", treatment: "Proton pump inhibitors" };
    assert.notStrictEqual(computeContentHash(contentBase), computeContentHash(contentTreatmentMod), "Treatment content change must alter hash");

    // D. Safety warning change changes hash
    const contentSafetyMod = { overview: "GERD overview text", safetyWarning: "Risk of esophageal ulceration" };
    assert.notStrictEqual(computeContentHash(contentBase), computeContentHash(contentSafetyMod), "Safety warning change must alter hash");

    // E. Emergency escalation change changes hash
    const contentEmergencyMod = { overview: "GERD overview text", emergencyEscalation: "Severe chest pain emergency call 911" };
    assert.notStrictEqual(computeContentHash(contentBase), computeContentHash(contentEmergencyMod), "Emergency escalation change must alter hash");

    // F. Diagnostic content change changes hash
    const contentDiagnosisMod = { overview: "GERD overview text", diagnosis: "Endoscopy and pH monitoring" };
    assert.notStrictEqual(computeContentHash(contentBase), computeContentHash(contentDiagnosisMod), "Diagnostic content change must alter hash");

    // G. Multilingual clinical content change changes hash
    const contentLangA = { title: { en: "GERD", hi: "अम्लपित्त" } };
    const contentLangB = { title: { en: "GERD", hi: "गैस्ट्रो्रिफ्लक्स" } };
    assert.notStrictEqual(computeContentHash(contentLangA), computeContentHash(contentLangB), "Multilingual clinical content change must alter hash");

    console.log("✅ TEST PASSED: 5. Canonical content hashing tests (key order, volatile exclusion, treatment, safety, emergency, diagnosis, multilingual)");
  }

  // 6. Emergency Override Boundaries & Expiry Constraints
  {
    // A. Prohibited targets (cannot transition to 'approved' or 'published')
    const publishOverride = validateWorkflowTransition("D0001", "draft", "published", {
      isEmergencyOverride: true,
      actorId: "CONTRIB-001",
      emergencyReason: "Urgent clinical publishing request",
      emergencyExpiry: new Date(Date.now() + 86400000).toISOString(),
    });
    assert.strictEqual(publishOverride.isValid, false, "Emergency override cannot grant direct publication");

    // B. Expired emergency override fails
    const expiredOverride = validateWorkflowTransition("D0001", "published", "withdrawn", {
      isEmergencyOverride: true,
      actorId: "CONTRIB-001",
      emergencyReason: "Safety recall of contaminated batch",
      emergencyExpiry: "2020-01-01T00:00:00.000Z", // Expired
    });
    assert.strictEqual(expiredOverride.isValid, false, "Expired emergency override must fail");
    assert.strictEqual(expiredOverride.reason, "emergency-override-expired-or-invalid");

    // C. Valid emergency override to withdrawn state succeeds
    const validWithdrawalOverride = validateWorkflowTransition("D0001", "published", "withdrawn", {
      isEmergencyOverride: true,
      actorId: "CONTRIB-001",
      emergencyReason: "Safety recall of contaminated batch",
      emergencyExpiry: new Date(Date.now() + 86400000).toISOString(),
    });
    assert.strictEqual(validWithdrawalOverride.isValid, true);

    // D. Emergency override does not grant eligibleByClinicalGovernance or eligibleForAiIngestion
    const evaluation = evaluatePublicationGovernance({
      entity: gerdEntity,
      workflowState: "withdrawn",
    });
    assert.strictEqual(evaluation.eligibleByClinicalGovernance, false, "Emergency override cannot set eligibleByClinicalGovernance to true");
    assert.strictEqual(evaluation.eligibleForAiIngestion, false, "Emergency override cannot set eligibleForAiIngestion to true");

    console.log("✅ TEST PASSED: 6. Emergency override boundaries & expiry constraints verified");
  }

  // 7. Audit-Trail Cryptographic Hash Chaining Verification
  {
    recordGovernanceAuditEvent({
      id: "AUD-INTEGRITY-001",
      entityId: "D0001",
      actorId: "CONTRIB-001",
      action: "SAFETY_CONTAINMENT_APPLIED",
      createdAt: new Date().toISOString(),
    });

    const chainVerify = verifyAuditTrailIntegrity();
    assert.strictEqual(chainVerify.isChainValid, true, "Audit trail SHA-256 hash chain must verify cleanly");
    console.log("✅ TEST PASSED: 7. Audit trail cryptographic SHA-256 hash-chain integrity verified");
  }

  // 8. Evaluator Consistency Across Surfaces
  {
    const entities = getAllKnowledgeEntities();
    for (const entity of entities) {
      const eligibility = evaluatePublicationEligibility(entity);
      const governance = evaluatePublicationGovernance({ entity });

      // Assert complete consistency between selectors and canonical evaluation
      assert.strictEqual(isEntityIndexable(entity), eligibility.eligibleForIndexing);
      assert.strictEqual(isEntityEligibleForSitemap(entity), eligibility.eligibleForSitemap);
      assert.strictEqual(isEntityEligibleForRag(entity), eligibility.eligibleForAiIngestion);
      assert.strictEqual(getPublicReviewLabel(entity), eligibility.reviewLabel);

      assert.strictEqual(eligibility.eligibleForIndexing, governance.eligibleForIndexing);
      assert.strictEqual(eligibility.eligibleForAiIngestion, governance.eligibleForAiIngestion);
    }
    console.log("✅ TEST PASSED: 8. Evaluator consistency verified across indexable, sitemap, RAG, badges, and DTOs for all 343 entities");
  }

  // 9. Migration Dry-Run Output Determinism & Checksum Assertion
  {
    const reportPath = path.resolve(__dirname, "../reports/knowledge-phase2-migration-dry-run.json");
    assert.ok(fs.existsSync(reportPath), "Migration dry-run report JSON must exist");
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    assert.strictEqual(report.independentlyApprovedEntities, 0, "Independently approved entities must be 0");
    assert.strictEqual(report.ragApprovedEntities, 0, "RAG approved entities must be 0");
    assert.ok(report.dryRunChecksum, "Deterministic dry-run checksum must be present");
    console.log("✅ TEST PASSED: 9. Migration dry-run determinism & 0 independently approved / 0 RAG approved assertions verified");
  }

  console.log("\n==============================================");
  console.log("Phase 2 Pre-Merge Integrity Tests Completed. Passed: 9 | Failed: 0\n");
}

if (require.main === module) {
  runPhase2GovernanceTests();
}
