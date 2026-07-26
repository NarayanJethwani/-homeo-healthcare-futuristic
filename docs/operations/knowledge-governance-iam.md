# Operational Specification: Production IAM & Least-Privilege Roles

**Document Version**: 1.0.0
**Phase**: Phase 2.2C IAM Governance Specification

---

## 1. Production Service Account Separation

To adhere to least-privilege principles, backend service operations are split into distinct IAM service accounts:

### 1. `sa-knowledge-app-prod@homeo-healthcare-prod.iam.gserviceaccount.com`
- **Purpose**: Server application runtime (`getAdminDb()`).
- **Roles**:
  - `roles/datastore.user` (Read/Write access to Firestore via Firebase Admin SDK)
- **Restrictions**: Cannot alter security rules, cannot delete project resources, cannot export database.

### 2. `sa-knowledge-migration-prod@homeo-healthcare-prod.iam.gserviceaccount.com`
- **Purpose**: Human-operated migration execution runner.
- **Roles**:
  - `roles/datastore.user`
- **Restrictions**: Requires explicit human confirmation token `CONFIRM_PRODUCTION_MIGRATION_EXECUTION` at runtime.

### 3. `sa-knowledge-backup-prod@homeo-healthcare-prod.iam.gserviceaccount.com`
- **Purpose**: Automated export & point-in-time disaster recovery runner.
- **Roles**:
  - `roles/datastore.importExportAdmin`
  - `roles/storage.objectAdmin` (Scope restricted to backup bucket `gs://homeo-healthcare-prod-backups/`)

---

## 2. Human Administrative Governance

Human platform administrators do NOT possess direct write access to production Firestore collections via client SDKs. All governance writes are routed through server API endpoints (`/api/governance/...`) enforcing HMAC session verification and contributor qualification rules.
