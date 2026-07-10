export type AdminRole =
  | "super-admin"
  | "clinical-reviewer"
  | "editor"
  | "operations"
  | "analytics-viewer"
  | "read-only-admin";

export type Permission =
  | "CMS_DRAFT_EDIT"
  | "CMS_CLINICAL_APPROVE"
  | "CMS_PUBLISH"
  | "CMS_ROLLBACK"
  | "WORKFLOW_ASSIGN"
  | "RAG_INDEX_MANAGE"
  | "OBSERVABILITY_VIEW"
  | "USER_MANAGE"
  | "SUBSCRIPTION_MANAGE";

// Role-to-Permissions Matrix
const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  "super-admin": [
    "CMS_DRAFT_EDIT",
    "CMS_CLINICAL_APPROVE",
    "CMS_PUBLISH",
    "CMS_ROLLBACK",
    "WORKFLOW_ASSIGN",
    "RAG_INDEX_MANAGE",
    "OBSERVABILITY_VIEW",
    "USER_MANAGE",
    "SUBSCRIPTION_MANAGE"
  ],
  "clinical-reviewer": [
    "CMS_CLINICAL_APPROVE",
    "WORKFLOW_ASSIGN"
  ],
  "editor": [
    "CMS_DRAFT_EDIT",
    "WORKFLOW_ASSIGN"
  ],
  "operations": [
    "CMS_DRAFT_EDIT",
    "WORKFLOW_ASSIGN",
    "RAG_INDEX_MANAGE",
    "OBSERVABILITY_VIEW"
  ],
  "analytics-viewer": [
    "OBSERVABILITY_VIEW"
  ],
  "read-only-admin": []
};

/**
 * Maps legacy roles ('admin', 'doctor') to modern granular RBAC roles.
 */
export function normalizeRole(role: string): AdminRole {
  const r = role.toLowerCase();
  if (r === "super-admin" || r === "admin") {
    return "super-admin";
  }
  if (r === "clinical-reviewer") {
    return "clinical-reviewer";
  }
  if (r === "editor") {
    return "editor";
  }
  if (r === "operations") {
    return "operations";
  }
  if (r === "analytics-viewer") {
    return "analytics-viewer";
  }
  if (r === "doctor" || r === "read-only-admin") {
    return "read-only-admin";
  }
  return "read-only-admin";
}

/**
 * Checks if a given role possesses a specific permission.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const normRole = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[normRole] || [];
  return permissions.includes(permission);
}

export function getPermissionsByRole(role: string): Permission[] {
  const normRole = normalizeRole(role);
  return ROLE_PERMISSIONS[normRole] || [];
}
