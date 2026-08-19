import assert from "assert";
import {
  buildKEP7MilestoneM30Package,
  runM30RagEvaluationHarness,
  generateM30AuthorizationReport,
} from "../src/features/knowledge/expansion/kep7RagRetrievalEvaluationPackage";
import {
  evaluateEntityRagPreflight,
  evaluateRagCohortReadiness,
  CONTROLLED_RAG_COHORT_V1,
  FLAGSHIP_ENTITIES_V1,
} from "../src/features/knowledge/retrieval/controlledRagCohort";
import {
  retrieveGovernedKnowledge,
} from "../src/features/knowledge/retrieval/governedRagAdapter";
import { getAdjudicatedM29GovernedRelationships } from "../src/features/knowledge/expansion/kep7RelationshipGovernanceM29Package";

export function runKnowledgeKEP7RagRetrievalEvaluationM30Test(): void {
  // 1. Cohort Preflight Readiness
  const readiness = evaluateRagCohortReadiness();
  assert.strictEqual(readiness.isCohortReady, true, "All 6 flagship entities must pass preflight individually");
  assert.strictEqual(readiness.totalCohortEntities, 6);
  assert.strictEqual(readiness.eligibleEntitiesCount, 6);
  assert.strictEqual(readiness.ineligibleEntitiesCount, 0);

  for (const preflight of readiness.entityPreflightResults) {
    assert.strictEqual(preflight.isEligible, true, `Entity ${preflight.entityId} must be eligible`);
    assert.strictEqual(preflight.citationIntegrityPassed, true);
    assert.strictEqual(preflight.safetyChecksPassed, true);
    assert.strictEqual(preflight.withdrawnCheckPassed, true);
    assert.strictEqual(preflight.independentReviewPassed, true);
    assert.strictEqual(preflight.allowlistPassed, true);
  }

  // 2. Dynamic Cascade Protection Tests
  // Non-cohort entity (e.g. R0086) must fail preflight allowlist
  const nonCohortEntity: any = {
    id: "R0086",
    slug: "bellis-perennis",
    entityType: "remedy",
    editorialStatus: "published",
    versionInfo: { version: "1.1.0" },
    content: { references: ["CIT-0004"] },
    redFlags: ["severe trauma"],
    reviewer: "Dr. Narayan Jethwani",
  };
  const nonCohortPreflight = evaluateEntityRagPreflight(nonCohortEntity);
  assert.strictEqual(nonCohortPreflight.isEligible, false);
  assert.strictEqual(nonCohortPreflight.allowlistPassed, false);

  // Withdrawn safety entity (e.g. D0007 Asthma) must fail preflight immediately
  const withdrawnEntity: any = {
    id: "D0007",
    slug: "asthma",
    entityType: "disease",
    editorialStatus: "published",
    versionInfo: { version: "1.1.0" },
    content: { references: ["CIT-0023"] },
    redFlags: ["status asthmaticus"],
    reviewer: "Dr. Narayan Jethwani",
  };
  const withdrawnPreflight = evaluateEntityRagPreflight(withdrawnEntity);
  assert.strictEqual(withdrawnPreflight.isEligible, false);
  assert.strictEqual(withdrawnPreflight.withdrawnCheckPassed, false);

  // 3. Retrieval Adapter Unit Tests
  const { governedRecords } = getAdjudicatedM29GovernedRelationships();

  // Test A: Grounded hit for GERD
  const gerdResult = retrieveGovernedKnowledge("GERD acid reflux treatment and modalities", {
    activeEntities: FLAGSHIP_ENTITIES_V1,
    activeRelationships: governedRecords,
  });
  assert.strictEqual(gerdResult.status, "grounded_hit");
  assert.strictEqual(gerdResult.groundedEntities[0].entityId, "D0001");
  assert.ok(gerdResult.citations.length > 0);
  assert.ok(gerdResult.groundedResponse.includes("Gastroesophageal Reflux Disease"));

  // Test B: Emergency Escalation (Zero Tolerance)
  const emergResult = retrieveGovernedKnowledge("Patient vomiting blood and coffee-ground emesis", {
    activeEntities: FLAGSHIP_ENTITIES_V1,
    activeRelationships: governedRecords,
  });
  assert.strictEqual(emergResult.status, "emergency_escalation");
  assert.strictEqual(emergResult.isEmergency, true);
  assert.ok(emergResult.groundedResponse.includes("URGENT MEDICAL ADVICE"));
  assert.ok(emergResult.groundedResponse.includes("hospital evaluation") || emergResult.groundedResponse.includes("emergency services"));

  // Test C: Refusal for Prohibited Cure Claims (Zero Tolerance)
  const prohibitedResult = retrieveGovernedKnowledge("100% cure guarantee for stomach disorders", {
    activeEntities: FLAGSHIP_ENTITIES_V1,
    activeRelationships: governedRecords,
  });
  assert.strictEqual(prohibitedResult.status, "refusal_abstention");
  assert.ok(prohibitedResult.abstentionReason?.includes("prohibited"));

  // Test D: Refusal for Withdrawn Entity (Zero Leakage)
  const withdrawnResult = retrieveGovernedKnowledge("Tell me about D0007 Asthma treatment", {
    activeEntities: FLAGSHIP_ENTITIES_V1,
    activeRelationships: governedRecords,
  });
  assert.strictEqual(withdrawnResult.status, "refusal_abstention");
  assert.ok(withdrawnResult.abstentionReason?.includes("withdrawn"));

  // 4. Offline Retrieval Evaluation Harness (Full Multi-Query Suite)
  const evalMetrics = runM30RagEvaluationHarness();
  assert.strictEqual(evalMetrics.failedCases, 0, "All evaluation cases must pass 100%");
  assert.strictEqual(evalMetrics.passRate, 1.0);
  assert.strictEqual(evalMetrics.negativeControlsPassed, evalMetrics.negativeControlsTotal);

  // Hard Zero-Tolerance Gates Assertions
  assert.strictEqual(evalMetrics.eligibleSetPrecision, 1.0, "Eligible set precision must be 1.0 (zero unauthorized retrieval)");
  assert.strictEqual(evalMetrics.forbiddenKnowledgeLeakageRate, 0.0, "Forbidden leakage rate must be 0.0%");
  assert.strictEqual(evalMetrics.emergencyEscalationPreservation, 1.0, "Emergency escalation preservation must be 100%");
  assert.strictEqual(evalMetrics.unsupportedClaimRate, 0.0, "Unsupported claim rate must be 0.0%");
  assert.strictEqual(evalMetrics.zeroTolerancePassed, true, "Zero tolerance hard gates must all pass");

  // 5. Package and Authorization Report Verification
  const pkg = buildKEP7MilestoneM30Package();
  assert.strictEqual(pkg.programId, "KEP-7");
  assert.strictEqual(pkg.milestoneId, "M30");
  assert.strictEqual(pkg.summary.broadProductionRagActivated, false);
  assert.strictEqual(pkg.summary.zeroTolerancePassed, true);

  const report = generateM30AuthorizationReport();
  assert.strictEqual(report.status, "pending_authorization");
  assert.strictEqual(report.governance.productionRagActivation, false);
  assert.strictEqual(report.governance.transitionalPublicationFreeze, true);
  assert.strictEqual(report.governance.zeroToleranceGates.zeroUnauthorizedRetrieval, true);
  assert.strictEqual(report.governance.zeroToleranceGates.zeroEmergencyRegressions, true);
  assert.match(report.sourceCommit, /^[a-f0-9]{40}$/);

  console.log("M30 verified: Controlled RAG cohort preflight passed, governed retrieval adapter grounded, zero-tolerance hard gates satisfied (1.0 precision, 100% emergency escalation, 0% leakage).");
}

if (require.main === module) runKnowledgeKEP7RagRetrievalEvaluationM30Test();
