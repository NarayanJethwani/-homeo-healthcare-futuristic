import assert from "assert";
import fs from "fs";
import path from "path";
import type { KEP1DecisionRepository } from "../src/features/knowledge/decision/kep1DecisionTypes";
import type { KEP1DraftingRepository } from "../src/features/knowledge/drafting/kep1DraftingTypes";
import {
  kep1CorpusManifestSha256,
} from "../src/features/knowledge/evaluation/kep1EvaluationService";
import {
  KEP1_PILOT_ENTITY_IDS,
  type KEP1EvaluationCorpusEntry,
} from "../src/features/knowledge/evaluation/kep1EvaluationTypes";
import type { KEP1EvaluationRepository } from "../src/features/knowledge/evaluation/kep1EvaluationTypes";
import type { KEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingTypes";
import type { KEP1ReviewRepository } from "../src/features/knowledge/review/kep1ReviewTypes";
import { recordKEP3CohortAuthorizationSchema } from "../src/features/knowledge/authorization/kep3CohortAuthorizationSchemas";
import { MemoryKEP3CohortAuthorizationRepository } from "../src/features/knowledge/authorization/kep3CohortAuthorizationRepository";
import {
  getKEP3CohortAuthorizationWorkspace,
  kep3CohortProposalSha256,
  KEP3_COHORT_APPROVE_CONFIRMATION_PHRASE,
  KEP3_COHORT_REJECT_CONFIRMATION_PHRASE,
  recordKEP3CohortAuthorization,
} from "../src/features/knowledge/authorization/kep3CohortAuthorizationService";
import type { RecordKEP3CohortAuthorizationInput } from "../src/features/knowledge/authorization/kep3CohortAuthorizationSchemas";
import { MemoryKEP3CohortPlanningRepository } from "../src/features/knowledge/planning/kep3CohortPlanningRepository";
import {
  getKEP3InventorySnapshotSha256,
  type KEP3PlanningPrerequisiteRepositories,
} from "../src/features/knowledge/planning/kep3CohortPlanningService";
import type { KEP3CohortProposalRecord } from "../src/features/knowledge/planning/kep3CohortPlanningTypes";

const NOW = "2026-07-28T19:00:00.000Z";
const PROPOSER = "ADMIN-KEP3-PROPOSER";
const AUTHORIZER = "ADMIN-KEP3-AUTHORIZER";
const OWNER = "PROGRAM-OWNER-001";
const GO_DECISION_ID = "KEP1-GNG-KEP1-EVAL-CURRENT";

function owner(status: "eligible" | "suspended" = "eligible") {
  return {
    recordId: OWNER,
    version: 1,
    updatedAt: NOW,
    kind: "program-owner" as const,
    status,
    identity: {
      verificationStatus: "verified" as const,
      evidenceRef: "private://identity/owner",
      verifiedAt: "2026-07-27",
    },
    attestations: {
      conflictOfInterestDeclared: true,
      editorialIndependenceAccepted: true,
      aiAssistanceDisclosureAccepted: true,
      sourceUsePolicyAccepted: true,
      acceptanceEvidenceRef: "private://attestation/owner",
    },
  };
}

function onboarding(
  status: "eligible" | "suspended" = "eligible"
): KEP1PrivateOnboardingRepository {
  const record = owner(status);
  return {
    get: async (recordId: string) =>
      recordId === record.recordId ? record : null,
    list: async () => [record],
  } as unknown as KEP1PrivateOnboardingRepository;
}

function prerequisites(input?: {
  validGo?: boolean;
  onboardingRepository?: KEP1PrivateOnboardingRepository;
}): KEP3PlanningPrerequisiteRepositories {
  const corpus: KEP1EvaluationCorpusEntry[] = KEP1_PILOT_ENTITY_IDS.map(
    (entityId) => ({
      entityId,
      revisionId: `KEP1-DRAFT-${entityId}-V1`,
      contentSha256: Buffer.from(entityId)
        .toString("hex")
        .padEnd(64, "0")
        .slice(0, 64),
    })
  );
  const corpusSha256 = kep1CorpusManifestSha256(corpus);
  const evaluation = {
    evaluationId: "KEP1-EVAL-CURRENT",
    status: "passed" as const,
    corpusManifestSha256: corpusSha256,
    querySetSha256: "b".repeat(64),
    querySetVersion: "KEP1-QS-1",
    retrievalSystemName: "Governed offline retriever",
    retrievalSystemVersion: "1",
    metrics: {
      caseCount: 160,
      recallAt5: 1,
      meanReciprocalRank: 1,
      citationPrecision: 1,
      failedCaseCount: 0,
    },
    corpus,
    executedAt: "2026-07-28T16:00:00.000Z",
  };
  const evaluations =
    input?.validGo === false
      ? [
          evaluation,
          {
            ...evaluation,
            evaluationId: "KEP1-EVAL-NEWER-FAILED",
            status: "failed" as const,
            executedAt: "2026-07-28T18:30:00.000Z",
          },
        ]
      : [evaluation];
  const decision = {
    schemaVersion: "1.0.0" as const,
    programId: "KEP-1" as const,
    decisionId: GO_DECISION_ID,
    decision: "go" as const,
    evaluationId: evaluation.evaluationId,
    corpusManifestSha256: corpusSha256,
    querySetSha256: evaluation.querySetSha256,
    programOwnerRecordId: OWNER,
    programOwnerRecordVersion: 1,
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
    blockers: [],
    residualRisks: ["Controlled expansion planning risk."],
    rationale: "Current accountable KEP-1 decision fixture.",
    decisionEvidenceRef: "private://decision/kep1",
    meetingMinutesRef: "private://minutes/kep1",
    confirmationPhrase:
      "I AUTHORIZE KEP-1 GO WITHOUT PUBLICATION OR RAG AUTHORITY",
    decidedByActorId: "ADMIN-KEP1-DECIDER",
    decidedAt: "2026-07-28T16:30:00.000Z",
  };
  const heads = corpus.map((entry) => ({
    draftId: `KEP1-DRAFT-${entry.entityId}`,
    entityId: entry.entityId,
    currentRevisionId: entry.revisionId,
    currentRevisionNumber: 1,
    updatedAt: NOW,
  }));
  const revisions = corpus.map((entry) => ({
    entityId: entry.entityId,
    revisionId: entry.revisionId,
    contentSha256: entry.contentSha256,
  }));
  const reviews = corpus.flatMap((entry) =>
    (["clinical", "evidence"] as const).map((reviewKind) => ({
      entityId: entry.entityId,
      revisionId: entry.revisionId,
      reviewedContentSha256: entry.contentSha256,
      reviewKind,
      decision: "approved" as const,
      reviewerContributorId: `${reviewKind}-${entry.entityId}`,
    }))
  );
  return {
    decisions: {
      getDecision: async (id: string) =>
        id === decision.decisionId ? decision : null,
      listDecisions: async () => [decision],
    } as unknown as KEP1DecisionRepository,
    evaluations: {
      getEvaluation: async (id: string) =>
        evaluations.find((record) => record.evaluationId === id) || null,
      listEvaluations: async () => evaluations,
    } as unknown as KEP1EvaluationRepository,
    drafts: {
      listHeads: async () => heads,
      listRevisions: async () => revisions,
    } as unknown as KEP1DraftingRepository,
    reviews: {
      listReviews: async () => reviews,
    } as unknown as KEP1ReviewRepository,
    onboarding:
      input?.onboardingRepository || onboarding(),
  };
}

function proposal(input?: {
  proposalId?: string;
  proposedAt?: string;
  proposedByActorId?: string;
  invalidAuthority?: boolean;
}): KEP3CohortProposalRecord {
  const inventorySha256 = getKEP3InventorySnapshotSha256(
    NOW.slice(0, 10)
  );
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-3",
    proposalId: input?.proposalId || "KEP3-PLAN-AUTH-FIXTURE-001",
    status: "planning-proposal-only",
    cohortLabel: "Controlled cohort authorization fixture",
    kep1DecisionId: GO_DECISION_ID,
    kep1EvaluationId: "KEP1-EVAL-CURRENT",
    kep1CorpusManifestSha256: "a".repeat(64),
    kep1QuerySetSha256: "b".repeat(64),
    inventorySha256,
    inventoryEntityCount: 343,
    selections: [
      {
        entityId: "D0005",
        entityType: "disease",
        title: "Controlled entity",
        inventoryPriorityScore: 40,
        factors: {
          clinicalImportance: 5,
          safetySensitivity: 4,
          searchDemand: 3,
          sourceAvailability: 2,
          graphValue: 1,
        },
        weightedScore: 70,
        rationale:
          "Documented demand and a feasible governed evidence pathway.",
        evidenceRefs: ["private://planning/entity"],
      },
    ],
    roleCapacity: [
      "clinical-author",
      "independent-clinical-reviewer",
      "evidence-reviewer",
      "rights-reviewer",
    ].map((role) => ({
      role: role as
        | "clinical-author"
        | "independent-clinical-reviewer"
        | "evidence-reviewer"
        | "rights-reviewer",
      availableEntityCapacity: 1,
      evidenceRef: `private://capacity/${role}`,
    })),
    selectionMethodology:
      "Evidence-backed selection using the published five-factor weighting.",
    residualRisks: ["Source rights may narrow available evidence."],
    planningEvidenceRef: "private://planning/cohort",
    riskRegisterRef: "private://risk/cohort",
    confirmationPhrase:
      "I RECORD A KEP-3 PLANNING PROPOSAL WITHOUT PUBLICATION OR RAG AUTHORITY",
    proposedByActorId: input?.proposedByActorId || PROPOSER,
    proposedAt: input?.proposedAt || "2026-07-28T18:00:00.000Z",
    authority: {
      planningRecorded: true,
      assignmentAuthorityGranted: Boolean(
        input?.invalidAuthority
      ) as false,
      editorialApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      embeddingAuthorityGranted: false,
      productionRagAuthorityGranted: false,
      productionMigrationAuthorityGranted: false,
    },
  };
}

