import assert from "assert";
import fs from "fs";
import path from "path";
import { MemoryKEP1DraftingRepository } from "../src/features/knowledge/drafting/kep1DraftingRepository";
import { MemoryKEP1ReviewRepository } from "../src/features/knowledge/review/kep1ReviewRepository";
import { MemoryKEP1EvaluationRepository } from "../src/features/knowledge/evaluation/kep1EvaluationRepository";
import { MemoryKEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingRepository";
import { MemoryKEP1DecisionRepository } from "../src/features/knowledge/decision/kep1DecisionRepository";
import { kep1CorpusManifestSha256 } from "../src/features/knowledge/evaluation/kep1EvaluationService";
import {
  getKEP1DecisionWorkspace,
  KEP1_GO_CONFIRMATION_PHRASE,
  KEP1_NO_GO_CONFIRMATION_PHRASE,
  recordKEP1GoNoGoDecision,
} from "../src/features/knowledge/decision/kep1DecisionService";
import { recordKEP1GoNoGoDecisionSchema } from "../src/features/knowledge/decision/kep1DecisionSchemas";
import {
  KEP1_PILOT_ENTITY_IDS,
  type KEP1EvaluationCorpusEntry,
  type KEP1OfflineEvaluationRecord,
} from "../src/features/knowledge/evaluation/kep1EvaluationTypes";
import type {
  KEP1DraftAuditEvent,
  KEP1DraftBundleRevision,
  KEP1DraftHead,
} from "../src/features/knowledge/drafting/kep1DraftingTypes";
import type {
  KEP1IndependentReviewRecord,
  KEP1ReviewAuditEvent,
  KEP1ReviewKind,
} from "../src/features/knowledge/review/kep1ReviewTypes";
import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
} from "../src/features/knowledge/onboarding/privateOnboardingTypes";
import type { RecordKEP1GoNoGoDecisionInput } from "../src/features/knowledge/decision/kep1DecisionSchemas";

const NOW = "2026-07-28T16:00:00.000Z";
const EVALUATOR = "ADMIN-EVALUATOR-001";
const DECIDER = "ADMIN-DECIDER-002";
const OWNER = "PROGRAM-OWNER-001";

function revision(
  entityId: (typeof KEP1_PILOT_ENTITY_IDS)[number]
): KEP1DraftBundleRevision {
  const revisionId = `KEP1-DRAFT-${entityId}-V1`;
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    draftId: `KEP1-DRAFT-${entityId}`,
    revisionId,
    revisionNumber: 1,
    entityId,
    entityType: entityId.startsWith("D")
      ? "disease"
      : entityId.startsWith("S")
        ? "symptom"
        : entityId.startsWith("R")
          ? "remedy"
          : "lab-test",
    title: `${entityId} governed decision fixture`,
    summary: "Current reviewed pilot revision for final decision testing.",
    status: "draft",
    jobId: `JOB-${entityId}`,
    artifactId: `ART-${entityId}`,
    artifactSha256: "a".repeat(64),
    artifactByteLength: 1000,
    verificationId: `VERIFY-${entityId}`,
    sourceId: `SOURCE-${entityId}`,
    sourceVersion: "1",
    rightsDecisionVersion: 1,
    authorAssignmentId: `${entityId}:clinical-author`,
    authorAssignmentVersion: 1,
    authorContributorId: `AUTHOR-${entityId}`,
    passages: [],
    claims: [],
    evidenceProfile: {
      evidenceLevel: "Level-B",
      evidenceSummary: "Governed evidence summary.",
      limitations: ["Fixture limitation."],
      sourcePassageIds: [],
      status: "draft",
      reviewedBy: [],
    },
    graphProposals: [],
    contentSha256: Buffer.from(entityId)
      .toString("hex")
      .padEnd(64, "0")
      .slice(0, 64),
    changeSummary: "Create final decision fixture.",
    createdByActorId: "ADMIN-DRAFT-001",
    createdAt: NOW,
  };
}

