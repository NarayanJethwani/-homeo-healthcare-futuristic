# Clinician-Reviewed Laboratory Data Operations Manual

This operational manual documents the workflow, data structures, safety bounds, and auditing requirements for verified patient laboratory results.

---

## 1. Safety Boundaries & Non-Interference

To comply with high-level diagnostic gates, the reviewed lab layer strictly operates under the following limits:
- **No Automated Decisions**: Lab values act strictly as informational decision-support indicators. They must **never** automatically alter repertory calculations, remedy selection scores, potency recommendations, or pricing tiers in the Treatment Planner.
- **Read-Only Access**: The Clinical OS imports verified lab parameters only in a read-only schema. Mutations can only occur by explicit clinician corrections via the Secure Attachments/Labs workflow.
- **Informational Warnings**: Abnormal lab flags (low, high, critical) are visual markers only. They do not trigger diagnostic messages or prescribe remedies.
- **Safety Comment Rule**: Any file containing Clinical OS lab context exports must include the comment:
  `// Reviewed lab context is informational and must not alter scoring or prescribing logic.`

---

## 2. Laboratory Data Lifecycle

Lab parameters progress through a strict validation chain:
1. **Pending Extraction**: Raw parameters extracted via parser or OCR. Excluded from timelines, Clinical OS context, and reference summaries.
2. **Clinician Confirmation**: Explicit confirmation by a logged-in clinician, storing actor details and timestamps. Inserts result into reviewed timeline and summary.
3. **Clinician Correction**: If values, units, or flags are corrected by a clinician, the repository creates a `ReviewedLabResult` containing:
   - `originalExtractedValue`: The raw extracted parameter.
   - `correctedValue`: The user-corrected value.
   - `reviewStatus`: `"corrected"`.
4. **Rejection**: Excludes parameters from all active summaries and timelines while preserving database traceability for reporting audits.

---

## 3. Privacy-Safe Auditing Rules

All laboratory review events verify security compliance. The audit logger restricts logs to safe metadata:
- **Prohibited Data**: No raw OCR text, document contents, patient names, dates of birth, or filenames may be written to audit logs or telemetry records.
- **Permitted Data**: `attachmentId`, `parameterId`, actor `userId` (practitioner UID), action type (`lab_parameter_confirmed`, `lab_parameter_corrected`, `lab_parameter_rejected`, `lab_summary_viewed`), and status are allowed.

---

## 4. Cache Prevention

To prevent local caching of sensitive PHI or clinical telemetry, all endpoints in the reviewed labs namespace must return:
```txt
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
```
