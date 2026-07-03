# Verification Workflow

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5.5 clinical knowledge curation architecture

## Purpose

The knowledge system needs a clinician-centered verification workflow so curated repertory knowledge can mature safely over years. The workflow should protect source fidelity, clinical caution, reviewer accountability, and conflict transparency.

## Workflow Stages

### 1. Source Registration

Before importing or entering knowledge, register the source.

Required checks:

- source title
- author
- edition
- publication year if known
- source type
- license/copyright status
- citation format
- curation notes

Output:

- `sourceId`
- source status: `registered`

### 2. Raw Assertion Capture

Capture the source statement without interpretation.

Examples:

- exact rubric path
- exact rubric wording
- exact remedy abbreviation
- exact grade
- exact page or section
- exact citation

Output:

- source assertion status: `captured`

### 3. Canonical Mapping

Map source assertion to canonical repertory concepts.

Tasks:

- map source rubric to canonical rubric
- map source remedy text to canonical remedy
- map source grade to normalized grade
- preserve original source grade
- preserve source path
- preserve source wording

Output:

- source assertion status: `mapped`

### 4. Automated Curation Checks

These are non-AI deterministic checks.

Checks:

- missing citation
- missing edition
- unknown remedy abbreviation
- duplicate assertion
- grade out of range
- conflicting source grade
- conflicting polarity
- ambiguous rubric mapping

Output:

- status: `needs_review` or `ready_for_clinician_review`

### 5. Clinician Review

A clinician reviews the mapped knowledge.

Review questions:

- Is the source citation correct?
- Is the rubric mapping clinically correct?
- Is the remedy mapping correct?
- Is the grade interpretation correct?
- Are notes needed?
- Is there a conflict?
- Should this be active, provisional, or deprecated?

Possible decisions:

- approve
- request correction
- mark conflict
- mark deprecated
- merge duplicate
- split ambiguous rubric

Output:

- verification status updated
- reviewer ID
- review timestamp
- review notes

### 6. Conflict Adjudication

Conflicts require explicit resolution.

Conflict review should document:

- sources involved
- disagreement type
- clinical importance
- decision
- rationale
- whether divergence remains visible

Possible outcomes:

- `resolved_canonicalized`
- `accepted_divergence`
- `deprecated_relationship`
- `needs_more_evidence`

### 7. Case Verification

Dr. Jethwani verified cases can strengthen evidence.

Case verification should include:

- privacy-safe case summary
- selected rubrics
- remedy
- follow-up outcome
- quality of case evidence
- reviewer notes
- confidence impact

Output:

- evidence level may increase
- confidence may increase
- relationship may become `case_verified`

### 8. Locking Reviewed Knowledge

High-quality reviewed knowledge can be locked.

Locked knowledge means:

- source assertion cannot be silently changed
- edits require new version
- reviewer trail is preserved
- previous versions remain auditable

## Verification Roles

Recommended roles:

| Role | Responsibility |
|---|---|
| `curator` | Enters and maps source data. |
| `clinician_reviewer` | Reviews clinical correctness. |
| `senior_reviewer` | Resolves high-severity conflicts. |
| `case_verifier` | Reviews verified case evidence. |
| `admin` | Manages source registry and permissions. |

## Review Queues

Recommended queues:

- uncited assertions
- imported but unmapped
- mapped but unreviewed
- conflict review required
- low-confidence high-use rubrics
- verified case pending review
- deprecated candidate review
- duplicate rubric review

## Audit Trail

Every curation action should record:

- actor ID
- action type
- target entity
- previous value
- new value
- timestamp
- reason
- review note

Actions:

- source registered
- assertion captured
- assertion mapped
- citation corrected
- grade normalized
- conflict opened
- conflict resolved
- clinician approved
- case verified
- annotation added
- entity deprecated
- entity locked

## Verification Status Lifecycle

Recommended lifecycle:

`unverified`

→ `source_verified`

→ `clinician_verified`

→ `case_verified`

→ `consensus_verified`

Special states:

- `needs_review`
- `conflict_review_required`
- `deprecated`
- `locked`

## Clinical Safety Requirements

The verification workflow must enforce:

- no uncited source assertions marked as verified
- no conflict hidden from clinicians
- no clinical observation treated as universal truth
- no verified case displayed with patient-identifying information
- no automatic prescribing claims
- no replacement of clinician judgment

## Future Tooling

Future UI can be built around:

- source assertion review screen
- conflict review screen
- case verification screen
- citation completeness dashboard
- rubric confidence dashboard
- curator activity log
- source comparison viewer

Those tools should be implemented only after separate approval.
