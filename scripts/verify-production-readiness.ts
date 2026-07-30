import fs from "fs";
import path from "path";
import child_process from "child_process";


// ─── SHA-bound dirty-tree enforcement ──────────────────────────────────────
// Captures HEAD SHA and working-tree status at a point in time.
// Called BEFORE and AFTER all verification checks. If HEAD moved or the
// working tree became dirty during the run, readiness is blocked regardless
// of whether individual checks passed.
function captureGitState(): { sha: string; isDirty: boolean; statusLines: string } {
  try {
    const sha = child_process
      .spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' })
      .stdout.trim();
    const status = child_process
      .spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' })
      .stdout.trim();

    const lines = status.split('\n').map(l => l.trim()).filter(Boolean);
    const unexpected = lines.filter(line => {
      const match = line.match(/^\s*([A-Z?!]{1,2})\s+(.*)$/);
      if (!match) return true;
      const filePath = match[2].replace(/^"|"$/g, '').trim();
      const isReport = filePath === "reports/production-readiness-report.json" ||
                       filePath === "reports/emulator-verification-report.json";
      return !isReport;
    });

    if (unexpected.length > 0) {
      console.log(`[captureGitState DEBUG] Unexpected dirty files:`, unexpected);
    }

    return {
      sha,
      isDirty: unexpected.length > 0,
      statusLines: unexpected.join('\n')
    };
  } catch (e: any) {
    return { sha: 'UNKNOWN', isDirty: true, statusLines: "git error: Git command execution failed" };
  }
}


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

interface VerificationCheckResult {
  id: string;
  command?: string;
  status: 'passed' | 'failed' | 'not-run';
  exitCode?: number;
  durationMs?: number;
  details?: Record<string, any>;
}

const results: VerificationCheckResult[] = [];

// Helper to spawn subprocesses portably
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

    const isUnitTest = cmdArgs.some(arg =>
      arg.includes('.test.ts') &&
      !arg.includes('repertoryApprovalPersistence') &&
      !arg.includes('repertoryProductionActivationGate') &&
      !arg.includes('repertoryDurableConsistency') &&
      !arg.includes('firestoreRulesClient') &&
      !arg.includes('materiaMedicaPersistence')
    ) || id.startsWith('security-test:') || id === 'lint' || id === 'typecheck' || id === 'test:ui' || id === 'test:unit' || id === 'harness-validation';

    if (isUnitTest) {
      subprocessEnv.REPERTORY_USE_MOCK_FIRESTORE = 'true';
      delete subprocessEnv.FIRESTORE_EMULATOR_HOST;
      delete subprocessEnv.REPERTORY_RUNTIME_MODE;
      delete subprocessEnv.REPERTORY_ENV;
      delete subprocessEnv.FIREBASE_SERVICE_ACCOUNT_KEY;
      delete subprocessEnv.GOOGLE_SERVICE_ACCOUNT_KEY;
      delete subprocessEnv.GOOGLE_APPLICATION_CREDENTIALS;
      delete subprocessEnv.REPERTORY_USE_ADC;
    } else if (isEmulatorTask) {
      subprocessEnv.REPERTORY_RUNTIME_MODE = 'emulator';
      subprocessEnv.REPERTORY_ENV = 'emulator';
      subprocessEnv.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
      const resolvedProj = process.env.FIRESTORE_PROJECT_ID || process.env.GCLOUD_PROJECT;
      if (!resolvedProj) {
        throw new Error("Configuration Error: FIRESTORE_PROJECT_ID or GCLOUD_PROJECT must be set in emulator mode.");
      }
      subprocessEnv.FIRESTORE_PROJECT_ID = resolvedProj;
      delete subprocessEnv.REPERTORY_USE_MOCK_FIRESTORE;
    } else {
      delete subprocessEnv.REPERTORY_RUNTIME_MODE;
      delete subprocessEnv.REPERTORY_ENV;
    }

    if (id === "next-build") {
      delete subprocessEnv.FIRESTORE_EMULATOR_HOST;
      delete subprocessEnv.FIRESTORE_PROJECT_ID;
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
    console.error(`❌ ${id} crashed:`, "Verification subcommand crashed during execution");
    return { id, command: `${cmd} ${cmdArgs.join(' ')}`, status: 'failed', exitCode: 1, durationMs: duration, details: { error: "Verification subcommand crashed during execution" } };
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
  const typecheckRes = runSubprocess("typecheck", "npx", ["tsc", "--noEmit", "-p", "tsconfig.json"]);
  localResults.push(typecheckRes);

  // Vitest UI tests
  const uiTestRes = runSubprocess("test:ui", "npx", [
    "vitest",
    "run",
    "tests/knowledgeGraphExplorer.test.tsx",
    "tests/hydrationAndTiming.test.tsx",
    "tests/graphPerformance.test.tsx",
    "tests/miasmaticFiltering.test.tsx",
    "tests/providerTelemetryDashboard.test.tsx"
  ]);
  localResults.push(uiTestRes);

  // Harness safety checks validation
  const harnessValRes = runSubprocess(
    "harness-validation",
    "npx",
    ["ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", "tests/firestoreHarnessValidation.test.ts"]
  );
  localResults.push(harnessValRes);

  // Unit tests
  const unitTestRes = runSubprocess("test:unit", "npm", ["run", "test:unit"]);
  localResults.push(unitTestRes);

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
    for (const docFile of opDocs) {
      const p = path.join(process.cwd(), docFile);
      if (!fs.existsSync(p)) {
        console.error(`❌ Security doc missing: ${docFile}`);
        passed = false;
        details[docFile] = "missing";
      } else {
        details[docFile] = "verified";
      }
    }

    // Run security-specific test scripts
    const securityTests = [
      "rbacSecurity.test",
      "repertoryEntitlementExport.test",
      "repertoryExportRoute.test",
      "repertorySessionExportService.test",
      "repertoryExportAuthorization.test",
      "aiSecurityBoundary.test",
      "repertoryRouteSecurity.test"
    ];

    for (const testName of securityTests) {
      const scriptPath = path.join("tests", `${testName}.ts`);
      const testRes = runSubprocess(`security-test:${testName}`, "npx", [
        "ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", scriptPath
      ]);
      localResults.push(testRes);
      if (testRes.status !== "passed") {
        passed = false;
      }
    }

    localResults.push({
      id: "security-static-audit",
      status: passed ? "passed" : "failed",
      durationMs: Date.now() - start,
      details
    });
  } catch (err: any) {
    localResults.push({
      id: "security-static-audit",
      status: "failed",
      durationMs: Date.now() - start,
      details: { error: "Security audit checks failed due to an internal execution error" }
    });
  }

  return localResults;
}

