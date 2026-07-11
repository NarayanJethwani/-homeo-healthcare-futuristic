import { validatePayload } from "../../../shared/validation/helpers";
import { AllergyIntoleranceSchema } from "../schemas/allergy.schema";
import { AllergyIntolerance, AllergyCategory, AllergyCriticality } from "../domain/allergy.types";
import { AllergyRepository } from "../repositories/allergyRepository";
import { DomainEventDispatcher } from "../../../shared/events/eventDispatcher";

export class AllergyService {
  constructor(private readonly allergyRepo: AllergyRepository) {}

  async recordAllergy(params: {
    organizationId: string;
    patientId: string;
    substanceText: string;
    category: AllergyCategory;
    criticality?: AllergyCriticality;
    reactionDescriptions: string[];
    createdBy: string;
    notes?: string;
  }): Promise<AllergyIntolerance> {
    const id = `all_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();

    const rawAllergy: AllergyIntolerance = {
      id,
      organizationId: params.organizationId,
      schemaVersion: 1,
      recordVersion: 0,
      createdAt: now,
      createdBy: params.createdBy,
      updatedAt: now,
      updatedBy: params.createdBy,
      patientId: params.patientId,
      substanceText: params.substanceText,
      category: params.category,
      criticality: params.criticality || "unknown",
      verificationStatus: "confirmed",
      reactionDescriptions: params.reactionDescriptions,
      notes: params.notes,
      provenance: {
        createdBy: params.createdBy,
        createdAt: now,
        sourceType: "clinician"
      }
    };

    const validated = validatePayload(AllergyIntoleranceSchema, rawAllergy);
    const saved = await this.allergyRepo.create(validated as AllergyIntolerance);

    await DomainEventDispatcher.dispatch({
      eventType: "allergy.created",
      timestamp: now,
      payload: { allergyId: saved.id, patientId: saved.patientId, category: saved.category }
    });

    return saved;
  }

  async getPatientAllergies(patientId: string): Promise<AllergyIntolerance[]> {
    return this.allergyRepo.findByPatientId(patientId);
  }
}
