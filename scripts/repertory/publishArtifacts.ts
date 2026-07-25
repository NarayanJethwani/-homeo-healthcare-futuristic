import crypto from "crypto";
import fs from "fs";
import path from "path";

type Options = {
  version: string;
  execute: boolean;
  verifyRemote: boolean;
  allowInactive: boolean;
};

type Artifact = {
  absolutePath: string;
  relativePath: string;
  bytes: number;
  sha256: string;
  manifestGoverned: boolean;
};

const VERSION_PATTERN = /^v\d+\.\d+\.\d+$/;
const CONCURRENCY = 4;

function parseOptions(args: string[]): Options {
  const index = args.indexOf("--version");
  const version = index >= 0 ? args[index + 1] : "";
  if (!VERSION_PATTERN.test(version)) {
    throw new Error("Provide a semantic corpus version, for example --version v1.0.0.");
  }
  return {
    version,
    execute: args.includes("--execute"),
    verifyRemote: args.includes("--verify-remote"),
    allowInactive: args.includes("--allow-inactive"),
  };
}

function walk(directory: string, output: string[] = []): string[] {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(entryPath, output);
    else if (entry.isFile()) output.push(entryPath);
  }
  return output.sort();
}

function digest(bytes: Buffer): string {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function safePrefix(value: string): string {
  const segments = value.replace(/\\/g, "/").split("/").filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error("REPERTORY_ARTIFACT_PREFIX is invalid.");
  }
  return segments.join("/");
}

export function buildPublishPlan(version: string, allowInactive = false): Artifact[] {
  const publishedRoot = path.join(process.cwd(), "data", "repertory", "published");
  const releaseRoot = path.join(publishedRoot, version);
  const pointerPath = path.join(publishedRoot, "active_pointer.json");
  const manifestPath = path.join(releaseRoot, "manifest.json");

  if (!fs.existsSync(pointerPath) || !fs.existsSync(manifestPath)) {
    throw new Error("The active pointer or requested corpus manifest is missing.");
  }

  const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf8")) as { activeVersion?: string };
  if (!allowInactive && pointer.activeVersion !== version) {
    throw new Error(`Refusing inactive corpus ${version}; active version is ${pointer.activeVersion || "unset"}.`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    corpusVersion?: string;
    validationStatus?: string;
    artifactChecksums?: Record<string, string>;
  };
  if (manifest.corpusVersion !== version || manifest.validationStatus !== "passed") {
    throw new Error("Corpus manifest version or validation status is not publishable.");
  }

  const checksums = manifest.artifactChecksums || {};
  const artifacts = walk(releaseRoot).map((absolutePath) => {
    const relativePath = path.relative(releaseRoot, absolutePath).split(path.sep).join("/");
    const bytes = fs.readFileSync(absolutePath);
    const sha256 = digest(bytes);
    const expected = checksums[relativePath];
    if (expected && expected !== sha256) {
      throw new Error(`Checksum mismatch: ${relativePath}`);
    }
    return {
      absolutePath,
      relativePath,
      bytes: bytes.byteLength,
      sha256,
      manifestGoverned: Boolean(expected),
    };
  });

  const present = new Set(artifacts.map((artifact) => artifact.relativePath));
  const missing = Object.keys(checksums).filter((relativePath) => !present.has(relativePath));
  if (missing.length) throw new Error(`Corpus is missing ${missing.length} governed artifacts.`);
  return artifacts;
}

async function batches<T>(items: T[], worker: (item: T) => Promise<void>): Promise<void> {
  for (let index = 0; index < items.length; index += CONCURRENCY) {
    await Promise.all(items.slice(index, index + CONCURRENCY).map(worker));
  }
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const artifacts = buildPublishPlan(options.version, options.allowInactive);
  const totalBytes = artifacts.reduce((sum, artifact) => sum + artifact.bytes, 0);

  console.log(JSON.stringify({
    mode: options.execute ? "execute" : "dry-run",
    version: options.version,
    files: artifacts.length,
    governedFiles: artifacts.filter((artifact) => artifact.manifestGoverned).length,
    totalBytes,
    localChecksumsVerified: true,
  }, null, 2));

  if (!options.execute && !options.verifyRemote) return;

  const bucketName = process.env.REPERTORY_ARTIFACT_BUCKET?.trim();
  if (!bucketName) throw new Error("REPERTORY_ARTIFACT_BUCKET is required for remote operations.");
  const prefix = safePrefix(process.env.REPERTORY_ARTIFACT_PREFIX || "repertory");

  const { getAdminDb } = await import("../../src/lib/firebaseAdmin");
  // Initialize the default Admin app before requesting its Storage service.
  getAdminDb();
  const { getStorage } = await import("firebase-admin/storage");
  const bucket = getStorage().bucket(bucketName);

  if (options.execute) {
    await batches(artifacts, async (artifact) => {
      const objectName = `${prefix}/published/${options.version}/${artifact.relativePath}`;
      await bucket.file(objectName).save(fs.readFileSync(artifact.absolutePath), {
        resumable: artifact.bytes >= 8 * 1024 * 1024,
        validation: "crc32c",
        metadata: {
          contentType: "application/json; charset=utf-8",
          cacheControl: "private, max-age=300",
          metadata: {
            corpusVersion: options.version,
            sha256: artifact.sha256,
            manifestGoverned: String(artifact.manifestGoverned),
          },
        },
      });
    });
  }

  if (options.verifyRemote) {
    await batches(artifacts, async (artifact) => {
      const objectName = `${prefix}/published/${options.version}/${artifact.relativePath}`;
      const [remote] = await bucket.file(objectName).download();
      if (remote.byteLength !== artifact.bytes || digest(remote) !== artifact.sha256) {
        throw new Error(`Remote verification failed: ${artifact.relativePath}`);
      }
    });
  }

  console.log(JSON.stringify({
    bucket: bucketName,
    prefix,
    version: options.version,
    uploaded: options.execute,
    remoteChecksumsVerified: options.verifyRemote,
  }, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
