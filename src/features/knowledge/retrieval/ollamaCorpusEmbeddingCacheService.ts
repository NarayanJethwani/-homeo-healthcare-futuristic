import crypto from "crypto";
import path from "path";
import { FileSystemAdapter, NodeFileSystemAdapter, validateAndCanonicalizePath, fsyncParentDirectory } from "./adapters/FileSystemAdapter";
import { RuntimePolicyAdapter, DefaultRuntimePolicyAdapter } from "./adapters/RuntimePolicyAdapter";
import { ICorpusEligibilityRegistry, defaultCorpusEligibilityRegistry } from "./CorpusEligibilityRegistry";
import { canonicalJsonStringify, buildCanonicalEmbeddingText } from "./canonicalEmbeddingText";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { ollamaService } from "@/lib/ollama";

export interface ShardedCacheRecord {
  schemaVersion: "1.0.0";
  modelDigest: string;
  dimensions: number;
  normalization: "L2_NORM_V1";
  contentHash: string;
  vector: number[];
  createdAt: number;
  recordChecksum: string;
}

export interface CacheManifestEntry {
  entryPath: string; // Relative to v1Root
  accessedAt: number;
  bytes: number;
  checksum: string;
}

export interface CacheManifestSchema {
  schemaVersion: "1.0.0";
  modelDigest: string;
  dimensions: number;
  normalization: "L2_NORM_V1";
  entries: Record<string, CacheManifestEntry>;
  totalSizeBytes: number;
  manifestChecksum: string;
}

export type CacheResultStatus = "hit" | "generated" | "bypass";

export interface CorpusEmbeddingResult {
  status: CacheResultStatus;
  vector?: number[];
  provider?: "ollama";
  source?: "cache" | "provider";
  dims?: number;
  contentHash?: string;
  publishedVersionId?: string;
  reasonCode?:
    | "NOT_ELIGIBLE"
    | "MODEL_UNAVAILABLE"
    | "PROVIDER_FAILURE"
    | "INTEGRITY_FAILURE"
    | "LOCK_LOST_FAILURE"
    | "CACHE_DISABLED"
    | "REPOSITORY_RESOLUTION_FAILED"
    | "DIMENSION_MISMATCH";
}

export interface EvictionPlan {
  projectedManifest: CacheManifestSchema;
  deletionPlan: string[];
  evictionCount: number;
}

const TTL_MS = 30 * 24 * 3600 * 1000; // 30 days
const HEX_SHARD_REGEX = /^[0-9a-f]{2}$/;
const HEX_ENTRY_REGEX = /^[0-9a-f]{64}\.json$/;
export const MAX_GLOBAL_SCAN_FILES = 500;

export class OllamaCorpusEmbeddingCacheService {
  private readonly telemetry = {
    hits: 0,
    misses: 0,
    bypasses: 0,
    evictions: 0,
    corruptions: 0
  };

  private readonly latencies: number[] = [];

  constructor(
    private readonly fsAdapter: FileSystemAdapter,
    private readonly runtimeAdapter: RuntimePolicyAdapter,
    private readonly eligibilityRegistry: ICorpusEligibilityRegistry = defaultCorpusEligibilityRegistry
  ) {}

