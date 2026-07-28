import { createHash } from "node:crypto";
import { canonicalJsonStringify } from "../retrieval/canonicalEmbeddingText";
import {
  FLAGSHIP_ENTITY_IDS,
  generateKnowledgeExpansionInventory,
} from "../expansion/inventoryService";
import type { KEP1DraftingRepository } from "../drafting/kep1DraftingTypes";
import type { KEP1EvaluationRepository } from "../evaluation/kep1EvaluationTypes";
import type { KEP1ReviewRepository } from "../review/kep1ReviewTypes";
import type { KEP1PrivateOnboardingRepository } from "../onboarding/privateOnboardingTypes";
import type { KEP1DecisionRepository } from "../decision/kep1DecisionTypes";
import { getKEP1DecisionWorkspace } from "../decision/kep1DecisionService";
import type { RecordKEP3CohortProposalInput } from "./kep3CohortPlanningSchemas";
import {
  KEP3_PLANNING_ROLES,
  type KEP3CohortPlanningAuditEvent,
  type KEP3CohortPlanningRepository,
  type KEP3CohortProposalRecord,
  type KEP3SelectionFactors,
} from "./kep3CohortPlanningTypes";

const CONFIRMATION =
  "I RECORD A KEP-3 PLANNING PROPOSAL WITHOUT PUBLICATION OR RAG AUTHORITY";
const FLAGSHIP_IDS = new Set<string>(FLAGSHIP_ENTITY_IDS);

export interface KEP3PlanningActor {
  actorId: string;
}

export interface KEP3PlanningPrerequisiteRepositories {
  decisions: KEP1DecisionRepository;
  evaluations: KEP1EvaluationRepository;
  drafts: KEP1DraftingRepository;
  reviews: KEP1ReviewRepository;
  onboarding: KEP1PrivateOnboardingRepository;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(canonicalJsonStringify(value), "utf8")
    .digest("hex");
}

function inventorySnapshot(asOfDate: string) {
  const inventory = generateKnowledgeExpansionInventory(asOfDate);
  const canonicalRecords = [...inventory.records]
    .sort((left, right) => left.entityId.localeCompare(right.entityId))
    .map((record) => ({
      entityId: record.entityId,
      slug: record.slug,
      entityType: record.entityType,
      title: record.title,
      safety: record.safety,
      content: record.content,
      evidence: record.evidence,
      review: record.review,
      graph: record.graph,
      eligibility: record.eligibility,
      prioritisation: record.prioritisation,
    }));
  return {
    inventory,
    sha256: sha256(canonicalRecords),
  };
}

export function calculateKEP3WeightedScore(
  factors: KEP3SelectionFactors
): number {
  return (
    factors.clinicalImportance * 6 +
    factors.safetySensitivity * 5 +
    factors.searchDemand * 4 +
    factors.sourceAvailability * 3 +
    factors.graphValue * 2
  );
}

async function currentGo(
  repositories: KEP3PlanningPrerequisiteRepositories
) {
  const workspace = await getKEP1DecisionWorkspace(
    repositories.decisions,
    repositories.evaluations,
    repositories.drafts,
    repositories.reviews,
    repositories.onboarding
  );
  if (
    workspace.readiness !== "kep1-go" ||
    !workspace.authority.controlledExpansionPlanningGranted
  ) {
    throw new Error("KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED");
  }
  const decisionSummary = workspace.decisions.find(
    (decision) => decision.current && decision.decision === "go"
  );
  if (!decisionSummary) {
    throw new Error("KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED");
  }
  const decision = await repositories.decisions.getDecision(
    decisionSummary.decisionId
  );
  if (!decision || decision.decision !== "go") {
    throw new Error("KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED");
  }
  return decision;
}

function validateCapacity(
  input: RecordKEP3CohortProposalInput,
  cohortSize: number
) {
  const roles = input.roleCapacity.map((capacity) => capacity.role);
  if (
    new Set(roles).size !== KEP3_PLANNING_ROLES.length ||
    KEP3_PLANNING_ROLES.some((role) => !roles.includes(role))
  ) {
    throw new Error("KEP3_PLANNING_ROLE_CAPACITY_INCOMPLETE");
  }
  if (
    input.roleCapacity.some(
      (capacity) => capacity.availableEntityCapacity < cohortSize
    )
  ) {
    throw new Error("KEP3_PLANNING_INSUFFICIENT_ROLE_CAPACITY");
  }
}

