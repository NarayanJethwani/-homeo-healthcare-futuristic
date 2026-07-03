# Knowledge Model

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5.5 clinical knowledge curation architecture

## Purpose

The Clinical Repertory should become a lifelong, source-aware clinical knowledge system. The goal is not only to store rubrics and remedies, but to preserve where every assertion came from, how reliable it is, whether it has been clinically verified, and how conflicts between sources should be handled.

This is architecture only. No production integration, scoring changes, search changes, repertorization changes, AI changes, or database changes are included.

## Core Principle

Every clinical claim must be traceable.

Examples:

- A rubric exists because Kent includes it.
- A remedy appears under a rubric because Boericke grades it.
- A remedy relationship is strengthened by Dr. Jethwani verified cases.
- A source conflict exists because one author includes a remedy and another omits it.
- A custom annotation is clinician-authored and separately reviewable.

## Supported Source Families

The model must support:

- Kent Repertory
- Boger
- Boericke
- Allen
- Phatak
- Clarke
- Murphy
- Hering
- clinical observations
- Dr. Jethwani verified cases
- future evidence sources

## Knowledge Entity Types

### Source

A source represents a book, repertory, materia medica, clinical database, observation set, or verified case collection.

Recommended fields:

| Field | Purpose |
|---|---|
| `sourceId` | Stable internal source ID. |
| `sourceType` | `classical_repertory`, `materia_medica`, `clinical_observation`, `verified_case`, `research`, `future_source`. |
| `title` | Source title. |
| `author` | Author or institution. |
| `edition` | Edition, version, publication year, or dataset release. |
| `publisher` | Publisher or curator when available. |
| `language` | Source language. |
| `licenseStatus` | Copyright/license status. |
| `citationFormat` | Standard citation style for this source. |
| `notes` | Curatorial notes. |

### Rubric

A rubric is the canonical clinical concept used by the repertory.

Recommended fields:

| Field | Purpose |
|---|---|
| `rubricId` | Stable canonical rubric ID. |
| `canonicalPath` | Hierarchical path such as `Generalities > Food > Desire > Sweets`. |
| `canonicalTitle` | Preferred title. |
| `classicalWording` | Classical repertory wording when known. |
| `plainLanguageMeaning` | Clinical/patient-language meaning. |
| `category` | Clinical category. |
| `clinicalSystem` | Organ/system domain. |
| `synonyms` | Search synonyms. |
| `status` | `draft`, `active`, `reviewed`, `deprecated`, `merged`. |
| `verificationStatus` | `unverified`, `source_verified`, `clinician_verified`, `case_verified`, `conflict_review_required`. |
| `confidence` | Curated confidence score from 0 to 1. |
| `evidenceLevel` | Structured evidence level. |
| `sourceAssertions` | Source-specific statements for this rubric. |
| `customAnnotations` | Clinician notes and future curated comments. |
| `conflicts` | Known source conflicts. |
| `createdAt` | Curation timestamp. |
| `updatedAt` | Last curation timestamp. |

### Source Assertion

A source assertion records that a source says something about a rubric.

Recommended fields:

| Field | Purpose |
|---|---|
| `assertionId` | Stable assertion ID. |
| `sourceId` | Source making the assertion. |
| `rubricId` | Canonical rubric being described. |
| `sourceRubricPath` | Exact source path if different from canonical path. |
| `sourceRubricText` | Exact source wording. |
| `edition` | Source edition used. |
| `pageOrSection` | Page, chapter, section, or internal location. |
| `citation` | Human-readable citation. |
| `confidence` | Confidence in this source assertion. |
| `verificationStatus` | Review state for this assertion. |
| `notes` | Curator notes. |

### Remedy Relationship

A remedy relationship connects a remedy to a rubric with grade and provenance.

Recommended fields:

| Field | Purpose |
|---|---|
| `relationshipId` | Stable relationship ID. |
| `rubricId` | Canonical rubric ID. |
| `remedyId` | Canonical remedy ID. |
| `sourceRemedyId` | Remedy abbreviation/text exactly as the source used it. |
| `grade` | Normalized grade. |
| `sourceGrade` | Original source grade. |
| `polarity` | `positive`, `negative`, or `unknown`. |
| `isEliminating` | Whether the relationship is a caution/exclusion signal. |
| `provenance` | Source provenance records. |
| `confidence` | Relationship confidence. |
| `evidenceLevel` | Evidence level for this relationship. |
| `verificationStatus` | Review state. |
| `clinicalNotes` | Clinician-curated notes. |
| `contraindicationNotes` | When not to rely on this relationship. |
| `differentialNotes` | Differentiating notes versus similar remedies. |
| `customAnnotations` | Clinician annotations. |

