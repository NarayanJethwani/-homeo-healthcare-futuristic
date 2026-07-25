# Phase 2 Pre-Merge Integrity & Persistence Audit Report

**Date**: July 25, 2026  
**Git Branch**: `fix/knowledge-clinical-hardening`  
**Evaluation Outcome**: `MERGE WITH DOCUMENTED EXCEPTIONS`  

---

## 1. System Classification Notice

> [!IMPORTANT]
> **Phase 2 Governance Architecture Scope**:  
> Phase 2 provides a **Governance Domain Model and Validation Foundation**. It establishes explicit, auditable TypeScript schemas, SHA-256 revision hashing, workflow state machines, independent review semantics, and process-local audit logging.
> It is **NOT** a fully durable production editorial system with a persistent database. Real database persistence, multi-user authentication, and cryptographic audit security require Phase 2.1 implementation.

---

## 2. Persistence Matrix

| Record Type | Current Storage Mechanism | Read / Write / Update / Delete APIs | Durability & Transaction Guarantees |
| :--- | :--- | :--- | :--- |
| **Contributor** | Source-code Map (`CONTRIBUTORS_DB`) | Read: `getContributorById()`<br>Write: `registerContributor()` | **Process-Memory Only**. Resets on server restart. No DB transactions or access control. |
| **AuthorshipRecord** | In-Memory Structs / JSON Report | Read: `authorshipRecord`<br>Write: Migration dry-run | **Process-Memory / File JSON**. Resets on server restart. |
| **ClinicalReviewRecord** | In-Memory Structs / JSON Report | Read: `evaluateIndependentReview()` | **Process-Memory / File JSON**. Resets on server restart. |
| **ContentRevision** | In-Memory Hashing (`computeContentHash`) | Read: `createContentRevision()` | **Process-Memory / File JSON**. Derived on demand via SHA-256 content hashing. |
| **EvidenceProfile** | In-Memory Structs / JSON Report | Read: `validateEvidenceProfile()` | **Process-Memory / File JSON**. Draft shells created in dry-run. |
| **ClinicalClaim** | In-Memory Structs / JSON Report | Read: `evaluateClaimsGovernance()` | **Process-Memory / File JSON**. Extracted in dry-run. |
| **WorkflowTransition** | In-Memory Validation | Read: `validateWorkflowTransition()` | **Process-Memory / Transient**. State machine logic strictly process-local. |
| **AiIngestionApproval** | In-Memory Validation | Read: `validateAiIngestionApproval()` | **Process-Memory / Transient**. RAG allowlist defaults to empty set (`new Set()`). |
| **GovernanceAuditEvent** | Process-Memory Array (`AUDIT_LOG`) | Read: `getAuditEventsForEntity()`<br>Write: `recordGovernanceAuditEvent()` | **Process-Memory Only**. Hash-chained in memory; not tamper-resistant across restarts. |

---

## 3. Canonical Content Hashing & Invalidation Policy

### Hashing Mechanism (`computeContentHash`)
- **Key Canonicalisation**: Object keys sorted alphabetically at all nesting levels.
- **Array Order**: Preserved strictly (maintains ordering of clinical notes and symptoms).
- **Whitespace Normalisation**: Trims strings and normalises CRLF (`\r\n` $\rightarrow$ `\n`).
- **Volatile Field Exclusion**: Volatile metadata fields (`updatedAt`, `generatedAt`, `renderTimestamp`, `lastModified`, `cachedAt`, `viewCount`) are excluded during hash computation.
- **Multilingual Support**: Multilingual content objects (e.g. `{ en: "...", hi: "..." }`) are deterministically normalized and hashed.

### Review Invalidation Boundaries
| Change Category | Effect on Content Hash | Requires Renewed Clinical Review? |
| :--- | :--- | :--- |
| **Non-Material Metadata** (`updatedAt`, `viewCount`) | No Change | **No** (Prior approval remains valid) |
| **Treatment Content** (`content.treatment`) | Hash Alters | **YES** (Prior approval invalidated) |
| **Safety Warnings** (`content.safety`) | Hash Alters | **YES** (Prior approval invalidated) |
| **Emergency Escalations** (`content.emergency`) | Hash Alters | **YES** (Prior approval invalidated) |
| **Diagnostic Criteria** (`content.causes`, `content.symptoms`) | Hash Alters | **YES** (Prior approval invalidated) |
| **Citation References** (`content.references`) | Hash Alters | **YES** (Prior approval invalidated) |
| **Multilingual Text** (Translations) | Hash Alters | **YES** (Prior approval invalidated) |

---

## 4. Reviewer Eligibility & Independence Semantics

To satisfy independent clinical review:

1. **Reviewer ID Presence**: Immutable `reviewerId` must exist in `CONTRIBUTORS_DB`.
2. **Active Account**: Contributor must carry `active: true`.
3. **Qualification Model**: `isReviewerEligible()` verifies reviewer credentials (e.g., `BHMS`, `MD`, `MBBS`) for the specified review type (`clinical`, `evidence`, `safety`).
4. **Identity Isolation**: `reviewerId` must be strictly different from ALL author IDs (`reviewerId !== authorId`).
5. **Explicit Independence**: `declarationOfIndependence` must equal `true`.
6. **Revision Match**: `reviewedVersion` must equal the active `contentHash`.
7. **Approved Decision**: `decision` must equal `'approved'`.
8. **Valid Timestamp**: `reviewedAt` must be a valid ISO date in the past.

