import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { suspendPractitioner } from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "SUSPEND_PRACTITIONER");
    if (!auth.authorized) return auth.response;

    const { userId } = await params;
    const body = await request.json();
    const { reason = "No reason provided." } = body;

    const updated = await suspendPractitioner(userId, reason, auth.session.uid);

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
          message: err.message || "Failed to suspend account."
        }
      },
      { status: 400 }
    );
  }
}
