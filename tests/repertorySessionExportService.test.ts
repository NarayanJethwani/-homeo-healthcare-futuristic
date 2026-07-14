/**
 * repertorySessionExportService.test.ts — R2
 *
 * Unit tests for RepertorySessionExportService.
 * Exercises parsePersistedSession validation and runClinicianSessionExport logic
 * with fully stubbed dependencies — no Firestore, no HTTP.
 *
 * parsePersistedSession scenarios (13): shape, schemaVersion, id match,
 *   empty arrays, createdAt validation (string bound, ISO-8601, Date.parse)
 * runClinicianSessionExport scenarios (8): S01-S06 + repo null + wrong ID format
 *
 * Note: compiled with module:commonjs / target:es2020, so top-level await is
 * not available. All async test calls are wrapped in a self-invoking async IIFE.
 */
import "./setupEnv";
import assert from 'assert';
import {
  runClinicianSessionExport,
  parsePersistedSession,
  type PersistedSessionDoc,
  type ExportServiceDeps,
} from '../src/features/repertory/export/RepertorySessionExportService';
import type { DoctorRepertoryEntitlement } from '../src/features/repertory/access/DoctorEntitlementService';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const OPAQUE_ID = 'rsess_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';

const BASE_ENTITLEMENT: DoctorRepertoryEntitlement = {
  organizationId: 'org-1',
  clinicId: 'clinic-1',
  doctorId: 'doctor-1',
  status: 'active',
  capabilities: ['search', 'repertorize', 'export-json', 'export-pdf'],
};

