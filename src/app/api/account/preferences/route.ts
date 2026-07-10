import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionCookie, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { getPractitionerByUid, updatePractitionerProfile } from "@/features/admin-users/practitionerRepository";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

async function resolveSession(request: NextRequest) {
  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const verified = await verifyAdminSessionCookie(cookieValue);
  
  let session = verified ? {
    uid: verified.uid,
    email: verified.email || "unknown@homeo.healthcare",
    role: verified.role,
    name: verified.name || "Administrator"
  } : null;
  
  if (!session && process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_ADMIN_BYPASS === "true") {
    session = {
      uid: "dev-bypass-uid",
      email: "dev-bypass@homeo.healthcare",
      role: "super-admin",
      name: "Local Dev Bypass"
    };
  }
  
  if (!session) return null;
  
  if (session.uid !== "dev-bypass-uid") {
    const practitioner = await getPractitionerByUid(session.uid);
    if (practitioner && (practitioner.status === "suspended" || practitioner.status === "deactivated")) {
      return null;
    }
  }
  
  return session;
}

export async function POST(request: NextRequest) {
  try {
    const session = await resolveSession(request);
    if (!session) {
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

    const body = await request.json();
    const { preferences } = body;

    if (!preferences) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "Preferences payload is required."
          }
        },
        { status: 400 }
      );
    }

    let practitioner = await getPractitionerByUid(session.uid);
    if (!practitioner && session.uid === "dev-bypass-uid") {
      // Allow local bypass
      return NextResponse.json({
        success: true,
        preferences
      });
    }

    if (!practitioner) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "NOT_FOUND",
            message: "Practitioner profile not found."
          }
        },
        { status: 404 }
      );
    }

    // Save preferences in practitioner profile internal notes (or as serialized JSON)
    const existingNotes = practitioner.notes || "";
    // Clean old preferences tags if they exist
    const cleanedNotes = existingNotes.replace(/\[PREFERENCES:.*\]/g, "").trim();
    const updatedNotes = `${cleanedNotes}\n[PREFERENCES:${JSON.stringify(preferences)}]`.trim();

    await updatePractitionerProfile(practitioner.id, {
      notes: updatedNotes
    });

    await logSecurityEvent({
      userId: session.uid,
      userEmail: session.email,
      userRole: session.role,
      action: "preferences_updated",
      resource: "/api/account/preferences",
      status: "success",
      timestamp: new Date().toISOString(),
      details: { preferences }
    });

    return NextResponse.json({
      success: true,
      preferences
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BAD_REQUEST",
          message: err.message || "Failed to save preferences."
        }
      },
      { status: 400 }
    );
  }
}
