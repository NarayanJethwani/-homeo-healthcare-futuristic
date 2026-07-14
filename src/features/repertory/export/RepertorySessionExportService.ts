import 'server-only';
import { randomUUID } from 'crypto';
import type { DoctorRepertoryEntitlement } from '../access/DoctorEntitlementService';
import type { PatientAccessResult } from '../access/RepertoryExportPatientAccessChecker';
import {
  buildClinicianExport,
  assertNoPatientPhiInValues,
  type RepertoryClinicianExportV1,
} from '../import-export/versionedCliniciansExport';

// ─── Session Document Schema ──────────────────────────────────────────────────

export type PersistedSessionDoc = {
  schemaVersion: 1;
  id: string;
  organizationId: string;
  clinicId: string;
  userId: string;
  patientId: string;
  corpusVersion: string;
  selectedRubricIds: string[];
  resultRemedyIds: string[];
  createdAt: string;
};

// Opaque session ID format: rsess_ followed by 32 hex chars (no dashes)
const SESSION_ID_FORMAT = /^rsess_[0-9a-f]{32}$/;

// Safe identifier: letters, digits, period, underscore, colon, dash; max 160 chars
const SAFE_ID = /^[\p{L}\p{N}._:-]+$/u;
const MAX_ID_LENGTH = 160;
const MAX_ARRAY_ITEMS = 60;

// ISO 8601 basic check: starts with a 4-digit year and contains a T separator
const ISO_8601_PREFIX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function isValidSafeId(v: unknown): v is string {
  return (
    typeof v === 'string' &&
    v.length > 0 &&
    v.length <= MAX_ID_LENGTH &&
    SAFE_ID.test(v)
  );
}

/**
 * Validates createdAt in the required order:
 * 1. Confirm it is a bounded string
 * 2. Confirm an ISO-8601 format prefix
 * 3. Confirm Date.parse returns a finite number
 */
function isValidTimestamp(v: unknown): v is string {
  if (typeof v !== 'string' || v.length === 0 || v.length > 40) return false;
  if (!ISO_8601_PREFIX.test(v)) return false;
  return Number.isFinite(Date.parse(v));
}

/**
 * Parses and validates a raw Firestore document against the persisted session schema.
 * Returns null for any missing field, wrong type, or schema version mismatch.
 * Legacy documents (without schemaVersion: 1) always return null — fail closed.
 */
export function parsePersistedSession(
  raw: unknown,
  expectedId: string,
): PersistedSessionDoc | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const d = raw as Record<string, unknown>;

  if (d.schemaVersion !== 1) return null;
  if (d.id !== expectedId) return null;
  if (!isValidSafeId(d.organizationId)) return null;
  if (!isValidSafeId(d.clinicId)) return null;
  if (!isValidSafeId(d.userId)) return null;
  if (!isValidSafeId(d.patientId)) return null;
  if (!isValidSafeId(d.corpusVersion)) return null;
  // Validate createdAt: bounded string → ISO-8601 format → parseable
  if (!isValidTimestamp(d.createdAt)) return null;

  if (
    !Array.isArray(d.selectedRubricIds) ||
    d.selectedRubricIds.length === 0 ||
    d.selectedRubricIds.length > MAX_ARRAY_ITEMS ||
    !d.selectedRubricIds.every(isValidSafeId)
  )
    return null;

  if (
    !Array.isArray(d.resultRemedyIds) ||
    d.resultRemedyIds.length === 0 ||
    d.resultRemedyIds.length > MAX_ARRAY_ITEMS ||
    !d.resultRemedyIds.every(isValidSafeId)
  )
    return null;

  return {
    schemaVersion: 1,
    id: d.id as string,
    organizationId: d.organizationId as string,
    clinicId: d.clinicId as string,
    userId: d.userId as string,
    patientId: d.patientId as string,
    corpusVersion: d.corpusVersion as string,
    selectedRubricIds: d.selectedRubricIds as string[],
    resultRemedyIds: d.resultRemedyIds as string[],
    createdAt: d.createdAt as string,
  };
}

// ─── Dependency Interfaces ────────────────────────────────────────────────────

export type SessionRepository = {
  getById(id: string): Promise<unknown>;
};

export type PatientAccessChecker = {
  check(
    patientId: string,
    doctorUid: string,
    clinicId: string,
  ): Promise<PatientAccessResult>;
};

export type ExportServiceDeps = {
  sessionRepo: SessionRepository;
  patientAccess: PatientAccessChecker;
  idGenerator: () => string;
  now: () => Date;
};

// ─── Result Types ─────────────────────────────────────────────────────────────

export type ExportServiceResult =
  | { ok: true; export: RepertoryClinicianExportV1 }
  | { ok: false; code: 'NOT_FOUND' | 'FORBIDDEN' | 'PHI_DETECTED' | 'INTERNAL' };

// Opaque same-response for both missing and foreign sessions (no oracle attack)
const NOT_FOUND: ExportServiceResult = { ok: false, code: 'NOT_FOUND' };

// ─── Service Function ─────────────────────────────────────────────────────────

/**
 * Core clinician session export logic with all dependencies explicit and injectable.
 *
 * Security invariants:
 * - Session ID must match the rsess_ opaque format (B1)
 * - Document must have schemaVersion: 1 (legacy sessions fail closed)
 * - Strict Option B ownership: userId + organizationId + clinicId must all match
 * - Patient must be actively assigned to this doctor in the same clinic (B5 fail-closed)
 * - Exported DTO is built via allowlist only (no patientId, no sessionId)
 * - PHI value scan is applied as defense-in-depth after DTO construction
 */
export async function runClinicianSessionExport(
  sessionId: string,
  entitlement: DoctorRepertoryEntitlement,
  deps: ExportServiceDeps,
): Promise<ExportServiceResult> {
  // 1. Validate opaque session ID format — wrong format = same as not found
  if (!SESSION_ID_FORMAT.test(sessionId)) return NOT_FOUND;

  // 2. Load document from session repository
  let rawDoc: unknown;
  try {
    rawDoc = await deps.sessionRepo.getById(sessionId);
  } catch {
    return { ok: false, code: 'INTERNAL' };
  }
  if (!rawDoc) return NOT_FOUND;

  // 3. Parse and validate document structure
  const session = parsePersistedSession(rawDoc, sessionId);
  if (!session) return NOT_FOUND; // legacy or malformed — fail closed

  // 4. Strict Option B ownership — all three fields must match exactly
  if (session.userId !== entitlement.doctorId) return NOT_FOUND;
  if (session.organizationId !== entitlement.organizationId) return NOT_FOUND;
  if (session.clinicId !== entitlement.clinicId) return NOT_FOUND;

  // 5. Patient assignment verification — fail-closed checker, no mock paths
  const patientAccess = await deps.patientAccess.check(
    session.patientId,
    entitlement.doctorId,
    entitlement.clinicId,
  );
  if (!patientAccess.allowed) return NOT_FOUND;

  // 6. Build PHI-safe allowlisted DTO — no sessionId, no patientId
  const exportId = deps.idGenerator();
  const exportObj = buildClinicianExport(
    entitlement,
    {
      corpusVersion: session.corpusVersion,
      selectedRubricIds: session.selectedRubricIds,
      resultRemedyIds: session.resultRemedyIds,
    },
    exportId,
    deps.now(),
  );

  // 7. Defense-in-depth PHI value scan
  try {
    assertNoPatientPhiInValues(exportObj);
  } catch {
    return { ok: false, code: 'PHI_DETECTED' };
  }

  return { ok: true, export: exportObj };
}
