"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const clinicalOsIntegration_1 = require("../src/features/knowledge/governance/clinicalOsIntegration");
function runIntegrationTests() {
    console.log("🚀 Starting V2.3.1 Clinical OS Integration Layer Unit Tests...");
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
    // 1. Linking resolution for valid entities & route pattern validation
    test("Clinical OS Integration - resolve link for valid remedy (Sulphur)", () => {
        const link = (0, clinicalOsIntegration_1.getKnowledgeLinkForRemedy)("sulphur");
        assert_1.default.strictEqual(link.found, true);
        assert_1.default.ok(link.url.startsWith("/knowledge/remedies/"));
        assert_1.default.strictEqual(link.url, "/knowledge/remedies/sulphur");
        assert_1.default.strictEqual(link.title, "Sulphur (Sublimed Sulphur)");
    });
    test("Clinical OS Integration - resolve link for valid disease (GERD via slug)", () => {
        const link = (0, clinicalOsIntegration_1.getKnowledgeLinkForDisease)("gastroesophageal-reflux-disease");
        assert_1.default.strictEqual(link.found, true);
        assert_1.default.ok(link.url.startsWith("/knowledge/diseases/"));
        assert_1.default.strictEqual(link.url, "/knowledge/diseases/gastroesophageal-reflux-disease");
    });
    test("Clinical OS Integration - resolve link for valid symptom (Acid Reflux)", () => {
        const link = (0, clinicalOsIntegration_1.getKnowledgeLinkForSymptom)("acid-reflux");
        assert_1.default.strictEqual(link.found, true);
        assert_1.default.ok(link.url.startsWith("/knowledge/symptoms/"));
        assert_1.default.strictEqual(link.url, "/knowledge/symptoms/acid-reflux");
    });
    // 2. Safe Fallback URL resolution when entities are missing (No broken links)
    test("Clinical OS Integration - fallback for nonexistent disease id", () => {
        const link = (0, clinicalOsIntegration_1.getKnowledgeLinkForDisease)("nonexistent-disease-xyz");
        assert_1.default.strictEqual(link.found, false);
        assert_1.default.strictEqual(link.url, "");
        assert_1.default.strictEqual(link.title, "Knowledge article pending");
    });
    test("Clinical OS Integration - fallback for nonexistent remedy id", () => {
        const link = (0, clinicalOsIntegration_1.getKnowledgeLinkForRemedy)("nonexistent-remedy-xyz");
        assert_1.default.strictEqual(link.found, false);
        assert_1.default.strictEqual(link.url, "");
        assert_1.default.strictEqual(link.title, "Knowledge article pending");
    });
    test("Clinical OS Integration - fallback for nonexistent comparison/case-study id", () => {
        const link = (0, clinicalOsIntegration_1.getKnowledgeLinkForComparison)("nonexistent-comparison-xyz");
        assert_1.default.strictEqual(link.found, false);
        assert_1.default.strictEqual(link.url, "");
        assert_1.default.strictEqual(link.title, "Knowledge article pending");
    });
    // 3. Structured context lookup bundle for valid entities
    test("Clinical OS Integration - context lookup for valid remedy (Sulphur)", () => {
        const context = (0, clinicalOsIntegration_1.getKnowledgeContextForRemedy)("sulphur");
        assert_1.default.strictEqual(context.found, true);
        assert_1.default.strictEqual(context.slug, "sulphur");
        assert_1.default.strictEqual(context.editorialStatus, "published");
        assert_1.default.strictEqual(context.isCornerstone, false);
        assert_1.default.strictEqual(context.citationHealth, "Pending Review");
        assert_1.default.ok(context.disclaimer.includes("Clinical Education Reference"));
        assert_1.default.ok(context.tags.includes("Sulphur"));
    });
    test("Clinical OS Integration - context lookup for valid disease (GERD via slug)", () => {
        const context = (0, clinicalOsIntegration_1.getKnowledgeContextForDisease)("gastroesophageal-reflux-disease");
        assert_1.default.strictEqual(context.found, true);
        assert_1.default.strictEqual(context.slug, "gastroesophageal-reflux-disease");
        assert_1.default.strictEqual(context.editorialStatus, "published");
        assert_1.default.ok(context.icdCode?.includes("K21"));
    });
    // 4. Safe fallback context for nonexistent entities
    test("Clinical OS Integration - fallback context lookup for nonexistent remedy", () => {
        const context = (0, clinicalOsIntegration_1.getKnowledgeContextForRemedy)("mystery-remedy");
        assert_1.default.strictEqual(context.found, false);
        assert_1.default.strictEqual(context.slug, "mystery-remedy");
        assert_1.default.strictEqual(context.editorialStatus, "needs-review");
        assert_1.default.strictEqual(context.url, "");
    });
    // 5. Consolidated batch lookups (handles missing items safely)
    test("Clinical OS Integration - consolidated batch lookup bundle", () => {
        const bundle = (0, clinicalOsIntegration_1.getClinicalOsKnowledgeBundle)({
            diseases: ["gastroesophageal-reflux-disease", "missing-disease"],
            remedies: ["sulphur"],
            symptoms: ["acid-reflux", "missing-symptom"]
        });
        // Check disease sub-bundle
        assert_1.default.ok(bundle.diseases["gastroesophageal-reflux-disease"]);
        assert_1.default.strictEqual(bundle.diseases["gastroesophageal-reflux-disease"].found, true);
        assert_1.default.ok(bundle.diseases["missing-disease"]);
        assert_1.default.strictEqual(bundle.diseases["missing-disease"].found, false);
        assert_1.default.strictEqual(bundle.diseases["missing-disease"].url, "");
        // Check remedy sub-bundle
        assert_1.default.ok(bundle.remedies["sulphur"]);
        assert_1.default.strictEqual(bundle.remedies["sulphur"].found, true);
        // Check symptom sub-bundle
        assert_1.default.ok(bundle.symptoms["acid-reflux"]);
        assert_1.default.strictEqual(bundle.symptoms["acid-reflux"].found, true);
        assert_1.default.ok(bundle.symptoms["missing-symptom"]);
        assert_1.default.strictEqual(bundle.symptoms["missing-symptom"].found, false);
    });
    // 6. Safety Audit Checks
    test("Clinical OS Integration - disclaimer has no treatment recommendations or potencies", () => {
        const context = (0, clinicalOsIntegration_1.getKnowledgeContextForRemedy)("sulphur");
        assert_1.default.ok(context.disclaimer.includes("Clinical Education Reference"));
        assert_1.default.ok(!context.disclaimer.includes("30C"));
        assert_1.default.ok(!context.disclaimer.includes("200C"));
        assert_1.default.ok(!context.disclaimer.includes("potency"));
        assert_1.default.ok(!context.disclaimer.includes("dosage"));
    });
    console.log(`\n🎉 V2.3.1 Integration Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
}
runIntegrationTests();
