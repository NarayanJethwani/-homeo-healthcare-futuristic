/**
 * Phase 2.2C Fail-Closed Environment & Migration Safety Test Suite
 */

import assert from "node:assert/strict";
import {
  validateGovernanceEnvironment,
  validateMigrationExecutionAuthorization
} from "../src/features/knowledge/governance/auth/environmentValidator";

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`✅ TEST PASSED: ${name}`);
  } catch (err: any) {
    console.error(`❌ TEST FAILED: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function run() {
  console.log("🚀 Starting Governance Environment Safety Tests...\n");

  await test("1. Production environment rejects emulator variables", () => {
    const res = validateGovernanceEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod",
      FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
      ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min"
    });

    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some(e => e.includes("EMULATOR_IN_PRODUCTION")));
  });

  await test("2. Test mode rejects production project ID", () => {
    const res = validateGovernanceEnvironment({
      NODE_ENV: "test",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod"
    });

    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some(e => e.includes("PRODUCTION_PROJECT_IN_TEST")));
  });

  await test("3. Production mode rejects test project ID", () => {
    const res = validateGovernanceEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "hh-test-12345"
    });

    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some(e => e.includes("TEST_PROJECT_IN_PRODUCTION")));
  });

  await test("4. Production mode rejects placeholder or short session secret", () => {
    const placeholderRes = validateGovernanceEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod",
      ADMIN_SESSION_SECRET: "change_me"
    });
    assert.strictEqual(placeholderRes.valid, false);
    assert.ok(placeholderRes.errors.some(e => e.includes("PLACEHOLDER_SESSION_SECRET")));

    const shortRes = validateGovernanceEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod",
      ADMIN_SESSION_SECRET: "short_secret"
    });
    assert.strictEqual(shortRes.valid, false);
    assert.ok(shortRes.errors.some(e => e.includes("INSUFFICIENT_SECRET_ENTROPY")));
  });

  await test("5. Production migration requires explicit multi-condition authorization gate", () => {
    const prodEnv = {
      NODE_ENV: "production",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod",
      ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min"
    };

    const unauthRes = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod"
    }, prodEnv);
    assert.strictEqual(unauthRes.authorized, false);

    const validProdRes = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "approved",
      commitHash: "378d465c05667c178958dd703bfb365245c28293",
      approvedCommitHash: "378d465c05667c178958dd703bfb365245c28293",
      canonicalPayloadChecksum: "bb107097928197bfb816b5c86f626455298fbfc5823530cc5b73ba65c66b5003",
      approvedChecksum: "bb107097928197bfb816b5c86f626455298fbfc5823530cc5b73ba65c66b5003",
      backupConfirmationId: "DRILL-VERIFIED-001",
      stageSelection: "stage-0-readonly"
    }, prodEnv);
    assert.strictEqual(validProdRes.authorized, true);
  });

  console.log("🎉 Governance Environment Safety Tests Passed!");
}

if (require.main === module) {
  run();
}
