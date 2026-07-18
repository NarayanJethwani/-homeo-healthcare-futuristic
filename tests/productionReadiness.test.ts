import fs from "fs";
import path from "path";
import assert from "assert";
import child_process, { execSync } from "child_process";
import { captureGitState, runSubprocess } from "../scripts/verify-production-readiness";

process.env.NODE_ENV = "test";

async function runTests() {
  console.log("🚀 Starting Production Readiness & Release Governance Operations Assets Tests...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  const operationsDocs = [
    "docs/operations/PRODUCTION_READINESS_CHECKLIST.md",
    "docs/operations/RELEASE_GOVERNANCE.md",
    "docs/operations/INCIDENT_RUNBOOKS.md",
    "docs/operations/ENVIRONMENT_VARIABLES.md",
    "docs/operations/DEPLOYMENT_LOG_TEMPLATE.md"
  ];

  await test("should ensure all 5 core operations documents exist", () => {
    operationsDocs.forEach(doc => {
      const fullPath = path.join(process.cwd(), doc);
      assert.strictEqual(fs.existsSync(fullPath), true, `Missing file: ${doc}`);
    });
  });

  await test("should verify RELEASE_GOVERNANCE.md contains the required release metadata block", () => {
    const govPath = path.join(process.cwd(), "docs/operations/RELEASE_GOVERNANCE.md");
    const content = fs.readFileSync(govPath, "utf8");

    assert.ok(content.includes("- Release version:"));
    assert.ok(content.includes("- Release tag:"));
    assert.ok(content.includes("- Release owner:"));
    assert.ok(content.includes("- Clinical approver:"));
    assert.ok(content.includes("- Technical approver:"));
    assert.ok(content.includes("- Deployment environment:"));
    assert.ok(content.includes("- Build result:"));
    assert.ok(content.includes("- Test result:"));
    assert.ok(content.includes("- Rollback commit:"));
    assert.ok(content.includes("- Known risks:"));
    assert.ok(content.includes("- Post-deployment checks:"));
  });

  await test("should verify verify-production-readiness.ts exits with 0", () => {
    if (process.env.REPERTORY_VERIFICATION_RUNNING === "true") {
      console.log("⚠️ Skipping verify-production-readiness.ts execution to prevent recursive loop.");
      return;
    }
    const res = child_process.spawnSync("npx", [
      "ts-node",
      "-P", "tests/tsconfig.test.json",
      "-r", "tsconfig-paths/register",
      "scripts/verify-production-readiness.ts",
      "--mode", "static"
    ], {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "test" },
      maxBuffer: 10 * 1024 * 1024
    });
    if (res.status !== 0) {
      console.error("Verifier stdout:", res.stdout);
      console.error("Verifier stderr:", res.stderr);
      assert.fail(`verify-production-readiness.ts returned exit code ${res.status}`);
    }
    assert.ok(res.stdout && res.stdout.includes("Verification SUCCESS for mode"));
  });

  await test("should verify package.json contains the verify:production runner script key", () => {
    const pkgPath = path.join(process.cwd(), "package.json");
    const content = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

    assert.ok(content.scripts);
    assert.ok(content.scripts["verify:production"]);
    assert.ok(content.scripts["test"]);
  });

  await test("should verify any dirty workspace file blocks evidence validation", () => {
    const dummyPath = path.join(process.cwd(), "dummy-dirty-file.log");
    fs.writeFileSync(dummyPath, "dirty test data", "utf8");

    try {
      execSync("npx ts-node -P tests/tsconfig.test.json -r tsconfig-paths/register scripts/verify-production-readiness.ts --mode validate-evidence", {
        stdio: "pipe"
      });
      assert.fail("validate-evidence mode did not block validation despite dirty workspace.");
    } catch (error: any) {
      assert.ok(error.status !== 0, "Expected non-zero exit code due to dirty tree");
    } finally {
      if (fs.existsSync(dummyPath)) {
        fs.unlinkSync(dummyPath);
      }
    }
  });

  await test("should verify sentinel-leak safety in runSubprocess exceptions", () => {
    const originalSpawnSync = child_process.spawnSync;

    const sentinel = "SECRET_SENTINEL_TOKEN_12345";
    (child_process as any).spawnSync = () => {
      throw new Error("Failed to execute command: " + sentinel);
    };

    try {
      const res = runSubprocess("sentinel-test", "clean-command", []);

      assert.strictEqual(res.status, "failed");

      const jsonStr = JSON.stringify(res);
      assert.strictEqual(jsonStr.includes(sentinel), false, "Sensitive sentinel leaked in subprocess results!");
    } finally {
      (child_process as any).spawnSync = originalSpawnSync;
    }
  });


  console.log("\n==============================================");
  console.log(`Tests run: ${passedCount + failedCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
