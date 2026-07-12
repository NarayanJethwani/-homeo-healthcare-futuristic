import { acquisitionRepository } from '../../src/features/repertory/repositories/AcquisitionRepository';
import { EditorialRepository } from '../../src/features/repertory/repositories/EditorialRepository';
import { RepertorySourceReviewRecord } from '../../src/features/repertory/types';
import { getAdminDb } from '../../src/lib/firebaseAdmin';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  console.log("📝 Registering Clinical and Editorial Approvals for Clarke 1904...");

  const sourceId = "clarke_clinical_1904";
  const recordId = "acq_mem_1783737053141_93sifuaqp";
  const sourceChecksum = "4381dc6d76a95066e1f60f8680c993be90ecfa9ded65a28ab29bdb731bb33d14";

  const clinicalReview: RepertorySourceReviewRecord = {
    id: "rev_clinical_clarke_1904",
    sourceId,
    acquisitionRecordId: recordId,
    sourceChecksum,
    validationReportId: "val_clarke_clinical_1904_1783737053141",
    reviewType: "clinical",
    decision: "approved-with-restrictions",
    restrictions: [
      "search-only",
      "scoring-disabled",
      "unresolved-remedies-disclosed",
      "original-abbreviations-preserved"
    ],
    findings: [
      "Clarke remedy grades are not reliably recoverable from raw typography.",
      "Unresolved remedy abbreviations are excluded from scoring collections.",
      "Original remedy abbreviations are preserved in raw data for display.",
      "Clarke clinical repertory rubrics do not contribute to scoring."
    ],
    reason: "John Henry Clarke's 1904 Clinical Repertory is approved as a search-only reference source with strict scoring isolation.",
    actorUid: "reviewer_clinical_01",
    actorRole: "clinical-reviewer",
    capability: "repertory.source.approve",
    environment: "emulator",
    createdAt: new Date().toISOString()
  };

  const editorialReview: RepertorySourceReviewRecord = {
    id: "rev_editorial_clarke_1904",
    sourceId,
    acquisitionRecordId: recordId,
    sourceChecksum,
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
    actorUid: "reviewer_editorial_01",
    actorRole: "editorial-reviewer",
    capability: "repertory.editorial.approve",
    environment: "emulator",
    createdAt: new Date().toISOString()
  };

  // 1. Persist to Firestore if available
  const isFirestore = process.env.NODE_ENV !== 'test' && !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (isFirestore) {
    try {
      const db = getAdminDb();
      await db.collection('repertorySourceReviews').doc(clinicalReview.id).set(clinicalReview);
      await db.collection('repertorySourceReviews').doc(editorialReview.id).set(editorialReview);
      
      await db.collection('repertoryEditorialAuditLogs').doc(`audit_rev_clin_${Date.now()}`).set({
        id: `audit_rev_clin_${Date.now()}`,
        entityType: "source",
        entityId: sourceId,
        action: "updated",
        reason: clinicalReview.reason,
        actorUid: clinicalReview.actorUid,
        actorRole: clinicalReview.actorRole,
        createdAt: clinicalReview.createdAt
      });

      await db.collection('repertoryEditorialAuditLogs').doc(`audit_rev_edit_${Date.now()}`).set({
        id: `audit_rev_edit_${Date.now()}`,
        entityType: "source",
        entityId: sourceId,
        action: "updated",
        reason: editorialReview.reason,
        actorUid: editorialReview.actorUid,
        actorRole: editorialReview.actorRole,
        createdAt: editorialReview.createdAt
      });

      await db.collection('repertoryAcquisitionRecords').doc(recordId).update({
        editorialStatus: "approved",
        publicationStatus: "staged",
        updatedAt: new Date().toISOString()
      });

      console.log("✅ Successfully saved reviews and updated status in Firestore.");
    } catch (e: any) {
      console.warn("⚠️ Failed to write to Firestore, falling back to local files.", e.message);
    }
  }

  // 2. Persist locally to reports/source-reviews.json
  const reportsDir = path.join(process.cwd(), 'data', 'repertory', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reviewsPath = path.join(reportsDir, 'source-reviews.json');
  let existingReviews: RepertorySourceReviewRecord[] = [];
  if (fs.existsSync(reviewsPath)) {
    try {
      existingReviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
    } catch (e) {}
  }

  existingReviews = existingReviews.filter(r => r.id !== clinicalReview.id && r.id !== editorialReview.id);
  existingReviews.push(clinicalReview, editorialReview);
  fs.writeFileSync(reviewsPath, JSON.stringify(existingReviews, null, 2), 'utf-8');
  console.log(`✅ Saved clinical & editorial reviews locally to ${reviewsPath}`);

  // 3. Update the local acquisition register record and export it
  const record = await acquisitionRepository.getById(recordId);
  if (record) {
    record.editorialStatus = "approved";
    record.publicationStatus = "staged";
    record.updatedAt = new Date().toISOString();
    // Re-save in memory map if repository is in-memory
    const recordsMap = (acquisitionRepository as any).records;
    if (recordsMap) {
      recordsMap.set(recordId, record);
    }
    await acquisitionRepository.exportRegister();
    console.log("✅ Updated local acquisition register report successfully.");
  } else {
    console.error(`❌ Error: Local acquisition record ${recordId} not found.`);
  }
}

main().catch(err => {
  console.error("❌ Error running submitApprovals script:", err);
  process.exit(1);
});