async function addRevision(
  repository: MemoryKEP1DraftingRepository,
  record: KEP1DraftBundleRevision
) {
  const head: KEP1DraftHead = {
    draftId: record.draftId,
    entityId: record.entityId,
    currentRevisionId: record.revisionId,
    currentRevisionNumber: 1,
    updatedAt: NOW,
  };
  const event: KEP1DraftAuditEvent = {
    eventId: `${record.revisionId}-AUD`,
    programId: "KEP-1",
    entityId: record.entityId,
    draftId: record.draftId,
    revisionId: record.revisionId,
    action: "DRAFT_REVISION_CREATED",
    actorId: "ADMIN-DRAFT-001",
    occurredAt: NOW,
    revisionNumber: 1,
    contentSha256: record.contentSha256,
  };
  await repository.createRevision(head, null, record, event);
}

function review(
  record: KEP1DraftBundleRevision,
  kind: KEP1ReviewKind
): KEP1IndependentReviewRecord {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    reviewId: `REVIEW-${record.revisionId}-${kind}`,
    reviewKind: kind,
    entityId: record.entityId,
    draftId: record.draftId,
    revisionId: record.revisionId,
    reviewedContentSha256: record.contentSha256,
    decision: "approved",
    reviewerAssignmentId: `${record.entityId}:${kind}`,
    reviewerAssignmentVersion: 1,
    reviewerContributorId: `${kind.toUpperCase()}-${record.entityId}`,
    authorContributorId: record.authorContributorId,
    declarationOfIndependence: true,
    conflictsDeclared: [],
    reviewedClaimIds: [],
    reviewedGraphProposalIds: [],
    clinicalChecklist:
      kind === "clinical"
        ? {
            claimLanguageChecked: true,
            traditionalUseBoundaryChecked: true,
            emergencyEscalationChecked: true,
            contraindicationChecked: true,
            graphSafetyChecked: true,
          }
        : null,
    evidenceChecklist:
      kind === "evidence"
        ? {
            citationTraceabilityChecked: true,
            evidenceStatusChecked: true,
            limitationsChecked: true,
            conflictingEvidenceChecked: true,
            conventionalCareBoundaryChecked: true,
          }
        : null,
    notes: "Approved exact fixture revision.",
    reviewedByActorId: `ADMIN-${kind}`,
    reviewedAt: NOW,
  };
}

async function addReview(
  repository: MemoryKEP1ReviewRepository,
  record: KEP1IndependentReviewRecord
) {
  const event: KEP1ReviewAuditEvent = {
    eventId: `${record.reviewId}-AUD`,
    programId: "KEP-1",
    entityId: record.entityId,
    revisionId: record.revisionId,
    reviewId: record.reviewId,
    reviewKind: record.reviewKind,
    decision: "approved",
    actorId: record.reviewedByActorId,
    occurredAt: NOW,
    reviewedContentSha256: record.reviewedContentSha256,
  };
  await repository.createReview(record, event);
}

function programOwner(status: "eligible" | "suspended" = "eligible") {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    recordId: OWNER,
    kind: "program-owner",
    fullName: "Private Program Owner",
    status,
    identity: {
      scheme: "staff-id",
      valueHash: "private-owner-identity-hash",
      verificationStatus: "verified",
      evidenceRef: "private://identity/program-owner",
      verifiedAt: "2026-07-27",
      verifiedBy: "ADMIN-IDENTITY-001",
    },
    eligibleRoles: [],
    expertiseDomains: [],
    credentials: [],
    attestations: {
      conflictOfInterestDeclared: true,
      editorialIndependenceAccepted: true,
      aiAssistanceDisclosureAccepted: true,
      sourceUsePolicyAccepted: true,
      acceptanceEvidenceRef: "private://attestation/program-owner",
    },
    createdAt: NOW,
    createdBy: "ADMIN-IDENTITY-001",
    updatedAt: NOW,
    updatedBy: "ADMIN-IDENTITY-001",
    version: 1,
  } satisfies KEP1PrivateOnboardingRecord;
}

