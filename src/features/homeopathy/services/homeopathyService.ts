import { 
  HomeopathicAssessment, HomeopathicAssessmentStatus, TotalitySymptom, SelectedRubric, DifferentialRubricReasoning 
} from "../domain/homeopathy.types";
import { HomeopathyRepository, AssessmentUpdateResult } from "../repositories/homeopathyRepository";
import { AssessmentId, EncounterId, PatientId, OrganizationId, PractitionerId, toAssessmentId } from "../../../shared/domain/identifiers";
import { DomainEventDispatcher } from "../../../shared/events/eventDispatcher";

export interface AssessmentValidationIssue {
  code: string;
  fieldPath: string;
  message: string;
  severity: "error" | "warning";
}

export class HomeopathyService {
  constructor(
    private repository: HomeopathyRepository,
    private eventDispatcher: DomainEventDispatcher
  ) {}

  async createAssessment(params: {
    organizationId: OrganizationId;
    patientId: PatientId;
    encounterId: EncounterId;
    practitionerId: PractitionerId;
  }): Promise<HomeopathicAssessment> {
    const id = toAssessmentId(`asm_${Math.random().toString(36).substring(2, 11)}`);
    const assessment: HomeopathicAssessment = {
      id,
      organizationId: params.organizationId,
      patientId: params.patientId,
      encounterId: params.encounterId,
      practitionerId: params.practitionerId,
      totalitySymptoms: [],
      selectedRubrics: [],
      differentialReasoning: [],
      miasmaticProfile: [
        { miasm: "psora", strength: "not_assessed", supportingSymptomIds: [] },
        { miasm: "sycosis", strength: "not_assessed", supportingSymptomIds: [] },
        { miasm: "syphilis", strength: "not_assessed", supportingSymptomIds: [] },
        { miasm: "tubercular", strength: "not_assessed", supportingSymptomIds: [] },
        { miasm: "cancerinic", strength: "not_assessed", supportingSymptomIds: [] }
      ],
      susceptibility: {
        level: "not_assessed",
        supportingObservationIds: [],
        assessedBy: params.practitionerId,
        assessedAt: new Date().toISOString()
      },
      constitutional: {
        impressions: [],
        confidence: "not_assessed",
        supportingObservationIds: []
      },
      obstaclesToCure: [],
      rubricGroups: [
        { id: "grp_mental", title: "Mental Generals", displayOrder: 1 },
        { id: "grp_physical", title: "Physical Generals", displayOrder: 2 },
        { id: "grp_particulars", title: "Particular Symptoms", displayOrder: 3 }
      ],
      etiologicalFactors: [],
      maintainingCauses: [],
      timelineEvents: [],
      status: "draft",
      assessmentMethodology: { id: "HH-Assessment-v1", version: "1.0" },
      weightingMethodVersion: "v1.0",
      provenance: {
        createdBy: params.practitionerId,
        createdAt: new Date().toISOString(),
        updatedBy: params.practitionerId,
        updatedAt: new Date().toISOString(),
        sourceType: "clinician",
        enteredByRole: "practitioner"
      },
      recordVersion: 0,
      schemaVersion: 1
    };

    const saved = await this.repository.save(assessment);

    await this.eventDispatcher.dispatchEvent({
      eventType: "homeopathy.assessment.created",
      timestamp: new Date().toISOString(),
      payload: {
        assessmentId: saved.id,
        encounterId: saved.encounterId,
        patientId: saved.patientId,
        recordVersion: saved.recordVersion
      }
    });

    return saved;
  }

  async saveDraft(
    id: AssessmentId,
    update: Partial<HomeopathicAssessment>,
    expectedVersion: number,
    actorId: string
  ): Promise<AssessmentUpdateResult> {
    const result = await this.repository.updateDraft(id, update, expectedVersion);
    if (result.status === "updated") {
      await this.eventDispatcher.dispatchEvent({
        eventType: "homeopathy.assessment.updated",
        timestamp: new Date().toISOString(),
        payload: {
          assessmentId: id,
          fieldsChanged: Object.keys(update),
          recordVersion: result.assessment.recordVersion
        }
      });
    }
    return result;
  }

