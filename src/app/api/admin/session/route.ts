import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionCookie } from "@/lib/adminSession";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.idToken || typeof body.idToken !== "string") {
      return NextResponse.json({ success: false, message: "Missing Firebase ID token." }, { status: 400 });
    }

    const decodedToken = await getAdminAuth().verifyIdToken(body.idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    let name = decodedToken.name || decodedToken.email?.split("@")[0] || "Doctor";

    const userDoc = await getAdminDb().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ success: false, message: "Account is not authorized." }, { status: 403 });
    }

    const data = userDoc.data() || {};
    if (data.role !== "admin" && data.role !== "doctor") {
      return NextResponse.json({ success: false, message: "Account is not authorized." }, { status: 403 });
    }

    const role = data.role;
    name = data.name || name;

    if (role === "doctor" && data.subscription?.plan !== "branch" && data.subscription?.validUntil) {
      const expiryDate = new Date(data.subscription.validUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        return NextResponse.json({ success: false, message: "Subscription expired." }, { status: 403 });
      }
    }

    const cookieValue = await createAdminSessionCookie({
      uid,
      email,
      role,
      name,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, cookieValue, cookieOptions());
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (err: any) {
    console.error("Failed to create admin session:", err?.message || err);
    return NextResponse.json({ success: false, message: "Unable to create admin session." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
