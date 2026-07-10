import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { extendPractitionerSubscription } from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await authorizeRequest(request, "SUBSCRIPTION_MANAGE", "EXTEND_PRACTITIONER_SUBSCRIPTION");
    if (!auth.authorized) return auth.response;

    const { userId } = await params;
    const body = await request.json();
    const { expiresAt } = body;

    if (!expiresAt) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "expiresAt is required."
          }
        },
        { status: 400 }
      );
    }

    const updated = await extendPractitionerSubscription(userId, expiresAt, auth.session.uid);

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
          message: err.message || "Failed to extend subscription."
        }
      },
      { status: 400 }
    );
  }
}
