import { HomeopathicAssessment, HomeopathicAssessmentStatus } from "../domain/homeopathy.types";
import { AssessmentId, EncounterId } from "../../../shared/domain/identifiers";

export type AssessmentUpdateResult =
  | {
      status: "updated";
      assessment: HomeopathicAssessment;
    }
  | {
      status: "version_conflict";
      currentAssessment: HomeopathicAssessment;
    }
  | {
      status: "not_found";
    };

export interface HomeopathyRepository {
  findById(id: AssessmentId): Promise<HomeopathicAssessment | null>;
  findByEncounterId(encounterId: EncounterId): Promise<HomeopathicAssessment | null>;
  save(assessment: HomeopathicAssessment): Promise<HomeopathicAssessment>;
  updateDraft(
    id: AssessmentId,
    update: Partial<HomeopathicAssessment>,
    expectedVersion: number
  ): Promise<AssessmentUpdateResult>;
}

export class MockHomeopathyRepository implements HomeopathyRepository {
  private db = new Map<string, HomeopathicAssessment>();

  async findById(id: AssessmentId): Promise<HomeopathicAssessment | null> {
    return this.db.get(id) || null;
  }

  async findByEncounterId(encounterId: EncounterId): Promise<HomeopathicAssessment | null> {
    for (const record of this.db.values()) {
      if (record.encounterId === encounterId) {
        return record;
      }
    }
    return null;
  }

  async save(assessment: HomeopathicAssessment): Promise<HomeopathicAssessment> {
    const copy = JSON.parse(JSON.stringify(assessment)) as HomeopathicAssessment;
    this.db.set(copy.id, copy);
    return copy;
  }

  async updateDraft(
    id: AssessmentId,
    update: Partial<HomeopathicAssessment>,
    expectedVersion: number
  ): Promise<AssessmentUpdateResult> {
    const current = this.db.get(id);
    if (!current) {
      return { status: "not_found" };
    }

    if (current.recordVersion !== expectedVersion) {
      return {
        status: "version_conflict",
        currentAssessment: JSON.parse(JSON.stringify(current)) as HomeopathicAssessment
      };
    }

    const updated: HomeopathicAssessment = {
      ...current,
      ...update,
      id: current.id,
      encounterId: current.encounterId,
      patientId: current.patientId,
      organizationId: current.organizationId,
      recordVersion: current.recordVersion + 1,
      provenance: {
        ...current.provenance,
        updatedAt: new Date().toISOString(),
        updatedBy: update.provenance?.updatedBy || current.provenance.updatedBy
      }
    };

    this.db.set(id, updated);
    return {
      status: "updated",
      assessment: JSON.parse(JSON.stringify(updated)) as HomeopathicAssessment
    };
  }
}
export const mockHomeopathyRepository = new MockHomeopathyRepository();
