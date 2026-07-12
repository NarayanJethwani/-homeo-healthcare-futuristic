import { getAdminDb } from "@/lib/firebaseAdmin";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { PatientAttachment, AttachmentStatus, ExtractedLabParameter } from "./types";

// In-memory repositories for local development and testing
export const memoryPatientAttachments: PatientAttachment[] = [];
export const memoryExtractedLabParameters: ExtractedLabParameter[] = [];

function isFirebaseAvailable(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id"
  );
}

export async function createAttachmentMetadata(attachment: PatientAttachment): Promise<PatientAttachment> {
  if (!attachment.patientId) throw new Error("Metadata check failed: patientId is required.");
  if (!attachment.uploadedBy) throw new Error("Metadata check failed: uploadedBy is required.");
  if (!attachment.mimeType) throw new Error("Metadata check failed: mimeType is required.");
  if (attachment.sizeBytes === undefined || attachment.sizeBytes === null) {
    throw new Error("Metadata check failed: sizeBytes is required.");
  }

  const nowStr = new Date().toISOString();
  const updatedAttachment = {
    ...attachment,
    createdAt: attachment.createdAt || nowStr,
    updatedAt: nowStr
  };

  if (isFirebaseAvailable()) {
    const db = getAdminDb();
    await db.collection("patient_attachments").doc(attachment.id).set(updatedAttachment);
  } else {
    const idx = memoryPatientAttachments.findIndex(a => a.id === attachment.id);
    if (idx > -1) memoryPatientAttachments[idx] = updatedAttachment;
    else memoryPatientAttachments.push(updatedAttachment);
  }

  await logSecurityEvent({
    userId: attachment.uploadedBy,
    userEmail: "clinician@homeo.healthcare",
    userRole: "doctor",
    action: "attachment_uploaded",
    resource: `/api/patients/${attachment.patientId}/attachments/${attachment.id}`,
    status: "success",
    timestamp: nowStr,
    details: { attachmentId: attachment.id, patientId: attachment.patientId }
  });

  return updatedAttachment;
}

export async function getPatientAttachments(patientId: string, includeArchived = false): Promise<PatientAttachment[]> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("patient_attachments")
        .where("patientId", "==", patientId)
        .get();
      return snap.docs.map((doc: any) => doc.data() as PatientAttachment)
        .filter((att: any) => {
          if (att.status === "deleted") return false;
          if (att.status === "archived" && !includeArchived) return false;
          return true;
        });
    } catch {
      console.warn("[Attachment Repo] Firestore query failed, reading from memory.");
    }
  }
  return memoryPatientAttachments.filter(att => {
    if (att.patientId !== patientId) return false;
    if (att.status === "deleted") return false;
    if (att.status === "archived" && !includeArchived) return false;
    return true;
  });
}

export async function getAttachmentById(attachmentId: string): Promise<PatientAttachment | null> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const docSnap = await db.collection("patient_attachments").doc(attachmentId).get();
      if (docSnap.exists) {
        return docSnap.data() as PatientAttachment;
      }
      return null;
    } catch {
      console.warn("[Attachment Repo] Firestore doc load failed, checking memory.");
    }
  }
  return memoryPatientAttachments.find(att => att.id === attachmentId) || null;
}

export async function updateAttachmentStatus(attachmentId: string, status: AttachmentStatus): Promise<PatientAttachment> {
  const attachment = await getAttachmentById(attachmentId);
  if (!attachment) {
    throw new Error("Attachment not found.");
  }

  // State transition validation
  if (attachment.status === "deleted" && status !== "deleted") {
    throw new Error("Invalid status transition: cannot modify a deleted attachment.");
  }
  if (attachment.status === "archived" && (status === "processing" || status === "processed")) {
    throw new Error("Invalid status transition: cannot process an archived attachment.");
  }

  const nowStr = new Date().toISOString();
  attachment.status = status;
  attachment.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("patient_attachments").doc(attachmentId).update({
        status,
        updatedAt: nowStr
      });
    } catch {
      console.warn("[Attachment Repo] Firestore update status failed.");
    }
  }

  return attachment;
}

export async function archiveAttachment(attachmentId: string, reason?: string, actorId = "system"): Promise<PatientAttachment> {
  const attachment = await getAttachmentById(attachmentId);
  if (!attachment) {
    throw new Error("Attachment not found.");
  }

  // State transition validation
  if (attachment.status === "deleted") {
    throw new Error("Invalid status transition: cannot archive a deleted attachment.");
  }

  const nowStr = new Date().toISOString();
  attachment.status = "archived";
  attachment.archivedAt = nowStr;
  attachment.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    const db = getAdminDb();
    await db.collection("patient_attachments").doc(attachmentId).update({
      status: "archived",
      archivedAt: nowStr,
      updatedAt: nowStr
    });
  }

  await logSecurityEvent({
    userId: actorId,
    userEmail: "clinician@homeo.healthcare",
    userRole: "doctor",
    action: "attachment_archived",
    resource: `/api/patients/${attachment.patientId}/attachments/${attachmentId}`,
    status: "success",
    timestamp: nowStr,
    details: { attachmentId, reason }
  });

  return attachment;
}

