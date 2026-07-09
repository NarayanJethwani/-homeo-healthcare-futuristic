import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import { AdminRole, normalizeRole } from "./security/rbac";

type SessionRole = "admin" | "doctor";

export function unauthorizedApiResponse(message = "Authentication required.") {
  const response = NextResponse.json(
    {
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message
      }
    },
    { status: 401 }
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function forbiddenApiResponse(message = "Insufficient permissions.") {
  const response = NextResponse.json(
    {
      ok: false,
      error: {
        code: "FORBIDDEN",
        message
      }
    },
    { status: 403 }
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function requireAdminApiSession(
  request: NextRequest,
  allowedRoles: (SessionRole | AdminRole)[] = ["admin", "doctor"]
) {
  let session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  // Local development bypass support
  if (!session && process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_ADMIN_BYPASS === "true") {
    session = {
      uid: "dev-bypass-uid",
      email: "dev-bypass@homeo.healthcare",
      role: "super-admin",
      name: "Local Dev Bypass",
      exp: Math.floor(Date.now() / 1000) + 3600
    };
  }

  if (!session) return null;

  const normRole = normalizeRole(session.role);

  // super-admin is always authorized for admin api routes
  if (normRole === "super-admin") {
    return session;
  }

  // Map requested roles to normalized roles
  const allowedNormRoles = allowedRoles.map(r => {
    if (r === "admin") return "super-admin";
    if (r === "doctor") return "read-only-admin";
    return normalizeRole(r);
  });

  if (allowedNormRoles.includes(normRole)) {
    return session;
  }

  return null;
}
