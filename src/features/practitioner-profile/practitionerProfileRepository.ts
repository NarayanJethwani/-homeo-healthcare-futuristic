import { 
  getPractitionerByUid, 
  getPractitionerByEmail, 
  updatePractitionerProfile 
} from "@/features/admin-users/practitionerRepository";
import { normalizeRole, getPermissionsByRole } from "@/lib/security/rbac";
import { memorySecurityAuditLogs } from "@/lib/security/auditLogger";
import { PractitionerProfileView, PractitionerProfileUpdate } from "./types";

export async function getCurrentPractitionerProfile(session: any): Promise<PractitionerProfileView> {
  const userId = session.uid;
  const role = normalizeRole(session.role);
  const permissions = getPermissionsByRole(role);
  
  let practitioner = await getPractitionerByUid(userId);
  if (!practitioner && session.email) {
    practitioner = await getPractitionerByEmail(session.email);
  }
  
  if (practitioner) {
    return {
      id: practitioner.id,
      email: practitioner.email,
      displayName: practitioner.displayName,
      role: practitioner.role,
      status: practitioner.status,
      specialties: practitioner.specialties,
      clinicLocation: practitioner.clinicLocation,
      subscriptionExpiresAt: practitioner.subscriptionExpiresAt,
      permissions,
      createdAt: practitioner.createdAt,
      updatedAt: practitioner.updatedAt
    };
  }
  
  // Fallback for first run / local dev bypass
  const nowStr = new Date().toISOString();
  return {
    id: "session_profile_id",
    email: session.email || "dev@homeo.healthcare",
    displayName: session.name || "Administrator",
    role,
    status: "active",
    specialties: [],
    clinicLocation: "",
    permissions,
    createdAt: nowStr,
    updatedAt: nowStr
  };
}

export async function updateCurrentPractitionerProfile(
  session: any,
  patch: PractitionerProfileUpdate
): Promise<PractitionerProfileView> {
  let practitioner = await getPractitionerByUid(session.uid);
  if (!practitioner && session.email) {
    practitioner = await getPractitionerByEmail(session.email);
  }
  
  if (!practitioner) {
    throw new Error("Practitioner account profile not found in database.");
  }
  
  const updated = await updatePractitionerProfile(practitioner.id, {
    displayName: patch.displayName,
    specialties: patch.specialties,
    clinicLocation: patch.clinicLocation
  });
  
  return {
    id: updated.id,
    email: updated.email,
    displayName: updated.displayName,
    role: updated.role,
    status: updated.status,
    specialties: updated.specialties,
    clinicLocation: updated.clinicLocation,
    subscriptionExpiresAt: updated.subscriptionExpiresAt,
    permissions: getPermissionsByRole(updated.role),
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt
  };
}

export async function getCurrentPractitionerSecurityActivity(session: any): Promise<any[]> {
  const email = session.email;
  const uid = session.uid;
  
  const logs = memorySecurityAuditLogs.filter(log => {
    const matchEmail = email && log.userEmail?.toLowerCase() === email.toLowerCase();
    const matchUid = log.userId === uid;
    return matchEmail || matchUid;
  });

  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map(log => ({
    action: log.action,
    resource: log.resource,
    status: log.status,
    timestamp: log.timestamp,
    details: log.details
  }));
}
