import assert from "assert";
import { idempotencyRepository } from "../../src/features/consultation/repositories/consultationRepositories";

async function runDurableIdempotencyTests() {
  const actorId = "doc_101";
  const operation = "complete_consultation";
  const consultationId = "c_99";
  const key = "idemp_test_key_1";

  // Test 1: First reservation succeeds
  const res1 = await idempotencyRepository.reserveIdempotencyKey({
    actorId,
    operation,
    consultationId,
    idempotencyKey: key,
    requestPayload: { outcome: "prescription_issued" },
  });
  assert.strictEqual(res1.isDuplicate, false);

  // Test 2: Identical payload returns duplicate record
  const res2 = await idempotencyRepository.reserveIdempotencyKey({
    actorId,
    operation,
    consultationId,
    idempotencyKey: key,
    requestPayload: { outcome: "prescription_issued" },
  });
  assert.strictEqual(res2.isDuplicate, true);

  // Test 3: Payload Mismatch Rejection
  await assert.rejects(
    async () => {
      await idempotencyRepository.reserveIdempotencyKey({
        actorId,
        operation,
        consultationId,
        idempotencyKey: key,
        requestPayload: { outcome: "referred" }, // Payload mismatch
      });
    },
    /Idempotency conflict/
  );

  console.log("✅ Durable Compound Idempotency Unit Tests Passed.");
}

runDurableIdempotencyTests();
