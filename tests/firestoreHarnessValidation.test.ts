import { resolveBackendMode, resetMockDb, getAdminDb } from "../src/lib/firebaseAdmin";
import { validateEmulatorHost } from "./helpers/firestoreTestHarness";
import assert from "assert";

async function run() {
  console.log("🚀 Running Firestore Harness Validation Tests...");
  let passed = 0;

  const originalEnv = { ...process.env };

  function clearEnv() {
    delete process.env.REPERTORY_USE_MOCK_FIRESTORE;
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.REPERTORY_USE_ADC;
    delete process.env.FIRESTORE_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    delete process.env.GCLOUD_PROJECT;
  }

  // Test 1: Validate Emulator Host constraints
  try {
    validateEmulatorHost("localhost:8080");
    validateEmulatorHost("127.0.0.1:8080");
    validateEmulatorHost("[::1]:8080");
    passed++;
  } catch (err) {
    assert.fail("Valid loopback hosts should pass.");
  }

  // Test 2: Invalid host rejection
  const invalidHosts = [
    "http://127.0.0.1:8080",
    "127.0.0.1",
    "127.0.0.1:080",
    "127.0.0.1:65536",
    "0.0.0.0:8080",
    "192.168.1.1:8080",
    "localhost:abc",
    "localhost:8080/path"
  ];
  for (const invalid of invalidHosts) {
    assert.throws(() => validateEmulatorHost(invalid), `Should reject host: ${invalid}`);
  }
  passed++;

  // Test 3: Conflicting configurations
  clearEnv();
  process.env.REPERTORY_USE_MOCK_FIRESTORE = 'true';
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  assert.throws(() => resolveBackendMode(), /Conflicting backend modes configured/);
  passed++;

  // Test 4: Fail-closed on test mode unconfigured
  clearEnv();
  process.env.NODE_ENV = 'test';
  process.env.REPERTORY_USE_MOCK_FIRESTORE = 'false';
  const mode = resolveBackendMode();
  assert.strictEqual(mode, 'unconfigured');
  assert.throws(() => getAdminDb(), /Firestore is unconfigured/);
  passed++;

  // Test 5: Mock Database reset restriction
  clearEnv();
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIRESTORE_PROJECT_ID = 'hh-test-1234567890ab';
  assert.throws(() => resetMockDb(), /Reset mock database is only permitted in mock mode/);
  passed++;

  // Test 6: Redaction / Safety checks ensuring no credential leak in error messages and console logs
  clearEnv();
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify({
    project_id: "wrong-project-id",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDh...\n-----END PRIVATE KEY-----"
  });
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "homeo-healthcare";

  let capturedErrorMsg = "";
  let consoleOutput = "";

  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  console.error = (...args: any[]) => { consoleOutput += args.join(" "); };
  console.warn = (...args: any[]) => { consoleOutput += args.join(" "); };

  try {
    resolveBackendMode();
  } catch (err: any) {
    capturedErrorMsg = err.message;
  } finally {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }

  assert.strictEqual(capturedErrorMsg, "Configuration Error: Mismatched project ID in production credentials.");

  const sensitiveSentinels = [
    "PRIVATE KEY",
    "wrong-project-id",
    "homeo-healthcare",
    "FIREBASE_SERVICE_ACCOUNT_KEY",
    "GOOGLE_SERVICE_ACCOUNT_KEY"
  ];
  for (const sentinel of sensitiveSentinels) {
    assert.ok(!capturedErrorMsg.includes(sentinel), `Error message must not leak: ${sentinel}`);
    assert.ok(!consoleOutput.includes(sentinel), `Console output must not leak: ${sentinel}`);
  }
  passed++;

  clearEnv();
  Object.assign(process.env, originalEnv);

  console.log(`✅ Firestore Harness Validation Tests Passed: ${passed}/6`);
}

run().catch(err => {
  console.error("Harness validation test failed:", err);
  process.exit(1);
});
