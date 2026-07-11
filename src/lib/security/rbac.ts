export type AdminRole =
  | "super-admin"
  | "clinical-reviewer"
  | "editor"
  | "operations"
  | "analytics-viewer"
  | "read-only-admin";

export type KnowledgeCapability =
  | "knowledge.create"
  | "knowledge.editDraft"
  | "knowledge.submitMedicalReview"
  | "knowledge.performMedicalReview"
  | "knowledge.performEditorialReview"
  | "knowledge.approve"
  | "knowledge.publish"
  | "knowledge.bypassReview"
  | "knowledge.archive"
  | "knowledge.restore"
  | "knowledge.viewAudit";

export type RepertoryCapability =
  | "repertory.review.read"
  | "repertory.review.correct"
  | "repertory.remedy.resolve"
  | "repertory.concept.map"
  | "repertory.status.transition"
  | "repertory.publish.request"
  | "repertory.publish.approve"
  | "repertory.snapshot.activate"
  | "repertory.snapshot.rollback"
  | "repertory.audit.read";

export type MateriaMedicaCapability =
  | "materia-medica.library.view"
  | "materia-medica.source.register"
  | "materia-medica.rights.review"
  | "materia-medica.ingestion.execute"
  | "materia-medica.transcription.review"
  | "materia-medica.content.approve"
  | "materia-medica.search.publish"
  | "materia-medica.rag.publish"
  | "materia-medica.content.deprecate";

export type Permission =
  | "CMS_DRAFT_EDIT"
  | "CMS_CLINICAL_APPROVE"
  | "CMS_PUBLISH"
  | "CMS_ROLLBACK"
  | "WORKFLOW_ASSIGN"
  | "RAG_INDEX_MANAGE"
  | "OBSERVABILITY_VIEW"
  | "USER_MANAGE"
  | "SUBSCRIPTION_MANAGE"
  | KnowledgeCapability
  | RepertoryCapability
  | MateriaMedicaCapability;

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
    "SUBSCRIPTION_MANAGE",
    "knowledge.create",
    "knowledge.editDraft",
    "knowledge.submitMedicalReview",
    "knowledge.performMedicalReview",
    "knowledge.performEditorialReview",
    "knowledge.approve",
    "knowledge.publish",
    "knowledge.bypassReview",
    "knowledge.archive",
    "knowledge.restore",
    "knowledge.viewAudit",
    "repertory.review.read",
    "repertory.review.correct",
    "repertory.remedy.resolve",
    "repertory.concept.map",
    "repertory.status.transition",
    "repertory.publish.request",
    "repertory.publish.approve",
    "repertory.snapshot.activate",
    "repertory.snapshot.rollback",
    "repertory.audit.read",
    "materia-medica.library.view",
    "materia-medica.source.register",
    "materia-medica.rights.review",
    "materia-medica.ingestion.execute",
    "materia-medica.transcription.review",
    "materia-medica.content.approve",
    "materia-medica.search.publish",
    "materia-medica.rag.publish",
    "materia-medica.content.deprecate"
  ],
  "clinical-reviewer": [
    "CMS_CLINICAL_APPROVE",
    "WORKFLOW_ASSIGN",
    "knowledge.performMedicalReview",
    "knowledge.approve",
    "repertory.review.read",
    "repertory.status.transition",
    "repertory.publish.request",
    "repertory.publish.approve",
    "repertory.audit.read",
    "materia-medica.library.view",
    "materia-medica.rights.review",
    "materia-medica.content.approve",
    "materia-medica.search.publish",
    "materia-medica.rag.publish",
    "materia-medica.content.deprecate"
  ],
  "editor": [
    "CMS_DRAFT_EDIT",
    "WORKFLOW_ASSIGN",
    "knowledge.create",
    "knowledge.editDraft",
    "knowledge.submitMedicalReview",
    "knowledge.performEditorialReview",
    "knowledge.restore",
    "repertory.review.read",
    "repertory.review.correct",
    "repertory.remedy.resolve",
    "repertory.concept.map",
    "repertory.status.transition",
    "repertory.publish.request",
    "repertory.audit.read",
    "materia-medica.library.view",
    "materia-medica.transcription.review"
  ],
  "operations": [
    "CMS_DRAFT_EDIT",
    "WORKFLOW_ASSIGN",
    "RAG_INDEX_MANAGE",
    "OBSERVABILITY_VIEW",
    "knowledge.create",
    "knowledge.editDraft",
    "knowledge.submitMedicalReview",
    "knowledge.archive",
    "repertory.review.read",
    "repertory.audit.read",
    "materia-medica.library.view",
    "materia-medica.source.register",
    "materia-medica.ingestion.execute"
  ],
  "analytics-viewer": [
    "OBSERVABILITY_VIEW",
    "knowledge.viewAudit",
    "repertory.audit.read"
  ],
  "read-only-admin": [
    "materia-medica.library.view"
  ]
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
