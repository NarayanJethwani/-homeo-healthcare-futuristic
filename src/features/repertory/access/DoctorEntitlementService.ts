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

export type RepertorySessionExportV1 = {
  schemaVersion: 1;
  exportedAt: string;
  exportedBy: string;
  organizationId: string;
  clinicId: string;
  corpusVersion: string;
  sessionId: string;
  selectedRubricIds: string[];
  resultRemedyIds: string[];
};

export function createRepertorySessionExport(
  entitlement: DoctorRepertoryEntitlement,
  context: Omit<RepertoryAccessContext, "capability">,
  input: Omit<RepertorySessionExportV1, "schemaVersion" | "exportedAt" | "exportedBy" | "organizationId" | "clinicId">,
  now = new Date(),
): RepertorySessionExportV1 {
  if (!canAccessDoctorRepertory(entitlement, { ...context, capability: "export-json" }, now)) {
    throw new Error("REPERTORY_EXPORT_NOT_AUTHORIZED");
  }
  return {
    schemaVersion: 1,
    exportedAt: now.toISOString(),
    exportedBy: context.doctorId,
    organizationId: context.organizationId,
    clinicId: context.clinicId,
    ...input,
  };
}

