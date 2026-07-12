# EMR Patient Identity Inventory

Status: Initial repository audit  
Date: 2026-07-12

## Primary Finding

The `patients` Firestore collection currently serves two responsibilities:

1. a clinical patient identity intended to conform to the frozen Patient
   domain; and
2. a dashboard/commercial case record containing complaint, care level,
   pricing, balances, care duration, embedded prescriptions, Drive/Sheet
   references, and assigned-doctor state.

This is the highest migration risk. Version 2.14.0 must not attempt to resolve
it by changing the frozen Patient entity or automatically rewriting documents.

## Patient-Bearing Stores and References

| Store or path | Patient link | Current role | Migration treatment |
|---|---|---|---|
| `patients/{patientId}` | document ID | Identity plus dashboard case/commercial fields | Authoritative legacy source; project through compatibility layer |
| `users/{uid}` | `patientId` | Portal identity linkage | Validate one-to-one/one-to-many assumptions; never infer ownership from the client |
| `invoices/{invoiceId}` | `patientId` | Billing record | Read-only reconciliation by canonical patient mapping |
| `patient_attachments/{id}` | `patientId` | Patient document metadata | Preserve source IDs and attachment provenance |
| `extracted_lab_parameters/{id}` | `patientId`, attachment link | Pending extraction | Exclude from trusted clinical projection until reviewed |
| `reviewed_lab_results/{id}` | `patientId`, attachment link | Clinician-reviewed laboratory truth | Include only reviewed records |
| `clinicalKnowledgeReferenceAssignments/{id}` | `patientId` | Read-only knowledge reference | Resolve through mapping; never treat as clinical truth |
| `repertorization_sessions/{id}` | patient/session linkage varies | Clinical decision-support workspace | Inventory exact linkage before migration |
| Treatment episode repository | `patientId` | Longitudinal episode | Preserve frozen domain linkage |
| Encounter repository | `patientId` | Consultation container | Preserve frozen domain linkage |
| Consultation/clinical intake | `patientId`, `encounterId` | Structured intake | Preserve frozen domain linkage |
| Patient portal session | signed `patientId` | Patient authorization | Must resolve only through approved mapping |
| Google Drive/Sheets fields on patient | URLs and external IDs | Operational legacy integration | Record as external-source identifiers, not canonical identity |

## Existing Identifier Forms

- Firestore patient document ID
- `PatientId` branded domain identifier
- UHID on the frozen Patient type
- `users/{uid}.patientId` portal link
- dashboard-generated `P-######` identifiers
- development `pat_*` identifiers
- Google Drive folder ID
- Google Sheet URL or identifier
- external intake-provided ID

No identifier should be silently promoted to canonical status without an
organization boundary and a recorded mapping decision.

## Authorization Findings

- Firestore patient reads currently allow an assigned doctor or administrator.
- Patient creation is allowed to any authenticated client under the current
  rules and needs a separate security review before Version 2.14.0 production.
- Several server routes correctly validate patient or practitioner access, but
  the dashboard still performs direct client reads and writes to `patients`.
- The portal uses `users/{uid}.patientId`; this must remain server-validated for
  canonical identity resolution.

## Migration Rules

1. Dry-run reconciliation must have no write dependency.
2. Records missing `organizationId` are blocked from automatic mapping.
3. Duplicate UHIDs within an organization are blocking conflicts.
4. Demographic matches are review suggestions only.
5. No record is deleted or merged automatically.
6. Pending OCR/AI extraction is excluded from trusted projections.
7. Existing IDs remain addressable during the compatibility period.
8. Every approved mapping records actor, timestamp, method, and review state.
9. Interactive preview inventory reads are bounded to 5,000 documents per
   collection and must display a truncation warning when the limit is reached.
10. Complete production reconciliation requires a separately reviewed,
    paginated offline report; the interactive screen is not migration evidence
    when any collection is truncated.

## Next Audit Actions

1. Inspect representative production-shaped `patients` documents without
   exporting clinical values into logs or documentation.
2. Count missing `organizationId`, UHID, and assigned-doctor fields.
3. Count portal users with missing, invalid, or duplicate patient links.
4. Count orphaned invoices, attachments, reviewed labs, encounters, and
   treatment episodes.
5. Inventory repertory-session patient linkage.
6. Review patient-create Firestore rules and all direct dashboard writes.
7. Produce a synthetic-data reconciliation report before any preview migration.
