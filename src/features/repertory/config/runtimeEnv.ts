import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export type RepertoryRuntimeEnvironment = {
  mode: "test" | "development" | "emulator" | "staging" | "production";

  firebaseProjectId: string;
  firestoreEmulatorHost?: string;

  acquisitionRepositoryAdapter: "memory" | "firestore";
  activePointerRepositoryAdapter: "memory" | "firestore";
  artifactStoreAdapter: "temporary" | "local-readonly" | "object-storage";
  artifactRoot: string;

  // Legacy fields for backward compatibility
  acquisitionRepository: "memory" | "firestore";
  artifactStore: "local" | "gcs";
  activePointerRepository: "in-memory" | "local-file" | "firestore";
  firestoreProjectId?: string;
};

let currentEnv: RepertoryRuntimeEnvironment | null = null;
let testRunId: string | null = null;

export function getTestRunId(): string {
  if (!testRunId) {
    testRunId = `test-run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }
  return testRunId;
}

function parseRequiredProjectIdList(raw?: string): string[] {
  if (!raw) return ["homeo-healthcare"];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export function getRuntimeEnvironment(): RepertoryRuntimeEnvironment {
  if (currentEnv) return currentEnv;

  let mode: "test" | "development" | "emulator" | "staging" | "production" = "development";
  if (process.env.REPERTORY_RUNTIME_MODE === 'emulator' || process.env.REPERTORY_ENV === 'emulator') {
    mode = 'emulator';
  } else if (process.env.NODE_ENV === 'test') {
    mode = 'test';
  } else if (process.env.NODE_ENV === 'production') {
    mode = 'production';
  } else if (process.env.NODE_ENV === 'development') {
    mode = 'development';
  }



  let artifactRoot = process.env.REPERTORY_TEST_ARTIFACT_ROOT || path.join(process.cwd(), 'data', 'repertory');
  if (!process.env.REPERTORY_TEST_ARTIFACT_ROOT && (mode === 'test' || mode === 'emulator')) {
    const runId = getTestRunId();
    artifactRoot = path.join(os.tmpdir(), 'homeo-repertory-tests', runId);
    if (!fs.existsSync(artifactRoot)) {
      fs.mkdirSync(artifactRoot, { recursive: true });
    }
  } else if (process.env.REPERTORY_TEST_ARTIFACT_ROOT) {
    if (!fs.existsSync(artifactRoot)) {
      fs.mkdirSync(artifactRoot, { recursive: true });
    }
  }

  const firebaseProjectId = process.env.FIRESTORE_PROJECT_ID || process.env.GCP_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id";
  const firestoreEmulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

  let acquisitionRepositoryAdapter: "memory" | "firestore" = (mode === 'test' ? 'memory' : 'firestore');
  let activePointerRepositoryAdapter: "memory" | "firestore" = (mode === 'test' ? 'memory' : 'firestore');
  let artifactStoreAdapter: "temporary" | "local-readonly" | "object-storage" = (mode === 'test' ? 'temporary' : 'local-readonly');

  if (mode === 'emulator') {
    acquisitionRepositoryAdapter = 'firestore';
    activePointerRepositoryAdapter = 'firestore';
    artifactStoreAdapter = 'local-readonly';
  }

  if (process.env.REPERTORY_ACQUISITION_REPO === 'memory') acquisitionRepositoryAdapter = 'memory';
  if (process.env.REPERTORY_ACQUISITION_REPO === 'firestore') acquisitionRepositoryAdapter = 'firestore';

  if (process.env.REPERTORY_POINTER_REPO === 'memory') activePointerRepositoryAdapter = 'memory';
  if (process.env.REPERTORY_POINTER_REPO === 'firestore') activePointerRepositoryAdapter = 'firestore';

  if (process.env.REPERTORY_ARTIFACT_STORE === 'temporary') artifactStoreAdapter = 'temporary';
  if (process.env.REPERTORY_ARTIFACT_STORE === 'local-readonly') artifactStoreAdapter = 'local-readonly';
  if (process.env.REPERTORY_ARTIFACT_STORE === 'object-storage') artifactStoreAdapter = 'object-storage';

  currentEnv = {
    mode,
    firebaseProjectId,
    firestoreEmulatorHost,
    acquisitionRepositoryAdapter,
    activePointerRepositoryAdapter,
    artifactStoreAdapter,
    artifactRoot,

    // Legacy fields
    acquisitionRepository: acquisitionRepositoryAdapter === 'memory' ? 'memory' : 'firestore',
    artifactStore: artifactStoreAdapter === 'object-storage' ? 'gcs' : 'local',
    activePointerRepository: activePointerRepositoryAdapter === 'memory' ? 'in-memory' : 'firestore',
    firestoreProjectId: firebaseProjectId
  };

  validateEnvironment(currentEnv);

  // Safe Startup Logging
  if (currentEnv.mode === 'emulator') {
    console.log("====================================================");
    console.log("ℹ️ Firestore Emulator Environment Active");
    console.log(`  Runtime Mode: ${currentEnv.mode}`);
    console.log(`  Emulator Host: ${currentEnv.firestoreEmulatorHost}`);
    console.log(`  Emulator Project ID: ${currentEnv.firebaseProjectId}`);
    console.log(`  Acquisition Repo Adapter: ${currentEnv.acquisitionRepositoryAdapter}`);
    console.log(`  Pointer Repo Adapter: ${currentEnv.activePointerRepositoryAdapter}`);
    console.log(`  Artifact Store Adapter: ${currentEnv.artifactStoreAdapter}`);
    console.log(`  Isolated Artifact Root: ${currentEnv.artifactRoot}`);
    console.log("====================================================");
  }

  return currentEnv;
}

export function validateEnvironment(env: RepertoryRuntimeEnvironment): void {
  const productionProjectIds = parseRequiredProjectIdList(process.env.REPERTORY_PRODUCTION_FIREBASE_PROJECT_IDS);

  if (env.mode === 'production') {
    if (env.acquisitionRepositoryAdapter === 'memory') {
      throw new Error("Production Guard: In-memory acquisition repository is rejected in production.");
    }
    if (env.activePointerRepositoryAdapter === 'memory') {
      throw new Error("Production Guard: In-memory active pointer repository is rejected in production.");
    }
    if (env.artifactStoreAdapter === 'temporary') {
      throw new Error("Production Guard: Temporary artifact store is rejected in production.");
    }
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      throw new Error("Production Guard: Firestore emulator host is rejected in production.");
    }
  }

  if (env.artifactStoreAdapter === 'object-storage') {
    const bucketName = process.env.REPERTORY_ARTIFACT_BUCKET?.trim();
    if (!bucketName) {
      throw new Error("Artifact Store Guard: REPERTORY_ARTIFACT_BUCKET is required for object-storage mode.");
    }
    if (!/^[a-z0-9][a-z0-9._-]{1,220}[a-z0-9]$/.test(bucketName)) {
      throw new Error("Artifact Store Guard: REPERTORY_ARTIFACT_BUCKET is invalid.");
    }

    const prefixSegments = (process.env.REPERTORY_ARTIFACT_PREFIX || 'repertory')
      .replace(/\\/g, '/')
      .split('/')
      .filter(Boolean);
    if (
      prefixSegments.length === 0 ||
      prefixSegments.some((segment) => segment === '.' || segment === '..')
    ) {
      throw new Error("Artifact Store Guard: REPERTORY_ARTIFACT_PREFIX is invalid.");
    }
  }

  if (env.mode === 'emulator' || process.env.REPERTORY_RUNTIME_MODE === 'emulator') {
    if (process.env.REPERTORY_RUNTIME_MODE !== 'emulator') {
      throw new Error("Emulator Guard: REPERTORY_RUNTIME_MODE must be set to 'emulator'.");
    }
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      throw new Error("Emulator Guard: FIRESTORE_EMULATOR_HOST must be set in emulator mode.");
    }
    const explicitProductionIds = ["homeo-healthcare", ...productionProjectIds];
    if (explicitProductionIds.includes(env.firebaseProjectId)) {
      throw new Error(`Emulator Guard: Emulator mode cannot use a production project ID (${env.firebaseProjectId}).`);
    }
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error("Emulator Guard: Production service account credentials are not allowed in emulator mode.");
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error("Emulator Guard: Production application credentials (GOOGLE_APPLICATION_CREDENTIALS) are not allowed in emulator mode.");
    }
    if (env.acquisitionRepositoryAdapter === 'memory') {
      throw new Error("Emulator Guard: In-memory acquisition repository is rejected in emulator mode.");
    }
    if (env.activePointerRepositoryAdapter === 'memory') {
      throw new Error("Emulator Guard: In-memory active pointer repository is rejected in emulator mode.");
    }
    if (env.artifactStoreAdapter === 'object-storage') {
      throw new Error("Emulator Guard: Production object-storage/GCS artifact store is rejected in emulator mode.");
    }
  }

  if (env.mode === 'test') {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIRESTORE_EMULATOR_HOST) {
      throw new Error("Test Guard: Production credentials detected in test mode without Firestore emulator host configuration.");
    }
  }
}

export function resetRuntimeEnvironment(): void {
  currentEnv = null;
  testRunId = null;
}
