import assert from "assert";
import { KmsKnowledgeEntity } from "../types";
import { runQualityGateChecks } from "../validation/qualityGates";
import { detectDuplicateEntities } from "../validation/duplicateDetector";
import { getRelationshipSuggestions } from "../validation/relationshipSuggestions";
import { computeEntityDiff } from "../adapters/diff";
import { exportEntities } from "../adapters/importExport";

async function runKmsTests() {
  console.log("🚀 Starting Clinical KMS Unit Tests...");
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

  const createLocalText = (en: string) => ({
    en,
    hi: "",
    gu: "",
    mr: "",
    es: "",
    ar: ""
  });

  // Mock base entity template
  const createMockEntity = (overrides: Partial<KmsKnowledgeEntity> = {}): KmsKnowledgeEntity => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    return {
      id: "DIS-gerd",
      slug: "gerd",
      entityType: "disease",
      title: createLocalText("Gastroesophageal Reflux Disease"),
      summary: createLocalText("Clinical description of gastric acid backflow."),
      relatedEntities: [],
      lastReviewed: "2026-06-30T12:00:00Z",
      lastUpdated: "2026-06-30T12:00:00Z",
      author: { name: "Dr. Narayan Jethwani" },
      reviewer: { name: "Dr. Narayan Jethwani", credentials: "MD (Hom)", specialty: "Internal Med" },
      evidenceLevel: "Level-B",
      tags: ["digestive"],
      canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gerd",
      editorialStatus: "draft",
      editorialNotes: "Keep this internal comment private.",
      nextReviewDate: nextYear.toISOString(),
      versionInfo: {
        version: "1.0.0",
        created: "2026-06-30T12:00:00Z",
        updated: "2026-06-30T12:00:00Z",
        reviewed: "2026-06-30T12:00:00Z",
        changelog: []
      },
      readabilityScore: { score: 85, readingLevel: "Patient Friendly", readingTimeMinutes: 2 },
      seoGeoScores: { seoScore: 90, geoScore: 85, aiReadinessScore: 88 },
      ...overrides
    };
  };

  // --- Tests ---

  await test("runQualityGateChecks - pass valid published article config", () => {
    const entity = createMockEntity({ 
      editorialStatus: "published",
      content: {
        references: ["CIT-001"],
        safetyWarnings: createLocalText("Please consult with a doctor.")
      }
    });
    const check = runQualityGateChecks(entity, []);
    assert.strictEqual(check.passed, true);
    assert.strictEqual(check.score, 100);
  });

  await test("runQualityGateChecks - fail if canonical URL does not match entity slug structure", () => {
    const entity = createMockEntity({ 
      slug: "reflux", 
      canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gerd", 
      editorialStatus: "published" 
    });
    const check = runQualityGateChecks(entity, []);
    assert.strictEqual(check.passed, false);
    assert.ok(check.issues.some((i: any) => i.rule === "CANONICAL_URL"));
  });

  await test("runQualityGateChecks - block publishing if prohibited claims exist", () => {
    const entity = createMockEntity({ 
      title: createLocalText("Gastroesophageal Reflux Disease 100% cure and guaranteed cure"),
      editorialStatus: "published"
    });
    const check = runQualityGateChecks(entity, []);
    assert.strictEqual(check.passed, false);
    assert.ok(check.prohibitedClaimsFound.includes("100% cure"));
    assert.ok(check.prohibitedClaimsFound.includes("guaranteed cure"));
  });

  await test("runQualityGateChecks - flag broken relationships", () => {
    const entity = createMockEntity({
      relatedEntities: ["SYM-missing-id"],
      editorialStatus: "published"
    });
    const check = runQualityGateChecks(entity, []);
    assert.strictEqual(check.passed, false);
    assert.ok(check.issues.some((i: any) => i.rule === "BROKEN_RELATION"));
  });

  await test("detectDuplicateEntities - flag exact slug match in pool", () => {
    const target = createMockEntity({ id: "DIS-acid-reflux", slug: "gerd" });
    const pool = [createMockEntity({ id: "DIS-gerd", slug: "gerd" })];
    const warnings = detectDuplicateEntities(target, pool);
    assert.ok(warnings.length > 0);
    assert.strictEqual(warnings[0].reason, "slug_match");
  });

  await test("detectDuplicateEntities - flag high Jaccard title similarity", () => {
    const target = createMockEntity({ 
      id: "DIS-new-acid", 
      slug: "reflux-disease", 
      title: createLocalText("Gastroesophageal Reflux Pathology")
    });
    const pool = [createMockEntity({ id: "DIS-gerd", slug: "gerd", title: createLocalText("Gastroesophageal Reflux Disease") })];
    const warnings = detectDuplicateEntities(target, pool);
    assert.ok(warnings.length > 0);
    assert.strictEqual(warnings[0].reason, "title_similarity");
  });

  await test("getRelationshipSuggestions - suggest indicated remedies", () => {
    const entity = createMockEntity({ id: "DIS-gerd", title: createLocalText("Gastroesophageal Reflux Disease (GERD)") });
    const pool = [
      createMockEntity({ id: "REM-nux-vomica", slug: "nux-vomica", entityType: "remedy", title: createLocalText("Nux Vomica") })
    ];
    const suggestions = getRelationshipSuggestions(entity, pool);
    assert.strictEqual(suggestions.length, 1);
    assert.strictEqual(suggestions[0].entityId, "REM-nux-vomica");
  });

  await test("computeEntityDiff - highlight differences in tags", () => {
    const v1 = createMockEntity({ tags: ["reflux"] });
    const v2 = createMockEntity({ tags: ["reflux", "digestive"] });
    const diffs = computeEntityDiff(v1, v2);
    assert.ok(diffs.tags);
    assert.ok(diffs.tags.some((l: any) => l.type === "added"));
  });

  await test("exportEntities - filter out private notes", () => {
    const entity = createMockEntity({ editorialNotes: "Private reviewer comment." });
    const data = exportEntities([entity], { format: "json", includeInternalNotes: false });
    const parsed = JSON.parse(data);
    assert.strictEqual(parsed[0].editorialNotes, "");
  });

  await test("exportEntities - retain private notes if override is true", () => {
    const entity = createMockEntity({ editorialNotes: "Private reviewer comment." });
    const data = exportEntities([entity], { format: "json", includeInternalNotes: true });
    const parsed = JSON.parse(data);
    assert.strictEqual(parsed[0].editorialNotes, "Private reviewer comment.");
  });

  console.log(`\n=== KMS Suite Summary: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runKmsTests().catch(err => {
  console.error(err);
  process.exit(1);
});
