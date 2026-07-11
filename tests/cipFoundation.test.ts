import assert from "assert";

// Shared Foundation Primitives
import { toPatientId, toEpisodeId } from "../src/shared/domain/identifiers";
import { DomainEventDispatcher, DomainEvent } from "../src/shared/events/eventDispatcher";
import { ValidationError, UnauthorizedError } from "../src/shared/errors/domainErrors";

// Patient Feature
import { 
  Patient, PatientDemographics, 
  MockPatientRepository, PatientService 
} from "../src/features/patient";

// Allergy Feature
import { 
  AllergyIntolerance, AllergyCategory, 
  MockAllergyRepository, AllergyService 
} from "../src/features/allergy";

// Consent Feature
import { 
  PatientConsent, ConsentType, 
  MockConsentRepository, ConsentService 
} from "../src/features/consent";

// Episode Feature
import { 
  TreatmentEpisode, 
  MockEpisodeRepository, EpisodeService 
} from "../src/features/treatment-episode";

// RBAC Engine
import { RbacEngine } from "../src/server/authorization/rbacEngine";
import { UserSession } from "../src/shared/domain/permissions";

// AI Schemas
import { AiTaskRequestSchema } from "../src/features/ai/schemas/ai.schema";
import { AiTaskRequest } from "../src/features/ai/domain/ai.types";

// Offline sync
import { MockSyncQueueRepository } from "../src/features/offline-sync";

