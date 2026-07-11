import { validatePayload } from "../../../shared/validation/helpers";
import { ClinicalIntakeSchema } from "../schemas/consultation.schema";
import { ClinicalIntake } from "../domain/consultation.types";
import { ConsultationRepository } from "../repositories/consultationRepository";
import { 
  ConsultationId, EncounterId, PatientId, OrganizationId, ClinicId, EpisodeId 
} from "../../../shared/domain/identifiers";
import { RepositoryUpdateResult } from "../../../shared/domain/entities";
import { DomainEventDispatcher } from "../../../shared/events/eventDispatcher";

export class ConsultationService {
  constructor(private readonly consultationRepo: ConsultationRepository) {}

  async createIntake(params: {
    encounterId: EncounterId;
    patientId: PatientId;
    organizationId: OrganizationId;
    clinicId?: ClinicId;
    treatmentEpisodeId?: EpisodeId;
    createdBy: string;
  }): Promise<ClinicalIntake> {
    const id = `con_${Math.random().toString(36).substring(2, 11)}` as ConsultationId;
    const now = new Date().toISOString();

    const rawIntake: ClinicalIntake = {
      id,
      encounterId: params.encounterId,
      patientId: params.patientId,
      organizationId: params.organizationId,
      clinicId: params.clinicId,
      treatmentEpisodeId: params.treatmentEpisodeId,
      chiefComplaints: [],
      historyPresentIllness: "",
      pastMedicalHistory: "",
      familyHistory: "",
      mentalGenerals: { fears: [], emotionalCausation: [] },
      physicalGenerals: { cravings: [], aversions: [] },
      characteristicSymptoms: [],
      generalModalities: { aggravatingFactors: [], amelioratingFactors: [] },
      causation: [],
      illnessTimeline: [],
      schemaVersion: 1,
      recordVersion: 0,
      provenance: {
        createdAt: now,
        createdBy: params.createdBy,
        updatedAt: now,
        updatedBy: params.createdBy,
        sourceType: "clinician",
        enteredByRole: "doctor"
      }
    };

    const validated = validatePayload(ClinicalIntakeSchema, rawIntake);
    const saved = await this.consultationRepo.create(validated as ClinicalIntake);

    await DomainEventDispatcher.dispatch({
      eventType: "clinical_intake.created",
      timestamp: now,
      payload: {
        eventId: `evt_${Math.random().toString(36).substring(2, 11)}`,
        schemaVersion: 1,
        organizationId: saved.organizationId,
        patientId: saved.patientId,
        encounterId: saved.encounterId,
        actorId: params.createdBy,
        occurredTime: now,
        sourceEntityType: "clinical_intake",
        sourceEntityId: saved.id,
        sourceRecordVersion: saved.recordVersion
      }
    });

    return saved;
  }

  async getIntakeByEncounterId(encounterId: EncounterId): Promise<ClinicalIntake | null> {
    return this.consultationRepo.findByEncounterId(encounterId);
  }

  async getIntakeById(id: ConsultationId): Promise<ClinicalIntake | null> {
    return this.consultationRepo.findById(id);
  }

  async saveDraft(
    id: ConsultationId,
    updatedFields: Partial<Omit<ClinicalIntake, "id" | "encounterId" | "patientId" | "organizationId">>,
    expectedVersion: number,
    actorId: string
  ): Promise<RepositoryUpdateResult<ClinicalIntake>> {
    const existing = await this.consultationRepo.findById(id);
    if (!existing) {
      return { status: "not_found" };
    }

    const now = new Date().toISOString();
    const merged: ClinicalIntake = {
      ...existing,
      ...updatedFields,
      provenance: {
        ...existing.provenance,
        updatedAt: now,
        updatedBy: actorId
      }
    };

    // Soft draft validations
    const validated = validatePayload(ClinicalIntakeSchema, merged);
    const result = await this.consultationRepo.updateDraft(id, validated as ClinicalIntake, expectedVersion);

    if (result.status === "updated") {
      await DomainEventDispatcher.dispatch({
        eventType: "clinical_intake.updated",
        timestamp: now,
        payload: {
          eventId: `evt_${Math.random().toString(36).substring(2, 11)}`,
          schemaVersion: 1,
          organizationId: result.entity.organizationId,
          patientId: result.entity.patientId,
          encounterId: result.entity.encounterId,
          actorId: actorId,
          occurredTime: now,
          sourceEntityType: "clinical_intake",
          sourceEntityId: result.entity.id,
          sourceRecordVersion: result.entity.recordVersion
        }
      });
    }

    return result;
  }
}
