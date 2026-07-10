import { getAdminDb } from "@/lib/firebaseAdmin";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { 
  getAttachmentById, 
  getExtractedLabParameters, 
  updateLabParameterReviewStatus 
} from "@/features/patient-attachments/attachmentRepository";
import { normalizeLabParameterName, classifyLabFlag } from "@/features/patient-attachments/labExtraction";
import { ReviewedLabResult, PatientLabTimelineEntry } from "./types";

export const memoryReviewedLabResults: ReviewedLabResult[] = [];

function isFirebaseAvailable(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id"
  );
}

async function verifyParameterAndAttachment(
  patientId: string, 
  attachmentId: string, 
  parameterId: string
) {
  // 1. Get attachment metadata
  const attachment = await getAttachmentById(attachmentId);
  if (!attachment) {
    throw new Error("Attachment not found.");
  }
  if (attachment.patientId !== patientId) {
    throw new Error("Access forbidden: patient scope mismatch.");
  }
  if (attachment.status === "deleted" || attachment.status === "archived") {
    throw new Error("Access forbidden: cannot review parameters of archived or deleted attachments.");
  }

  // 2. Get extracted lab parameters
  const parameters = await getExtractedLabParameters(patientId, attachmentId);
  const parameter = parameters.find(p => p.id === parameterId);
  if (!parameter) {
    throw new Error("Parameter not found or does not belong to this attachment.");
  }

  return { attachment, parameter };
}

export async function confirmExtractedLabParameter(
  patientId: string, 
  attachmentId: string, 
  parameterId: string, 
  actorId: string
): Promise<ReviewedLabResult> {
  const { parameter } = await verifyParameterAndAttachment(patientId, attachmentId, parameterId);

  // Update original extracted parameter status
  await updateLabParameterReviewStatus(parameterId, "clinician-confirmed", undefined, actorId);

  const nowStr = new Date().toISOString();
  const flag = classifyLabFlag(parameter.value, parameter.referenceRange);
  const normalizedTestName = normalizeLabParameterName(parameter.testName);

  const result: ReviewedLabResult = {
    id: `rev_${parameterId}`,
    patientId,
    attachmentId,
    sourceParameterId: parameterId,
    testName: parameter.testName,
    normalizedTestName,
    value: parameter.value,
    numericValue: parseFloat(parameter.value) || undefined,
    unit: parameter.unit,
    referenceRange: parameter.referenceRange,
    flag,
    reviewStatus: "clinician-confirmed",
    confirmedBy: actorId,
    confirmedAt: nowStr,
    createdAt: nowStr,
    updatedAt: nowStr
  };

  // Persist ReviewedLabResult
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("reviewed_lab_results").doc(result.id).set(result);
    } catch {
      console.warn("[Lab Repo] Firestore save failed, saving to memory.");
      const idx = memoryReviewedLabResults.findIndex(r => r.id === result.id);
      if (idx > -1) memoryReviewedLabResults[idx] = result;
      else memoryReviewedLabResults.push(result);
    }
  } else {
    const idx = memoryReviewedLabResults.findIndex(r => r.id === result.id);
    if (idx > -1) memoryReviewedLabResults[idx] = result;
    else memoryReviewedLabResults.push(result);
  }

  // Audit event logs
  await logSecurityEvent({
    userId: actorId,
    userEmail: "clinician@homeo.healthcare",
    userRole: "doctor",
    action: "lab_parameter_confirmed",
    resource: `/api/patients/${patientId}/labs/review`,
    status: "success",
    timestamp: nowStr,
    details: { attachmentId, parameterId, reviewStatus: "clinician-confirmed" }
  });

  return result;
}

export async function correctExtractedLabParameter(
  patientId: string, 
  attachmentId: string, 
  parameterId: string, 
  correction: { value: string; unit?: string; flag?: "low" | "normal" | "high" | "critical" | "unknown" }, 
  actorId: string
): Promise<ReviewedLabResult> {
  const { parameter } = await verifyParameterAndAttachment(patientId, attachmentId, parameterId);
  const originalExtractedValue = parameter.originalValue || parameter.value;

  // Update status on the extracted parameter
  await updateLabParameterReviewStatus(parameterId, "corrected", correction, actorId);

  const nowStr = new Date().toISOString();
  const value = correction.value;
  const unit = correction.unit !== undefined ? correction.unit : parameter.unit;
  const flag = correction.flag || classifyLabFlag(value, parameter.referenceRange);
  const normalizedTestName = normalizeLabParameterName(parameter.testName);

  const result: ReviewedLabResult = {
    id: `rev_${parameterId}`,
    patientId,
    attachmentId,
    sourceParameterId: parameterId,
    testName: parameter.testName,
    normalizedTestName,
    value,
    numericValue: parseFloat(value) || undefined,
    unit,
    referenceRange: parameter.referenceRange,
    flag,
    reviewStatus: "corrected",
    originalExtractedValue,
    correctedValue: value,
    confirmedBy: actorId,
    confirmedAt: nowStr,
    createdAt: nowStr,
    updatedAt: nowStr
  };

  // Persist ReviewedLabResult
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("reviewed_lab_results").doc(result.id).set(result);
    } catch {
      console.warn("[Lab Repo] Firestore save failed, saving to memory.");
      const idx = memoryReviewedLabResults.findIndex(r => r.id === result.id);
      if (idx > -1) memoryReviewedLabResults[idx] = result;
      else memoryReviewedLabResults.push(result);
    }
  } else {
    const idx = memoryReviewedLabResults.findIndex(r => r.id === result.id);
    if (idx > -1) memoryReviewedLabResults[idx] = result;
    else memoryReviewedLabResults.push(result);
  }

  // Audit event logs
  await logSecurityEvent({
    userId: actorId,
    userEmail: "clinician@homeo.healthcare",
    userRole: "doctor",
    action: "lab_parameter_corrected",
    resource: `/api/patients/${patientId}/labs/review`,
    status: "success",
    timestamp: nowStr,
    details: { attachmentId, parameterId, reviewStatus: "corrected" }
  });

  return result;
}

