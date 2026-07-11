import { validatePayload } from "../../../shared/validation/helpers";
import { PatientConsentSchema } from "../schemas/consent.schema";
import { PatientConsent, ConsentType, CaptureMethod } from "../domain/consent.types";
import { ConsentRepository } from "../repositories/consentRepository";
import { DomainEventDispatcher } from "../../../shared/events/eventDispatcher";
import { ConflictError } from "../../../shared/errors/domainErrors";

export class ConsentService {
  constructor(private readonly consentRepo: ConsentRepository) {}

  async recordConsent(params: {
    organizationId: string;
    patientId: string;
    consentType: ConsentType;
    granted: boolean;
    policyVersion: string;
    language: string;
    capturedBy: string;
    captureMethod: CaptureMethod;
    documentReferenceUrl?: string;
    auditMetadata?: { ipAddress?: string; userAgent?: string };
  }): Promise<PatientConsent> {
    const id = `con_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();

    const currentActive = await this.consentRepo.findLatestActive(params.patientId, params.consentType);

    // If attempting to record consent, but there's a conflict check
    if (currentActive && currentActive.recordVersion > 0 && !params.granted && currentActive.granted) {
      // Withdrawing consent: this is always allowed and overrides
    }

    const rawConsent: PatientConsent = {
      id,
      organizationId: params.organizationId,
      schemaVersion: 1,
      recordVersion: currentActive ? currentActive.recordVersion + 1 : 0,
      createdAt: now,
      createdBy: params.capturedBy,
      updatedAt: now,
      updatedBy: params.capturedBy,
      patientId: params.patientId,
      consentType: params.consentType,
      granted: params.granted,
      policyVersion: params.policyVersion,
      language: params.language,
      capturedBy: params.capturedBy,
      captureMethod: params.captureMethod,
      documentReferenceUrl: params.documentReferenceUrl,
      auditMetadata: params.auditMetadata || {},
      effectiveDate: now
    };

    const validated = validatePayload(PatientConsentSchema, rawConsent);
    const saved = await this.consentRepo.create(validated as PatientConsent);

    await DomainEventDispatcher.dispatch({
      eventType: params.granted ? "consent.granted" : "consent.withdrawn",
      timestamp: now,
      payload: { consentId: saved.id, patientId: saved.patientId, consentType: saved.consentType }
    });

    return saved;
  }

  /**
   * Safe conflict resolution policy:
   * 1. Prefer the most restrictive valid state (granted: false).
   * 2. Never auto-revive consent.
   */
  async resolveConsentConflict(local: PatientConsent, server: PatientConsent): Promise<PatientConsent> {
    const now = new Date().toISOString();
    // Safety critical: If either is false, we MUST set it to false
    const finalGranted = local.granted && server.granted;

    if (!finalGranted && (local.granted || server.granted)) {
      console.warn(`Consent conflict detected: resolving to most restrictive state (withdrawn)`);
    }

    const resolved: PatientConsent = {
      ...server,
      recordVersion: Math.max(local.recordVersion, server.recordVersion) + 1,
      granted: finalGranted,
      updatedAt: now,
      updatedBy: "system_conflict_resolver",
      notes: "Resolved via restrictive override conflict policy"
    };

    return resolved;
  }

  async verifyConsent(patientId: string, consentType: ConsentType): Promise<boolean> {
    const active = await this.consentRepo.findLatestActive(patientId, consentType);
    if (!active) return false;
    return active.granted && (!active.withdrawnAt);
  }
}