async function planningRepositoryWith(
  ...proposals: KEP3CohortProposalRecord[]
) {
  const repository = new MemoryKEP3CohortPlanningRepository();
  for (const record of proposals) {
    await repository.createProposal(record, {
      eventId: `${record.proposalId}-AUD`,
      programId: "KEP-3",
      proposalId: record.proposalId,
      kep1DecisionId: record.kep1DecisionId,
      inventorySha256: record.inventorySha256,
      selectedEntityIds: record.selections.map(
        (selection) => selection.entityId
      ),
      actorId: record.proposedByActorId,
      occurredAt: record.proposedAt,
    });
  }
  return repository;
}

function input(
  record: KEP3CohortProposalRecord,
  decision: "approved" | "rejected" = "approved"
): RecordKEP3CohortAuthorizationInput {
  return {
    action: "record-cohort-authorization",
    decision,
    proposalId: record.proposalId,
    expectedProposalSha256: kep3CohortProposalSha256(record),
    programOwnerRecordId: OWNER,
    checklist: {
      selectionEvidenceReviewed: true,
      capacityEvidenceReviewed: true,
      riskRegisterReviewed: true,
      withdrawnAndFlagshipExclusionsConfirmed: true,
      zeroProductionRagConfirmed: true,
      noAutomaticAssignmentsConfirmed: true,
      authorityBoundaryAccepted: true,
    },
    blockers:
      decision === "rejected"
        ? ["Reviewer capacity evidence is not acceptable."]
        : [],
    residualRisks: ["Source rights may narrow the usable evidence set."],
    rationale:
      "The accountable program owner reviewed the exact cohort proposal and its limited authority.",
    authorizationEvidenceRef: "private://authorization/cohort",
    meetingMinutesRef: "private://minutes/cohort",
    confirmationPhrase:
      decision === "approved"
        ? KEP3_COHORT_APPROVE_CONFIRMATION_PHRASE
        : KEP3_COHORT_REJECT_CONFIRMATION_PHRASE,
  };
}

