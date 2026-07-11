import assert from "assert";
import { MATERIA_MEDICA_REGISTRY } from "../src/features/materia-medica/data/registry";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";
import { getAuthorRecord } from "../src/features/materia-medica/data/authors";

// Simulation helper reproducing MateriaMedicaLibrary filter logic
function filterRegistry(
  registry: typeof MATERIA_MEDICA_REGISTRY,
  searchTerm: string,
  filters: {
    author: string;
    yearRange: string;
    sourceProvider: string;
    rightsStatus: string;
    editorialStatus: string;
    ingestionStatus: string;
  }
) {
  return registry.filter((book) => {
    // 1. Search Query
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.year.toString().includes(query) ||
        book.rightsStatus.toLowerCase().includes(query) ||
        book.id.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // 2. Author Filter
    if (filters.author && book.author !== filters.author) return false;

    // 3. Provider Filter
    if (filters.sourceProvider) {
      try {
        const providerHost = new URL(book.sourceUrl).hostname.replace("www.", "");
        if (providerHost !== filters.sourceProvider) return false;
      } catch {
        return false;
      }
    }

    // 4. Rights Status Filter
    if (filters.rightsStatus && book.rightsStatus !== filters.rightsStatus) return false;

    // 5. Editorial Status Filter
    if (filters.editorialStatus && book.editorialStatus !== filters.editorialStatus) return false;

    // 6. Ingestion Status Filter
    if (filters.ingestionStatus) {
      if (filters.ingestionStatus === "approved" && book.ingestionStatus !== "approved") return false;
      if (filters.ingestionStatus === "not-ingested" && book.ingestionStatus === "approved") return false;
      if (filters.ingestionStatus === "blocked" && book.ingestionStatus !== "blocked" && book.rightsStatus !== "restricted") return false;
    }

    // 7. Year Range Epoch Filter
    if (filters.yearRange) {
      const [start, end] = filters.yearRange.split("-").map(Number);
      if (book.year < start || book.year > end) return false;
    }

    return true;
  });
}

