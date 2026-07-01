import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionCookie } from "@/lib/adminSession";
import { verifyFirebaseIdToken } from "@/lib/firebaseAuthVerify";

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
    secure: true,
    sameSite: "strict" as const,
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

    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const decodedToken = await verifyFirebaseIdToken(body.idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    let name = decodedToken.name || decodedToken.email?.split("@")[0] || "Doctor";
    let role = decodedToken.role;

    try {
      const userDoc = await getAdminDb().collection("users").doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data() || {};
        if (data.role === "admin" || data.role === "doctor") {
          role = data.role;
          name = data.name || name;

          if (role === "doctor" && data.subscription?.plan !== "branch" && data.subscription?.validUntil) {
            const expiryDate = new Date(data.subscription.validUntil);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (expiryDate < today) {
              return jsonResponse({ success: false, message: "Subscription expired." }, 403);
            }
          }
        }
      } else {
        if (!role && email) {
          const emailLower = email.toLowerCase();
          if (emailLower === "narayan.jethwani@homeo.healthcare" || emailLower === "test-admin@homeo.healthcare") {
            role = "admin";
          }
        }
        if (!role) {
          return jsonResponse({ success: false, message: "Account is not authorized." }, 403);
        }
      }
    } catch (firestoreErr: any) {
      console.warn("Firestore user lookup failed, falling back to custom claims/known admins:", firestoreErr?.message || firestoreErr);
      if (!role && email) {
        const emailLower = email.toLowerCase();
        if (emailLower === "narayan.jethwani@homeo.healthcare" || emailLower === "test-admin@homeo.healthcare") {
          role = "admin";
        }
      }
    }

    if (role !== "admin" && role !== "doctor") {
      return jsonResponse({ success: false, message: "Account is not authorized." }, 403);
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
    return response;
  } catch (err: any) {
    console.error("Failed to create admin session:", err?.message || err);
    return jsonResponse({ success: false, message: "Unable to create admin session: " + (err?.message || String(err)) }, 500);
  }
}

export async function DELETE() {
  const response = jsonResponse({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
  return response;
}
