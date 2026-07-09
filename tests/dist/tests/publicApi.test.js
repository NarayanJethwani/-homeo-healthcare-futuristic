"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const route_1 = require("../src/app/api/public/knowledge/diseases/route");
const route_2 = require("../src/app/api/public/knowledge/remedies/route");
const route_3 = require("../src/app/api/public/knowledge/symptoms/route");
const route_4 = require("../src/app/api/public/knowledge/lab-tests/route");
const route_5 = require("../src/app/api/public/knowledge/faqs/route");
const knowledgeIndex_1 = require("../src/features/knowledge/search/knowledgeIndex");
async function runPublicApiTests() {
    console.log("🚀 Starting Public API and Search Boundary Tests...");
    let passed = 0;
    let failed = 0;
    async function test(name, fn) {
        try {
            await fn();
            console.log(`  ✅ PASSED: ${name}`);
            passed++;
        }
        catch (err) {
            console.error(`  ❌ FAILED: ${name}`);
            console.error(err.stack || err);
            failed++;
        }
    }
    // Helper to extract JSON from Next.js NextResponse
    async function getResponseJson(response) {
        return await response.json();
    }
    // --- Tests ---
    await test("GET /api/public/knowledge/diseases - exposes only published records", async () => {
        const res = await (0, route_1.GET)();
        const list = await getResponseJson(res);
        assert_1.default.ok(Array.isArray(list), "Response must be an array");
        assert_1.default.ok(list.length > 0, "Should have at least one disease");
        list.forEach((item) => {
            assert_1.default.strictEqual(item.editorialStatus, "published", `Entity ${item.id} is not published`);
            assert_1.default.ok(!item.editorialNotes, `Private notes leaked in public disease API: ${item.id}`);
        });
    });
    await test("GET /api/public/knowledge/remedies - exposes only published records", async () => {
        const res = await (0, route_2.GET)();
        const list = await getResponseJson(res);
        assert_1.default.ok(Array.isArray(list));
        list.forEach((item) => {
            assert_1.default.strictEqual(item.editorialStatus, "published");
            assert_1.default.ok(!item.editorialNotes);
        });
    });
    await test("GET /api/public/knowledge/symptoms - exposes only published records", async () => {
        const res = await (0, route_3.GET)();
        const list = await getResponseJson(res);
        assert_1.default.ok(Array.isArray(list));
        list.forEach((item) => {
            assert_1.default.strictEqual(item.editorialStatus, "published");
            assert_1.default.ok(!item.editorialNotes);
        });
    });
    await test("GET /api/public/knowledge/lab-tests - exposes only published records", async () => {
        const res = await (0, route_4.GET)();
        const list = await getResponseJson(res);
        assert_1.default.ok(Array.isArray(list));
        list.forEach((item) => {
            assert_1.default.strictEqual(item.editorialStatus, "published");
            assert_1.default.ok(!item.editorialNotes);
        });
    });
    await test("GET /api/public/knowledge/faqs - exposes only published records", async () => {
        const res = await (0, route_5.GET)();
        const list = await getResponseJson(res);
        assert_1.default.ok(Array.isArray(list));
        list.forEach((item) => {
            assert_1.default.strictEqual(item.editorialStatus, "published");
            assert_1.default.ok(!item.editorialNotes);
        });
    });
    await test("searchKnowledgeBase - public search filters out non-published items", () => {
        // 1. Search empty query which returns all matchable items
        const results = (0, knowledgeIndex_1.searchKnowledgeBase)("");
        assert_1.default.ok(results.length > 0);
        results.forEach(res => {
            assert_1.default.strictEqual(res.entity.editorialStatus, "published", `Search result ${res.entity.id} is not published`);
            assert_1.default.ok(!res.entity.editorialNotes, `Search result leaks editorialNotes on ${res.entity.id}`);
        });
        // 2. Search keyword query
        const gerdResults = (0, knowledgeIndex_1.searchKnowledgeBase)("GERD");
        gerdResults.forEach(res => {
            assert_1.default.strictEqual(res.entity.editorialStatus, "published");
            assert_1.default.ok(!res.entity.editorialNotes);
        });
    });
    console.log(`\n=== Public API Boundary Suite Summary: ${passed} passed, ${failed} failed ===`);
    if (failed > 0) {
        process.exit(1);
    }
}
runPublicApiTests().catch(err => {
    console.error(err);
    process.exit(1);
});
