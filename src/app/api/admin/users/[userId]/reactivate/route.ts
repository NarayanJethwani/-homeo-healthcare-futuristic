import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { reactivatePractitioner } from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "REACTIVATE_PRACTITIONER");
    if (!auth.authorized) return auth.response;

    const { userId } = await params;
    const updated = await reactivatePractitioner(userId, auth.session.uid);

    return NextResponse.json({
      success: true,
      account: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BAD_REQUEST",
          message: err.message || "Failed to reactivate account."
        }
      },
      { status: 400 }
    );
  }
}
