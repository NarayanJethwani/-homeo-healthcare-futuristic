import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { TEST_SUITE_MANIFEST } from "../src/testing/testManifest";

const tsNodeBin = path.join(process.cwd(), "node_modules/ts-node/dist/bin.js");

export function runRetiredDiagnostics() {
  const retiredSuites = TEST_SUITE_MANIFEST.filter(e => e.status === "retired");
  console.log(`📜 Running Retired Diagnostic Suite Execution (${retiredSuites.length} retired suites)...`);
  
  let passCount = 0;
  let failCount = 0;
  const results: Array<{ path: string; status: "PASS" | "FAIL"; error?: string }> = [];

  for (const suite of retiredSuites) {
    if (!fs.existsSync(suite.path)) {
      results.push({ path: suite.path, status: "FAIL", error: "File missing on disk" });
      failCount++;
      continue;
    }

    try {
      execFileSync(process.execPath, [
        tsNodeBin,
        "-P", "tests/tsconfig.test.json",
        "-r", "tsconfig-paths/register",
        suite.path
      ], {
        cwd: process.cwd(),
        encoding: "utf8",
        env: { ...process.env, NODE_ENV: "test", GCLOUD_PROJECT: "mock-project-id" },
        stdio: ["pipe", "pipe", "pipe"]
      });
      results.push({ path: suite.path, status: "PASS" });
      passCount++;
    } catch (err: any) {
      const combined = (err.stdout || "") + "\n" + (err.stderr || "");
      const errLines = combined.split("\n").filter(l => l.includes("Cannot find module") || l.includes("Error:") || l.includes("FAIL") || l.includes("AssertionError"));
      const summary = errLines.slice(0, 2).join(" | ") || err.message.split("\n")[0];
      results.push({ path: suite.path, status: "FAIL", error: summary });
      failCount++;
    }
  }

  console.log("\n=== RETIRED DIAGNOSTIC AUDIT RESULTS ===");
  results.forEach(r => {
    console.log(`[${r.status}] ${r.path}`);
    if (r.status === "FAIL") {
      console.log(`       Reason: ${r.error}`);
    }
  });

  console.log(`\nDiagnostic Summary: ${retiredSuites.length} Retired Suites | ${passCount} Runnable/Passing | ${failCount} Compile/Runtime Failures`);
  return { passCount, failCount, results };
}

if (require.main === module) {
  runRetiredDiagnostics();
}
