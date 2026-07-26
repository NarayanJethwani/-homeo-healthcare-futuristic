# Production Migration Runbook: Knowledge Governance Persistence

**Document Version**: 1.0.0
**Phase**: Phase 2.2C Operational Runbook
**Execution Approval**: Required (Human Administrator Authorization Token)

---

## 1. Safety Invariants & Execution Rules

1. **NO AUTOMATED EXECUTION**: Migration must be executed manually by an authorized platform administrator.
2. **SAFETY INVARIANTS PRESERVED**:
   - Independently approved entities: 0
   - Approved evidence profiles: 0
   - AI-approved entities: 0
   - Active RAG corpus entities: 0
   - Withdrawn safety entities: 3
3. **FAIL-CLOSED CONFLICT HANDLING**:
   - `identical existing record` -> `skip-identical`
   - `conflicting existing record` -> `report-conflict` (Halts entity write for human review)
   - `unexpected approval state` -> `stop entire migration`

---

## 2. Staged Migration Execution Protocol

### Stage 0: Production Read-Only Validation
- Confirm production project ID `homeo-healthcare-prod`.
- Verify backup bucket `gs://homeo-healthcare-prod-backups/firestore/`.
- Execute dry run report comparison.

### Stage 1: Contributor & 1 Controlled Entity (Canary Test)
- Authorize execution: `CONFIRM_PRODUCTION_MIGRATION_EXECUTION` token + `ADMIN-CONTRIB-001`.
- Migrate contributor `CONTRIB-001` and single disease entity (`DIS-001`).
- Verify document contents, draft evidence profile shell, and audit chain head (`AUD-DIS-001-1`).

### Stage 2: 5 Representative Entities
- Migrate 5 representative entities (remedy, condition, clinical guidance, modalities, repertory rubric).
- Verify batch checkpoint `CHECKPOINT_BATCH_1`.

### Stage 3: 8 Current Public-Index Exception Entities
- Migrate allowlisted exception entities. Verify `eligibleByTemporaryPublicIndexException: true` while `eligibleByClinicalGovernance: false`.

### Stage 4: Remaining Records in Controlled Batches
- Process remaining entities in batches of max 50 records per batch.
- Verify checksums and audit chain integrity after every batch.

---

## 3. Rollback & Compensating Strategy

If any error or unexpected approval state occurs:
1. Immediately halt migration execution.
2. Trigger compensating transaction script to purge unapproved migration documents from all 10 `knowledgeGovernance*` collections.
3. Restore pre-migration Firestore snapshot if data corruption occurred.
