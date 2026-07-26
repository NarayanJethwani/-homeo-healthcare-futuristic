# Test Suite Quarantine Policy & Governance

**Effective Date**: 2026-07-25  
**Version**: 1.0.0  
**Enforcement Tool**: `scripts/audit-test-manifest.ts`  

---

## 1. Purpose & Core Principles

The Test Suite Quarantine Policy governs the temporary isolation of test suites that cannot execute under the canonical CLI test runner. 

> [!CAUTION]
> **Anti-Pattern Prevention**: Quarantine MUST NOT be used to hide failing assertions in required functionality. Quarantining a suite that blocks Phase 2.2B governance or security will immediately cause CI to block merging.

---

## 2. Mandatory Metadata Standards

Every entry in `TEST_SUITE_MANIFEST` with `status: "quarantined"` MUST include all of the following fields:

```typescript
export interface TestSuiteManifestEntry {
  path: string;
  status: "quarantined";
  ownerArea: string;
  testLayer: "unit" | "integration" | "security" | "performance" | "governance";
  reason: string;             // Detailed explanation of failure or runner mismatch
  risk: "critical" | "high" | "medium" | "low";  // Risk assessment
  trackingIssue: string;      // Stable tracking identifier (e.g. QUARANTINE-...)
  owner: string;              // Responsible engineering area (e.g. frontend-core)
  lastExecutionResult: string;// Last observed error message
  plannedResolution: string;  // Specific action plan to reactivate the suite
}
```

---

## 3. Enforcement Rules in Manifest Audit

The manifest audit script (`scripts/audit-test-manifest.ts`) will fail CI when:

1. **Incomplete Metadata**: Any quarantined entry lacks `reason`, `risk`, `trackingIssue`, `owner`, `lastExecutionResult`, or `plannedResolution`.
2. **Critical/High Risk Quarantine**: Any quarantine marked `critical` or `high` risk is present during merge verification without an approved exception.
3. **Phase 2.2B Blocker**: Any quarantined suite covering authentication, RBAC, governance schema, or audit atomicity is present.
4. **Missing File**: A quarantined path disappears from the filesystem without explicit manifest status update.
