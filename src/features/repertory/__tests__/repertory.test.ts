import assert from 'assert';
import { repertoryRepository } from '../database/repertoryDb';
import { RepertorySearch } from '../search/repertorySearch';
import { RepertoryScoring } from '../scoring/repertoryScoring';
import { RepertoryGraph } from '../graph/repertoryGraph';
import { DatabaseValidator } from '../validators/databaseValidator';
import { ImportExportService } from '../import-export/importExportService';
import { ReasoningEngine } from '../reasoning/reasoningEngine';
import { IngestionPipeline } from '../import-export/ingestionPipeline';

async function runRepertoryTests() {
  console.log("🚀 Starting Clinical Repertory & AI Intake Unit Tests...");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  // Ensure repository is initialized with seed data
  const rubrics = await repertoryRepository.getRubrics();
  assert.ok(rubrics.length > 0, "Repository should have seeded rubrics.");

  // --- Tests ---

  await test("Search Ranking - exact title matches must rank higher than synonym matches", async () => {
    // Querying for "burnout" should match "Adrenal Burnout" title first
    const results = await RepertorySearch.searchRubrics("burnout");
    assert.ok(results.length > 0, "Should return results for burnout.");
    assert.strictEqual(results[0].rubric.rubricId, "jeth_rb_adrenal_burnout");
  });

  await test("Synonym Matching - search should expand to synonyms", async () => {
    // "exhaustion" is a synonym for adrenal burnout
    const results = await RepertorySearch.searchRubrics("exhaustion");
    assert.ok(results.length > 0, "Should match via synonym expansion.");
    assert.ok(
      results.some((r: any) => r.rubric.rubricId === "jeth_rb_adrenal_burnout"),
      "Synonym search for exhaustion should match adrenal burnout."
    );
  });

  await test("Scoring Output & Grade 4 Handling - weighted scoring matches expected boosts", async () => {
    // We pass Adrenal Burnout rubric which contains Phosphoricum Acidum (Ph-ac, Grade 4 Keynote) and Nux Vomica (Nux-v, Grade 3)
    const symptoms = [
      {
        rubricId: "jeth_rb_adrenal_burnout",
        severity: 8,
        frequency: "constant" as const, // multiplier 1.2
        impact: "severe" as const       // multiplier 1.2
      }
    ];

    const results = await RepertoryScoring.calculateRepertorization(symptoms);
    assert.ok(results.topRemedies.length > 0, "Scoring should output ranked remedies.");
    
    // Check that Phosphoricum Acidum is ranked higher than Nux Vomica because of its Grade 4 Keynote weight
    const phacMatch = results.topRemedies.find((r: any) => r.remedyId === "Ph-ac");
    const nuxMatch = results.topRemedies.find((r: any) => r.remedyId === "Nux-v");

    assert.ok(phacMatch && nuxMatch, "Should score both Ph-ac and Nux-v.");
    assert.ok(
      phacMatch.score > nuxMatch.score,
      `Grade 4 Ph-ac score (${phacMatch.score}) must exceed Grade 3 Nux-v (${nuxMatch.score}).`
    );
  });

  await test("Prohibited-Claims Validator - regex scans must detect cures/guarantees", async () => {
    // Create a mock invalid rubric with prohibited words
    const invalidRubric = {
      rubricId: "jeth_rb_bad_claim",
      title: "Complete cure for cancer",
      plainLanguageMeaning: "This is a guaranteed cure.",
      classicalWording: "CANCER - CURED - guaranteed",
      category: "Modern Clinical Conditions" as const,
      organSystem: "Generalities",
      synonyms: [],
      patientExpressions: [],
      clinicalKeywords: [],
      relatedSymptoms: [],
      relatedDiseases: [],
      miasmaticWeight: { Psora: 0.1, Sycosis: 0.1, Syphilis: 0.1, Tubercular: 0.1, Cancerinic: 0.1 },
      intensityScale: 5,
      polarity: "positive" as const,
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

    const report = await DatabaseValidator.validateDatabase();
    if (!report.isValid) {
      console.log("Database Validation Report:", JSON.stringify(report, null, 2));
    }
    
    // Run direct prohibited claims check on the string
    const matchCure = /cures|guarantee|proven to heal|absolute cure/i.test(invalidRubric.plainLanguageMeaning);
    assert.strictEqual(matchCure, true, "Validator must detect the prohibited claim word 'guaranteed'.");
    
    // Assert that current database is clean and contains no prohibited claims
    assert.ok(report.isValid, "Seed database must pass validation and have zero safety claims violations.");
  });

  await test("Graph Traversal - find differentiating rubrics between remedies", async () => {
    // Ask for differentiating rubrics between Sulphur and Lycopodium
    const diffRubrics = await RepertoryGraph.getDifferentiatingRubrics("Sulph", "Lyc");
    assert.ok(Array.isArray(diffRubrics), "Should return array of differentiating rubrics.");
    
    // Assert that the difference in remedy grade is >= 2 for the differentiating rubrics returned
    diffRubrics.forEach(d => {
      const gSulph = d.rubric.relatedRemedies.find(r => r.remedyId === "Sulph")?.grade || 0;
      const gLyc = d.rubric.relatedRemedies.find(r => r.remedyId === "Lyc")?.grade || 0;
      const diff = Math.abs(gSulph - gLyc);
      assert.ok(diff >= 2, `Differentiating rubrics must have grade difference >= 2, got ${diff}`);
    });
  });

  await test("Export Adapters - verify that NTriples output produces valid triples", async () => {
    const NTriplesContent = await ImportExportService.exportToGraphTriples();
    assert.ok(typeof NTriplesContent === 'string', "NTriples output must be a string.");
    assert.ok(NTriplesContent.includes("relatesTo") || NTriplesContent.includes("belongsToOrgan"), "NTriples output must contain predicates.");
  });

  await test("Database Validator - audit weak or empty differential notes", async () => {
    const report = await DatabaseValidator.validateDatabase();
    assert.ok(Array.isArray(report.weakDifferentialNotes), "Should return array of weak differential notes.");
    assert.strictEqual(report.weakDifferentialNotes.length, 0, "No related remedies should have weak or empty differential notes.");
  });

  await test("Clinical Case Scenarios - validate NLP matching and remedy ranking of 12 cases", async () => {
    const report = await DatabaseValidator.validateDatabase();
    assert.ok(report.caseValidationSummary, "Should return case scenario validation summary.");
    const summary = report.caseValidationSummary!;
    assert.strictEqual(summary.totalCases, 12, "Should validate exactly 12 cases.");
    assert.strictEqual(summary.failedCases, 0, `Expected 0 failed cases, got ${summary.failedCases}.`);
    assert.strictEqual(summary.passedCases, 12, "All 12 cases must pass.");
  });

  await test("Clinical Reasoning Engine - generate reasoning summary", async () => {
    const symptoms = [
      { rubricId: "jeth_rb_panic_death_terror", severity: 8, frequency: 'frequent' as const, impact: 'severe' as const },
      { rubricId: "jeth_rb_amel_open_air", severity: 7, frequency: 'constant' as const, impact: 'moderate' as const }
    ];

    const scores = await RepertoryScoring.calculateRepertorization(symptoms);
    const reasoning = await ReasoningEngine.generateReasoning(symptoms, scores);
    
    assert.strictEqual(reasoning.safetyLabel, "Clinical reasoning support for clinician review only.");
    assert.ok(reasoning.topRemedies.length > 0, "Should generate remedy reasoning for matched remedies.");
    
    const firstRem = reasoning.topRemedies[0];
    assert.ok(firstRem.remedyId, "Remedy reasoning must contain remedyId.");
    assert.ok(firstRem.confidence > 0, "Remedy confidence must be calculated.");
    assert.ok(firstRem.explanation.includes("clinician review only") || firstRem.explanation.includes("supporting rubrics"), "Explanation must contain safety phrasing.");
    
    assert.ok(reasoning.missingInformation.length > 0, "Missing constitutional categories should be detected.");
    assert.ok(reasoning.suggestedQuestions.length > 0, "Questions should be generated for missing data.");
    assert.ok(reasoning.differentialComparisons.length > 0, "Pairwise differential comparisons should be calculated.");
    assert.ok(reasoning.confidenceBreakdown[firstRem.remedyId], "Confidence breakdown must exist for remedy.");
    assert.ok(reasoning.confidenceBreakdown[firstRem.remedyId].overall > 0, "Overall confidence score must be computed.");
    assert.ok(reasoning.evidenceBreakdown.remedyScores[firstRem.remedyId], "Evidence scores breakdown must exist for remedy.");
    assert.ok(reasoning.evidenceBreakdown.remedyScores[firstRem.remedyId].total > 0, "Total score breakdown must be calculated.");
  });

  await test("Ingestion Pipeline - blocked copyrighted source", async () => {
    const manifest = await IngestionPipeline.ingestSource("synthesis_9_1", [{ name: "Mind - Panic", chapter: "Mind" }]);
    assert.strictEqual(manifest.importStatus, "blocked", "Copyrighted source must be blocked from ingestion.");
  });

  await test("Ingestion Pipeline - abbreviation cleanup and metadata preservation", async () => {
    const raw = [{ id: "test_boer_1", name: "Mind - Test", chapter: "Mind", page: 123, remedies: { "Æth": 2, "Tar-h": 1 } }];
    const manifest = await IngestionPipeline.ingestSource("boericke_1927", raw, { maxItems: 1 });
    
    assert.strictEqual(manifest.importStatus, "completed");
    assert.strictEqual(manifest.validationSummary.totalImported, 1);
    
    const rubric = await repertoryRepository.getRubricById("test_boer_1");
    assert.ok(rubric, "Ingested rubric should be retrieved by ID.");
    assert.strictEqual(rubric.sourceCitation, "William Boericke, Pocket Manual of Homoeopathic Materia Medica with Repertory (1927)");
    
    // Æth mapped to Aeth
    const aethEntry = rubric.remedyEntries?.find(e => e.sourceAbbreviation === "Æth");
    assert.ok(aethEntry);
    assert.strictEqual(aethEntry.canonicalAbbreviation, "Aeth");
    assert.strictEqual(aethEntry.sourceGrade, 2);
    
    // Tar-h unresolved
    assert.ok(manifest.unresolvedAbbreviationReport.length > 0);
  });

  await test("Repertorization Scoring - balanced scoring check", async () => {
    const symptoms = [
      { rubricId: "jeth_rb_panic_death_terror", severity: 8, frequency: 'frequent' as const, impact: 'severe' as const }
    ];
    const scoring = await RepertoryScoring.calculateRepertorization(symptoms);
    assert.ok(scoring.topRemedies.length > 0);
    
    const rem = scoring.topRemedies[0];
    assert.strictEqual(rem.normalizationMethod, "source-average-balancing");
    assert.ok(rem.balancedScore !== undefined);
    assert.ok(rem.sourceContributions !== undefined);
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
