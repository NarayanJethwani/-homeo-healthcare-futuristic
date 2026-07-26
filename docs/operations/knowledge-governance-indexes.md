# Production Index Specification: Firestore Governance Queries

**Document Version**: 1.0.0
**Phase**: Phase 2.2C Composite Indexes Document

---

## 1. Governance Repository Query Index Matrix

Every query executed by `FirestoreGovernanceRepository` has been analyzed to identify required composite indexes.

| Collection Group | Query Filters | Order By | Required Composite Index | Status in `firestore.indexes.json` |
| :--- | :--- | :--- | :--- | :--- |
| `knowledgeGovernanceRevisions` | `entityId == X` | `version DESC` | `(entityId ASC, version DESC)` | Included |
| `knowledgeGovernanceReviews` | `entityId == X` | `createdAt DESC` | `(entityId ASC, createdAt DESC)` | Included |
| `knowledgeGovernanceReviews` | `revisionId == X` | `createdAt DESC` | `(revisionId ASC, createdAt DESC)` | Included |
| `knowledgeGovernanceQualifications` | `contributorId == X, status == Y` | `expiresAt DESC` | `(contributorId ASC, status ASC, expiresAt DESC)` | Included |
| `knowledgeGovernanceAuditEvents` | `entityId == X` | `sequenceNumber ASC` | `(entityId ASC, sequenceNumber ASC)` | Included |
| `knowledgeGovernanceAuditEvents` | `entityId == X` | `createdAt DESC` | `(entityId ASC, createdAt DESC)` | Included |
| `knowledgeGovernanceAuthorship` | `entityId == X` | `contributorId ASC` | `(entityId ASC, contributorId ASC)` | Included |
| `knowledgeGovernanceEvidenceProfiles` | `entityId == X` | `version DESC` | `(entityId ASC, version DESC)` | Included |

---

## 2. Production Deployment Instructions

Deploy indexes using the Firebase CLI prior to running production migration:

```bash
npx -y firebase-tools deploy --only firestore:indexes --project homeo-healthcare-prod
```
