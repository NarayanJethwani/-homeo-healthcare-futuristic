import fs from "fs";
import path from "path";
import { buildKEP1ContributorIntakeManifest } from "../../src/features/knowledge/expansion/kep1ContributorIntake";
import { buildKEP1OnboardingOperationsReport } from "../../src/features/knowledge/expansion/kep1OnboardingOperations";

function main(): void {
  const report = buildKEP1OnboardingOperationsReport(
    buildKEP1ContributorIntakeManifest()
  );
  const outputPath = path.resolve(
    __dirname,
    "../../reports/knowledge-kep1-onboarding-operations.json"
  );
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(
    `Generated privacy-safe KEP-1 onboarding operations artifact:\n- ${outputPath}`
  );
}

main();
