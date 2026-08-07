import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionCookie } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, message: "Dev login is disabled in production." }, { status: 403 });
  }

  const payload = {
    uid: "dev_doctor_101",
    email: "dr.jethwani@homeo.healthcare",
    name: "Dr. Narayan Jethwani",
    role: "admin" as const,
    exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
  };

  const cookieVal = await createAdminSessionCookie(payload);

  const response = NextResponse.json({
    success: true,
    user: payload,
    nextUrl: "/admin/clinical/consultation",
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: cookieVal,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  return response;
}
