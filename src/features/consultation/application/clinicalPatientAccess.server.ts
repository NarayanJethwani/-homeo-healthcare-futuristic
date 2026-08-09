import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type { AdminSessionPayload } from "@/lib/adminSession";
import { normalizeRole } from "@/lib/security/rbac";

export async function canAccessClinicalPatient(
  session: AdminSessionPayload,
  patientId: string
): Promise<boolean> {
  if (process.env.NODE_ENV !== "production" && session.uid === "dev-bypass-uid") {
    return true;
  }
  const normalizedRole = normalizeRole(session.role);
  if (normalizedRole === "super-admin") return true;
  try {
    const db = getAdminDb();
    const [practitionerSnapshot, patientSnapshot] = await Promise.all([
      db.collection("practitioners").doc(session.uid).get(),
      db.collection("patients").doc(patientId).get(),
    ]);
    if (!practitionerSnapshot.exists || !patientSnapshot.exists) return false;
    const practitioner = practitionerSnapshot.data();
    const patient = patientSnapshot.data();
    if (!practitioner || !patient || practitioner.status !== "active") return false;
    const tenantMatch =
      practitioner.organizationId &&
      practitioner.clinicId &&
      practitioner.organizationId === patient.organizationId &&
      practitioner.clinicId === patient.clinicId;
    const assignmentMatch =
      patient.assignedDoctor === session.uid || patient.practitionerId === session.uid;
    return Boolean(tenantMatch && assignmentMatch);
  } catch {
    return false;
  }
}
