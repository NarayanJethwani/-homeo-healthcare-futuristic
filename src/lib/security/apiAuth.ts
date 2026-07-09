import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "../adminSession";
import { Permission, hasPermission } from "./rbac";
import { logSecurityEvent } from "./auditLogger";

export interface AuthorizedSession {
  uid: string;
  email: string;
  role: string;
  name: string;
}

/**
 * Server-side helper to verify request credentials and permissions.
 * If authorized, returns the decoded session object.
 * If unauthorized, returns a structured NextResponse (401 or 403) and logs the failure.
 */
export async function authorizeRequest(
  request: NextRequest,
  permission: Permission,
  resource: string
): Promise<{ authorized: true; session: AuthorizedSession } | { authorized: false; response: NextResponse }> {
  
  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const verified = await verifyAdminSessionCookie(cookieValue);
  let session: AuthorizedSession | null = null;

  if (verified) {
    session = {
      uid: verified.uid,
      email: verified.email || "unknown@homeo.healthcare",
      role: verified.role,
      name: verified.name || "Administrator"
    };
  }

  // Local development bypass support
  if (!session && process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_ADMIN_BYPASS === "true") {
    session = {
      uid: "dev-bypass-uid",
      email: "dev-bypass@homeo.healthcare",
      role: "super-admin",
      name: "Local Dev Bypass"
    };
  }

  if (!session) {
    // Unauthenticated
    await logSecurityEvent({
      userId: "anonymous",
      userEmail: "unauthenticated-client",
      userRole: "none",
      action: "access_blocked_unauthenticated",
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredPermission: permission }
    });

    const response = NextResponse.json(
      {
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required."
        }
      },
      { status: 401 }
    );
    return { authorized: false, response };
  }

  const userRole = session.role;
  const userEmail = session.email || "unknown@homeo.healthcare";
  const userId = session.uid;
  const userName = session.name || "Administrator";

  const allowed = hasPermission(userRole, permission);

  if (!allowed) {
    // Authenticated but unauthorized
    await logSecurityEvent({
      userId,
      userEmail,
      userRole,
      action: `access_blocked_insufficient_privileges:${permission}`,
      resource,
      status: "denied",
      timestamp: new Date().toISOString(),
      details: { requiredPermission: permission, userRole }
    });

    const response = NextResponse.json(
      {
        ok: false,
        error: {
          code: "FORBIDDEN",
          message: "Insufficient permissions."
        }
      },
      { status: 403 }
    );
    return { authorized: false, response };
  }

  // Permitted!
  return {
    authorized: true,
    session: {
      uid: userId,
      email: userEmail,
      role: userRole,
      name: userName
    }
  };
}
