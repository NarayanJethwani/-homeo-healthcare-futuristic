import { PatientAttachment, ExtractedLabParameter } from "./types";

export async function listPatientAttachments(patientId: string): Promise<PatientAttachment[]> {
  const res = await fetch(`/api/patients/${patientId}/attachments`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to retrieve attachments.");
  }
  const body = await res.json();
  return body.attachments || [];
}

export async function uploadPatientAttachment(
  patientId: string,
  file: File,
  metadata: { type: string; notes?: string }
): Promise<PatientAttachment> {
  // Convert file to base64
  const reader = new FileReader();
  const fileDataPromise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

  const fileData = await fileDataPromise;

  const payload = {
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    fileData,
    type: metadata.type,
    notes: metadata.notes
  };

  const res = await fetch(`/api/patients/${patientId}/attachments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to upload attachment.");
  }

  const body = await res.json();
  return body.attachment;
}

export async function getAttachmentMetadata(patientId: string, attachmentId: string): Promise<PatientAttachment> {
  const res = await fetch(`/api/patients/${patientId}/attachments/${attachmentId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to retrieve attachment metadata.");
  }
  const body = await res.json();
  return body.attachment;
}

export async function downloadAttachment(patientId: string, attachmentId: string): Promise<{ downloadUrl: string }> {
  const res = await fetch(`/api/patients/${patientId}/attachments/${attachmentId}/download`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to retrieve signed download URL.");
  }
  return await res.json();
}

export async function archiveAttachment(patientId: string, attachmentId: string, reason: string): Promise<PatientAttachment> {
  const res = await fetch(`/api/patients/${patientId}/attachments/${attachmentId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to archive attachment.");
  }

  const body = await res.json();
  return body.attachment;
}

export async function extractLabs(patientId: string, attachmentId: string): Promise<ExtractedLabParameter[]> {
  const res = await fetch(`/api/patients/${patientId}/attachments/${attachmentId}/extract-labs`, {
    method: "POST"
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to extract lab parameters.");
  }

  const body = await res.json();
  return body.parameters || [];
}

export async function listLabParameters(patientId: string, attachmentId: string): Promise<ExtractedLabParameter[]> {
  const res = await fetch(`/api/patients/${patientId}/attachments/${attachmentId}/lab-parameters`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to retrieve lab parameters.");
  }
  const body = await res.json();
  return body.parameters || [];
}

export async function updateLabParameterReviewStatus(
  patientId: string,
  attachmentId: string,
  parameterId: string,
  status: "pending-review" | "clinician-confirmed" | "corrected" | "rejected",
  correction?: Partial<ExtractedLabParameter>
): Promise<ExtractedLabParameter> {
  const res = await fetch(`/api/patients/${patientId}/attachments/${attachmentId}/lab-parameters`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parameterId, status, correction })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to update parameter status.");
  }

  const body = await res.json();
  return body.parameter;
}
