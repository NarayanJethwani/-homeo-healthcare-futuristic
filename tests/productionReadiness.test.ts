import fs from "fs";
import path from "path";
import assert from "assert";
import { execSync } from "child_process";

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
    try {
      const output = execSync("npm run verify:production", { stdio: "pipe", encoding: "utf8" });
      assert.ok(output.includes("Production Readiness Verification: SUCCESS!"));
    } catch (error: any) {
      console.error(error.stdout);
      assert.fail("verify:production script returned non-zero exit code.");
    }
  });

  await test("should verify package.json contains the verify:production runner script key", () => {
    const pkgPath = path.join(process.cwd(), "package.json");
    const content = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    
    assert.ok(content.scripts);
    assert.ok(content.scripts["verify:production"]);
    assert.ok(content.scripts["test"]);
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
