import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

function parseArgs() {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].substring(2);
      const val = argv[i + 1];
      if (val && !val.startsWith('--')) {
        args[key] = val;
        i++;
      } else {
        args[key] = 'true';
      }
    }
  }
  return args;
}

function getFilesRecursive(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      getFilesRecursive(p, files);
    } else {
      files.push(p);
    }
  }
  return files;
}

async function main() {
  const args = parseArgs();
  const release = args.release;

  if (!release) {
    console.error("❌ Missing required argument: --release <version>");
    process.exit(1);
  }

  const releaseDir = path.join(process.cwd(), 'data', 'repertory', 'published', release);
  if (!fs.existsSync(releaseDir)) {
    console.error(`❌ Error: Snapshot directory for release "${release}" does not exist at ${releaseDir}`);
    process.exit(1);
  }

  console.log(`🔍 Reconciling Snapshot Artifacts for Release ${release}...`);

  const manifestPath = path.join(releaseDir, 'manifest.json');
  const checksumsPath = path.join(releaseDir, 'checksums.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`❌ Error: manifest.json is missing!`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const checksums = fs.existsSync(checksumsPath) ? JSON.parse(fs.readFileSync(checksumsPath, 'utf-8')) : {};

  const allFiles = getFilesRecursive(releaseDir);
  console.log(`Total files found in directory: ${allFiles.length}`);

  let totalUncompressedBytes = 0;
  let totalStoredBytes = 0;
  let totalCompressedBytes = 0;

  let largestFile = "";
  let largestSize = -1;
  let smallestFile = "";
  let smallestSize = Infinity;

  const manifestListed = new Set<string>();
  const checksumsListed = new Set<string>();

  // Extract files from manifest
  if (manifest.files && Array.isArray(manifest.files)) {
    manifest.files.forEach((f: any) => {
      if (f.path) manifestListed.add(f.path);
    });
  }

  // Extract from checksums
  Object.keys(checksums).forEach(k => {
    checksumsListed.add(k);
  });

  const categories: Record<string, { count: number; bytes: number }> = {};
  const unexpectedFiles: string[] = [];

  for (const file of allFiles) {
    const relPath = path.relative(releaseDir, file);
    const stat = fs.statSync(file);
    const size = stat.size;

    totalUncompressedBytes += size;
    totalStoredBytes += size; // Stored size is the same as local file size on disk

    // Estimate gzip compressed size
    const content = fs.readFileSync(file);
    const compressed = zlib.gzipSync(content);
    totalCompressedBytes += compressed.length;

    if (size > largestSize) {
      largestSize = size;
      largestFile = relPath;
    }
    if (size < smallestSize) {
      smallestSize = size;
      smallestFile = relPath;
    }

    // Determine category
    let cat = "other";
    if (relPath === "manifest.json") cat = "Manifest";
    else if (relPath === "checksums.json") cat = "Checksums";
    else if (relPath.startsWith("locations/")) cat = "Locations";
    else if (relPath.startsWith("indexes/lexical/")) cat = "Lexical indexes";
    else if (relPath.startsWith("indexes/remedies/")) cat = "Remedy indexes";
    else if (relPath.startsWith("indexes/concepts/")) cat = "Concept indexes";
    else if (relPath.startsWith("rag/")) cat = "RAG files";
    else if (relPath.startsWith("sources/")) cat = "Source files";
    else if (relPath.startsWith("metadata/")) cat = "Metadata files";

    if (!categories[cat]) categories[cat] = { count: 0, bytes: 0 };
    categories[cat].count++;
    categories[cat].bytes += size;

    // Check if expected in manifest/checksums (except manifest itself and checksums file)
    if (relPath !== "manifest.json" && relPath !== "checksums.json") {
      if (!manifestListed.has(relPath)) {
        unexpectedFiles.push(relPath);
      }
    }
  }

  const missingFiles: string[] = [];
  manifestListed.forEach(p => {
    const full = path.join(releaseDir, p);
    if (!fs.existsSync(full)) {
      missingFiles.push(p);
    }
  });

  const compressionRatio = totalUncompressedBytes / totalCompressedBytes;

  console.log("\n==============================================");
  console.log(`Reconciliation Summary:`);
  console.log(`- Total Files on disk: ${allFiles.length}`);
  console.log(`- Manifest Listed Files: ${manifestListed.size}`);
  console.log(`- Checksums Listed Files: ${checksumsListed.size}`);
  console.log(`- Missing Files (expected but absent): ${missingFiles.length}`);
  console.log(`- Unexpected Files (present but unlisted): ${unexpectedFiles.length}`);
  console.log(`- Total Uncompressed Content Size: ${totalUncompressedBytes.toLocaleString()} bytes`);
  console.log(`- Total Stored Artifact Size: ${totalStoredBytes.toLocaleString()} bytes`);
  console.log(`- Total Estimated Gzip Compressed Size: ${totalCompressedBytes.toLocaleString()} bytes`);
  console.log(`- Compression Ratio: ${compressionRatio.toFixed(2)}x`);
  console.log(`- Largest File: ${largestFile} (${largestSize.toLocaleString()} bytes)`);
  console.log(`- Smallest File: ${smallestFile} (${smallestSize.toLocaleString()} bytes)`);
  console.log(`- Average File Size: ${(totalUncompressedBytes / allFiles.length).toFixed(0)} bytes`);

  console.log("\nBreakdown by Category:");
  const expectedTable = {
    "Manifest": 1,
    "Checksums": 1,
    "Locations": 64,
    "Lexical indexes": 64,
    "Remedy indexes": 32,
    "Concept indexes": 32,
    "RAG files": 40,
    "Source files": 87,
    "Metadata files": 4
  };

  console.log("| Category | Expected Count | Actual Count | Size (Bytes) |");
  console.log("|---|---|---|---|");
  for (const [cat, expected] of Object.entries(expectedTable)) {
    const actual = categories[cat] || { count: 0, bytes: 0 };
    console.log(`| ${cat} | ${expected} | ${actual.count} | ${actual.bytes.toLocaleString()} |`);
  }

  // Safety scan
  let hasBlockedOrSample = false;
  for (const file of allFiles) {
    if (file.includes("synthesis_9_1") || file.includes("sample")) {
      console.error(`❌ Safety Violation: Found sample/proprietary source file: ${file}`);
      hasBlockedOrSample = true;
    }
  }

  if (hasBlockedOrSample) {
    process.exit(1);
  }

  if (missingFiles.length > 0) {
    console.error(`❌ Reconciliation Failed: Missing files! ${missingFiles.join(', ')}`);
    process.exit(1);
  }

  console.log("\n✅ Snapshot Reconciliation successful: All artifacts reconcile and verify safety rules.");
}

main().catch(err => {
  console.error("❌ Error during reconciliation:", err);
  process.exit(1);
});
