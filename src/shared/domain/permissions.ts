export type RoleType =
  | "platform_admin"
  | "organization_admin"
  | "clinic_admin"
  | "doctor"
  | "consultant"
  | "receptionist"
  | "pharmacist"
  | "student"
  | "researcher"
  | "auditor";

export type PermissionAction =
  | "read_emr"
  | "create_emr_draft"
  | "edit_emr_draft"
  | "sign_encounter"
  | "amend_encounter"
  | "correct_in_error"
  | "view_billing"
  | "edit_billing"
  | "dispense_rx"
  | "view_audit_logs"
  | "manage_organization"
  | "manage_clinic"
  | "manage_users";

export interface UserSession {
  userId: string;
  organizationId: string;
  clinicId?: string; // Optional if doctor is bound to multiple or none
  role: RoleType;
  associatedClinicIds: string[];
}

export interface BreakGlassSession {
  id: string;
  practitionerId: string;
  patientId: string;
  reason: string;
  justificationText: string;
  grantedAt: string;
  expiresAt: string;
}
