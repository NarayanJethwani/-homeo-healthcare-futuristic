# Release Notes: v2.12.1 — Patient Attachment Security, Storage & PHI Hardening

Chronological record of Sprint 16 release covering secure file content signatures, strict path format verification, route header policies, and test coverage upgrades.

---

## 1. Summary of Changes

### A. Executable Content & Script Scanning
- Added byte-level signature detection (`MZ`, `ELF` headers) in `uploadValidation.ts` to reject compiled binary executions.
- Added regex and substring checks (`<script`, `<?php`, `<html`, `<svg`) in uploaded buffers.
- Hardened double-extension rules preventing malicious scripts masking as standard documents (e.g. `.php.pdf`).

### B. Filename & Storage Path Controls
- Strictly blocked path traversal sequence parameters (e.g. `..`, `%2e%2e`, `/`, `%2f`, `\`, `%5c`).
- Forced format check ensuring patient names are never included in actual cloud storage path mappings.
- Preserve original filename only as display metadata.

### C. Cache-Control Header Gating
- Configured dynamic API routes (`attachments`, `single-attachment`, `download`, `lab-parameters`) to emit `Cache-Control: no-store` headers.

### D. Download & Signed URL Lifetime Limits
- Shortened signed URL validity to **5 minutes** (300 seconds).
- Prevented signed download URLs from ever being logged or saved.
- Blocked downloading of archived/deleted attachments unless requested by a super-admin in audit mode.

### E. Parameter Ownership Validation
- Enforced verification check mapping the requested `parameterId` to the active `attachmentId` and `patientId` on parameter review updates to prevent cross-scoping.

---

## 2. Test Verification Matrix

All 24 unit and E2E security assertions run and **passed with 100% success**:
1. patientId/attachmentId mismatch denied.
2. archived attachment download denied.
3. deleted attachment download denied.
4. zero-byte file rejected.
5. missing MIME rejected.
6. encoded path traversal sanitized.
7. double extension executable rejected.
8. PDF MIME with executable signature rejected.
9. image MIME with HTML body rejected.
10. signed URL not logged.
11. storage path excludes patient name.
12. raw OCR text not persisted.
13. extraction failure sets review-required.
14. abnormal flag does not imply diagnosis.
15. correction preserves attachment traceability.
16. default list excludes archived/deleted attachments.
17. unauthorized lab parameter access denied.
18. no public cache headers missing on sensitive routes.
19. suspended practitioner blocked.
20. deactivated practitioner blocked.
21. expired practitioner blocked from attachments route.
22. public Knowledge UI unchanged.
23. Clinical OS scoring unchanged.
24. Treatment Planner logic unchanged.
