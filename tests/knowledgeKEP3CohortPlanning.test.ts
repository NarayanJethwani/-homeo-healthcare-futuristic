import assert from "assert";
import fs from "fs";
import path from "path";
import type { KEP1DecisionRepository } from "../src/features/knowledge/decision/kep1DecisionTypes";
import type { KEP1DraftingRepository } from "../src/features/knowledge/drafting/kep1DraftingTypes";
import type { KEP1EvaluationRepository } from "../src/features/knowledge/evaluation/kep1EvaluationTypes";
import {
  KEP1_PILOT_ENTITY_IDS,
  type KEP1EvaluationCorpusEntry,
} from "../src/features/knowledge/evaluation/kep1EvaluationTypes";
import { kep1CorpusManifestSha256 } from "../src/features/knowledge/evaluation/kep1EvaluationService";
import type { KEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingTypes";
import type { KEP1ReviewRepository } from "../src/features/knowledge/review/kep1ReviewTypes";
import { recordKEP3CohortProposalSchema } from "../src/features/knowledge/planning/kep3CohortPlanningSchemas";
import { MemoryKEP3CohortPlanningRepository } from "../src/features/knowledge/planning/kep3CohortPlanningRepository";
import {
  getKEP3CohortPlanningWorkspace,
  KEP3_COHORT_PLANNING_CONFIRMATION_PHRASE,
  recordKEP3CohortProposal,
  type KEP3PlanningPrerequisiteRepositories,
} from "../src/features/knowledge/planning/kep3CohortPlanningService";
import type { RecordKEP3CohortProposalInput } from "../src/features/knowledge/planning/kep3CohortPlanningSchemas";

const NOW = "2026-07-28T18:00:00.000Z";
const DECIDER = "ADMIN-KEP1-DECIDER";
const PLANNER = "ADMIN-KEP3-PLANNER";
const GO_DECISION_ID = "KEP1-GNG-KEP1-EVAL-CURRENT";
const QUERY_SHA = "b".repeat(64);

function prerequisites(input?: {
  decision?: "go" | "no-go" | "none";
  newerFailedEvaluation?: boolean;
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
  const corpusSha = kep1CorpusManifestSha256(corpus);
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
  const passedEvaluation = {
    evaluationId: "KEP1-EVAL-CURRENT",
    status: "passed" as const,
    corpusManifestSha256: corpusSha,
    querySetSha256: QUERY_SHA,
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
  const evaluations = input?.newerFailedEvaluation
    ? [
        passedEvaluation,
        {
          ...passedEvaluation,
          evaluationId: "KEP1-EVAL-NEWER-FAILED",
          status: "failed" as const,
          executedAt: "2026-07-28T17:00:00.000Z",
        },
      ]
    : [passedEvaluation];
  const decision =
    input?.decision === "none"
      ? null
      : {
          schemaVersion: "1.0.0" as const,
          programId: "KEP-1" as const,
          decisionId: GO_DECISION_ID,
          decision: input?.decision || ("go" as const),
          evaluationId: passedEvaluation.evaluationId,
          corpusManifestSha256: corpusSha,
          querySetSha256: QUERY_SHA,
          programOwnerRecordId: "OWNER-1",
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
          residualRisks: ["Controlled planning risk."],
          rationale: "Current accountable KEP-1 decision fixture.",
          decisionEvidenceRef: "private://decision/kep1",
          meetingMinutesRef: "private://minutes/kep1",
          confirmationPhrase:
            "I AUTHORIZE KEP-1 GO WITHOUT PUBLICATION OR RAG AUTHORITY",
          decidedByActorId: DECIDER,
          decidedAt: "2026-07-28T16:30:00.000Z",
        };
  const owner = {
    kind: "program-owner" as const,
    status: "eligible" as const,
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
    recordId: "OWNER-1",
    version: 1,
    updatedAt: NOW,
  };

  return {
    decisions: {
      getDecision: async (id: string) =>
        decision?.decisionId === id ? decision : null,
      listDecisions: async () => (decision ? [decision] : []),
    } as unknown as KEP1DecisionRepository,
    evaluations: {
      getEvaluation: async (id: string) =>
        evaluations.find((item) => item.evaluationId === id) || null,
      listEvaluations: async () => evaluations,
    } as unknown as KEP1EvaluationRepository,
    drafts: {
      listHeads: async () => heads,
      listRevisions: async () => revisions,
    } as unknown as KEP1DraftingRepository,
    reviews: {
      listReviews: async () => reviews,
    } as unknown as KEP1ReviewRepository,
    onboarding: {
      list: async () => [owner],
    } as unknown as KEP1PrivateOnboardingRepository,
  };
}

function input(
  inventorySha256: string,
  entityId: string
): RecordKEP3CohortProposalInput {
  return {
    action: "record-cohort-proposal",
    cohortLabel: "Controlled cohort A",
    expectedKep1DecisionId: GO_DECISION_ID,
    expectedInventorySha256: inventorySha256,
    selections: [
      {
        entityId,
        factors: {
          clinicalImportance: 5,
          safetySensitivity: 4,
          searchDemand: 3,
          sourceAvailability: 2,
          graphValue: 1,
        },
        rationale:
          "This entity has documented clinical demand and a feasible governed evidence path.",
        evidenceRefs: ["private://planning/entity-evidence"],
      },
    ],
    roleCapacity: [
      {
        role: "clinical-author",
        availableEntityCapacity: 1,
        evidenceRef: "private://capacity/author",
      },
      {
        role: "independent-clinical-reviewer",
        availableEntityCapacity: 1,
        evidenceRef: "private://capacity/clinical-review",
      },
      {
        role: "evidence-reviewer",
        availableEntityCapacity: 1,
        evidenceRef: "private://capacity/evidence-review",
      },
      {
        role: "rights-reviewer",
        availableEntityCapacity: 1,
        evidenceRef: "private://capacity/rights-review",
      },
    ],
    selectionMethodology:
      "The proposal balances clinical importance, safety sensitivity, verified demand, available sources, and graph value under the published weights.",
    residualRisks: ["Source rights may narrow the usable evidence set."],
    planningEvidenceRef: "private://planning/cohort-a",
    riskRegisterRef: "private://risk/cohort-a",
    confirmationPhrase: KEP3_COHORT_PLANNING_CONFIRMATION_PHRASE,
  };
}

export async function runKnowledgeKEP3CohortPlanningTests() {
  const repository = new MemoryKEP3CohortPlanningRepository();
  const readyPrerequisites = prerequisites();
  const workspace = await getKEP3CohortPlanningWorkspace(
    repository,
    readyPrerequisites,
    NOW
  );
  assert.strictEqual(workspace.prerequisites.ready, true);
  assert.strictEqual(workspace.prerequisites.inventoryEntityCount, 343);
  assert.strictEqual(workspace.authority.planningOnly, true);
  assert.strictEqual(workspace.authority.publicationAuthorityGranted, false);
  assert.strictEqual(workspace.authority.productionRagAuthorityGranted, false);
  const candidate = workspace.candidates[0];
  assert.ok(candidate);

  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      prerequisites({ decision: "none" }),
      input(workspace.prerequisites.inventorySha256, candidate.entityId),
      { actorId: PLANNER },
      NOW
    ),
    /KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED/
  );
  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      prerequisites({ decision: "no-go" }),
      input(workspace.prerequisites.inventorySha256, candidate.entityId),
      { actorId: PLANNER },
      NOW
    ),
    /KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED/
  );
  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      readyPrerequisites,
      input(workspace.prerequisites.inventorySha256, candidate.entityId),
      { actorId: DECIDER },
      NOW
    ),
    /KEP3_PLANNING_ACTOR_SEPARATION_REQUIRED/
  );
  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      readyPrerequisites,
      {
        ...input(workspace.prerequisites.inventorySha256, candidate.entityId),
        expectedInventorySha256: "f".repeat(64),
      },
      { actorId: PLANNER },
      NOW
    ),
    /KEP3_PLANNING_INVENTORY_HASH_MISMATCH/
  );
  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      readyPrerequisites,
      {
        ...input(workspace.prerequisites.inventorySha256, candidate.entityId),
        selections: [
          ...input(
            workspace.prerequisites.inventorySha256,
            candidate.entityId
          ).selections,
          ...input(
            workspace.prerequisites.inventorySha256,
            candidate.entityId
          ).selections,
        ],
      },
      { actorId: PLANNER },
      NOW
    ),
    /KEP3_PLANNING_DUPLICATE_ENTITY/
  );
  for (const forbiddenEntity of ["D0001", "D0007"]) {
    await assert.rejects(
      recordKEP3CohortProposal(
        repository,
        readyPrerequisites,
        input(workspace.prerequisites.inventorySha256, forbiddenEntity),
        { actorId: PLANNER },
        NOW
      ),
      forbiddenEntity === "D0001"
        ? /KEP3_PLANNING_FLAGSHIP_ENTITY_FORBIDDEN/
        : /KEP3_PLANNING_WITHDRAWN_ENTITY_FORBIDDEN/
    );
  }
  const insufficient = input(
    workspace.prerequisites.inventorySha256,
    candidate.entityId
  );
  insufficient.selections.push({
    ...insufficient.selections[0],
    entityId: workspace.candidates[1].entityId,
  });
  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      readyPrerequisites,
      insufficient,
      { actorId: PLANNER },
      NOW
    ),
    /KEP3_PLANNING_INSUFFICIENT_ROLE_CAPACITY/
  );
  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      readyPrerequisites,
      {
        ...input(workspace.prerequisites.inventorySha256, candidate.entityId),
        confirmationPhrase: "I approve this cohort",
      },
      { actorId: PLANNER },
      NOW
    ),
    /KEP3_PLANNING_CONFIRMATION_MISMATCH/
  );

  const recorded = await recordKEP3CohortProposal(
    repository,
    readyPrerequisites,
    input(workspace.prerequisites.inventorySha256, candidate.entityId),
    { actorId: PLANNER },
    NOW
  );
  assert.strictEqual(recorded.status, "planning-proposal-only");
  assert.strictEqual(recorded.selections[0].weightedScore, 70);
  assert.strictEqual(recorded.authority.assignmentAuthorityGranted, false);
  assert.strictEqual(recorded.authority.editorialApprovalGranted, false);
  assert.strictEqual(recorded.authority.productionRagAuthorityGranted, false);
  await assert.rejects(
    recordKEP3CohortProposal(
      repository,
      readyPrerequisites,
      input(workspace.prerequisites.inventorySha256, candidate.entityId),
      { actorId: PLANNER },
      NOW
    ),
    /KEP3_PLANNING_IMMUTABLE_CONFLICT/
  );

  const invalidated = await getKEP3CohortPlanningWorkspace(
    new MemoryKEP3CohortPlanningRepository(),
    prerequisites({ newerFailedEvaluation: true }),
    NOW
  );
  assert.strictEqual(invalidated.prerequisites.ready, false);
  assert.strictEqual(
    invalidated.prerequisites.blockerCode,
    "KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED"
  );

  const schemaBase = input(
    workspace.prerequisites.inventorySha256,
    candidate.entityId
  );
  assert.strictEqual(
    recordKEP3CohortProposalSchema.safeParse({
      ...schemaBase,
      productionRagEnabled: true,
    }).success,
    false
  );
  assert.strictEqual(
    recordKEP3CohortProposalSchema.safeParse({
      ...schemaBase,
      selections: Array.from({ length: 26 }, (_, index) => ({
        ...schemaBase.selections[0],
        entityId: `ENTITY-${index}`,
      })),
    }).success,
    false
  );

  const rules = fs.readFileSync(
    path.join(process.cwd(), "firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep3CohortProposals",
    "knowledgeGovernanceKep3CohortPlanningAuditEvents",
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
      "src/app/api/admin/knowledge/cohort-planning/route.ts"
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

runKnowledgeKEP3CohortPlanningTests()
  .then(() => {
    console.log(
      "✅ KEP-3 cohort planning tests passed: current-go and inventory binding, actor separation, 25-entity cap, withdrawn/flagship exclusion, capacity evidence, immutable audit, drift invalidation, and zero downstream authority."
    );
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
