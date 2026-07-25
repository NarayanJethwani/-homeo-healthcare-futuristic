import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

async function runEmulatorSuites() {
  console.log("🚀 Starting Governed Firestore Emulator Suite Runner...");

  const projId = "hh-test-1234567890ab";
  const host = "127.0.0.1:8080";

  // Check fail-closed security invariants
  const prodKeys = ["FIREBASE_SERVICE_ACCOUNT_KEY", "GOOGLE_APPLICATION_CREDENTIALS"];
  for (const key of prodKeys) {
    if (process.env[key]) {
      console.error(`❌ SECURITY ERROR: Production credential ${key} detected. Aborting emulator run.`);
      process.exit(1);
    }
  }

  // Ensure port 8080 is clear before starting
  try {
    spawnSync("lsof -ti :8080 | xargs kill -9", { shell: true });
  } catch (e) {}

  const dbSuites = [
    "tests/firestoreEmulatorFailClosed.test.ts",
    "tests/firestoreRulesClient.test.ts",
    "tests/materiaMedicaPersistence.test.ts",
    "tests/repertoryApprovalPersistence.test.ts",
    "tests/repertoryDurableConsistency.test.ts",
    "tests/repertoryProductionActivationGate.test.ts",
    "tests/phase2-2bGovernancePersistence.test.ts"
  ];

  const envVars = {
    ...process.env,
    NODE_ENV: "test",
    REPERTORY_ENV: "emulator",
    REPERTORY_RUNTIME_MODE: "emulator",
    REPERTORY_TEST_ENV: "emulator",
    REPERTORY_USE_MOCK_FIRESTORE: "false",
    FIRESTORE_EMULATOR_HOST: host,
    FIRESTORE_PROJECT_ID: projId,
    GCLOUD_PROJECT: projId,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: projId
  };

  const tsNodeCmds = dbSuites
    .map(s => `npx ts-node -P tests/tsconfig.test.json -r tsconfig-paths/register "${s}"`)
    .join(" && ");

  const execCmd = `npx -y firebase-tools emulators:exec --only firestore "${tsNodeCmds}"`;

  const startTime = Date.now();
  const res = spawnSync(execCmd, {
    shell: true,
    cwd: process.cwd(),
    encoding: "utf8",
    env: envVars
  });
  const duration = Date.now() - startTime;
  const passed = res.status === 0;

  console.log(res.stdout);
  if (!passed) {
    console.error(res.stderr);
  }

  const results = dbSuites.map(s => ({
    suite: s,
    passed,
    durationMs: Math.round(duration / dbSuites.length),
    exitCode: res.status ?? 1
  }));

  console.log(`\n==============================================`);
  console.log(`📊 FIRESTORE EMULATOR TEST SUITE SUMMARY`);
  console.log(`Total Emulator Suites: ${dbSuites.length}`);
  console.log(`Passed Suites:         ${passed ? dbSuites.length : 0}`);
  console.log(`Failed Suites:         ${passed ? 0 : dbSuites.length}`);
  console.log(`Total Execution Time:  ${duration}ms`);
  console.log(`==============================================`);

  // Write results json
  const summaryReport = {
    timestamp: new Date().toISOString(),
    emulatorHost: host,
    projectId: projId,
    totalSuites: dbSuites.length,
    passedSuites: passed ? dbSuites.length : 0,
    failedSuites: passed ? 0 : dbSuites.length,
    durationMs: duration,
    results
  };

  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync("reports/firestore-emulator-suite-results.json", JSON.stringify(summaryReport, null, 2), "utf8");
  console.log("Saved reports/firestore-emulator-suite-results.json");

  if (!passed) {
    process.exit(1);
  }
}

runEmulatorSuites().catch(err => {
  console.error("❌ Emulator Runner Error:", err);
  process.exit(1);
});
