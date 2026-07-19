import assert from "assert";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { z } from "zod";
import {
  physicalDeviceReportSchema,
  evaluateReport,
  scanForLeaks
} from "./helpers/physicalEvidenceSchema";
import { generateVerificationMarkdown } from "../scripts/generate-physical-report";

async function runTests() {
  console.log("🚀 Starting Physical Device Evidence Verification Test Suite...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error("Redacted Error: Test execution failed.");
      failedCount++;
    }
  }

  const incompleteFixturePath = path.resolve(__dirname, "./fixtures/KI-002_incomplete_fixture.json");
  const resolvedFixturePath = path.resolve(__dirname, "./fixtures/KI-002_resolved_fixture.json");
  const registerPath = path.resolve(__dirname, "../docs/KNOWN_ISSUES_REGISTER.md");

  // Read clean test baselines
  const incompleteJson = JSON.parse(fs.readFileSync(incompleteFixturePath, "utf-8"));
  const resolvedJson = JSON.parse(fs.readFileSync(resolvedFixturePath, "utf-8"));

  // 1. Zod structural schema validation on baseline fixtures
  await test("Zod structural schema validation on baseline fixtures", () => {
    const parsedIncomplete = physicalDeviceReportSchema.safeParse(incompleteJson);
    assert.strictEqual(parsedIncomplete.success, true);

    const parsedResolved = physicalDeviceReportSchema.safeParse(resolvedJson);
    assert.strictEqual(parsedResolved.success, true);
  });

  // 2. Incomplete profile evaluation returns "incomplete"
  await test("Incomplete profile evaluation returns 'incomplete'", () => {
    const verdict = evaluateReport(incompleteJson);
    assert.strictEqual(verdict, "incomplete");
  });

  // 3. Resolved profile evaluation returns "resolved"
  await test("Resolved profile evaluation returns 'resolved'", () => {
    const verdict = evaluateReport(resolvedJson);
    assert.strictEqual(verdict, "resolved");
  });

  // 4. Budget precedence priority checks: open-regression beats incomplete
  await test("Verdict precedence priority checks: open-regression beats incomplete", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].transitionMs = 401; // fails budget
    copy.deviceMatrix["constrained-ios"] = {
      status: "incomplete",
      reasonCode: "REASON_DEVICE_UNAVAILABLE",
      reasonDetail: "HARDWARE_LIMITATION"
    };
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 5. Budget boundaries: cold graphLoadMs
  await test("Cold graphLoadMs budget boundaries", () => {
    const passCopy = JSON.parse(JSON.stringify(resolvedJson));
    passCopy.deviceMatrix["premium-ios"].runs.cold[0].graphLoadMs = 3000;
    assert.strictEqual(evaluateReport(passCopy), "resolved");

    const failCopy = JSON.parse(JSON.stringify(resolvedJson));
    failCopy.deviceMatrix["premium-ios"].runs.cold[0].graphLoadMs = 3001;
    assert.strictEqual(evaluateReport(failCopy), "open-regression");
  });

  // 6. Budget boundaries: warm graphLoadMs
  await test("Warm graphLoadMs budget boundaries", () => {
    const passCopy = JSON.parse(JSON.stringify(resolvedJson));
    passCopy.deviceMatrix["premium-ios"].runs.warm[0].graphLoadMs = 1000;
    assert.strictEqual(evaluateReport(passCopy), "resolved");

    const failCopy = JSON.parse(JSON.stringify(resolvedJson));
    failCopy.deviceMatrix["premium-ios"].runs.warm[0].graphLoadMs = 1001;
    assert.strictEqual(evaluateReport(failCopy), "open-regression");
  });

  // 7. Budget regression category: transitionMs > 400
  await test("Budget regression: transitionMs > 400", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].transitionMs = 401;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 8. Budget regression category: iplMs > 100
  await test("Budget regression: iplMs > 100", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].iplMs = 101;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 9. Budget regression category: averageFps < 50
  await test("Budget regression: averageFps < 50", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].averageFps = 49;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 10. Budget regression category: maxFrameDurationMs > 66
  await test("Budget regression: maxFrameDurationMs > 66", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].maxFrameDurationMs = 67;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 11. Budget regression category: longTasksCount > 0
  await test("Budget regression: longTasksCount > 0", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].longTasksCount = 1;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 12. Budget regression category: maxConsecutiveDropped > 3
  await test("Budget regression: maxConsecutiveDropped > 3", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].maxConsecutiveDropped = 4;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 13. Budget regression category: p95FrameDurationMs > 33.33
  await test("Budget regression: p95FrameDurationMs > 33.33", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].p95FrameDurationMs = 33.34;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 14. Budget regression category: heapDeltaMb > 15
  await test("Budget regression: heapDeltaMb > 15", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.memory.heapDeltaMb = 15.1;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 15. Budget regression category: reducedMotionDurationMs > 0
  await test("Budget regression: reducedMotionDurationMs > 0", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.accessibility.reducedMotionDurationMs = 1;
    const verdict = evaluateReport(copy);
    assert.strictEqual(verdict, "open-regression");
  });

  // 16. Accessibility validations: domFocusRestored
  await test("Accessibility checks: domFocusRestored", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.accessibility.domFocusRestored = false;
    assert.strictEqual(evaluateReport(copy), "open-regression");
  });

  // 17. Accessibility validations: a11yFocusRestored
  await test("Accessibility checks: a11yFocusRestored", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.accessibility.a11yFocusRestored = false;
    assert.strictEqual(evaluateReport(copy), "open-regression");
  });

  // 18. Accessibility validations: keyboardFocusNavPass
  await test("Accessibility checks: keyboardFocusNavPass", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.accessibility.keyboardFocusNavPass = false;
    assert.strictEqual(evaluateReport(copy), "open-regression");
  });

  // 19. Accessibility validations: reducedMotionCompliance
  await test("Accessibility checks: reducedMotionCompliance", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.accessibility.reducedMotionCompliance = false;
    assert.strictEqual(evaluateReport(copy), "open-regression");
  });

  // 20. Zod strictness check on unknown fields
  await test("Zod strictness check on unknown fields", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.unknownField = "invalid";
    const parsed = physicalDeviceReportSchema.safeParse(copy);
    assert.strictEqual(parsed.success, false);
  });

  // 21. Zod strictness check on nested unknown fields
  await test("Zod strictness check on nested unknown fields", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.memory.unknownField = "invalid";
    const parsed = physicalDeviceReportSchema.safeParse(copy);
    assert.strictEqual(parsed.success, false);
  });

  // 22. Privacy scanner check - email leak
  await test("Privacy scanner check - email leak", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].deviceModel = "user@homeo.healthcare";
    let threw = false;
    try {
      scanForLeaks(copy);
    } catch {
      threw = true;
    }
    assert.strictEqual(threw, true);
  });

  // 23. Privacy scanner check - path leak
  await test("Privacy scanner check - path leak", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].deviceModel = "/Users/username/project";
    let threw = false;
    try {
      scanForLeaks(copy);
    } catch {
      threw = true;
    }
    assert.strictEqual(threw, true);
  });

  // 24. URL validation - reject query string
  await test("URL validation - reject query string", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deploymentUrl = "https://homeo-healthcare-futuristic.vercel.app/knowledge/remedies/lycopodium?token=123";
    const parsed = physicalDeviceReportSchema.safeParse(copy);
    assert.strictEqual(parsed.success, false);
  });

  // 25. URL validation - reject wrong host
  await test("URL validation - reject wrong host", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deploymentUrl = "https://arbitrary.vercel.app/knowledge/remedies/lycopodium";
    const parsed = physicalDeviceReportSchema.safeParse(copy);
    assert.strictEqual(parsed.success, false);
  });

  // 26. Run index ordering validation
  await test("Run index ordering validation", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.deviceMatrix["premium-ios"].runs.cold[0].runIndex = 2; // Duplicate run index 2
    const parsed = physicalDeviceReportSchema.safeParse(copy);
    assert.strictEqual(parsed.success, false);
  });

  // 27. Placeholder vercelDeploymentId validation
  await test("Placeholder vercelDeploymentId validation", () => {
    const copy = JSON.parse(JSON.stringify(resolvedJson));
    copy.vercelDeploymentId = "dpl_placeholder123";
    const parsed = physicalDeviceReportSchema.safeParse(copy);
    assert.strictEqual(parsed.success, false);
  });

  // 28. Raw trace file checker (fail-closed)
  await test("Raw trace file checker (fail-closed)", () => {
    const baseCommit = "db73d7b6f8bdc5d99ccc1bd77ccdd3414be6ebfa";
    try {
      const gitDiff = execSync(`git diff --name-only ${baseCommit}..HEAD`, { encoding: "utf-8" });
      const files = gitDiff.split("\n").map(f => f.trim()).filter(Boolean);

      const forbiddenExtensions = [
        ".trace",
        ".heapprofile",
        ".heapsnapshot",
        ".har",
        ".json.gz",
        ".log"
      ];

      for (const file of files) {
        for (const ext of forbiddenExtensions) {
          if (file.endsWith(ext)) {
            throw new Error("Validation Error: Staged trace or debugging files detected.");
          }
        }
      }
    } catch (err: any) {
      if (err.message && err.message.includes("Validation Error:")) {
        throw err;
      }
      // If git diff throws a true system error, fail closed
      throw new Error("Validation Error: Git repository inspection failed.");
    }
  });

  // 29. Incomplete status - assert KNOWN_ISSUES_REGISTER.md row matches and is correctly placed
  await test("Assert KNOWN_ISSUES_REGISTER.md reflects incomplete status", () => {
    const registerText = fs.readFileSync(registerPath, "utf-8");
    const lines = registerText.split("\n").map(l => l.trim());

    let activeSectionIdx = -1;
    let resolvedSectionIdx = -1;
    let ki002RowIdxs: number[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith("## Active Known Issues")) {
        activeSectionIdx = idx;
      } else if (line.startsWith("## Resolved Issues")) {
        resolvedSectionIdx = idx;
      }

      if (line.includes("KI-002")) {
        ki002RowIdxs.push(idx);
      }
    });

    assert.strictEqual(ki002RowIdxs.length, 1, "Expected exactly one row for KI-002 in KNOWN_ISSUES_REGISTER.md.");
    const rowIdx = ki002RowIdxs[0];

    assert.ok(activeSectionIdx !== -1, "Active Known Issues heading not found.");
    assert.ok(resolvedSectionIdx !== -1, "Resolved Issues heading not found.");
    assert.ok(activeSectionIdx < resolvedSectionIdx, "Active section must appear before resolved section.");

    // Baseline incomplete fixture matches: KI-002 must reside in Active Known Issues section and have status "Mitigated pending physical-device validation"
    assert.ok(rowIdx > activeSectionIdx && rowIdx < resolvedSectionIdx, "KI-002 row must appear in Active section.");
    assert.ok(lines[rowIdx].includes("Mitigated pending physical-device validation"), "KI-002 status did not match expected string.");
  });

  // 30. Fail-closed final-evidence check
  const reportPath = path.resolve(__dirname, "../reports/KI-002_physical_device_report.json");
  const reportMdPath = path.resolve(__dirname, "../reports/KI-002_physical_device_verification.md");

  if (process.env.FINAL_EVIDENCE === "true") {
    await test("Fail-closed final-evidence files exist check", () => {
      if (!fs.existsSync(reportPath) || !fs.existsSync(reportMdPath)) {
        throw new Error("Validation Error: Final physical-device evidence files are missing from repository.");
      }
    });
  }

  // 31. Real reports verification (if committed on disk)
  if (fs.existsSync(reportPath) && fs.existsSync(reportMdPath)) {
    await test("Committed report JSON matches Zod schema and generates exact committed Markdown", () => {
      const raw = fs.readFileSync(reportPath, "utf-8");
      const json = JSON.parse(raw);
      const parsed = physicalDeviceReportSchema.safeParse(json);
      assert.strictEqual(parsed.success, true);

      // Verify privacy scanner passes
      scanForLeaks(json);

      // Verify markdown generation matches byte-for-byte
      const generatedMd = generateVerificationMarkdown(json);
      const committedMd = fs.readFileSync(reportMdPath, "utf-8");
      assert.strictEqual(committedMd, generatedMd);

      // Verify register matches verdict
      const verdict = evaluateReport(json);
      const registerText = fs.readFileSync(registerPath, "utf-8");
      const lines = registerText.split("\n").map(l => l.trim());

      let activeSectionIdx = -1;
      let resolvedSectionIdx = -1;
      let ki002RowIdxs: number[] = [];

      lines.forEach((line, idx) => {
        if (line.startsWith("## Active Known Issues")) {
          activeSectionIdx = idx;
        } else if (line.startsWith("## Resolved Issues")) {
          resolvedSectionIdx = idx;
        }
        if (line.includes("KI-002")) {
          ki002RowIdxs.push(idx);
        }
      });

      assert.strictEqual(ki002RowIdxs.length, 1);
      const rowIdx = ki002RowIdxs[0];

      if (verdict === "resolved") {
        assert.ok(rowIdx > resolvedSectionIdx);
        assert.ok(lines[rowIdx].includes("Resolved"));
      } else if (verdict === "open-regression") {
        assert.ok(rowIdx > activeSectionIdx && rowIdx < resolvedSectionIdx);
        assert.ok(lines[rowIdx].includes("Open — physical-device regression confirmed"));
      } else if (verdict === "incomplete") {
        assert.ok(rowIdx > activeSectionIdx && rowIdx < resolvedSectionIdx);
        assert.ok(lines[rowIdx].includes("Mitigated pending physical-device validation"));
      }
    });
  }

  setTimeout(() => {
    console.log(`\n🎉 Physical Device Evidence Verification Tests Completed. Passed: ${passedCount}, Failed: ${failedCount}`);
    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }, 100);
}

runTests();