async function addOwner(
  repository: MemoryKEP1PrivateOnboardingRepository,
  record: KEP1PrivateOnboardingRecord
) {
  const event: KEP1PrivateOnboardingAuditEvent = {
    eventId: `${record.recordId}-AUD`,
    programId: "KEP-1",
    recordId: record.recordId,
    action: "RECORD_CREATED",
    actorId: "ADMIN-IDENTITY-001",
    occurredAt: NOW,
    recordVersion: 1,
  };
  await repository.create(record, event);
}

function evaluation(
  corpus: KEP1EvaluationCorpusEntry[],
  status: "passed" | "failed" = "passed",
  executedAt = NOW,
  suffix = "1"
): KEP1OfflineEvaluationRecord {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    evaluationId: `KEP1-EVAL-${suffix}`,
    protocolVersion: "KEP1-OFFLINE-RETRIEVAL-1.0",
    status,
    corpusManifestSha256: kep1CorpusManifestSha256(corpus),
    querySetSha256: suffix.padEnd(64, "a").slice(0, 64),
    querySetVersion: `KEP1-QS-${suffix}`,
    retrievalSystemName: "Governed offline retriever",
    retrievalSystemVersion: suffix,
    retrievalLimit: 5,
    executionEnvironment: "offline-shadow",
    corpus,
    cases: [],
    metrics: {
      caseCount: 160,
      entityCount: 8,
      minimumCasesPerEntity: 20,
      recallAt5: status === "passed" ? 1 : 0.5,
      meanReciprocalRank: status === "passed" ? 1 : 0.5,
      citationPrecision: status === "passed" ? 1 : 0.8,
      unsupportedClaimFailureCount: status === "passed" ? 0 : 1,
      emergencyEscalationFailureCount: 0,
      abstentionFailureCount: 0,
      staleRevisionLeakageCount: 0,
      crossEntityConfusionCount: 0,
      withdrawnContentLeakageCount: 0,
      passedCaseCount: status === "passed" ? 160 : 159,
      failedCaseCount: status === "passed" ? 0 : 1,
    },
    thresholds: {
      minimumCasesPerEntity: 20,
      minimumRecallAt5: 0.9,
      minimumMeanReciprocalRank: 0.85,
      requiredCitationPrecision: 1,
      maximumSafetyFailures: 0,
    },
    executedByActorId: EVALUATOR,
    executedAt,
  };
}

async function addEvaluation(
  repository: MemoryKEP1EvaluationRepository,
  record: KEP1OfflineEvaluationRecord
) {
  await repository.createEvaluation(record, {
    eventId: `${record.evaluationId}-AUD`,
    programId: "KEP-1",
    evaluationId: record.evaluationId,
    action: "OFFLINE_EVALUATION_RECORDED",
    status: record.status,
    corpusManifestSha256: record.corpusManifestSha256,
    querySetSha256: record.querySetSha256,
    actorId: record.executedByActorId,
    occurredAt: record.executedAt,
  });
}

async function seed(ownerStatus: "eligible" | "suspended" = "eligible") {
  const drafting = new MemoryKEP1DraftingRepository();
  const reviews = new MemoryKEP1ReviewRepository();
  const evaluations = new MemoryKEP1EvaluationRepository();
  const decisions = new MemoryKEP1DecisionRepository();
  const onboarding = new MemoryKEP1PrivateOnboardingRepository();
  const corpus: KEP1EvaluationCorpusEntry[] = [];
  for (const entityId of KEP1_PILOT_ENTITY_IDS) {
    const record = revision(entityId);
    await addRevision(drafting, record);
    await addReview(reviews, review(record, "clinical"));
    await addReview(reviews, review(record, "evidence"));
    corpus.push({
      entityId,
      revisionId: record.revisionId,
      contentSha256: record.contentSha256,
    });
  }
  const currentEvaluation = evaluation(corpus);
  await addEvaluation(evaluations, currentEvaluation);
  await addOwner(onboarding, programOwner(ownerStatus));
  return {
    drafting,
    reviews,
    evaluations,
    decisions,
    onboarding,
    corpus,
    currentEvaluation,
  };
}