export async function deleteAttachmentMetadata(attachmentId: string, reason?: string, actorId = "system"): Promise<PatientAttachment> {
  const attachment = await getAttachmentById(attachmentId);
  if (!attachment) {
    throw new Error("Attachment not found.");
  }

  // State transition validation
  if (attachment.status === "deleted") {
    throw new Error("Attachment is already deleted.");
  }

  const nowStr = new Date().toISOString();
  attachment.status = "deleted";
  attachment.deletedAt = nowStr;
  attachment.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    const db = getAdminDb();
    await db.collection("patient_attachments").doc(attachmentId).update({
      status: "deleted",
      deletedAt: nowStr,
      updatedAt: nowStr
    });
  }

  await logSecurityEvent({
    userId: actorId,
    userEmail: "clinician@homeo.healthcare",
    userRole: "doctor",
    action: "attachment_deleted",
    resource: `/api/patients/${attachment.patientId}/attachments/${attachmentId}`,
    status: "success",
    timestamp: nowStr,
    details: { attachmentId, reason }
  });

  return attachment;
}

export async function createExtractedLabParameters(attachmentId: string, parameters: ExtractedLabParameter[]): Promise<ExtractedLabParameter[]> {
  const nowStr = new Date().toISOString();
  const updatedParameters = parameters.map(p => ({
    ...p,
    createdAt: p.createdAt || nowStr,
    updatedAt: nowStr
  }));

  if (isFirebaseAvailable()) {
    const db = getAdminDb();
    const batch = db.batch();
    for (const param of updatedParameters) {
      batch.set(db.collection("extracted_lab_parameters").doc(param.id), param);
    }
    await batch.commit();
  } else {
    for (const param of updatedParameters) {
      const idx = memoryExtractedLabParameters.findIndex(p => p.id === param.id);
      if (idx > -1) memoryExtractedLabParameters[idx] = param;
      else memoryExtractedLabParameters.push(param);
    }
  }

  return updatedParameters;
}

export async function getExtractedLabParameters(patientId: string, attachmentId?: string): Promise<ExtractedLabParameter[]> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      let query = db.collection("extracted_lab_parameters")
        .where("patientId", "==", patientId);
      if (attachmentId) {
        query = query.where("attachmentId", "==", attachmentId);
      }
      const snap = await query.get();
      return snap.docs.map((doc: any) => doc.data() as ExtractedLabParameter);
    } catch {
      console.warn("[Attachment Repo] Firestore load lab parameters failed, checking memory.");
    }
  }

  return memoryExtractedLabParameters.filter(p => {
    const matchesPatient = p.patientId === patientId;
    const matchesAttachment = attachmentId ? p.attachmentId === attachmentId : true;
    return matchesPatient && matchesAttachment;
  });
}

export async function updateLabParameterReviewStatus(
  parameterId: string,
  status: "pending-review" | "clinician-confirmed" | "corrected" | "rejected",
  correction?: Partial<ExtractedLabParameter>,
  actorId = "system"
): Promise<ExtractedLabParameter> {
  let parameter: ExtractedLabParameter | undefined;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const docSnap = await db.collection("extracted_lab_parameters").doc(parameterId).get();
      if (docSnap.exists) {
        parameter = docSnap.data() as ExtractedLabParameter;
      }
    } catch {
      console.warn("[Attachment Repo] Firestore read parameter failed.");
    }
  }

  if (!parameter) {
    parameter = memoryExtractedLabParameters.find(p => p.id === parameterId);
  }

  if (!parameter) {
    throw new Error("Extracted lab parameter not found.");
  }

  const nowStr = new Date().toISOString();
  parameter.reviewStatus = status;
  parameter.updatedAt = nowStr;

  if (status === "corrected" && correction) {
    if (parameter.originalValue === undefined) {
      parameter.originalValue = parameter.value;
    }
    if (parameter.originalUnit === undefined) {
      parameter.originalUnit = parameter.unit;
    }
    if (parameter.originalFlag === undefined) {
      parameter.originalFlag = parameter.flag;
    }
    Object.assign(parameter, correction);
  } else if (correction) {
    Object.assign(parameter, correction);
  }

  if (isFirebaseAvailable()) {
    const db = getAdminDb();
    await db.collection("extracted_lab_parameters").doc(parameterId).set(parameter);
  }

  // Audit event logs
  await logSecurityEvent({
    userId: actorId,
    userEmail: "clinician@homeo.healthcare",
    userRole: "doctor",
    action: status === "corrected" ? "lab_parameter_corrected" : "lab_parameter_confirmed",
    resource: `/api/patients/${parameter.patientId}/attachments/${parameter.attachmentId}/labs/${parameterId}`,
    status: "success",
    timestamp: nowStr,
    details: { parameterId, reviewStatus: status }
  });

  return parameter;
}
