/**
 * repertoryExportRoute.test.ts — R2
 *
 * Contract tests for the GET and POST export route handlers.
 * All external dependencies are stubbed via the factory functions exported from
 * export/handlers.ts — no module mocks, no global patching.
 *
 * GET scenarios (11):  auth, RBAC, valid types, invalid type
 * POST scenarios (14): auth, rate-limit, body, entitlement, service outcomes
 * Total: 25 scenarios
 *
 * Note: compiled with module:commonjs / target:es2020, so top-level await is
 * not available. All async test calls are wrapped in a self-invoking async IIFE.
 */
import "./setupEnv";
import assert from 'assert';
import { NextRequest, NextResponse } from 'next/server';
import {
  createExportGetHandler,
  createExportPostHandler,
  type ExportGetDeps,
  type ExportPostDeps,
} from '../src/app/api/repertory/export/handlers';
import type { AuthorizedRepertoryRequest, DeniedRepertoryRequest } from '../src/features/repertory/access/RepertoryRequestAuthorization';
import type { DoctorRepertoryEntitlement } from '../src/features/repertory/access/DoctorEntitlementService';
import type { ExportServiceDeps } from '../src/features/repertory/export/RepertorySessionExportService';

// ─── Stub builders ────────────────────────────────────────────────────────────

function makeGetRequest(type?: string): NextRequest {
  const url = `https://example.com/api/repertory/export${type !== undefined ? `?type=${type}` : ''}`;
  return new NextRequest(url, { method: 'GET' });
}

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest('https://example.com/api/repertory/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function authorizedGetResult(): { authorized: true; session: { uid: string } } {
  return { authorized: true, session: { uid: 'super-admin-uid' } };
}

function deniedGetResult(status: 401 | 403): { authorized: false; response: NextResponse } {
  return {
    authorized: false,
    response: NextResponse.json({ ok: false }, { status }),
  };
}

function authorizedPostResult(): AuthorizedRepertoryRequest {
  return {
    authorized: true,
    session: { uid: 'doctor-uid', email: 'doc@example.com', role: 'doctor', name: 'Dr. Test' },
    authorizationPath: 'doctor-entitlement',
    tenantCacheScope: 'org-1:clinic-1:doctor-uid',
  };
}

function deniedPostResult(): DeniedRepertoryRequest {
  return {
    authorized: false,
    response: NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 }),
  };
}

const fullEntitlement: DoctorRepertoryEntitlement = {
  organizationId: 'org-1',
  clinicId: 'clinic-1',
  doctorId: 'doctor-uid',
  status: 'active',
  capabilities: ['search', 'repertorize', 'export-json', 'export-pdf'],
};

const SESSION_ID = 'rsess_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';

function makeGetDeps(overrides: Partial<ExportGetDeps> = {}): ExportGetDeps {
  return {
    authorize: async () => authorizedGetResult(),
    exportToJSON: async () => '{"ok":true}',
    exportToCSV: async () => 'col1,col2',
    exportToMDX: async () => '# MDX',
    exportToGraphTriples: async () => '<a> <b> <c> .',
    ...overrides,
  };
}

