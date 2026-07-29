import { createHash } from "node:crypto";
import { canonicalJsonStringify } from "../retrieval/canonicalEmbeddingText";
import type { KEP1PrivateOnboardingRepository } from "../onboarding/privateOnboardingTypes";
import {
  getKEP3CohortPlanningWorkspace,
  type KEP3PlanningPrerequisiteRepositories,
} from "../planning/kep3CohortPlanningService";
import type {
  KEP3CohortPlanningRepository,
  KEP3CohortProposalRecord,
} from "../planning/kep3CohortPlanningTypes";
import type { RecordKEP3CohortAuthorizationInput } from "./kep3CohortAuthorizationSchemas";
import type {
  KEP3CohortAuthorizationAuditEvent,
  KEP3CohortAuthorizationRecord,
  KEP3CohortAuthorizationRepository,
} from "./kep3CohortAuthorizationTypes";

const APPROVE_CONFIRMATION =
  "I AUTHORIZE KEP-3 COHORT PREPARATION WITHOUT ASSIGNMENT, PUBLICATION, OR RAG AUTHORITY";
const REJECT_CONFIRMATION = "I REJECT THIS KEP-3 COHORT PROPOSAL";

export interface KEP3AuthorizationActor {
  actorId: string;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(canonicalJsonStringify(value), "utf8")
    .digest("hex");
}

export function kep3CohortProposalSha256(
  proposal: KEP3CohortProposalRecord
): string {
  return sha256(proposal);
}

function allTrue(record: Record<string, boolean>): boolean {
  return Object.values(record).every(Boolean);
}

function ownerIsEligible(
  record: Awaited<ReturnType<KEP1PrivateOnboardingRepository["get"]>>
) {
  return Boolean(
    record &&
      record.kind === "program-owner" &&
      record.status === "eligible" &&
      record.identity.verificationStatus === "verified" &&
      record.identity.evidenceRef &&
      record.identity.verifiedAt &&
      record.attestations.conflictOfInterestDeclared &&
      record.attestations.editorialIndependenceAccepted &&
      record.attestations.aiAssistanceDisclosureAccepted &&
      record.attestations.sourceUsePolicyAccepted &&
      record.attestations.acceptanceEvidenceRef
  );
}

function proposalInvariantsHold(proposal: KEP3CohortProposalRecord): boolean {
  const cohortSize = proposal.selections.length;
  return (
    proposal.status === "planning-proposal-only" &&
    cohortSize >= 1 &&
    cohortSize <= 25 &&
    new Set(proposal.selections.map((selection) => selection.entityId)).size ===
      cohortSize &&
    proposal.roleCapacity.length === 4 &&
    proposal.roleCapacity.every(
      (capacity) => capacity.availableEntityCapacity >= cohortSize
    ) &&
    !proposal.authority.assignmentAuthorityGranted &&
    !proposal.authority.editorialApprovalGranted &&
    !proposal.authority.publicationAuthorityGranted &&
    !proposal.authority.publicIndexAuthorityGranted &&
    !proposal.authority.embeddingAuthorityGranted &&
    !proposal.authority.productionRagAuthorityGranted &&
    !proposal.authority.productionMigrationAuthorityGranted
  );
}

async function latestCurrentProposal(
  planningRepository: KEP3CohortPlanningRepository,
  prerequisiteRepositories: KEP3PlanningPrerequisiteRepositories,
  now: string
) {
  const workspace = await getKEP3CohortPlanningWorkspace(
    planningRepository,
    prerequisiteRepositories,
    now
  );
  if (!workspace.prerequisites.ready) {
    throw new Error("KEP3_AUTHORIZATION_CURRENT_PLANNING_GATE_REQUIRED");
  }
  const latest = workspace.proposals.find((proposal) => proposal.current);
  if (!latest) {
    throw new Error("KEP3_AUTHORIZATION_CURRENT_PROPOSAL_REQUIRED");
  }
  const proposal = await planningRepository.getProposal(latest.proposalId);
  if (!proposal || !proposalInvariantsHold(proposal)) {
    throw new Error("KEP3_AUTHORIZATION_PROPOSAL_INVARIANT_FAILURE");
  }
  return proposal;
}

