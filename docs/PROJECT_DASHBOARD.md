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

- **Production Version**: `v2.0.1`
- **Git Tag**: `v2.0.1`
- **Commit SHA**: `7c1a381`
- **Branch**: `main`
- **Environment**: `Production`
- **Last Deployment Date**: `2026-07-08`

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
- **Caching Service**: `Redis + Local In-Memory Map fallback`
- **Query Pre-retrieval**: `RAG (ragService)`
- **Threshold Bypass**: `Confidence >= 90%`

---

## 7. Testing

- **Total Test Files**: `20`
- **Active Test Suites**: `adminWorkflow.test.ts, publicApi.test.ts, kms.test.ts`
- **Coverage**: `Standard core paths checked`

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

- **Active Open Issues**: `2`
- **Resolved Issues**: `3`

---

## 10. Upcoming Milestones

- **Active Sprint**: `Clinical Authority Sprint 3`
- **Next Phase Goal**: `AI Engine Security Integration & Validation case suite`
