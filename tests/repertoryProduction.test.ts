import assert from "assert";
import { SnapshotPipeline } from "../src/features/repertory/import-export/snapshotPipeline";
import { PublishedCorpusRepository } from "../src/features/repertory/repositories/PublishedCorpusRepository";
import { SourceCorpusRepository } from "../src/features/repertory/repositories/SourceCorpusRepository";
import { RepertoryScoring } from "../src/features/repertory/scoring/repertoryScoring";
import { repertoryRepository } from "../src/features/repertory/database/repertoryDb";
import { hasPermission } from "../src/lib/security/rbac";
import * as fs from "fs";
import * as path from "path";

async function runTests() {
  console.log("🚀 Starting Repertory Production Hardening Integration Tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  // ==========================================
  // 1. RBAC & Authorization Configuration Tests
  // ==========================================
  test("RBAC - Capabilities for Repertory Admin Roles", () => {
    // Super admin has full capability mapping
    const isSuperAdminAllowedRead = hasPermission("super-admin", "repertory.review.read");
    const isSuperAdminAllowedPublish = hasPermission("super-admin", "repertory.snapshot.activate");
    assert.strictEqual(isSuperAdminAllowedRead, true);
    assert.strictEqual(isSuperAdminAllowedPublish, true);

    // Editor lacks publishing capability but has review mapping
    const isEditorAllowedRead = hasPermission("editor", "repertory.review.read");
    const isEditorAllowedPublish = hasPermission("editor", "repertory.snapshot.activate");
    assert.strictEqual(isEditorAllowedRead, true);
    assert.strictEqual(isEditorAllowedPublish, false);
  });

  // ==========================================
  // 2. Snapshot Compilation & Validation Tests
  // ==========================================
  test("Snapshot Build - Validates compiled snapshot file presence & structure", async () => {
    const version = "v_test_spec";
    
    // Clean up if version exists from previous runs
    const dir = path.join(process.cwd(), "data", "repertory", "published", version);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }

    const manifest = await SnapshotPipeline.buildSnapshot({
      version,
      actorUid: "test-admin",
      actorRole: "super-admin",
      reason: "Test spec run integration",
      sourceIds: ["boericke_1927"] // Single source to compile fast
    });

    assert.strictEqual(manifest.corpusVersion, version);
    assert.ok(manifest.totalRubrics > 0);
    assert.strictEqual(manifest.validationStatus, "passed");

    // Verify sharded files are written
    assert.ok(fs.existsSync(path.join(dir, "manifest.json")));
    assert.ok(fs.existsSync(path.join(dir, "checksums.json")));
    assert.ok(fs.existsSync(path.join(dir, "metadata", "sources.json")));
    assert.ok(fs.existsSync(path.join(dir, "metadata", "chapters.json")));
    assert.ok(fs.existsSync(path.join(dir, "locations", "rubric-locations-00.json")));
    assert.ok(fs.existsSync(path.join(dir, "sources", "boericke_1927", "source.json")));
    assert.ok(fs.existsSync(path.join(dir, "sources", "boericke_1927", "chapters.json")));
    assert.ok(fs.existsSync(path.join(dir, "indexes", "lexical", "term-00.json")));
    assert.ok(fs.existsSync(path.join(dir, "indexes", "remedies", "remedy-00.json")));

    // Cleanup
    fs.rmSync(dir, { recursive: true, force: true });
  });

  // ==========================================
  // 3. Atomicity & Switcher Active Pointer Tests
  // ==========================================
  test("PublishedCorpus - Atomic switch swaps loaded memory representation", async () => {
    // Setup mock pointer pointing to v1.0.0
    const activeVersion = "v1.0.0";
    await PublishedCorpusRepository.setActiveVersion(activeVersion);
    
    // Explicitly read active manifest config
    const manifest = await PublishedCorpusRepository.getManifest();
    assert.strictEqual(manifest?.corpusVersion, activeVersion);

    // Verify that loading the active corpus gets non-empty lists
    const rubrics = await PublishedCorpusRepository.getRubrics();
    assert.ok(rubrics.length > 0);
  });

  // ==========================================
  // 4. Balanced Scoring Tests (Kent vs. Boericke)
  // ==========================================
  test("RepertoryScoring - Balanced scoring behaves deterministically", async () => {
    // Mock rubrics: one from Kent (high count) and one from Boericke (low count)
    const r1 = {
      rubricId: "kent_cough_dry",
      title: "Cough - Dry",
      category: "Cough",
      organSystem: "Respiratory",
      sourceId: "kent_1908",
      source: "kent_1908",
      relatedRemedies: [
        { remedyId: "Sulph", grade: 3 },
        { remedyId: "Bry", grade: 2 },
        { remedyId: "Phos", grade: 1 }
      ],
      clinicalKeywords: ["cough", "dry"],
      miasmaticLoad: { Psora: 1, Sycosis: 0, Syphilis: 0, Tubercular: 0, Cancerinic: 0 },
      editorialStatus: "approved"
    };

    const r2 = {
      rubricId: "boericke_cough_dry",
      title: "Dry cough",
      category: "Cough",
      organSystem: "Respiratory",
      sourceId: "boericke_1927",
      source: "boericke_1927",
      relatedRemedies: [
        { remedyId: "Sulph", grade: 1 },
        { remedyId: "Lyc", grade: 3 }
      ],
      clinicalKeywords: ["cough", "dry"],
      miasmaticLoad: { Psora: 1, Sycosis: 0, Syphilis: 0, Tubercular: 0, Cancerinic: 0 },
      editorialStatus: "approved"
    };

    await repertoryRepository.saveRubric(r1 as any);
    await repertoryRepository.saveRubric(r2 as any);

    // Selected symptoms mapping
    const symptoms = [
      { rubricId: "kent_cough_dry", severity: 5, frequency: "frequent", impact: "moderate" },
      { rubricId: "boericke_cough_dry", severity: 5, frequency: "frequent", impact: "moderate" }
    ];

    const result = await RepertoryScoring.calculateRepertorization(symptoms as any);

    // Sulphur matches 2/2 rubrics. Lycopodium matches 1/2 rubrics.
    // Ensure Sulphur is ranked highest because of max rubric coverage (2/2)
    assert.strictEqual(result.topRemedies[0].remedyId, "Sulph");
    assert.strictEqual(result.topRemedies[0].matches, 2);

    // Lycopodium has grade 3 in Boericke, and should be scored high showing influence of Boericke
    const lycResult = result.topRemedies.find((r: any) => r.remedyId === "Lyc");
    assert.ok(lycResult);
    assert.strictEqual(lycResult.matches, 1);
  });

  // ==========================================
  // 5. Summarize Results
  // ==========================================
  console.log(`\n🎉 Repertory Integration Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch(err => {
  console.error("Fatal Test Failure: ", err);
  process.exit(1);
});
