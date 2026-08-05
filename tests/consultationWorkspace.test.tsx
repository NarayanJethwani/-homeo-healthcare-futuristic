import { 
  ALLOWED_CONSULTATION_TRANSITIONS, 
  ConsultationLifecycleStatus, 
  isValidLifecycleTransition,
  ClinicalIntake
} from "../src/features/consultation/domain/consultation.types";
import { MockConsultationRepository } from "../src/features/consultation/repositories/consultationRepository";
import { ConsultationService } from "../src/features/consultation/services/consultationService";
import { ConsultationId, EncounterId, PatientId, OrganizationId } from "../src/shared/domain/identifiers";

describe("Native Consultation EHR Workspace (Phase 1)", () => {
  describe("Lifecycle State Machine Transitions", () => {
    it("allows valid transitions (scheduled -> waiting -> active -> paused -> completed -> archived)", () => {
      expect(isValidLifecycleTransition("scheduled", "waiting")).toBe(true);
      expect(isValidLifecycleTransition("waiting", "active")).toBe(true);
      expect(isValidLifecycleTransition("active", "paused")).toBe(true);
      expect(isValidLifecycleTransition("paused", "active")).toBe(true);
      expect(isValidLifecycleTransition("active", "completed")).toBe(true);
      expect(isValidLifecycleTransition("completed", "archived")).toBe(true);
    });

    it("allows cancellation from pre-completion states", () => {
      expect(isValidLifecycleTransition("scheduled", "cancelled")).toBe(true);
      expect(isValidLifecycleTransition("waiting", "cancelled")).toBe(true);
      expect(isValidLifecycleTransition("active", "cancelled")).toBe(true);
      expect(isValidLifecycleTransition("paused", "cancelled")).toBe(true);
    });

    it("rejects invalid transitions (e.g. completed -> active or archived -> active)", () => {
      expect(isValidLifecycleTransition("completed", "active")).toBe(false);
      expect(isValidLifecycleTransition("archived", "active")).toBe(false);
      expect(isValidLifecycleTransition("scheduled", "completed")).toBe(false);
    });

    it("has exact allowed transitions map defined", () => {
      expect(ALLOWED_CONSULTATION_TRANSITIONS.archived).toEqual([]);
      expect(ALLOWED_CONSULTATION_TRANSITIONS.completed).toEqual(["archived"]);
    });
  });

  describe("Repository & Concurrency Revision Control", () => {
    let mockRepo: MockConsultationRepository;
    let service: ConsultationService;

    beforeEach(() => {
      mockRepo = new MockConsultationRepository();
      service = new ConsultationService(mockRepo);
    });

    it("creates a new consultation intake with recordVersion = 0", async () => {
      const intake = await service.createIntake({
        encounterId: "enc_101" as EncounterId,
        patientId: "P-1001" as PatientId,
        organizationId: "org_homeo" as OrganizationId,
        createdBy: "doc_jethwani"
      });

      expect(intake.id).toBeDefined();
      expect(intake.recordVersion).toBe(0);
      expect(intake.patientId).toBe("P-1001");
    });

    it("updates draft successfully when expectedVersion matches", async () => {
      const intake = await service.createIntake({
        encounterId: "enc_102" as EncounterId,
        patientId: "P-1002" as PatientId,
        organizationId: "org_homeo" as OrganizationId,
        createdBy: "doc_jethwani"
      });

      const updateResult = await service.saveDraft(
        intake.id,
        { historyPresentIllness: "Patient reports acidity worse after coffee" },
        0, // expectedVersion
        "doc_jethwani"
      );

      expect(updateResult.status).toBe("updated");
      if (updateResult.status === "updated") {
        expect(updateResult.entity.recordVersion).toBe(1);
        expect(updateResult.entity.historyPresentIllness).toBe("Patient reports acidity worse after coffee");
      }
    });

    it("rejects draft update with version_conflict when expectedVersion is stale", async () => {
      const intake = await service.createIntake({
        encounterId: "enc_103" as EncounterId,
        patientId: "P-1003" as PatientId,
        organizationId: "org_homeo" as OrganizationId,
        createdBy: "doc_jethwani"
      });

      // First update moves version from 0 to 1
      await service.saveDraft(
        intake.id,
        { historyPresentIllness: "First write" },
        0,
        "doc_jethwani"
      );

      // Concurrent stale update with version 0
      const staleResult = await service.saveDraft(
        intake.id,
        { historyPresentIllness: "Stale concurrent write" },
        0, // stale expected version
        "doc_jethwani"
      );

      expect(staleResult.status).toBe("version_conflict");
    });
  });
});
