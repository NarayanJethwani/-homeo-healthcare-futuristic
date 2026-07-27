import { kep1AssignmentId } from "../acquisition/kep1AcquisitionService";
import type { KEP1AcquisitionRepository } from "../acquisition/kep1AcquisitionTypes";
import type { KEP1DraftingRepository } from "../drafting/kep1DraftingTypes";
import type { KEP1PrivateOnboardingRepository } from "../onboarding/privateOnboardingTypes";
import type { SubmitKEP1IndependentReviewInput } from "./kep1ReviewSchemas";
import type {
  KEP1IndependentReviewRecord,
  KEP1ReviewAuditEvent,
  KEP1ReviewKind,
  KEP1ReviewRepository,
} from "./kep1ReviewTypes";

export interface KEP1ReviewActor {
  actorId: string;
}

const MATERIAL_CLAIM_TYPES = new Set([
  "diagnosis",
  "risk",
  "treatment",
  "safety",
  "emergency",
  "laboratory-interpretation",
]);

function reviewId(revisionId: string, kind: KEP1ReviewKind): string {
  return `KEP1-REVIEW-${revisionId}-${kind}`;
}

function sameMembers(actual: string[], expected: string[]): boolean {
  return (
    new Set(actual).size === actual.length &&
    actual.length === expected.length &&
    actual.every((value) => expected.includes(value))
  );
}

function allTrue(record: Record<string, boolean>): boolean {
  return Object.values(record).every(Boolean);
}

function reviewerRole(kind: KEP1ReviewKind) {
  return kind === "clinical"
    ? ("independent-clinical-reviewer" as const)
    : ("evidence-reviewer" as const);
}

function assertCurrentReviewer(
  record: Awaited<ReturnType<KEP1PrivateOnboardingRepository["get"]>>,
  kind: KEP1ReviewKind,
  asOfDate: string
) {
  const role = reviewerRole(kind);
  if (
    !record ||
    record.kind !== "contributor" ||
    record.status !== "eligible" ||
    record.identity.verificationStatus !== "verified" ||
    !record.eligibleRoles.includes(role)
  ) {
    throw new Error("REVIEW_ELIGIBLE_REVIEWER_REQUIRED");
  }
  if (
    !record.credentials.some(
      (credential) =>
        credential.verificationStatus === "verified" &&
        Boolean(credential.evidenceRef) &&
        Boolean(credential.verifiedAt) &&
        credential.verifiedAt! <= asOfDate &&
        (!credential.expiresAt || credential.expiresAt >= asOfDate)
    )
  ) {
    throw new Error("REVIEW_CURRENT_CREDENTIAL_REQUIRED");
  }
  if (
    !record.attestations.conflictOfInterestDeclared ||
    !record.attestations.editorialIndependenceAccepted ||
    !record.attestations.aiAssistanceDisclosureAccepted ||
    !record.attestations.sourceUsePolicyAccepted
  ) {
    throw new Error("REVIEW_ATTESTATIONS_REQUIRED");
  }
  return record;
}

