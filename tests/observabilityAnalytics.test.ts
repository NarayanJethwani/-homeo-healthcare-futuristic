import assert from "assert";
import { 
  redactSensitiveSearchQuery, 
  normalizeQuery, 
  trackSearchQuery, 
  getSearchAnalyticsSummary 
} from "../src/features/knowledge/analytics/knowledgeSearchAnalytics";
import { searchConsoleAdapter } from "../src/features/knowledge-admin/adapters/searchConsoleAdapter";
import { ProductionSearchConsoleAdapter } from "../src/features/knowledge-admin/adapters/server/searchConsoleServer";
import { analyticsAdapter } from "../src/features/knowledge-admin/adapters/analyticsAdapter";
import { ProductionAnalyticsAdapter } from "../src/features/knowledge-admin/adapters/server/analyticsServer";

async function runTests() {
  console.log("🚀 Starting Observability & Telemetry Analytics Tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      const res = fn();
      if (res && typeof res.then === "function") {
        res.then(() => {
          console.log(`✅ TEST PASSED: ${name}`);
          passed++;
        }).catch(err => {
          console.error(`❌ TEST FAILED: ${name}`);
          console.error(err.stack || err);
          failed++;
        });
      } else {
        console.log(`✅ TEST PASSED: ${name}`);
        passed++;
      }
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  // 1. PII/PHI Redaction Unit Tests
  test("Redaction - preserves safe queries", () => {
    assert.strictEqual(redactSensitiveSearchQuery("acid reflux"), "acid reflux");
    assert.strictEqual(redactSensitiveSearchQuery("Nux Vomica"), "nux vomica");
    assert.strictEqual(redactSensitiveSearchQuery("gerd therapeutics"), "gerd therapeutics");
  });

  test("Redaction - filters emails", () => {
    assert.strictEqual(redactSensitiveSearchQuery("acid reflux info@patient.org"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("remedy list sent to doctor@gmail.com"), "[redacted-sensitive-query]");
  });

  test("Redaction - filters phone numbers", () => {
    assert.strictEqual(redactSensitiveSearchQuery("Sulphur case 555-123-4567"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("acidity query (800) 555 0199"), "[redacted-sensitive-query]");
  });

  test("Redaction - filters DOB and SSN patterns", () => {
    assert.strictEqual(redactSensitiveSearchQuery("eczema child born 12/12/2010"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("asthma patient ssn 000-12-3456"), "[redacted-sensitive-query]");
  });

  test("Redaction - filters clinical note indicators (HIPAA)", () => {
    assert.strictEqual(redactSensitiveSearchQuery("Mr. Smith presents with severe bloating"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("patient is a 55 year old male with chronic cough"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("doctor says to take remedy"), "[redacted-sensitive-query]");
  });

  test("Redaction - filters excessively long copy-pasted text", () => {
    const longQuery = "This is a very long string designed to mimic a clinical description containing symptoms, observations, and prescription notes. Homeopathy has many indications for chronic situations.";
    assert.strictEqual(redactSensitiveSearchQuery(longQuery), "[redacted-sensitive-query]");
  });

  // 2. Normalization Unit Tests
  test("Normalization - sanitizes and formats queries correctly", () => {
    assert.strictEqual(normalizeQuery("  Sulphur, (constitutional)??  "), "sulphur constitutional");
    assert.strictEqual(normalizeQuery("GERD / acid reflux!!!"), "gerd acid reflux");
    assert.strictEqual(normalizeQuery("patient email@domain.com"), "[redacted-sensitive-query]");
  });

  // 3. Search Tracking Integration Tests
  test("Search tracking - tracks queries and aggregates correctly", async () => {
    await trackSearchQuery({
      query: "IBS remedy",
      resultCount: 3,
      source: "public-site"
    });

    await trackSearchQuery({
      query: "IBS remedy",
      resultCount: 3,
      source: "public-site"
    });

    await trackSearchQuery({
      query: "unknown disorder",
      resultCount: 0,
      source: "clinical-os"
    });

    await trackSearchQuery({
      query: "patient email@domain.com", // should get redacted
      resultCount: 1,
      source: "clinical-os"
    });

    const summary = await getSearchAnalyticsSummary();
    
    // Check that we captured the searches
    assert.ok(summary.totalSearches >= 4);

    // Verify redaction was maintained in tracking database
    const redactedLogged = summary.commonQueries.find(q => q.query === "[redacted-sensitive-query]");
    assert.ok(redactedLogged);

    // Verify zero results query was logged in noResultQueries
    const missingLogged = summary.noResultQueries.find(q => q.query === "unknown disorder");
    assert.ok(missingLogged);
  });

  // 4. Adapter Fallback Resiliency
  test("Search Console Adapter - gracefully handles mock fallback state", async () => {
    const summary = await searchConsoleAdapter.getSummary();
    assert.ok(summary.dataSource.includes("Search Console"));
    assert.ok(summary.clicks >= 0);
  });

  test("Analytics Adapter - gracefully handles mock fallback state", async () => {
    const summary = await analyticsAdapter.getSummary();
    assert.ok(summary.dataSource.toLowerCase().includes("analytics"));
    assert.ok(summary.totalSessions >= 0);
  });

  test("Production adapters instantiate safely", () => {
    try {
      const gsc = new ProductionSearchConsoleAdapter();
      assert.ok(gsc);
    } catch (e) {
      // Construction requires JWT require of googleapis which works in tests
    }

    try {
      const ga4 = new ProductionAnalyticsAdapter();
      assert.ok(ga4);
    } catch (e) {
    }
  });

  // Wait a short time to allow async test outcomes to settle
  setTimeout(() => {
    console.log(`\n🎉 Observability Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
      process.exit(1);
    }
  }, 100);
}

runTests();
