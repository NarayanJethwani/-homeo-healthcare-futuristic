import assert from "assert";
import { DEFAULT_CLINICAL_NOTES } from "../../src/features/consultation/types/clinical-notes.types";
import {
  completeWorkspace,
  createUnsavedWorkspace,
  findActiveWorkspaceByPatient,
  saveWorkspaceDraft,
} from "../../src/features/consultation/application/consultationWorkspaceRepository.server";
import { evaluateGuardedCompletionReadiness } from "../../src/features/consultation/utils/prescription-validation";

async function runGuardedCompletionTests() {
  const patientId = "patient_guarded_completion_test";
  const actorId = "doctor_guarded_completion_test";
  const unsaved = createUnsavedWorkspace({
    patientId,
    actorId,
    consent: { status: "not_granted" },
    notes: DEFAULT_CLINICAL_NOTES,
  });
  assert.strictEqual(unsaved.recordVersion, 0);
  assert.deepStrictEqual(unsaved.selectedRubrics, []);
  assert.deepStrictEqual(unsaved.prescriptionDraft, {});

  const notes = {
    ...unsaved.notes,
    chiefComplaints: [
      { id: "cc_test", complaint: "Follow-up review", severity: "mild" as const },
    ],
    historyOfPresentIllness: "Patient attended for a documented follow-up review.",
  };
  const draft = {
    id: unsaved.id,
    patientId,
    lifecycleStatus: "active" as const,
    outcome: "no_prescription" as const,
    notes,
    selectedRubrics: [],
    selectedRemedy: null,
    prescriptionDraft: {},
    accumulatedActiveSeconds: 42,
  };
  const saved = await saveWorkspaceDraft({
    draft,
    expectedVersion: 0,
    actorId,
    consent: { status: "not_granted" },
  });
  assert.strictEqual(saved.recordVersion, 1);
  assert.strictEqual((await findActiveWorkspaceByPatient(patientId))?.id, saved.id);

  await assert.rejects(
    saveWorkspaceDraft({
      draft,
      expectedVersion: 0,
      actorId,
      consent: { status: "not_granted" },
    }),
    /CONSULTATION_VERSION_CONFLICT/
  );

  const readiness = evaluateGuardedCompletionReadiness({
    notes,
    outcome: "no_prescription",
    prescriptionDraft: {},
  });
  assert.strictEqual(readiness.ready, true);

  const completed = await completeWorkspace({
    draft,
    expectedVersion: 1,
    actorId,
    consent: { status: "not_granted" },
  });
  assert.strictEqual(completed.lifecycleStatus, "completed");
  assert.strictEqual(completed.recordVersion, 2);
  assert.ok(completed.completedAt);
  assert.strictEqual(await findActiveWorkspaceByPatient(patientId), null);

  console.log("✅ Guarded Consultation Completion persistence tests passed.");
}

runGuardedCompletionTests();
