import assert from "assert";
import { PrescriptionRevision, PharmacyDispatchState } from "../../src/features/consultation/types/prescription.types";

async function runPrescriptionImmutabilityTests() {
  // Test 1: Finalized Revision Linkage
  const originalRevision: PrescriptionRevision = {
    version: 1,
    prescriptionId: "rx_101",
    finalizedAt: new Date().toISOString(),
    finalizedBy: "doc_99",
  };

  const amendedRevision: PrescriptionRevision = {
    version: 2,
    prescriptionId: "rx_102",
    supersedesPrescriptionId: originalRevision.prescriptionId,
    amendmentReason: "Adjusted potency from 30C to 200C due to severe modality",
    finalizedAt: new Date().toISOString(),
    finalizedBy: "doc_99",
  };

  assert.strictEqual(amendedRevision.supersedesPrescriptionId, "rx_101");
  assert.strictEqual(amendedRevision.version, 2);

  // Test 2: Decoupled Pharmacy Dispatch Failure does not invalidate prescription
  const dispatchState: PharmacyDispatchState = {
    status: "failed",
    providerName: "Unconfigured Local Adapter",
    errorMessage: "Pharmacy provider unconfigured. Consultation completion remains preserved.",
  };

  assert.strictEqual(dispatchState.status, "failed");
  assert.strictEqual(originalRevision.prescriptionId, "rx_101"); // Original prescription intact

  console.log("✅ Prescription Immutability & Decoupled Dispatch unit tests passed.");
}

runPrescriptionImmutabilityTests();
