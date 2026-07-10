import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getLabTimeline } from "@/features/patient-labs/labRepository";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;
    
    // 1. Authenticate and check patient file assignment
    const access = await validatePractitionerPatientAccess(request, patientId);
    if (!access.authorized) {
      return NextResponse.json(
        { ok: false, error: { code: access.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN", message: access.error } },
        { 
          status: access.status,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const testName = searchParams.get("testName") || undefined;

    const timeline = await getLabTimeline(patientId, testName);

    return new NextResponse(
      JSON.stringify({ success: true, timeline }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to load lab timeline." } },
      { 
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
      }
    );
  }
}
