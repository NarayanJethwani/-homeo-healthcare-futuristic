import assert from "assert";
import {
  compileCorpusEligibilityRegistryFromManifestV1,
  validateCorpusCacheActivationManifestV1
} from "@/features/knowledge/retrieval/CorpusCacheActivationManifestV1";
import { defaultCorpusEligibilityRegistry } from "@/features/knowledge/retrieval/CorpusEligibilityRegistry";

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (error) {
    failed++;
    console.error(`❌ ${name}`);
    console.error(error);
  }
}

const NOW = new Date("2026-07-21T06:00:00.000Z");

function validManifest(): Record<string, unknown> {
  return {
    schemaVersion: "1.0.0",
    snapshotVersion: "v1.0.0-shadow.1",
    approvedAt: "2026-07-20T06:00:00.000Z",
    approvalExpiresAt: "2026-08-20T06:00:00.000Z",
    entries: [{
      entityId: "DIS-GERD-001",
      entityType: "disease",
      publishedVersionId: "ver-gerd-2026.07",
      dataClassification: "non-phi",
      provenance: "Approved knowledge corpus source-version record",
      rightsStatus: "licensed",
      reviewExpiresAt: "2026-08-15T06:00:00.000Z",
      approvals: {
        clinicalReviewId: "apr_1234567890ab",
        editorialReviewId: "apr_1234567890ac",
        rightsReviewId: "apr_1234567890ad"
      }
    }]
  };
}

