import { AllergyIntolerance } from "../domain/allergy.types";

export interface AllergyRepository {
  create(allergy: AllergyIntolerance): Promise<AllergyIntolerance>;
  update(allergy: AllergyIntolerance): Promise<AllergyIntolerance>;
  findById(id: string): Promise<AllergyIntolerance | null>;
  findByPatientId(patientId: string): Promise<AllergyIntolerance[]>;
  recordAllergy?(params: any): Promise<AllergyIntolerance>;
}

/**
 * DEVELOPMENT ONLY - Synthetic In-Memory Allergy Repository
 */
export class MockAllergyRepository implements AllergyRepository {
  private store = new Map<string, AllergyIntolerance>();

  async create(allergy: AllergyIntolerance): Promise<AllergyIntolerance> {
    if (this.store.has(allergy.id)) {
      throw new Error(`Allergy record with ID ${allergy.id} already exists`);
    }
    this.store.set(allergy.id, allergy);
    return allergy;
  }

  async update(allergy: AllergyIntolerance): Promise<AllergyIntolerance> {
    if (!this.store.has(allergy.id)) {
      throw new Error(`Allergy record with ID ${allergy.id} does not exist`);
    }
    this.store.set(allergy.id, allergy);
    return allergy;
  }

  async findById(id: string): Promise<AllergyIntolerance | null> {
    return this.store.get(id) || null;
  }

  async findByPatientId(patientId: string): Promise<AllergyIntolerance[]> {
    return Array.from(this.store.values()).filter(a => a.patientId === patientId);
  }

  async recordAllergy(params: any): Promise<AllergyIntolerance> {
    const allergy: AllergyIntolerance = {
      id: params.id || `alg_${Math.random().toString(36).substring(2, 11)}`,
      organizationId: params.organizationId,
      patientId: params.patientId,
      substanceText: params.substanceText,
      category: params.category || "medication",
      criticality: params.criticality || "low",
      verificationStatus: params.verificationStatus || "confirmed",
      reactionDescriptions: params.reactionDescriptions || [],
      onsetDate: params.onsetDate,
      notes: params.notes,
      createdBy: params.createdBy || "system",
      createdAt: new Date().toISOString(),
      updatedBy: params.createdBy || "system",
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
      recordVersion: 1,
      provenance: params.provenance || {
        createdBy: params.createdBy || "system",
        createdAt: new Date().toISOString(),
        sourceType: "clinician"
      }
    };
    return this.create(allergy);
  }
}
