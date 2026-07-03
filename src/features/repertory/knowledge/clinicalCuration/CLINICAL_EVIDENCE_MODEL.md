# Clinical Evidence Model

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5.5 clinical knowledge curation architecture

## Purpose

The repertory should distinguish source presence from clinical evidence. A remedy can appear in a classical source, be confirmed by materia medica, supported by clinical observation, and verified by a real case. These are related but not identical forms of evidence.

## Evidence Dimensions

Every rubric and remedy relationship should support evidence across these dimensions:

| Dimension | Meaning |
|---|---|
| `sourceAuthority` | Strength of source tradition or authority. |
| `sourceAgreement` | Agreement across multiple sources. |
| `clinicalSpecificity` | How specifically the evidence matches the rubric. |
| `caseVerification` | Whether verified cases support the relationship. |
| `gradeConsistency` | Whether sources agree on grade/intensity. |
| `polarityConsistency` | Whether sources agree the relationship is positive or eliminating. |
| `recency` | Whether recent clinical observations support or challenge it. |
| `reviewQuality` | Whether expert clinician review is complete. |

## Evidence Levels

Recommended structured levels:

| Level | Label | Meaning |
|---|---|---|
| `E0` | Unverified import | Data exists but has not been checked. |
| `E1` | Single source | One recognized source supports it. |
| `E2` | Multiple sources | Two or more recognized sources support it. |
| `E3` | Materia medica supported | Repertory entry is supported by materia medica/keynote evidence. |
| `E4` | Clinical observation supported | Documented clinical observations support it. |
| `E5` | Verified case supported | Dr. Jethwani verified cases support it. |
| `E6` | Consensus verified | Multiple source types and clinician review agree. |
| `EC` | Conflict present | Evidence exists but meaningful conflict is unresolved. |

## Confidence Score

Confidence should be computed or curated separately from grade.

Grade answers:

`How strongly does this remedy appear in this rubric?`

Confidence answers:

`How reliable is this knowledge claim?`

Recommended confidence bands:

| Range | Meaning |
|---|---|
| `0.00 - 0.24` | Very low confidence. |
| `0.25 - 0.49` | Low confidence. |
| `0.50 - 0.74` | Moderate confidence. |
| `0.75 - 0.89` | High confidence. |
| `0.90 - 1.00` | Very high confidence. |

## Remedy Relationship Evidence

Every remedy-rubric relationship should support:

- source provenance
- source grade
- normalized grade
- evidence level
- confidence
- verification status
- contradiction status
- clinical notes
- differential notes
- caution notes
- verified case links

## Clinical Observation Evidence

Clinical observation records should be structured and conservative.

Recommended fields:

| Field | Purpose |
|---|---|
| `observationId` | Stable observation ID. |
| `rubricId` | Related rubric. |
| `remedyId` | Related remedy. |
| `observationType` | `confirmation`, `differential`, `caution`, `non_response`, `aggravation`, `follow_up`. |
| `caseContext` | Brief clinical context. |
| `outcome` | `improved`, `unchanged`, `worsened`, `unclear`. |
| `potencyContext` | Optional potency context. |
| `followUpDuration` | Follow-up duration. |
| `confidence` | Curator confidence. |
| `verifiedBy` | Clinician reviewer. |
| `verificationStatus` | Review state. |
| `notes` | Clinical notes. |

## Dr. Jethwani Verified Case Evidence

Verified cases should be stronger than casual observations but still transparent.

Recommended fields:

| Field | Purpose |
|---|---|
| `verifiedCaseId` | Stable case evidence ID. |
| `caseDate` | Date or approximate period. |
| `rubricIds` | Rubrics used. |
| `remedyId` | Remedy evaluated. |
| `outcome` | Clinical outcome. |
| `followUpEvidence` | Follow-up support. |
| `caseQuality` | `low`, `moderate`, `high`. |
| `verificationNotes` | Why case supports relationship. |
| `verifiedBy` | Reviewer. |
| `verifiedAt` | Timestamp. |
| `privacyStatus` | Ensures patient privacy. |

## Conflicting Evidence

Conflicts should lower confidence until reviewed.

Conflict examples:

- grade disagreement
- source omission
- opposing clinical observation
- different rubric interpretation
- positive versus eliminating polarity

Conflict states:

| State | Meaning |
|---|---|
| `open` | Conflict identified but not reviewed. |
| `under_review` | Clinician is reviewing. |
| `accepted_divergence` | Difference is real and should remain visible. |
| `resolved_canonicalized` | Canonical interpretation chosen. |
| `deprecated_relationship` | Relationship is no longer recommended. |

## Evidence Aggregation

Aggregate evidence should be transparent.

A remedy relationship can display:

- source count
- source agreement
- highest evidence level
- unresolved conflict count
- clinician verification status
- verified case count
- aggregate confidence

## Safety Rule

Evidence supports clinician review. It must not be treated as automatic prescribing authority.

The model should always keep:

- source citation
- evidence type
- verification state
- clinical caution
- reviewer trail
