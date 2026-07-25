# Reviewer Qualification & Decision Verification Model

**Status**: Active — Phase 2.1 Architecture  
**Scope**: Clinical Reviewer Qualification & Scope Auditing  

---

## 1. Overview

Free-text credential strings (e.g. `"BHMS, MD"`) on contributor profiles are **NEVER** sufficient by themselves to confer clinical review eligibility.

Reviewers must hold an explicit, verified `ReviewerQualificationDecision` record.

---

## 2. Reviewer Qualification Decision Schema

```ts
interface ReviewerQualificationDecision {
  id: string;
  contributorId: ContributorId;
  reviewScopes: ReviewScope[];
  status: 'pending' | 'verified' | 'rejected' | 'suspended' | 'expired';
  verifiedBy: ContributorId;
  verifiedAt?: string;
  expiresAt?: string;
  verificationNotes?: string;
}
```

---

## 3. Supported Review Scopes

- `general-clinical`: Authorizes broad clinical content reviews.
- `disease-content`: Specific to disease pathology and diagnostic entries.
- `symptom-content`: Specific to symptom presentations and repertory mappings.
- `laboratory-interpretation`: Specific to diagnostic lab reference ranges.
- `medication-safety`: Specific to contraindications and drug interactions.
- `homeopathic-materia-medica`: Specific to traditional homeopathic proving text.
- `evidence-methodology`: Specific to evidence scoring and systematic reviews.
- `translation`: Specific to multilingual content localization.

---

## 4. Verification Enforcement Rules

`verifyReviewerQualificationScope(contributorId, requiredScope)` returns `isQualified: false` if:
1. No qualification decision record exists.
2. `status` is not `'verified'`.
3. `reviewScopes` does not contain the required scope or `'general-clinical'`.
4. `expiresAt` timestamp is in the past.
