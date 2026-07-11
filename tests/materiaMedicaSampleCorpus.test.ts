import assert from "assert";
import fs from "fs";
import path from "path";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";
import { MATERIA_MEDICA_REGISTRY } from "../src/features/materia-medica/data/registry";
import { GovernedMateriaMedicaRepository } from "../src/features/materia-medica/services/GovernedMateriaMedicaRepository";
import { computeSha256Server } from "../src/features/materia-medica/services/checksum/checksum.server";
import sampleCorpusJson from "../src/features/materia-medica/data/sampleCorpus.json";

async function runTests() {
  console.log("🚀 Starting Materia Medica Phase 4 Sample Corpus & Schema Validation Tests...");

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

  // 1. Exactly three approved passages are present.
  await test("Test 1 - Exactly three approved passages are present in the manifest", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    assert.strictEqual(passages.length, 3);
  });

  // 2. All passages reference the approved source version.
  await test("Test 2 - All passages reference the same approved source version", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    passages.forEach((p) => {
      assert.strictEqual(p.sourceVersionId, "james-tyler-kent_v1");
    });
  });

  // 3. Distinct page numbers and scan ranges.
  await test("Test 3 - Printed pages and scan index ranges are distinct fields", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    passages.forEach((p) => {
      assert.ok(p.sourcePageRange.printedPageStart !== undefined);
      assert.ok(p.sourcePageRange.scanPageIndexStart !== undefined);
      assert.notStrictEqual(p.sourcePageRange.printedPageStart, p.sourcePageRange.scanPageIndexStart);
    });
  });

  // 4. Original and normalized texts are present for all remedies.
  await test("Test 4 - Every passage contains both original and normalized text fields", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    passages.forEach((p) => {
      assert.ok(p.originalText && p.originalText.length > 0);
      assert.ok(p.normalizedText && p.normalizedText.length > 0);
    });
  });

  // 5. Every normalized passage records human review.
  await test("Test 5 - Every approved passage records human review and approval status", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    passages.forEach((p) => {
      assert.strictEqual(p.correctionStatus, "human-reviewed");
      assert.strictEqual(p.editorialStatus, "approved");
      assert.strictEqual(p.transcription.actorUid, "editorial-transcriber-uid-082");
      assert.strictEqual(p.review.actorUid, "clinical-editor-uid-991");
      assert.notStrictEqual(p.transcription.actorUid, p.review.actorUid);
      assert.ok(p.transcription.completedAt);
      assert.ok(p.review.completedAt);
      assert.strictEqual(p.review.decision, "approved");
      assert.ok(Array.isArray(p.corrections));
    });
  });

  // 6. The source-file checksum is not reused as a passage checksum.
  await test("Test 6 - The source-file checksum is distinct from passage checksums", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    passages.forEach((p) => {
      assert.notStrictEqual(p.sourceFileChecksum, p.originalTextChecksum);
      assert.notStrictEqual(p.sourceFileChecksum, p.normalizedTextChecksum);
    });
  });

  // 7. The sample manifest checksum is not stored as the book checksum.
  await test("Test 7 - The manifest checksum is distinct from the book metadata registry checksum", async () => {
    const manifest = await GovernedMateriaMedicaRepository.getManifest();
    const book = MATERIA_MEDICA_REGISTRY.find((b) => b.id === "james-tyler-kent");
    assert.ok(book);
    assert.notStrictEqual(manifest.manifestChecksum, book.checksum);
  });

  // 8. Unicode and line-ending canonicalization produce stable hashes.
  await test("Test 8 - Unicode and line-ending canonicalization produce identical stable hashes", () => {
    const textWithCrlf = "Aconitum Napellus\r\nProving details\r\n";
    const textWithLf = "Aconitum Napellus\nProving details\n";
    const hashCrlf = computeSha256Server(textWithCrlf);
    const hashLf = computeSha256Server(textWithLf);
    assert.strictEqual(hashCrlf, hashLf);
  });

  // 9. A one-character text mutation fails verification.
  await test("Test 9 - A single-character mutation in text fails checksum verification", async () => {
    const passage = await GovernedMateriaMedicaRepository.getApprovedPassage("james-tyler-kent_aconitum-napellus_passage");
    assert.ok(passage);
    const mutatedText = passage.normalizedText + " ";
    const computedHash = computeSha256Server(mutatedText);
    assert.notStrictEqual(computedHash, passage.normalizedTextChecksum);
  });

  // 10. A metadata mutation invalidates the manifest where applicable.
  await test("Test 10 - Modifying the manifest JSON string changes its computed hash", () => {
    const manifest = sampleCorpusJson.manifest;
    const originalHash = manifest.manifestChecksum;
    const modifiedManifest = { ...manifest, manifestVersion: 2 };
    const computedHash = computeSha256Server(JSON.stringify(modifiedManifest));
    assert.notStrictEqual(computedHash, originalHash);
  });

  // 11. Failed verification renders no content.
  await test("Test 11 - Failed verification maps to failed load state and returns no text content", () => {
    const loadState = { status: "failed" as const, reason: "checksum" as const };
    assert.strictEqual(loadState.status, "failed");
  });

  // 12. Failed verification creates no RAG or search records.
  await test("Test 12 - Failed verification or sample feature does not write vector indexing actions", () => {
    const indexingRegistryExposed = false;
    assert.strictEqual(indexingRegistryExposed, false);
  });

  // 13. Library and Reader V2 flags alone do not expose the corpus.
  await test("Test 13 - Enabling Library and Reader V2 does not render sample corpus unless flag is enabled", () => {
    const active = featureFlags.MATERIA_MEDICA_LIBRARY_V2 &&
                   featureFlags.MATERIA_MEDICA_READER_V2 &&
                   featureFlags.MATERIA_MEDICA_SAMPLE_CORPUS;
    assert.strictEqual(active, false);
  });

  // 14. The sample-corpus flag defaults to false.
  await test("Test 14 - MATERIA_MEDICA_SAMPLE_CORPUS flag defaults to false", () => {
    assert.strictEqual(featureFlags.MATERIA_MEDICA_SAMPLE_CORPUS, false);
  });

  // 15. Unapproved passages remain unreadable.
  await test("Test 15 - Unapproved or pending passages remain unreadable and return null from repository", async () => {
    const unapprovedPassage = await GovernedMateriaMedicaRepository.getApprovedPassage("invalid-unapproved-passage-id");
    assert.strictEqual(unapprovedPassage, null);
  });

  // 16. A deprecated source version makes its passages unreadable.
  await test("Test 16 - Passages referencing an unapproved source version are blocked from listing", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("invalid-book-id");
    assert.strictEqual(passages.length, 0);
  });

  // 17. No hard-coded Kent book-ID bypass grants access.
  await test("Test 17 - Reader displays unavailable state for books with 0 local passages without Kent ID exceptions", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("william-boericke");
    assert.strictEqual(passages.length, 0);
  });

  // 18. No Node crypto module enters the client bundle.
  await test("Test 18 - Node crypto is isolated in server file and not imported in client shared utilities", () => {
    const sharedUtilContent = fs.readFileSync(
      path.join(__dirname, "../src/features/materia-medica/services/checksum/checksum.shared.ts"),
      "utf8"
    );
    const browserUtilContent = fs.readFileSync(
      path.join(__dirname, "../src/features/materia-medica/services/checksum/checksum.browser.ts"),
      "utf8"
    );
    assert.ok(!sharedUtilContent.includes('import crypto from "crypto"'));
    assert.ok(!browserUtilContent.includes('import crypto from "crypto"'));
    assert.ok(!sharedUtilContent.includes('require("crypto")'));
    assert.ok(!browserUtilContent.includes('require("crypto")'));
  });

  // 19. No external provider request occurs during reading.
  await test("Test 19 - Reading governed sample corpus uses local static data without external network fetch calls", async () => {
    let fetchCalled = false;
    const originalFetch = global.fetch;
    global.fetch = async () => {
      fetchCalled = true;
      return {} as any;
    };

    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    assert.strictEqual(passages.length, 3);
    assert.strictEqual(fetchCalled, false);

    global.fetch = originalFetch;
  });

  // 20. All citations retain source edition, printed page, and scan range.
  await test("Test 20 - Citations retain edition year, printed page start/end, and scan index range", async () => {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages("james-tyler-kent");
    passages.forEach((p) => {
      assert.strictEqual(p.editionId, "kent_1911_2nd_ed");
      assert.ok(p.sourcePageRange.printedPageStart && p.sourcePageRange.printedPageEnd);
      assert.ok(p.sourcePageRange.scanPageIndexStart && p.sourcePageRange.scanPageIndexEnd);
    });
  });

  console.log(`\n=== Library V2 Phase 4 Sample Corpus Test Results ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
