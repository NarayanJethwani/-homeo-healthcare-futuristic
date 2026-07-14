/**
 * versionedCliniciansExport.ts
 *
 * Versioned, PHI-safe DTO for clinician repertory session exports.
 *
 * Design invariants:
 *  - The exported object is built via an explicit allowlist — sessionId and
 *    patientId are never included (no PHI leak surface).
 *  - A defense-in-depth PHI value scan (`assertNoPatientPhiInValues`) is
 *    applied by the caller after construction.
 *  - schemaVersion is always 1 so consumers can branch on it safely.
 */

import type { DoctorRepertoryEntitlement } from "../access/DoctorEntitlementService";

// ─── Versioned DTO ────────────────────────────────────────────────────────────

/** PHI-safe export envelope sent to the client. No sessionId, no patientId. */
export type RepertoryClinicianExportV1 = {
  schemaVersion: 1;
  exportId: string;
  exportedAt: string;
  exportedBy: string;
  organizationId: string;
  clinicId: string;
  corpusVersion: string;
  selectedRubricIds: string[];
  resultRemedyIds: string[];
};

type SessionPayload = {
  corpusVersion: string;
  selectedRubricIds: string[];
  resultRemedyIds: string[];
};

// ─── Builder ──────────────────────────────────────────────────────────────────

/**
 * Builds a PHI-safe, allowlist-only export DTO.
 * Deliberately does NOT accept sessionId or patientId as parameters so the
 * caller cannot accidentally include them.
 */
export function buildClinicianExport(
  entitlement: DoctorRepertoryEntitlement,
  session: SessionPayload,
  exportId: string,
  now: Date,
): RepertoryClinicianExportV1 {
  return {
    schemaVersion: 1,
    exportId,
    exportedAt: now.toISOString(),
    exportedBy: entitlement.doctorId,
    organizationId: entitlement.organizationId,
    clinicId: entitlement.clinicId,
    corpusVersion: session.corpusVersion,
    selectedRubricIds: session.selectedRubricIds,
    resultRemedyIds: session.resultRemedyIds,
  };
}

// ─── PHI value scan ───────────────────────────────────────────────────────────

/**
 * Defense-in-depth check: walks all string values in the export object and
 * throws if any value looks like a personal identifier or patient data.
 *
 * Field-aware design:
 *  - Known safe fields (exportId, exportedAt, schemaVersion) are excluded from
 *    UUID and mobile scanning because they are server-generated and structurally
 *    guaranteed to contain no patient data by the allowlist builder.
 *  - All other fields are scanned with the full heuristic set.
 *  - The structural allowlist in buildClinicianExport is the PRIMARY control;
 *    this scan is defense-in-depth and must not cause false-positive PHI_DETECTED
 *    on valid production outputs.
 *
 * Heuristics for non-safe fields:
 *  - Email address pattern
 *  - Indian mobile number (10 digits starting with 6-9)
 *  - UUID / GUID (could be a raw patientId in a wrong field)
 *  - Value literally contains the word "patient" (case-insensitive)
 *
 * The caller must NOT pass sessionId or patientId into buildClinicianExport;
 * this scan is a last line of defense, not a substitute.
 */

/** Fields whose values are structurally safe and excluded from UUID/mobile scanning. */
const PHI_SCAN_SAFE_FIELDS = new Set<string>([
  'exportId',    // server-generated opaque identifier, never patient-derived
  'exportedAt',  // ISO timestamp
  'schemaVersion', // number
]);

export function assertNoPatientPhiInValues(
  obj: RepertoryClinicianExportV1,
): void {
  const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const MOBILE_IN = /\b[6-9]\d{9}\b/;
  const UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i;
  const PATIENT_WORD = /\bpatient\b/i;

  function scanValue(value: unknown, path: string, fieldName: string): void {
    if (typeof value === "string") {
      // Email and "patient" keyword are always checked regardless of field
      if (EMAIL.test(value))        throw new Error(`PHI_DETECTED: email at ${path}`);
      if (PATIENT_WORD.test(value)) throw new Error(`PHI_DETECTED: 'patient' keyword at ${path}`);
      // UUID and mobile are skipped for known safe server-generated fields
      if (!PHI_SCAN_SAFE_FIELDS.has(fieldName)) {
        if (MOBILE_IN.test(value)) throw new Error(`PHI_DETECTED: mobile at ${path}`);
        if (UUID.test(value))      throw new Error(`PHI_DETECTED: uuid at ${path}`);
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => scanValue(item, `${path}[${i}]`, fieldName));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) {
        scanValue(v, `${path}.${k}`, k);
      }
    }
  }

  // Scan top-level fields; pass field name so nested calls carry it through
  for (const [k, v] of Object.entries(obj)) {
    scanValue(v, `export.${k}`, k);
  }
}