async function runTests() {
  console.log("🚀 Starting Clinical Intelligence Platform Foundation Test Suite...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  // Set up mock instances
  const patientRepo = new MockPatientRepository();
  const allergyRepo = new MockAllergyRepository();
  const consentRepo = new MockConsentRepository();
  const episodeRepo = new MockEpisodeRepository();

  const patientService = new PatientService(patientRepo);
  const allergyService = new AllergyService(allergyRepo);
  const consentService = new ConsentService(consentRepo);
  const episodeService = new EpisodeService(episodeRepo);

  // 1. Patient Register and Validation Tests
  await test("PatientService: should register a valid patient and dispatch event", async () => {
    let eventReceived: DomainEvent | null = null;
    const listener = (e: DomainEvent) => { eventReceived = e; };
    DomainEventDispatcher.subscribe("patient.created", listener);

    const demographics: PatientDemographics = {
      name: "Aarav Sharma",
      dateOfBirth: "1988-05-15",
      gender: "male",
      phone: "9876543210",
      email: "aarav.sharma@example.com",
      address: "MG Road, Pune",
      emergencyContact: {
        name: "Priya Sharma",
        phone: "9876543211",
        relationship: "Spouse"
      }
    };

    const patient = await patientService.registerPatient({
      organizationId: "org_homeo_premium",
      clinicId: "clinic_pune_baner",
      createdBy: "doc_jethwani",
      demographics
    });

    assert.strictEqual(patient.name, "Aarav Sharma");
    assert.strictEqual(patient.gender, "male");
    assert.ok(patient.uhid.startsWith("P-"));
    assert.strictEqual(patient.recordVersion, 0);

    // Event checking
    assert.ok(eventReceived);
    assert.strictEqual((eventReceived as DomainEvent).eventType, "patient.created");
    assert.strictEqual((eventReceived as DomainEvent).payload["patientId"], patient.id);

    DomainEventDispatcher.unsubscribe("patient.created", listener);
  });

  await test("PatientService: should reject invalid email format", async () => {
    const demographics: PatientDemographics = {
      name: "Aarav Sharma",
      dateOfBirth: "1988-05-15",
      gender: "male",
      phone: "9876543210",
      email: "invalid-email-format",
      address: "MG Road, Pune",
      emergencyContact: {
        name: "Priya Sharma",
        phone: "9876543211",
        relationship: "Spouse"
      }
    };

    await assert.rejects(
      async () => {
        await patientService.registerPatient({
          organizationId: "org_homeo_premium",
          createdBy: "doc_jethwani",
          demographics
        });
      },
      ValidationError
    );
  });

  // 2. Structured Allergy Intolerance Tests
  await test("AllergyService: should record structured allergy and fetch it", async () => {
    const allergy = await allergyService.recordAllergy({
      organizationId: "org_homeo_premium",
      patientId: "pat_aarav_sharma",
      substanceText: "Aspirin",
      category: "medication",
      criticality: "high",
      reactionDescriptions: ["Asthma attack", "Hives"],
      createdBy: "doc_jethwani"
    });

    assert.strictEqual(allergy.substanceText, "Aspirin");
    assert.strictEqual(allergy.category, "medication");
    assert.strictEqual(allergy.criticality, "high");

    const patientAllergies = await allergyService.getPatientAllergies("pat_aarav_sharma");
    assert.strictEqual(patientAllergies.length, 1);
    assert.strictEqual(patientAllergies[0].substanceText, "Aspirin");
  });

  // 3. Versioned Consent & Restrictive Overwrite Conflict Resolution Tests
  await test("ConsentService: should record versioned consents and handle restrictive conflict overrides", async () => {
    // 3a. Record consent v0
    const consentV0 = await consentService.recordConsent({
      organizationId: "org_homeo_premium",
      patientId: "pat_aarav",
      consentType: "ai_processing",
      granted: true,
      policyVersion: "v1.0.0",
      language: "en",
      capturedBy: "doc_jethwani",
      captureMethod: "digital_signature"
    });

    assert.strictEqual(consentV0.recordVersion, 0);
    assert.strictEqual(consentV0.granted, true);

    const verified = await consentService.verifyConsent("pat_aarav", "ai_processing");
    assert.strictEqual(verified, true);

    // 3b. Record consent v1 (Withdrawn)
    const consentV1 = await consentService.recordConsent({
      organizationId: "org_homeo_premium",
      patientId: "pat_aarav",
      consentType: "ai_processing",
      granted: false,
      policyVersion: "v1.0.0",
      language: "en",
      capturedBy: "doc_jethwani",
      captureMethod: "digital_signature"
    });

    assert.strictEqual(consentV1.recordVersion, 1);
    assert.strictEqual(consentV1.granted, false);

    const verifiedV1 = await consentService.verifyConsent("pat_aarav", "ai_processing");
    assert.strictEqual(verifiedV1, false);

    // 3c. Reconcile conflict - granted: false must override granted: true (Restrictive Override Policy)
    const resolved = await consentService.resolveConsentConflict(consentV0, consentV1);
    assert.strictEqual(resolved.granted, false, "Withdrawn consent must override granted consent in conflict resolution");
  });

  // 4. Treatment Episode Tests
  await test("EpisodeService: should start and close clinical treatment episodes", async () => {
    const episode = await episodeService.startEpisode({
      organizationId: "org_homeo_premium",
      patientId: "pat_aarav",
      title: "GERD Chronic Case",
      conditionConceptIds: ["concept_gerd_001"],
      primaryPractitionerId: "doc_jethwani",
      createdBy: "doc_jethwani"
    });

    assert.strictEqual(episode.title, "GERD Chronic Case");
    assert.strictEqual(episode.status, "active");

    const closed = await episodeService.closeEpisode(episode.id, "doc_jethwani", "Acid reflux resolved with Nux Vomica.");
    assert.strictEqual(closed.status, "resolved");
    assert.strictEqual(closed.resolutionSummary, "Acid reflux resolved with Nux Vomica.");
  });

  // 5. Server-side RBAC and Scoping Authorization Tests
  await test("RbacEngine: should enforce organization bounds and clinic scope checks", () => {
    const session: UserSession = {
      userId: "doc_jethwani",
      organizationId: "org_homeo_premium",
      clinicId: "clinic_pune",
      role: "doctor",
      associatedClinicIds: ["clinic_pune"]
    };

    // Valid: same org, same clinic
    const isAuth = RbacEngine.authorize(session, "read_emr", {
      organizationId: "org_homeo_premium",
      clinicId: "clinic_pune"
    });
    assert.ok(isAuth);

    // Invalid: cross-organization access
    assert.throws(
      () => {
        RbacEngine.authorize(session, "read_emr", {
          organizationId: "org_cross_tenant_fake",
          clinicId: "clinic_pune"
        });
      },
      UnauthorizedError
    );

    // Invalid: clinic mismatch for standard doctor role
    assert.throws(
      () => {
        RbacEngine.authorize(session, "read_emr", {
          organizationId: "org_homeo_premium",
          clinicId: "clinic_mumbai_fake"
        });
      },
      UnauthorizedError
    );
  });

  await test("RbacEngine: should allow access through break-glass workflow logic", () => {
    const session: UserSession = {
      userId: "doc_guest_consultant",
      organizationId: "org_homeo_premium",
      clinicId: "clinic_mumbai",
      role: "receptionist", // Receptionists lack standard read_emr authorization
      associatedClinicIds: ["clinic_mumbai"]
    };

    // Check normal access fails
    assert.throws(
      () => {
        RbacEngine.authorize(session, "read_emr", {
          organizationId: "org_homeo_premium",
          clinicId: "clinic_mumbai",
          patientId: "pat_aarav"
        });
      },
      UnauthorizedError
    );

    // Check break-glass bypasses standard block
    const glassSession = {
      id: "bg_123",
      practitionerId: "doc_guest_consultant",
      patientId: "pat_aarav",
      reason: "Emergency case review in workshop",
      justificationText: "Attending senior case review audit",
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString() // Valid 1 hr
    };

    const isAuthorizedBreakGlass = RbacEngine.authorize(
      session,
      "read_emr",
      {
        organizationId: "org_homeo_premium",
        clinicId: "clinic_mumbai",
        patientId: "pat_aarav"
      },
      glassSession
    );
    assert.ok(isAuthorizedBreakGlass);
  });

  // 6. AI Task Request Schema Validation Tests
  await test("AiTaskRequestSchema: should validate task-specific structured contexts", () => {
    const validCompletenessRequest: AiTaskRequest = {
      taskType: "completeness",
      schemaVersion: 1,
      organizationId: "org_homeo_premium",
      patientId: "pat_aarav",
      encounterId: "enc_123",
      consentVerificationStatus: true,
      requestedOutputSchemaVersion: 1,
      clinicalDataSnapshot: {
        chiefComplaintPresent: true,
        vitalsCount: 3,
        notesLength: 150
      }
    };

    const parseResult = AiTaskRequestSchema.safeParse(validCompletenessRequest);
    assert.ok(parseResult.success);

    // Invalid: missing clinicalDataSnapshot fields
    const invalidRequest = {
      taskType: "completeness",
      schemaVersion: 1,
      organizationId: "org_homeo_premium",
      patientId: "pat_aarav",
      encounterId: "enc_123",
      consentVerificationStatus: true,
      requestedOutputSchemaVersion: 1,
      clinicalDataSnapshot: {
        notesLength: 150 // Missing vital counts
      }
    };
    const badParse = AiTaskRequestSchema.safeParse(invalidRequest);
    assert.ok(!badParse.success);
  });

  // 7. Offline sync operation enqueuing test
  await test("MockSyncQueueRepository: should enqueue and dequeue sync operation", async () => {
    const syncRepo = new MockSyncQueueRepository();
    const op = {
      operationId: "op_01",
      entityId: "pat_aarav",
      entityType: "patients",
      organizationId: "org_homeo_premium",
      baseVersion: 1,
      clientTimestamp: new Date().toISOString(),
      actorId: "doc_jethwani",
      deviceId: "chrome_desktop_baner",
      operationType: "update" as const,
      retryCount: 0,
      syncStatus: "pending" as const,
      payload: { name: "Aarav Sharma Updated" }
    };

    await syncRepo.enqueue(op);
    const pending = await syncRepo.peekPending();
    assert.strictEqual(pending.length, 1);
    assert.strictEqual(pending[0].entityId, "pat_aarav");

    await syncRepo.dequeue("op_01");
    const after = await syncRepo.peekPending();
    assert.strictEqual(after.length, 0);
  });

  console.log(`\n🏁 Test suite finished. Passed: ${passedCount}, Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
