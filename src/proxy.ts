import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "./lib/adminSession";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Permitted unauthenticated entrypoints
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname === "/api/admin/session" ||
    pathname === "/api/admin/invitations/accept"
  ) {
    return NextResponse.next();
  }

  const cookieVal = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  const session = await verifyAdminSessionCookie(cookieVal);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required."
          }
        },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  if (!pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
