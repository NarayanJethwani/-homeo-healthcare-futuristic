import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type { PatientConsent } from "@/features/consent/domain/consent.types";
import type { TranscriptionConsent } from "../types/telemedicine.types";

function latest(records: PatientConsent[]) {
  return records.sort((a, b) =>
    (b.effectiveDate || b.createdAt).localeCompare(a.effectiveDate || a.createdAt)
  )[0];
}

export async function resolveTelemedicineConsent(
  patientId: string
): Promise<TranscriptionConsent> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection("consents")
      .where("patientId", "==", patientId)
      .get();
    const records: PatientConsent[] = snapshot.docs.map(
      (document: any) => document.data() as PatientConsent
    );
    const telemedicine = latest(records.filter((record) => record.consentType === "telemedicine"));
    const aiProcessing = latest(records.filter((record) => record.consentType === "ai_processing"));
    const now = Date.now();
    const active = (record?: PatientConsent) =>
      Boolean(
        record?.granted &&
          !record.withdrawnAt &&
          (!record.expiryDate || new Date(record.expiryDate).getTime() > now)
      );
    if (!active(telemedicine) || !active(aiProcessing)) {
      return {
        status: telemedicine?.withdrawnAt || aiProcessing?.withdrawnAt ? "revoked" : "not_granted",
      };
    }
    return {
      status: "granted",
      recordedAt: [telemedicine.effectiveDate, aiProcessing.effectiveDate].sort().at(-1),
      recordedBy: telemedicine.capturedBy,
      policyVersion: `${telemedicine.policyVersion}|${aiProcessing.policyVersion}`,
    };
  } catch {
    return { status: "unknown" };
  }
}
