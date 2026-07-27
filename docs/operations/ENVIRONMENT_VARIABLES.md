# Environment Variables & Secrets Guide

This guide details all configuration variables used by the Homeo Healthcare Knowledge Platform & Clinical OS.

---

## 1. Firebase & Database Secrets

### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Expected Format**: Firebase project ID (for example, `homeo-healthcare`).
- **Required**: Yes for configured Firestore operation.
- **Server/Client**: **Client-visible identifier**; it is not a secret, but production values are validated server-side.
- **Safety**: Production use must match the explicit allowlist in `REPERTORY_PRODUCTION_FIREBASE_PROJECT_IDS`.

### `FIREBASE_CLIENT_EMAIL`
- **Expected Format**: Email format (e.g., `firebase-adminsdk-xxxxx@homeo-healthcare-platform.iam.gserviceaccount.com`)
- **Required**: Required when inline service-account credentials are used; omit when explicitly using ADC.
- **Server/Client**: **Server-only**. Never expose to client!
- **Fallback**: None. Invalid or incomplete production configuration fails closed.

### `FIREBASE_PRIVATE_KEY`
- **Expected Format**: PEM encoded RSA private key (starts with `-----BEGIN PRIVATE KEY-----`)
- **Required**: Required when inline service-account credentials are used; omit when explicitly using ADC.
- **Server/Client**: **Server-only**. NEVER check this variable into version control.
- **Fallback**: None. Invalid or incomplete production configuration fails closed.

### `REPERTORY_PRODUCTION_FIREBASE_PROJECT_IDS`
- **Expected Format**: Comma-separated Firebase project IDs.
- **Required**: Yes for governed production Firestore operation.
- **Server/Client**: **Server-only**.
- **Safety**: The active project and credential project must match this allowlist.

### `REPERTORY_USE_ADC`
- **Expected Format**: Literal `true` to opt into Application Default Credentials.
- **Required**: Only when ADC is intentionally used instead of inline credentials.
- **Server/Client**: **Server-only**.
- **Safety**: `GOOGLE_APPLICATION_CREDENTIALS` is rejected unless this opt-in is present.

### `FIRESTORE_EMULATOR_HOST`
- **Expected Format**: Loopback host and port only, such as `127.0.0.1:8080`, `localhost:8080`, or `[::1]:8080`.
- **Required**: Only for emulator-backed tests and local verification.
- **Server/Client**: **Server-only**.
- **Safety**: Schemes, paths, wildcard addresses, non-loopback hosts, and invalid ports fail closed.

---

## 2. Embedding Providers Configurations

### `GEMINI_API_KEY`
- **Expected Format**: Alpha-numeric string.
- **Required**: Yes, to generate dynamic text embeddings for the RAG index.
- **Server/Client**: **Server-only**.
- **Fallback**: If unavailable, the embedding queue falls back to keyword matching.

### `OLLAMA_HOST`
- **Expected Format**: URL (e.g., `http://localhost:11434`)
- **Required**: Optional, for local development testing with local nomic-embed-text models.
- **Server/Client**: **Server-only**.
- **Fallback**: Provider health failure is surfaced to the governed routing or cache boundary; production code does not silently generate mock embeddings.

### `ENABLE_LOCAL_OLLAMA_EMBED_CACHE`
- **Expected Format**: Literal `true` to enable the governed on-disk corpus cache.
- **Required**: No. Defaults to disabled.
- **Server/Client**: **Server-only**.
- **Safety**: The cache is bypassed in CI and serverless/Vercel environments. Enabling it does not make an entity eligible; the entity must also exist in the approved non-PHI eligibility projection with an exact published-version match.

### `OLLAMA_CACHE_DIR`
- **Expected Format**: Path to a local, access-controlled cache directory.
- **Required**: Required by the activation runbook when `ENABLE_LOCAL_OLLAMA_EMBED_CACHE=true`.
- **Server/Client**: **Server-only**.
- **Safety**: Use a dedicated local path with owner-only permissions. Do not point it at a shared, synchronized, web-served, or patient-data directory.

### `OLLAMA_CORPUS_SNAPSHOT_VERSION`
- **Expected Format**: Governed snapshot version such as `v1.0.0`.
- **Required**: Recommended for every enabled deployment; defaults to `v1.0.0`.
- **Server/Client**: **Server-only**.
- **Safety**: Increment only through a reviewed source-version activation change with rollback evidence.

See `docs/operations/OLLAMA_CACHE_ACTIVATION.md` for mandatory activation, stop, and rollback gates.

---

## 3. Observability & Search Integrations

### `GOOGLE_SEARCH_CONSOLE_KEY`
- **Expected Format**: JSON string or service account key file path.
- **Required**: Optional, for fetching SEO crawl states and search analytics.
- **Server/Client**: **Server-only**.
- **Fallback**: Mock telemetry reports when unavailable.

### `GA4_MEASUREMENT_ID`
- **Expected Format**: String (e.g., `G-XXXXXXXXXX`)
- **Required**: Optional, for frontend analytics.
- **Server/Client**: **Client-safe**. Exposed via client page integrations.
- **Fallback**: Disabled when missing.

### `NEXT_PUBLIC_TELEMETRY_ENABLED`
- **Expected Format**: Boolean (`true` | `false`)
- **Required**: Yes.
- **Server/Client**: **Client-safe**. Controls whether client events are forwarded to the log ingestion endpoint.
- **Fallback**: Defaults to `false`.

---

## 4. Admin Authentication

### `ADMIN_SESSION_SECRET`
- **Expected Format**: String (minimum 32 characters key).
- **Required**: Yes, for signing admin session cookies.
- **Server/Client**: **Server-only**.
- **Fallback**: Locks editorial access until set.

### `GOVERNANCE_IDENTITY_HASH_SECRET`
- **Expected Format**: High-entropy string of at least 32 characters, managed by the deployment secret store.
- **Required**: Yes for KEP-1 private contributor onboarding mutations.
- **Server/Client**: **Server-only**. Never expose, log, or prefix with `NEXT_PUBLIC_`.
- **Safety**: Used as the HMAC key for normalized identity values. Missing or short values fail closed. Rotation requires a governed identity-lock migration because existing hashes are immutable.

### `NEXT_PUBLIC_ALLOW_DEV_ADMIN_BYPASS`
- **Expected Format**: Literal `true`, only when the server-side `ALLOW_DEV_ADMIN_BYPASS` flag is also enabled.
- **Required**: No; local browser validation only.
- **Server/Client**: Client-visible. It only bypasses the legacy local-storage navigation check; the server remains the authorization authority.
- **Production Rule**: Must remain unset.

---

## 5. Security Restrictions
- All variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side bundle and are visible to users. **Never prefix service account keys, private API keys, or session secrets with `NEXT_PUBLIC_`.**
- If a server-only variable is referenced in client components, Next.js will render it as `undefined` at runtime.
