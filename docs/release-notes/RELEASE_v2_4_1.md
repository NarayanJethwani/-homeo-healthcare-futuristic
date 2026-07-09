# Version 2.4.1 Release Notes — Observability Privacy, Security & Hardening

Version 2.4.1 is a production stability and compliance release focusing on HIPAA privacy safeguards, rate-limiting guards, error sanitization, and priority scoring in the editorial analytics cockpit.

---

## Key Achievements

### 1. Robust PII & PHI Redaction Regexes
- **Module**: `src/features/knowledge/analytics/knowledgeSearchAnalytics.ts`
- **Updates**:
  - Intercepts and redacts ZIP codes (`\b\d{5}(?:-\d{4})?\b`) and multi-word street addresses (e.g. `123 Main Street`).
  - Intercepts case file / patient tags (e.g. `case #123`, `patient 902`).
  - Intercepts remedy potencies/dosages (e.g. `Sulphur 30C qd`, `Arnica 200c drops twice daily`).
  - Intercepts clinician/patient capitalized name sequences (e.g. `Mr. Narayan Jethwani`, `Dr. Patel's custom mix`).
  - Replaces all matching queries with `[redacted-sensitive-query]`.

### 2. Telemetry Write Rate-Limit Shield
- Coded a global in-memory rate-limiter inside the public search event handler.
- Restricts persistent Firestore telemetry writes to a maximum of **60 queries per minute**.
- Excess telemetry is still stored locally in temporary browser memory but omitted from persistent write triggers, keeping Firestore protected.

### 3. Serverless API Route Hardening
- **Routes**: `/api/admin/observability/seo` and `/api/admin/observability/analytics`
- **Security**:
  - Standardized error catch blocks to prevent detailed stack traces or credential validation errors from leaking to frontend JSON callers.
  - Ensures service account keys are never logged.

### 4. Admin UI Disclaimers
- Surfaced clear, visible notice disclaimers at the top of the SEO and Analytics dashboard workspaces:
  *"Analytics guide editorial prioritization. They do not represent clinical validation."*
- Confirmed that data status strings explicitly state the data source (Live vs Mock).

### 5. Editorial Priority Scoring Service
- **Service**: `src/features/knowledge-admin/services/editorialPriorityService.ts`
- **Rules**:
  - Safety alerts/contraindications automatically raise curation priority to `Critical` (score 100).
  - Cornerstone articles lacking adequate citations raise priority to `Critical` (score 95).
  - High view count drafts raise priority to `High` (score 85).
  - General low CTR or citation warning articles are sorted to `Medium`.
  - Guarantees that telemetry never marks an article as clinically reviewed, keeping clinical reviews fully peer-verified.

### 6. Clinical OS Telemetry Scaffold
- Built `src/features/knowledge/analytics/clinicalOsKnowledgeUsage.ts` implementing safe aggregate event logging for remedy and disease hover/click metrics without patient or clinic IDs.

---

## Automated Verification

All automated tests passed successfully with 100% success rate:
- `tests/knowledgeAnalyticsPrivacy.test.ts` (12 tests passed)
- `tests/observabilityAdapters.test.ts` (4 tests passed)
- `tests/editorialPriorityService.test.ts` (6 tests passed)
- Full regression check of all E2E clinical routing, AI router, hybrid vector searches, and KMS gates passed (all 48 test targets passing).
