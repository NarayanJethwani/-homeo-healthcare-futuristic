import assert from "assert";
import { 
  calculateNextReviewDueAt, 
  calculateEvidenceReviewState,
  EVIDENCE_REVIEW_POLICY_V1
} from "../src/features/knowledge/retrieval/evidenceScoringService";

async function runEvidenceDatesTests() {
  console.log("🚀 Running Date boundary and grace period tests...");
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

  test("Leap year calculations (2028 is leap year, 2026 is not)", () => {
    // 2026: non-leap year (365 days)
    const result2026 = calculateNextReviewDueAt("2026-01-01T00:00:00.000Z", 365);
    assert.strictEqual(result2026, "2027-01-01T00:00:00.000Z");

    // 2028: leap year (366 days for one full calendar year)
    const resultLeap = calculateNextReviewDueAt("2028-02-28T12:00:00.000Z", 2); // 2 days across leap day
    assert.strictEqual(resultLeap, "2028-03-01T12:00:00.000Z");
  });

  test("Timezone offset neutrality", () => {
    const offsetDate = "2026-01-01T12:00:00+05:30";
    const result = calculateNextReviewDueAt(offsetDate, 10);
    assert.ok(result.startsWith("2026-01-11T"));
  });

  test("Due-soon and grace-period boundaries", () => {
    const referenceDate = "2026-06-01T00:00:00.000Z";

    // Exactly at the due-soon boundary (exactly 30 days away)
    const stateBoundary = calculateEvidenceReviewState({
      nextReviewDueAt: "2026-07-01T00:00:00.000Z",
      referenceDate,
      dueSoonWindowDays: 30,
      gracePeriodDays: 90
    });
    assert.strictEqual(stateBoundary, "due-soon");

    // Exactly at the grace period boundary (exactly 90 days overdue)
    const stateOverdueBoundary = calculateEvidenceReviewState({
      nextReviewDueAt: "2026-03-03T00:00:00.000Z", // 90 days ago
      referenceDate,
      dueSoonWindowDays: 30,
      gracePeriodDays: 90
    });
    assert.strictEqual(stateOverdueBoundary, "overdue");

    // 91 days overdue -> expired
    const stateExpiredBoundary = calculateEvidenceReviewState({
      nextReviewDueAt: "2026-03-02T00:00:00.000Z", // 91 days ago
      referenceDate,
      dueSoonWindowDays: 30,
      gracePeriodDays: 90
    });
    assert.strictEqual(stateExpiredBoundary, "expired");
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceDatesTests().catch(e => {
  console.error(e);
  process.exit(1);
});
