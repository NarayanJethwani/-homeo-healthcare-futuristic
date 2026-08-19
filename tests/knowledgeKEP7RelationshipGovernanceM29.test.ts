import assert from "assert";
import {
  buildKEP7MilestoneM29Package,
  getAdjudicatedM29GovernedRelationships,
  runM29EvaluationSuite,
  generateM29AuthorizationReport,
} from "../src/features/knowledge/expansion/kep7RelationshipGovernanceM29Package";
import {
  adjudicateRelationshipProposal,
  DEFAULT_CLINICAL_REVIEWER,
} from "../src/features/knowledge/governance/relationshipAdjudicationEngine";
import {
  evaluateRelationshipEligibility,
} from "../src/features/knowledge/governance/relationshipActivationContract";
import {
  validateGraphIntegrity,
  computeGraphIntegrityStatistics,
} from "../src/features/knowledge/governance/graphIntegrityValidator";

export function runKnowledgeKEP7RelationshipGovernanceM29Test(): void {
  // 1. Adjudication of all 35 M28 proposals
  const { proposalsCount, adjudicatedCount, governedRecords } = getAdjudicatedM29GovernedRelationships();
  assert.strictEqual(proposalsCount, 35, "Must have exactly 35 proposals from M28");
  assert.strictEqual(adjudicatedCount, 35, "All 35 proposals must be successfully adjudicated");
  assert.strictEqual(governedRecords.length, 35, "All 35 proposals must become governed records");

  for (const rel of governedRecords) {
    assert.strictEqual(rel.status, "governed", "Status must be 'governed'");
    assert.strictEqual(rel.schemaVersion, "1.0.0");
    assert.strictEqual(rel.adjudication.decision, "approved");
    assert.strictEqual(rel.adjudication.adjudicatedBy.reviewerId, DEFAULT_CLINICAL_REVIEWER.reviewerId);
    assert.strictEqual(rel.adjudication.safetyChecksPassed, true);
    assert.strictEqual(rel.adjudication.conventionalBoundaryPreserved, true);
    assert.ok(rel.fingerprintSha256 && rel.fingerprintSha256.length === 64);
    assert.ok(rel.evidenceCitationIds.length >= 4);

    // Derived eligibility check
    const evalResult = evaluateRelationshipEligibility(rel);
    assert.strictEqual(evalResult.isGoverned, true);
    assert.strictEqual(evalResult.isPublicationEligible, false, "Must be blocked by transitional freeze");
    assert.strictEqual(evalResult.isRagEligible, false, "Must be blocked by RAG allowlist/freeze");
  }

  // 2. Explicit Negative Controls: Lifecycle Semantics & Edge Cases
  const sample = governedRecords[0];

  // Case A: approved-but-not-governed
  const approvedOnly = { ...sample, status: "approved" as any };
  const approvedEval = evaluateRelationshipEligibility(approvedOnly);
  assert.strictEqual(approvedEval.isGoverned, false);
  assert.strictEqual(approvedEval.isPublicationEligible, false);
  assert.strictEqual(approvedEval.isRagEligible, false);

  // Case B: draft proposal
  const draftOnly = { ...sample, status: "draft" as any };
  const draftEval = evaluateRelationshipEligibility(draftOnly);
  assert.strictEqual(draftEval.isGoverned, false);
  assert.strictEqual(draftEval.isPublicationEligible, false);
  assert.strictEqual(draftEval.isRagEligible, false);

  // Case C: superseded relationship
  const supersededRel = { ...sample, supersededBy: "REL-NEW-V2" };
  const supersededEval = evaluateRelationshipEligibility(supersededRel);
  assert.strictEqual(supersededEval.isBlockedBySupersession, true);
  assert.strictEqual(supersededEval.isPublicationEligible, false);
  assert.strictEqual(supersededEval.isRagEligible, false);

  // Case D: entity later withdrawn after relationship governance (e.g. D0007 Asthma or R0006 Arsenicum)
  const withdrawnSourceRel = { ...sample, sourceEntityId: "D0007" };
  const withdrawnSourceEval = evaluateRelationshipEligibility(withdrawnSourceRel);
  assert.strictEqual(withdrawnSourceEval.isBlockedByWithdrawal, true);
  assert.strictEqual(withdrawnSourceEval.isPublicationEligible, false);
  assert.strictEqual(withdrawnSourceEval.isRagEligible, false);

  const withdrawnTargetRel = { ...sample, targetEntityId: "R0006" };
  const withdrawnTargetEval = evaluateRelationshipEligibility(withdrawnTargetRel);
  assert.strictEqual(withdrawnTargetEval.isBlockedByWithdrawal, true);
  assert.strictEqual(withdrawnTargetEval.isPublicationEligible, false);
  assert.strictEqual(withdrawnTargetEval.isRagEligible, false);

  // Case E: Disputed citation injection during adjudication
  const disputedProposal = {
    proposalId: "TEST-DISPUTED-01",
    sourceEntityId: "R0086",
    targetEntityId: "CONCEPT-TEST",
    relationshipType: "traditional_profile_association" as const,
    claimDescription: "Test claim with disputed citation",
    evidenceCitationIds: ["CIT-0001"], // Disputed citation in CITATIONS registry
    evidenceScope: "traditional-literature-only" as const,
    proposedBy: "Tester",
    version: "1.0.0",
  };
  const disputedResult = adjudicateRelationshipProposal(disputedProposal);
  assert.strictEqual(disputedResult.lifecycleStatus, "rejected");
  assert.strictEqual(disputedResult.adjudication.decision, "rejected");
  assert.ok(disputedResult.validationErrors.some((e) => e.includes("disputed")));

  // Case F: Prohibited curative claim rejection
  const curativeProposal = {
    proposalId: "TEST-CURATIVE-01",
    sourceEntityId: "R0086",
    targetEntityId: "CONCEPT-TEST",
    relationshipType: "traditional_profile_association" as const,
    claimDescription: "Guaranteed 100% cure for all conditions",
    evidenceCitationIds: ["CIT-0004"],
    evidenceScope: "traditional-literature-only" as const,
    proposedBy: "Tester",
    version: "1.0.0",
  };
  const curativeResult = adjudicateRelationshipProposal(curativeProposal);
  assert.strictEqual(curativeResult.lifecycleStatus, "rejected");
  assert.strictEqual(curativeResult.adjudication.decision, "rejected");
  assert.ok(curativeResult.validationErrors.some((e) => e.includes("prohibited efficacy/safety claim")));

  // Case G: Duplicate edge detection
  const dupResult = adjudicateRelationshipProposal(
    {
      proposalId: "TEST-DUP-01",
      sourceEntityId: sample.sourceEntityId,
      targetEntityId: sample.targetEntityId,
      relationshipType: sample.relationshipType,
      claimDescription: "Duplicate attempt",
      evidenceCitationIds: ["CIT-0004"],
      evidenceScope: "traditional-literature-only" as const,
      proposedBy: "Tester",
      version: "1.0.0",
    },
    { reviewer: DEFAULT_CLINICAL_REVIEWER, existingRelationships: governedRecords }
  );
  assert.strictEqual(dupResult.lifecycleStatus, "rejected");
  assert.ok(dupResult.validationErrors.some((e) => e.includes("Duplicate relationship")));

  // 3. Graph Integrity Validation
  const integrityReport = validateGraphIntegrity(governedRecords);
  assert.strictEqual(integrityReport.isValid, true, "Governed relationships graph must be valid");
  assert.strictEqual(integrityReport.errors.length, 0);
  assert.strictEqual(integrityReport.statistics.totalRelationships, 35);
  assert.strictEqual(integrityReport.statistics.byStatus.governed, 35);
  assert.strictEqual(integrityReport.statistics.publicationEligibleCount, 0, "Freeze must keep count at 0");
  assert.strictEqual(integrityReport.statistics.ragEligibleCount, 0, "Freeze/allowlist must keep RAG count at 0");

  // 4. M29 Offline Evaluation Suite (8 dimensions)
  const evalMetrics = runM29EvaluationSuite();
  assert.strictEqual(evalMetrics.failedCases, 0, "Evaluation suite must pass 100%");
  assert.strictEqual(evalMetrics.passedCases, evalMetrics.totalCases);
  assert.strictEqual(evalMetrics.negativeControlsPassed, evalMetrics.negativeControlsCount);
  assert.strictEqual(new Set(Object.keys(evalMetrics.dimensionCounts)).size, 8, "Must cover all 8 evaluation dimensions");
  for (const [dim, passRate] of Object.entries(evalMetrics.dimensionPassRates)) {
    assert.strictEqual(passRate, 1.0, `Dimension '${dim}' must have 100% pass rate`);
  }

  // 5. Package and Report Generation
  const pkg = buildKEP7MilestoneM29Package();
  assert.strictEqual(pkg.programId, "KEP-7");
  assert.strictEqual(pkg.milestoneId, "M29");
  assert.strictEqual(pkg.summary.totalProposalsAdjudicated, 35);
  assert.strictEqual(pkg.summary.governedRelationshipsCount, 35);
  assert.strictEqual(pkg.summary.evaluationPassRate, 1.0);
  assert.strictEqual(pkg.summary.negativeControlsPassRate, 1.0);

  const report = generateM29AuthorizationReport();
  assert.strictEqual(report.status, "pending_authorization");
  assert.strictEqual(report.governance.coreInvariantPreserved, "governed != publicationEligible != ragEligible");
  assert.match(report.sourceCommit, /^[a-f0-9]{40}$/);

  console.log("M29 verified: 35 proposals adjudicated into governed relationships, fail-closed contract enforced (governed != pub != rag), 8 evaluation dimensions at 100%, graph integrity clean.");
}

if (require.main === module) runKnowledgeKEP7RelationshipGovernanceM29Test();
