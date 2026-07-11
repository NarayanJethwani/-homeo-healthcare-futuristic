export interface Provenance {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  sourceType: "clinician" | "patient" | "caregiver" | "lab_integration" | "ai_suggestion" | "external_emr";
  sourceId?: string;
  enteredByRole: string;
  deviceId?: string;
}

export interface VersionedEntity {
  id: string;
  schemaVersion: number;
  recordVersion: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface OrganizationScopedEntity extends VersionedEntity {
  organizationId: string;
}

export interface ClinicScopedEntity extends OrganizationScopedEntity {
  clinicId?: string; // Optional if not bound to a single clinic location
}

export type RepositoryUpdateResult<T> =
  | {
      status: "updated";
      entity: T;
    }
  | {
      status: "version_conflict";
      currentEntity: T;
    }
  | {
      status: "not_found";
    };
