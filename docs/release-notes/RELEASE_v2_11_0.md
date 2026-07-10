# Release Notes — Version 2.11.0: Practitioner Workspace Personalization, Profile Settings & Account Security

## Sprint Overview
Sprint 14 implements the user-facing settings layer, enabling logged-in practitioners to modify safe profile metadata, customize visual preferences, inspect their read-only permissions and subscription states, and review their recent security timeline entries.

---

## Key Features & Implementations

### 1. Isomorphic Profile API Routes
- **`GET /api/account/profile`**: Session-bound read of the practitioner's active details and permissions list.
- **`PATCH /api/account/profile`**: Allows mutating safe fields (`displayName`, `clinicLocation`, `specialties`) while explicitly rejecting administrative role/status/expiry modifications at the route boundary.
- **`GET /api/account/security-activity`**: Retrieves personal audit logs, redacting patient PII or long stack traces.
- **`POST /api/account/preferences`**: Saves compact view density toggles and clinical disclaimers preferences.

### 2. Front-End Dashboard Settings Tab
- Integrated a new `"account"` sidebar link and view pane rendering cards for forms, access parameters, preference toggles, and security logs.
- Renders error state prompts or restricted layout panels for expired, suspended, or deactivated account sessions.

### 3. Real-Time Account Security Enforcement
- Extended the `authorizeRequest` API gateway helper to check status fields directly in the practitioner database on every request.
- Instantly blocks suspended/deactivated sessions and restricts expired subscription accounts from clinical routes while still permitting settings/renewal request tabs.

---

## Verification Results
- **Automated Tests**: Added 17 integration tests in `tests/practitionerProfile.test.ts` covering profiles, updates, validation logic, logs, and restrictions. All passed.
- **Production Pre-flight**: Updated `verify-production-readiness.ts` to assert that settings files are present and `/api/account/*` endpoints are guarded by session checks. Passed successfully.
