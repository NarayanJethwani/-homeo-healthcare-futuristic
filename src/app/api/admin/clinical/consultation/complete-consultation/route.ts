import { NextRequest, NextResponse } from "next/server";
import { forbiddenApiResponse, requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import type { ConsultationOutcome, PrescriptionDraft } from "@/features/consultation/types/prescription.types";
import type { StructuredClinicalNotes } from "@/features/consultation/types/clinical-notes.types";
import type { SelectedRubric } from "@/features/consultation/types/repertory-intelligence.types";
import type { ConsultationRemedySelection } from "@/features/consultation/application/consultationWorkspace.types";
import { evaluateGuardedCompletionReadiness } from "@/features/consultation/utils/prescription-validation";
import { computeInputSnapshotHash } from "@/features/consultation/services/remedyTotalityScorer";
import { resolveTelemedicineConsent } from "@/features/consultation/application/consultationConsent.server";
import { completeWorkspace } from "@/features/consultation/application/consultationWorkspaceRepository.server";
import { canAccessClinicalPatient } from "@/features/consultation/application/clinicalPatientAccess.server";

export async function POST(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session?.uid) return unauthorizedApiResponse();

  try {
    const body = (await req.json()) as {
      patientId: string;
      consultationId: string;
      recordVersion: number;
      outcome: ConsultationOutcome;
      notes: StructuredClinicalNotes;
      prescriptionDraft?: PrescriptionDraft;
      selectedRubrics: SelectedRubric[];
      selectedRemedy: ConsultationRemedySelection | null;
      accumulatedActiveSeconds: number;
    };
    if (
      !body.consultationId ||
      !body.patientId ||
      !body.outcome ||
      !body.notes ||
      !Array.isArray(body.selectedRubrics) ||
      !Number.isInteger(body.recordVersion)
    ) {
      return NextResponse.json({ error: "Invalid consultation completion payload" }, { status: 400 });
    }
    if (!(await canAccessClinicalPatient(session, body.patientId))) return forbiddenApiResponse();

    const currentSnapshotHash = computeInputSnapshotHash(
      body.selectedRubrics,
      body.notes.thermalState === "hot"
        ? "warm"
        : body.notes.thermalState === "chilly"
          ? "chilly"
          : "ambithermal",
      body.notes.miasmaticExpression
    );
    const requiresSelectedRemedy = body.outcome === "prescription_issued";
    const prescriptionRemedyMatchesSelection =
      body.selectedRemedy?.remedyName === body.prescriptionDraft?.selectedRemedyName;
    const isAnalysisStale = requiresSelectedRemedy
      ? !body.selectedRemedy ||
        !prescriptionRemedyMatchesSelection ||
        body.selectedRemedy.analysisSnapshotHash !== currentSnapshotHash ||
        body.prescriptionDraft?.sourceAnalysisSnapshotHash !== currentSnapshotHash
      : Boolean(body.selectedRemedy && body.selectedRemedy.analysisSnapshotHash !== currentSnapshotHash);
    const readiness = evaluateGuardedCompletionReadiness({
      notes: body.notes,
      outcome: body.outcome,
      prescriptionDraft: body.prescriptionDraft || {},
      isAnalysisStale,
    });
    if (!readiness.ready) {
      return NextResponse.json(
        {
          error: "Consultation is not ready for completion",
          details: [
            ...readiness.clinicalValidationErrors,
            ...readiness.prescriptionValidationErrors,
            ...(readiness.staleRemedyAnalysis ? ["Selected remedy analysis is stale."] : []),
          ],
        },
        { status: 422 }
      );
    }

    const consent = await resolveTelemedicineConsent(body.patientId);
    const workspace = await completeWorkspace({
      expectedVersion: body.recordVersion,
      actorId: session.uid,
      consent,
      draft: {
        id: body.consultationId,
        patientId: body.patientId,
        lifecycleStatus: "active",
        outcome: body.outcome,
        notes: body.notes,
        selectedRubrics: body.selectedRubrics,
        selectedRemedy: body.selectedRemedy,
        prescriptionDraft: body.prescriptionDraft || {},
        accumulatedActiveSeconds: body.accumulatedActiveSeconds || 0,
      },
    });
    return NextResponse.json({
      success: true,
      lifecycleStatus: workspace.lifecycleStatus,
      outcome: workspace.outcome,
      recordVersion: workspace.recordVersion,
      completedAt: workspace.completedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to complete consultation";
    const status = message === "CONSULTATION_VERSION_CONFLICT" ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
