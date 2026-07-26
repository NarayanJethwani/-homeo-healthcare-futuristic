# Knowledge Governance Monitoring & Synthetic Alert Verification

## 1. Alert Metric Definitions & Routes

The following 9 security and operational alerts are specified for Cloud Monitoring ingestion:

1. `governance.permission.denied` (Severity: WARNING, Threshold: > 5 / 5 min)
2. `governance.transaction.rollback` (Severity: WARNING, Threshold: > 3 / 5 min)
3. `governance.audit_chain.invalid` (Severity: CRITICAL, Threshold: >= 1)
4. `governance.migration.conflict` (Severity: ERROR, Threshold: >= 1)
5. `governance.client_access.denied` (Severity: INFO, Threshold: Baseline metric)
6. `governance.ai_approval.created` (Severity: CRITICAL, Threshold: >= 1)
7. `governance.rag_eligibility.changed` (Severity: CRITICAL, Threshold: >= 1)
8. `governance.withdrawn_content.exposed` (Severity: CRITICAL, Threshold: >= 1)
9. `governance.migration.count_mismatch` (Severity: ERROR, Threshold: >= 1)

---

## 2. Synthetic Test Verification

Synthetic events logged during unit and integration test runs (`tests/governanceProductionAuth.test.ts`, `tests/governanceEnvironmentSafety.test.ts`) confirm:
- Log entries are properly structured with required error codes (`UNAUTHENTICATED`, `UNMAPPED_CONTRIBUTOR`, `PERMISSION_DENIED`, `RECORD_IMMUTABLE_CONFLICT`).
- Sensitive PHI and session token details are 100% redacted from telemetry log payloads.
- Live Cloud Monitoring notification channel binding is marked `runbook-only` pending production deployment.
