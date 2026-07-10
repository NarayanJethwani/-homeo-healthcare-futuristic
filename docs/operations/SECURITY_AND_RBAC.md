# Security and Role-Based Access Control (RBAC) Operations Manual

This document details the configuration, enforcement boundaries, audit logging policies, and verification steps for the administrative, clinical, and editorial interfaces of the Homeo Healthcare Knowledge Platform & Clinical OS.

---

## 1. Centralized Role-Permission Matrix

The platform defines six roles and evaluates permissions on both client UI surfaces and server API endpoints.

| Role | Permissions Key Set | Description |
| :--- | :--- | :--- |
| `super-admin` | All Permissions | Full master control over user management, subscriptions, publishing, rollback, CMS, and analytics. |
| `clinical-reviewer` | `CMS_CLINICAL_APPROVE`, `WORKFLOW_ASSIGN` | Clinical quality control. Approves articles for compliance, assigns editorial workflow tasks. |
| `editor` | `CMS_DRAFT_EDIT`, `WORKFLOW_ASSIGN` | Writes and updates CMS drafts. Assigns draft editing tasks. |
| `operations` | `CMS_DRAFT_EDIT`, `WORKFLOW_ASSIGN`, `RAG_INDEX_MANAGE`, `OBSERVABILITY_VIEW` | System operation role. Syncs vectors, manages indexing queue, views search console and GA4. |
| `analytics-viewer` | `OBSERVABILITY_VIEW` | Read-only telemetry views for SEO, Google Search Console, and Google Analytics. |
| `read-only-admin` | None | Backward-compatible role for legacy doctor panel reads. No mutative admin permissions. |

---

## 2. Standardized 401/403 Responses

All administrative API endpoints return standardized JSON payloads to prevent leaking information.

### 401 Unauthorized
```json
{
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required."
  }
}
```

### 403 Forbidden
```json
{
  "ok": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions."
  }
}
```

---

## 3. Route-Level Protection Coverage

All admin API route handlers located in `src/app/api/admin/` must call `authorizeRequest` or `requireAdminApiSession` directly.

| API Route | Required Permission | Description |
| :--- | :--- | :--- |
| /api/admin/cms | `CMS_DRAFT_EDIT` (Post drafts), `CMS_CLINICAL_APPROVE` (Approve), `CMS_PUBLISH` (Publish), `CMS_ROLLBACK` (Rollback) | Editorial Cockpit mutations. |
| /api/admin/workflow | `WORKFLOW_ASSIGN` | Workflow task transition and assignments. |
| /api/admin/observability/rag-health | `RAG_INDEX_MANAGE` (POST index), `OBSERVABILITY_VIEW` (GET stats) | RAG Index admin control tab. |
| /api/admin/observability/analytics | `OBSERVABILITY_VIEW` | Analytics reports. |
| /api/admin/observability/seo | `OBSERVABILITY_VIEW` | Search Console reports. |
| /api/admin/sync-vector | `RAG_INDEX_MANAGE` | Vector updates. |
| /api/admin/remove-doctor | `USER_MANAGE` | Practitoner removal. |
| /api/admin/extend-subscription | `SUBSCRIPTION_MANAGE` | Subscription management (Legacy). |
| /api/admin/generate-summaries | `CMS_DRAFT_EDIT` | AI-assisted summaries generation. |
| /api/admin/audit-content | `CMS_DRAFT_EDIT` | AI compliance editing checks. |
| /api/admin/session | **EXEMPT** | Handles user login/logout and session verification. |
| /api/admin/users | `USER_MANAGE` | Lists all registered practitioner accounts. |
| /api/admin/users/[userId] | `USER_MANAGE` | Fetch single profile or PATCH profile metadata updates. |
| /api/admin/users/invite | `USER_MANAGE` | Create new invitations, generating raw tokens (shown once). |
| /api/admin/users/invitations | `USER_MANAGE` | List all invitations (hides tokenHash). |
| /api/admin/users/invitations/[inviteId]/revoke | `USER_MANAGE` | Revoke a pending invitation. |
| /api/admin/users/[userId]/role | `USER_MANAGE` | Modify user roles (blocks self-escalation). |
| /api/admin/users/[userId]/suspend | `USER_MANAGE` | Suspend user accounts. |
| /api/admin/users/[userId]/reactivate | `USER_MANAGE` | Reactivate suspended user accounts. |
| /api/admin/users/[userId]/deactivate | `USER_MANAGE` | Deactivate user accounts. |
| /api/admin/users/[userId]/subscription | `SUBSCRIPTION_MANAGE` | Extend practitioner subscriptions. |
| /api/admin/invitations/accept | **EXEMPT** | Token-protected onboarding endpoint (verifies tokenHash). |
| /api/account/profile | **SESSION ONLY** | GET self profile / PATCH safe edits (displayName, specialties, clinicLocation). |
| /api/account/security-activity | **SESSION ONLY** | GET filtered personal security audit log timeline. |
| /api/account/preferences | **SESSION ONLY** | POST save personal visual workspace preferences. |

---

## 4. Middleware Boundary and Exclusions

The global Next.js boundary [middleware.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/middleware.ts) enforces session checks:
- **Protected Pages**: `/admin/:path*`
- **Protected API Routes**: `/api/admin/:path*` & `/api/account/:path*`
- **Exemptions**: `/admin/login`, `/api/admin/session`, and `/api/admin/invitations/accept` are excluded to allow clinical practitioners to sign in and accept invitations.
- **Unauthenticated Handling**:
  - API routes: Returns standardized `401 Unauthorized` JSON directly.
  - Page routes: Redirects to `/admin/login`.

---

## 5. Security Audit Log Sanitizer Policy

To comply with patient privacy guidelines, the audit log system recursively sanitizes all event details before logs are written to Firestore or printed to console.

### Key Redactions
- **Credentials/Secrets**: `password`, `token`, `cookie`, `authorization`, `apikey`, `secret`, `credential`, `session`, `signature`, `privateKey`, `accessToken`, `refreshToken`, `idToken`.
- **PHI/PII**: `patient`, `name`, `dob`, `ssn`, `phone`, `email`, `address`, `caseId`, `complaint`, `symptom`, `diagnosis`, `prescription`, `notes`, `clinicalNote`.

### Pattern-Based Redactions
- Email addresses (`*@*.*`)
- Phone numbers
- Date-of-birth patterns (YYYY-MM-DD, MM/DD/YYYY)
- SSN-like values
- Obvious JWT tokens or long hex cookies

### String Truncation
Strings longer than 200 characters are truncated to 100 characters and suffixed with `... [TRUNCATED]`.

---

## 6. Dev Bypass Production Restrictions

- Dev bypass capabilities (`ALLOW_DEV_ADMIN_BYPASS`) are strictly restricted to local development environments (`NODE_ENV !== "production"`).
- Hardcoding `ALLOW_DEV_ADMIN_BYPASS = true` in source code is blocked by the automated verify checks.
- If bypass is requested in production, it is ignored and logs a critical security escalation warning event.

---

## 7. Remaining Risks & Mitigation

- **Remaining operational dependency**: secure production environment variables and Firebase/Admin credentials must remain correctly configured and rotated as needed.
- **Key Rotation**: Secure session secrets (`ADMIN_SESSION_SECRET`) are stored in Environment Variables. If compromised, change the environment key to instantly invalidate all active admin sessions.
- **Client State Advisory Only**: Dashboard components adjust menus dynamically for user convenience, but all actual enforcement and validation is executed on server route entry via `authorizeRequest` (including real-time practitioner status queries).
