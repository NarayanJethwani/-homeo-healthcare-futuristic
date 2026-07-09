import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
import { AdminRole, normalizeRole } from "./security/rbac";

type SessionRole = "admin" | "doctor";

export function unauthorizedApiResponse(message = "Authentication required.") {
  const response = NextResponse.json({ success: false, message }, { status: 401 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function forbiddenApiResponse(message = "Admin access required.") {
  const response = NextResponse.json({ success: false, message }, { status: 403 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function requireAdminApiSession(
  request: NextRequest,
  allowedRoles: (SessionRole | AdminRole)[] = ["admin", "doctor"]
) {
  const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
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
