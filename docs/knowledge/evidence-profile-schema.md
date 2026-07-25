# Structured Evidence Profile Schema & Governance

**Status**: Active — Phase 2 Governance Architecture  
**Scope**: Clinical Knowledge Platform  

---

## 1. Overview

Content completeness scores (e.g. overview character counts) do not constitute a clinical evidence profile. Every governed clinical entity requires an explicit, structured `EvidenceProfile` record.

---

## 2. Evidence Profile Schema

```ts
interface EvidenceProfile {
  id: string;
  entityId: string;
  revisionId: string;
  evidenceQuestion?: string;
  evidenceLevel: EvidenceLevel;
  sourceIds: string[];
  guidelineSources?: {
    citationId: string;
    guidelineVersion?: string;
    accessedAt?: string;
  }[];
  evidenceSummary: string;
  limitations: string[];
  conflictingEvidence?: string[];
  conventionalCareContext?: string;
  complementaryCareBoundary?: string;
  reviewedBy: ContributorId[];
  reviewedAt?: string;
  status: 'draft' | 'review-required' | 'approved' | 'rejected';
}
```

---

## 3. Evidence Levels

- `Level-A`: Meta-analyses, systematic reviews, clinical practice guidelines.
- `Level-B`: Randomized controlled trials (RCTs), prospective cohort studies.
- `Level-C`: Observational studies, case series, expert consensus guidelines.
- `Traditional-Literature`: Classical Materia Medica and Repertory literature.

---

## 4. Governance Enforcement

- Draft evidence profiles carry `status: 'draft'` and fail clinical publication evaluation.
- To pass governance, an evidence profile must be marked `status: 'approved'` by a qualified evidence reviewer (`reviewedBy.length >= 1`) for the active content revision hash.
