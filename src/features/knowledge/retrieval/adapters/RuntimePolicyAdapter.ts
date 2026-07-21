export interface RuntimePolicyAdapter {
  isCacheEnabled(): boolean;
  isServerlessOrCi(): boolean;
  getCacheDirectory(): string;
  getSnapshotVersion(): string;
  getMaxCacheSizeBytes(): number;
  getMaxEntrySizeBytes(): number;
  getDirectoryMode(): number;
  getFileMode(): number;
}

export class DefaultRuntimePolicyAdapter implements RuntimePolicyAdapter {
  isCacheEnabled(): boolean {
    return process.env.ENABLE_LOCAL_OLLAMA_EMBED_CACHE === "true";
  }

  isServerlessOrCi(): boolean {
    return !!process.env.VERCEL || !!process.env.CI;
  }

  getCacheDirectory(): string {
    return process.env.OLLAMA_CACHE_DIR || "~/.homeo_ollama_cache";
  }

  getSnapshotVersion(): string {
    return process.env.OLLAMA_CORPUS_SNAPSHOT_VERSION || "v1.0.0";
  }

  getMaxCacheSizeBytes(): number {
    return 50 * 1024 * 1024; // 50 MB
  }

  getMaxEntrySizeBytes(): number {
    return 64 * 1024; // 64 KB
  }

  getDirectoryMode(): number {
    return 0o700;
  }

  getFileMode(): number {
    return 0o600;
  }
}

/**
 * Test policy adapter for unit/integration testing environments.
 */
export class TestRuntimePolicyAdapter implements RuntimePolicyAdapter {
  public enabled = true;
  public serverlessOrCi = false;
  public cacheDir = "~/.homeo_ollama_cache_test";
  public snapshotVersion = "v1.0.0";
  public maxCacheSizeBytes = 50 * 1024 * 1024; // 50 MB
  public maxEntrySizeBytes = 64 * 1024; // 64 KB

  isCacheEnabled(): boolean {
    return this.enabled;
  }

  isServerlessOrCi(): boolean {
    return this.serverlessOrCi;
  }

  getCacheDirectory(): string {
    return this.cacheDir;
  }

  getSnapshotVersion(): string {
    return this.snapshotVersion;
  }

  getMaxCacheSizeBytes(): number {
    return this.maxCacheSizeBytes;
  }

  getMaxEntrySizeBytes(): number {
    return this.maxEntrySizeBytes;
  }

  getDirectoryMode(): number {
    return 0o700;
  }

  getFileMode(): number {
    return 0o600;
  }
}
