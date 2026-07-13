import type { Permission } from "@/lib/security/rbac";

export type RepertoryDoctorPilotCapability = "search" | "repertorize";

export type RepertoryDoctorPilotConfig = {
  enabled: boolean;
  allowedUids: ReadonlySet<string>;
};

const SAFE_FIREBASE_UID = /^[A-Za-z0-9_-]{6,128}$/;
const MAX_PILOT_DOCTORS = 50;

export function parseRepertoryDoctorPilotConfig(
  environment: {
    REPERTORY_DOCTOR_PILOT_ENABLED?: string;
    REPERTORY_DOCTOR_PILOT_UIDS?: string;
  },
): RepertoryDoctorPilotConfig {
  const allowedUids = new Set(
    (environment.REPERTORY_DOCTOR_PILOT_UIDS || "")
      .split(",")
      .map((uid) => uid.trim())
      .filter((uid) => SAFE_FIREBASE_UID.test(uid))
      .slice(0, MAX_PILOT_DOCTORS),
  );

  return {
    enabled: environment.REPERTORY_DOCTOR_PILOT_ENABLED === "true" && allowedUids.size > 0,
    allowedUids,
  };
}

export function isDoctorPilotRole(role: string): boolean {
  const normalizedRole = role.trim().toLowerCase();
  return normalizedRole === "doctor" || normalizedRole === "read-only-admin";
}

export function isDoctorAllowedInRepertoryPilot(
  config: RepertoryDoctorPilotConfig,
  uid: string,
  role: string,
): boolean {
  return config.enabled && isDoctorPilotRole(role) && config.allowedUids.has(uid);
}

export function repertoryPermissionToDoctorCapability(
  permission: Permission,
): RepertoryDoctorPilotCapability | null {
  if (permission === "repertory.search") return "search";
  if (permission === "repertory.repertorize") return "repertorize";
  return null;
}
