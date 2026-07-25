import "./setupEnv";
import assert from "assert";
import { NextRequest } from "next/server";
import { getAdminDb } from "../src/lib/firebaseAdmin";
import { createAdminSessionCookie } from "../src/lib/adminSession";
import { resetRepertoryRateLimitsForTests } from "../src/features/repertory/security/RepertoryApiSecurity";
import * as practitionerRepo from "../src/features/admin-users/practitionerRepository";
import * as doctorEntitlementRepo from "../src/features/repertory/access/DoctorEntitlementRepository";

// Force mock firestore environment
process.env.NODE_ENV = "test";
process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
process.env.GCLOUD_PROJECT = "test-project-id";
process.env.FIRESTORE_PROJECT_ID = "test-project-id";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project-id";
process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";
process.env.ALLOWED_ORIGINS = "http://localhost:3000,https://homeo.healthcare,https://www.homeo.healthcare";
process.env.CLINICAL_PSEUDONYMIZATION_SECRET = "test-clinical-pseudonymization-secret-key-123";
process.env.REPERTORY_SEEDING_ENABLED = "true";

// Import route handlers
import { POST as savePOST, OPTIONS as saveOPTIONS } from "../src/app/api/repertory/save/route";
import { POST as deletePOST } from "../src/app/api/repertory/delete/route";
import { POST as seedPOST, OPTIONS as seedOPTIONS, GET as seedGET } from "../src/app/api/repertory/seed/route";
import { POST as comparePOST, OPTIONS as compareOPTIONS, GET as compareGET } from "../src/app/api/repertory/v2-compare/route";
import { POST as livePOST, OPTIONS as liveOPTIONS, GET as liveGET } from "../src/app/api/repertory/v2-live/route";
import { POST as feedbackPOST, OPTIONS as feedbackOPTIONS } from "../src/app/api/repertory/v2-feedback/route";

// Track mock read/write calls
let mockReads = 0;
let mockWrites = 0;

// Setup comprehensive database tracking to cover queries, staged batch/transaction operations
function isDomainCollection(name: string): boolean {
  return ["rubrics", "v2ClinicalFeedback", "synonyms", "system_config"].includes(name);
}

function setupMockDatabaseTracking() {
  const db = getAdminDb();

  // Clear mock database store
  if (typeof db.clearStore === "function") {
    db.clearStore();
  }

  const originalCollection = db.collection.bind(db);
  db.collection = (name: string) => {
    const isDomain = isDomainCollection(name);
    const col = originalCollection(name);
    const originalDoc = col.doc.bind(col);

    col.doc = (id: string) => {
      const docRef = originalDoc(id);

      const originalGet = docRef.get.bind(docRef);
      docRef.get = async () => {
        if (isDomain) mockReads++;
        return originalGet();
      };

      const originalSet = docRef.set.bind(docRef);
      docRef.set = async (data: any) => {
        if (isDomain) mockWrites++;
        return originalSet(data);
      };

      const originalUpdate = docRef.update.bind(docRef);
      docRef.update = async (data: any) => {
        if (isDomain) mockWrites++;
        return originalUpdate(data);
      };

      const originalDelete = docRef.delete.bind(docRef);
      docRef.delete = async () => {
        if (isDomain) mockWrites++;
        return originalDelete();
      };

      return docRef;
    };

    const originalAdd = col.add.bind(col);
    col.add = async (data: any) => {
      if (isDomain) mockWrites++;
      return originalAdd(data);
    };

    // Track query calls (e.g. col.get(), col.where().get())
    const originalGet = col.get.bind(col);
    col.get = async () => {
      if (isDomain) mockReads++;
      return originalGet();
    };

    const originalWhere = col.where.bind(col);
    col.where = (field: string, op: string, val: any) => {
      const q = originalWhere(field, op, val);
      const originalQueryGet = q.get.bind(q);
      q.get = async () => {
        if (isDomain) mockReads++;
        return originalQueryGet();
      };

      const originalQueryLimit = q.limit?.bind(q);
      if (originalQueryLimit) {
        q.limit = (n: number) => {
          const l = originalQueryLimit(n);
          const originalLimitGet = l.get.bind(l);
          l.get = async () => {
            if (isDomain) mockReads++;
            return originalLimitGet();
          };
          return l;
        };
      }
      return q;
    };

    return col;
  };

  // Intercept and track Firestore transaction reads/writes
  const originalRunTransaction = db.runTransaction.bind(db);
  db.runTransaction = async (cb: any) => {
    return originalRunTransaction(async (tx: any) => {
      const wrappedTx = {
        get: async (docRef: any) => {
          const colName = docRef?.parent?.id || docRef?.collectionName;
          if (colName && isDomainCollection(colName)) {
            mockReads++;
          }
          return tx.get(docRef);
        },
        set: (docRef: any, data: any) => {
          const colName = docRef?.parent?.id || docRef?.collectionName;
          if (colName && isDomainCollection(colName)) {
            mockWrites++;
          }
          return tx.set(docRef, data);
        },
        update: (docRef: any, data: any) => {
          const colName = docRef?.parent?.id || docRef?.collectionName;
          if (colName && isDomainCollection(colName)) {
            mockWrites++;
          }
          return tx.update(docRef, data);
        },
        delete: (docRef: any) => {
          const colName = docRef?.parent?.id || docRef?.collectionName;
          if (colName && isDomainCollection(colName)) {
            mockWrites++;
          }
          return tx.delete(docRef);
        },
      };
      return cb(wrappedTx);
    });
  };
}

