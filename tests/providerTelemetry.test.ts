import "./setupEnv";
import assert from "assert";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { providerTelemetryService, TelemetryFailureCategory } from "@/features/ai/services/providerTelemetry";
import { GET, POST } from "@/app/api/admin/observability/provider-metrics/route";
import { createAdminSessionCookie } from "@/lib/adminSession";
import { ProviderPolicy } from "@/features/ai-security/provider-policy/providerPolicy";
import * as auditLoggerModule from "@/lib/security/auditLogger";
import { createConsultAIHandler } from "@/features/ai-security/access/consultAIHandler";
import { aiRouterService } from "@/lib/aiRouter";

// Ensure session secret matches
process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";

async function runTests() {
  console.log("🚀 Starting Provider Telemetry & Observability Test Suite...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  // Helper to create test request
  async function createTestRequest(options: {
    method?: string;
    role?: "super-admin" | "operations" | "analytics-viewer" | "read-only-admin";
    origin?: string;
    host?: string;
    contentType?: string;
    body?: string;
  }): Promise<NextRequest> {
    const headers = new Headers();
    if (options.role) {
      const cookie = await createAdminSessionCookie({
        uid: "test-user-id",
        email: "test@homeo.healthcare",
        role: options.role,
        name: "Test User",
        exp: Math.floor(Date.now() / 1000) + 3600
      });
      headers.set("cookie", `hh_admin_session_v3=${cookie}`);
    }
    if (options.origin) headers.set("origin", options.origin);
    if (options.host) headers.set("host", options.host);
    if (options.contentType) headers.set("content-type", options.contentType);

    const init: any = {
      method: options.method || "GET",
      headers
    };
    if (options.body !== undefined) {
      init.body = options.body;
    }

    return new NextRequest("http://localhost:3000/api/admin/observability/provider-metrics", init);
  }

  // 1. GET Authorization Checks
  await test("GET Read Auth - succeeds with OBSERVABILITY_VIEW permission", async () => {
    const request = await createTestRequest({
      method: "GET",
      role: "analytics-viewer", // has OBSERVABILITY_VIEW permission
      origin: "http://localhost:3000"
    });
    const res = await GET(request);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.schemaVersion, "1.0.0");
    assert.strictEqual(body.scope, "instance-local");
  });

  await test("GET Read Auth - fails with unauthenticated request", async () => {
    const request = await createTestRequest({
      method: "GET",
      origin: "http://localhost:3000"
    });
    const res = await GET(request);
    assert.strictEqual(res.status, 401);
  });

  // 2. GET Write Block
  await test("GET Write Block - POST fails with OBSERVABILITY_VIEW only", async () => {
    const request = await createTestRequest({
      method: "POST",
      role: "analytics-viewer",
      origin: "http://localhost:3000",
      host: "localhost:3000",
      contentType: "application/json",
      body: JSON.stringify({ action: "reset" })
    });
    const res = await POST(request);
    assert.strictEqual(res.status, 403);
  });

  // 3. POST Reset Authorization Checks
  await test("POST Reset Auth - succeeds with RAG_INDEX_MANAGE permission", async () => {
    providerTelemetryService.recordCacheOutcome("hit");
    const request = await createTestRequest({
      method: "POST",
      role: "operations", // has RAG_INDEX_MANAGE permission
      origin: "http://localhost:3000",
      host: "localhost:3000",
      contentType: "application/json",
      body: JSON.stringify({ action: "reset" })
    });
    const res = await POST(request);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    // Verify reset actually cleared the telemetry state
    const dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.cache.hits, 0);
  });

  // 4. CORS validation checks
  await test("CORS Origin Check - rejects disallowed origin early", async () => {
    const request = await createTestRequest({
      method: "GET",
      role: "analytics-viewer",
      origin: "http://disallowed-malicious-domain.com"
    });
    const res = await GET(request);
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.headers.get("Access-Control-Allow-Origin"), null);
    assert.strictEqual(res.headers.get("Vary"), "Origin");
  });

  // 5. CSRF checks
  await test("CSRF Validation - rejects POST reset when origin and host mismatch", async () => {
    const request = await createTestRequest({
      method: "POST",
      role: "operations",
      origin: "http://localhost:3000",
      host: "attacker-domain.com",
      contentType: "application/json",
      body: JSON.stringify({ action: "reset" })
    });
    const res = await POST(request);
    assert.strictEqual(res.status, 403);
  });

  // 6. JSON Schema stream and validation boundaries
  await test("Body Size Limit - rejects POST reset > 100 bytes early", async () => {
    const extraPadding = "a".repeat(150);
    const request = await createTestRequest({
      method: "POST",
      role: "operations",
      origin: "http://localhost:3000",
      host: "localhost:3000",
      contentType: "application/json",
      body: JSON.stringify({ action: "reset", padding: extraPadding })
    });
    const res = await POST(request);
    assert.strictEqual(res.status, 413);
  });

  await test("Body Schema Strictness - rejects POST reset with extra body fields", async () => {
    const request = await createTestRequest({
      method: "POST",
      role: "operations",
      origin: "http://localhost:3000",
      host: "localhost:3000",
      contentType: "application/json",
      body: JSON.stringify({ action: "reset", extra: "illegal-field" })
    });
    const res = await POST(request);
    assert.strictEqual(res.status, 400);
  });

  await test("Content Type Check - rejects unsupported Content-Type", async () => {
    const request = await createTestRequest({
      method: "POST",
      role: "operations",
      origin: "http://localhost:3000",
      host: "localhost:3000",
      contentType: "text/plain",
      body: "action=reset"
    });
    const res = await POST(request);
    assert.strictEqual(res.status, 415);
  });

  await test("Malformed JSON - rejects invalid JSON body syntax", async () => {
    const request = await createTestRequest({
      method: "POST",
      role: "operations",
      origin: "http://localhost:3000",
      host: "localhost:3000",
      contentType: "application/json",
      body: "{ action: 'reset'" // malformed
    });
    const res = await POST(request);
    assert.strictEqual(res.status, 400);
  });

  // 7. GET Statically Bounded (No network fetch)
  await test("No-Network GET - ensures GET reads perform no network operations", async () => {
    const originalFetch = global.fetch;
    let fetchCalled = false;
    global.fetch = async () => {
      fetchCalled = true;
      return new Response();
    };

    try {
      const request = await createTestRequest({
        method: "GET",
        role: "analytics-viewer",
        origin: "http://localhost:3000"
      });
      const res = await GET(request);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(fetchCalled, false, "GET read made an outgoing network call!");
    } finally {
      global.fetch = originalFetch;
    }
  });

  // 8. No-Throw Guarantee
  await test("No-Throw Telemetry - verify service failures never crash the AI routing pipeline", () => {
    const originalSaturate = (providerTelemetryService as any).saturateIncrement;
    (providerTelemetryService as any).saturateIncrement = () => {
      throw new Error("Telemetry database exception mock");
    };

    try {
      let threw = false;
      try {
        providerTelemetryService.recordCacheOutcome("hit");
      } catch {
        threw = true;
      }
      assert.strictEqual(threw, false, "Telemetry recordCacheOutcome threw an unhandled exception!");
    } finally {
      (providerTelemetryService as any).saturateIncrement = originalSaturate;
    }
  });

  // 9. Latency Bucketing
  await test("Latency Bucket Validation - buckets positive finite numbers, ignores negative or NaN", () => {
    providerTelemetryService.reset();

    // Valid positive latencies
    providerTelemetryService.recordProviderAttempt("success", 500); // under 1s
    providerTelemetryService.recordProviderAttempt("success", 2500); // 1-3s
    providerTelemetryService.recordProviderAttempt("success", 4000); // 3-5s
    providerTelemetryService.recordProviderAttempt("success", 8000); // 5-10s
    providerTelemetryService.recordProviderAttempt("success", 12000); // over 10s

    // Invalid latencies (ignored)
    providerTelemetryService.recordProviderAttempt("success", -500);
    providerTelemetryService.recordProviderAttempt("success", NaN);
    providerTelemetryService.recordProviderAttempt("success", Infinity);

    const dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.latencyBuckets.under_1s, 1);
    assert.strictEqual(dto.latencyBuckets["1_to_3s"], 1);
    assert.strictEqual(dto.latencyBuckets["3_to_5s"], 1);
    assert.strictEqual(dto.latencyBuckets["5_to_10s"], 1);
    assert.strictEqual(dto.latencyBuckets.over_10s, 1);
    assert.strictEqual(dto.providerAttempts.total, 8); // total attempts still logged
  });

  // 10. Cache semantics misses/PHI (Integration via consultAIHandler)
  await test("Cache Semantics - non-PHI null cache counts miss; PHI bypass and cache exceptions count zero", async () => {
    providerTelemetryService.reset();

    const mockTelemetryDeps: any = {
      aiRouterService: {
        consultAI: async () => ({
          success: true,
          response: "Mocked AI Response",
          providerUsed: "Gemini",
          modelUsed: "gemini-2.0-flash",
          latencyMs: 10
        })
      },
      cacheService: {
        get: async () => null,
        set: async () => {}
      },
      consentAdapter: {
        verifyAiProcessingConsent: async () => ({ allowed: true })
      },
      contextAuthorization: {
        authorizeDoctorContext: async () => ({ authorized: true })
      },
      clinicalContextProjection: {
        project: async () => ({
          clinicalText: "Mocked clinical history",
          checksum: "mock-checksum-123"
        })
      },
      auditLogger: {
        logEvent: async () => {}
      },
      ipLimiter: {
        isRateLimited: () => ({ limited: false })
      },
      clock: {
        now: () => new Date()
      },
      uuidGenerator: {
        generate: () => "mock-uuid-123"
      },
      clientIpResolver: () => "127.0.0.1",
      redisClientProvider: async () => null
    };

    const handler = createConsultAIHandler(mockTelemetryDeps);
    const adminCookie = await createAdminSessionCookie({
      uid: "doc-1",
      email: "doctor@homeo.healthcare",
      role: "doctor",
      name: "Dr. Test",
      exp: Math.floor(Date.now() / 1000) + 3600
    });

    // 10.1 Genuine non-PHI null cache lookup counts 1 miss
    const reqNonPHI = new NextRequest("http://localhost/api/consult-ai", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: "what is homeopathy?", // non-PHI query in public mode
        mode: "public"
      })
    });

    await handler(reqNonPHI);
    let dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.cache.hits, 0);
    assert.strictEqual(dto.cache.misses, 1);

    // 10.2 PHI query bypasses cache and counts 0 misses
    const reqPHI = new NextRequest("http://localhost/api/consult-ai", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: "John Doe has psoriasis", // contains PHI
        mode: "public"
      })
    });

    await handler(reqPHI);
    dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.cache.hits, 0);
    assert.strictEqual(dto.cache.misses, 1); // remains 1

    // 10.3 Cache error propagates and does not increment cache misses
    mockTelemetryDeps.cacheService.get = async () => {
      throw new Error("Cache backend down");
    };

    const reqError = new NextRequest("http://localhost/api/consult-ai", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: "what is homeopathy?",
        mode: "public"
      })
    });

    const resError = await handler(reqError);
    // Verify control flow: error propagated and failed the request
    assert.strictEqual(resError.status, 500, "Cache error must propagate to the handler boundary and fail request");
    dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.cache.misses, 1); // remains 1
  });

  // 10.4 Attempts outcome summation test (Integration via runWithStaggeredFallback)
  await test("Attempts outcome summation - two failed attempts followed by one success produces exactly total=3, failed=2, success=1", async () => {
    providerTelemetryService.reset();

    const tasks: any[] = [
      {
        provider: "Ollama",
        model: "ollama-local",
        run: async () => {
          throw new Error("Timeout");
        }
      },
      {
        provider: "Gemini",
        model: "gemini-2.0-flash",
        run: async () => {
          throw new Error("Service Unavailable");
        }
      },
      {
        provider: "Gemini",
        model: "gemini-1.5-pro",
        run: async () => ({ response: "Fallback Success Response" })
      }
    ];

    const result = await (aiRouterService as any).runWithStaggeredFallback(tasks, 100, "non-phi");
    assert.strictEqual(result.response, "Fallback Success Response");

    const dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.providerAttempts.total, 3);
    assert.strictEqual(dto.providerAttempts.failed, 2);
    assert.strictEqual(dto.providerAttempts.success, 1);
    assert.strictEqual(dto.failuresByCategory.provider_timeout, 1);
    assert.strictEqual(dto.failuresByCategory.provider_unavailable, 1);
  });

  // 10.5 Provider policy fallback abort test (Integration via runWithStaggeredFallback)
  await test("Provider-policy refusal - safety/policy refusal aborts further fallback", async () => {
    providerTelemetryService.reset();

    const tasks: any[] = [
      {
        provider: "Ollama",
        model: "ollama-local",
        run: async () => {
          throw new Error("Safety Refusal: Request violates safety policy guidelines.");
        }
      },
      {
        provider: "Gemini",
        model: "gemini-2.0-flash",
        run: async () => ({ response: "Should never run" })
      }
    ];

    let threw = false;
    try {
      await (aiRouterService as any).runWithStaggeredFallback(tasks, 100, "non-phi");
    } catch (err: any) {
      threw = true;
      assert.ok(err.message.includes("Safety Refusal"));
    }

    assert.strictEqual(threw, true, "Safety policy refusal must throw and abort fallback execution");

    const dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.providerAttempts.total, 1); // second task never executed
    assert.strictEqual(dto.providerAttempts.failed, 1);
    assert.strictEqual(dto.providerAttempts.success, 0);
    assert.strictEqual(dto.failuresByCategory.provider_policy, 1);
  });

  // 10.6 Aborted query path integration test
  await test("Aborted query path - logs a timeout/aborted attempt and exits sequential fallback immediately", async () => {
    providerTelemetryService.reset();

    const controller = new AbortController();
    const tasks: any[] = [
      {
        provider: "Ollama",
        model: "ollama-local",
        run: async (taskSignal: AbortSignal) => {
          controller.abort();
          throw new Error("Request aborted");
        }
      },
      {
        provider: "Gemini",
        model: "gemini-2.0-flash",
        run: async () => ({ response: "Should never run" })
      }
    ];

    let threw = false;
    try {
      await (aiRouterService as any).runWithStaggeredFallback(tasks, 100, "non-phi", controller.signal);
    } catch (err: any) {
      threw = true;
      assert.ok(err.message.includes("Request aborted"));
    }

    assert.strictEqual(threw, true, "Aborted query must throw request aborted");

    const dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.providerAttempts.total, 1); // second task never executed
    assert.strictEqual(dto.providerAttempts.failed, 1);
    assert.strictEqual(dto.providerAttempts.success, 0);
    assert.strictEqual(dto.failuresByCategory.provider_timeout, 1);
  });

  // 10.7 Audit reset payload and audit failure masking test
  await test("Audit Reset Payload - verifies exact audit log properties and masks audit-write failure", async () => {
    providerTelemetryService.reset();
    providerTelemetryService.recordCacheOutcome("hit");

    const originalLogSecurityEvent = auditLoggerModule.logSecurityEvent;

    let lastLoggedEvent: any = null;
    let callCount = 0;
    (auditLoggerModule as any).logSecurityEvent = async (event: any) => {
      lastLoggedEvent = event;
      callCount++;
      return true;
    };

    try {
      // 10.7.1 Verify audit event payload
      const request = await createTestRequest({
        method: "POST",
        role: "operations",
        origin: "http://localhost:3000",
        host: "localhost:3000",
        contentType: "application/json",
        body: JSON.stringify({ action: "reset" })
      });

      const res = await POST(request);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(callCount, 1);
      assert.ok(lastLoggedEvent, "Audit log event must be recorded");
      assert.strictEqual(lastLoggedEvent.action, "provider_metrics_reset");
      assert.strictEqual(lastLoggedEvent.resource, "/api/admin/observability/provider-metrics");
      assert.strictEqual(lastLoggedEvent.status, "success");
      assert.strictEqual(lastLoggedEvent.userRole, "operations"); // exact actor properties
      assert.strictEqual(lastLoggedEvent.userId, "test-user-id");
      assert.strictEqual(lastLoggedEvent.userEmail, "test@homeo.healthcare");
      assert.deepStrictEqual(lastLoggedEvent.details, {});

      // 10.7.2 Verify audit logger failure masking
      (auditLoggerModule as any).logSecurityEvent = async () => {
        throw new Error("Database network failure");
      };

      providerTelemetryService.recordCacheOutcome("hit");
      const request2 = await createTestRequest({
        method: "POST",
        role: "operations",
        origin: "http://localhost:3000",
        host: "localhost:3000",
        contentType: "application/json",
        body: JSON.stringify({ action: "reset" })
      });

      const res2 = await POST(request2);
      // Verify that audit log failure does NOT prevent telemetry reset from completing
      assert.strictEqual(res2.status, 200, "Audit write failure must be masked and return 200");
      const dto = providerTelemetryService.getMetricsDTO();
      assert.strictEqual(dto.cache.hits, 0, "Telemetry reset must still succeed when audit write fails");
    } finally {
      (auditLoggerModule as any).logSecurityEvent = originalLogSecurityEvent;
    }
  });

  // 11. Saturating Counter Safety
  await test("Saturating Counter Safety - counters saturate at MAX_SAFE_INTEGER and never overflow", () => {
    providerTelemetryService.reset();

    (providerTelemetryService as any).cacheHits = Number.MAX_SAFE_INTEGER;
    providerTelemetryService.recordCacheOutcome("hit");

    const dto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(dto.cache.hits, Number.MAX_SAFE_INTEGER);
  });

  // 12. Returned Snapshot Immutability
  await test("Returned Copy Immutability - DTO modifications cannot affect internal state", () => {
    providerTelemetryService.reset();
    providerTelemetryService.recordCacheOutcome("hit");

    const dto = providerTelemetryService.getMetricsDTO();
    dto.cache.hits = 9999; // mutate returned snapshot

    const freshDto = providerTelemetryService.getMetricsDTO();
    assert.strictEqual(freshDto.cache.hits, 1); // original state unchanged
  });

  // 13. Production reset hooks check
  await test("Production Build Checks - no test bypass or backdoor reset override is present", () => {
    const keys = Object.keys(providerTelemetryService);
    const hasBackdoors = keys.some(k => k.toLowerCase().includes("bypass") || k.toLowerCase().includes("test"));
    assert.strictEqual(hasBackdoors, false);
  });

  // 14. Frozen-domain isolation
  await test("Frozen Domain Isolation - telemetry code must not import frozen patient/clinical domain spaces", () => {
    const filePath = path.join(__dirname, "../src/features/ai/services/providerTelemetry.ts");
    const content = fs.readFileSync(filePath, "utf8");
    const forbiddenImports = [
      "patient", "consultation", "encounter", "allergy", "consent", "treatmentEpisode", "homeopathy"
    ];
    forbiddenImports.forEach(domain => {
      assert.strictEqual(
        content.includes(`/${domain}/`) || content.includes(`@/features/${domain}`),
        false,
        `Telemetry service depends on frozen domain: ${domain}`
      );
    });
  });

  setTimeout(() => {
    console.log(`\n🎉 Provider Telemetry Tests Completed. Passed: ${passedCount}, Failed: ${failedCount}`);
    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }, 100);
}

runTests();
