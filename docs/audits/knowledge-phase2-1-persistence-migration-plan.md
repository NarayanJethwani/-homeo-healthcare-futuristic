# Phase 2.1 Persistence Migration Plan & Baseline Report

**Date**: July 25, 2026  
**Git Branch**: `fix/knowledge-clinical-hardening`  

---

## 1. Executive Summary

Phase 2.1 defines persistent storage structures and dry-run migration formats for all 343 Knowledge entities.

The dry-run script (`scripts/run-phase2-1-persistence-migration-dry-run.ts`) outputs `reports/knowledge-phase2-1-persistence-migration-dry-run.json`.

---

## 2. Dry-Run Migration Results

| Governance Record / Metric | Count | Governance Status |
| :--- | :--- | :--- |
| **Total Entities Migrated** | **343** | All 343 entities processed |
| **Contributors Created** | **1** | `CONTRIB-001` (Dr. Narayan Jethwani) |
| **Author Records Migrated** | **343** | Converted to `AuthorshipRecord` |
| **Historical Self-Review Records** | **343** | Classified as `self-reviewed — independent clinical review pending` |
| **Revisions Migrated** | **343** | SHA-256 governed clinical projections generated |
| **Placeholder Claims Marked** | **343** | Marked explicitly as `origin: 'migration-placeholder'` |
| **Independently Approved Entities** | **0** | **0%** |
| **Approved Evidence Profiles** | **0** | **0%** |
| **AI Approved Entities** | **0** | **0%** |
| **Active RAG Corpus Entities** | **0** | **0%** |

---

## 3. Determinism & Checksum

- **Dry-Run Checksum**: `69a59212d11c39a28a293a04451fe826d30701532528cb8b3995faccf6803eb8`
- Repeated dry-run executions produce byte-identical JSON outputs.
