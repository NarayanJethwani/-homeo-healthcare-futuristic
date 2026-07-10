import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionCookie, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { 
  getCurrentPractitionerProfile, 
  updateCurrentPractitionerProfile 
} from "@/features/practitioner-profile/practitionerProfileRepository";
import { getPractitionerByUid } from "@/features/admin-users/practitionerRepository";
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

    const profile = await getCurrentPractitionerProfile(session);
    return NextResponse.json({
      success: true,
      profile
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Failed to load account profile."
        }
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    
    // Explicitly reject protected fields at API boundary
    const rejectedFields = ["role", "status", "subscriptionExpiresAt", "permissions", "uid", "email"];
    const containsRejected = rejectedFields.some(field => body[field] !== undefined);
    
    if (containsRejected) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "Modification of administrative role, status, permissions, or subscription expiry is strictly forbidden."
          }
        },
        { status: 400 }
      );
    }

    const updated = await updateCurrentPractitionerProfile(session, body);

    await logSecurityEvent({
      userId: session.uid,
      userEmail: session.email,
      userRole: session.role,
      action: "profile_updated",
      resource: "/api/account/profile",
      status: "success",
      timestamp: new Date().toISOString(),
      details: { updatedFields: Object.keys(body) }
    });

    return NextResponse.json({
      success: true,
      profile: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BAD_REQUEST",
          message: err.message || "Failed to update account profile."
        }
      },
      { status: 400 }
    );
  }
}