function makePostDeps(
  overrides: Partial<ExportPostDeps> = {},
  serviceResult: Awaited<ReturnType<typeof import('../src/features/repertory/export/RepertorySessionExportService').runClinicianSessionExport>> = {
    ok: true,
    export: {
      schemaVersion: 1,
      exportId: 'exp-001',
      exportedAt: new Date().toISOString(),
      exportedBy: 'doctor-uid',
      organizationId: 'org-1',
      clinicId: 'clinic-1',
      corpusVersion: 'v1',
      selectedRubricIds: ['r1'],
      resultRemedyIds: ['ars'],
    },
  },
): ExportPostDeps {
  return {
    authorize: async () => authorizedPostResult(),
    rateLimit: () => ({ allowed: true }),
    resolveEntitlement: async () => fullEntitlement,
    runExport: async () => serviceResult,
    sessionRepo: { getById: async () => null },
    patientAccess: { check: async () => ({ allowed: true }) },
    idGenerator: () => 'exp-001',
    now: () => new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

async function getJson(res: NextResponse) {
  return res.json();
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

  // ─── GET Tests ──────────────────────────────────────────────────────────────

  console.log('\nGET /api/repertory/export\n');

  await test('G01: unauthenticated -> 401', async () => {
    const handler = createExportGetHandler(makeGetDeps({ authorize: async () => deniedGetResult(401) }));
    const res = await handler(makeGetRequest('json'));
    assert.equal(res.status, 401);
  });

  await test('G02: forbidden (doctor role) -> 403', async () => {
    const handler = createExportGetHandler(makeGetDeps({ authorize: async () => deniedGetResult(403) }));
    const res = await handler(makeGetRequest('json'));
    assert.equal(res.status, 403);
  });

  await test('G03: missing type param -> 400 INVALID_TYPE', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest());
    assert.equal(res.status, 400);
    const body = await getJson(res);
    assert.equal(body.error.code, 'INVALID_TYPE');
  });

  await test('G04: type=unknown -> 400 INVALID_TYPE', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest('unknown'));
    assert.equal(res.status, 400);
    const body = await getJson(res);
    assert.equal(body.error.code, 'INVALID_TYPE');
  });

  await test('G05: type=json -> 200 with content', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest('json'));
    assert.equal(res.status, 200);
    const body = await getJson(res);
    assert.equal(body.success, true);
    assert.ok(typeof body.content === 'string');
  });

  await test('G06: type=csv -> 200 with content', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest('csv'));
    assert.equal(res.status, 200);
    const body = await getJson(res);
    assert.equal(body.success, true);
  });

  await test('G07: type=mdx -> 200 with content', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest('mdx'));
    assert.equal(res.status, 200);
    const body = await getJson(res);
    assert.equal(body.success, true);
  });

  await test('G08: type=triples -> 200 with content', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest('triples'));
    assert.equal(res.status, 200);
    const body = await getJson(res);
    assert.equal(body.success, true);
  });

  await test('G09: Cache-Control is no-store on 200', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest('json'));
    assert.ok(res.headers.get('Cache-Control')?.includes('no-store'));
  });

  await test('G10: Cache-Control is no-store on 400', async () => {
    const handler = createExportGetHandler(makeGetDeps());
    const res = await handler(makeGetRequest('bad'));
    assert.ok(res.headers.get('Cache-Control')?.includes('no-store'));
  });

  await test('G11: authorize called exactly once per request', async () => {
    let callCount = 0;
    const handler = createExportGetHandler(
      makeGetDeps({
        authorize: async () => {
          callCount++;
          return authorizedGetResult();
        },
      }),
    );
    await handler(makeGetRequest('json'));
    assert.equal(callCount, 1);
  });

  // ─── POST Tests ─────────────────────────────────────────────────────────────

  console.log('\nPOST /api/repertory/export\n');

  await test('P01: unauthenticated -> 401', async () => {
    const handler = createExportPostHandler(makePostDeps({ authorize: async () => deniedPostResult() }));
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.equal(res.status, 401);
  });

  await test('P02: rate-limited -> 429', async () => {
    const handler = createExportPostHandler(
      makePostDeps({ rateLimit: () => ({ allowed: false, retryAfterSeconds: 30 }) }),
    );
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.equal(res.status, 429);
  });

  await test('P03: body > 4 KB -> 413', async () => {
    const largeSessionId = SESSION_ID + 'x'.repeat(4500);
    const handler = createExportPostHandler(makePostDeps());
    const res = await handler(makePostRequest({ sessionId: largeSessionId }));
    assert.equal(res.status, 413);
    const body = await getJson(res);
    assert.equal(body.error.code, 'PAYLOAD_TOO_LARGE');
  });

  await test('P04: invalid JSON -> 400 INVALID_JSON', async () => {
    const req = new NextRequest('https://example.com/api/repertory/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not-json',
    });
    const handler = createExportPostHandler(makePostDeps());
    const res = await handler(req);
    assert.equal(res.status, 400);
    const body = await getJson(res);
    assert.equal(body.error.code, 'INVALID_JSON');
  });

  await test('P05: extra field in body -> 400 INVALID_INPUT', async () => {
    const handler = createExportPostHandler(makePostDeps());
    const res = await handler(makePostRequest({ sessionId: SESSION_ID, extra: 'field' }));
    assert.equal(res.status, 400);
    const body = await getJson(res);
    assert.equal(body.error.code, 'INVALID_INPUT');
  });

  await test('P06: missing sessionId -> 400 INVALID_INPUT', async () => {
    const handler = createExportPostHandler(makePostDeps());
    const res = await handler(makePostRequest({}));
    assert.equal(res.status, 400);
  });

  await test('P07: sessionId not a string -> 400 INVALID_INPUT', async () => {
    const handler = createExportPostHandler(makePostDeps());
    const res = await handler(makePostRequest({ sessionId: 12345 }));
    assert.equal(res.status, 400);
  });

  await test('P08: no entitlement -> 403', async () => {
    const handler = createExportPostHandler(makePostDeps({ resolveEntitlement: async () => null }));
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.equal(res.status, 403);
    const body = await getJson(res);
    assert.equal(body.error.code, 'FORBIDDEN');
  });

  await test('P09: service returns NOT_FOUND -> 404', async () => {
    const handler = createExportPostHandler(makePostDeps({}, { ok: false, code: 'NOT_FOUND' }));
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.equal(res.status, 404);
    const body = await getJson(res);
    assert.equal(body.error.code, 'NOT_FOUND');
  });

  await test('P10: service returns PHI_DETECTED -> 400', async () => {
    const handler = createExportPostHandler(makePostDeps({}, { ok: false, code: 'PHI_DETECTED' }));
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.equal(res.status, 400);
    const body = await getJson(res);
    assert.equal(body.error.code, 'PHI_DETECTED');
  });

  await test('P11: service returns INTERNAL -> 500', async () => {
    const handler = createExportPostHandler(makePostDeps({}, { ok: false, code: 'INTERNAL' }));
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.equal(res.status, 500);
  });

  await test('P12: service returns ok:true -> 200 with PHI-safe export object', async () => {
    const handler = createExportPostHandler(makePostDeps());
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.equal(res.status, 200);
    const body = await getJson(res);
    assert.equal(body.ok, true);
    assert.ok(body.export, 'export field must be present');
    assert.equal(body.export.schemaVersion, 1);
    assert.ok(!Object.keys(body.export).includes('sessionId'), 'sessionId must be absent');
    assert.ok(!Object.keys(body.export).includes('patientId'), 'patientId must be absent');
  });

  await test('P13: 200 response has no-store Cache-Control', async () => {
    const handler = createExportPostHandler(makePostDeps());
    const res = await handler(makePostRequest({ sessionId: SESSION_ID }));
    assert.ok(res.headers.get('Cache-Control')?.includes('no-store'));
  });

  await test('P14: service deps are forwarded: sessionRepo, patientAccess, idGenerator, now', async () => {
    let capturedDeps: ExportServiceDeps | undefined;
    const handler = createExportPostHandler(
      makePostDeps({
        runExport: async (_sid, _ent, deps) => {
          capturedDeps = deps;
          return { ok: true, export: makePostDeps().runExport as any } as any;
        },
      }),
    );
    try { await handler(makePostRequest({ sessionId: SESSION_ID })); } catch { /* ok */ }
    assert.ok(capturedDeps, 'deps must be forwarded to runExport');
    assert.ok(typeof capturedDeps!.idGenerator === 'function');
    assert.ok(typeof capturedDeps!.now === 'function');
    assert.ok(typeof capturedDeps!.sessionRepo.getById === 'function');
    assert.ok(typeof capturedDeps!.patientAccess.check === 'function');
  });

  // ─── Summary ────────────────────────────────────────────────────────────────

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);

})();
