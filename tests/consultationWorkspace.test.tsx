import { 
  ALLOWED_CONSULTATION_TRANSITIONS, 
  ConsultationLifecycleStatus, 
  isValidLifecycleTransition,
  ClinicalIntake
} from "../src/features/consultation/domain/consultation.types";
import { MockConsultationRepository } from "../src/features/consultation/repositories/consultationRepository";
import { ConsultationService } from "../src/features/consultation/services/consultationService";
import { ConsultationId, EncounterId, PatientId, OrganizationId } from "../src/shared/domain/identifiers";
import { evaluateCompletionReadiness } from "../src/features/consultation/utils/consultation-validation";

describe("Native Consultation EHR Workspace (Phase 1 & Phase 2)", () => {
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

  describe("Phase 2 Structured Clinical Notes & Pure Completion Readiness Validation", () => {
    it("fails readiness evaluation when chief complaints or HPI are missing", () => {
      const evaluation = evaluateCompletionReadiness("prescription_issued", {
        chiefComplaints: [],
        historyOfPresentIllness: "",
        pastMedicalHistory: "",
        familyHistory: "",
        physicalGenerals: { thirst: "normal", sweat: "normal" },
        mentalGenerals: { temperament: "mild_yielding", consolationEffect: "neutral" },
        thermalState: "ambithermal",
        miasmaticExpression: "mixed",
        vitals: {},
        updatedAt: new Date().toISOString(),
      });

      expect(evaluation.ready).toBe(false);
      expect(evaluation.clinicalValidationErrors.length).toBeGreaterThan(0);
      expect(evaluation.clinicalValidationErrors).toContain("At least one Chief Complaint must be recorded.");
      expect(evaluation.clinicalValidationErrors).toContain(
        "History of Present Illness (HPI) must be documented (at least 10 characters)."
      );
    });

    it("requires prescription remedy name and potency scale when outcome is 'prescription_issued'", () => {
      const evaluation = evaluateCompletionReadiness(
        "prescription_issued",
        {
          chiefComplaints: [{ id: "c1", complaint: "Frontal headache", severity: "moderate" }],
          historyOfPresentIllness: "Detailed history of throbbing frontal headache for 3 weeks",
          physicalGenerals: { thirst: "normal", sweat: "normal" },
          mentalGenerals: { temperament: "mild_yielding", consolationEffect: "neutral" },
          thermalState: "chilly",
          miasmaticExpression: "psora",
          vitals: {},
          updatedAt: new Date().toISOString(),
        },
        { remedyName: "", potency: "" }
      );

      expect(evaluation.ready).toBe(false);
      expect(evaluation.prescriptionValidationErrors).toContain(
        "Prescription remedy name is required when outcome is 'prescription_issued'."
      );
      expect(evaluation.prescriptionValidationErrors).toContain(
        "Prescription potency scale/grade is required when outcome is 'prescription_issued'."
      );
    });

    it("passes readiness evaluation when all requirements are satisfied", () => {
      const evaluation = evaluateCompletionReadiness(
        "prescription_issued",
        {
          chiefComplaints: [{ id: "c1", complaint: "Throbbing headache < 3PM", severity: "severe" }],
          historyOfPresentIllness: "Patient reports intense right-sided headache beginning after sun exposure.",
          physicalGenerals: { thirst: "small_quantity_frequent", sweat: "profuse" },
          mentalGenerals: { temperament: "restless", consolationEffect: "neutral" },
          thermalState: "hot",
          miasmaticExpression: "psora",
          vitals: { bloodPressureSystolic: 120, bloodPressureDiastolic: 80 },
          updatedAt: new Date().toISOString(),
        },
        { remedyName: "Belladonna", potency: "30C" }
      );

      expect(evaluation.ready).toBe(true);
      expect(evaluation.clinicalValidationErrors).toHaveLength(0);
      expect(evaluation.prescriptionValidationErrors).toHaveLength(0);
    });
  });
});
