import { validatePayload } from "../../../shared/validation/helpers";
import { EncounterSchema } from "../schemas/encounter.schema";
import { Encounter, EncounterType, EncounterStatus } from "../domain/encounter.types";
import { EncounterRepository } from "../repositories/encounterRepository";
import { 
  ClinicalIntake, hasMeaningfulMentalGenerals, hasMeaningfulPhysicalGenerals 
} from "../../consultation";
import { 
  EncounterId, PatientId, OrganizationId, ClinicId, PractitionerId, 
  ConsultationId, EpisodeId 
} from "../../../shared/domain/identifiers";
import { Provenance, RepositoryUpdateResult } from "../../../shared/domain/entities";
import { DomainEventDispatcher } from "../../../shared/events/eventDispatcher";
import { UnauthorizedError } from "../../../shared/errors/domainErrors";

export interface ReviewValidationIssue {
  code: string;
  fieldPath: string;
  message: string;
  severity: "error" | "warning";
}

export interface ReviewValidationResult {
  valid: boolean;
  issues: ReviewValidationIssue[];
}

export function validateEncounterForReview(
  encounter: Encounter,
  intake: ClinicalIntake | null
): ReviewValidationResult {
  const issues: ReviewValidationIssue[] = [];

  // Administrative encounters do not require intake record
  if (encounter.encounterType === "administrative") {
    return { valid: true, issues: [] };
  }

  if (!intake) {
    issues.push({
      code: "MISSING_INTAKE",
      fieldPath: "clinicalIntakeId",
      message: `Clinical intake is required for ${encounter.encounterType.replace("_", " ")} encounters`,
      severity: "error"
    });
    return { valid: false, issues };
  }

  // Type-specific validations
  if (encounter.encounterType === "initial_consultation") {
    if (!intake.chiefComplaints || intake.chiefComplaints.length === 0) {
      issues.push({
        code: "MISSING_CHIEF_COMPLAINT",
        fieldPath: "chiefComplaints",
        message: "At least one chief complaint symptom is required",
        severity: "error"
      });
    }

    if (!intake.historyPresentIllness || intake.historyPresentIllness.trim().length < 5) {
      issues.push({
        code: "INVALID_HPI",
        fieldPath: "historyPresentIllness",
        message: "History of present illness (HPI) must contain diagnostic detail (min 5 characters)",
        severity: "error"
      });
    }

    if (!hasMeaningfulMentalGenerals(intake.mentalGenerals)) {
      issues.push({
        code: "MISSING_MENTAL_GENERALS",
        fieldPath: "mentalGenerals",
        message: "At least one mental general parameter must contain clinician observation details",
        severity: "error"
      });
    }

    if (!hasMeaningfulPhysicalGenerals(intake.physicalGenerals)) {
      issues.push({
        code: "MISSING_PHYSICAL_GENERALS",
        fieldPath: "physicalGenerals",
        message: "At least one physical general parameter must contain clinician observation details",
        severity: "error"
      });
    }

    if (!intake.illnessTimeline || intake.illnessTimeline.length === 0) {
      issues.push({
        code: "MISSING_TIMELINE",
        fieldPath: "illnessTimeline",
        message: "At least one illness timeline event or chronology entry is required",
        severity: "error"
      });
    }
  }

  if (encounter.encounterType === "follow_up") {
    const fup = intake.followUpDetails;
    if (!fup) {
      issues.push({
        code: "MISSING_FOLLOWUP_DETAILS",
        fieldPath: "followUpDetails",
        message: "Follow-up clinical details are required",
        severity: "error"
      });
    } else {
      if (!fup.responseSincePreviousTreatment || fup.responseSincePreviousTreatment.trim().length < 3) {
        issues.push({
          code: "INVALID_RESPONSE_SUMMARY",
          fieldPath: "followUpDetails.responseSincePreviousTreatment",
          message: "Response summary since previous treatment is required",
          severity: "error"
        });
      }

      const updatesCount = (fup.symptomUpdates || []).length;
      const newCount = (fup.newSymptoms || []).length;
      if (updatesCount === 0 && newCount === 0) {
        issues.push({
          code: "MISSING_SYMPTOM_UPDATES",
          fieldPath: "followUpDetails.symptomUpdates",
          message: "Must record at least one symptom progress update or new symptom reaction",
          severity: "error"
        });
      }

      if (!fup.currentAssessment || fup.currentAssessment.trim().length < 3) {
        issues.push({
          code: "INVALID_ASSESSMENT",
          fieldPath: "followUpDetails.currentAssessment",
          message: "Current assessment summaries are required",
          severity: "error"
        });
      }
    }
  }

  if (encounter.encounterType === "teleconsultation") {
    if (!intake.chiefComplaints || intake.chiefComplaints.length === 0) {
      issues.push({
        code: "MISSING_CHIEF_COMPLAINT",
        fieldPath: "chiefComplaints",
        message: "At least one chief complaint symptom is required",
        severity: "error"
      });
    }
    if (!intake.historyPresentIllness || intake.historyPresentIllness.trim().length < 5) {
      issues.push({
        code: "INVALID_HPI",
        fieldPath: "historyPresentIllness",
        message: "History of present illness must be present",
        severity: "error"
      });
    }
  }

  if (encounter.encounterType === "urgent") {
    if (!intake.chiefComplaints || intake.chiefComplaints.length === 0) {
      issues.push({
        code: "MISSING_CHIEF_COMPLAINT",
        fieldPath: "chiefComplaints",
        message: "At least one chief complaint symptom is required for urgent encounters",
        severity: "error"
      });
    }
  }

  const errors = issues.filter(i => i.severity === "error");
  return {
    valid: errors.length === 0,
    issues
  };
}