> [!NOTE]
> No second real contributor (`CONTRIB-002`) was created during Phase 2. As a result:
> **Independently approved entities: 0** across all 343 entries.

---

## 5. Emergency Override Boundaries

### Permitted Emergency Targets
- Emergency overrides may ONLY be used to withdraw, suppress, or transition to safety-containment states (`withdrawn`, `changes-requested`, `draft`, `archived`).

### Prohibited Emergency Effects
- Emergency overrides **CANNOT** grant clinical approval (`eligibleByClinicalGovernance === false`).
- Emergency overrides **CANNOT** grant AI ingestion approval (`eligibleForAiIngestion === false`).
- Emergency overrides **CANNOT** publish unreviewed content or unsupported treatment/safety claims.

### Expiry Verification
- `emergencyExpiry` must be a valid future ISO timestamp. Expired emergency overrides are automatically rejected (`emergency-override-expired-or-invalid`).

---

## 6. Audit Trail Cryptographic Integrity

- Audit events (`GovernanceAuditEvent`) are recorded append-only in process memory.
- **Hash-Chaining**: Each event includes `previousEventHash` and SHA-256 `eventHash`, forming a process-local cryptographic chain.
- `verifyAuditTrailIntegrity()` verifies chain continuity.
- **Limitation**: Append-only tamper resistance is process-local and does not persist across process restarts.

---

## 7. Claim-Mapping Granular Breakdown

Across all 343 knowledge entities, claim-mapping analysis yields:

- **Entities with Empty Claim Container**: **0** (0%)
- **Entities with Extracted Claim Structures**: **343** (100%)
- **Total Claims Extracted**: **343** (1 overview claim extracted per entity)
- **Material Clinical Claims Identified**: **193** (Diseases, Symptoms, Lab Tests, Case Studies)
- **Traditional-Use Remedy Claims Identified**: **150** (Remedies)
- **Claims Mapped to Resolving Citations**: **343** (100% reference ID resolution)
- **Claims Marked Supported**: **0** (0% independently reviewed)
- **Claims Marked Partially Supported**: **193** (Draft baseline state)
- **Claims Marked Traditional Description**: **150** (Remedy baseline state)
- **Claims Independently Reviewed**: **0** (0%)

---

## 8. Evaluator Consistency Verification

There is **one canonical publication evaluation function**: `evaluatePublicationGovernance()`.
The selector functions `evaluatePublicationEligibility()`, `isEntityIndexable()`, `isEntityEligibleForSitemap()`, `isEntityEligibleForRag()`, and `getPublicReviewLabel()` delegate to this canonical source.

Unit tests (`tests/phase2GovernanceSchema.test.ts`) assert **100% outcome consistency** across public badges, metadata, sitemap, public API DTOs, directory listings, and RAG ingestion paths across all 343 entities.

---

## 9. Migration Dry-Run Output Determinism

- The migration script (`scripts/run-phase2-migration-dry-run.ts`) sorts entities by ID and uses fixed ISO timestamps.
- **Deterministic Dry-Run Checksum**: `7adc0e42cae03b920911c8499455f8cfeec7b980f29f1eb4623e32e3c33dfc2e`
- Running the script repeatedly produces byte-identical JSON outputs.
- Output metrics:
  - `independentlyApprovedEntities: 0`
  - `structuredEvidenceProfilesApproved: 0`
  - `ragApprovedEntities: 0`

---

## 10. Comprehensive Test Status

| Command / Suite | Exit Code | Passed | Failed | Status & Diagnosis |
| :--- | :--- | :--- | :--- | :--- |
| `npx ts-node -P tests/tsconfig.test.json -r tsconfig-paths/register tests/publicationGuardSafety.test.ts` | **0** | **11** | **0** | **100% PASSED** (Phase 1 publication guard & safety tests) |
| `npx ts-node -P tests/tsconfig.test.json -r tsconfig-paths/register tests/phase2GovernanceSchema.test.ts` | **0** | **9** | **0** | **100% PASSED** (Phase 2 pre-merge integrity tests) |
| `npm test` (`scripts/run-unit-tests.ts`) | **1** | 15 | 29 | **Exit Code 1** (Pre-existing legacy test runner path alias failures due to child process `ts-node` invocation without path alias flags. Governance suites pass 100%). |

---

## 11. Final Merge Recommendation

```text
MERGE WITH DOCUMENTED EXCEPTIONS
```

### Accepted Documented Exceptions
1. **Process-Local Storage**: Storage for contributors, revisions, evidence profiles, and audit logs is process-memory based. Production DB persistence requires Phase 2.1 implementation.
2. **0 Independently Reviewed Entities**: All 343 entities remain classified as `self-reviewed — independent clinical review pending`.
3. **Empty RAG Corpus**: 0 entities are eligible for RAG ingestion (`RAG_INGESTION_ALLOWLIST` is empty).
4. **Pre-Existing Test Runner Aliasing Failure**: `scripts/run-unit-tests.ts` fails legacy tests because ts-node child process calls omit path alias flags. Governance suites pass 100%.
