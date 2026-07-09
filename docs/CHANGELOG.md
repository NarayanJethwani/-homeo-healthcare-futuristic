# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1] - 2026-07-08

### Added
- Created a permanent Project Documentation system framework and automated update CLI script (`scripts/update-docs.js`).
- Created a `docs/DEPLOYMENT_CHECKLIST.md` and `docs/EDITORIAL_STANDARDS.md`.
- Added the `docs:update` command script directly inside `package.json`.
- Integrated strict rate-limiting considerations into AI Router fallback workflows.

### Changed
- Configured `.gitignore` to ignore active logs in `pending-update.json`, moving the format mapping to `pending-update.json.example`.

### Fixed
- Refactored AI Router fallback sequence to retry DeepSeek if Gemini fails.
- Optimized local storage hydration for search queries in the main dashboard.
- Resolved Server Component serialization error on `printAction` handler.
- Fixed empty graph satellite nodes rendering issues.

---

## [2.0.0] - 2026-07-08

### Added
- Expanded clinical databases to 343 articles (150 remedies, 75 diseases, 75 symptoms, 40 lab tests, 13 comparisons, 9 hubs).
- Integrated dynamic sitemap generation and 426 static routes.
- Created `KnowledgeGraphExplorer` with full-screen viewer, legend details, and interactive node tooltips.

### Fixed
- Fixed broken clinical detail page routes in public directory.
- Resolved search hydration and node layout rendering bugs.

---

## [1.0.0] - 2026-07-03

### Added
- Consolidated clinician workspace into a single pane of glass, avoiding parallel routing models.
- Configured repertory graph traversals to query relations and differential pathways.
- Implemented RAG-supported local caching, confidence thresholds, and explicit provenance markers.
- Developed approval-status tracking (Draft, Review, Verified, Deprecated, Archived) to audit knowledge additions.
- Established custom, configurable scoring weights and automated calibration case suites.
- Activated indexing of Dr. Jethwani's clinical observations.
