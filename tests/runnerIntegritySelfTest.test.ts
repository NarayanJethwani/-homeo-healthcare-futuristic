import assert from "assert";
import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

export function runRunnerSelfTests() {
  console.log("🚀 Starting Test Runner Integrity Self-Test Suite...\n");

  const tsNodeBin = path.resolve(__dirname, "../node_modules/ts-node/dist/bin.js");
  const tsConfigPath = path.resolve(__dirname, "../tests/tsconfig.test.json");
  const tsconfigPathsRegister = path.resolve(__dirname, "../node_modules/tsconfig-paths/register");
  const scratchDir = path.resolve(__dirname, "../tmp/runner-self-test-fixtures");

  fs.mkdirSync(scratchDir, { recursive: true });

  // 1. Passing child returns zero
  {
    const passFile = path.join(scratchDir, "passFixture.test.ts");
    fs.writeFileSync(passFile, `import assert from "assert"; assert.strictEqual(1, 1); console.log("Fixture Passed");`);
    const res = spawnSync(process.execPath, [tsNodeBin, "-P", tsConfigPath, "-r", tsconfigPathsRegister, passFile], {
      env: { ...process.env, TS_NODE_PROJECT: tsConfigPath },
    });
    assert.strictEqual(res.status, 0, "Passing fixture must return exit code 0");
    console.log("✅ SELF-TEST PASSED: 1. Passing child returns zero");
  }

  // 2. Failing assertion returns non-zero
  {
    const failAssertFile = path.join(scratchDir, "failAssertFixture.test.ts");
    fs.writeFileSync(failAssertFile, `import assert from "assert"; assert.strictEqual(1, 2);`);
    const res = spawnSync(process.execPath, [tsNodeBin, "-P", tsConfigPath, "-r", tsconfigPathsRegister, failAssertFile], {
      env: { ...process.env, TS_NODE_PROJECT: tsConfigPath },
    });
    assert.strictEqual(res.status, 1, "Failing assertion fixture must return non-zero exit code");
    console.log("✅ SELF-TEST PASSED: 2. Failing assertion returns non-zero");
  }

  // 3. Missing module returns non-zero
  {
    const missingModFile = path.join(scratchDir, "missingModFixture.test.ts");
    fs.writeFileSync(missingModFile, `import { nonExistantModule } from "../src/lib/nonExistentFile";`);
    const res = spawnSync(process.execPath, [tsNodeBin, "-P", tsConfigPath, "-r", tsconfigPathsRegister, missingModFile], {
      env: { ...process.env, TS_NODE_PROJECT: tsConfigPath },
    });
    assert.notStrictEqual(res.status, 0, "Missing module import fixture must return non-zero exit code");
    console.log("✅ SELF-TEST PASSED: 3. Missing module returns non-zero");
  }

  // 4. Syntax or TypeScript compilation error returns non-zero
  {
    const syntaxErrFile = path.join(scratchDir, "syntaxErrFixture.test.ts");
    fs.writeFileSync(syntaxErrFile, `const x: string = 12345; const invalid syntax %%%`);
    const res = spawnSync(process.execPath, [tsNodeBin, "-P", tsConfigPath, "-r", tsconfigPathsRegister, syntaxErrFile], {
      env: { ...process.env, TS_NODE_PROJECT: tsConfigPath },
    });
    assert.notStrictEqual(res.status, 0, "Syntax / compilation error fixture must return non-zero exit code");
    console.log("✅ SELF-TEST PASSED: 4. Syntax or TypeScript compilation error returns non-zero");
  }

  // 5. Missing test file returns non-zero
  {
    const nonExistentPath = path.join(scratchDir, "doesNotExist.test.ts");
    const res = spawnSync(process.execPath, [tsNodeBin, "-P", tsConfigPath, "-r", tsconfigPathsRegister, nonExistentPath], {
      env: { ...process.env, TS_NODE_PROJECT: tsConfigPath },
    });
    assert.notStrictEqual(res.status, 0, "Non-existent test file must return non-zero exit code");
    console.log("✅ SELF-TEST PASSED: 5. Missing test file returns non-zero");
  }

  // Clean up temporary fixtures
  fs.rmSync(scratchDir, { recursive: true, force: true });

  console.log("\n==============================================");
  console.log("Test Runner Integrity Self-Tests Completed. Passed: 5 | Failed: 0\n");
}

if (require.main === module) {
  runRunnerSelfTests();
}
