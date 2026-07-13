export type PatientRegistrationFingerprintInput = {
  organizationId: string;
  clinicId?: string;
  createdBy: string;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
};

export type IdempotentSubmissionResult<T> = {
  value: T;
  reused: boolean;
};

type SubmissionEntry<T> = {
  promise: Promise<T>;
  expiresAt: number;
};

const normalizeText = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en");

/**
 * Creates an ephemeral application-layer key for one registration intent.
 * The key is never persisted, logged, or sent outside the current browser.
 */
export function createPatientRegistrationKey(
  input: PatientRegistrationFingerprintInput,
): string {
  return JSON.stringify([
    normalizeText(input.organizationId),
    normalizeText(input.clinicId ?? ""),
    normalizeText(input.createdBy),
    normalizeText(input.name),
    input.dateOfBirth.trim(),
    input.phone.replace(/\D/g, ""),
    normalizeText(input.email),
  ]);
}

/**
 * Coalesces concurrent submissions and reuses a recent successful result.
 * Failed operations are removed immediately so a deliberate retry can run.
 *
 * This belongs to the application layer so the frozen Patient domain remains
 * unchanged. A future durable registration API must enforce its own server-side
 * idempotency key as well.
 */
export class IdempotentSubmissionCoordinator<T> {
  private readonly entries = new Map<string, SubmissionEntry<T>>();

  constructor(
    private readonly successTtlMs = 30_000,
    private readonly now: () => number = Date.now,
  ) {}

  async run(key: string, operation: () => Promise<T>): Promise<IdempotentSubmissionResult<T>> {
    this.pruneExpired();

    const existing = this.entries.get(key);
    if (existing) {
      return { value: await existing.promise, reused: true };
    }

    const entry: SubmissionEntry<T> = {
      promise: Promise.resolve().then(operation),
      expiresAt: Number.POSITIVE_INFINITY,
    };
    this.entries.set(key, entry);

    try {
      const value = await entry.promise;
      entry.expiresAt = this.now() + this.successTtlMs;
      return { value, reused: false };
    } catch (error) {
      if (this.entries.get(key) === entry) {
        this.entries.delete(key);
      }
      throw error;
    }
  }

  private pruneExpired() {
    const currentTime = this.now();
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= currentTime) {
        this.entries.delete(key);
      }
    }
  }
}
