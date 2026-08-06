import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { clinicalDocumentRepository, auditRepository } from "@/features/consultation/repositories/consultationRepositories";

export async function GET(req: NextRequest) {
  const session = await requireAdminApiSession(req);
  if (!session || !session.uid || !session.role) {
    return unauthorizedApiResponse();
  }

  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return NextResponse.json({ error: "documentId parameter is required" }, { status: 400 });
  }

  try {
    const docEntry = await clinicalDocumentRepository.getDocument(documentId);

    // Non-enumerating 404 response on missing or corrupt document
    if (!docEntry || docEntry.record.status !== "available") {
      await auditRepository.logAuditEvent({
        id: `audit_evt_${randomUUID()}`,
        consultationId: "unknown",
        patientId: "unknown",
        actorId: session.uid,
        actorRole: session.role,
        eventType: "prescription_document_access_denied",
        occurredAt: new Date().toISOString(),
        metadata: { documentId, reason: "document_not_found_or_quarantined" },
      });
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await auditRepository.logAuditEvent({
      id: `audit_evt_${randomUUID()}`,
      consultationId: docEntry.record.consultationId,
      patientId: docEntry.record.patientId,
      actorId: session.uid,
      actorRole: session.role,
      eventType: "prescription_document_retrieved",
      occurredAt: new Date().toISOString(),
      metadata: {
        documentId: docEntry.record.id,
        prescriptionId: docEntry.record.prescriptionId,
        checksum: docEntry.record.checksum,
      },
    });

    const pdfBuffer = docEntry.bytes.buffer.slice(docEntry.bytes.byteOffset, docEntry.bytes.byteOffset + docEntry.bytes.byteLength) as ArrayBuffer;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="prescription-${docEntry.record.prescriptionId}.pdf"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    await auditRepository.logAuditEvent({
      id: `audit_evt_${randomUUID()}`,
      consultationId: "unknown",
      patientId: "unknown",
      actorId: session.uid,
      actorRole: session.role,
      eventType: "prescription_document_integrity_failed",
      occurredAt: new Date().toISOString(),
      metadata: { documentId, error: err instanceof Error ? err.message : "Integrity error" },
    });
    return NextResponse.json({ error: "Document verification error" }, { status: 500 });
  }
}
