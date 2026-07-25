/**
 * Phase 2.2B — Authenticated Server-Only Governance Write Handlers
 */

import {
  deriveGovernanceAuthContext,
  assertGovernanceWriteAuthority,
  sanitizeGovernanceRequestBody,
  AuthenticatedGovernanceContext,
} from "../auth/governanceAuthAdapter";
import { GovernanceRepository } from "../repositories/GovernanceRepository";
import { submitDurableClinicalReview } from "../services/transactionalReviewService";
import { ContentRevision, EvidenceProfile, GovernanceAuditEvent, EditorialWorkflowState } from "../types/governanceTypes";
import { computeContentHash } from "../services/contentRevisionService";

export interface HandlerResponse<T = any> {
  statusCode: number;
  success: boolean;
  data?: T;
  error?: string;
}

export async function createDraftRevisionHandler(
  repo: GovernanceRepository,
  cookieHeader: string | undefined,
  authHeader: string | undefined,
  rawBody: any
): Promise<HandlerResponse<ContentRevision>> {
  const context = await deriveGovernanceAuthContext(cookieHeader, authHeader);
  try {
    assertGovernanceWriteAuthority(context, "create-revision");
  } catch (err: any) {
    return { statusCode: 403, success: false, error: err.message };
  }

  const body = sanitizeGovernanceRequestBody(rawBody);
  if (!body.entityId || !body.content) {
    return { statusCode: 400, success: false, error: "MISSING_ENTITY_ID_OR_CONTENT" };
  }

  const contentHash = computeContentHash(body.content);
  const revisionId = `REV-${body.entityId}-${contentHash.substring(0, 12)}`;

  const revision: ContentRevision = {
    revisionId,
    entityId: body.entityId,
    contentHash,
    createdAt: new Date().toISOString(),
    createdBy: context.contributorId,
    changeSummary: body.changeSummary || "Draft revision created",
    isMaterialChange: body.isMaterialChange ?? true,
  };

  try {
    await repo.runInTransaction(async (tx) => {
      await tx.createContentRevision(revision);
      const currentState = await tx.getEntityGovernanceState(body.entityId);
      await tx.updateEntityGovernanceState({
        entityId: body.entityId,
        currentRevisionId: revisionId,
        workflowState: currentState?.workflowState || "draft",
        authorIds: currentState?.authorIds || [context.contributorId],
        validClinicalReviewIds: currentState?.validClinicalReviewIds || [],
        withdrawn: currentState?.withdrawn || false,
        updatedAt: new Date().toISOString(),
      });
      await tx.appendAuditEvent({
        id: `AUD-REV-${Date.now()}`,
        entityId: body.entityId,
        revisionId,
        actorId: context.contributorId,
        action: "DRAFT_REVISION_CREATED",
        createdAt: new Date().toISOString(),
      });
    });

    return { statusCode: 200, success: true, data: revision };
  } catch (err: any) {
    return { statusCode: 500, success: false, error: err.message };
  }
}

export async function submitReviewDecisionHandler(
  repo: GovernanceRepository,
  cookieHeader: string | undefined,
  authHeader: string | undefined,
  rawBody: any
): Promise<HandlerResponse> {
  const context = await deriveGovernanceAuthContext(cookieHeader, authHeader);
  try {
    assertGovernanceWriteAuthority(context, "submit-review");
  } catch (err: any) {
    return { statusCode: 403, success: false, error: err.message };
  }

  const body = sanitizeGovernanceRequestBody(rawBody);
  const res = await submitDurableClinicalReview(context, repo, body);
  if (!res.success) {
    return { statusCode: 400, success: false, error: res.error };
  }
  return { statusCode: 200, success: true, data: { reviewId: res.reviewId } };
}

