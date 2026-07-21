# Executive Project Dashboard

This dashboard is automatically updated by the documentation compiler and shows the active status, codebase statistics, and content counts of the Unified Clinical OS platform.

---

## 1. Project Health

- **Typecheck Status**: `PASS`
- **Build Status**: `PASS`
- **Lint Status**: `PASS`
- **Tests Status**: `PASS`
- **Route Audit Gate**: `PASS`
- **SEO Audit Gate**: `PASS`
- **Structured Data Gate**: `PASS`
- **Knowledge Graph Audit Gate**: `PASS`
- **Documentation Sync**: `PASS`

---

## 2. Current Release

- **Deployed Release Train**: `Sprint 28H` (untagged)
- **Latest Formal Git Tag**: `v2.18.0`
- **Deployed Commit SHA**: `a617ecee753074b2eb06e799c5d2c2d068a728d1`
- **Branch**: `main`
- **Environment**: `Production`
- **Last Deployment Date**: `2026-07-21`

---

## 3. Repository Statistics

- **TypeScript/TSX Files**: `794`
- **Total Lines of Code (LOC)**: `184,788`
- **React Components**: `115`
- **Firestore Rules (LOC)**: `92`

---

## 4. Knowledge Platform

- **Total Articles**: `343`
- **Remedies**: `150`
- **Diseases**: `75`
- **Symptoms**: `75`
- **Lab Tests**: `40`
- **Comparisons**: `13`
- **Curated Specialty Hubs**: `9`
- **Indexable URLs**: `397` (Calculated for search engines/sitemaps)
- **Static Routes**: `426` (Generated during production build compiler runs)

#### Static Route vs Indexable URL Discrepancy Map

```
426 Static Routes (Compiler Pages Prerendered)
│
├── 22 Static Website Pages (Base structure)
├── `343` Published Knowledge Articles
├── `13` Active Comparison Matrix Pages
├── `9` Curated Specialty Hub Pages
├── 41 Dynamic Parameterized Paths (Prerendered combinations)
└── excludes private/admin routes

397 Indexable URLs (Sitemap Canonical Index)
│
├── Public pages only
├── Canonical paths only
├── No duplicate aliases
├── Excludes login pages (practitioner/admin)
├── Excludes admin dashboard workspaces
└── Excludes internal API route parameters
```

---

## 5. Clinical Platform

- **Workspace Layout**: `Single-Pane (Consolidated)`
- **Symptom Input Fields**: `Multi-Factor Configurable`
- **Repertorization Adapters**: `Legacy, Kent, Boericke, Firestore`
- **Miasm Support**: `Psora, Sycosis, Syphilis, Tubercular`

---

## 6. AI Platform

- **Primary Provider**: `Google Gemini API`
- **Fallback Sequence**: `Gemini -> DeepSeek -> Qwen -> Local Ollama`
- **Caching Service**: `Redis + bounded local in-memory fallback`; governed Ollama corpus cache foundation is disabled pending approved-corpus activation
- **Query Pre-retrieval**: `RAG (ragService)`
- **Threshold Bypass**: `Confidence >= 90%`

---

## 7. Testing

- **Test Files**: `114` focused `.test.ts` / `.test.tsx` files across `src` and `tests`
- **Governed Release Gate**: Unit, UI, security, Firestore emulator, corpus, persistence, activation, and evidence-lineage suites
- **Latest Release Verification**: `PASS` (see `reports/production-readiness-report.json` for SHA-bound code evidence)

---

## 8. Documentation Coverage

- **Architecture Decisions (ADRs)**: `4`
- **Release Notes**: `15`
- **Milestones Completed**: `3`
- **Editorial Standards**: `Complete`
- **Deployment Checklist**: `Complete`
- **Operations Runbook**: `Complete`

---

## 9. Issues Overview

- **Active Registered Issues**: `2`
- **Resolved Registered Issues**: `2`

---

## 10. Upcoming Milestones

- **Active Sprint**: `Sprint 28I — Release-state reconciliation and activation safety`
- **Next Phase Goal**: `Materia Medica governed scan foundation, followed by source-version eligibility and Ollama cache shadow activation`
