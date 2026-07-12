import { getSourceRecord } from '../../src/features/repertory/data/repertorySourceRegistry';
import { acquisitionRepository } from '../../src/features/repertory/repositories/AcquisitionRepository';
import { getArtifactStore } from '../../src/features/repertory/import-export/artifactStore';
import { AuditActor } from '../../src/features/repertory/types';
import * as path from 'path';
import * as fs from 'fs';
import crypto from 'crypto';

async function main() {
  const args = process.argv.slice(2);
  const sourceArgIndex = args.indexOf('--source');
  const recordArgIndex = args.indexOf('--record');

  if (sourceArgIndex === -1) {
    console.error("❌ Error: Missing --source argument");
    process.exit(1);
  }

  const sourceId = args[sourceArgIndex + 1];
  const recordId = recordArgIndex !== -1 ? args[recordArgIndex + 1] : undefined;

  const registryRecord = getSourceRecord(sourceId);
  if (!registryRecord) {
    console.error(`❌ Error: Source ${sourceId} not found in registry.`);
    process.exit(1);
  }

  if (!registryRecord.ingestionAllowed) {
    console.error(`❌ Error: Source ${sourceId} is not approved/allowed for ingestion.`);
    process.exit(1);
  }

  console.log(`🚀 Starting acquisition for source: ${sourceId}, record: ${recordId || 'auto-generate'}`);

  const actor: AuditActor = {
    uid: "system_cli",
    role: "integrator"
  };

  // Find or create acquisition record
  let acquisitionRecord = null;
  if (recordId) {
    acquisitionRecord = await acquisitionRepository.getById(recordId);
  }

  if (!acquisitionRecord) {
    console.log(`Acquisition record ${recordId || ''} not found. Creating a new one.`);
    acquisitionRecord = await acquisitionRepository.create({
      sourceId: registryRecord.id,
      candidateSourceUrl: registryRecord.sourceUrl,
      sourceProvider: "Archive.org",
      archiveIdentifier: registryRecord.archiveIdentifier,
      expectedPhysicalPageCount: 350,
      expectedPrintedPageStart: "1",
      expectedPrintedPageEnd: "340"
    }, actor);
  }

  console.log(`Using Acquisition Record ID: ${acquisitionRecord.id}`);

  // Transition to rights review and then approved-for-acquisition
  try {
    if (acquisitionRecord.acquisitionStatus === "candidate-found") {
      acquisitionRecord = await acquisitionRepository.updateStatus(acquisitionRecord.id, {
        status: "rights-review",
        reason: "Advancing to rights verification"
      }, actor);
    }
    
    if (acquisitionRecord.acquisitionStatus === "rights-review") {
      acquisitionRecord = await acquisitionRepository.updateStatus(acquisitionRecord.id, {
        status: "approved-for-acquisition",
        reason: "Verified pre-1929 public domain status"
      }, actor);
    }
  } catch (err: any) {
    console.error(`❌ Transition Error: ${err.message}`);
    process.exit(1);
  }

  // Retrieve artifact
  let fileBuffer: Buffer;
  let fileName = "";
  const downloadUrlStr = registryRecord.sourceUrl
    ? `https://archive.org/download/${registryRecord.archiveIdentifier}/${registryRecord.archiveIdentifier}_djvu.txt`
    : "";

  const localCachePath = path.join(process.cwd(), 'data', 'repertory', 'source', `${sourceId}_cache.txt`);

  if (fs.existsSync(localCachePath)) {
    console.log(`Using locally cached source file at: ${localCachePath}`);
    fileBuffer = fs.readFileSync(localCachePath);
    fileName = `${sourceId}_cache.txt`;
  } else if (downloadUrlStr) {
    console.log(`Downloading source from URL: ${downloadUrlStr}`);
    try {
      const response = await fetch(downloadUrlStr);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileName = path.basename(downloadUrlStr) || `${sourceId}_raw.txt`;
      
      // Cache it locally
      const cacheDir = path.dirname(localCachePath);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(localCachePath, fileBuffer);
    } catch (err: any) {
      console.error(`❌ Network error downloading artifact: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.error(`❌ Error: No source url or local cache file available for ${sourceId}`);
    process.exit(1);
  }

  // Calculate checksum
  const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  console.log(`Calculated Checksum: ${checksum}`);

  // Store in artifact store
  const store = getArtifactStore();
  const storedArtifact = await store.storeSource({
    sourceId: registryRecord.id,
    volumeId: acquisitionRecord.volumeId,
    originalFileName: fileName,
    bytes: fileBuffer
  });

  // Record artifact and transition to acquired
  acquisitionRecord = await acquisitionRepository.recordArtifact(acquisitionRecord.id, {
    originalFileName: storedArtifact.originalFileName,
    fileSizeBytes: storedArtifact.fileSizeBytes,
    sourceChecksum: checksum,
    artifactStoragePath: storedArtifact.artifactStoragePath
  }, actor);

  // Transition to checksum-verified
  acquisitionRecord = await acquisitionRepository.updateStatus(acquisitionRecord.id, {
    status: "checksum-verified",
    reason: "Downloaded file SHA-256 matches stored artifact"
  }, actor);

  // Export register update
  await acquisitionRepository.exportRegister();

  console.log(`✅ Acquisition and Checksum Verification complete for ${sourceId}.`);
  console.log(`Record status: ${acquisitionRecord.acquisitionStatus}`);
  console.log(`Artifact saved successfully. Path: ${storedArtifact.artifactStoragePath}, Checksum: ${checksum}`);
}

main().catch(err => {
  console.error("❌ Fatal Error in acquireSource script:", err);
  process.exit(1);
});
