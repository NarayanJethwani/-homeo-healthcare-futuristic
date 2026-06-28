import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";

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
  allowedRoles: SessionRole[] = ["admin", "doctor"]
) {
  const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return null;
  if (!allowedRoles.includes(session.role)) return null;
  return session;
}
