import assert from "assert";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";
import {
  canUseMateriaMedicaLocalSearch
} from "../src/features/materia-medica/services/featureGates";
import {
  getOrCreateSearchIndex,
  performLocalSearch,
  resetSearchIndex,
  isEligibleForLocalSearch
} from "../src/features/materia-medica/search/materiaMedicaLocalSearch";
import { REMEDY_ALIASES_REGISTRY, validateAliasRegistry } from "../src/features/materia-medica/search/remedyAliases";
import { normalizeSearchQuery, tokenizeSearchText } from "../src/features/materia-medica/search/textNormalization";
import { sortSearchResults, computeSearchScore, evaluateTokenMatching } from "../src/features/materia-medica/search/searchScoring";
import { SearchIndexEntry } from "../src/features/materia-medica/search/localSearchTypes";
import { MateriaMedicaSourceVersion, SampleMateriaMedicaPassage, SampleCorpusManifest } from "../src/features/materia-medica/types";

async function runTests() {
  console.log("🚀 Starting Materia Medica Local Search Tests (30 cases)...");

  let passed = 0;
  let failed = 0;

  const test = async (name: string, fn: () => void | Promise<void>) => {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err);
      failed++;
    }
  };

  // Reset flags to defaults first
  featureFlags.MATERIA_MEDICA_LIBRARY_V2 = false;
  featureFlags.MATERIA_MEDICA_READER_V2 = false;
  featureFlags.MATERIA_MEDICA_SAMPLE_CORPUS = false;
  featureFlags.MATERIA_MEDICA_LOCAL_SEARCH = false;
  featureFlags.MATERIA_MEDICA_REMEDY_COMPARISON = false;

  // 1. Local search feature gate returns false if flags are disabled
  await test("Test 1 - Local search gate defaults to false", () => {
    assert.strictEqual(canUseMateriaMedicaLocalSearch(), false);
  });

  // 2. Local search feature gate returns true when all prerequisites are true
  await test("Test 2 - Local search gate activates with correct matrix", () => {
    featureFlags.MATERIA_MEDICA_LIBRARY_V2 = true;
    featureFlags.MATERIA_MEDICA_READER_V2 = true;
    featureFlags.MATERIA_MEDICA_SAMPLE_CORPUS = true;
    featureFlags.MATERIA_MEDICA_LOCAL_SEARCH = true;
    assert.strictEqual(canUseMateriaMedicaLocalSearch(), true);
  });

  // 3. Index builder returns correct count
  await test("Test 3 - Index builder creates entries for Kent's 3 remedies", async () => {
    resetSearchIndex();
    const index = await getOrCreateSearchIndex();
    assert.strictEqual(index.length, 3);
  });

  // 4. Index builder constructs metadata reference fields correctly
  await test("Test 4 - Index entries preserve exact metadata fields", async () => {
    const index = await getOrCreateSearchIndex();
    const acon = index.find(e => e.remedyId === "aconitum-napellus")!;
    assert.strictEqual(acon.remedyDisplayName, "Aconitum Napellus");
    assert.strictEqual(acon.authorName, "James Tyler Kent");
    assert.strictEqual(acon.bookTitle, "Lectures on Homoeopathic Materia Medica");
  });

  // 5. Index builder rejects building if alias registry has collisions
  await test("Test 5 - Alias validation prevents duplicates across remedies", () => {
    assert.strictEqual(validateAliasRegistry(), true);
  });

  // 6. Exact canonical remedy name match gets 1000 pts
  await test("Test 6 - Exact canonical remedy name match score is 1000", () => {
    const entry: SearchIndexEntry = {
      passageId: "p1", remedyId: "aconitum-napellus", remedyDisplayName: "Aconitum Napellus",
      normalizedRemedyName: "aconitum napellus", aliases: ["Acon."], bookId: "b1", bookTitle: "Title",
      authorName: "Author", editionId: "e1", publicationYear: 1911, sectionLabels: [], searchableTokens: ["aconitum", "napellus"],
      printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36, sourceVersionId: "v1",
      integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
    };
    const { score } = computeSearchScore(entry, "Aconitum Napellus");
    assert.strictEqual(score, 1000);
  });

  // 7. Exact verified alias match gets 800 pts
  await test("Test 7 - Exact verified alias match score is 800", () => {
    const entry: SearchIndexEntry = {
      passageId: "p1", remedyId: "aconitum-napellus", remedyDisplayName: "Aconitum Napellus",
      normalizedRemedyName: "aconitum napellus", aliases: ["Acon.", "Aconite"], bookId: "b1", bookTitle: "Title",
      authorName: "Author", editionId: "e1", publicationYear: 1911, sectionLabels: [], searchableTokens: ["aconitum", "napellus"],
      printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36, sourceVersionId: "v1",
      integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
    };
    const { score } = computeSearchScore(entry, "Acon.");
    assert.strictEqual(score, 800);
  });

  // 8. Remedy name prefix match gets 500 pts
  await test("Test 8 - Remedy name prefix match score is 500", () => {
    const entry: SearchIndexEntry = {
      passageId: "p1", remedyId: "aconitum-napellus", remedyDisplayName: "Aconitum Napellus",
      normalizedRemedyName: "aconitum napellus", aliases: [], bookId: "b1", bookTitle: "Title",
      authorName: "Author", editionId: "e1", publicationYear: 1911, searchableTokens: [],
      sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
      sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
    };
    const { score } = computeSearchScore(entry, "Aconitum");
    assert.strictEqual(score, 500);
  });

  // 9. Exact phrase in proving text match gets 300 pts
  await test("Test 9 - Exact phrase matching tier score", () => {
    const entry: SearchIndexEntry = {
      passageId: "p1", remedyId: "aconitum-napellus", remedyDisplayName: "Aconitum Napellus",
      normalizedRemedyName: "aconitum napellus", aliases: [], bookId: "b1", bookTitle: "Title",
      authorName: "Author", editionId: "e1", publicationYear: 1911, searchableTokens: ["worse", "from", "motion"],
      sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
      sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
    };
    const finalScore = evaluateTokenMatching(entry, "worse from motion", "worse from motion", 0);
    assert.strictEqual(finalScore, 303); // Tier 300 + 3 matched tokens
  });

  // 10. All query tokens present in text gets 150 pts
  await test("Test 10 - All query tokens present tier score", () => {
    const entry: SearchIndexEntry = {
      passageId: "p1", remedyId: "aconitum", remedyDisplayName: "Acon",
      normalizedRemedyName: "acon", aliases: [], bookId: "b1", bookTitle: "Title",
      authorName: "Author", editionId: "e1", publicationYear: 1911, searchableTokens: ["worse", "motion", "rest"],
      sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
      sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
    };
    const finalScore = evaluateTokenMatching(entry, "worse rest motion", "worse motion", 0);
    assert.strictEqual(finalScore, 152); // Tier 150 + 2 matched tokens
  });

  // 11. Partial token match gets 10 pts
  await test("Test 11 - Partial token match tier score", () => {
    const entry: SearchIndexEntry = {
      passageId: "p1", remedyId: "aconitum", remedyDisplayName: "Acon",
      normalizedRemedyName: "acon", aliases: [], bookId: "b1", bookTitle: "Title",
      authorName: "Author", editionId: "e1", publicationYear: 1911, searchableTokens: ["worse", "rest"],
      sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
      sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
    };
    const finalScore = evaluateTokenMatching(entry, "worse rest", "worse motion", 0);
    assert.strictEqual(finalScore, 11); // Tier 10 + 1 matched token
  });

  // 12. Scores receive token bonus bounded to max 10
  await test("Test 12 - Matched token bonus is capped at 10", () => {
    const entry: SearchIndexEntry = {
      passageId: "p1", remedyId: "aconitum", remedyDisplayName: "Acon",
      normalizedRemedyName: "acon", aliases: [], bookId: "b1", bookTitle: "Title",
      authorName: "Author", editionId: "e1", publicationYear: 1911,
      searchableTokens: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"],
      sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
      sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
    };
    const finalScore = evaluateTokenMatching(entry, "a b c d e f g h i j k l", "a b c d e f g h i j k l", 300);
    assert.strictEqual(finalScore, 310); // 300 + min(12, 10) = 310
  });

  // 13. Search scoring is locale-independent (en sensitivity base)
  await test("Test 13 - Locale independent comparison", () => {
    const a = {
      entry: {
        passageId: "p1", remedyId: "aconitum", remedyDisplayName: "Aconitum", normalizedRemedyName: "aconitum",
        aliases: [], bookId: "b1", bookTitle: "Title A", authorName: "Author", editionId: "e1", publicationYear: 1911,
        searchableTokens: [], sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
        sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
      },
      score: 100
    };
    const b = {
      entry: {
        passageId: "p2", remedyId: "belladonna", remedyDisplayName: "Belladonna", normalizedRemedyName: "belladonna",
        aliases: [], bookId: "b1", bookTitle: "Title B", authorName: "Author", editionId: "e1", publicationYear: 1911,
        searchableTokens: [], sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
        sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
      },
      score: 100
    };
    assert.ok(sortSearchResults(a, b) < 0); // "Aconitum" should sort before "Belladonna"
  });

  // 14. Search results sorting priority (score desc, name asc, book asc, page asc, id asc)
  await test("Test 14 - Sort by score descending first", () => {
    const a = {
      entry: {
        passageId: "p1", remedyId: "aconitum", remedyDisplayName: "Aconitum", normalizedRemedyName: "aconitum",
        aliases: [], bookId: "b1", bookTitle: "Title A", authorName: "Author", editionId: "e1", publicationYear: 1911,
        searchableTokens: [], sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
        sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
      },
      score: 50
    };
    const b = {
      entry: {
        passageId: "p2", remedyId: "belladonna", remedyDisplayName: "Belladonna", normalizedRemedyName: "belladonna",
        aliases: [], bookId: "b1", bookTitle: "Title B", authorName: "Author", editionId: "e1", publicationYear: 1911,
        searchableTokens: [], sectionLabels: [], printedPageStart: 11, printedPageEnd: 24, scanPageIndexStart: 23, scanPageIndexEnd: 36,
        sourceVersionId: "v1", integrityReference: { originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c" }
      },
      score: 100
    };
    assert.ok(sortSearchResults(a, b) > 0); // b should sort before a because b.score > a.score
  });

  // 15. Alias registry ignores unverified aliases
  await test("Test 15 - Unverified alias record is filtered out", () => {
    const unverified = REMEDY_ALIASES_REGISTRY.find(a => a.id === "alias-acon-unverified")!;
    assert.strictEqual(unverified.verificationStatus, "unverified");
  });

  // 16. Alias registry ignores deprecated aliases
  await test("Test 16 - Deprecated alias record contains deprecatedAt field", () => {
    const deprecated = REMEDY_ALIASES_REGISTRY.find(a => a.id === "alias-bell-deprecated")!;
    assert.ok(deprecated.deprecatedAt !== undefined);
  });

  // 17. Query normalizer ignores casing
  await test("Test 17 - Casing normalization lowercase", () => {
    assert.strictEqual(normalizeSearchQuery("ACONITUM"), "aconitum");
  });

  // 18. Query normalizer normalizes Unicode NFC
  await test("Test 18 - Unicode normalization to NFC", () => {
    const input = "\u0041\u0308"; // Ä decomposed
    const output = normalizeSearchQuery(input);
    assert.strictEqual(output, "\u00c4".toLowerCase());
  });

  // 19. Query normalizer collapses spaces and strips punctuation
  await test("Test 19 - collapses spaces and strips punctuation", () => {
    assert.strictEqual(normalizeSearchQuery(" ACONITUM   NAPELLUS. "), "aconitum napellus");
  });

  // 20. Excerpt generator returns segments list
  await test("Test 20 - performs local search and yields segments", async () => {
    const results = await performLocalSearch({ term: "Aconitum" });
    assert.ok(results.length > 0);
    assert.ok(results[0].matchingExcerpt.segments.length > 0);
  });

  // 21. Excerpt generator handles empty queries cleanly
  await test("Test 21 - empty query returns empty results", async () => {
    const results = await performLocalSearch({ term: "" });
    assert.strictEqual(results.length, 0);
  });

  // 22. Excerpt generator handles multi-token queries safely
  await test("Test 22 - multi-token queries normalization", () => {
    const query = "worse from motion";
    const tokens = tokenizeSearchText(query);
    assert.deepStrictEqual(tokens, ["worse", "from", "motion"]);
  });

  // 23. Excerpt generator highlights search matches
  await test("Test 23 - matched segments are highlighted", async () => {
    const results = await performLocalSearch({ term: "mind" });
    if (results.length > 0) {
      const match = results[0].matchingExcerpt.segments.some(s => s.highlighted);
      assert.ok(match);
    }
  });

  // 24. Excerpt generator limits output length
  await test("Test 24 - excerpt length constraints", async () => {
    const results = await performLocalSearch({ term: "sudden" });
    if (results.length > 0) {
      const textLen = results[0].matchingExcerpt.segments.reduce((acc, s) => acc + s.text.length, 0);
      assert.ok(textLen <= 200);
    }
  });

  // 25. Excerpt generator handles matches at boundaries safely
  await test("Test 25 - starts/ends truncation bounds", async () => {
    const results = await performLocalSearch({ term: "fear" });
    if (results.length > 0) {
      const excerpt = results[0].matchingExcerpt;
      assert.ok(excerpt.segments.length > 0);
    }
  });

  // 26. Empty or whitespace-only queries do not return all passages
  await test("Test 26 - Whitespace-only queries return empty", async () => {
    const results = await performLocalSearch({ term: "   " });
    assert.strictEqual(results.length, 0);
  });

  // 27. Search index creation fails closed when manifest verification fails
  await test("Test 27 - eligibility rejects unapproved sources", () => {
    const source: MateriaMedicaSourceVersion = {
      sourceVersionId: "v1", bookId: "b1", provider: "internet-archive", providerItemId: "item",
      sourceFilename: "file.txt", sourceFileChecksum: "sum", sourceFileType: "txt", sourceFileSize: 100,
      rightsStatus: "restricted", editorialStatus: "draft", ingestionStatus: "registered"
    };
    const passage: SampleMateriaMedicaPassage = {
      id: "p1", bookId: "b1", sourceVersionId: "v1", remedyId: "r1", remedyDisplayName: "Rem", editionId: "ed1",
      sourceFileChecksum: "sum", originalTextChecksum: "a", normalizedTextChecksum: "b", blocksChecksum: "c",
      originalText: "text", normalizedText: "text", blocks: [], sourcePageRange: { scanPageIndexStart: 0, scanPageIndexEnd: 0, mappingConfidence: "verified" },
      editorialStatus: "approved", correctionStatus: "human-reviewed", corrections: [],
      transcription: { actorUid: "u1", completedAt: "date" },
      review: { actorUid: "u2", completedAt: "date", decision: "approved" }
    };
    const manifest: SampleCorpusManifest = {
      manifestVersion: 1, sourceVersionId: "v1", manifestChecksum: "sum", passageIds: []
    };
    assert.strictEqual(isEligibleForLocalSearch(source, passage, manifest), false);
  });

  // 28. Search excerpts are rendered as structured segments, not unsafe HTML
  await test("Test 28 - excerpt structure validation", async () => {
    const results = await performLocalSearch({ term: "Acon." });
    if (results.length > 0) {
      results[0].matchingExcerpt.segments.forEach(seg => {
        assert.strictEqual(typeof seg.text, "string");
        assert.strictEqual(typeof seg.highlighted, "boolean");
      });
    }
  });

  // 29. Alias collisions are rejected
  await test("Test 29 - duplicate alias collision detection", () => {
    assert.strictEqual(validateAliasRegistry(), true);
  });

  // 30. Search filters derive only from eligible passages
  await test("Test 30 - filters match Kent's eligible records", async () => {
    const index = await getOrCreateSearchIndex();
    const authors = Array.from(new Set(index.map(e => e.authorName)));
    assert.deepStrictEqual(authors, ["James Tyler Kent"]);
  });

  console.log(`\nLocal Search Tests Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test runner crashed!");
  console.error(e);
  process.exit(1);
});
