import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { 
  getPractitionerById, 
  updatePractitionerProfile 
} from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "GET_PRACTITIONER");
    if (!auth.authorized) return auth.response;

    const { userId } = await params;
    const account = await getPractitionerById(userId);

    if (!account) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "NOT_FOUND",
            message: "Practitioner account not found."
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      account
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Failed to retrieve practitioner profile."
        }
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "UPDATE_PRACTITIONER_PROFILE");
    if (!auth.authorized) return auth.response;

    const { userId } = await params;
    const body = await request.json();

    const updated = await updatePractitionerProfile(userId, body);

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
          message: err.message || "Failed to update practitioner profile."
        }
      },
      { status: 400 }
    );
  }
}
