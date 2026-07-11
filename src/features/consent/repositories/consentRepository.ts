import { PatientConsent } from "../domain/consent.types";

export interface ConsentRepository {
  create(consent: PatientConsent): Promise<PatientConsent>;
  update(consent: PatientConsent): Promise<PatientConsent>;
  findById(id: string): Promise<PatientConsent | null>;
  findByPatientId(patientId: string): Promise<PatientConsent[]>;
  findLatestActive(patientId: string, consentType: string): Promise<PatientConsent | null>;
}

/**
 * DEVELOPMENT ONLY - Synthetic In-Memory Consent Repository
 */
export class MockConsentRepository implements ConsentRepository {
  private store = new Map<string, PatientConsent>();

  async create(consent: PatientConsent): Promise<PatientConsent> {
    if (this.store.has(consent.id)) {
      throw new Error(`Consent record with ID ${consent.id} already exists`);
    }
    this.store.set(consent.id, consent);
    return consent;
  }

  async update(consent: PatientConsent): Promise<PatientConsent> {
    if (!this.store.has(consent.id)) {
      throw new Error(`Consent record with ID ${consent.id} does not exist`);
    }
    this.store.set(consent.id, consent);
    return consent;
  }

  async findById(id: string): Promise<PatientConsent | null> {
    return this.store.get(id) || null;
  }

  async findByPatientId(patientId: string): Promise<PatientConsent[]> {
    return Array.from(this.store.values()).filter(c => c.patientId === patientId);
  }

  async findLatestActive(patientId: string, consentType: string): Promise<PatientConsent | null> {
    const matching = Array.from(this.store.values())
      .filter(c => c.patientId === patientId && c.consentType === consentType)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.recordVersion - a.recordVersion);
    return matching[0] || null;
  }
}
