# Patient Attachments & Laboratory Parameter Extraction Operations Manual

This operational manual documents the secure attachment repository, file upload validation constraints, role-based patient access controls, regex-based parameter extraction rules, clinician verification protocols, and PHI protection audit logging.

---

## 1. Core Model & Data Structures

Patient attachments and extracted laboratory parameters are defined in `src/features/patient-attachments/types.ts`:

```ts
export type AttachmentType = "lab-report" | "clinical-note" | "prescription-scan" | "other";
export type AttachmentStatus = "uploaded" | "processing" | "processed" | "extraction-failed" | "review-required" | "archived" | "deleted";
export type ExtractionStatus = "not-started" | "processing" | "completed" | "failed" | "requires-clinician-review";

export interface PatientAttachment {
  id: string;
  patientId: string;
  uploadedBy: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  type: AttachmentType;
  status: AttachmentStatus;
  extractionStatus: ExtractionStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  deletedAt?: string;
  notes?: string;
  source: "clinician-upload" | "patient-portal" | "external-sync";
}

export interface ExtractedLabParameter {
  id: string;
  attachmentId: string;
  patientId: string;
  testName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  flag: "low" | "normal" | "high" | "critical" | "unknown";
  confidence: number;
  reviewStatus: "pending-review" | "clinician-confirmed" | "corrected" | "rejected";
  originalValue?: string;
  originalUnit?: string;
  originalFlag?: "low" | "normal" | "high" | "critical" | "unknown";
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. Secure Upload Validation Policy

All uploads are subjected to strict validation rules before metadata registration or storage occurs:
- **Size Limit**: Capped at 10MB maximum; zero-byte files are rejected.
- **MIME Allowlist**: Restrict strictly to `application/pdf`, `image/png`, `image/jpeg`, `image/webp`. Missing MIME types are rejected.
- **Content Scanner**: Reads the uploaded binary data block and scans for executable binary headers (`MZ` for PE, `\x7fELF` for ELF) or text-based script injections (`<script`, `<?php`, `<html`, `<svg`, `eval(`) to prevent execution bypasses.
- **Filename Sanitization**:
  - Restricts path traversal sequences (`..`, `%2e%2e`, `/`, `%2f`, `\`, `%5c`).
  - Rejects double extensions if any intermediate extension is unsafe (e.g. `.php.pdf`).
  - Restricts empty filenames or names exceeding 255 characters.
  - Generates secure storage paths without using patient names: `patient-attachments/{patientId}/{attachmentId}/{safeFileName}`.

---

## 3. Strict Practitioner Access Controls

- **Role Constraints**: Ordinary practitioners can access only files belonging to patients assigned to them (`assignedDoctor === session.uid`).
- **Super-Admin Bypass**: Super-admins bypass patient assignment restrictions and can view all attachments.
- **Account Status Blocks**: Every request verifies practitioner status in real-time. Access is blocked for:
  - **Suspended** practitioners (403 Forbidden).
  - **Deactivated** practitioners (403 Forbidden).
  - **Expired** practitioners (403 Forbidden).
- **Cross-Scoping Protection**: API routes match the URL's `patientId` against the attachment's stored `patientId` on all single-attachment actions to ensure `attachmentId` alone cannot bypass scope.

---

## 4. Cache-Control Policy

To prevent sensitive clinical data or report metadata from being persisted locally in browser or CDN caches, all GET endpoints in the attachments module return strict cache headers:
```txt
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
```

---

## 5. Signed Download URL Policy

- **Short Expiration**: Signed download URLs expire in **5 minutes** (300 seconds) to prevent sharing or exposure.
- **No Log Persistence**: Signed URLs are generated dynamically in-memory and are **never** stored in Firestore or logged by the security audit logger.
- **Archived/Deleted Files**: File download is blocked once marked as `archived` or `deleted` unless explicitly requested by a `super-admin` with the `?audit=true` parameter.

---

## 6. Local Deterministic Parser & Extraction Limits

- **Regex Engine**: Extracted values are parsed locally using deterministic regex matching in `src/features/patient-attachments/labExtraction.ts`.
- **No External Calls**: The extraction pipeline has **no** external OCR or AI API calls.
- **Diagnostic/Prescription Block**: Auto-generated diagnoses, prescription generation, or automated constitutional scoring based on lab results are strictly prohibited. Abnormal flags and confidence levels are purely informational.
- **Clinician Review**: Extracted values default to `pending-review` and require manual clinician confirmation or correction before they are committed as verified patient records. Corrections preserve the original extracted value and unit for complete audit traceability.

---

## 7. PHI & Privacy Protection

- **Audit Trails**: Security logs monitor uploads, downloads, status updates, parameters confirmation/corrections, and archive/delete commands.
- **Log Sanitization**: Logs exclude raw text content, signed download URLs, patient names, emails, phone numbers, OCR outputs, and raw storage paths. Only sanitised IDs and MIME/size properties are saved.

---

## 8. Reviewed Lab Data Handoff Rules

The transition from raw extracted parameters to confirmed clinical context is governed by the following handoff rules:
- **Timeline Entry Gate**: Only parameters with reviewStatus `"clinician-confirmed"` or `"corrected"` enter the reviewed patient timeline.
- **Clinical OS Context Exclusion**: Parameters in state `"pending-review"` or `"rejected"` are strictly excluded from the Clinical OS read-only context.
- **Traceable Rejected State**: Rejected parameters update the status of the `ExtractedLabParameter` to `"rejected"` and save a traceable `ReviewedLabResult` mapped to reviewStatus `"rejected"`. This allows historical tracking but blocks them from the clinical timeline and summaries.
- **ConfirmedAt Timestamp**: The `confirmedAt` ISO timestamp acts as the primary timeline date.

