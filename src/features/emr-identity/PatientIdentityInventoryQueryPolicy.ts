export const PATIENT_IDENTITY_METADATA_FIELDS = [
  "organizationId",
  "clinicId",
  "uhid",
  "name",
  "dateOfBirth",
  "phone",
  "email",
] as const;

export const PORTAL_IDENTITY_METADATA_FIELDS = ["patientId"] as const;
export const LINKED_RECORD_METADATA_FIELDS = ["patientId"] as const;
export const PATIENT_IDENTITY_INVENTORY_SCAN_LIMIT = 5_000;
