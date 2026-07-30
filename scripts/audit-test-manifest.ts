import fs from "fs";
import path from "path";
import { TEST_SUITE_MANIFEST, TestSuiteManifestEntry } from "../src/testing/testManifest";

function walkDir(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          results = results.concat(walkDir(filePath));
        } else {
          if (file.endsWith(".test.ts") || file.endsWith(".test.tsx")) {
            results.push(filePath);
          }
        }
      } catch {
        // Skip unreadable paths
      }
    }
  } catch {
    // Skip unreadable directories
  }
  return results;
}

export function auditManifest(overrideManifest?: TestSuiteManifestEntry[]): { passed: boolean; errors: string[] } {
  const errors: string[] = [];
  const manifest = overrideManifest || TEST_SUITE_MANIFEST;
  const discovered = Array.from(new Set(walkDir("tests").concat(walkDir("src")))).sort();
  const manifestPaths = new Set(manifest.map(e => e.path));

  // Check 1: Unregistered tests exist
  for (const file of discovered) {
    if (!manifestPaths.has(file)) {
      errors.push(`UNREGISTERED TEST FILE: "${file}" exists on filesystem but is not registered in TEST_SUITE_MANIFEST.`);
    }
  }

  // Check 2: Manifest references non-existent files
  const discoveredSet = new Set(discovered);
  for (const entry of manifest) {
    if (!discoveredSet.has(entry.path)) {
      errors.push(`MISSING FILE IN MANIFEST: Manifest entry "${entry.path}" does not exist on filesystem.`);
    }
  }

  // Check 3: Duplicate entries
  const seenPaths = new Set<string>();
  for (const entry of manifest) {
    if (seenPaths.has(entry.path)) {
      errors.push(`DUPLICATE MANIFEST ENTRY: "${entry.path}" appears more than once in TEST_SUITE_MANIFEST.`);
    }
    seenPaths.add(entry.path);
  }

  // Check 4: Valid status types
  const validStatuses = new Set(["active", "quarantined", "retired"]);
  for (const entry of manifest) {
    if (!validStatuses.has(entry.status as string)) {
      errors.push(`INVALID STATUS: Entry "${entry.path}" has invalid status "${entry.status}". Allowed: active, quarantined, retired.`);
    }
  }

  // Check 5: Quarantined suite completeness
  for (const entry of manifest) {
    if (entry.status === "quarantined") {
      if (!entry.reason || entry.reason.trim().length < 10) {
        errors.push(`QUARANTINE REASON MISSING: Quarantined entry "${entry.path}" lacks a detailed reason.`);
      }
      if (!entry.trackingIssue) {
        errors.push(`QUARANTINE TRACKING ISSUE MISSING: Quarantined entry "${entry.path}" lacks a tracking issue ID.`);
      }
      if (!entry.risk) {
        errors.push(`QUARANTINE RISK MISSING: Quarantined entry "${entry.path}" lacks a risk description.`);
      }
    }
  }

  // Check 6: Retired suite explicit approval enforcement
  for (const entry of manifest) {
    if (entry.status === "retired") {
      if (entry.approvalStatus !== "approved") {
        errors.push(`UNAPPROVED RETIREMENT: Retired entry "${entry.path}" has approvalStatus "${entry.approvalStatus || "pending"}". Retired suites must have approvalStatus: "approved" with explicit approvedBy metadata.`);
      }
      if (!entry.approvedBy || !entry.approvedAt) {
        errors.push(`RETIREMENT APPROVER METADATA MISSING: Retired entry "${entry.path}" lacks approvedBy or approvedAt metadata.`);
      }
    }
  }

  // Check 7: Replacement path existence for retired suites
  for (const entry of manifest) {
    if (entry.status === "retired" && entry.replacementTests) {
      for (const repl of entry.replacementTests) {
        if (!discoveredSet.has(repl) && !repl.startsWith("src/")) {
          errors.push(`INVALID REPLACEMENT PATH: Retired entry "${entry.path}" claims non-existent replacement "${repl}".`);
        }
      }
    }
  }

  return {
    passed: errors.length === 0,
    errors
  };
}

export function verifyOmittedActiveEntrySelfTest(): boolean {
  // Self-test: Omit an active entry and verify audit failure
  const mutated = TEST_SUITE_MANIFEST.slice(1); // Omit first active entry
  const result = auditManifest(mutated);
  const detected = !result.passed && result.errors.some(e => e.includes("UNREGISTERED TEST FILE"));
  return detected;
}

if (require.main === module) {
  console.log("🔍 Running Test Manifest Security & Completeness Audit...");
  const result = auditManifest();
  const selfTestResult = verifyOmittedActiveEntrySelfTest();
  
  if (result.passed && selfTestResult) {
    console.log("✅ MANIFEST AUDIT PASSED: All test files registered, classified, and valid.");
    console.log("✅ SELF-TEST PASSED: Omitted active manifest entry causes audit failure as expected.");
    process.exit(0);
  } else {
    console.error("❌ MANIFEST AUDIT FAILED:");
    result.errors.forEach(e => console.error("  -", e));
    if (!selfTestResult) console.error("  - SELF-TEST FAILED: Omitted active entry did not trigger audit failure.");
    process.exit(1);
  }
}