function input(
  evaluationRecord: KEP1OfflineEvaluationRecord,
  decision: "go" | "no-go" = "go"
): RecordKEP1GoNoGoDecisionInput {
  return {
    action: "record-go-no-go",
    decision,
    evaluationId: evaluationRecord.evaluationId,
    expectedCorpusManifestSha256:
      evaluationRecord.corpusManifestSha256,
    expectedQuerySetSha256: evaluationRecord.querySetSha256,
    programOwnerRecordId: OWNER,
    checklist: {
      acceptanceGatesReviewed: true,
      clinicalAndEvidenceReviewsConfirmed: true,
      offlineEvaluationReviewed: true,
      withdrawnExclusionsConfirmed: true,
      zeroProductionRagConfirmed: true,
      residualRisksReviewed: true,
      containmentAndRollbackReviewed: true,
      authorityBoundaryAccepted: true,
    },
    blockers: decision === "no-go" ? ["External approval remains blocked."] : [],
    residualRisks: ["Controlled expansion may reveal new evidence gaps."],
    rationale:
      "The accountable program owner reviewed the exact evaluation and final KEP-1 boundaries.",
    decisionEvidenceRef: "private://decision/kep1-final",
    meetingMinutesRef: "private://minutes/kep1-final",
    confirmationPhrase:
      decision === "go"
        ? KEP1_GO_CONFIRMATION_PHRASE
        : KEP1_NO_GO_CONFIRMATION_PHRASE,
  };
}

