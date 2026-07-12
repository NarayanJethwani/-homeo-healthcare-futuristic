import "server-only";

import { getPractitionerByUid } from "@/features/admin-users/practitionerRepository";
import { DoctorRepertoryEntitlement } from "./DoctorEntitlementService";

export async function resolveDoctorRepertoryEntitlement(
  uid: string,
): Promise<DoctorRepertoryEntitlement | null> {
  const practitioner = await getPractitionerByUid(uid);
  if (!practitioner || !practitioner.organizationId || !practitioner.clinicId) return null;
  if (!practitioner.repertoryCapabilities?.length) return null;

  return {
    organizationId: practitioner.organizationId,
    clinicId: practitioner.clinicId,
    doctorId: uid,
    status: practitioner.status === "active"
      ? "active"
      : practitioner.status === "expired"
        ? "expired"
        : "suspended",
    capabilities: practitioner.repertoryCapabilities,
    expiresAt: practitioner.subscriptionExpiresAt,
  };
}

