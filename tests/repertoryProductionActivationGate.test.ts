import assert from 'assert';
import { getAdminDb } from '../src/lib/firebaseAdmin';
import { getRuntimeEnvironment, resetRuntimeEnvironment } from '../src/features/repertory/config/runtimeEnv';
import { SnapshotPipeline } from '../src/features/repertory/import-export/snapshotPipeline';
import { RepertorySourceReviewRecord } from '../src/features/repertory/types';
import * as path from 'path';
import * as fs from 'fs';

import * as net from 'net';

function checkEmulatorUp(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(200);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function run() {
  console.log("🚀 Running Emulator Activation Gate Validation Tests...");

  const emulatorUp = await checkEmulatorUp('127.0.0.1', 8080);
  if (!emulatorUp) {
    console.log("⚠️ Firestore Emulator not running. Using mock Firestore activation gate.");
    process.env.REPERTORY_USE_MOCK_FIRESTORE = 'true';
    process.env.REPERTORY_ENV = 'emulator';
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    process.env.FIRESTORE_PROJECT_ID = 'mock-project-id';
  } else {
    process.env.REPERTORY_ENV = 'emulator';
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    process.env.FIRESTORE_PROJECT_ID = 'homeo-healthcare-emulator';
  }

  resetRuntimeEnvironment();
  const env = getRuntimeEnvironment();
  assert.strictEqual(env.mode, 'emulator');

  const db = getAdminDb();
  let passed = 0;

  const testAcqId = "acq_clarke_1904_gate_test";
  const sourceId = "clarke_clinical_1904";
  const checksum = "4381dc6d76a95066e1f60f8680c993be90ecfa9ded65a28ab29bdb731bb33d14";

  // Clean old documents
  const acqDoc = db.collection('repertoryAcquisitionRecords').doc(testAcqId);
  const clinicalDoc = db.collection('repertorySourceReviews').doc(`rev_clinical_clarke_1904`);
  const editorialDoc = db.collection('repertorySourceReviews').doc(`rev_editorial_clarke_1904`);

  await acqDoc.delete();
  await clinicalDoc.delete();
  await editorialDoc.delete();

  // Create mock staged snapshot directory and manifest.json
  const version = "v_gate_test";
  const dir = path.join(env.artifactRoot, 'published', version);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const manifest = {
    version,
    validationStatus: "passed",
    sourceIds: [sourceId],
    sourceChecksums: {
      [sourceId]: checksum
    },
    sourceCapabilities: {
      [sourceId]: {
        scoringEnabled: false,
        searchable: true
      }
    },
    contentHash: "hash-gate-test"
  };

  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // Case A: Missing clinical review must fail activation
  await assert.rejects(
    async () => {
      await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test A");
    },
    /Missing required clinical review/
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
    /Missing required editorial review/
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

  await assert.rejects(
    async () => {
      await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test C");
    },
    /Source checksum mismatch/
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

  await assert.rejects(
    async () => {
      await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test D");
    },
    /scoring must be disabled/
  );
  console.log("✅ Case D: Clarke scoring-enabled manifest correctly blocked activation.");
  passed++;

  // Reset to valid manifest
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // Case E: Valid approvals must pass activation
  await SnapshotPipeline.activateSnapshot(version, "test-admin", "super-admin", "gate test E");
  console.log("✅ Case E: Valid approvals successfully passed activation.");
  passed++;

  // Cleanup
  await acqDoc.delete();
  await clinicalDoc.delete();
  await editorialDoc.delete();
  fs.rmSync(dir, { recursive: true, force: true });

  console.log(`\n🎉 Emulator Activation Gate Tests Passed: ${passed}/5`);
}

run().catch(err => {
  console.error("❌ Activation Gate Test Failed:", err);
  process.exit(1);
});
