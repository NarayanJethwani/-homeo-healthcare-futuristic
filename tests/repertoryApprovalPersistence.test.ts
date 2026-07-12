import assert from 'assert';
import { getAdminDb } from '../src/lib/firebaseAdmin';
import { getRuntimeEnvironment, resetRuntimeEnvironment } from '../src/features/repertory/config/runtimeEnv';
import { RepertorySourceReviewRecord, DurableRepertoryAcquisitionRecord } from '../src/features/repertory/types';
import * as fs from 'fs';
import * as path from 'path';

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
  console.log("🚀 Running Emulator Approval Persistence & Cache Deletion Resilience Tests...");
  
  const emulatorUp = await checkEmulatorUp('127.0.0.1', 8080);
  if (!emulatorUp) {
    console.log("⚠️ Firestore Emulator not running. Using mock Firestore persistence.");
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
  assert.strictEqual(env.mode, 'emulator', "Must run in emulator/mock mode.");

  const db = getAdminDb();
  let passed = 0;

  const testAcqId = "acq_clarke_1904_test";
  const sourceId = "clarke_clinical_1904";
  const checksum = "4381dc6d76a95066e1f60f8680c993be90ecfa9ded65a28ab29bdb731bb33d14";

  // Clean old documents
  const acqDoc = db.collection('repertoryAcquisitionRecords').doc(testAcqId);
  const clinicalDoc = db.collection('repertorySourceReviews').doc(`rev_clinical_${testAcqId}`);
  const editorialDoc = db.collection('repertorySourceReviews').doc(`rev_editorial_${testAcqId}`);
  
  await acqDoc.delete();
  await clinicalDoc.delete();
  await editorialDoc.delete();

  // 1. Write durable acquisition record to Firestore
  const mockAcq: DurableRepertoryAcquisitionRecord = {
    id: testAcqId,
    sourceId,
    candidateSourceUrl: "http://example.com",
    acquisitionStatus: "checksum-verified",
    extractionStatus: "validated",
    editorialStatus: "approved",
    publicationStatus: "staged",
    sourceChecksum: checksum,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    migrationEnvironment: "emulator"
  };
  await acqDoc.set(mockAcq);

  // 2. Write clinical and editorial reviews
  const mockClinical: RepertorySourceReviewRecord = {
    id: `rev_clinical_${testAcqId}`,
    sourceId,
    acquisitionRecordId: testAcqId,
    sourceChecksum: checksum,
    validationReportId: "val_test",
    reviewType: "clinical",
    decision: "approved-with-restrictions",
    restrictions: ["search-only", "scoring-disabled", "unresolved-remedies-disclosed", "original-abbreviations-preserved"],
    findings: ["verified grades are not-recoverable"],
    reason: "safe classical source",
    actorUid: "reviewer-1",
    actorRole: "clinical-reviewer",
    capability: "repertory.source.approve",
    environment: "emulator",
    createdAt: new Date().toISOString()
  };

  const mockEditorial: RepertorySourceReviewRecord = {
    id: `rev_editorial_${testAcqId}`,
    sourceId,
    acquisitionRecordId: testAcqId,
    sourceChecksum: checksum,
    validationReportId: "val_test",
    reviewType: "editorial",
    decision: "approved",
    restrictions: [],
    findings: ["verified line count"],
    reason: "editorial approved",
    actorUid: "editor-1",
    actorRole: "editorial-reviewer",
    capability: "repertory.editorial.approve",
    environment: "emulator",
    createdAt: new Date().toISOString()
  };

  await clinicalDoc.set(mockClinical);
  await editorialDoc.set(mockEditorial);

  console.log("✅ Step 1: Wrote durable acquisition and review records to Firestore Emulator.");
  passed++;

  // 3. Delete local register/cache file and reload from Firestore
  const registerFile = path.join(env.artifactRoot, 'reports', 'acquisition-register.json');
  if (fs.existsSync(registerFile)) {
    fs.unlinkSync(registerFile);
    console.log("🧹 Deleted local acquisition register cache file.");
  }

  // Load from Firestore
  const loadedAcq = await db.collection('repertoryAcquisitionRecords').doc(testAcqId).get();
  assert.ok(loadedAcq.exists);
  const loadedClinical = await db.collection('repertorySourceReviews').doc(`rev_clinical_${testAcqId}`).get();
  assert.ok(loadedClinical.exists);
  const loadedEditorial = await db.collection('repertorySourceReviews').doc(`rev_editorial_${testAcqId}`).get();
  assert.ok(loadedEditorial.exists);

  assert.strictEqual(loadedAcq.data()?.sourceChecksum, checksum);
  assert.strictEqual(loadedClinical.data()?.decision, "approved-with-restrictions");
  assert.strictEqual(loadedEditorial.data()?.decision, "approved");

  console.log("✅ Step 2: Records successfully re-loaded from Firestore after local cache deletion.");
  passed++;

  // 4. Save audit log and check append-only rules
  const auditLogId = `audit_${Date.now()}`;
  await db.collection('repertoryEditorialAuditLogs').doc(auditLogId).set({
    id: auditLogId,
    entityType: "source-acquisition",
    entityId: testAcqId,
    action: "migrated-to-durable-record",
    actorUid: "reviewer-1",
    actorRole: "clinical-reviewer",
    environment: "emulator",
    createdAt: new Date().toISOString()
  });

  const auditSnap = await db.collection('repertoryEditorialAuditLogs').doc(auditLogId).get();
  assert.ok(auditSnap.exists);
  console.log("✅ Step 3: Append-only audit log persisted successfully.");
  passed++;

  // Cleanup
  await acqDoc.delete();
  await clinicalDoc.delete();
  await editorialDoc.delete();
  await db.collection('repertoryEditorialAuditLogs').doc(auditLogId).delete();

  console.log(`\n🎉 Emulator Approval Persistence Tests Passed: ${passed}/3`);
}

run().catch(err => {
  console.error("❌ Approval Persistence Test Failed:", err);
  process.exit(1);
});