### Provenance Record

Every remedy-rubric relationship can have multiple provenance records.

Recommended fields:

| Field | Purpose |
|---|---|
| `provenanceId` | Stable provenance ID. |
| `sourceId` | Source identifier. |
| `author` | Author name. |
| `edition` | Edition/version. |
| `citation` | Citation string. |
| `pageOrSection` | Location in source. |
| `sourceRubricText` | Source wording. |
| `sourceRemedyText` | Source remedy text. |
| `sourceGrade` | Original grade. |
| `interpretedGrade` | Normalized internal grade. |
| `confidence` | Confidence in interpretation. |
| `curatorId` | Curator who entered/reviewed it. |
| `reviewedBy` | Clinician reviewer. |
| `reviewedAt` | Review timestamp. |
| `notes` | Provenance notes. |

## Evidence Levels

Recommended evidence levels:

| Level | Meaning |
|---|---|
| `E0_unverified_import` | Imported or entered but not reviewed. |
| `E1_classical_source` | Present in a recognized classical source. |
| `E2_multiple_classical_sources` | Supported by two or more classical sources. |
| `E3_clinical_observation` | Supported by documented clinical observation. |
| `E4_verified_case` | Supported by Dr. Jethwani verified case evidence. |
| `E5_consensus_verified` | Multiple sources plus clinician consensus. |
| `E_conflict` | Meaningful source conflict exists. |

## Verification Status

Recommended statuses:

| Status | Meaning |
|---|---|
| `unverified` | Not reviewed. |
| `source_verified` | Source citation checked. |
| `clinician_verified` | Clinician has reviewed interpretation. |
| `case_verified` | Supported by verified clinical case. |
| `needs_review` | Needs human review. |
| `conflict_review_required` | Source conflict needs adjudication. |
| `deprecated` | Retained for history but not recommended for active use. |

## Custom Annotations

Annotations should be separate from source truth.

Recommended fields:

| Field | Purpose |
|---|---|
| `annotationId` | Stable annotation ID. |
| `targetType` | `rubric`, `remedy_relationship`, `source_assertion`, `conflict`. |
| `targetId` | Target entity ID. |
| `authorId` | Clinician/curator ID. |
| `noteType` | `clinical_note`, `differential`, `caution`, `teaching`, `curation`. |
| `text` | Annotation body. |
| `visibility` | `private`, `team`, `public_curated`. |
| `verificationStatus` | Annotation review state. |
| `createdAt` | Created timestamp. |
| `updatedAt` | Updated timestamp. |

## Conflict Model

Conflicts should be first-class records, not hidden.

Examples:

- Source A grades remedy as high; Source B grades it low.
- Source A includes remedy; Source B omits it.
- Classical wording maps ambiguously to multiple modern rubrics.
- A clinical observation contradicts classical expectation.
- Remedy relationship is positive in one context and eliminating in another.

Recommended fields:

| Field | Purpose |
|---|---|
| `conflictId` | Stable conflict ID. |
| `targetType` | `rubric`, `remedy_relationship`, `source_assertion`. |
| `targetId` | Entity with conflict. |
| `conflictType` | `grade_disagreement`, `rubric_mapping`, `presence_absence`, `polarity_conflict`, `clinical_contradiction`. |
| `sourceIds` | Sources involved. |
| `summary` | Human-readable summary. |
| `severity` | `low`, `medium`, `high`. |
| `status` | `open`, `under_review`, `resolved`, `accepted_divergence`. |
| `resolution` | Resolution notes. |
| `resolvedBy` | Reviewer ID. |
| `resolvedAt` | Timestamp. |

## Design Rule

Never overwrite source truth with canonical interpretation.

Keep both:

- original source assertion
- curated canonical interpretation

That separation is the foundation for a world-class, clinically honest repertory.
