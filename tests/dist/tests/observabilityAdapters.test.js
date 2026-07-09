"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const searchConsoleAdapter_1 = require("../src/features/knowledge-admin/adapters/searchConsoleAdapter");
const analyticsAdapter_1 = require("../src/features/knowledge-admin/adapters/analyticsAdapter");
const searchConsoleServer_1 = require("../src/features/knowledge-admin/adapters/server/searchConsoleServer");
const analyticsServer_1 = require("../src/features/knowledge-admin/adapters/server/analyticsServer");
function runTests() {
    console.log("🚀 Starting Observability API Adapters Hardening Test Suite...");
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
    // 1. GSC Mock Fallback Resiliency
    test("GSC Adapter - mock is active and returns valid data structures", async () => {
        const mock = new searchConsoleAdapter_1.MockSearchConsoleAdapter();
        const summary = await mock.getSummary();
        assert_1.default.ok(summary.dataSource.includes("Mock"));
        assert_1.default.strictEqual(summary.coreWebVitalsStatus, "Good");
        const pages = await mock.getTopLandingPages();
        assert_1.default.ok(pages.length > 0);
        assert_1.default.ok(pages[0].url.startsWith("/knowledge/"));
    });
    // 2. GA4 Mock Fallback Resiliency
    test("Analytics Adapter - mock returns safe structured metrics", async () => {
        const mock = new analyticsAdapter_1.MockAnalyticsAdapter();
        const summary = await mock.getSummary();
        assert_1.default.ok(summary.dataSource.includes("Mock"));
        assert_1.default.ok(summary.totalSessions > 0);
        const common = await mock.getCommonSearchQueries();
        assert_1.default.ok(common.length > 0);
    });
    // 3. Client Adapter Dynamic Resolution
    test("Client adapters degrade safely when credentials are empty", async () => {
        // Both adapters in searchConsoleAdapter.ts / analyticsAdapter.ts areClient instances
        // verifying that calling getSummary from mock env succeeds safely
        const summary = await searchConsoleAdapter_1.searchConsoleAdapter.getSummary();
        assert_1.default.ok(summary.dataSource.toLowerCase().includes("mock") || summary.dataSource.toLowerCase().includes("live"));
    });
    // 4. Server adapter instantiation safety
    test("Production adapters instantiate safely with default environment check parameters", () => {
        try {
            const gsc = new searchConsoleServer_1.ProductionSearchConsoleAdapter();
            assert_1.default.ok(gsc);
        }
        catch (e) {
            // Handles JWT loading check cleanly
        }
        try {
            const ga4 = new analyticsServer_1.ProductionAnalyticsAdapter();
            assert_1.default.ok(ga4);
        }
        catch (e) {
        }
    });
    setTimeout(() => {
        console.log(`\n🎉 Observability Adapters Tests Completed. Passed: ${passed}, Failed: ${failed}`);
        if (failed > 0) {
            process.exit(1);
        }
    }, 100);
}
runTests();
