import "./setupEnv";
import assert from "assert";
import { NextRequest } from "next/server";
import { POST as parseIntakePOST } from "../src/app/api/repertory/parse-intake/route";
import { createAdminSessionCookie } from "../src/lib/adminSession";
import { resetRepertoryRateLimitsForTests } from "../src/features/repertory/security/RepertoryApiSecurity";

process.env.NODE_ENV = "test";
process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";

async function runTests() {
  console.log("=== Running Repertory Parse Intake Route Unit Tests ===");
  resetRepertoryRateLimitsForTests();

  const validCookie = await createAdminSessionCookie({
    uid: "test-admin-123",
    email: "admin@example.com",
    role: "super-admin",
    exp: Math.floor(Date.now() / 1000) + 86400,
  });

  // Test 1: Reject empty input text
  {
    const req = new NextRequest("http://localhost:3000/api/repertory/parse-intake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `hh_admin_session_v3=${validCookie}`,
      },
      body: JSON.stringify({ text: "" }),
    });

    const res = await parseIntakePOST(req);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, "Intake text cannot be empty.");
    console.log("✔ Test 1 Passed: Empty intake text rejected with HTTP 400");
  }

  // Test 2: Successfully parse clinical intake text into rubrics
  {
    const req = new NextRequest("http://localhost:3000/api/repertory/parse-intake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `hh_admin_session_v3=${validCookie}`,
      },
      body: JSON.stringify({
        text: "emotional, crying for missed things in life, consolation relives, changeable mood, always complaining about others",
      }),
    });

    const res = await parseIntakePOST(req);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.matchedRubrics), "matchedRubrics should be an array");
    assert.ok(Array.isArray(body.suggestedRemedies), "suggestedRemedies should be an array");
    assert.ok(typeof body.repertoryScore === "number", "repertoryScore should be a number");
    console.log(`✔ Test 2 Passed: Parsed intake text successfully. Matched ${body.matchedRubrics.length} rubrics and ${body.suggestedRemedies.length} remedies.`);
  }

  console.log("=== All Repertory Parse Intake Route Unit Tests Passed! ===");
}

runTests().catch((err) => {
  console.error("Repertory Parse Intake Route Test Failed:", err);
  process.exit(1);
});
