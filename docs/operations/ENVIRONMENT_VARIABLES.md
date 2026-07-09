# Environment Variables & Secrets Guide

This guide details all configuration variables used by the Homeo Healthcare Knowledge Platform & Clinical OS.

---

## 1. Firebase & Database Secrets

### `FIREBASE_PROJECT_ID`
- **Expected Format**: String (e.g., `homeo-healthcare-platform`)
- **Required**: Yes, for Firestore persistence.
- **Server/Client**: **Server-only**.
- **Fallback**: Defaults to standard memory fallback repositories if missing.

### `FIREBASE_CLIENT_EMAIL`
- **Expected Format**: Email format (e.g., `firebase-adminsdk-xxxxx@homeo-healthcare-platform.iam.gserviceaccount.com`)
- **Required**: Yes, for service account authentication.
- **Server/Client**: **Server-only**. Never expose to client!
- **Fallback**: Memory fallback.

### `FIREBASE_PRIVATE_KEY`
- **Expected Format**: PEM encoded RSA private key (starts with `-----BEGIN PRIVATE KEY-----`)
- **Required**: Yes, for authenticating server admin commands.
- **Server/Client**: **Server-only**. NEVER check this variable into version control.
- **Fallback**: Graceful fallback to memory mode.

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
- **Fallback**: Falls back to mock embedding generator if unreachable.

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

---

## 5. Security Restrictions
- All variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side bundle and are visible to users. **Never prefix service account keys, private API keys, or session secrets with `NEXT_PUBLIC_`.**
- If a server-only variable is referenced in client components, Next.js will render it as `undefined` at runtime.
