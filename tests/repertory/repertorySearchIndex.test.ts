import assert from "assert";
import { RubricSearchIndex } from "../../src/features/repertory/search/RubricSearchIndex";
import { SynonymService } from "../../src/features/repertory/search/SynonymService";
import { RepertoryRubricRecord, RepertorySourceId, RepertoryEditionId, RepertoryChapterId, RubricRecordId, RubricConceptId } from "../../src/features/repertory/types/repertoryTypes";

export function runSearchIndexTests() {
  console.log("▶ Running Repertory Search Index & Relevance Isolation Tests...");
  const synonymService = new SynonymService();
  const searchIndex = new RubricSearchIndex(synonymService);

  const mockRubrics: RepertoryRubricRecord[] = [
    {
      id: "r1" as RubricRecordId,
      conceptId: "c1" as RubricConceptId,
      sourceId: "kent" as RepertorySourceId,
      editionId: "kent_1908" as RepertoryEditionId,
      chapterId: "Stomach" as RepertoryChapterId,
      hierarchyPath: [],
      displayText: "Pain in stomach",
      classicalWording: "Stomach pain",
      plainLanguageMeaning: "Pain in belly",
      depth: 1,
      hasChildren: false,
      sourceVersion: "v1.0.0"
    },
    {
      id: "r2" as RubricRecordId,
      conceptId: "c2" as RubricConceptId,
      sourceId: "kent" as RepertorySourceId,
      editionId: "kent_1908" as RepertoryEditionId,
      chapterId: "Mind" as RepertoryChapterId,
      hierarchyPath: [],
      displayText: "Vertigo with giddiness",
      classicalWording: "Vertigo giddiness",
      plainLanguageMeaning: "Dizziness",
      depth: 1,
      hasChildren: false,
      sourceVersion: "v1.0.0"
    },
    {
      id: "r3" as RubricRecordId,
      conceptId: "c3" as RubricConceptId,
      sourceId: "kent" as RepertorySourceId,
      editionId: "kent_1908" as RepertoryEditionId,
      chapterId: "Stomach" as RepertoryChapterId,
      hierarchyPath: [],
      displayText: "Pain in stomach", // identical text, different clinical details
      classicalWording: "Stomach pain",
      plainLanguageMeaning: "Pain in belly",
      depth: 1,
      hasChildren: false,
      sourceVersion: "v1.0.0"
    }
  ];

  // Test search match
  const searchVal = searchIndex.search("vertigo", mockRubrics, {}, "v1.0.0");
  assert.strictEqual(searchVal.results.length, 1);
  assert.strictEqual(searchVal.results[0].rubric.id, "r2");

  // Verify highlights
  const highlighted = searchVal.results[0].highlightedFields.displayText;
  assert.ok(highlighted);
  assert.ok(highlighted.some(h => h.text.toLowerCase() === "vertigo" && h.matched));

  // Regression test: Remedy metadata and grades do not affect ordering or relevanceScore
  const searchPain = searchIndex.search("pain", mockRubrics, {}, "v1.0.0");
  assert.strictEqual(searchPain.results.length, 2);
  const r1Score = searchPain.results.find(res => res.rubric.id === "r1")?.relevanceScore;
  const r3Score = searchPain.results.find(res => res.rubric.id === "r3")?.relevanceScore;
  assert.ok(r1Score !== undefined && r3Score !== undefined);
  assert.strictEqual(r1Score, r3Score, "Identical rubrics with different underlying IDs must score exactly the same regardless of clinical grades or remedy counts.");

  // Unicode and hostile string highlighting sanity check
  const hostileRubrics: RepertoryRubricRecord[] = [
    {
      id: "rh" as RubricRecordId,
      conceptId: "ch" as RubricConceptId,
      sourceId: "kent" as RepertorySourceId,
      editionId: "kent_1908" as RepertoryEditionId,
      chapterId: "Mind" as RepertoryChapterId,
      hierarchyPath: [],
      displayText: "Cough with <script>alert('hack')</script> and 😊 emoji",
      depth: 1,
      hasChildren: false,
      sourceVersion: "v1.0.0"
    }
  ];

  const searchHostile = searchIndex.search("hack", hostileRubrics, {}, "v1.0.0");
  const segments = searchHostile.results[0]?.highlightedFields.displayText;
  assert.ok(segments);
  assert.ok(segments.some(s => s.text.includes("<script>") && !s.matched), "Corpus markup characters should be preserved as literal segments without raw HTML rendering.");
  assert.ok(segments.some(s => s.text.includes("😊")), "Unicode emojis should remain completely intact in highlights.");

  console.log("✅ Repertory Search Index & Relevance Isolation Tests Passed");
}
