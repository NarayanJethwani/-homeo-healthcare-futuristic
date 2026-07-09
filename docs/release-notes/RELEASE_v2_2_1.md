# Release Notes - v2.2.1 (AI Knowledge Layer & Performance Safety)

This release implements V2.2.1: **AI Knowledge Layer & Performance Safety**, incorporating structured vector indexing, safe query embedding, automated summaries drafting, and comprehensive safety gates for clinical governance.

## Key Highlights

### 1. High-Performance Session Vector Caching
- Preloaded standard static cornerstone seeds from `vectors.json` using `MemoryVectorStore`.
- Structured the `MemoryVectorStore` to hold runtime cached vector data in in-memory session arrays, avoiding Vercel serverless filesystem read/write failures in production.
- Refactored `hybridSearch` in `ragService.ts` to query `MemoryVectorStore` instead of compiling embeddings for documents on-the-fly inside the search loop. This removes document-loop embedding calls, resolving high search latencies.
- Document entries lacking cached vectors or encountering model dimension mismatches fall back gracefully to Jaccard keyword scoring rather than blocking search or triggering live generation.

### 2. Multi-Tiered AI Endpoints & Workspaces
- Developed `/api/admin/generate-summaries` producing separate draft summaries (Patient-friendly, Practitioner pathophysiological, Student/Educational).
- Developed `/api/admin/audit-content` calculating SEO, readability, localization, and AI readiness scores. Integrates medical safety check rules to flag claims of guaranteed cures or advising discontinuation of conventional treatments.
- Developed `/api/admin/sync-vector` for synchronization of custom article embeddings.
- Incorporated these utilities into an interactive **AI Assist & Quality Audit** cockpit modal tab under `/admin/knowledge-editorial`.

## Security & Verification
- Validated input parameters (types, length limit caps of `100,000` chars) on all AI routes.
- Suppressed stack traces and internal secrets in public error payloads.
- Added explicit warnings:
  - `AI-generated draft suggestions. Requires clinical editorial review before use.`
  - `This audit is an editorial support tool, not clinical validation.`
  - `Session vector cache updated. Persistent vector storage pending.`
- Added full regression tests verifying zero document-loop embeddings and correct fallback/mismatch parameters.
- verified clean compiler typechecks and eslint rule execution.
