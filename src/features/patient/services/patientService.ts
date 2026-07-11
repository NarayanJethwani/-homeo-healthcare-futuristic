import { validatePayload } from "../../../shared/validation/helpers";
import { PatientSchema } from "../schemas/patient.schema";
import { Patient, PatientDemographics } from "../domain/patient.types";
import { PatientRepository } from "../repositories/patientRepository";
import { DomainEventDispatcher } from "../../../shared/events/eventDispatcher";

export class PatientService {
  constructor(private readonly patientRepo: PatientRepository) {}

  async registerPatient(
    params: {
      organizationId: string;
      clinicId?: string;
      createdBy: string;
      demographics: PatientDemographics;
    }
  ): Promise<Patient> {
    const uhidSequence = Math.floor(100000 + Math.random() * 900000);
    const uhid = `P-${uhidSequence}`;
    const id = `pat_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();

    const rawPatient: Patient = {
      id,
      organizationId: params.organizationId,
      clinicId: params.clinicId,
      schemaVersion: 1,
      recordVersion: 0,
      createdAt: now,
      createdBy: params.createdBy,
      updatedAt: now,
      updatedBy: params.createdBy,
      uhid,
      name: params.demographics.name,
      dateOfBirth: params.demographics.dateOfBirth,
      gender: params.demographics.gender,
      bloodGroup: params.demographics.bloodGroup,
      phone: params.demographics.phone,
      email: params.demographics.email,
      address: params.demographics.address,
      occupation: params.demographics.occupation,
      education: params.demographics.education,
      lifestyleDetails: params.demographics.lifestyleDetails,
      insuranceDetails: params.demographics.insuranceDetails,
      referringDoctor: params.demographics.referringDoctor,
      emergencyContact: params.demographics.emergencyContact,
      isActive: true
    };

    // Runtime validation
    const validated = validatePayload(PatientSchema, rawPatient);

    const saved = await this.patientRepo.create(validated as Patient);

    // Dispatch domain event
    await DomainEventDispatcher.dispatch({
      eventType: "patient.created",
      timestamp: now,
      payload: { patientId: saved.id, organizationId: saved.organizationId, uhid: saved.uhid }
    });

    return saved;
  }

  async getPatient(id: string): Promise<Patient | null> {
    return this.patientRepo.findById(id);
  }

  async getPatientByUhid(uhid: string): Promise<Patient | null> {
    return this.patientRepo.findByUhid(uhid);
  }

  async searchPatients(query: string, organizationId: string): Promise<Patient[]> {
    return this.patientRepo.search(query, organizationId);
  }
}
