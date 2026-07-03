# Source Architecture

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 5.5 clinical knowledge curation architecture

## Purpose

The repertory must preserve the identity and authority of each source. Kent, Boger, Boericke, Allen, Phatak, Clarke, Murphy, Hering, clinical observations, and Dr. Jethwani verified cases should not be collapsed into anonymous data.

The architecture should make the system answer:

- Where did this rubric come from?
- Which edition?
- Which author?
- Which page or section?
- Was the source checked?
- Who verified the interpretation?
- Are there conflicting sources?
- Is this classical, clinical, or case-verified evidence?

## Source Registry

All sources should be registered before their assertions are curated.

Recommended source registry fields:

| Field | Purpose |
|---|---|
| `sourceId` | Stable ID such as `kent-repertory-6th-edition`. |
| `canonicalName` | Preferred display name. |
| `shortName` | Short label such as `Kent`, `Boger`, `Boericke`. |
| `sourceFamily` | Family grouping. |
| `sourceType` | `classical_repertory`, `materia_medica`, `clinical_observation`, `verified_case`, `research`, `custom`. |
| `author` | Author or curator. |
| `edition` | Edition/version/year. |
| `publicationYear` | Year if known. |
| `publisher` | Publisher if known. |
| `language` | Source language. |
| `licenseStatus` | Copyright/license status. |
| `curationStatus` | `not_started`, `imported`, `mapped`, `reviewed`, `locked`. |
| `reliabilityProfile` | Source reliability metadata. |
| `notes` | Curatorial notes. |

## Source Families

### Classical Repertory Sources

Examples:

- Kent Repertory
- Boger
- Phatak
- Murphy

Primary curation target:

- rubric paths
- remedy grades
- source wording
- source hierarchy
- page/section citation

### Materia Medica Sources

Examples:

- Boericke
- Allen
- Clarke
- Hering

Primary curation target:

- remedy keynote language
- clinical confirmations
- differential notes
- modalities
- source references supporting remedy-rubric relationships

### Clinical Observation Sources

Examples:

- outpatient case observation
- repeated clinical pattern
- follow-up response pattern
- prescribing caution

Primary curation target:

- real-world clinical support
- confidence adjustment
- differential note
- caution note

### Dr. Jethwani Verified Cases

Primary curation target:

- verified case support
- cured/improved/neutral/worsened outcome
- rubric selection rationale
- remedy confirmation
- follow-up evidence
- clinician verification status

### Future Evidence Sources

The system should allow future sources without schema rewrites:

- structured research
- external databases
- clinical registries
- peer-reviewed repertory updates
- team-curated institutional knowledge

## Source Assertion Pipeline

Recommended pipeline:

1. Register source.
2. Import or enter source assertion.
3. Preserve exact source wording.
4. Map to canonical rubric.
5. Map remedies to canonical remedy IDs.
6. Preserve original remedy text and source grade.
7. Normalize grade separately.
8. Attach citation.
9. Flag conflicts.
10. Send for clinician verification.
11. Lock verified assertion version.

## Source Assertion Types

| Assertion type | Meaning |
|---|---|
| `rubric_exists` | Source contains the rubric. |
| `rubric_wording` | Source uses a specific wording. |
| `remedy_in_rubric` | Source places remedy under rubric. |
| `remedy_grade` | Source assigns grade/intensity. |
| `clinical_confirmation` | Clinical observation supports relationship. |
| `clinical_caution` | Clinical observation warns against relationship. |
| `rubric_mapping` | Source rubric maps to canonical rubric. |
| `cross_reference` | Source links related rubrics or remedies. |

## Reliability Profile

Each source can have a reliability profile.

Recommended fields:

| Field | Purpose |
|---|---|
| `historicalAuthority` | Classical authority rating. |
| `editionQuality` | Confidence in edition accuracy. |
| `mappingConfidence` | Confidence when mapping to canonical model. |
| `clinicalSpecificity` | How clinically specific the source tends to be. |
| `gradeReliability` | Reliability of remedy grades. |
| `requiresReview` | Whether all imports need manual review. |

## Versioning

Source-derived knowledge should be versioned.

Recommended version model:

- source registry version
- import batch version
- assertion version
- curation review version
- conflict resolution version

No source assertion should be silently overwritten. Corrections should create a new version or audit record.

## Provenance In Remedy Relationships

A canonical remedy relationship can have many provenance records.

Example:

`Rubric: Generalities > Food > Desire > Sweets`  
`Remedy: Sulphur`

Possible provenance:

- Kent includes Sulphur under the rubric with grade X.
- Phatak confirms the relationship.
- Boericke describes related craving keynote.
- Dr. Jethwani verified case supports clinical use.

The system should show each source separately, then provide a curated aggregate confidence.

## Aggregate Confidence

Aggregate confidence should not erase source differences.

Recommended aggregate inputs:

- number of independent sources
- quality of source
- agreement between sources
- grade consistency
- clinician verification
- verified case support
- unresolved conflicts

## Conflict-Aware Source View

For every rubric and remedy relationship, the source view should show:

- agreeing sources
- disagreeing sources
- missing sources
- grade differences
- polarity differences
- verification status
- reviewer decision

## Architecture Rule

Source architecture must preserve both:

1. source fidelity
2. curated clinical usability

The software should never pretend that all sources agree when they do not.
