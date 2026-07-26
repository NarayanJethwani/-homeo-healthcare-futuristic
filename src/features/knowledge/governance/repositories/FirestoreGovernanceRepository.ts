/**
 * Phase 2.2B — Firestore & In-Memory Governance Repository Adapters
 */

import { getAdminDb } from "../../../../lib/firebaseAdmin";
import {
  Contributor,
  ContributorId,
  AuthorshipRecord,
  ContentRevision,
  ClinicalReviewRecord,
  EvidenceProfile,
  ClinicalClaim,
  AiIngestionApproval,
  GovernanceAuditEvent,
} from "../types/governanceTypes";
import {
  GovernanceRepository,
  GovernanceTransaction,
  ReviewerQualificationDecision,
  EntityGovernanceState,
} from "./GovernanceRepository";

export const GOVERNANCE_COLLECTIONS = {
  CONTRIBUTORS: "knowledgeGovernanceContributors",
  QUALIFICATIONS: "knowledgeGovernanceQualifications",
  AUTHORSHIP: "knowledgeGovernanceAuthorship",
  REVISIONS: "knowledgeGovernanceRevisions",
  REVIEWS: "knowledgeGovernanceReviews",
  EVIDENCE_PROFILES: "knowledgeGovernanceEvidenceProfiles",
  CLAIMS: "knowledgeGovernanceClaims",
  AI_APPROVALS: "knowledgeGovernanceAiApprovals",
  AUDIT_EVENTS: "knowledgeGovernanceAuditEvents",
  ENTITY_STATE: "knowledgeGovernanceEntityState",
} as const;

export class FirestoreGovernanceRepository implements GovernanceRepository {
  private db() {
    return getAdminDb();
  }