  public async getCorpusEmbedding(entityId: string): Promise<CorpusEmbeddingResult> {
    const startTime = Date.now();

    // 1. Server-Side Authoritative Resolution from globalKmsRepository
    const entity = await globalKmsRepository.getEntity(entityId);
    if (!entity) {
      this.incrementTelemetry("bypasses");
      return { status: "bypass", reasonCode: "REPOSITORY_RESOLUTION_FAILED" };
    }

    const publishedVersionId = entity.publishedVersionId || entity.versionInfo?.version;
    if (!publishedVersionId) {
      this.incrementTelemetry("bypasses");
      return { status: "bypass", reasonCode: "REPOSITORY_RESOLUTION_FAILED" };
    }

    // 2. Authoritative Eligibility Check
    const isEligible = this.eligibilityRegistry.isEligible(entityId, publishedVersionId, entity.entityType);
    if (!isEligible) {
      this.incrementTelemetry("bypasses");
      return { status: "bypass", reasonCode: "NOT_ELIGIBLE" };
    }

    // 3. Strict Ollama Model & System Health Verification
    let modelDescriptor;
    try {
      modelDescriptor = await ollamaService.getModelDescriptor();
    } catch {
      this.incrementTelemetry("bypasses");
      return { status: "bypass", reasonCode: "MODEL_UNAVAILABLE" };
    }

    // 4. Derive Authoritative Canonical Embedding Text
    const canonicalText = buildCanonicalEmbeddingText(entity);

    // 5. Derive Immutable Content & Key Hashes
    const contentHash = crypto.createHash("sha256").update(canonicalText).digest("hex");

    // Key Hash includes: entityId, publishedVersionId, modelName, modelDigest, dimensions, normalization, contentHash
    const keyMaterial = [
      entityId,
      publishedVersionId,
      modelDescriptor.modelName,
      modelDescriptor.modelDigest,
      modelDescriptor.expectedDimensions.toString(),
      modelDescriptor.normalizationEnum,
      contentHash
    ].join("|");

    const keyHash = crypto.createHash("sha256").update(keyMaterial).digest("hex");

    // Check runtime policy: If cache is disabled, execute uncached generation with zero disk I/O
    if (!this.runtimeAdapter.isCacheEnabled()) {
      return this.executeUncachedGeneration(canonicalText, modelDescriptor, publishedVersionId, contentHash, startTime);
    }

    const rawCacheDir = this.runtimeAdapter.getCacheDirectory();
    const cacheRoot = validateAndCanonicalizePath(rawCacheDir, rawCacheDir, this.fsAdapter);
    const v1Root = validateAndCanonicalizePath(path.join(cacheRoot, "v1"), cacheRoot, this.fsAdapter);

    const shard = keyHash.substring(0, 2);
    const entryDir = validateAndCanonicalizePath(path.join(v1Root, "entries", shard), cacheRoot, this.fsAdapter);
    const entryPath = validateAndCanonicalizePath(path.join(entryDir, `${keyHash}.json`), cacheRoot, this.fsAdapter);

    // 6. Fast Path: Cache Hit Check with 6-Point Complete Validation
    const validationResult = this.validateCacheEntry(entryPath, keyHash, contentHash, modelDescriptor, cacheRoot);
    if (validationResult.valid && validationResult.record) {
      this.incrementTelemetry("hits");
      this.recordLatency(startTime);
      this.updateAccessEpochUnderLock(keyHash, cacheRoot);

      return {
        status: "hit",
        vector: validationResult.record.vector,
        provider: "ollama",
        source: "cache",
        dims: validationResult.record.dimensions,
        contentHash,
        publishedVersionId
      };
    }

    // 7. Lock-Based Concurrent Execution & Cache Miss Path
    this.incrementTelemetry("misses");
    return this.executeGenerationUnderLock(
      keyHash,
      contentHash,
      publishedVersionId,
      canonicalText,
      modelDescriptor,
      entryPath,
      v1Root,
      cacheRoot,
      startTime
    );
  }

