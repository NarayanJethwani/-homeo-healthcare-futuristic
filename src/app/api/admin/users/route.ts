import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { getPractitionerAccounts } from "@/features/admin-users/practitionerRepository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "LIST_PRACTITIONERS");
    if (!auth.authorized) return auth.response;

    const accounts = await getPractitionerAccounts();

    return NextResponse.json({
      success: true,
      accounts
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: err.message || "Failed to retrieve practitioner accounts."
        }
      },
      { status: 500 }
    );
  }
}
