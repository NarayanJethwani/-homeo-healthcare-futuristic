# Architecture Decision Records (ADR) Index

This directory documents the key architectural decisions made on the Unified Clinical OS platform.

## Active Architecture Decision Records

| ID | Title | Date | Status | Summary |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-004](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/architecture/adr/ADR-004-strict-rate-limiting-on-ai-router-endpoint.md) | Strict Rate Limiting on AI Router Endpoint | 2026-07-08 | Accepted | Implement Next.js middleware token-bucket rate limiting. |
| [ADR-001](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/architecture/adr/ADR-001-central-ai-router.md) | Central AI Router and Provider Fallback Chain | 2026-07-03 | Accepted | Strict fallback chain (Gemini -> DeepSeek/Qwen/GLM -> Local Ollama) |
| [ADR-002](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/architecture/adr/ADR-002-rag-caching.md) | RAG-supported Caching and Confidence Thresholds | 2026-07-03 | Accepted | Query matching using local RAG; Redis + in-memory cache fallbacks |
| [ADR-003](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/architecture/adr/ADR-003-unified-workspace.md) | Unified Single-Pane Workspace | 2026-07-03 | Accepted | Single-pane clinician dashboard synchronized via URL parameters |

---

> [!NOTE]
> New architectural changes must be proposed through an ADR file under `docs/architecture/adr/` before implementation.
