# Developer Portal & Onboarding Guide

Welcome to the Unified Clinical OS and Knowledge Platform. This portal contains the governance, architectural, and operational documentation for the project, organized by maturity and operational scope.

---

## 🚀 1. Start Here

If you are a new developer or contributor, follow this quick onboarding path:
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Initialize and configure local environment variables (copy from `.env.example` to `.env.local`):
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Read the **[Editorial Standards & Clinical Guidelines](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/EDITORIAL_STANDARDS.md)** before writing any content or modifying clinical data structures.

---

## 📚 2. Portal Index & Directories

Select a category below to navigate the governance and engineering documentation:

### 📂 Category A: Project Core & Vision
High-level indices, vision statements, module tracking, AI interaction rules, and live health metrics.
*   **[Project README](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/README.md)**: Main developer portal landing page and quickstart guide.
*   **[Project Manifest](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PROJECT_MANIFEST.md)**: Master product layout, subsystem semantic versions, and technology stack.
*   **[Executive Project Dashboard](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PROJECT_DASHBOARD.md)**: Real-time code statistics, test verification statuses, and knowledge platform counts.
*   **[AI Assistant Guidelines](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/AI_ASSISTANT_GUIDELINES.md)**: Naming conventions, safety rules, prompting styles, and code standards for AI agents.

### 📂 Category B: Engineering & Architecture
Structural design patterns, data schemas, change indices, and system verification runs.
*   **[Architecture Decision Records (ADRs)](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/architecture/ADR_INDEX.md)**: Record of formal engineering decisions (ADR-001 through ADR-004).
*   **[Current Architecture Overview](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/CURRENT_ARCHITECTURE.md)**: Detailed module boundaries, AI router flowcharts, and sitemap/caching models.
*   **[Data Model Reference](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/DATA_MODEL.md)**: Firestore collection schemas, relational mapping, and key TypeScript interfaces.
*   **[Platform Statistics Dashboard](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PLATFORM_STATISTICS.md)**: Historical charts tracking codebase growth, LOC count, and rule validation rules.

### 📂 Category C: Development & Sprints
Timelines, iteration logs, and milestone signs-off for active product phases.
*   **[Product Roadmap](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/PRODUCT_ROADMAP.md)**: Chronological project phase mapping and active development features.
*   **[Milestone Archive](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/MILESTONE_ARCHIVE.md)**: Signed-off deliverables and criteria completed during each milestone review.
*   **[Master Development Log](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/MASTER_DEVELOPMENT_LOG.md)**: Detailed deployment histories, files changed, and sprint notes.

### 📂 Category D: Operations & Release Governance
Safety gates, change control boards, deployment checklist runbooks, registries, and build analytics.
*   **[Change Control Board Playbook](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/CHANGE_CONTROL.md)**: The strict operational pipeline governing production deployment.
*   **[Release Notes Register](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/RELEASE_NOTES.md)**: Version registry listing deployment dates, tags, and highlights.
*   **[Production Build History](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/BUILD_HISTORY.md)**: Automatic logs of build run times, route counts, and typecheck verifications.
*   **[Deployment Checklist](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/DEPLOYMENT_CHECKLIST.md)**: Standard release gate procedures, smoke tests, and rollback playbook instructions.
*   **[Operations Runbook](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/OPERATIONS_RUNBOOK.md)**: Database migrations, disaster recovery procedures, and secure key parameters.
*   **[Known Issues & Technical Debt Register](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/KNOWN_ISSUES_REGISTER.md)**: Tracked bugs, severity grades, and operational bypasses.
*   **[Future Backlog](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/FUTURE_BACKLOG.md)**: Registry of features scheduled for future sprints.
*   **[Editorial Standards](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/EDITORIAL_STANDARDS.md)**: Strict rules for medical citation formats and safe tone requirements.

---

## 🛠️ 3. Verification Commands

*   **Execute Typechecking**:
    ```bash
    npx tsc --noEmit
    ```
*   **Run Local Unit & Integration Tests**:
    ```bash
    npm test
    ```
*   **Compile Documentation**:
    Add change lists to `docs/pending-update.json` and compile:
    ```bash
    npm run docs:update
    ```
