import assert from 'assert';
import { getAdminDb } from '../src/lib/firebaseAdmin';
import { getRuntimeEnvironment, resetRuntimeEnvironment } from '../src/features/repertory/config/runtimeEnv';
import { SnapshotPipeline } from '../src/features/repertory/import-export/snapshotPipeline';
import { RepertorySourceReviewRecord } from '../src/features/repertory/types';
import * as path from 'path';
import * as fs from 'fs';
import { FirestoreTestHarness } from './helpers/firestoreTestHarness';

async function run() {
  console.log("🚀 Running Emulator Activation Gate Validation Tests...");

  const harness = new FirestoreTestHarness();
  harness.setupEnvironment();

  resetRuntimeEnvironment();
  const env = getRuntimeEnvironment();
  assert.strictEqual(env.mode, 'emulator');

  const version = "v_gate_test";
  const dir = path.join(env.artifactRoot, 'published', version);

  try {
    // Clean old documents
    await harness.clearDocuments();

    const db = getAdminDb();
    let passed = 0;

    const testAcqId = "acq_clarke_1904_gate_test";
    const sourceId = "clarke_clinical_1904";
    const checksum = "4381dc6d76a95066e1f60f8680c993be90ecfa9ded65a28ab29bdb731bb33d14";

    const acqDoc = db.collection('repertoryAcquisitionRecords').doc(testAcqId);
    const clinicalDoc = db.collection('repertorySourceReviews').doc(`rev_clinical_clarke_1904`);
    const editorialDoc = db.collection('repertorySourceReviews').doc(`rev_editorial_clarke_1904`);

    // Create mock staged snapshot directory and manifest.json
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(path.join(dir, 'metadata'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'locations'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'indexes', 'lexical'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'indexes', 'remedies'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'indexes', 'concepts'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'rag'), { recursive: true });

    fs.writeFileSync(path.join(dir, 'metadata', 'sources.json'), '[]');
    fs.writeFileSync(path.join(dir, 'metadata', 'chapters.json'), '[]');
    fs.writeFileSync(path.join(dir, 'metadata', 'grade-systems.json'), '[]');
    fs.writeFileSync(path.join(dir, 'metadata', 'corpus-statistics.json'), '{}');
    fs.writeFileSync(path.join(dir, 'locations', 'location-00.json'), '{}');
    fs.writeFileSync(path.join(dir, 'indexes', 'lexical', 'term-05.json'), '{}');

    const manifest = {
      corpusVersion: version,
      version,
      validationStatus: "passed",
      sourceIds: [sourceId],
      sourceChecksums: {
        [sourceId]: checksum
      },
      artifactChecksums: {
        "metadata/sources.json": "hash1",
        "indexes/lexical/term-05.json": "hash2"
      },
      sourceCapabilities: {
        [sourceId]: {
          scoringEnabled: false,
          searchable: true
        }
      },
      contentHash: "hash-gate-test"
    };

    const manifestsDir = path.join(env.artifactRoot, 'manifests');
    if (!fs.existsSync(manifestsDir)) fs.mkdirSync(manifestsDir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    fs.writeFileSync(path.join(manifestsDir, `manifest_${version}.json`), JSON.stringify(manifest, null, 2));

    // Case A: Missing clinical review must fail activation
    await assert.rejects(
      async () => {
        await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test A");
      },
      /clinicalApprovalVerified|Missing required clinical review/
    );
    console.log("✅ Case A: Missing clinical review correctly blocked activation.");
    passed++;

    // Set up mock reviews in Firestore
    const mockClinical: RepertorySourceReviewRecord = {
      id: `rev_clinical_clarke_1904`,
      sourceId,
      acquisitionRecordId: testAcqId,
      sourceChecksum: checksum,
      validationReportId: "val_test",
      reviewType: "clinical",
      decision: "approved-with-restrictions",
      restrictions: ["search-only", "scoring-disabled", "unresolved-remedies-disclosed", "original-abbreviations-preserved"],
      findings: ["verified"],
      reason: "safe",
      actorUid: "reviewer-1",
      actorRole: "clinical-reviewer",
      capability: "repertory.source.approve",
      environment: "emulator",
      createdAt: new Date().toISOString()
    };

    const mockEditorial: RepertorySourceReviewRecord = {
      id: `rev_editorial_clarke_1904`,
      sourceId,
      acquisitionRecordId: testAcqId,
      sourceChecksum: checksum,
      validationReportId: "val_test",
      reviewType: "editorial",
      decision: "approved",
      restrictions: [],
      findings: ["verified"],
      reason: "editorial approved",
      actorUid: "editor-1",
      actorRole: "editorial-reviewer",
      capability: "repertory.editorial.approve",
      environment: "emulator",
      createdAt: new Date().toISOString()
    };

    await clinicalDoc.set(mockClinical);
    // Still missing editorial review
    await assert.rejects(
      async () => {
        await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test B");
      },
      /editorialApprovalVerified|Missing required editorial review/
    );
    console.log("✅ Case B: Missing editorial review correctly blocked activation.");
    passed++;

    await editorialDoc.set(mockEditorial);

    // Case C: Mismatched checksum must fail activation
    const wrongManifest = {
      ...manifest,
      sourceChecksums: {
        [sourceId]: "wrong-checksum"
      }
    };
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(wrongManifest, null, 2));
    fs.writeFileSync(path.join(manifestsDir, `manifest_${version}.json`), JSON.stringify(wrongManifest, null, 2));

    await assert.rejects(
      async () => {
        await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test C");
      },
      /clinicalApprovalVerified|Source checksum mismatch/
    );
    console.log("✅ Case C: Checksum mismatch correctly blocked activation.");
    passed++;

    // Case D: Scoring enabled Clarke in manifest must fail activation
    const scoringEnabledManifest = {
      ...manifest,
      sourceCapabilities: {
        [sourceId]: {
          scoringEnabled: true,
          searchable: true
        }
      }
    };
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(scoringEnabledManifest, null, 2));
    fs.writeFileSync(path.join(manifestsDir, `manifest_${version}.json`), JSON.stringify(scoringEnabledManifest, null, 2));

    await assert.rejects(
      async () => {
        await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test D");
      },
      /clarkeScoringDisabled|scoring must be disabled/
    );
    console.log("✅ Case D: Clarke scoring-enabled manifest correctly blocked activation.");
    passed++;

    // Reset to valid manifest
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    fs.writeFileSync(path.join(manifestsDir, `manifest_${version}.json`), JSON.stringify(manifest, null, 2));

    // Case E: Valid approvals must pass activation
    await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test E");
    console.log("✅ Case E: Valid approvals successfully passed activation.");
    passed++;

    console.log(`\n🎉 Emulator Activation Gate Tests Passed: ${passed}/5`);
  } finally {
    // Cleanup
    try {
      await harness.clearDocuments();
    } catch (e) {
      // Ignored
    }
    await harness.cleanup();
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

run().catch(err => {
  console.error("❌ Activation Gate Test Failed:", err);
  process.exit(1);
});