export async function recordKEP3CohortProposal(
  planningRepository: KEP3CohortPlanningRepository,
  prerequisiteRepositories: KEP3PlanningPrerequisiteRepositories,
  input: RecordKEP3CohortProposalInput,
  actor: KEP3PlanningActor,
  now: string
): Promise<KEP3CohortProposalRecord> {
  const decision = await currentGo(prerequisiteRepositories);
  if (decision.decisionId !== input.expectedKep1DecisionId) {
    throw new Error("KEP3_PLANNING_KEP1_DECISION_MISMATCH");
  }
  if (decision.decidedByActorId === actor.actorId) {
    throw new Error("KEP3_PLANNING_ACTOR_SEPARATION_REQUIRED");
  }

  const snapshot = inventorySnapshot(now.slice(0, 10));
  if (snapshot.sha256 !== input.expectedInventorySha256) {
    throw new Error("KEP3_PLANNING_INVENTORY_HASH_MISMATCH");
  }
  if (snapshot.inventory.summary.activeRagEntities !== 0) {
    throw new Error("KEP3_PLANNING_ZERO_PRODUCTION_RAG_REQUIRED");
  }

  const entityIds = input.selections.map((selection) => selection.entityId);
  if (new Set(entityIds).size !== entityIds.length) {
    throw new Error("KEP3_PLANNING_DUPLICATE_ENTITY");
  }
  validateCapacity(input, entityIds.length);
  if (input.confirmationPhrase !== CONFIRMATION) {
    throw new Error("KEP3_PLANNING_CONFIRMATION_MISMATCH");
  }

  const recordsById = new Map(
    snapshot.inventory.records.map((record) => [record.entityId, record])
  );
  const selections = input.selections.map((selection) => {
    const record = recordsById.get(selection.entityId);
    if (!record) {
      throw new Error("KEP3_PLANNING_ENTITY_NOT_FOUND");
    }
    if (record.safety.withdrawn) {
      throw new Error("KEP3_PLANNING_WITHDRAWN_ENTITY_FORBIDDEN");
    }
    if (FLAGSHIP_IDS.has(record.entityId)) {
      throw new Error("KEP3_PLANNING_FLAGSHIP_ENTITY_FORBIDDEN");
    }
    if (record.eligibility.eligibleForRag || record.eligibility.ragAllowlisted) {
      throw new Error("KEP3_PLANNING_RAG_ENTITY_FORBIDDEN");
    }
    return {
      entityId: record.entityId,
      entityType: record.entityType,
      title: record.title,
      inventoryPriorityScore: record.prioritisation.priorityScore,
      factors: { ...selection.factors },
      weightedScore: calculateKEP3WeightedScore(selection.factors),
      rationale: selection.rationale,
      evidenceRefs: [...selection.evidenceRefs],
    };
  });

  selections.sort(
    (left, right) =>
      right.weightedScore - left.weightedScore ||
      left.entityId.localeCompare(right.entityId)
  );
  const proposalContent = {
    cohortLabel: input.cohortLabel,
    kep1DecisionId: decision.decisionId,
    inventorySha256: snapshot.sha256,
    selections,
    roleCapacity: [...input.roleCapacity].sort((left, right) =>
      left.role.localeCompare(right.role)
    ),
    selectionMethodology: input.selectionMethodology,
    residualRisks: [...input.residualRisks],
    planningEvidenceRef: input.planningEvidenceRef,
    riskRegisterRef: input.riskRegisterRef,
  };
  const proposalId = `KEP3-PLAN-${sha256(proposalContent).slice(0, 24)}`;
  const proposal: KEP3CohortProposalRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-3",
    proposalId,
    status: "planning-proposal-only",
    cohortLabel: input.cohortLabel,
    kep1DecisionId: decision.decisionId,
    kep1EvaluationId: decision.evaluationId,
    kep1CorpusManifestSha256: decision.corpusManifestSha256,
    kep1QuerySetSha256: decision.querySetSha256,
    inventorySha256: snapshot.sha256,
    inventoryEntityCount: snapshot.inventory.summary.totalEntities,
    selections,
    roleCapacity: proposalContent.roleCapacity,
    selectionMethodology: input.selectionMethodology,
    residualRisks: [...input.residualRisks],
    planningEvidenceRef: input.planningEvidenceRef,
    riskRegisterRef: input.riskRegisterRef,
    confirmationPhrase: input.confirmationPhrase,
    proposedByActorId: actor.actorId,
    proposedAt: now,
    authority: {
      planningRecorded: true,
      assignmentAuthorityGranted: false,
      editorialApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      embeddingAuthorityGranted: false,
      productionRagAuthorityGranted: false,
      productionMigrationAuthorityGranted: false,
    },
  };
  const event: KEP3CohortPlanningAuditEvent = {
    eventId: `${proposalId}-AUD`,
    programId: "KEP-3",
    proposalId,
    kep1DecisionId: decision.decisionId,
    inventorySha256: snapshot.sha256,
    selectedEntityIds: selections.map((selection) => selection.entityId),
    actorId: actor.actorId,
    occurredAt: now,
  };
  await planningRepository.createProposal(proposal, event);
  return proposal;
}

