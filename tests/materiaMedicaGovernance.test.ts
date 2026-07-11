import assert from "assert";
import { 
  MateriaMedicaBook, 
  MateriaMedicaPassage, 
  isPassageRagEligible, 
  licenseAllowsAiRetrieval, 
  isValidTransition, 
  blockRecoveryState, 
  updateBookMetadata 
} from "../src/features/materia-medica/types";
import { GET } from "../src/app/api/materia-medica/route";

async function runGovernanceTests() {
  console.log("🚀 Starting Materia Medica Phase 1 Governance & Compliance Unit Tests...");
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

  // Setup standard base book
  const baseBook: MateriaMedicaBook = {
    id: "james-tyler-kent",
    title: "Kent Lectures",
    author: "James Tyler Kent",
    year: 1905,
    rightsStatus: "public-domain",
    editorialStatus: "approved",
    ingestionStatus: "approved",
    sourceUrl: "https://archive.org/details/lecturesonhomoeo00kent",
    sourceVersion: 1,
    lastUpdated: "2026-07-10T12:00:00Z"
  };

  // Setup standard base passage
  const basePassage: MateriaMedicaPassage = {
    id: "kent_1905_sulphur_p1",
    bookId: "james-tyler-kent",
    remedyId: "sulphur",
    sourcePageStart: 12,
    originalText: "Sulphur symptoms text",
    normalizedText: "sulphur symptoms text",
    correctionStatus: "human-reviewed",
    editorialStatus: "approved",
    searchable: true,
    ragState: "eligible",
    sourceVersion: 1,
    lastUpdated: "2026-07-10T12:00:00Z"
  };

  // Test 31: An expired licence cannot authorize search or RAG retrieval
  await test("Test 31 - An expired licence cannot authorize search or RAG retrieval", () => {
    const expiredBook: MateriaMedicaBook = {
      ...baseBook,
      rightsStatus: "licensed",
      licensePermissions: {
        mayStoreLocally: true,
        mayDisplayFullText: true,
        mayIndexForSearch: true,
        mayUseForAiRetrieval: true,
        commercialUseAllowed: true,
        expiresAt: "2025-01-01T00:00:00Z" // Past date
      }
    };
    const now = new Date("2026-07-10T12:00:00Z");
    assert.strictEqual(licenseAllowsAiRetrieval(expiredBook.licensePermissions, now), false);
    assert.strictEqual(isPassageRagEligible(expiredBook, basePassage, now), false);
  });

  // Test 32: A licensed record without explicit AI-retrieval permission is ineligible
  await test("Test 32 - A licensed record without explicit AI-retrieval permission is ineligible", () => {
    const restrictedLicenseBook: MateriaMedicaBook = {
      ...baseBook,
      rightsStatus: "licensed",
      licensePermissions: {
        mayStoreLocally: true,
        mayDisplayFullText: true,
        mayIndexForSearch: true,
        mayUseForAiRetrieval: false, // Explicitly false
        commercialUseAllowed: true
      }
    };
    assert.strictEqual(licenseAllowsAiRetrieval(restrictedLicenseBook.licensePermissions), false);
    assert.strictEqual(isPassageRagEligible(restrictedLicenseBook, basePassage), false);
  });

  // Test 33: A public-domain book with an unapproved passage remains ineligible
  await test("Test 33 - A public-domain book with an unapproved passage remains ineligible", () => {
    const unapprovedPassage: MateriaMedicaPassage = {
      ...basePassage,
      editorialStatus: "draft"
    };
    assert.strictEqual(isPassageRagEligible(baseBook, unapprovedPassage), false);
  });

  // Test 34: A deprecated book excludes all its passages
  await test("Test 34 - A deprecated book excludes all its passages", () => {
    const deprecatedBook: MateriaMedicaBook = {
      ...baseBook,
      deprecatedAt: "2026-07-10T12:00:00Z"
    };
    assert.strictEqual(isPassageRagEligible(deprecatedBook, basePassage), false);
  });

  // Test 35: The legacy scraper rejects unknown book IDs
  await test("Test 35 - The legacy scraper rejects unknown book IDs", async () => {
    process.env.LEGACY_MATERIA_MEDICA_SCRAPER_ENABLED = "true";
    const request = new Request("http://localhost/api/materia-medica?author=unknown-book-id");
    const response = await GET(request) as Response;
    assert.ok(response);
    assert.strictEqual(response.status, 404);
    const body = await response.json();
    assert.strictEqual(body.error, "Unknown book.");
  });

  // Test 36: The legacy scraper rejects caller-supplied URLs and paths
  await test("Test 36 - The legacy scraper rejects caller-supplied URLs and paths", async () => {
    process.env.LEGACY_MATERIA_MEDICA_SCRAPER_ENABLED = "true";
    // Traversal attempt
    const requestTraversal = new Request("http://localhost/api/materia-medica?path=/en/materia-medica/../invalid");
    const responseTraversal = await GET(requestTraversal) as Response;
    assert.ok(responseTraversal);
    assert.strictEqual(responseTraversal.status, 400);

    // Caller supplied domain URL attempt
    const requestDomain = new Request("http://localhost/api/materia-medica?path=https://malicious.domain/en/materia-medica/james-tyler-kent/benzoic-acid");
    const responseDomain = await GET(requestDomain) as Response;
    assert.ok(responseDomain);
    assert.strictEqual(responseDomain.status, 400);
  });

  // Test 37: The disabled scraper returns a closed response without contacting the upstream source
  await test("Test 37 - The disabled scraper returns a closed response", async () => {
    process.env.LEGACY_MATERIA_MEDICA_SCRAPER_ENABLED = "false";
    const request = new Request("http://localhost/api/materia-medica?author=james-tyler-kent");
    const response = await GET(request) as Response;
    assert.ok(response);
    assert.strictEqual(response.status, 410);
    const body = await response.json();
    assert.strictEqual(body.error, "Legacy Materia Medica source is unavailable.");
  });

  // Test 38: A rights-restricted block cannot be recovered through a normal transition
  await test("Test 38 - A rights-restricted block cannot be recovered through a normal transition", () => {
    // Check matrix recovery mapping
    const recovery = blockRecoveryState["rights-restricted"];
    assert.strictEqual(recovery, null);

    // Verify invalid status transition transitions
    const invalid = isValidTransition("registered", "approved");
    assert.strictEqual(invalid, false);

    const valid = isValidTransition("registered", "rights-review");
    assert.strictEqual(valid, true);
  });

  // Test 39: Changing approved source metadata creates a new immutable source version
  await test("Test 39 - Changing approved source metadata creates a new immutable source version", () => {
    const approvedBook: MateriaMedicaBook = {
      ...baseBook,
      editorialStatus: "approved"
    };

    const { book: updatedBook, versionBumped } = updateBookMetadata(approvedBook, {
      title: "New Lectures Title"
    });

    assert.strictEqual(versionBumped, true);
    assert.strictEqual(updatedBook.sourceVersion, approvedBook.sourceVersion + 1);
    assert.strictEqual(updatedBook.editorialStatus, "draft"); // Resets state
    assert.strictEqual(updatedBook.ingestionStatus, "rights-review"); // Resets state

    // Explicitly verify the old approved version remains unchanged and retrievable for audit history
    assert.strictEqual(approvedBook.title, "Kent Lectures");
    assert.strictEqual(approvedBook.sourceVersion, 1);
    assert.strictEqual(approvedBook.editorialStatus, "approved");
  });

  // Test 40: RAG publication state cannot override failed derived eligibility
  await test("Test 40 - RAG publication state cannot override failed derived eligibility", () => {
    const unapprovedPassage: MateriaMedicaPassage = {
      ...basePassage,
      editorialStatus: "draft",
      ragState: "indexed" // Set state to indexed manually
    };
    
    // Derived eligibility must still evaluate to false
    const eligible = isPassageRagEligible(baseBook, unapprovedPassage);
    assert.strictEqual(eligible, false);
  });

  console.log(`\n=== Governance Phase 1 Test Results ===`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runGovernanceTests().catch(err => {
  console.error(err);
  process.exit(1);
});
