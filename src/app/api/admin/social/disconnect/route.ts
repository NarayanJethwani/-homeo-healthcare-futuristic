import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { disconnectMetaConnection } from "@/lib/meta/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession(request, ["super-admin", "admin"]);
  if (!session) {
    return unauthorizedApiResponse("Admin privileges required to disconnect social channels.");
  }

  try {
    await disconnectMetaConnection();
    return NextResponse.json({
      ok: true,
      message: "Social media channels disconnected successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to disconnect.";
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "DISCONNECT_FAILED",
          message: msg,
        },
      },
      { status: 500 }
    );
  }
}