export async function recordKEP3CohortAuthorization(
  authorizationRepository: KEP3CohortAuthorizationRepository,
  planningRepository: KEP3CohortPlanningRepository,
  prerequisiteRepositories: KEP3PlanningPrerequisiteRepositories,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: RecordKEP3CohortAuthorizationInput,
  actor: KEP3AuthorizationActor,
  now: string
): Promise<KEP3CohortAuthorizationRecord> {
  const proposal = await latestCurrentProposal(
    planningRepository,
    prerequisiteRepositories,
    now
  );
  if (proposal.proposalId !== input.proposalId) {
    throw new Error("KEP3_AUTHORIZATION_LATEST_PROPOSAL_REQUIRED");
  }
  const proposalSha256 = kep3CohortProposalSha256(proposal);
  if (proposalSha256 !== input.expectedProposalSha256) {
    throw new Error("KEP3_AUTHORIZATION_PROPOSAL_HASH_MISMATCH");
  }
  if (proposal.proposedByActorId === actor.actorId) {
    throw new Error("KEP3_AUTHORIZATION_PROPOSER_SEPARATION_REQUIRED");
  }
  const owner = await onboardingRepository.get(input.programOwnerRecordId);
  if (!ownerIsEligible(owner)) {
    throw new Error("KEP3_AUTHORIZATION_ELIGIBLE_PROGRAM_OWNER_REQUIRED");
  }

  if (input.decision === "approved") {
    if (!allTrue(input.checklist)) {
      throw new Error("KEP3_AUTHORIZATION_CHECKLIST_INCOMPLETE");
    }
    if (input.blockers.length > 0) {
      throw new Error("KEP3_AUTHORIZATION_UNRESOLVED_BLOCKERS");
    }
    if (input.confirmationPhrase !== APPROVE_CONFIRMATION) {
      throw new Error("KEP3_AUTHORIZATION_CONFIRMATION_MISMATCH");
    }
  } else {
    if (input.blockers.length === 0) {
      throw new Error("KEP3_AUTHORIZATION_BLOCKERS_REQUIRED");
    }
    if (input.confirmationPhrase !== REJECT_CONFIRMATION) {
      throw new Error("KEP3_AUTHORIZATION_CONFIRMATION_MISMATCH");
    }
  }

  const authorizationId = `KEP3-AUTH-${proposal.proposalId}`;
  const authorization: KEP3CohortAuthorizationRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-3",
    authorizationId,
    decision: input.decision,
    proposalId: proposal.proposalId,
    proposalSha256,
    kep1DecisionId: proposal.kep1DecisionId,
    inventorySha256: proposal.inventorySha256,
    selectedEntityIds: proposal.selections.map(
      (selection) => selection.entityId
    ),
    programOwnerRecordId: owner!.recordId,
    programOwnerRecordVersion: owner!.version,
    checklist: { ...input.checklist },
    blockers: [...input.blockers],
    residualRisks: [...input.residualRisks],
    rationale: input.rationale,
    authorizationEvidenceRef: input.authorizationEvidenceRef,
    meetingMinutesRef: input.meetingMinutesRef,
    confirmationPhrase: input.confirmationPhrase,
    authorizedByActorId: actor.actorId,
    authorizedAt: now,
    authority: {
      cohortPreparationGranted: input.decision === "approved",
      assignmentAuthorityGranted: false,
      editorialApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      embeddingAuthorityGranted: false,
      productionRagAuthorityGranted: false,
      productionMigrationAuthorityGranted: false,
    },
  };
  const event: KEP3CohortAuthorizationAuditEvent = {
    eventId: `${authorizationId}-AUD`,
    programId: "KEP-3",
    authorizationId,
    decision: authorization.decision,
    proposalId: proposal.proposalId,
    proposalSha256,
    kep1DecisionId: proposal.kep1DecisionId,
    inventorySha256: proposal.inventorySha256,
    programOwnerRecordId: owner!.recordId,
    actorId: actor.actorId,
    occurredAt: now,
  };
  await authorizationRepository.createAuthorization(authorization, event);
  return authorization;
}