export async function runKnowledgeKEP1GoNoGoDecisionTests() {
  const repositories = await seed();

  await assert.rejects(
    recordKEP1GoNoGoDecision(
      repositories.decisions,
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews,
      repositories.onboarding,
      input(repositories.currentEvaluation),
      { actorId: EVALUATOR },
      NOW
    ),
    /GO_NO_GO_EVALUATOR_SEPARATION_REQUIRED/
  );

  await assert.rejects(
    recordKEP1GoNoGoDecision(
      repositories.decisions,
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews,
      repositories.onboarding,
      {
        ...input(repositories.currentEvaluation),
        expectedQuerySetSha256: "f".repeat(64),
      },
      { actorId: DECIDER },
      NOW
    ),
    /GO_NO_GO_EVALUATION_HASH_MISMATCH/
  );

  const suspended = await seed("suspended");
  await assert.rejects(
    recordKEP1GoNoGoDecision(
      suspended.decisions,
      suspended.evaluations,
      suspended.drafting,
      suspended.reviews,
      suspended.onboarding,
      input(suspended.currentEvaluation),
      { actorId: DECIDER },
      NOW
    ),
    /GO_NO_GO_ELIGIBLE_PROGRAM_OWNER_REQUIRED/
  );

  const incomplete = input(repositories.currentEvaluation);
  incomplete.checklist.authorityBoundaryAccepted = false;
  await assert.rejects(
    recordKEP1GoNoGoDecision(
      repositories.decisions,
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews,
      repositories.onboarding,
      incomplete,
      { actorId: DECIDER },
      NOW
    ),
    /GO_NO_GO_CHECKLIST_INCOMPLETE/
  );

  await assert.rejects(
    recordKEP1GoNoGoDecision(
      repositories.decisions,
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews,
      repositories.onboarding,
      {
        ...input(repositories.currentEvaluation),
        blockers: ["Unresolved release blocker."],
      },
      { actorId: DECIDER },
      NOW
    ),
    /GO_NO_GO_UNRESOLVED_BLOCKERS/
  );

  await assert.rejects(
    recordKEP1GoNoGoDecision(
      repositories.decisions,
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews,
      repositories.onboarding,
      {
        ...input(repositories.currentEvaluation),
        confirmationPhrase: "I approve",
      },
      { actorId: DECIDER },
      NOW
    ),
    /GO_NO_GO_CONFIRMATION_MISMATCH/
  );

  const recorded = await recordKEP1GoNoGoDecision(
    repositories.decisions,
    repositories.evaluations,
    repositories.drafting,
    repositories.reviews,
    repositories.onboarding,
    input(repositories.currentEvaluation),
    { actorId: DECIDER },
    NOW
  );
  assert.strictEqual(recorded.decision, "go");
  assert.strictEqual(recorded.programOwnerRecordId, OWNER);

  const workspace = await getKEP1DecisionWorkspace(
    repositories.decisions,
    repositories.evaluations,
    repositories.drafting,
    repositories.reviews,
    repositories.onboarding
  );
  assert.strictEqual(workspace.readiness, "kep1-go");
  assert.strictEqual(workspace.authority.kep1CompletionGranted, true);
  assert.strictEqual(
    workspace.authority.controlledExpansionPlanningGranted,
    true
  );
  assert.strictEqual(
    workspace.authority.publicationAuthorityGranted,
    false
  );
  assert.strictEqual(
    workspace.authority.productionRagAuthorityGranted,
    false
  );

  await assert.rejects(
    recordKEP1GoNoGoDecision(
      repositories.decisions,
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews,
      repositories.onboarding,
      input(repositories.currentEvaluation),
      { actorId: DECIDER },
      NOW
    ),
    /GO_NO_GO_IMMUTABLE_CONFLICT/
  );

  const noGo = await seed();
  const noGoRecord = await recordKEP1GoNoGoDecision(
    noGo.decisions,
    noGo.evaluations,
    noGo.drafting,
    noGo.reviews,
    noGo.onboarding,
    input(noGo.currentEvaluation, "no-go"),
    { actorId: DECIDER },
    NOW
  );
  assert.strictEqual(noGoRecord.decision, "no-go");
  const noGoWorkspace = await getKEP1DecisionWorkspace(
    noGo.decisions,
    noGo.evaluations,
    noGo.drafting,
    noGo.reviews,
    noGo.onboarding
  );
  assert.strictEqual(noGoWorkspace.readiness, "kep1-no-go");
  assert.strictEqual(
    noGoWorkspace.authority.controlledExpansionPlanningGranted,
    false
  );

  await addEvaluation(
    repositories.evaluations,
    evaluation(
      repositories.corpus,
      "failed",
      "2026-07-28T17:00:00.000Z",
      "2"
    )
  );
  const invalidated = await getKEP1DecisionWorkspace(
    repositories.decisions,
    repositories.evaluations,
    repositories.drafting,
    repositories.reviews,
    repositories.onboarding
  );
  assert.strictEqual(invalidated.readiness, "decision-pending");
  assert.strictEqual(invalidated.prerequisites.ready, false);
  assert.strictEqual(
    invalidated.authority.controlledExpansionPlanningGranted,
    false
  );

  assert.strictEqual(
    recordKEP1GoNoGoDecisionSchema.safeParse({
      ...input(repositories.currentEvaluation),
      productionRagEnabled: true,
    }).success,
    false
  );

  const rules = fs.readFileSync(
    path.join(process.cwd(), "firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep1GoNoGoDecisions",
    "knowledgeGovernanceKep1DecisionAuditEvents",
  ]) {
    assert.ok(
      rules.includes(
        `match /${collection}/{docId} { allow read, write: if false; }`
      )
    );
  }

  const route = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/app/api/admin/knowledge/decision/route.ts"
    ),
    "utf8"
  );
  assert.match(route, /knowledge\.expansion\.manage/);
  assert.match(route, /sameOrigin/);
  assert.match(route, /readAndBoundRequestBody/);
  assert.match(route, /Cache-Control": "no-store"/);

  const publicationGuard = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/features/knowledge/governance/publicationGuard.ts"
    ),
    "utf8"
  );
  assert.match(
    publicationGuard,
    /export const RAG_INGESTION_ALLOWLIST:[^=]+=\s*new Set\(\[\]\);/
  );
}

runKnowledgeKEP1GoNoGoDecisionTests()
  .then(() => {
    console.log(
      "✅ KEP-1 human go/no-go tests passed: exact latest evaluation binding, owner eligibility, evaluator/decider separation, high-friction confirmation, immutable outcomes, invalidation, private storage, and zero publication/RAG authority."
    );
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
