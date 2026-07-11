import { Patient } from "../domain/patient.types";

export interface PatientRepository {
  create(patient: Patient): Promise<Patient>;
  update(patient: Patient): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  findByUhid(uhid: string): Promise<Patient | null>;
  search(query: string, organizationId: string): Promise<Patient[]>;
  exists(id: string): Promise<boolean>;
  registerPatient?(params: any): Promise<Patient>;
}

/**
 * DEVELOPMENT ONLY - Synthetic In-Memory Patient Repository
 */
export class MockPatientRepository implements PatientRepository {
  private store = new Map<string, Patient>();

  async create(patient: Patient): Promise<Patient> {
    if (this.store.has(patient.id)) {
      throw new Error(`Patient with ID ${patient.id} already exists`);
    }
    this.store.set(patient.id, patient);
    return patient;
  }

  async update(patient: Patient): Promise<Patient> {
    if (!this.store.has(patient.id)) {
      throw new Error(`Patient with ID ${patient.id} does not exist`);
    }
    this.store.set(patient.id, patient);
    return patient;
  }

  async findById(id: string): Promise<Patient | null> {
    return this.store.get(id) || null;
  }

  async findByUhid(uhid: string): Promise<Patient | null> {
    for (const patient of this.store.values()) {
      if (patient.uhid === uhid) return patient;
    }
    return null;
  }

  async search(query: string, organizationId: string): Promise<Patient[]> {
    const q = query.toLowerCase();
    return Array.from(this.store.values()).filter(
      p =>
        p.organizationId === organizationId &&
        (p.name.toLowerCase().includes(q) || p.uhid.toLowerCase().includes(q))
    );
  }

  async exists(id: string): Promise<boolean> {
    return this.store.has(id);
  }

  async registerPatient(params: any): Promise<Patient> {
    const patient: Patient = {
      id: params.id || `pat_${Math.random().toString(36).substring(2, 11)}`,
      organizationId: params.organizationId,
      clinicId: params.clinicId,
      createdBy: params.createdBy,
      createdAt: new Date().toISOString(),
      updatedBy: params.createdBy,
      updatedAt: new Date().toISOString(),
      recordVersion: 1,
      schemaVersion: 1,
      name: params.demographics.name,
      dateOfBirth: params.demographics.dateOfBirth,
      gender: params.demographics.gender,
      bloodGroup: params.demographics.bloodGroup,
      phone: params.demographics.phone,
      email: params.demographics.email,
      address: params.demographics.address,
      emergencyContact: params.demographics.emergencyContact || { name: "", phone: "", relationship: "" },
      uhid: params.uhid || `UHID-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      isActive: true
    };
    return this.create(patient);
  }
}
