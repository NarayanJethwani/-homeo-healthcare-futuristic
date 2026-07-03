# Kent-Level Knowledge Base Plan

Date: 2026-07-03  
Scope: Future large-scale repertory knowledge foundation

## Goal

Prepare Dr. Jethwani's Clinical Repertory for a Kent-level and larger repertory knowledge base while respecting copyright, provenance, and clinical verification.

## Source Policy

Do not import copyrighted commercial repertory databases unless legally usable data is provided.

Supported source categories:

- Kent
- Boericke
- Boger
- Boenninghausen
- Allen
- Clarke
- Hering
- Phatak
- Murphy
- Dr. Jethwani verified clinical additions

## Canonical Source Model

```ts
interface RepertorySource {
  id: string;
  name: string;
  author: string;
  edition?: string;
  publicationYear?: number;
  sourceType:
    | "classical_public_domain"
    | "licensed"
    | "clinician_verified"
    | "clinical_observation"
    | "imported_user_provided";
  copyrightStatus:
    | "public_domain"
    | "licensed"
    | "user_provided"
    | "unknown_do_not_import";
  citation?: string;
  notes?: string;
}
```

## Canonical Rubric Model

Every rubric should support:

```ts
interface KnowledgeRubric {
  id: string;
  canonicalTitle: string;
  rubricPath: string[];
  normalizedPath: string;
  sourceEntries: RubricSourceEntry[];
  verificationStatus:
    | "unverified"
    | "source_verified"
    | "clinician_reviewed"
    | "dr_jethwani_verified"
    | "deprecated"
    | "conflict_review";
  confidence: number;
  clinicalNotes?: string[];
  conflicts?: SourceConflict[];
  provenance: ProvenanceEntry[];
}
```

## Source Entry Model

```ts
interface RubricSourceEntry {
  sourceId: string;
  author: string;
  edition?: string;
  originalRubricText: string;
  originalPath?: string[];
  pageReference?: string;
  citation?: string;
  confidence: number;
  importedAt: string;
  verificationStatus: KnowledgeRubric["verificationStatus"];
}
```

## Remedy Relationship Model

Every rubric/remedy relationship should support:

```ts
interface RubricRemedyRelationship {
  rubricId: string;
  remedyId: string;
  remedyName?: string;
  grade: number;
  sourceGrade?: string | number;
  polarity: "positive" | "negative" | "contraindicated" | "unknown";
  confidence: number;
  verificationStatus:
    | "unverified"
    | "source_verified"
    | "clinician_reviewed"
    | "dr_jethwani_verified"
    | "conflict_review";
  sources: RemedySourceEvidence[];
  clinicalNotes?: string[];
  provenance: ProvenanceEntry[];
}
```

## Remedy Source Evidence

```ts
interface RemedySourceEvidence {
  sourceId: string;
  author: string;
  edition?: string;
  grade: number;
  originalGrade?: string | number;
  citation?: string;
  pageReference?: string;
  confidence: number;
}
```

## Conflict Handling

Conflicts to track:

- Same rubric path with different remedy grades.
- Same remedy present in one source and absent in another.
- Different rubric wording for same clinical idea.
- Negative/contraindicated semantics.
- Duplicate rubric paths.
- Source quality differences.

Conflict model:

```ts
interface SourceConflict {
  id: string;
  type:
    | "grade_conflict"
    | "rubric_wording_conflict"
    | "source_absence"
    | "polarity_conflict"
    | "duplicate_path"
    | "clinical_disagreement";
  involvedSourceIds: string[];
  description: string;
  resolutionStatus:
    | "unresolved"
    | "accepted_primary_source"
    | "merged"
    | "kept_separate"
    | "dr_jethwani_resolved";
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}
```

## Provenance Model

```ts
interface ProvenanceEntry {
  sourceId: string;
  action:
    | "imported"
    | "normalized"
    | "merged"
    | "verified"
    | "corrected"
    | "deprecated";
  actor?: string;
  timestamp: string;
  notes?: string;
}
```

## Scaling Approach

For large repertory data:

- Store canonical rubrics separately from source entries.
- Store remedy relationships as separate records.
- Index normalized path, tokens, source, remedy, grade, verification status.
- Build search indexes offline or in controlled server jobs.
- Avoid loading full repertory into the browser.

Recommended future collections:

```text
repertorySources
knowledgeRubrics
rubricSourceEntries
rubricRemedyRelationships
rubricConflicts
v2ClinicalFeedback
```

Do not create these collections until approved.

## Search Index Plan

Indexes should support:

- title tokens
- rubric path tokens
- synonym tokens
- source filter
- author filter
- remedy filter
- grade filter
- verification status filter
- clinical system/category

## Verification Workflow

1. Import legal/source-approved data.
2. Normalize rubric path.
3. Match to existing canonical rubric.
4. Preserve original text and citation.
5. Detect conflicts.
6. Queue conflict for clinician review.
7. Mark Dr. Jethwani verified when reviewed.
8. Make verified data eligible for V2 Live.

## Copyright Safety

Never import:

- RadarOpus proprietary data.
- Complete Dynamics proprietary data.
- MacRepertory proprietary data.
- Any commercial repertory export without legal permission.

Allowed only when legally supplied:

- Public-domain texts.
- User-provided licensed data.
- Dr. Jethwani original clinical additions.
- Explicitly licensed repertory content.

## Exact Files for Future Work

| File | Purpose | Risk |
|---|---|---|
| `src/features/repertory/knowledgeBase/types.ts` | Source-aware knowledge model. | Low |
| `src/features/repertory/knowledgeBase/sourceRegistry.ts` | Source metadata and legal status. | Low |
| `src/features/repertory/knowledgeBase/provenance.ts` | Provenance helpers. | Low |
| `src/features/repertory/knowledgeBase/conflicts.ts` | Conflict detection utilities. | Medium |
| `src/features/repertory/knowledgeBase/importValidator.ts` | Validate legal/source fields before import. | Medium |
| `src/features/repertory/__tests__/knowledgeBase.test.ts` | Tests for source/provenance/conflicts. | Low |

## Phase Recommendation

Do not combine Kent-level database expansion with V2 Live deployment.

Recommended order:

1. Deploy V2 Live using current available data.
2. Collect clinical feedback.
3. Build source-aware knowledge model.
4. Import only legally usable source data.
5. Validate and verify before exposing in V2 Live.
