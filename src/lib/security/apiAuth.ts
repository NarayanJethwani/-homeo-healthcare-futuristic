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
  const session = await verifyAdminSessionCookie(cookieValue);

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
      { success: false, error: "Unauthenticated. Session cookie is missing or invalid." },
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
      { success: false, error: "Forbidden. Insufficient permissions to perform this action." },
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
