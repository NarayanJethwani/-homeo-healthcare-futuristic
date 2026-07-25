# Independent Clinical Review Specification

**Status**: Active — Phase 2 Governance Architecture  
**Scope**: Clinical Knowledge Platform  

---

## 1. Overview

An entry cannot achieve clinical publication status or enter AI grounding without a verified **Independent Clinical Review Record**.

Historical self-reviewed entries (where the author and reviewer were identical) are classified as:
`self-reviewed — independent clinical review pending`.

---

## 2. Review Record Schema

```ts
interface ClinicalReviewRecord {
  reviewerId: ContributorId;
  reviewType: 'clinical' | 'evidence' | 'safety';
  decision: 'approved' | 'changes-requested' | 'rejected';
  reviewedVersion: string; // Revision content hash or version ID
  reviewedAt: string;
  declarationOfIndependence: boolean;
  conflictsDeclared?: string[];
  notes?: string;
}
```

---

## 3. Strict Independent Review Rules

To satisfy independent clinical review:

1. **Immutable Reviewer ID**: Must be present.
2. **Identity Isolation**: `reviewerId` must be strictly different from ALL `authorId`s associated with the entity (`reviewerId !== authorId`).
3. **Declaration of Independence**: `declarationOfIndependence` must be explicitly set to `true`.
4. **Revision Matching**: `reviewedVersion` must match the SHA-256 content hash (`contentHash`) of the current entity revision.
5. **Approved Decision**: `decision` must equal `'approved'`.
6. **Revision Invalidation**: Any material edit to entity content post-dating the review timestamp invalidates the review record and returns the entity to `review-required`.