export async function getKEP3CohortPlanningWorkspace(
  planningRepository: KEP3CohortPlanningRepository,
  prerequisiteRepositories: KEP3PlanningPrerequisiteRepositories,
  now: string
) {
  const snapshot = inventorySnapshot(now.slice(0, 10));
  const [proposals, decisionResult] = await Promise.all([
    planningRepository.listProposals(),
    currentGo(prerequisiteRepositories)
      .then((decision) => ({ decision, blockerCode: null }))
      .catch((error: unknown) => ({
        decision: null,
        blockerCode:
          error instanceof Error
            ? error.message
            : "KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED",
      })),
  ]);
  const candidates = snapshot.inventory.records
    .filter(
      (record) =>
        !record.safety.withdrawn &&
        !FLAGSHIP_IDS.has(record.entityId) &&
        !record.eligibility.eligibleForRag &&
        !record.eligibility.ragAllowlisted
    )
    .map((record) => ({
      entityId: record.entityId,
      entityType: record.entityType,
      title: record.title,
      safetyRiskTier: record.safety.riskTier,
      inventoryPriorityScore: record.prioritisation.priorityScore,
      recommendation: record.prioritisation.recommendation,
      reasons: record.prioritisation.reasons,
      structuredSectionCompleteness:
        record.content.structuredSectionCompleteness,
      graphIsolated: record.graph.isolated,
    }));

  return {
    programId: "KEP-3" as const,
    prerequisites: {
      ready:
        Boolean(decisionResult.decision) &&
        snapshot.inventory.summary.activeRagEntities === 0,
      blockerCode:
        decisionResult.blockerCode ||
        (snapshot.inventory.summary.activeRagEntities === 0
          ? null
          : "KEP3_PLANNING_ZERO_PRODUCTION_RAG_REQUIRED"),
      currentKep1Decision: decisionResult.decision
        ? {
            decisionId: decisionResult.decision.decisionId,
            evaluationId: decisionResult.decision.evaluationId,
            decidedAt: decisionResult.decision.decidedAt,
          }
        : null,
      inventorySha256: snapshot.sha256,
      inventoryEntityCount: snapshot.inventory.summary.totalEntities,
      eligibleCandidateCount: candidates.length,
    },
    candidates,
    proposals: proposals.map((proposal) => ({
      proposalId: proposal.proposalId,
      cohortLabel: proposal.cohortLabel,
      selectedEntityCount: proposal.selections.length,
      kep1DecisionId: proposal.kep1DecisionId,
      inventorySha256: proposal.inventorySha256,
      proposedAt: proposal.proposedAt,
      current:
        proposal.kep1DecisionId === decisionResult.decision?.decisionId &&
        proposal.inventorySha256 === snapshot.sha256,
    })),
    authority: {
      planningOnly: true,
      assignmentAuthorityGranted: false,
      editorialApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      embeddingAuthorityGranted: false,
      productionRagAuthorityGranted: false,
      productionMigrationAuthorityGranted: false,
    },
  };
}

export const KEP3_COHORT_PLANNING_CONFIRMATION_PHRASE = CONFIRMATION;
export const getKEP3InventorySnapshotSha256 = (asOfDate: string) =>
  inventorySnapshot(asOfDate).sha256;