export async function runKnowledgeKEP3CohortAuthorizationTests() {
  const currentProposal = proposal();
  const planning = await planningRepositoryWith(currentProposal);
  const authorizations =
    new MemoryKEP3CohortAuthorizationRepository();
  const onboardingRepository = onboarding();
  const prereqs = prerequisites({
    onboardingRepository,
  });
  const workspace = await getKEP3CohortAuthorizationWorkspace(
    authorizations,
    planning,
    prereqs,
    onboardingRepository,
    NOW
  );
  assert.strictEqual(workspace.prerequisites.ready, true);
  assert.strictEqual(
    workspace.prerequisites.currentProposal?.proposalId,
    currentProposal.proposalId
  );
  assert.strictEqual(workspace.authority.cohortPreparationGranted, false);

  await assert.rejects(
    recordKEP3CohortAuthorization(
      authorizations,
      planning,
      prereqs,
      onboardingRepository,
      input(currentProposal),
      { actorId: PROPOSER },
      NOW
    ),
    /KEP3_AUTHORIZATION_PROPOSER_SEPARATION_REQUIRED/
  );
  await assert.rejects(
    recordKEP3CohortAuthorization(
      authorizations,
      planning,
      prereqs,
      onboardingRepository,
      {
        ...input(currentProposal),
        expectedProposalSha256: "f".repeat(64),
      },
      { actorId: AUTHORIZER },
      NOW
    ),
    /KEP3_AUTHORIZATION_PROPOSAL_HASH_MISMATCH/
  );
  await assert.rejects(
    recordKEP3CohortAuthorization(
      authorizations,
      planning,
      prereqs,
      onboarding("suspended"),
      input(currentProposal),
      { actorId: AUTHORIZER },
      NOW
    ),
    /KEP3_AUTHORIZATION_ELIGIBLE_PROGRAM_OWNER_REQUIRED/
  );

  const incomplete = input(currentProposal);
  incomplete.checklist.authorityBoundaryAccepted = false;
  await assert.rejects(
    recordKEP3CohortAuthorization(
      authorizations,
      planning,
      prereqs,
      onboardingRepository,
      incomplete,
      { actorId: AUTHORIZER },
      NOW
    ),
    /KEP3_AUTHORIZATION_CHECKLIST_INCOMPLETE/
  );
  await assert.rejects(
    recordKEP3CohortAuthorization(
      authorizations,
      planning,
      prereqs,
      onboardingRepository,
      {
        ...input(currentProposal),
        blockers: ["Unresolved cohort blocker."],
      },
      { actorId: AUTHORIZER },
      NOW
    ),
    /KEP3_AUTHORIZATION_UNRESOLVED_BLOCKERS/
  );
  await assert.rejects(
    recordKEP3CohortAuthorization(
      authorizations,
      planning,
      prereqs,
      onboardingRepository,
      {
        ...input(currentProposal),
        confirmationPhrase: "I approve",
      },
      { actorId: AUTHORIZER },
      NOW
    ),
    /KEP3_AUTHORIZATION_CONFIRMATION_MISMATCH/
  );

  const recorded = await recordKEP3CohortAuthorization(
    authorizations,
    planning,
    prereqs,
    onboardingRepository,
    input(currentProposal),
    { actorId: AUTHORIZER },
    NOW
  );
  assert.strictEqual(recorded.decision, "approved");
  assert.strictEqual(recorded.authority.cohortPreparationGranted, true);
  assert.strictEqual(recorded.authority.assignmentAuthorityGranted, false);
  assert.strictEqual(recorded.authority.publicationAuthorityGranted, false);
  assert.strictEqual(recorded.authority.productionRagAuthorityGranted, false);
  await assert.rejects(
    recordKEP3CohortAuthorization(
      authorizations,
      planning,
      prereqs,
      onboardingRepository,
      input(currentProposal),
      { actorId: AUTHORIZER },
      NOW
    ),
    /KEP3_AUTHORIZATION_IMMUTABLE_CONFLICT/
  );

  const approvedWorkspace = await getKEP3CohortAuthorizationWorkspace(
    authorizations,
    planning,
    prereqs,
    onboardingRepository,
    NOW
  );
  assert.strictEqual(
    approvedWorkspace.readiness,
    "cohort-preparation-authorized"
  );
  assert.strictEqual(
    approvedWorkspace.authority.cohortPreparationGranted,
    true
  );

  const rejectedProposal = proposal({
    proposalId: "KEP3-PLAN-REJECT-FIXTURE",
  });
  const rejectedPlanning = await planningRepositoryWith(rejectedProposal);
  const rejectedRepository =
    new MemoryKEP3CohortAuthorizationRepository();
  const rejected = await recordKEP3CohortAuthorization(
    rejectedRepository,
    rejectedPlanning,
    prereqs,
    onboardingRepository,
    input(rejectedProposal, "rejected"),
    { actorId: AUTHORIZER },
    NOW
  );
  assert.strictEqual(rejected.decision, "rejected");
  assert.strictEqual(rejected.authority.cohortPreparationGranted, false);

  const olderProposal = proposal({
    proposalId: "KEP3-PLAN-OLDER",
    proposedAt: "2026-07-28T17:00:00.000Z",
  });
  const newerProposal = proposal({
    proposalId: "KEP3-PLAN-NEWER",
    proposedAt: "2026-07-28T18:30:00.000Z",
  });
  const supersededPlanning = await planningRepositoryWith(
    olderProposal,
    newerProposal
  );
  await assert.rejects(
    recordKEP3CohortAuthorization(
      new MemoryKEP3CohortAuthorizationRepository(),
      supersededPlanning,
      prereqs,
      onboardingRepository,
      input(olderProposal),
      { actorId: AUTHORIZER },
      NOW
    ),
    /KEP3_AUTHORIZATION_LATEST_PROPOSAL_REQUIRED/
  );

  const invalidPlanning = await planningRepositoryWith(
    proposal({
      proposalId: "KEP3-PLAN-INVALID-AUTHORITY",
      invalidAuthority: true,
    })
  );
  await assert.rejects(
    getKEP3CohortAuthorizationWorkspace(
      new MemoryKEP3CohortAuthorizationRepository(),
      invalidPlanning,
      prereqs,
      onboardingRepository,
      NOW
    ).then((result) => {
      if (!result.prerequisites.ready) {
        throw new Error(result.prerequisites.blockerCode || "blocked");
      }
    }),
    /KEP3_AUTHORIZATION_PROPOSAL_INVARIANT_FAILURE/
  );

  const invalidated = await getKEP3CohortAuthorizationWorkspace(
    new MemoryKEP3CohortAuthorizationRepository(),
    planning,
    prerequisites({
      validGo: false,
      onboardingRepository,
    }),
    onboardingRepository,
    NOW
  );
  assert.strictEqual(invalidated.prerequisites.ready, false);
  assert.strictEqual(
    invalidated.prerequisites.blockerCode,
    "KEP3_AUTHORIZATION_CURRENT_PLANNING_GATE_REQUIRED"
  );

  assert.strictEqual(
    recordKEP3CohortAuthorizationSchema.safeParse({
      ...input(currentProposal),
      assignmentAuthorityGranted: true,
    }).success,
    false
  );

  const rules = fs.readFileSync(
    path.join(process.cwd(), "firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep3CohortAuthorizations",
    "knowledgeGovernanceKep3CohortAuthorizationAuditEvents",
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
      "src/app/api/admin/knowledge/cohort-authorization/route.ts"
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

runKnowledgeKEP3CohortAuthorizationTests()
  .then(() => {
    console.log(
      "✅ KEP-3 cohort authorization tests passed: latest exact proposal binding, full SHA-256, proposer/authorizer separation, eligible owner, approve/reject controls, immutable audit, invalidation, and zero downstream authority."
    );
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
