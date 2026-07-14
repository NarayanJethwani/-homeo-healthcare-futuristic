export type DoctorRepertoryEntitlement = {
  organizationId: string;
  clinicId: string;
  doctorId: string;
  status: "active" | "suspended" | "expired";
  capabilities: ReadonlyArray<"search" | "repertorize" | "export-json" | "export-pdf">;
  expiresAt?: string;
};

export type RepertoryAccessContext = {
  organizationId: string;
  clinicId: string;
  doctorId: string;
  capability: DoctorRepertoryEntitlement["capabilities"][number];
};

export function canAccessDoctorRepertory(
  entitlement: DoctorRepertoryEntitlement,
  context: RepertoryAccessContext,
  now = new Date(),
): boolean {
  return entitlement.status === "active"
    && entitlement.organizationId === context.organizationId
    && entitlement.clinicId === context.clinicId
    && entitlement.doctorId === context.doctorId
    && entitlement.capabilities.includes(context.capability)
    && (!entitlement.expiresAt || new Date(entitlement.expiresAt).getTime() > now.getTime());
}

// RepertorySessionExportV1 and createRepertorySessionExport() have been removed.
// They accepted a caller-controlled sessionId field which allowed session ID forgery.
// Use RepertoryClinicianExportV1 (versionedCliniciansExport.ts) and
// runClinicianSessionExport() (RepertorySessionExportService.ts) instead —
// those generate opaque server-side IDs and enforce export-json capability.
