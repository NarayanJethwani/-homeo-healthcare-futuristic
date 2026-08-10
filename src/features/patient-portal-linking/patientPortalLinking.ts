import { z } from "zod";

export const approvePatientPortalLinkSchema = z.object({
  portalUid: z.string().trim().min(8).max(160).regex(/^[A-Za-z0-9_-]+$/, "Invalid Portal UID."),
  patientId: z.string().trim().min(2).max(100).regex(/^[A-Za-z0-9_-]+$/, "Invalid patient ID."),
}).strict();

export type ApprovePatientPortalLinkInput = z.infer<typeof approvePatientPortalLinkSchema>;

export type PortalPatientCandidate = {
  id: string;
  name: string;
  email: string;
  assignedDoctor: string;
};

export function normalizePortalEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function candidatePatientIdsForEmail(
  portalEmail: string,
  patients: PortalPatientCandidate[],
): string[] {
  const normalized = normalizePortalEmail(portalEmail);
  if (!normalized) return [];
  return patients
    .filter((patient) => normalizePortalEmail(patient.email) === normalized)
    .map((patient) => patient.id);
}

export function practitionerMayLinkPatient(
  actorUid: string,
  isSuperAdmin: boolean,
  patientAssignedDoctor: unknown,
): boolean {
  return isSuperAdmin || patientAssignedDoctor === actorUid;
}