  async createContributor(record: Contributor): Promise<void> {
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.CONTRIBUTORS)
      .doc(record.id)
      .set(record);
  }

  async getContributor(id: ContributorId): Promise<Contributor | null> {
    const doc = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.CONTRIBUTORS)
      .doc(id)
      .get();
    return doc.exists ? (doc.data() as Contributor) : null;
  }

  async createQualificationDecision(decision: ReviewerQualificationDecision): Promise<void> {
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.QUALIFICATIONS)
      .doc(decision.id)
      .set(decision);
  }

  async getActiveQualificationDecisions(contributorId: ContributorId): Promise<ReviewerQualificationDecision[]> {
    const snap = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.QUALIFICATIONS)
      .where("contributorId", "==", contributorId)
      .where("status", "==", "qualified")
      .get();
    return snap.docs.map((d: any) => d.data() as ReviewerQualificationDecision);
  }

  async createAuthorshipRecord(record: AuthorshipRecord & { entityId: string }): Promise<void> {
    const docId = `AUTH-${record.entityId}-${record.contributorId}`;
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.AUTHORSHIP)
      .doc(docId)
      .set(record);
  }

  async listAuthorshipRecords(entityId: string): Promise<AuthorshipRecord[]> {
    const snap = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.AUTHORSHIP)
      .where("entityId", "==", entityId)
      .get();
    return snap.docs.map((d: any) => d.data() as AuthorshipRecord);
  }

  async createContentRevision(record: ContentRevision): Promise<void> {
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.REVISIONS)
      .doc(record.revisionId)
      .set(record);
  }

  async getContentRevision(revisionId: string): Promise<ContentRevision | null> {
    const doc = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.REVISIONS)
      .doc(revisionId)
      .get();
    return doc.exists ? (doc.data() as ContentRevision) : null;
  }

  async getCurrentRevision(entityId: string): Promise<ContentRevision | null> {
    const snap = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.REVISIONS)
      .where("entityId", "==", entityId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0].data() as ContentRevision;
  }

  async createClinicalReview(record: ClinicalReviewRecord & { entityId: string }): Promise<void> {
    const docId = `REV-${record.entityId}-${record.reviewerId}-${Date.now()}`;
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.REVIEWS)
      .doc(docId)
      .set(record);
  }

  async listClinicalReviews(entityId: string, revisionId?: string): Promise<ClinicalReviewRecord[]> {
    let q = this.db()
      .collection(GOVERNANCE_COLLECTIONS.REVIEWS)
      .where("entityId", "==", entityId);
    if (revisionId) {
      q = q.where("reviewedVersion", "==", revisionId);
    }
    const snap = await q.get();
    return snap.docs.map((d: any) => d.data() as ClinicalReviewRecord);
  }

  async createEvidenceProfile(profile: EvidenceProfile): Promise<void> {
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.EVIDENCE_PROFILES)
      .doc(profile.id)
      .set(profile);
  }

  async getEvidenceProfile(entityId: string, revisionId: string): Promise<EvidenceProfile | null> {
    const snap = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.EVIDENCE_PROFILES)
      .where("entityId", "==", entityId)
      .where("revisionId", "==", revisionId)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return snap.docs[0].data() as EvidenceProfile;
  }

  async createClinicalClaim(claim: ClinicalClaim): Promise<void> {
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.CLAIMS)
      .doc(claim.id)
      .set(claim);
  }

  async listClinicalClaims(entityId: string, revisionId: string): Promise<ClinicalClaim[]> {
    const snap = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.CLAIMS)
      .where("entityId", "==", entityId)
      .where("revisionId", "==", revisionId)
      .get();
    return snap.docs.map((d: any) => d.data() as ClinicalClaim);
  }

  async createAiIngestionApproval(approval: AiIngestionApproval): Promise<void> {
    const docId = `AI-APP-${approval.entityId}-${approval.revisionId}`;
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.AI_APPROVALS)
      .doc(docId)
      .set(approval);
  }

  async getAiIngestionApproval(entityId: string, revisionId: string): Promise<AiIngestionApproval | null> {
    const docId = `AI-APP-${entityId}-${revisionId}`;
    const doc = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.AI_APPROVALS)
      .doc(docId)
      .get();
    return doc.exists ? (doc.data() as AiIngestionApproval) : null;
  }

  async appendAuditEvent(event: GovernanceAuditEvent): Promise<void> {
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.AUDIT_EVENTS)
      .doc(event.id)
      .set(event);
  }

  async listAuditEvents(entityId: string): Promise<GovernanceAuditEvent[]> {
    const snap = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.AUDIT_EVENTS)
      .where("entityId", "==", entityId)
      .orderBy("createdAt", "asc")
      .get();
    return snap.docs.map((d: any) => d.data() as GovernanceAuditEvent);
  }

  async getEntityGovernanceState(entityId: string): Promise<EntityGovernanceState | null> {
    const doc = await this.db()
      .collection(GOVERNANCE_COLLECTIONS.ENTITY_STATE)
      .doc(entityId)
      .get();
    return doc.exists ? (doc.data() as EntityGovernanceState) : null;
  }

  async updateEntityGovernanceState(state: EntityGovernanceState): Promise<void> {
    await this.db()
      .collection(GOVERNANCE_COLLECTIONS.ENTITY_STATE)
      .doc(state.entityId)
      .set(state, { merge: true });
  }

  async runInTransaction<T>(operation: (tx: GovernanceTransaction) => Promise<T>): Promise<T> {
    return this.db().runTransaction(async (firestoreTx: any) => {
      const txAdapter: GovernanceTransaction = {
        createContributor: async (record) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.CONTRIBUTORS).doc(record.id);
          firestoreTx.set(ref, record);
        },
        createQualificationDecision: async (decision) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.QUALIFICATIONS).doc(decision.id);
          firestoreTx.set(ref, decision);
        },
        createAuthorshipRecord: async (record) => {
          const docId = `AUTH-${record.entityId}-${record.contributorId}`;
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.AUTHORSHIP).doc(docId);
          firestoreTx.set(ref, record);
        },
        createContentRevision: async (record) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.REVISIONS).doc(record.revisionId);
          firestoreTx.set(ref, record);
        },
        createClinicalReview: async (record) => {
          const docId = record.id || `REV-${record.entityId}-${record.reviewerId}-${record.reviewedVersion}`;
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.REVIEWS).doc(docId);
          const snap = await firestoreTx.get(ref);
          if (snap.exists) {
            const existing = snap.data();
            if (JSON.stringify(existing) === JSON.stringify(record)) {
              return; // Idempotent duplicate insert
            }
            throw new Error(`RECORD_IMMUTABLE_CONFLICT: Review record ${docId} already exists with different content`);
          }
          firestoreTx.set(ref, { ...record, id: docId });
        },
        createEvidenceProfile: async (profile) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.EVIDENCE_PROFILES).doc(profile.id);
          firestoreTx.set(ref, profile);
        },
        createClinicalClaim: async (claim) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.CLAIMS).doc(claim.id);
          firestoreTx.set(ref, claim);
        },
        createAiIngestionApproval: async (approval) => {
          const docId = `AI-APP-${approval.entityId}-${approval.revisionId}`;
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.AI_APPROVALS).doc(docId);
          const snap = await firestoreTx.get(ref);
          if (snap.exists) {
            const existing = snap.data();
            if (JSON.stringify(existing) === JSON.stringify(approval)) {
              return;
            }
            throw new Error(`RECORD_IMMUTABLE_CONFLICT: AI Approval record ${docId} already exists with different content`);
          }
          firestoreTx.set(ref, approval);
        },
        appendAuditEvent: async (event) => {
          const entityId = event.entityId || 'GLOBAL';
          const chainHeadRef = this.db().collection('knowledgeGovernanceAuditChainHeads').doc(entityId);
          const chainSnap = await firestoreTx.get(chainHeadRef);

          const currentSeq = chainSnap.exists ? (chainSnap.data().sequenceNumber || 0) : 0;
          const prevHash = chainSnap.exists ? (chainSnap.data().eventHash || 'GENESIS') : 'GENESIS';

          const nextSeq = currentSeq + 1;
          const updatedEvent: GovernanceAuditEvent = {
            ...event,
            sequenceNumber: nextSeq,
            previousEventHash: prevHash,
            id: event.id || `AUD-${entityId}-${nextSeq}-${Date.now()}`
          };

          const eventRef = this.db().collection(GOVERNANCE_COLLECTIONS.AUDIT_EVENTS).doc(updatedEvent.id);
          const eventSnap = await firestoreTx.get(eventRef);
          if (eventSnap.exists) {
            const existing = eventSnap.data();
            if (JSON.stringify(existing) === JSON.stringify(updatedEvent)) {
              return;
            }
            throw new Error(`RECORD_IMMUTABLE_CONFLICT: Audit event record ${updatedEvent.id} already exists with different content`);
          }

          firestoreTx.set(eventRef, updatedEvent);
          firestoreTx.set(chainHeadRef, {
            entityId,
            sequenceNumber: nextSeq,
            eventHash: updatedEvent.eventHash || 'GENESIS',
            updatedAt: new Date().toISOString()
          });
        },
        updateEntityGovernanceState: async (state) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.ENTITY_STATE).doc(state.entityId);
          firestoreTx.set(ref, state, { merge: true });
        },
        getContributor: async (id) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.CONTRIBUTORS).doc(id);
          const snap = await firestoreTx.get(ref);
          return snap.exists ? (snap.data() as Contributor) : null;
        },
        getEntityGovernanceState: async (entityId) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.ENTITY_STATE).doc(entityId);
          const snap = await firestoreTx.get(ref);
          return snap.exists ? (snap.data() as EntityGovernanceState) : null;
        },
        getContentRevision: async (revisionId) => {
          const ref = this.db().collection(GOVERNANCE_COLLECTIONS.REVISIONS).doc(revisionId);
          const snap = await firestoreTx.get(ref);
          return snap.exists ? (snap.data() as ContentRevision) : null;
        },
        getCurrentRevision: async (entityId) => {
          const snap = await this.getCurrentRevision(entityId);
          return snap;
        },
        listQualificationDecisions: async (contributorId) => {
          const snap = await this.getActiveQualificationDecisions(contributorId);
          return snap;
        },
        listAuthorshipRecords: async (entityId) => {
          const snap = await this.listAuthorshipRecords(entityId);
          return snap;
        },
        listClinicalReviews: async (entityId, revisionId) => {
          const snap = await this.listClinicalReviews(entityId, revisionId);
          return snap;
        },
      };

      return await operation(txAdapter);
    });
  }
}

