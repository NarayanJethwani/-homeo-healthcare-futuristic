import * as fs from 'fs';
import * as path from 'path';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

async function run() {
  console.log("🚀 Running Firestore Rules Client-SDK Unit Tests...");

  const rulesContent = fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8');

  const testEnv = await initializeTestEnvironment({
    projectId: 'homeo-healthcare-emulator',
    firestore: {
      rules: rulesContent,
      host: '127.0.0.1',
      port: 8080
    }
  });

  // Clear data first
  await testEnv.clearFirestore();

  // Seed user profiles in users/{uid}
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users/doc-user'), { role: 'practitioner', email: 'doc@example.com' });
    await setDoc(doc(db, 'users/clinical-user'), { role: 'clinical-reviewer', email: 'clinical@example.com' });
    await setDoc(doc(db, 'users/editor-user'), { role: 'editor', email: 'editor@example.com' });
    await setDoc(doc(db, 'users/admin-user'), { role: 'admin', email: 'admin@example.com' });
    
    // Seed some test data
    await setDoc(doc(db, 'repertoryAcquisitionRecords/acq_clarke_1904_001'), { sourceId: 'clarke_clinical_1904' });
    await setDoc(doc(db, 'repertorySourceReviews/rev_clinical_clarke_1904'), { decision: 'approved-with-restrictions' });
    await setDoc(doc(db, 'repertoryActiveCorpusPointer/active'), { activeVersion: 'v1.1.0' });
    await setDoc(doc(db, 'repertoryEditorialAuditLogs/audit_123'), { action: 'migrate' });
  });

  let passed = 0;

  // 1. Unauthenticated Client
  const unauthDb = testEnv.unauthenticatedContext().firestore();

  // Reads must fail
  await assertFails(getDoc(doc(unauthDb, 'repertoryAcquisitionRecords/acq_clarke_1904_001')));
  await assertFails(getDoc(doc(unauthDb, 'repertorySourceReviews/rev_clinical_clarke_1904')));
  await assertFails(getDoc(doc(unauthDb, 'repertoryActiveCorpusPointer/active')));
  await assertFails(getDoc(doc(unauthDb, 'repertoryEditorialAuditLogs/audit_123')));

  // Writes must fail
  await assertFails(setDoc(doc(unauthDb, 'repertoryAcquisitionRecords/acq_unauth'), { val: 1 }));
  await assertFails(setDoc(doc(unauthDb, 'repertorySourceReviews/rev_unauth'), { val: 1 }));
  await assertFails(setDoc(doc(unauthDb, 'repertoryActiveCorpusPointer/unauth'), { val: 1 }));
  await assertFails(setDoc(doc(unauthDb, 'repertoryEditorialAuditLogs/audit_unauth'), { val: 1 }));

  console.log("✅ Assert 1: Unauthenticated client blocked from all reads and writes.");
  passed++;

  // 2. Ordinary Practitioner
  const practitionerDb = testEnv.authenticatedContext('doc-user').firestore();

  // Reads
  await assertSucceeds(getDoc(doc(practitionerDb, 'repertoryActiveCorpusPointer/active')));
  await assertFails(getDoc(doc(practitionerDb, 'repertoryAcquisitionRecords/acq_clarke_1904_001')));
  await assertFails(getDoc(doc(practitionerDb, 'repertorySourceReviews/rev_clinical_clarke_1904')));
  await assertFails(getDoc(doc(practitionerDb, 'repertoryEditorialAuditLogs/audit_123')));

  // Writes
  await assertFails(setDoc(doc(practitionerDb, 'repertoryActiveCorpusPointer/active'), { activeVersion: 'v1.2.0' }));
  await assertFails(setDoc(doc(practitionerDb, 'repertoryAcquisitionRecords/acq_clarke_1904_001'), { sourceId: 'clarke' }));
  await assertFails(setDoc(doc(practitionerDb, 'repertorySourceReviews/rev_clinical_clarke_1904'), { val: 1 }));
  await assertFails(setDoc(doc(practitionerDb, 'repertoryEditorialAuditLogs/audit_123'), { val: 1 }));

  console.log("✅ Assert 2: Ordinary practitioner permitted to read pointer but blocked from writes/operational reads.");
  passed++;

  // 3. Clinical Reviewer / Editor
  const clinicalDb = testEnv.authenticatedContext('clinical-user').firestore();
  const editorDb = testEnv.authenticatedContext('editor-user').firestore();

  // Reads succeed
  await assertSucceeds(getDoc(doc(clinicalDb, 'repertoryAcquisitionRecords/acq_clarke_1904_001')));
  await assertSucceeds(getDoc(doc(clinicalDb, 'repertorySourceReviews/rev_clinical_clarke_1904')));
  await assertSucceeds(getDoc(doc(editorDb, 'repertoryAcquisitionRecords/acq_clarke_1904_001')));
  await assertSucceeds(getDoc(doc(editorDb, 'repertorySourceReviews/rev_clinical_clarke_1904')));

  // Writes must fail
  await assertFails(setDoc(doc(clinicalDb, 'repertoryAcquisitionRecords/acq_clarke_1904_001'), { sourceId: 'hack' }));
  await assertFails(setDoc(doc(editorDb, 'repertorySourceReviews/rev_clinical_clarke_1904'), { val: 'hack' }));

  console.log("✅ Assert 3: Reviewers/editors permitted to read operational records but blocked from client writes.");
  passed++;

  // 4. Audit Log Immutability
  const adminDb = testEnv.authenticatedContext('admin-user').firestore();

  // Clinical Reviewer can read audit log
  await assertSucceeds(getDoc(doc(clinicalDb, 'repertoryEditorialAuditLogs/audit_123')));
  // Editor cannot read audit log (only admin or clinical-reviewer)
  await assertFails(getDoc(doc(editorDb, 'repertoryEditorialAuditLogs/audit_123')));

  // Writes must fail for all client SDK contexts, even admin!
  await assertFails(setDoc(doc(adminDb, 'repertoryEditorialAuditLogs/audit_456'), { action: 'delete' }));
  await assertFails(updateDoc(doc(clinicalDb, 'repertoryEditorialAuditLogs/audit_123'), { action: 'hack' }));
  await assertFails(deleteDoc(doc(clinicalDb, 'repertoryEditorialAuditLogs/audit_123')));

  console.log("✅ Assert 4: Audit logs are read-restricted and fully immutable for client writes.");
  passed++;

  await testEnv.cleanup();
  console.log(`\n🎉 Firestore Rules Client Tests Passed: ${passed}/4`);
}

run().catch(e => {
  console.error("❌ Firestore Rules Client Test Failed:", e);
  process.exit(1);
});
