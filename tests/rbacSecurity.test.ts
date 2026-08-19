import "./setupEnv";
import assert from "assert";
import { normalizeRole, hasPermission, AdminRole, Permission } from "../src/lib/security/rbac";
import { createAdminSessionCookie, verifyAdminSessionCookie } from "../src/lib/adminSession";
import { authorizeRequest } from "../src/lib/security/apiAuth";
import { sanitizeAuditPayload, sanitizeAuditMetadata, memorySecurityAuditLogs, logSecurityEvent } from "../src/lib/security/auditLogger";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Mock NextRequest to avoid real network/HTTP dependencies
function mockRequest(cookieValue?: string): NextRequest {
  const headers = new Headers();
  if (cookieValue) {
    headers.set("cookie", `hh_admin_session_v3=${cookieValue}`);
  }
  return new NextRequest("http://localhost:3000/api/admin/cms", {
    headers,
    method: "POST",
  });
}

async function runTests() {
  console.log("🚀 Starting V2.9.1 Expanded Security & RBAC Test Suite...");
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

  // 1. Role Normalization Tests
  await test("should properly normalize legacy and modern roles", () => {
    assert.strictEqual(normalizeRole("admin"), "super-admin");
    assert.strictEqual(normalizeRole("super-admin"), "super-admin");
    assert.strictEqual(normalizeRole("ADMIN"), "super-admin");
    
    assert.strictEqual(normalizeRole("clinical-reviewer"), "clinical-reviewer");
    assert.strictEqual(normalizeRole("editor"), "editor");
    assert.strictEqual(normalizeRole("operations"), "operations");
    assert.strictEqual(normalizeRole("analytics-viewer"), "analytics-viewer");
    
    assert.strictEqual(normalizeRole("doctor"), "read-only-admin");
    assert.strictEqual(normalizeRole("read-only-admin"), "read-only-admin");
    assert.strictEqual(normalizeRole("invalid-role"), "read-only-admin");
  });

  // 2. Permission Resolution Tests
  await test("should resolve permissions correctly by role", () => {
    const allPermissions: Permission[] = [
      "CMS_DRAFT_EDIT",
      "CMS_CLINICAL_APPROVE",
      "CMS_PUBLISH",
      "CMS_ROLLBACK",
      "WORKFLOW_ASSIGN",
      "RAG_INDEX_MANAGE",
      "OBSERVABILITY_VIEW",
      "USER_MANAGE"
    ];
    allPermissions.forEach(perm => {
      assert.ok(hasPermission("super-admin", perm), `super-admin lacks: ${perm}`);
      assert.ok(hasPermission("admin", perm), `admin legacy lacks: ${perm}`);
    });

    assert.ok(hasPermission("clinical-reviewer", "CMS_CLINICAL_APPROVE"));
    assert.ok(hasPermission("clinical-reviewer", "WORKFLOW_ASSIGN"));
    assert.ok(!hasPermission("clinical-reviewer", "CMS_PUBLISH"));

    assert.ok(hasPermission("editor", "CMS_DRAFT_EDIT"));
    assert.ok(hasPermission("editor", "WORKFLOW_ASSIGN"));
    assert.ok(!hasPermission("editor", "CMS_PUBLISH"));

    assert.ok(hasPermission("operations", "CMS_DRAFT_EDIT"));
    assert.ok(hasPermission("operations", "RAG_INDEX_MANAGE"));
    assert.ok(hasPermission("operations", "OBSERVABILITY_VIEW"));

    assert.ok(hasPermission("analytics-viewer", "OBSERVABILITY_VIEW"));
    assert.ok(!hasPermission("analytics-viewer", "CMS_DRAFT_EDIT"));
  });

  // Set up local environment secret for session signing
  process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";

  // 3. Signed Cookie Session Tests
  await test("should create and verify signed session cookies", async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = {
      uid: "test-user-123",
      email: "test@homeo.healthcare",
      role: "editor" as const,
      name: "Test Editor",
      exp
    };

    const cookie = await createAdminSessionCookie(payload);
    assert.ok(cookie);
    const verified = await verifyAdminSessionCookie(cookie);
    assert.ok(verified);
    assert.strictEqual(verified.uid, "test-user-123");
  });

  // 4. Session Expiry Tests
  await test("should reject expired session cookies", async () => {
    const expiredExp = Math.floor(Date.now() / 1000) - 10;
    const payload = {
      uid: "test-expired-user",
      email: "expired@homeo.healthcare",
      role: "super-admin" as const,
      name: "Expired Admin",
      exp: expiredExp
    };

    const cookie = await createAdminSessionCookie(payload);
    const verified = await verifyAdminSessionCookie(cookie);
    assert.strictEqual(verified, null);
  });

  // 5. Audit Sanitizer Test 1: Redacts nested token values
  await test("audit sanitizer redacts nested token values", () => {
    const payload = { details: { oauth: { accessToken: "secret123", refreshToken: "refresh456" } } };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.strictEqual(sanitized.details.oauth.accessToken, "[REDACTED]");
    assert.strictEqual(sanitized.details.oauth.refreshToken, "[REDACTED]");
  });

  // 6. Audit Sanitizer Test 2: Redacts nested cookie values
  await test("audit sanitizer redacts nested cookie values", () => {
    const payload = { headers: { cookie: "session_id=abc123xyz" } };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.strictEqual(sanitized.headers.cookie, "[REDACTED]");
  });

  // 7. Audit Sanitizer Test 3: Redacts nested API keys/secrets
  await test("audit sanitizer redacts nested API keys/secrets", () => {
    const payload = { config: { apikey: "AIzaSyD-123", privateKey: "---BEGIN PRIVATE KEY---" } };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.strictEqual(sanitized.config.apikey, "[REDACTED]");
    assert.strictEqual(sanitized.config.privateKey, "[REDACTED]");
  });

  // 8. Audit Sanitizer Test 4: Redacts patient names
  await test("audit sanitizer redacts patient names", () => {
    const payload = { patientName: "Narayan Jethwani", patient: { name: "Narayan" } };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.strictEqual(sanitized.patientName, "[REDACTED]");
    assert.strictEqual(sanitized.patient, "[REDACTED]");
  });

  // 9. Audit Sanitizer Test 5: Redacts emails
  await test("audit sanitizer redacts emails", () => {
    const payload = { details: "Contact email is dr.narayan@homeo.healthcare for patient updates." };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.strictEqual(sanitized.details, "Contact email is [REDACTED] for patient updates.");
  });

  // 10. Audit Sanitizer Test 6: Redacts phone numbers
  await test("audit sanitizer redacts phone numbers", () => {
    const payload = { text: "Reach us at +1-123-456-7890 or 123 456 7890." };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.ok(sanitized.text.includes("[REDACTED]"));
  });

  // 11. Audit Sanitizer Test 7: Redacts DOB/case IDs
  await test("audit sanitizer redacts DOB/case IDs", () => {
    const payload = { birthDate: "1990-05-15", caseId: "HH-55243" };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.strictEqual(sanitized.birthDate, "[REDACTED]");
    assert.strictEqual(sanitized.caseId, "[REDACTED]");
  });

  // 12. Audit Sanitizer Test 8: Redacts diagnosis/complaint/symptom fields
  await test("audit sanitizer redacts diagnosis/complaint/symptom fields", () => {
    const payload = { diagnosis: "Chronic Gastritis", complaint: "Burning sensation in stomach", symptoms: ["nausea", "acidity"] };
    const sanitized: any = sanitizeAuditPayload(payload);
    assert.strictEqual(sanitized.diagnosis, "[REDACTED]");
    assert.strictEqual(sanitized.complaint, "[REDACTED]");
    assert.strictEqual(sanitized.symptoms, "[REDACTED]");
  });

  // 13. Audit Sanitizer Test 9: Sanitizer truncates long strings
  await test("audit sanitizer truncates long strings", () => {
    const longStr = "A".repeat(300);
    const sanitized: any = sanitizeAuditPayload(longStr);
    assert.ok(sanitized.length <= 120);
    assert.ok(sanitized.includes("[TRUNCATED]"));
  });

  // 14. Audit Sanitizer Test 10: Sanitizer handles arrays safely
  await test("audit sanitizer handles arrays safely", () => {
    const arr = ["ordinary text", "test@homeo.healthcare", { patientName: "Bob" }];
    const sanitized: any = sanitizeAuditPayload(arr);
    assert.strictEqual(sanitized[0], "ordinary text");
    assert.strictEqual(sanitized[1], "[REDACTED]");
    assert.strictEqual(sanitized[2].patientName, "[REDACTED]");
  });

  // 15. Audit Sanitizer Test 11: Sanitizer handles malformed input safely
  await test("audit sanitizer handles malformed input safely", () => {
    const circularObj: any = {};
    circularObj.self = circularObj;
    const sanitized = sanitizeAuditPayload(circularObj);
    assert.ok(sanitized === "[MALFORMED_PAYLOAD]" || typeof sanitized === "object");
  });

  // 16. Standardized 401 response JSON shape
  await test("unauthenticated protected API returns standardized 401 JSON", async () => {
    const req = mockRequest();
    const auth = await authorizeRequest(req, "CMS_DRAFT_EDIT", "TEST");
    assert.strictEqual(auth.authorized, false);
    if (!auth.authorized) {
      assert.strictEqual(auth.response.status, 401);
      const data = await auth.response.json();
      assert.strictEqual(data.ok, false);
      assert.strictEqual(data.error.code, "UNAUTHORIZED");
      assert.strictEqual(data.error.message, "Authentication required.");
    }
  });

  // 17. Standardized 403 response JSON shape
  await test("authenticated unauthorized request returns standardized 403 JSON", async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const editorCookie = await createAdminSessionCookie({
      uid: "editor-user",
      email: "editor@homeo.healthcare",
      role: "editor",
      name: "Editor",
      exp
    });
    const req = mockRequest(editorCookie);
    const auth = await authorizeRequest(req, "CMS_PUBLISH", "TEST");
    assert.strictEqual(auth.authorized, false);
    if (!auth.authorized) {
      assert.strictEqual(auth.response.status, 403);
      const data = await auth.response.json();
      assert.strictEqual(data.ok, false);
      assert.strictEqual(data.error.code, "FORBIDDEN");
      assert.strictEqual(data.error.message, "Insufficient permissions.");
    }
  });

  // 18. Unknown role / permission rejected
  await test("unknown role has no permissions & unknown permission is rejected", () => {
    assert.strictEqual(hasPermission("guest", "CMS_DRAFT_EDIT"), false);
    assert.strictEqual(hasPermission("super-admin", "UNKNOWN_PERM" as any), false);
  });

  // 19. Dev bypass production safety
  await test("dev bypass cannot activate in production", async () => {
    // Save original env values
    const origEnv = process.env.NODE_ENV;
    const origBypass = process.env.ALLOW_DEV_ADMIN_BYPASS;

    try {
      process.env.NODE_ENV = "production";
      process.env.ALLOW_DEV_ADMIN_BYPASS = "true";

      const req = mockRequest();
      const auth = await authorizeRequest(req, "CMS_DRAFT_EDIT", "TEST");
      assert.strictEqual(auth.authorized, false, "Dev bypass must be denied in production");
      if (!auth.authorized) {
        assert.strictEqual(auth.response.status, 401);
      }
    } finally {
      // Restore
      process.env.NODE_ENV = origEnv;
      process.env.ALLOW_DEV_ADMIN_BYPASS = origBypass;
    }
  });

  // 20. Route coverage checker flags unprotected admin route fixtures or validates actual routes
  await test("route coverage checker validates all admin API routes", () => {
    const adminApiDir = path.join(process.cwd(), "src/app/api/admin");
    assert.ok(fs.existsSync(adminApiDir));

    function getFilesRecursive(dir: string): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(getFilesRecursive(fullPath));
        } else {
          results.push(fullPath);
        }
      });
      return results;
    }

    const routeFiles = getFilesRecursive(adminApiDir).filter(f => f.endsWith("route.ts"));
    routeFiles.forEach(file => {
      const content = fs.readFileSync(file, "utf8");
      if (
        file.includes("api/admin/session/route.ts") ||
        file.includes("api/admin/invitations/accept/route.ts") ||
        file.includes("api/admin/dev-login/route.ts") ||
        file.includes("api/admin/medical-academy/literature/route.ts")
      ) {
        return;
      }
      const hasGuard = content.includes("authorizeRequest") || content.includes("requireAdminApiSession");
      assert.ok(hasGuard, `Unprotected route: ${file}`);
    });
  });

  // 21. Audit logger memory fallback works
  await test("audit logger falling back to memory repository", () => {
    const initialLogsCount = memorySecurityAuditLogs.length;
    
    // We expect logSecurityEvent to run successfully
    // (even if Firestore is offline, it falls back to memory and prints log)
    logSecurityEvent({
      userId: "test-user-sanitized",
      userEmail: "sanitized@homeo.healthcare",
      userRole: "editor",
      action: "test_sanitization",
      resource: "test_res",
      status: "success",
      timestamp: new Date().toISOString(),
      details: { patientName: "Alice PII", password: "unsafePassword123" }
    });

    assert.strictEqual(memorySecurityAuditLogs.length, initialLogsCount + 1);
    const lastLog = memorySecurityAuditLogs[memorySecurityAuditLogs.length - 1];
    assert.strictEqual(lastLog.details.patientName, "[REDACTED]");
    assert.strictEqual(lastLog.details.password, "[REDACTED]");
  });

  console.log("\n==============================================");
  console.log(`Security/RBAC Expanded Tests run: ${passedCount + failedCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
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
