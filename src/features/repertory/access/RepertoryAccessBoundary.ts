import {
  canAccessDoctorRepertory,
  DoctorRepertoryEntitlement,
  RepertoryAccessContext,
} from "./DoctorEntitlementService";

export type RepertoryBoundaryDecision =
  | { allowed: true }
  | { allowed: false; status: 403; code: "REPERTORY_ENTITLEMENT_REQUIRED" };

export function authorizeRepertoryOperation(
  entitlement: DoctorRepertoryEntitlement | null,
  context: RepertoryAccessContext,
  now = new Date(),
): RepertoryBoundaryDecision {
  if (!entitlement || !canAccessDoctorRepertory(entitlement, context, now)) {
    return { allowed: false, status: 403, code: "REPERTORY_ENTITLEMENT_REQUIRED" };
  }
  return { allowed: true };
}

