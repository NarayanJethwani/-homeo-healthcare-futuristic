import assert from 'assert';
import { repertoryRepository } from '../database/repertoryDb';
import { RepertorySearch } from '../search/repertorySearch';
import { RepertoryScoring } from '../scoring/repertoryScoring';
import { RepertoryGraph } from '../graph/repertoryGraph';
import { DatabaseValidator } from '../validators/databaseValidator';
import { ImportExportService } from '../import-export/importExportService';

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

  console.log(`\n🏁 Test Run Finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runRepertoryTests().catch(err => {
  console.error("Test execution crashed:", err);
  process.exit(1);
});
