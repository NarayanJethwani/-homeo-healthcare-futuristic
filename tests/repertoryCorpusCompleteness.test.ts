import assert from 'assert';
import { getSourceRecord, REPERTORY_SOURCES, validateRegistryRecord } from '../src/features/repertory/data/repertorySourceRegistry';
import { SnapshotPipeline, IneligibleRepertorySourcesContainerError } from '../src/features/repertory/import-export/snapshotPipeline';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  console.log("🚀 Running Corpus Completeness Tests...");
  let passed = 0;

  // Test 1: Kent and Boericke eligibility
  const kent = getSourceRecord("kent_1908");
  const boericke = getSourceRecord("boericke_1927");
  assert.ok(kent && kent.acquisitionStatus === "complete-validated");
  assert.ok(boericke && boericke.acquisitionStatus === "complete-validated");
  passed++;

  // Test 2: Sample sources are blocked from snapshot
  try {
    await SnapshotPipeline.buildSnapshot({
      version: "v_temp_completeness",
      actorUid: "test-admin",
      actorRole: "super-admin",
      reason: "test completeness",
      sourceIds: ["boger_boenninghausen_1905"]
    });
    assert.fail("Should have rejected Boger Boenninghausen because it's a sample source.");
  } catch (err: any) {
    assert.ok(err instanceof IneligibleRepertorySourcesContainerError);
    assert.ok(err.errors.some(e => e.sourceId === "boger_boenninghausen_1905"));
  }
  passed++;

  // Test 3: Copyrighted sources are blocked
  try {
    await SnapshotPipeline.buildSnapshot({
      version: "v_temp_completeness2",
      actorUid: "test-admin",
      actorRole: "super-admin",
      reason: "test completeness",
      sourceIds: ["synthesis_9_1"]
    });
    assert.fail("Should have rejected Synthesis.");
  } catch (err: any) {
    assert.ok(err instanceof IneligibleRepertorySourcesContainerError);
    assert.ok(err.errors.some(e => e.sourceId === "synthesis_9_1"));
  }
  passed++;

  // Test 4: Registry validation combinations
  const invalidRecord: any = {
    id: "invalid_src",
    rightsStatus: "copyrighted",
    ingestionAllowed: true, // Invalid: copyrighted cannot be allowed
    acquisitionStatus: "metadata-only",
    editorialStatus: "rejected",
    publicationStatus: "blocked"
  };
  try {
    validateRegistryRecord(invalidRecord);
    assert.fail("Should have thrown registry validation error.");
  } catch (err: any) {
    assert.ok(err.message.includes("copyrighted"));
  }
  passed++;

  // Test 5: Source directory contains only complete sources
  const srcDir = path.join(process.cwd(), 'data', 'repertory', 'source');
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('RepertoryData.json'));
  assert.strictEqual(files.length, 2, "Only Kent and Boericke raw source files should be in source directory.");
  assert.ok(files.includes("kent_1908RepertoryData.json"));
  assert.ok(files.includes("boericke_1927RepertoryData.json"));
  passed++;

  console.log(`✅ Corpus Completeness Tests Passed: ${passed}/5`);
}

run().catch(err => {
  console.error("Completeness Test Failed:", err);
  process.exit(1);
});
