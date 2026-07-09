"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const editorialPriorityService_1 = require("../src/features/knowledge-admin/services/editorialPriorityService");
function runTests() {
    console.log("🚀 Starting Editorial Priority Service Test Suite...");
    let passed = 0;
    let failed = 0;
    function test(name, fn) {
        try {
            fn();
            console.log(`✅ TEST PASSED: ${name}`);
            passed++;
        }
        catch (err) {
            console.error(`❌ TEST FAILED: ${name}`);
            console.error(err.stack || err);
            failed++;
        }
    }
    // 1. Clinical safety warnings outrank SEO
    test("Clinical safety warning raises priority to Critical immediately", () => {
        const result = (0, editorialPriorityService_1.calculateEditorialPriority)({
            isCornerstone: false,
            citationHealth: "Verified",
            editorialStatus: "published",
            clinicalOsViews: 10,
            searchImpressions: 100,
            searchCtr: 0.05,
            hasClinicalSafetyContraindications: true
        });
        assert_1.default.strictEqual(result.category, "Critical");
        assert_1.default.strictEqual(result.score, 100);
        assert_1.default.ok(result.reason.toLowerCase().includes("clinical safety"));
    });
    // 2. Cornerstone + poor/warning citation health -> CRITICAL
    test("Cornerstone article with poor citation health raises priority to Critical", () => {
        const result = (0, editorialPriorityService_1.calculateEditorialPriority)({
            isCornerstone: true,
            citationHealth: "warning",
            editorialStatus: "published",
            clinicalOsViews: 200,
            searchImpressions: 1000,
            searchCtr: 0.02,
            hasClinicalSafetyContraindications: false
        });
        assert_1.default.strictEqual(result.category, "Critical");
        assert_1.default.strictEqual(result.score, 95);
        assert_1.default.ok(result.reason.toLowerCase().includes("cornerstone"));
    });
    // 3. Needs review + high Clinical OS views -> HIGH
    test("High Clinical OS usage with unreviewed/draft status raises priority to High", () => {
        const result = (0, editorialPriorityService_1.calculateEditorialPriority)({
            isCornerstone: false,
            citationHealth: "Verified",
            editorialStatus: "needs-review",
            clinicalOsViews: 1200,
            searchImpressions: 500,
            searchCtr: 0.02,
            hasClinicalSafetyContraindications: false
        });
        assert_1.default.strictEqual(result.category, "High");
        assert_1.default.strictEqual(result.score, 85);
        assert_1.default.ok(result.reason.toLowerCase().includes("high clinical os"));
    });
    // 4. Citation warning (non-cornerstone) -> MEDIUM
    test("Weak citation health raises priority to Medium", () => {
        const result = (0, editorialPriorityService_1.calculateEditorialPriority)({
            isCornerstone: false,
            citationHealth: "Needs Citations",
            editorialStatus: "published",
            clinicalOsViews: 50,
            searchImpressions: 100,
            searchCtr: 0.02,
            hasClinicalSafetyContraindications: false
        });
        assert_1.default.strictEqual(result.category, "Medium");
        assert_1.default.strictEqual(result.score, 65);
        assert_1.default.ok(result.reason.toLowerCase().includes("reference update"));
    });
    // 5. High search impressions + low CTR -> MEDIUM (SEO suggestion)
    test("High impressions with poor CTR raises priority to Medium", () => {
        const result = (0, editorialPriorityService_1.calculateEditorialPriority)({
            isCornerstone: false,
            citationHealth: "Verified",
            editorialStatus: "published",
            clinicalOsViews: 50,
            searchImpressions: 6000,
            searchCtr: 0.01,
            hasClinicalSafetyContraindications: false
        });
        assert_1.default.strictEqual(result.category, "Medium");
        assert_1.default.strictEqual(result.score, 55);
        assert_1.default.ok(result.reason.toLowerCase().includes("seo"));
    });
    // 6. Healthy article -> LOW
    test("Healthy published article with normal views has Low priority", () => {
        const result = (0, editorialPriorityService_1.calculateEditorialPriority)({
            isCornerstone: false,
            citationHealth: "Verified",
            editorialStatus: "published",
            clinicalOsViews: 150,
            searchImpressions: 200,
            searchCtr: 0.04,
            hasClinicalSafetyContraindications: false
        });
        assert_1.default.strictEqual(result.category, "Low");
        assert_1.default.strictEqual(result.score, 25);
    });
    console.log(`\n🎉 Editorial Priority Service Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
}
runTests();
