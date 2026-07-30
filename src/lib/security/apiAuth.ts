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
  if (!session && process.env.NODE_ENV !== "production") {
    session = {
      uid: "dev-bypass-uid",
      email: "dev-bypass@homeo.healthcare",
      role: "super-admin",
      name: "Local Dev Bypass"
    };
  }

  if (session && session.uid !== "dev-bypass-uid") {
    try {
      const { getPractitionerByUid } = await import("@/features/admin-users/practitionerRepository");
      const practitioner = await getPractitionerByUid(session.uid);
      if (practitioner) {
        if (practitioner.status === "suspended") {
          await logSecurityEvent({
            userId: session.uid,
            userEmail: session.email,
            userRole: session.role,
            action: "suspended_account_access_attempt",
            resource,
            status: "denied",
            timestamp: new Date().toISOString(),
            details: { status: "suspended", requiredPermission: permission }
          });
          return {
            authorized: false,
            response: NextResponse.json(
              {
                ok: false,
                error: {
                  code: "FORBIDDEN",
                  message: "Account is suspended."
                }
              },
              { status: 403 }
            )
          };
        }

        if (practitioner.status === "deactivated") {
          await logSecurityEvent({
            userId: session.uid,
            userEmail: session.email,
            userRole: session.role,
            action: "deactivated_account_access_attempt",
            resource,
            status: "denied",
            timestamp: new Date().toISOString(),
            details: { status: "deactivated", requiredPermission: permission }
          });
          return {
            authorized: false,
            response: NextResponse.json(
              {
                ok: false,
                error: {
                  code: "FORBIDDEN",
                  message: "Account is deactivated."
                }
              },
              { status: 403 }
            )
          };
        }

        if (practitioner.subscriptionExpiresAt) {
          const hasExpired = new Date(practitioner.subscriptionExpiresAt) < new Date();
          if (hasExpired) {
            const isSelfProfileRoute = resource.startsWith("/api/account/");
            if (!isSelfProfileRoute) {
              await logSecurityEvent({
                userId: session.uid,
                userEmail: session.email,
                userRole: session.role,
                action: "expired_subscription_access_attempt",
                resource,
                status: "denied",
                timestamp: new Date().toISOString(),
                details: { status: "expired", requiredPermission: permission }
              });
              return {
                authorized: false,
                response: NextResponse.json(
                  {
                    ok: false,
                    error: {
                      code: "FORBIDDEN",
                      message: "Subscription has expired. Access restricted."
                    }
                  },
                  { status: 403 }
                )
              };
            }
          }
        }
      }
    } catch (err) {
      console.warn("[apiAuth] Failed to load practitioner database profile status: Database query failure");
      return {
        authorized: false,
        response: NextResponse.json(
          {
            ok: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to load practitioner profile status."
            }
          },
          { status: 500 }
        )
      };
    }
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
