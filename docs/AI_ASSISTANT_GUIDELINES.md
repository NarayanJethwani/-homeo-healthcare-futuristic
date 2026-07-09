# AI Assistant Development Guidelines

This document details the standard operating procedures, prompting preferences, coding styles, and governance models for AI assistants pair-programming on the Unified Clinical OS platform.

---

## 1. Interaction & Prompting Style

- **Planning Mode**: Before executing any code modification, the AI assistant must present an `implementation_plan.md` outlining changes, files involved, and verification methods, and wait for user approval.
- **Conciseness**: Maintain a professional, direct communication tone. Do not summarize files when the link is present.
- **Link Integrity**: Always link files and code references using standard Markdown files with the `file://` scheme (e.g. `[main.ts](file:///src/main.ts)`). Never wrap the link text inside backticks as that breaks rendering.

---

## 2. Coding Standards & Naming Conventions

- **Subsystem Separation**: Code modifications should respect modular feature domains (e.g. clinical features in `src/features/repertory/` and public base page layouts in `src/app/`).
- **TypeScript Strictness**: Typechecks must complete without warnings. Avoid using type `any` unless absolutely necessary, and type all function interfaces and database collections.
- **Naming Conventions**:
  - React Component Files: PascalCase (e.g., `KnowledgeGraphExplorer.tsx`).
  - Libraries & Utilities: camelCase (e.g., `aiRouter.ts`).
  - Feature content files: kebab-case (e.g., `aconitum-napellus.ts`).

---

## 3. Architecture & Documentation Rules

- **Fact-Based ADRs**: Do not record architectural details as fact in ADRs unless the corresponding files are fully implemented and verified in the codebase. Tag future designs as *Planned* or *Proposed*.
- **Documentation Categories**: All files inside `docs/` must belong to one of the four categories:
  1. **Project Core & Vision**
  2. **Engineering & Architecture**
  3. **Development & Sprints**
  4. **Operations & Release Governance**
- **Orphan Prevention**: Every newly created documentation page must be linked in `docs/README.md` and `docs/PROJECT_MANIFEST.md` under its respective category.

---

## 4. Release & Operations Workflow

- **Release Run**: Every production tag must trigger a compiler run using `npm run docs:update` to sync platform statistics and verify documentation integrity.
- **Build Logging**: Successful compiler runs under a version release must append a build history entry to `docs/BUILD_HISTORY.md` and log files to the `docs/release-notes/` directory.

---

## 5. Clinical Safety & Medical Safety Rules

- **Safety Warning Banner**: The sticky warning banner **"Clinical review required — do not auto-prescribe."** must remain visible and uncompromised on all interactive clinician workspaces.
- **Source Verification**: All medical claims must link to valid citation references (defined in `citations.ts`). Never generate placeholder or fake references.
- **Safety Critical Filters**: Ensure AI prompt queries are checked against security triggers and medical safety crisis filters to maintain compliance.
