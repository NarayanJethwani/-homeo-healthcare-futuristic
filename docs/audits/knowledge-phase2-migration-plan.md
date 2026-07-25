# Knowledge Platform Phase 2 Migration Plan & Baseline Report

**Date**: July 25, 2026  
**Git Branch**: `fix/knowledge-clinical-hardening`  

---

## 1. Executive Summary

Phase 2 establishes the durable clinical governance schema, contributor identity registry, revision hashing system, evidence profile schema, claim-level citation mapping, workflow state machine, AI ingestion approval model, and append-only audit trail.

A deterministic, reversible dry-run migration script (`scripts/run-phase2-migration-dry-run.ts`) has audited all 343 knowledge entities.

---

## 2. Dry-Run Migration Results

| Governance Dimension | Migrated Baseline Metric | Governance Outcome |
| :--- | :--- | :--- |
| **Total Entities Audited** | **343** | All 343 entities processed |
| **Contributors Created** | **1** | `CONTRIB-001` (Dr. Narayan Jethwani) |
| **Author Records Migrated** | **343** | Transformed text author strings into `AuthorshipRecord` |
| **Historical Self-Review Records** | **343** | Classified as `self-reviewed — independent clinical review pending` |
| **Independently Approved Entities** | **0** | **0%** (Requires independent reviewer ID !== author ID) |
| **Structured Evidence Profiles Approved** | **0** | **0%** (Draft shells created with missing fields flagged) |
| **Claim-Level Mappings Created** | **343** | 343 claim structures initialized |
| **RAG Approved Entities** | **0** | **0%** (Active RAG corpus remains strictly empty) |
| **Withdrawn Entities** | **3** | Asthma (`D0007`), Arsenicum (`R0006`), FAQ (`FAQ-safety`) |
| **Temporary Index Allowlist Exceptions** | **8** | Preserved Phase 1 allowlist (`PUBLIC_INDEX_ALLOWLIST`) |

---

## 3. Entity State Transition Matrix (Sample)

| Entity ID | Entity Title | Pre-Phase 2 Reviewer | Phase 2 Contributor ID | Independent Review Status | Workflow State | Index Eligibility | RAG Ingestion Eligibility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `D0001` | GERD | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `editorial-review` | `Eligible (Temporary Exception)` | `Ineligible (0)` |
| `D0002` | Eczema | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `editorial-review` | `Eligible (Temporary Exception)` | `Ineligible (0)` |
| `D0007` | Asthma | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `withdrawn` | `Non-Indexable (noindex)` | `Ineligible (0)` |
| `R0001` | Sulphur | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `editorial-review` | `Eligible (Temporary Exception)` | `Ineligible (0)` |
| `R0006` | Arsenicum Album | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `withdrawn` | `Non-Indexable (noindex)` | `Ineligible (0)` |
| `S0001` | Heartburn | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `editorial-review` | `Eligible (Temporary Exception)` | `Ineligible (0)` |
| `L0001` | CBC | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `editorial-review` | `Eligible (Temporary Exception)` | `Ineligible (0)` |
| `D0003` | Hypertension | Dr. Narayan Jethwani | `CONTRIB-001` | `Unverified (Self-Reviewed)` | `review-required` | `Non-Indexable (noindex)` | `Ineligible (0)` |

---

## 4. Reversibility & Determinism

- Migration script is deterministic and non-destructive.
- Git source files for all entities remain preserved without silent body text edits.
- Data report saved to `reports/knowledge-phase2-migration-dry-run.json`.
