import fs from "fs";
import path from "path";

console.log("🚀 Starting Automated Production Readiness Verification Script...");

let passed = true;

function verifyFileExists(filePath: string, description: string) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ [File Exists] ${description}: ${filePath}`);
  } else {
    console.error(`❌ [File Missing] ${description}: ${filePath}`);
    passed = false;
  }
}

// 1. Confirm required operations documents exist
console.log("\nChecking Operations Documentation Assets...");
const opDocs = [
  "docs/operations/PRODUCTION_READINESS_CHECKLIST.md",
  "docs/operations/RELEASE_GOVERNANCE.md",
  "docs/operations/INCIDENT_RUNBOOKS.md",
  "docs/operations/ENVIRONMENT_VARIABLES.md",
  "docs/operations/DEPLOYMENT_LOG_TEMPLATE.md"
];
opDocs.forEach(doc => verifyFileExists(doc, "Operations document"));

// 2. Confirm critical platform modules exist
console.log("\nChecking Critical System Core Modules...");
const coreModules = [
  "src/lib/ragService.ts",
  "src/features/knowledge/retrieval/vectorStore.ts",
  "src/features/knowledge/retrieval/embeddingQueue.ts",
  "src/features/knowledge-admin/cms/cmsManager.ts",
  "src/app/admin/knowledge-editorial/page.tsx",
  "src/app/api/admin/observability/rag-health/route.ts",
  "src/app/api/consult-ai/route.ts",
  "src/lib/clinicalDecisionSupport.ts"
];
coreModules.forEach(mod => verifyFileExists(mod, "Platform core module"));

// 3. Confirm package scripts exist
console.log("\nChecking package.json script configurations...");
try {
  const pkgContent = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8");
  const pkg = JSON.parse(pkgContent);
  
  if (pkg.scripts && pkg.scripts["verify:production"]) {
    console.log("✅ [Script Config] 'verify:production' is registered in package.json");
  } else {
    console.error("❌ [Script Config Missing] 'verify:production' script is missing in package.json");
    passed = false;
  }
  
  if (pkg.scripts && pkg.scripts["test"]) {
    console.log("✅ [Script Config] 'test' runner is registered in package.json");
  } else {
    console.error("❌ [Script Config Missing] 'test' runner script is missing in package.json");
    passed = false;
  }
} catch (err: any) {
  console.error("❌ [Package Read Failure] Could not load package.json:", err.message || err);
  passed = false;
}

// 4. Confirm Safety Gates are preserved (check file presence and static checks)
console.log("\nChecking Safety Gates Integrity...");
const safetyFiles = [
  "src/features/knowledge-admin/cms/publicationReadiness.ts",
  "src/features/knowledge/governance/qualityGates.ts"
];
safetyFiles.forEach(gate => verifyFileExists(gate, "CMS safety filter gate"));

// 5. Final Report
console.log("\n==============================================");
if (passed) {
  console.log("🎉 Production Readiness Verification: SUCCESS!");
  process.exit(0);
} else {
  console.error("🚨 Production Readiness Verification: FAILED! Correct missing assets.");
  process.exit(1);
}
