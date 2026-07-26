import assert from "assert";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import sampleCorpus from "../src/features/materia-medica/data/sampleCorpus.json";
import { MATERIA_MEDICA_REGISTRY } from "../src/features/materia-medica/data/registry";
import {
  BOOKS_WITH_VERIFIED_CONTENT_COUNT,
  INGESTED_SOURCE_VOLUME_COUNT,
  MACHINE_VALIDATED_BOOK_COUNT,
  MACHINE_VALIDATED_CHARACTER_COUNT,
  MACHINE_VALIDATED_CHUNK_COUNT,
  VERIFIED_PASSAGE_COUNT,
  getBookContentInventory,
} from "../src/features/materia-medica/data/contentInventory";
import { VERIFIED_ARCHIVE_SOURCES } from "../src/features/materia-medica/data/sourceVerification";

const sha256 = (value: string) => crypto.createHash("sha256").update(value.normalize("NFC").replace(/\r\n?/g, "\n")).digest("hex");

async function runTests() {
  let passed = 0;
  let failed = 0;

  const test = async (name: string, fn: () => void | Promise<void>) => {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed += 1;
    } catch (error) {
      console.error(`❌ ${name}`);
      console.error(error);
      failed += 1;
    }
  };

  await test("Registry contains ten unique catalogue records", () => {
    assert.strictEqual(MATERIA_MEDICA_REGISTRY.length, 10);
    assert.strictEqual(new Set(MATERIA_MEDICA_REGISTRY.map((book) => book.id)).size, 10);
  });

  await test("Every catalogue record has a separately confirmed public source", () => {
    for (const book of MATERIA_MEDICA_REGISTRY) {
      const source = VERIFIED_ARCHIVE_SOURCES[book.id];
      assert.ok(source, `Missing verified archive source for ${book.id}`);
      assert.ok(["archive.org", "homeoint.org"].includes(new URL(source.sourceUrl).hostname));
      assert.strictEqual(source.textAssetConfirmed, true);
    }
  });

  await test("Published coverage separates complete machine OCR from human review", () => {
    assert.strictEqual(VERIFIED_PASSAGE_COUNT, 3);
    assert.strictEqual(BOOKS_WITH_VERIFIED_CONTENT_COUNT, 1);
    assert.strictEqual(MACHINE_VALIDATED_BOOK_COUNT, 10);
    assert.strictEqual(INGESTED_SOURCE_VOLUME_COUNT, 19);
    assert.strictEqual(MACHINE_VALIDATED_CHUNK_COUNT, 3_419);
    assert.strictEqual(MACHINE_VALIDATED_CHARACTER_COUNT, 32_088_155);
    assert.strictEqual(getBookContentInventory("james-tyler-kent").verifiedPassageCount, 3);
    assert.strictEqual(getBookContentInventory("william-boericke").coverage, "complete-machine-validated");
  });

  await test("Every machine corpus section matches its registered SHA-256 checksum", () => {
    const corpusRoot = path.join(process.cwd(), "public", "data", "materia-medica", "v1", "books");
    let checkedChunks = 0;
    let checkedCharacters = 0;

    for (const book of MATERIA_MEDICA_REGISTRY) {
      const bookRoot = path.join(corpusRoot, book.id);
      const manifest = JSON.parse(fs.readFileSync(path.join(bookRoot, "manifest.json"), "utf8"));
      assert.strictEqual(manifest.bookId, book.id);
      assert.strictEqual(manifest.corpusStatus, "machine-validated");
      assert.strictEqual(manifest.editorialStatus, "needs-review");
      assert.strictEqual(manifest.chunks.length, manifest.chunkCount);

      for (const chunkIndex of manifest.chunks) {
        const chunk = JSON.parse(fs.readFileSync(path.join(bookRoot, chunkIndex.file), "utf8"));
        const checksum = crypto.createHash("sha256").update(chunk.text).digest("hex");
        assert.strictEqual(checksum, chunk.sha256);
        assert.strictEqual(checksum, chunkIndex.sha256);
        assert.strictEqual(chunk.text.length, chunk.characterCount);
        checkedChunks += 1;
        checkedCharacters += chunk.characterCount;
      }
    }

    assert.strictEqual(checkedChunks, MACHINE_VALIDATED_CHUNK_COUNT);
    assert.strictEqual(checkedCharacters, MACHINE_VALIDATED_CHARACTER_COUNT);
  });

  await test("Every published passage passes all three integrity checks", () => {
    for (const passage of sampleCorpus.passages) {
      assert.strictEqual(sha256(passage.originalText), passage.originalTextChecksum);
      assert.strictEqual(sha256(passage.normalizedText), passage.normalizedTextChecksum);
      assert.strictEqual(sha256(JSON.stringify(passage.blocks)), passage.blocksChecksum);
      assert.strictEqual(passage.editorialStatus, "approved");
      assert.strictEqual(passage.correctionStatus, "human-reviewed");
    }
  });

  await test("Every book exposes a complete usable index instead of generic A/B/C chunks", () => {
    const corpusRoot = path.join(process.cwd(), "public", "data", "materia-medica", "v1", "books");
    const expectedMinimums: Record<string, number> = {
      "james-tyler-kent": 180,
      "william-boericke": 680,
      "john-henry-clarke": 1_000,
      "henry-c-allen": 180,
      "benoit-mure": 38,
      "cyrus-maxwell-boger": 600,
      "adolf-zur-lippe": 11,
      "william-boericke-short": 680,
      "samuel-hahnemann-organon": 291,
      "constantine-hering-guiding": 600,
    };

    for (const book of MATERIA_MEDICA_REGISTRY) {
      const manifest = JSON.parse(fs.readFileSync(path.join(corpusRoot, book.id, "manifest.json"), "utf8"));
      const headings = manifest.chunks.flatMap((chunk: { indexHeadings?: string[] }) => chunk.indexHeadings ?? []);
      assert.ok(headings.length >= expectedMinimums[book.id], `${book.id} only exposes ${headings.length} index entries`);
      assert.ok(headings.every((heading: string) => !/Complete volume · Section/i.test(heading)));
    }

    const organon = JSON.parse(fs.readFileSync(path.join(corpusRoot, "samuel-hahnemann-organon", "manifest.json"), "utf8"));
    assert.deepStrictEqual(
      organon.chunks.map((chunk: { indexHeadings: string[] }) => chunk.indexHeadings[0]),
      Array.from({ length: 291 }, (_, index) => `Aphorism § ${index + 1}`),
    );
    const readerSource = fs.readFileSync(
      path.join(process.cwd(), "src/features/materia-medica/components/reader/MateriaMedicaReader.tsx"),
      "utf8",
    );
    assert.ok(readerSource.includes('replace(/[^A-Z0-9]/g, "")'));
  });

  await test("Manifest exactly lists the published passage set", () => {
    assert.deepStrictEqual(sampleCorpus.manifest.passageIds, sampleCorpus.passages.map((passage) => passage.id));
  });

  await test("Kent source transcription checksum matches the governed source version", () => {
    const sourcePath = path.join(process.cwd(), "tests", "fixtures", "materia-medica", "kents-lectures.txt");
    const source = fs.readFileSync(sourcePath, "utf8");
    assert.strictEqual(sha256(source), sampleCorpus.passages[0].sourceFileChecksum);
  });

  await test("Legacy Kent cache is structurally present but excluded from verified coverage", () => {
    const cacheRoot = path.join(process.cwd(), "src", "lib", "books-cache", "james-tyler-kent");
    const index = JSON.parse(fs.readFileSync(path.join(cacheRoot, "index.json"), "utf8"));
    assert.strictEqual(index.count, 95);
    assert.strictEqual(index.remedies.length, 95);
    assert.strictEqual(getBookContentInventory("james-tyler-kent").verifiedPassageCount, 3);
  });

  await test("Separate structured Organon dataset remains distinct from its full OCR edition", () => {
    const organon = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "lib", "organon6thFull.json"), "utf8"));
    assert.strictEqual(Object.keys(organon).length, 291);
    assert.strictEqual(getBookContentInventory("samuel-hahnemann-organon").verifiedPassageCount, 0);
    assert.strictEqual(getBookContentInventory("samuel-hahnemann-organon").machineChunkCount, 291);
  });

  console.log(`\nMateria Medica content audit: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests();
