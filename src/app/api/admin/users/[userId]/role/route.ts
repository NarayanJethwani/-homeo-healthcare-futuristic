import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { updatePractitionerRole } from "@/features/admin-users/practitionerRepository";
import { AdminRole } from "@/lib/security/rbac";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "CHANGE_PRACTITIONER_ROLE");
    if (!auth.authorized) return auth.response;

    const { userId } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "Role is required."
          }
        },
        { status: 400 }
      );
    }

    const updated = await updatePractitionerRole(userId, role as AdminRole, auth.session.uid);

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
          message: err.message || "Failed to update role."
        }
      },
      { status: 400 }
    );
  }
}
