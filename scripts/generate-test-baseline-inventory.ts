import fs from "fs";
import path from "path";
import { TEST_SUITE_MANIFEST } from "../src/testing/testManifest";

export interface InventoryRecord {
  path: string;
  functionalArea: string;
  status: "active-valid" | "active-needs-import-update" | "active-needs-behaviour-update" | "obsolete-feature-retired" | "duplicate-coverage" | "blocked-by-missing-fixture" | "unknown-requires-review";
  missingModule?: string;
  replacementTest?: string[];
  recommendedAction: string;
}

export function generateTestBaselineInventory() {
  console.log("📊 Generating Test Baseline Inventory Report...");

  const records: InventoryRecord[] = TEST_SUITE_MANIFEST.map((entry) => {
    if (entry.status === "retired") {
      return {
        path: entry.path,
        functionalArea: entry.ownerArea,
        status: "obsolete-feature-retired",
        missingModule: entry.reason?.match(/deleted ([\w/@.-]+)/)?.[1] || "legacy-src-lib-module",
        replacementTest: entry.replacementTests || [],
        recommendedAction: "Retire obsolete test file targeting deleted src/lib modules. Coverage preserved in active governance and vector suites.",
      };
    } else if (entry.status === "quarantined") {
      return {
        path: entry.path,
        functionalArea: entry.ownerArea,
        status: "blocked-by-missing-fixture",
        recommendedAction: "Quarantined pending fixture restoration under tracking issue.",
      };
    } else {
      return {
        path: entry.path,
        functionalArea: entry.ownerArea,
        status: "active-valid",
        recommendedAction: "Maintain active suite in canonical test manifest.",
      };
    }
  });

  const summary = {
    totalSuites: records.length,
    activeValid: records.filter((r) => r.status === "active-valid").length,
    obsoleteRetired: records.filter((r) => r.status === "obsolete-feature-retired").length,
    quarantined: records.filter((r) => r.status === "blocked-by-missing-fixture").length,
    records,
  };

  const reportPath = path.resolve(__dirname, "../reports/test-baseline-inventory.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2), "utf8");

  console.log(`✅ Test Baseline Inventory saved to: ${reportPath}`);
  console.log(`Summary: Total: ${summary.totalSuites} | Active Valid: ${summary.activeValid} | Retired: ${summary.obsoleteRetired} | Quarantined: ${summary.quarantined}`);
  return summary;
}

if (require.main === module) {
  generateTestBaselineInventory();
}
