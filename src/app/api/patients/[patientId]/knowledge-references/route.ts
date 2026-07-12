import { NextRequest, NextResponse } from "next/server";
import { validatePractitionerPatientAccess } from "@/features/patient-attachments/authHelper";
import { getPatientClinicalKnowledgeReferences } from "@/features/clinical-os/application/ClinicalKnowledgeReferenceRepository";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const { patientId } = await params;
  const access = await validatePractitionerPatientAccess(request, patientId);
  if (!access.authorized) {
    return NextResponse.json(
      { success: false, message: access.error },
      { status: access.status, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const references = await getPatientClinicalKnowledgeReferences(patientId);
    return NextResponse.json({ success: true, references }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to load reviewed Knowledge references." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

