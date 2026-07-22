import fs from "fs";
import path from "path";
import type { RepertoryRuntimeEnvironment } from "../config/runtimeEnv";

export interface RepertoryArtifactStore {
  readJson<T>(filePath: string): Promise<T>;
  exists(filePath: string): Promise<boolean>;
  findMissing?(directoryPath: string, relativePaths: string[]): Promise<string[]>;
}

export class LocalRepertoryArtifactStore implements RepertoryArtifactStore {
  async readJson<T>(filePath: string): Promise<T> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Artifact store file not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  }

  async exists(filePath: string): Promise<boolean> {
    return fs.existsSync(filePath);
  }

  async findMissing(directoryPath: string, relativePaths: string[]): Promise<string[]> {
    return relativePaths.filter((relativePath) => !fs.existsSync(path.join(directoryPath, relativePath)));
  }
}

type StorageFile = {
  download(): Promise<[Buffer]>;
  exists(): Promise<[boolean]>;
};

export type RepertoryStorageBucket = {
  file(objectKey: string): StorageFile;
  getFiles?(options: { prefix: string }): Promise<[
    Array<StorageFile & { name: string }>,
    unknown?,
    unknown?,
  ]>;
};

export type ObjectStorageArtifactStoreOptions = {
  bucket: RepertoryStorageBucket;
  artifactRoot: string;
  objectPrefix?: string;
  maxObjectBytes?: number;
};

const DEFAULT_MAX_OBJECT_BYTES = 25 * 1024 * 1024;

function normalizeObjectPrefix(value: string): string {
  const segments = value.replace(/\\/g, "/").split("/").filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error("Repertory artifact prefix must be a safe, non-empty object path.");
  }
  return segments.join("/");
}

export function resolveRepertoryObjectName(
  filePath: string,
  artifactRoot: string,
  objectPrefix = "repertory"
): string {
  const root = path.resolve(artifactRoot);
  const requested = path.resolve(filePath);
  const relative = path.relative(root, requested);

  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error("Repertory artifact path must resolve beneath the configured artifact root.");
  }

  return `${normalizeObjectPrefix(objectPrefix)}/${relative.split(path.sep).join("/")}`;
}

export class ObjectStorageRepertoryArtifactStore implements RepertoryArtifactStore {
  private readonly artifactRoot: string;
  private readonly objectPrefix: string;
  private readonly maxObjectBytes: number;

  constructor(private readonly options: ObjectStorageArtifactStoreOptions) {
    this.artifactRoot = path.resolve(options.artifactRoot);
    this.objectPrefix = normalizeObjectPrefix(options.objectPrefix || "repertory");
    this.maxObjectBytes = options.maxObjectBytes || DEFAULT_MAX_OBJECT_BYTES;

    if (!Number.isSafeInteger(this.maxObjectBytes) || this.maxObjectBytes <= 0) {
      throw new Error("Repertory artifact maximum object size must be a positive integer.");
    }
  }

  private getFile(filePath: string): StorageFile {
    const objectName = resolveRepertoryObjectName(filePath, this.artifactRoot, this.objectPrefix);
    return this.options.bucket.file(objectName);
  }

  async readJson<T>(filePath: string): Promise<T> {
    const [bytes] = await this.getFile(filePath).download();
    if (bytes.byteLength > this.maxObjectBytes) {
      throw new Error("Repertory artifact exceeds the configured object-size limit.");
    }
    return JSON.parse(bytes.toString("utf8")) as T;
  }

  async exists(filePath: string): Promise<boolean> {
    const [exists] = await this.getFile(filePath).exists();
    return exists;
  }

  async findMissing(directoryPath: string, relativePaths: string[]): Promise<string[]> {
    if (!this.options.bucket.getFiles) {
      const results = await Promise.all(relativePaths.map(async (relativePath) => ({
        relativePath,
        exists: await this.exists(path.join(directoryPath, relativePath)),
      })));
      return results.filter((result) => !result.exists).map((result) => result.relativePath);
    }

    const sentinelObjectName = resolveRepertoryObjectName(
      path.join(directoryPath, "manifest.json"),
      this.artifactRoot,
      this.objectPrefix
    );
    const directoryPrefix = sentinelObjectName.slice(0, -"manifest.json".length);
    const [files] = await this.options.bucket.getFiles({ prefix: directoryPrefix });
    const existingObjectNames = new Set(files.map((file) => file.name));

    return relativePaths.filter((relativePath) => {
      const objectName = resolveRepertoryObjectName(
        path.join(directoryPath, relativePath),
        this.artifactRoot,
        this.objectPrefix
      );
      return !existingObjectNames.has(objectName);
    });
  }
}

export async function createRepertoryArtifactStore(
  env: RepertoryRuntimeEnvironment
): Promise<RepertoryArtifactStore> {
  if (env.artifactStoreAdapter !== "object-storage") {
    return new LocalRepertoryArtifactStore();
  }

  const bucketName = process.env.REPERTORY_ARTIFACT_BUCKET?.trim();
  if (!bucketName) {
    throw new Error("REPERTORY_ARTIFACT_BUCKET is required for object-storage mode.");
  }

  const { getStorage } = await import("firebase-admin/storage");
  return new ObjectStorageRepertoryArtifactStore({
    artifactRoot: env.artifactRoot,
    bucket: getStorage().bucket(bucketName),
    objectPrefix: process.env.REPERTORY_ARTIFACT_PREFIX || "repertory",
  });
}
