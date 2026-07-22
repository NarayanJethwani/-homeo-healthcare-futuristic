import fs from "fs";
import path from "path";
import { getAdminDb } from "../../src/lib/firebaseAdmin";

const VERSION_PATTERN = /^v\d+\.\d+\.\d+$/;

async function main() {
  const args = process.argv.slice(2);
  const versionIndex = args.indexOf("--version");
  const version = versionIndex >= 0 ? args[versionIndex + 1] : "";
  if (!VERSION_PATTERN.test(version) || !args.includes("--execute")) {
    throw new Error("Provide --version vX.Y.Z --execute to sync reviewed approvals.");
  }

  const manifestPath = path.join(process.cwd(), "data", "repertory", "published", version, "manifest.json");
  const reviewsPath = path.join(process.cwd(), "data", "repertory", "reports", "source-reviews.json");
  const acquisitionPath = path.join(process.cwd(), "data", "repertory", "migrations", "clarke-acquisition-export.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));
  const acquisition = JSON.parse(fs.readFileSync(acquisitionPath, "utf8"));

  if (manifest.corpusVersion !== version || manifest.validationStatus !== "passed") {
    throw new Error("Release manifest is not validated for the requested version.");
  }
  const sourceId = "clarke_clinical_1904";
  const capabilities = manifest.sourceCapabilities?.[sourceId];
  if (!capabilities || capabilities.scoringEnabled || capabilities.normalizedScoringEnabled) {
    throw new Error("Clarke must remain search-only with all scoring disabled.");
  }

  const clinical = reviews.find((review: any) => review.id === "rev_clinical_clarke_1904");
  const editorial = reviews.find((review: any) => review.id === "rev_editorial_clarke_1904");
  if (!clinical || clinical.decision !== "approved-with-restrictions" ||
      !clinical.restrictions?.includes("search-only") ||
      !clinical.restrictions?.includes("scoring-disabled")) {
    throw new Error("Reviewed Clarke clinical approval is missing its required restrictions.");
  }
  if (!editorial || editorial.decision !== "approved") {
    throw new Error("Reviewed Clarke editorial approval is missing.");
  }

  const compiledSourceChecksum = manifest.sourceChecksums?.[sourceId];
  if (!compiledSourceChecksum || !acquisition.sourceChecksum) {
    throw new Error("Release or acquisition checksum is missing.");
  }

  const db = getAdminDb();
  const syncedAt = new Date().toISOString();
  const records = [clinical, editorial].map((review: any) => ({
    ...review,
    acquisitionRecordId: acquisition.id,
    sourceChecksum: compiledSourceChecksum,
    acquisitionSourceChecksum: acquisition.sourceChecksum,
    environment: "production",
    releaseVersion: version,
    syncedAt,
  }));

  await db.runTransaction(async (transaction: any) => {
    for (const record of records) {
      transaction.set(db.collection("repertorySourceReviews").doc(record.id), record);
      const auditId = `audit_${version.replace(/\W/g, "_")}_${record.id}`;
      transaction.set(db.collection("repertoryEditorialAuditLogs").doc(auditId), {
        id: auditId,
        entityType: "source",
        entityId: sourceId,
        action: "updated",
        reason: `Synchronized reviewed ${record.reviewType} approval for governed release ${version}.`,
        actorUid: record.actorUid,
        actorRole: record.actorRole,
        releaseVersion: version,
        createdAt: syncedAt,
      });
    }
  });

  console.log(JSON.stringify({
    version,
    sourceId,
    approvalsSynchronized: records.map((record: any) => record.id),
    clinicalRestrictions: clinical.restrictions,
    scoringEnabled: capabilities.scoringEnabled,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
