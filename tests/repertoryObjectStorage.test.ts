import assert from "assert";
import path from "path";
import {
  ObjectStorageRepertoryArtifactStore,
  resolveRepertoryObjectName,
  type RepertoryStorageBucket,
} from "../src/features/repertory/repositories/RepertoryArtifactStore";
import {
  getRuntimeEnvironment,
  resetRuntimeEnvironment,
} from "../src/features/repertory/config/runtimeEnv";

class MemoryBucket implements RepertoryStorageBucket {
  readonly requestedKeys: string[] = [];
  readonly requestedPrefixes: string[] = [];

  constructor(private readonly objects: Map<string, Buffer>) {}

  file(objectKey: string) {
    this.requestedKeys.push(objectKey);
    return {
      download: async (): Promise<[Buffer]> => {
        const value = this.objects.get(objectKey);
        if (!value) throw new Error("Object not found");
        return [value];
      },
      exists: async (): Promise<[boolean]> => [this.objects.has(objectKey)],
    };
  }

  async getFiles(options: { prefix: string }): Promise<[
    Array<ReturnType<MemoryBucket["file"]> & { name: string }>,
  ]> {
    this.requestedPrefixes.push(options.prefix);
    const files = [...this.objects.keys()]
      .filter((key) => key.startsWith(options.prefix))
      .map((key) => ({ ...this.file(key), name: key }));
    return [files];
  }
}

async function run() {
  const artifactRoot = path.join(process.cwd(), "data", "repertory");
  const manifestPath = path.join(artifactRoot, "published", "v1.2.0", "manifest.json");
  const manifestKey = "governed/repertory/published/v1.2.0/manifest.json";
  const bucket = new MemoryBucket(new Map([[manifestKey, Buffer.from('{"corpusVersion":"v1.2.0"}')]]));
  const store = new ObjectStorageRepertoryArtifactStore({
    artifactRoot,
    bucket,
    objectPrefix: "governed/repertory",
  });

  assert.strictEqual(
    resolveRepertoryObjectName(manifestPath, artifactRoot, "governed/repertory"),
    manifestKey
  );
  assert.strictEqual(await store.exists(manifestPath), true);
  assert.deepStrictEqual(await store.readJson(manifestPath), { corpusVersion: "v1.2.0" });
  assert.ok(bucket.requestedKeys.every((key) => key === manifestKey));
  assert.deepStrictEqual(
    await store.findMissing(path.dirname(manifestPath), ["manifest.json", "missing.json"]),
    ["missing.json"]
  );
  assert.deepStrictEqual(bucket.requestedPrefixes, ["governed/repertory/published/v1.2.0/"]);

  assert.throws(
    () => resolveRepertoryObjectName(path.join(artifactRoot, "..", "private.json"), artifactRoot),
    /beneath the configured artifact root/
  );
  assert.throws(
    () => resolveRepertoryObjectName(manifestPath, artifactRoot, "../unsafe"),
    /safe, non-empty object path/
  );

  const oversized = new ObjectStorageRepertoryArtifactStore({
    artifactRoot,
    bucket,
    objectPrefix: "governed/repertory",
    maxObjectBytes: 4,
  });
  await assert.rejects(() => oversized.readJson(manifestPath), /object-size limit/);

  const previous = {
    nodeEnv: process.env.NODE_ENV,
    adapter: process.env.REPERTORY_ARTIFACT_STORE,
    bucket: process.env.REPERTORY_ARTIFACT_BUCKET,
    prefix: process.env.REPERTORY_ARTIFACT_PREFIX,
  };

  try {
    process.env.NODE_ENV = "production";
    process.env.REPERTORY_ARTIFACT_STORE = "object-storage";
    delete process.env.REPERTORY_ARTIFACT_BUCKET;
    resetRuntimeEnvironment();
    assert.throws(() => getRuntimeEnvironment(), /REPERTORY_ARTIFACT_BUCKET is required/);

    process.env.REPERTORY_ARTIFACT_BUCKET = "Invalid Bucket";
    resetRuntimeEnvironment();
    assert.throws(() => getRuntimeEnvironment(), /REPERTORY_ARTIFACT_BUCKET is invalid/);

    process.env.REPERTORY_ARTIFACT_BUCKET = "homeo-repertory-artifacts";
    process.env.REPERTORY_ARTIFACT_PREFIX = "../unsafe";
    resetRuntimeEnvironment();
    assert.throws(() => getRuntimeEnvironment(), /REPERTORY_ARTIFACT_PREFIX is invalid/);

    process.env.REPERTORY_ARTIFACT_PREFIX = "governed/repertory";
    resetRuntimeEnvironment();
    assert.strictEqual(getRuntimeEnvironment().artifactStoreAdapter, "object-storage");
  } finally {
    if (previous.nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous.nodeEnv;
    if (previous.adapter === undefined) delete process.env.REPERTORY_ARTIFACT_STORE;
    else process.env.REPERTORY_ARTIFACT_STORE = previous.adapter;
    if (previous.bucket === undefined) delete process.env.REPERTORY_ARTIFACT_BUCKET;
    else process.env.REPERTORY_ARTIFACT_BUCKET = previous.bucket;
    if (previous.prefix === undefined) delete process.env.REPERTORY_ARTIFACT_PREFIX;
    else process.env.REPERTORY_ARTIFACT_PREFIX = previous.prefix;
    resetRuntimeEnvironment();
  }

  console.log("Repertory object-storage adapter tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
