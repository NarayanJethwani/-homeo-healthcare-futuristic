import { spawnSync } from "child_process";

// Sanitize inherited environment variables
const sensitiveEnvVars = [
  "REPERTORY_USE_ADC",
  "FIRESTORE_EMULATOR_HOST",
  "REPERTORY_RUNTIME_MODE",
  "REPERTORY_ENV",
  "FIREBASE_SERVICE_ACCOUNT_KEY",
  "GOOGLE_SERVICE_ACCOUNT_KEY",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "GCLOUD_PROJECT",
  "FIRESTORE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
];

for (const envVar of sensitiveEnvVars) {
  delete process.env[envVar];
}

// Set governed test variables
process.env.REPERTORY_USE_MOCK_FIRESTORE = "true";
(process.env as any).NODE_ENV = "test";
process.env.GCLOUD_PROJECT = "mock-project-id";
process.env.FIRESTORE_PROJECT_ID = "mock-project-id";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "mock-project-id";

// Define the exact list of unit test scripts
const unitTests = [
  { path: "tests/adminWorkflow.test.ts" },
  { path: "tests/vectorStore.test.ts" },
  { path: "tests/ragPerformanceSafety.test.ts" },
  { path: "tests/clinicalOsIntegration.test.ts" },
  { path: "src/features/knowledge-admin/__tests__/kms.test.ts", options: ["-O", '{"module": "commonjs", "esModuleInterop": true}'] },
  { path: "tests/publicApi.test.ts", options: ["-O", '{"module": "commonjs", "esModuleInterop": true}'] },
  { path: "tests/observabilityAnalytics.test.ts" },
  { path: "tests/knowledgeAnalyticsPrivacy.test.ts" },
  { path: "tests/observabilityAdapters.test.ts" },
  { path: "tests/editorialPriorityService.test.ts" },
  { path: "tests/editorialWorkflow.test.ts" },
  { path: "tests/editorialCms.test.ts", env: { TS_NODE_COMPILER_OPTIONS: '{"module":"commonjs"}' } },
  { path: "tests/persistentVector.test.ts" },
  { path: "tests/productionReadiness.test.ts" },
  { path: "tests/rbacSecurity.test.ts" },
  { path: "tests/practitionerLifecycle.test.ts" },
  { path: "tests/practitionerProfile.test.ts" },
  { path: "tests/patientAttachments.test.ts" },
  { path: "tests/patientLabs.test.ts" },
  { path: "tests/repertoryProduction.test.ts" },
  { path: "tests/homeopathyWorkflow.test.ts" },
  { path: "tests/repertoryCorpusCompleteness.test.ts" },
  { path: "tests/repertorySharding.test.ts" },
  { path: "tests/repertoryCache.test.ts" },
  { path: "tests/repertorySnapshotActivation.test.ts" },
  { path: "tests/repertoryPerformanceSafety.test.ts" },
  { path: "tests/evidenceScoring.test.ts" },
  { path: "tests/evidenceDates.test.ts" },
  { path: "tests/evidenceContexts.test.ts" },
  { path: "tests/evidencePermissions.test.ts" },
  { path: "tests/evidenceApiSecurity.test.ts" },
  { path: "tests/evidenceVersioning.test.ts" },
  { path: "tests/evidenceFirestoreRules.test.ts" },
  { path: "tests/evidenceRegression.test.ts" },
  { path: "tests/evidencePublicationReadiness.test.ts" },
  { path: "tests/evidenceAuditAtomicity.test.ts" },
  { path: "tests/evidencePerformance.test.ts" },
  { path: "tests/clinicalGraph.test.ts" },
  { path: "tests/providerTelemetry.test.ts" },
  { path: "tests/physicalDeviceEvidence.test.ts" }
];

console.log("🚀 Starting Governed Unit Test Runner...");
console.log(`Governed Environment: NODE_ENV=${process.env.NODE_ENV}, GCLOUD_PROJECT=${process.env.GCLOUD_PROJECT}, REPERTORY_USE_MOCK_FIRESTORE=${process.env.REPERTORY_USE_MOCK_FIRESTORE}`);

let passed = 0;
let failed = 0;

for (const t of unitTests) {
  console.log(`\n🏃 Running: npx ts-node ${t.path}`);
  const childEnv = { ...process.env, ...(t.env || {}) };
  const args = [
    "ts-node",
    "-P", "tests/tsconfig.test.json",
    "-r", "tsconfig-paths/register"
  ];
  if (t.options) {
    args.push(...t.options);
  }
  args.push(t.path);

  const res = spawnSync("npx", args, { stdio: "inherit", env: childEnv });
  if (res.status === 0) {
    console.log(`✅ Passed: ${t.path}`);
    passed++;
  } else {
    console.error(`❌ Failed: ${t.path} (exit code ${res.status})`);
    failed++;
  }
}

console.log("\n==============================================");
console.log(`Governed Unit Tests Completed. Total: ${unitTests.length} | Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
