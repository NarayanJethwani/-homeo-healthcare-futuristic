import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getConsultationMateriaMedicaProfile } from "@/features/consultation/application/consultationMateriaMedicaReadModel.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdminApiSession(request);
  if (!session?.uid) return unauthorizedApiResponse();

  const searchParams = new URL(request.url).searchParams;
  const remedyId = searchParams.get("remedyId")?.trim();
  const sourceId = searchParams.get("sourceId")?.trim();
  if (!remedyId) {
    return NextResponse.json({ error: "remedyId is required" }, { status: 400 });
  }

  const profile = getConsultationMateriaMedicaProfile(remedyId, sourceId);
  if (!profile) {
    return NextResponse.json({ error: "Materia Medica profile not found" }, { status: 404 });
  }

  const response = NextResponse.json({ success: true, profile });
  response.headers.set("Cache-Control", "private, max-age=300");
  return response;
}
