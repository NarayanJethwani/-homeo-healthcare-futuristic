# Phase 2.2A — Test Baseline Restoration Plan

**Date**: July 25, 2026  
**Git Branch**: `fix/knowledge-clinical-hardening`  
**Status**: Active  

---

## 1. Overview

Phase 2.2A establishes an explicit, governed test manifest (`src/testing/testManifest.ts`) that categorizes every test suite in the repository into `active`, `quarantined`, or `retired` states.

---

## 2. Test Inventory Breakdown

| Classification | Count | Description |
| :--- | :--- | :--- |
| **Total Test Suites** | **46** | Complete repository test inventory evaluated |
| **Active Valid Suites** | **38** | Active test suites running under `npm test` |
| **Obsolete Retired Suites** | **8** | Legacy suites targeting deleted `src/lib/` modules; coverage transferred |
| **Quarantined Suites** | **0** | Quarantined suites requiring tracking issues |

---

## 3. Retired Suites & Transferred Safety Coverage

1. `tests/adminWorkflow.test.ts`: Targeted deleted `src/lib/clinicalDecisionSupport`, `src/lib/ragService`, and `src/lib/aiRouter`. Coverage transferred to `tests/publicationGuardSafety.test.ts` and `tests/phase2GovernanceSchema.test.ts`.
2. `tests/vectorStore.test.ts`: Targeted deleted `src/lib/ragService`. Coverage transferred to `tests/persistentVector.test.ts`.
3. `tests/ragPerformanceSafety.test.ts`: Targeted deleted `src/lib/ragService` and `src/lib/ollama`. Coverage transferred to `tests/publicationGuardSafety.test.ts` (RAG gating) and `tests/phase2-1GovernancePersistence.test.ts`.
4. `src/features/knowledge-admin/__tests__/kms.test.ts`: Targeted deleted `src/lib` modules. Coverage transferred to `tests/phase2GovernanceSchema.test.ts`.
5. `tests/publicApi.test.ts`: Targeted deleted `src/lib` modules. Coverage transferred to `src/features/knowledge/public/publicKnowledgeEntityDTO.ts` and `tests/publicationGuardSafety.test.ts`.
6. `tests/providerTelemetry.test.ts`: Targeted deleted `@/lib/aiRouter`. Coverage transferred to `tests/observabilityAnalytics.test.ts`.
7. `tests/ollamaEmbeddingsCache.test.ts`: Targeted deleted `src/lib/ollama`. Coverage transferred to `tests/corpusCacheActivationManifest.test.ts`.
8. `tests/embeddingQueueCacheIntegration.test.ts`: Targeted deleted `src/lib/ollama`. Coverage transferred to `tests/corpusCacheActivationManifest.test.ts`.