export async function rejectExtractedLabParameter(
  patientId: string, 
  attachmentId: string, 
  parameterId: string, 
  reason: string, 
  actorId: string
): Promise<ReviewedLabResult> {
  const { parameter } = await verifyParameterAndAttachment(patientId, attachmentId, parameterId);

  // Update status on the extracted parameter
  await updateLabParameterReviewStatus(parameterId, "rejected", undefined, actorId);

  const nowStr = new Date().toISOString();
  const normalizedTestName = normalizeLabParameterName(parameter.testName);

  const result: ReviewedLabResult = {
    id: `rev_${parameterId}`,
    patientId,
    attachmentId,
    sourceParameterId: parameterId,
    testName: parameter.testName,
    normalizedTestName,
    value: parameter.value,
    numericValue: parseFloat(parameter.value) || undefined,
    unit: parameter.unit,
    referenceRange: parameter.referenceRange,
    flag: classifyLabFlag(parameter.value, parameter.referenceRange),
    reviewStatus: "rejected",
    confirmedBy: actorId,
    confirmedAt: nowStr,
    createdAt: nowStr,
    updatedAt: nowStr
  };

  // Persist ReviewedLabResult
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("reviewed_lab_results").doc(result.id).set(result);
    } catch {
      console.warn("[Lab Repo] Firestore save failed, saving to memory.");
      const idx = memoryReviewedLabResults.findIndex(r => r.id === result.id);
      if (idx > -1) memoryReviewedLabResults[idx] = result;
      else memoryReviewedLabResults.push(result);
    }
  } else {
    const idx = memoryReviewedLabResults.findIndex(r => r.id === result.id);
    if (idx > -1) memoryReviewedLabResults[idx] = result;
    else memoryReviewedLabResults.push(result);
  }

  // Audit event logs
  await logSecurityEvent({
    userId: actorId,
    userEmail: "clinician@homeo.healthcare",
    userRole: "doctor",
    action: "lab_parameter_rejected",
    resource: `/api/patients/${patientId}/labs/review`,
    status: "success",
    timestamp: nowStr,
    details: { attachmentId, parameterId, reviewStatus: "rejected", reason }
  });

  return result;
}

export async function getReviewedLabsForPatient(patientId: string): Promise<ReviewedLabResult[]> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("reviewed_lab_results")
        .where("patientId", "==", patientId)
        .get();
      return snap.docs.map(doc => doc.data() as ReviewedLabResult);
    } catch {
      console.warn("[Lab Repo] Firestore read failed, reading from memory.");
    }
  }
  return memoryReviewedLabResults.filter(r => r.patientId === patientId);
}

export async function getLabTimeline(
  patientId: string, 
  testName?: string
): Promise<PatientLabTimelineEntry[]> {
  const results = await getReviewedLabsForPatient(patientId);

  // Filter only confirmed or corrected
  let filtered = results.filter(
    r => r.reviewStatus === "clinician-confirmed" || r.reviewStatus === "corrected"
  );

  // Filter by testName if specified (case insensitive matching on either original or normalized)
  if (testName) {
    const search = testName.trim().toLowerCase();
    filtered = filtered.filter(
      r => r.testName.toLowerCase().includes(search) || 
           r.normalizedTestName.toLowerCase().includes(search)
    );
  }

  // Map to PatientLabTimelineEntry
  const entries: PatientLabTimelineEntry[] = filtered.map(r => ({
    id: r.id,
    patientId: r.patientId,
    testName: r.testName,
    value: r.value,
    numericValue: r.numericValue,
    unit: r.unit,
    flag: r.flag,
    date: r.confirmedAt, // V2.13 timeline date rule
    sourceAttachmentId: r.attachmentId,
    reviewStatus: r.reviewStatus
  }));

  // Sort descending by date (latest first)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getLatestReviewedLabSummary(
  patientId: string
): Promise<{ summary: ReviewedLabResult[]; abnormal: ReviewedLabResult[] }> {
  const results = await getReviewedLabsForPatient(patientId);

  // Filter only confirmed or corrected
  const active = results.filter(
    r => r.reviewStatus === "clinician-confirmed" || r.reviewStatus === "corrected"
  );

  // Group by normalizedTestName to find latest one
  const map: Record<string, ReviewedLabResult> = {};
  for (const r of active) {
    const existing = map[r.normalizedTestName];
    if (!existing || new Date(r.confirmedAt).getTime() > new Date(existing.confirmedAt).getTime()) {
      map[r.normalizedTestName] = r;
    }
  }

  const summary = Object.values(map);

  // Find abnormal ones among all active validated lab results
  const abnormal = active.filter(
    r => r.flag === "low" || r.flag === "high" || r.flag === "critical"
  );

  return { summary, abnormal };
}

export async function getAbnormalReviewedLabs(patientId: string): Promise<ReviewedLabResult[]> {
  const results = await getReviewedLabsForPatient(patientId);
  return results.filter(
    r => (r.reviewStatus === "clinician-confirmed" || r.reviewStatus === "corrected") &&
         (r.flag === "low" || r.flag === "high" || r.flag === "critical")
  );
}
