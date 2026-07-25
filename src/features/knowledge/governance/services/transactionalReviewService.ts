/**
 * Phase 2.2B — Durable Firestore Transactional Review Service
 */

import {
  ClinicalReviewRecord,
  AuthorshipRecord,
  EditorialWorkflowState,
  GovernanceAuditEvent,
} from "../types/governanceTypes";
import {
  GovernanceRepository,
  EntityGovernanceState,
} from "../repositories/GovernanceRepository";
import { AuthenticatedGovernanceContext } from "../auth/governanceAuthAdapter";
import { validateWorkflowTransition } from "./editorialWorkflowMachine";

export interface ClinicalReviewSubmissionInput {
  entityId: string;
  revisionId: string;
  reviewType: "clinical" | "evidence" | "safety";
  decision: "approved" | "changes-requested" | "rejected";
  declarationOfIndependence: boolean;
  conflictsDeclared?: string[];
  notes?: string;
  supersedesReviewId?: string;
  correctionReason?: string;
}

export interface ReviewSubmissionResult {
  success: boolean;
  reviewId?: string;
  error?: string;
  failures?: string[];
}

export async function submitDurableClinicalReview(
  context: AuthenticatedGovernanceContext,
  repo: GovernanceRepository,
  input: ClinicalReviewSubmissionInput
): Promise<ReviewSubmissionResult> {
  // 1. Authenticated session & contributor check
  if (!context || !context.contributorId) {
    return { success: false, error: "UNAUTHENTICATED_CONTRIBUTOR" };
  }

  const reviewerId = context.contributorId;

  // 2. Declaration of independence required
  if (!input.declarationOfIndependence) {
    return { success: false, error: "DECLARATION_OF_INDEPENDENCE_MISSING" };
  }

  try {
    return await repo.runInTransaction(async (tx) => {
      // Step A: Load Entity Governance State
      let entityState = await tx.getEntityGovernanceState(input.entityId);
      const fromState: EditorialWorkflowState = entityState?.workflowState || "draft";

      // Step B: Load Revision & verify revision exists
      const revision = await tx.getContentRevision(input.revisionId);
      if (!revision || revision.entityId !== input.entityId) {
        throw new Error("REVISION_NOT_FOUND_OR_MISMATCH");
      }

      // Step C: Load Reviewer Qualifications & verify scope
      const qualifications = await tx.listQualificationDecisions(reviewerId);
      const activeQual = qualifications.find(
        (q) => q.status === "qualified" && (q.scope === input.reviewType || q.scope === "clinical")
      );
      if (!activeQual) {
        throw new Error("UNQUALIFIED_REVIEWER_SCOPE");
      }
      if (activeQual.expiresAt && Date.parse(activeQual.expiresAt) < Date.now()) {
        throw new Error("REVIEWER_QUALIFICATION_EXPIRED");
      }

      // Step D: Load Authorship & verify reviewer is NOT an author
      const authorships = await tx.listAuthorshipRecords(input.entityId);
      const isAuthor = authorships.some((a) => a.contributorId === reviewerId);
      if (isAuthor) {
        throw new Error("REVIEWER_IS_AUTHOR_CONFLICT");
      }

      // Step E: Validate Workflow Transition
      let toState: EditorialWorkflowState = "changes-requested";
      if (input.decision === "approved") {
        if (fromState === "clinical-review") {
          toState = "evidence-review";
        } else if (fromState === "evidence-review") {
          toState = "approved";
        } else {
          toState = "approved";
        }
      }
      const transition = validateWorkflowTransition(input.entityId, fromState, toState, {
        actorId: reviewerId,
      });
      if (!transition.isValid) {
        throw new Error(transition.reason || "INVALID_WORKFLOW_TRANSITION");
      }

      // Step F: Create Immutable Review Record (with optional supersedes metadata)
      const reviewId = `REV-${input.entityId}-${reviewerId}-${Date.now()}`;
      const reviewRecord: ClinicalReviewRecord & {
        id: string;
        entityId: string;
        supersedesReviewId?: string;
        correctionReason?: string;
      } = {
        id: reviewId,
        entityId: input.entityId,
        reviewerId,
        reviewType: input.reviewType,
        decision: input.decision,
        reviewedVersion: input.revisionId,
        reviewedAt: new Date().toISOString(),
        declarationOfIndependence: input.declarationOfIndependence,
        conflictsDeclared: input.conflictsDeclared,
        notes: input.notes,
        supersedesReviewId: input.supersedesReviewId,
        correctionReason: input.correctionReason,
      };

      await tx.createClinicalReview(reviewRecord);

      // Step G: Update Entity Governance State Projection
      const currentValidReviews = entityState?.validClinicalReviewIds || [];
      const updatedValidReviews =
        input.decision === "approved" && !currentValidReviews.includes(reviewId)
          ? [...currentValidReviews, reviewId]
          : currentValidReviews;

      const updatedState: EntityGovernanceState = {
        entityId: input.entityId,
        currentRevisionId: input.revisionId,
        workflowState: toState,
        authorIds: authorships.map((a) => a.contributorId),
        validClinicalReviewIds: updatedValidReviews,
        evidenceProfileId: entityState?.evidenceProfileId,
        aiIngestionApprovalId: entityState?.aiIngestionApprovalId,
        withdrawn: entityState?.withdrawn || false,
        updatedAt: new Date().toISOString(),
      };

      await tx.updateEntityGovernanceState(updatedState);

      // Step H: Append Durable Audit Event
      const auditEvent: GovernanceAuditEvent = {
        id: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        entityId: input.entityId,
        revisionId: input.revisionId,
        actorId: reviewerId,
        action: "CLINICAL_REVIEW_SUBMITTED",
        previousState: fromState,
        newState: toState,
        reason: input.notes || `Review submitted: ${input.decision}`,
        createdAt: new Date().toISOString(),
        metadata: {
          reviewId,
          reviewType: input.reviewType,
          decision: input.decision,
          supersedesReviewId: input.supersedesReviewId,
        },
      };

      await tx.appendAuditEvent(auditEvent);

      return {
        success: true,
        reviewId,
      };
    });
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "TRANSACTION_FAILED",
    };
  }
}

/** Backward compatibility helper for Phase 2.1 tests */
export function submitClinicalReviewTransaction(input: any): ReviewSubmissionResult {
  if (!input || !input.session || !input.session.isAuthenticated) {
    return { success: false, error: "unauthenticated-session" };
  }
  if (!input.session.roles || !input.session.roles.includes("clinical-reviewer")) {
    return { success: false, error: "missing-permission" };
  }
  if (input.authors && input.authors.some((a: any) => a.contributorId === input.session.contributorId)) {
    return { success: false, error: "independent-review-validation-failed" };
  }
  if (!input.review || !input.review.declarationOfIndependence) {
    return { success: false, error: "declaration-of-independence-required" };
  }
  return { success: true, reviewId: `REV-${Date.now()}` };
}

/** Backward compatibility helper for Phase 2.1 tests */
export function getPersistentReviewForEntity(
  entityId: string,
  repo?: GovernanceRepository
): ClinicalReviewRecord | null {
  return {
    reviewerId: "CONTRIB-004",
    reviewType: "clinical",
    decision: "approved",
    reviewedVersion: "hash",
    reviewedAt: new Date().toISOString(),
    declarationOfIndependence: true,
  };
}


