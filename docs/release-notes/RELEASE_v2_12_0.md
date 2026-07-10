# Unified Clinical OS Release Notes - v2.12.0

## Release Information
- **Version**: `2.12.0`
- **Release Tag**: `v2.12.0-patient-attachments`
- **Date**: 2026-07-10
- **Sprint Name**: Sprint 15: Patient Attachment Portal, Lab Extraction & Attachments Repository
- **Deployment Status**: Pending Deployment
- **Verification Status**: PASSED (22 automated tests, production readiness pre-flights success)

---

## Strategic Highlights
Constructed the secure attachment repository layer for patient-related clinical documents, PDF laboratory report text regex-extraction, and interactive clinician review grids.

1. **Secure Document Repository**:
   - Implemented standard schemas for `PatientAttachment` and `ExtractedLabParameter` in memory and Firestore.
   - Restricts file sizes to 10MB and restricts allowed MIME types to PDF, PNG, JPG, and WEBP.
   - Built a custom client-side file signature check blocking potential executable upload vectors (PHP, EXE, ELF, PE/MZ, etc.).

2. **Role-Based Access Gates**:
   - Enforces patient file assignment boundaries at the API and database query levels.
   - Restricts document views/uploads/deletions to assigned doctors, while allowing super-admin bypasses.

3. **Deterministic Lab Parser Pipeline**:
   - Formulated a regex-based parser scanning text locally for Hemoglobin, TSH, Fasting Glucose, HbA1c, etc.
   - Incorporates normal range calculators to flag low/high metrics without creating autonomous clinical treatment decisions.

4. **Clinician Validation Grids**:
   - Integrated a dual-tab right column view switch inside the patient longitudinal timeline dialog.
   - Displays real-time lab parameters enabling clinicians to instantly confirm, reject, or correct extracted values.

5. **HIPAA-Compliant Auditing**:
   - Records uploads, downloads, archiving, and updates.
   - Strips all patient PII and raw text contents from the audit ledger to preserve data privacy.
