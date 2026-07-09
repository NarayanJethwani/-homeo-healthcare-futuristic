import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Permitted unauthenticated entrypoints
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname.startsWith("/api/admin/session") ||
    pathname.startsWith("/api/admin/invitations/accept")
  ) {
    return NextResponse.next();
  }

  const cookieVal = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  console.log(`[Middleware] pathname: ${pathname}, key: ${ADMIN_SESSION_COOKIE}, found: ${!!cookieVal}`);

  const session = await verifyAdminSessionCookie(cookieVal);
  console.log(`[Middleware] session result: ${!!session}`);

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
