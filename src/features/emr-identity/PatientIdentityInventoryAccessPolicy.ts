export type PatientIdentityInventoryAccessDecision =
  | { allowed: true }
  | { allowed: false; status: 401 | 403 | 404; code: string };

export interface PatientIdentityInventorySession {
  uid: string;
  role?: string;
}

export function authorizePatientIdentityInventory(
  enabled: boolean,
  session: PatientIdentityInventorySession | null,
): PatientIdentityInventoryAccessDecision {
  if (!enabled) {
    return { allowed: false, status: 404, code: "EMR_IDENTITY_INVENTORY_DISABLED" };
  }
  if (!session) {
    return { allowed: false, status: 401, code: "AUTHENTICATION_REQUIRED" };
  }
  if (session.role !== "admin") {
    return { allowed: false, status: 403, code: "ADMIN_ACCESS_REQUIRED" };
  }
  return { allowed: true };
}
