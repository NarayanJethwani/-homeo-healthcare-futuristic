import { runTypesTests } from "./repertoryTypes.test";
import { runAccessPolicyTests } from "./repertoryAccessPolicy.test";
import { runRepositoryTests } from "./repertoryRepository.test";
import { runHierarchyTests } from "./repertoryHierarchy.test";
import { runSynonymTests } from "./repertorySynonyms.test";
import { runSearchIndexTests } from "./repertorySearchIndex.test";
import { runCursorTests } from "./repertoryCursor.test";
import { runCacheTests } from "./repertoryCache.test";
import { runApiTests } from "./repertoryApi.test";
import { runUiTests } from "./repertoryUi.test";
import { runAccessibilityTests } from "./repertoryAccessibility.test";
import { runPerformanceTests } from "./repertoryPerformance.test";

// Milestone 5A Tests
import { runRemedyIdentityTests } from "./remedyIdentity.test";
import { runRemedyGradeTests } from "./remedyGrade.test";
import { runRemedyRightsTests } from "./remedyRights.test";
import { runRemedyApiTests } from "./remedyApi.test";
import { runRemedyUiTests } from "./remedyUi.test";

async function main() {
  console.log("🚀 Starting Repertory Retrieval & Knowledge Access Layer Integration Tests...");
  let failed = false;

  try {
    runTypesTests();
    runAccessPolicyTests();
    await runRepositoryTests();
    await runHierarchyTests();
    runSynonymTests();
    runSearchIndexTests();
    runCursorTests();
    runCacheTests();
    await runApiTests();
    runUiTests();
    runAccessibilityTests();
    
    // Run Milestone 5A Tests
    runRemedyIdentityTests();
    await runRemedyGradeTests();
    await runRemedyRightsTests();
    await runRemedyApiTests();
    runRemedyUiTests();

    await runPerformanceTests();

    console.log("\n🎉 ✅ ALL REPERTORY RETRIEVAL INTEGRATION TESTS PASSED CLEANLY!");
  } catch (err: any) {
    console.error("\n❌ TEST SUITE RUN ENCOUNTERED A FAILURE:");
    console.error(err.stack || err);
    failed = true;
  }

  if (failed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Fatal test runner exception:", err);
  process.exit(1);
});
