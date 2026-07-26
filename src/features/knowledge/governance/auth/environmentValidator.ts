/**
 * Phase 2.2D-S Fail-Closed Production Environment & Multi-Condition Migration Authorization Validator
 */

export interface EnvironmentValidationResult {
  valid: boolean;
  environment: 'development' | 'test' | 'staging' | 'production';
  projectId: string;
  emulatorActive: boolean;
  errors: string[];
}

export interface MigrationAuthorizationParams {
  environment: string;
  projectId: string;
  confirmationToken?: string;
  humanAuthorizerId?: string;
  approvalStatus?: 'pending' | 'approved';
  approvalEligible?: boolean;
  commitHash?: string;
  approvedCommitHash?: string;
  canonicalPayloadChecksum?: string;
  approvedChecksum?: string;
  componentChecksums?: Record<string, string>;
  approvedComponentChecksums?: Record<string, string>;
  backupConfirmationId?: string;
  stageSelection?: string;
  explicitCommandFlag?: boolean;
  unresolvedConflictCount?: number;
}

const PLACEHOLDER_SECRETS = new Set([
  'secret',
  'default',
  'change_me',
  'placeholder',
  '123456',
  'admin_secret',
  'development_secret_key',
  'test_secret'
]);

const TEST_PROJECT_PREFIXES = ['hh-test-', 'demo-', 'test-'];
const PRODUCTION_PROJECT_PATTERNS = ['production', 'prod', 'homeo-healthcare-prod'];
export const EMPTY_SHA256_HASH = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const APPROVED_PROD_PROJECTS = new Set(['homeo-healthcare-prod']);
const APPROVED_STAGING_PROJECTS = new Set(['homeo-healthcare-staging']);

/**
 * Validates runtime environment parameters and session secret security.
 * Fails closed if any security assumption is violated.
 */
export function validateGovernanceEnvironment(env: Record<string, string | undefined> = process.env): EnvironmentValidationResult {
  const errors: string[] = [];
  const nodeEnv = (env.NODE_ENV || 'development').toLowerCase();
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.GCP_PROJECT || env.FIREBASE_PROJECT_ID || '';
  const emulatorHost = env.FIRESTORE_EMULATOR_HOST || env.FIREBASE_AUTH_EMULATOR_HOST;
  const emulatorActive = Boolean(emulatorHost);
  const sessionSecret = env.ADMIN_SESSION_SECRET || env.JWT_SECRET || '';

  let normalizedEnv: 'development' | 'test' | 'staging' | 'production' = 'development';
  if (nodeEnv === 'production' || nodeEnv === 'prod') {
    normalizedEnv = 'production';
  } else if (nodeEnv === 'test') {
    normalizedEnv = 'test';
  } else if (nodeEnv === 'staging') {
    normalizedEnv = 'staging';
  } else if (nodeEnv !== 'development' && nodeEnv !== 'dev') {
    errors.push(`AMBIGUOUS_ENVIRONMENT: Unknown NODE_ENV value '${nodeEnv}'`);
  }

  // 1. Production cannot run with emulator flags
  if (normalizedEnv === 'production' && emulatorActive) {
    errors.push(`EMULATOR_IN_PRODUCTION: Production environment cannot be executed with emulator host '${emulatorHost}'`);
  }

  // 2. Project ID presence check
  if (!projectId) {
    errors.push('MISSING_PROJECT_ID: Firebase project ID is unconfigured');
  }

  // 3. Project ID environment boundary check
  const isTestProjectId = TEST_PROJECT_PREFIXES.some(prefix => projectId.startsWith(prefix));
  const isProdProjectId = PRODUCTION_PROJECT_PATTERNS.some(pat => projectId.includes(pat));

  if (normalizedEnv === 'production' && isTestProjectId) {
    errors.push(`TEST_PROJECT_IN_PRODUCTION: Production mode attempted with test project ID '${projectId}'`);
  }

  if (normalizedEnv === 'test' && isProdProjectId) {
    errors.push(`PRODUCTION_PROJECT_IN_TEST: Test mode attempted with production project ID '${projectId}'`);
  }

  // 4. Session secret entropy & placeholder checks
  if (normalizedEnv === 'production' || normalizedEnv === 'staging') {
    if (!sessionSecret) {
      errors.push('MISSING_SESSION_SECRET: Session secret is missing in production/staging environment');
    } else if (PLACEHOLDER_SECRETS.has(sessionSecret.toLowerCase())) {
      errors.push('PLACEHOLDER_SESSION_SECRET: Placeholder or default session secret detected');
    } else if (sessionSecret.length < 32) {
      errors.push('INSUFFICIENT_SECRET_ENTROPY: Session secret length must be at least 32 characters');
    }
  }

  return {
    valid: errors.length === 0,
    environment: normalizedEnv,
    projectId,
    emulatorActive,
    errors
  };
}

