import fs from "fs";
import path from "path";
import child_process from "child_process";

// Parse CLI Arguments
function parseArgs() {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].substring(2);
      const val = argv[i + 1];
      if (val && !val.startsWith('--')) {
        args[key] = val;
        i++;
      } else {
        args[key] = 'true';
      }
    }
  }
  return args;
}

const args = parseArgs();
const mode = args.mode || "production"; // default mode is production

console.log(`🚀 verify-production-readiness.ts started in mode: ${mode}`);

type VerificationCheckResult = {
  id: string;
  command?: string;
  status: "passed" | "failed" | "blocked" | "not-run";
  exitCode?: number;
  durationMs?: number;
  details?: Record<string, unknown>;
};

const results: VerificationCheckResult[] = [];

// Helper to run external subcommands safely without shell injection
function runSubprocess(id: string, cmd: string, cmdArgs: string[]): VerificationCheckResult {
  console.log(`🏃 Running subcommand: ${cmd} ${cmdArgs.join(' ')}`);
  const start = Date.now();
  try {
    const isEmulatorTask = [
      "rules-unit-testing",
      "durable-consistency-test",
      "approval-persistence-test",
      "activation-gate-test",
      "artifact-deployment-test",
      "clarke-safety-test",
      "snapshot-activation-test"
    ].includes(id);

    const subprocessEnv: Record<string, string> = {
      ...process.env,
      NODE_ENV: 'test',
      NODE_OPTIONS: '--max-old-space-size=5120'
    };
    if (isEmulatorTask) {
      subprocessEnv.REPERTORY_RUNTIME_MODE = 'emulator';
    } else {
      delete subprocessEnv.REPERTORY_RUNTIME_MODE;
      delete subprocessEnv.REPERTORY_ENV;
    }
    if (id === "next-build") {
      delete subprocessEnv.FIRESTORE_EMULATOR_HOST;
    }

    const res = child_process.spawnSync(cmd, cmdArgs, {
      stdio: 'inherit',
      env: subprocessEnv as any
    });
    const duration = Date.now() - start;
    if (res.status === 0) {
      console.log(`✅ ${id} passed in ${duration}ms`);
      return { id, command: `${cmd} ${cmdArgs.join(' ')}`, status: 'passed', exitCode: 0, durationMs: duration };
    } else {
      console.error(`❌ ${id} failed with exit code ${res.status}`);
      return { id, command: `${cmd} ${cmdArgs.join(' ')}`, status: 'failed', exitCode: res.status ?? 1, durationMs: duration };
    }
  } catch (err: any) {
    const duration = Date.now() - start;
    console.error(`❌ ${id} crashed:`, err.message);
    return { id, command: `${cmd} ${cmdArgs.join(' ')}`, status: 'failed', exitCode: 1, durationMs: duration, details: { error: err.message } };
  }
}

// ─── 1. Static Verification Tasks ──────────────────────────────────────────
function runStaticVerification(): VerificationCheckResult[] {
  console.log("\n--- Running Static verification ---");
  const localResults: VerificationCheckResult[] = [];
  
  // Linting
  const lintRes = runSubprocess("lint", "npx", ["eslint"]);
  localResults.push(lintRes);

  // TypeScript typecheck
  const typecheckRes = runSubprocess("typecheck", "npx", ["tsc", "--noEmit", "--project", "tsconfig.verify.json"]);
  localResults.push(typecheckRes);

  return localResults;
}

// ─── 2. Corpus Verification Tasks ──────────────────────────────────────────
function runCorpusVerification(): VerificationCheckResult[] {
  console.log("\n--- Running Corpus verification ---");
  const localResults: VerificationCheckResult[] = [];

  // Snapshot reconciliation
  const reconcileRes = runSubprocess(
    "snapshot-reconciliation",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "scripts/repertory/reconcileSnapshot.ts", "--release", "v1.2.0"]
  );
  localResults.push(reconcileRes);

  // Source Validation (checksums and metadata)
  const sourceValRes = runSubprocess(
    "source-validation",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "scripts/repertory/validateSource.ts", "--source", "clarke_clinical_1904", "--record", "acq_clarke_1904_001"]
  );
  localResults.push(sourceValRes);

  return localResults;
}

