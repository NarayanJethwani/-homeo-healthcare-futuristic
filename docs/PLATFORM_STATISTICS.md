# Platform Statistics Dashboard

This document tracks quantitative metrics, code growth, and subsystem maturity over time for the Unified Clinical OS platform.

## 1. Subsystem Semantic Versioning

This table tracks the development maturity and release versions of key system modules:

| Subsystem | Version | Maturity Status | Primary Components |
| :--- | :--- | :--- | :--- |
| **Website** | `v2.0` | Production Ready | Public pages, Store, Services |
| **Knowledge Platform** | `v2.0` | Production Ready | Articles, Synonyms, Hubs, Categories |
| **Clinical OS** | `v0.9` | Beta / Hardened | Repertorization Engine, Adapters, Types |
| **Treatment Planner** | `v0.7` | Active Dev | Case Intake, Prescription logs, Timeline |
| **AI Router** | `v1.3` | Production Ready | `AIRouterService`, Fallback chain, RAG, Cache |
| **Knowledge Graph** | `v1.0` | Production Ready | `KnowledgeGraphExplorer`, interactive canvas |
| **Patient Portal** | `v0.8` | Staging | Login, Patient Sessions, Profile view |

---

## 2. Historical Metrics Dashboard

| Date | Version | TS/TSX Files | TS/TSX LOC | Component Count | Test Files | Firestore Rules LOC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-07-08 | 2.0.1 | 794 | 184788 | 115 | 20 | 92 |
| 2026-07-08 | 2.0.0 | 794 | 183994 | 126 | 20 | 91 |
| 2026-07-03 | 1.0.0 | 785 | 180250 | 120 | 17 | 91 |

---

> [!NOTE]
> These statistics are automatically generated and appended by the documentation update script (`npm run docs:update`).