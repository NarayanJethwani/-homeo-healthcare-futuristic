import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionCookie, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { getCurrentPractitionerSecurityActivity } from "@/features/practitioner-profile/practitionerProfileRepository";
import { getPractitionerByUid } from "@/features/admin-users/practitionerRepository";

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

export async function GET(request: NextRequest) {
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

    const activity = await getCurrentPractitionerSecurityActivity(session);
    return NextResponse.json({
      success: true,
      activity
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Failed to load security activity."
        }
      },
      { status: 500 }
    );
  }
}
