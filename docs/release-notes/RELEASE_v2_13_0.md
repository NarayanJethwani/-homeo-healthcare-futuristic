# Release Notes - v2.13.0

## Sprint 17: Clinician-Reviewed Lab Data Layer & Clinical Workspace Integration

This release introduces the clinician-reviewed lab data layer. Lab results extracted from patient attachments are restricted from entering the active clinical workspace or timeline until validated, corrected, or rejected by a clinician.

---

## Key Features

1. **Reviewed Lab Data Repository**
   - Implemented in `src/features/patient-labs/labRepository.ts`.
   - Controls status flows (`pending-review` -> `clinician-confirmed`, `corrected`, or `rejected`).
   - Mismatched patient and attachment parameters are securely denied.
   - Prevents updating parameters of archived or deleted attachments.
   - Saves `originalExtractedValue` and `correctedValue` during correction.

2. **Isomorphic Context Helpers**
   - Implemented in `src/features/patient-labs/clinicalLabContext.ts`.
   - Mapped read-only laboratory contexts and warnings for the Clinical OS without decision or scoring mutations.

3. **Lab Timeline Panel UI**
   - Implemented in `src/features/patient-labs/PatientLabTimelinePanel.tsx`.
   - Shows reviewed summaries, abnormal ranges, source attachments download links, and confirmation timestamps (`confirmedAt`).
   - Renders lightweight interactive trend lines using SVG.

4. **Treatment Planner Reference Cards**
   - Implemented in `src/features/patient-labs/TreatmentPlannerLabReference.tsx`.
   - Displays read-only reference summaries under the active patient file in the Treatment Planner.
   - Zero side-effects on package pricing, remedy selection, or billing cycle duration.

5. **Security & Auditing Protocols**
   - API endpoints POST `/review`, GET `/timeline`, and GET `/summary` enforce authorization checks and return strict `Cache-Control: no-store` headers.
   - Sanitized audit logs record confirmations, corrections, and rejections without logging PHI or OCR contents.

---

## Files Created

- `src/features/patient-labs/types.ts`
- `src/features/patient-labs/labRepository.ts`
- `src/features/patient-labs/clinicalLabContext.ts`
- `src/features/patient-labs/labClient.ts`
- `src/features/patient-labs/PatientLabTimelinePanel.tsx`
- `src/features/patient-labs/TreatmentPlannerLabReference.tsx`
- `src/app/api/patients/[patientId]/labs/review/route.ts`
- `src/app/api/patients/[patientId]/labs/timeline/route.ts`
- `src/app/api/patients/[patientId]/labs/summary/route.ts`
- `tests/patientLabs.test.ts`
- `docs/operations/CLINICIAN_REVIEWED_LAB_DATA.md`

## Files Modified

- `src/app/admin/dashboard/page.tsx`
- `package.json`
- `scripts/verify-production-readiness.ts`
- `docs/operations/PATIENT_ATTACHMENTS_AND_LAB_EXTRACTION.md`
- `docs/operations/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/MASTER_DEVELOPMENT_LOG.md`
- `docs/RELEASE_NOTES.md`