function resetDbStats() {
  mockReads = 0;
  mockWrites = 0;
}

// Global log capture helpers
let capturedLogs: string[] = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

function startLogCapture() {
  capturedLogs = [];
  console.error = (...args: any[]) => {
    capturedLogs.push(args.join(" "));
  };
  console.warn = (...args: any[]) => {
    capturedLogs.push(args.join(" "));
  };
}

function stopLogCapture() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

// Helpers to mock requests
function mockRequest(
  url: string,
  method: string,
  origin: string | null,
  cookieValue?: string,
  body?: any,
  customHeaders?: Record<string, string>,
  rawBodyString?: string
): NextRequest {
  const headers = new Headers();
  if (origin) {
    headers.set("origin", origin);
  }
  if (cookieValue) {
    headers.set("cookie", `hh_admin_session_v3=${cookieValue}`);
  }
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([k, v]) => {
      headers.set(k, v);
    });
  }

  const options: any = {
    method,
    headers,
  };

  if (rawBodyString !== undefined) {
    options.body = rawBodyString;
  } else if (body !== undefined) {
    const jsonStr = JSON.stringify(body);
    options.body = jsonStr;
    if (!headers.has("content-length")) {
      headers.set("content-length", String(jsonStr.length));
    }
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
  }

  return new NextRequest(url, options as any);
}

// Mock stream body reader to verify cancellation
function mockStreamRequest(
  url: string,
  method: string,
  origin: string | null,
  cookieValue: string,
  chunks: Uint8Array[],
  onCancelSpy: () => void
): NextRequest {
  const req = mockRequest(url, method, origin, cookieValue, undefined);
  let chunkIdx = 0;
  const customStream = {
    getReader() {
      return {
        async read() {
          if (chunkIdx >= chunks.length) {
            return { done: true, value: undefined };
          }
          return { done: false, value: chunks[chunkIdx++] };
        },
        async cancel() {
          onCancelSpy();
        },
      };
    },
  };

  Object.defineProperty(req, "body", {
    get() {
      return customStream;
    },
    configurable: true,
  });

  return req;
}