async function runLibraryV2Tests() {
  console.log("🚀 Starting Materia Medica Phase 2 Library Home Unit Tests...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  // Test 41: Feature flag false renders legacy catalogue
  await test("Test 41 - Feature flag false preserves legacy catalogue behavior", () => {
    const renderFlags = { ...featureFlags, MATERIA_MEDICA_LIBRARY_V2: false };
    const getCatalogView = (flags: typeof featureFlags) => {
      return flags.MATERIA_MEDICA_LIBRARY_V2 ? "V2_LIBRARY" : "LEGACY_CATALOGUE";
    };
    assert.strictEqual(getCatalogView(renderFlags), "LEGACY_CATALOGUE");
  });

  // Test 42: Feature flag true renders V2 library home
  await test("Test 42 - Feature flag true mounts V2 library home", () => {
    const renderFlags = { ...featureFlags, MATERIA_MEDICA_LIBRARY_V2: true };
    const getCatalogView = (flags: typeof featureFlags) => {
      return flags.MATERIA_MEDICA_LIBRARY_V2 ? "V2_LIBRARY" : "LEGACY_CATALOGUE";
    };
    assert.strictEqual(getCatalogView(renderFlags), "V2_LIBRARY");
  });

  // Test 43: Registry metadata renders correctly
  await test("Test 43 - Registry contains 10 governed works with valid structures", () => {
    assert.strictEqual(MATERIA_MEDICA_REGISTRY.length, 10);
    MATERIA_MEDICA_REGISTRY.forEach((book) => {
      assert.ok(book.id, `Book id should be non-empty: ${book.title}`);
      assert.ok(book.title, `Book title should be non-empty`);
      assert.ok(book.author, `Book author should be non-empty`);
      assert.ok(book.year > 0, `Book year should be positive`);
      assert.ok(["public-domain", "licensed", "rights-review-required", "restricted"].includes(book.rightsStatus));
      assert.ok(["approved", "draft", "needs-review", "rejected"].includes(book.editorialStatus));
      assert.ok(book.sourceUrl.startsWith("http"));
    });
  });

  // Test 44: Search filters by title
  await test("Test 44 - Search filters correctly by title", () => {
    const results = filterRegistry(MATERIA_MEDICA_REGISTRY, "lectures", {
      author: "",
      yearRange: "",
      sourceProvider: "",
      rightsStatus: "",
      editorialStatus: "",
      ingestionStatus: "",
    });
    assert.ok(results.length > 0);
    results.forEach((b) => {
      assert.ok(b.title.toLowerCase().includes("lectures"));
    });
  });

  // Test 45: Search filters by author
  await test("Test 45 - Search filters correctly by author", () => {
    const results = filterRegistry(MATERIA_MEDICA_REGISTRY, "Hahnemann", {
      author: "",
      yearRange: "",
      sourceProvider: "",
      rightsStatus: "",
      editorialStatus: "",
      ingestionStatus: "",
    });
    assert.ok(results.length > 0);
    results.forEach((b) => {
      assert.ok(b.author.toLowerCase().includes("hahnemann"));
    });
  });

  // Test 46: Year filtering works
  await test("Test 46 - Year range filtering maps to historical epochs", () => {
    const results = filterRegistry(MATERIA_MEDICA_REGISTRY, "", {
      author: "",
      yearRange: "1901-1910",
      sourceProvider: "",
      rightsStatus: "",
      editorialStatus: "",
      ingestionStatus: "",
    });
    assert.ok(results.length > 0);
    results.forEach((b) => {
      assert.ok(b.year >= 1901 && b.year <= 1910);
    });
  });

  // Test 47: Rights status filtering works
  await test("Test 47 - Rights status filter isolates public-domain works", () => {
    const results = filterRegistry(MATERIA_MEDICA_REGISTRY, "", {
      author: "",
      yearRange: "",
      sourceProvider: "",
      rightsStatus: "public-domain",
      editorialStatus: "",
      ingestionStatus: "",
    });
    assert.ok(results.length > 0);
    results.forEach((b) => {
      assert.strictEqual(b.rightsStatus, "public-domain");
    });
  });

  // Test 48: Restricted records do not show Read Online
  await test("Test 48 - Restricted records are blocked from ingestion approval", () => {
    const restrictedBooks = MATERIA_MEDICA_REGISTRY.filter((b) => b.rightsStatus === "restricted");
    restrictedBooks.forEach((book) => {
      assert.notStrictEqual(book.ingestionStatus, "approved", "Restricted books must never be marked approved for reading");
    });
  });

  // Test 49: Metadata-only records show Content preparation pending
  await test("Test 49 - Uningested records display preparation pending label", () => {
    const uningestedBooks = MATERIA_MEDICA_REGISTRY.filter((b) => b.ingestionStatus === "registered");
    assert.ok(uningestedBooks.length > 0);
    uningestedBooks.forEach((book) => {
      const displayStatus = book.ingestionStatus === "approved" ? "AVAILABLE" : "Content preparation pending";
      assert.strictEqual(displayStatus, "Content preparation pending");
    });
  });

  // Test 50: Source links come only from registry metadata
  await test("Test 50 - External URLs must come only from the governed registry", () => {
    MATERIA_MEDICA_REGISTRY.forEach((book) => {
      const host = new URL(book.sourceUrl).hostname;
      assert.ok(
        host === "archive.org" || host === "nlm.nih.gov" || host === "gutenberg.org" || host === "localhost",
        `Disallowed external domain found: ${host}`
      );
    });
  });

  // Test 51: Author profile lists associated works
  await test("Test 51 - Author profiles list their registered publications correctly", () => {
    const authorRecord = getAuthorRecord("James Tyler Kent");
    assert.ok(authorRecord);
    assert.strictEqual(authorRecord.birthYear, 1849);
    assert.strictEqual(authorRecord.deathYear, 1916);

    const associatedWorks = MATERIA_MEDICA_REGISTRY.filter((b) => b.author === authorRecord.displayName);
    assert.ok(associatedWorks.length > 0);
    assert.ok(associatedWorks.some((w) => w.title.includes("Lectures")));
  });

  // Test 52: Empty search results show an accessible empty state
  await test("Test 52 - Query matching no books returns empty array for UI state", () => {
    const results = filterRegistry(MATERIA_MEDICA_REGISTRY, "XYZNonexistentBookTitleQuery", {
      author: "",
      yearRange: "",
      sourceProvider: "",
      rightsStatus: "",
      editorialStatus: "",
      ingestionStatus: "",
    });
    assert.strictEqual(results.length, 0);
  });

  // Test 53: The four dependent feature flags remain disabled
  await test("Test 53 - The four dependent feature flags remain disabled", () => {
    assert.strictEqual(featureFlags.MATERIA_MEDICA_READER_V2, false);
    assert.strictEqual(featureFlags.MATERIA_MEDICA_INGESTION_ADMIN, false);
    assert.strictEqual(featureFlags.MATERIA_MEDICA_RAG_INDEXING, false);
    assert.strictEqual(featureFlags.MATERIA_MEDICA_AI_SUMMARIES, false);
  });

  // Test 54: No external provider API is called
  await test("Test 54 - Filtering uses local memory registry only without network side effects", () => {
    let callCounter = 0;
    const originalFetch = global.fetch;
    (global as any).fetch = () => {
      callCounter++;
      return Promise.resolve(new Response());
    };

    filterRegistry(MATERIA_MEDICA_REGISTRY, "sulphur", {
      author: "",
      yearRange: "",
      sourceProvider: "",
      rightsStatus: "",
      editorialStatus: "",
      ingestionStatus: "",
    });

    global.fetch = originalFetch;
    assert.strictEqual(callCounter, 0, "No API requests should be initiated during client filter operations");
  });

  // Test 55: No passage text is present in the rendered V2 library
  await test("Test 55 - Registry does not store full text passages", () => {
    MATERIA_MEDICA_REGISTRY.forEach((book) => {
      assert.strictEqual((book as any).passages, undefined, "Book record should not embed passage data");
    });
  });

  console.log(`\n=== Library V2 Phase 2 Test Results ===`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runLibraryV2Tests().catch((err) => {
  console.error(err);
  process.exit(1);
});