export async function createEvidenceProfileDraftHandler(
  repo: GovernanceRepository,
  cookieHeader: string | undefined,
  authHeader: string | undefined,
  rawBody: any
): Promise<HandlerResponse<EvidenceProfile>> {
  const context = await deriveGovernanceAuthContext(cookieHeader, authHeader);
  try {
    assertGovernanceWriteAuthority(context, "create-evidence-draft");
  } catch (err: any) {
    return { statusCode: 403, success: false, error: err.message };
  }

  const body = sanitizeGovernanceRequestBody(rawBody);
  if (!body.entityId || !body.revisionId) {
    return { statusCode: 400, success: false, error: "MISSING_ENTITY_ID_OR_REVISION_ID" };
  }

  const profileId = `EVD-${body.entityId}-${body.revisionId}`;
  const profile: EvidenceProfile = {
    id: profileId,
    entityId: body.entityId,
    revisionId: body.revisionId,
    evidenceQuestion: body.evidenceQuestion,
    evidenceLevel: body.evidenceLevel || "Traditional-Literature",
    sourceIds: body.sourceIds || [],
    evidenceSummary: body.evidenceSummary || "Draft evidence profile shell",
    limitations: body.limitations || [],
    reviewedBy: [],
    status: "draft",
  };

  try {
    await repo.createEvidenceProfile(profile);
    await repo.appendAuditEvent({
      id: `AUD-EVD-${Date.now()}`,
      entityId: body.entityId,
      revisionId: body.revisionId,
      actorId: context.contributorId,
      action: "EVIDENCE_PROFILE_DRAFT_CREATED",
      createdAt: new Date().toISOString(),
    });
    return { statusCode: 200, success: true, data: profile };
  } catch (err: any) {
    return { statusCode: 500, success: false, error: err.message };
  }
}

export async function emergencyWithdrawalHandler(
  repo: GovernanceRepository,
  cookieHeader: string | undefined,
  authHeader: string | undefined,
  rawBody: any
): Promise<HandlerResponse> {
  const context = await deriveGovernanceAuthContext(cookieHeader, authHeader);
  try {
    assertGovernanceWriteAuthority(context, "emergency-withdrawal");
  } catch (err: any) {
    return { statusCode: 403, success: false, error: err.message };
  }

  const body = sanitizeGovernanceRequestBody(rawBody);
  if (!body.entityId || !body.reason) {
    return { statusCode: 400, success: false, error: "MISSING_ENTITY_ID_OR_REASON" };
  }

  try {
    await repo.runInTransaction(async (tx) => {
      const state = (await tx.getEntityGovernanceState(body.entityId)) || {
        entityId: body.entityId,
        workflowState: "draft",
        authorIds: [],
        validClinicalReviewIds: [],
        withdrawn: false,
        updatedAt: new Date().toISOString(),
      };

      const updatedState = {
        ...state,
        withdrawn: true,
        workflowState: "withdrawn" as EditorialWorkflowState,
        updatedAt: new Date().toISOString(),
      };

      await tx.updateEntityGovernanceState(updatedState);
      await tx.appendAuditEvent({
        id: `AUD-WITHDRAW-${Date.now()}`,
        entityId: body.entityId,
        actorId: context.contributorId,
        action: "EMERGENCY_WITHDRAWAL_EXECUTED",
        previousState: state.workflowState,
        newState: "withdrawn",
        reason: body.reason,
        createdAt: new Date().toISOString(),
      });
    });

    return { statusCode: 200, success: true, data: { status: "withdrawn" } };
  } catch (err: any) {
    return { statusCode: 500, success: false, error: err.message };
  }
}

export async function getAuditHistoryHandler(
  repo: GovernanceRepository,
  cookieHeader: string | undefined,
  authHeader: string | undefined,
  entityId: string
): Promise<HandlerResponse<GovernanceAuditEvent[]>> {
  const context = await deriveGovernanceAuthContext(cookieHeader, authHeader);
  try {
    assertGovernanceWriteAuthority(context, "read-audit-trail");
  } catch (err: any) {
    return { statusCode: 403, success: false, error: err.message };
  }

  const events = await repo.listAuditEvents(entityId);
  return { statusCode: 200, success: true, data: events };
}
