import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import { authorizeRequest, type AuthorizedSession } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { hasPermission, type Permission } from "@/lib/security/rbac";
import { authorizeRepertoryOperation } from "./RepertoryAccessBoundary";
import { resolveDoctorRepertoryEntitlement } from "./DoctorEntitlementRepository";
import {
  isDoctorAllowedInRepertoryPilot,
  parseRepertoryDoctorPilotConfig,
  repertoryPermissionToDoctorCapability,
} from "./RepertoryDoctorPilotPolicy";

export type AuthorizedRepertoryRequest = {
  authorized: true;
  session: AuthorizedSession;
  authorizationPath: "admin-rbac" | "doctor-entitlement";
  tenantCacheScope: string;
};

export type DeniedRepertoryRequest = {
  authorized: false;
  response: NextResponse;
};

function deniedResponse(status: 401 | 403, code: "UNAUTHORIZED" | "FORBIDDEN", message: string) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function authorizeRepertoryRequest(
  request: NextRequest,
  permission: Extract<Permission, "repertory.search" | "repertory.repertorize">,
  resource: string,
): Promise<AuthorizedRepertoryRequest | DeniedRepertoryRequest> {
  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const verified = await verifyAdminSessionCookie(cookieValue);

  if (!verified) {
    await logSecurityEvent({
      userId: "anonymous",
      userEmail: "unauthenticated-client",
      userRole: "none",
      action: "repertory_access_blocked_unauthenticated",
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredPermission: permission },
    });
    return {
      authorized: false,
      response: deniedResponse(401, "UNAUTHORIZED", "Authentication required."),
    };
  }

  if (hasPermission(verified.role, permission)) {
    const adminAuthorization = await authorizeRequest(request, permission, resource);
    if (!adminAuthorization.authorized) return adminAuthorization;
    return {
      authorized: true,
      session: adminAuthorization.session,
      authorizationPath: "admin-rbac",
      tenantCacheScope: `authenticated:${adminAuthorization.session.uid}`,
    };
  }

  const capability = repertoryPermissionToDoctorCapability(permission);
  const pilotConfig = parseRepertoryDoctorPilotConfig({
    REPERTORY_DOCTOR_PILOT_ENABLED: process.env.REPERTORY_DOCTOR_PILOT_ENABLED,
    REPERTORY_DOCTOR_PILOT_UIDS: process.env.REPERTORY_DOCTOR_PILOT_UIDS,
  });
  if (!capability || !isDoctorAllowedInRepertoryPilot(pilotConfig, verified.uid, verified.role)) {
    await logSecurityEvent({
      userId: verified.uid,
      userEmail: verified.email || "unknown@homeo.healthcare",
      userRole: verified.role,
      action: "repertory_doctor_pilot_access_denied",
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredPermission: permission, pilotEnabled: pilotConfig.enabled },
    });
    return {
      authorized: false,
      response: deniedResponse(403, "FORBIDDEN", "Repertory pilot access is not enabled for this account."),
    };
  }

  const entitlement = await resolveDoctorRepertoryEntitlement(verified.uid);
  if (!entitlement) {
    return {
      authorized: false,
      response: deniedResponse(403, "FORBIDDEN", "An active repertory entitlement is required."),
    };
  }

  const decision = authorizeRepertoryOperation(entitlement, {
    organizationId: entitlement.organizationId,
    clinicId: entitlement.clinicId,
    doctorId: verified.uid,
    capability,
  });
  if (!decision.allowed) {
    await logSecurityEvent({
      userId: verified.uid,
      userEmail: verified.email || "unknown@homeo.healthcare",
      userRole: verified.role,
      action: "repertory_doctor_entitlement_denied",
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredCapability: capability },
    });
    return {
      authorized: false,
      response: deniedResponse(403, "FORBIDDEN", "An active repertory entitlement is required."),
    };
  }

  const session: AuthorizedSession = {
    uid: verified.uid,
    email: verified.email || "unknown@homeo.healthcare",
    role: verified.role,
    name: verified.name || "Practitioner",
  };
  return {
    authorized: true,
    session,
    authorizationPath: "doctor-entitlement",
    tenantCacheScope: `${entitlement.organizationId}:${entitlement.clinicId}:${verified.uid}`,
  };
}

/**
 * authorizeRepertoryExportRequest — like authorizeRepertoryRequest but
 * hardcodes the `export-json` capability check.
 *
 * A doctor with only `repertorize` capability must NOT reach the export
 * endpoint. This function enforces that gate explicitly, independent of
 * which permission string the caller passes.
 */
export async function authorizeRepertoryExportRequest(
  request: NextRequest,
  resource = "repertory/export-session",
): Promise<AuthorizedRepertoryRequest | DeniedRepertoryRequest> {
  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const verified = await verifyAdminSessionCookie(cookieValue);

  if (!verified) {
    await logSecurityEvent({
      userId: "anonymous",
      userEmail: "unauthenticated-client",
      userRole: "none",
      action: "repertory_export_blocked_unauthenticated",
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredCapability: "export-json" },
    });
    return {
      authorized: false,
      response: deniedResponse(401, "UNAUTHORIZED", "Authentication required."),
    };
  }


  // Doctor entitlement path: must be in pilot AND have export-json capability
  const pilotConfig = parseRepertoryDoctorPilotConfig({
    REPERTORY_DOCTOR_PILOT_ENABLED: process.env.REPERTORY_DOCTOR_PILOT_ENABLED,
    REPERTORY_DOCTOR_PILOT_UIDS: process.env.REPERTORY_DOCTOR_PILOT_UIDS,
  });
  if (!isDoctorAllowedInRepertoryPilot(pilotConfig, verified.uid, verified.role)) {
    await logSecurityEvent({
      userId: verified.uid,
      userEmail: verified.email || "unknown@homeo.healthcare",
      userRole: verified.role,
      action: "repertory_export_pilot_access_denied",
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredCapability: "export-json", pilotEnabled: pilotConfig.enabled },
    });
    return {
      authorized: false,
      response: deniedResponse(403, "FORBIDDEN", "Repertory export access is not enabled for this account."),
    };
  }

  const entitlement = await resolveDoctorRepertoryEntitlement(verified.uid);
  if (!entitlement) {
    return {
      authorized: false,
      response: deniedResponse(403, "FORBIDDEN", "An active repertory entitlement is required."),
    };
  }

  // Hardcoded export-json capability — does NOT fall back to repertorize
  const decision = authorizeRepertoryOperation(entitlement, {
    organizationId: entitlement.organizationId,
    clinicId: entitlement.clinicId,
    doctorId: verified.uid,
    capability: "export-json",
  });
  if (!decision.allowed) {
    await logSecurityEvent({
      userId: verified.uid,
      userEmail: verified.email || "unknown@homeo.healthcare",
      userRole: verified.role,
      action: "repertory_export_capability_denied",
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredCapability: "export-json" },
    });
    return {
      authorized: false,
      response: deniedResponse(403, "FORBIDDEN", "export-json capability is required."),
    };
  }

  const session: AuthorizedSession = {
    uid: verified.uid,
    email: verified.email || "unknown@homeo.healthcare",
    role: verified.role,
    name: verified.name || "Practitioner",
  };
  return {
    authorized: true,
    session,
    authorizationPath: "doctor-entitlement",
    tenantCacheScope: `${entitlement.organizationId}:${entitlement.clinicId}:${verified.uid}`,
  };
}
