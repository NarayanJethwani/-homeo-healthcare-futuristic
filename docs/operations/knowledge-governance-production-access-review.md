# Knowledge Governance Production IAM & Access Security Review

## 1. Principle of Least Privilege Model

The Knowledge Governance domain enforces strict identity separation across execution contexts:

1. **Application Runtime Service Account**:
   - **Role**: `roles/datastore.user` (Firestore Document Read/Write)
   - **Prohibited Capabilities**: Cannot alter IAM, deploy security rules, deploy composite indexes, access Cloud Storage backups, or read secret manager secrets.

2. **Migration Operator Identity**:
   - **Role**: `roles/datastore.user` + `roles/secretmanager.secretAccessor` (Scoped to `ADMIN_SESSION_SECRET` only)
   - **Prohibited Capabilities**: Cannot modify GCP project IAM or delete production storage buckets.

3. **Backup & Recovery Service Account**:
   - **Role**: `roles/datastore.importExportAdmin` + `roles/storage.objectAdmin` (Scoped to backup GCS bucket `gs://homeo-governance-backups`)
   - **Prohibited Capabilities**: Cannot read application session secrets or modify runtime database documents directly.

---

## 2. Production IAM Inspection & Change Plan

| Service Account / Principal | Required Role | Production State | Action Required |
| :--- | :--- | :--- | :--- |
| `sa-governance-app@homeo-healthcare-prod.iam.gserviceaccount.com` | `roles/datastore.user` | `not-accessible` | Verify binding via GCP Console |
| `sa-governance-migration@homeo-healthcare-prod.iam.gserviceaccount.com` | `roles/datastore.user` | `not-accessible` | Bind scoped migration role |
| `sa-governance-backup@homeo-healthcare-prod.iam.gserviceaccount.com` | `roles/datastore.importExportAdmin` | `not-accessible` | Create backup bucket binding |

**Security Statement**: Live production IAM bindings must be verified by an authorized GCP administrator prior to migration authorization.
