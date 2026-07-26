# Operations Manual: Knowledge Governance Backup & Disaster Recovery

**Document Version**: 1.0.0
**Phase**: Phase 2.2C Disaster Recovery Specification

---

## 1. Pre-Migration Export Protocol

Before executing any production write or migration batch, a complete Firestore export must be generated:

```bash
gcloud firestore export gs://homeo-healthcare-prod-backups/firestore/pre-migration-phase2-2c-$(date +%Y%m%d%H%M%S) \
  --collection-ids='knowledgeGovernanceContributors,knowledgeGovernanceQualifications,knowledgeGovernanceAuthorship,knowledgeGovernanceRevisions,knowledgeGovernanceReviews,knowledgeGovernanceEvidenceProfiles,knowledgeGovernanceClaims,knowledgeGovernanceAiApprovals,knowledgeGovernanceAuditEvents,knowledgeGovernanceEntityState,knowledgeGovernanceAuditChainHeads'
```

---

## 2. Retention & Encryption Specifications

- **Location**: `gs://homeo-healthcare-prod-backups/firestore/`
- **Encryption**: Customer-Managed Encryption Keys (CMEK) via Google Cloud KMS
- **Lifecycle**: Retained for 365 days (immutable Object Lock enabled)
- **Access Restrictions**: Restricted to `sa-knowledge-backup-prod` service account

---

## 3. Restore Protocol

In case of data corruption or failed migration:

```bash
gcloud firestore import gs://homeo-healthcare-prod-backups/firestore/<backup-folder-name>
```

### Post-Restore Audit Verification
After restoring, execute `npm run test:manifest-audit` and verify:
1. Audit chain heads match expected latest sequence numbers.
2. Zero independent clinical approvals exist.
3. Withdrawn safety entities remain concealed.
