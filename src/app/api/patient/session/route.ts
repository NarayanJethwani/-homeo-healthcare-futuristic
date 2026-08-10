import { NextRequest, NextResponse } from "next/server";
import { PATIENT_SESSION_COOKIE, createPatientSessionCookie } from "@/lib/patientSession";
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
    
    let decodedToken;
    const mockSessionAllowed = process.env.NODE_ENV !== "production";

    if (!mockSessionAllowed && body.idToken.startsWith("mock-patient-")) {
      return jsonResponse({ success: false, message: "Invalid patient authentication token." }, 401);
    }

    if (mockSessionAllowed && body.idToken === "mock-patient-linked-token") {
      decodedToken = {
        uid: "mock-patient-uid-linked",
        email: "patient.demo@homeo.healthcare",
        name: "Aarav Sharma"
      };
    } else if (mockSessionAllowed && body.idToken === "mock-patient-unlinked-token") {
      decodedToken = {
        uid: "mock-patient-uid-unlinked",
        email: "patient.demo@homeo.healthcare",
        name: "Aarav Sharma"
      };
    } else {
      decodedToken = await verifyFirebaseIdToken(body.idToken);
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;
    let name = decodedToken.name || decodedToken.email?.split("@")[0] || "Patient";

    const role = "patient";
    let patientId = "";

    if (uid.startsWith("mock-")) {
      patientId = uid === "mock-patient-uid-linked" ? "P-000001" : "";
    } else {
      const userDoc = await getAdminDb().collection("users").doc(uid).get();
      if (!userDoc.exists) {
        return jsonResponse({ success: false, message: "Account is not authorized." }, 403);
      }

      const data = userDoc.data() || {};
      if (data.role !== "patient") {
        return jsonResponse({ success: false, message: "Account is not authorized as patient." }, 403);
      }

      patientId = data.patientId || "";
      name = data.name || name;
    }

    const cookieValue = await createPatientSessionCookie({
      uid,
      email,
      role,
      patientId,
      name,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    });

    const response = jsonResponse({ success: true, patientId });
    response.cookies.set(PATIENT_SESSION_COOKIE, cookieValue, cookieOptions());
    return response;
  } catch (err: any) {
    console.error("Failed to create patient session:", err?.message || err);
    return jsonResponse({ success: false, message: "Unable to create patient session: " + (err?.message || String(err)) }, 500);
  }
}

export async function DELETE() {
  const response = jsonResponse({ success: true });
  response.cookies.set(PATIENT_SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
  response.cookies.set("hh_admin_session_v3", "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}
