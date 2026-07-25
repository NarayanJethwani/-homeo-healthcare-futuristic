import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import { TEST_SUITE_MANIFEST, TestSuiteManifestEntry } from "../src/testing/testManifest";
import { auditManifest, verifyOmittedActiveEntrySelfTest } from "./audit-test-manifest";

// Sanitize inherited environment variables
const sensitiveEnvVars = [
  "REPERTORY_USE_ADC",
  "FIRESTORE_EMULATOR_HOST",
  "REPERTORY_RUNTIME_MODE",
  "REPERTORY_ENV",
  "FIREBASE_SERVICE_ACCOUNT_KEY",
  "GOOGLE_SERVICE_ACCOUNT_KEY",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "GCLOUD_PROJECT",
  "FIRESTORE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
];

for (const envVar of sensitiveEnvVars) {
  delete process.env[envVar];
}

// Set governed test environment variables
process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
(process.env as any).NODE_ENV = "test";
process.env.GCLOUD_PROJECT = "mock-project-id";
process.env.FIRESTORE_PROJECT_ID = "mock-project-id";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "mock-project-id";

const tsconfigTestPath = path.resolve(__dirname, "../tests/tsconfig.test.json");
process.env.TS_NODE_PROJECT = tsconfigTestPath;

export function runCanonicalTestSuite() {
  console.log("🚀 Starting Canonical Test Runner with Governed Test Manifest...");
  console.log(
    `Governed Environment: NODE_ENV=${process.env.NODE_ENV}, GCLOUD_PROJECT=${process.env.GCLOUD_PROJECT}, REPERTORY_USE_MOCK_FIRESTORE=${process.env.REPERTORY_USE_MOCK_FIRESTORE}`
  );

  // 1. Audit manifest security & completeness
  const auditRes = auditManifest();
  if (!auditRes.passed) {
    console.error("❌ MANIFEST AUDIT FAILED BEFORE TEST RUN:");
    auditRes.errors.forEach(e => console.error("  -", e));
    return 1;
  }

  // 2. Run self-test for omitted active entry detection
  const selfTestPass = verifyOmittedActiveEntrySelfTest();
  if (!selfTestPass) {
    console.error("❌ MANIFEST AUDIT SELF-TEST FAILED: Omitted active entry detection failed.");
    return 1;
  }
  console.log("✅ Manifest completeness & omitted active entry self-test verified.");

  const activeSuites = TEST_SUITE_MANIFEST.filter((entry) => entry.status === "active" && entry.ownerArea !== "database-security");
  const emulatorSuites = TEST_SUITE_MANIFEST.filter((entry) => entry.status === "active" && entry.ownerArea === "database-security");
  const quarantinedSuites = TEST_SUITE_MANIFEST.filter((entry) => entry.status === "quarantined");
  const retiredSuites = TEST_SUITE_MANIFEST.filter((entry) => entry.status === "retired");

  let activePassed = 0;
  let activeFailed = 0;
  let missingFiles = 0;

  const tsNodeBin = path.resolve(__dirname, "../node_modules/ts-node/dist/bin.js");
  const tsConfigPath = path.resolve(__dirname, "../tests/tsconfig.test.json");
  const tsconfigPathsRegister = path.resolve(__dirname, "../node_modules/tsconfig-paths/register");

  console.log(`\n🚀 Executing All ${activeSuites.length} Active Test Suites...\n`);

  for (const entry of activeSuites) {
    const fullPath = path.resolve(__dirname, "..", entry.path);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Active Test File Missing: ${entry.path}`);
      missingFiles++;
      activeFailed++;
      continue;
    }

    const childEnv = {
      ...process.env,
      TS_NODE_PROJECT: tsConfigPath,
      ...(entry.env || {}),
    };

    const args = [tsNodeBin, "-P", tsConfigPath, "-r", tsconfigPathsRegister];
    if (entry.options) {
      args.push(...entry.options);
    }
    args.push(entry.path);

    const res = spawnSync(process.execPath, args, { stdio: "inherit", env: childEnv });
    if (res.status === 0) {
      console.log(`✅ Passed: ${entry.path}`);
      activePassed++;
    } else {
      console.error(`❌ Failed: ${entry.path} (exit code ${res.status})`);
      activeFailed++;
    }
  }

  console.log("\n==============================================");
  console.log("📊 CANONICAL TEST SUITE SUMMARY");
  console.log(`Total Discovered: ${TEST_SUITE_MANIFEST.length}`);
  console.log(`Active Executed:  ${activeSuites.length}`);
  console.log(`Active Passed:    ${activePassed}`);
  console.log(`Active Failed:    ${activeFailed}`);
  console.log(`Quarantined:      ${quarantinedSuites.length}`);
  console.log(`Retired Approved: ${retiredSuites.length}`);
  console.log(`Missing Files:    ${missingFiles}`);

  if (quarantinedSuites.length > 0) {
    console.log(`\n⚠️ Quarantined Test Suites (${quarantinedSuites.length}):`);
    for (const q of quarantinedSuites) {
      console.log(`  - ${q.path}: ${q.reason} (Risk: ${q.risk}, Tracking: ${q.trackingIssue}, Resolution: ${q.plannedResolution})`);
    }
  }

  if (retiredSuites.length > 0) {
    console.log("\n📜 Retired Test Suites (Coverage Replaced):");
    for (const r of retiredSuites) {
      console.log(`  - ${r.path}: ${r.reason}`);
    }
  }

  const exitCode = activeFailed > 0 ? 1 : 0;
  console.log(`\nFinal Command Exit Status: ${exitCode}`);
  return exitCode;
}

if (require.main === module) {
  const exitCode = runCanonicalTestSuite();
  process.exit(exitCode);
}
