import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getSanitizedConnectionStatus } from "@/lib/meta/storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await requireAdminApiSession(request, ["super-admin", "admin"]);
  if (!session) {
    return unauthorizedApiResponse("Admin privileges required to view social connection status.");
  }

  const status = await getSanitizedConnectionStatus();

  const response = NextResponse.json({
    ok: true,
    data: status,
  });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}
