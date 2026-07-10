import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { revokePractitionerInvite } from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "REVOKE_INVITATION");
    if (!auth.authorized) return auth.response;

    const { inviteId } = await params;
    const success = await revokePractitionerInvite(inviteId, auth.session.uid);

    if (!success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "NOT_FOUND",
            message: "Invitation not found or could not be revoked."
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invitation successfully revoked."
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Failed to revoke invitation."
        }
      },
      { status: 500 }
    );
  }
}
