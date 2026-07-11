import assert from "assert";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/admin/cms/route";

async function runEvidenceApiSecurityTests() {
  console.log("🚀 Running Evidence API Security tests...");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (e: any) {
      console.error(`❌ ${name}`);
      console.error(e.stack || e);
      failed++;
    }
  }

  test("API Route rejects client-supplied read-only fields (assessedBy)", async () => {
    const url = "http://localhost:3000/api/admin/cms";
    const body = {
      action: "saveDraft",
      draftData: {
        articleId: "art-api-sec-1",
        title: "API Security Test",
        evidenceProfile: {
          evidenceStrength: "high",
          sourceQuality: "primary",
          clinicalConfidence: 80,
          editorialConfidence: 80,
          reviewIntervalDays: 365,
          reviewGracePeriodDays: 90,
          reviewExpiryPolicy: "ranking-penalty",
          rationale: "Reasoning",
          classicalSource: true,
          modernSource: true,
          assessedBy: "Hacker"
        }
      }
    };

    process.env.ALLOW_DEV_ADMIN_BYPASS = "true";
    const oldNodeEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = "development";

    const req = new NextRequest(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const res = await POST(req);
    (process.env as any).NODE_ENV = oldNodeEnv;

    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.ok(json.error.includes("Cannot modify read-only server-owned evidence field"), `Got unexpected error: ${json.error}`);
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceApiSecurityTests().catch(e => {
  console.error(e);
  process.exit(1);
});