  /**
   * Complete 6-Point Integrity Validator used by both Cache Hit and Lock Polling paths.
   */
  private validateCacheEntry(
    entryPath: string,
    keyHash: string,
    contentHash: string,
    modelDescriptor: any,
    cacheRoot: string
  ): { valid: boolean; record?: ShardedCacheRecord } {
    try {
      if (!this.fsAdapter.existsSync(entryPath)) return { valid: false };

      const stat = this.fsAdapter.lstatSync(entryPath);
      if (stat.size > this.runtimeAdapter.getMaxEntrySizeBytes()) {
        this.quarantineCorruptFile(entryPath, cacheRoot);
        return { valid: false };
      }

      const rawJson = this.fsAdapter.readFileSync(entryPath, "utf-8");
      const record: ShardedCacheRecord = JSON.parse(rawJson);

      // Check 1: Schema Version & Descriptors
      if (
        record.schemaVersion !== "1.0.0" ||
        record.normalization !== "L2_NORM_V1" ||
        record.modelDigest !== modelDescriptor.modelDigest ||
        record.dimensions !== modelDescriptor.expectedDimensions ||
        record.contentHash !== contentHash
      ) {
        return { valid: false };
      }

      // Check 2: 30-Day TTL Expiration
      if (Date.now() - record.createdAt > TTL_MS) {
        try {
          this.fsAdapter.unlinkSync(entryPath);
          this.incrementTelemetry("evictions");
        } catch {}
        return { valid: false };
      }

      // Check 3: Finite Number Verification
      if (!Array.isArray(record.vector) || record.vector.length !== modelDescriptor.expectedDimensions) {
        return { valid: false };
      }

      for (let i = 0; i < record.vector.length; i++) {
        const val = record.vector[i];
        if (typeof val !== "number" || !Number.isFinite(val)) {
          this.quarantineCorruptFile(entryPath, cacheRoot);
          return { valid: false };
        }
      }

      // Check 4: Checksum Integrity
      const expectedChecksum = this.computeRecordChecksum(record);
      if (record.recordChecksum !== expectedChecksum) {
        this.quarantineCorruptFile(entryPath, cacheRoot);
        return { valid: false };
      }

      // Check 5: Committed Manifest Membership & Relative Path Validation
      const manifest = this.loadOrCreateManifest(cacheRoot);
      const manifestEntry = manifest.entries[keyHash];
      if (!manifestEntry) return { valid: false };

      // Reject empty, absolute, or traversal paths in manifest
      if (
        !manifestEntry.entryPath ||
        path.isAbsolute(manifestEntry.entryPath) ||
        manifestEntry.entryPath.includes("..")
      ) {
        return { valid: false };
      }

      const v1Root = path.join(cacheRoot, "v1");
      const expectedRelativePath = path.normalize(path.relative(v1Root, entryPath));
      const normalizedManifestPath = path.normalize(manifestEntry.entryPath);

      if (normalizedManifestPath !== expectedRelativePath) {
        return { valid: false };
      }

      if (
        manifestEntry.checksum !== expectedChecksum ||
        manifestEntry.bytes !== stat.size
      ) {
        return { valid: false };
      }

      return { valid: true, record };
    } catch {
      return { valid: false };
    }
  }

  private async executeUncachedGeneration(
    canonicalText: string,
    modelDescriptor: any,
    publishedVersionId: string,
    contentHash: string,
    startTime: number
  ): Promise<CorpusEmbeddingResult> {
    try {
      const vector = await ollamaService.getRawCorpusEmbedding(canonicalText);
      if (vector.length !== modelDescriptor.expectedDimensions) {
        return { status: "bypass", reasonCode: "DIMENSION_MISMATCH" };
      }

      this.recordLatency(startTime);
      return {
        status: "generated",
        vector,
        provider: "ollama",
        source: "provider",
        dims: vector.length,
        contentHash,
        publishedVersionId
      };
    } catch {
      return { status: "bypass", reasonCode: "PROVIDER_FAILURE" };
    }
  }