/**
 * Asserts environment validity; throws fail-closed error if invalid.
 */
export function assertGovernanceEnvironment(env: Record<string, string | undefined> = process.env): EnvironmentValidationResult {
  const res = validateGovernanceEnvironment(env);
  if (!res.valid) {
    throw new Error(`ENVIRONMENT_VALIDATION_FAILED: ${res.errors.join('; ')}`);
  }
  return res;
}

/**
 * Multi-condition gate validating authorization parameters before running migration scripts.
 * Static confirmation token alone is strictly INSUFFICIENT.
 * Staging authorization cannot authorize production migration.
 */
export function validateMigrationExecutionAuthorization(
  params: MigrationAuthorizationParams,
  env: Record<string, string | undefined> = process.env
): { authorized: boolean; reason?: string } {
  const envRes = validateGovernanceEnvironment(env);
  if (!envRes.valid) {
    return { authorized: false, reason: `Environment invalid: ${envRes.errors.join(', ')}` };
  }

  if (params.environment === 'production') {
    // 0. Project ID strict production allowlist check
    if (!APPROVED_PROD_PROJECTS.has(params.projectId)) {
      return {
        authorized: false,
        reason: `MIGRATION_UNAUTHORIZED: Project ID '${params.projectId}' is not in approved production allowlist`
      };
    }

    // 1. Static confirmation token check
    if (params.confirmationToken !== 'CONFIRM_PRODUCTION_MIGRATION_EXECUTION') {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Missing or invalid confirmationToken for production migration'
      };
    }

    // 2. Explicit command flag check
    if (params.explicitCommandFlag !== true) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Missing explicitCommandFlag=true'
      };
    }

    // 3. Authorizer identifier format validation
    if (!params.humanAuthorizerId || !params.humanAuthorizerId.startsWith('ADMIN-CONTRIB-')) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Missing or invalid humanAuthorizerId format for production migration'
      };
    }

    // 4. Approval status & eligibility check
    if (!params.approvalStatus || params.approvalStatus !== 'approved') {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Migration dry-run manifest is pending human approval (approvalStatus != approved)'
      };
    }

    if (params.approvalEligible === false) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Dry-run manifest is ineligible for approval (e.g. dirty working tree)'
      };
    }

    // 5. Commit hash match check
    if (!params.commitHash || !params.approvedCommitHash || params.commitHash !== params.approvedCommitHash) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Migration commit SHA mismatch'
      };
    }

    // 6. Checksum match & empty-hash rejection check
    if (!params.canonicalPayloadChecksum || params.canonicalPayloadChecksum === EMPTY_SHA256_HASH) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Empty or missing canonical payload checksum'
      };
    }

    if (!params.approvedChecksum || params.canonicalPayloadChecksum !== params.approvedChecksum) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Canonical payload checksum mismatch'
      };
    }

    // 7. Component checksums match check
    if (params.componentChecksums && params.approvedComponentChecksums) {
      for (const [key, val] of Object.entries(params.componentChecksums)) {
        if (params.approvedComponentChecksums[key] !== val) {
          return {
            authorized: false,
            reason: `MIGRATION_UNAUTHORIZED: Component checksum mismatch for ${key}`
          };
        }
      }
    }

    // 8. Backup / Restore exercise reference check
    if (!params.backupConfirmationId || params.backupConfirmationId.trim().length === 0) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Missing backupConfirmationId (Disaster recovery drill unverified)'
      };
    }

    // 9. Stage selection check
    if (!params.stageSelection || !['stage-0-readonly', 'stage-1-single-entity', 'stage-2-five-drafts', 'stage-3-public-exceptions', 'stage-4-full-migration'].includes(params.stageSelection)) {
      return {
        authorized: false,
        reason: 'MIGRATION_UNAUTHORIZED: Invalid or missing stageSelection'
      };
    }

    // 10. Unresolved conflict check
    if (params.unresolvedConflictCount !== undefined && params.unresolvedConflictCount > 0) {
      return {
        authorized: false,
        reason: `MIGRATION_UNAUTHORIZED: Unresolved migration conflicts remain (${params.unresolvedConflictCount})`
      };
    }
  } else if (params.environment === 'staging') {
    if (!APPROVED_STAGING_PROJECTS.has(params.projectId)) {
      return {
        authorized: false,
        reason: `MIGRATION_UNAUTHORIZED: Project ID '${params.projectId}' is not in approved staging allowlist`
      };
    }
  }

  return { authorized: true };
}
