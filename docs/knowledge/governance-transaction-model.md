# Knowledge Governance Transaction Model & Rollback Semantics

**Version**: 1.0.0  
**Effective Date**: 2026-07-25  

---

## 1. Overview

Review submissions and state transitions use real database transactions (`db.runTransaction` in Firestore or transactional snapshot rollback in memory). Application-level compensation is not used as a substitute for database transactions.

---

## 2. Review Submission Transaction Sequence

A clinical review submission atomically executes the following sequence inside `runInTransaction`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Firestore Transaction Begin                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Read current EntityGovernanceState (knowledgeGovernanceEntityState)│
│ 2. Read ContentRevision (knowledgeGovernanceRevisions)                 │
│ 3. Verify contentHash matches target revision                          │
│ 4. Read Reviewer Qualification Decision (knowledgeGovernanceQuals)   │
│ 5. Verify reviewer is active, qualified, and non-expired              │
│ 6. Read Authorship Records (knowledgeGovernanceAuthorship)             │
│ 7. Verify reviewer is NOT an author (Identity Isolation)              │
│ 8. Insert immutable ClinicalReviewRecord (knowledgeGovernanceReviews)  │
│ 9. Update EntityGovernanceState projection                              │
│ 10. Append GovernanceAuditEvent (knowledgeGovernanceAuditEvents)       │
├────────────────────────────────────────────────────────────────────────┤
│                      Firestore Transaction Commit                      │
└────────────────────────────────────────────────────────────────────────┘
```

If ANY step fails, the entire transaction aborts and 0 records commit.