  validateAssessment(assessment: HomeopathicAssessment): AssessmentValidationIssue[] {
    const issues: AssessmentValidationIssue[] = [];

    // 1. At least one selected totality symptom
    if (assessment.totalitySymptoms.length === 0) {
      issues.push({
        code: "MISSING_TOTALITY",
        fieldPath: "totalitySymptoms",
        message: "At least one clinical symptom must be selected for the homeopathic totality.",
        severity: "error"
      });
    }

    // 2. Rationale for decisive or keynote symptoms (importance = 3 or classification = keynote)
    assessment.totalitySymptoms.forEach((s, idx) => {
      const isDecisive = s.clinicalImportance === 3;
      const isKeynote = s.primaryClassification === "keynote";
      const hasRationale = s.reasoningHistory.length > 0 && s.reasoningHistory[s.reasoningHistory.length - 1].rationale.trim().length > 0;

      if ((isDecisive || isKeynote) && !hasRationale) {
        issues.push({
          code: "MISSING_TOTALITY_RATIONALE",
          fieldPath: `totalitySymptoms[${idx}].reasoningHistory`,
          message: `Symptom "${s.sourceSnapshot.normalizedName}" is marked as decisive or keynote and requires clinical rationale.`,
          severity: "error"
        });
      }
    });

    // 3. No duplicate selected rubric IDs
    const selectedIds = assessment.selectedRubrics.filter(r => r.status === "selected").map(r => r.rubricId);
    const duplicates = selectedIds.filter((id, index) => selectedIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      issues.push({
        code: "DUPLICATE_RUBRICS",
        fieldPath: "selectedRubrics",
        message: "Duplicate rubrics cannot be selected in the active repertorization workspace.",
        severity: "error"
      });
    }

    // 4. Selected rubrics must have source provenance
    assessment.selectedRubrics.forEach((r, idx) => {
      if (r.status === "selected" && !r.sourceId) {
        issues.push({
          code: "MISSING_RUBRIC_PROVENANCE",
          fieldPath: `selectedRubrics[${idx}].sourceId`,
          message: `Rubric "${r.displayText}" requires repertory source edition provenance metadata.`,
          severity: "error"
        });
      }
    });

    // 5. Differential candidate validation checks
    assessment.differentialReasoning.forEach((d, idx) => {
      if (d.candidateRubricIds.length === 0) {
        issues.push({
          code: "MISSING_CANDIDATE_RUBRICS",
          fieldPath: `differentialReasoning[${idx}].candidateRubricIds`,
          message: "Differential rubric reasoning requires candidate rubrics to compare.",
          severity: "error"
        });
      }
    });

    return issues;
  }

  async submitAssessmentForReview(
    id: AssessmentId,
    actorContext: { actorId: string; organizationId: string },
    expectedVersion: number
  ): Promise<{ success: boolean; validationIssues: AssessmentValidationIssue[]; assessment?: HomeopathicAssessment }> {
    const current = await this.repository.findById(id);
    if (!current) {
      return { success: false, validationIssues: [{ code: "NOT_FOUND", fieldPath: "id", message: "Assessment not found", severity: "error" }] };
    }

    const validationIssues = this.validateAssessment(current);
    const hasErrors = validationIssues.some(i => i.severity === "error");

    if (hasErrors) {
      return { success: false, validationIssues };
    }

    const updateRes = await this.repository.updateDraft(
      id,
      {
        status: "ready_for_review",
        provenance: {
          ...current.provenance,
          updatedBy: actorContext.actorId,
          updatedAt: new Date().toISOString()
        }
      },
      expectedVersion
    );

    if (updateRes.status === "version_conflict") {
      return {
        success: false,
        validationIssues: [{ code: "VERSION_CONFLICT", fieldPath: "recordVersion", message: "A concurrency conflict occurred. Please reload.", severity: "error" }]
      };
    }

    if (updateRes.status === "updated") {
      await this.eventDispatcher.dispatchEvent({
        eventType: "homeopathy.assessment.submitted_for_review",
        timestamp: new Date().toISOString(),
        payload: {
          assessmentId: id,
          encounterId: current.encounterId,
          patientId: current.patientId,
          recordVersion: updateRes.assessment.recordVersion
        }
      });

      return { success: true, validationIssues: [], assessment: updateRes.assessment };
    }

    return { success: false, validationIssues: [{ code: "UPDATE_FAILED", fieldPath: "id", message: "Failed to persist review status state", severity: "error" }] };
  }
}
