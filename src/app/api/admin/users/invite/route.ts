import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { createPractitionerInvite } from "@/features/admin-users/practitionerRepository";
import { AdminRole } from "@/lib/security/rbac";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "CREATE_INVITATION");
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "Email and role are required."
          }
        },
        { status: 400 }
      );
    }

    const { invitation, rawToken } = await createPractitionerInvite({
      email,
      role: role as AdminRole,
      invitedBy: auth.session.uid
    });

    // Strip tokenHash from invitation object returned in response
    const { tokenHash, ...publicInvitation } = invitation as any;

    return NextResponse.json({
      success: true,
      invitation: publicInvitation,
      rawToken,
      inviteLink: `${request.nextUrl.origin}/admin/onboard?token=${rawToken}`,
      warning: "Invitation token is shown once. Store securely if needed."
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BAD_REQUEST",
          message: err.message || "Failed to create invitation."
        }
      },
      { status: 400 }
    );
  }
}