/**
 * In-Memory Governance Repository for Unit Tests & Process-Local Fallbacks
 */
export class MemoryGovernanceRepository implements GovernanceRepository {
  private contributors = new Map<string, Contributor>();
  private qualifications = new Map<string, ReviewerQualificationDecision>();
  private authorship = new Map<string, AuthorshipRecord & { entityId: string }>();
  private revisions = new Map<string, ContentRevision>();
  private reviews = new Map<string, ClinicalReviewRecord & { entityId: string }>();
  private evidenceProfiles = new Map<string, EvidenceProfile>();
  private claims = new Map<string, ClinicalClaim>();
  private aiApprovals = new Map<string, AiIngestionApproval>();
  private auditEvents = new Map<string, GovernanceAuditEvent>();
  private entityStates = new Map<string, EntityGovernanceState>();

  private auditChainHeads = new Map<string, { sequenceNumber: number; eventHash: string }>();

  async createContributor(record: Contributor): Promise<void> {
    this.contributors.set(record.id, { ...record });
  }

  async getContributor(id: ContributorId): Promise<Contributor | null> {
    const c = this.contributors.get(id);
    return c ? { ...c } : null;
  }

  async createQualificationDecision(decision: ReviewerQualificationDecision): Promise<void> {
    const existing = this.qualifications.get(decision.id);
    if (existing) {
      if (JSON.stringify(existing) === JSON.stringify(decision)) return;
      throw new Error(`RECORD_IMMUTABLE_CONFLICT: Qualification ${decision.id} already exists with different content`);
    }
    this.qualifications.set(decision.id, { ...decision });
  }

