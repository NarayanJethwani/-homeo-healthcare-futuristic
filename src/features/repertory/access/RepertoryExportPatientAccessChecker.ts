import 'server-only';
import { getAdminDb } from '@/lib/firebaseAdmin';

export type PatientAccessResult =
  | { allowed: true }
  | { allowed: false; reason: 'not-found' | 'unassigned' | 'mismatch' | 'lookup-failed' };

/**
 * Fail-closed patient access check for clinician export.
 *
 * Returns allowed=true ONLY when an exact assignedDoctor or practitionerId match
 * is found for the given doctor in the live Firestore patient record, within the
 * same clinic.
 *
 * Missing, unassigned ("unassigned" string or absent field), mock, or
 * lookup-failed records all deny access.
 */
export async function checkExportPatientAccess(
  patientId: string,
  doctorUid: string,
  clinicId: string,
): Promise<PatientAccessResult> {
  const db = getAdminDb();
  if (!db) return { allowed: false, reason: 'lookup-failed' };

  try {
    const snap = await db.collection('patients').doc(patientId).get();
    if (!snap.exists) return { allowed: false, reason: 'not-found' };

    const data = snap.data();
    if (!data) return { allowed: false, reason: 'not-found' };

    const assignedDoctor: unknown = data.assignedDoctor;
    const practitionerId: unknown = data.practitionerId;
    const patientClinicId: unknown = data.clinicId;

    // Explicit deny for absent or placeholder assignments
    const noAssignment =
      (!assignedDoctor && !practitionerId) ||
      assignedDoctor === 'unassigned' ||
      practitionerId === 'unassigned';

    if (noAssignment) {
      return { allowed: false, reason: 'unassigned' };
    }

    const doctorMatch =
      assignedDoctor === doctorUid || practitionerId === doctorUid;

    // Strict Option B clinic check: patientClinicId must be a non-empty string
    // that exactly matches the entitlement clinicId. Absent or empty clinicId on
    // the patient record does NOT permit access — fail closed on old/incomplete data.
    const clinicMatch =
      typeof patientClinicId === 'string' &&
      patientClinicId.length > 0 &&
      patientClinicId === clinicId;

    if (!doctorMatch || !clinicMatch) {
      return { allowed: false, reason: 'mismatch' };
    }

    return { allowed: true };
  } catch {
    return { allowed: false, reason: 'lookup-failed' };
  }
}
