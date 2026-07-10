import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { 
  confirmExtractedLabParameter, 
  correctExtractedLabParameter, 
  rejectExtractedLabParameter 
} from "@/features/patient-labs/labRepository";

export const dynamic = "force-dynamic";

export async function POST(
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

    const body = await request.json();
    const { attachmentId, parameterId, action, correction, reason } = body;

    if (!attachmentId || !parameterId || !action) {
      return NextResponse.json(
        { ok: false, error: { code: "BAD_REQUEST", message: "Missing attachmentId, parameterId, or action." } },
        { 
          status: 400,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
        }
      );
    }

    let result;
    const actorId = access.session!.uid;

    if (action === "confirm") {
      result = await confirmExtractedLabParameter(patientId, attachmentId, parameterId, actorId);
    } else if (action === "correct") {
      if (!correction || !correction.value) {
        return NextResponse.json(
          { ok: false, error: { code: "BAD_REQUEST", message: "Missing correction value." } },
          { 
            status: 400,
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
          }
        );
      }
      result = await correctExtractedLabParameter(patientId, attachmentId, parameterId, correction, actorId);
    } else if (action === "reject") {
      result = await rejectExtractedLabParameter(patientId, attachmentId, parameterId, reason || "Rejected by clinician", actorId);
    } else {
      return NextResponse.json(
        { ok: false, error: { code: "BAD_REQUEST", message: `Invalid action: ${action}` } },
        { 
          status: 400,
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, result }),
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
      { ok: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to process lab review." } },
      { 
        status: 500,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" }
      }
    );
  }
}