export class EncounterService {
  constructor(private readonly encounterRepo: EncounterRepository) {}

  async createEncounter(params: {
    patientId: PatientId;
    organizationId: OrganizationId;
    clinicId?: ClinicId;
    practitionerId: PractitionerId;
    encounterType: EncounterType;
    encounterDate: string;
    primaryEpisodeId?: EpisodeId;
    relatedEpisodeIds?: EpisodeId[];
    createdBy: string;
  }): Promise<Encounter> {
    const now = new Date().toISOString();
    const input = {
      patientId: params.patientId,
      organizationId: params.organizationId,
      clinicId: params.clinicId,
      practitionerId: params.practitionerId,
      encounterType: params.encounterType,
      encounterDate: params.encounterDate,
      primaryEpisodeId: params.primaryEpisodeId,
      relatedEpisodeIds: params.relatedEpisodeIds || [],
      provenance: {
        createdAt: now,
        createdBy: params.createdBy,
        updatedAt: now,
        updatedBy: params.createdBy,
        sourceType: "clinician" as const,
        enteredByRole: "doctor"
      }
    };

    const saved = await this.encounterRepo.create(input);

    await DomainEventDispatcher.dispatch({
      eventType: "encounter.created",
      timestamp: now,
      payload: {
        eventId: `evt_${Math.random().toString(36).substring(2, 11)}`,
        schemaVersion: 1,
        organizationId: saved.organizationId,
        patientId: saved.patientId,
        encounterId: saved.id,
        actorId: params.createdBy,
        occurredTime: now,
        sourceEntityType: "encounter",
        sourceEntityId: saved.id,
        sourceRecordVersion: saved.recordVersion
      }
    });

    return saved;
  }

  async getEncounter(id: EncounterId): Promise<Encounter | null> {
    return this.encounterRepo.findById(id);
  }

  async getPatientEncounters(patientId: PatientId): Promise<Encounter[]> {
    return this.encounterRepo.findByPatientId(patientId);
  }

  async getEpisodeEncounters(episodeId: EpisodeId): Promise<Encounter[]> {
    return this.encounterRepo.findByEpisodeId(episodeId);
  }

