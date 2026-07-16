import { ConsentRepository } from "../../consent/repositories/consentRepository";
import { PatientConsent } from "../../consent/domain/consent.types";
import { getAdminDb } from "@/lib/firebaseAdmin";

export class FirestoreConsentRepository implements ConsentRepository {
  async create(consent: PatientConsent): Promise<PatientConsent> {
    throw new Error("Write operations not permitted through the AI consent-verification port.");
  }
  
  async update(consent: PatientConsent): Promise<PatientConsent> {
    throw new Error("Write operations not permitted through the AI consent-verification port.");
  }
  
  async findById(id: string): Promise<PatientConsent | null> {
    throw new Error("Read by ID operations not permitted through the AI consent-verification port.");
  }
  
  async findByPatientId(patientId: string): Promise<PatientConsent[]> {
    throw new Error("List operations not permitted through the AI consent-verification port.");
  }

  async findLatestActive(patientId: string, consentType: string): Promise<PatientConsent | null> {
    const db = getAdminDb();
    const snap = await db.collection("consents")
      .where("patientId", "==", patientId)
      .where("consentType", "==", consentType)
      .get();
    
    if (snap.empty) return null;
    
    const consents = snap.docs.map((doc: any) => doc.data() as PatientConsent);
    
    // Deterministic sort: latest by effectiveDate/createdAt, fallback to recordVersion
    consents.sort((a: PatientConsent, b: PatientConsent) => {
      const dateA = new Date(a.effectiveDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.effectiveDate || b.createdAt || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.recordVersion || 0) - (a.recordVersion || 0);
    });

    const latest = consents[0];
    if (!latest) return null;

    return latest;
  }
}

export type ConsentVerificationResult =
  | { allowed: true }
  | { allowed: false; reason: "missing" | "withdrawn" | "expired" | "malformed" | "unavailable" };

export class FirestoreConsentAdapter {
  constructor(private readonly repo: ConsentRepository = new FirestoreConsentRepository()) {}

  async verifyAiProcessingConsent(patientId: string): Promise<ConsentVerificationResult> {
    try {
      const latest = await this.repo.findLatestActive(patientId, "ai_processing");
      if (!latest) {
        return { allowed: false, reason: "missing" };
      }

      // Malformed check: critical fields missing
      if (!latest.patientId || latest.granted === undefined || !latest.organizationId) {
        return { allowed: false, reason: "malformed" };
      }

      // Withdrawn check
      if (!latest.granted || (latest as any).withdrawnAt) {
        return { allowed: false, reason: "withdrawn" };
      }

      // Expired check
      if ((latest as any).expiryDate) {
        const expiry = new Date((latest as any).expiryDate).getTime();
        if (expiry <= Date.now()) {
          return { allowed: false, reason: "expired" };
        }
      }

      return { allowed: true };
    } catch (err) {
      return { allowed: false, reason: "unavailable" };
    }
  }
}
