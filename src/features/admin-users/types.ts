import { AdminRole } from "@/lib/security/rbac";
import type { DoctorRepertoryEntitlement } from "@/features/repertory/access/DoctorEntitlementService";

export type PractitionerAccountStatus =
  | "invited"
  | "active"
  | "suspended"
  | "deactivated"
  | "expired";

export type PractitionerInviteStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "revoked";

export interface PractitionerAccount {
  id: string;
  uid?: string;
  email: string;
  displayName?: string;
  role: AdminRole;
  status: PractitionerAccountStatus;
  specialties?: string[];
  clinicLocation?: string;
  organizationId?: string;
  clinicId?: string;
  repertoryCapabilities?: DoctorRepertoryEntitlement["capabilities"];
  createdAt: string;
  updatedAt: string;
  invitedBy?: string;
  activatedAt?: string;
  suspendedAt?: string;
  deactivatedAt?: string;
  subscriptionExpiresAt?: string;
  notes?: string;
}

export interface PractitionerInvitation {
  id: string;
  email: string;
  role: AdminRole;
  status: PractitionerInviteStatus;
  tokenHash: string;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
}