async function run(): Promise<void> {
  console.log("🚀 Running Governed Corpus Cache Activation Manifest Tests...");

  await test("1. Valid approved manifest compiles to an immutable eligible registry", () => {
    const result = compileCorpusEligibilityRegistryFromManifestV1(
      validManifest(),
      "v1.0.0-shadow.1",
      NOW
    );
    assert.strictEqual(result.ok, true);
    if (!result.ok) return;
    assert.strictEqual(result.entryCount, 1);
    assert.strictEqual(result.snapshotVersion, "v1.0.0-shadow.1");
    assert.strictEqual(result.registry.isEligible("DIS-GERD-001", "ver-gerd-2026.07", "disease"), true);
    const entry = result.registry.getEligibilityEntry("DIS-GERD-001");
    assert.ok(entry);
    assert.strictEqual(Object.isFrozen(entry), true);
  });

  await test("2. Default production registry remains empty", () => {
    assert.strictEqual(defaultCorpusEligibilityRegistry.getEligibilityEntry("DIS-GERD-001"), null);
    assert.strictEqual(defaultCorpusEligibilityRegistry.isEligible("DIS-GERD-001", "ver-gerd-2026.07", "disease"), false);
  });

  await test("3. Strict schema rejects unknown fields and empty entry lists", () => {
    const unknownField = { ...validManifest(), unexpected: "blocked" };
    const empty = { ...validManifest(), entries: [] };
    assert.deepStrictEqual(
      validateCorpusCacheActivationManifestV1(unknownField, "v1.0.0-shadow.1", NOW),
      { ok: false, errorCodes: ["SCHEMA_INVALID"] }
    );
    assert.deepStrictEqual(
      validateCorpusCacheActivationManifestV1(empty, "v1.0.0-shadow.1", NOW),
      { ok: false, errorCodes: ["SCHEMA_INVALID"] }
    );
  });

  await test("4. Non-PHI, canonical entity type, and approved rights constraints fail closed", () => {
    const cases = [
      { dataClassification: "phi" },
      { entityType: "invented-entity" },
      { rightsStatus: "rights-review-required" }
    ];
    for (const mutation of cases) {
      const manifest = validManifest() as any;
      manifest.entries[0] = { ...manifest.entries[0], ...mutation };
      const result = validateCorpusCacheActivationManifestV1(manifest, "v1.0.0-shadow.1", NOW);
      assert.strictEqual(result.ok, false);
      if (!result.ok) assert.deepStrictEqual(result.errorCodes, ["SCHEMA_INVALID"]);
    }
  });

  await test("5. Snapshot mismatch is rejected with a static code", () => {
    const result = validateCorpusCacheActivationManifestV1(validManifest(), "v2.0.0", NOW);
    assert.strictEqual(result.ok, false);
    if (!result.ok) assert.deepStrictEqual(result.errorCodes, ["SNAPSHOT_VERSION_MISMATCH"]);
  });

  await test("6. Future and expired manifest approvals are rejected", () => {
    const future = { ...validManifest(), approvedAt: "2026-07-22T06:00:00.000Z" };
    const expired = { ...validManifest(), approvalExpiresAt: "2026-07-21T06:00:00.000Z" };
    const futureResult = validateCorpusCacheActivationManifestV1(future, "v1.0.0-shadow.1", NOW);
    const expiredResult = validateCorpusCacheActivationManifestV1(expired, "v1.0.0-shadow.1", NOW);
    assert.strictEqual(futureResult.ok, false);
    assert.strictEqual(expiredResult.ok, false);
    if (!futureResult.ok) assert.deepStrictEqual(futureResult.errorCodes, ["APPROVAL_NOT_YET_VALID"]);
    if (!expiredResult.ok) assert.deepStrictEqual(expiredResult.errorCodes, ["APPROVAL_EXPIRED"]);
  });

  await test("7. Expired entry review blocks the entire activation manifest", () => {
    const manifest = validManifest() as any;
    manifest.entries[0].reviewExpiresAt = "2026-07-21T05:59:59.000Z";
    const result = validateCorpusCacheActivationManifestV1(manifest, "v1.0.0-shadow.1", NOW);
    assert.strictEqual(result.ok, false);
    if (!result.ok) assert.deepStrictEqual(result.errorCodes, ["ENTRY_REVIEW_EXPIRED"]);
  });

  await test("8. Duplicate entity IDs are rejected before compilation", () => {
    const manifest = validManifest() as any;
    manifest.entries.push(structuredClone(manifest.entries[0]));
    const result = compileCorpusEligibilityRegistryFromManifestV1(manifest, "v1.0.0-shadow.1", NOW);
    assert.strictEqual(result.ok, false);
    if (!result.ok) assert.deepStrictEqual(result.errorCodes, ["DUPLICATE_ENTITY"]);
  });

  await test("9. Opaque approval IDs and newline-free provenance are mandatory", () => {
    const badApproval = validManifest() as any;
    badApproval.entries[0].approvals.clinicalReviewId = "Dr Patient Name";
    const badProvenance = validManifest() as any;
    badProvenance.entries[0].provenance = "Source\npatient details";
    for (const manifest of [badApproval, badProvenance]) {
      const result = validateCorpusCacheActivationManifestV1(manifest, "v1.0.0-shadow.1", NOW);
      assert.strictEqual(result.ok, false);
      if (!result.ok) assert.deepStrictEqual(result.errorCodes, ["SCHEMA_INVALID"]);
    }
  });

  await test("10. Validation errors never echo caller-controlled sentinel values", () => {
    const sentinel = "PHI_SENTINEL_PATIENT_NAME_28J";
    const manifest = validManifest() as any;
    manifest.entries[0].entityId = sentinel;
    manifest.entries[0].approvals.rightsReviewId = sentinel;
    const result = validateCorpusCacheActivationManifestV1(manifest, "v1.0.0-shadow.1", NOW);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(JSON.stringify(result).includes(sentinel), false);
  });

  await test("11. Validated manifest and nested approval records are deeply frozen", () => {
    const result = validateCorpusCacheActivationManifestV1(validManifest(), "v1.0.0-shadow.1", NOW);
    assert.strictEqual(result.ok, true);
    if (!result.ok) return;
    assert.strictEqual(Object.isFrozen(result.manifest), true);
    assert.strictEqual(Object.isFrozen(result.manifest.entries), true);
    assert.strictEqual(Object.isFrozen(result.manifest.entries[0]), true);
    assert.strictEqual(Object.isFrozen(result.manifest.entries[0].approvals), true);
  });

  console.log(`\n🎉 Corpus Cache Activation Manifest Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

run();
