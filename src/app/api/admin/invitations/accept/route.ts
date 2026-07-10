import { NextRequest, NextResponse } from "next/server";
import { acceptPractitionerInvite } from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, profileInput } = body;

    if (!token || !profileInput) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "token and profileInput are required."
          }
        },
        { status: 400 }
      );
    }

    const account = await acceptPractitionerInvite(token, profileInput);

    return NextResponse.json({
      success: true,
      message: "Invitation successfully accepted. Practitioner account activated.",
      account
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BAD_REQUEST",
          message: err.message || "Failed to accept invitation."
        }
      },
      { status: 400 }
    );
  }
}
