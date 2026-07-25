import assert from "assert";
import { FirestoreTestHarness } from "./helpers/firestoreTestHarness";

async function run() {
  console.log("🚀 Running Firestore Emulator Fail-Closed Environment Isolation Tests...");
  let passed = 0;

  // 1. Refuses to run when FIRESTORE_EMULATOR_HOST is absent
  const savedHost = process.env.FIRESTORE_EMULATOR_HOST;
  delete process.env.FIRESTORE_EMULATOR_HOST;
  try {
    assert.throws(
      () => new FirestoreTestHarness(),
      /FIRESTORE_EMULATOR_HOST must be set/
    );
    console.log("✅ Case 1: Refuses to run when FIRESTORE_EMULATOR_HOST is absent.");
    passed++;
  } finally {
    process.env.FIRESTORE_EMULATOR_HOST = savedHost;
  }

  // 2. Refuses to run when a production project ID is supplied
  assert.throws(
    () => new FirestoreTestHarness("homeo-healthcare-prod"),
    /Invalid project ID format/
  );
  assert.throws(
    () => new FirestoreTestHarness("production-project-id"),
    /Invalid project ID format/
  );
  console.log("✅ Case 2: Refuses to run when recognized production project ID is supplied.");
  passed++;

  // 3. Clear documents fails closed when emulator port is unreachable
  const unreachableHarness = new FirestoreTestHarness("hh-test-1234567890ab");
  (unreachableHarness as any).host = "127.0.0.1:59999"; // Non-existent emulator port
  await assert.rejects(
    async () => {
      await unreachableHarness.clearDocuments();
    },
    /Failed to contact emulator clear documents endpoint/
  );
  console.log("✅ Case 3: Clear documents fails closed when emulator connection fails.");
  passed++;

  console.log(`\n🎉 Firestore Emulator Fail-Closed Isolation Tests Passed: ${passed}/3`);
}

run().catch(err => {
  console.error("❌ Fail-Closed Test Failed:", err);
  process.exit(1);
});