async function runTests() {
  console.log("🚀 Starting Repertory Route Security & Audit Hardening Test Suite...");
  // Enable pilot configurations
  process.env.REPERTORY_DOCTOR_PILOT_ENABLED = "true";
  process.env.REPERTORY_DOCTOR_PILOT_UIDS = "pilot-doc-123";
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      resetRepertoryRateLimitsForTests();
      resetDbStats();
      startLogCapture();
      await fn();
      stopLogCapture();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      stopLogCapture();
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  setupMockDatabaseTracking();

  // Pre-seed accounts & EMR Entitlements
  const db = getAdminDb();

  const superAdminDoc = {
    id: "super-admin-1",
    uid: "super-admin-1",
    email: "superadmin@homeo.healthcare",
    role: "super-admin" as const,
    status: "active" as const,
    organizationId: "system",
    clinicId: "admin",
    repertoryCapabilities: ["repertorize", "search", "export-json", "export-pdf"] as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection("practitioner_accounts").add(superAdminDoc);
  practitionerRepo.memoryPractitionerAccounts.push(superAdminDoc);

  const editorDoc = {
    id: "editor-1",
    uid: "editor-1",
    email: "editor@homeo.healthcare",
    role: "editor" as const,
    status: "active" as const,
    organizationId: "system",
    clinicId: "admin",
    repertoryCapabilities: ["search"] as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection("practitioner_accounts").add(editorDoc);
  practitionerRepo.memoryPractitionerAccounts.push(editorDoc);

  const pilotDoc = {
    id: "pilot-doc-123",
    uid: "pilot-doc-123",
    email: "doctor@homeo.healthcare",
    role: "read-only-admin" as const,
    status: "active" as const,
    organizationId: "pilot-org",
    clinicId: "pilot-clinic",
    repertoryCapabilities: ["repertorize", "search"] as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection("practitioner_accounts").add(pilotDoc);
  practitionerRepo.memoryPractitionerAccounts.push(pilotDoc);

  // Setup cookies
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const superAdminCookie = await createAdminSessionCookie({
    uid: "super-admin-1",
    email: "superadmin@homeo.healthcare",
    role: "super-admin",
    name: "Dr. Admin",
    exp,
  });

  const editorCookie = await createAdminSessionCookie({
    uid: "editor-1",
    email: "editor@homeo.healthcare",
    role: "editor",
    name: "Dr. Editor",
    exp,
  });

  const pilotDocCookie = await createAdminSessionCookie({
    uid: "pilot-doc-123",
    email: "doctor@homeo.healthcare",
    role: "read-only-admin",
    name: "Dr. Jethwani",
    exp,
  });

  // ─── 1. CORS & CSRF ───────────────────────────────────────────────────────
  await test("POST save rejects disallowed origin before auth and writes", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://malicious-attacker.com", editorCookie, {
      action: "save",
      rubricData: { name: "Attacker Custom Rubric" },
    });
    const res = await savePOST(req);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(mockReads, 0);
    assert.strictEqual(mockWrites, 0);
  });

  await test("OPTIONS save returns valid CORS headers for allowed origin", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/save", "OPTIONS", "https://homeo.healthcare");
    const res = await saveOPTIONS(req);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("access-control-allow-origin"), "https://homeo.healthcare");
  });

  // ─── 2. AUTHENTICATION & AUTHORIZATION ────────────────────────────────────
  await test("POST save returns 401 for unauthenticated client", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", undefined, {
      action: "save",
      rubricData: { name: "Anonymous Rubric" },
    });
    const res = await savePOST(req);
    assert.strictEqual(res.status, 401);
    assert.strictEqual(mockWrites, 0);
  });

  await test("POST save allows editor role to write", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
      action: "save",
      rubricData: { name: "Valid Custom Rubric" },
    });
    const res = await savePOST(req);
    assert.strictEqual(res.status, 200);
    assert.ok(mockWrites > 0);
  });

  await test("POST save denies pilot doctor (insufficient permissions for admin write)", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", pilotDocCookie, {
      action: "save",
      rubricData: { name: "Doctor Save Custom Rubric" },
    });
    const res = await savePOST(req);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(mockWrites, 0);
  });

  // ─── 3. OVERWRITE PROTECTION ─────────────────────────────────────────────
  await test("POST save rejects overwriting standard published rubrics", async () => {
    // Standard published rubric already seeded
    await db.collection("rubrics").doc("jeth_a_burnout").set({
      id: "jeth_a_burnout",
      name: "Burnout, exhaustion state",
      status: "active",
    });

    const req = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
      action: "save",
      rubricData: { id: "jeth_a_burnout", name: "Malicious Edit" },
    });
    const res = await savePOST(req);
    assert.strictEqual(res.status, 403);
  });

  await test("POST delete rejects deletion of standard published rubrics", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/delete", "POST", "https://homeo.healthcare", editorCookie, {
      id: "jeth_a_burnout",
    });
    const res = await deletePOST(req);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(mockWrites, 0);
  });

  // ─── 4. STREAM-BOUND REQUEST SIZE GUARANTEES ─────────────────────────────
  await test("POST save rejects oversized request and cancels stream", async () => {
    let cancelCalled = false;
    const chunks = [
      new Uint8Array(4096),
      new Uint8Array(4096),
      new Uint8Array(4096),
    ];
    const req = mockStreamRequest(
      "http://localhost:3000/api/repertory/save",
      "POST",
      "https://homeo.healthcare",
      editorCookie,
      chunks,
      () => { cancelCalled = true; }
    );
    const res = await savePOST(req);
    assert.strictEqual(res.status, 413);
    assert.strictEqual(cancelCalled, true, "Stream must be cancelled early upon overflow");
    assert.strictEqual(mockReads, 0);
    assert.strictEqual(mockWrites, 0);
  });

  await test("Stream limits enforce exact boundaries", async () => {
    const exactBody = JSON.stringify({ id: "custom_r123" }).padEnd(1024, " ");
    assert.strictEqual(Buffer.byteLength(exactBody, "utf8"), 1024);

    const reqExact = mockRequest("http://localhost:3000/api/repertory/delete", "POST", "https://homeo.healthcare", editorCookie, undefined, undefined, exactBody);
    const resExact = await deletePOST(reqExact);
    assert.notStrictEqual(resExact.status, 413);

    const overflowBody = exactBody + " ";
    assert.strictEqual(Buffer.byteLength(overflowBody, "utf8"), 1025);
    const reqOverflow = mockRequest("http://localhost:3000/api/repertory/delete", "POST", "https://homeo.healthcare", editorCookie, undefined, undefined, overflowBody);
    const resOverflow = await deletePOST(reqOverflow);
    assert.strictEqual(resOverflow.status, 413);
  });

  await test("Content-Length header is not trusted for size enforcement (bypass prevention)", async () => {
    const largeBody = JSON.stringify({ action: "save", rubricData: { name: "A".repeat(12000) } });
    const reqUnderstated = mockRequest(
      "http://localhost:3000/api/repertory/save",
      "POST",
      "https://homeo.healthcare",
      editorCookie,
      undefined,
      { "content-length": "10" },
      largeBody
    );
    const resUnderstated = await savePOST(reqUnderstated);
    assert.strictEqual(resUnderstated.status, 413);

    const reqMissing = mockRequest(
      "http://localhost:3000/api/repertory/save",
      "POST",
      "https://homeo.healthcare",
      editorCookie,
      undefined,
      {},
      largeBody
    );
    reqMissing.headers.delete("content-length");
    const resMissing = await savePOST(reqMissing);
    assert.strictEqual(resMissing.status, 413);
  });

  await test("Oversized multibyte UTF-8 bodies are blocked", async () => {
    const emojiBody = JSON.stringify({ action: "save", rubricData: { name: "🌟".repeat(3000) } });
    const reqEmoji = mockRequest(
      "http://localhost:3000/api/repertory/save",
      "POST",
      "https://homeo.healthcare",
      editorCookie,
      undefined,
      {},
      emojiBody
    );
    const resEmoji = await savePOST(reqEmoji);
    assert.strictEqual(resEmoji.status, 413);
  });

  // ─── 5. SCHEMA CONSTRAINTS & PAYLOAD COMBINATIONS ───────────────────────
  await test("POST save rejects wrong payload combination", async () => {
    const req1 = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
      action: "save",
      mergeData: { targetName: "Invalid merge", sourceIds: ["id1"] },
    });
    const res1 = await savePOST(req1);
    assert.strictEqual(res1.status, 400);

    const req2 = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
      action: "merge",
      rubricData: { name: "Invalid rubric" },
    });
    const res2 = await savePOST(req2);
    assert.strictEqual(res2.status, 400);
  });

  await test("POST feedback fully bounds and validates arrays and rejects malformed IDs", async () => {
    const reqBadId = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
      mode: "v2-live",
      decision: "v2_better",
      query: "some query",
      v1TopRubricIds: ["valid_id", "bad#id"],
      v2TopRubricIds: ["valid_id2"],
      v2TopRemedyIds: ["valid_rem"],
      comparisonSummary: {
        commonRubricIds: ["valid_common"],
      },
    });
    const resBadId = await feedbackPOST(reqBadId);
    assert.strictEqual(resBadId.status, 400);

    // jeth_a_burnout is valid, Puls is a valid remedy
    const reqGood = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
      mode: "v2-live",
      decision: "v2_better",
      query: "some query",
      v1TopRubricIds: ["jeth_a_burnout"],
      v2TopRubricIds: ["jeth_a_burnout"],
      v2TopRemedyIds: ["Puls"],
      comparisonSummary: {
        commonRubricIds: ["jeth_a_burnout"],
      },
    });
    const resGood = await feedbackPOST(reqGood);
    assert.strictEqual(resGood.status, 200);
  });

  // ─── 6. ATOMIC SEED IDEMPOTENCY & CONCURRENCY TESTS ──────────────────────
  await test("POST seed returns 409 and executes zero writes on second attempt", async () => {
    const rawStore = (db as any).store;
    if (rawStore) {
      rawStore["rubrics"] = {};
      rawStore["system_config"] = {};
    }

    const req1 = mockRequest("http://localhost:3000/api/repertory/seed", "POST", "https://homeo.healthcare", superAdminCookie, { action: "seed_default" });
    const res1 = await seedPOST(req1);
    assert.strictEqual(res1.status, 200);
    assert.ok(mockWrites > 0);

    resetDbStats();
    const req2 = mockRequest("http://localhost:3000/api/repertory/seed", "POST", "https://homeo.healthcare", superAdminCookie, { action: "seed_default" });
    const res2 = await seedPOST(req2);
    assert.strictEqual(res2.status, 409);
    assert.strictEqual(mockWrites, 0, "No duplicate writes allowed on secondary seeding attempts");
  });

  await test("Atomic concurrency: concurrent seed requests trigger conflict safety", async () => {
    const rawStore = (db as any).store;
    if (rawStore) {
      rawStore["rubrics"] = {};
      rawStore["system_config"] = {};
    }
    resetDbStats();

    const req1 = mockRequest("http://localhost:3000/api/repertory/seed", "POST", "https://homeo.healthcare", superAdminCookie, { action: "seed_default" });
    const req2 = mockRequest("http://localhost:3000/api/repertory/seed", "POST", "https://homeo.healthcare", superAdminCookie, { action: "seed_default" });

    const [res1, res2] = await Promise.all([
      seedPOST(req1),
      seedPOST(req2),
    ]);

    const statuses = [res1.status, res2.status];
    assert.ok(statuses.includes(200), "One concurrent request must succeed");
    assert.ok(statuses.includes(409), "The other concurrent request must return 409 Conflict");
  });

  // ─── 7. EXCEPTION LOG REDACTION & SENTINEL CHECKS ────────────────────────
  await test("All exceptions are generic and log no sensitive sentinels", async () => {
    const sentinelVal = "TRIGGER_SENSITIVE_SENTINEL_VAL_123_XYZ";
    const originalCollection = db.collection.bind(db);
    db.collection = () => {
      throw new Error(`Database operation crashed: ${sentinelVal}`);
    };

    try {
      const req = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
        action: "save",
        rubricData: { name: "Trigger Exception" },
      });
      const res = await savePOST(req);
      assert.strictEqual(res.status, 500);

      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.strictEqual(body.message, "An internal server error occurred while performing the save action.");

      const loggedOutput = capturedLogs.join(" ");
      assert.ok(!loggedOutput.includes(sentinelVal), "Sensitive exception sentinel must never be logged");
      assert.ok(!loggedOutput.includes("Error:"), "Original exception objects/stacks must not be passed to console logs");
    } finally {
      db.collection = originalCollection;
    }
  });

  // ─── 8. SAME-SUBJECT RATE-LIMIT SEQUENCE ─────────────────────────────────
  await test("Blocked unauthorized calls consume no rate limit slot for the same user identity", async () => {
    for (let i = 0; i < 20; i++) {
      const reqUnauth = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", pilotDocCookie, {
        action: "save",
        rubricData: { name: `Unauthorized Save #${i}` },
      });
      const res = await savePOST(reqUnauth);
      assert.strictEqual(res.status, 403);
    }

    const pilotDocElevatedCookie = await createAdminSessionCookie({
      uid: "pilot-doc-123",
      email: "doctor@homeo.healthcare",
      role: "super-admin",
      name: "Dr. Jethwani (Elevated)",
      exp,
    });

    for (let i = 0; i < 20; i++) {
      const reqAuth = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", pilotDocElevatedCookie, {
        action: "save",
        rubricData: { name: `Newly Authorized Save #${i}` },
      });
      const res = await savePOST(reqAuth);
      assert.strictEqual(res.status, 200, "Should allow requests since previous unauthorized attempts consumed no slots");
    }
  });

  // ─── 9. ADDITIONAL METHODS & PREFLIGHT COVERAGE ─────────────────────────────
  await test("GET seed/live/compare return 405 Method Not Allowed", async () => {
    let req = mockRequest("http://localhost:3000/api/repertory/seed", "GET", "https://homeo.healthcare");
    let res = await seedGET(req);
    assert.strictEqual(res.status, 405);

    req = mockRequest("http://localhost:3000/api/repertory/v2-live", "GET", "https://homeo.healthcare");
    res = await liveGET(req);
    assert.strictEqual(res.status, 405);

    req = mockRequest("http://localhost:3000/api/repertory/v2-compare", "GET", "https://homeo.healthcare");
    res = await compareGET(req);
    assert.strictEqual(res.status, 405);
  });

  await test("OPTIONS compare/live/feedback/seed return valid preflights", async () => {
    let req = mockRequest("http://localhost:3000/api/repertory/v2-compare", "OPTIONS", "https://homeo.healthcare");
    let res = await compareOPTIONS(req);
    assert.strictEqual(res.status, 200);

    req = mockRequest("http://localhost:3000/api/repertory/v2-live", "OPTIONS", "https://homeo.healthcare");
    res = await liveOPTIONS(req);
    assert.strictEqual(res.status, 200);

    req = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "OPTIONS", "https://homeo.healthcare");
    res = await feedbackOPTIONS(req);
    assert.strictEqual(res.status, 200);

    req = mockRequest("http://localhost:3000/api/repertory/seed", "OPTIONS", "https://homeo.healthcare");
    res = await seedOPTIONS(req);
    assert.strictEqual(res.status, 200);
  });

  // ─── 10. REAL UI CONTRACT & DTO STRUCTURE TESTS ──────────────────────────
  await test("V2 Compare endpoint contract matches UI expectation", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/v2-compare", "POST", "https://homeo.healthcare", superAdminCookie, {
      query: "burnout",
      filters: { category: "Psychology & Psychiatry" },
      selectedRubricIds: ["jeth_a_burnout"],
    });
    const res = await comparePOST(req);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.mode, "compare");
    assert.ok(body.v1, "v1 block must be present");
    assert.ok(body.v2, "v2 block must be present");
    assert.ok(body.comparison, "comparison block must be present");
    assert.ok(Array.isArray(body.comparison.clinicalExplanation), "clinicalExplanation must be present in comparison");
  });

  await test("V2 Live endpoint contract matches UI expectation", async () => {
    const req = mockRequest("http://localhost:3000/api/repertory/v2-live", "POST", "https://homeo.healthcare", pilotDocCookie, {
      query: "burnout",
      filters: { category: "Psychology & Psychiatry" },
      selectedRubricIds: ["jeth_a_burnout"],
    });
    const res = await livePOST(req);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.ok(body.success, "Response should indicate success");
    assert.strictEqual(body.mode, "v2-live");
    assert.ok(body.search, "search results block must be present");
    assert.ok(body.repertorization, "repertorization block must be present");
    assert.ok(Array.isArray(body.clinicalExplanation), "clinicalExplanation must be present");
  });

  await test("V2 Feedback endpoint contract matches UI expectation", async () => {
    resetDbStats();
    const req = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
      mode: "v2-live",
      decision: "v2_better",
      query: "Patient has burnout",
      note: "Urgent note - DO NOT STORE",
      filters: { category: "Psychology & Psychiatry" },
      v1TopRubricIds: ["jeth_a_burnout"],
      v2TopRubricIds: ["jeth_a_burnout"],
      v2TopRemedyIds: ["Puls"],
      comparisonSummary: {
        commonRubricIds: ["jeth_a_burnout"],
      },
    });
    const res = await feedbackPOST(req);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.feedbackId);

    // Fetch the document and verify PHI exclusion and database collection
    const feedbackSnap = await db.collection("v2ClinicalFeedback").doc(body.feedbackId).get();
    assert.ok(feedbackSnap.exists);
    const data = feedbackSnap.data();

    assert.ok(data.mode);
    assert.ok(data.decision);
    assert.ok(data.reviewer);
    assert.ok(data.reviewer.reviewerHash);
    // PHI fields must be stripped
    assert.strictEqual(data.query, undefined);
    assert.strictEqual(data.note, undefined);
    // Client-controlled filters must be completely omitted
    assert.strictEqual(data.filters, undefined);
  });

  // ─── 11. ADDITIONAL SEED PROTECTION & pre-existing rubric test ───────────
  await test("Seed fails closed with 409 on arbitrary pre-existing data", async () => {
    // Reset marker and seed a custom/arbitrary rubric that is NOT part of standard seeding
    await db.collection("system_config").doc("database_seeded_marker").delete();
    await db.collection("rubrics").doc("arbitrary_rubric_999").set({
      id: "arbitrary_rubric_999",
      name: "Pre-existing arbitrary rubric",
      status: "active",
    });

    resetDbStats();
    const req = mockRequest("http://localhost:3000/api/repertory/seed", "POST", "https://homeo.healthcare", superAdminCookie, { action: "seed_default" });
    const res = await seedPOST(req);
    // Should fail closed with 409 Conflict because rubrics collection is populated
    assert.strictEqual(res.status, 409);
    assert.strictEqual(mockWrites, 0, "Seeding must not overwrite any existing rubrics");
  });

  // ─── 12. ROUTE-SPECIFIC INTERNAL EXCEPTION PATH TESTS (500) ───────────────
  await test("All routes return status 500 on database/dependency failures", async () => {
    const originalCollection = db.collection.bind(db);
    db.collection = () => {
      throw new Error("Simulated database failure");
    };

    try {
      // 1. Save Route (Internal Crash)
      const saveReq = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
        action: "save",
        rubricData: { name: "Custom" },
      });
      const saveRes = await savePOST(saveReq);
      assert.strictEqual(saveRes.status, 500);

      // 2. Delete Route (Internal Crash)
      const deleteReq = mockRequest("http://localhost:3000/api/repertory/delete", "POST", "https://homeo.healthcare", editorCookie, {
        id: "some_id",
      });
      const deleteRes = await deletePOST(deleteReq);
      assert.strictEqual(deleteRes.status, 500);

      // 3. Seed Route (Internal Crash)
      const seedReq = mockRequest("http://localhost:3000/api/repertory/seed", "POST", "https://homeo.healthcare", superAdminCookie, {
        action: "seed_default",
      });
      const seedRes = await seedPOST(seedReq);
      assert.strictEqual(seedRes.status, 500);

      // 4. Compare Route (Internal Crash)
      const compareReq = mockRequest("http://localhost:3000/api/repertory/v2-compare", "POST", "https://homeo.healthcare", superAdminCookie, {
        query: "burnout",
      });
      const compareRes = await comparePOST(compareReq);
      assert.strictEqual(compareRes.status, 500);

      // 5. Live Route (Internal Crash)
      const liveReq = mockRequest("http://localhost:3000/api/repertory/v2-live", "POST", "https://homeo.healthcare", pilotDocCookie, {
        query: "burnout",
      });
      const liveRes = await livePOST(liveReq);
      assert.strictEqual(liveRes.status, 500);

      // 6. Feedback Route (Internal Crash)
      const feedbackReq = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
        mode: "v2-live",
        decision: "v2_better",
        query: "burnout",
      });
      const feedbackRes = await feedbackPOST(feedbackReq);
      assert.strictEqual(feedbackRes.status, 500);
    } finally {
      db.collection = originalCollection;
    }
  });

  // ─── 13. SEMANTIC ID PHI GUARD TESTS ─────────────────────────────────────
  await test("POST feedback rejects unknown / forged rubric and remedy identifiers with 400", async () => {
    // 1. Rejected rubric ID
    const reqBadRubric = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
      mode: "v2-live",
      decision: "v2_better",
      query: "burnout",
      v1TopRubricIds: ["patient_Alice_DOB_1988"],
    });
    const resBadRubric = await feedbackPOST(reqBadRubric);
    assert.strictEqual(resBadRubric.status, 400);

    // 2. Rejected remedy ID
    const reqBadRemedy = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
      mode: "v2-live",
      decision: "v2_better",
      query: "burnout",
      v2TopRemedyIds: ["patient_Bob_DOB_1990"],
    });
    const resBadRemedy = await feedbackPOST(reqBadRemedy);
    assert.strictEqual(resBadRemedy.status, 400);
  });

  // ─── 14. EMR ENTITLEMENT EXCEPTION REDACTION TEST ─────────────────────────
  await test("EMR entitlement repository lookup exceptions are caught and masked to 500", async () => {
    const sentinelVal = "SENTINEL_ENTITLEMENT_CRASH_999";
    const originalResolve = doctorEntitlementRepo.resolveDoctorRepertoryEntitlement;
    (doctorEntitlementRepo as any).resolveDoctorRepertoryEntitlement = async () => {
      throw new Error(sentinelVal);
    };

    try {
      const req = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
        mode: "v2-live",
        decision: "v2_better",
        query: "patient has burnout",
        v1TopRubricIds: ["jeth_a_burnout"],
      });

      const res = await feedbackPOST(req);
      assert.strictEqual(res.status, 500);

      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.strictEqual(body.message, "Unable to store V2 feedback.");

      const loggedOutput = capturedLogs.join(" ");
      assert.ok(!loggedOutput.includes(sentinelVal), "EMR entitlement lookup exception sentinel must not leak to logs");
    } finally {
      (doctorEntitlementRepo as any).resolveDoctorRepertoryEntitlement = originalResolve;
    }
  });

  // ─── 15. JUSTIFIED V2 BODY LIMITS (16 KB) TESTS ───────────────────────────
  await test("POST v2-compare and v2-live enforce 16 KB body limits", async () => {
    // 16 KB exact limit body
    const basePayload = {
      query: "burnout",
      filters: { category: "Psychology & Psychiatry" },
      selectedRubricIds: ["jeth_a_burnout"],
    };
    const exactBody = JSON.stringify(basePayload).padEnd(16 * 1024, " ");
    assert.strictEqual(Buffer.byteLength(exactBody, "utf8"), 16 * 1024);

    const reqCompareExact = mockRequest("http://localhost:3000/api/repertory/v2-compare", "POST", "https://homeo.healthcare", superAdminCookie, undefined, undefined, exactBody);
    const resCompareExact = await comparePOST(reqCompareExact);
    assert.notStrictEqual(resCompareExact.status, 413);

    const reqLiveExact = mockRequest("http://localhost:3000/api/repertory/v2-live", "POST", "https://homeo.healthcare", pilotDocCookie, undefined, undefined, exactBody);
    const resLiveExact = await livePOST(reqLiveExact);
    assert.notStrictEqual(resLiveExact.status, 413);

    // 16 KB + 1 overflow body
    const overflowBody = exactBody + " ";
    assert.strictEqual(Buffer.byteLength(overflowBody, "utf8"), 16 * 1024 + 1);

    const reqCompareOverflow = mockRequest("http://localhost:3000/api/repertory/v2-compare", "POST", "https://homeo.healthcare", superAdminCookie, undefined, undefined, overflowBody);
    const resCompareOverflow = await comparePOST(reqCompareOverflow);
    assert.strictEqual(resCompareOverflow.status, 413);

    const reqLiveOverflow = mockRequest("http://localhost:3000/api/repertory/v2-live", "POST", "https://homeo.healthcare", pilotDocCookie, undefined, undefined, overflowBody);
    const resLiveOverflow = await livePOST(reqLiveOverflow);
    assert.strictEqual(resLiveOverflow.status, 413);
  });

  // ─── 16. PER-ROUTE SENTINEL REDACTION AUDITS ─────────────────────────────
  await test("Per-route exceptions redact unique sensitive sentinels from response and console", async () => {
    const originalCollection = db.collection.bind(db);

    const routeConfigs = [
      {
        name: "save",
        sentinel: "CRASH_SENTINEL_SAVE_777",
        handler: savePOST,
        request: mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
          action: "save",
          rubricData: { name: "Custom" },
        }),
      },
      {
        name: "delete",
        sentinel: "CRASH_SENTINEL_DELETE_777",
        handler: deletePOST,
        request: mockRequest("http://localhost:3000/api/repertory/delete", "POST", "https://homeo.healthcare", editorCookie, {
          id: "some_id",
        }),
      },
      {
        name: "seed",
        sentinel: "CRASH_SENTINEL_SEED_777",
        handler: seedPOST,
        request: mockRequest("http://localhost:3000/api/repertory/seed", "POST", "https://homeo.healthcare", superAdminCookie, {
          action: "seed_default",
        }),
      },
      {
        name: "v2-compare",
        sentinel: "CRASH_SENTINEL_COMPARE_777",
        handler: comparePOST,
        request: mockRequest("http://localhost:3000/api/repertory/v2-compare", "POST", "https://homeo.healthcare", superAdminCookie, {
          query: "burnout",
        }),
      },
      {
        name: "v2-live",
        sentinel: "CRASH_SENTINEL_LIVE_777",
        handler: livePOST,
        request: mockRequest("http://localhost:3000/api/repertory/v2-live", "POST", "https://homeo.healthcare", pilotDocCookie, {
          query: "burnout",
        }),
      },
      {
        name: "v2-feedback",
        sentinel: "CRASH_SENTINEL_FEEDBACK_777",
        handler: feedbackPOST,
        request: mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
          mode: "v2-live",
          decision: "v2_better",
          query: "burnout",
        }),
      },
    ];

    for (const config of routeConfigs) {
      db.collection = () => {
        throw new Error(config.sentinel);
      };

      try {
        capturedLogs = [];
        const res = await config.handler(config.request);
        assert.strictEqual(res.status, 500, `Route ${config.name} must return status 500`);

        const bodyText = await res.text();
        assert.ok(!bodyText.includes(config.sentinel), `Route ${config.name} leaked sentinel in response body`);

        const loggedOutput = capturedLogs.join(" ");
        assert.ok(!loggedOutput.includes(config.sentinel), `Route ${config.name} leaked sentinel in console logs`);
        assert.ok(!loggedOutput.includes("Error:"), `Route ${config.name} leaked exception details in console logs`);
      } finally {
        db.collection = originalCollection;
      }
    }
  });

  // ─── 17. STRICT FAIL-CLOSED ADMIN AUTHORIZATION REGRESSION TEST ───────────
  await test("Practitioner profile status lookup failure fails closed with 500 and redacts sentinel", async () => {
    const sentinelVal = "CRASH_PRACTITIONER_DB_SENTINEL_555";
    const originalGetPractitioner = practitionerRepo.getPractitionerByUid;
    (practitionerRepo as any).getPractitionerByUid = async () => {
      throw new Error(sentinelVal);
    };

    try {
      resetDbStats();
      const req = mockRequest("http://localhost:3000/api/repertory/save", "POST", "https://homeo.healthcare", editorCookie, {
        action: "save",
        rubricData: { name: "Safe Name" },
      });

      const res = await savePOST(req);
      assert.strictEqual(res.status, 500);

      const bodyText = await res.text();
      assert.ok(!bodyText.includes(sentinelVal), "Sentinel must not leak in response body");

      const loggedOutput = capturedLogs.join(" ");
      assert.ok(!loggedOutput.includes(sentinelVal), "Sentinel must not leak in console logs");
      assert.ok(!loggedOutput.includes("Error:"), "Database exception stack/details must not be printed");

      // Verify zero writes to the rubrics collection
      assert.strictEqual(mockWrites, 0, "Zero writes must be executed on authorization failure");
    } finally {
      (practitionerRepo as any).getPractitionerByUid = originalGetPractitioner;
    }
  });

  // ─── 18. CUSTOM RUBRIC PHI SAFETY REGRESSION TEST ───────────
  await test("POST feedback rejects existing custom patient-derived rubric ID", async () => {
    const customRubricId = "custom_patient-alice_burnout";
    await db.collection("rubrics").doc(customRubricId).set({
      id: customRubricId,
      name: "Burnout - Custom",
      status: "custom",
    });

    const req = mockRequest("http://localhost:3000/api/repertory/v2-feedback", "POST", "https://homeo.healthcare", pilotDocCookie, {
      mode: "v2-live",
      decision: "v2_better",
      query: "patient has burnout",
      v1TopRubricIds: [customRubricId],
    });

    const res = await feedbackPOST(req);
    assert.strictEqual(res.status, 400);

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, "Invalid rubric identifier.");
  });

  console.log("\n==============================================");
  console.log(`Repertory Route Security Tests run: ${passedCount + failedCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
