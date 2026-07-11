import { HomeopathicAssessment } from "../domain/homeopathy.types";
import { MockEncounterRepository, Encounter } from "../../encounter";
import { MockConsultationRepository, ClinicalIntake } from "../../consultation";
import { MockAllergyRepository, AllergyIntolerance } from "../../allergy";
import { MockPatientRepository, Patient } from "../../patient";
import { HomeopathyService } from "../services/homeopathyService";
import { HomeopathyRepository } from "../repositories/homeopathyRepository";
import { EncounterId, toPractitionerId } from "../../../shared/domain/identifiers";

export interface AssessmentWorkspaceReadModel {
  encounter: Encounter;
  patient: Patient | null;
  allergies: AllergyIntolerance[];
  intake: ClinicalIntake | null;
  assessment: HomeopathicAssessment;
  completionProgress: {
    totality: boolean;
    rubrics: boolean;
    differential: boolean;
    miasmatic: boolean;
    susceptibility: boolean;
    timeline: boolean;
    obstacles: boolean;
  };
}

export class AssessmentWorkspaceService {
  constructor(
    private encounterRepo: MockEncounterRepository,
    private consultationRepo: MockConsultationRepository,
    private allergyRepo: MockAllergyRepository,
    private patientRepo: MockPatientRepository,
    private homeopathyRepository: HomeopathyRepository,
    private homeopathyService: HomeopathyService
  ) {}

  async loadWorkspace(encounterId: EncounterId, actorId: string): Promise<AssessmentWorkspaceReadModel> {
    const encounter = await this.encounterRepo.findById(encounterId);
    if (!encounter) {
      throw new Error("Target clinical encounter was not found.");
    }

    const patient = await this.patientRepo.findById(encounter.patientId);
    const allergies = await this.allergyRepo.findByPatientId(encounter.patientId);

    let intake: ClinicalIntake | null = null;
    if (encounter.clinicalIntakeId) {
      intake = await this.consultationRepo.findById(encounter.clinicalIntakeId);
    }

    let assessment = await this.homeopathyRepository.findByEncounterId(encounterId);
    if (!assessment) {
      assessment = await this.homeopathyService.createAssessment({
        organizationId: encounter.organizationId,
        patientId: encounter.patientId,
        encounterId: encounterId,
        practitionerId: toPractitionerId(actorId)
      });
    }

    // Calculate progress checklist
    const totality = assessment.totalitySymptoms.length > 0;
    const rubrics = assessment.selectedRubrics.length > 0;
    const differential = assessment.differentialReasoning.length > 0;
    const miasmatic = assessment.miasmaticProfile.some(m => m.strength !== "not_assessed");
    const susceptibility = assessment.susceptibility.level !== "not_assessed";
    const timeline = assessment.timelineEvents.length > 0;
    const obstacles = assessment.obstaclesToCure.length > 0;

    return {
      encounter,
      patient,
      allergies,
      intake,
      assessment,
      completionProgress: {
        totality,
        rubrics,
        differential,
        miasmatic,
        susceptibility,
        timeline,
        obstacles
      }
    };
  }
}