function makeValidSession(overrides: Partial<PersistedSessionDoc> = {}): PersistedSessionDoc {
  return {
    schemaVersion: 1,
    id: OPAQUE_ID,
    organizationId: 'org-1',
    clinicId: 'clinic-1',
    userId: 'doctor-1',
    patientId: 'patient-abc',
    corpusVersion: 'clarke-v1',
    selectedRubricIds: ['rubric-1', 'rubric-2'],
    resultRemedyIds: ['ars', 'belladonna'],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeDeps(
  sessionDoc: unknown,
  patientAllowed = true,
): ExportServiceDeps {
  return {
    sessionRepo: { getById: async () => sessionDoc },
    patientAccess: {
      check: async () => patientAllowed ? { allowed: true } : { allowed: false, reason: 'mismatch' as const },
    },
    idGenerator: () => 'export-id-001',
    now: () => new Date('2026-07-14T10:00:00.000Z'),
  };
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  \u2713 ${name}`);
    passed++;
  } catch (e: any) {
    console.error(`  \u2717 ${name}: ${e.message}`);
    failed++;
  }
}

// ─── Self-invoking async IIFE (required: es2020/commonjs has no top-level await) ─

(async () => {

  // ─── parsePersistedSession unit tests ────────────────────────────────────────

  console.log('\nparsePersistedSession validation\n');

  await test('accepts a fully valid session document', async () => {
    const result = parsePersistedSession(makeValidSession(), OPAQUE_ID);
    assert.ok(result !== null);
    assert.equal(result!.schemaVersion, 1);
    assert.equal(result!.id, OPAQUE_ID);
  });

  await test('rejects null input', async () => {
    assert.equal(parsePersistedSession(null, OPAQUE_ID), null);
  });

  await test('rejects array input', async () => {
    assert.equal(parsePersistedSession([], OPAQUE_ID), null);
  });

  await test('rejects schemaVersion: 0 (legacy doc)', async () => {
    const doc = { ...makeValidSession(), schemaVersion: 0 };
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('rejects mismatched id', async () => {
    const doc = makeValidSession({ id: 'rsess_different0000000000000000000' });
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('rejects empty selectedRubricIds', async () => {
    const doc = makeValidSession({ selectedRubricIds: [] });
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('rejects empty resultRemedyIds', async () => {
    const doc = makeValidSession({ resultRemedyIds: [] });
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('createdAt: non-string -> null', async () => {
    const doc = { ...makeValidSession(), createdAt: 1720938382000 }; // number, not string
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('createdAt: empty string -> null', async () => {
    const doc = { ...makeValidSession(), createdAt: '' };
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('createdAt: string longer than 40 chars -> null', async () => {
    const doc = { ...makeValidSession(), createdAt: '2026-07-14T10:00:00.000Z'.padEnd(41, 'x') };
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('createdAt: not ISO-8601 format -> null (S06 scenario)', async () => {
    // Passes string length check but fails ISO-8601 format check
    const doc = { ...makeValidSession(), createdAt: 'July 14, 2026' };
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  await test('createdAt: valid ISO-8601 -> accepted', async () => {
    const doc = makeValidSession({ createdAt: '2026-07-14T10:00:00.000Z' });
    assert.ok(parsePersistedSession(doc, OPAQUE_ID) !== null);
  });

  await test('createdAt: Date.parse returns NaN -> null', async () => {
    // Passes format check (starts with digit pattern) but Date.parse returns NaN
    const doc = { ...makeValidSession(), createdAt: '2026-99-99T99:99:99' };
    assert.equal(parsePersistedSession(doc, OPAQUE_ID), null);
  });

  // ─── runClinicianSessionExport integration scenarios ─────────────────────────

  console.log('\nrunClinicianSessionExport scenarios\n');

  await test('S01: valid session, all checks pass -> ok:true, PHI-safe DTO', async () => {
    const session = makeValidSession();
    const result = await runClinicianSessionExport(OPAQUE_ID, BASE_ENTITLEMENT, makeDeps(session));

    assert.equal(result.ok, true);
    if (!result.ok) return;

    const exp = result.export;
    assert.equal(exp.schemaVersion, 1);
    assert.equal(exp.exportId, 'export-id-001');
    assert.equal(exp.exportedBy, 'doctor-1');
    assert.equal(exp.organizationId, 'org-1');
    assert.equal(exp.clinicId, 'clinic-1');
    assert.equal(exp.corpusVersion, 'clarke-v1');
    assert.deepEqual([...exp.selectedRubricIds], ['rubric-1', 'rubric-2']);
    assert.deepEqual([...exp.resultRemedyIds], ['ars', 'belladonna']);

    // PHI fields must be structurally absent
    const exportKeys = Object.keys(exp);
    assert.ok(!exportKeys.includes('sessionId'), 'sessionId must be absent');
    assert.ok(!exportKeys.includes('patientId'), 'patientId must be absent');
  });

  await test('S02: session schemaVersion !== 1 -> NOT_FOUND', async () => {
    const session = { ...makeValidSession(), schemaVersion: 0 };
    const result = await runClinicianSessionExport(OPAQUE_ID, BASE_ENTITLEMENT, makeDeps(session));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'NOT_FOUND');
  });

  await test('S03: session.userId !== entitlement.doctorId -> NOT_FOUND', async () => {
    const session = makeValidSession({ userId: 'other-doctor' });
    const result = await runClinicianSessionExport(OPAQUE_ID, BASE_ENTITLEMENT, makeDeps(session));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'NOT_FOUND');
  });

  await test('S04: session.organizationId !== entitlement.organizationId -> NOT_FOUND', async () => {
    const session = makeValidSession({ organizationId: 'other-org' });
    const result = await runClinicianSessionExport(OPAQUE_ID, BASE_ENTITLEMENT, makeDeps(session));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'NOT_FOUND');
  });

  await test('S05: patient access checker returns mismatch -> NOT_FOUND', async () => {
    const session = makeValidSession();
    const result = await runClinicianSessionExport(OPAQUE_ID, BASE_ENTITLEMENT, makeDeps(session, false));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'NOT_FOUND');
  });

  await test('S06: parsePersistedSession rejects non-ISO createdAt -> NOT_FOUND', async () => {
    const session = { ...makeValidSession(), createdAt: 'not-a-date' };
    const result = await runClinicianSessionExport(OPAQUE_ID, BASE_ENTITLEMENT, makeDeps(session));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'NOT_FOUND');
  });

  await test('session not found in repo -> NOT_FOUND', async () => {
    const result = await runClinicianSessionExport(OPAQUE_ID, BASE_ENTITLEMENT, makeDeps(null));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'NOT_FOUND');
  });

  await test('wrong session ID format (not rsess_) -> NOT_FOUND without repo call', async () => {
    let repoCalled = false;
    const deps: ExportServiceDeps = {
      sessionRepo: { getById: async () => { repoCalled = true; return makeValidSession(); } },
      patientAccess: { check: async () => ({ allowed: true }) },
      idGenerator: () => 'x',
      now: () => new Date(),
    };
    // Old-style patient-encoded ID — must be rejected before any repo call
    const result = await runClinicianSessionExport('session_patient-abc_1720938382000', BASE_ENTITLEMENT, deps);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'NOT_FOUND');
    assert.equal(repoCalled, false, 'repo must not be called for malformed session ID');
  });

  // ─── Summary ──────────────────────────────────────────────────────────────────

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);

})();
