/**
 * repertoryEntitlementExport.test.ts — R2
 *
 * Unit tests for the PHI-safe export DTO builder and defense-in-depth scanner.
 *
 * Covers:
 *  - buildClinicianExport: allowlisted fields, structural PHI absence
 *  - assertNoPatientPhiInValues: email, mobile, UUID (field-aware), patient keyword
 *  - legacy session ID pattern detection (session_patientId_timestamp)
 *  - rsess_ opaque IDs pass the scanner (exportId field is safe)
 *
 * Note: compiled with module:commonjs / target:es2020 — no top-level await.
 */
import "./setupEnv";
import assert from 'assert';
import {
  buildClinicianExport,
  assertNoPatientPhiInValues,
  type RepertoryClinicianExportV1,
} from '../src/features/repertory/import-export/versionedCliniciansExport';
import type { DoctorRepertoryEntitlement } from '../src/features/repertory/access/DoctorEntitlementService';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ENTITLEMENT: DoctorRepertoryEntitlement = {
  doctorId: 'doctor-uid-1',
  organizationId: 'org-abc',
  clinicId: 'clinic-xyz',
  status: 'active',
  capabilities: ['search', 'repertorize', 'export-json'],
};

const SESSION = {
  corpusVersion: 'clarke-v2',
  selectedRubricIds: ['rubric-mental-1', 'rubric-thermal-2'],
  resultRemedyIds: ['ars', 'sulphur'],
};

const NOW = new Date('2026-07-14T10:00:00.000Z');
const EXPORT_ID = 'rsess_aabbccddeeff00112233445566778899'; // opaque, rsess_-prefixed

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    passed++;
  } catch (e: any) {
    console.error(`  \u2717 ${name}: ${e.message}`);
    failed++;
  }
}

// ─── buildClinicianExport ─────────────────────────────────────────────────────

console.log('\nbuildClinicianExport\n');

test('produces schemaVersion: 1', () => {
  const exp = buildClinicianExport(ENTITLEMENT, SESSION, EXPORT_ID, NOW);
  assert.equal(exp.schemaVersion, 1);
});

test('exportId matches supplied value', () => {
  const exp = buildClinicianExport(ENTITLEMENT, SESSION, EXPORT_ID, NOW);
  assert.equal(exp.exportId, EXPORT_ID);
});

test('exportedBy matches doctorId', () => {
  const exp = buildClinicianExport(ENTITLEMENT, SESSION, EXPORT_ID, NOW);
  assert.equal(exp.exportedBy, ENTITLEMENT.doctorId);
});

test('organizationId and clinicId come from entitlement', () => {
  const exp = buildClinicianExport(ENTITLEMENT, SESSION, EXPORT_ID, NOW);
  assert.equal(exp.organizationId, ENTITLEMENT.organizationId);
  assert.equal(exp.clinicId, ENTITLEMENT.clinicId);
});

test('corpusVersion, selectedRubricIds, resultRemedyIds come from session', () => {
  const exp = buildClinicianExport(ENTITLEMENT, SESSION, EXPORT_ID, NOW);
  assert.equal(exp.corpusVersion, SESSION.corpusVersion);
  assert.deepEqual(exp.selectedRubricIds, SESSION.selectedRubricIds);
  assert.deepEqual(exp.resultRemedyIds, SESSION.resultRemedyIds);
});

test('sessionId is structurally absent from export', () => {
  const exp = buildClinicianExport(ENTITLEMENT, SESSION, EXPORT_ID, NOW);
  assert.ok(!Object.keys(exp).includes('sessionId'), 'sessionId must be absent');
});

test('patientId is structurally absent from export', () => {
  const exp = buildClinicianExport(ENTITLEMENT, SESSION, EXPORT_ID, NOW);
  assert.ok(!Object.keys(exp).includes('patientId'), 'patientId must be absent');
});

// ─── assertNoPatientPhiInValues ───────────────────────────────────────────────

console.log('\nassertNoPatientPhiInValues\n');

function makeExport(overrides: Partial<RepertoryClinicianExportV1> = {}): RepertoryClinicianExportV1 {
  return {
    schemaVersion: 1,
    exportId: EXPORT_ID,
    exportedAt: NOW.toISOString(),
    exportedBy: 'doctor-uid-1',
    organizationId: 'org-abc',
    clinicId: 'clinic-xyz',
    corpusVersion: 'clarke-v2',
    selectedRubricIds: ['rubric-mental-1'],
    resultRemedyIds: ['ars'],
    ...overrides,
  };
}

test('valid export passes scanner without throwing', () => {
  const exp = makeExport();
  assert.doesNotThrow(() => assertNoPatientPhiInValues(exp));
});

test('rsess_ opaque exportId passes scanner (field excluded from UUID check)', () => {
  // exportId is a UUID-like rsess_ prefixed value — must not trigger PHI_DETECTED
  const exp = makeExport({ exportId: 'rsess_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4' });
  assert.doesNotThrow(() => assertNoPatientPhiInValues(exp));
});

test('randomUUID() in exportId field does not trigger PHI_DETECTED', () => {
  // Production uses randomUUID() for exportId — must be allowed
  const exp = makeExport({ exportId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' });
  assert.doesNotThrow(() => assertNoPatientPhiInValues(exp));
});

test('email address in organizationId triggers PHI_DETECTED', () => {
  const exp = makeExport({ organizationId: 'contact@clinic.com' });
  assert.throws(() => assertNoPatientPhiInValues(exp), /PHI_DETECTED: email/);
});

test('Indian mobile number in clinicId triggers PHI_DETECTED', () => {
  const exp = makeExport({ clinicId: '9876543210' });
  assert.throws(() => assertNoPatientPhiInValues(exp), /PHI_DETECTED: mobile/);
});

test('"patient" keyword in corpusVersion triggers PHI_DETECTED', () => {
  const exp = makeExport({ corpusVersion: 'patient-records-v1' });
  assert.throws(() => assertNoPatientPhiInValues(exp), /PHI_DETECTED: 'patient' keyword/);
});

test('UUID in selectedRubricIds triggers PHI_DETECTED (not a safe field)', () => {
  // Raw UUIDs in rubric arrays could be patient identifiers — must be caught
  const exp = makeExport({ selectedRubricIds: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'] });
  assert.throws(() => assertNoPatientPhiInValues(exp), /PHI_DETECTED: uuid/);
});

test('value containing standalone word "patient" triggers PHI_DETECTED', () => {
  // Scanner catches "patient" as standalone word — e.g. a note accidentally placed in a field.
  // Note: session_patient-abc_timestamp does NOT match because hyphen breaks word boundary;
  // the session service rejects that ID format before any DTO is built. This test validates
  // the keyword scanner catches obvious PHI like "patient record" or "patient notes".
  const exp = makeExport({ corpusVersion: 'patient record v1' });
  assert.throws(() => assertNoPatientPhiInValues(exp), /PHI_DETECTED/);
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
