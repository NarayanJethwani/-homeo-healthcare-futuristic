import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/adminApiAuth";
import { resolveMetaConnection, META_OAUTH_COOKIE } from "@/lib/meta/tokens";
import { saveMetaConnection } from "@/lib/meta/storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const redirectTarget = new URL("/admin/social", baseUrl);

  // 1. Check for provider-level errors or user cancellation
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  if (error) {
    redirectTarget.searchParams.set("error", errorDescription || error);
    const errRes = NextResponse.redirect(redirectTarget);
    errRes.cookies.delete(META_OAUTH_COOKIE);
    return errRes;
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    redirectTarget.searchParams.set("error", "Missing authorization code or state parameter.");
    return NextResponse.redirect(redirectTarget);
  }

  // 2. CSRF verification
  const storedCsrfToken = request.cookies.get(META_OAUTH_COOKIE)?.value;
  let parsedState: { csrfToken: string; uid: string; ts: number } | null = null;

  try {
    const decodedStr = Buffer.from(state, "base64url").toString("utf-8");
    parsedState = JSON.parse(decodedStr);
  } catch {
    redirectTarget.searchParams.set("error", "Invalid or tampered OAuth state parameter.");
    return NextResponse.redirect(redirectTarget);
  }

  if (!storedCsrfToken || !parsedState?.csrfToken || storedCsrfToken !== parsedState.csrfToken) {
    redirectTarget.searchParams.set("error", "OAuth security validation failed (CSRF mismatch).");
    return NextResponse.redirect(redirectTarget);
  }

  // Check state age (max 15 minutes)
  if (Date.now() - parsedState.ts > 15 * 60 * 1000) {
    redirectTarget.searchParams.set("error", "OAuth session timed out. Please try again.");
    return NextResponse.redirect(redirectTarget);
  }

  // 3. Admin session verification
  const session = await requireAdminApiSession(request, ["super-admin", "admin"]);
  const adminUser = {
    uid: session?.uid || parsedState.uid || "admin-system",
    email: session?.email || undefined,
    name: session?.name || undefined,
    role: session?.role || "admin",
  };

  // 4. Code exchange and account resolution
  try {
    const connectionRecord = await resolveMetaConnection(code, adminUser);
    await saveMetaConnection(connectionRecord);

    redirectTarget.searchParams.set("connected", "true");
    if (connectionRecord.pageName) {
      redirectTarget.searchParams.set("page", connectionRecord.pageName);
    }
    if (connectionRecord.instagramUsername) {
      redirectTarget.searchParams.set("ig", connectionRecord.instagramUsername);
    }

    const successRes = NextResponse.redirect(redirectTarget);
    successRes.cookies.delete(META_OAUTH_COOKIE);
    return successRes;
  } catch (exchangeErr: unknown) {
    const msg =
      exchangeErr instanceof Error ? exchangeErr.message : "Failed to exchange authorization code.";
    redirectTarget.searchParams.set("error", msg);
    const failRes = NextResponse.redirect(redirectTarget);
    failRes.cookies.delete(META_OAUTH_COOKIE);
    return failRes;
  }
}
