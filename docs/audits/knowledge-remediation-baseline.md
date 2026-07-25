# Knowledge Platform Clinical Safety & Publication Remediation Baseline

## 1. Environment & Repository Coordinates
- **Current Branch**: `fix/knowledge-clinical-hardening`
- **Starting Commit**: `1dc4c8052f0418bfbbcecbb76d71cfe16effc790`
- **Working-Tree State**: Clean dedicated branch branched from `1dc4c8052f0418bfbbcecbb76d71cfe16effc790`.
- **Target Repository**: Homeo Healthcare Knowledge Platform

---

## 2. Entity Inventory & Baseline Governance Verification

| Metric / Dimension | Verified Fact | Audit Finding / Notes |
| :--- | :--- | :--- |
| **Total Knowledge Entities** | **343** | Confirmed via `getAllKnowledgeEntities()` |
| **Diseases** | 75 | Confirmed |
| **Symptoms** | 75 | Confirmed |
| **Remedies** | 150 | Confirmed |
| **Lab Tests** | 40 | Confirmed |
| **FAQs** | 1 (`FAQ-safety`) | Confirmed |
| **Research Summaries** | 1 (`RES-0001`) | Confirmed |
| **Case Studies** | 1 (`CS-0001`) | Confirmed |
| **Editorial Status (`published`)** | 343 / 343 | 100% currently marked `editorialStatus: "published"` |
| **Audience Classification** | 338 patient, 4 student, 1 practitioner | **Note**: 338 describes target audience classification, NOT clinical invalidity. |
| **Author / Reviewer Overlap** | 343 / 343 list "Dr. Narayan Jethwani" | **CORRECTED**: 100% identity conflict (`author.name === reviewer.name`). Schema gap: contributor model lacks immutable practitioner IDs. |
| **Meaningful AI-Readiness** | **0 / 343 (0%)** | **CORRECTED**: Defined by `hasMeaningfulAiReadiness(entity)` predicate requiring non-empty overview (>50 chars), resolved citations, explicit evidence level, AND proven independent review (`author !== reviewer` & `reviewer.id`). 0 entities pass. |
| **Structured Evidence Profiles** | **0 / 343 (0%)** | **CORRECTED**: 0 dedicated structured evidence-profile schema records exist. |
| **Derived Content Completeness** | **225 / 343 (65.6%)** | **CORRECTED**: Defined by `hasDerivedEvidenceContentCompleteness(entity)` predicate requiring overview text (>50 chars), resolved citation IDs, explicit evidence level, and clinical sections. 225 entities pass. |
| **Resolvable Citation References** | **343 / 343 (100%)** | **CORRECTED**: Defined by `hasResolvableCitationReferences(entity)` predicate requiring $\ge 1$ reference and 100% resolution to the 22-entry `CITATIONS` database. 343 entities pass. Claim-level coverage is Not Verified. |
| **Generic Template Pattern Count** | **256 / 343 (74.6%)** | **CORRECTED**: 147 remedies, 71 diseases, and 38 lab tests share repetitive structural sentence templates across overview/safety sections. |
| **Vector Coverage** | **0 / 343 (0%)** | **CORRECTED**: `public/data/vectors.json` does NOT exist in the repository; 0 valid 768-dimensional embeddings exist. |
| **Flagship Governance Readiness (RAG)** | **0 / 8 (0%)** | **CORRECTED**: 0 flagship entities have proven independent clinical review; `RAG_INGESTION_ALLOWLIST` defaults to empty. |
| **Flagship Public Indexing Readiness** | **8 / 8 (100%)** | 8 flagship entities are allowlisted in `PUBLIC_INDEX_ALLOWLIST` for temporary public search indexing by editorial exception. |

---

### Predicate Definitions for Baseline Metrics

1. `hasMeaningfulAiReadiness(entity)`:
   - Evaluates whether an entity has non-empty overview text (> 50 chars), valid resolved citation references, an explicit evidence level (`Level-A`, `Level-B`, `Level-C`, or `Traditional-Literature`), AND proven independent clinical review (`author.name !== reviewer.name` AND `reviewer.id` present).
   - *Result*: **0 / 343 entities (0%)** pass.

2. `hasDerivedEvidenceContentCompleteness(entity)`:
   - Evaluates whether an entity has non-empty overview text (> 50 chars), resolved citation IDs in the citation database, an explicit evidence level, and populated clinical content sections.
   - *Result*: **225 / 343 entities (65.6%)** pass.

3. `hasResolvableCitationReferences(entity)`:
   - Evaluates whether an entity has at least 1 citation reference link (`content.references.length > 0`) AND every citation ID referenced exists in the 22-entry `CITATIONS` database.
   - *Result*: **343 / 343 entities (100%)** pass. Claim-level and topic-specific citation coverage remain **Not verified**.

---

## 3. High-Risk Safety Entities & Containment Plan

The baseline audit identified three immediate safety containment entities:

1. **`D0007` — Asthma**:
   - *Issue*: Clinical prose was contaminated with rhinitis/sinusitis content.
   - *Containment*: Withdrawn status assigned (`WITHDRAWN_SAFETY_ENTITIES`). Excluded from public index, sitemap, public API DTOs, and RAG ingestion. Direct route displays neutral Under Clinical Review notice with body text hidden.
2. **`R0006` — Arsenicum Album**:
   - *Issue*: Misclassified as Plant origin (instead of Mineral/Arsenic Trioxide) with placeholder keynote text.
   - *Containment*: Withdrawn status assigned (`WITHDRAWN_SAFETY_ENTITIES`). Excluded from index, sitemap, public API DTOs, and RAG ingestion. Direct route displays neutral Under Clinical Review notice with body text hidden.
3. **`FAQ-safety` — Homeopathic Safety FAQ**:
   - *Issue*: Contained self-reviewed absolute safety claims.
   - *Containment*: Withdrawn status assigned (`WITHDRAWN_SAFETY_ENTITIES`). Suppressed from API, search, sitemap, and RAG.

---

## 4. Phase 1 Containment Strategy

1. **Publication Freeze**: Active (`TRANSITIONAL_PUBLICATION_FREEZE = true`).
2. **Public Index Allowlist**: 8 flagship entities (`PUBLIC_INDEX_ALLOWLIST`).
3. **RAG Ingestion Allowlist**: Empty (`RAG_INGESTION_ALLOWLIST = new Set([])`).
4. **Robots Metadata**: `<meta name="robots" content="noindex, follow">` for review-required and withdrawn entities.