  async getActiveQualificationDecisions(contributorId: ContributorId): Promise<ReviewerQualificationDecision[]> {
    return Array.from(this.qualifications.values()).filter(
      (q) => q.contributorId === contributorId && q.status === "qualified"
    );
  }

  async createAuthorshipRecord(record: AuthorshipRecord & { entityId: string }): Promise<void> {
    const docId = `AUTH-${record.entityId}-${record.contributorId}`;
    this.authorship.set(docId, { ...record });
  }

  async listAuthorshipRecords(entityId: string): Promise<AuthorshipRecord[]> {
    return Array.from(this.authorship.values()).filter((a) => a.entityId === entityId);
  }

  async createContentRevision(record: ContentRevision): Promise<void> {
    this.revisions.set(record.revisionId, { ...record });
  }

  async getContentRevision(revisionId: string): Promise<ContentRevision | null> {
    const r = this.revisions.get(revisionId);
    return r ? { ...r } : null;
  }

  async getCurrentRevision(entityId: string): Promise<ContentRevision | null> {
    const matches = Array.from(this.revisions.values())
      .filter((r) => r.entityId === entityId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return matches.length > 0 ? { ...matches[0] } : null;
  }

  async createClinicalReview(record: ClinicalReviewRecord & { entityId: string }): Promise<void> {
    const docId = record.id || `REV-${record.entityId}-${record.reviewerId}-${record.reviewedVersion}`;
    const existing = this.reviews.get(docId);
    if (existing) {
      if (JSON.stringify(existing) === JSON.stringify(record)) return;
      throw new Error(`RECORD_IMMUTABLE_CONFLICT: Review ${docId} already exists with different content`);
    }
    this.reviews.set(docId, { ...record, id: docId });
  }

  async listClinicalReviews(entityId: string, revisionId?: string): Promise<ClinicalReviewRecord[]> {
    return Array.from(this.reviews.values()).filter((r) => {
      if (r.entityId !== entityId) return false;
      if (revisionId && r.reviewedVersion !== revisionId) return false;
      return true;
    });
  }

  async createEvidenceProfile(profile: EvidenceProfile): Promise<void> {
    this.evidenceProfiles.set(profile.id, { ...profile });
  }

  async getEvidenceProfile(entityId: string, revisionId: string): Promise<EvidenceProfile | null> {
    const matches = Array.from(this.evidenceProfiles.values()).filter(
      (ep) => ep.entityId === entityId && ep.revisionId === revisionId
    );
    return matches.length > 0 ? { ...matches[0] } : null;
  }

  async createClinicalClaim(claim: ClinicalClaim): Promise<void> {
    this.claims.set(claim.id, { ...claim });
  }

  async listClinicalClaims(entityId: string, revisionId: string): Promise<ClinicalClaim[]> {
    return Array.from(this.claims.values()).filter(
      (c) => c.entityId === entityId && c.revisionId === revisionId
    );
  }

  async createAiIngestionApproval(approval: AiIngestionApproval): Promise<void> {
    const docId = `AI-APP-${approval.entityId}-${approval.revisionId}`;
    const existing = this.aiApprovals.get(docId);
    if (existing) {
      if (JSON.stringify(existing) === JSON.stringify(approval)) return;
      throw new Error(`RECORD_IMMUTABLE_CONFLICT: AI Approval ${docId} already exists with different content`);
    }
    this.aiApprovals.set(docId, { ...approval });
  }

  async getAiIngestionApproval(entityId: string, revisionId: string): Promise<AiIngestionApproval | null> {
    const docId = `AI-APP-${entityId}-${revisionId}`;
    const a = this.aiApprovals.get(docId);
    return a ? { ...a } : null;
  }

  async appendAuditEvent(event: GovernanceAuditEvent): Promise<void> {
    const entityId = event.entityId || 'GLOBAL';
    const head = this.auditChainHeads.get(entityId) || { sequenceNumber: 0, eventHash: 'GENESIS' };
    const nextSeq = head.sequenceNumber + 1;
    const updatedEvent: GovernanceAuditEvent = {
      ...event,
      sequenceNumber: nextSeq,
      previousEventHash: head.eventHash,
      id: event.id || `AUD-${entityId}-${nextSeq}-${Date.now()}`
    };

    const existing = this.auditEvents.get(updatedEvent.id);
    if (existing) {
      if (JSON.stringify(existing) === JSON.stringify(updatedEvent)) return;
      throw new Error(`RECORD_IMMUTABLE_CONFLICT: Audit event ${updatedEvent.id} already exists with different content`);
    }

    this.auditEvents.set(updatedEvent.id, updatedEvent);
    this.auditChainHeads.set(entityId, { sequenceNumber: nextSeq, eventHash: updatedEvent.eventHash || 'GENESIS' });
  }

  async listAuditEvents(entityId: string): Promise<GovernanceAuditEvent[]> {
    return Array.from(this.auditEvents.values())
      .filter((e) => e.entityId === entityId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async getEntityGovernanceState(entityId: string): Promise<EntityGovernanceState | null> {
    const s = this.entityStates.get(entityId);
    return s ? { ...s } : null;
  }

  async updateEntityGovernanceState(state: EntityGovernanceState): Promise<void> {
    const existing = this.entityStates.get(state.entityId) || ({} as EntityGovernanceState);
    this.entityStates.set(state.entityId, { ...existing, ...state });
  }

  async runInTransaction<T>(operation: (tx: GovernanceTransaction) => Promise<T>): Promise<T> {
    // Snapshot current state for memory transactional rollback
    const snapContributors = new Map(this.contributors);
    const snapQualifications = new Map(this.qualifications);
    const snapAuthorship = new Map(this.authorship);
    const snapRevisions = new Map(this.revisions);
    const snapReviews = new Map(this.reviews);
    const snapEvidenceProfiles = new Map(this.evidenceProfiles);
    const snapClaims = new Map(this.claims);
    const snapAiApprovals = new Map(this.aiApprovals);
    const snapAuditEvents = new Map(this.auditEvents);
    const snapEntityStates = new Map(this.entityStates);

    try {
      const txAdapter: GovernanceTransaction = {
        createContributor: async (r) => this.createContributor(r),
        createQualificationDecision: async (d) => this.createQualificationDecision(d),
        createAuthorshipRecord: async (r) => this.createAuthorshipRecord(r),
        createContentRevision: async (r) => this.createContentRevision(r),
        createClinicalReview: async (r) => this.createClinicalReview(r),
        createEvidenceProfile: async (p) => this.createEvidenceProfile(p),
        createClinicalClaim: async (c) => this.createClinicalClaim(c),
        createAiIngestionApproval: async (a) => this.createAiIngestionApproval(a),
        appendAuditEvent: async (e) => this.appendAuditEvent(e),
        updateEntityGovernanceState: async (s) => this.updateEntityGovernanceState(s),
        getContributor: async (id) => this.getContributor(id),
        getEntityGovernanceState: async (id) => this.getEntityGovernanceState(id),
        getContentRevision: async (id) => this.getContentRevision(id),
        getCurrentRevision: async (id) => this.getCurrentRevision(id),
        listQualificationDecisions: async (id) => this.getActiveQualificationDecisions(id),
        listAuthorshipRecords: async (id) => this.listAuthorshipRecords(id),
        listClinicalReviews: async (id, rev) => this.listClinicalReviews(id, rev),
      };

      return await operation(txAdapter);
    } catch (err) {
      // Rollback memory state
      this.contributors = snapContributors;
      this.qualifications = snapQualifications;
      this.authorship = snapAuthorship;
      this.revisions = snapRevisions;
      this.reviews = snapReviews;
      this.evidenceProfiles = snapEvidenceProfiles;
      this.claims = snapClaims;
      this.aiApprovals = snapAiApprovals;
      this.auditEvents = snapAuditEvents;
      this.entityStates = snapEntityStates;
      throw err;
    }
  }
}
