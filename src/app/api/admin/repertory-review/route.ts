import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/security/apiAuth';
import { EditorialRepository } from '@/features/repertory/repositories/EditorialRepository';
import { SourceCorpusRepository } from '@/features/repertory/repositories/SourceCorpusRepository';
import { PublishedCorpusRepository } from '@/features/repertory/repositories/PublishedCorpusRepository';
import { SnapshotPipeline } from '@/features/repertory/import-export/snapshotPipeline';
import { getSourceRecord } from '@/features/repertory/data/repertorySourceRegistry';
import { RepertoryRubricVersion, RepertoryEditorialAuditLog } from '@/features/repertory/types';
import repertoryRepository from '@/features/repertory/database/repertoryDb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Returns review queues, stats, and audit logs
export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, 'repertory.review.read', 'REPERTORY_REVIEW_GET');
    if (!auth.authorized) return auth.response;

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'queue';

    if (action === 'audit-logs') {
      const logs = await EditorialRepository.getAuditLogs();
      return NextResponse.json({ success: true, logs });
    }

    if (action === 'stats') {
      const activeVersion = await PublishedCorpusRepository.getActiveVersion();
      const rubrics = await PublishedCorpusRepository.getRubrics();
      
      const stats = {
        activeVersion,
        totalRubrics: rubrics.length,
        sources: manifestSourceBreakdown(rubrics),
      };
      return NextResponse.json({ success: true, stats });
    }

    if (action === 'release-readiness') {
      const version = url.searchParams.get('version') || '';
      if (!/^v\d+\.\d+\.\d+$/.test(version)) {
        return NextResponse.json({ success: false, message: 'A semantic corpus version is required.' }, { status: 400 });
      }
      const readiness = await SnapshotPipeline.getActivationReadiness(version);
      return NextResponse.json({ success: true, readiness }, {
        headers: { 'Cache-Control': 'private, no-store' },
      });
    }

    // Default queue list
    const currentApproved = await EditorialRepository.getAllCurrentApprovedVersions();
    return NextResponse.json({
      success: true,
      approvedVersionsCount: currentApproved.length,
      approvedVersionsList: currentApproved,
    });
  } catch (error: any) {
    console.error('Repertory Review GET failed:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

function manifestSourceBreakdown(rubrics: any[]) {
  const counts: Record<string, number> = {};
  rubrics.forEach(r => {
    counts[r.sourceId] = (counts[r.sourceId] || 0) + 1;
  });
  return counts;
}

// POST: Enforces command model, schemas, status validations and capabilities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ success: false, message: "Missing command action." }, { status: 400 });
    }

    // Derive required permission based on action
    let permission: any = '';
    if (action === 'create-correction') permission = 'repertory.review.correct';
    else if (action === 'resolve-remedy') permission = 'repertory.remedy.resolve';
    else if (action === 'map-concept') permission = 'repertory.concept.map';
    else if (action === 'transition-status') permission = 'repertory.status.transition';
    else if (action === 'request-publication') permission = 'repertory.publish.request';
    else if (action === 'activate-snapshot') permission = 'repertory.snapshot.activate';
    else if (action === 'rollback-snapshot') permission = 'repertory.snapshot.rollback';
    else {
      return NextResponse.json({ success: false, message: `Invalid action: ${action}` }, { status: 400 });
    }

    const auth = await authorizeRequest(request, permission, `REPERTORY_REVIEW_POST_${action}`);
    if (!auth.authorized) return auth.response;

    const actorUid = auth.session.uid;
    const actorRole = auth.session.role;

    // Execute Commands
    if (action === 'create-correction') {
      const { rubricId, correctedDisplayText, reason } = body;
      if (!rubricId || !correctedDisplayText || !reason) {
        return NextResponse.json({ success: false, message: "Missing required fields: rubricId, correctedDisplayText, reason." }, { status: 400 });
      }

      // Load base rubric reference from static corpus
      const rubric = await repertoryRepository.getRubricById(rubricId);
      if (!rubric) {
        return NextResponse.json({ success: false, message: `Rubric not found: ${rubricId}` }, { status: 404 });
      }

      const latest = await EditorialRepository.getLatestRubricVersion(rubricId);
      const versionNumber = latest ? latest.versionNumber + 1 : 1;

      const version: RepertoryRubricVersion = {
        id: `${rubricId}_v${versionNumber}`,
        rubricId,
        sourceId: rubric.sourceId || 'unknown',
        baseSourceVersion: rubric.sourceCitation || rubric.source || '1900',
        versionNumber,
        originalExtractedText: rubric.originalText || rubric.classicalWording,
        correctedDisplayText,
        normalizedText: correctedDisplayText.toLowerCase(),
        originalRemedyEntries: rubric.remedyEntries || [],
        correctionReason: reason,
        editorialStatus: 'draft',
        createdByUid: actorUid,
        createdByRole: actorRole,
        createdAt: new Date().toISOString(),
        isCurrentApprovedVersion: false
      };

      await EditorialRepository.saveRubricVersion(version);

      await EditorialRepository.saveAuditLog({
        id: `audit_correction_${rubricId}_v${versionNumber}_${Date.now()}`,
        entityType: 'rubric-version',
        entityId: version.id,
        sourceId: rubric.sourceId || 'unknown',
        action: 'corrected',
        reason,
        actorUid,
        actorRole,
        versionId: version.id,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: 'Correction version created.', version });
    }

    if (action === 'resolve-remedy') {
      const { rubricId, sourceAbbreviation, canonicalRemedyId, reason } = body;
      if (!rubricId || !sourceAbbreviation || !canonicalRemedyId || !reason) {
        return NextResponse.json({ success: false, message: "Missing required fields: rubricId, sourceAbbreviation, canonicalRemedyId, reason." }, { status: 400 });
      }

      const rubric = await repertoryRepository.getRubricById(rubricId);
      if (!rubric) {
        return NextResponse.json({ success: false, message: `Rubric not found: ${rubricId}` }, { status: 404 });
      }

      const latest = await EditorialRepository.getLatestRubricVersion(rubricId);
      const versionNumber = latest ? latest.versionNumber + 1 : 1;
      const baseRemedyEntries = latest?.correctedRemedyEntries || rubric.remedyEntries || [];

      // Update mapping in remedyEntries list
      let matched = false;
      const correctedRemedyEntries = baseRemedyEntries.map((rem: any) => {
        if (rem.sourceAbbreviation === sourceAbbreviation) {
          matched = true;
          return {
            ...rem,
            canonicalAbbreviation: canonicalRemedyId,
            remedyId: canonicalRemedyId
          };
        }
        return rem;
      });

      if (!matched) {
        return NextResponse.json({ success: false, message: `Remedy entry not found for abbreviation: ${sourceAbbreviation}` }, { status: 404 });
      }

      const version: RepertoryRubricVersion = {
        id: `${rubricId}_v${versionNumber}`,
        rubricId,
        sourceId: rubric.sourceId || 'unknown',
        baseSourceVersion: rubric.sourceCitation || rubric.source || '1900',
        versionNumber,
        originalExtractedText: rubric.originalText || rubric.classicalWording,
        correctedDisplayText: latest?.correctedDisplayText || rubric.title,
        normalizedText: (latest?.correctedDisplayText || rubric.title).toLowerCase(),
        originalRemedyEntries: rubric.remedyEntries || [],
        correctedRemedyEntries,
        correctionReason: reason,
        editorialStatus: 'draft',
        createdByUid: actorUid,
        createdByRole: actorRole,
        createdAt: new Date().toISOString(),
        isCurrentApprovedVersion: false
      };

      await EditorialRepository.saveRubricVersion(version);

      await EditorialRepository.saveAuditLog({
        id: `audit_remedy_${rubricId}_v${versionNumber}_${Date.now()}`,
        entityType: 'rubric-version',
        entityId: version.id,
        sourceId: rubric.sourceId || 'unknown',
        action: 'remedy-resolved',
        reason,
        actorUid,
        actorRole,
        versionId: version.id,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: 'Remedy resolution saved to version.', version });
    }

    if (action === 'map-concept') {
      const { rubricId, canonicalConceptId, reason } = body;
      if (!rubricId || !canonicalConceptId || !reason) {
        return NextResponse.json({ success: false, message: "Missing required fields: rubricId, canonicalConceptId, reason." }, { status: 400 });
      }

      const rubric = await repertoryRepository.getRubricById(rubricId);
      if (!rubric) {
        return NextResponse.json({ success: false, message: `Rubric not found: ${rubricId}` }, { status: 404 });
      }

      const latest = await EditorialRepository.getLatestRubricVersion(rubricId);
      const versionNumber = latest ? latest.versionNumber + 1 : 1;

      const version: RepertoryRubricVersion = {
        id: `${rubricId}_v${versionNumber}`,
        rubricId,
        sourceId: rubric.sourceId || 'unknown',
        baseSourceVersion: rubric.sourceCitation || rubric.source || '1900',
        versionNumber,
        originalExtractedText: rubric.originalText || rubric.classicalWording,
        correctedDisplayText: latest?.correctedDisplayText || rubric.title,
        normalizedText: (latest?.correctedDisplayText || rubric.title).toLowerCase(),
        originalRemedyEntries: rubric.remedyEntries || [],
        correctedRemedyEntries: latest?.correctedRemedyEntries || rubric.remedyEntries || [],
        correctionReason: reason,
        editorialStatus: 'draft',
        createdByUid: actorUid,
        createdByRole: actorRole,
        createdAt: new Date().toISOString(),
        isCurrentApprovedVersion: false
      };

      await EditorialRepository.saveRubricVersion(version);

      await EditorialRepository.saveAuditLog({
        id: `audit_concept_${rubricId}_v${versionNumber}_${Date.now()}`,
        entityType: 'concept-mapping',
        entityId: rubricId,
        sourceId: rubric.sourceId || 'unknown',
        action: 'concept-mapped',
        reason,
        actorUid,
        actorRole,
        versionId: version.id,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: 'Concept mapping version created.', version });
    }

    if (action === 'transition-status') {
      const { versionId, nextStatus, reason } = body;
      if (!versionId || !nextStatus || !reason) {
        return NextResponse.json({ success: false, message: "Missing required fields: versionId, nextStatus, reason." }, { status: 400 });
      }

      const version = await EditorialRepository.getRubricVersionById(versionId);
      if (!version) {
        return NextResponse.json({ success: false, message: `Version not found: ${versionId}` }, { status: 404 });
      }

      // Validate transitions
      const currentStatus = version.editorialStatus;
      const allowedTransitions: Record<string, string[]> = {
        'draft': ['clinical-review'],
        'clinical-review': ['editorial-review', 'approved', 'rejected'],
        'editorial-review': ['approved', 'rejected'],
        'approved': ['published', 'archived'],
        'published': ['archived'],
        'rejected': ['draft'],
        'archived': ['draft']
      };

      if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
        return NextResponse.json({ 
          success: false, 
          message: `Invalid status transition from '${currentStatus}' to '${nextStatus}'.` 
        }, { status: 422 });
      }

      // If transitioning to approved/published, check extra approval permission
      if (['approved', 'published'].includes(nextStatus)) {
        const publishCheck = await authorizeRequest(request, 'repertory.publish.approve', `REPERTORY_APPROVE_TRANSITION_${versionId}`);
        if (!publishCheck.authorized) return publishCheck.response;
      }

      const updatedVersion = {
        ...version,
        editorialStatus: nextStatus,
        reviewedByUid: actorUid,
        reviewedAt: new Date().toISOString(),
        isCurrentApprovedVersion: ['approved', 'published'].includes(nextStatus)
      };

      await EditorialRepository.saveRubricVersion(updatedVersion);

      // Audit status action
      let actionName: RepertoryEditorialAuditLog['action'] = 'submitted';
      if (nextStatus === 'approved') actionName = 'approved';
      else if (nextStatus === 'published') actionName = 'published';
      else if (nextStatus === 'rejected') actionName = 'rejected';
      else if (nextStatus === 'archived') actionName = 'archived';

      await EditorialRepository.saveAuditLog({
        id: `audit_status_${versionId}_${Date.now()}`,
        entityType: 'rubric-version',
        entityId: versionId,
        sourceId: version.sourceId,
        action: actionName,
        reason,
        actorUid,
        actorRole,
        versionId,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: `Status updated to ${nextStatus}.`, version: updatedVersion });
    }

    if (action === 'request-publication') {
      const { sourceIds, version, reason } = body;
      if (!sourceIds || !Array.isArray(sourceIds) || !version || !reason) {
        return NextResponse.json({ success: false, message: "Missing required fields: sourceIds, version, reason." }, { status: 400 });
      }

      // Build the snapshot
      const manifest = await SnapshotPipeline.buildSnapshot({
        version,
        actorUid,
        actorRole,
        reason,
        sourceIds
      });

      return NextResponse.json({ success: true, message: 'Snapshot successfully generated.', manifest });
    }

    if (action === 'activate-snapshot') {
      const { version, reason } = body;
      if (!version || !reason) {
        return NextResponse.json({ success: false, message: "Missing version or reason." }, { status: 400 });
      }

      await SnapshotPipeline.activateSnapshot(version, actorUid, actorRole, reason);
      return NextResponse.json({ success: true, message: `Corpus snapshot ${version} is now active.` });
    }

    if (action === 'rollback-snapshot') {
      const { reason } = body;
      if (!reason) {
        return NextResponse.json({ success: false, message: "Missing reason." }, { status: 400 });
      }

      const activeVersion = await SnapshotPipeline.rollbackSnapshot(actorUid, actorRole, reason);
      return NextResponse.json({ success: true, message: `Successfully rolled back to active version ${activeVersion}.` });
    }

    return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error('Repertory Review POST failed:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
