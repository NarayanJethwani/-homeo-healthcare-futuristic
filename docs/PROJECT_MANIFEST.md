# Project Manifest

This document serves as the canonical index and directory for the entire Unified Clinical OS and Knowledge Platform.

---

## 1. Project Vision
To integrate classical homeopathic therapeutics with modern clinical validation systems, providing clinicians with a single-pane decision support workspace backed by an evidence-based knowledge graph.

---

## 2. Product Modules

*   **Clinical OS (`v0.9`)**: Core clinical engine handling cases, symptom logs, repertorization scores, and remedy grades.
*   **Knowledge Platform (`v2.0`)**: Public-facing medical knowledge base containing remedies, symptoms, diseases, and lab test guidelines.
*   **AI Router (`v1.3`)**: Smart LLM query routing service integrating multi-provider fallback layers and dynamic caching.
*   **Knowledge Graph (`v1.0`)**: Canvas-based interactive connection mapper for visualizing symptom-remedy relationships.
*   **Treatment Planner (`v0.7`)**: Dynamic timeline and prescription builder for patient cases.
*   **Patient Portal (`v0.8`)**: Secure check-in and dashboard for client records.
*   **Website (`v2.0`)**: Public base pages, subscription store, and main landing pages.

---

## 3. Technology Stack

- **Framework**: Next.js 16.2.9 (using Turbopack and React Server Components)
- **Styling**: TailwindCSS v4 with PostCSS
- **Database**: Cloud Firestore (Firebase SDK)
- **Auth**: Firebase Authentication SDK
- **Caching**: Redis (dynamic fallback to Local In-Memory Map)
- **AI Integrations**: Google Gemini API (first choice), DeepSeek API, local Ollama endpoints.

---

## 4. Repository Structure

```
Unified Clinical OS Root
├── docs/                      # Permanent Documentation System
│   ├── architecture/          # ADR index and system design guides
│   ├── release-notes/         # Detailed release notes per version
│   ├── MASTER_DEVELOPMENT_LOG.md
│   ├── RELEASE_NOTES.md
│   ├── CURRENT_ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   └── PROJECT_DASHBOARD.md
├── scripts/                   # CLI tools and automation scripts
│   └── update-docs.js         # Docs compilation and metrics script
├── src/
│   ├── app/                   # Next.js App Router (pages and APIs)
│   ├── components/            # Global UI component library
│   ├── features/              # Feature modules (isolated domains)
│   └── lib/                   # Shared utility services (firebase, aiRouter)
├── tests/                     # Integration and workflow test suites
└── firestore.rules            # Database security rules
```

---

## 5. Active Release & Roadmap
- **Current Version**: `v2.0.1` (Sprint 3: AI Router Stability & Robustness)
- **Current Sprint**: Sprint 3
- **Future Milestone**: Phase 3 Milestone: AI Router Stability & Security audits.

---

## 6. Document Directory

### 📂 Category A: Project Core & Vision
*   **[Developer Portal README](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/README.md)**: Main entry point and developer quickstart guide.
*   **[Project Manifest](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PROJECT_MANIFEST.md)**: Current file mapping product layouts and tech stacks.
*   **[Executive Project Dashboard](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PROJECT_DASHBOARD.md)**: Real-time code statistics, test verification statuses, and knowledge platform counts.
*   **[AI Assistant Guidelines](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/AI_ASSISTANT_GUIDELINES.md)**: Standard rules, styles, and release parameters for AI assistants.

### 📂 Category B: Engineering & Architecture
*   **[Architecture Decision Records (ADRs)](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/architecture/ADR_INDEX.md)**: Record of formal engineering decisions (ADR-001 through ADR-004).
*   **[Current Architecture Overview](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/CURRENT_ARCHITECTURE.md)**: Detailed module boundaries, AI router flowcharts, and sitemap/caching models.
*   **[Data Model Reference](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/DATA_MODEL.md)**: Firestore collection schemas, relational mapping, and key TypeScript interfaces.
*   **[Platform Statistics Dashboard](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PLATFORM_STATISTICS.md)**: Historical charts tracking codebase growth, LOC count, and rule validation rules.

### 📂 Category C: Development & Sprints
*   **[Product Roadmap](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PRODUCT_ROADMAP.md)**: Chronological project phase mapping and active development features.
*   **[Milestone Archive](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/MILESTONE_ARCHIVE.md)**: Signed-off deliverables and criteria completed during each milestone review.
*   **[Master Development Log](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/MASTER_DEVELOPMENT_LOG.md)**: Detailed deployment histories, files changed, and sprint notes.

### 📂 Category D: Operations & Release Governance
*   **[Change Control Board Playbook](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/CHANGE_CONTROL.md)**: The strict operational pipeline governing production deployment.
*   **[Release Notes Register](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/RELEASE_NOTES.md)**: Version registry listing deployment dates, tags, and highlights.
*   **[Production Build History](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/BUILD_HISTORY.md)**: Automatic logs of build run times, route counts, and typecheck verifications.
*   **[Deployment Checklist](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/DEPLOYMENT_CHECKLIST.md)**: Standard release gate procedures, smoke tests, and rollback playbook instructions.
*   **[Operations Runbook](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/OPERATIONS_RUNBOOK.md)**: Database migrations, disaster recovery procedures, and secure key parameters.
*   **[Known Issues & Technical Debt Register](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/KNOWN_ISSUES_REGISTER.md)**: Tracked bugs, severity grades, and operational bypasses.
*   **[Future Backlog](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/FUTURE_BACKLOG.md)**: Registry of features scheduled for future sprints.
*   **[Editorial Standards](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/EDITORIAL_STANDARDS.md)**: Strict rules for medical citation formats and safe tone requirements.
