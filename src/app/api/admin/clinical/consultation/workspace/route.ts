import { NextRequest, NextResponse } from "next/server";
import { forbiddenApiResponse, requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { DEFAULT_CLINICAL_NOTES } from "@/features/consultation/types/clinical-notes.types";
import { resolveTelemedicineConsent } from "@/features/consultation/application/consultationConsent.server";
import {
  createUnsavedWorkspace,
  findActiveWorkspaceByPatient,
  saveWorkspaceDraft,
} from "@/features/consultation/application/consultationWorkspaceRepository.server";
import type { ConsultationWorkspaceDraftInput } from "@/features/consultation/application/consultationWorkspace.types";
import { canAccessClinicalPatient } from "@/features/consultation/application/clinicalPatientAccess.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session?.uid) return unauthorizedApiResponse();
  const patientId = new URL(req.url).searchParams.get("patientId")?.trim();
  if (!patientId) {
    return NextResponse.json({ error: "patientId is required" }, { status: 400 });
  }
  if (!(await canAccessClinicalPatient(session, patientId))) return forbiddenApiResponse();
  const consent = await resolveTelemedicineConsent(patientId);
  const existing = await findActiveWorkspaceByPatient(patientId);
  const workspace = existing || createUnsavedWorkspace({
    patientId,
    actorId: session.uid,
    consent,
    notes: DEFAULT_CLINICAL_NOTES,
  });
  return NextResponse.json({ success: true, workspace: { ...workspace, consent } });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session?.uid) return unauthorizedApiResponse();
  try {
    const body = (await req.json()) as {
      expectedVersion: number;
      draft: ConsultationWorkspaceDraftInput;
    };
    if (!body.draft?.id || !body.draft.patientId || !Number.isInteger(body.expectedVersion)) {
      return NextResponse.json({ error: "Invalid consultation draft" }, { status: 400 });
    }
    if (!(await canAccessClinicalPatient(session, body.draft.patientId))) return forbiddenApiResponse();
    const consent = await resolveTelemedicineConsent(body.draft.patientId);
    const workspace = await saveWorkspaceDraft({
      draft: body.draft,
      expectedVersion: body.expectedVersion,
      actorId: session.uid,
      consent,
    });
    return NextResponse.json({ success: true, workspace });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save consultation";
    const status = message === "CONSULTATION_VERSION_CONFLICT" ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
