import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionCookie } from "@/lib/adminSession";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export const dynamic = "force-dynamic";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || !("idToken" in body) || typeof body.idToken !== "string") {
      return jsonResponse({ success: false, message: "Missing Firebase ID token." }, 400);
    }

    const { getAdminAuth, getAdminDb } = await import("@/lib/firebaseAdmin");
    const decodedToken = await getAdminAuth().verifyIdToken(body.idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    let name = decodedToken.name || decodedToken.email?.split("@")[0] || "Doctor";

    const userDoc = await getAdminDb().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return jsonResponse({ success: false, message: "Account is not authorized." }, 403);
    }

    const data = userDoc.data() || {};
    if (data.role !== "admin" && data.role !== "doctor") {
      return jsonResponse({ success: false, message: "Account is not authorized." }, 403);
    }

    const role = data.role;
    name = data.name || name;

    if (role === "doctor" && data.subscription?.plan !== "branch" && data.subscription?.validUntil) {
      const expiryDate = new Date(data.subscription.validUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        return jsonResponse({ success: false, message: "Subscription expired." }, 403);
      }
    }

    const cookieValue = await createAdminSessionCookie({
      uid,
      email,
      role,
      name,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    });

    const response = jsonResponse({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, cookieValue, cookieOptions());
    response.cookies.set(ADMIN_SESSION_COOKIE, "", {
      ...cookieOptions(),
      path: "/admin",
      maxAge: 0,
    });
    return response;
  } catch (err: any) {
    console.error("Failed to create admin session:", err?.message || err);
    return jsonResponse({ success: false, message: "Unable to create admin session." }, 500);
  }
}

export async function DELETE() {
  const response = jsonResponse({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...cookieOptions(),
    path: "/admin",
    maxAge: 0,
  });
  return response;
}
