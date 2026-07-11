import assert from "assert";
import { evaluateEvidenceRetrievalPolicy } from "../src/features/knowledge/retrieval/evidenceScoringService";

async function runEvidenceContextsTests() {
  console.log("🚀 Running Evidence Context Gating Policy tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (e: any) {
      console.error(`❌ ${name}`);
      console.error(e.stack || e);
      failed++;
    }
  }

  test("exclude-from-ai policy behaviour", () => {
    // Current review state -> eligible in all
    const evalCurrent = evaluateEvidenceRetrievalPolicy({
      policy: "exclude-from-ai",
      reviewState: "current",
      context: "ai-clinical-context",
      exclusionThreshold: "expired"
    });
    assert.strictEqual(evalCurrent.eligible, true);

    // Overdue review state -> eligible in all under default threshold of expired
    const evalOverdue = evaluateEvidenceRetrievalPolicy({
      policy: "exclude-from-ai",
      reviewState: "overdue",
      context: "ai-clinical-context",
      exclusionThreshold: "expired"
    });
    assert.strictEqual(evalOverdue.eligible, true);

    // Expired review state -> excluded only from ai-clinical-context
    const evalExpiredAi = evaluateEvidenceRetrievalPolicy({
      policy: "exclude-from-ai",
      reviewState: "expired",
      context: "ai-clinical-context",
      exclusionThreshold: "expired"
    });
    assert.strictEqual(evalExpiredAi.eligible, false);

    const evalExpiredPublic = evaluateEvidenceRetrievalPolicy({
      policy: "exclude-from-ai",
      reviewState: "expired",
      context: "public-search",
      exclusionThreshold: "expired"
    });
    assert.strictEqual(evalExpiredPublic.eligible, true);
  });

  test("exclude-from-all-search policy behaviour", () => {
    const contexts: ("ai-clinical-context" | "public-search" | "manual-clinical-search")[] = [
      "ai-clinical-context",
      "public-search",
      "manual-clinical-search"
    ];

    for (const ctx of contexts) {
      const evalExpired = evaluateEvidenceRetrievalPolicy({
        policy: "exclude-from-all-search",
        reviewState: "expired",
        context: ctx,
        exclusionThreshold: "expired"
      });
      assert.strictEqual(evalExpired.eligible, false, `Should be excluded from ${ctx}`);
    }

    // Allowed in admin-search
    const evalAdmin = evaluateEvidenceRetrievalPolicy({
      policy: "exclude-from-all-search",
      reviewState: "expired",
      context: "admin-search",
      exclusionThreshold: "expired"
    });
    assert.strictEqual(evalAdmin.eligible, true);
  });

  test("ranking-penalty policy behaviour", () => {
    // Expired or overdue review state under ranking-penalty -> eligible in all but applies penalty
    const evalExpired = evaluateEvidenceRetrievalPolicy({
      policy: "ranking-penalty",
      reviewState: "expired",
      context: "ai-clinical-context",
      exclusionThreshold: "expired"
    });
    assert.strictEqual(evalExpired.eligible, true);
    assert.strictEqual(evalExpired.applyPenalty, true);
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceContextsTests().catch(e => {
  console.error(e);
  process.exit(1);
});
