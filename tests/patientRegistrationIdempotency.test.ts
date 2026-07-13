import assert from "assert";
import {
  createPatientRegistrationKey,
  IdempotentSubmissionCoordinator,
} from "../src/features/clinical-os/application/idempotentPatientRegistration";

async function runTests() {
  let passed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    await fn();
    passed += 1;
    console.log(`✅ ${name}`);
  }

  await test("coalesces concurrent duplicate submissions", async () => {
    const coordinator = new IdempotentSubmissionCoordinator<{ uhid: string }>();
    let operations = 0;
    const operation = async () => {
      operations += 1;
      await new Promise(resolve => setTimeout(resolve, 5));
      return { uhid: "P-123456" };
    };

    const [first, duplicate] = await Promise.all([
      coordinator.run("same-registration", operation),
      coordinator.run("same-registration", operation),
    ]);

    assert.strictEqual(operations, 1);
    assert.strictEqual(first.reused, false);
    assert.strictEqual(duplicate.reused, true);
    assert.strictEqual(duplicate.value.uhid, first.value.uhid);
  });

  await test("reuses a recent successful registration", async () => {
    const coordinator = new IdempotentSubmissionCoordinator<string>(30_000);
    let operations = 0;
    const operation = async () => `patient-${++operations}`;

    const first = await coordinator.run("same-registration", operation);
    const duplicate = await coordinator.run("same-registration", operation);

    assert.strictEqual(operations, 1);
    assert.strictEqual(first.value, duplicate.value);
    assert.strictEqual(duplicate.reused, true);
  });

  await test("allows a retry after a failed registration", async () => {
    const coordinator = new IdempotentSubmissionCoordinator<string>();
    let operations = 0;
    const operation = async () => {
      operations += 1;
      if (operations === 1) throw new Error("temporary failure");
      return "P-654321";
    };

    await assert.rejects(coordinator.run("retryable", operation), /temporary failure/);
    const retry = await coordinator.run("retryable", operation);

    assert.strictEqual(operations, 2);
    assert.strictEqual(retry.value, "P-654321");
    assert.strictEqual(retry.reused, false);
  });

  await test("normalizes equivalent registration fingerprints", () => {
    const base = {
      organizationId: "org_homeo_premium",
      clinicId: "clinic_pune_baner",
      createdBy: "doctor-1",
      name: "Aarav Sharma",
      dateOfBirth: "1988-05-15",
      phone: "+91 98765-43210",
      email: "AARAV.SHARMA@EXAMPLE.COM",
    };

    const normalized = createPatientRegistrationKey({
      ...base,
      name: "  aarav   sharma ",
      phone: "919876543210",
      email: "aarav.sharma@example.com ",
    });

    assert.strictEqual(createPatientRegistrationKey(base), normalized);
  });

  console.log(`\n🎉 ${passed}/${passed} patient registration idempotency tests passed.`);
}

runTests().catch(error => {
  console.error(error);
  process.exit(1);
});