// ─── 3. Security Verification Tasks ────────────────────────────────────────
function runSecurityVerification(): VerificationCheckResult[] {
  console.log("\n--- Running Security verification ---");
  const localResults: VerificationCheckResult[] = [];
  const start = Date.now();
  let passed = true;
  const details: Record<string, any> = {};

  try {
    // Check documentation files exist
    const opDocs = [
      "docs/operations/PRODUCTION_READINESS_CHECKLIST.md",
      "docs/operations/RELEASE_GOVERNANCE.md",
      "docs/operations/INCIDENT_RUNBOOKS.md",
      "docs/operations/ENVIRONMENT_VARIABLES.md",
      "docs/operations/SECURITY_AND_RBAC.md"
    ];
    opDocs.forEach(docPath => {
      if (!fs.existsSync(path.join(process.cwd(), docPath))) {
        passed = false;
        console.error(`❌ Missing operations doc: ${docPath}`);
      }
    });

    // Check rbac.ts permissions (SUBSCRIPTION_MANAGE check)
    const rbacPath = path.join(process.cwd(), "src/lib/security/rbac.ts");
    if (fs.existsSync(rbacPath)) {
      const content = fs.readFileSync(rbacPath, "utf8");
      if (!content.includes("SUBSCRIPTION_MANAGE")) {
        passed = false;
        console.error("❌ SUBSCRIPTION_MANAGE permission is missing in rbac.ts");
      }
    } else {
      passed = false;
      console.error("❌ rbac.ts file is missing!");
    }

    // Verify warnings in timeline / attachments
    const uploadValidationPath = path.join(process.cwd(), "src/features/patient-attachments/uploadValidation.ts");
    if (fs.existsSync(uploadValidationPath)) {
      const validationContent = fs.readFileSync(uploadValidationPath, "utf8");
      if (!validationContent.includes("application/pdf") || !validationContent.includes("image/jpeg")) {
        passed = false;
        console.error("❌ Upload validation MIME check list is missing application/pdf or image/jpeg");
      }
    } else {
      passed = false;
      console.error("❌ uploadValidation.ts file is missing!");
    }

    const duration = Date.now() - start;
    localResults.push({
      id: "security-static-audit",
      status: passed ? "passed" : "failed",
      durationMs: duration,
      details
    });

    // Run security-related test files
    const securityTest = runSubprocess(
      "rbac-security-test",
      "npx",
      ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/rbacSecurity.test.ts"]
    );
    localResults.push(securityTest);

  } catch (err: any) {
    localResults.push({
      id: "security-static-audit",
      status: "failed",
      durationMs: Date.now() - start,
      details: { error: err.message }
    });
  }

  return localResults;
}

// ─── 4. Next.js Build Tasks ────────────────────────────────────────────────
function runBuildVerification(): VerificationCheckResult[] {
  console.log("\n--- Running Build verification ---");
  const localResults: VerificationCheckResult[] = [];

  // Next.js build directly
  const buildRes = runSubprocess("next-build", "npx", ["next", "build", "--webpack"]);
  localResults.push(buildRes);

  return localResults;
}

// ─── 5. Emulator Verification Tasks ────────────────────────────────────────
function runEmulatorVerification(): VerificationCheckResult[] {
  console.log("\n--- Running Emulator-dependent verification ---");
  const localResults: VerificationCheckResult[] = [];

  // A. Rules unit tests using Rules Unit Testing and client SDK identities
  const rulesClientRes = runSubprocess(
    "rules-unit-testing",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/firestoreRulesClient.test.ts"]
  );
  localResults.push(rulesClientRes);

  // B. Durable consistency (separate process pointer transitions)
  const durableRes = runSubprocess(
    "durable-consistency-test",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/repertoryDurableConsistency.test.ts"]
  );
  localResults.push(durableRes);

  // C. Approval persistence and cache deletion resilience
  const approvalRes = runSubprocess(
    "approval-persistence-test",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/repertoryApprovalPersistence.test.ts"]
  );
  localResults.push(approvalRes);

  // D. Emulator Activation Gate
  const gateRes = runSubprocess(
    "activation-gate-test",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/repertoryProductionActivationGate.test.ts"]
  );
  localResults.push(gateRes);

  // E. Artifact Deployment (Contract tests)
  const artifactRes = runSubprocess(
    "artifact-deployment-test",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/repertoryArtifactDeployment.test.ts"]
  );
  localResults.push(artifactRes);

  // F. Search and RAG Smoke/Scoring isolation tests
  const clarkeSafetyRes = runSubprocess(
    "clarke-safety-test",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/repertoryClarkeSafety.test.ts"]
  );
  localResults.push(clarkeSafetyRes);

  const snapshotActivationRes = runSubprocess(
    "snapshot-activation-test",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/repertorySnapshotActivation.test.ts"]
  );
  localResults.push(snapshotActivationRes);

  return localResults;
}

