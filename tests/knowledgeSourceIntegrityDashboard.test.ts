import "./setupEnv";
import assert from "assert";
import { NextRequest } from "next/server";
import { GET } from "../src/app/api/admin/knowledge/source-integrity/route";

export async function runKnowledgeSourceIntegrityDashboardTests(): Promise<void> {
  process.env.NODE_ENV = "test";
  process.env.ALLOW_DEV_ADMIN_BYPASS = "false";

  const unauthorized = await GET(
    new NextRequest("http://localhost:3000/api/admin/knowledge/source-integrity")
  );
  assert.strictEqual(unauthorized.status, 401);

  process.env.ALLOW_DEV_ADMIN_BYPASS = "true";
  const authorized = await GET(
    new NextRequest("http://localhost:3000/api/admin/knowledge/source-integrity")
  );
  assert.strictEqual(authorized.status, 200);
  assert.strictEqual(authorized.headers.get("cache-control"), "no-store");
  assert.strictEqual(authorized.headers.get("vary"), "Cookie");

  const payload = await authorized.json();
  assert.strictEqual(payload.ok, true);
  assert.strictEqual(payload.report.status, "staging-only");
  assert.strictEqual(payload.report.invariants.publicationState, "unchanged");
  assert.strictEqual(payload.report.invariants.ragState, "inactive");
  assert.strictEqual(payload.report.summary.sourcesAudited, 11);
  assert.ok(payload.report.summary.blockerCount > 0);

  process.env.ALLOW_DEV_ADMIN_BYPASS = "false";
  console.log(
    "✅ Source-integrity dashboard authentication, no-store response, staging boundary, and zero-RAG invariants verified."
  );
}

if (require.main === module) {
  runKnowledgeSourceIntegrityDashboardTests().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
