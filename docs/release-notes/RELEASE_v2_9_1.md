# Release Notes - v2.9.1 (Sprint 12.1)

**Release Date**: 2026-07-09  
**Release Tag**: `v2.9.1-security-hardening`  
**Status**: SUCCESS / Vercel Production  

---

## Highlights
Hardened the Security Enforcement and Auditing layers across the platform. Implemented recursive PII/PHI sanitization in security logs, standardized API exception shapes, verified route-level coverage, blocked local dev bypasses in production, and expanded verification tests.

## Major Changes
- **Recursive Audit Log Sanitizer (`auditLogger.ts`)**: Built `sanitizeAuditPayload` and `sanitizeAuditMetadata` helpers to recursively scrub nested objects and arrays of credentials/secrets and patient clinical details (names, diagnoses, emails, phone numbers, DOBs, SSNs, long text notes) before writing to Firestore or print streams.
- **Standardized Response Shapes (`apiAuth.ts`)**: Confirmed 401 Unauthorized and 403 Forbidden API responses return standard JSON error blocks without raw exception messages, token payloads, or server trace details.
- **Route-Level Protection Audits (`verify-production-readiness.ts`)**: Programmed dynamic script scanner verifying every admin API endpoint under `src/app/api/admin/` directly imports and uses verified auth guards (with `/api/admin/session` as the single exempt path).
- **Bypass Safety Guards**: Added checking gates to reject development bypass options (`ALLOW_DEV_ADMIN_BYPASS`) if the server is running in production mode (`NODE_ENV === "production"`).
- **Expanded Security Tests (`tests/rbacSecurity.test.ts`)**: Created 21 detailed test scenarios asserting proper recursive redactions, standardized status codes, bypass blocks, and coverage check success.
