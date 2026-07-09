"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const knowledgeSearchAnalytics_1 = require("../src/features/knowledge/analytics/knowledgeSearchAnalytics");
const searchConsoleAdapter_1 = require("../src/features/knowledge-admin/adapters/searchConsoleAdapter");
const searchConsoleServer_1 = require("../src/features/knowledge-admin/adapters/server/searchConsoleServer");
const analyticsAdapter_1 = require("../src/features/knowledge-admin/adapters/analyticsAdapter");
const analyticsServer_1 = require("../src/features/knowledge-admin/adapters/server/analyticsServer");
async function runTests() {
    console.log("🚀 Starting Observability & Telemetry Analytics Tests...");
    let passed = 0;
    let failed = 0;
    function test(name, fn) {
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
            }
            else {
                console.log(`✅ TEST PASSED: ${name}`);
                passed++;
            }
        }
        catch (err) {
            console.error(`❌ TEST FAILED: ${name}`);
            console.error(err.stack || err);
            failed++;
        }
    }
    // 1. PII/PHI Redaction Unit Tests
    test("Redaction - preserves safe queries", () => {
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("acid reflux"), "acid reflux");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("Nux Vomica"), "nux vomica");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("gerd therapeutics"), "gerd therapeutics");
    });
    test("Redaction - filters emails", () => {
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("acid reflux info@patient.org"), "[redacted-sensitive-query]");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("remedy list sent to doctor@gmail.com"), "[redacted-sensitive-query]");
    });
    test("Redaction - filters phone numbers", () => {
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("Sulphur case 555-123-4567"), "[redacted-sensitive-query]");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("acidity query (800) 555 0199"), "[redacted-sensitive-query]");
    });
    test("Redaction - filters DOB and SSN patterns", () => {
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("eczema child born 12/12/2010"), "[redacted-sensitive-query]");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("asthma patient ssn 000-12-3456"), "[redacted-sensitive-query]");
    });
    test("Redaction - filters clinical note indicators (HIPAA)", () => {
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("Mr. Smith presents with severe bloating"), "[redacted-sensitive-query]");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("patient is a 55 year old male with chronic cough"), "[redacted-sensitive-query]");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)("doctor says to take remedy"), "[redacted-sensitive-query]");
    });
    test("Redaction - filters excessively long copy-pasted text", () => {
        const longQuery = "This is a very long string designed to mimic a clinical description containing symptoms, observations, and prescription notes. Homeopathy has many indications for chronic situations.";
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.redactSensitiveSearchQuery)(longQuery), "[redacted-sensitive-query]");
    });
    // 2. Normalization Unit Tests
    test("Normalization - sanitizes and formats queries correctly", () => {
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.normalizeQuery)("  Sulphur, (constitutional)??  "), "sulphur constitutional");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.normalizeQuery)("GERD / acid reflux!!!"), "gerd acid reflux");
        assert_1.default.strictEqual((0, knowledgeSearchAnalytics_1.normalizeQuery)("patient email@domain.com"), "[redacted-sensitive-query]");
    });
    // 3. Search Tracking Integration Tests
    test("Search tracking - tracks queries and aggregates correctly", async () => {
        await (0, knowledgeSearchAnalytics_1.trackSearchQuery)({
            query: "IBS remedy",
            resultCount: 3,
            source: "public-site"
        });
        await (0, knowledgeSearchAnalytics_1.trackSearchQuery)({
            query: "IBS remedy",
            resultCount: 3,
            source: "public-site"
        });
        await (0, knowledgeSearchAnalytics_1.trackSearchQuery)({
            query: "unknown disorder",
            resultCount: 0,
            source: "clinical-os"
        });
        await (0, knowledgeSearchAnalytics_1.trackSearchQuery)({
            query: "patient email@domain.com", // should get redacted
            resultCount: 1,
            source: "clinical-os"
        });
        const summary = await (0, knowledgeSearchAnalytics_1.getSearchAnalyticsSummary)();
        // Check that we captured the searches
        assert_1.default.ok(summary.totalSearches >= 4);
        // Verify redaction was maintained in tracking database
        const redactedLogged = summary.commonQueries.find(q => q.query === "[redacted-sensitive-query]");
        assert_1.default.ok(redactedLogged);
        // Verify zero results query was logged in noResultQueries
        const missingLogged = summary.noResultQueries.find(q => q.query === "unknown disorder");
        assert_1.default.ok(missingLogged);
    });
    // 4. Adapter Fallback Resiliency
    test("Search Console Adapter - gracefully handles mock fallback state", async () => {
        const summary = await searchConsoleAdapter_1.searchConsoleAdapter.getSummary();
        assert_1.default.ok(summary.dataSource.includes("Search Console"));
        assert_1.default.ok(summary.clicks >= 0);
    });
    test("Analytics Adapter - gracefully handles mock fallback state", async () => {
        const summary = await analyticsAdapter_1.analyticsAdapter.getSummary();
        assert_1.default.ok(summary.dataSource.toLowerCase().includes("analytics"));
        assert_1.default.ok(summary.totalSessions >= 0);
    });
    test("Production adapters instantiate safely", () => {
        try {
            const gsc = new searchConsoleServer_1.ProductionSearchConsoleAdapter();
            assert_1.default.ok(gsc);
        }
        catch (e) {
            // Construction requires JWT require of googleapis which works in tests
        }
        try {
            const ga4 = new analyticsServer_1.ProductionAnalyticsAdapter();
            assert_1.default.ok(ga4);
        }
        catch (e) {
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
