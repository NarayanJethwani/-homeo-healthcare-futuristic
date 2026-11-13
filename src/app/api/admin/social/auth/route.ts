import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getMetaOAuthLoginUrl, META_OAUTH_COOKIE } from "@/lib/meta/tokens";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await requireAdminApiSession(request, ["super-admin", "admin"]);
  if (!session) {
    return unauthorizedApiResponse("Admin privileges required to configure social publishing.");
  }

  try {
    const csrfToken = crypto.randomUUID();
    const statePayload = JSON.stringify({
      csrfToken,
      uid: session.uid,
      ts: Date.now(),
    });
    const encodedState = Buffer.from(statePayload).toString("base64url");

    const oauthUrl = getMetaOAuthLoginUrl(encodedState);

    // If client requested JSON, return the URL. Otherwise redirect directly.
    const acceptHeader = request.headers.get("accept") || "";
    const wantsJson = acceptHeader.includes("application/json") && !acceptHeader.includes("text/html");

    if (wantsJson) {
      const jsonResponse = NextResponse.json({ ok: true, url: oauthUrl });
      jsonResponse.cookies.set(META_OAUTH_COOKIE, csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600, // 10 minutes
      });
      jsonResponse.headers.set("Cache-Control", "no-store");
      return jsonResponse;
    }

    const redirectResponse = NextResponse.redirect(oauthUrl);
    redirectResponse.cookies.set(META_OAUTH_COOKIE, csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
    redirectResponse.headers.set("Cache-Control", "no-store");
    return redirectResponse;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to initialize Meta OAuth.";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "META_AUTH_INIT_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