// ─── 4. Build Verification Tasks ───────────────────────────────────────────
function runBuildVerification(): VerificationCheckResult[] {
  console.log("\n--- Running Build verification ---");
  const localResults: VerificationCheckResult[] = [];
  const buildRes = runSubprocess("next-build", "npx", ["next", "build", "--webpack"]);
  localResults.push(buildRes);
  return localResults;
}

// ─── 5. Emulator Verification Tasks ────────────────────────────────────────
function runEmulatorVerification(): VerificationCheckResult[] {
  console.log("\n--- Running Emulator verification ---");
  const localResults: VerificationCheckResult[] = [];

  const emuTests = [
    { id: "rules-unit-testing", path: "tests/firestoreRulesClient.test.ts" },
    { id: "durable-consistency-test", path: "tests/repertoryDurableConsistency.test.ts" },
    { id: "approval-persistence-test", path: "tests/repertoryApprovalPersistence.test.ts" },
    { id: "activation-gate-test", path: "tests/repertoryProductionActivationGate.test.ts" },
    { id: "artifact-deployment-test", path: "tests/repertoryArtifactDeployment.test.ts" },
    { id: "clarke-safety-test", path: "tests/repertoryClarkeSafety.test.ts" },
    { id: "snapshot-activation-test", path: "tests/repertorySnapshotActivation.test.ts" }
  ];

  for (const t of emuTests) {
    const testRes = runSubprocess(t.id, "npx", [
      "ts-node", "-P", "tests/tsconfig.test.json", "-r", "tsconfig-paths/register", t.path
    ]);
    localResults.push(testRes);
  }

  return localResults;
}

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

  // ── Git state capture (always) ────────────────────────────────────────────
  // Captured here for all modes so SHA is available for reporting.
  // The dirty-tree *block* is only enforced in production/release modes below.
  const preState = captureGitState();
  console.log(`\n📌 PRE-CHECK  SHA: ${preState.sha}`);

  if (mode === "static") {
    const res = runStaticVerification();
    results.push(...res);
    passedOverall = res.every(r => r.status === "passed");
  } else if (mode === "validate-evidence") {
    console.log("\n=== VALIDATING EVIDENCE COMMIT LINEAGE ===");

    // 1. Raw clean working tree at validation start
    if (preState.isDirty) {
      console.error("❌ Lineage check failed: Working tree is dirty at validation start.");
      console.log(preState.statusLines);
      process.exit(1);
    }

    // Check if HEAD commit actually modifies the reports
    const prDiffFiles = child_process.spawnSync('git', ['diff', '--name-only', 'HEAD~1', 'HEAD'], { encoding: 'utf8' })
      .stdout.trim()
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const hasReports = prDiffFiles.includes("reports/production-readiness-report.json") ||
                       prDiffFiles.includes("reports/emulator-verification-report.json");

    if (!hasReports) {
      console.log("ℹ️ No reports modified in the HEAD commit. Skipping lineage validation for non-release PR.");
      process.exit(0);
    }

    const prodReportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
    const emuReportPath = path.join(process.cwd(), "reports", "emulator-verification-report.json");

    if (!fs.existsSync(prodReportPath) || !fs.existsSync(emuReportPath)) {
      console.error("❌ Missing required verification reports.");
      process.exit(1);
    }

    const prodReport = JSON.parse(fs.readFileSync(prodReportPath, 'utf8'));
    const emuReport = JSON.parse(fs.readFileSync(emuReportPath, 'utf8'));

    const parentSha = child_process.spawnSync('git', ['rev-parse', 'HEAD~1'], { encoding: 'utf8' }).stdout.trim();

    console.log(`Verifying reports are bound to parent SHA: ${parentSha}`);
    console.log(`Production Report SHA: ${prodReport.headSha}`);
    console.log(`Emulator Report SHA: ${emuReport.headSha}`);

    if (prodReport.headSha !== parentSha || emuReport.headSha !== parentSha) {
      console.error("❌ Reports are not bound to the correct parent code commit SHA.");
      process.exit(1);
    }

    if (prodReport.dirtyAtStart || prodReport.dirtyAtEnd || emuReport.dirtyAtStart || emuReport.dirtyAtEnd) {
      console.error("❌ Reports indicate the verification run was performed on a dirty tree.");
      process.exit(1);
    }

    // 2. Evidence commit containing exactly two reports
    const diffFiles = child_process.spawnSync('git', ['diff', '--name-only', 'HEAD~1', 'HEAD'], { encoding: 'utf8' })
      .stdout.trim()
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    console.log("Files modified in the evidence commit:", diffFiles);

    const nonReportFiles = diffFiles.filter(f =>
      !f.startsWith("reports/")
    );

    if (nonReportFiles.length > 0) {
      console.error("❌ Evidence commit contains non-report files:", nonReportFiles);
      process.exit(1);
    }

    if (!diffFiles.includes("reports/production-readiness-report.json") ||
        !diffFiles.includes("reports/emulator-verification-report.json")) {
      console.error("❌ Evidence commit must contain exactly both verification reports.");
      process.exit(1);
    }

    // 3. Code commit free of reports, generated manifests and debug output
    const codeDiffFiles = child_process.spawnSync('git', ['diff', '--diff-filter=d', '--name-only', 'HEAD~2', 'HEAD~1'], { encoding: 'utf8' })
      .stdout.trim()
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    console.log("Files modified in the code commit:", codeDiffFiles);

    const dirtyFilesInCodeCommit = codeDiffFiles.filter(f =>
      f.startsWith("data/repertory/manifests/manifest_v_test") ||
      f.endsWith("-debug.log")
    );

    if (dirtyFilesInCodeCommit.length > 0) {
      console.error("❌ Code commit contains report, manifest, or debug files:", dirtyFilesInCodeCommit);
      process.exit(1);
    }

    // 4. Successful report states, expected test IDs and no failed/not-run results
    const expectedProdIds = [
      "lint", "typecheck", "test:ui", "harness-validation", "test:unit",
      "snapshot-reconciliation", "source-validation",
      "security-test:rbacSecurity.test",
      "security-test:repertoryEntitlementExport.test",
      "security-test:repertoryExportRoute.test",
      "security-test:repertorySessionExportService.test",
      "security-test:repertoryExportAuthorization.test",
      "security-test:aiSecurityBoundary.test",
      "security-test:repertoryRouteSecurity.test",
      "security-static-audit", "next-build"
    ];

    const expectedEmuIds = [
      "rules-unit-testing", "durable-consistency-test",
      "approval-persistence-test", "activation-gate-test",
      "artifact-deployment-test", "clarke-safety-test",
      "snapshot-activation-test"
    ];

    if (prodReport.releaseState !== "production-deployment-ready") {
      console.error(`❌ Production report releaseState must be 'production-deployment-ready' (got '${prodReport.releaseState}').`);
      process.exit(1);
    }
    for (const id of expectedProdIds) {
      const run = prodReport.results.find((r: any) => r.id === id);
      if (!run) {
        console.error(`❌ Production report is missing expected check ID: ${id}`);
        process.exit(1);
      }
      if (run.status !== "passed") {
        console.error(`❌ Production report check ${id} has non-passing status: ${run.status}`);
        process.exit(1);
      }
    }

    if (emuReport.releaseState !== "emulator-verified") {
      console.error(`❌ Emulator report releaseState must be 'emulator-verified' (got '${emuReport.releaseState}').`);
      process.exit(1);
    }
    for (const id of expectedEmuIds) {
      const run = emuReport.results.find((r: any) => r.id === id);
      if (!run) {
        console.error(`❌ Emulator report is missing expected check ID: ${id}`);
        process.exit(1);
      }
      if (run.status !== "passed") {
        console.error(`❌ Emulator report check ${id} has non-passing status: ${run.status}`);
        process.exit(1);
      }
    }

    console.log("✅ Evidence lineage validation passed successfully!");
    process.exit(0);
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
    // ── R4 pre-check: dirty tree blocks production evidence ─────────────────
    // Readiness evidence must be bound to a reviewable commit SHA.
    // A dirty tree means the checks would run against uncommitted code.
    if (preState.isDirty) {
      console.error('\n🚫 dirty-tree-blocked: working tree is dirty at check start');
      console.error('Commit or stash all changes before running verify:production.');
      console.error(preState.statusLines);
      const earlyReportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
      writeReport(earlyReportPath, "production", "dirty-tree-blocked", []);
      const earlyReport = JSON.parse(fs.readFileSync(earlyReportPath, 'utf8'));
      earlyReport.headSha = preState.sha;
      earlyReport.dirtyAtStart = true;
      fs.writeFileSync(earlyReportPath, JSON.stringify(earlyReport, null, 2), 'utf8');
      process.exit(1);
    }

    // Run all non-emulator production checks
    const resStatic = runStaticVerification();
    const resCorpus = runCorpusVerification();
    const resSecurity = runSecurityVerification();
    const resBuild = runBuildVerification();

    results.push(...resStatic, ...resCorpus, ...resSecurity, ...resBuild);
    passedOverall = results.every(r => r.status === "passed");

    // ── R4 post-check: re-verify SHA and tree; block if modified during run ──
    const postState = captureGitState();
    console.log(`\n📌 POST-CHECK SHA: ${postState.sha}`);
    const shaChanged = postState.sha !== preState.sha && preState.sha !== 'UNKNOWN';
    const treeNowDirty = postState.isDirty; // preState.isDirty already blocked above
    if (shaChanged || treeNowDirty) {
      passedOverall = false;
      const reason = shaChanged ? 'HEAD moved during check run' : 'working tree became dirty during checks';
      console.error(`\n🚫 dirty-tree-blocked: ${reason}`);
      if (treeNowDirty) console.error(postState.statusLines);
      const reportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
      writeReport(reportPath, "production", "dirty-tree-blocked", results);
      process.exit(1);
    }

    const state = passedOverall ? "production-deployment-ready" : "failed";
    const reportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
    writeReport(reportPath, "production", state, results);
    // Embed SHA into report for traceable evidence
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    report.headSha = postState.sha;
    report.dirtyAtStart = preState.isDirty;
    report.dirtyAtEnd = postState.isDirty;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`📌 Readiness evidence bound to SHA: ${postState.sha}`);
  } else if (mode === "emulator") {
    const preState = captureGitState();
    const res = runEmulatorVerification();
    results.push(...res);
    passedOverall = res.every(r => r.status === "passed");

    const postState = captureGitState();
    const state = passedOverall ? "emulator-verified" : "failed";
    const reportPath = path.join(process.cwd(), "reports", "emulator-verification-report.json");
    writeReport(reportPath, "emulator", state, results);

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    report.headSha = postState.sha;
    report.dirtyAtStart = preState.isDirty;
    report.dirtyAtEnd = postState.isDirty;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  } else if (mode === "release") {
    // Orchestrate both
    console.log("\n=== ORCHESTRATING FULL RELEASE VERIFICATION ===");

    // ── R4 pre-check: dirty tree blocks release evidence ──────────────────
    if (preState.isDirty) {
      console.error('\n🚫 dirty-tree-blocked: working tree is dirty at check start');
      console.error('Commit or stash all changes before running verify:release.');
      console.error(preState.statusLines);
      const earlyReportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
      writeReport(earlyReportPath, "release", "dirty-tree-blocked", []);
      const earlyReport = JSON.parse(fs.readFileSync(earlyReportPath, 'utf8'));
      earlyReport.headSha = preState.sha;
      earlyReport.dirtyAtStart = true;
      fs.writeFileSync(earlyReportPath, JSON.stringify(earlyReport, null, 2), 'utf8');
      process.exit(1);
    }

    const resStatic = runStaticVerification();
    const resCorpus = runCorpusVerification();
    const resSecurity = runSecurityVerification();
    const resBuild = runBuildVerification();

    const nonEmulatorPassed = [...resStatic, ...resCorpus, ...resSecurity, ...resBuild].every(r => r.status === "passed");

    let resEmulator: VerificationCheckResult[] = [];
    if (nonEmulatorPassed) {
      console.log("\n✨ Non-emulator checks passed. Booting Firestore Emulator for verification...");
      const start = Date.now();

      const hex = child_process.spawnSync('node', ['-e', 'console.log(require("crypto").randomBytes(6).toString("hex"))'], { encoding: 'utf8' }).stdout.trim();
      const syntheticProjectId = `hh-test-${hex}`;
      console.log(`Generated synthetic project ID for emulator run: ${syntheticProjectId}`);

      const subenv: Record<string, string | undefined> = {
        ...process.env,
        FIRESTORE_PROJECT_ID: syntheticProjectId,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: syntheticProjectId
      };

      if (!subenv.JAVA_HOME) {
        const javaPaths = [
          "/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home",
          "/usr/lib/jvm/java-17-openjdk-amd64"
        ];
        for (const p of javaPaths) {
          if (fs.existsSync(p)) {
            subenv.JAVA_HOME = p;
            break;
          }
        }
      }

      const emulatorRun = child_process.spawnSync("npx", [
        "--no-install", "firebase", "emulators:exec",
        "--only", "firestore",
        "--project", syntheticProjectId,
        "npm run verify:emulator"
      ], { stdio: 'inherit', env: subenv as any });

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

    // ── R4 post-check: re-verify SHA and tree; block if modified during run ──
    const postState = captureGitState();
    const shaChanged = postState.sha !== preState.sha && preState.sha !== 'UNKNOWN';
    const treeNowDirty = postState.isDirty;
    if (shaChanged || treeNowDirty) {
      passedOverall = false;
      const reason = shaChanged ? 'HEAD moved during check run' : 'working tree became dirty during checks';
      console.error(`\n🚫 dirty-tree-blocked: ${reason}`);
      if (treeNowDirty) console.error(postState.statusLines);
      const reportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
      writeReport(reportPath, "release", "dirty-tree-blocked", results);
      process.exit(1);
    }

    const state = passedOverall ? "production-deployment-ready" : "failed";
    const reportPath = path.join(process.cwd(), "reports", "production-readiness-report.json");
    writeReport(reportPath, "release", state, results);

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    report.headSha = postState.sha;
    report.dirtyAtStart = preState.isDirty;
    report.dirtyAtEnd = postState.isDirty;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
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

if (require.main === module) {
  process.env.REPERTORY_VERIFICATION_RUNNING = "true";
  main().catch(err => {
    console.error("Fatal error:", "Verification suite execution failed due to an unhandled exception");
    process.exit(1);
  });
}

export { captureGitState, runSubprocess };
