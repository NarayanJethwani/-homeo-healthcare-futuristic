# Observability & Editorial Analytics Policy

This document defines the privacy, security, and operational guidelines for the Homeo Healthcare Knowledge Platform's telemetry and analytics systems.

---

## 1. Core Principles

The Knowledge Platform collection of telemetry serves **only** editorial prioritization and discovery optimization. 

> [!IMPORTANT]
> **Analytics is not Clinical Validation**
> - Telemetry and engagement metrics (clicks, impressions, bounce rates) do not represent medical truth, clinical validation, or safety certifications.
> - High traffic on a remedy does not indicate clinical effectiveness or therapeutic endorsement.

---

## 2. Privacy & HIPAA Compliance

The platform operates in a strict healthcare context. Observability data must **never** contain Protected Health Information (PHI) or Personally Identifiable Information (PII).

### PHI/PII Redaction Rules
Every search query is run through the `redactSensitiveSearchQuery` utility before writing to Firestore.

The regex filters intercept and immediately redact to `[redacted-sensitive-query]` if any of the following exist:
- **Emails**: e.g., `user@domain.com`
- **Phone Numbers**: 7-digit, 10-digit, and international formats.
- **Dates of Birth (DOB) or SSNs**: e.g., `dob 10/12/1984`, SSNs matching `\d{3}-\d{2}-\d{4}`.
- **Addresses**: Multi-word street patterns and zip codes (e.g., `123 Main Street`, `zip 90210`).
- **Patient Names**: Mr. / Mrs. / Miss / Dr. prefixes followed by capitalized strings.
- **Case Numbers**: Clinical tags like `case #123`, `patient 902`.
- **Prescription details**: Remedy potencies (e.g. `30c`, `200c`, `1m`) and frequency guidelines (e.g. `qd`, `bid`, `twice daily`).
- **Excessive text**: Queries exceeding 80 characters are treated as potential copy-pasted clinical notes and redacted entirely.

### Allowed vs Disallowed Telemetry Fields

| Allowed Fields | Disallowed Fields (Blocked) |
| :--- | :--- |
| Sanitized, normalized search keywords | Unsanitized search inputs (with emails, names, etc.) |
| Aggregate counts (e.g., number of searches) | Patient identifiers, case IDs, or clinician IDs |
| General session duration (seconds) | Raw clinical notes or symptom copy-pastes |
| Page path impressions and organic clicks | Specific client IP addresses or precise geolocation |

---

## 3. Telemetry Rate Limiting & Storage Safety

To prevent database write exhaustion and denial-of-service risks:
- An in-memory rate limiter caps Firestore analytics writes to **60 writes per minute**.
- If the cap is reached, search events are logged to the temporary in-memory cache but skipped for persistent DB writes.
- Telemetry writes are **fully asynchronous and non-blocking**. If Firestore returns a permission or connection exception, public search results continue serving instantly.
- Document IDs are auto-generated hash strings, never containing raw search inputs.
- Collection Name: `knowledge_search_analytics`

---

## 4. Google API Credential Security

The Search Console and GA4 Data API adapters require authentication keys:
- Google credentials (`SEARCH_CONSOLE_CLIENT_EMAIL`, `SEARCH_CONSOLE_PRIVATE_KEY`, etc.) are read **strictly server-side**.
- The `googleapis` Node package is **never** imported into Next.js client components.
- In local development or if credentials are unconfigured, adapters fall back to mock simulation schemas.
- Adapter responses always return a `dataSource` tag indicating `Live` vs `Mock` source states.
- Any GSC/GA4 connection exception is caught, logged on the server, and a safe status returned to the client dashboard without returning stack traces.

---

## 5. Operations & Privacy Management
For procedures on monitoring telemetry logs and managing private key configurations:
- See the [Incident Response Runbooks (Runbook D: PHI/PII Telemetry Leakage Risk)](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/operations/INCIDENT_RUNBOOKS.md)
- See the [Environment Variables & Secrets Guide (Section 3: Observability)](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/operations/ENVIRONMENT_VARIABLES.md)

