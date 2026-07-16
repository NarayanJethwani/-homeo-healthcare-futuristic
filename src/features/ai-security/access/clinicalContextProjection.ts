import { getAdminDb } from "@/lib/firebaseAdmin";
import crypto from "crypto";
import { serverConfig } from "../config/serverConfig";

export type AIClinicalContext = {
  patientAgeBand?: string;
  sexAtBirth?: string;
  activeSymptoms?: string[];
  confirmedConditions?: string[];
  recentAssessmentSummary?: string;
  encounterSummary?: string;
};

/**
 * Injected HMAC helper utilizing a domain-separated label and required secret.
 */
export function keyedHmac(text: string, domain: string, secret: string): string {
  if (!secret) {
    throw new Error("Pseudonymization secret is missing");
  }
  const input = `${domain}:${text}`;
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

/**
 * De-identifies text using pattern-based scrubbing of dates, emails, phones, and ID forms (hyphen/underscore).
 * Note: Arbitrary human names in unstructured text cannot be reliably removed via regular expressions.
 * To prevent leakage, we employ structured field exclusion (strictly omitting patient identity fields like name,
 * phone, email, and address from EMR context queries before compilation) and truncate the remaining notes.
 */
export function scrubClinicalText(text: string): string {
  if (!text) return "";

  // 1. Scrub exact dates (e.g. YYYY-MM-DD, DD/MM/YYYY, DD-MM-YY, DD.MM.YYYY, 15 Jul 2026)
  let clean = text
    .replace(/\b\d{4}[-/.]\d{2}[-/.]\d{2}\b/g, "[DATE]")
    .replace(/\b\d{2}[-/.]\d{2}[-/.]\d{4}\b/g, "[DATE]")
    .replace(/\b\d{2}[-/.]\d{2}[-/.]\d{2}\b/g, "[DATE]")
    .replace(/\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}\b/gi, "[DATE]");

  // 2. Scrub emails
  clean = clean.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[EMAIL]");

  // 3. Scrub phone numbers
  clean = clean.replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[PHONE]");

  // 4. Scrub EMR and session identifiers (e.g. pat-xxx, pat_xxx, enc-xxx, enc_xxx)
  clean = clean.replace(/\b(?:pat|enc|con|usr|doc|session|token|id)[_-][a-zA-Z0-9_-]+\b/gi, "[ID]");
  
  // 5. Scrub hexadecimal identifiers/hashes (20+ hex characters)
  clean = clean.replace(/\b[a-fA-F0-9]{20,}\b/g, "[HASH]");

  // 6. Truncate AFTER scrubbing to avoid slicing inside a replacement tag or identifier
  if (clean.length > 100) {
    clean = clean.substring(0, 100) + "...";
  }

  return clean;
}

export class ClinicalContextProjection {
  static readonly projectionVersion = "v2";

  /**
   * Projects a patient's EMR clinical context within strict tenant boundary checks.
   */
  static async project(patientId: string, organizationId: string, clinicId: string): Promise<AIClinicalContext> {
    const db = getAdminDb();
    const projection: AIClinicalContext = {};

    try {
      // 1. Fetch patient document
      const doc = await db.collection("patients").doc(patientId).get();
      if (!doc.exists) {
        throw new Error("Patient record not found.");
      }

      const data = doc.data();
      if (!data) {
        throw new Error("Patient record has empty contents.");
      }

      // Strict tenant boundaries check
      if (data.organizationId !== organizationId || data.clinicId !== clinicId) {
        throw new Error("Tenant isolation mismatch: Patient does not belong to authorized organization/clinic.");
      }

      const ageNum = parseInt(data.age, 10);
      if (!isNaN(ageNum)) {
        const dec = Math.floor(ageNum / 10) * 10;
        projection.patientAgeBand = `${dec}-${dec + 9}`;
      }
      projection.sexAtBirth = data.gender;
      
      if (data.complaint) {
        projection.activeSymptoms = [scrubClinicalText(data.complaint)];
      }
      if (data.careLevel) {
        projection.confirmedConditions = [scrubClinicalText(data.careLevel)];
      }

      // 2. Fetch latest homeopathic assessment summary (query-level scoped & ordered)
      const assessments = await db
        .collection("homeopathic_assessments")
        .where("patientId", "==", patientId)
        .where("organizationId", "==", organizationId)
        .where("clinicId", "==", clinicId)
        .orderBy("completedAt", "desc")
        .limit(1)
        .get();

      if (!assessments.empty) {
        const assessmentDoc = assessments.docs[0].data();
        if (assessmentDoc) {
          const rawSummary = `Completed on ${assessmentDoc.completedAt || ""}. Severity Score: ${assessmentDoc.score || 0}`;
          projection.recentAssessmentSummary = scrubClinicalText(rawSummary);
        }
      }

      // 3. Fetch latest encounter clinical summary (query-level scoped & ordered)
      const encounters = await db
        .collection("encounters")
        .where("patientId", "==", patientId)
        .where("organizationId", "==", organizationId)
        .where("clinicId", "==", clinicId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (!encounters.empty) {
        const encounterDoc = encounters.docs[0].data();
        if (encounterDoc && encounterDoc.clinicalSummary) {
          projection.encounterSummary = scrubClinicalText(encounterDoc.clinicalSummary);
        }
      }
    } catch (err: any) {
      const secret = serverConfig.CLINICAL_PSEUDONYMIZATION_SECRET;
      const patientHash = keyedHmac(patientId, "patient", secret);
      console.warn(`Clinical projection building failed for patient ${patientHash}:`, err?.message || err);
      throw err;
    }

    return projection;
  }
}
