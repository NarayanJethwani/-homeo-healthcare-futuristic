import { EditorialRole } from "../types";

export const PROHIBITED_CLAIMS_PHRASES = [
  "guaranteed cure",
  "permanent cure",
  "no side effects",
  "replacement for emergency care",
  "replaces emergency care",
  "100% effective",
  "100% cure",
  "proven cure"
];

export const ROLE_PRIVILEGES: Record<EditorialRole, {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canReview: boolean;
  canPublish: boolean;
}> = {
  Administrator: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canReview: true,
    canPublish: true
  },
  MedicalEditor: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canReview: true,
    canPublish: false
  },
  Reviewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canReview: true,
    canPublish: false
  },
  Contributor: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canReview: false,
    canPublish: false
  },
  Viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canReview: false,
    canPublish: false
  }
};
