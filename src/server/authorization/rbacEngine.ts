import { RoleType, PermissionAction, UserSession, BreakGlassSession } from "../../shared/domain/permissions";
import { UnauthorizedError } from "../../shared/errors/domainErrors";

const ROLE_PERMISSIONS: Record<RoleType, PermissionAction[]> = {
  platform_admin: ["manage_organization", "manage_clinic", "manage_users", "view_audit_logs"],
  organization_admin: ["manage_clinic", "manage_users", "view_audit_logs", "view_billing"],
  clinic_admin: ["manage_users", "view_billing", "edit_billing"],
  doctor: ["read_emr", "create_emr_draft", "edit_emr_draft", "sign_encounter", "amend_encounter", "correct_in_error", "view_billing", "edit_billing"],
  consultant: ["read_emr", "create_emr_draft", "edit_emr_draft", "sign_encounter"],
  receptionist: ["view_billing", "edit_billing"],
  pharmacist: ["read_emr", "dispense_rx"],
  student: ["read_emr"], // Read only (expected to be de-identified/scoped)
  researcher: [], // Research datasets only, no standard EMR reads
  auditor: ["view_audit_logs", "read_emr"]
};

export class RbacEngine {
  /**
   * Evaluates if a practitioner can execute an action on a target resource.
   */
  static authorize(
    session: UserSession,
    action: PermissionAction,
    resource: {
      organizationId: string;
      clinicId?: string;
      patientId?: string;
    },
    breakGlass?: BreakGlassSession
  ): boolean {
    // 1. Authenticate Tenant Bound
    if (session.organizationId !== resource.organizationId) {
      throw new UnauthorizedError("Cross-organization access is strictly forbidden");
    }

    // 2. Validate Role Permissions
    const permittedActions = ROLE_PERMISSIONS[session.role] || [];
    if (!permittedActions.includes(action)) {
      // Check if break glass is active for clinical EMR reads
      if (action === "read_emr" && breakGlass && breakGlass.practitionerId === session.userId && breakGlass.patientId === resource.patientId) {
        const now = new Date().toISOString();
        if (breakGlass.expiresAt > now) {
          console.warn(`Access granted to patient ${resource.patientId} via active break-glass session`);
          return true;
        }
      }
      throw new UnauthorizedError(`Role ${session.role} lacks permission to execute ${action}`);
    }

    // 3. Clinic Scope Bound Check
    if (resource.clinicId && session.role !== "platform_admin" && session.role !== "organization_admin") {
      const belongsToClinic = session.associatedClinicIds.includes(resource.clinicId) || session.clinicId === resource.clinicId;
      if (!belongsToClinic) {
        throw new UnauthorizedError("Practitioner is not registered at target clinic");
      }
    }

    return true;
  }
}
