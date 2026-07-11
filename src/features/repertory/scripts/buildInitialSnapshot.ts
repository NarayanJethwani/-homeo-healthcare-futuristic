import { SnapshotPipeline } from '../import-export/snapshotPipeline';
import { SourceCorpusRepository } from '../repositories/SourceCorpusRepository';

async function main() {
  try {
    console.log("=== Initializing Sharded Corpus Snapshot Build ===");
    await SourceCorpusRepository.ensureDirectoriesExist();

    console.log("Building v1.0.0...");
    const manifest1 = await SnapshotPipeline.buildSnapshot({
      version: 'v1.0.0',
      actorUid: 'system-admin',
      actorRole: 'super-admin',
      reason: 'Initial sharded corpus compilation',
      sourceIds: ['kent_1908', 'boericke_1927']
    });
    console.log(`v1.0.0 Built. Status: ${manifest1.validationStatus}`);

    console.log("Activating v1.0.0...");
    await SnapshotPipeline.activateSnapshot(
      'v1.0.0',
      'system-admin',
      'super-admin',
      'Initial production corpus activation'
    );

    console.log("Building v1.1.0...");
    const manifest2 = await SnapshotPipeline.buildSnapshot({
      version: 'v1.1.0',
      actorUid: 'system-admin',
      actorRole: 'super-admin',
      reason: 'Sharded migration release',
      sourceIds: ['kent_1908', 'boericke_1927']
    });
    console.log(`v1.1.0 Built. Status: ${manifest2.validationStatus}`);

    console.log("Activating v1.1.0...");
    await SnapshotPipeline.activateSnapshot(
      'v1.1.0',
      'system-admin',
      'super-admin',
      'Migration switch'
    );

    console.log("=== Sharded Build & Activation Completed Successfully ===");
  } catch (error: any) {
    console.error("❌ Snapshot Build script failed:", error);
    process.exit(1);
  }
}

main();