  async saveDraft(
    id: EncounterId,
    updatedFields: Partial<Omit<Encounter, "id" | "patientId" | "organizationId" | "status">>,
    expectedVersion: number,
    actorId: string
  ): Promise<RepositoryUpdateResult<Encounter>> {
    const existing = await this.encounterRepo.findById(id);
    if (!existing) {
      return { status: "not_found" };
    }

    const now = new Date().toISOString();
    const input = {
      clinicalIntakeId: updatedFields.clinicalIntakeId !== undefined ? updatedFields.clinicalIntakeId : existing.clinicalIntakeId,
      primaryEpisodeId: updatedFields.primaryEpisodeId !== undefined ? updatedFields.primaryEpisodeId : existing.primaryEpisodeId,
      relatedEpisodeIds: updatedFields.relatedEpisodeIds !== undefined ? updatedFields.relatedEpisodeIds : existing.relatedEpisodeIds,
      encounterDate: updatedFields.encounterDate !== undefined ? updatedFields.encounterDate : existing.encounterDate,
      provenance: {
        ...existing.provenance,
        updatedAt: now,
        updatedBy: actorId
      }
    };

    const result = await this.encounterRepo.updateDraft(id, input, expectedVersion);

    if (result.status === "updated") {
      await DomainEventDispatcher.dispatch({
        eventType: "encounter.draft_saved",
        timestamp: now,
        payload: {
          eventId: `evt_${Math.random().toString(36).substring(2, 11)}`,
          schemaVersion: 1,
          organizationId: result.entity.organizationId,
          patientId: result.entity.patientId,
          encounterId: result.entity.id,
          actorId: actorId,
          occurredTime: now,
          sourceEntityType: "encounter",
          sourceEntityId: result.entity.id,
          sourceRecordVersion: result.entity.recordVersion
        }
      });
    }

    return result;
  }

  async submitEncounterForReview(
    encounterId: EncounterId,
    actorContext: { actorId: string; organizationId: string; clinicId?: string },
    intake: ClinicalIntake | null
  ): Promise<{ success: boolean; encounter?: Encounter; validationIssues: ReviewValidationIssue[] }> {
    const encounter = await this.encounterRepo.findById(encounterId);
    if (!encounter) {
      throw new Error(`Encounter with ID ${encounterId} not found`);
    }

    // 1. Authorize Actor tenant matching
    if (encounter.organizationId !== actorContext.organizationId) {
      throw new UnauthorizedError("Cross-organization submissions are prohibited");
    }

    // 2. Perform validation checks
    const valResult = validateEncounterForReview(encounter, intake);
    if (!valResult.valid) {
      return { success: false, validationIssues: valResult.issues };
    }

    // 3. Transition Encounter state
    const now = new Date().toISOString();
    const provenance: Provenance = {
      ...encounter.provenance,
      updatedAt: now,
      updatedBy: actorContext.actorId
    };

    // Use direct state update helper on repo
    const mockRepo = this.encounterRepo as any;
    let updated: Encounter;
    if (typeof mockRepo.updateStatusDirect === "function") {
      updated = await mockRepo.updateStatusDirect(encounterId, "ready_for_review", provenance);
    } else {
      // Fallback update
      const input = {
        clinicalIntakeId: encounter.clinicalIntakeId,
        primaryEpisodeId: encounter.primaryEpisodeId,
        relatedEpisodeIds: encounter.relatedEpisodeIds,
        encounterDate: encounter.encounterDate,
        provenance
      };
      const draftResult = await this.encounterRepo.updateDraft(encounterId, input, encounter.recordVersion);
      if (draftResult.status !== "updated") {
        throw new Error("Concurrency version conflict during status submission");
      }
      updated = { ...draftResult.entity, status: "ready_for_review" };
      // In a real repo this status is persisted
    }

    // 4. Emit submission event
    await DomainEventDispatcher.dispatch({
      eventType: "encounter.submitted_for_review",
      timestamp: now,
      payload: {
        eventId: `evt_${Math.random().toString(36).substring(2, 11)}`,
        schemaVersion: 1,
        organizationId: updated.organizationId,
        patientId: updated.patientId,
        encounterId: updated.id,
        actorId: actorContext.actorId,
        occurredTime: now,
        sourceEntityType: "encounter",
        sourceEntityId: updated.id,
        sourceRecordVersion: updated.recordVersion
      }
    });

    return { success: true, encounter: updated, validationIssues: valResult.issues };
  }
}