  private async executeGenerationUnderLock(
    keyHash: string,
    contentHash: string,
    publishedVersionId: string,
    canonicalText: string,
    modelDescriptor: any,
    entryPath: string,
    v1Root: string,
    cacheRoot: string,
    startTime: number
  ): Promise<CorpusEmbeddingResult> {
    const lockPath = path.join(v1Root, "cache.lock");
    const ownerToken = crypto.randomUUID();
    const expiresAt = Date.now() + 30000;

    if (!this.fsAdapter.existsSync(v1Root)) {
      this.fsAdapter.mkdirSync(v1Root, { recursive: true, mode: this.runtimeAdapter.getDirectoryMode() });
    }

    const lockPayload = JSON.stringify({
      ownerToken,
      timestamp: Date.now(),
      expiresAt
    });

    let currentInode: number | null = null;
    let acquired = false;

    // Acquire lock or wait via polling
    for (let attempt = 0; attempt < 100; attempt++) {
      const pollingValidation = this.validateCacheEntry(entryPath, keyHash, contentHash, modelDescriptor, cacheRoot);
      if (pollingValidation.valid && pollingValidation.record) {
        this.incrementTelemetry("hits");
        this.recordLatency(startTime);
        return {
          status: "hit",
          vector: pollingValidation.record.vector,
          provider: "ollama",
          source: "cache",
          dims: pollingValidation.record.dimensions,
          contentHash,
          publishedVersionId
        };
      }

      const lockRes = this.fsAdapter.atomicAcquireLock(lockPath, lockPayload);
      if (lockRes.acquired) {
        acquired = true;
        currentInode = lockRes.inode;
        break;
      }

      // Check for crashed / expired lock owner and safely reclaim lock
      if (this.fsAdapter.existsSync(lockPath)) {
        try {
          const lockStat = this.fsAdapter.lstatSync(lockPath);
          const rawLockContent = this.fsAdapter.readFileSync(lockPath, "utf-8");
          const parsedLock = JSON.parse(rawLockContent);
          if (
            parsedLock &&
            typeof parsedLock.expiresAt === "number" &&
            Date.now() > parsedLock.expiresAt &&
            typeof parsedLock.ownerToken === "string"
          ) {
            const reclaimRes = this.fsAdapter.atomicReclaimExpiredLock(
              lockPath,
              parsedLock.ownerToken,
              lockStat.ino,
              parsedLock.expiresAt,
              lockPayload
            );
            if (reclaimRes.acquired) {
              acquired = true;
              currentInode = reclaimRes.inode;
              break;
            }
          }
        } catch {}
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (!acquired || currentInode === null) {
      return { status: "bypass", reasonCode: "LOCK_LOST_FAILURE" };
    }

    let isLost = false;

    const verifyLockActive = (): boolean => {
      if (isLost) return false;
      const renewedPayload = JSON.stringify({
        ownerToken,
        timestamp: Date.now(),
        expiresAt: Date.now() + 30000
      });
      const updateRes = this.fsAdapter.atomicUpdateLock(lockPath, ownerToken, currentInode!, renewedPayload);
      if (!updateRes.updated) {
        isLost = true;
        return false;
      }
      currentInode = updateRes.inode;
      return true;
    };

    // Background Heartbeat for lock renewal during long generation
    const renewalInterval = setInterval(() => {
      verifyLockActive();
    }, 10000);

    let tempPath: string | null = null;
    let entryPublished = false;

    try {
      this.cleanupStaleTempFiles(v1Root, cacheRoot);

      // Strict Ollama Generation
      const vector = await ollamaService.getRawCorpusEmbedding(canonicalText);

      // Lock Check #1: Post-Provider Generation
      if (!verifyLockActive()) {
        return { status: "bypass", reasonCode: "LOCK_LOST_FAILURE" };
      }

      if (vector.length !== modelDescriptor.expectedDimensions) {
        return { status: "bypass", reasonCode: "DIMENSION_MISMATCH" };
      }

      const record: ShardedCacheRecord = {
        schemaVersion: "1.0.0",
        modelDigest: modelDescriptor.modelDigest,
        dimensions: modelDescriptor.expectedDimensions,
        normalization: "L2_NORM_V1",
        contentHash,
        vector,
        createdAt: Date.now(),
        recordChecksum: ""
      };
      record.recordChecksum = this.computeRecordChecksum(record);

      const jsonString = canonicalJsonStringify(record);
      const byteLength = Buffer.byteLength(jsonString, "utf-8");
      if (byteLength > this.runtimeAdapter.getMaxEntrySizeBytes()) {
        return { status: "bypass", reasonCode: "INTEGRITY_FAILURE" };
      }

      // Lock Check #2: Pre-Temp Write
      if (!verifyLockActive()) {
        return { status: "bypass", reasonCode: "LOCK_LOST_FAILURE" };
      }

      const shardDir = path.dirname(entryPath);
      if (!this.fsAdapter.existsSync(shardDir)) {
        this.fsAdapter.mkdirSync(shardDir, { recursive: true, mode: this.runtimeAdapter.getDirectoryMode() });
      }

      tempPath = validateAndCanonicalizePath(
        path.join(shardDir, `${keyHash}.tmp.${crypto.randomUUID()}`),
        cacheRoot,
        this.fsAdapter
      );
      this.fsAdapter.writeFileSync(tempPath, jsonString, { mode: this.runtimeAdapter.getFileMode() });
      fsyncParentDirectory(tempPath, this.fsAdapter);

      // Lock Check #3: Pre-Projected Eviction
      if (!verifyLockActive()) {
        this.rollbackTempAndEntry(tempPath, null);
        return { status: "bypass", reasonCode: "LOCK_LOST_FAILURE" };
      }

      // Projected Eviction & Quota Enforcement BEFORE publishing entry (Pure In-Memory Planning)
      const manifest = this.loadOrCreateManifest(cacheRoot);
      const relativeEntryPath = path.relative(v1Root, entryPath);
      manifest.entries[keyHash] = {
        entryPath: relativeEntryPath,
        accessedAt: Date.now(),
        bytes: byteLength,
        checksum: record.recordChecksum
      };
      const evictionPlan = this.planReconcileAndEvict(manifest, v1Root, cacheRoot, entryPath);

      // Lock Check #4: Pre-Rename Publishing
      if (!verifyLockActive()) {
        this.rollbackTempAndEntry(tempPath, null);
        return { status: "bypass", reasonCode: "LOCK_LOST_FAILURE" };
      }

      this.fsAdapter.renameSync(tempPath, entryPath);
      entryPublished = true;
      fsyncParentDirectory(entryPath, this.fsAdapter);

      // Lock Check #5: Pre-Manifest Commit
      if (!verifyLockActive()) {
        this.rollbackTempAndEntry(tempPath, entryPath);
        return { status: "bypass", reasonCode: "LOCK_LOST_FAILURE" };
      }

      // Commit Manifest Snapshot FIRST
      this.saveManifest(evictionPlan.projectedManifest, cacheRoot);

      // ONLY AFTER manifest commit succeeds, execute disk deletion plan!
      for (const fileToDelete of evictionPlan.deletionPlan) {
        try {
          if (this.fsAdapter.existsSync(fileToDelete)) {
            this.fsAdapter.unlinkSync(fileToDelete);
          }
        } catch {}
      }
      for (let i = 0; i < evictionPlan.evictionCount; i++) {
        this.incrementTelemetry("evictions");
      }

      this.recordLatency(startTime);
      return {
        status: "generated",
        vector,
        provider: "ollama",
        source: "provider",
        dims: vector.length,
        contentHash,
        publishedVersionId
      };
    } catch {
      this.rollbackTempAndEntry(tempPath, entryPublished ? entryPath : null);
      if (isLost) {
        return { status: "bypass", reasonCode: "LOCK_LOST_FAILURE" };
      }
      return { status: "bypass", reasonCode: "PROVIDER_FAILURE" };
    } finally {
      clearInterval(renewalInterval);
      if (!isLost) {
        this.fsAdapter.atomicReleaseLock(lockPath, ownerToken, currentInode);
      }
    }
  }

  private rollbackTempAndEntry(tempPath: string | null, entryPath: string | null): void {
    if (tempPath) {
      try {
        if (this.fsAdapter.existsSync(tempPath)) {
          this.fsAdapter.unlinkSync(tempPath);
        }
      } catch {}
    }
    if (entryPath) {
      try {
        if (this.fsAdapter.existsSync(entryPath)) {
          this.fsAdapter.unlinkSync(entryPath);
        }
      } catch {}
    }
  }

  private updateAccessEpochUnderLock(keyHash: string, cacheRoot: string): void {
    const v1Root = validateAndCanonicalizePath(path.join(cacheRoot, "v1"), cacheRoot, this.fsAdapter);
    if (!this.fsAdapter.existsSync(v1Root)) {
      this.fsAdapter.mkdirSync(v1Root, { recursive: true, mode: this.runtimeAdapter.getDirectoryMode() });
    }
    const lockPath = path.join(v1Root, "cache.lock");
    const ownerToken = crypto.randomUUID();

    const lockPayload = JSON.stringify({
      ownerToken,
      timestamp: Date.now(),
      expiresAt: Date.now() + 5000
    });

    const lockRes = this.fsAdapter.atomicAcquireLock(lockPath, lockPayload);
    if (!lockRes.acquired) {
      if (this.fsAdapter.existsSync(lockPath)) {
        try {
          const lockStat = this.fsAdapter.lstatSync(lockPath);
          const rawLockContent = this.fsAdapter.readFileSync(lockPath, "utf-8");
          const parsedLock = JSON.parse(rawLockContent);
          if (
            parsedLock &&
            typeof parsedLock.expiresAt === "number" &&
            Date.now() > parsedLock.expiresAt &&
            typeof parsedLock.ownerToken === "string"
          ) {
            this.fsAdapter.atomicReleaseLock(lockPath, parsedLock.ownerToken, lockStat.ino);
          }
        } catch {}
      }
      return;
    }

    try {
      const manifest = this.loadOrCreateManifest(cacheRoot);
      if (manifest.entries[keyHash]) {
        manifest.entries[keyHash].accessedAt = Date.now();
        this.saveManifest(manifest, cacheRoot);
      }
    } catch {
    } finally {
      this.fsAdapter.atomicReleaseLock(lockPath, ownerToken, lockRes.inode);
    }
  }

  private loadOrCreateManifest(cacheRoot: string): CacheManifestSchema {
    const v1Root = validateAndCanonicalizePath(path.join(cacheRoot, "v1"), cacheRoot, this.fsAdapter);
    const manifestPath = path.join(v1Root, "manifest.snapshot.json");

    if (!this.fsAdapter.existsSync(v1Root)) {
      this.fsAdapter.mkdirSync(v1Root, { recursive: true, mode: this.runtimeAdapter.getDirectoryMode() });
    }

    if (!this.fsAdapter.existsSync(manifestPath)) {
      const initial: CacheManifestSchema = {
        schemaVersion: "1.0.0",
        modelDigest: "",
        dimensions: 0,
        normalization: "L2_NORM_V1",
        entries: {},
        totalSizeBytes: 0,
        manifestChecksum: ""
      };
      initial.manifestChecksum = this.computeManifestChecksum(initial);
      return initial;
    }

    try {
      const raw = this.fsAdapter.readFileSync(manifestPath, "utf-8");
      const manifest: CacheManifestSchema = JSON.parse(raw);

      if (
        manifest.schemaVersion !== "1.0.0" ||
        manifest.normalization !== "L2_NORM_V1" ||
        typeof manifest.entries !== "object" ||
        manifest.entries === null
      ) {
        this.incrementTelemetry("corruptions");
        this.quarantineCorruptFile(manifestPath, cacheRoot);
        return this.loadOrCreateManifest(cacheRoot);
      }

      const expectedChecksum = this.computeManifestChecksum(manifest);
      if (manifest.manifestChecksum !== expectedChecksum) {
        this.incrementTelemetry("corruptions");
        this.quarantineCorruptFile(manifestPath, cacheRoot);
        return this.loadOrCreateManifest(cacheRoot);
      }

      return manifest;
    } catch {
      this.incrementTelemetry("corruptions");
      this.quarantineCorruptFile(manifestPath, cacheRoot);
      return this.loadOrCreateManifest(cacheRoot);
    }
  }

  private saveManifest(manifest: CacheManifestSchema, cacheRoot: string): void {
    const v1Root = validateAndCanonicalizePath(path.join(cacheRoot, "v1"), cacheRoot, this.fsAdapter);
    const manifestPath = validateAndCanonicalizePath(path.join(v1Root, "manifest.snapshot.json"), cacheRoot, this.fsAdapter);

    manifest.manifestChecksum = this.computeManifestChecksum(manifest);
    const jsonString = canonicalJsonStringify(manifest);

    const tempManifestPath = validateAndCanonicalizePath(
      path.join(v1Root, `manifest.tmp.${crypto.randomUUID()}`),
      cacheRoot,
      this.fsAdapter
    );

    this.fsAdapter.writeFileSync(tempManifestPath, jsonString, { mode: this.runtimeAdapter.getFileMode() });
    fsyncParentDirectory(tempManifestPath, this.fsAdapter);

    this.fsAdapter.renameSync(tempManifestPath, manifestPath);
    fsyncParentDirectory(manifestPath, this.fsAdapter);
  }

  public planReconcileAndEvict(
    manifest: CacheManifestSchema,
    v1Root: string,
    cacheRoot: string,
    pendingEntryPath?: string
  ): EvictionPlan {
    const maxBytes = this.runtimeAdapter.getMaxCacheSizeBytes();
    const now = Date.now();
    const entriesDir = path.join(v1Root, "entries");

    // Deep clone manifest to keep planning pure and side-effect-free
    const projectedManifest: CacheManifestSchema = JSON.parse(JSON.stringify(manifest));
    const deletionPlan: string[] = [];
    let evictionCount = 0;
    let totalScanned = 0;

    // 1. Full Disk Scan with Hex & Canonical Containment Guard & Global Scan Limit
    if (this.fsAdapter.existsSync(entriesDir)) {
      try {
        const validatedEntriesDir = validateAndCanonicalizePath(entriesDir, cacheRoot, this.fsAdapter);
        const shards = this.fsAdapter.readdirBoundedSync(validatedEntriesDir, MAX_GLOBAL_SCAN_FILES);
        for (const shard of shards) {
          if (totalScanned >= MAX_GLOBAL_SCAN_FILES) break;
          if (!HEX_SHARD_REGEX.test(shard)) continue;

          let shardPath: string;
          try {
            shardPath = validateAndCanonicalizePath(path.join(validatedEntriesDir, shard), cacheRoot, this.fsAdapter);
          } catch {
            continue;
          }

          if (!this.fsAdapter.existsSync(shardPath)) continue;

          const remainingBudget = MAX_GLOBAL_SCAN_FILES - totalScanned;
          const files = this.fsAdapter.readdirBoundedSync(shardPath, remainingBudget);
          for (const file of files) {
            totalScanned++;

            if (!HEX_ENTRY_REGEX.test(file)) continue;

            const fileKeyHash = file.slice(0, 64);
            if (!projectedManifest.entries[fileKeyHash]) {
              try {
                const orphanPath = validateAndCanonicalizePath(path.join(shardPath, file), cacheRoot, this.fsAdapter);
                deletionPlan.push(orphanPath);
              } catch {}
            }
          }
        }
      } catch {}
    }

    // 2. Reconcile Manifest Entries against Disk and Evict Expired Items
    let totalBytes = 0;
    let count = 0;
    const entriesList: Array<{ key: string; accessedAt: number; bytes: number; fullPath: string }> = [];

    const keys = Object.keys(projectedManifest.entries);
    for (const key of keys) {
      const item = projectedManifest.entries[key];
      const fullPath = path.join(v1Root, item.entryPath);

      try {
        const validatedPath = validateAndCanonicalizePath(fullPath, cacheRoot, this.fsAdapter);
        if (!this.fsAdapter.existsSync(validatedPath)) {
          if (pendingEntryPath && validatedPath === pendingEntryPath) {
            // Projected entry awaiting rename commitment: preserve in manifest
          } else {
            delete projectedManifest.entries[key];
            continue;
          }
        }

        // TTL Expiry check (30 days)
        if (now - item.accessedAt > TTL_MS) {
          if (this.fsAdapter.existsSync(validatedPath)) {
            deletionPlan.push(validatedPath);
          }
          delete projectedManifest.entries[key];
          evictionCount++;
          continue;
        }

        totalBytes += item.bytes;
        count++;
        entriesList.push({ key, accessedAt: item.accessedAt, bytes: item.bytes, fullPath: validatedPath });
      } catch {
        delete projectedManifest.entries[key];
      }
    }

    // 3. LRU Eviction (Count > 2000 or Total Bytes > 50MB)
    const maxEntries = 2000;
    if (count > maxEntries || totalBytes > maxBytes) {
      entriesList.sort((a, b) => a.accessedAt - b.accessedAt);

      for (const item of entriesList) {
        if (count <= maxEntries && totalBytes <= maxBytes) break;

        if (this.fsAdapter.existsSync(item.fullPath)) {
          deletionPlan.push(item.fullPath);
        }

        delete projectedManifest.entries[item.key];
        totalBytes -= item.bytes;
        count--;
        evictionCount++;
      }
    }

    projectedManifest.totalSizeBytes = totalBytes;

    return { projectedManifest, deletionPlan, evictionCount };
  }

  private cleanupStaleTempFiles(v1Root: string, cacheRoot: string): void {
    try {
      const entriesDir = path.join(v1Root, "entries");
      if (!this.fsAdapter.existsSync(entriesDir)) return;

      const validatedEntriesDir = validateAndCanonicalizePath(entriesDir, cacheRoot, this.fsAdapter);
      const shards = this.fsAdapter.readdirBoundedSync(validatedEntriesDir, MAX_GLOBAL_SCAN_FILES);
      const now = Date.now();
      let totalScanned = 0;

      for (const shard of shards) {
        if (totalScanned >= MAX_GLOBAL_SCAN_FILES) break;
        if (!HEX_SHARD_REGEX.test(shard)) continue;

        let shardPath: string;
        try {
          shardPath = validateAndCanonicalizePath(path.join(validatedEntriesDir, shard), cacheRoot, this.fsAdapter);
        } catch {
          continue;
        }

        if (!this.fsAdapter.existsSync(shardPath)) continue;

        const remainingBudget = MAX_GLOBAL_SCAN_FILES - totalScanned;
        const files = this.fsAdapter.readdirBoundedSync(shardPath, remainingBudget);
        for (const file of files) {
          totalScanned++;

          if (file.includes(".tmp.")) {
            try {
              const fullTmpPath = validateAndCanonicalizePath(path.join(shardPath, file), cacheRoot, this.fsAdapter);
              const stat = this.fsAdapter.lstatSync(fullTmpPath);
              if (now - (stat as any).mtimeMs > 3600000) {
                this.fsAdapter.unlinkSync(fullTmpPath);
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  private quarantineCorruptFile(filePath: string, cacheRoot: string): void {
    try {
      const qDir = validateAndCanonicalizePath(path.join(cacheRoot, "v1", "quarantine"), cacheRoot, this.fsAdapter);
      if (!this.fsAdapter.existsSync(qDir)) {
        this.fsAdapter.mkdirSync(qDir, { recursive: true, mode: this.runtimeAdapter.getDirectoryMode() });
      }
      const qPath = path.join(qDir, `${Date.now()}_${path.basename(filePath)}`);
      this.fsAdapter.renameSync(filePath, qPath);
    } catch {
      try {
        if (this.fsAdapter.existsSync(filePath)) {
          this.fsAdapter.unlinkSync(filePath);
        }
      } catch {}
    }
  }

  private computeRecordChecksum(record: ShardedCacheRecord): string {
    const copy = { ...record, recordChecksum: "" };
    return crypto.createHash("sha256").update(canonicalJsonStringify(copy)).digest("hex");
  }

  private computeManifestChecksum(manifest: CacheManifestSchema): string {
    const copy = { ...manifest, manifestChecksum: "" };
    return crypto.createHash("sha256").update(canonicalJsonStringify(copy)).digest("hex");
  }

  public getTelemetry() {
    return { ...this.telemetry };
  }

  private incrementTelemetry(key: keyof typeof this.telemetry): void {
    if (this.telemetry[key] < Number.MAX_SAFE_INTEGER) {
      this.telemetry[key]++;
    }
  }

  private recordLatency(startTime: number): void {
    const duration = Date.now() - startTime;
    if (Number.isFinite(duration) && duration >= 0) {
      this.latencies.push(duration);
    }
  }
}

export const defaultOllamaCorpusEmbeddingCacheService = new OllamaCorpusEmbeddingCacheService(
  new NodeFileSystemAdapter(),
  new DefaultRuntimePolicyAdapter()
);
