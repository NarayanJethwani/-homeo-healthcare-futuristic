# Google Sheets Validation Workflow Review

This document reviews the integration architecture, current implementation files, security rules, and data structures of the hybrid Google Sheets workflow for clinical validation.

## 1. Current Integration Status & Files Involved

- **Integration Status**: Deployed and fully operational. Supports importing patient lists (horizontal format) and clinical detail sheets (vertical key-value format), as well as exporting case-taking data, financial schedules, and repertorization grids.
- **Files Involved**:
  - [googleDrive.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/lib/googleDrive.ts): Google Sheets API interface for folder provisions, calendar invites, and row sync.
  - [import-sheet/route.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/app/api/import-sheet/route.ts): Handles JSON requests from the frontend client to import spreadsheets.
  - [export-repertory/route.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/app/api/export-repertory/route.ts): Handles syncing rubric tables to spreadsheets.
  - [CIEWorkspace.tsx](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/app/admin/dashboard/CIEWorkspace.tsx): Client-side handlers triggering import/export sync actions.

## 2. Sheet Columns & Structure

The clinical workspace provisions 9 tabs per patient sheet:
1. **Dashboard**: Demographic data, active diagnosis, status metrics.
2. **Case Taking**: Intake details, symptoms, past history, modalities.
3. **Follow-Up Tracker**: Progress tracking, dates, remedies.
4. **Repertorization**: Rubric grids, remedy grading, totality scores.
5. **Treatment Planner**: Pricing details, discount concessions, and totals.
6. **Finance**: Payment dates, receipt ledger, and outstanding balances.
7. **AI Repertory Lab**: Advanced scoring matrices.
8. **Reports & Attachments**: Folder URLs.
9. **Config DB**: Config settings.

## 3. Privacy & Security Audit

- **Access Protection**: Google Sheets are shared with specific physician/clinician accounts (defined by `DOCTOR_EMAILS`) using write permissions.
- **Privacy Risk**: Patient name, phone number, and location are stored in the sheet.
- **Recommendations**:
  - Replace patient-identifying data with randomized, non-identifying keys in the validation sheets to maintain de-identification.
  - Store name and contact information exclusively in Firestore with proper access rules, using an opaque `Patient ID` to link matching rows.

## 4. Verification & Deployment Plan

1. Confirm all API credentials parse cleanly.
2. Verify that synchronization methods execute successfully without errors.