// Write report helper
function writeReport(filePath: string, modeName: string, state: string, checkResults: VerificationCheckResult[]) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const report = {
    generatedAt: new Date().toISOString(),
    mode: modeName,
    releaseState: state,
    results: checkResults
  };
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");
  console.log(`📝 JSON report written to: ${filePath}`);
}

async function main() {
  let passedOverall = true;

  if (mode === "static") {
    const res = runStaticVerification();
    results.push(...res);
    passedOverall = res.every(r => r.status === "passed");
  } else if (mode === "corpus") {
    const res = runCorpusVerification();
    results.push(...res);
    passedOverall = res.every(r => r.status === "passed");
  } else if (mode === "security") {
    const res = runSecurityVerification();
    results.push(...res);
    passedOverall = res.every(r => r.status === "passed");
  } else if (mode === "build") {
    const res = runBuildVerification();
    results.push(...res);
    passedOverall = res.every(r => r.status === "passed");
  } else if (mode === "production") {
    // Run all non-emulator production checks
    const resStatic = runStaticVerification();
    const resCorpus = runCorpusVerification();
    const resSecurity = runSecurityVerification();
    const resBuild = runBuildVerification();
    
    results.push(...resStatic, ...resCorpus, ...resSecurity, ...resBuild);
    passedOverall = results.every(r => r.status === "passed");

    const state = passedOverall ? "production-deployment-ready" : "failed";
    const reportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
    writeReport(reportPath, "production", state, results);
  } else if (mode === "emulator") {
    // Run emulator checks
    const res = runEmulatorVerification();
    results.push(...res);
    passedOverall = res.every(r => r.status === "passed");

    const state = passedOverall ? "emulator-verified" : "failed";
    const reportPath = path.join(process.cwd(), "reports", "emulator-verification-report.json");
    writeReport(reportPath, "emulator", state, results);
  } else if (mode === "release") {
    // Orchestrate both
    console.log("\n=== ORCHESTRATING FULL RELEASE VERIFICATION ===");
    
    const resStatic = runStaticVerification();
    const resCorpus = runCorpusVerification();
    const resSecurity = runSecurityVerification();
    const resBuild = runBuildVerification();
    
    const nonEmulatorPassed = [...resStatic, ...resCorpus, ...resSecurity, ...resBuild].every(r => r.status === "passed");
    
    let resEmulator: VerificationCheckResult[] = [];
    if (nonEmulatorPassed) {
      console.log("\n✨ Non-emulator checks passed. Booting Firestore Emulator for verification...");
      const start = Date.now();
      const emulatorRun = child_process.spawnSync("npx", [
        "firebase-tools", "emulators:exec",
        "--only", "firestore",
        "--project", "homeo-healthcare-emulator",
        "npm run verify:emulator"
      ], { stdio: 'inherit', env: { ...process.env, JAVA_HOME: "/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home" } });
      
      const duration = Date.now() - start;
      if (emulatorRun.status === 0) {
        const reportPath = path.join(process.cwd(), "reports", "emulator-verification-report.json");
        if (fs.existsSync(reportPath)) {
          const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
          resEmulator = report.results;
        } else {
          resEmulator = [{ id: "emulator-verification", status: "passed", durationMs: duration }];
        }
      } else {
        resEmulator = [{ id: "emulator-verification", status: "failed", durationMs: duration, exitCode: emulatorRun.status ?? 1 }];
      }
    } else {
      console.log("\n❌ Non-emulator checks failed. Skipping emulator verification.");
      resEmulator = [{ id: "emulator-verification", status: "not-run" }];
    }

    results.push(...resStatic, ...resCorpus, ...resSecurity, ...resBuild, ...resEmulator);
    passedOverall = results.every(r => r.status === "passed");

    const state = passedOverall ? "production-deployment-ready" : "failed";
    const reportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
    writeReport(reportPath, "release", state, results);
  } else {
    console.error(`❌ Unknown mode: ${mode}`);
    process.exit(1);
  }

  if (passedOverall) {
    console.log(`\n🎉 Verification SUCCESS for mode ${mode}!`);
    process.exit(0);
  } else {
    console.error(`\n🚨 Verification FAILED for mode ${mode}!`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("❌ Critical crash in main verification script:", err);
  process.exit(1);
});
