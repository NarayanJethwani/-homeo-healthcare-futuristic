import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { StructuredClinicalNotes } from "@/features/consultation/types/clinical-notes.types";
import { ConsultationLifecycleStatus } from "@/features/consultation/domain/consultation.types";

export interface AppendTranscriptRequest {
  patientId: string;
  consultationId: string;
  excerptText: string;
  speaker?: "patient" | "clinician";
  consentStatus?: "granted" | "not_granted" | "revoked" | "unknown";
  lifecycleStatus?: ConsultationLifecycleStatus;
  currentNotes: StructuredClinicalNotes;
}

export interface AppendTranscriptResponse {
  success: boolean;
  notes: StructuredClinicalNotes;
  auditEvent: {
    id: string;
    consultationId: string;
    patientId: string;
    actorId: string;
    actorRole: string;
    eventType: "transcript_excerpt_accepted";
    occurredAt: string;
    metadata: {
      excerptLength: number;
      speaker?: string;
    };
  };
}

export async function POST(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session) return unauthorizedApiResponse();

  try {
    const body: AppendTranscriptRequest = await req.json();

    if (!body.consultationId || !body.patientId || !body.excerptText || !body.excerptText.trim()) {
      return NextResponse.json(
        { error: "Invalid parameters: consultationId, patientId, and non-empty excerptText are required." },
        { status: 400 }
      );
    }

    // Verify patient consent
    if (body.consentStatus !== "granted") {
      return NextResponse.json(
        { error: "Consent error: Patient telemedicine and AI transcription consent must be granted before appending transcript excerpts." },
        { status: 403 }
      );
    }

    // Verify consultation lifecycle state
    if (body.lifecycleStatus === "completed" || body.lifecycleStatus === "cancelled" || body.lifecycleStatus === "archived") {
      return NextResponse.json(
        { error: `Lifecycle error: Cannot append transcript excerpts to a consultation in state '${body.lifecycleStatus}'.` },
        { status: 409 }
      );
    }

    const timestamp = new Date().toISOString();
    const speakerPrefix = body.speaker ? `[Transcript - ${body.speaker.toUpperCase()}]: ` : "[Transcript]: ";
    const formattedExcerpt = `\n${speakerPrefix}${body.excerptText.trim()}`;

    const existingHpi = body.currentNotes?.historyOfPresentIllness || "";
    const updatedNotes: StructuredClinicalNotes = {
      ...body.currentNotes,
      historyOfPresentIllness: `${existingHpi}${formattedExcerpt}`.trim(),
      updatedAt: timestamp,
    };

    if (!session.uid || !session.role) {
      return unauthorizedApiResponse();
    }

    const auditEvent = {
      id: `audit_evt_${randomUUID()}`,
      consultationId: body.consultationId,
      patientId: body.patientId,
      actorId: session.uid,
      actorRole: session.role,
      eventType: "transcript_excerpt_accepted" as const,
      occurredAt: timestamp,
      metadata: {
        excerptLength: body.excerptText.length,
        speaker: body.speaker,
      },
    };

    // Log sanitized metadata (no raw PHI transcript text in logs)
    console.log(`[Audit] transcript_excerpt_accepted logged for consultation=${body.consultationId}, patient=${body.patientId}, length=${body.excerptText.length}`);

    return NextResponse.json({
      success: true,
      notes: updatedNotes,
      auditEvent,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
