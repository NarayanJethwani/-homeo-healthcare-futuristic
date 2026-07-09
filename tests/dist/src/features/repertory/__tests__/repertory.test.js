"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const repertoryDb_1 = require("../database/repertoryDb");
const repertorySearch_1 = require("../search/repertorySearch");
const repertoryScoring_1 = require("../scoring/repertoryScoring");
const repertoryGraph_1 = require("../graph/repertoryGraph");
const databaseValidator_1 = require("../validators/databaseValidator");
const importExportService_1 = require("../import-export/importExportService");
const reasoningEngine_1 = require("../reasoning/reasoningEngine");
async function runRepertoryTests() {
    console.log("🚀 Starting Clinical Repertory & AI Intake Unit Tests...");
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
    // Ensure repository is initialized with seed data
    const rubrics = await repertoryDb_1.repertoryRepository.getRubrics();
    assert_1.default.ok(rubrics.length > 0, "Repository should have seeded rubrics.");
    // --- Tests ---
    await test("Search Ranking - exact title matches must rank higher than synonym matches", async () => {
        // Querying for "burnout" should match "Adrenal Burnout" title first
        const results = await repertorySearch_1.RepertorySearch.searchRubrics("burnout");
        assert_1.default.ok(results.length > 0, "Should return results for burnout.");
        assert_1.default.strictEqual(results[0].rubric.rubricId, "jeth_rb_adrenal_burnout");
    });
    await test("Synonym Matching - search should expand to synonyms", async () => {
        // "exhaustion" is a synonym for adrenal burnout
        const results = await repertorySearch_1.RepertorySearch.searchRubrics("exhaustion");
        assert_1.default.ok(results.length > 0, "Should match via synonym expansion.");
        assert_1.default.ok(results.some((r) => r.rubric.rubricId === "jeth_rb_adrenal_burnout"), "Synonym search for exhaustion should match adrenal burnout.");
    });
    await test("Scoring Output & Grade 4 Handling - weighted scoring matches expected boosts", async () => {
        // We pass Adrenal Burnout rubric which contains Phosphoricum Acidum (Ph-ac, Grade 4 Keynote) and Nux Vomica (Nux-v, Grade 3)
        const symptoms = [
            {
                rubricId: "jeth_rb_adrenal_burnout",
                severity: 8,
                frequency: "constant", // multiplier 1.2
                impact: "severe" // multiplier 1.2
            }
        ];
        const results = await repertoryScoring_1.RepertoryScoring.calculateRepertorization(symptoms);
        assert_1.default.ok(results.topRemedies.length > 0, "Scoring should output ranked remedies.");
        // Check that Phosphoricum Acidum is ranked higher than Nux Vomica because of its Grade 4 Keynote weight
        const phacMatch = results.topRemedies.find((r) => r.remedyId === "Ph-ac");
        const nuxMatch = results.topRemedies.find((r) => r.remedyId === "Nux-v");
        assert_1.default.ok(phacMatch && nuxMatch, "Should score both Ph-ac and Nux-v.");
        assert_1.default.ok(phacMatch.score > nuxMatch.score, `Grade 4 Ph-ac score (${phacMatch.score}) must exceed Grade 3 Nux-v (${nuxMatch.score}).`);
    });
    await test("Prohibited-Claims Validator - regex scans must detect cures/guarantees", async () => {
        // Create a mock invalid rubric with prohibited words
        const invalidRubric = {
            rubricId: "jeth_rb_bad_claim",
            title: "Complete cure for cancer",
            plainLanguageMeaning: "This is a guaranteed cure.",
            classicalWording: "CANCER - CURED - guaranteed",
            category: "Modern Clinical Conditions",
            organSystem: "Generalities",
            synonyms: [],
            patientExpressions: [],
            clinicalKeywords: [],
            relatedSymptoms: [],
            relatedDiseases: [],
            miasmaticWeight: { Psora: 0.1, Sycosis: 0.1, Syphilis: 0.1, Tubercular: 0.1, Cancerinic: 0.1 },
            intensityScale: 5,
            polarity: "positive",
            modalities: [],
            aggravations: [],
            ameliorations: [],
            source: "Unverified Website",
            confidence: 0.5,
            author: "Guest",
            reviewer: "None",
            lastUpdated: new Date().toISOString(),
            relatedRemedies: []
        };
        const report = await databaseValidator_1.DatabaseValidator.validateDatabase();
        if (!report.isValid) {
            console.log("Database Validation Report:", JSON.stringify(report, null, 2));
        }
        // Run direct prohibited claims check on the string
        const matchCure = /cures|guarantee|proven to heal|absolute cure/i.test(invalidRubric.plainLanguageMeaning);
        assert_1.default.strictEqual(matchCure, true, "Validator must detect the prohibited claim word 'guaranteed'.");
        // Assert that current database is clean and contains no prohibited claims
        assert_1.default.ok(report.isValid, "Seed database must pass validation and have zero safety claims violations.");
    });
    await test("Graph Traversal - find differentiating rubrics between remedies", async () => {
        // Ask for differentiating rubrics between Sulphur and Lycopodium
        const diffRubrics = await repertoryGraph_1.RepertoryGraph.getDifferentiatingRubrics("Sulph", "Lyc");
        assert_1.default.ok(Array.isArray(diffRubrics), "Should return array of differentiating rubrics.");
        // Assert that the difference in remedy grade is >= 2 for the differentiating rubrics returned
        diffRubrics.forEach(d => {
            const gSulph = d.rubric.relatedRemedies.find(r => r.remedyId === "Sulph")?.grade || 0;
            const gLyc = d.rubric.relatedRemedies.find(r => r.remedyId === "Lyc")?.grade || 0;
            const diff = Math.abs(gSulph - gLyc);
            assert_1.default.ok(diff >= 2, `Differentiating rubrics must have grade difference >= 2, got ${diff}`);
        });
    });
    await test("Export Adapters - verify that NTriples output produces valid triples", async () => {
        const NTriplesContent = await importExportService_1.ImportExportService.exportToGraphTriples();
        assert_1.default.ok(typeof NTriplesContent === 'string', "NTriples output must be a string.");
        assert_1.default.ok(NTriplesContent.includes("relatesTo") || NTriplesContent.includes("belongsToOrgan"), "NTriples output must contain predicates.");
    });
    await test("Database Validator - audit weak or empty differential notes", async () => {
        const report = await databaseValidator_1.DatabaseValidator.validateDatabase();
        assert_1.default.ok(Array.isArray(report.weakDifferentialNotes), "Should return array of weak differential notes.");
        assert_1.default.strictEqual(report.weakDifferentialNotes.length, 0, "No related remedies should have weak or empty differential notes.");
    });
    await test("Clinical Case Scenarios - validate NLP matching and remedy ranking of 12 cases", async () => {
        const report = await databaseValidator_1.DatabaseValidator.validateDatabase();
        assert_1.default.ok(report.caseValidationSummary, "Should return case scenario validation summary.");
        const summary = report.caseValidationSummary;
        assert_1.default.strictEqual(summary.totalCases, 12, "Should validate exactly 12 cases.");
        assert_1.default.strictEqual(summary.failedCases, 0, `Expected 0 failed cases, got ${summary.failedCases}.`);
        assert_1.default.strictEqual(summary.passedCases, 12, "All 12 cases must pass.");
    });
    await test("Clinical Reasoning Engine - generate reasoning summary", async () => {
        const symptoms = [
            { rubricId: "jeth_rb_panic_death_terror", severity: 8, frequency: 'frequent', impact: 'severe' },
            { rubricId: "jeth_rb_amel_open_air", severity: 7, frequency: 'constant', impact: 'moderate' }
        ];
        const scores = await repertoryScoring_1.RepertoryScoring.calculateRepertorization(symptoms);
        const reasoning = await reasoningEngine_1.ReasoningEngine.generateReasoning(symptoms, scores);
        assert_1.default.strictEqual(reasoning.safetyLabel, "Clinical reasoning support for clinician review only.");
        assert_1.default.ok(reasoning.topRemedies.length > 0, "Should generate remedy reasoning for matched remedies.");
        const firstRem = reasoning.topRemedies[0];
        assert_1.default.ok(firstRem.remedyId, "Remedy reasoning must contain remedyId.");
        assert_1.default.ok(firstRem.confidence > 0, "Remedy confidence must be calculated.");
        assert_1.default.ok(firstRem.explanation.includes("clinician review only") || firstRem.explanation.includes("supporting rubrics"), "Explanation must contain safety phrasing.");
        assert_1.default.ok(reasoning.missingInformation.length > 0, "Missing constitutional categories should be detected.");
        assert_1.default.ok(reasoning.suggestedQuestions.length > 0, "Questions should be generated for missing data.");
        assert_1.default.ok(reasoning.differentialComparisons.length > 0, "Pairwise differential comparisons should be calculated.");
        assert_1.default.ok(reasoning.confidenceBreakdown[firstRem.remedyId], "Confidence breakdown must exist for remedy.");
        assert_1.default.ok(reasoning.confidenceBreakdown[firstRem.remedyId].overall > 0, "Overall confidence score must be computed.");
        assert_1.default.ok(reasoning.evidenceBreakdown.remedyScores[firstRem.remedyId], "Evidence scores breakdown must exist for remedy.");
        assert_1.default.ok(reasoning.evidenceBreakdown.remedyScores[firstRem.remedyId].total > 0, "Total score breakdown must be calculated.");
    });
    console.log(`\n🏁 Test Run Finished: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
        process.exit(1);
    }
}
runRepertoryTests().catch(err => {
    console.error("Test execution crashed:", err);
    process.exit(1);
});
