import * as fs from "fs";
import * as path from "path";
import { physicalDeviceReportSchema, evaluateReport, scanForLeaks } from "../tests/helpers/physicalEvidenceSchema";

export function generateVerificationMarkdown(data: any): string {
  // Validate schema before generating Markdown
  const parsed = physicalDeviceReportSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Validation Error: Input JSON does not match the strict schema specification.");
  }

  // Scan input data for privacy leaks using shared helper
  try {
    scanForLeaks(data);
  } catch {
    throw new Error("Validation Error: Restricted pattern detected in report data.");
  }

  const derivedVerdict = evaluateReport(data);

  let md = `# Sprint 28G Physical Device Performance Verification Report\n\n`;
  md += `## Metadata\n\n`;
  md += `- **Schema Version**: ${data.schemaVersion}\n`;
  md += `- **Timestamp (UTC)**: ${data.timestamp}\n`;
  md += `- **Exact Commit SHA**: ${data.commit}\n`;
  md += `- **Vercel Deployment ID**: ${data.vercelDeploymentId}\n`;
  md += `- **Deployment URL**: ${data.deploymentUrl}\n`;
  md += `- **Derived Verdict**: ${derivedVerdict}\n\n`;

  md += `## Device Matrix & Profiles\n\n`;

  const profiles = ["premium-ios", "constrained-ios", "constrained-android"] as const;
  for (const key of profiles) {
    const profile = data.deviceMatrix[key];
    md += `### Profile: \`${key}\`\n\n`;
    md += `- **Status**: ${profile.status}\n`;

    if (profile.status === "complete") {
      md += `- **Device Model**: ${profile.deviceModel}\n`;
      md += `- **OS Version**: ${profile.osVersion}\n`;
      md += `- **Browser Version**: ${profile.browserVersion}\n`;
      md += `- **CPU/SoC**: ${profile.cpuSoc}\n`;
      md += `- **Debugger Tool Version**: ${profile.debuggerToolVersion}\n`;
      md += `- **Refresh Rate**: ${profile.refreshRateHz} Hz\n`;
      md += `- **Power State**: ${profile.powerState}\n\n`;

      md += `#### Cold Runs\n\n`;
      md += `| Run | Duration | Graph Load | Transition | IPL | Avg FPS | p95 Frame | Max Frame | Long Tasks | Jank Events | Max Consec Dropped |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      for (const run of profile.runs.cold) {
        md += `| Run ${run.runIndex} | ${run.recordingDurationMs}ms | ${run.graphLoadMs}ms | ${run.transitionMs}ms | ${run.iplMs}ms | ${run.averageFps} fps | ${run.p95FrameDurationMs}ms | ${run.maxFrameDurationMs}ms | ${run.longTasksCount} | ${run.jankEventsCount} | ${run.maxConsecutiveDropped} |\n`;
      }
      md += `\n`;

      md += `#### Warm Runs\n\n`;
      md += `| Run | Duration | Graph Load | Transition | IPL | Avg FPS | p95 Frame | Max Frame | Long Tasks | Jank Events | Max Consec Dropped |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      for (const run of profile.runs.warm) {
        md += `| Run ${run.runIndex} | ${run.recordingDurationMs}ms | ${run.graphLoadMs}ms | ${run.transitionMs}ms | ${run.iplMs}ms | ${run.averageFps} fps | ${run.p95FrameDurationMs}ms | ${run.maxFrameDurationMs}ms | ${run.longTasksCount} | ${run.jankEventsCount} | ${run.maxConsecutiveDropped} |\n`;
      }
      md += `\n`;

      md += `#### Memory Metrics (10 Mount/Unmount Cycles)\n\n`;
      md += `- **Baseline Heap**: ${profile.runs.memory.baselineMb} MB\n`;
      md += `- **Heap after 5 cycles**: ${profile.runs.memory.cycle5Mb} MB\n`;
      md += `- **Heap after 10 cycles**: ${profile.runs.memory.cycle10Mb} MB\n`;
      md += `- **Memory Delta**: ${profile.runs.memory.heapDeltaMb} MB\n\n`;

      md += `#### Accessibility Checks\n\n`;
      md += `- **DOM Focus Restored**: ${profile.runs.accessibility.domFocusRestored ? "PASS" : "FAIL"}\n`;
      md += `- **Accessibility Focus Restored**: ${profile.runs.accessibility.a11yFocusRestored ? "PASS" : "FAIL"}\n`;
      md += `- **Keyboard Focus Navigation Passed**: ${profile.runs.accessibility.keyboardFocusNavPass ? "PASS" : "FAIL"}\n`;
      md += `- **Reduced Motion Compliance**: ${profile.runs.accessibility.reducedMotionCompliance ? "PASS" : "FAIL"}\n`;
      md += `- **Reduced Motion Duration**: ${profile.runs.accessibility.reducedMotionDurationMs}ms\n\n`;
    } else {
      md += `- **Reason Code**: ${profile.reasonCode}\n`;
      md += `- **Reason Detail**: ${profile.reasonDetail}\n\n`;
    }
    md += `---\n\n`;
  }

  // Ensure no extra trailing blank lines at the end, exactly one final newline.
  return md.trim() + "\n";
}

if (require.main === module) {
  const jsonPath = path.resolve(__dirname, "../reports/KI-002_physical_device_report.json");
  const mdPath = path.resolve(__dirname, "../reports/KI-002_physical_device_verification.md");

  try {
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(rawData);
    const markdown = generateVerificationMarkdown(data);
    fs.writeFileSync(mdPath, markdown, "utf-8");
    console.log(`Successfully compiled physical verification Markdown to: ${mdPath}`);
  } catch (err: any) {
    console.error("Generator Error: Markdown generation failed.");
    process.exit(1);
  }
}
