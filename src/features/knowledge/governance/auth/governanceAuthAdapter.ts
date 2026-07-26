/**
 * Phase 2.2B — Authenticated Governance Context & Server Boundary Adapter
 */

import { verifyAdminSessionCookie } from "../../../../lib/adminSession";
import { ContributorId } from "../types/governanceTypes";
import { getContributorById } from "../services/contributorRegistry";

export type GovernanceRole =
  | "admin"
  | "editor"
  | "clinical-reviewer"
  | "evidence-reviewer"
  | "author";

export type GovernancePermission =
  | "create-revision"
  | "submit-review"
  | "create-evidence-draft"
  | "transition-workflow"
  | "emergency-withdrawal"
  | "read-audit-trail";

export interface AuthenticatedGovernanceContext {
  accountId: string;
  contributorId?: ContributorId;
  roles: GovernanceRole[];
  permissions: GovernancePermission[];
}

export class GovernanceAuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "GovernanceAuthError";
  }
}

/**
 * Derives verified AuthenticatedGovernanceContext strictly from server session.
 * Rejects body-supplied identity or role overrides.
 */
export async function deriveGovernanceAuthContext(
  cookieValue?: string,
  authHeader?: string
): Promise<AuthenticatedGovernanceContext | null> {
  let token = cookieValue;
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return null;
  }

  const session = await verifyAdminSessionCookie(token);
  if (!session) {
    return null;
  }

  const accountId = session.uid;
  const rawRole = session.role;

  // Map session role to governance roles & permissions
  const roles: GovernanceRole[] = [];
  const permissions: GovernancePermission[] = [];

  if (rawRole === "admin" || rawRole === "super-admin") {
    roles.push("admin", "editor");
    permissions.push(
      "create-revision",
      "submit-review",
      "create-evidence-draft",
      "transition-workflow",
      "emergency-withdrawal",
      "read-audit-trail"
    );
  } else if (rawRole === "editor") {
    roles.push("editor");
    permissions.push(
      "create-revision",
      "create-evidence-draft",
      "transition-workflow",
      "read-audit-trail"
    );
  } else if (rawRole === "doctor" || rawRole === "clinical-reviewer") {
    roles.push("clinical-reviewer");
    permissions.push("submit-review", "read-audit-trail");
  }

  // Account to Contributor Mapping
  let contributorId: ContributorId | undefined;
  if (accountId.startsWith("CONTRIB-") || accountId === "doc-narayan-001" || session.email === "drnarayanjethwani@gmail.com") {
    contributorId = accountId.startsWith("CONTRIB-") ? accountId : "CONTRIB-001";
  } else {
    const found = getContributorById(accountId);
    if (found) {
      contributorId = found.id;
    }
  }

  return {
    accountId,
    contributorId,
    roles,
    permissions,
  };
}

/**
 * Validates that authenticated context exists, has linked contributor, and holds required permission.
 * Fails closed if contributor is unmapped or permission missing.
 */
export function assertGovernanceWriteAuthority(
  context: AuthenticatedGovernanceContext | null,
  requiredPermission: GovernancePermission
): asserts context is AuthenticatedGovernanceContext & { contributorId: ContributorId } {
  if (!context) {
    throw new GovernanceAuthError("UNAUTHENTICATED", "Unauthenticated governance request.");
  }
  if (!context.contributorId) {
    throw new GovernanceAuthError(
      "UNMAPPED_CONTRIBUTOR",
      "Authenticated account has no linked contributor record."
    );
  }
  if (!context.permissions.includes(requiredPermission)) {
    throw new GovernanceAuthError(
      "PERMISSION_DENIED",
      `Authenticated contributor lacks required permission: ${requiredPermission}`
    );
  }
}

/**
 * Sanitizes request payload by removing body-supplied actor, contributor, role or permission fields.
 */
export function sanitizeGovernanceRequestBody<T extends Record<string, any>>(body: T): T {
  const sanitized = { ...body };
  delete sanitized.actorId;
  delete sanitized.contributorId;
  delete sanitized.reviewerId;
  delete sanitized.accountId;
  delete sanitized.roles;
  delete sanitized.permissions;
  delete sanitized.admin;
  delete sanitized.isAdmin;
  delete sanitized.actingUser;
  delete sanitized.accountOverride;
  return sanitized;
}
