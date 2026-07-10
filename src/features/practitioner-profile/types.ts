import { AdminRole, Permission } from "@/lib/security/rbac";
import { PractitionerAccountStatus } from "@/features/admin-users/types";

export interface PractitionerProfileView {
  id: string;
  email: string;
  displayName?: string;
  role: AdminRole;
  status: PractitionerAccountStatus;
  specialties?: string[];
  clinicLocation?: string;
  subscriptionExpiresAt?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface PractitionerProfileUpdate {
  displayName?: string;
  specialties?: string[];
  clinicLocation?: string;
}