export async function getKEP3CohortAuthorizationWorkspace(
  authorizationRepository: KEP3CohortAuthorizationRepository,
  planningRepository: KEP3CohortPlanningRepository,
  prerequisiteRepositories: KEP3PlanningPrerequisiteRepositories,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  now: string
) {
  const [authorizations, onboardingRecords, proposalResult] =
    await Promise.all([
      authorizationRepository.listAuthorizations(),
      onboardingRepository.list(),
      latestCurrentProposal(
        planningRepository,
        prerequisiteRepositories,
        now
      )
        .then((proposal) => ({ proposal, blockerCode: null }))
        .catch((error: unknown) => ({
          proposal: null,
          blockerCode:
            error instanceof Error
              ? error.message
              : "KEP3_AUTHORIZATION_CURRENT_PROPOSAL_REQUIRED",
        })),
    ]);
  const eligibleOwners = onboardingRecords
    .filter((record) => ownerIsEligible(record))
    .map((record) => ({
      recordId: record.recordId,
      version: record.version,
      updatedAt: record.updatedAt,
    }));
  const currentAuthorization = proposalResult.proposal
    ? authorizations.find(
        (authorization) =>
          authorization.proposalId === proposalResult.proposal?.proposalId
      ) || null
    : null;
  const ready =
    Boolean(proposalResult.proposal) &&
    eligibleOwners.length > 0 &&
    !currentAuthorization;

  return {
    programId: "KEP-3" as const,
    prerequisites: {
      ready,
      blockerCode:
        proposalResult.blockerCode ||
        (eligibleOwners.length === 0
          ? "KEP3_AUTHORIZATION_ELIGIBLE_PROGRAM_OWNER_REQUIRED"
          : currentAuthorization
            ? "KEP3_AUTHORIZATION_ALREADY_RECORDED"
            : null),
      currentProposal: proposalResult.proposal
        ? {
            proposalId: proposalResult.proposal.proposalId,
            proposalSha256: kep3CohortProposalSha256(
              proposalResult.proposal
            ),
            cohortLabel: proposalResult.proposal.cohortLabel,
            selectedEntityIds: proposalResult.proposal.selections.map(
              (selection) => selection.entityId
            ),
            kep1DecisionId: proposalResult.proposal.kep1DecisionId,
            inventorySha256: proposalResult.proposal.inventorySha256,
            proposedByActorId: proposalResult.proposal.proposedByActorId,
            proposedAt: proposalResult.proposal.proposedAt,
            residualRiskCount:
              proposalResult.proposal.residualRisks.length,
          }
        : null,
      eligibleOwners,
    },
    authorizations: authorizations.map((authorization) => ({
      authorizationId: authorization.authorizationId,
      decision: authorization.decision,
      proposalId: authorization.proposalId,
      proposalSha256: authorization.proposalSha256,
      selectedEntityCount: authorization.selectedEntityIds.length,
      programOwnerRecordId: authorization.programOwnerRecordId,
      blockerCount: authorization.blockers.length,
      residualRiskCount: authorization.residualRisks.length,
      authorizedAt: authorization.authorizedAt,
      current:
        authorization.proposalId ===
        proposalResult.proposal?.proposalId,
    })),
    readiness:
      currentAuthorization?.decision === "approved"
        ? "cohort-preparation-authorized"
        : currentAuthorization?.decision === "rejected"
          ? "cohort-proposal-rejected"
          : "authorization-pending",
    authority: {
      cohortPreparationGranted:
        currentAuthorization?.decision === "approved",
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

export const KEP3_COHORT_APPROVE_CONFIRMATION_PHRASE =
  APPROVE_CONFIRMATION;
export const KEP3_COHORT_REJECT_CONFIRMATION_PHRASE =
  REJECT_CONFIRMATION;