export async function submitKEP1IndependentReview(
  reviewRepository: KEP1ReviewRepository,
  draftingRepository: KEP1DraftingRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: SubmitKEP1IndependentReviewInput,
  actor: KEP1ReviewActor,
  now: string
): Promise<KEP1IndependentReviewRecord> {
  const revision = await draftingRepository.getRevision(input.revisionId);
  if (!revision || revision.entityId !== input.entityId) {
    throw new Error("REVIEW_DRAFT_REVISION_NOT_FOUND");
  }
  const head = await draftingRepository.getHead(revision.draftId);
  if (!head || head.currentRevisionId !== revision.revisionId) {
    throw new Error("REVIEW_CURRENT_REVISION_REQUIRED");
  }
  if (revision.contentSha256 !== input.expectedContentSha256) {
    throw new Error("REVIEW_CONTENT_HASH_MISMATCH");
  }
  const rights = await acquisitionRepository.getSource(revision.sourceId);
  if (
    !rights ||
    rights.decision !== "controlled-extraction-approved" ||
    rights.version !== revision.rightsDecisionVersion
  ) {
    throw new Error("REVIEW_SOURCE_RIGHTS_DRIFT");
  }

  const role = reviewerRole(input.reviewKind);
  const assignmentId = kep1AssignmentId(input.entityId, role);
  const assignment = await acquisitionRepository.getAssignment(assignmentId);
  if (
    !assignment ||
    assignment.status !== "approved" ||
    assignment.contributorId !== input.reviewerContributorId
  ) {
    throw new Error("REVIEW_APPROVED_ASSIGNMENT_REQUIRED");
  }
  await assertCurrentReviewer(
    await onboardingRepository.get(input.reviewerContributorId),
    input.reviewKind,
    now.slice(0, 10)
  );
  if (input.reviewerContributorId === revision.authorContributorId) {
    throw new Error("REVIEW_AUTHOR_CONFLICT");
  }

  const existingReviews = await reviewRepository.listReviews();
  const opposite = existingReviews.find(
    (review) =>
      review.revisionId === revision.revisionId &&
      review.reviewKind !== input.reviewKind
  );
  if (opposite?.reviewerContributorId === input.reviewerContributorId) {
    throw new Error("REVIEW_DUAL_ROLE_CONFLICT");
  }
  if (
    input.decision === "approved" &&
    input.conflictsDeclared.length > 0
  ) {
    throw new Error("REVIEW_UNRESOLVED_CONFLICTS");
  }

  const expectedClaimIds = revision.claims.map((claim) => claim.claimId);
  if (!sameMembers(input.reviewedClaimIds, expectedClaimIds)) {
    throw new Error("REVIEW_CLAIM_COVERAGE_INCOMPLETE");
  }
  const expectedGraphIds = revision.graphProposals.map(
    (proposal) => proposal.proposalId
  );
  if (
    input.reviewKind === "clinical" &&
    !sameMembers(input.reviewedGraphProposalIds, expectedGraphIds)
  ) {
    throw new Error("REVIEW_GRAPH_COVERAGE_INCOMPLETE");
  }

  if (input.reviewKind === "clinical") {
    if (!input.clinicalChecklist || input.evidenceChecklist) {
      throw new Error("REVIEW_CLINICAL_CHECKLIST_REQUIRED");
    }
    if (
      input.decision === "approved" &&
      !allTrue(input.clinicalChecklist)
    ) {
      throw new Error("REVIEW_CLINICAL_CHECKLIST_INCOMPLETE");
    }
  } else {
    if (!input.evidenceChecklist || input.clinicalChecklist) {
      throw new Error("REVIEW_EVIDENCE_CHECKLIST_REQUIRED");
    }
    if (
      input.decision === "approved" &&
      !allTrue(input.evidenceChecklist)
    ) {
      throw new Error("REVIEW_EVIDENCE_CHECKLIST_INCOMPLETE");
    }
    if (
      input.decision === "approved" &&
      revision.claims.some(
        (claim) =>
          (MATERIAL_CLAIM_TYPES.has(claim.claimType) &&
            !["supported", "partially-supported"].includes(
              claim.evidenceStatus
            )) ||
          (claim.claimType === "traditional-use" &&
            claim.evidenceStatus !== "traditional-description")
      )
    ) {
      throw new Error("REVIEW_EVIDENCE_CLAIM_NOT_APPROVABLE");
    }
  }

  const id = reviewId(revision.revisionId, input.reviewKind);
  const review: KEP1IndependentReviewRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    reviewId: id,
    reviewKind: input.reviewKind,
    entityId: input.entityId,
    draftId: revision.draftId,
    revisionId: revision.revisionId,
    reviewedContentSha256: revision.contentSha256,
    decision: input.decision,
    reviewerAssignmentId: assignment.assignmentId,
    reviewerAssignmentVersion: assignment.version,
    reviewerContributorId: assignment.contributorId,
    authorContributorId: revision.authorContributorId,
    declarationOfIndependence: true,
    conflictsDeclared: input.conflictsDeclared,
    reviewedClaimIds: [...input.reviewedClaimIds],
    reviewedGraphProposalIds: [...input.reviewedGraphProposalIds],
    clinicalChecklist: input.clinicalChecklist,
    evidenceChecklist: input.evidenceChecklist,
    notes: input.notes,
    reviewedByActorId: actor.actorId,
    reviewedAt: now,
  };
  const event: KEP1ReviewAuditEvent = {
    eventId: `KEP1-REVIEW-AUD-${revision.revisionId}-${input.reviewKind}`,
    programId: "KEP-1",
    entityId: revision.entityId,
    revisionId: revision.revisionId,
    reviewId: id,
    reviewKind: input.reviewKind,
    decision: input.decision,
    actorId: actor.actorId,
    occurredAt: now,
    reviewedContentSha256: revision.contentSha256,
  };
  await reviewRepository.createReview(review, event);
  return review;
}

