import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { getInvitations } from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "LIST_INVITATIONS");
    if (!auth.authorized) return auth.response;

    const invitations = await getInvitations();

    // Strip tokenHash from every invitation returned to client
    const cleanInvitations = invitations.map(inv => {
      const { tokenHash, ...publicInv } = inv as any;
      return publicInv;
    });

    return NextResponse.json({
      success: true,
      invitations: cleanInvitations
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Failed to retrieve invitations."
        }
      },
      { status: 500 }
    );
  }
}
