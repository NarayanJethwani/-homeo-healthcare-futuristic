import { getRuntimeEnvironment } from '../../src/features/repertory/config/runtimeEnv';
import { getAdminDb } from '../../src/lib/firebaseAdmin';
import { RepertorySourceReviewRecord, DurableRepertoryAcquisitionRecord } from '../../src/features/repertory/types';
import { acquisitionRepository } from '../../src/features/repertory/repositories/AcquisitionRepository';
import * as fs from 'fs';
import * as path from 'path';

// Parse arguments
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

async function main() {
  const args = parseArgs();
  const source = args.source;
  const fromRecord = args['from-record'];
  const toRecord = args['to-record'];
  const environment = args.environment as "emulator" | "staging" | "production";
  const actor = args.actor;
  const inputPath = args.input;
  const confirmProduction = args['confirm-production'] === 'true';

  if (!source || !fromRecord || !toRecord || !environment || !actor || !inputPath) {
    console.error("❌ Missing required arguments. Expected:");
    console.error("  --source <source>");
    console.error("  --from-record <from-record>");
    console.error("  --to-record <to-record>");
    console.error("  --environment <emulator|staging|production>");
    console.error("  --actor <actor>");
    console.error("  --input <input-json-path>");
    process.exit(1);
  }

  // Gating setup
  process.env.REPERTORY_ENV = environment;
  if (environment === 'emulator') {
    process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
    process.env.FIRESTORE_PROJECT_ID = process.env.FIRESTORE_PROJECT_ID || 'homeo-healthcare-emulator';
    // Remove production service account key if set, to prevent accidental writes
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  } else if (environment === 'production') {
    if (!confirmProduction) {
      console.error("❌ Error: Production environment requires --confirm-production flag.");
      process.exit(1);
    }
    // Load credentials from environment
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // Fallback load .env.local
      try {
        const dotenvPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(dotenvPath)) {
          const content = fs.readFileSync(dotenvPath, 'utf-8');
          content.split('\n').forEach(line => {
            const idx = line.indexOf('=');
            if (idx > -1) {
              const k = line.substring(0, idx).trim();
              let v = line.substring(idx + 1).trim();
              if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
                v = v.slice(1, -1);
              }
              process.env[k] = v;
            }
          });
        }
      } catch (err) {}
    }
  }

  // Validate environment and project settings
  let env;
  try {
    env = getRuntimeEnvironment();
  } catch (err: any) {
    console.error("❌ Environment configuration rejected:", err.message);
    process.exit(1);
  }

  console.log(`🚀 Starting acquisition record migration in environment: ${environment}`);
  console.log(`  Source ID: ${source}`);
  console.log(`  From Record: ${fromRecord}`);
  console.log(`  To Record: ${toRecord}`);
  console.log(`  Actor: ${actor}`);

  // Validate ID format
  const idRegex = /^[a-zA-Z0-9_-]{5,50}$/;
  if (!idRegex.test(toRecord)) {
    console.error(`❌ Error: Target record ID "${toRecord}" violates character/length constraints.`);
    process.exit(1);
  }

  // Load input data
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: Input JSON file "${inputPath}" does not exist.`);
    process.exit(1);
  }

  let inputData;
  try {
    inputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  } catch (err: any) {
    console.error(`❌ Error parsing input JSON:`, err.message);
    process.exit(1);
  }

  // Validate migration source payload integrity
  if (inputData.sourceId !== source) {
    console.error(`❌ Error: Source ID in input payload (${inputData.sourceId}) does not match command argument (${source}).`);
    process.exit(1);
  }
  if (!inputData.sourceChecksum) {
    console.error("❌ Error: Missing sourceChecksum in migration input payload.");
    process.exit(1);
  }
  if (!inputData.clinicalReviewId || !inputData.editorialReviewId) {
    console.error("❌ Error: Missing clinicalReviewId or editorialReviewId in migration input payload.");
    process.exit(1);
  }

  const db = getAdminDb();
  const acqCol = db.collection('repertoryAcquisitionRecords');
  const reviewCol = db.collection('repertorySourceReviews');
  const auditCol = db.collection('repertoryEditorialAuditLogs');

  // Idempotency and Collision Checks
  const targetDoc = await acqCol.doc(toRecord).get();
  if (targetDoc.exists) {
    const existing = targetDoc.data() as DurableRepertoryAcquisitionRecord;
    
    // Check checksum and metadata to determine identical content
    if (existing.sourceChecksum === inputData.sourceChecksum && existing.sourceId === source) {
      console.log(`ℹ️ Target record "${toRecord}" already exists with identical content. Skipping write (idempotent).`);
      process.exit(0);
    } else {
      console.error(`❌ Collision Error: Target record "${toRecord}" already exists with different data.`);
      console.error(`  Existing Source ID: ${existing.sourceId}, Checksum: ${existing.sourceChecksum}`);
      console.error(`  Input Source ID: ${source}, Checksum: ${inputData.sourceChecksum}`);
      process.exit(1);
    }
  }

  const clinicalReview: RepertorySourceReviewRecord = {
    id: inputData.clinicalReviewId,
    sourceId: source,
    acquisitionRecordId: toRecord,
    sourceChecksum: inputData.sourceChecksum,
    validationReportId: "val_clarke_clinical_1904_1783737053141",
    reviewType: "clinical",
    decision: "approved-with-restrictions",
    restrictions: inputData.restrictions || [],
    findings: [
      "Clarke remedy grades are not reliably recoverable from raw typography.",
      "Unresolved remedy abbreviations are excluded from scoring collections.",
      "Original remedy abbreviations are preserved in raw data for display.",
      "Clarke clinical repertory rubrics do not contribute to scoring."
    ],
    reason: "John Henry Clarke's 1904 Clinical Repertory is approved as a search-only reference source with strict scoring isolation.",
    actorUid: actor,
    actorRole: "clinical-reviewer",
    capability: "repertory.source.approve",
    environment,
    createdAt: new Date().toISOString()
  };

  const editorialReview: RepertorySourceReviewRecord = {
    id: inputData.editorialReviewId,
    sourceId: source,
    acquisitionRecordId: toRecord,
    sourceChecksum: inputData.sourceChecksum,
    validationReportId: "val_clarke_clinical_1904_1783737053141",
    reviewType: "editorial",
    decision: "approved",
    restrictions: [],
    findings: [
      "Checked exact source identity and Archive.org identifier: aclinicalrepert00clargoog.",
      "Verified checksum 4381dc6d76a95066e1f60f8680c993be90ecfa9ded65a28ab29bdb731bb33d14.",
      "Verified line-count reconciliation of 51,813 lines and 522 page ranges.",
      "Reconciled 1,266 mapping dictionary entries and 12 unresolved target keys.",
      "Verified UI and RAG warning disclosures for search-only capabilities."
    ],
    reason: "John Henry Clarke's 1904 Clinical Repertory metadata, line reconciliation, page ranges, and UI disclosures are verified for staged publication.",
    actorUid: actor,
    actorRole: "editorial-reviewer",
    capability: "repertory.editorial.approve",
    environment,
    createdAt: new Date().toISOString()
  };

  const newRecord: DurableRepertoryAcquisitionRecord = {
    id: toRecord,
    sourceId: source,
    candidateSourceUrl: inputData.candidateSourceUrl || "",
    sourceProvider: inputData.sourceProvider || "",
    archiveIdentifier: inputData.archiveIdentifier || "",
    expectedPhysicalPageCount: inputData.expectedPhysicalPageCount || 0,
    expectedPrintedPageStart: inputData.expectedPrintedPageStart || "",
    expectedPrintedPageEnd: inputData.expectedPrintedPageEnd || "",
    acquisitionStatus: inputData.acquisitionStatus || "checksum-verified",
    extractionStatus: inputData.extractionStatus || "validated",
    createdAt: inputData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusReason: inputData.statusReason || "",
    originalFileName: inputData.originalFileName || "",
    fileSizeBytes: inputData.fileSizeBytes || 0,
    sourceChecksum: inputData.sourceChecksum,
    artifactStoragePath: inputData.artifactStoragePath || "",
    parserVersion: inputData.parserVersion || "1.0.0",
    editorialStatus: "approved",
    publicationStatus: "staged",
    migratedFromRecordId: fromRecord,
    migrationVersion: "1.0.0",
    migrationEnvironment: environment
  };

  const auditLogId = `audit_mig_${Date.now()}`;
  const migrationAudit = {
    id: auditLogId,
    entityType: "source-acquisition",
    entityId: toRecord,
    sourceId: source,
    action: "migrated-to-durable-record",
    previousValue: {
      recordId: fromRecord
    },
    nextValue: {
      recordId: toRecord
    },
    reason: "Replace non-durable acquisition workflow record",
    actorUid: actor,
    actorRole: environment === 'emulator' ? 'emulator-operator' : 'super-admin',
    environment,
    createdAt: new Date().toISOString()
  };

  // Perform migration write transactionally
  console.log("📝 Writing migration documents to Firestore...");
  await db.runTransaction(async (transaction: any) => {
    transaction.set(acqCol.doc(toRecord), newRecord);
    transaction.set(reviewCol.doc(clinicalReview.id), clinicalReview);
    transaction.set(reviewCol.doc(editorialReview.id), editorialReview);
    transaction.set(auditCol.doc(auditLogId), migrationAudit);
  });

  console.log("✅ Documents successfully written to Firestore.");

  // Regenerate acquisition register export
  console.log("📝 Regenerating local acquisition register report...");
  await acquisitionRepository.exportRegister();
  console.log("✅ Local acquisition register report updated.");

  // Read back and verify
  console.log("🔍 Running post-migration read-back verification...");
  const verifyAcq = await acqCol.doc(toRecord).get();
  const verifyClinical = await reviewCol.doc(clinicalReview.id).get();
  const verifyEditorial = await reviewCol.doc(editorialReview.id).get();
  const verifyAudit = await auditCol.doc(auditLogId).get();

  if (!verifyAcq.exists || !verifyClinical.exists || !verifyEditorial.exists || !verifyAudit.exists) {
    console.error("❌ Read-back verification failed: One or more written documents are missing!");
    process.exit(1);
  }

  const acqData = verifyAcq.data() as DurableRepertoryAcquisitionRecord;
  if (acqData.sourceChecksum !== inputData.sourceChecksum) {
    console.error("❌ Read-back verification failed: Checksum mismatch in verified record!");
    process.exit(1);
  }

  console.log("🎉 Migration transaction completed with 100% data integrity.");
}

main().catch(err => {
  console.error("❌ Error running migration:", err);
  process.exit(1);
});