export async function getKEP1ReviewWorkspace(
  reviewRepository: KEP1ReviewRepository,
  draftingRepository: KEP1DraftingRepository,
  acquisitionRepository: KEP1AcquisitionRepository
) {
  const [reviews, heads, revisions, assignments] = await Promise.all([
    reviewRepository.listReviews(),
    draftingRepository.listHeads(),
    draftingRepository.listRevisions(),
    acquisitionRepository.listAssignments(),
  ]);
  const drafts = heads
    .map((head) =>
      revisions.find(
        (revision) => revision.revisionId === head.currentRevisionId
      )
    )
    .filter((revision) => Boolean(revision))
    .map((revision) => {
      const current = revision!;
      const clinical = reviews.find(
        (review) =>
          review.revisionId === current.revisionId &&
          review.reviewKind === "clinical"
      );
      const evidence = reviews.find(
        (review) =>
          review.revisionId === current.revisionId &&
          review.reviewKind === "evidence"
      );
      const decisions = [clinical?.decision, evidence?.decision];
      const readiness =
        decisions.includes("rejected")
          ? "rejected"
          : decisions.includes("changes-requested")
            ? "changes-requested"
            : clinical?.decision === "approved" &&
                evidence?.decision === "approved" &&
                clinical.reviewerContributorId !==
                  evidence.reviewerContributorId
              ? "review-complete"
              : "pending";
      return {
        entityId: current.entityId,
        entityType: current.entityType,
        title: current.title,
        revisionId: current.revisionId,
        revisionNumber: current.revisionNumber,
        contentSha256: current.contentSha256,
        claimIds: current.claims.map((claim) => claim.claimId),
        graphProposalIds: current.graphProposals.map(
          (proposal) => proposal.proposalId
        ),
        clinicalReviewerContributorId:
          assignments.find(
            (assignment) =>
              assignment.entityId === current.entityId &&
              assignment.role === "independent-clinical-reviewer" &&
              assignment.status === "approved"
          )?.contributorId || null,
        evidenceReviewerContributorId:
          assignments.find(
            (assignment) =>
              assignment.entityId === current.entityId &&
              assignment.role === "evidence-reviewer" &&
              assignment.status === "approved"
          )?.contributorId || null,
        clinicalDecision: clinical?.decision || null,
        evidenceDecision: evidence?.decision || null,
        readiness,
      };
    });
  return {
    programId: "KEP-1" as const,
    drafts,
    reviews: reviews.map((review) => ({
      reviewId: review.reviewId,
      reviewKind: review.reviewKind,
      entityId: review.entityId,
      revisionId: review.revisionId,
      reviewedContentSha256: review.reviewedContentSha256,
      decision: review.decision,
      reviewedClaimCount: review.reviewedClaimIds.length,
      reviewedGraphProposalCount: review.reviewedGraphProposalIds.length,
      reviewedAt: review.reviewedAt,
    })),
    summary: {
      currentDraftCount: drafts.length,
      clinicalReviewCount: reviews.filter(
        (review) => review.reviewKind === "clinical"
      ).length,
      evidenceReviewCount: reviews.filter(
        (review) => review.reviewKind === "evidence"
      ).length,
      reviewCompleteCount: drafts.filter(
        (draft) => draft.readiness === "review-complete"
      ).length,
      changesRequestedCount: drafts.filter(
        (draft) => draft.readiness === "changes-requested"
      ).length,
    },
    authority: {
      reviewReadinessOnly: true,
      editorialWorkflowApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      productionRagAuthorityGranted: false,
    },
  };
}
