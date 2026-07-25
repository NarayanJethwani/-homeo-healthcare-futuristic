import { ContributorId } from "../types/governanceTypes";

export type GovernancePermission =
  | "knowledge.contributor.read"
  | "knowledge.contributor.manage"
  | "knowledge.revision.create"
  | "knowledge.review.submit"
  | "knowledge.review.approve"
  | "knowledge.evidence.edit"
  | "knowledge.evidence.approve"
  | "knowledge.workflow.transition"
  | "knowledge.withdraw"
  | "knowledge.emergency-containment"
  | "knowledge.ai-approval.create"
  | "knowledge.audit.read";

export type GovernanceRole =
  | "content-author"
  | "editor"
  | "clinical-reviewer"
  | "evidence-reviewer"
  | "governance-admin"
  | "emergency-admin"
  | "auditor";

export interface AuthenticatedGovernanceSession {
  userId: string;
  contributorId: ContributorId;
  roles: GovernanceRole[];
  isAuthenticated: boolean;
}

const ROLE_PERMISSIONS_MAP: Record<GovernanceRole, Set<GovernancePermission>> = {
  "content-author": new Set(["knowledge.contributor.read", "knowledge.revision.create"]),
  editor: new Set([
    "knowledge.contributor.read",
    "knowledge.revision.create",
    "knowledge.evidence.edit",
    "knowledge.workflow.transition",
  ]),
  "clinical-reviewer": new Set([
    "knowledge.contributor.read",
    "knowledge.review.submit",
    "knowledge.review.approve",
    "knowledge.workflow.transition",
    "knowledge.audit.read",
  ]),
  "evidence-reviewer": new Set([
    "knowledge.contributor.read",
    "knowledge.evidence.edit",
    "knowledge.evidence.approve",
    "knowledge.audit.read",
  ]),
  "governance-admin": new Set([
    "knowledge.contributor.read",
    "knowledge.contributor.manage",
    "knowledge.revision.create",
    "knowledge.review.submit",
    "knowledge.review.approve",
    "knowledge.evidence.edit",
    "knowledge.evidence.approve",
    "knowledge.workflow.transition",
    "knowledge.withdraw",
    "knowledge.ai-approval.create",
    "knowledge.audit.read",
  ]),
  "emergency-admin": new Set([
    "knowledge.contributor.read",
    "knowledge.withdraw",
    "knowledge.emergency-containment",
    "knowledge.audit.read",
  ]),
  auditor: new Set(["knowledge.contributor.read", "knowledge.audit.read"]),
};

/**
 * Validates if an authenticated session possesses a required governance permission.
 * Never trusts unauthenticated or client-supplied actorId strings.
 */
export function hasGovernancePermission(
  session: AuthenticatedGovernanceSession | null | undefined,
  requiredPermission: GovernancePermission
): boolean {
  if (!session || !session.isAuthenticated || !session.contributorId) {
    return false;
  }

  for (const role of session.roles) {
    const permissions = ROLE_PERMISSIONS_MAP[role];
    if (permissions && permissions.has(requiredPermission)) {
      return true;
    }
  }

  return false;
}
