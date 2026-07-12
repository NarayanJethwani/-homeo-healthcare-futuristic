import { SnapshotPipeline } from '../../src/features/repertory/import-export/snapshotPipeline';
import { getRuntimeEnvironment } from '../../src/features/repertory/config/runtimeEnv';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

async function main() {
  const args = process.argv.slice(2);
  const releaseIdx = args.indexOf('--release');
  if (releaseIdx === -1) {
    console.error("❌ Error: Missing --release argument");
    process.exit(1);
  }
  const version = args[releaseIdx + 1];

  console.log(`🚀 Starting snapshot compilation for release: ${version}`);
  const manifest = await SnapshotPipeline.buildSnapshot({
    version,
    actorUid: "system_cli",
    actorRole: "integrator",
    reason: "production snapshot compilation",
    sourceIds: ["kent_1908", "boericke_1927", "clarke_clinical_1904"]
  });

  // Calculate checksum of the generated manifest file
  const env = getRuntimeEnvironment();
  const manifestPath = path.join(env.artifactRoot, 'published', version, 'manifest.json');
  const fileBuf = fs.readFileSync(manifestPath);
  const contentHash = crypto.createHash('sha256').update(fileBuf).digest('hex');

  console.log(`✅ Snapshot build completed successfully.`);
  console.log(`Build hash: ${contentHash}`);
  console.log(`Artifact count: ${Object.keys(manifest.artifactChecksums).length}`);
  
  const clarkeCaps = manifest.sourceCapabilities?.['clarke_clinical_1904'];
  if (!clarkeCaps) {
    console.error("❌ Error: Clarke capabilities not found in compilation manifest.");
    process.exit(1);
  }
  
  console.log("Clarke capabilities in compilation:");
  console.log(JSON.stringify(clarkeCaps, null, 2));
  
  if (clarkeCaps.scoringEnabled) {
    console.error("❌ Error: Clarke is marked as scoring-enabled! Rejecting build.");
    process.exit(1);
  }
  console.log("✅ Clarke scoring isolation checks verified in compilation.");
}

main().catch(err => {
  console.error("❌ Snapshot Build failed:", err);
  process.exit(1);
});
