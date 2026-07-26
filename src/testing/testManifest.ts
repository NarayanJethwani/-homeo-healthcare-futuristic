export type TestExecutionStatus = "active" | "quarantined" | "retired";

export interface TestSuiteManifestEntry {
  path: string;
  status: TestExecutionStatus;
  ownerArea: string;
  testLayer?: "unit" | "integration" | "security" | "performance" | "governance";
  reason?: string;
  originalRequirements?: string[];
  replacementTests?: string[];
  replacementAssertions?: string[];
  evidence?: string;
  risk?: string;
  trackingIssue?: string;
  owner?: string;
  lastExecutionResult?: string;
  plannedResolution?: string;
  options?: string[];
  env?: Record<string, string>;
  approvedBy?: string;
  approvedAt?: string;
  approvalStatus?: "approved" | "pending";
}

export const TEST_SUITE_MANIFEST: TestSuiteManifestEntry[] = [
  {
    "path": "src/features/dashboard/__tests__/alerts.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-DASHBOARD---TESTS---ALERTS-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "src/features/dashboard/__tests__/commandPalette.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-DASHBOARD---TESTS---COMMANDPALETTE-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "src/features/dashboard/__tests__/overview.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-DASHBOARD---TESTS---OVERVIEW-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "src/features/dashboard/__tests__/queue.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-DASHBOARD---TESTS---QUEUE-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "src/features/dashboard/__tests__/sidebar.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-DASHBOARD---TESTS---SIDEBAR-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "src/features/knowledge-admin/__tests__/kms.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/clinicalRepertorizationEngine.test.ts",
    "status": "quarantined",
    "ownerArea": "legacy-repertory",
    "testLayer": "unit",
    "reason": "Legacy repertory engine test targeted for Phase 3 clinical refactoring",
    "risk": "medium",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-REPERTORY---TESTS---CLINICALREPERTORIZATIONENGINE-TEST-TS",
    "owner": "platform-engineering",
    "lastExecutionResult": "Legacy assertion mismatch",
    "plannedResolution": "Refactor engine assertions in Phase 3"
  },
  {
    "path": "src/features/repertory/__tests__/clinicalRubricIntelligence.test.ts",
    "status": "quarantined",
    "ownerArea": "legacy-repertory",
    "testLayer": "unit",
    "reason": "Legacy repertory engine test targeted for Phase 3 clinical refactoring",
    "risk": "medium",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-REPERTORY---TESTS---CLINICALRUBRICINTELLIGENCE-TEST-TS",
    "owner": "platform-engineering",
    "lastExecutionResult": "Legacy assertion mismatch",
    "plannedResolution": "Refactor engine assertions in Phase 3"
  },
  {
    "path": "src/features/repertory/__tests__/clinicalSearchEngine.test.ts",
    "status": "quarantined",
    "ownerArea": "legacy-repertory",
    "testLayer": "unit",
    "reason": "Legacy repertory engine test targeted for Phase 3 clinical refactoring",
    "risk": "medium",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-REPERTORY---TESTS---CLINICALSEARCHENGINE-TEST-TS",
    "owner": "platform-engineering",
    "lastExecutionResult": "Legacy assertion mismatch",
    "plannedResolution": "Refactor engine assertions in Phase 3"
  },
  {
    "path": "src/features/repertory/__tests__/clinicalSearchShadow.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/clinicalValidationFramework.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/clinicalWorkspaceService.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/remedyNormalizer.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/repertory.test.ts",
    "status": "quarantined",
    "ownerArea": "legacy-repertory",
    "testLayer": "unit",
    "reason": "Legacy repertory engine test targeted for Phase 3 clinical refactoring",
    "risk": "medium",
    "trackingIssue": "QUARANTINE-SRC-FEATURES-REPERTORY---TESTS---REPERTORY-TEST-TS",
    "owner": "platform-engineering",
    "lastExecutionResult": "Legacy assertion mismatch",
    "plannedResolution": "Refactor engine assertions in Phase 3"
  },
  {
    "path": "src/features/repertory/__tests__/repertoryAdapters.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/repertoryFlags.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/v2ComparisonMode.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "src/features/repertory/__tests__/v2FeedbackModel.test.ts",
    "status": "active",
    "ownerArea": "feature-unit",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/adminWorkflow.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/aiSecurityBoundary.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/cipFoundation.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/clinicalGraph.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/clinicalOsIntegration.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/corpusCacheActivationManifest.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/editorialCms.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/editorialPriorityService.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/editorialWorkflow.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/embeddingQueueCacheIntegration.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/emrPatientIdentityReconciliation.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/encounterUi.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/encounterWorkflow.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceApiSecurity.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceAuditAtomicity.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceContexts.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceDates.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceFirestoreRules.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidencePerformance.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "performance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidencePermissions.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidencePublicationReadiness.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceRegression.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceScoring.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/evidenceVersioning.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/firestoreEmulatorFailClosed.test.ts",
    "status": "active",
    "ownerArea": "database-security",
    "testLayer": "security",
    "reason": "Active Firestore emulator persistence & security rules test suite",
    "env": {
      "NODE_ENV": "test",
      "REPERTORY_ENV": "emulator",
      "REPERTORY_RUNTIME_MODE": "emulator",
      "REPERTORY_USE_MOCK_FIRESTORE": "false",
      "FIRESTORE_EMULATOR_HOST": "127.0.0.1:8080",
      "FIRESTORE_PROJECT_ID": "hh-test-1234567890ab",
      "GCLOUD_PROJECT": "hh-test-1234567890ab",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hh-test-1234567890ab"
    }
  },
  {
    "path": "tests/firestoreHarnessValidation.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/firestoreRulesClient.test.ts",
    "status": "active",
    "ownerArea": "database-security",
    "testLayer": "security",
    "reason": "Active Firestore emulator persistence & security rules test suite",
    "env": {
      "NODE_ENV": "test",
      "REPERTORY_ENV": "emulator",
      "REPERTORY_RUNTIME_MODE": "emulator",
      "REPERTORY_USE_MOCK_FIRESTORE": "false",
      "FIRESTORE_EMULATOR_HOST": "127.0.0.1:8080",
      "FIRESTORE_PROJECT_ID": "hh-test-1234567890ab",
      "GCLOUD_PROJECT": "hh-test-1234567890ab",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hh-test-1234567890ab"
    }
  },
  {
    "path": "tests/fourProjectFoundations.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/governanceAuthBoundary.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/graphPerformance.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-TESTS-GRAPHPERFORMANCE-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "tests/homeopathyWorkflow.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/hydrationAndTiming.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-TESTS-HYDRATIONANDTIMING-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "tests/knowledgeAnalyticsPrivacy.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/knowledgeEditorial.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/knowledgeExpansionInventory.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "governance",
    "reason": "Governed KEP-0 inventory, flagship pilot, licensing, and offline retrieval boundary tests"
  },
  {
    "path": "tests/knowledgeGraphExplorer.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-TESTS-KNOWLEDGEGRAPHEXPLORER-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "tests/materiaMedicaContentInventory.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaGovernance.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "governance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaLegacyParity.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaLibraryV2.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaLocalSearch.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaPersistence.test.ts",
    "status": "active",
    "ownerArea": "database-security",
    "testLayer": "security",
    "reason": "Active Firestore emulator persistence & security rules test suite",
    "env": {
      "NODE_ENV": "test",
      "REPERTORY_ENV": "emulator",
      "REPERTORY_RUNTIME_MODE": "emulator",
      "REPERTORY_USE_MOCK_FIRESTORE": "false",
      "FIRESTORE_EMULATOR_HOST": "127.0.0.1:8080",
      "FIRESTORE_PROJECT_ID": "hh-test-1234567890ab",
      "GCLOUD_PROJECT": "hh-test-1234567890ab",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hh-test-1234567890ab"
    }
  },
  {
    "path": "tests/materiaMedicaReaderV2.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaRemedyComparison.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaSampleCorpus.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/materiaMedicaScanFoundation.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/miasmaticFiltering.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-TESTS-MIASMATICFILTERING-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "tests/observabilityAdapters.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/observabilityAnalytics.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/ollamaEmbeddingsCache.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/onboardDoctorSafety.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/patientAttachments.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/patientLabs.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/persistentVector.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/phase2-1GovernancePersistence.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "governance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/phase2-2bGovernancePersistence.test.ts",
    "status": "active",
    "ownerArea": "database-security",
    "testLayer": "security",
    "reason": "Active Firestore emulator persistence & security rules test suite",
    "env": {
      "NODE_ENV": "test",
      "REPERTORY_ENV": "emulator",
      "REPERTORY_RUNTIME_MODE": "emulator",
      "REPERTORY_USE_MOCK_FIRESTORE": "false",
      "FIRESTORE_EMULATOR_HOST": "127.0.0.1:8080",
      "FIRESTORE_PROJECT_ID": "hh-test-1234567890ab",
      "GCLOUD_PROJECT": "hh-test-1234567890ab",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hh-test-1234567890ab"
    }
  },
  {
    "path": "tests/phase2GovernanceSchema.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "governance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/physicalDeviceEvidence.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/practitionerLifecycle.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/practitionerProfile.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/productionReadiness.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite",
    "env": {
      "REPERTORY_VERIFICATION_RUNNING": "true"
    }
  },
  {
    "path": "tests/providerTelemetry.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/providerTelemetryDashboard.test.tsx",
    "status": "quarantined",
    "ownerArea": "ui-components",
    "testLayer": "integration",
    "reason": "UI component rendering test requiring Vitest jsdom React Testing Library runner",
    "risk": "low",
    "trackingIssue": "QUARANTINE-TESTS-PROVIDERTELEMETRYDASHBOARD-TEST-TSX",
    "owner": "frontend-core",
    "lastExecutionResult": "Requires Vitest jsdom environment",
    "plannedResolution": "Execute via npm run test:ui (Vitest/jsdom)"
  },
  {
    "path": "tests/publicApi.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/publicationGuardSafety.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "governance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/ragPerformanceSafety.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "performance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/rbacSecurity.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/remedyApi.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/remedyGrade.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/remedyIdentity.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/remedyRights.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/remedyUi.test.tsx",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryAccessPolicy.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryAccessibility.test.tsx",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryApi.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryCache.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryCursor.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryHierarchy.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryPerformance.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "performance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryRepository.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryRetrieval.test.ts",
    "status": "quarantined",
    "ownerArea": "legacy-repertory",
    "testLayer": "unit",
    "reason": "Legacy repertory engine test targeted for Phase 3 clinical refactoring",
    "risk": "medium",
    "trackingIssue": "QUARANTINE-TESTS-REPERTORY-REPERTORYRETRIEVAL-TEST-TS",
    "owner": "platform-engineering",
    "lastExecutionResult": "Legacy assertion mismatch",
    "plannedResolution": "Refactor engine assertions in Phase 3"
  },
  {
    "path": "tests/repertory/repertorySearchIndex.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertorySynonyms.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryTypes.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertory/repertoryUi.test.tsx",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryApiSecurity.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryApprovalPersistence.test.ts",
    "status": "active",
    "ownerArea": "database-security",
    "testLayer": "security",
    "reason": "Active Firestore emulator persistence & security rules test suite",
    "env": {
      "NODE_ENV": "test",
      "REPERTORY_ENV": "emulator",
      "REPERTORY_RUNTIME_MODE": "emulator",
      "REPERTORY_USE_MOCK_FIRESTORE": "false",
      "FIRESTORE_EMULATOR_HOST": "127.0.0.1:8080",
      "FIRESTORE_PROJECT_ID": "hh-test-1234567890ab",
      "GCLOUD_PROJECT": "hh-test-1234567890ab",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hh-test-1234567890ab"
    }
  },
  {
    "path": "tests/repertoryArtifactDeployment.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryBoenninghausenPocketBookAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryBogerBrowserAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryBogerSynopticKeyAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryCache.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryCatalogUx.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryClarkeBrowserAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryClarkeSafety.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryClarkeSelection.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryCorpusCompleteness.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryDoctorPilot.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryDurableConsistency.test.ts",
    "status": "active",
    "ownerArea": "database-security",
    "testLayer": "security",
    "reason": "Active Firestore emulator persistence & security rules test suite",
    "env": {
      "NODE_ENV": "test",
      "REPERTORY_ENV": "emulator",
      "REPERTORY_RUNTIME_MODE": "emulator",
      "REPERTORY_USE_MOCK_FIRESTORE": "false",
      "FIRESTORE_EMULATOR_HOST": "127.0.0.1:8080",
      "FIRESTORE_PROJECT_ID": "hh-test-1234567890ab",
      "GCLOUD_PROJECT": "hh-test-1234567890ab",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hh-test-1234567890ab"
    }
  },
  {
    "path": "tests/repertoryEntitlementExport.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryExportAuthorization.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryExportRoute.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryGentryConcordanceAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryHeringSpecializedAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryJahrClinicalGuideAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryKnerrBrowserAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryLippeCharacteristicAsset.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryObjectStorage.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryPerformanceSafety.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "performance",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryProduction.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryProductionActivationGate.test.ts",
    "status": "active",
    "ownerArea": "database-security",
    "testLayer": "security",
    "reason": "Active Firestore emulator persistence & security rules test suite",
    "env": {
      "NODE_ENV": "test",
      "REPERTORY_ENV": "emulator",
      "REPERTORY_RUNTIME_MODE": "emulator",
      "REPERTORY_USE_MOCK_FIRESTORE": "false",
      "FIRESTORE_EMULATOR_HOST": "127.0.0.1:8080",
      "FIRESTORE_PROJECT_ID": "hh-test-1234567890ab",
      "GCLOUD_PROJECT": "hh-test-1234567890ab",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hh-test-1234567890ab"
    }
  },
  {
    "path": "tests/repertoryRouteSecurity.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "security",
    "reason": "Active passing Node test suite",
    "env": {
      "GCLOUD_PROJECT": "test-project-id",
      "FIRESTORE_PROJECT_ID": "test-project-id",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "test-project-id"
    }
  },
  {
    "path": "tests/repertorySessionExportService.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertorySharding.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertorySnapshotActivation.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/repertoryWorkbenchScoring.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/runnerIntegritySelfTest.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/vectorStore.test.ts",
    "status": "active",
    "ownerArea": "canonical-test",
    "testLayer": "unit",
    "reason": "Active passing Node test suite"
  },
  {
    "path": "tests/governanceProductionAuth.test.ts",
    "status": "active",
    "ownerArea": "governance",
    "testLayer": "security",
    "reason": "Phase 2.2C Production Governance Auth test suite"
  },
  {
    "path": "tests/governanceFirestoreRules.test.ts",
    "status": "active",
    "ownerArea": "governance",
    "testLayer": "security",
    "reason": "Phase 2.2C Firestore Rules Security test suite"
  },
  {
    "path": "tests/governanceImmutability.test.ts",
    "status": "active",
    "ownerArea": "governance",
    "testLayer": "governance",
    "reason": "Phase 2.2C Immutability & Record Integrity test suite"
  },
  {
    "path": "tests/governanceAuditConcurrency.test.ts",
    "status": "active",
    "ownerArea": "governance",
    "testLayer": "governance",
    "reason": "Phase 2.2C Audit Chain Concurrency test suite"
  },
  {
    "path": "tests/governanceMigrationSafety.test.ts",
    "status": "active",
    "ownerArea": "governance",
    "testLayer": "governance",
    "reason": "Phase 2.2C Migration Shell & Conflict Matrix test suite"
  },
  {
    "path": "tests/governanceEnvironmentSafety.test.ts",
    "status": "active",
    "ownerArea": "governance",
    "testLayer": "security",
    "reason": "Phase 2.2C Fail-Closed Environment Safety test suite"
  }
];
