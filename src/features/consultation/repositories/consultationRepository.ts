import { ClinicalIntake } from "../domain/consultation.types";
import { ConsultationId, EncounterId, PatientId } from "../../../shared/domain/identifiers";
import { RepositoryUpdateResult } from "../../../shared/domain/entities";

export interface ConsultationRepository {
  create(intake: ClinicalIntake): Promise<ClinicalIntake>;
  findById(id: ConsultationId): Promise<ClinicalIntake | null>;
  findByEncounterId(encounterId: EncounterId): Promise<ClinicalIntake | null>;
  updateDraft(
    id: ConsultationId,
    intake: ClinicalIntake,
    expectedVersion: number
  ): Promise<RepositoryUpdateResult<ClinicalIntake>>;
  createDraft?(params: any): Promise<ClinicalIntake>;
}

/**
 * DEVELOPMENT ONLY - Synthetic In-Memory Consultation Repository
 */
export class MockConsultationRepository implements ConsultationRepository {
  private store = new Map<string, ClinicalIntake>();

  async create(intake: ClinicalIntake): Promise<ClinicalIntake> {
    if (this.store.has(intake.id)) {
      throw new Error(`Consultation record with ID ${intake.id} already exists`);
    }
    this.store.set(intake.id, intake);
    return intake;
  }

  async findById(id: ConsultationId): Promise<ClinicalIntake | null> {
    return this.store.get(id) || null;
  }

  async findByEncounterId(encounterId: EncounterId): Promise<ClinicalIntake | null> {
    return Array.from(this.store.values()).find(c => c.encounterId === encounterId) || null;
  }

  async updateDraft(
    id: ConsultationId,
    intake: ClinicalIntake,
    expectedVersion: number
  ): Promise<RepositoryUpdateResult<ClinicalIntake>> {
    const stored = this.store.get(id);
    if (!stored) {
      return { status: "not_found" };
    }

    if (stored.recordVersion !== expectedVersion) {
      return { status: "version_conflict", currentEntity: stored };
    }

    const updated: ClinicalIntake = {
      ...intake,
      recordVersion: stored.recordVersion + 1
    };

    this.store.set(id, updated);
    return { status: "updated", entity: updated };
  }

  async createDraft(params: any): Promise<ClinicalIntake> {
    const intake: ClinicalIntake = {
      id: params.id || `con_${Math.random().toString(36).substring(2, 11)}` as ConsultationId,
      encounterId: params.encounterId || `enc_${Math.random().toString(36).substring(2, 11)}` as EncounterId,
      patientId: params.patientId,
      organizationId: params.organizationId,
      clinicId: params.clinicId,
      treatmentEpisodeId: params.treatmentEpisodeId,
      chiefComplaints: params.chiefComplaints || [],
      historyPresentIllness: params.historyPresentIllness || "",
      pastMedicalHistory: params.pastMedicalHistory || "",
      familyHistory: params.familyHistory || "",
      mentalGenerals: params.mentalGenerals || { fears: [], emotionalCausation: [] },
      physicalGenerals: params.physicalGenerals || { cravings: [], aversions: [] },
      characteristicSymptoms: params.characteristicSymptoms || [],
      generalModalities: params.generalModalities || { thermals: "unknown", sideAffection: "unknown" },
      causation: params.causation || [],
      illnessTimeline: params.illnessTimeline || [],
      clinicianNotes: params.clinicianNotes || "",
      schemaVersion: 1,
      recordVersion: 1,
      provenance: params.provenance || {
        createdBy: params.createdBy || "system",
        createdAt: new Date().toISOString(),
        sourceType: "clinician"
      }
    };
    return this.create(intake);
  }
}
